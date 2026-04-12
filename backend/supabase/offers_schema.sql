-- ============================================================
-- R+ TELECOM v3.0 — OFFERS TABLE
-- Run this in Supabase SQL Editor
-- ============================================================

CREATE TABLE IF NOT EXISTS public.offers (
  id            TEXT PRIMARY KEY,
  category      TEXT NOT NULL CHECK (category IN ('fibre', '5g', 'adsl', 'mobile', '4g')),
  name          TEXT NOT NULL,
  speed         TEXT DEFAULT '',
  price         NUMERIC(10, 2) NOT NULL,
  fondation_price NUMERIC(10, 2) NOT NULL DEFAULT 0,
  service_fee   NUMERIC(10, 2) NOT NULL DEFAULT 0,
  router_fee    NUMERIC(10, 2) NOT NULL DEFAULT 0,
  features      TEXT[] DEFAULT '{}',
  is_active     BOOLEAN NOT NULL DEFAULT TRUE,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Auto-update timestamp trigger
CREATE OR REPLACE FUNCTION update_offers_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_offer_updated_at
  BEFORE UPDATE ON public.offers
  FOR EACH ROW
  EXECUTE FUNCTION update_offers_timestamp();

-- RLS policies
ALTER TABLE public.offers ENABLE ROW LEVEL SECURITY;

-- Allow public read of active offers
CREATE POLICY "Public can read active offers"
  ON public.offers FOR SELECT
  USING (is_active = TRUE);

-- Allow service role full access (for backend)
CREATE POLICY "Service role full access to offers"
  ON public.offers FOR ALL
  USING (auth.role() = 'service_role');
