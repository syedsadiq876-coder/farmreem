// FarmReem Domain Types & Roles Specification

export type UserType = 'STAFF' | 'CUSTOMER' | 'SUPPLIER';

export type UserStatus = 'ACTIVE' | 'SUSPENDED' | 'DEACTIVATED';

export type StaffRole =
  | 'SUPER_ADMIN'
  | 'GENERAL_MANAGER'
  | 'SALES_MANAGER'
  | 'SALESPERSON'
  | 'PROCUREMENT_MANAGER'
  | 'OPERATIONS_DISPATCH'
  | 'FINANCE_CONTROLLER'
  | 'QUALITY_COMPLIANCE'
  | 'DRIVER';

export type ExternalRole =
  | 'CUSTOMER_USER'
  | 'SUPPLIER_USER'
  | 'SUPPORT_CUSTOMER';

export type PlatformRole = StaffRole | ExternalRole;

export type OrgType =
  | 'INTERNAL_FARMREEM'
  | 'CUSTOMER_HOTEL'
  | 'CUSTOMER_RESTAURANT'
  | 'CUSTOMER_CATERER'
  | 'CUSTOMER_INSTITUTION'
  | 'CUSTOMER_OTHER'
  | 'SUPPLIER_PRODUCER_FARM'
  | 'SUPPLIER_WHOLESALE_MARKET'
  | 'SUPPLIER_PROCESSOR'
  | 'SUPPLIER_OTHER'
  | 'PARTNER_LOGISTICS';

export type ActionType =
  | 'VIEW'
  | 'CREATE'
  | 'EDIT'
  | 'APPROVE'
  | 'CANCEL'
  | 'DELETE'
  | 'EXPORT';

export type ModuleType =
  | 'crm'
  | 'customers'
  | 'products'
  | 'pricing'
  | 'quotations'
  | 'orders'
  | 'procurement'
  | 'suppliers_farms'
  | 'dispatch'
  | 'deliveries'
  | 'invoices'
  | 'payments'
  | 'support'
  | 'users'
  | 'audit';

export interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  phone?: string;
  user_type: UserType;
  staff_role?: StaffRole;
  status: UserStatus;
  created_at: string;
  updated_at: string;
}

export interface Organization {
  id: string;
  legal_name: string;
  trade_name?: string;
  org_type: OrgType;
  tax_id_gstin?: string;
  status: 'ACTIVE' | 'SUSPENDED' | 'DEACTIVATED';
  created_at: string;
  updated_at: string;
}

export interface Permission {
  id: string;
  code: string; // e.g. "orders.create", "invoices.approve"
  module: ModuleType;
  action: ActionType;
  description: string;
}

export interface Role {
  id: string;
  code: PlatformRole;
  name: string;
  description: string;
  is_internal: boolean;
}

export interface AuditLogEntry {
  id: string;
  actor_user_id: string;
  actor_role: string;
  actor_email: string;
  actor_org_id?: string;
  action: string;
  entity_type: string;
  entity_id: string;
  before_json?: Record<string, unknown> | null;
  after_json?: Record<string, unknown> | null;
  reason?: string;
  request_id?: string;
  source_app: string;
  ip_address?: string;
  timestamp: string;
}

export type JobStatus =
  | 'PENDING'
  | 'PROCESSING'
  | 'RETRY'
  | 'COMPLETED'
  | 'FAILED'
  | 'DEAD_LETTER';

export interface BackgroundJob {
  id: string;
  job_type: string;
  payload: Record<string, unknown>;
  idempotency_key: string;
  status: JobStatus;
  attempt_count: number;
  max_attempts: number;
  run_after: string;
  locked_at?: string | null;
  locked_by?: string | null;
  last_error?: string | null;
  created_at: string;
  started_at?: string | null;
  completed_at?: string | null;
  failed_at?: string | null;
}
