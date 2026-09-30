-- =============================================================================
-- FARMREEM PLATFORM PHASE 1 FOUNDATION MIGRATION
-- Migration Version: 20261001000000_phase1_foundation.sql
-- =============================================================================

-- 1. Enable Required Postgres Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Core Enum Types
CREATE TYPE user_type_enum AS ENUM ('STAFF', 'CUSTOMER', 'SUPPLIER');
CREATE TYPE user_status_enum AS ENUM ('ACTIVE', 'SUSPENDED', 'DEACTIVATED');
CREATE TYPE org_status_enum AS ENUM ('ACTIVE', 'SUSPENDED', 'DEACTIVATED');

CREATE TYPE org_type_enum AS ENUM (
  'INTERNAL_FARMREEM',
  'CUSTOMER_HOTEL',
  'CUSTOMER_RESTAURANT',
  'CUSTOMER_CATERER',
  'CUSTOMER_INSTITUTION',
  'CUSTOMER_OTHER',
  'SUPPLIER_PRODUCER_FARM',
  'SUPPLIER_WHOLESALE_MARKET',
  'SUPPLIER_PROCESSOR',
  'SUPPLIER_OTHER',
  'PARTNER_LOGISTICS'
);

-- 9 Canonical Staff Roles (Frozen Taxonomy)
CREATE TYPE staff_role_enum AS ENUM (
  'SUPER_ADMIN',
  'GENERAL_MANAGER',
  'SALES_MANAGER',
  'SALESPERSON',
  'PROCUREMENT_MANAGER',
  'OPERATIONS_DISPATCH',
  'FINANCE_CONTROLLER',
  'QUALITY_COMPLIANCE',
  'DRIVER'
);

CREATE TYPE job_status_enum AS ENUM (
  'PENDING', 
  'PROCESSING', 
  'RETRY', 
  'COMPLETED', 
  'FAILED', 
  'DEAD_LETTER'
);

-- 3. Organizations Table (Supports multi-tenancy & versatile classification)
CREATE TABLE organizations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  legal_name VARCHAR(255) NOT NULL,
  trade_name VARCHAR(255) NULL,
  org_type org_type_enum NOT NULL,
  tax_id_gstin VARCHAR(50) NULL,
  status org_status_enum NOT NULL DEFAULT 'ACTIVE',
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. Users Table (Linked to auth.users with lifecycle status)
CREATE TABLE users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE RESTRICT,
  email VARCHAR(255) UNIQUE NOT NULL,
  full_name VARCHAR(255) NOT NULL,
  phone VARCHAR(50) NULL,
  user_type user_type_enum NOT NULL DEFAULT 'STAFF',
  staff_role staff_role_enum NULL,
  status user_status_enum NOT NULL DEFAULT 'ACTIVE',
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. Organization Members Table
CREATE TABLE organization_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE RESTRICT,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
  member_role VARCHAR(50) NOT NULL DEFAULT 'MEMBER',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(organization_id, user_id)
);

-- 6. Scalable Authorization Foundation (Roles & Permissions)
CREATE TABLE roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code VARCHAR(50) UNIQUE NOT NULL,
  name VARCHAR(100) NOT NULL,
  description TEXT NULL,
  is_internal BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE permissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code VARCHAR(100) UNIQUE NOT NULL, -- e.g. "orders.create", "users.write"
  module VARCHAR(50) NOT NULL,
  action VARCHAR(50) NOT NULL,
  description TEXT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE role_permissions (
  role_id UUID REFERENCES roles(id) ON DELETE CASCADE,
  permission_id UUID REFERENCES permissions(id) ON DELETE CASCADE,
  PRIMARY KEY (role_id, permission_id)
);

CREATE TABLE user_roles (
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  role_id UUID REFERENCES roles(id) ON DELETE CASCADE,
  PRIMARY KEY (user_id, role_id)
);

