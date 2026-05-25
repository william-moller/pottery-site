# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A Next.js e-commerce site for a pottery artist. Sells one-of-a-kind pieces via scheduled "drops." Built with the App Router, TypeScript, Tailwind, Sanity (CMS), Supabase (Postgres), Stripe, and Resend.

## Commands

```bash
npm run dev      # dev server on localhost:3000
npm run build    # production build
npm run lint     # ESLint via Next.js
npm run start    # serve production build
```

No test suite currently.

## Architecture

**Core split: Sanity holds content, Supabase holds live state.**

- **Sanity** — all editorial/product content: product descriptions, photos, pricing, drop schedules, blog posts, about page, homepage, policies. Managed via the embedded studio at `/studio`. Queries use GROQ via `sanityFetch<T>()` in `lib/sanity.ts`.
- **Supabase** — transactional state only: `products` (availability status), `orders`, `subscribers`. `lib/supabase.ts` exports a public anon client (reads) and `getAdminClient()` (server-only writes using service role key).

**Checkout / reservation flow:**
1. Cart is client-side only (Zustand — no DB persistence)
2. `POST /api/checkout` — validates cart, reserves each item in Supabase for 10 min (`status=reserved`, `reserved_until`, `session_id`), then creates a Stripe Checkout session
3. Stripe redirects to success/cancel URLs
4. `POST /api/webhook` — on `checkout.session.completed`: marks items sold, saves order, sends emails via Resend; on `checkout.session.expired`: releases reserved items back to available

This reservation pattern exists specifically because all pieces are one-of-a-kind — it prevents double-selling during concurrent checkouts.

**Sanity schema summary** (`sanity/schemas/`): `product`, `drop` (scheduled release with `goesLiveAt`), `post` (blog), `aboutPage` (singleton), `homePage` (singleton), `policy`. The singletons enforce one-document-only via fixed document IDs.

**API routes** (`app/api/`): `subscribe`, `unsubscribe`, `checkout`, `webhook`. All are Next.js 14 route handlers (`route.ts`). The webhook route requires raw body (not JSON-parsed) for Stripe signature verification.

**Email:** Resend sends welcome emails on subscribe and order confirmations on purchase. Every email includes a token-based unsubscribe link (`/unsubscribe?token=...` → `POST /api/unsubscribe`) for CAN-SPAM/GDPR compliance. Unsubscribes are soft-deleted (`unsubscribed_at` timestamp, not row deletion).

## Build Status (from PLAN.md)

- Phase 1 — Scaffolding, config, layout ✅
- Phase 2 — Content pages (about, blog) wired to Sanity — *in progress*
- Phase 3 — Email subscribe/unsubscribe flow — *partial*
- Phase 4 — Store: product pages, cart UI, Stripe, admin order dashboard — *in progress*
- Phase 5 — SEO, accessibility, launch — *future*

Many pages are skeletons. Key missing pieces: product detail (`/shop/[slug]`), drop pages (`/drops/[slug]`), cart page, checkout result pages, admin dashboard (`/admin/orders`).

## Key Conventions

- App Router throughout — pages default to server components; mark interactive ones `"use client"` (e.g. `Header`, `CountdownTimer`)
- Tailwind only — no UI component library. Custom `clay` (terracotta) and `stone` (gray) color palettes in `tailwind.config.ts`. Serif headings (Playfair Display), sans body (Inter)
- Images via `urlFor()` from `lib/sanity.ts` + Next.js `<Image>` with `cdn.sanity.io` in `remotePatterns`
- TypeScript strict mode enabled

## Required Environment Variables

```
NEXT_PUBLIC_SANITY_PROJECT_ID
NEXT_PUBLIC_SANITY_DATASET
SANITY_API_TOKEN                   # server only

NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY          # server only

STRIPE_SECRET_KEY
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
STRIPE_WEBHOOK_SECRET

RESEND_API_KEY
RESEND_FROM_EMAIL
RESEND_SELLER_EMAIL

NEXT_PUBLIC_SITE_URL               # e.g. http://localhost:3000
ADMIN_PASSWORD                     # for /admin/orders
```

## Updating This File

Update the Architecture section when new major features are added (new routes, schema changes, new integrations). Update Build Status as phases complete.
