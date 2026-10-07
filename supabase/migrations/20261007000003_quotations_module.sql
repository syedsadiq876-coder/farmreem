-- =============================================================================
-- FARMREEM PLATFORM MIGRATION — QUOTATIONS MODULE V1
-- Version: 20261007000003_quotations_module.sql
-- =============================================================================

-- 1. Create Required Enums
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'quotation_status_enum') THEN
    CREATE TYPE quotation_status_enum AS ENUM (
      'DRAFT',
      'PENDING_APPROVAL',
      'APPROVED',
      'INTERNAL_REJECTED',
      'SENT',
      'ACCEPTED',
      'DECLINED',
      'EXPIRED',
      'SUPERSEDED',
      'CANCELLED'
    );
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'quotation_tax_type_enum') THEN
    CREATE TYPE quotation_tax_type_enum AS ENUM (
      'INTRA_STATE',
      'INTER_STATE',
      'EXEMPT',
      'ZERO_RATED'
    );
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'quotation_price_source_enum') THEN
    CREATE TYPE quotation_price_source_enum AS ENUM (
      'CUSTOMER_CONTRACT',
      'BASE_SELLING'
    );
  END IF;
END $$;

-- 2. Concurrency-Safe Sequence & Code Generator
CREATE SEQUENCE IF NOT EXISTS public.quotation_number_seq START WITH 1 INCREMENT BY 1;
REVOKE ALL ON SEQUENCE public.quotation_number_seq FROM PUBLIC, anon, authenticated;

CREATE OR REPLACE FUNCTION public.generate_quotation_number()
RETURNS TEXT AS $$
BEGIN
  RETURN 'FR-QTN-' || LPAD(nextval('public.quotation_number_seq')::text, 6, '0');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp;

REVOKE EXECUTE ON FUNCTION public.generate_quotation_number() FROM PUBLIC, anon, authenticated;

-- 3. Master Quotations Table (Header)
CREATE TABLE IF NOT EXISTS public.quotations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  quotation_number VARCHAR(50) NOT NULL DEFAULT public.generate_quotation_number(),
  revision_number INT NOT NULL DEFAULT 1,
  root_quotation_id UUID NULL REFERENCES public.quotations(id) ON DELETE RESTRICT,
  parent_quotation_id UUID NULL REFERENCES public.quotations(id) ON DELETE RESTRICT,
  
  -- Seller Identity Snapshots (Populated at Issuance)
  seller_tax_profile_id UUID NULL REFERENCES public.seller_tax_profiles(id) ON DELETE RESTRICT,
  seller_legal_name_snapshot VARCHAR(255) NULL,
  seller_gstin_snapshot VARCHAR(15) NULL,
  seller_registered_address_snapshot JSONB NULL,
  seller_state_name_snapshot VARCHAR(100) NULL,
  seller_state_code_snapshot VARCHAR(2) NULL,
  
  -- Customer Identity & Contact Snapshots
  customer_id UUID NOT NULL REFERENCES public.customers(id) ON DELETE RESTRICT,
  customer_legal_name_snapshot VARCHAR(255) NOT NULL,
  customer_code_snapshot VARCHAR(50) NOT NULL,
  customer_gstin_snapshot VARCHAR(15) NULL,
  contact_id UUID NULL REFERENCES public.customer_contacts(id) ON DELETE RESTRICT,
  contact_name_snapshot VARCHAR(255) NULL,
  contact_phone_snapshot VARCHAR(50) NULL,
  contact_email_snapshot VARCHAR(255) NULL,
  billing_address_id UUID NULL REFERENCES public.customer_addresses(id) ON DELETE RESTRICT,
  billing_address_snapshot JSONB NULL,
  delivery_address_id UUID NULL REFERENCES public.customer_addresses(id) ON DELETE RESTRICT,
  delivery_address_snapshot JSONB NULL,
  place_of_supply_state_name_snapshot VARCHAR(100) NOT NULL,
  place_of_supply_state_code_snapshot VARCHAR(2) NOT NULL,
  
  -- Status, Tax & Validity Controls
  status quotation_status_enum NOT NULL DEFAULT 'DRAFT',
  tax_type quotation_tax_type_enum NOT NULL DEFAULT 'INTRA_STATE',
  is_interstate_supply BOOLEAN NOT NULL DEFAULT false,
  issued_at TIMESTAMPTZ NULL,
  valid_until TIMESTAMPTZ NULL,
  currency VARCHAR(3) NOT NULL DEFAULT 'INR',
  
  -- Financial Totals
  subtotal NUMERIC(14, 4) NOT NULL DEFAULT 0.0000,
  tax_total NUMERIC(14, 4) NOT NULL DEFAULT 0.0000,
  cgst_total NUMERIC(14, 4) NOT NULL DEFAULT 0.0000,
  sgst_total NUMERIC(14, 4) NOT NULL DEFAULT 0.0000,
  igst_total NUMERIC(14, 4) NOT NULL DEFAULT 0.0000,
  grand_total NUMERIC(14, 4) NOT NULL DEFAULT 0.0000,
  
  -- Commercial Terms & Notes
  payment_terms TEXT NULL,
  delivery_terms TEXT NULL,
  notes TEXT NULL,
  
  -- Conversion Control
  converted_order_id UUID UNIQUE NULL,
  converted_at TIMESTAMPTZ NULL,
  
  -- Audit Timestamps & Actors
  created_by UUID NULL REFERENCES public.users(id) ON DELETE SET NULL,
  updated_by UUID NULL REFERENCES public.users(id) ON DELETE SET NULL,
  approved_by UUID NULL REFERENCES public.users(id) ON DELETE SET NULL,
  approved_at TIMESTAMPTZ NULL,
  sent_at TIMESTAMPTZ NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  CONSTRAINT chk_qtn_validity_dates CHECK (valid_until IS NULL OR issued_at IS NULL OR valid_until > issued_at),
  CONSTRAINT chk_qtn_subtotal_non_negative CHECK (subtotal >= 0),
  CONSTRAINT chk_qtn_grand_total_non_negative CHECK (grand_total >= 0)
);

