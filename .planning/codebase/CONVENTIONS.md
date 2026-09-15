# Coding Conventions

**Analysis Date:** 2026-09-15

## Naming Patterns

**Files:**
- React component files use PascalCase, such as `components/Pricing.tsx`.
- Helpers use camelCase filenames, such as `lib/structuredData.ts`; feature UI subfolders may use kebab-case, such as `components/lead-qualification/`.
- Framework files use Next.js conventions: `page.tsx`, `layout.tsx`, `route.ts`.

**Functions:**
- camelCase for functions and handlers, for example `findFreeSlots` in `lib/deskcomm-mcp.ts`.
- Exported React views use PascalCase functions, for example `MarketingLandingPage`.

**Variables:**
- camelCase; environment constants are uppercase at module scope, for example `LIA_AI_URL`.

**Types:**
- PascalCase types; tagged unions use an `ok` boolean such as `McpToolResult<T>`.

## Code Style

**Formatting:**
- No formatter configuration is enforced.
- Existing TypeScript/TSX primarily uses two-space indentation, double quotes, and semicolons; preserve the style of the edited file.

**Linting:**
- ESLint 9 with Next core-web-vitals and TypeScript configurations in `eslint.config.mjs`.
- Existing legacy rules are warnings, not deploy blockers. Run `npm run lint` before shipping.

## Import Organization

**Order:**
1. Framework and third-party imports.
2. Local components/types.
3. Root-relative `@/` application modules.

**Path Aliases:**
- Use `@/*` mapped to the repository root in `tsconfig.json`, for example `@/lib/utm`.
- Relative imports are acceptable between closely coupled files in the same feature folder.

## Error Handling

**Patterns:**
- Validate public request data before external calls in `app/api/*/route.ts`.
- Return `{ ok: false, error }` from integration clients where callers can recover, as in `lib/deskcomm-mcp.ts`.
- Use `if (result.ok === false)` rather than `if (!result.ok)` for discriminated union narrowing in this project.
- Return generic browser-safe errors while retaining technical detail in server logs.

## Logging

**Framework:** `console`.

**Patterns:**
- Use `console.error` for failures of Supabase, SMTP, Deskcomm, or AI calls.
- Do not log secrets, Bearer tokens, or credential-bearing request payloads.

## Comments

**When to Comment:**
- Explain non-obvious business or platform decisions, especially in API adapters and delayed rendering.
- Prefer Portuguese comments consistent with the codebase's primary language.

**JSDoc/TSDoc:**
- Use brief JSDoc for exported helpers or behavior with surprising operational constraints, such as `lib/rate-limit.ts`.

## Function Design

**Size:**
- Small utilities live in `lib/`; large interactive components may keep state machinery in the main file and extract independent visual pieces.

**Parameters:**
- Prefer typed object parameters for integration calls; see `bookAppointment` in `lib/deskcomm-mcp.ts`.

**Return Values:**
- API handlers use `NextResponse`.
- Provider adapters return tagged result objects rather than leaking raw transport responses.

## Module Design

**Exports:**
- Named exports are the norm for components and helpers; route handlers use framework-required named exports (`GET`, `POST`).

**Barrel Files:**
- Limited use; `lib/dictionaries/index.ts` is the main grouping entry point. Do not introduce barrels without a real import-boundary need.

---

*Convention analysis: 2026-09-15*
