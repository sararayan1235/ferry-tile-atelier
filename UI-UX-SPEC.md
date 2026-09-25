# S.R. Klus- & Onderhoudswerk — Product UI/UX Specification

**Status:** Proposed information architecture and design specification  
**Scope:** Public landing, authentication, customer portal, admin workspace, Vercel + Supabase  
**Languages:** Dutch-first, English-complete  
**Source of truth:** This document for IA, UX, content, security boundaries, and visual behavior.

---

## 1. Product thesis

S.R. should feel like **a quiet digital atelier around a precise mobile trade**: dark stone, warm brass, generous space, exact lines, and no software-like clutter.

The public site sells confidence and craftsmanship. The signed-in product reduces uncertainty around a request. The admin workspace makes the next action obvious and safe. The same brand persists, but the interfaces have different density:

- **Landing:** image-led, cinematic, spacious.
- **Customer portal:** calm, reassuring, low-density.
- **Admin:** compact, operational, information-rich.
- **Login:** one task, one path, minimal distraction.

The memorable impression is: **“Every detail is handled, and I always know where my request stands.”**

---

## 2. Users and jobs to be done

### 2.1 Prospective customer

**Needs:** understand whether S.R. is credible, determine fit, and request an appointment without friction.

**Primary questions:**

1. What work do you do?
2. Is the quality suitable for my home or business?
3. Do you serve my area?
4. What happens after I submit a request?
5. What information do I need to provide?

### 2.2 Returning customer

**Needs:** see the latest state of a request, find an upcoming confirmed visit, and contact S.R. without re-explaining everything.

**Primary questions:**

1. Has my request been reviewed?
2. Is my appointment confirmed?
3. What are the agreed date and visit details?
4. How do I change or cancel it?
5. What did we already submit?

### 2.3 Owner / administrator

**Needs:** triage new requests quickly, make defensible scheduling decisions, keep a clear customer-facing timeline, and avoid losing or leaking personal data.

**Primary questions:**

1. What needs action today?
2. Which requests conflict or are time-sensitive?
3. What information is needed before confirming?
4. What changed, by whom, and when?
5. Which private uploads or customer details are safe to open?

---

## 3. Information architecture

### 3.1 Route map

Use locale-prefixed routes for durable, shareable URLs. Dutch is the default; do not maintain two disconnected applications.

#### Public

| Route | Page | Purpose | Indexing |
|---|---|---|---|
| `/nl` | Home | Brand, proof, services, process, request CTA | Index |
| `/en` | Home | English equivalent | Index |
| `/nl/werk` | Selected work | Project proof and inquiry CTAs | Index |
| `/en/work` | Selected work | English equivalent | Index |
| `/nl/diensten` | Services | Service scope, limits, typical process | Index |
| `/en/services` | Services | English equivalent | Index |
| `/nl/aanvraag` | Request wizard | Create an appointment request | Index |
| `/en/request` | Request wizard | English equivalent | Index |
| `/nl/privacy` | Privacy | Data use, retention, rights, contact | Index |
| `/en/privacy` | Privacy | English equivalent | Index |
| `/nl/cookies` | Cookie settings | Consent choices and vendor details | Index |
| `/en/cookies` | Cookie settings | English equivalent | Index |
| `/nl/voorwaarden` | Terms | Service/commercial terms if applicable | Index |
| `/en/terms` | Terms | English equivalent | Index |
| `/nl/contact` | Contact | Phone, service area, direct contact | Index |
| `/en/contact` | Contact | English equivalent | Index |
| `/auth/**` | Auth callback/verification | Supabase technical callbacks | Never |
| `/nl/toegangscode` | Request access token | Optional email one-time access | Never |

The first release may keep work, services, process, and contact as landing-page sections, but the route names are the intended destinations as content grows.

#### Customer portal

| Route | Purpose |
|---|---|
| `/nl/mijn-aanvragen` | Customer home and request list |
| `/nl/mijn-aanvragen/nieuw` | New request wizard |
| `/nl/mijn-aanvragen/[reference]` | One request, customer-safe timeline, actions, and private files |
| `/nl/account` | Name, phone, preferred language, notification preferences |
| `/nl/account/beveiliging` | Authentication factors and active-session controls |
| `/nl/account/privacy` | Data export/deletion request and consent choices |
| `/en/...` | English equivalents |

Customer routes require an authenticated customer session. They must be excluded from search indexing and analytics session replay.

#### Admin workspace

| Route | Purpose |
|---|---|
| `/nl/beheer` | Today view, counts, next actions |
| `/nl/beheer/aanvragen` | Searchable/filterable request queue |
| `/nl/beheer/aanvragen/[id]` | Review and action workspace |
| `/nl/beheer/kalender` | Confirmed appointment schedule |
| `/nl/beheer/meting` | Privacy-safe business analytics |
| `/nl/beheer/instellingen` | Service availability, notification templates, retention policy |
| `/nl/beheer/audit` | Status changes and privileged events |

Admin routes require an allowlisted admin role **and** MFA. Do not link `/beheer` from the public navigation. Obfuscating the URL is not a security control.

### 3.2 Navigation model

#### Public desktop

- Left: SR mark and wordmark.
- Center: Vakwerk, Diensten, Werkwijze.
- Right: language switch, customer-account link, primary “Afspraak aanvragen.”

#### Public mobile

- Brand and 48px menu button.
- Menu order: primary CTA first, then Vakwerk, Diensten, Werkwijze, Mijn aanvragen, NL/EN.
- Closing the menu returns focus to the trigger; Escape closes it; focus remains trapped while open.

#### Customer portal desktop

- 240px left rail: Overzicht, Mijn aanvragen, Nieuwe aanvraag, Account.
- Top bar: request-search entry (future), language, security/account menu.
- Breadcrumb only on request detail.

