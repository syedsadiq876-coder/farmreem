-- =============================================================================
-- FARMREEM PLATFORM MIGRATION — SALES ORDERS MODULE V1
-- Version: 20261007000004_sales_orders_module.sql
-- =============================================================================

-- 1. Create Required Enums
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'order_status_enum') THEN
    CREATE TYPE order_status_enum AS ENUM (
      'CONFIRMED',
      'PROCUREMENT_PENDING',
      'READY_FOR_DISPATCH',
      'DISPATCHED',
      'DELIVERED',
      'CANCELLED'
    );
  END IF;
END $$;

-- 2. Additive Permissions Seed for Orders Module
INSERT INTO permissions (code, module, action, description) VALUES
  ('orders.VIEW', 'orders', 'VIEW', 'View sales orders, line items, and fulfillment status'),
  ('orders.CREATE', 'orders', 'CREATE', 'Convert accepted quotations to confirmed sales orders'),
  ('orders.EDIT', 'orders', 'EDIT', 'Update sales order fulfillment and status transitions'),
  ('orders.CANCEL', 'orders', 'CANCEL', 'Cancel sales orders prior to dispatch')
ON CONFLICT (code) DO NOTHING;

-- Map Orders Permissions to Canonical Staff Roles
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM roles r
CROSS JOIN permissions p
WHERE p.module = 'orders'
  AND (
    r.code IN ('SUPER_ADMIN', 'GENERAL_MANAGER', 'SALES_MANAGER', 'FINANCE_CONTROLLER')
    OR (r.code = 'SALESPERSON' AND p.action IN ('VIEW', 'CREATE'))
    OR (r.code = 'OPERATIONS_DISPATCH' AND p.action IN ('VIEW', 'EDIT'))
  )
ON CONFLICT (role_id, permission_id) DO NOTHING;

-- 3. Concurrency-Safe Sequence & Code Generator
CREATE SEQUENCE IF NOT EXISTS public.order_number_seq START WITH 1 INCREMENT BY 1;
REVOKE ALL ON SEQUENCE public.order_number_seq FROM PUBLIC, anon, authenticated;

CREATE OR REPLACE FUNCTION public.generate_order_number()
RETURNS TEXT AS $$
BEGIN
  RETURN 'FR-ORD-' || LPAD(nextval('public.order_number_seq')::text, 6, '0');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp;

REVOKE EXECUTE ON FUNCTION public.generate_order_number() FROM PUBLIC, anon, authenticated;

