-- =============================================================================
-- FARMREEM PLATFORM MIGRATION — CUSTOMERS MASTER MODULE
-- Version: 20261006000001_customers_module.sql
-- =============================================================================

-- 1. Create Required Enums
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'customer_type_enum') THEN
    CREATE TYPE customer_type_enum AS ENUM (
      'HOTEL',
      'RESTAURANT',
      'CATERER',
      'INSTITUTION',
      'RETAILER',
      'DISTRIBUTOR',
      'OTHER'
    );
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'customer_status_enum') THEN
    CREATE TYPE customer_status_enum AS ENUM (
      'LEAD',
      'PENDING_VERIFICATION',
      'ACTIVE',
      'ON_HOLD',
      'INACTIVE'
    );
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'commercial_status_enum') THEN
    CREATE TYPE commercial_status_enum AS ENUM (
      'UNAPPROVED',
      'APPROVED',
      'SUSPENDED',
      'CREDIT_HOLD'
    );
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'address_type_enum') THEN
    CREATE TYPE address_type_enum AS ENUM (
      'BILLING',
      'DELIVERY',
      'BOTH'
    );
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'contact_channel_enum') THEN
    CREATE TYPE contact_channel_enum AS ENUM (
      'PHONE',
      'WHATSAPP',
      'EMAIL',
      'NONE'
    );
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'record_status_enum') THEN
    CREATE TYPE record_status_enum AS ENUM (
      'ACTIVE',
      'INACTIVE'
    );
  END IF;
END $$;

-- 2. Concurrency-Safe Customer Code Sequence & Helper Function
CREATE SEQUENCE IF NOT EXISTS public.customer_code_seq START WITH 1 INCREMENT BY 1;

CREATE OR REPLACE FUNCTION public.generate_customer_code()
RETURNS TEXT AS $$
BEGIN
  RETURN 'FR-CUST-' || LPAD(nextval('public.customer_code_seq')::text, 6, '0');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp;

-- 3. Core Tables Creation

-- Customers Table (Master Account)
CREATE TABLE IF NOT EXISTS public.customers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_code VARCHAR(50) UNIQUE NOT NULL DEFAULT public.generate_customer_code(),
  legal_name VARCHAR(255) NOT NULL,
  trade_name VARCHAR(255) NULL,
  customer_type customer_type_enum NOT NULL,
  gstin VARCHAR(15) NULL CHECK (gstin IS NULL OR LENGTH(TRIM(gstin)) = 15),
  pan VARCHAR(10) NULL CHECK (pan IS NULL OR LENGTH(TRIM(pan)) = 10),
  status customer_status_enum NOT NULL DEFAULT 'LEAD',
  commercial_status commercial_status_enum NOT NULL DEFAULT 'UNAPPROVED',
  assigned_account_owner_id UUID NULL REFERENCES public.users(id) ON DELETE RESTRICT,
  notes TEXT NULL,
  created_by UUID NULL REFERENCES public.users(id) ON DELETE SET NULL,
  updated_by UUID NULL REFERENCES public.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Customer Contacts Table (Child Entity - ON DELETE RESTRICT)
CREATE TABLE IF NOT EXISTS public.customer_contacts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID NOT NULL REFERENCES public.customers(id) ON DELETE RESTRICT,
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
  CONSTRAINT chk_contact_info CHECK (email IS NOT NULL OR phone IS NOT NULL)
);

-- Customer Addresses Table (Child Entity - ON DELETE RESTRICT)
CREATE TABLE IF NOT EXISTS public.customer_addresses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID NOT NULL REFERENCES public.customers(id) ON DELETE RESTRICT,
  address_type address_type_enum NOT NULL DEFAULT 'DELIVERY',
  label VARCHAR(100) NULL,
  address_line1 VARCHAR(255) NOT NULL,
  address_line2 VARCHAR(255) NULL,
  city VARCHAR(100) NOT NULL,
  state VARCHAR(100) NOT NULL,
  postal_code VARCHAR(20) NOT NULL,
  country VARCHAR(100) NOT NULL DEFAULT 'India',
  is_primary_delivery BOOLEAN NOT NULL DEFAULT false,
  is_primary_billing BOOLEAN NOT NULL DEFAULT false,
  status record_status_enum NOT NULL DEFAULT 'ACTIVE',
  notes TEXT NULL,
  created_by UUID NULL REFERENCES public.users(id) ON DELETE SET NULL,
  updated_by UUID NULL REFERENCES public.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT chk_address_delivery_consistency CHECK (NOT (address_type = 'BILLING' AND is_primary_delivery = true)),
  CONSTRAINT chk_address_billing_consistency CHECK (NOT (address_type = 'DELIVERY' AND is_primary_billing = true))
);