#### Customer portal mobile

- 64px top bar with account button.
- Bottom navigation: Home, Aanvragen, Nieuw, Account. Keep labels visible; icons supplement, not replace, them.
- Request detail uses a back link, not a nested dashboard card.

#### Admin desktop

- 232px rail: Vandaag, Aanvragen, Kalender, Meting, Auditlog; Instellingen at bottom.
- Persistent compact status filter at top of request pages.
- 1360px+ may show a three-column request workspace; below that, use tabs or stacked sections.

#### Admin mobile

Admin is optimized for tablet/desktop first, but phone review and status triage must remain safe:

- Top bar plus bottom navigation: Vandaag, Wachtrij, Kalender, Meer.
- Status actions stay visible at the bottom of a request as a sticky action bar only while a request is open.
- Never compress the full admin table into unreadable columns; switch to stacked records.

---

## 4. Cross-product journey model

### 4.1 New request, guest or signed in

1. User chooses service and reads a concise scope note.
2. User selects **Niet zeker? Advies nodig** when appropriate.
3. User enters preferred date/window and essential project context.
4. Contact fields are prefilled for signed-in customers; guests enter them.
5. Review screen clearly states: “Aanvraag ontvangen; nog niet bevestigd.”
6. Submit once; show a durable confirmation page and reference.
7. If signed in, the request appears in the portal.
8. If guest, offer: “Maak een account aan om de status te volgen” using the submitted verified email. Never imply account creation proves ownership without verification.

### 4.2 Review and confirmation

1. Admin opens a pending request.
2. Admin can call or email from the record without exposing raw values in logs.
3. Admin confirms only after date and operational details are agreed.
4. System records who changed the state, when, and from which state.
5. Customer sees a plain-language event and receives email/push notification according to preference.
6. Appointment is only described as confirmed after the transition succeeds.

### 4.3 Decline and completion

- Declined requires a customer-safe reason. Internal notes are never included in customer copy.
- Completed requires a completion timestamp and optional short customer summary. Do not imply a quote/invoice unless one exists.
- A declined or completed request remains readable but not editable by the customer.

---

## 5. Appointment state model

Use the exact persisted states `pending`, `confirmed`, `declined`, and `completed`. Treat “pending confirmation” as the customer label for `pending`, not a fifth state.

| State | Customer meaning | Allowed admin transitions | Customer actions |
|---|---|---|---|
| `pending` | Ontvangen; datum nog niet definitief | → `confirmed`, `declined` | Add information, cancel pending request, contact |
| `confirmed` | Afspraak is definitief | → `completed`; admin may reopen to `pending` only with explicit reason | Reschedule request, cancel, contact |
| `declined` | S.R. kan deze aanvraag niet uitvoeren | Reopen to `pending` only by admin with reason | New request, contact |
| `completed` | Werk is afgerond | Correct to `confirmed` only with explicit reason and audit event | View summary, contact for a new job |

### 5.1 State-transition rules

- Enforce transitions server-side and in the database; buttons alone are not authorization.
- A transition to `confirmed` requires a confirmed start date/time or explicit date policy, contact preference, and locale.
- A transition to `declined` requires a reason code and customer-safe explanation.
- A transition to `completed` requires `completed_at`; backdating requires a reason.
- Every transition creates an append-only event: actor, old state, new state, timestamp, reason code, and optional note.
- Customer-visible events and internal events are different records or projections. Internal notes never enter the customer payload.
- Idempotency keys prevent duplicate transition events during retries.

### 5.2 Customer-facing labels

| State | Dutch | English |
|---|---|---|
| `pending` | In behandeling | Pending review |
| `confirmed` | Bevestigd | Confirmed |
| `declined` | Afgewezen | Declined |
| `completed` | Afgerond | Completed |

Status is always communicated by **text + shape/icon**, never color alone.

---

## 6. Page specifications

## 6.1 Public landing page

### Purpose and hierarchy

The page has one job per section and should be understandable by scanning headings.

1. **Hero — establish craft and action**
   - Full-bleed `hero-bathroom.jpg`, darkened on the left for text safety.
   - Eyebrow: “Mobiele service · Zoetermeer & heel Nederland.”
   - H1: “Vakwerk. Zichtbaar.”
   - Supporting line: concise scope statement.
   - Primary CTA: “Afspraak aanvragen.”
   - Secondary CTA: “Bekijk het vakwerk.”
   - Trust line: Dutch & English; Particulier & zakelijk; Werk heel Nederland.
   - Avoid counters, fake urgency, stock badges, or unsupported claims.

2. **Positioning — why S.R.**
   - Split editorial layout; no card grid.
   - H2: “Een strakke lijn maakt het verschil.”
   - One paragraph and one proof image (`craft-detail.png`).

3. **Selected work — proof**
   - Use a 7/5 asymmetric image composition.
   - `craft-detail.png`: “De perfecte voeg.”
   - `green-kitchen.png`: “Kleur & textuur.”
   - Captions describe observable work, not invented client/location claims.
   - Add a “Bekijk alle projecten” route only when the portfolio has meaningful depth.

4. **Services — scope**
   - Continue the existing numbered list, not generic cards.
   - Services: tegelreparatie; nieuwe installatie; renovatie & herstel; maatwerk & afwerking.
   - Each row links to a relevant request preselection.

5. **Process — certainty**
   - Three authored beats: Aanvragen → Beoordelen → Uitvoeren.
   - Directly below: “Een aanvraag is pas definitief na bevestiging.”
   - Keep it factual; do not promise response times until operationally defined.

6. **Service area and trust**
   - Zoetermeer Oost, Netherlands-wide mobile service, residential and business.
   - Contact options: phone and request form.
   - Only show business identifiers, insurance, certifications, or reviews that have been verified and are current.

