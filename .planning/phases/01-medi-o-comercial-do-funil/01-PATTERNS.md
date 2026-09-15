# Phase 1 — Pattern Map

## `lib/deskcomm-mcp.ts` → `lib/deskcomm-leads.ts`

- **Role:** server-only adapter for an external CRM.
- **Pattern to preserve:** `McpToolResult<T>` with the discriminant `ok`, `result.ok === false` narrowing, secrets read from server environment, sanitized error strings.
- **Change:** add a separate capture adapter instead of putting webhook HTTP logic in the route. It must return a normalized `{ ok, data: { leadId, contactId?, status }, requestId? } | { ok: false, error, retryable? }` result.

## `app/api/notify/route.ts` → primary orchestration

- **Role:** validates a public form submission and coordinates server-side effects.
- **Pattern to preserve:** validate body and Turnstile before external calls; use `NextResponse.json`; do not log tokens/payloads; use the existing rate-limit helpers.
- **Change:** call Deskcomm first once a valid WhatsApp is present; submit score, fit status, UTM first/last touch and a stable idempotency key. Only then invoke the non-blocking Supabase mirror and email notification.

## `lib/supabase-leads.ts` + migration → backup projection

- **Role:** REST persistence without a client SDK.
- **Pattern to preserve:** service role exists server-side only and failures return structured data instead of throwing.
- **Change:** store the Deskcomm correlation ID, CRM stage and timestamp. No query or value from this table may decide a CRM action, agenda action or success response.

## `components/LeadQualificationPopup.tsx` → client milestones

- **Role:** owns wizard state, client analytics and final request.
- **Pattern to preserve:** dictionary-based UI strings, `trackFunnelEvent`, `getUtmLeadPayload`, and no secrets in the browser.
- **Change:** emit an explicit WhatsApp-captured request at the point the number becomes valid; send later qualification/demo updates through the same server contract. Do not change the visual layout in this phase.

## `app/api/public/demo/availability/route.ts` → untouched boundary

- **Role:** exposes only sanitized Deskcomm availability to the browser.
- **Constraint:** keep its server-only MCP credentials and its timezone grouping behavior. Booking will be correlated by a Deskcomm lead/contact ID instead of a search-after-webhook race where the configured source supports returning that ID.
