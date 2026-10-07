-- =============================================================================
-- FARMREEM PLATFORM MIGRATION — PRICING ENGINE V1 MODULE
-- Version: 20261007000001_pricing_module.sql
-- =============================================================================

CREATE EXTENSION IF NOT EXISTS btree_gist;

-- 1. Create Required Enums
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'price_list_type_enum') THEN
    CREATE TYPE price_list_type_enum AS ENUM (
      'BASE_SELLING',
      'CUSTOMER_CONTRACT',
      'SUPPLIER_REFERENCE_COST'
    );
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'pricing_status_enum') THEN
    CREATE TYPE pricing_status_enum AS ENUM (
      'DRAFT',
      'PENDING_APPROVAL',
      'ACTIVE',
      'SUPERSEDED',
      'INACTIVE',
      'REJECTED'
    );
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'margin_scope_enum') THEN
    CREATE TYPE margin_scope_enum AS ENUM (
      'CUSTOMER_SPECIFIC',
      'PRODUCT_SPECIFIC',
      'CATEGORY',
      'GLOBAL'
    );
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'margin_type_enum') THEN
    CREATE TYPE margin_type_enum AS ENUM (
      'PERCENTAGE_MARKUP',
      'FIXED_MARKUP_INR',
      'PERCENTAGE_MARGIN',
      'MINIMUM_FLOOR_PRICE'
    );
  END IF;
END $$;

-- 2. Concurrency-Safe Sequences & Helper Functions
CREATE SEQUENCE IF NOT EXISTS public.price_list_code_seq START WITH 1 INCREMENT BY 1;
REVOKE ALL ON SEQUENCE public.price_list_code_seq FROM PUBLIC, anon, authenticated;

CREATE OR REPLACE FUNCTION public.generate_price_list_code()
RETURNS TEXT AS $$
BEGIN
  RETURN 'FR-PRC-' || LPAD(nextval('public.price_list_code_seq')::text, 6, '0');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp;

REVOKE EXECUTE ON FUNCTION public.generate_price_list_code() FROM PUBLIC, anon, authenticated;

CREATE SEQUENCE IF NOT EXISTS public.margin_rule_code_seq START WITH 1 INCREMENT BY 1;
REVOKE ALL ON SEQUENCE public.margin_rule_code_seq FROM PUBLIC, anon, authenticated;

CREATE OR REPLACE FUNCTION public.generate_margin_rule_code()
RETURNS TEXT AS $$
BEGIN
  RETURN 'FR-MR-' || LPAD(nextval('public.margin_rule_code_seq')::text, 6, '0');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp;

REVOKE EXECUTE ON FUNCTION public.generate_margin_rule_code() FROM PUBLIC, anon, authenticated;

-- 3. Core Tables Creation

-- Price Lists Master Table (Authoritative Lifecycle Entity)
CREATE TABLE IF NOT EXISTS public.price_lists (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  price_list_code VARCHAR(50) UNIQUE NOT NULL DEFAULT public.generate_price_list_code(),
  name VARCHAR(255) NOT NULL,
  list_type price_list_type_enum NOT NULL,
  customer_id UUID NULL REFERENCES public.customers(id) ON DELETE RESTRICT,
  supplier_id UUID NULL REFERENCES public.suppliers(id) ON DELETE RESTRICT,
  status pricing_status_enum NOT NULL DEFAULT 'DRAFT',
  currency VARCHAR(3) NOT NULL DEFAULT 'INR',
  notes TEXT NULL,
  created_by UUID NULL REFERENCES public.users(id) ON DELETE SET NULL,
  updated_by UUID NULL REFERENCES public.users(id) ON DELETE SET NULL,
  approved_by UUID NULL REFERENCES public.users(id) ON DELETE SET NULL,
  approved_at TIMESTAMPTZ NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT chk_price_list_header_entity CHECK (
    (list_type = 'CUSTOMER_CONTRACT' AND customer_id IS NOT NULL AND supplier_id IS NULL) OR
    (list_type = 'SUPPLIER_REFERENCE_COST' AND supplier_id IS NOT NULL AND customer_id IS NULL) OR
    (list_type = 'BASE_SELLING' AND customer_id IS NULL AND supplier_id IS NULL)
  )
);