-- Seed 9 Canonical Staff Roles
INSERT INTO roles (code, name, description, is_internal) VALUES
  ('SUPER_ADMIN', 'Super Administrator', 'Full operational and administrative authority', true),
  ('GENERAL_MANAGER', 'General Manager', 'Overall management and operational supervision', true),
  ('SALES_MANAGER', 'Sales Manager', 'Sales management, quotations, customer approvals', true),
  ('SALESPERSON', 'Salesperson', 'Lead tracking, quotes, order placement', true),
  ('PROCUREMENT_MANAGER', 'Procurement Manager', 'Farm supply management, purchase orders', true),
  ('OPERATIONS_DISPATCH', 'Operations & Dispatch', 'Order fulfillment, dispatch, logistics', true),
  ('FINANCE_CONTROLLER', 'Finance Controller', 'Invoices, payments, financial compliance', true),
  ('QUALITY_COMPLIANCE', 'Quality & Compliance', 'Product inspection, safety compliance', true),
  ('DRIVER', 'Driver', 'Delivery proof, logistics execution', true)
ON CONFLICT (code) DO NOTHING;

-- Seed Canonical Permissions (15 Modules x 7 Action Types)
INSERT INTO permissions (code, module, action, description) VALUES
  ('users.VIEW', 'users', 'VIEW', 'View staff user profiles'),
  ('users.CREATE', 'users', 'CREATE', 'Create new staff user profiles'),
  ('users.EDIT', 'users', 'EDIT', 'Edit existing staff user profiles'),
  ('users.APPROVE', 'users', 'APPROVE', 'Approve/activate staff user profiles'),
  ('users.CANCEL', 'users', 'CANCEL', 'Deactivate staff user profiles'),
  ('users.DELETE', 'users', 'DELETE', 'Delete staff user profiles'),
  ('users.EXPORT', 'users', 'EXPORT', 'Export staff user data'),
  ('audit.VIEW', 'audit', 'VIEW', 'View system audit log entries'),
  ('audit.EXPORT', 'audit', 'EXPORT', 'Export system audit logs'),
  ('crm.VIEW', 'crm', 'VIEW', 'View CRM leads and accounts'),
  ('crm.CREATE', 'crm', 'CREATE', 'Create CRM leads'),
  ('crm.EDIT', 'crm', 'EDIT', 'Edit CRM leads'),
  ('crm.APPROVE', 'crm', 'APPROVE', 'Approve CRM accounts'),
  ('crm.CANCEL', 'crm', 'CANCEL', 'Cancel CRM leads'),
  ('crm.DELETE', 'crm', 'DELETE', 'Delete CRM records'),
  ('crm.EXPORT', 'crm', 'EXPORT', 'Export CRM data'),
  ('customers.VIEW', 'customers', 'VIEW', 'View B2B customer accounts'),
  ('customers.CREATE', 'customers', 'CREATE', 'Create B2B customer accounts'),
  ('customers.EDIT', 'customers', 'EDIT', 'Edit B2B customer accounts'),
  ('customers.APPROVE', 'customers', 'APPROVE', 'Approve credit terms and customer accounts'),
  ('customers.CANCEL', 'customers', 'CANCEL', 'Suspend customer accounts'),
  ('customers.DELETE', 'customers', 'DELETE', 'Delete customer accounts'),
  ('customers.EXPORT', 'customers', 'EXPORT', 'Export customer data'),
  ('products.VIEW', 'products', 'VIEW', 'View product catalog'),
  ('products.CREATE', 'products', 'CREATE', 'Create product SKUs'),
  ('products.EDIT', 'products', 'EDIT', 'Edit product details and inventory'),
  ('products.APPROVE', 'products', 'APPROVE', 'Approve new product listings'),
  ('products.DELETE', 'products', 'DELETE', 'Delete product SKUs'),
  ('products.EXPORT', 'products', 'EXPORT', 'Export product catalog data'),
  ('pricing.VIEW', 'pricing', 'VIEW', 'View price lists and tier rules'),
  ('pricing.CREATE', 'pricing', 'CREATE', 'Create price lists'),
  ('pricing.EDIT', 'pricing', 'EDIT', 'Edit price lists'),
  ('pricing.APPROVE', 'pricing', 'APPROVE', 'Approve dynamic price adjustments'),
  ('pricing.DELETE', 'pricing', 'DELETE', 'Delete price rules'),
  ('pricing.EXPORT', 'pricing', 'EXPORT', 'Export pricing data'),
  ('quotations.VIEW', 'quotations', 'VIEW', 'View sales quotations'),
  ('quotations.CREATE', 'quotations', 'CREATE', 'Draft new quotations'),
  ('quotations.EDIT', 'quotations', 'EDIT', 'Edit draft quotations'),
  ('quotations.APPROVE', 'quotations', 'APPROVE', 'Approve quotations for client issue'),
  ('quotations.CANCEL', 'quotations', 'CANCEL', 'Cancel quotations'),
  ('quotations.DELETE', 'quotations', 'DELETE', 'Delete draft quotations'),
  ('quotations.EXPORT', 'quotations', 'EXPORT', 'Export quotation history'),
  ('orders.VIEW', 'orders', 'VIEW', 'View customer orders'),
  ('orders.CREATE', 'orders', 'CREATE', 'Create sales orders'),
  ('orders.EDIT', 'orders', 'EDIT', 'Edit sales orders'),
  ('orders.APPROVE', 'orders', 'APPROVE', 'Approve customer orders for fulfillment'),
  ('orders.CANCEL', 'orders', 'CANCEL', 'Cancel orders'),
  ('orders.DELETE', 'orders', 'DELETE', 'Delete unfulfilled orders'),
  ('orders.EXPORT', 'orders', 'EXPORT', 'Export order data'),
  ('procurement.VIEW', 'procurement', 'VIEW', 'View farm purchase orders'),
  ('procurement.CREATE', 'procurement', 'CREATE', 'Draft purchase orders'),
  ('procurement.EDIT', 'procurement', 'EDIT', 'Edit purchase orders'),
  ('procurement.APPROVE', 'procurement', 'APPROVE', 'Approve purchase orders'),
  ('procurement.CANCEL', 'procurement', 'CANCEL', 'Cancel purchase orders'),
  ('procurement.DELETE', 'procurement', 'DELETE', 'Delete purchase orders'),
  ('procurement.EXPORT', 'procurement', 'EXPORT', 'Export procurement data'),
  ('suppliers_farms.VIEW', 'suppliers_farms', 'VIEW', 'View farm suppliers'),
  ('suppliers_farms.CREATE', 'suppliers_farms', 'CREATE', 'Register new farm suppliers'),
  ('suppliers_farms.EDIT', 'suppliers_farms', 'EDIT', 'Edit supplier details'),
  ('suppliers_farms.APPROVE', 'suppliers_farms', 'APPROVE', 'Approve supplier onboarding'),
  ('suppliers_farms.DELETE', 'suppliers_farms', 'DELETE', 'Delete supplier records'),
  ('suppliers_farms.EXPORT', 'suppliers_farms', 'EXPORT', 'Export supplier directory'),
  ('dispatch.VIEW', 'dispatch', 'VIEW', 'View dispatch schedule and loads'),
  ('dispatch.CREATE', 'dispatch', 'CREATE', 'Create dispatch runs'),
  ('dispatch.EDIT', 'dispatch', 'EDIT', 'Edit dispatch manifests'),
  ('dispatch.APPROVE', 'dispatch', 'APPROVE', 'Approve dispatch for transit'),
  ('dispatch.CANCEL', 'dispatch', 'CANCEL', 'Cancel dispatch runs'),
  ('dispatch.DELETE', 'dispatch', 'DELETE', 'Delete unfulfilled dispatch runs'),
  ('dispatch.EXPORT', 'dispatch', 'EXPORT', 'Export dispatch manifests'),
  ('deliveries.VIEW', 'deliveries', 'VIEW', 'View delivery status and Proof of Delivery'),
  ('deliveries.CREATE', 'deliveries', 'CREATE', 'Record delivery runs'),
  ('deliveries.EDIT', 'deliveries', 'EDIT', 'Update delivery status'),
  ('deliveries.APPROVE', 'deliveries', 'APPROVE', 'Approve Proof of Delivery'),
  ('deliveries.CANCEL', 'deliveries', 'CANCEL', 'Cancel delivery runs'),
  ('deliveries.EXPORT', 'deliveries', 'EXPORT', 'Export delivery logs'),
  ('invoices.VIEW', 'invoices', 'VIEW', 'View customer invoices'),
  ('invoices.CREATE', 'invoices', 'CREATE', 'Generate tax invoices'),
  ('invoices.EDIT', 'invoices', 'EDIT', 'Edit invoice details prior to issue'),
  ('invoices.APPROVE', 'invoices', 'APPROVE', 'Approve issued invoices'),
  ('invoices.CANCEL', 'invoices', 'CANCEL', 'Issue credit notes / cancel invoices'),
  ('invoices.DELETE', 'invoices', 'DELETE', 'Delete draft invoices'),
  ('invoices.EXPORT', 'invoices', 'EXPORT', 'Export billing and invoice data'),
  ('payments.VIEW', 'payments', 'VIEW', 'View payment records'),
  ('payments.CREATE', 'payments', 'CREATE', 'Record payments'),
  ('payments.EDIT', 'payments', 'EDIT', 'Edit payment entries'),
  ('payments.APPROVE', 'payments', 'APPROVE', 'Approve payment reconciliations'),
  ('payments.CANCEL', 'payments', 'CANCEL', 'Reverse payment entries'),
  ('payments.DELETE', 'payments', 'DELETE', 'Delete unposted payments'),
  ('payments.EXPORT', 'payments', 'EXPORT', 'Export financial payment logs'),
  ('support.VIEW', 'support', 'VIEW', 'View support desk tickets'),
  ('support.CREATE', 'support', 'CREATE', 'Create support tickets'),
  ('support.EDIT', 'support', 'EDIT', 'Update support ticket status'),
  ('support.APPROVE', 'support', 'APPROVE', 'Approve resolution refunds'),
  ('support.CANCEL', 'support', 'CANCEL', 'Close support tickets')
