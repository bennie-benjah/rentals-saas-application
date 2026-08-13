# abode-nexus-ui → Laravel React Starter Kit — Final Package

This is the fully corrected, consolidated version of the ported frontend, after
working through the actual dev-server errors on your machine. Everything below
reflects what's really in this package — not the original speculative plan.

## What's included

```
resources/
  css/app.css              ← Tailwind v4 theme + @source "../js" (fixed — this is what
                              makes Tailwind scan resources/js instead of a dead path)
  js/
    components/{ui, dashboard, register, tenant, pricing}/
    hooks/                 ← use-mobile, use-plan, use-theme (Supabase-based use-session removed)
    layouts/                dashboard-layout, tenant-layout, register-layout, legal-layout
    lib/{utils, id-documents}.ts
    pages/
      dashboard/            index, properties, tenants, finance, maintenance,
                             messages, settings, verification — all with .layout wired
      tenant/                index, lease, pay, maintenance, messages — all with .layout wired
      register/               landlord, tenant
      pricing/                starter, operator, portfolio (shared PlanPage component)
      legal/                  terms, privacy, cookies, dpa, security (new — were 404s before)
      welcome.tsx
routes/web.php              ← full route map, including id-documents/* and legal/*
app/Http/Controllers/IdDocumentController.php
app/Models/{IdDocument, IdDocumentAccessLog}.php
database/migrations/..._create_id_documents_tables.php
```

## How to use this

1. Merge `resources/`, `routes/web.php`, `app/`, and `database/migrations/` into
   your Laravel project. For `routes/web.php` specifically — **merge, don't
   overwrite** if you've made local changes since the last package; diff first.
2. Run `php artisan migrate` to create the `id_documents` and
   `id_document_access_log` tables (and the `role` column on `users`).
3. Run `npm install` if any of these are missing from your `package.json`:
   ```
   npm install @tanstack/react-query recharts embla-carousel-react input-otp \
     react-day-picker date-fns cmdk vaul sonner class-variance-authority \
     tailwind-merge tw-animate-css
   ```
4. `npm run dev` + `php artisan serve` (or Herd), hard refresh.

## Fixes applied during integration (for your reference)

These were all found and fixed working through real errors on your machine —
listed here so you know what changed and why, in case you're comparing against
an earlier copy of this package:

1. **`welcome.tsx`** — leftover TanStack route config block removed; function
   properly named and exported.
2. **`pricing/*.tsx`** — the original `pricing.starter.tsx` secretly exported a
   shared `PlanPage` component used by `operator`/`portfolio`. Extracted into
   `components/pricing/PlanPage.tsx`; all three pages now just consume it.
3. **`tenant-layout.tsx`** — was empty (converter couldn't detect an inline
   arrow-function component). Rebuilt to wrap children in `TenantShell`.
4. **`routes/web.php`** — removed `require __DIR__.'/auth.php'` (doesn't exist;
   Laravel Fortify registers auth routes automatically in this starter kit).
   Kept `require __DIR__.'/settings.php'`.
5. **Dashboard route naming** — the starter kit's own `app-sidebar.tsx` expects
   a route named exactly `dashboard` (no prefix). It's now defined standalone,
   outside the `dashboard.` group.
6. **`resources/js/lib/utils.ts`** — restoring `cn()` from the old repo had
   silently deleted the starter kit's `toUrl()` export, breaking
   `nav-footer.tsx`. Both now coexist in the same file.
7. **`SecureIdUpload.tsx`** — replaced the dead `id-documents.functions`
   import and `useServerFn` wrapper with a real client (`lib/id-documents.ts`)
   hitting actual Laravel endpoints. Replaced the Supabase `useSession` hook
   with Inertia's `usePage().props.auth.user`. Fixed the sign-in link to
   `/login` (the real Fortify route).
8. **`dashboard/verification.tsx`** — same `useServerFn` cleanup, now calls
   five real endpoints backed by `IdDocumentController` (list, review,
   signed URL, access log, my-role).
9. **ID document backend built from scratch** — migration, `IdDocument` +
   `IdDocumentAccessLog` models, and `IdDocumentController` with full
   audit logging on every upload/view/download/review action, mirroring the
   original Supabase RLS-based system.
10. **`pages/auth/sign-in-REFERENCE.tsx` and `hooks/use-session.tsx`** —
    deleted outright. Inertia eagerly globs everything under `pages/`, so a
    reference-only file with a dead Supabase import was crashing Vite even
    though nothing linked to it.
11. **`resources/css/app.css`** — `@source "../src"` (pointed at a
    nonexistent folder) fixed to `@source "../js"`. This is why the whole app
    was rendering unstyled — Tailwind had nothing to scan.
12. **Legal pages** — `/legal/terms`, `/privacy`, `/cookies`, `/dpa`,
    `/security` were linked from the footer but never built. Added all five,
    sharing a `legal-layout.tsx` with a section nav. Content is clearly
    marked as placeholder — get it reviewed by counsel before launch.

## What still needs real backend wiring

Every dashboard/tenant page (properties, tenants, finance, maintenance,
messages) still renders **hardcoded mock data** — only the ID-document
verification system is backed by real tables and a real controller. For each
remaining page:

1. Add the Eloquent model + migration (see `Architecture_RentalHub.docx` from
   earlier in this conversation for the full schema: properties, units,
   tenants, leases, invoices, payments, maintenance_requests).
2. Add a controller method returning
   `Inertia::render('dashboard/properties', ['properties' => $properties])`.
3. Swap the hardcoded array in the page component for the prop.

## Known gap: signed URLs on local disk

`IdDocumentController::signedUrl()` calls `Storage::disk(...)->temporaryUrl()`,
which only works on disks that support it (S3 does; the plain `local` driver
does not). For local dev, either configure a signed Laravel route to serve the
file, or just test this feature against S3/a compatible disk. Left as an
honest gap rather than a fake success response.

## Route reference

Run `php artisan route:list` any time to see the full live picture — this is
more reliable than reading this file, since it reflects whatever's actually
registered in your project right now.