-- Price List Items Table (No Redundant Customer/Supplier FKs)
CREATE TABLE IF NOT EXISTS public.price_list_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  price_list_id UUID NOT NULL REFERENCES public.price_lists(id) ON DELETE RESTRICT,
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE RESTRICT,
  unit_price NUMERIC(12, 4) NOT NULL,
  currency VARCHAR(3) NOT NULL DEFAULT 'INR',
  uom VARCHAR(50) NOT NULL,
  min_quantity NUMERIC(10, 3) NOT NULL DEFAULT 1.000,
  version INT NOT NULL DEFAULT 1,
  previous_version_id UUID NULL REFERENCES public.price_list_items(id) ON DELETE SET NULL,
  is_superseded BOOLEAN NOT NULL DEFAULT false,
  effective_from TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  effective_to TIMESTAMPTZ NULL,
  notes TEXT NULL,
  created_by UUID NULL REFERENCES public.users(id) ON DELETE SET NULL,
  updated_by UUID NULL REFERENCES public.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT chk_item_price_non_negative CHECK (unit_price >= 0),
  CONSTRAINT chk_item_min_qty_positive CHECK (min_quantity > 0),
  CONSTRAINT chk_item_effective_range CHECK (effective_to IS NULL OR effective_to > effective_from)
);

-- Margin Rules Table (Floor & Guardrail Validation)
CREATE TABLE IF NOT EXISTS public.margin_rules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  rule_code VARCHAR(50) UNIQUE NOT NULL DEFAULT public.generate_margin_rule_code(),
  name VARCHAR(255) NOT NULL,
  scope margin_scope_enum NOT NULL,
  margin_type margin_type_enum NOT NULL,
  margin_value NUMERIC(10, 4) NOT NULL,
  product_id UUID NULL REFERENCES public.products(id) ON DELETE RESTRICT,
  product_category product_category_enum NULL,
  customer_id UUID NULL REFERENCES public.customers(id) ON DELETE RESTRICT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  effective_from TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  effective_to TIMESTAMPTZ NULL,
  notes TEXT NULL,
  created_by UUID NULL REFERENCES public.users(id) ON DELETE SET NULL,
  updated_by UUID NULL REFERENCES public.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT chk_margin_rule_scope_fields CHECK (
    (scope = 'CUSTOMER_SPECIFIC' AND customer_id IS NOT NULL AND product_id IS NOT NULL AND product_category IS NULL) OR
    (scope = 'PRODUCT_SPECIFIC'  AND product_id IS NOT NULL  AND customer_id IS NULL  AND product_category IS NULL) OR
    (scope = 'CATEGORY'          AND product_category IS NOT NULL AND customer_id IS NULL AND product_id IS NULL) OR
    (scope = 'GLOBAL'            AND customer_id IS NULL     AND product_id IS NULL   AND product_category IS NULL)
  ),
  CONSTRAINT chk_margin_effective_range CHECK (effective_to IS NULL OR effective_to > effective_from)
);

-- 4. Code Immutability & Updated_At Triggers

-- Before Insert Price List Code Trigger
CREATE OR REPLACE FUNCTION public.price_lists_set_code()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.price_list_code IS NULL OR TRIM(NEW.price_list_code) = '' THEN
    NEW.price_list_code := public.generate_price_list_code();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp;

REVOKE EXECUTE ON FUNCTION public.price_lists_set_code() FROM PUBLIC, anon, authenticated;

DROP TRIGGER IF EXISTS trg_price_lists_set_code ON public.price_lists;
CREATE TRIGGER trg_price_lists_set_code
BEFORE INSERT ON public.price_lists
FOR EACH ROW EXECUTE FUNCTION public.price_lists_set_code();

-- Before Insert Margin Rule Code Trigger
CREATE OR REPLACE FUNCTION public.margin_rules_set_code()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.rule_code IS NULL OR TRIM(NEW.rule_code) = '' THEN
    NEW.rule_code := public.generate_margin_rule_code();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp;

REVOKE EXECUTE ON FUNCTION public.margin_rules_set_code() FROM PUBLIC, anon, authenticated;

DROP TRIGGER IF EXISTS trg_margin_rules_set_code ON public.margin_rules;
CREATE TRIGGER trg_margin_rules_set_code
BEFORE INSERT ON public.margin_rules
FOR EACH ROW EXECUTE FUNCTION public.margin_rules_set_code();

-- Immutable Code Triggers
CREATE OR REPLACE FUNCTION public.prevent_price_list_code_update()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.price_list_code IS DISTINCT FROM OLD.price_list_code THEN
    RAISE EXCEPTION 'price_list_code is immutable and cannot be modified after creation.';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public, pg_temp;