-- 4. Immutable Customer Code Trigger
CREATE OR REPLACE FUNCTION public.prevent_customer_code_update()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.customer_code IS DISTINCT FROM OLD.customer_code THEN
    RAISE EXCEPTION 'customer_code is immutable and cannot be modified after creation.';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp;

DROP TRIGGER IF EXISTS trg_prevent_customer_code_update ON public.customers;
CREATE TRIGGER trg_prevent_customer_code_update
BEFORE UPDATE ON public.customers
FOR EACH ROW EXECUTE FUNCTION public.prevent_customer_code_update();

-- 5. Automatic Updated_At Triggers
CREATE OR REPLACE FUNCTION public.set_customers_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp;

DROP TRIGGER IF EXISTS trg_customers_updated_at ON public.customers;
CREATE TRIGGER trg_customers_updated_at BEFORE UPDATE ON public.customers FOR EACH ROW EXECUTE FUNCTION public.set_customers_updated_at();

DROP TRIGGER IF EXISTS trg_customer_contacts_updated_at ON public.customer_contacts;
CREATE TRIGGER trg_customer_contacts_updated_at BEFORE UPDATE ON public.customer_contacts FOR EACH ROW EXECUTE FUNCTION public.set_customers_updated_at();

DROP TRIGGER IF EXISTS trg_customer_addresses_updated_at ON public.customer_addresses;
CREATE TRIGGER trg_customer_addresses_updated_at BEFORE UPDATE ON public.customer_addresses FOR EACH ROW EXECUTE FUNCTION public.set_customers_updated_at();

-- 6. Partial & Performance Indexes
CREATE UNIQUE INDEX IF NOT EXISTS idx_customers_unique_gstin ON public.customers (UPPER(TRIM(gstin))) WHERE gstin IS NOT NULL AND status != 'INACTIVE';
CREATE UNIQUE INDEX IF NOT EXISTS idx_customer_contacts_primary ON public.customer_contacts (customer_id) WHERE is_primary = true AND status = 'ACTIVE';
CREATE UNIQUE INDEX IF NOT EXISTS idx_customer_addresses_primary_billing ON public.customer_addresses (customer_id) WHERE is_primary_billing = true AND status = 'ACTIVE';
CREATE UNIQUE INDEX IF NOT EXISTS idx_customer_addresses_primary_delivery ON public.customer_addresses (customer_id) WHERE is_primary_delivery = true AND status = 'ACTIVE';

CREATE INDEX IF NOT EXISTS idx_customers_status ON public.customers(status);
CREATE INDEX IF NOT EXISTS idx_customers_type ON public.customers(customer_type);
CREATE INDEX IF NOT EXISTS idx_customers_owner ON public.customers(assigned_account_owner_id);
CREATE INDEX IF NOT EXISTS idx_contacts_customer ON public.customer_contacts(customer_id);
CREATE INDEX IF NOT EXISTS idx_addresses_customer ON public.customer_addresses(customer_id);

-- 7. Atomic Primary Selection RPC Functions

-- Transactional Primary Contact Function
CREATE OR REPLACE FUNCTION public.set_primary_customer_contact(
  p_customer_id UUID,
  p_contact_id UUID
)
RETURNS VOID AS $$
BEGIN
  -- Unset existing primary active contacts for this customer
  UPDATE public.customer_contacts
  SET is_primary = false
  WHERE customer_id = p_customer_id AND is_primary = true;

  -- Set target contact as primary
  UPDATE public.customer_contacts
  SET is_primary = true
  WHERE id = p_contact_id AND customer_id = p_customer_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp;

