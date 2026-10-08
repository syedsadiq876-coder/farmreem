-- =============================================================================
-- FARMREEM PLATFORM MIGRATION — PROCUREMENT MODULE V1
-- Version: 20261008000001_procurement_module.sql
-- =============================================================================

-- 1. Create Required Enums
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'procurement_requirement_status_enum') THEN
    CREATE TYPE procurement_requirement_status_enum AS ENUM (
      'PENDING',
      'PARTIALLY_ALLOCATED',
      'FULLY_ALLOCATED',
      'CANCELLED'
    );
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'allocation_status_enum') THEN
    CREATE TYPE allocation_status_enum AS ENUM (
      'ALLOCATED',
      'PO_GENERATED',
      'CANCELLED'
    );
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'purchase_order_status_enum') THEN
    CREATE TYPE purchase_order_status_enum AS ENUM (
      'DRAFT',
      'PENDING_APPROVAL',
      'APPROVED',
      'ISSUED',
      'CANCELLED'
    );
  END IF;
END $$;

-- 2. Additive Permissions Seed for Procurement Module
INSERT INTO permissions (code, module, action, description) VALUES
  ('procurement.VIEW', 'procurement', 'VIEW', 'View procurement requirements, supplier allocations, and purchase orders'),
  ('procurement.CREATE', 'procurement', 'CREATE', 'Generate requirements, create allocations, and draft purchase orders'),
  ('procurement.EDIT', 'procurement', 'EDIT', 'Update purchase orders and submit for approval or issue'),
  ('procurement.APPROVE', 'procurement', 'APPROVE', 'Approve purchase orders via maker-checker review'),
  ('procurement.CANCEL', 'procurement', 'CANCEL', 'Cancel allocations and purchase orders')
ON CONFLICT (code) DO NOTHING;

-- Map Procurement Permissions to Canonical Staff Roles
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM roles r
CROSS JOIN permissions p
WHERE p.module = 'procurement'
  AND (
    r.code IN ('SUPER_ADMIN', 'GENERAL_MANAGER', 'PROCUREMENT_MANAGER', 'FINANCE_CONTROLLER')
    OR (r.code = 'OPERATIONS_DISPATCH' AND p.action IN ('VIEW'))
  )
ON CONFLICT (role_id, permission_id) DO NOTHING;

-- 3. Sequences for Procurement Identifiers
CREATE SEQUENCE IF NOT EXISTS public.requirement_number_seq START WITH 1 INCREMENT BY 1;
CREATE SEQUENCE IF NOT EXISTS public.allocation_number_seq START WITH 1 INCREMENT BY 1;
CREATE SEQUENCE IF NOT EXISTS public.po_number_seq START WITH 1 INCREMENT BY 1;

REVOKE ALL ON SEQUENCE public.requirement_number_seq FROM PUBLIC, anon, authenticated;
REVOKE ALL ON SEQUENCE public.allocation_number_seq FROM PUBLIC, anon, authenticated;
REVOKE ALL ON SEQUENCE public.po_number_seq FROM PUBLIC, anon, authenticated;

-- 4. Core Tables

-- A. Procurement Requirements Table
CREATE TABLE IF NOT EXISTS public.procurement_requirements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  requirement_number VARCHAR(50) UNIQUE NOT NULL DEFAULT ('FR-REQ-' || LPAD(nextval('public.requirement_number_seq')::text, 6, '0')),
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE RESTRICT,
  order_item_id UUID UNIQUE NOT NULL REFERENCES public.order_items(id) ON DELETE RESTRICT,
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE RESTRICT,
  product_sku_snapshot VARCHAR(100) NOT NULL,
  product_name_snapshot VARCHAR(255) NOT NULL,
  required_quantity NUMERIC(12, 4) NOT NULL CHECK (required_quantity > 0),
  allocated_quantity NUMERIC(12, 4) NOT NULL DEFAULT 0.0000 CHECK (allocated_quantity >= 0 AND allocated_quantity <= required_quantity),
  uom_snapshot VARCHAR(50) NOT NULL,
  target_fulfillment_date TIMESTAMPTZ NOT NULL,
  status procurement_requirement_status_enum NOT NULL DEFAULT 'PENDING',
  created_by UUID NULL REFERENCES public.users(id) ON DELETE SET NULL,
  updated_by UUID NULL REFERENCES public.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- B. Supplier Allocations Table
CREATE TABLE IF NOT EXISTS public.supplier_allocations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  allocation_number VARCHAR(50) UNIQUE NOT NULL DEFAULT ('FR-ALC-' || LPAD(nextval('public.allocation_number_seq')::text, 6, '0')),
  procurement_requirement_id UUID NOT NULL REFERENCES public.procurement_requirements(id) ON DELETE RESTRICT,
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE RESTRICT,
  order_item_id UUID NOT NULL REFERENCES public.order_items(id) ON DELETE RESTRICT,
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE RESTRICT,
  supplier_id UUID NOT NULL REFERENCES public.suppliers(id) ON DELETE RESTRICT,
  sourcing_address_id UUID NOT NULL REFERENCES public.supplier_addresses(id) ON DELETE RESTRICT,
  allocated_quantity NUMERIC(12, 4) NOT NULL CHECK (allocated_quantity > 0),
  uom_snapshot VARCHAR(50) NOT NULL,
  negotiated_unit_cost NUMERIC(12, 4) NOT NULL CHECK (negotiated_unit_cost >= 0),
  expected_pickup_date TIMESTAMPTZ NOT NULL,
  status allocation_status_enum NOT NULL DEFAULT 'ALLOCATED',
  created_by UUID NULL REFERENCES public.users(id) ON DELETE SET NULL,
  updated_by UUID NULL REFERENCES public.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- C. Purchase Orders Table