ON CONFLICT (code) DO NOTHING;

-- Map All Seeded Permissions to Canonical Roles (SUPER_ADMIN mapping)
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM roles r
CROSS JOIN permissions p
WHERE r.code = 'SUPER_ADMIN'
ON CONFLICT (role_id, permission_id) DO NOTHING;

-- Dynamic Live Permission Resolution Function (Enforces ACTIVE status and dynamic RBAC)
CREATE OR REPLACE FUNCTION public.has_permission(
  p_user_id UUID,
  p_module TEXT,
  p_action TEXT
)
RETURNS BOOLEAN AS $$
DECLARE
  v_status user_status_enum;
  v_has_perm BOOLEAN;
BEGIN
  IF p_user_id IS NULL THEN
    RETURN FALSE;
  END IF;

  -- 1. Check live user status. If SUSPENDED or DEACTIVATED -> DENIED immediately
  SELECT status INTO v_status FROM public.users WHERE id = p_user_id;
  IF v_status IS NULL OR v_status != 'ACTIVE' THEN
    RETURN FALSE;
  END IF;

  -- 2. Check if user holds SUPER_ADMIN role
  IF EXISTS (
    SELECT 1 FROM public.user_roles ur
    JOIN public.roles r ON ur.role_id = r.id
    WHERE ur.user_id = p_user_id AND r.code = 'SUPER_ADMIN'
  ) THEN
    RETURN TRUE;
  END IF;

  -- 3. Resolve permissions dynamically via user_roles -> roles -> role_permissions -> permissions
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles ur
    JOIN public.role_permissions rp ON ur.role_id = rp.role_id
    JOIN public.permissions p ON rp.permission_id = p.id
    WHERE ur.user_id = p_user_id
      AND p.module = p_module
      AND p.action = p_action
  ) INTO v_has_perm;

  RETURN COALESCE(v_has_perm, FALSE);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp;

