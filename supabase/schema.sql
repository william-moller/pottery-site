-- ─────────────────────────────────────────────────────────────────────────────
-- Pottery Site — Supabase / Postgres Schema
-- Run this in the Supabase SQL editor to set up all tables.
-- ─────────────────────────────────────────────────────────────────────────────

-- Email subscribers
CREATE TABLE subscribers (
  id                uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  email             text        UNIQUE NOT NULL,
  unsubscribe_token uuid        DEFAULT gen_random_uuid() NOT NULL,
  unsubscribed_at   timestamptz,                      -- NULL = active subscriber
  source            text        DEFAULT 'website',
  created_at        timestamptz DEFAULT now()
);

-- Fast token lookups for unsubscribe links
CREATE INDEX idx_subscribers_token ON subscribers(unsubscribe_token);

-- ─────────────────────────────────────────────────────────────────────────────

-- Live inventory state for each product.
-- Content (name, price, photos) lives in Sanity.
-- This table only tracks real-time availability.
CREATE TABLE products (
  sanity_id       text        PRIMARY KEY,  -- matches _id in Sanity
  status          text        NOT NULL DEFAULT 'available'
                              CHECK (status IN ('available', 'reserved', 'sold')),
  reserved_until  timestamptz,              -- NULL unless status = 'reserved'
  session_id      text,                     -- which checkout session holds the reservation
  updated_at      timestamptz DEFAULT now()
);

-- Automatically update updated_at on any change
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER products_updated_at
  BEFORE UPDATE ON products
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- ─────────────────────────────────────────────────────────────────────────────

-- Orders — one row per completed Stripe checkout session
CREATE TABLE orders (
  id              uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  stripe_session  text        UNIQUE NOT NULL,
  customer_email  text        NOT NULL,
  customer_name   text,
  items           jsonb       NOT NULL,    -- array of sanity_id strings + snapshot of names/prices
  total_cents     integer     NOT NULL,
  status          text        NOT NULL DEFAULT 'paid'
                              CHECK (status IN ('paid', 'shipped', 'delivered', 'refunded')),
  shipping_addr   jsonb,                   -- full address object from Stripe
  notes           text,                    -- internal seller notes
  created_at      timestamptz DEFAULT now(),
  updated_at      timestamptz DEFAULT now()
);

CREATE TRIGGER orders_updated_at
  BEFORE UPDATE ON orders
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- Index for the admin orders dashboard (newest first)
CREATE INDEX idx_orders_created_at ON orders(created_at DESC);
CREATE INDEX idx_orders_status ON orders(status);

-- ─────────────────────────────────────────────────────────────────────────────
-- Row Level Security
-- The service role key (used in API routes) bypasses RLS.
-- The anon key (used client-side) is restricted to read-only on products.
-- ─────────────────────────────────────────────────────────────────────────────

ALTER TABLE subscribers ENABLE ROW LEVEL SECURITY;
ALTER TABLE products    ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders      ENABLE ROW LEVEL SECURITY;

-- Public can read product availability (to show sold/reserved badges)
CREATE POLICY "Public can read product status"
  ON products FOR SELECT
  USING (true);

-- No other public access — all writes go through the service role in API routes
