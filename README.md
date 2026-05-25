# Pottery Site

A handcrafted e-commerce website for a pottery business. Built with Next.js, Sanity CMS, Supabase, Stripe, and Resend.

See [`PLAN.md`](./PLAN.md) for the full product and architecture plan.

---

## Stack

| Layer | Tool |
|---|---|
| Framework | Next.js 14 (App Router) |
| Styling | Tailwind CSS |
| CMS | Sanity |
| Database | Supabase (Postgres) |
| Payments | Stripe + Stripe Tax |
| Email | Resend |
| Hosting | Vercel |

---

## Getting Started

### 1. Clone and install

```bash
git clone https://github.com/william-moller/pottery-site.git
cd pottery-site
npm install
```

### 2. Set up environment variables

```bash
cp .env.example .env.local
```

Fill in each value in `.env.local`. You'll need accounts at:
- [Sanity](https://sanity.io) — create a project, get project ID
- [Supabase](https://supabase.com) — create a project, run `supabase/schema.sql`
- [Stripe](https://stripe.com) — get API keys, enable Stripe Tax, set up a webhook
- [Resend](https://resend.com) — get API key, verify your sending domain

### 3. Run the database schema

In the Supabase dashboard → SQL Editor, paste and run the contents of `supabase/schema.sql`.

### 4. Run locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Project Structure

```
app/            Next.js pages and API routes
components/     Reusable UI components
sanity/         Sanity CMS schemas and config
lib/            Client helpers (Supabase, Sanity, Stripe, Resend)
supabase/       Database schema SQL
public/         Static assets
```

---

## Deployment

Push to `main` on GitHub — Vercel auto-deploys. Add all environment variables in the Vercel dashboard under Project → Settings → Environment Variables.

---

## Content Management

Your wife can log into Sanity Studio at `https://yourdomain.com/studio` to manage:
- Products (photos, prices, descriptions)
- Drops (scheduled releases with countdown)
- Blog posts / Journal
- About page
- Policy pages

---

## Build Phases

- [x] Phase 1 — Foundation (scaffolding, config, layout) ✅
- [ ] Phase 2 — Content pages (About, Gallery, Blog) wired to Sanity
- [ ] Phase 3 — Email system (subscribe, unsubscribe, welcome email)
- [ ] Phase 4 — Store (products, cart, Stripe, reservations, orders dashboard)
- [ ] Phase 5 — Polish, SEO, accessibility, launch