-- Transactional Primary Address Function
CREATE OR REPLACE FUNCTION public.set_primary_customer_address(
  p_customer_id UUID,
  p_address_id UUID,
  p_is_billing BOOLEAN,
  p_is_delivery BOOLEAN
)
RETURNS VOID AS $$
BEGIN
  IF p_is_billing THEN
    UPDATE public.customer_addresses
    SET is_primary_billing = false
    WHERE customer_id = p_customer_id AND is_primary_billing = true;

    UPDATE public.customer_addresses
    SET is_primary_billing = true
    WHERE id = p_address_id AND customer_id = p_customer_id;
  END IF;

  IF p_is_delivery THEN
    UPDATE public.customer_addresses
    SET is_primary_delivery = false
    WHERE customer_id = p_customer_id AND is_primary_delivery = true;

    UPDATE public.customer_addresses
    SET is_primary_delivery = true
    WHERE id = p_address_id AND customer_id = p_customer_id;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp;

-- 8. Row-Level Security (RLS) Configuration
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customer_contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customer_addresses ENABLE ROW LEVEL SECURITY;

-- Customers Policies
DROP POLICY IF EXISTS customers_read ON public.customers;
CREATE POLICY customers_read ON public.customers FOR SELECT TO authenticated USING (public.has_permission(auth.uid(), 'customers', 'VIEW'));

DROP POLICY IF EXISTS customers_create ON public.customers;
CREATE POLICY customers_create ON public.customers FOR INSERT TO authenticated WITH CHECK (public.has_permission(auth.uid(), 'customers', 'CREATE'));

DROP POLICY IF EXISTS customers_update ON public.customers;
CREATE POLICY customers_update ON public.customers FOR UPDATE TO authenticated USING (public.has_permission(auth.uid(), 'customers', 'EDIT')) WITH CHECK (public.has_permission(auth.uid(), 'customers', 'EDIT'));

-- Customer Contacts Policies
DROP POLICY IF EXISTS customer_contacts_read ON public.customer_contacts;
CREATE POLICY customer_contacts_read ON public.customer_contacts FOR SELECT TO authenticated USING (public.has_permission(auth.uid(), 'customers', 'VIEW'));

DROP POLICY IF EXISTS customer_contacts_create ON public.customer_contacts;
CREATE POLICY customer_contacts_create ON public.customer_contacts FOR INSERT TO authenticated WITH CHECK (public.has_permission(auth.uid(), 'customers', 'CREATE'));

DROP POLICY IF EXISTS customer_contacts_update ON public.customer_contacts;
CREATE POLICY customer_contacts_update ON public.customer_contacts FOR UPDATE TO authenticated USING (public.has_permission(auth.uid(), 'customers', 'EDIT')) WITH CHECK (public.has_permission(auth.uid(), 'customers', 'EDIT'));

-- Customer Addresses Policies
DROP POLICY IF EXISTS customer_addresses_read ON public.customer_addresses;
CREATE POLICY customer_addresses_read ON public.customer_addresses FOR SELECT TO authenticated USING (public.has_permission(auth.uid(), 'customers', 'VIEW'));

DROP POLICY IF EXISTS customer_addresses_create ON public.customer_addresses;
CREATE POLICY customer_addresses_create ON public.customer_addresses FOR INSERT TO authenticated WITH CHECK (public.has_permission(auth.uid(), 'customers', 'CREATE'));

DROP POLICY IF EXISTS customer_addresses_update ON public.customer_addresses;
CREATE POLICY customer_addresses_update ON public.customer_addresses FOR UPDATE TO authenticated USING (public.has_permission(auth.uid(), 'customers', 'EDIT')) WITH CHECK (public.has_permission(auth.uid(), 'customers', 'EDIT'));

-- Disable Hard Deletes across all 3 tables
REVOKE DELETE ON public.customers FROM authenticated, anon;
REVOKE DELETE ON public.customer_contacts FROM authenticated, anon;
REVOKE DELETE ON public.customer_addresses FROM authenticated, anon;
