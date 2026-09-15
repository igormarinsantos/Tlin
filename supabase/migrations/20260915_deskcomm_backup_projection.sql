alter table public.lead_form_submissions
  add column if not exists lead_capture_id text,
  add column if not exists deskcomm_lead_id text,
  add column if not exists deskcomm_contact_id text,
  add column if not exists crm_status text,
  add column if not exists crm_status_at timestamptz;

create unique index if not exists lead_form_submissions_capture_id_idx
  on public.lead_form_submissions (lead_capture_id)
  where lead_capture_id is not null;

create table if not exists public.deskcomm_status_events (
  id uuid primary key default gen_random_uuid(),
  external_event_id text not null unique,
  lead_capture_id text,
  deskcomm_lead_id text,
  deskcomm_contact_id text,
  status text not null,
  occurred_at timestamptz not null,
  received_at timestamptz not null default now(),
  payload jsonb not null default '{}'::jsonb
);
