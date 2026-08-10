create table if not exists public.growth_leads (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  name text not null,
  email text not null,
  whatsapp text not null,
  campaign_slug text not null,
  campaign_keyword text not null,
  consent_marketing boolean not null default false,
  consent_channels jsonb not null default '[]'::jsonb,
  consent_version text not null,
  utm jsonb not null default '{}'::jsonb
);

alter table public.growth_leads enable row level security;

create index if not exists growth_leads_created_at_idx on public.growth_leads (created_at desc);
create index if not exists growth_leads_campaign_slug_idx on public.growth_leads (campaign_slug);
create index if not exists growth_leads_email_idx on public.growth_leads (email);
