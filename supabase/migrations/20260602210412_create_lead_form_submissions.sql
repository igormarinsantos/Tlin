create table if not exists public.lead_form_submissions (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  company_name text,
  phone text,
  country_code text,
  email text,
  lead_volume text,
  team_size text,
  plan_name text,
  lead_score integer,
  lead_quality text,
  utm jsonb not null default '{}'::jsonb,
  payload jsonb not null default '{}'::jsonb,
  notification_result jsonb not null default '{}'::jsonb
);

alter table public.lead_form_submissions enable row level security;

create index if not exists lead_form_submissions_created_at_idx
  on public.lead_form_submissions (created_at desc);

create index if not exists lead_form_submissions_email_idx
  on public.lead_form_submissions (email)
  where email is not null;

create index if not exists lead_form_submissions_phone_idx
  on public.lead_form_submissions (phone)
  where phone is not null;
