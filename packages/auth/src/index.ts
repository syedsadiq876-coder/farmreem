import type { ActionType, ModuleType, StaffRole } from '../../types/src/index.ts';

// Implementation of the FarmReem 8x7 Permissions Matrix
// Matrix Maps: Role -> Module -> Set of Allowed Actions

export const PERMISSIONS_MATRIX: Record<
  StaffRole,
  Partial<Record<ModuleType, ActionType[]>>
> = {
  SUPER_ADMIN: {
    crm: ['VIEW', 'CREATE', 'EDIT', 'APPROVE', 'CANCEL', 'DELETE', 'EXPORT'],
    customers: ['VIEW', 'CREATE', 'EDIT', 'APPROVE', 'CANCEL', 'DELETE', 'EXPORT'],
    products: ['VIEW', 'CREATE', 'EDIT', 'APPROVE', 'DELETE', 'EXPORT'],
    pricing: ['VIEW', 'CREATE', 'EDIT', 'APPROVE', 'DELETE', 'EXPORT'],
    quotations: ['VIEW', 'CREATE', 'EDIT', 'APPROVE', 'CANCEL', 'DELETE', 'EXPORT'],
    orders: ['VIEW', 'CREATE', 'EDIT', 'APPROVE', 'CANCEL', 'DELETE', 'EXPORT'],
    procurement: ['VIEW', 'CREATE', 'EDIT', 'APPROVE', 'CANCEL', 'DELETE', 'EXPORT'],
    suppliers_farms: ['VIEW', 'CREATE', 'EDIT', 'APPROVE', 'DELETE', 'EXPORT'],
    dispatch: ['VIEW', 'CREATE', 'EDIT', 'APPROVE', 'CANCEL', 'DELETE', 'EXPORT'],
    deliveries: ['VIEW', 'CREATE', 'EDIT', 'APPROVE', 'CANCEL', 'DELETE', 'EXPORT'],
    invoices: ['VIEW', 'CREATE', 'EDIT', 'APPROVE', 'CANCEL', 'DELETE', 'EXPORT'],
    payments: ['VIEW', 'CREATE', 'EDIT', 'APPROVE', 'CANCEL', 'DELETE', 'EXPORT'],
    support: ['VIEW', 'CREATE', 'EDIT', 'APPROVE', 'CANCEL', 'DELETE', 'EXPORT'],
    users: ['VIEW', 'CREATE', 'EDIT', 'APPROVE', 'CANCEL', 'DELETE', 'EXPORT'],
    audit: ['VIEW', 'EXPORT'],
  },

  OPERATIONS_ADMIN: {
    crm: ['VIEW', 'CREATE', 'EDIT'],
    customers: ['VIEW', 'CREATE', 'EDIT'],
    products: ['VIEW', 'CREATE', 'EDIT', 'APPROVE'],
    pricing: ['VIEW', 'CREATE', 'EDIT'],
    quotations: ['VIEW', 'CREATE', 'EDIT'],
    orders: ['VIEW', 'CREATE', 'EDIT', 'APPROVE', 'CANCEL', 'EXPORT'],
    procurement: ['VIEW', 'CREATE', 'EDIT', 'APPROVE', 'EXPORT'],
    suppliers_farms: ['VIEW', 'CREATE', 'EDIT'],
    dispatch: ['VIEW', 'CREATE', 'EDIT', 'APPROVE', 'EXPORT'],
    deliveries: ['VIEW', 'CREATE', 'EDIT', 'APPROVE', 'EXPORT'],
    invoices: ['VIEW', 'CREATE', 'EDIT'],
    payments: ['VIEW'],
    support: ['VIEW', 'CREATE', 'EDIT', 'APPROVE'],
    users: [],
    audit: ['VIEW'],
  },

  SALES_MANAGER: {
    crm: ['VIEW', 'CREATE', 'EDIT', 'APPROVE', 'CANCEL', 'EXPORT'],
    customers: ['VIEW', 'CREATE', 'EDIT', 'APPROVE', 'EXPORT'],
    products: ['VIEW', 'CREATE', 'EDIT'],
    pricing: ['VIEW', 'CREATE', 'EDIT', 'APPROVE', 'EXPORT'],
    quotations: ['VIEW', 'CREATE', 'EDIT', 'APPROVE', 'CANCEL', 'EXPORT'],
    orders: ['VIEW', 'CREATE', 'EDIT', 'APPROVE', 'CANCEL', 'EXPORT'],
    procurement: ['VIEW'],
    suppliers_farms: [],
    dispatch: [],
    deliveries: ['VIEW'],
    invoices: ['VIEW'],
    payments: ['VIEW'],
    support: ['VIEW', 'CREATE', 'EDIT'],
    users: [],
    audit: ['VIEW'],
  },

  SALESPERSON: {
    crm: ['VIEW', 'CREATE', 'EDIT'],
    customers: ['VIEW', 'CREATE', 'EDIT'],
    products: ['VIEW'],
    pricing: ['VIEW'],
    quotations: ['VIEW', 'CREATE', 'EDIT'],
    orders: ['VIEW', 'CREATE', 'EDIT'],
    procurement: [],
    suppliers_farms: [],
    dispatch: [],
    deliveries: ['VIEW'],
    invoices: ['VIEW'],
    payments: ['VIEW'],
    support: ['VIEW', 'CREATE', 'EDIT'],
    users: [],
    audit: [],
  },

  PROCUREMENT_MANAGER: {
    crm: ['VIEW'],
    customers: ['VIEW'],
    products: ['VIEW', 'CREATE', 'EDIT'],
    pricing: ['VIEW'],
    quotations: [],
    orders: ['VIEW'],
    procurement: ['VIEW', 'CREATE', 'EDIT', 'APPROVE', 'CANCEL', 'EXPORT'],
    suppliers_farms: ['VIEW', 'CREATE', 'EDIT', 'APPROVE', 'EXPORT'],
    dispatch: ['VIEW'],
    deliveries: [],
    invoices: ['VIEW'],
    payments: [],
    support: ['VIEW'],
    users: [],
    audit: ['VIEW'],
  },

  ACCOUNTS_MANAGER: {
    crm: ['VIEW'],
    customers: ['VIEW', 'CREATE', 'EDIT', 'APPROVE'],
    products: ['VIEW'],
    pricing: ['VIEW'],
    quotations: ['VIEW'],
    orders: ['VIEW', 'CREATE', 'EDIT', 'CANCEL'],
    procurement: ['VIEW', 'EDIT'],
    suppliers_farms: ['VIEW'],
    dispatch: [],
    deliveries: ['VIEW'],
    invoices: ['VIEW', 'CREATE', 'EDIT', 'APPROVE', 'CANCEL', 'EXPORT'],
    payments: ['VIEW', 'CREATE', 'EDIT', 'APPROVE', 'CANCEL', 'EXPORT'],
    support: ['VIEW', 'CREATE', 'EDIT'],
    users: [],
    audit: ['VIEW'],
  },

  DISPATCH_MANAGER: {
    crm: [],
    customers: ['VIEW'],
    products: ['VIEW'],
    pricing: [],
    quotations: [],
    orders: ['VIEW', 'CREATE', 'EDIT'],
    procurement: ['VIEW'],
    suppliers_farms: [],
    dispatch: ['VIEW', 'CREATE', 'EDIT', 'APPROVE', 'EXPORT'],
    deliveries: ['VIEW', 'CREATE', 'EDIT', 'APPROVE'],
    invoices: [],
    payments: [],
    support: ['VIEW'],
    users: [],
    audit: [],
  },

  DRIVER: {
    crm: [],
    customers: ['VIEW'],
    products: ['VIEW'],
    pricing: [],
    quotations: [],
    orders: ['VIEW'],
    procurement: [],
    suppliers_farms: [],
    dispatch: ['VIEW'],
    deliveries: ['VIEW', 'CREATE', 'EDIT'],
    invoices: [],
    payments: [],
    support: ['VIEW'],
    users: [],
    audit: [],
  },
};

/**
 * Validates whether a staff role has permission to execute an action on a module.
 */
export function hasPermission(
  role: StaffRole,
  module: ModuleType,
  action: ActionType
): boolean {
  if (!role || !PERMISSIONS_MATRIX[role]) return false;
  const allowedActions = PERMISSIONS_MATRIX[role][module] || [];
  return allowedActions.includes(action);
}

/**
 * Enforces server-side authorization check. Throws error if unauthorized.
 */
export function assertPermission(
  role: StaffRole,
  module: ModuleType,
  action: ActionType
): void {
  if (!hasPermission(role, module, action)) {
    throw new Error(
      `Access Denied: Role '${role}' lacks '${action}' permission on module '${module}'.`
    );
  }
}
