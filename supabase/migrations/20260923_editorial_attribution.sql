-- Phase 6. Persist future editorial attribution on the existing funnel lead.
-- Historical rows are deliberately left untouched because no reliable source exists.
begin;

create or replace function public.record_funnel_lead(p_lead jsonb)
returns jsonb language plpgsql security invoker set search_path = public as $$
declare
  saved public.lead_form_submissions;
  incoming_utm jsonb;
begin
  if nullif(p_lead->>'lead_capture_id', '') is null then raise exception 'Missing lead identity'; end if;

  select coalesce(jsonb_object_agg(key, value), '{}'::jsonb)
    into incoming_utm
    from jsonb_each(
      case when jsonb_typeof(p_lead->'utm') = 'object' then p_lead->'utm' else '{}'::jsonb end
    )
    where jsonb_typeof(value) = 'string'
      and length(value #>> '{}') <= case
        when key ~ '(landing_page|current_page|referrer)$' then 2048
        else 200
      end
      and (value #>> '{}') !~* '@|[+]?[0-9][0-9 ().-]{8,}[0-9]'
      and (
        key ~ '^(first_|last_)?(utm_(source|medium|campaign|term|content)|landing_page|current_page|referrer|referrer_host|gclid|fbclid)$'
        or (key ~ '^(first_|last_)article_slug$' and value #>> '{}' ~ '^[a-z0-9]+(-[a-z0-9]+)*$')
        or (key ~ '^(first_|last_)content_cluster$' and value #>> '{}' ~ '^cluster:[a-z0-9]+(-[a-z0-9]+)*$')
        or (key ~ '^(first_|last_)content_intent$' and value #>> '{}' in ('informational', 'commercial-investigation', 'conversion-support'))
        or (key ~ '^(first_|last_)cta_id$' and value #>> '{}' ~ '^cta:[a-z0-9]+(-[a-z0-9]+)*$')
      );

  insert into public.lead_form_submissions as current (
    lead_capture_id, deskcomm_lead_id, deskcomm_contact_id, company_name, phone, country_code, email, lead_volume, team_size, plan_name,
    lead_score, lead_quality, utm, payload, contact_key, captured_at, booked_at, booking_key, booking_starts_at
  ) values (
    p_lead->>'lead_capture_id', p_lead->>'deskcomm_lead_id', p_lead->>'deskcomm_contact_id', p_lead->>'company_name', p_lead->>'phone', p_lead->>'country_code', p_lead->>'email',
    p_lead->>'lead_volume', p_lead->>'team_size', p_lead->>'plan_name', (p_lead->>'lead_score')::integer,
    p_lead->>'lead_quality', incoming_utm, coalesce(p_lead->'payload','{}'), p_lead->>'contact_key',
    (p_lead->>'captured_at')::timestamptz, (p_lead->>'booked_at')::timestamptz, p_lead->>'booking_key', (p_lead->>'booking_starts_at')::timestamptz
  ) on conflict (lead_capture_id) where lead_capture_id is not null do update set
    deskcomm_lead_id = coalesce(excluded.deskcomm_lead_id,current.deskcomm_lead_id),
    deskcomm_contact_id = coalesce(excluded.deskcomm_contact_id,current.deskcomm_contact_id),
    company_name = coalesce(excluded.company_name, current.company_name), phone = coalesce(excluded.phone,current.phone),
    country_code = coalesce(excluded.country_code,current.country_code), email = coalesce(excluded.email,current.email),
    lead_volume = coalesce(excluded.lead_volume,current.lead_volume), team_size = coalesce(excluded.team_size,current.team_size),
    plan_name = coalesce(excluded.plan_name,current.plan_name), lead_score = coalesce(excluded.lead_score,current.lead_score),
    lead_quality = coalesce(excluded.lead_quality,current.lead_quality),
    utm = current.utm || (
      select coalesce(jsonb_object_agg(key,value),'{}'::jsonb)
      from jsonb_each(excluded.utm)
      where key not like 'first_%' or not current.utm ? key
    ),
    payload = current.payload || excluded.payload, contact_key = coalesce(excluded.contact_key,current.contact_key),
    captured_at = coalesce(current.captured_at, excluded.captured_at),
    booked_at = coalesce(current.booked_at, excluded.booked_at), booking_key = coalesce(current.booking_key,excluded.booking_key),
    booking_starts_at = coalesce(current.booking_starts_at,excluded.booking_starts_at)
  returning * into saved;

  update public.deskcomm_status_events set lead_capture_id = saved.lead_capture_id
    where lead_capture_id is null and deskcomm_lead_id = saved.deskcomm_lead_id
    and (select count(*) from public.lead_form_submissions where deskcomm_lead_id = saved.deskcomm_lead_id) = 1;
  perform public.reconcile_funnel_lead(saved.lead_capture_id);
  return to_jsonb(saved);
end $$;

revoke all on function public.record_funnel_lead(jsonb) from public;
grant execute on function public.record_funnel_lead(jsonb) to service_role;

commit;