-- 4. Master Sales Orders Table (Header)
CREATE TABLE IF NOT EXISTS public.orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number VARCHAR(50) NOT NULL DEFAULT public.generate_order_number(),
  
  -- Source Quotation Linkage (Strict 1:1 Constraints)
  source_quotation_id UUID NOT NULL UNIQUE REFERENCES public.quotations(id) ON DELETE RESTRICT,
  source_quotation_number_snapshot VARCHAR(50) NOT NULL,
  source_revision_number_snapshot INT NOT NULL,

  -- Customer Master & Contact Snapshots
  customer_id UUID NOT NULL REFERENCES public.customers(id) ON DELETE RESTRICT,
  customer_legal_name_snapshot VARCHAR(255) NOT NULL,
  customer_code_snapshot VARCHAR(50) NOT NULL,
  customer_gstin_snapshot VARCHAR(15) NULL,
  contact_id UUID NULL REFERENCES public.customer_contacts(id) ON DELETE RESTRICT,
  contact_name_snapshot VARCHAR(255) NULL,
  contact_phone_snapshot VARCHAR(50) NULL,
  contact_email_snapshot VARCHAR(255) NULL,

  -- Seller Statutory Identity Snapshots
  seller_tax_profile_id UUID NOT NULL REFERENCES public.seller_tax_profiles(id) ON DELETE RESTRICT,
  seller_legal_name_snapshot VARCHAR(255) NOT NULL,
  seller_trade_name_snapshot VARCHAR(255) NULL,
  seller_gstin_snapshot VARCHAR(15) NOT NULL,
  seller_registered_address_snapshot JSONB NOT NULL,
  seller_state_name_snapshot VARCHAR(100) NOT NULL,
  seller_state_code_snapshot VARCHAR(2) NOT NULL,

  -- Addresses & Place of Supply Snapshots
  billing_address_id UUID NULL REFERENCES public.customer_addresses(id) ON DELETE RESTRICT,
  billing_address_snapshot JSONB NOT NULL,
  delivery_address_id UUID NULL REFERENCES public.customer_addresses(id) ON DELETE RESTRICT,
  delivery_address_snapshot JSONB NOT NULL,
  place_of_supply_state_name_snapshot VARCHAR(100) NOT NULL,
  place_of_supply_state_code_snapshot VARCHAR(2) NOT NULL,
  tax_type quotation_tax_type_enum NOT NULL DEFAULT 'INTRA_STATE',
  is_interstate_supply BOOLEAN NOT NULL DEFAULT false,

  -- Target Fulfillment Date
  requested_delivery_date TIMESTAMPTZ NOT NULL,
  
  -- Order Status & Currency
  status order_status_enum NOT NULL DEFAULT 'CONFIRMED',
  currency VARCHAR(3) NOT NULL DEFAULT 'INR',

  -- Exact Financial Totals (Copied Verbatim from Quotation)
  subtotal NUMERIC(14, 4) NOT NULL DEFAULT 0.0000,
  tax_total NUMERIC(14, 4) NOT NULL DEFAULT 0.0000,
  cgst_total NUMERIC(14, 4) NOT NULL DEFAULT 0.0000,
  sgst_total NUMERIC(14, 4) NOT NULL DEFAULT 0.0000,
  igst_total NUMERIC(14, 4) NOT NULL DEFAULT 0.0000,
  grand_total NUMERIC(14, 4) NOT NULL DEFAULT 0.0000,

  -- Commercial Terms & Instructions
  payment_terms TEXT NULL,
  delivery_terms TEXT NULL,
  quotation_notes_snapshot TEXT NULL,
  special_instructions TEXT NULL,
  cancellation_reason TEXT NULL,

  -- Audit Metadata (Canonical Staff FKs to public.users)
  created_by UUID NULL REFERENCES public.users(id) ON DELETE SET NULL,
  updated_by UUID NULL REFERENCES public.users(id) ON DELETE SET NULL,
  confirmed_by UUID NULL REFERENCES public.users(id) ON DELETE SET NULL,
  cancelled_by UUID NULL REFERENCES public.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  confirmed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  dispatched_at TIMESTAMPTZ NULL,
  delivered_at TIMESTAMPTZ NULL,
  cancelled_at TIMESTAMPTZ NULL,

  CONSTRAINT chk_orders_subtotal_non_negative CHECK (subtotal >= 0),
  CONSTRAINT chk_orders_grand_total_non_negative CHECK (grand_total >= 0)
);

-- 5. Order Line Items Table
CREATE TABLE IF NOT EXISTS public.order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE RESTRICT,
  line_number INT NOT NULL,
  
  source_quotation_item_id UUID NULL REFERENCES public.quotation_items(id) ON DELETE RESTRICT,
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE RESTRICT,
  product_sku_snapshot VARCHAR(50) NOT NULL,
  product_name_snapshot VARCHAR(255) NOT NULL,
  product_category_snapshot VARCHAR(50) NOT NULL,
  quantity NUMERIC(12, 3) NOT NULL,
  uom VARCHAR(50) NOT NULL,
  unit_price NUMERIC(12, 4) NOT NULL,
  currency VARCHAR(3) NOT NULL DEFAULT 'INR',

  -- Complete Pricing Provenance Snapshot
  price_source_type quotation_price_source_enum NOT NULL,
  price_list_id UUID NULL REFERENCES public.price_lists(id) ON DELETE RESTRICT,
  price_list_code_snapshot VARCHAR(50) NULL,
  price_list_item_id UUID NULL REFERENCES public.price_list_items(id) ON DELETE RESTRICT,
  pricing_version_snapshot INT NOT NULL DEFAULT 1,
  pricing_resolved_at TIMESTAMPTZ NOT NULL,

  -- Exact Tax Breakdown (Copied Verbatim)
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

  CONSTRAINT uq_order_items_line UNIQUE (order_id, line_number),
  CONSTRAINT chk_order_items_qty_positive CHECK (quantity > 0),
  CONSTRAINT chk_order_items_price_non_negative CHECK (unit_price >= 0)
);

