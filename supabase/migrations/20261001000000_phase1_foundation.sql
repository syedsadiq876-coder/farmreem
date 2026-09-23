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
$$ LANGUAGE plpgsql SECURITY DEFINER;

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
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Audit Log Immutability Trigger (Blocks UPDATE and DELETE for ALL application roles)
CREATE OR REPLACE FUNCTION lock_audit_logs()
RETURNS TRIGGER AS $$
BEGIN
  RAISE EXCEPTION 'Audit log entries are immutable and cannot be updated or deleted by any application role.';
END;
$$ LANGUAGE plpgsql;

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
$$ LANGUAGE plpgsql;

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
$$ LANGUAGE plpgsql SECURITY DEFINER;

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

-- User Table RLS Policies (Enforces app_access and active user status)
CREATE POLICY users_self_read ON users
  FOR SELECT TO authenticated
  USING (id = auth.uid());

CREATE POLICY users_staff_read ON users
  FOR SELECT TO authenticated
  USING (
    ((auth.jwt() -> 'app_metadata' ->> 'app_access')::jsonb ? 'admin')
    AND status = 'ACTIVE'
  );

CREATE POLICY audit_logs_read ON audit_logs
  FOR SELECT TO authenticated
  USING (
    ((auth.jwt() -> 'app_metadata' ->> 'app_access')::jsonb ? 'admin')
    AND public.has_permission(auth.uid(), 'audit', 'VIEW')
  );
