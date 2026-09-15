<!-- refreshed: 2026-09-15 -->
# Architecture

**Analysis Date:** 2026-09-15

## System Overview

```text
Browser and crawlers
        |
        v
Next.js App Router (`app/`) ----> React landing UI (`components/`)
        |                                      |
        |                                      v
        |                              Client state, i18n, UTM (`lib/`)
        v
Route handlers (`app/api/`)
        |
        +--> Lia AI / Deskcomm MCP / SMTP / Supabase / Turnstile
```

## Component Responsibilities

| Component | Responsibility | File |
|-----------|----------------|------|
| Root layout | metadata, fonts, analytics, shared providers/header | `app/layout.tsx` |
| Landing composition | assembles home and campaign sections plus global popups | `components/MarketingLandingPage.tsx` |
| Lead wizard | collects lead data, schedules demo, posts submission | `components/LeadQualificationPopup.tsx` |
| API handlers | validate public requests and bridge server integrations | `app/api/**/route.ts` |
| Integration helpers | Deskcomm, Supabase, Turnstile, rate limiting, analytics | `lib/*.ts` |

## Pattern Overview

**Overall:** Next.js monolith with client-heavy presentation and server route adapters.

**Key Characteristics:**
- Pages in `app/` are thin route-level composition entry points.
- Shared UI resides in `components/`; interactive files use the `"use client"` directive.
- Integration code is kept in `lib/` and invoked only from server handlers when it requires secrets.

## Layers

**Presentation:**
- Purpose: render landing pages, campaigns, blog, legal pages, and popup flows.
- Location: `app/` and `components/`.
- Depends on: `lib/LanguageContext.tsx`, dictionaries, UTM helpers, and API routes.

**Application/API:**
- Purpose: validate public input, apply local protections, and return browser-safe responses.
- Location: `app/api/chat/route.ts`, `app/api/notify/route.ts`, `app/api/public/demo/availability/route.ts`.
- Depends on: server helpers in `lib/` and environment configuration.

**Integration:**
- Purpose: isolate protocol and provider-specific work.
- Location: `lib/deskcomm-mcp.ts`, `lib/supabase-leads.ts`, `lib/turnstile.ts`, `lib/emailTemplates.ts`.

## Data Flow

### Lead qualification and demo booking

1. CTA dispatches `open-qualification`; `QualificationController` in `components/MarketingLandingPage.tsx` opens `LeadQualificationPopup`.
2. The client wizard gathers data and reads available slots through `GET /api/public/demo/availability`.
3. Confirmation posts lead data, UTM payload, chosen slot, and Turnstile token to `POST /api/notify`.
4. The route validates input/token, persists to Supabase, calls Deskcomm, books where possible, sends email, and updates notification metadata.

### Lia conversation

1. `components/LiaPopup.tsx` sends bounded message history to `POST /api/chat`.
2. `app/api/chat/route.ts` reads the server prompt and forwards it to the configured AI endpoint with a timeout.
3. The handler returns only response text or a generic failure to the browser.

**State Management:**
- Component-local React state and refs dominate interactive flows.
- Language and UTM state use React context/localStorage/cookies in `lib/LanguageContext.tsx` and `lib/utm.ts`.

## Key Abstractions

**Discriminated integration result:**
- Purpose: represent external call success/failure without throwing through the whole route.
- Examples: `McpToolResult` in `lib/deskcomm-mcp.ts` and API checks using `result.ok === false`.
- Pattern: tagged union with `ok` boolean.

**Dictionary-driven copy:**
- Purpose: keep PT/EN/ES UI strings aligned.
- Examples: `lib/dictionaries/pt.ts`, `lib/dictionaries/en.ts`, `lib/dictionaries/es.ts`.

## Entry Points

**Website:**
- Location: `app/page.tsx`
- Triggers: request to `/`
- Responsibilities: render the shared marketing landing page.

**Campaign routes:**
- Location: `app/{ia-whatsapp,recuperacao-de-leads,crm-com-ia,infoprodutores,agentes-de-ia}/page.tsx`
- Responsibilities: render the shared landing shell with an alternate hero variant.

## Architectural Constraints

- **Threading:** standard Node/Next request handling; serverless instances do not share in-memory state.
- **Global state:** `lib/rate-limit.ts` has a module-level map, which is intentionally only an instance-local backstop.
- **Secrets:** browser components must not import helpers that consume server credentials.
- **SEO:** do not add `ssr: false` to copy-bearing landing sections without reviewing crawl/indexing impact.

## Anti-Patterns

### Duplicating campaign pages

**What happens:** campaign pages could copy the full home structure.
**Why it's wrong:** landing layout and conversion logic drift.
**Do this instead:** pass a `heroVariant` to `components/MarketingLandingPage.tsx`.

### Calling external services from browser code

**What happens:** credentials or provider protocol leak into client bundles.
**Why it's wrong:** it exposes secrets and bypasses server validation.
**Do this instead:** add or extend a route handler in `app/api/` and a narrow helper in `lib/`.

## Error Handling

**Strategy:** server handlers validate inputs early, return generic client-facing failures, and log provider-specific detail server-side.

**Patterns:**
- Check external tagged unions with `result.ok === false`.
- Bound provider requests with `AbortController` in `app/api/chat/route.ts` and `lib/turnstile.ts`.
- Use `console.error` for integration failures without logging credentials.

---

*Architecture analysis: 2026-09-15*