-- 7. Append-Only Audit Logs Table & Trusted Write Path
CREATE TABLE audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_user_id UUID NULL REFERENCES users(id) ON DELETE SET NULL,
  actor_role VARCHAR(50) NOT NULL,
  actor_email VARCHAR(255) NOT NULL,
  actor_org_id UUID NULL REFERENCES organizations(id) ON DELETE SET NULL,
  action VARCHAR(100) NOT NULL,
  entity_type VARCHAR(100) NOT NULL,
  entity_id VARCHAR(255) NOT NULL,
  before_json JSONB NULL,
  after_json JSONB NULL,
  reason TEXT NULL,
  request_id VARCHAR(255) NULL,
  source_app VARCHAR(100) NOT NULL DEFAULT 'admin.farmreem.com',
  ip_address VARCHAR(50) NULL,
  timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Revoke direct raw INSERT access to prevent client audit fabrication
REVOKE INSERT ON public.audit_logs FROM authenticated, anon;

-- Trusted Audit Event Function (Server/DB executed only)
CREATE OR REPLACE FUNCTION public.log_audit_event(
  p_action VARCHAR(100),
  p_entity_type VARCHAR(100),
  p_entity_id VARCHAR(255),
  p_before_json JSONB DEFAULT NULL,
  p_after_json JSONB DEFAULT NULL,
  p_reason TEXT DEFAULT NULL,
  p_source_app VARCHAR(100) DEFAULT 'admin.farmreem.com'
)
RETURNS UUID AS $$
DECLARE
  v_actor_user_id UUID;
  v_actor_email VARCHAR(255);
  v_actor_role VARCHAR(50);
  v_audit_id UUID;
