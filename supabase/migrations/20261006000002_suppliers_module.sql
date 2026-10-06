-- =============================================================================
-- FARMREEM PLATFORM MIGRATION — SUPPLIERS & FARMS MASTER MODULE
-- Version: 20261006000002_suppliers_module.sql
-- =============================================================================

-- 1. Create Required Enums
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'supplier_type_enum') THEN
    CREATE TYPE supplier_type_enum AS ENUM (
      'POULTRY_FARM',
      'WHOLESALE_MANDI',
      'PARTNER_FARM',
      'PROCESSOR',
      'DISTRIBUTOR',
      'OTHER'
    );
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'sourcing_channel_enum') THEN
    CREATE TYPE sourcing_channel_enum AS ENUM (
      'DIRECT_FARM',
      'MANDI_TRADER',
      'CONTRACT_FARMING',
      'INTEGRATOR',
      'OTHER'
    );
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'supplier_status_enum') THEN
    CREATE TYPE supplier_status_enum AS ENUM (
      'PROSPECT',
      'PENDING_VERIFICATION',
      'ACTIVE',
      'ON_HOLD',
      'INACTIVE'
    );
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'supplier_verification_status_enum') THEN
    CREATE TYPE supplier_verification_status_enum AS ENUM (
      'UNVERIFIED',
      'VERIFIED',
      'SUSPENDED'
    );
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'supplier_address_type_enum') THEN
    CREATE TYPE supplier_address_type_enum AS ENUM (
      'FARM_LOCATION',
      'MANDI_WAREHOUSE',
      'BILLING',
      'PICKUP_SOURCE',
      'OTHER'
    );
  END IF;
END $$;

-- 2. Concurrency-Safe Supplier Code Sequence & Helper Function
CREATE SEQUENCE IF NOT EXISTS public.supplier_code_seq START WITH 1 INCREMENT BY 1;

CREATE OR REPLACE FUNCTION public.generate_supplier_code()
RETURNS TEXT AS $$
BEGIN
  RETURN 'FR-SUPP-' || LPAD(nextval('public.supplier_code_seq')::text, 6, '0');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp;

-- 3. Core Tables Creation

-- Suppliers Master Table
CREATE TABLE IF NOT EXISTS public.suppliers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  supplier_code VARCHAR(50) UNIQUE NOT NULL DEFAULT public.generate_supplier_code(),
  legal_name VARCHAR(255) NOT NULL,
  trade_name VARCHAR(255) NULL,
  supplier_type supplier_type_enum NOT NULL,
  sourcing_channel sourcing_channel_enum NOT NULL DEFAULT 'DIRECT_FARM',
  gstin VARCHAR(15) NULL CHECK (gstin IS NULL OR LENGTH(TRIM(gstin)) = 15),
  pan VARCHAR(10) NULL CHECK (pan IS NULL OR LENGTH(TRIM(pan)) = 10),
  status supplier_status_enum NOT NULL DEFAULT 'PROSPECT',
  verification_status supplier_verification_status_enum NOT NULL DEFAULT 'UNVERIFIED',
  assigned_procurement_owner_id UUID NULL REFERENCES public.users(id) ON DELETE RESTRICT,
  notes TEXT NULL,
  created_by UUID NULL REFERENCES public.users(id) ON DELETE SET NULL,
  updated_by UUID NULL REFERENCES public.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Supplier Contacts Table (Child Entity - ON DELETE RESTRICT)
CREATE TABLE IF NOT EXISTS public.supplier_contacts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  supplier_id UUID NOT NULL REFERENCES public.suppliers(id) ON DELETE RESTRICT,
  full_name VARCHAR(255) NOT NULL,
  designation VARCHAR(100) NULL,
  email VARCHAR(255) NULL,
  phone VARCHAR(50) NULL,
  is_primary BOOLEAN NOT NULL DEFAULT false,
  preferred_channel contact_channel_enum NOT NULL DEFAULT 'PHONE',
  status record_status_enum NOT NULL DEFAULT 'ACTIVE',
  notes TEXT NULL,
  created_by UUID NULL REFERENCES public.users(id) ON DELETE SET NULL,
  updated_by UUID NULL REFERENCES public.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT chk_supplier_contact_info CHECK (email IS NOT NULL OR phone IS NOT NULL)
);

