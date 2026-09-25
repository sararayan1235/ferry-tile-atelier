# S.R. Klus- & Onderhoudswerk

A production-oriented Next.js website with:

- Animated Dutch-first public site
- Customer accounts and appointment portal
- RLS-protected admin dashboard
- Supabase Postgres database and Auth
- Vercel Web Analytics (private dashboards excluded)
- Server-side validation, honeypot, request throttling and idempotency

## Local development

```bash
npm install
cp .env.example .env.local
npm run dev
```

Without Supabase environment variables, `/` still works and account routes redirect to `/setup`.

## Supabase setup

1. Create a free Supabase project.
2. Run `supabase/schema.sql` in the SQL editor.
3. Run `supabase/events.sql` in the SQL editor.
4. Add the project URL, publishable/anon key and secret key to Vercel:

```text
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
NEXT_PUBLIC_SITE_URL=https://your-domain.example
```

5. Create the owner account in `/login`.
6. In Supabase SQL Editor, replace the UUID placeholder in `supabase/promote-admin.sql` and run it.
7. Enable MFA for the owner account in Supabase Auth.

`supabase/events.sql` stores every status change as an append-only event and enforces allowed transitions in the database.

The secret key is server-only. Never prefix it with `NEXT_PUBLIC_` and never commit `.env.local`.

## Vercel

```bash
npx vercel
npx vercel --prod
```

Vercel Web Analytics is included through `@vercel/analytics`. Customer and admin routes are filtered from analytics.

## Quality gates

```bash
npm test
npm run lint
npm run build
```

## Security model

- Customers can read only their own appointments.
- Only the `admin` profile role can read all requests or change status.
- Status transitions are checked in the domain layer and server action.
- Public booking inserts use a server-only Supabase client after Supabase Auth verifies the session.
- Administrative pages are blocked by `proxy.ts` and checked again in server components/server actions.
- Request events are append-only to authenticated/admin-readable rows.