BEGIN
  v_actor_user_id := auth.uid();
  
  -- Fetch authenticated user profile & primary role directly from DB
  SELECT email INTO v_actor_email FROM public.users WHERE id = v_actor_user_id;
  
  SELECT r.code INTO v_actor_role
  FROM public.user_roles ur
  JOIN public.roles r ON ur.role_id = r.id
  WHERE ur.user_id = v_actor_user_id
  LIMIT 1;

  IF v_actor_role IS NULL THEN
    v_actor_role := 'ANONYMOUS';
  END IF;

  INSERT INTO public.audit_logs (
    actor_user_id,
    actor_email,
    actor_role,
    action,
    entity_type,
    entity_id,
    before_json,
    after_json,
    reason,
    source_app,
    timestamp
  ) VALUES (
    v_actor_user_id,
    COALESCE(v_actor_email, 'system@farmreem.com'),
    v_actor_role,
    p_action,
    p_entity_type,
    p_entity_id,
    p_before_json,
    p_after_json,
    p_reason,
    p_source_app,
    NOW()
  ) RETURNING id INTO v_audit_id;

  RETURN v_audit_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp;

-- Audit Log Immutability Trigger (Blocks UPDATE and DELETE for ALL application roles)
CREATE OR REPLACE FUNCTION lock_audit_logs()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp AS $$
BEGIN
  RAISE EXCEPTION 'Audit log entries are immutable and cannot be updated or deleted by any application role.';
END;
$$;

CREATE TRIGGER trg_lock_audit_logs
BEFORE UPDATE OR DELETE ON audit_logs
FOR EACH ROW EXECUTE FUNCTION lock_audit_logs();

-- 8. Background Jobs Table with Stale Lock Recovery & Failure Handler
CREATE TABLE background_jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  job_type VARCHAR(100) NOT NULL,
  payload JSONB NOT NULL DEFAULT '{}'::jsonb,
  idempotency_key VARCHAR(255) UNIQUE NOT NULL,
  status job_status_enum NOT NULL DEFAULT 'PENDING',
  attempt_count INT NOT NULL DEFAULT 0,
  max_attempts INT NOT NULL DEFAULT 5,
  run_after TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  locked_at TIMESTAMPTZ NULL,
  locked_by VARCHAR(255) NULL,
  last_error TEXT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  started_at TIMESTAMPTZ NULL,
  completed_at TIMESTAMPTZ NULL,
  failed_at TIMESTAMPTZ NULL
);

CREATE INDEX idx_background_jobs_claim ON background_jobs (status, run_after) WHERE status IN ('PENDING', 'RETRY');

-- Function to Atomically Claim Job with Stale Lock Recovery (5-Minute Lock Expiry)
CREATE OR REPLACE FUNCTION claim_background_job(
  worker_id VARCHAR(255),
  lock_timeout_seconds INT DEFAULT 300
)
RETURNS SETOF background_jobs AS $$
BEGIN
  RETURN QUERY
  UPDATE background_jobs
  SET 
    status = 'PROCESSING',
    locked_at = NOW(),
    locked_by = worker_id,
    started_at = NOW(),
    attempt_count = attempt_count + 1
  WHERE id = (
    SELECT id
    FROM background_jobs
    WHERE (
      status IN ('PENDING', 'RETRY')
      OR (status = 'PROCESSING' AND locked_at < NOW() - (lock_timeout_seconds || ' seconds')::INTERVAL)
    )
    AND run_after <= NOW()
    ORDER BY run_after ASC
    FOR UPDATE SKIP LOCKED
    LIMIT 1
  )
  RETURNING *;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp;

