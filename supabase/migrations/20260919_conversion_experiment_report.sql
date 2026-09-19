begin;

create or replace view public.funnel_experiment_report with (security_invoker = true) as
with bookings as (
  select distinct on (booking_key) id from public.lead_form_submissions
  where booked_at is not null and booking_key is not null order by booking_key, booked_at, created_at, id
)
select date_trunc('day', l.created_at at time zone 'America/Sao_Paulo')::date as cohort_date,
  coalesce(nullif(l.utm->>'experiment_id', ''), 'not_assigned') as experiment_id,
  coalesce(nullif(l.utm->>'experiment_variant', ''), 'not_assigned') as experiment_variant,
  count(*) filter (where l.captured_at is not null) as leads,
  count(*) filter (where b.id is not null) as demos,
  count(*) filter (where b.id is not null and l.qualified is true) as qualified_demos,
  count(*) filter (where b.id is not null and l.attended_at is not null) as attended_demos,
  count(*) filter (where l.won_at is not null) as won,
  count(*) filter (where l.captured_at is not null and l.qualified is null) as awaiting_qualification
from public.lead_form_submissions l left join bookings b on b.id = l.id
where l.lead_capture_id is not null
group by 1, 2, 3;

revoke all on public.funnel_experiment_report from anon, authenticated;
grant select on public.funnel_experiment_report to service_role;

create or replace function public.read_funnel_report(p_from date, p_to date)
returns jsonb language sql stable security invoker set search_path = public as $$
  select jsonb_build_object(
    'campaigns', coalesce((select jsonb_agg(row_to_json(t)) from (
      select source,campaign,sum(leads) as leads,sum(demos) as demos,sum(qualified_demos) as qualified_demos,
        sum(attended_demos) as attended_demos,sum(won) as won,sum(awaiting_qualification) as awaiting_qualification
      from public.funnel_report where cohort_date between p_from and p_to group by source,campaign order by sum(leads) desc,source,campaign
    ) t),'[]'),
    'experiments', coalesce((select jsonb_agg(row_to_json(t)) from (
      select experiment_id,experiment_variant,sum(leads) as leads,sum(demos) as demos,sum(qualified_demos) as qualified_demos,
        sum(attended_demos) as attended_demos,sum(won) as won,sum(awaiting_qualification) as awaiting_qualification
      from public.funnel_experiment_report where cohort_date between p_from and p_to
      group by experiment_id,experiment_variant order by experiment_id,experiment_variant
    ) t),'[]'),
    'pending_operations',(select count(*) from public.funnel_operations where state='pending'),
    'unmatched_events',(select count(*) from public.deskcomm_status_events e where not exists(select 1 from public.lead_form_submissions l where l.lead_capture_id=e.lead_capture_id)),
    'mapped_stages',(select count(*) from public.funnel_stage_mapping)
  )
$$;

commit;
