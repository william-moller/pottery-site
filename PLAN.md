# Pottery Business Website — Project Plan (v2)

## Overview

A beautiful, responsive website for a pottery business serving four purposes:
1. **Portfolio / About** — showcase the artist and her work
2. **Store** — sell pieces directly to customers, including scheduled "drop" releases
3. **Mailing List** — collect and manage email subscribers for sale announcements
4. **CMS** — your wife manages all content herself, no code required

---

## Recommended Tech Stack

### Core Stack

| Layer | Tool | Why |
|---|---|---|
| Framework | **Next.js 14+** (App Router) | React-based, SSR/SSG, API routes, image optimization |
| Styling | **Tailwind CSS** | Utility-first, responsive by default, fast to iterate |
| CMS | **Sanity** | Friendly visual editor; she manages products, bio, blog, photos herself |
| Database | **Supabase** | Postgres DB for subscribers, orders, drop scheduling |
| Payments | **Stripe** | Industry standard; handles checkout, tax, shipping |
| Email | **Resend** | Transactional + broadcast emails; built-in unsubscribe compliance |
| Hosting | **Vercel** | Perfect Next.js integration, free tier, global CDN |

> **Note on Sanity vs. "optional":** In v1 of this plan, Sanity was listed as optional. Given that your wife needs to manage content independently, **it is now a core part of the stack**, not an add-on. It's a friendly content editor that lives at something like `yourdomain.com/studio` — she'll log in, see a clean interface, and manage everything from there.

### Why This Stack?
- **Free or very cheap** to start — all services have generous free tiers
- **No lock-in** — you own all your data and code
- **One language** — TypeScript/JavaScript end-to-end
- **Scales naturally** as the business grows

---

## What Your Wife Controls (No Code Required)

Via the **Sanity Studio** editor, she can independently:

| Content | What she can do |
|---|---|
| **Products** | Add new pieces, upload photos, set prices, write descriptions, set category |
| **Drops** | Create a new drop, set its go-live date/time, assign products to it |
| **Blog / Journal** | Write posts with text, photos, headings — like a simple word processor |
| **About page** | Update her bio, swap her photo, edit her artist statement |
| **Gallery** | Add/remove portfolio photos, reorder them |
| **Homepage** | Update the hero image, featured pieces, any promotional banners |

Everything she saves in Sanity publishes to the live site automatically (or on a schedule she sets).

---

## Repository Structure

```
pottery-site/
├── app/                          # Next.js App Router pages
│   ├── page.tsx                  # Home / Hero
│   ├── about/page.tsx            # About the artist
│   ├── gallery/page.tsx          # Portfolio / gallery
│   ├── shop/
│   │   ├── page.tsx              # Shop index (current + upcoming drops)
│   │   └── [slug]/page.tsx       # Individual product page
│   ├── drops/
│   │   └── [slug]/page.tsx       # Drop preview page (with countdown)
│   ├── blog/
│   │   ├── page.tsx              # Blog index
│   │   └── [slug]/page.tsx       # Individual post
│   ├── cart/page.tsx             # Cart
│   ├── checkout/page.tsx         # Stripe checkout
│   ├── unsubscribe/page.tsx      # One-click unsubscribe landing page
│   ├── policies/
│   │   └── [slug]/page.tsx       # Privacy Policy, Shipping Policy, Returns Policy
│   ├── admin/
│   │   └── orders/page.tsx       # Password-protected seller order dashboard
│   └── api/
│       ├── subscribe/route.ts    # Email signup endpoint
│       ├── unsubscribe/route.ts  # Unsubscribe via token
│       ├── checkout/route.ts     # Stripe session creation
│       └── webhook/route.ts      # Stripe payment confirmation + seller notification email
│
├── components/
│   ├── layout/                   # Header, Footer, Nav
│   ├── home/                     # Hero, featured pieces, upcoming drop teaser
│   ├── shop/                     # ProductCard, Cart, SoldOut badge, CountdownTimer
│   ├── drops/                    # DropPreviewCard, DropCountdown
│   ├── blog/                     # PostCard, PostBody
│   ├── admin/                    # OrderTable, StatusBadge, MarkShippedButton
│   ├── gallery/                  # Masonry grid, lightbox
│   └── ui/                       # Buttons, inputs, modals
│
├── sanity/                       # Sanity CMS configuration
│   ├── schemas/
│   │   ├── product.ts            # Product content type
│   │   ├── drop.ts               # Drop (scheduled release) type
│   │   ├── post.ts               # Blog post type
│   │   ├── policy.ts             # Policy pages (privacy, shipping, returns)
│   │   ├── aboutPage.ts          # About page singleton
│   │   └── homePage.ts           # Homepage content singleton
│   └── sanity.config.ts
│
├── lib/
│   ├── supabase.ts               # Supabase client
│   ├── sanity.ts                 # Sanity fetch helpers
│   ├── stripe.ts                 # Stripe client
│   └── resend.ts                 # Email client
│
├── public/                       # Static assets
├── .env.local                    # API keys (never committed)
└── README.md
```

