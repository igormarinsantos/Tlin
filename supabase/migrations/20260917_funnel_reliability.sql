-- Phase 3. Apply before deploying the corresponding application version.
begin;

create table public.funnel_operations (
  operation_key text primary key,
  owner uuid not null,
  state text not null default 'pending' check (state in ('pending', 'done')),
  result jsonb,
  created_at timestamptz not null default now(),
  completed_at timestamptz
);
alter table public.funnel_operations enable row level security;
alter table public.deskcomm_status_events enable row level security;

create table public.funnel_stage_mapping (
  stage_id text primary key,
  label text not null,
  qualified boolean, -- NULL preserves the latest human qualification decision.
  attended boolean not null default false,
  won boolean not null default false
);
alter table public.funnel_stage_mapping enable row level security;

alter table public.lead_form_submissions
  add column if not exists notification_result jsonb not null default '{}'::jsonb,
  add column if not exists contact_key text,
  add column if not exists captured_at timestamptz,
  add column if not exists booked_at timestamptz,
  add column if not exists booking_key text,
  add column if not exists booking_starts_at timestamptz,
  add column if not exists qualified boolean,
  add column if not exists qualified_at timestamptz,
  add column if not exists attended_at timestamptz,
  add column if not exists won_at timestamptz;

create function public.claim_funnel_operation(p_key text, p_owner uuid)
returns jsonb language plpgsql security invoker set search_path = public as $$
declare op public.funnel_operations;
begin
  insert into public.funnel_operations(operation_key, owner) values (p_key, p_owner)
    on conflict do nothing;
  select * into op from public.funnel_operations where operation_key = p_key;
  if op.owner = p_owner and op.state = 'pending' then return jsonb_build_object('state', 'claimed'); end if;
  return jsonb_build_object('state', op.state, 'result', op.result);
end $$;

create function public.finish_funnel_operation(p_key text, p_owner uuid, p_result jsonb, p_retryable boolean default false)
returns boolean language plpgsql security invoker set search_path = public as $$
begin
  if p_retryable then
    delete from public.funnel_operations where operation_key = p_key and owner = p_owner and state = 'pending';
  else
    update public.funnel_operations set state = 'done', result = p_result, completed_at = now()
      where operation_key = p_key and owner = p_owner and state = 'pending';
  end if;
  if not found then raise exception 'Operation ownership mismatch'; end if;
  return true;
end $$;

-- Projection can be run again when a webhook arrives before its correlated lead.
create function public.reconcile_funnel_lead(p_capture_id text)
returns boolean language plpgsql security invoker set search_path = public as $$
declare latest public.deskcomm_status_events; decision record;
begin
  perform 1 from public.lead_form_submissions where lead_capture_id = p_capture_id for update;
  if not found then return false; end if;
  select * into latest from public.deskcomm_status_events where lead_capture_id = p_capture_id
    order by occurred_at desc, external_event_id desc limit 1;
  if not found then return false; end if;
  select m.qualified, e.occurred_at into decision from public.deskcomm_status_events e
    join public.funnel_stage_mapping m on m.stage_id = e.status
    where e.lead_capture_id = p_capture_id and m.qualified is not null
    order by e.occurred_at desc, e.external_event_id desc limit 1;
  update public.lead_form_submissions set
    crm_status = latest.status, crm_status_at = latest.occurred_at,
    deskcomm_lead_id = coalesce(latest.deskcomm_lead_id, deskcomm_lead_id),
    deskcomm_contact_id = coalesce(latest.deskcomm_contact_id, deskcomm_contact_id),
    qualified = decision.qualified, qualified_at = decision.occurred_at,
    attended_at = (select min(e.occurred_at) from public.deskcomm_status_events e join public.funnel_stage_mapping m on m.stage_id = e.status where e.lead_capture_id = p_capture_id and m.attended),
    won_at = (select min(e.occurred_at) from public.deskcomm_status_events e join public.funnel_stage_mapping m on m.stage_id = e.status where e.lead_capture_id = p_capture_id and m.won)
  where lead_capture_id = p_capture_id;
  return true;
end $$;