7. **Final request CTA**
   - Large ivory band with one action and the privacy summary.
   - No second form embedded in the landing page; navigate to the wizard to avoid duplicate analytics and inconsistent validation.

8. **Footer**
   - Legal name, phone, service area, privacy, cookies, terms, language, and admin access only if desired.
   - Remove the full home address from the footer unless operationally necessary; postcode/city is enough for a mobile service.

### Landing motion

- Keep the authored hero drift/parallax and one-time section reveals.
- Motion duration: 700–1100ms; distance: 20–30px; easing: calm ease-out.
- No auto-advancing carousel, parallax text, looping particles, or cursor effects.
- `prefers-reduced-motion` removes movement while preserving all content.

### Landing states

- Images have exact aspect-ratio boxes and descriptive alt text; failure reveals the background/gradient, not layout collapse.
- CTA navigation is progressively enhanced; keyboard and screen-reader users get the same destination.
- Language switch preserves the current public path and query only when safe; it never carries a post-login redirect to another origin.

---

## 6.2 Login and account access

### Recommended customer method

Use **email one-time code (OTP)** as the default. It avoids password reuse and is appropriate for a low-volume service portal. Magic link can be an alternate method if email-client behavior tests well. Admin access is email + TOTP MFA, optionally passkey in a later phase.

Do not present separate “Sign up” and “Log in” pages initially. Use one page titled **Inloggen** with email entry; the same flow creates or accesses an account after ownership verification. This reduces confusion and account-enumeration risk.

### Login page composition

Desktop:

- Left 42%: cropped craft image, dark overlay, one line: “Volg uw aanvraag op één plek.”
- Right 58%: form on ink background.
- Mobile: compact SR mark and form; no decorative image above the fold.

Form fields:

- E-mailadres.
- One-time code after send; six single-character inputs backed by one accessible field pattern, paste supported.
- Resend with a visible cooldown.
- “Andere methode” only if a real alternative is enabled.

Security behavior:

- Always show: “Als dit adres bekend is, hebben we een code verstuurd.” Do not reveal account existence.
- Apply rate limits by account, IP range, and device signal; use progressive challenge only when risk warrants it.
- OTP expires and is single-use. Never log the code or session token.
- After verification, redirect only to an internal allowlisted path. Reject absolute URLs, protocol-relative URLs, and unapproved locale prefixes.
- Offer an explicit resend rather than automatic redirects.
- Failed attempts use neutral copy; excessive attempts receive temporary throttling.
- Session cookies must be `HttpOnly`, `Secure`, and appropriately `SameSite`; do not store access or refresh tokens in `localStorage`/`sessionStorage`.

Success:

- New customer: “Account geverifieerd. U kunt uw aanvraag volgen.”
- Returning customer: redirect to requested portal path or `/nl/mijn-aanvragen`.
- Preserve unsent request-wizard data in encrypted server-side draft storage keyed to the eventual user, or ask the user to restart; never persist sensitive form data in browser storage.

### Auth error/edge states

- Invalid/expired code: preserve email, focus code field, explain how to request a new one.
- Already-authenticated user visits login: redirect to their permitted destination.
- Customer visits `/beheer`: show neutral “Geen toegang” rather than revealing admin account details.
- Unverified email: resend verification with rate limiting; do not reveal unrelated account information.
- Offline: explain that authentication needs a connection and preserve the email field.
- Auth callback failure: branded recovery page with “Opnieuw proberen” and “Terug naar inloggen.”

---

## 6.3 Customer dashboard

### Page: Mijn aanvragen

**First-viewport order**

1. “Mijn aanvragen” and short privacy reassurance.
2. Primary action: “Nieuwe aanvraag.”
3. Next confirmed visit, if one exists.
4. Pending requests.
5. Recent completed requests.

Use an editorial list with 1px dividers, not a dashboard-card wall.

**Request row fields**

- Reference.
- Service.
- Preferred or confirmed date.
- Status pill with icon/text.
- Last update.
- Explicit “Open aanvraag” affordance.

Sort: active confirmed first by date; then pending by newest; completed by most recent. Allow filters: All / Active / Completed. Search is unnecessary at small scale; add it only when the account has enough records.

**Empty state**

“No requests yet.” Explain the pending → confirmed distinction and offer one primary action: “Nieuwe aanvraag.” Secondary: “Terug naar de website.”

**Error/loading states**

- Skeleton rows preserve final dimensions; never show raw errors.
- If the list fails, say “Aanvragen laden niet” and offer retry; retain navigation.
- Empty search/filter result differs from a true no-request account.

### Page: Request detail

**Header**

- Back to “Mijn aanvragen.”
- Reference, service, state, and created date.
- “Neem contact op” with phone/email actions; do not expose internal notes.

**Primary information**

- Project description.
- Service and space.
- Preferred date/window.
- Confirmed appointment date/window, only if state is confirmed.
- Contact/location details the owner supplied.
- Customer-visible timeline.

**Customer timeline examples**

- “Aanvraag ontvangen — nog niet bevestigd.”
- “S.R. heeft een datum voorgesteld.”
- “Afspraak bevestigd.”
- “Aanvraag afgewezen — reden.”
- “Werk afgerond.”

Do not expose actor IDs, internal reasons, raw webhook state, or database field names.

**Actions by state**

- `pending`: “Informatie toevoegen,” “Aanvraag intrekken,” contact.
- `confirmed`: “Verzoek om wijziging,” “Afspraak annuleren,” contact.
- `declined`: “Nieuwe aanvraag,” contact.
- `completed`: “Samenvatting bekijken,” “Nieuwe aanvraag,” contact.