---

## Database Schema (Supabase / Postgres)

Products and content live in Sanity. Supabase handles transactional data: subscribers, orders.

```sql
-- Email subscribers
CREATE TABLE subscribers (
  id                uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email             text UNIQUE NOT NULL,
  unsubscribe_token uuid DEFAULT gen_random_uuid(), -- unique token for one-click unsubscribe
  unsubscribed_at   timestamptz,                    -- null = active, set = unsubscribed
  created_at        timestamptz DEFAULT now(),
  source            text DEFAULT 'website'
);

-- Index for fast token lookups (used in unsubscribe links)
CREATE INDEX idx_subscribers_token ON subscribers(unsubscribe_token);

-- Orders (Stripe handles payment, this tracks fulfillment)
CREATE TABLE orders (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  stripe_session  text UNIQUE NOT NULL,
  customer_email  text NOT NULL,
  customer_name   text,
  items           jsonb NOT NULL,          -- snapshot of what was ordered + prices
  total_cents     integer NOT NULL,
  status          text DEFAULT 'pending',  -- pending → paid → shipped → delivered
  shipping_addr   jsonb,
  created_at      timestamptz DEFAULT now()
);
```

---

## Sanity Content Schema (What She Edits)

```
Product
  ├── name (text)
  ├── slug (auto-generated URL)
  ├── description (rich text)
  ├── price (number)
  ├── stock (number — usually 1 for one-of-a-kind)
  ├── images (multiple photo uploads)
  ├── category (select: bowls / mugs / vases / plates / other)
  ├── drop (reference → Drop, optional)
  └── active (toggle — hide without deleting)

Drop  ← the "scheduled release" feature
  ├── name (e.g. "Spring Collection 2026")
  ├── slug
  ├── description
  ├── preview_image
  ├── goes_live_at (date + time picker)  ← KEY FIELD
  └── products (list of Product references)

Blog Post
  ├── title
  ├── slug
  ├── published_at
  ├── cover_image
  ├── body (rich text with embedded photos)
  └── excerpt (short summary for cards)

About Page (singleton — only one exists)
  ├── bio (rich text)
  ├── portrait_photo
  ├── artist_statement
  └── press_mentions (optional list)

Home Page (singleton)
  ├── hero_image
  ├── hero_tagline
  ├── featured_products (references)
  └── upcoming_drop (reference → Drop)

Policy Page (three instances: privacy / shipping / returns)
  ├── title
  ├── slug  (e.g. 'privacy-policy', 'shipping-policy', 'returns-policy')
  ├── body (rich text — she can update these herself over time)
  └── last_updated (date)
```

---

## Key Features — Implementation Notes

### 1. Email Signup & Unsubscribe

**Signup flow:**
- Email input in the footer and/or a hero banner
- POST to `/api/subscribe` → validate email → insert into Supabase with a unique `unsubscribe_token`
- Send a welcome email via Resend with a one-click unsubscribe link in the footer

**Every email sent must include an unsubscribe link:**
```
https://yourdomain.com/unsubscribe?token=<their-unsubscribe_token>
```
Clicking it hits `/api/unsubscribe`, sets `unsubscribed_at = now()`, and shows a confirmation page. No account needed, no password, one click.

**Compliance note:** This pattern satisfies CAN-SPAM (US) and GDPR (EU) requirements for opt-out. Resend also enforces this automatically for any broadcast emails sent through their platform.

**Exporting the list for mass sends:**
- Query `SELECT email FROM subscribers WHERE unsubscribed_at IS NULL` in Supabase
- Export as CSV → import into any sending platform (Resend broadcasts, Mailchimp, etc.)
- Or use Resend's broadcast feature directly — it handles unsubscribes automatically

