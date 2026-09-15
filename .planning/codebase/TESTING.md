# Testing Patterns

**Analysis Date:** 2026-09-15

## Test Framework

**Runner:**
- Not detected. There is no Jest, Vitest, Playwright, Cypress, or test-runner configuration in `package.json`.

**Assertion Library:**
- Not detected.

**Run Commands:**
```bash
npm run lint       # Static linting
npx tsc --noEmit   # Type-check without emitting output
npm run build      # Production compilation and route generation
```

## Test File Organization

**Location:**
- No formal `*.test.*` or `*.spec.*` files are present.
- Root scripts `test-fetch.js` and `test-gemini.js` are ad hoc diagnostic scripts, not an automated test suite.

**Naming:**
- Establish `*.test.ts` / `*.test.tsx` next to units or in a dedicated `tests/` folder only after selecting a runner.

## Test Structure

**Suite Organization:**
```typescript
// No repository test-suite pattern exists yet.
// New tests should use describe/it with explicit Arrange-Act-Assert sections.
```

**Patterns:**
- Current validation is manual plus build-time checks.
- For API changes, manually exercise valid input, invalid input, rate-limit response, and provider-failure paths before deployment.

## Mocking

**Framework:**
- Not detected.

**What to Mock:**
- Once a runner is introduced, mock network boundaries: `fetch` calls to Deskcomm, Supabase, SMTP-adjacent adapters, Turnstile, and Lia.

**What NOT to Mock:**
- Pure transformations such as UTM parsing/scoring in `lib/utm.ts` and date grouping in `app/api/public/demo/availability/route.ts` should be tested directly.

## Fixtures and Factories

**Test Data:**
```typescript
const validLead = {
  name: "Empresa Exemplo",
  phone: "11999999999",
  email: "contato@example.com",
};
```

**Location:**
- Not established. Add shared fixtures under `tests/fixtures/` only when several suites need them.

## Coverage

**Requirements:**
- None enforced.

**View Coverage:**
```bash
# Not available until a test runner is added.
```

## Test Types

**Unit Tests:**
- Not currently used. Highest-value first targets are `lib/rate-limit.ts`, `lib/turnstile.ts`, `lib/utm.ts`, and Deskcomm response parsing.

**Integration Tests:**
- Not currently used. API route tests should mock external services and assert HTTP status/body behavior.

**E2E Tests:**
- Not currently used. The critical journey is landing CTA → lead wizard → demo selection → lead submission.

## Common Patterns

**Async Testing:**
```typescript
// Proposed style after runner adoption
const response = await POST(request);
expect(response.status).toBe(200);
```

**Error Testing:**
```typescript
// Proposed style: test validation and upstream failure separately
expect(response.status).toBe(400);
```

---

*Testing analysis: 2026-09-15*
