-- Subscriptions table
CREATE TABLE IF NOT EXISTS subscriptions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  offer_id TEXT NOT NULL,
  offer_name TEXT NOT NULL,
  offer_category TEXT NOT NULL,
  client_name TEXT NOT NULL,
  client_email TEXT NOT NULL,
  client_phone TEXT NOT NULL,
  client_cin TEXT NOT NULL,
  client_address TEXT,
  is_fondation BOOLEAN DEFAULT false,
  base_price NUMERIC NOT NULL,
  discount NUMERIC DEFAULT 0,
  service_fee NUMERIC DEFAULT 0,
  router_fee NUMERIC DEFAULT 0,
  total_price NUMERIC NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending','approved','rejected')),
  cin_url TEXT,
  fondation_card_url TEXT,
  contract_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

-- Policy: anyone can insert (for the public sign-up flow)
CREATE POLICY "Anyone can create subscription"
  ON subscriptions FOR INSERT WITH CHECK (true);

-- Policy: only service role can read/update (managed by our backend)
CREATE POLICY "Service role full access"
  ON subscriptions FOR ALL USING (auth.role() = 'service_role');

-- Create a function to update the updated_at column
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create a trigger to call the function
CREATE TRIGGER update_subscriptions_updated_at
BEFORE UPDATE ON subscriptions
FOR EACH ROW
EXECUTE PROCEDURE update_updated_at_column();

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_subscriptions_status ON subscriptions(status);
CREATE INDEX IF NOT EXISTS idx_subscriptions_category ON subscriptions(offer_category);
CREATE INDEX IF NOT EXISTS idx_subscriptions_created ON subscriptions(created_at);

-- Storage bucket for documents (run this in Supabase Storage dashboard or via API)
-- Typical SQL for Supabase to create a bucket programmatically:
-- INSERT INTO storage.buckets (id, name, public) VALUES ('documents', 'documents', false) ON CONFLICT (id) DO NOTHING;