create function public.record_funnel_lead(p_lead jsonb)
returns jsonb language plpgsql security invoker set search_path = public as $$
declare saved public.lead_form_submissions;
begin
  if nullif(p_lead->>'lead_capture_id', '') is null then raise exception 'Missing lead identity'; end if;
  insert into public.lead_form_submissions as current (
    lead_capture_id, deskcomm_lead_id, deskcomm_contact_id, company_name, phone, country_code, email, lead_volume, team_size, plan_name,
    lead_score, lead_quality, utm, payload, contact_key, captured_at, booked_at, booking_key, booking_starts_at
  ) values (
    p_lead->>'lead_capture_id', p_lead->>'deskcomm_lead_id', p_lead->>'deskcomm_contact_id', p_lead->>'company_name', p_lead->>'phone', p_lead->>'country_code', p_lead->>'email',
    p_lead->>'lead_volume', p_lead->>'team_size', p_lead->>'plan_name', (p_lead->>'lead_score')::integer,
    p_lead->>'lead_quality', coalesce(p_lead->'utm','{}'), coalesce(p_lead->'payload','{}'), p_lead->>'contact_key',
    (p_lead->>'captured_at')::timestamptz, (p_lead->>'booked_at')::timestamptz, p_lead->>'booking_key', (p_lead->>'booking_starts_at')::timestamptz
  ) on conflict (lead_capture_id) where lead_capture_id is not null do update set
    deskcomm_lead_id = coalesce(excluded.deskcomm_lead_id,current.deskcomm_lead_id),
    deskcomm_contact_id = coalesce(excluded.deskcomm_contact_id,current.deskcomm_contact_id),
    company_name = coalesce(excluded.company_name, current.company_name), phone = coalesce(excluded.phone,current.phone),
    country_code = coalesce(excluded.country_code,current.country_code), email = coalesce(excluded.email,current.email),
    lead_volume = coalesce(excluded.lead_volume,current.lead_volume), team_size = coalesce(excluded.team_size,current.team_size),
    plan_name = coalesce(excluded.plan_name,current.plan_name), lead_score = coalesce(excluded.lead_score,current.lead_score),
    lead_quality = coalesce(excluded.lead_quality,current.lead_quality),
    utm = current.utm || (select coalesce(jsonb_object_agg(key,value),'{}') from jsonb_each(excluded.utm) where key not like 'first_%' or not current.utm ? key),
    payload = current.payload || excluded.payload, contact_key = coalesce(excluded.contact_key,current.contact_key),
    captured_at = coalesce(current.captured_at, excluded.captured_at),
    booked_at = coalesce(current.booked_at, excluded.booked_at), booking_key = coalesce(current.booking_key,excluded.booking_key),
    booking_starts_at = coalesce(current.booking_starts_at,excluded.booking_starts_at)
  returning * into saved;
  -- Recover events received before the capture mirror existed; require the exact CRM lead.
  update public.deskcomm_status_events set lead_capture_id = saved.lead_capture_id
    where lead_capture_id is null and deskcomm_lead_id = saved.deskcomm_lead_id
    and (select count(*) from public.lead_form_submissions where deskcomm_lead_id = saved.deskcomm_lead_id) = 1;
  perform public.reconcile_funnel_lead(saved.lead_capture_id);
  return to_jsonb(saved);
end $$;

