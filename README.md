# S.R. Klus- & Onderhoudswerk — Fine Tile Atelier

Website, customer portal and admin dashboard for a tile atelier in Zoetermeer.

- Bilingual (NL/EN) public site in the "Kalksteen" design: gallery white and limestone, Archivo + Inter
- Online quote requests with a reference number
- Customer portal: sign up with Google, Apple (optional) or email; see every request and its status
- Admin dashboard: confirm, decline or complete requests with a message the customer sees; full status history
- Supabase Postgres with row-level security; status changes are enforced in the database
- Hosted free on Cloudflare Workers via `@opennextjs/cloudflare`

**Going live:** follow [DEPLOY.md](DEPLOY.md).

## Local development

```bash
npm install
cp .env.example .env.local
npm run dev
```

Without Supabase values the public site works and portal routes redirect to `/setup`.

## Quality gates

```bash
npm test
npm run lint
npm run build
```

## Structure

| Path | Purpose |
|---|---|
| `components/public-home.tsx` | Public site (NL/EN copy lives here) |
| `components/booking-form.tsx` | Quote request form → `app/api/appointments/route.ts` |
| `app/dashboard`, `app/admin` | Customer portal and admin dashboard |
| `app/login`, `app/auth/*` | Sign-in, OAuth callback, password reset |
| `middleware.ts` | Protects `/dashboard` and `/admin` (kept as middleware: Cloudflare doesn't run Next 16 `proxy.ts` yet) |
| `supabase/setup.sql` | Complete database setup |
| `lib/business.ts` | Phone number and address used everywhere |
| `legacy-pages/` | Previous static Cloudflare Pages version, kept for reference |

## Security model

- Customers can read only their own profile, appointments and history.
- Appointments are created only by the server route, which validates input, rate-limits and generates the reference.
- Only `admin` profiles can read all requests; status changes go through `transition_appointment`, which checks the role and the allowed transition in the database.
- The service-role key is server-only (a Cloudflare secret). Never prefix it with `NEXT_PUBLIC_` and never commit `.env*.local`.
