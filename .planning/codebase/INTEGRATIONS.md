# External Integrations

**Analysis Date:** 2026-09-15

## APIs & External Services

**Conversational AI:**
- Lia/Ollama-compatible service - `app/api/chat/route.ts` sends the server-side prompt plus visitor messages.
  - SDK/Client: native `fetch`
  - Auth: endpoint/model selected by `LIA_AI_URL` and `LIA_AI_MODEL`

**CRM and scheduling:**
- Deskcomm MCP - `lib/deskcomm-mcp.ts` calls contact search, availability, and booking tools.
  - SDK/Client: JSON-RPC 2.0 over native `fetch`
  - Auth: `DESKCOMM_MCP_URL`, `DESKCOMM_API_TOKEN`, `DESKCOMM_DEMO_EVENT_TYPE_SLUG`
- Deskcomm inbound webhook - `app/api/notify/route.ts` sends a new-lead payload before trying to book a demo.
  - Auth: token embedded in `DESKCOMM_WEBHOOK_URL`

**Bot protection:**
- Cloudflare Turnstile - `components/Turnstile.tsx` renders the widget and `lib/turnstile.ts` calls Siteverify.
  - Auth: `NEXT_PUBLIC_TURNSTILE_SITE_KEY` and `TURNSTILE_SECRET_KEY`

**Email:**
- SMTP/Resend-compatible provider - `app/api/notify/route.ts` sends internal and welcome emails through Nodemailer.
  - Auth: `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `SMTP_FROM`, `NOTIFICATION_EMAIL`

**Analytics:**
- Google Tag Manager and GA4 - loaded in `app/layout.tsx`; events and UTM attribution live in `lib/utm.ts`.
  - Auth/config: `NEXT_PUBLIC_GTM_ID`, `NEXT_PUBLIC_GA_MEASUREMENT_ID`

## Data Storage

**Databases:**
- Supabase Postgres REST API - lead submissions are created and updated from `lib/supabase-leads.ts`.
  - Connection: `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`
  - Client: native REST `fetch`, no Supabase SDK.

**File Storage:**
- Local static assets in `public/`; no external application file store detected.

**Caching:**
- Vercel/Next static cache headers in `next.config.js`; no distributed application cache.

## Authentication & Identity

**Auth Provider:**
- No visitor login/authentication is implemented in this repository.
- Integration access uses server environment variables and Bearer/API-key headers.

## Monitoring & Observability

**Error Tracking:**
- No dedicated error-tracking provider detected.

**Logs:**
- Server routes and integration helpers use `console.error` / `console.log`; Vercel runtime logs are the operational source.

## CI/CD & Deployment

**Hosting:**
- Vercel auto-deploys pushes to `main`.
- Cloudflare provides DNS, TLS, HTTPS redirect, and a public API rate-limit rule.

**CI Pipeline:**
- No versioned GitHub Actions or other CI configuration detected.

## Environment Configuration

**Required env vars:**
- See `.env.local.example`; production lead handling needs Supabase, Deskcomm, and SMTP variables.
- Turnstile activates only when both the public site key and server secret are configured.

**Secrets location:**
- Local ignored environment files for development; Vercel environment variables for production.

## Webhooks & Callbacks

**Incoming:**
- Public application endpoints: `POST /api/chat`, `POST /api/notify`, and `GET /api/public/demo/availability`.

**Outgoing:**
- Deskcomm webhook, Deskcomm MCP calls, Supabase REST, SMTP, Cloudflare Turnstile Siteverify, and Lia endpoint.

---

*Integration audit: 2026-09-15*