Destructive actions use a confirmation dialog that names the request, explains consequences, and has a clear cancel action. Cancellation/reschedule is never represented as immediately completed before server confirmation.

**Private files**

- If photos/documents are supported, show file name, type, size, and upload time.
- Preview through short-lived signed URLs; never expose a permanent public object URL.
- Customer can upload only to their own request and only allowed MIME types/sizes.
- Remove files immediately when the upload is replaced or the request is withdrawn; define backup retention separately.

### Page: New request

Use a three-step wizard to reduce cognitive load:

1. **Klus** — service, room, scope, details, optional photos.
2. **Moment & locatie** — postcode/city, preferred date and flexible window, address only if needed for quotation/site visit.
3. **Contact & control** — name, email, phone, preferred contact channel, language, review/submit.

A persistent summary rail shows service/date/location on desktop; on mobile it becomes a collapsible “Overzicht” control.

Rules:

- Do not request exact street address until operationally necessary.
- Explain why sensitive data is requested next to the field, not in a long legal block.
- Use native date/time controls and `autocomplete` tokens.
- Inline validation on blur; full validation on step change and submit.
- Do not erase entered data on recoverable errors.
- Save only to an encrypted, user-associated draft after authentication; guests keep state in memory unless a secure server draft is created.
- Submit button: “Aanvraag versturen.” Confirmation page heading: “Aanvraag ontvangen.” Explicit line: “Dit is nog geen bevestigde afspraak.”

### Page: Account

Tabs or sections:

- **Profiel:** name, phone, preferred language.
- **Meldingen:** email for status changes; optional push later.
- **Privacy:** consent choices, data-use summary, export/delete request.
- **Security:** MFA enrollment, active sessions, sign out everywhere.

Email/identity changes require recent reauthentication. MFA removal requires an existing factor and a clear warning. Customer cancellation/deletion is a request, not an immediate destructive button.

---

## 6.4 Admin dashboard

### Admin access boundary

- Admins are provisioned out of band into a protected role table or server-controlled claim; never self-assign through public signup.
- User-editable `user_metadata` must not determine admin authorization.
- Require MFA for every admin; enforce the AAL2 requirement server-side/RLS, not only in navigation.
- Use a separate admin session policy and shorter idle timeout than customer sessions.
- Reauthenticate before role changes, export, bulk actions, MFA changes, and destructive operations.
- Every privileged action is audit logged. Logs omit OTP, tokens, passwords, full message bodies, and private file URLs.

### Page: Vandaag

A single operational view, not a vanity KPI wall.

**Order**

1. “Vandaag” and current date.
2. Urgent queue: pending older than the team’s configured SLA or appointments needing action.
3. Today’s confirmed visits with call/contact and completion action.
4. Tomorrow / next seven days.
5. Recent status changes.

Do not display conversion percentages as top-line metrics. Those belong in privacy-safe analytics.

### Page: Aanvragen queue

Desktop columns:

- Received.
- Customer name.
- Service.
- Location (postcode/city).
- Preferred date.
- Status.
- Last action.

Controls:

- Search by reference/name/email/phone only for authorized admins.
- Filters: status, service, date range, location, language.
- Saved view: “Nieuwe aanvraagen.”
- Sort default: oldest actionable pending first.
- Row click opens request detail; keyboard users receive a real link/button.

Use a compact ivory/ink alternation by status group, not a rainbow table. Every row keeps text status; color is redundant.

Pagination is server-side once the dataset grows. Never return all request PII to the browser for client-side filtering.

### Page: Admin request workspace

**Header**

- Reference, submitted date, status, and last update.
- Actions: Contact, Confirm, Decline, Complete.
- Save state must be server-confirmed; no optimistic final status before response.

**Main column**

1. Customer contact block.
2. Project and service details.
3. Requested date/window and location.
4. Customer-supplied description.
5. Private attachments.
6. Customer-visible timeline.

**Right rail / secondary tab**

- Internal notes, clearly marked **Intern**.
- Proposed/confirmed appointment details.
- Reason codes and templates.
- Audit timeline.
- Data-retention/deletion status.

#### Confirm flow

Dialog or dedicated panel:

- Confirmed date and time/window.
- Arrival instructions.
- Contact channel.
- Customer-visible message.
- Optional internal note separated below.
- Primary action: “Afspraak bevestigen.”

Before submit, summarize consequences: the customer will be notified and the date will be treated as committed.

#### Decline flow

Required:

- Reason code: outside scope; outside service area; unavailable; unsuitable project; customer withdrew; other.
- Customer-safe explanation.
- Optional follow-up contact permission.
- Primary action: “Aanvraag afwijzen.”

Internal rationale remains in the internal note only.

#### Complete flow

Required:

- Completion date/time.
- Short customer summary, optional.
- Optional internal completion note.
- Primary action: “Werk afronden.”

Do not make this action available before the appointment window unless a deliberate early-completion override is required and audited.

#### Reschedule/correction

Never silently overwrite history. Show “Wijzig bevestiging,” require a customer-facing reason, create a new event, and retain the old confirmed slot in the audit timeline.

### Page: Calendar

- Week view by default; day view on mobile/tablet.
- Show confirmed appointments only in the operational calendar; pending dates appear in a separate “requested dates” layer.
- Avoid exposing exact customer addresses in shared screenshots by default; show postcode/city and reveal full address only on open.
- Dragging a confirmed appointment is not a direct status mutation: it opens a confirmation panel and creates a reschedule event.

### Page: Analytics

Privacy-safe operational metrics only:

- Requests by status.
- New/confirmed/declined/completed by week.
- Median time to first review and confirmation, if timestamps are reliable.
- Service mix and geography at postcode-prefix level.
- Language split.
- Conversion by public source/CTA, excluding form field values and raw free text.