-- 4. Line Items Table (Quotation Items with Pricing Engine Snapshot)
CREATE TABLE IF NOT EXISTS public.quotation_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  quotation_id UUID NOT NULL REFERENCES public.quotations(id) ON DELETE RESTRICT,
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE RESTRICT,
  product_sku_snapshot VARCHAR(50) NOT NULL,
  product_name_snapshot VARCHAR(255) NOT NULL,
  product_category_snapshot VARCHAR(50) NOT NULL,
  quantity NUMERIC(12, 3) NOT NULL,
  uom VARCHAR(50) NOT NULL,
  unit_price NUMERIC(12, 4) NOT NULL,
  currency VARCHAR(3) NOT NULL DEFAULT 'INR',
  price_source_type quotation_price_source_enum NOT NULL,
  price_list_id UUID NULL REFERENCES public.price_lists(id) ON DELETE RESTRICT,
  price_list_code_snapshot VARCHAR(50) NULL,
  price_list_item_id UUID NULL REFERENCES public.price_list_items(id) ON DELETE RESTRICT,
  pricing_version_snapshot INT NOT NULL DEFAULT 1,
  pricing_resolved_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  
  -- Tax Breakdown
  tax_rate_percent NUMERIC(6, 3) NOT NULL DEFAULT 0.000,
  taxable_amount NUMERIC(14, 4) NOT NULL,
  cgst_amount NUMERIC(14, 4) NOT NULL DEFAULT 0.0000,
  sgst_amount NUMERIC(14, 4) NOT NULL DEFAULT 0.0000,
  igst_amount NUMERIC(14, 4) NOT NULL DEFAULT 0.0000,
  line_tax_total NUMERIC(14, 4) NOT NULL DEFAULT 0.0000,
  line_grand_total NUMERIC(14, 4) NOT NULL,
  
  notes TEXT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  CONSTRAINT chk_qtn_item_qty_positive CHECK (quantity > 0),
  CONSTRAINT chk_qtn_item_price_non_negative CHECK (unit_price >= 0),
  CONSTRAINT chk_qtn_item_tax_non_negative CHECK (tax_rate_percent >= 0)
);

-- 5. Family Uniqueness & Revision Constraints
ALTER TABLE public.quotations DROP CONSTRAINT IF EXISTS uq_quotations_number_revision;
ALTER TABLE public.quotations ADD CONSTRAINT uq_quotations_number_revision UNIQUE (quotation_number, revision_number);

ALTER TABLE public.quotations DROP CONSTRAINT IF EXISTS uq_quotations_root_revision;
ALTER TABLE public.quotations ADD CONSTRAINT uq_quotations_root_revision UNIQUE (root_quotation_id, revision_number);

-- 6. Code Generation & Immutable Triggers

CREATE OR REPLACE FUNCTION public.quotations_set_number()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.quotation_number IS NULL OR TRIM(NEW.quotation_number) = '' THEN
    NEW.quotation_number := public.generate_quotation_number();
  END IF;
  IF NEW.revision_number = 1 AND NEW.root_quotation_id IS NULL THEN
    NEW.root_quotation_id := NEW.id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp;

REVOKE EXECUTE ON FUNCTION public.quotations_set_number() FROM PUBLIC, anon, authenticated;

DROP TRIGGER IF EXISTS trg_quotations_set_number ON public.quotations;
CREATE TRIGGER trg_quotations_set_number
BEFORE INSERT ON public.quotations
FOR EACH ROW EXECUTE FUNCTION public.quotations_set_number();

