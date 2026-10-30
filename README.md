# iLogia — لوحة الطالب (app.ilogia-eg.com)

The central entry point of the iLogia ecosystem. Arabic-first (RTL) with full English/LTR support.

| | |
|---|---|
| Domain | `app.ilogia-eg.com` |
| Repository | `mo-2012/app---ilogia` |
| Hosting | GitHub Pages (static) |
| Data | Existing Supabase project (read via RLS with the public publishable key) |
| Status | Built and tested locally; **not yet pushed or published** |

## Features
- Sign in / register / password reset with the **same Supabase accounts** as ilogia-eg.com (no duplicate accounts; duplicate emails are rejected).
- Protected routes, expired-session handling, logout, open-redirect-safe `?next=`.
- Dashboard: greeting (Cairo time), today's study goal, learning ledger (hours, lessons, active days, streak), 12-week study map (Saturday-start weeks), curriculum progress, recently completed lessons, notices, ecosystem index.
- Notifications derived from real account state (subscription status/expiry, onboarding, goal, streak) with read/unread.
- Profile view/edit via the existing `save_my_profile` RPC (name + grade).
- Settings: language (ar/en), digit style, daily goal, sign out.
- Clearly-labelled **demo mode** (sample data, banner on every page) when you don't want to sign in.
- Loading skeletons, empty and error states (with retry) on every data view.

## Data sources (existing, unchanged)
`rpc my_progress`, `my_subscription` (view), `videos`, `grades`, `profiles`, `rpc is_admin`, `rpc save_my_profile`.

## Develop
```bash
cp .env.example .env.local   # fill the PUBLIC publishable key
npm install                  # at repo root
npm run dev -w @ilogia/app
npm test -w @ilogia/app
npm run build -w @ilogia/app # → apps/app---ilogia/dist
```

## Deploy
See `docs/DEPLOYMENT_GUIDE.md`. The build is static (`dist/`), uses hash routing (works on GitHub Pages without 404 rewrites) and ships `CNAME`, `.nojekyll`, `robots.txt`.
