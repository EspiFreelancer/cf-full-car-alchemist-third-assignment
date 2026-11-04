# Full Car Alchemist

## What this is

- Mobile-first app for an auto repair shop: mechanic panel (`/mecanico`), public customer portal (`/cliente/[orderId]`, no login), and admin panel (`/admin`).
- Inventory is intentionally out of scope (managed in Excel).
- UI copy, routes, and domain identifiers are Spanish/Argentine (`patente`, `orden`, `presupuesto`). Keep that convention.
- Current state is a v0-generated prototype: all data lives in client-side React state seeded from `src/lib/taller/mock-data.ts`. Supabase is **not wired yet** — only `src/lib/supabase/config.ts` (env placeholders) and an IP-reading Server Action exist. Do not assume tables, RLS, auth, or Supabase deps are present.

## Commands (run from `src/`)

- The app lives in `src/`, not the repo root. There is no root `package.json`.
- Package manager is pnpm (`src/pnpm-lock.yaml`, `packageManager: pnpm@12.3.4`).
- `pnpm install`
- `pnpm dev` / `pnpm build` / `pnpm start`
- `pnpm exec tsc --noEmit` — the only available typecheck.
- No lint or test scripts/configs exist. Do not run or invent `npm test` / `npm run lint`.
- `src/next.config.mjs` sets `typescript.ignoreBuildErrors`, so `pnpm build` will not catch type errors. Run `tsc` separately.
- Env: copy `src/.env.example` to `src/.env.local`; keys are `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`.

## Architecture

- Next.js 16 App Router + React 19, Tailwind v4, shadcn/ui (`base-nova` style) in `src/components/ui`.
- Path alias `@/*` maps to `src/*`.
- Route pages are Server Component shells; interactive panels are `'use client'` and read/mutate via `useTaller()`.
- Every mutation (`cambiarEstado`, `agregarAdicional`, `responderPresupuesto`, `crearIngreso`) is centralized in `src/components/taller/taller-provider.tsx`. Add domain behavior there so it can map 1:1 to future Supabase calls.
- Domain types: `src/lib/taller/types.ts`; labels/colors: `src/lib/taller/estados.ts`.
- Canonical statuses are `en_revision`, `esperando_aprobacion`, `en_reparacion`, `listo`. The English status names in `specs/` and the brand skill are design docs, not code values.
- Brand: use `BrandLogo` (`src/components/taller/brand-logo.tsx`, asset `src/public/full-car-logo.jpg`) and the `--status-*` / base color tokens in `src/app/globals.css`. Do not hardcode palette colors in components.
- Brand/visual rules: `.opencode/skill/brand-designer/SKILL.md`. Feature requirements and task breakdown: `specs/001-feature-mechanic/`.

## Gotchas

- `TallerProvider` wraps every route in `src/app/layout.tsx`; state is in-memory per tab and resets on reload. Changes made in one view do not sync across tabs/devices until Supabase is connected.
- The home page links the customer portal to a hardcoded demo order, `ot-7f3a9c`.
- Tailwind v4 has no `tailwind.config`; theme tokens (including `--status-*`) live in `src/app/globals.css`.
- `src/pnpm-workspace.yaml` only configures pnpm release-age settings — `src/` is not a multi-package workspace.

## Conventions

- Prefer Server Components; add `'use client'` only for interactivity/hooks.
- Strict TypeScript, no `any`. Validate server-side writes with Zod when adding them.
- Keep dependencies minimal: avoid Axios and heavy UI libraries (MUI, Bootstrap).
- Use RLS and route all client mutations through Server Actions/API routes once Supabase is connected.
- `main` is production. Work on branches and open PRs; never commit directly to `main`. Recent history uses `add:`, `fix:`, `refactor:` commit prefixes.