-- Immutable Quotation Code & Revision Trigger
CREATE OR REPLACE FUNCTION public.prevent_quotation_revision_update()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.quotation_number IS DISTINCT FROM OLD.quotation_number OR
     NEW.revision_number IS DISTINCT FROM OLD.revision_number OR
     NEW.root_quotation_id IS DISTINCT FROM OLD.root_quotation_id OR
     NEW.parent_quotation_id IS DISTINCT FROM OLD.parent_quotation_id THEN
    RAISE EXCEPTION 'Quotation family identity and revision fields are immutable after creation.';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public, pg_temp;

REVOKE EXECUTE ON FUNCTION public.prevent_quotation_revision_update() FROM PUBLIC, anon, authenticated;

DROP TRIGGER IF EXISTS trg_prevent_quotation_revision_update ON public.quotations;
CREATE TRIGGER trg_prevent_quotation_revision_update
BEFORE UPDATE ON public.quotations
FOR EACH ROW EXECUTE FUNCTION public.prevent_quotation_revision_update();

-- Updated At Triggers
CREATE OR REPLACE FUNCTION public.set_quotations_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public, pg_temp;

REVOKE EXECUTE ON FUNCTION public.set_quotations_updated_at() FROM PUBLIC, anon, authenticated;

DROP TRIGGER IF EXISTS trg_quotations_updated_at ON public.quotations;
CREATE TRIGGER trg_quotations_updated_at BEFORE UPDATE ON public.quotations FOR EACH ROW EXECUTE FUNCTION public.set_quotations_updated_at();

DROP TRIGGER IF EXISTS trg_quotation_items_updated_at ON public.quotation_items;
CREATE TRIGGER trg_quotation_items_updated_at BEFORE UPDATE ON public.quotation_items FOR EACH ROW EXECUTE FUNCTION public.set_quotations_updated_at();

-- 7. Indexes
CREATE INDEX IF NOT EXISTS idx_quotations_customer ON public.quotations(customer_id);
CREATE INDEX IF NOT EXISTS idx_quotations_status ON public.quotations(status);
CREATE INDEX IF NOT EXISTS idx_quotations_root ON public.quotations(root_quotation_id);
CREATE INDEX IF NOT EXISTS idx_quotations_validity ON public.quotations(valid_until);
CREATE INDEX IF NOT EXISTS idx_quotation_items_quotation ON public.quotation_items(quotation_id);
CREATE INDEX IF NOT EXISTS idx_quotation_items_product ON public.quotation_items(product_id);

-- 8. Row-Level Security (RLS) Configuration
ALTER TABLE public.quotations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quotation_items ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS quotations_read ON public.quotations;
CREATE POLICY quotations_read ON public.quotations FOR SELECT TO authenticated USING (public.has_permission(auth.uid(), 'quotations', 'VIEW'));

DROP POLICY IF EXISTS quotations_create ON public.quotations;
CREATE POLICY quotations_create ON public.quotations FOR INSERT TO authenticated WITH CHECK (public.has_permission(auth.uid(), 'quotations', 'CREATE'));

DROP POLICY IF EXISTS quotations_update ON public.quotations;
CREATE POLICY quotations_update ON public.quotations FOR UPDATE TO authenticated USING (public.has_permission(auth.uid(), 'quotations', 'EDIT') OR public.has_permission(auth.uid(), 'quotations', 'APPROVE')) WITH CHECK (public.has_permission(auth.uid(), 'quotations', 'EDIT') OR public.has_permission(auth.uid(), 'quotations', 'APPROVE'));

DROP POLICY IF EXISTS quotation_items_read ON public.quotation_items;
CREATE POLICY quotation_items_read ON public.quotation_items FOR SELECT TO authenticated USING (public.has_permission(auth.uid(), 'quotations', 'VIEW'));

DROP POLICY IF EXISTS quotation_items_create ON public.quotation_items;
CREATE POLICY quotation_items_create ON public.quotation_items FOR INSERT TO authenticated WITH CHECK (public.has_permission(auth.uid(), 'quotations', 'CREATE') OR public.has_permission(auth.uid(), 'quotations', 'EDIT'));

DROP POLICY IF EXISTS quotation_items_update ON public.quotation_items;
CREATE POLICY quotation_items_update ON public.quotation_items FOR UPDATE TO authenticated USING (public.has_permission(auth.uid(), 'quotations', 'EDIT')) WITH CHECK (public.has_permission(auth.uid(), 'quotations', 'EDIT'));

-- Disable Hard Deletes
REVOKE DELETE ON public.quotations FROM authenticated, anon, PUBLIC;
REVOKE DELETE ON public.quotation_items FROM authenticated, anon, PUBLIC;