-- 6. Order Status History Audit Table
CREATE TABLE IF NOT EXISTS public.order_status_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE RESTRICT,
  from_status VARCHAR(32) NOT NULL,
  to_status VARCHAR(32) NOT NULL,
  changed_by UUID NULL REFERENCES public.users(id) ON DELETE SET NULL,
  change_reason TEXT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 7. Hardened Transactional Conversion Function
CREATE OR REPLACE FUNCTION public.convert_quotation_to_sales_order(
  p_quotation_id UUID,
  p_requested_delivery_date TIMESTAMPTZ,
  p_special_instructions TEXT DEFAULT NULL
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  v_actor_id UUID;
  v_qtn RECORD;
  v_order_id UUID;
  v_order_number VARCHAR;
  v_item RECORD;
  v_line_no INT := 1;
BEGIN
  -- 1. Derive Actor & Verify Authenticated Session
  v_actor_id := auth.uid();
  IF v_actor_id IS NULL THEN
    RAISE EXCEPTION 'UNAUTHENTICATED: Request must be authenticated.';
  END IF;

  -- 2. Verify Active Staff User & Permission 'orders.CREATE'
  IF NOT EXISTS (
    SELECT 1 FROM public.users WHERE id = v_actor_id AND status = 'ACTIVE'
  ) THEN
    RAISE EXCEPTION 'FORBIDDEN: Staff user is inactive or deactivated.';
  END IF;

  IF NOT public.has_permission(v_actor_id, 'orders', 'CREATE') THEN
    RAISE EXCEPTION 'FORBIDDEN: Missing required permission orders.CREATE.';
  END IF;

  -- 3. Lock Source Quotation Row for Update
  SELECT * INTO v_qtn
  FROM public.quotations
  WHERE id = p_quotation_id
  FOR UPDATE;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'QUOTATION_NOT_FOUND: Quotation ID % does not exist.', p_quotation_id;
  END IF;

  -- 4. Guard: Status must be ACCEPTED
  IF v_qtn.status <> 'ACCEPTED' THEN
    RAISE EXCEPTION 'INVALID_STATUS: Only ACCEPTED quotations can be converted. Current status: %', v_qtn.status;
  END IF;

  -- 5. Guard: Expiry check
  IF v_qtn.valid_until IS NOT NULL AND v_qtn.valid_until < NOW() THEN
    RAISE EXCEPTION 'QUOTATION_EXPIRED: Quotation expired on %. Cannot convert.', v_qtn.valid_until;
  END IF;

  -- 6. Guard: Highest revision enforcement in family
  IF EXISTS (
    SELECT 1 FROM public.quotations q_newer
    WHERE q_newer.root_quotation_id = v_qtn.root_quotation_id
      AND q_newer.revision_number > v_qtn.revision_number
  ) THEN
    RAISE EXCEPTION 'NOT_LATEST_REVISION: Quotation % Rev % is not the latest revision in its family.',
      v_qtn.quotation_number, v_qtn.revision_number;
  END IF;

  -- 7. Guard: Double-conversion protection
  IF v_qtn.converted_order_id IS NOT NULL THEN
    RAISE EXCEPTION 'DOUBLE_CONVERSION_VIOLATION: Quotation % was already converted to Order % on %.',
      v_qtn.quotation_number, v_qtn.converted_order_id, v_qtn.converted_at;
  END IF;

  IF EXISTS (SELECT 1 FROM public.orders WHERE source_quotation_id = p_quotation_id) THEN
    RAISE EXCEPTION 'DOUBLE_CONVERSION_VIOLATION: Order already exists referencing source quotation %.', p_quotation_id;
  END IF;

  -- 8. Guard: No placeholder fallbacks (Strict Data Integrity Check)
  IF v_qtn.customer_legal_name_snapshot IS NULL OR TRIM(v_qtn.customer_legal_name_snapshot) = '' OR
     v_qtn.seller_gstin_snapshot IS NULL OR TRIM(v_qtn.seller_gstin_snapshot) = '' OR
     v_qtn.seller_registered_address_snapshot IS NULL OR
     v_qtn.billing_address_snapshot IS NULL OR
     v_qtn.delivery_address_snapshot IS NULL OR
     v_qtn.place_of_supply_state_code_snapshot IS NULL THEN
    RAISE EXCEPTION 'DATA_INTEGRITY_VIOLATION: Required statutory/customer/address snapshots are missing in source quotation.';
  END IF;

  -- 9. Generate Server Order Number
  v_order_number := public.generate_order_number();

  -- 10. Insert Order Header (Directly as CONFIRMED for V1)
  INSERT INTO public.orders (
    order_number,
    source_quotation_id,
    source_quotation_number_snapshot,
    source_revision_number_snapshot,
    customer_id,
    customer_legal_name_snapshot,
    customer_code_snapshot,
    customer_gstin_snapshot,
    contact_id,
    contact_name_snapshot,
    contact_phone_snapshot,
    contact_email_snapshot,
    seller_tax_profile_id,
    seller_legal_name_snapshot,
    seller_trade_name_snapshot,
    seller_gstin_snapshot,
    seller_registered_address_snapshot,
    seller_state_name_snapshot,
    seller_state_code_snapshot,
    billing_address_id,
    billing_address_snapshot,
    delivery_address_id,
    delivery_address_snapshot,
    place_of_supply_state_name_snapshot,
    place_of_supply_state_code_snapshot,
    tax_type,
    is_interstate_supply,
    requested_delivery_date,
    status,
    currency,
    subtotal,
    cgst_total,
    sgst_total,
    igst_total,
    tax_total,
    grand_total,
    payment_terms,
    delivery_terms,
    quotation_notes_snapshot,
    special_instructions,
    created_by,
    confirmed_by,
    confirmed_at
  ) VALUES (
    v_order_number,
    v_qtn.id,
    v_qtn.quotation_number,
    v_qtn.revision_number,
    v_qtn.customer_id,
    v_qtn.customer_legal_name_snapshot,
    v_qtn.customer_code_snapshot,
    v_qtn.customer_gstin_snapshot,
    v_qtn.contact_id,
    v_qtn.contact_name_snapshot,
    v_qtn.contact_phone_snapshot,
    v_qtn.contact_email_snapshot,
    v_qtn.seller_tax_profile_id,
    v_qtn.seller_legal_name_snapshot,
    v_qtn.seller_trade_name_snapshot,
    v_qtn.seller_gstin_snapshot,
    v_qtn.seller_registered_address_snapshot,
    v_qtn.seller_state_name_snapshot,
    v_qtn.seller_state_code_snapshot,
    v_qtn.billing_address_id,
    v_qtn.billing_address_snapshot,
    v_qtn.delivery_address_id,
    v_qtn.delivery_address_snapshot,
    v_qtn.place_of_supply_state_name_snapshot,
    v_qtn.place_of_supply_state_code_snapshot,
    v_qtn.tax_type,
    v_qtn.is_interstate_supply,
    p_requested_delivery_date,
    'CONFIRMED',
    v_qtn.currency,
    v_qtn.subtotal,
    v_qtn.cgst_total,
    v_qtn.sgst_total,
    v_qtn.igst_total,
    v_qtn.tax_total,
    v_qtn.grand_total,
    v_qtn.payment_terms,
    v_qtn.delivery_terms,
    v_qtn.notes,
    p_special_instructions,
    v_actor_id,
    v_actor_id,
    NOW()
  ) RETURNING id INTO v_order_id;

  -- 11. Copy Line Items (Zero Pricing Re-Evaluation, Complete Provenance Copy)
  FOR v_item IN
    SELECT * FROM public.quotation_items WHERE quotation_id = v_qtn.id ORDER BY created_at ASC
  LOOP
    INSERT INTO public.order_items (
      order_id,
      line_number,
      source_quotation_item_id,
      product_id,
      product_sku_snapshot,
      product_name_snapshot,
      product_category_snapshot,
      quantity,
      uom,
      unit_price,
      currency,
      price_source_type,
      price_list_id,
      price_list_code_snapshot,
      price_list_item_id,
      pricing_version_snapshot,
      pricing_resolved_at,
      tax_rate_percent,
      taxable_amount,
      cgst_amount,
      sgst_amount,
      igst_amount,
      line_tax_total,
      line_grand_total,
      notes
    ) VALUES (
      v_order_id,
      v_line_no,
      v_item.id,
      v_item.product_id,
      v_item.product_sku_snapshot,
      v_item.product_name_snapshot,
      v_item.product_category_snapshot,
      v_item.quantity,
      v_item.uom,
      v_item.unit_price,
      v_item.currency,
      v_item.price_source_type,
      v_item.price_list_id,
      v_item.price_list_code_snapshot,
      v_item.price_list_item_id,
      v_item.pricing_version_snapshot,
      v_item.pricing_resolved_at,
      v_item.tax_rate_percent,
      v_item.taxable_amount,
      v_item.cgst_amount,
      v_item.sgst_amount,
      v_item.igst_amount,
      v_item.line_tax_total,
      v_item.line_grand_total,
      v_item.notes
    );
    v_line_no := v_line_no + 1;
  END LOOP;

  -- 12. Lock Source Quotation (Set converted_order_id & converted_at)
  UPDATE public.quotations
  SET converted_order_id = v_order_id,
      converted_at = NOW(),
      updated_by = v_actor_id,
      updated_at = NOW()
  WHERE id = v_qtn.id;

  -- 13. Order Status History Audit Record
  INSERT INTO public.order_status_history (
    order_id,
    from_status,
    to_status,
    changed_by,
    change_reason
  ) VALUES (
    v_order_id,
    'NONE',
    'CONFIRMED',
    v_actor_id,
    'Order created directly as CONFIRMED from accepted quotation ' || v_qtn.quotation_number || ' Rev ' || v_qtn.revision_number
  );

  -- 14. CANONICAL AUDIT LOG EVENT (Atomic Write to public.audit_logs)
  PERFORM public.log_audit_event(
    p_action := 'orders.CONVERT_FROM_QUOTATION',
    p_entity_type := 'order',
    p_entity_id := v_order_id::text,
    p_before_json := jsonb_build_object(
      'source_quotation_id', v_qtn.id,
      'quotation_number', v_qtn.quotation_number,
      'revision_number', v_qtn.revision_number,
      'status', v_qtn.status
    ),
    p_after_json := jsonb_build_object(
      'order_id', v_order_id,
      'order_number', v_order_number,
      'source_quotation_id', v_qtn.id,
      'quotation_number', v_qtn.quotation_number,
      'revision_number', v_qtn.revision_number,
      'customer_id', v_qtn.customer_id,
      'customer_legal_name', v_qtn.customer_legal_name_snapshot,
      'seller_tax_profile_id', v_qtn.seller_tax_profile_id,
      'grand_total', v_qtn.grand_total,
      'converted_at', NOW(),
      'actor_user_id', v_actor_id
    ),
    p_reason := 'Sales Order ' || v_order_number || ' created via accepted quotation conversion (' || v_qtn.quotation_number || ' Rev ' || v_qtn.revision_number || ')',
    p_source_app := 'admin.farmreem.com'
  );

  RETURN v_order_id;
END;
$$;

-- Security Execution Privileges
REVOKE ALL ON FUNCTION public.convert_quotation_to_sales_order(UUID, TIMESTAMPTZ, TEXT) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.convert_quotation_to_sales_order(UUID, TIMESTAMPTZ, TEXT) TO authenticated;

-- 8. Triggers & Immutability Protections

CREATE OR REPLACE FUNCTION public.set_orders_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public, pg_temp;

REVOKE EXECUTE ON FUNCTION public.set_orders_updated_at() FROM PUBLIC, anon, authenticated;

DROP TRIGGER IF EXISTS trg_orders_updated_at ON public.orders;
CREATE TRIGGER trg_orders_updated_at BEFORE UPDATE ON public.orders FOR EACH ROW EXECUTE FUNCTION public.set_orders_updated_at();

DROP TRIGGER IF EXISTS trg_order_items_updated_at ON public.order_items;
CREATE TRIGGER trg_order_items_updated_at BEFORE UPDATE ON public.order_items FOR EACH ROW EXECUTE FUNCTION public.set_orders_updated_at();

-- Immutable Commercial Field Protection Trigger
CREATE OR REPLACE FUNCTION public.prevent_order_commercial_update()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.source_quotation_id IS DISTINCT FROM OLD.source_quotation_id OR
     NEW.source_quotation_number_snapshot IS DISTINCT FROM OLD.source_quotation_number_snapshot OR
     NEW.source_revision_number_snapshot IS DISTINCT FROM OLD.source_revision_number_snapshot OR
     NEW.customer_id IS DISTINCT FROM OLD.customer_id OR
     NEW.customer_legal_name_snapshot IS DISTINCT FROM OLD.customer_legal_name_snapshot OR
     NEW.seller_tax_profile_id IS DISTINCT FROM OLD.seller_tax_profile_id OR
     NEW.seller_gstin_snapshot IS DISTINCT FROM OLD.seller_gstin_snapshot OR
     NEW.subtotal IS DISTINCT FROM OLD.subtotal OR
     NEW.grand_total IS DISTINCT FROM OLD.grand_total THEN
    RAISE EXCEPTION 'Order commercial fields and source quotation snapshots are strictly immutable after creation.';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public, pg_temp;

REVOKE EXECUTE ON FUNCTION public.prevent_order_commercial_update() FROM PUBLIC, anon, authenticated;

DROP TRIGGER IF EXISTS trg_prevent_order_commercial_update ON public.orders;
CREATE TRIGGER trg_prevent_order_commercial_update
BEFORE UPDATE ON public.orders
FOR EACH ROW EXECUTE FUNCTION public.prevent_order_commercial_update();

-- 9. Indexes
CREATE INDEX IF NOT EXISTS idx_orders_customer ON public.orders(customer_id);
CREATE INDEX IF NOT EXISTS idx_orders_source_quotation ON public.orders(source_quotation_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON public.orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_requested_delivery ON public.orders(requested_delivery_date);
CREATE INDEX IF NOT EXISTS idx_order_items_order ON public.order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_order_items_product ON public.order_items(product_id);
CREATE INDEX IF NOT EXISTS idx_order_status_history_order ON public.order_status_history(order_id);

-- 10. Row-Level Security (RLS) Configuration
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_status_history ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS orders_read ON public.orders;
CREATE POLICY orders_read ON public.orders FOR SELECT TO authenticated USING (public.has_permission(auth.uid(), 'orders', 'VIEW'));

DROP POLICY IF EXISTS orders_create ON public.orders;
CREATE POLICY orders_create ON public.orders FOR INSERT TO authenticated WITH CHECK (public.has_permission(auth.uid(), 'orders', 'CREATE'));

DROP POLICY IF EXISTS orders_update ON public.orders;
CREATE POLICY orders_update ON public.orders FOR UPDATE TO authenticated USING (public.has_permission(auth.uid(), 'orders', 'EDIT') OR public.has_permission(auth.uid(), 'orders', 'CANCEL')) WITH CHECK (public.has_permission(auth.uid(), 'orders', 'EDIT') OR public.has_permission(auth.uid(), 'orders', 'CANCEL'));

DROP POLICY IF EXISTS order_items_read ON public.order_items;
CREATE POLICY order_items_read ON public.order_items FOR SELECT TO authenticated USING (public.has_permission(auth.uid(), 'orders', 'VIEW'));

DROP POLICY IF EXISTS order_items_create ON public.order_items;
CREATE POLICY order_items_create ON public.order_items FOR INSERT TO authenticated WITH CHECK (public.has_permission(auth.uid(), 'orders', 'CREATE'));

DROP POLICY IF EXISTS order_status_history_read ON public.order_status_history;
CREATE POLICY order_status_history_read ON public.order_status_history FOR SELECT TO authenticated USING (public.has_permission(auth.uid(), 'orders', 'VIEW'));

-- 11. Disable Hard Deletes
REVOKE DELETE ON public.orders FROM authenticated, anon, PUBLIC;
REVOKE DELETE ON public.order_items FROM authenticated, anon, PUBLIC;
REVOKE DELETE ON public.order_status_history FROM authenticated, anon, PUBLIC;