---

### 2. Drop / Scheduled Release System

This is the "preview now, buy later" feature for new collections.

**How it works:**
1. Your wife creates a Drop in Sanity, assigns products to it, and sets a `goes_live_at` datetime
2. Products in an upcoming drop are immediately visible on the site but display as **"Coming Soon"** with a live countdown timer
3. The add-to-cart button is hidden/disabled until `goes_live_at` is reached
4. At the exact scheduled time, the site automatically shows them as purchasable — **no manual action required**
5. Customers can browse and preview pieces, see prices, and get excited — they just can't buy yet

**Technical implementation:**
```typescript
// On any product page or card:
const isLive = drop ? new Date() >= new Date(drop.goes_live_at) : true;

// In the UI:
{isLive ? (
  <AddToCartButton product={product} />
) : (
  <CountdownTimer goesLiveAt={drop.goes_live_at} />
)}
```

The countdown timer is client-side JavaScript — it counts down in real time with no server involvement. When it hits zero, the button appears automatically.

**Drop preview page** (`/drops/spring-2026`):
- Full page dedicated to the upcoming drop
- Shows all pieces in the collection with their preview photos and prices
- Large countdown clock
- Email signup CTA: "Get notified the moment this drop goes live"
- This page can be linked from email announcements, Instagram bio, etc.

---

### 3. Store, Cart & Inventory Locking

**The one-of-a-kind problem:** Without careful handling, two customers could simultaneously view the same available piece, both click "buy," and both complete a purchase — resulting in the same piece being sold twice. To prevent this, the site uses a **reservation system**.

**Reservation flow:**
1. Customer clicks "Checkout" → site immediately writes a reservation to Supabase:
   `status = 'reserved', reserved_until = now() + 10 minutes, session_id = <their session>`
2. If another customer tries to buy the same piece during that window, they see **"Just claimed — check back soon"** before entering any payment details
3. Stripe payment completes → webhook fires → item flips to `status = 'sold'` permanently
4. If the first customer abandons checkout, the reservation expires automatically after 10 minutes and the item becomes available again

This catches conflicts early — before Stripe is ever involved — so no customer gets a bad surprise mid-checkout.

**Supabase products table (holds live inventory state):**
```sql
CREATE TABLE products (
  sanity_id       text PRIMARY KEY,   -- matches the Sanity product ID
  status          text DEFAULT 'available',  -- available | reserved | sold
  reserved_until  timestamptz,
  session_id      text,
  updated_at      timestamptz DEFAULT now()
);
```
Content (name, price, photos, description) lives in Sanity. This table only tracks the live availability state.

**Cart & checkout:**
- Cart state managed client-side with **Zustand**
- Reservation is created the moment checkout begins, not when added to cart
- Stripe Checkout Session created after reservation succeeds
- Stripe webhook confirms payment → order saved to `orders` table → confirmation email sent
- Sold-out pieces can remain visible in a "Past Work" section automatically

---

### 4. Blog / Journal
- Your wife writes posts in Sanity's editor — it works like a simple word processor with photo embedding
- Posts render on the site as beautiful editorial pages
- Can be used to share: process photos, kiln updates, inspiration, behind-the-scenes
- Good for SEO — fresh content helps the site rank in Google over time

---

### 5. Shipping

**Current plan: flat-rate, domestic (US) only.**

A flat shipping rate is set inside Stripe — e.g. "$12 for all orders" — and automatically added at checkout. No carrier integration needed. Simple, reliable, easy to change later.

**On your question about carrier APIs:** Yes, this exists and it's very good. Services like **EasyPost** and **Shippo** aggregate every major carrier (USPS, UPS, FedEx, DHL) under a single API. You give them the package weight, dimensions, origin zip, and destination zip — they return live rates from all carriers in real time. The customer sees "USPS Priority Mail — $9.40" or "UPS Ground — $11.20" and picks one.

The architecture is designed to support this upgrade without rebuilding the checkout flow — swapping flat-rate for calculated rates later is a contained change. For now, flat-rate keeps things simple at launch.

