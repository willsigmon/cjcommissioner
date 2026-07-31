# AGENTS.md

Campaign website for "CJ Turrentine for Vance County Commissioner, District 3".
Single Next.js 16 (App Router) + React 19 + TypeScript + Tailwind CSS 4 app. Package
manager is npm. Dev server runs on port 3000. There is no local Docker stack. The
external integrations are Stripe (donations), a campaign-dedicated Supabase
contribution ledger, and Google Sheets (volunteer signups).

Standard commands live in `package.json` scripts: `dev`, `build`, `start`, `lint`,
`typecheck`, `test`, and `verify` (lint + typecheck + test + build). Setup is
`npm install` then `npm run dev` (see `README.md`).

## Cursor Cloud specific instructions

### Native-binary gotcha (why the startup script does more than `npm install`)
The committed `package-lock.json` was generated on macOS and only records the
`darwin-arm64` optional native binaries for `lightningcss` and `@tailwindcss/oxide`
(both pulled in by Tailwind CSS 4). On Linux, a plain `npm install`/`npm ci` therefore
leaves `lightningcss-linux-x64-gnu` and `@tailwindcss/oxide-linux-x64-gnu` uninstalled,
and **every page 500s** while compiling `globals.css` with errors like
`Cannot find module '../lightningcss.linux-x64-gnu.node'` or an
`@tailwindcss/oxide` `requireNative` failure.

- The startup update script fixes this by installing the matching-version Linux
  binaries with `npm install --no-save` (guarded so it only runs when a binary is
  missing). This respects the committed lockfile and does not modify any committed file.
- Do NOT try to "fix" this by regenerating and committing `package-lock.json`.
  npm regeneration just flips the platform bias to Linux-only (drops the darwin
  entries and ~50 others), which breaks macOS contributors. This is an npm
  optional-dependency lockfile limitation, not a repo bug.
- If you change dependencies and pages start 500ing on CSS again, re-run the two
  guarded installs from the update script, or `node -e "require('lightningcss')"`
  / `node -e "require('@tailwindcss/oxide')"` to confirm the native binaries load.

### Optional integrations & feature flags (donations / volunteer)
Both conversion flows are gated and need secrets that are intentionally absent in dev:

- **Volunteer signup** (`/api/volunteer` → `src/lib/google-sheets.ts`): the form UI is
  hidden unless `NEXT_PUBLIC_VOLUNTEER_ENABLED=true`. Set it (plus
  `NEXT_PUBLIC_SITE_URL=http://localhost:3000`) in a gitignored `.env.local` to show
  the form. Appending to the sheet needs `GOOGLE_SERVICE_ACCOUNT_EMAIL`,
  `GOOGLE_PRIVATE_KEY`, `GOOGLE_SHEET_ID`, `GOOGLE_SHEET_TAB`. Without them a fully
  valid submission still exercises client → API → validation and returns a graceful
  503 ("could not save … call or email") — that 503 is expected locally, not a bug.
- **Donations** (`/api/donations/session` → `src/lib/stripe.ts`): requires Stripe
  **test** keys (`NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`, `STRIPE_SECRET_KEY`), the
  Stripe webhook secret, the Supabase service-role configuration, the export and
  donor-fingerprint secrets, a donation rate-limit rule, and all three launch flags:
  `DONATIONS_ENABLED=true`, `TREASURER_COPY_APPROVED=true`, and
  `CONTRIBUTION_HISTORY_RECONCILED=true`. Missing any required setting returns 503.
  A bank routing/account number is NOT a code credential — it is added by the account
  owner in the Stripe Dashboard for payouts and is not needed for test-mode donations.
- In development, `isAllowedOrigin` (`src/lib/validation.ts`) auto-allows
  `localhost:3000/3001` and `127.0.0.1`, so API POSTs from the local dev server pass
  the origin check without production URLs.

### Running / testing notes
- The dev server is Turbopack-based; env changes in `.env.local` require a restart.
- `@vercel/firewall` rate limiting is a no-op in dev when `VERCEL_VOLUNTEER_RATE_LIMIT_ID`
  is unset; in production without it the volunteer API returns 503 by design.