-- Function to Handle Background Job Failures (Transitions to RETRY or DEAD_LETTER)
CREATE OR REPLACE FUNCTION mark_job_failed(
  p_job_id UUID,
  p_error TEXT
)
RETURNS background_jobs AS $$
DECLARE
  v_job background_jobs;
BEGIN
  SELECT * INTO v_job FROM background_jobs WHERE id = p_job_id FOR UPDATE;

  IF v_job.attempt_count >= v_job.max_attempts THEN
    UPDATE background_jobs
    SET status = 'DEAD_LETTER',
        last_error = p_error,
        failed_at = NOW(),
        locked_at = NULL,
        locked_by = NULL
    WHERE id = p_job_id
    RETURNING * INTO v_job;
  ELSE
    UPDATE background_jobs
    SET status = 'RETRY',
        last_error = p_error,
        run_after = NOW() + (INTERVAL '1 minute' * v_job.attempt_count),
        locked_at = NULL,
        locked_by = NULL
    WHERE id = p_job_id
    RETURNING * INTO v_job;
  END IF;

  RETURN v_job;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp;

-- 9. Idempotency Keys Table
CREATE TABLE idempotency_keys (
  key VARCHAR(255) PRIMARY KEY,
  scope VARCHAR(100) NOT NULL,
  status VARCHAR(50) NOT NULL DEFAULT 'PROCESSING',
  response_json JSONB NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  expires_at TIMESTAMPTZ NOT NULL DEFAULT (NOW() + INTERVAL '24 hours')
);

-- 10. Row Level Security Policies
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE organization_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE role_permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE background_jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE idempotency_keys ENABLE ROW LEVEL SECURITY;

-- Revoke direct client access on idempotency_keys (Server/DB execution only)
REVOKE ALL ON public.idempotency_keys FROM authenticated, anon;

-- User Table RLS Policies (Live Requester-Status & Permission Enforced)
CREATE POLICY users_self_read ON users
  FOR SELECT TO authenticated
  USING (
    id = auth.uid() 
    AND EXISTS (
      SELECT 1 FROM public.users u 
      WHERE u.id = auth.uid() AND u.status = 'ACTIVE'
    )
  );

CREATE POLICY users_staff_read ON users
  FOR SELECT TO authenticated
  USING (public.has_permission(auth.uid(), 'users', 'VIEW'));

-- Audit Logs Table RLS Policy
CREATE POLICY audit_logs_read ON audit_logs
  FOR SELECT TO authenticated
  USING (public.has_permission(auth.uid(), 'audit', 'VIEW'));

-- Roles & Permissions RLS Policies
CREATE POLICY roles_read ON roles
  FOR SELECT TO authenticated
  USING (public.has_permission(auth.uid(), 'users', 'VIEW'));

CREATE POLICY permissions_read ON permissions
  FOR SELECT TO authenticated
  USING (public.has_permission(auth.uid(), 'users', 'VIEW'));

CREATE POLICY role_permissions_read ON role_permissions
  FOR SELECT TO authenticated
  USING (public.has_permission(auth.uid(), 'users', 'VIEW'));

CREATE POLICY user_roles_self_read ON user_roles
  FOR SELECT TO authenticated
  USING (
    user_id = auth.uid()
    AND EXISTS (
      SELECT 1 FROM public.users u 
      WHERE u.id = auth.uid() AND u.status = 'ACTIVE'
    )
  );

CREATE POLICY user_roles_staff_read ON user_roles
  FOR SELECT TO authenticated
  USING (public.has_permission(auth.uid(), 'users', 'VIEW'));

-- Organizations RLS Policies
CREATE POLICY organizations_read ON organizations
  FOR SELECT TO authenticated
  USING (public.has_permission(auth.uid(), 'customers', 'VIEW') OR public.has_permission(auth.uid(), 'suppliers_farms', 'VIEW'));

CREATE POLICY organization_members_read ON organization_members
  FOR SELECT TO authenticated
  USING (user_id = auth.uid() OR public.has_permission(auth.uid(), 'customers', 'VIEW'));

-- Background Jobs RLS Policy
CREATE POLICY background_jobs_read ON background_jobs
  FOR SELECT TO authenticated
  USING (public.has_permission(auth.uid(), 'audit', 'VIEW'));
