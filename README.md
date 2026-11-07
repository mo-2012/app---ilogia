# iLogia Student Dashboard

A static Arabic-first dashboard built with HTML, CSS, and JavaScript. It has no npm, build step, PHP server, or custom backend: authentication and data access use the existing Supabase project directly through the Supabase JavaScript SDK.

## Run locally

On Windows, double-click `apps\app---ilogia\run-local.bat`. Alternatively, from the repository root run:

```sh
python -m http.server 8000 --directory apps/app---ilogia/public
```

Open `http://localhost:8000`. The demo can be explored without an account. Sign-in requires the configured Supabase project and a valid account.

## Supabase setup

- `apps/app---ilogia/public/config.js` contains the Supabase project URL and **public publishable key**. This key is designed to be included in browser code. Never put a `service_role` or secret key in this file.
- In Supabase **Authentication → URL Configuration**, add the deployed website URL (for example `https://app.ilogia-eg.com/`) and the local URL (`http://localhost:8000/`) to the allowed redirect URLs. This is needed for sign-up confirmation and password recovery.
- Keep row-level security enabled on student data. The browser sends the signed-in student's access token directly to Supabase; authorization must be enforced by Supabase RLS and the existing RPCs.
- The dashboard uses `my_progress`, `my_subscription`, `videos`, `grades`, `profiles`, `is_admin`, and `save_my_profile`. These database objects and their grants/RLS policies must already exist.
- The page CSP permits the pinned Supabase CDN, only the inline-script hash reported by the browser, and Google Fonts hosts. It does not enable `unsafe-inline` for scripts.

## Deploy to GitHub Pages

The GitHub Actions workflow publishes only `apps/app---ilogia/public/`. Enable GitHub Pages with GitHub Actions as the source, then push to `main` or run the workflow manually. GitHub Pages serves the static frontend; no API hosting or PHP configuration is needed.
