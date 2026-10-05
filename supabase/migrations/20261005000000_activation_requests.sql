-- =============================================================================
-- FARMREEM PLATFORM PHASE 1 — TOKENLESS ACTIVATION REQUESTS SCHEMA
-- Migration Version: 20261005000000_activation_requests.sql
-- =============================================================================

CREATE TABLE IF NOT EXISTS public.activation_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  token_hash TEXT UNIQUE NOT NULL,
  email TEXT NOT NULL,
  purpose TEXT NOT NULL DEFAULT 'FIRST_PASSWORD_SETUP',
  status TEXT NOT NULL DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'CLAIMED', 'USED', 'EXPIRED')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  expires_at TIMESTAMPTZ NOT NULL,
  claimed_at TIMESTAMPTZ DEFAULT NULL,
  used_at TIMESTAMPTZ DEFAULT NULL
);

-- Index for fast token_hash lookup during human POST activation
CREATE INDEX IF NOT EXISTS idx_activation_requests_token_hash ON public.activation_requests(token_hash);
CREATE INDEX IF NOT EXISTS idx_activation_requests_email ON public.activation_requests(email);

-- Enable Row Level Security (Service Role bypasses RLS)
ALTER TABLE public.activation_requests ENABLE ROW LEVEL SECURITY;

-- Zero access for anon and authenticated roles
REVOKE ALL ON TABLE public.activation_requests FROM PUBLIC, anon, authenticated;