Never put names, emails, phones, exact addresses, request descriptions, file URLs, or stable customer IDs into general web analytics. Exclude customer/admin routes from session replay. Apply aggregate thresholds if reports could reveal a single person.

### Page: Audit log

Filter by:

- Actor.
- Action.
- Request/reference.
- Date range.
- Event type.

Display human events rather than raw database rows. An export action requires recent reauthentication and is itself logged.

---

## 7. Visual system

### 7.1 Direction

**Visual thesis:** black honed stone cut by one warm brass line; editorial photography; quiet operational surfaces.

Retain the existing site’s strongest decisions:

- `#090a0a` ink background.
- `#111313` coal secondary surface.
- `#1a1d1d` graphite raised surface.
- `#f0ede5` ivory text/light section.
- `#d5c5a5` warm secondary accent.
- `#bfa579` brass focus/accent.
- DM Sans for utility/body and Italiana for authored display headings.

Do not introduce purple gradients, neon glow, glassmorphism everywhere, generic SaaS cards, decorative blobs, or a dashboard made entirely of floating rounded panels.

### 7.2 Typography

- **Display:** Italiana, 400 only; tight tracking; no bold faux weight.
- **Body/UI:** DM Sans, 300/400/500.
- **Numerals/data:** DM Sans with tabular numerals for references, dates, and times.
- Minimum body size: 16px; form helper text: 14px; uppercase micro-labels: 12px with adequate line height.
- Avoid all-uppercase paragraphs. It is reserved for short labels and navigation.
- Localized line heights: Dutch and English headings may wrap differently; never lock headings to fixed heights.

Suggested scale:

| Token | Mobile | Desktop | Use |
|---|---:|---:|---|
| Display XL | 56px/0.92 | 112px/0.88 | Landing H1 only |
| Display L | 44px/0.98 | 80px/0.96 | Page/section H1/H2 |
| Title M | 30px/1.05 | 42px/1.05 | Request/service title |
| Title S | 22px/1.15 | 26px/1.15 | Panel heading |
| Body L | 18px/1.6 | 20px/1.6 | Intro copy |
| Body | 16px/1.55 | 16px/1.55 | Default |
| Label | 12px/1.4 | 12px/1.4 | Eyebrow/status metadata |

### 7.3 Spacing and geometry

Use a 4px base with primary steps: 4, 8, 12, 16, 24, 32, 48, 64, 96, 144.

- Content max width: 1440px.
- Reading width: 65–75ch.
- Admin content max width: 1600px.
- Border radius: 0–4px for primary surfaces; pills only for compact status labels.
- Hairline: 1px `rgba(240,237,229,.18)` on dark; use darker neutral on ivory.
- Inputs: minimum 52px desktop, 56px mobile.
- Buttons: minimum 48px high; primary actions full-width on narrow mobile.

### 7.4 Surfaces and contrast

- Default app canvas: ink.
- Secondary navigation/table header: coal.
- Raised interactive surface: graphite, but only when spatial elevation is required.
- Customer detail page and long-form forms may use a large ivory reading plane with ink text, echoing the portfolio sections.
- Admin stays predominantly dark to reduce glare during long sessions.

The existing brass and muted text have strong contrast on ink, but brass fails normal text contrast on ivory. Therefore:

- On ivory, use bronze `#6D5835` for links and labels; reserve brass for rules, decorative marks, and large non-text accents.
- Status colors on dark: text/fill combinations must be tested against their actual surface.
- Light-surface status text alternatives: pending `#6F581F`, confirmed `#245C35`, declined `#7A302A`, completed `#245A65`.
- Never place `#BFA579` body-size text on `#F0EDE5`.

### 7.5 Status components

Each status uses a 28px-high compact label, 4px left marker or small icon, and text:

- Pending: brass diamond outline.
- Confirmed: solid check in a desaturated green field.
- Declined: short diagonal/minus mark in muted rose; never a red “danger” alarm for a business decision.
- Completed: outlined check/finish mark in cool stone-blue.

On ivory, use dark semantic text plus a pale tinted background; on ink, use the lighter semantic foreground and a low-alpha tinted fill.

### 7.6 Imagery

- `hero-bathroom.jpg`: public hero only; not behind login forms at full intensity.
- `craft-detail.png`: proof, process, and restrained auth-side image.
- `green-kitchen.png`: selected-work/editorial color moment.
- Do not reuse the same hero image on every authenticated screen. The portal earns trust through clarity; repeated marketing imagery becomes noise.
- Images should be responsive, optimized, dimensioned, and lazy-loaded below the fold. LCP hero gets priority loading.

### 7.7 Motion

- Landing: authored atmosphere only.
- Portal: 120–180ms state transitions; status change may use a 240ms line-draw or crossfade.
- No page-transition animation that delays interaction.
- No animated count-up metrics.
- Reduced-motion mode removes parallax, drift, and slide transitions.

---

## 8. Component inventory

### Global

- Skip link.
- SR brand lockup.
- Locale switch.
- Primary/secondary/quiet buttons.
- Link with explicit destination.
- Modal/dialog with focus trap and return focus.
- Toast/inline status region.
- Form field with label, help, error, optional counter.
- Date/time, select, textarea, file input.
- Empty, loading, error, offline, and retry states.
- Status label.
- Breadcrumb/back navigation.

### Landing

- Full-bleed hero.
- Editorial section index.
- Asymmetric project figure.
- Numbered service row.
- Process ledger.
- Proof/contact band.
- Footer legal navigation.

### Customer portal

- Request list/row.
- Next-visit summary.
- Customer timeline.
- Request detail definition list.
- Wizard stepper and review summary.
- Account section tabs.
- Privacy control.
- Session/device list.

### Admin