**Practical shipping notes for pottery:**
- Pottery is heavy and fragile — packaging materials (bubble wrap, double-boxing) add meaningful weight
- Set the flat rate conservatively enough to cover the worst case (a heavy vase to California)
- Consider offering free shipping above a purchase threshold (e.g. free over $150) — this is easy to configure in Stripe and encourages larger orders

---

### 6. Taxes

**Stripe Tax** is enabled from day one. It automatically calculates the correct sales tax rate based on the customer's shipping address, handles nexus rules by state, and includes the tax amount in the Stripe payment. No manual rate tables, no spreadsheets.

The one setup step: in the Stripe dashboard, enable Stripe Tax and mark your products as "general physical goods." Stripe handles everything after that. At tax time, Stripe provides a full report of taxes collected by state.

---

### 7. Seller Order Notifications & Dashboard

**Email notifications (at launch):** Every time an order is confirmed by Stripe's webhook, an email is sent to your wife's address with the full order details — what was purchased, buyer name, shipping address, and order total. This is sufficient for a small operation.

**Simple order management page:** Rather than making her dig into the Supabase dashboard, a lightweight password-protected admin page at `/admin/orders` will show:
- All orders sorted by date, newest first
- Status badge per order (paid / shipped / delivered)
- One-click to mark an order as shipped (updates status in Supabase, optionally sends the customer a shipping notification)

This is a small addition to Phase 4 but makes her daily workflow much more manageable than raw database access.

---

### 8. Legal Pages

Three pages are required before launch — both for legal compliance and customer trust. Your wife can write the content in Sanity; the pages are just standard content pages in Next.js.

| Page | Why it's needed |
|---|---|
| **Privacy Policy** | Legally required any time you collect email addresses. Describes what data you collect and how it's used. |
| **Shipping Policy** | Tells customers what to expect: flat rate amount, estimated delivery window, domestic only. |
| **Returns & Refunds Policy** | What happens if a piece arrives cracked? Define the window, process, and any exceptions. |

These can be simple, plain-English pages — they don't need to be written by a lawyer for a small business, but they do need to exist. Add a `policy` content type in Sanity so she can edit them herself over time.

---

### 9. Photography Workflow

The practical flow from piece to published:

1. **Photograph** — phone camera is fine; consistent neutral background, natural light, multiple angles
2. **Edit** (optional) — basic brightness/color correction in Apple Photos or Lightroom Mobile
3. **Upload** — open Sanity Studio on phone or laptop, open the product, tap the image field, upload directly from camera roll or files
4. **Publish** — hit "Publish" in Sanity; photo appears on the live site within seconds

Sanity automatically optimizes and resizes images for web on upload, so she doesn't need to think about file sizes or formats. The Next.js `<Image>` component then serves the right size for each screen automatically.

**Tip:** Create a "staging" toggle on products in Sanity — she can upload photos and fill in details days before a drop without anything going live until she's ready.

---

### 10. Custom Email Domain

All customer-facing emails (welcome, order confirmation, shipping notification) should come from a branded address like `hello@[hername].com` or `orders@[businessname].com` — not a Gmail address, which looks unprofessional and increases spam risk.

**This is blocked on having a business name and domain**, which you don't have yet. That's fine. During development, a personal Gmail works as a placeholder. Before launch:

1. Register the domain (via Namecheap, Cloudflare, or Google Domains — ~$12/year)
2. Add DNS records that Resend provides (proves you own the domain)
3. Update `RESEND_FROM_EMAIL` in the environment variables

The code is written to use an environment variable for the from-address, so this swap is a one-line config change when the time comes.

---

### 11. Responsive Design
- Tailwind handles mobile-first responsive design with `sm:`, `md:`, `lg:` breakpoints
- Gallery: CSS masonry grid (or `react-masonry-css`) for a natural, organic feel suited to pottery photography
- Navigation: hamburger menu on mobile, full nav on desktop
- Countdown timers and product cards tested on real iOS and Android devices before launch

---

## Phases / Build Order

### Phase 1 — Foundation (Week 1–2)
- [ ] Initialize Next.js + Tailwind project
- [ ] Set up Sanity project and define all content schemas
- [ ] Set up Supabase (subscribers + orders tables)
- [ ] Deploy skeleton to Vercel and connect custom domain early
- [ ] Build layout: header, footer, navigation