-- Supplier Addresses Table (Child Entity - ON DELETE RESTRICT)
CREATE TABLE IF NOT EXISTS public.supplier_addresses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  supplier_id UUID NOT NULL REFERENCES public.suppliers(id) ON DELETE RESTRICT,
  address_type supplier_address_type_enum NOT NULL DEFAULT 'FARM_LOCATION',
  label VARCHAR(100) NULL,
  address_line1 VARCHAR(255) NOT NULL,
  address_line2 VARCHAR(255) NULL,
  city VARCHAR(100) NOT NULL,
  state VARCHAR(100) NOT NULL,
  postal_code VARCHAR(20) NOT NULL,
  country VARCHAR(100) NOT NULL DEFAULT 'India',
  is_primary_pickup BOOLEAN NOT NULL DEFAULT false,
  is_primary_billing BOOLEAN NOT NULL DEFAULT false,
  status record_status_enum NOT NULL DEFAULT 'ACTIVE',
  notes TEXT NULL,
  created_by UUID NULL REFERENCES public.users(id) ON DELETE SET NULL,
  updated_by UUID NULL REFERENCES public.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT chk_supplier_address_pickup_consistency CHECK (NOT (address_type = 'BILLING' AND is_primary_pickup = true))
);

-- 4. Immutable Supplier Code Trigger
CREATE OR REPLACE FUNCTION public.prevent_supplier_code_update()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.supplier_code IS DISTINCT FROM OLD.supplier_code THEN
    RAISE EXCEPTION 'supplier_code is immutable and cannot be modified after creation.';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp;

DROP TRIGGER IF EXISTS trg_prevent_supplier_code_update ON public.suppliers;
CREATE TRIGGER trg_prevent_supplier_code_update
BEFORE UPDATE ON public.suppliers
FOR EACH ROW EXECUTE FUNCTION public.prevent_supplier_code_update();

-- 5. Automatic Updated_At Triggers
DROP TRIGGER IF EXISTS trg_suppliers_updated_at ON public.suppliers;
CREATE TRIGGER trg_suppliers_updated_at BEFORE UPDATE ON public.suppliers FOR EACH ROW EXECUTE FUNCTION public.set_customers_updated_at();

DROP TRIGGER IF EXISTS trg_supplier_contacts_updated_at ON public.supplier_contacts;
CREATE TRIGGER trg_supplier_contacts_updated_at BEFORE UPDATE ON public.supplier_contacts FOR EACH ROW EXECUTE FUNCTION public.set_customers_updated_at();

DROP TRIGGER IF EXISTS trg_supplier_addresses_updated_at ON public.supplier_addresses;
CREATE TRIGGER trg_supplier_addresses_updated_at BEFORE UPDATE ON public.supplier_addresses FOR EACH ROW EXECUTE FUNCTION public.set_customers_updated_at();

-- 6. Partial & Performance Indexes
CREATE UNIQUE INDEX IF NOT EXISTS idx_suppliers_unique_gstin ON public.suppliers (UPPER(TRIM(gstin))) WHERE gstin IS NOT NULL AND status != 'INACTIVE';
CREATE UNIQUE INDEX IF NOT EXISTS idx_supplier_contacts_primary ON public.supplier_contacts (supplier_id) WHERE is_primary = true AND status = 'ACTIVE';
CREATE UNIQUE INDEX IF NOT EXISTS idx_supplier_addresses_primary_pickup ON public.supplier_addresses (supplier_id) WHERE is_primary_pickup = true AND status = 'ACTIVE';
CREATE UNIQUE INDEX IF NOT EXISTS idx_supplier_addresses_primary_billing ON public.supplier_addresses (supplier_id) WHERE is_primary_billing = true AND status = 'ACTIVE';

CREATE INDEX IF NOT EXISTS idx_suppliers_status ON public.suppliers(status);
CREATE INDEX IF NOT EXISTS idx_suppliers_type ON public.suppliers(supplier_type);
CREATE INDEX IF NOT EXISTS idx_suppliers_owner ON public.suppliers(assigned_procurement_owner_id);
CREATE INDEX IF NOT EXISTS idx_supplier_contacts_supplier ON public.supplier_contacts(supplier_id);
CREATE INDEX IF NOT EXISTS idx_supplier_addresses_supplier ON public.supplier_addresses(supplier_id);

-- 7. Atomic Primary Selection RPC Functions

-- Transactional Primary Contact Function
CREATE OR REPLACE FUNCTION public.set_primary_supplier_contact(
  p_supplier_id UUID,
  p_contact_id UUID
)
RETURNS VOID AS $$
BEGIN
  UPDATE public.supplier_contacts
  SET is_primary = false
  WHERE supplier_id = p_supplier_id AND is_primary = true;

  UPDATE public.supplier_contacts
  SET is_primary = true
  WHERE id = p_contact_id AND supplier_id = p_supplier_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp;

