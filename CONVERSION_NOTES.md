# Conversion Notes

See `README.md` for the full list of fixes applied during integration — this
file previously listed per-file TODOs, most of which are now resolved. What's
left open:

## Pages still using hardcoded mock data (not wired to a database)

- `pages/dashboard/index.tsx`
- `pages/dashboard/properties.tsx`
- `pages/dashboard/tenants.tsx`
- `pages/dashboard/finance.tsx`
- `pages/dashboard/maintenance.tsx`
- `pages/dashboard/messages.tsx`
- `pages/dashboard/settings.tsx`
- `pages/tenant/index.tsx`
- `pages/tenant/lease.tsx`
- `pages/tenant/pay.tsx`
- `pages/tenant/maintenance.tsx`
- `pages/tenant/messages.tsx`

Each needs: a migration + Eloquent model, a controller method passing real
data via `Inertia::render(..., [...])`, and the mock array in the page
component swapped for the prop. `pages/dashboard/verification.tsx` is the
one page already wired to a real backend (`IdDocumentController`) — use it
as the reference pattern.

## Resolved (kept for history)

- `welcome.tsx`, `pricing/*.tsx`, `tenant-layout.tsx` — conversion script
  artifacts, all fixed (see README §"Fixes applied").
- `routes/web.php` naming (`dashboard` route, missing `auth.php`) — fixed.
- `lib/utils.ts` missing `toUrl` export — fixed.
- `SecureIdUpload.tsx`, `dashboard/verification.tsx` — dead `useServerFn`
  calls replaced with a real client (`lib/id-documents.ts`) and backend.
- `pages/auth/sign-in-REFERENCE.tsx`, `hooks/use-session.tsx` — deleted
  (Supabase-based, unused, was crashing Vite's eager page glob).
- `resources/css/app.css` — `@source` path fixed, site now renders styled.
- Legal pages (`terms`, `privacy`, `cookies`, `dpa`, `security`) — built,
  were previously linked but 404ing.
