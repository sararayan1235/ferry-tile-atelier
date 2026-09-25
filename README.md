# S.R. Tile Atelier

A bilingual (Dutch/English), animated, mobile-first appointment website for **S.R. Klus- en Onderhoudswerk**, a self-employed mobile tiler serving Zoetermeer Oost and the Netherlands.

## Local preview

```bash
python3 -m http.server 4173
```

The appointment endpoint requires Cloudflare Pages Functions. For a complete local test, use Wrangler:

```bash
npx wrangler pages dev . --d1=APPOINTMENTS --local
```

## Production setup

1. Create a Cloudflare Pages project backed by this directory.
2. Create a D1 database and apply `schema.sql`.
3. Bind the D1 database to Pages as `APPOINTMENTS`.
4. Add an optional `BOOKING_WEBHOOK_URL` Pages secret that accepts the documented JSON payload and forwards each request to the owner's Telegram, email, or booking system.
5. Deploy and test a valid and invalid appointment submission.

A submitted request is always marked `pending_confirmation`; the site does not claim that a visit is booked until the owner confirms it.