CREATE TABLE IF NOT EXISTS public.purchase_orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  po_number VARCHAR(50) UNIQUE NOT NULL DEFAULT ('FR-PO-' || LPAD(nextval('public.po_number_seq')::text, 6, '0')),
  supplier_id UUID NOT NULL REFERENCES public.suppliers(id) ON DELETE RESTRICT,
  supplier_code_snapshot VARCHAR(50) NOT NULL,
  supplier_legal_name_snapshot VARCHAR(255) NOT NULL,
  supplier_gstin_snapshot VARCHAR(15) NULL,
  buyer_tax_profile_id UUID NOT NULL REFERENCES public.seller_tax_profiles(id) ON DELETE RESTRICT,
  buyer_legal_name_snapshot VARCHAR(255) NOT NULL,
  buyer_gstin_snapshot VARCHAR(15) NOT NULL,
  buyer_registered_address_snapshot JSONB NOT NULL,
  expected_pickup_date TIMESTAMPTZ NOT NULL,
  currency VARCHAR(3) NOT NULL DEFAULT 'INR',
  subtotal_amount NUMERIC(14, 4) NOT NULL DEFAULT 0.0000 CHECK (subtotal_amount >= 0),
  status purchase_order_status_enum NOT NULL DEFAULT 'DRAFT',
  approved_by UUID NULL REFERENCES public.users(id) ON DELETE RESTRICT,
  approved_at TIMESTAMPTZ NULL,
  self_approval_override_reason TEXT NULL,
  issued_at TIMESTAMPTZ NULL,
  cancelled_by UUID NULL REFERENCES public.users(id) ON DELETE RESTRICT,
  cancellation_reason TEXT NULL,
  cancelled_at TIMESTAMPTZ NULL,
  notes TEXT NULL,
  created_by UUID NULL REFERENCES public.users(id) ON DELETE SET NULL,
  updated_by UUID NULL REFERENCES public.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- D. Purchase Order Items Table
CREATE TABLE IF NOT EXISTS public.purchase_order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  purchase_order_id UUID NOT NULL REFERENCES public.purchase_orders(id) ON DELETE RESTRICT,
  allocation_id UUID UNIQUE NOT NULL REFERENCES public.supplier_allocations(id) ON DELETE RESTRICT,
  procurement_requirement_id UUID NOT NULL REFERENCES public.procurement_requirements(id) ON DELETE RESTRICT,
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE RESTRICT,
  order_item_id UUID NOT NULL REFERENCES public.order_items(id) ON DELETE RESTRICT,
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE RESTRICT,
  product_sku_snapshot VARCHAR(100) NOT NULL,
  product_name_snapshot VARCHAR(255) NOT NULL,
  sourcing_address_id UUID NOT NULL REFERENCES public.supplier_addresses(id) ON DELETE RESTRICT,
  sourcing_address_snapshot JSONB NOT NULL,
  ordered_quantity NUMERIC(12, 4) NOT NULL CHECK (ordered_quantity > 0),
  uom_snapshot VARCHAR(50) NOT NULL,
  unit_purchase_cost NUMERIC(12, 4) NOT NULL CHECK (unit_purchase_cost >= 0),
  line_purchase_amount NUMERIC(14, 4) NOT NULL CHECK (line_purchase_amount >= 0),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- E. PO Status History Table
CREATE TABLE IF NOT EXISTS public.po_status_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  purchase_order_id UUID NOT NULL REFERENCES public.purchase_orders(id) ON DELETE RESTRICT,
  from_status purchase_order_status_enum NULL,
  to_status purchase_order_status_enum NOT NULL,
  change_reason TEXT NULL,
  performed_by UUID NOT NULL REFERENCES public.users(id) ON DELETE RESTRICT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. Hardened Row Level Security (RLS) & Delete Privilege Revocation
ALTER TABLE public.procurement_requirements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.supplier_allocations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.purchase_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.purchase_order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.po_status_history ENABLE ROW LEVEL SECURITY;

REVOKE DELETE ON public.procurement_requirements FROM PUBLIC, anon, authenticated;
REVOKE DELETE ON public.supplier_allocations FROM PUBLIC, anon, authenticated;
REVOKE DELETE ON public.purchase_orders FROM PUBLIC, anon, authenticated;
REVOKE DELETE ON public.purchase_order_items FROM PUBLIC, anon, authenticated;
REVOKE DELETE ON public.po_status_history FROM PUBLIC, anon, authenticated;

-- RLS Policies
DROP POLICY IF EXISTS p_procurement_req_view ON public.procurement_requirements;
CREATE POLICY p_procurement_req_view ON public.procurement_requirements
  FOR SELECT TO authenticated
  USING (public.has_permission(auth.uid(), 'procurement', 'VIEW'));

DROP POLICY IF EXISTS p_supplier_alloc_view ON public.supplier_allocations;
CREATE POLICY p_supplier_alloc_view ON public.supplier_allocations
  FOR SELECT TO authenticated
  USING (public.has_permission(auth.uid(), 'procurement', 'VIEW'));

DROP POLICY IF EXISTS p_purchase_orders_view ON public.purchase_orders;
CREATE POLICY p_purchase_orders_view ON public.purchase_orders
  FOR SELECT TO authenticated
  USING (public.has_permission(auth.uid(), 'procurement', 'VIEW'));

DROP POLICY IF EXISTS p_po_items_view ON public.purchase_order_items;
CREATE POLICY p_po_items_view ON public.purchase_order_items
  FOR SELECT TO authenticated
  USING (public.has_permission(auth.uid(), 'procurement', 'VIEW'));

DROP POLICY IF EXISTS p_po_history_view ON public.po_status_history;
CREATE POLICY p_po_history_view ON public.po_status_history
  FOR SELECT TO authenticated
  USING (public.has_permission(auth.uid(), 'procurement', 'VIEW'));

