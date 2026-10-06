-- =============================================================================
-- FARMREEM PLATFORM MIGRATION — PRODUCTS MODULE
-- Version: 20261006000000_products_module.sql
-- =============================================================================

-- 1. Create Category and Status Enums if they do not exist
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'product_category_enum') THEN
    CREATE TYPE product_category_enum AS ENUM (
      'LIVE_BROILER',
      'WHOLE_DRESSED',
      'CUTS',
      'BONELESS'
    );
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'product_status_enum') THEN
    CREATE TYPE product_status_enum AS ENUM (
      'ACTIVE',
      'INACTIVE'
    );
  END IF;
END $$;

-- 2. Create Products Table
CREATE TABLE IF NOT EXISTS public.products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sku VARCHAR(50) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  category product_category_enum NOT NULL,
  min_weight_kg NUMERIC(6,3) NULL,
  max_weight_kg NUMERIC(6,3) NULL,
  unit_of_measure VARCHAR(50) NOT NULL DEFAULT 'KG',
  status product_status_enum NOT NULL DEFAULT 'ACTIVE',
  notes TEXT NULL,
  created_by UUID NULL REFERENCES public.users(id) ON DELETE SET NULL,
  updated_by UUID NULL REFERENCES public.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Performance & Filtering Indexes
CREATE INDEX IF NOT EXISTS idx_products_category ON public.products(category);
CREATE INDEX IF NOT EXISTS idx_products_status ON public.products(status);
CREATE INDEX IF NOT EXISTS idx_products_sku ON public.products(sku);

-- 3. Automatic Updated_At Trigger
CREATE OR REPLACE FUNCTION public.set_products_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp;

DROP TRIGGER IF EXISTS trg_products_updated_at ON public.products;
CREATE TRIGGER trg_products_updated_at
BEFORE UPDATE ON public.products
FOR EACH ROW EXECUTE FUNCTION public.set_products_updated_at();

-- 4. Seed Canonical FarmReem Taxonomy (Idempotent UPSERT)
INSERT INTO public.products (sku, name, category, min_weight_kg, max_weight_kg, unit_of_measure, status, notes)
VALUES
  ('FR-LB-S', 'Live Broiler — Small', 'LIVE_BROILER', 0.800, 1.000, 'KG', 'ACTIVE', 'Small live broiler bird (800 g–1.0 kg)'),
  ('FR-LB-M', 'Live Broiler — Medium', 'LIVE_BROILER', 1.000, 1.400, 'KG', 'ACTIVE', 'Medium live broiler bird (1.0–1.4 kg)'),
  ('FR-LB-L', 'Live Broiler — Large', 'LIVE_BROILER', 1.400, 1.800, 'KG', 'ACTIVE', 'Large live broiler bird (1.4–1.8 kg)'),
  ('FR-WD', 'Whole Dressed', 'WHOLE_DRESSED', NULL, NULL, 'KG', 'ACTIVE', 'Fresh whole dressed chicken without entrails'),
  ('FR-CUT', 'Cuts', 'CUTS', NULL, NULL, 'KG', 'ACTIVE', 'Standard commercial chicken cuts (thigh, drumstick, wing, breast)'),
  ('FR-BNL', 'Boneless', 'BONELESS', NULL, NULL, 'KG', 'ACTIVE', 'Fresh boneless chicken meat')
ON CONFLICT (sku) DO UPDATE SET
  name = EXCLUDED.name,
  category = EXCLUDED.category,
  min_weight_kg = EXCLUDED.min_weight_kg,
  max_weight_kg = EXCLUDED.max_weight_kg,
  unit_of_measure = EXCLUDED.unit_of_measure,
  notes = EXCLUDED.notes;

-- 5. Row-Level Security (RLS) Configuration
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- Read Policy: Authenticated staff with products.VIEW or SUPER_ADMIN
DROP POLICY IF EXISTS products_read ON public.products;
CREATE POLICY products_read ON public.products
  FOR SELECT TO authenticated
  USING (public.has_permission(auth.uid(), 'products', 'VIEW'));

-- Insert Policy: Authenticated staff with products.CREATE or SUPER_ADMIN
DROP POLICY IF EXISTS products_create ON public.products;
CREATE POLICY products_create ON public.products
  FOR INSERT TO authenticated
  WITH CHECK (public.has_permission(auth.uid(), 'products', 'CREATE'));

-- Update Policy: Authenticated staff with products.EDIT or SUPER_ADMIN
DROP POLICY IF EXISTS products_update ON public.products;
CREATE POLICY products_update ON public.products
  FOR UPDATE TO authenticated
  USING (public.has_permission(auth.uid(), 'products', 'EDIT'))
  WITH CHECK (public.has_permission(auth.uid(), 'products', 'EDIT'));

-- Disable Hard Deletes
REVOKE DELETE ON public.products FROM authenticated, anon;
