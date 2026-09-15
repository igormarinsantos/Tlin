# Technology Stack

**Analysis Date:** 2026-09-15

## Languages

**Primary:**
- TypeScript 5 - application routes, React components, utilities, and API handlers in `app/`, `components/`, and `lib/`.

**Secondary:**
- JavaScript - Next/PostCSS configuration and a few one-off diagnostic scripts in `scripts/` and the repository root.
- SQL - Supabase schema migration in `supabase/migrations/20260602210412_create_lead_form_submissions.sql`.

## Runtime

**Environment:**
- Node.js 18 or newer - documented in `AGENTS.md`; runtime is required by Next.js 16.

**Package Manager:**
- npm - lockfile `package-lock.json` is committed.

## Frameworks

**Core:**
- Next.js 16.3.5 with App Router - routing, SSR/static generation, API route handlers, and image optimization.
- React 19 - client components and interactive lead/chat flows.
- Tailwind CSS 4.2.2 - utility styling through `app/globals.css` and component class strings.

**Build/Dev:**
- Turbopack through `next dev` and `next build`.
- ESLint 9 with `eslint-config-next` in `eslint.config.mjs`.
- TypeScript uses non-strict, incremental compilation configured in `tsconfig.json`.

## Key Dependencies

**Critical:**
- `framer-motion` - animated landing sections and conversational lead popup.
- `nodemailer` - internal and welcome-email delivery from `app/api/notify/route.ts`.
- `sharp` - production image transformation used by Next.js image optimization.
- `next` / `react` / `react-dom` - runtime platform.

**Infrastructure:**
- `@tailwindcss/postcss`, `postcss`, and `autoprefixer` - stylesheet pipeline.
- `lenis` - smooth-scroll behavior in `components/SmoothScroll.tsx`.
- `lucide-react`, `canvas-confetti`, `ogl`, `date-fns`, Radix Slot, and CVA - interface primitives/effects.

## Configuration

**Environment:**
- Local configuration is ignored by Git; `.env.local.example` documents public analytics, Lia, Supabase, SMTP, Deskcomm, and Turnstile variable names.
- Server-only integration secrets are read in `lib/supabase-leads.ts`, `lib/deskcomm-mcp.ts`, `lib/turnstile.ts`, and `app/api/notify/route.ts`.

**Build:**
- `next.config.js` defines redirects, image hosts/formats, caching headers, and package import optimization.
- `postcss.config.mjs`, `eslint.config.mjs`, and `tsconfig.json` are repository-level configuration.

## Platform Requirements

**Development:**
- Install dependencies with `npm install`; run `npm run dev`, `npm run lint`, and `npm run build`.

**Production:**
- Vercel deploys the `main` branch automatically; Cloudflare fronts `https://tlin.ia.br`.

---

*Stack analysis: 2026-09-15*