### Phase 2 — CMS & Content Pages (Week 2–4)
- [ ] Connect Next.js to Sanity (fetching helpers)
- [ ] About page (pulls from Sanity singleton)
- [ ] Blog index + post pages
- [ ] Gallery / Portfolio page with masonry photo grid
- [ ] Homepage with hero + featured products
- [ ] Have your wife populate initial content in Sanity Studio — get her comfortable with it

### Phase 3 — Email System (Week 3–4)
- [ ] Email signup component + `/api/subscribe` route
- [ ] Unsubscribe token generation on signup
- [ ] `/api/unsubscribe` route + confirmation page
- [ ] Welcome email template via Resend
- [ ] Test full subscribe → email → unsubscribe flow

### Phase 4 — Store (Week 4–6)
- [ ] Shop index page (active products + upcoming drops)
- [ ] Individual product pages
- [ ] Drop preview page with countdown timer
- [ ] Shopping cart (Zustand)
- [ ] Stripe integration with Stripe Tax enabled: checkout session + webhook
- [ ] Flat-rate shipping configured in Stripe dashboard
- [ ] Inventory reservation system (Supabase products table + expiry logic)
- [ ] Buyer order confirmation email via Resend
- [ ] Seller order notification email via Resend
- [ ] Admin order dashboard (`/admin/orders`) with mark-as-shipped
- [ ] Legal pages: Privacy Policy, Shipping Policy, Returns Policy (content in Sanity)
- [ ] Test full purchase flow end-to-end including reservation collision scenario

### Phase 5 — Polish & Launch Prep (Week 6–8)
- [ ] Mobile responsiveness audit on real devices (iPhone + Android)
- [ ] SEO: meta tags, Open Graph images, sitemap.xml, robots.txt
- [ ] Performance: image optimization, lazy loading, Lighthouse audit
- [ ] Accessibility: keyboard navigation, screen reader labels, color contrast
- [ ] Analytics: Vercel Analytics or Plausible (privacy-friendly, no cookie banner needed)
- [ ] Soft launch to friends/family for feedback
- [ ] Load first products and run a test drop end-to-end

---

## Environment Variables Needed

```env
# Sanity
NEXT_PUBLIC_SANITY_PROJECT_ID=
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_API_TOKEN=               # server-side only

# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=      # server-side only, never expose to browser

# Stripe
STRIPE_SECRET_KEY=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
STRIPE_WEBHOOK_SECRET=

# Resend
RESEND_API_KEY=
RESEND_FROM_EMAIL=hello@yourdomain.com

# App
NEXT_PUBLIC_SITE_URL=https://yourdomain.com
```

---

## Cost Estimate (Monthly, at launch scale)

| Service | Free Tier | Paid if needed |
|---|---|---|
| Vercel | Free for personal projects | $20/mo Pro |
| Sanity | Free up to 3 users, 10GB assets | $15/mo Growth |
| Supabase | 500MB DB, 1GB storage free | $25/mo Pro |
| Resend | 3,000 emails/mo free | $20/mo for 50k |
| Stripe | No monthly fee | 2.9% + 30¢ per transaction |
| Stripe Tax | Included with Stripe | — |
| Domain | ~$12/year | — |

**Total at launch: ~$12/year** until the business outgrows the free tiers.

---

## Later / Nice-to-Have

- **Calculated shipping rates** — upgrade from flat-rate to live carrier rates via EasyPost or Shippo; architecture already supports this swap
- **Instagram feed integration** — pull her pottery photos directly from her IG account
- **Waitlist for sold items** — "Notify me if this style returns"
- **Gift wrapping / gift notes** — Stripe supports custom checkout fields
- **Shipping label generation** — EasyPost or ShipStation; print labels from the admin dashboard
- **Wholesale / trade inquiries** — a simple contact form for restaurants, interior designers, etc.
- **Customer accounts** — order history, saved addresses (Supabase Auth handles this)

---

## Getting Started Commands

```bash
# Create the Next.js app
npx create-next-app@latest pottery-site --typescript --tailwind --app
cd pottery-site

# Install dependencies
npm install @supabase/supabase-js stripe @stripe/stripe-js resend zustand next-sanity @sanity/image-url

# Create the Sanity project (run from inside pottery-site/)
npm create sanity@latest -- --project pottery-site --dataset production --template clean
```

Then create accounts at: **Sanity → Supabase → Stripe → Resend → Vercel** (deploy via GitHub integration).