create function public.apply_funnel_crm_event(p_event jsonb)
returns jsonb language plpgsql security invoker set search_path = public as $$
declare capture_id text; duplicate boolean; prior_payload jsonb; match_count integer;
begin
  -- Serialize receipt of the same external event to detect mismatched replays.
  perform pg_advisory_xact_lock(hashtextextended(p_event->>'eventId',0));
  select payload into prior_payload from public.deskcomm_status_events where external_event_id = p_event->>'eventId';
  duplicate := found;
  if duplicate and prior_payload <> p_event->'payload' then raise exception 'Event identity conflict'; end if;
  capture_id := nullif(p_event->>'leadCaptureId','');
  if capture_id is null then
    select count(*), min(lead_capture_id) into match_count, capture_id from public.lead_form_submissions
    where (p_event->>'leadId' is not null and deskcomm_lead_id = p_event->>'leadId')
       or (p_event->>'contactId' is not null and deskcomm_contact_id = p_event->>'contactId');
    if match_count <> 1 then capture_id := null; end if;
  end if;
  insert into public.deskcomm_status_events(external_event_id,lead_capture_id,deskcomm_lead_id,deskcomm_contact_id,status,occurred_at,payload)
    values (p_event->>'eventId', capture_id, p_event->>'leadId', p_event->>'contactId', p_event->>'status', (p_event->>'occurredAt')::timestamptz, p_event->'payload')
    on conflict (external_event_id) do update set lead_capture_id = coalesce(deskcomm_status_events.lead_capture_id,excluded.lead_capture_id)
    returning lead_capture_id into capture_id;
  return jsonb_build_object('saved',true,'duplicate',duplicate,'projected',public.reconcile_funnel_lead(capture_id));
end $$;

-- Cohorts use acquisition date, not the date of the latest pipeline movement.
create view public.funnel_report with (security_invoker = true) as
with bookings as (
  select distinct on (booking_key) id from public.lead_form_submissions
  where booked_at is not null and booking_key is not null order by booking_key, booked_at, created_at, id
)
select date_trunc('day',l.created_at at time zone 'America/Sao_Paulo')::date as cohort_date,
  coalesce(nullif(l.utm->>'last_utm_source',''),'direct') as source,
  coalesce(nullif(l.utm->>'last_utm_campaign',''),'(not set)') as campaign,
  count(*) filter (where l.captured_at is not null) as leads,
  count(distinct l.contact_key) filter (where l.captured_at is not null) as contacts,
  count(*) filter (where b.id is not null) as demos,
  count(*) filter (where b.id is not null and l.qualified is true) as qualified_demos,
  count(*) filter (where b.id is not null and l.attended_at is not null) as attended_demos,
  count(*) filter (where l.won_at is not null) as won,
  count(*) filter (where l.captured_at is not null and l.qualified is null) as awaiting_qualification
from public.lead_form_submissions l left join bookings b on b.id = l.id
where l.lead_capture_id is not null group by 1,2,3;

revoke all on public.funnel_operations, public.funnel_stage_mapping, public.deskcomm_status_events, public.funnel_report from anon, authenticated;
grant select,insert,update,delete on public.funnel_operations, public.funnel_stage_mapping, public.deskcomm_status_events, public.lead_form_submissions to service_role;
grant select on public.funnel_report to service_role;
revoke all on function public.claim_funnel_operation(text,uuid), public.finish_funnel_operation(text,uuid,jsonb,boolean), public.reconcile_funnel_lead(text), public.record_funnel_lead(jsonb), public.apply_funnel_crm_event(jsonb) from public;
grant execute on function public.claim_funnel_operation(text,uuid), public.finish_funnel_operation(text,uuid,jsonb,boolean), public.reconcile_funnel_lead(text), public.record_funnel_lead(jsonb), public.apply_funnel_crm_event(jsonb) to service_role;
create function public.read_funnel_report(p_from date, p_to date)
returns jsonb language sql stable security invoker set search_path = public as $$
  select jsonb_build_object(
    'campaigns', coalesce((select jsonb_agg(row_to_json(t)) from (
      select source,campaign,sum(leads) as leads,sum(demos) as demos,sum(qualified_demos) as qualified_demos,
        sum(attended_demos) as attended_demos,sum(won) as won,sum(awaiting_qualification) as awaiting_qualification
      from public.funnel_report where cohort_date between p_from and p_to group by source,campaign order by sum(leads) desc,source,campaign
    ) t),'[]'),
    'pending_operations',(select count(*) from public.funnel_operations where state='pending'),
    'unmatched_events',(select count(*) from public.deskcomm_status_events e where not exists(select 1 from public.lead_form_submissions l where l.lead_capture_id=e.lead_capture_id)),
    'mapped_stages',(select count(*) from public.funnel_stage_mapping)
  )
$$;
revoke all on function public.read_funnel_report(date,date) from public;
grant execute on function public.read_funnel_report(date,date) to service_role;
commit;
