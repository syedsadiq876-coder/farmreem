-- =============================================================================
-- FARMREEM PLATFORM MIGRATION — SELLER TAX PROFILES FOUNDATION
-- Version: 20261007000002_seller_tax_profiles_module.sql
-- =============================================================================

-- 1. Create Verification Enum
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'seller_tax_verification_status_enum') THEN
    CREATE TYPE seller_tax_verification_status_enum AS ENUM (
      'DRAFT',
      'VERIFIED',
      'SUSPENDED',
      'INACTIVE'
    );
  END IF;
END $$;

-- 2. Concurrency-Safe Sequence & Code Generator
CREATE SEQUENCE IF NOT EXISTS public.seller_tax_profile_code_seq START WITH 1 INCREMENT BY 1;
REVOKE ALL ON SEQUENCE public.seller_tax_profile_code_seq FROM PUBLIC, anon, authenticated;

CREATE OR REPLACE FUNCTION public.generate_seller_tax_profile_code()
RETURNS TEXT AS $$
BEGIN
  RETURN 'FR-TAX-' || LPAD(nextval('public.seller_tax_profile_code_seq')::text, 6, '0');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp;

REVOKE EXECUTE ON FUNCTION public.generate_seller_tax_profile_code() FROM PUBLIC, anon, authenticated;

-- 3. Core Table: public.seller_tax_profiles
CREATE TABLE IF NOT EXISTS public.seller_tax_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_code VARCHAR(50) UNIQUE NOT NULL DEFAULT public.generate_seller_tax_profile_code(),
  organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE RESTRICT,
  legal_entity_name VARCHAR(255) NOT NULL,
  trade_name VARCHAR(255) NULL,
  gstin VARCHAR(15) UNIQUE NOT NULL CHECK (LENGTH(TRIM(gstin)) = 15),
  pan VARCHAR(10) NULL CHECK (pan IS NULL OR LENGTH(TRIM(pan)) = 10),
  registered_address_line1 VARCHAR(255) NOT NULL,
  registered_address_line2 VARCHAR(255) NULL,
  city VARCHAR(100) NOT NULL,
  state_name VARCHAR(100) NOT NULL,
  gst_state_code VARCHAR(2) NOT NULL CHECK (LENGTH(TRIM(gst_state_code)) = 2),
  postal_code VARCHAR(20) NOT NULL,
  country VARCHAR(100) NOT NULL DEFAULT 'India',
  is_primary_seller BOOLEAN NOT NULL DEFAULT false,
  is_active BOOLEAN NOT NULL DEFAULT true,
  verification_status seller_tax_verification_status_enum NOT NULL DEFAULT 'DRAFT',
  verified_by UUID NULL REFERENCES public.users(id) ON DELETE SET NULL,
  verified_at TIMESTAMPTZ NULL,
  created_by UUID NULL REFERENCES public.users(id) ON DELETE SET NULL,
  updated_by UUID NULL REFERENCES public.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT chk_seller_tax_gstin_state_prefix CHECK (SUBSTRING(TRIM(UPPER(gstin)) FROM 1 FOR 2) = TRIM(gst_state_code))
);

-- 4. Code Generation & Immutability Triggers

CREATE OR REPLACE FUNCTION public.seller_tax_profiles_set_code()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.profile_code IS NULL OR TRIM(NEW.profile_code) = '' THEN
    NEW.profile_code := public.generate_seller_tax_profile_code();
  END IF;
  -- Normalize GSTIN & PAN
  IF NEW.gstin IS NOT NULL THEN
    NEW.gstin := UPPER(TRIM(NEW.gstin));
  END IF;
  IF NEW.pan IS NOT NULL THEN
    NEW.pan := UPPER(TRIM(NEW.pan));
  END IF;
  IF NEW.gst_state_code IS NOT NULL THEN
    NEW.gst_state_code := TRIM(NEW.gst_state_code);
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp;

REVOKE EXECUTE ON FUNCTION public.seller_tax_profiles_set_code() FROM PUBLIC, anon, authenticated;