REVOKE EXECUTE ON FUNCTION public.prevent_price_list_code_update() FROM PUBLIC, anon, authenticated;

DROP TRIGGER IF EXISTS trg_prevent_price_list_code_update ON public.price_lists;
CREATE TRIGGER trg_prevent_price_list_code_update
BEFORE UPDATE ON public.price_lists
FOR EACH ROW EXECUTE FUNCTION public.prevent_price_list_code_update();

CREATE OR REPLACE FUNCTION public.prevent_margin_rule_code_update()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.rule_code IS DISTINCT FROM OLD.rule_code THEN
    RAISE EXCEPTION 'rule_code is immutable and cannot be modified after creation.';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public, pg_temp;

REVOKE EXECUTE ON FUNCTION public.prevent_margin_rule_code_update() FROM PUBLIC, anon, authenticated;

DROP TRIGGER IF EXISTS trg_prevent_margin_rule_code_update ON public.margin_rules;
CREATE TRIGGER trg_prevent_margin_rule_code_update
BEFORE UPDATE ON public.margin_rules
FOR EACH ROW EXECUTE FUNCTION public.prevent_margin_rule_code_update();

-- Updated At Trigger Functions
CREATE OR REPLACE FUNCTION public.set_pricing_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public, pg_temp;

REVOKE EXECUTE ON FUNCTION public.set_pricing_updated_at() FROM PUBLIC, anon, authenticated;

DROP TRIGGER IF EXISTS trg_price_lists_updated_at ON public.price_lists;
CREATE TRIGGER trg_price_lists_updated_at BEFORE UPDATE ON public.price_lists FOR EACH ROW EXECUTE FUNCTION public.set_pricing_updated_at();

DROP TRIGGER IF EXISTS trg_price_list_items_updated_at ON public.price_list_items;
CREATE TRIGGER trg_price_list_items_updated_at BEFORE UPDATE ON public.price_list_items FOR EACH ROW EXECUTE FUNCTION public.set_pricing_updated_at();

DROP TRIGGER IF EXISTS trg_margin_rules_updated_at ON public.margin_rules;
CREATE TRIGGER trg_margin_rules_updated_at BEFORE UPDATE ON public.margin_rules FOR EACH ROW EXECUTE FUNCTION public.set_pricing_updated_at();

-- 5. PostgreSQL Exclusion Constraints (Half-Open [) Overlap Protection)

-- Price List Items Overlap Protection
ALTER TABLE public.price_list_items
  DROP CONSTRAINT IF EXISTS ex_price_list_items_no_overlap;

ALTER TABLE public.price_list_items
  ADD CONSTRAINT ex_price_list_items_no_overlap EXCLUDE USING gist (
    price_list_id WITH =,
    product_id WITH =,
    min_quantity WITH =,
    tstzrange(effective_from, effective_to, '[)') WITH &&
  ) WHERE (is_superseded = false);

-- Margin Rules Overlap Protection Across All 4 Scopes
ALTER TABLE public.margin_rules DROP CONSTRAINT IF EXISTS ex_margin_rules_customer_specific;
ALTER TABLE public.margin_rules
  ADD CONSTRAINT ex_margin_rules_customer_specific EXCLUDE USING gist (
    customer_id WITH =,
    product_id WITH =,
    tstzrange(effective_from, effective_to, '[)') WITH &&
  ) WHERE (is_active = true AND scope = 'CUSTOMER_SPECIFIC');

ALTER TABLE public.margin_rules DROP CONSTRAINT IF EXISTS ex_margin_rules_product_specific;
ALTER TABLE public.margin_rules
  ADD CONSTRAINT ex_margin_rules_product_specific EXCLUDE USING gist (
    product_id WITH =,
    tstzrange(effective_from, effective_to, '[)') WITH &&
  ) WHERE (is_active = true AND scope = 'PRODUCT_SPECIFIC');

ALTER TABLE public.margin_rules DROP CONSTRAINT IF EXISTS ex_margin_rules_category;
ALTER TABLE public.margin_rules
  ADD CONSTRAINT ex_margin_rules_category EXCLUDE USING gist (
    product_category WITH =,
    tstzrange(effective_from, effective_to, '[)') WITH &&
  ) WHERE (is_active = true AND scope = 'CATEGORY');