- Operational count strip.
- Filter bar and saved view.
- Dense request table/record list.
- Request workspace.
- Transition panel/dialog.
- Internal-note block.
- Audit event row.
- Week calendar event.
- Privacy-safe chart with tabular fallback.

---

## 9. Responsive behavior

### Landing

- 320px minimum supported width.
- Hero copy overlays the image with a stronger gradient; no tiny text over busy marble.
- 640px: single-column services/process; project images keep stable 4:5 or 3:2 crops.
- 900px: full-screen mobile navigation; sticky header becomes translucent only after scroll.
- 1200px+: maximum editorial whitespace; never stretch body copy beyond 75ch.

### Customer portal

- 320px: single-column request detail, sticky primary action where safe.
- 768px: two-column request summary/timeline.
- 1024px+: persistent rail and split main/secondary content.
- Long emails, addresses, references, and translated messages wrap safely without horizontal scrolling.

### Admin

- 768px minimum recommended; phone support is review/triage, not dense data entry.
- 1024px: rail collapses to icons plus labels or top navigation.
- Sticky filters must not hide content; selected filters remain summarized.
- Tables become record lists. Never hide essential status, date, or customer identity on mobile.

---

## 10. Accessibility requirements

Target **WCAG 2.2 AA** and treat it as release-blocking.

- Semantic headings, landmarks, lists, tables, and definition lists.
- Full keyboard operation; no keyboard trap outside intentional modal behavior.
- Visible focus: 2px brass on dark; 2px dark ink/bronze outline on ivory; at least 3:1 against adjacent colors.
- Touch targets: 44×44 CSS px minimum; primary controls preferably 48px high.
- Contrast: 4.5:1 for normal text and 3:1 for large text/UI boundaries.
- Status uses text and shape, never color alone.
- Error summary links to invalid fields; field errors are programmatic and announced.
- `aria-live="polite"` for save/status updates; avoid announcing entire page refreshes.
- Modals use a labelled title, focus trap, Escape support, and focus restoration.
- OTP supports paste, backspace, screen readers, and does not rely on six separate unlabeled inputs.
- Respect browser text zoom to 200%; no loss of content or function at 400% reflow.
- Captions/transcripts are required for any future video.
- Do not use `autofocus` on the OTP code after email submission unless focus movement is necessary and communicated.

---

## 11. Bilingual content behavior

### Locale model

- Default locale: Dutch.
- English routes mirror Dutch routes.
- Persist preference in an essential language cookie; do not infer from IP.
- Language switch is available on every page, including auth, customer, and admin.
- Store a preferred locale on the user profile, but keep the URL authoritative.
- Use `hreflang` and canonical URLs for public pages only.
- Customer and admin pages are `noindex` and excluded from sitemap generation.

### Content rules

- Translate intent and meaning, not word order.
- Keep status labels short enough for pills; use full explanations in adjacent text.
- Use “S.R.” consistently; “Fine Tile Atelier” is a descriptor, not the legal identity.
- Use “aanvraag” for a request and “afspraak” only after confirmation.
- Phone numbers use Dutch spacing in Dutch UI and a stable international format in transactional email.
- Dates: Dutch `12 juni 2026`; English `12 June 2026`. Times include `CET/CEST` or the visitor’s explicit timezone where relevant.
- Validation messages appear immediately after the field and are available in the page summary.
- All email templates mirror route locale and retain the same state terminology.

### Minimum bilingual microcopy

| Context | Dutch | English |
|---|---|---|
| Landing CTA | Afspraak aanvragen | Request an appointment |
| Login title | Inloggen | Sign in |
| Login neutral response | Als dit adres bekend is, hebben we een code verstuurd. | If this address is known, we sent a code. |
| Portal title | Mijn aanvragen | My requests |
| Pending | In behandeling — nog niet bevestigd | Pending review — not yet confirmed |
| Confirmed | Afspraak bevestigd | Appointment confirmed |
| Empty portal | Nog geen aanvragen | No requests yet |
| Submit | Aanvraag versturen | Send request |
| Success heading | Aanvraag ontvangen | Request received |
| Success reassurance | Dit is nog geen bevestigde afspraak. | This is not a confirmed appointment yet. |
| Internal note | Interne notitie — niet zichtbaar voor klant | Internal note — not visible to customer |

---

## 12. Security and privacy specification

### 12.1 Public request intake

- Allow public submission, but use a server-side rate limit and abuse controls.
- Validate on the server; client validation is convenience only.
- Use a narrow request schema and enum service values; cap all text lengths.
- Normalize email without silently rewriting the user-visible original.
- Escape all user content in email and admin UI. Never render request descriptions as HTML.
- CSRF protection is required for cookie-authenticated mutations. Same-origin checks alone are not a complete CSRF design.
- Do not expose whether a phone/email already has an account.
- Bot mitigation should be proportionate and privacy-aware; do not place invasive trackers on the form.
- Return a generic success response that does not disclose customer/account information.

### 12.2 Authorization model

Authorization is deny-by-default and enforced next to data:

- Customer can select only rows where `customer_user_id = auth.uid()`.
- Admin can select/update only when membership exists in a protected admin-role table and the session is MFA-verified.
- Public/anonymous roles have no direct select access to requests, profiles, notes, audit events, or private files.
- Request insertion is allowed only through a server-controlled flow that sets the authenticated owner itself; a client cannot assign another user ID.
- Internal notes, audit logs, analytics, and attachments have separate policies.
- Public route middleware may redirect for UX, but data access and mutations must independently verify authorization.

### 12.3 Account/request linking

A guest request must not become visible merely because someone knows an email address.

Recommended flow:

1. Guest submits request.
2. System stores it with no account owner and a high-entropy verification/claim token.
3. Token is delivered only to the submitted email and is single-use/expiring.
4. User creates or signs into the account using the same **verified** email.
5. Server verifies ownership and atomically claims eligible requests.
6. Account email changes do not automatically transfer requests; require re-verification and explicit confirmation.

