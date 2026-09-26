# Going live — S.R. Fine Tile Atelier

Everything below is free except **Apple sign-in** (needs a paid Apple Developer account, about $99/year).
Total time: about 45 minutes. Do the steps in order.

| Piece | Service | Cost |
|---|---|---|
| Website + portal hosting | Cloudflare Workers | Free (100k requests/day) |
| Database + logins | Supabase | Free (see limits at the bottom) |
| Google sign-in | Google Cloud | Free |
| Apple sign-in (optional) | Apple Developer | Paid |

---

## 1. Supabase — database and accounts

1. Go to <https://supabase.com>, sign up, **New project**. Region: *West EU (Frankfurt)* or *West EU (Ireland)*. Save the database password somewhere safe.
2. **SQL Editor → New query**: paste the whole of `supabase/setup.sql` and press **Run**. It should finish with "Success. No rows returned".
3. **Project Settings → API**: you'll need three values:
   - Project URL → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon` / publishable key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `service_role` / secret key → `SUPABASE_SERVICE_ROLE_KEY` (**secret**: never paste it into a chat, email or the browser; see below for where it goes)
4. **Authentication → Emails → SMTP settings**: Supabase's built-in mailer is only meant for testing and won't reliably deliver sign-up and password-reset emails to customers. Connect a free SMTP provider (for example Resend or Brevo, both have free tiers) **or** under **Authentication → Sign In / Providers → Email** turn off *Confirm email*. Google sign-in works without this.

Put the values in `.env.local` (used on this computer) **and** `.env.production.local` (used when building for Cloudflare). Both files are git-ignored:

```
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
NEXT_PUBLIC_SITE_URL=https://sr-fine-tile-atelier.<your-subdomain>.workers.dev
NEXT_PUBLIC_AUTH_PROVIDERS=google
```

(In `.env.local` use `NEXT_PUBLIC_SITE_URL=http://localhost:3000`.)

**Keep `SUPABASE_SERVICE_ROLE_KEY` out of every `.env*` file.** OpenNext bakes all `.env*` values (even development ones) into the Worker. Store it with `npx wrangler secret put SUPABASE_SERVICE_ROLE_KEY` for the live site, and in `.dev.vars` (git-ignored) for `npm run preview` on this computer.

## 2. Google sign-in

1. <https://console.cloud.google.com> → create a project, e.g. "SR Atelier".
2. **APIs & Services → OAuth consent screen**: External; app name "S.R. Fine Tile Atelier"; support email; add the site domain once you have it. Publish the app when testing is done.
3. **Credentials → Create credentials → OAuth client ID → Web application**:
   - Authorized JavaScript origins: your site URL (and `http://localhost:3000`)
   - Authorized redirect URI: `https://<your-project-ref>.supabase.co/auth/v1/callback` (shown in Supabase under **Authentication → Sign In / Providers → Google**)
4. Copy the **Client ID** and **Client secret** into Supabase → **Authentication → Sign In / Providers → Google** → enable → save.

## 3. Apple sign-in (optional, paid)

Needs an Apple Developer Program membership. Follow Supabase's guide: <https://supabase.com/docs/guides/auth/social-login/auth-apple>.
Then set `NEXT_PUBLIC_AUTH_PROVIDERS=google,apple` and deploy again. Until then the Apple button is hidden.

## 4. Cloudflare — put it online

1. Create a free account at <https://dash.cloudflare.com/sign-up>.
2. In this folder:

```bash
npx wrangler login
```

```bash
npx wrangler secret put SUPABASE_SERVICE_ROLE_KEY
```

```bash
npm run deploy
```

The deploy prints the live address, e.g. `https://sr-fine-tile-atelier.<your-subdomain>.workers.dev`.

3. If that address differs from `NEXT_PUBLIC_SITE_URL`, correct it in `.env.production.local` and run `npm run deploy` again.
4. **Own domain (optional)**: Cloudflare dashboard → Workers & Pages → `sr-fine-tile-atelier` → Settings → Domains & Routes → Add custom domain. The domain must be on Cloudflare DNS.

> OpenNext prints a warning that Windows isn't fully supported. If a deploy from Windows ever fails, run the same commands in WSL, or connect the GitHub repository under Workers → Settings → Builds so Cloudflare builds it on Linux.

## 5. Tell Supabase where the site lives

Supabase → **Authentication → URL Configuration**:
- Site URL: your live address
- Redirect URLs: `https://<live-address>/auth/callback` and `http://localhost:3000/auth/callback`

## 6. Make the owner an admin

1. Sign up on the live site (Google or email) with the owner's address.
2. Edit the email in `supabase/promote-admin.sql`, paste it into Supabase **SQL Editor**, run.
3. Sign out and in again: the sidebar now shows **Beheer** (`/admin`).

## 7. Final check

- [ ] Homepage loads on phone and desktop, NL/EN switch works
- [ ] "Doorgaan met Google" signs in and lands on `/dashboard`
- [ ] Email sign-up sends a confirmation email (or is disabled on purpose)
- [ ] "Wachtwoord vergeten" sends a reset email and `/auth/reset` saves the new password
- [ ] A booking from the homepage shows up in the customer's dashboard **and** in `/admin`
- [ ] In `/admin`, **Bevestigen** with a message changes the status; the customer sees the status and the message
- [ ] A customer account cannot open `/admin`

## Free-tier limits worth knowing

- **Supabase Free** pauses a project after a week without any activity; it can be restored from the dashboard. 500 MB database, 50,000 monthly active users.
- **Cloudflare Workers Free**: 100,000 requests per day.

## Commands

| Command | What it does |
|---|---|
| `npm run dev` | Local development at http://localhost:3000 |
| `npm test` / `npm run lint` | Unit tests / lint |
| `npm run preview` | Build and run the real Cloudflare Worker locally (http://localhost:8787) |
| `npm run deploy` | Build and publish to Cloudflare |