-- Transactional Primary Location/Address Function
CREATE OR REPLACE FUNCTION public.set_primary_supplier_address(
  p_supplier_id UUID,
  p_address_id UUID,
  p_is_pickup BOOLEAN,
  p_is_billing BOOLEAN
)
RETURNS VOID AS $$
BEGIN
  IF p_is_pickup THEN
    UPDATE public.supplier_addresses
    SET is_primary_pickup = false
    WHERE supplier_id = p_supplier_id AND is_primary_pickup = true;

    UPDATE public.supplier_addresses
    SET is_primary_pickup = true
    WHERE id = p_address_id AND supplier_id = p_supplier_id;
  END IF;

  IF p_is_billing THEN
    UPDATE public.supplier_addresses
    SET is_primary_billing = false
    WHERE supplier_id = p_supplier_id AND is_primary_billing = true;

    UPDATE public.supplier_addresses
    SET is_primary_billing = true
    WHERE id = p_address_id AND supplier_id = p_supplier_id;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp;

-- 8. Row-Level Security (RLS) Configuration
ALTER TABLE public.suppliers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.supplier_contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.supplier_addresses ENABLE ROW LEVEL SECURITY;

-- Suppliers Policies
DROP POLICY IF EXISTS suppliers_read ON public.suppliers;
CREATE POLICY suppliers_read ON public.suppliers FOR SELECT TO authenticated USING (public.has_permission(auth.uid(), 'suppliers_farms', 'VIEW') OR public.has_permission(auth.uid(), 'suppliers', 'VIEW'));

DROP POLICY IF EXISTS suppliers_create ON public.suppliers;
CREATE POLICY suppliers_create ON public.suppliers FOR INSERT TO authenticated WITH CHECK (public.has_permission(auth.uid(), 'suppliers_farms', 'CREATE') OR public.has_permission(auth.uid(), 'suppliers', 'CREATE'));

DROP POLICY IF EXISTS suppliers_update ON public.suppliers;
CREATE POLICY suppliers_update ON public.suppliers FOR UPDATE TO authenticated USING (public.has_permission(auth.uid(), 'suppliers_farms', 'EDIT') OR public.has_permission(auth.uid(), 'suppliers', 'EDIT')) WITH CHECK (public.has_permission(auth.uid(), 'suppliers_farms', 'EDIT') OR public.has_permission(auth.uid(), 'suppliers', 'EDIT'));

-- Supplier Contacts Policies
DROP POLICY IF EXISTS supplier_contacts_read ON public.supplier_contacts;
CREATE POLICY supplier_contacts_read ON public.supplier_contacts FOR SELECT TO authenticated USING (public.has_permission(auth.uid(), 'suppliers_farms', 'VIEW') OR public.has_permission(auth.uid(), 'suppliers', 'VIEW'));

DROP POLICY IF EXISTS supplier_contacts_create ON public.supplier_contacts;
CREATE POLICY supplier_contacts_create ON public.supplier_contacts FOR INSERT TO authenticated WITH CHECK (public.has_permission(auth.uid(), 'suppliers_farms', 'CREATE') OR public.has_permission(auth.uid(), 'suppliers', 'CREATE'));

DROP POLICY IF EXISTS supplier_contacts_update ON public.supplier_contacts;
CREATE POLICY supplier_contacts_update ON public.supplier_contacts FOR UPDATE TO authenticated USING (public.has_permission(auth.uid(), 'suppliers_farms', 'EDIT') OR public.has_permission(auth.uid(), 'suppliers', 'EDIT')) WITH CHECK (public.has_permission(auth.uid(), 'suppliers_farms', 'EDIT') OR public.has_permission(auth.uid(), 'suppliers', 'EDIT'));

-- Supplier Addresses Policies
DROP POLICY IF EXISTS supplier_addresses_read ON public.supplier_addresses;
CREATE POLICY supplier_addresses_read ON public.supplier_addresses FOR SELECT TO authenticated USING (public.has_permission(auth.uid(), 'suppliers_farms', 'VIEW') OR public.has_permission(auth.uid(), 'suppliers', 'VIEW'));

DROP POLICY IF EXISTS supplier_addresses_create ON public.supplier_addresses;
CREATE POLICY supplier_addresses_create ON public.supplier_addresses FOR INSERT TO authenticated WITH CHECK (public.has_permission(auth.uid(), 'suppliers_farms', 'CREATE') OR public.has_permission(auth.uid(), 'suppliers', 'CREATE'));

DROP POLICY IF EXISTS supplier_addresses_update ON public.supplier_addresses;
CREATE POLICY supplier_addresses_update ON public.supplier_addresses FOR UPDATE TO authenticated USING (public.has_permission(auth.uid(), 'suppliers_farms', 'EDIT') OR public.has_permission(auth.uid(), 'suppliers', 'EDIT')) WITH CHECK (public.has_permission(auth.uid(), 'suppliers_farms', 'EDIT') OR public.has_permission(auth.uid(), 'suppliers', 'EDIT'));

-- Disable Hard Deletes across all 3 tables
REVOKE DELETE ON public.suppliers FROM authenticated, anon;
REVOKE DELETE ON public.supplier_contacts FROM authenticated, anon;
REVOKE DELETE ON public.supplier_addresses FROM authenticated, anon;