Do not use request references as authentication secrets. A human-readable reference can be short; authorization must still come from the session/verified claim flow.

### 12.4 Admin security

- MFA mandatory; prefer TOTP app over SMS.
- No public admin signup or role self-claim.
- Protect admin route with server authorization and AAL2 enforcement.
- Shorter idle timeout and visible session age.
- Reauthentication for exports, role/permission changes, MFA changes, and bulk/destructive actions.
- One owner may have a break-glass recovery account; credentials stored offline and use monitored recovery procedures. Do not document recovery secrets in the repository.
- Audit: sign-in, failed privileged access, role changes, request views by admins where feasible, exports, state transitions, note creation, file access, and deletion actions.
- Keep internal notes and customer-visible messages clearly separated.

### 12.5 PII minimization and retention

Collect only fields needed to assess and schedule work. Exact street address and private files should be delayed until needed.

Set and document retention periods for:

- Unclaimed guest requests.
- Declined/completed requests.
- Internal notes.
- Uploaded files and backups.
- Authentication/session logs.
- Security/audit logs.
- Analytics aggregates.

Provide customer access, correction, export, objection, and deletion-request paths. Legal copy and actual processor configuration must be reviewed for Dutch/EU obligations; this specification is not legal advice.

### 12.6 Email and notification safety

- Use verified sender domains with SPF, DKIM, and DMARC.
- Never put full request descriptions, phone numbers, access tokens, or private file links in analytics or routine marketing emails.
- Transactional status mail is separated from marketing consent.
- Use opaque, single-use, expiring links for any email-based claim or tracking action.
- Unsubscribe applies to marketing, not essential service messages where a legal basis permits them; explain this in the privacy copy.

### 12.7 Browser and platform controls

- Strict CSP with nonces/hashes; avoid broad `unsafe-inline`.
- HSTS, `X-Content-Type-Options: nosniff`, restrictive `Referrer-Policy`, and clickjacking protection.
- Deny unneeded browser permissions and use a restrictive Permissions Policy.
- Do not cache personalized HTML in shared/CDN caches.
- Do not put secrets, JWTs, PII, or full request data in URLs, analytics payloads, error trackers, or console logs.
- Sanitize error reports to prevent PII leakage.

### 12.8 Private files

- Private bucket by default; RLS on storage objects.
- Allowlist MIME types and size/count limits; verify content, not just extension.
- Generate names unrelated to customer input.
- Serve previews/downloads through short-lived signed URLs after authorization.
- Prevent public caching of sensitive responses where feasible.
- Delete abandoned uploads and define backup expiry.

### 12.9 Analytics and cookies

- Prefer cookieless, aggregate, privacy-first analytics with IP/anonymization controls appropriate to the chosen vendor.
- Do not load non-essential analytics before the required consent where applicable.
- Reject and accept choices are equally accessible; no cookie wall.
- Explain vendor, purpose, data, recipients, retention, and how to change consent.
- Exclude `/account`, `/mijn-aanvragen`, `/beheer`, auth callbacks, and all authenticated content from session replay and behavioral funnels.
- Event taxonomy contains enums and counts, not free text or contact values.

---

## 13. Data and API boundaries for implementation planning

The implementation should expose only the data each screen needs.

### Customer DTO

- Reference, service, safe location, preferred date/window, confirmed date/window, status, customer-safe summary, customer-visible events, own files, permitted actions.

Never include: admin ID, internal note, raw role, audit metadata, other user IDs, abuse score, private webhook payload.

### Admin DTO

- Full operational contact and request details only after admin+MFA authorization.
- Explicit field classification for internal vs customer-visible notes.
- Returned data is scoped to the requested record and permitted action.

### Mutation boundaries

- `create_request`
- `add_request_information`
- `withdraw_request`
- `claim_guest_requests`
- `confirm_request`
- `decline_request`
- `complete_request`
- `request_reschedule`
- `add_internal_note`
- `upload_request_file`
- `export_customer_data`
- `request_account_deletion`

Every mutation validates session, role, ownership, state, input schema, CSRF, and idempotency independently of the client.

---

## 14. Empty, loading, error, and offline states

| Context | Required behavior |
|---|---|
| First-time customer | Explain portal value and request flow; no fake sample data |
| No requests | Warm explanation + primary new-request CTA |
| Filtered to zero | Distinguish from no requests; show active filter and clear action |
| Loading | Stable skeleton; announce once; preserve navigation |
| Slow network | Keep entered values, show elapsed-state copy, allow safe cancellation |
| Offline | Banner + disabled mutation with reason; allow reading cached non-sensitive shell only if policy permits |
| Save failed | Preserve values and focus error summary; never imply success |
| Session expired | Save server-side draft, redirect to login, then resume allowed path |
| Forbidden | Neutral branded 403 with no resource details |
| Missing record | Neutral 404; do not reveal whether another customer’s record exists |
| Rate limited | Explain wait time and provide non-abusive alternate contact path |
| Notification failure | Data transition is authoritative; show “saved, notification pending” operational state rather than rolling back blindly |

---

## 15. Analytics event taxonomy

No PII or free text. Suggested events:

- `landing_cta_selected` with `cta_location`, `locale`, `service_preselected`.
- `request_step_viewed` with step number and locale.
- `request_validation_failed` with field category only.
- `request_submitted` with service enum, locale, signed-in boolean, and coarse region.
- `auth_code_requested` / `auth_completed` with method and outcome, no email.
- `customer_request_opened` with state and locale.
- `admin_request_opened` with state, age bucket, and locale; no identity in analytics payload.
- `request_state_changed` with old/new state and service enum.
- `consent_changed` with category and choice.

