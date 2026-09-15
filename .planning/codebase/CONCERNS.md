# Codebase Concerns

**Analysis Date:** 2026-09-15

## Tech Debt

**Large stateful UI components:**
- Issue: `components/LeadQualificationPopup.tsx` remains a large file that owns flow state, network submission, persistence, rendering, and editing overlays.
- Files: `components/LeadQualificationPopup.tsx`.
- Impact: changes to the lead journey have a broad regression surface.
- Fix approach: preserve the current state-machine file as the flow owner, but extract future independent visual/field units into `components/lead-qualification/` and add behavioral tests before deeper refactors.

**Lint baseline:**
- Issue: the project has 129 existing lint warnings, and several rules were intentionally downgraded to warnings in `eslint.config.mjs`.
- Files: `eslint.config.mjs`, several files under `components/` and `lib/`.
- Impact: new quality issues can hide among pre-existing warnings.
- Fix approach: burn warnings down incrementally by area; avoid raising the whole baseline during unrelated feature work.

## Known Bugs

**Deskcomm day parameter mismatch:**
- Symptoms: requesting a specific day does not filter results as expected in the current Deskcomm instance.
- Files: `app/api/public/demo/availability/route.ts`, `lib/deskcomm-mcp.ts`.
- Trigger: using the upstream `dia` argument for a one-day availability query.
- Workaround: request a bounded date range and group results by agenda timezone locally.

## Security Considerations

**Instance-local rate limiting:**
- Risk: `Map`-based rate limits are not shared across Vercel instances or regions.
- Files: `lib/rate-limit.ts`, public API handlers under `app/api/`.
- Current mitigation: Cloudflare edge rate limiting protects `/api/chat`; handlers validate payloads and impose per-instance limits.
- Recommendations: retain Cloudflare limits and move high-value limits to a distributed store if traffic or abuse grows.

**Lia fallback endpoint:**
- Risk: `app/api/chat/route.ts` has a hard-coded HTTP fallback IP for the AI endpoint.
- Files: `app/api/chat/route.ts`.
- Current mitigation: request validation, local rate limiting, and an upstream timeout.
- Recommendations: require `LIA_AI_URL` in production and use HTTPS or a private network; remove the HTTP fallback after production configuration is stable.

**Turnstile activation dependency:**
- Risk: lead anti-bot verification is bypassed when `TURNSTILE_SECRET_KEY` is absent by design, so a missing production variable reduces protection.
- Files: `components/Turnstile.tsx`, `lib/turnstile.ts`, `.env.local.example`.
- Current mitigation: Cloudflare edge rate limit and server-side validation activate automatically once both Vercel variables exist.
- Recommendations: add both keys to Vercel Production, redeploy, and verify Turnstile analytics with a lead test.

## Performance Bottlenecks

**Client-heavy landing interactions:**
- Problem: animation-heavy components and the lead/Lia popups can increase client JavaScript and hydration work.
- Files: `components/MarketingLandingPage.tsx`, `components/LiaPopup.tsx`, `components/campaignCardMotions.tsx`.
- Cause: interactive animation libraries and some client-only dynamic imports.
- Improvement path: profile real-user Core Web Vitals; maintain delayed rendering for non-critical sections and avoid making SEO copy client-only.

## Fragile Areas

**Lead submission orchestration:**
- Files: `app/api/notify/route.ts`, `lib/supabase-leads.ts`, `lib/deskcomm-mcp.ts`.
- Why fragile: one browser action coordinates Supabase persistence, webhook delivery, contact lookup/retry, booking, and SMTP.
- Safe modification: preserve partial-success handling; test both with and without a selected demo slot and inspect Vercel logs after deployment.
- Test coverage: no automated coverage.

## Scaling Limits

**In-memory limiter:**
- Current capacity: each instance tracks up to 10,000 client keys before expired entries are cleaned.
- Limit: limits are bypassable across concurrent serverless instances.
- Scaling path: use Cloudflare edge controls now; introduce a shared rate-limit backend for application-wide enforcement when warranted.

## Dependencies at Risk

**External provider availability:**
- Risk: the CRM, SMTP, AI, and Supabase paths all depend on remote services and network latency.
- Impact: lead confirmation can return a non-success response even when some side effects have already happened.
- Migration plan: centralize observability and add idempotency/retry strategy before materially increasing submission volume.

## Missing Critical Features

**Automated regression suite:**
- Problem: no unit, route integration, or end-to-end runner is configured.
- Blocks: confident refactors of lead handling, integrations, and conversion tracking.

## Test Coverage Gaps

**Public APIs and lead flow:**
- What's not tested: input validation, rate limits, provider errors, Turnstile rejection, scheduling conflict, and end-to-end submission.
- Files: `app/api/chat/route.ts`, `app/api/notify/route.ts`, `app/api/public/demo/availability/route.ts`, `components/LeadQualificationPopup.tsx`.
- Risk: behavior can regress while lint/build remain green.
- Priority: High.

---

*Concerns audit: 2026-09-15*