ALTER TABLE public.margin_rules DROP CONSTRAINT IF EXISTS ex_margin_rules_global;
ALTER TABLE public.margin_rules
  ADD CONSTRAINT ex_margin_rules_global EXCLUDE USING gist (
    tstzrange(effective_from, effective_to, '[)') WITH &&
  ) WHERE (is_active = true AND scope = 'GLOBAL');

-- 6. Performance & Search Indexes
CREATE INDEX IF NOT EXISTS idx_price_lists_status ON public.price_lists(status);
CREATE INDEX IF NOT EXISTS idx_price_lists_type ON public.price_lists(list_type);
CREATE INDEX IF NOT EXISTS idx_price_lists_customer ON public.price_lists(customer_id) WHERE customer_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_price_lists_supplier ON public.price_lists(supplier_id) WHERE supplier_id IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_price_list_items_list ON public.price_list_items(price_list_id);
CREATE INDEX IF NOT EXISTS idx_price_list_items_product ON public.price_list_items(product_id);
CREATE INDEX IF NOT EXISTS idx_price_list_items_dates ON public.price_list_items(effective_from, effective_to);

CREATE INDEX IF NOT EXISTS idx_margin_rules_scope ON public.margin_rules(scope, is_active);

-- 7. Row-Level Security (RLS) Configuration
ALTER TABLE public.price_lists ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.price_list_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.margin_rules ENABLE ROW LEVEL SECURITY;

-- Price Lists Policies
DROP POLICY IF EXISTS price_lists_read ON public.price_lists;
CREATE POLICY price_lists_read ON public.price_lists FOR SELECT TO authenticated USING (public.has_permission(auth.uid(), 'pricing', 'VIEW'));

DROP POLICY IF EXISTS price_lists_create ON public.price_lists;
CREATE POLICY price_lists_create ON public.price_lists FOR INSERT TO authenticated WITH CHECK (public.has_permission(auth.uid(), 'pricing', 'CREATE'));

DROP POLICY IF EXISTS price_lists_update ON public.price_lists;
CREATE POLICY price_lists_update ON public.price_lists FOR UPDATE TO authenticated USING (public.has_permission(auth.uid(), 'pricing', 'EDIT') OR public.has_permission(auth.uid(), 'pricing', 'APPROVE')) WITH CHECK (public.has_permission(auth.uid(), 'pricing', 'EDIT') OR public.has_permission(auth.uid(), 'pricing', 'APPROVE'));

-- Price List Items Policies
DROP POLICY IF EXISTS price_list_items_read ON public.price_list_items;
CREATE POLICY price_list_items_read ON public.price_list_items FOR SELECT TO authenticated USING (public.has_permission(auth.uid(), 'pricing', 'VIEW'));

DROP POLICY IF EXISTS price_list_items_create ON public.price_list_items;
CREATE POLICY price_list_items_create ON public.price_list_items FOR INSERT TO authenticated WITH CHECK (public.has_permission(auth.uid(), 'pricing', 'CREATE') OR public.has_permission(auth.uid(), 'pricing', 'EDIT'));

DROP POLICY IF EXISTS price_list_items_update ON public.price_list_items;
CREATE POLICY price_list_items_update ON public.price_list_items FOR UPDATE TO authenticated USING (public.has_permission(auth.uid(), 'pricing', 'EDIT')) WITH CHECK (public.has_permission(auth.uid(), 'pricing', 'EDIT'));

-- Margin Rules Policies
DROP POLICY IF EXISTS margin_rules_read ON public.margin_rules;
CREATE POLICY margin_rules_read ON public.margin_rules FOR SELECT TO authenticated USING (public.has_permission(auth.uid(), 'pricing', 'VIEW'));

DROP POLICY IF EXISTS margin_rules_create ON public.margin_rules;
CREATE POLICY margin_rules_create ON public.margin_rules FOR INSERT TO authenticated WITH CHECK (public.has_permission(auth.uid(), 'pricing', 'CREATE'));

DROP POLICY IF EXISTS margin_rules_update ON public.margin_rules;
CREATE POLICY margin_rules_update ON public.margin_rules FOR UPDATE TO authenticated USING (public.has_permission(auth.uid(), 'pricing', 'EDIT')) WITH CHECK (public.has_permission(auth.uid(), 'pricing', 'EDIT'));

-- Disable Hard Deletes Across All 3 Tables
REVOKE DELETE ON public.price_lists FROM authenticated, anon, PUBLIC;
REVOKE DELETE ON public.price_list_items FROM authenticated, anon, PUBLIC;
REVOKE DELETE ON public.margin_rules FROM authenticated, anon, PUBLIC;