DROP TRIGGER IF EXISTS trg_seller_tax_profiles_set_code ON public.seller_tax_profiles;
CREATE TRIGGER trg_seller_tax_profiles_set_code
BEFORE INSERT ON public.seller_tax_profiles
FOR EACH ROW EXECUTE FUNCTION public.seller_tax_profiles_set_code();

-- Immutable Profile Code Trigger
CREATE OR REPLACE FUNCTION public.prevent_seller_tax_profile_code_update()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.profile_code IS DISTINCT FROM OLD.profile_code THEN
    RAISE EXCEPTION 'profile_code is immutable and cannot be modified after creation.';
  END IF;
  -- Normalize GSTIN & PAN on update
  IF NEW.gstin IS NOT NULL THEN
    NEW.gstin := UPPER(TRIM(NEW.gstin));
  END IF;
  IF NEW.pan IS NOT NULL THEN
    NEW.pan := UPPER(TRIM(NEW.pan));
  END IF;
  IF NEW.gst_state_code IS NOT NULL THEN
    NEW.gst_state_code := TRIM(NEW.gst_state_code);
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public, pg_temp;

REVOKE EXECUTE ON FUNCTION public.prevent_seller_tax_profile_code_update() FROM PUBLIC, anon, authenticated;

DROP TRIGGER IF EXISTS trg_prevent_seller_tax_profile_code_update ON public.seller_tax_profiles;
CREATE TRIGGER trg_prevent_seller_tax_profile_code_update
BEFORE UPDATE ON public.seller_tax_profiles
FOR EACH ROW EXECUTE FUNCTION public.prevent_seller_tax_profile_code_update();

-- Updated At Trigger
CREATE OR REPLACE FUNCTION public.set_seller_tax_profiles_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public, pg_temp;

REVOKE EXECUTE ON FUNCTION public.set_seller_tax_profiles_updated_at() FROM PUBLIC, anon, authenticated;

DROP TRIGGER IF EXISTS trg_seller_tax_profiles_updated_at ON public.seller_tax_profiles;
CREATE TRIGGER trg_seller_tax_profiles_updated_at BEFORE UPDATE ON public.seller_tax_profiles FOR EACH ROW EXECUTE FUNCTION public.set_seller_tax_profiles_updated_at();

-- 5. Indexes & Primary Seller Organization Uniqueness
CREATE UNIQUE INDEX IF NOT EXISTS idx_seller_tax_primary_per_org ON public.seller_tax_profiles (organization_id)
WHERE is_primary_seller = true AND is_active = true;

CREATE INDEX IF NOT EXISTS idx_seller_tax_org ON public.seller_tax_profiles(organization_id);
CREATE INDEX IF NOT EXISTS idx_seller_tax_state_code ON public.seller_tax_profiles(gst_state_code);
CREATE INDEX IF NOT EXISTS idx_seller_tax_status ON public.seller_tax_profiles(verification_status, is_active);

-- 6. Row-Level Security (RLS) Configuration
ALTER TABLE public.seller_tax_profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS seller_tax_profiles_read ON public.seller_tax_profiles;
CREATE POLICY seller_tax_profiles_read ON public.seller_tax_profiles FOR SELECT TO authenticated USING (public.has_permission(auth.uid(), 'settings', 'VIEW') OR public.has_permission(auth.uid(), 'quotations', 'VIEW'));

DROP POLICY IF EXISTS seller_tax_profiles_create ON public.seller_tax_profiles;
CREATE POLICY seller_tax_profiles_create ON public.seller_tax_profiles FOR INSERT TO authenticated WITH CHECK (public.has_permission(auth.uid(), 'settings', 'EDIT'));

DROP POLICY IF EXISTS seller_tax_profiles_update ON public.seller_tax_profiles;
CREATE POLICY seller_tax_profiles_update ON public.seller_tax_profiles FOR UPDATE TO authenticated USING (public.has_permission(auth.uid(), 'settings', 'EDIT')) WITH CHECK (public.has_permission(auth.uid(), 'settings', 'EDIT'));

-- Disable Hard Deletes
REVOKE DELETE ON public.seller_tax_profiles FROM authenticated, anon, PUBLIC;