-- Indexes
CREATE INDEX IF NOT EXISTS idx_proc_req_order_id ON public.procurement_requirements(order_id);
CREATE INDEX IF NOT EXISTS idx_proc_req_status ON public.procurement_requirements(status);
CREATE INDEX IF NOT EXISTS idx_supp_alloc_req_id ON public.supplier_allocations(procurement_requirement_id);
CREATE INDEX IF NOT EXISTS idx_supp_alloc_supplier_id ON public.supplier_allocations(supplier_id);
CREATE INDEX IF NOT EXISTS idx_po_supplier_id ON public.purchase_orders(supplier_id);
CREATE INDEX IF NOT EXISTS idx_po_status ON public.purchase_orders(status);
CREATE INDEX IF NOT EXISTS idx_po_items_po_id ON public.purchase_order_items(purchase_order_id);

-- 6. Hardened SECURITY DEFINER RPC Functions

-- A. Requirement Generation Function
CREATE OR REPLACE FUNCTION public.create_procurement_requirements_for_order(
  p_order_id UUID
)
RETURNS TABLE (
  requirements_created INT,
  order_number TEXT
) AS $$
DECLARE
  v_actor_id UUID;
  v_order_record RECORD;
  v_item RECORD;
  v_count INT := 0;
BEGIN
  v_actor_id := auth.uid();
  IF v_actor_id IS NULL THEN
    RAISE EXCEPTION 'Authentication required.';
  END IF;

  IF NOT public.has_permission(v_actor_id, 'procurement', 'CREATE') THEN
    RAISE EXCEPTION 'Permission denied: procurement.CREATE required.';
  END IF;

  SELECT id, order_number, status, requested_delivery_date
  INTO v_order_record
  FROM public.orders
  WHERE id = p_order_id
  FOR UPDATE;

  IF v_order_record.id IS NULL THEN
    RAISE EXCEPTION 'Sales Order % not found.', p_order_id;
  END IF;

  IF v_order_record.status != 'PROCUREMENT_PENDING' THEN
    RAISE EXCEPTION 'Sales Order % is in status %, expected PROCUREMENT_PENDING.', 
      v_order_record.order_number, v_order_record.status;
  END IF;

  FOR v_item IN (
    SELECT id, product_id, product_sku_snapshot, product_name_snapshot, quantity, uom
    FROM public.order_items
    WHERE order_id = p_order_id
  ) LOOP
    INSERT INTO public.procurement_requirements (
      order_id,
      order_item_id,
      product_id,
      product_sku_snapshot,
      product_name_snapshot,
      required_quantity,
      allocated_quantity,
      uom_snapshot,
      target_fulfillment_date,
      status,
      created_by,
      updated_by
    ) VALUES (
      v_order_record.id,
      v_item.id,
      v_item.product_id,
      v_item.product_sku_snapshot,
      v_item.product_name_snapshot,
      v_item.quantity,
      0.0000,
      v_item.uom,
      v_order_record.requested_delivery_date,
      'PENDING',
      v_actor_id,
      v_actor_id
    )
    ON CONFLICT (order_item_id) DO NOTHING;

    IF FOUND THEN
      v_count := v_count + 1;
    END IF;
  END LOOP;

  PERFORM public.log_audit_event(
    'procurement.REQUIREMENT_GENERATED',
    'order',
    v_order_record.id::text,
    NULL,
    jsonb_build_object(
      'order_id', v_order_record.id,
      'order_number', v_order_record.order_number,
      'requirements_created', v_count
    ),
    NULL
  );

  RETURN QUERY SELECT v_count, v_order_record.order_number::TEXT;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp;

REVOKE EXECUTE ON FUNCTION public.create_procurement_requirements_for_order(UUID) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.create_procurement_requirements_for_order(UUID) TO authenticated;

-- B. Allocation Creation Function
CREATE OR REPLACE FUNCTION public.create_supplier_allocation(
  p_requirement_id UUID,
  p_supplier_id UUID,
  p_sourcing_address_id UUID,
  p_allocated_quantity NUMERIC,
  p_negotiated_unit_cost NUMERIC,
  p_expected_pickup_date TIMESTAMPTZ
)
RETURNS UUID AS $$
DECLARE
  v_actor_id UUID;
  v_req RECORD;
  v_supp RECORD;
  v_addr RECORD;
  v_allocation_id UUID;
  v_new_allocated_qty NUMERIC;
  v_new_req_status procurement_requirement_status_enum;
