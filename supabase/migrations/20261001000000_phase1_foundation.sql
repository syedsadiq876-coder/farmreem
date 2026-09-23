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

CREATE TYPE staff_role_enum AS ENUM (
  'SUPER_ADMIN',
  'OPERATIONS_ADMIN',
  'SALES_MANAGER',
  'SALESPERSON',
  'PROCUREMENT_MANAGER',
  'ACCOUNTS_MANAGER',
  'DISPATCH_MANAGER',
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

-- 7. Append-Only Audit Logs Table
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

-- 8. Background Jobs Table with Stale Lock Recovery
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

-- User Table RLS Policies (Separates app_access from user management write authorization)
CREATE POLICY users_self_read ON users
  FOR SELECT TO authenticated
  USING (id = auth.uid());

CREATE POLICY users_staff_read ON users
  FOR SELECT TO authenticated
  USING (
    ((auth.jwt() -> 'app_metadata' ->> 'app_access')::jsonb ? 'admin')
  );

CREATE POLICY audit_logs_read ON audit_logs
  FOR SELECT TO authenticated
  USING (
    ((auth.jwt() -> 'app_metadata' ->> 'app_access')::jsonb ? 'admin')
  );

CREATE POLICY audit_logs_insert ON audit_logs
  FOR INSERT TO authenticated
  WITH CHECK (true);
