# AGENTS.md

## Project Identity

- Folder/repo name is `tech-pulse-main`; `package.json` name is `synthnode` (domain: `synthnode.dev`). Names are inconsistent — don't assume parity.
- Single-package Next.js 15 App Router project. No monorepo/workspaces.

## Developer Commands

```bash
npm install          # use npm only — lockfile is package-lock.json
npm run dev          # Next.js dev server on port 3000
npm run build        # production build (required before E2E tests)
npm run start        # serve production build
npm run lint         # ESLint (Prettier errors surface here too)
npm run type-check   # tsc --noEmit (src/ only — does NOT cover tests/ or e2e/)
npm run format       # Prettier --write .
npm test             # vitest run (unit + component, one-shot)
npm run test:watch   # vitest (watch mode)
npm run test:e2e     # Playwright (requires a prior npm run build)
```

Run a focused subset:

```bash
npx vitest run tests/unit/lib/search.test.ts
npx vitest run -t "given search term"
npx playwright test e2e/navigation.spec.ts
```

## Critical Gotchas

- **E2E tests require a production build.** `playwright.config.ts` uses `npm run start`, not `next dev`. Run `npm run build` before `npm run test:e2e` or it will fail.
- **`tsc --noEmit` only covers `src/`.** Type errors in `tests/` or `e2e/` are not caught by `npm run type-check`.
- **Default locale (`es`) has no URL prefix.** `localePrefix: "as-needed"` means Spanish is served at `/`, `/category/ai`, etc. English is at `/en/...`. Hardcoding `/es/` prefixes will 404.
- **All content is static mock data.** No API, CMS, or database. Single source of truth: `src/lib/mock-data.ts`.
- **`no-console` is warn-only;** `console.error` and `console.warn` are allowed. No `console.log` in production (see `cod_style.md`).

## Architecture

```
src/
  app/                    # Next.js App Router
    [locale]/             # Locale-prefixed routes (es default, en secondary)
  components/
    ui/                   # shadcn/ui primitives (Radix-based, NOT RSC)
    layout/               # Header, footer, app shell
    news/                 # News cards, article view
    search/               # Search UI
  lib/
    mock-data.ts          # ALL content data (categories + articles)
    types.ts              # Shared types: Category, NewsArticle
    search.ts             # Fuse.js client-side search
  i18n/request.ts         # next-intl server config
  middleware.ts           # locale detection middleware
  styles.css              # shadcn CSS variables (NOT app/globals.css)
  messages/
    es.json               # Spanish (default)
    en.json               # English

tests/                    # Vitest unit/component tests
e2e/                      # Playwright E2E tests
```

## Toolchain Details

- **i18n**: `next-intl` v3 with `as-needed` prefix. Adding a new locale requires: new JSON in `src/messages/`, add locale to `locales` array in `src/middleware.ts`.
- **shadcn/ui**: `rsc: false` in `components.json` — UI primitives in `src/components/ui/` are not RSC-compatible; don't use as server components.
- **CSS base file**: `src/styles.css` holds shadcn CSS variables. Don't confuse with `src/app/globals.css`.
- **Vitest globals enabled**: `describe`, `it`, `expect`, `vi` are available in test files without imports.
- **ESLint**: flat config (v9), `@typescript-eslint/no-unused-vars` is **off**, `no-unused-locals` is also off — unused vars produce no errors.
- **Prettier**: double quotes, `printWidth: 100`, `trailingComma: "all"`, `semi: true`.

## Environment Variables

| Variable               | Purpose                                  | Default                 |
| ---------------------- | ---------------------------------------- | ----------------------- |
| `NEXT_PUBLIC_BASE_URL` | Absolute URL for sitemap/robots/metadata | `http://localhost:3000` |
| `ADS_TXT_CONTENT`      | Content served at `/ads.txt`             | (empty)                 |

`.env.local` is committed with safe localhost defaults. No env setup needed for local dev.

## Style Conventions

Defined in `cod_style.md` (Spanish):

- SOLID / DRY / KISS / YAGNI
- Prefer local state; avoid Redux
- Always handle loading, error, and empty states
- Test structure: Given-When-Then
- Deployed to Vercel; `vercel.json` sets production env vars