BEGIN
  v_actor_id := auth.uid();
  IF v_actor_id IS NULL THEN
    RAISE EXCEPTION 'Authentication required.';
  END IF;

  IF NOT public.has_permission(v_actor_id, 'procurement', 'CREATE') THEN
    RAISE EXCEPTION 'Permission denied: procurement.CREATE required.';
  END IF;

  IF p_allocated_quantity IS NULL OR p_allocated_quantity <= 0 THEN
    RAISE EXCEPTION 'Allocated quantity must be greater than zero.';
  END IF;

  IF p_negotiated_unit_cost IS NULL OR p_negotiated_unit_cost < 0 THEN
    RAISE EXCEPTION 'Negotiated unit cost cannot be negative.';
  END IF;

  SELECT id, status, verification_status INTO v_supp
  FROM public.suppliers WHERE id = p_supplier_id;
  
  IF v_supp.id IS NULL OR v_supp.status != 'ACTIVE' OR v_supp.verification_status != 'VERIFIED' THEN
    RAISE EXCEPTION 'Supplier % is not operationally eligible (must be ACTIVE and VERIFIED).', p_supplier_id;
  END IF;

  SELECT id, supplier_id, status, address_type INTO v_addr
  FROM public.supplier_addresses WHERE id = p_sourcing_address_id;

  IF v_addr.id IS NULL OR v_addr.supplier_id != p_supplier_id OR v_addr.status != 'ACTIVE' 
     OR v_addr.address_type NOT IN ('FARM_LOCATION', 'MANDI_WAREHOUSE', 'PICKUP_SOURCE') THEN
    RAISE EXCEPTION 'Sourcing address % is invalid, inactive, or not an eligible pickup location for supplier %.', p_sourcing_address_id, p_supplier_id;
  END IF;

  SELECT id, order_id, order_item_id, product_id, uom_snapshot, required_quantity, allocated_quantity, status
  INTO v_req
  FROM public.procurement_requirements
  WHERE id = p_requirement_id
  FOR UPDATE;

  IF v_req.id IS NULL OR v_req.status = 'CANCELLED' THEN
    RAISE EXCEPTION 'Procurement requirement % not found or cancelled.', p_requirement_id;
  END IF;

  v_new_allocated_qty := v_req.allocated_quantity + p_allocated_quantity;
  IF v_new_allocated_qty > v_req.required_quantity THEN
    RAISE EXCEPTION 'Allocation exceeds open required quantity. Maximum available: %', (v_req.required_quantity - v_req.allocated_quantity);
  END IF;

  v_new_req_status := CASE 
    WHEN v_new_allocated_qty >= v_req.required_quantity THEN 'FULLY_ALLOCATED'::procurement_requirement_status_enum
    ELSE 'PARTIALLY_ALLOCATED'::procurement_requirement_status_enum
  END;

  INSERT INTO public.supplier_allocations (
    procurement_requirement_id, order_id, order_item_id, product_id,
    supplier_id, sourcing_address_id, allocated_quantity, uom_snapshot,
    negotiated_unit_cost, expected_pickup_date, status, created_by, updated_by
  ) VALUES (
    v_req.id, v_req.order_id, v_req.order_item_id, v_req.product_id,
    p_supplier_id, p_sourcing_address_id, p_allocated_quantity, v_req.uom_snapshot,
    p_negotiated_unit_cost, p_expected_pickup_date, 'ALLOCATED', v_actor_id, v_actor_id
  ) RETURNING id INTO v_allocation_id;

  UPDATE public.procurement_requirements
  SET allocated_quantity = v_new_allocated_qty,
      status = v_new_req_status,
      updated_by = v_actor_id,
      updated_at = NOW()
  WHERE id = v_req.id;

  PERFORM public.log_audit_event(
    'procurement.ALLOCATION_CREATED',
    'supplier_allocation',
    v_allocation_id::text,
    NULL,
    jsonb_build_object(
      'requirement_id', v_req.id,
      'supplier_id', p_supplier_id,
      'allocated_quantity', p_allocated_quantity,
      'negotiated_unit_cost', p_negotiated_unit_cost
    ),
    NULL
  );

  RETURN v_allocation_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp;

REVOKE EXECUTE ON FUNCTION public.create_supplier_allocation(UUID, UUID, UUID, NUMERIC, NUMERIC, TIMESTAMPTZ) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.create_supplier_allocation(UUID, UUID, UUID, NUMERIC, NUMERIC, TIMESTAMPTZ) TO authenticated;

-- C. Allocation Release/Cancellation Function
CREATE OR REPLACE FUNCTION public.cancel_supplier_allocation(
  p_allocation_id UUID,
  p_reason TEXT
)
RETURNS VOID AS $$
DECLARE
  v_actor_id UUID;
  v_alloc RECORD;
  v_req RECORD;
  v_new_allocated_qty NUMERIC;
  v_new_req_status procurement_requirement_status_enum;
