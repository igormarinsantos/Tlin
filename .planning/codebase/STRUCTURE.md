# Codebase Structure

**Analysis Date:** 2026-09-15

## Directory Layout

```text
Tlin-trabalho/
├── app/                    # App Router pages, layouts, API routes, metadata routes
├── components/             # Landing sections, popups, UI primitives, blog components
├── components/lead-qualification/ # UI parts extracted from the lead wizard
├── lib/                    # Provider clients, domain helpers, i18n, analytics
├── public/                 # Static images, video, flags, llms files, icons
├── supabase/migrations/    # Database schema migrations
├── docs/                   # Design-system reference documents
├── .planning/              # GSD project state and codebase map
└── next.config.js          # Next.js runtime configuration
```

## Directory Purposes

**`app/`:**
- Purpose: URL structure and server route boundaries.
- Contains: pages, layouts, metadata routes, and handlers.
- Key files: `app/layout.tsx`, `app/page.tsx`, `app/api/notify/route.ts`.

**`components/`:**
- Purpose: reusable visual and interaction modules.
- Contains: PascalCase React components; some large animations remain self-contained.
- Key files: `components/MarketingLandingPage.tsx`, `components/LeadQualificationPopup.tsx`, `components/LiaPopup.tsx`.

**`lib/`:**
- Purpose: shared non-visual utilities and external service adapters.
- Key files: `lib/deskcomm-mcp.ts`, `lib/supabase-leads.ts`, `lib/utm.ts`, `lib/siteConfig.ts`.

## Key File Locations

**Entry Points:**
- `app/page.tsx`: home page.
- `app/demo/page.tsx`: embedded qualification flow.
- `app/layout.tsx`: document shell and shared providers.

**Configuration:**
- `next.config.js`: redirects, image domains, caching headers.
- `eslint.config.mjs`: lint baseline and ignores.
- `.env.local.example`: variable names only; never put production values in source control.

**Core Logic:**
- `components/LeadQualificationPopup.tsx`: lead wizard state machine.
- `app/api/notify/route.ts`: submission orchestration.
- `lib/deskcomm-mcp.ts`: CRM scheduling protocol adapter.

**Testing:**
- No formal test directory or runner configuration exists; current checks are `npm run lint`, `npx tsc --noEmit`, and `npm run build`.

## Naming Conventions

**Files:**
- PascalCase `.tsx` for React components, for example `components/FooterBanner.tsx`.
- camelCase or kebab-case `.ts` for utilities and module groups, for example `lib/siteConfig.ts` and `components/lead-qualification/constants.ts`.
- App Router routes use framework filenames such as `page.tsx`, `layout.tsx`, `route.ts`.

**Directories:**
- Route segments follow public URLs in `app/`.
- Component subdomains use kebab-case directories such as `components/lead-qualification/`.

## Where to Add New Code

**New marketing feature:**
- Page route: `app/<route>/page.tsx`.
- Shared section: `components/<PascalCaseName>.tsx`.
- Reuse `components/MarketingLandingPage.tsx` when the route is a campaign variation.

**New API capability:**
- Handler: `app/api/<feature>/route.ts`.
- Provider/validation helper: `lib/<feature>.ts`.

**New wizard UI:**
- Keep state transitions in `components/LeadQualificationPopup.tsx`.
- Add independent UI pieces in `components/lead-qualification/`.

**Utilities:**
- Shared helpers go in `lib/` and should be imported through the `@/*` alias.

## Special Directories

**`.next/`:**
- Purpose: generated Next build output.
- Generated: Yes.
- Committed: No.

**`public/_unused/`:**
- Purpose: retained but inactive assets.
- Generated: No.
- Committed: Yes; assess before deleting because deployments may still reference files externally.

---

*Structure analysis: 2026-09-15*