Operational dashboards should derive counts from authorized database aggregates rather than replaying customer events.

---

## 16. Content and trust requirements

Before launch, replace or remove all placeholders in the current site, including the masked phone link and full home address if not intentionally public.

Every public claim should have an owner and verification source. Specifically validate:

- Service area wording.
- “Particulier & zakelijk.”
- Any insurance, certification, years in business, response-time, or review claims.
- Project ownership and permission to publish imagery.
- Legal business identity and contact details.
- Privacy/cookie vendor list and retention periods.

Never use urgency such as “Only 2 slots left” unless inventory is real. Never display a success state that says “booked” before `confirmed`.

---

## 17. Acceptance checklist

### IA and navigation

- [ ] Every public CTA has one unambiguous destination.
- [ ] Customer and admin route families are visually and behaviorally distinct.
- [ ] Dutch and English route sets are complete and equivalent.
- [ ] Current location is always identifiable.
- [ ] Mobile navigation supports keyboard, Escape, and focus return.
- [ ] No admin route is linked from the public customer journey.

### Customer experience

- [ ] A guest can request an appointment without an account.
- [ ] A request is never called confirmed while `pending`.
- [ ] Authenticated customers see only their own requests.
- [ ] Guest request claiming requires verified email ownership.
- [ ] Pending, confirmed, declined, and completed states have distinct copy and permitted actions.
- [ ] Every empty/loading/error/offline state is designed.
- [ ] Sensitive form data is not stored in browser storage.

### Admin experience

- [ ] Today view answers “what needs action?”
- [ ] Pending queue is sortable and keyboard accessible.
- [ ] State transitions require appropriate fields and create audit events.
- [ ] Internal and customer-visible notes cannot be confused.
- [ ] Analytics are aggregate and exclude private data.
- [ ] Bulk/export/destructive operations require reauthentication.

### Security/privacy

- [ ] RLS is enabled and tested for every exposed table.
- [ ] Authorization is enforced server-side/near data, not only in middleware or UI.
- [ ] Admin role is protected from user-editable metadata and self-assignment.
- [ ] Admin access requires enforced MFA.
- [ ] CSRF, rate limits, schema validation, output encoding, CSP, and security headers are present.
- [ ] Private files use private storage, RLS, and short-lived signed access.
- [ ] Logs, analytics, URLs, and error reports contain no secrets or unnecessary PII.
- [ ] Retention, deletion/export, consent, and cookie settings are operational.
- [ ] Cross-user, guessed-ID, stale-session, and role-escalation tests pass.

### Visual/accessibility

- [ ] Italiana and DM Sans remain the only primary brand faces.
- [ ] Existing ink/ivory/brass visual cues are preserved across public and app surfaces.
- [ ] Brass is not used as normal text on ivory.
- [ ] Status uses text + shape and meets contrast requirements.
- [ ] Target WCAG 2.2 AA with keyboard and screen-reader testing.
- [ ] Reduced-motion mode removes atmosphere motion.
- [ ] No layout overflow at 320px, 200% zoom, or long translated content.

---

## 18. Recommended delivery order

1. **Foundation:** bilingual routing, design tokens, typography, accessibility baseline, Supabase auth/session integration, security headers.
2. **Public experience:** landing IA, request wizard, confirmation, privacy/cookie foundation.
3. **Customer portal:** own-request list/detail, verified guest claiming, state timeline, file privacy.
4. **Admin minimum viable workflow:** protected queue, request review, confirm/decline/complete, audit events, notifications.
5. **Operations:** calendar, internal notes, analytics aggregates, retention/export/deletion workflows.
6. **Hardening:** authorization matrix tests, abuse/rate-limit tests, accessibility audit, CSP tuning, backup/restore drill, privacy review.

This order protects the highest-value path—request → review → clear status—before adding secondary management features.

---

## 19. Verified technical basis

Supabase documents RLS as row-level authorization for Auth-protected resources.[1] Its MFA guidance says UI enrollment alone is insufficient and requires enforcement in the database, APIs, and server-side rendering; AAL2 is encoded in the session and can gate privileged access.[2]

Supabase also warns that user-editable metadata is not safe for authorization decisions.[3] Private storage buckets are the default access model and support access-controlled downloads and time-limited signed URLs for sensitive files.[4]

OWASP distinguishes authentication from authorization and recommends deny-by-default, least privilege, and a per-object authorization check rather than relying on client UI.[5]

OWASP session guidance calls for TLS and warns against placing authentication tokens in `localStorage` or `sessionStorage` because injected JavaScript can read them.[6] Vercel describes CSP nonces/hashes as an allowlisting mechanism for executable inline content and provides security-header guidance for a production app.[9]

The W3C WCAG 2.2 reference includes accessible-authentication, error-suggestion, focus, target-size, and status-message criteria used in this specification.[7]

The Dutch Data Protection Authority distinguishes functional, limited analytics, and tracking cookies and explains that rejection of non-essential tracking must be a real choice rather than a cookie wall.[8]

Implementation still needs an independent security review and Dutch/EU privacy/legal review.

## Sources

[1] https://supabase.com/docs/guides/auth/row-level-security
[2] https://supabase.com/docs/guides/auth/auth-mfa
[3] https://supabase.com/docs/guides/auth/users
[4] https://supabase.com/docs/guides/storage/buckets/fundamentals
[5] https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html
[6] https://cheatsheetseries.owasp.org/cheatsheets/Session%5FManagement%5FCheat%5FSheet.html
[7] https://www.w3.org/WAI/WCAG22/quickref
[8] https://www.autoriteitpersoonsgegevens.nl/en/themes/internet-and-smart-devices/cookies
[9] https://vercel.com/docs/cdn-security/security-headers