BEGIN
  v_actor_id := auth.uid();
  IF v_actor_id IS NULL THEN
    RAISE EXCEPTION 'Authentication required.';
  END IF;

  IF NOT public.has_permission(v_actor_id, 'procurement', 'CANCEL') THEN
    RAISE EXCEPTION 'Permission denied: procurement.CANCEL required.';
  END IF;

  IF TRIM(COALESCE(p_reason, '')) = '' THEN
    RAISE EXCEPTION 'Cancellation reason is mandatory.';
  END IF;

  SELECT id, procurement_requirement_id, allocated_quantity, status
  INTO v_alloc
  FROM public.supplier_allocations
  WHERE id = p_allocation_id
  FOR UPDATE;

  IF v_alloc.id IS NULL OR v_alloc.status = 'CANCELLED' THEN
    RAISE EXCEPTION 'Allocation not found or already cancelled.';
  END IF;

  IF v_alloc.status = 'PO_GENERATED' THEN
    RAISE EXCEPTION 'Cannot release allocation attached to an active Purchase Order. Cancel the Purchase Order first.';
  END IF;

  SELECT id, required_quantity, allocated_quantity, status
  INTO v_req
  FROM public.procurement_requirements
  WHERE id = v_alloc.procurement_requirement_id
  FOR UPDATE;

  v_new_allocated_qty := v_req.allocated_quantity - v_alloc.allocated_quantity;
  IF v_new_allocated_qty < 0 THEN v_new_allocated_qty := 0; END IF;

  v_new_req_status := CASE 
    WHEN v_new_allocated_qty <= 0 THEN 'PENDING'::procurement_requirement_status_enum
    WHEN v_new_allocated_qty < v_req.required_quantity THEN 'PARTIALLY_ALLOCATED'::procurement_requirement_status_enum
    ELSE 'FULLY_ALLOCATED'::procurement_requirement_status_enum
  END;

  UPDATE public.supplier_allocations
  SET status = 'CANCELLED',
      updated_by = v_actor_id,
      updated_at = NOW()
  WHERE id = v_alloc.id;

  UPDATE public.procurement_requirements
  SET allocated_quantity = v_new_allocated_qty,
      status = v_new_req_status,
      updated_by = v_actor_id,
      updated_at = NOW()
  WHERE id = v_req.id;

  PERFORM public.log_audit_event(
    'procurement.ALLOCATION_RELEASED',
    'supplier_allocation',
    v_alloc.id::text,
    jsonb_build_object('status', 'ALLOCATED', 'allocated_quantity', v_alloc.allocated_quantity),
    jsonb_build_object('status', 'CANCELLED'),
    p_reason
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp;

REVOKE EXECUTE ON FUNCTION public.cancel_supplier_allocation(UUID, TEXT) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.cancel_supplier_allocation(UUID, TEXT) TO authenticated;

-- D. Purchase Order Creation Function
CREATE OR REPLACE FUNCTION public.create_purchase_order_from_allocations(
  p_allocation_ids UUID[],
  p_buyer_tax_profile_id UUID,
  p_expected_pickup_date TIMESTAMPTZ,
  p_notes TEXT DEFAULT NULL
)
RETURNS TABLE (
  purchase_order_id UUID,
  po_number TEXT
) AS $$
DECLARE
  v_actor_id UUID;
  v_authoritative_org_id UUID;
  v_org_count INT;
  v_po_id UUID;
  v_po_number TEXT;
  v_original_count INT;
  v_null_count INT;
  v_distinct_count INT;
  v_locked_count INT := 0;
  v_supplier_id UUID := NULL;
  v_supp RECORD;
  v_buyer RECORD;
  v_alloc RECORD;
  v_subtotal NUMERIC(14, 4) := 0.0000;
  v_line_amount NUMERIC(14, 4);
BEGIN
  v_actor_id := auth.uid();
  IF v_actor_id IS NULL THEN
    RAISE EXCEPTION 'Authentication required.';
  END IF;

  IF NOT public.has_permission(v_actor_id, 'procurement', 'CREATE') THEN
    RAISE EXCEPTION 'Permission denied: procurement.CREATE required.';
  END IF;

  IF p_allocation_ids IS NULL OR ARRAY_LENGTH(p_allocation_ids, 1) = 0 THEN
    RAISE EXCEPTION 'At least one allocation ID is required.';
  END IF;

  v_original_count := ARRAY_LENGTH(p_allocation_ids, 1);

  SELECT COUNT(*) INTO v_null_count
  FROM UNNEST(p_allocation_ids) AS elem
  WHERE elem IS NULL;

  IF v_null_count > 0 THEN
    RAISE EXCEPTION 'Malformed input: allocation IDs array contains % NULL element(s).', v_null_count;
  END IF;

  SELECT COUNT(DISTINCT elem) INTO v_distinct_count
  FROM UNNEST(p_allocation_ids) AS elem;

  IF v_original_count != v_distinct_count THEN
    RAISE EXCEPTION 'Malformed input: allocation IDs array contains duplicates (% total elements, % distinct).', 
      v_original_count, v_distinct_count;
  END IF;

  FOR v_alloc IN (
    SELECT id, procurement_requirement_id, order_id, order_item_id, product_id,
           supplier_id, sourcing_address_id, allocated_quantity, uom_snapshot,
           negotiated_unit_cost, status
    FROM public.supplier_allocations
    WHERE id = ANY(p_allocation_ids)
    FOR UPDATE
  ) LOOP
    v_locked_count := v_locked_count + 1;

    IF v_alloc.status != 'ALLOCATED' THEN
      RAISE EXCEPTION 'Allocation % is in status %, expected ALLOCATED.', v_alloc.id, v_alloc.status;
    END IF;

    IF EXISTS (SELECT 1 FROM public.purchase_order_items WHERE allocation_id = v_alloc.id) THEN
      RAISE EXCEPTION 'Allocation % is already attached to an active Purchase Order line.', v_alloc.id;
    END IF;

    IF v_supplier_id IS NULL THEN
      v_supplier_id := v_alloc.supplier_id;
    ELSIF v_supplier_id != v_alloc.supplier_id THEN
      RAISE EXCEPTION 'All allocations in a Purchase Order batch must belong to the same supplier.';
    END IF;
  END LOOP;

  IF v_locked_count != v_original_count THEN
    RAISE EXCEPTION 'Allocation row-locking mismatch: requested % distinct IDs, but successfully locked % valid ALLOCATED rows.', 
      v_original_count, v_locked_count;
  END IF;

  SELECT id, supplier_code, legal_name, gstin, status, verification_status
  INTO v_supp
  FROM public.suppliers
  WHERE id = v_supplier_id;

  IF v_supp.id IS NULL OR v_supp.status != 'ACTIVE' OR v_supp.verification_status != 'VERIFIED' THEN
    RAISE EXCEPTION 'Supplier % is not operationally eligible (ACTIVE + VERIFIED required).', v_supplier_id;
  END IF;

  SELECT COUNT(*), MIN(o.id) 
  INTO v_org_count, v_authoritative_org_id
  FROM public.organization_members om
  JOIN public.organizations o ON om.organization_id = o.id
  WHERE om.user_id = v_actor_id
    AND o.org_type = 'INTERNAL_FARMREEM'
    AND o.status = 'ACTIVE';

  IF v_org_count = 0 OR v_authoritative_org_id IS NULL THEN
    RAISE EXCEPTION 'Actor does not belong to an active FarmReem internal organization. Action prohibited.';
  ELSIF v_org_count > 1 THEN
    RAISE EXCEPTION 'Ambiguous organization membership: actor belongs to % active FarmReem internal organizations. Action prohibited.', v_org_count;
  END IF;

  SELECT 
    id, organization_id, legal_entity_name, trade_name, gstin, 
    registered_address_line1, registered_address_line2, city, state_name, gst_state_code, postal_code
  INTO v_buyer
  FROM public.seller_tax_profiles
  WHERE id = p_buyer_tax_profile_id
    AND organization_id = v_authoritative_org_id
    AND is_active = true
    AND verification_status = 'VERIFIED'
    AND legal_entity_name IS NOT NULL AND TRIM(legal_entity_name) != ''
    AND gstin IS NOT NULL AND LENGTH(TRIM(gstin)) = 15
    AND registered_address_line1 IS NOT NULL AND TRIM(registered_address_line1) != ''
    AND city IS NOT NULL AND TRIM(city) != ''
    AND state_name IS NOT NULL AND TRIM(state_name) != ''
    AND gst_state_code IS NOT NULL AND LENGTH(TRIM(gst_state_code)) = 2
    AND postal_code IS NOT NULL AND TRIM(postal_code) != '';

  IF v_buyer.id IS NULL THEN
    RAISE EXCEPTION 'Buyer tax profile % is invalid, inactive, unverified, missing statutory fields, or does not belong to actor organization %.', 
      p_buyer_tax_profile_id, v_authoritative_org_id;
  END IF;

  v_po_number := 'FR-PO-' || LPAD(nextval('public.po_number_seq')::text, 6, '0');

  INSERT INTO public.purchase_orders (
    po_number,
    supplier_id,
    supplier_code_snapshot,
    supplier_legal_name_snapshot,
    supplier_gstin_snapshot,
    buyer_tax_profile_id,
    buyer_legal_name_snapshot,
    buyer_gstin_snapshot,
    buyer_registered_address_snapshot,
    expected_pickup_date,
    currency,
    subtotal_amount,
    status,
    notes,
    created_by,
    updated_by
  ) VALUES (
    v_po_number,
    v_supp.id,
    v_supp.supplier_code,
    v_supp.legal_name,
    v_supp.gstin,
    v_buyer.id,
    v_buyer.legal_entity_name,
    v_buyer.gstin,
    jsonb_build_object(
      'line1', v_buyer.registered_address_line1,
      'line2', v_buyer.registered_address_line2,
      'city', v_buyer.city,
      'state', v_buyer.state_name,
      'gst_state_code', v_buyer.gst_state_code,
      'postal_code', v_buyer.postal_code
    ),
    p_expected_pickup_date,
    'INR',
    0.0000,
    'DRAFT',
    p_notes,
    v_actor_id,
    v_actor_id
  ) RETURNING id INTO v_po_id;

  FOR v_alloc IN (
    SELECT a.id, a.procurement_requirement_id, a.order_id, a.order_item_id, a.product_id,
           a.sourcing_address_id, a.allocated_quantity, a.uom_snapshot, a.negotiated_unit_cost,
           p.product_sku_snapshot, p.product_name_snapshot,
           addr.supplier_id AS addr_supplier_id, addr.address_type AS addr_type, addr.status AS addr_status,
           addr.address_line1, addr.city, addr.state, addr.postal_code
    FROM public.supplier_allocations a
    JOIN public.procurement_requirements p ON a.procurement_requirement_id = p.id
    JOIN public.supplier_addresses addr ON a.sourcing_address_id = addr.id
    WHERE a.id = ANY(p_allocation_ids)
  ) LOOP
    IF v_alloc.addr_supplier_id IS NULL OR v_alloc.addr_supplier_id != v_supplier_id THEN
      RAISE EXCEPTION 'Sourcing address % does not belong to supplier %.', v_alloc.sourcing_address_id, v_supplier_id;
    END IF;

    IF v_alloc.addr_status != 'ACTIVE' THEN
      RAISE EXCEPTION 'Sourcing address % is no longer ACTIVE.', v_alloc.sourcing_address_id;
    END IF;

    IF v_alloc.addr_type NOT IN ('FARM_LOCATION', 'MANDI_WAREHOUSE', 'PICKUP_SOURCE') THEN
      RAISE EXCEPTION 'Sourcing address % type (%) does not permit pickup sourcing.', v_alloc.sourcing_address_id, v_alloc.addr_type;
    END IF;

    v_line_amount := ROUND(v_alloc.allocated_quantity * v_alloc.negotiated_unit_cost, 4);
    v_subtotal := v_subtotal + v_line_amount;

    INSERT INTO public.purchase_order_items (
      purchase_order_id,
      allocation_id,
      procurement_requirement_id,
      order_id,
      order_item_id,
      product_id,
      product_sku_snapshot,
      product_name_snapshot,
      sourcing_address_id,
      sourcing_address_snapshot,
      ordered_quantity,
      uom_snapshot,
      unit_purchase_cost,
      line_purchase_amount
    ) VALUES (
      v_po_id,
      v_alloc.id,
      v_alloc.procurement_requirement_id,
      v_alloc.order_id,
      v_alloc.order_item_id,
      v_alloc.product_id,
      v_alloc.product_sku_snapshot,
      v_alloc.product_name_snapshot,
      v_alloc.sourcing_address_id,
      jsonb_build_object('line1', v_alloc.address_line1, 'city', v_alloc.city, 'state', v_alloc.state, 'postal_code', v_alloc.postal_code),
      v_alloc.allocated_quantity,
      v_alloc.uom_snapshot,
      v_alloc.negotiated_unit_cost,
      v_line_amount
    );

    UPDATE public.supplier_allocations
    SET status = 'PO_GENERATED',
        updated_by = v_actor_id,
        updated_at = NOW()
    WHERE id = v_alloc.id;
  END LOOP;

  UPDATE public.purchase_orders
  SET subtotal_amount = v_subtotal
  WHERE id = v_po_id;

  INSERT INTO public.po_status_history (
    purchase_order_id, from_status, to_status, change_reason, performed_by
  ) VALUES (
    v_po_id, NULL, 'DRAFT', 'Initial Purchase Order creation from allocations', v_actor_id
  );

  PERFORM public.log_audit_event(
    'procurement.PO_CREATED',
    'purchase_order',
    v_po_id::text,
    NULL,
    jsonb_build_object(
      'po_number', v_po_number,
      'supplier_id', v_supp.id,
      'line_count', v_locked_count,
      'subtotal_amount', v_subtotal
    ),
    NULL
  );

  RETURN QUERY SELECT v_po_id, v_po_number;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp;

REVOKE EXECUTE ON FUNCTION public.create_purchase_order_from_allocations(UUID[], UUID, TIMESTAMPTZ, TEXT) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.create_purchase_order_from_allocations(UUID[], UUID, TIMESTAMPTZ, TEXT) TO authenticated;

-- E. Submit PO Function
CREATE OR REPLACE FUNCTION public.submit_purchase_order(
  p_po_id UUID
)
RETURNS VOID AS $$
DECLARE
  v_actor_id UUID;
  v_po RECORD;
BEGIN
  v_actor_id := auth.uid();
  IF v_actor_id IS NULL THEN
    RAISE EXCEPTION 'Authentication required.';
  END IF;

  IF NOT public.has_permission(v_actor_id, 'procurement', 'EDIT') THEN
    RAISE EXCEPTION 'Permission denied: procurement.EDIT required.';
  END IF;

  SELECT id, po_number, status, created_by INTO v_po
  FROM public.purchase_orders
  WHERE id = p_po_id
  FOR UPDATE;

  IF v_po.id IS NULL THEN
    RAISE EXCEPTION 'Purchase Order % not found.', p_po_id;
  END IF;

  IF v_po.status != 'DRAFT' THEN
    RAISE EXCEPTION 'Purchase Order % is in status %, expected DRAFT for submission.', v_po.po_number, v_po.status;
  END IF;

  UPDATE public.purchase_orders
  SET status = 'PENDING_APPROVAL',
      updated_by = v_actor_id,
      updated_at = NOW()
  WHERE id = v_po.id;

  INSERT INTO public.po_status_history (
    purchase_order_id, from_status, to_status, change_reason, performed_by
  ) VALUES (
    v_po.id, 'DRAFT', 'PENDING_APPROVAL', 'Submitted for manager approval', v_actor_id
  );

  PERFORM public.log_audit_event(
    'procurement.PO_SUBMITTED',
    'purchase_order',
    v_po.id::text,
    jsonb_build_object('status', 'DRAFT'),
    jsonb_build_object('status', 'PENDING_APPROVAL'),
    NULL
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp;

REVOKE EXECUTE ON FUNCTION public.submit_purchase_order(UUID) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.submit_purchase_order(UUID) TO authenticated;

-- F. Approve PO Function (Maker-Checker Enforced)
CREATE OR REPLACE FUNCTION public.approve_purchase_order(
  p_po_id UUID,
  p_override_reason TEXT DEFAULT NULL
)
RETURNS VOID AS $$
DECLARE
  v_actor_id UUID;
  v_po RECORD;
  v_is_super_admin BOOLEAN := false;
BEGIN
  v_actor_id := auth.uid();
  IF v_actor_id IS NULL THEN
    RAISE EXCEPTION 'Authentication required.';
  END IF;

  IF NOT public.has_permission(v_actor_id, 'procurement', 'APPROVE') THEN
    RAISE EXCEPTION 'Permission denied: procurement.APPROVE required.';
  END IF;

  SELECT id, po_number, status, created_by INTO v_po
  FROM public.purchase_orders
  WHERE id = p_po_id
  FOR UPDATE;

  IF v_po.id IS NULL THEN
    RAISE EXCEPTION 'Purchase Order % not found.', p_po_id;
  END IF;

  IF v_po.status != 'PENDING_APPROVAL' THEN
    RAISE EXCEPTION 'Purchase Order % is in status %, expected PENDING_APPROVAL.', v_po.po_number, v_po.status;
  END IF;

  -- Check if approver is Maker (created_by)
  IF v_po.created_by = v_actor_id THEN
    -- Check if SUPER_ADMIN
    SELECT EXISTS (
      SELECT 1 FROM public.user_roles ur
      JOIN public.roles r ON ur.role_id = r.id
      WHERE ur.user_id = v_actor_id AND r.code = 'SUPER_ADMIN'
    ) INTO v_is_super_admin;

    IF NOT v_is_super_admin THEN
      RAISE EXCEPTION 'Maker-checker violation: PO creator cannot approve their own Purchase Order.';
    END IF;

    IF TRIM(COALESCE(p_override_reason, '')) = '' THEN
      RAISE EXCEPTION 'SUPER_ADMIN self-approval override requires a non-empty override reason.';
    END IF;

    PERFORM public.log_audit_event(
      'procurement.PO_SELF_APPROVAL_OVERRIDE',
      'purchase_order',
      v_po.id::text,
      NULL,
      jsonb_build_object('override_reason', p_override_reason),
      p_override_reason
    );
  END IF;

  UPDATE public.purchase_orders
  SET status = 'APPROVED',
      approved_by = v_actor_id,
      approved_at = NOW(),
      self_approval_override_reason = CASE WHEN v_po.created_by = v_actor_id THEN p_override_reason ELSE NULL END,
      updated_by = v_actor_id,
      updated_at = NOW()
  WHERE id = v_po.id;

  INSERT INTO public.po_status_history (
    purchase_order_id, from_status, to_status, change_reason, performed_by
  ) VALUES (
    v_po.id, 'PENDING_APPROVAL', 'APPROVED', COALESCE(p_override_reason, 'Manager approval granted'), v_actor_id
  );

  PERFORM public.log_audit_event(
    'procurement.PO_APPROVED',
    'purchase_order',
    v_po.id::text,
    jsonb_build_object('status', 'PENDING_APPROVAL'),
    jsonb_build_object('status', 'APPROVED', 'approved_by', v_actor_id),
    p_override_reason
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp;

REVOKE EXECUTE ON FUNCTION public.approve_purchase_order(UUID, TEXT) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.approve_purchase_order(UUID, TEXT) TO authenticated;

-- G. Issue PO Function
CREATE OR REPLACE FUNCTION public.issue_purchase_order(
  p_po_id UUID
)
RETURNS VOID AS $$
DECLARE
  v_actor_id UUID;
  v_po RECORD;
BEGIN
  v_actor_id := auth.uid();
  IF v_actor_id IS NULL THEN
    RAISE EXCEPTION 'Authentication required.';
  END IF;

  IF NOT public.has_permission(v_actor_id, 'procurement', 'EDIT') THEN
    RAISE EXCEPTION 'Permission denied: procurement.EDIT required.';
  END IF;

  SELECT id, po_number, status INTO v_po
  FROM public.purchase_orders
  WHERE id = p_po_id
  FOR UPDATE;

  IF v_po.id IS NULL THEN
    RAISE EXCEPTION 'Purchase Order % not found.', p_po_id;
  END IF;

  IF v_po.status != 'APPROVED' THEN
    RAISE EXCEPTION 'Purchase Order % is in status %, expected APPROVED to issue.', v_po.po_number, v_po.status;
  END IF;

  UPDATE public.purchase_orders
  SET status = 'ISSUED',
      issued_at = NOW(),
      updated_by = v_actor_id,
      updated_at = NOW()
  WHERE id = v_po.id;

  INSERT INTO public.po_status_history (
    purchase_order_id, from_status, to_status, change_reason, performed_by
  ) VALUES (
    v_po.id, 'APPROVED', 'ISSUED', 'Transmitted to supplier and commercially locked', v_actor_id
  );

  PERFORM public.log_audit_event(
    'procurement.PO_ISSUED',
    'purchase_order',
    v_po.id::text,
    jsonb_build_object('status', 'APPROVED'),
    jsonb_build_object('status', 'ISSUED', 'issued_at', NOW()),
    NULL
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp;

REVOKE EXECUTE ON FUNCTION public.issue_purchase_order(UUID) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.issue_purchase_order(UUID) TO authenticated;

-- H. Cancel PO Function
CREATE OR REPLACE FUNCTION public.cancel_purchase_order(
  p_po_id UUID,
  p_cancellation_reason TEXT
)
RETURNS VOID AS $$
DECLARE
  v_actor_id UUID;
  v_po RECORD;
  v_item RECORD;
  v_req RECORD;
  v_new_allocated_qty NUMERIC;
  v_new_req_status procurement_requirement_status_enum;
BEGIN
  v_actor_id := auth.uid();
  IF v_actor_id IS NULL THEN
    RAISE EXCEPTION 'Authentication required.';
  END IF;

  IF NOT public.has_permission(v_actor_id, 'procurement', 'CANCEL') THEN
    RAISE EXCEPTION 'Permission denied: procurement.CANCEL required.';
  END IF;

  IF TRIM(COALESCE(p_cancellation_reason, '')) = '' THEN
    RAISE EXCEPTION 'Cancellation reason is mandatory.';
  END IF;

  SELECT id, po_number, status
  INTO v_po
  FROM public.purchase_orders
  WHERE id = p_po_id
  FOR UPDATE;

  IF v_po.id IS NULL THEN
    RAISE EXCEPTION 'Purchase Order % not found.', p_po_id;
  END IF;

  IF v_po.status = 'CANCELLED' THEN
    RAISE EXCEPTION 'Purchase Order % is already cancelled.', v_po.po_number;
  END IF;

  UPDATE public.purchase_orders
  SET status = 'CANCELLED',
      cancelled_by = v_actor_id,
      cancellation_reason = p_cancellation_reason,
      cancelled_at = NOW(),
      updated_by = v_actor_id,
      updated_at = NOW()
  WHERE id = v_po.id;

  FOR v_item IN (
    SELECT allocation_id, procurement_requirement_id, ordered_quantity
    FROM public.purchase_order_items
    WHERE purchase_order_id = v_po.id
  ) LOOP
    UPDATE public.supplier_allocations
    SET status = 'CANCELLED',
        updated_by = v_actor_id,
        updated_at = NOW()
    WHERE id = v_item.allocation_id;

    SELECT id, required_quantity, allocated_quantity
    INTO v_req
    FROM public.procurement_requirements
    WHERE id = v_item.procurement_requirement_id
    FOR UPDATE;

    v_new_allocated_qty := v_req.allocated_quantity - v_item.ordered_quantity;
    IF v_new_allocated_qty < 0 THEN v_new_allocated_qty := 0; END IF;

    v_new_req_status := CASE 
      WHEN v_new_allocated_qty <= 0 THEN 'PENDING'::procurement_requirement_status_enum
      WHEN v_new_allocated_qty < v_req.required_quantity THEN 'PARTIALLY_ALLOCATED'::procurement_requirement_status_enum
      ELSE 'FULLY_ALLOCATED'::procurement_requirement_status_enum
    END;

    UPDATE public.procurement_requirements
    SET allocated_quantity = v_new_allocated_qty,
        status = v_new_req_status,
        updated_by = v_actor_id,
        updated_at = NOW()
    WHERE id = v_req.id;
  END LOOP;

  INSERT INTO public.po_status_history (
    purchase_order_id, from_status, to_status, change_reason, performed_by
  ) VALUES (
    v_po.id, v_po.status, 'CANCELLED', p_cancellation_reason, v_actor_id
  );

  PERFORM public.log_audit_event(
    'procurement.PO_CANCELLED',
    'purchase_order',
    v_po.id::text,
    jsonb_build_object('status', v_po.status),
    jsonb_build_object('status', 'CANCELLED'),
    p_cancellation_reason
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp;

REVOKE EXECUTE ON FUNCTION public.cancel_purchase_order(UUID, TEXT) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.cancel_purchase_order(UUID, TEXT) TO authenticated;
