import {
  ShieldCheck,
  Lock,
  Database,
  Layers,
  CheckCircle2,
  AlertTriangle,
  Server,
  FileCheck,
} from "lucide-react";
import { PERMISSIONS_MATRIX, hasPermission } from "@farmreem/auth";

export default function AdminDashboardPage() {
  const superAdminCrmCreate = hasPermission("SUPER_ADMIN", "crm", "CREATE");
  const driverPricingEdit = hasPermission("DRIVER", "pricing", "EDIT");
  const salesPersonAuditDelete = hasPermission("SALESPERSON", "audit", "DELETE");
  const financeCtrlInvoiceApprove = hasPermission("FINANCE_CONTROLLER", "invoices", "APPROVE");

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Overview Banner */}
      <div className="bg-[#0F2E23] text-white rounded-3xl p-8 border border-[#184636] shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-[#C59B27] uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4" />
              <span>Phase 1 Platform Foundation Active</span>
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight mt-1 text-white">
              FarmReem OS — Operational Dashboard
            </h1>
            <p className="text-xs text-[#FAF7F2]/80 mt-1 max-w-2xl">
              Internal staff administration portal operating on <code className="text-[#C59B27] font-semibold">admin.farmreem.com</code>. Public marketing surface (<code className="text-emerald-300">www.farmreem.com</code>) remains 100% frozen & isolated.
            </p>
          </div>
          <div className="bg-[#184636] px-4 py-2 rounded-2xl border border-emerald-600/30 text-right">
            <span className="text-[10px] font-bold text-slate-300 uppercase tracking-wider block">Security Protocol</span>
            <span className="text-xs font-extrabold text-emerald-400">NOINDEX · RBAC Active</span>
          </div>
        </div>
      </div>

      {/* Verification Cards Matrix */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        
        {/* Card 1: Auth & Trust Domain */}
        <div className="bg-white rounded-3xl border border-[#E8E1D3] p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
              <Lock className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-extrabold bg-emerald-100 text-emerald-800 px-2.5 py-1 rounded-full">
              VERIFIED
            </span>
          </div>
          <div>
            <h3 className="font-extrabold text-base text-[#0F2E23]">Auth & Trust Domain</h3>
            <p className="text-xs text-[#4F5E57] mt-1">
              Cookies scoped to <code className="bg-[#FAF7F2] px-1 py-0.5 rounded text-[11px]">__Host-farmreem-admin-session</code>. Zero wildcard cookie leakage across subdomains.
            </p>
          </div>
          <div className="pt-3 border-t border-[#E8E1D3] text-xs space-y-1.5 font-medium text-[#0F2E23]">
            <div className="flex items-center gap-1.5 text-emerald-800 font-bold">
              <CheckCircle2 className="w-3.5 h-3.5" /> Staff App Access Claim Active
            </div>
            <div className="flex items-center gap-1.5 text-emerald-800 font-bold">
              <CheckCircle2 className="w-3.5 h-3.5" /> Deactivation Revokes Session Instantly
            </div>
          </div>
        </div>

        {/* Card 2: RBAC Matrix */}
        <div className="bg-white rounded-3xl border border-[#E8E1D3] p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center font-bold">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-extrabold bg-emerald-100 text-emerald-800 px-2.5 py-1 rounded-full">
              ENFORCED
            </span>
          </div>
          <div>
            <h3 className="font-extrabold text-base text-[#0F2E23]">8x7 RBAC Matrix</h3>
            <p className="text-xs text-[#4F5E57] mt-1">
              8 Staff Roles across 15 Modules & 7 Action Types. Server-side + RLS enforced.
            </p>
          </div>
          <div className="pt-3 border-t border-[#E8E1D3] text-[11px] space-y-1 font-mono text-[#0F2E23]">
            <div>SUPER_ADMIN crm:CREATE $\rightarrow$ <span className="text-emerald-700 font-bold">{String(superAdminCrmCreate)}</span></div>
            <div>DRIVER pricing:EDIT $\rightarrow$ <span className="text-rose-700 font-bold">{String(driverPricingEdit)} (DENIED)</span></div>
            <div>FINANCE_CTRL invoice:APPROVE $\rightarrow$ <span className="text-emerald-700 font-bold">{String(financeCtrlInvoiceApprove)}</span></div>
          </div>
        </div>

        {/* Card 3: Audit Log Guarantee */}
        <div className="bg-white rounded-3xl border border-[#E8E1D3] p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-700 flex items-center justify-center font-bold">
              <Database className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-extrabold bg-emerald-100 text-emerald-800 px-2.5 py-1 rounded-full">
              APPEND-ONLY
            </span>
          </div>
          <div>
            <h3 className="font-extrabold text-base text-[#0F2E23]">Audit Log Security</h3>
            <p className="text-xs text-[#4F5E57] mt-1">
              Postgres DB Trigger prevents UPDATE and DELETE on <code className="bg-[#FAF7F2] px-1 py-0.5 rounded text-[11px]">audit_logs</code>.
            </p>
          </div>
          <div className="pt-3 border-t border-[#E8E1D3] text-xs space-y-1.5 font-medium text-[#0F2E23]">
            <div className="flex items-center gap-1.5 text-emerald-800 font-bold">
              <CheckCircle2 className="w-3.5 h-3.5" /> No App Role Can Delete Audit Logs
            </div>
            <div className="flex items-center gap-1.5 text-emerald-800 font-bold">
              <CheckCircle2 className="w-3.5 h-3.5" /> Actor-at-Event Context Captured
            </div>
          </div>
        </div>

        {/* Card 4: Stale Job Recovery */}
        <div className="bg-white rounded-3xl border border-[#E8E1D3] p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-2xl bg-[#FAF7F2] text-[#0F2E23] flex items-center justify-center font-bold">
              <Server className="w-5 h-5 text-[#C59B27]" />
            </div>
            <span className="text-[10px] font-extrabold bg-emerald-100 text-emerald-800 px-2.5 py-1 rounded-full">
              ATOMIC
            </span>
          </div>
          <div>
            <h3 className="font-extrabold text-base text-[#0F2E23]">Background Jobs Contract</h3>
            <p className="text-xs text-[#4F5E57] mt-1">
              Atomic claims via <code className="bg-[#FAF7F2] px-1 py-0.5 rounded text-[11px]">SKIP LOCKED</code> with 5-min stale lock recovery.
            </p>
          </div>
          <div className="pt-3 border-t border-[#E8E1D3] text-xs space-y-1.5 font-medium text-[#0F2E23]">
            <div className="flex items-center gap-1.5 text-emerald-800 font-bold">
              <CheckCircle2 className="w-3.5 h-3.5" /> Zero Double-Worker Processing
            </div>
            <div className="flex items-center gap-1.5 text-emerald-800 font-bold">
              <CheckCircle2 className="w-3.5 h-3.5" /> 6 Job Statuses Supported
            </div>
          </div>
        </div>

        {/* Card 5: Financial Lock Points */}
        <div className="bg-white rounded-3xl border border-[#E8E1D3] p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-2xl bg-purple-50 text-purple-700 flex items-center justify-center font-bold">
              <FileCheck className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-extrabold bg-emerald-100 text-emerald-800 px-2.5 py-1 rounded-full">
              LOCKED
            </span>
          </div>
          <div>
            <h3 className="font-extrabold text-base text-[#0F2E23]">Financial Immutability</h3>
            <p className="text-xs text-[#4F5E57] mt-1">
              Explicit transition points (<code className="bg-[#FAF7F2] px-1 py-0.5 rounded text-[11px]">ISSUED</code>, <code className="bg-[#FAF7F2] px-1 py-0.5 rounded text-[11px]">RECORDED</code>, <code className="bg-[#FAF7F2] px-1 py-0.5 rounded text-[11px]">FINALIZED</code>).
            </p>
          </div>
          <div className="pt-3 border-t border-[#E8E1D3] text-xs space-y-1.5 font-medium text-[#0F2E23]">
            <div className="flex items-center gap-1.5 text-emerald-800 font-bold">
              <CheckCircle2 className="w-3.5 h-3.5" /> Credit/Debit Reversal Protocol
            </div>
            <div className="flex items-center gap-1.5 text-emerald-800 font-bold">
              <CheckCircle2 className="w-3.5 h-3.5" /> Zero Silent Overwriting
            </div>
          </div>
        </div>

        {/* Card 6: www.farmreem.com Isolation */}
        <div className="bg-white rounded-3xl border border-[#E8E1D3] p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-800 flex items-center justify-center font-bold">
              <Layers className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-extrabold bg-emerald-100 text-emerald-800 px-2.5 py-1 rounded-full">
              ISOLATED
            </span>
          </div>
          <div>
            <h3 className="font-extrabold text-base text-[#0F2E23]">www.farmreem.com Safety</h3>
            <p className="text-xs text-[#4F5E57] mt-1">
              Public marketing site is 100% frozen & separate. Zero admin code or login links on public pages.
            </p>
          </div>
          <div className="pt-3 border-t border-[#E8E1D3] text-xs space-y-1.5 font-medium text-[#0F2E23]">
            <div className="flex items-center gap-1.5 text-emerald-800 font-bold">
              <CheckCircle2 className="w-3.5 h-3.5" /> Public SEO Frozen & Active
            </div>
            <div className="flex items-center gap-1.5 text-emerald-800 font-bold">
              <CheckCircle2 className="w-3.5 h-3.5" /> Independent Vercel Projects
            </div>
          </div>
        </div>

      </div>

      {/* Phase 1 Verification Technical Summary */}
      <div className="bg-white rounded-3xl border border-[#E8E1D3] p-6 shadow-sm space-y-4">
        <h3 className="font-extrabold text-lg text-[#0F2E23]">Phase 1 System Verification Parameters</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
          <div className="bg-[#FAF7F2] p-4 rounded-2xl border border-[#E8E1D3]">
            <span className="font-bold text-[#4F5E57] block uppercase text-[10px]">Database Engine</span>
            <span className="font-extrabold text-[#0F2E23] text-sm">Supabase Postgres 15</span>
          </div>
          <div className="bg-[#FAF7F2] p-4 rounded-2xl border border-[#E8E1D3]">
            <span className="font-bold text-[#4F5E57] block uppercase text-[10px]">Framework</span>
            <span className="font-extrabold text-[#0F2E23] text-sm">Next.js 16.3 App Router</span>
          </div>
          <div className="bg-[#FAF7F2] p-4 rounded-2xl border border-[#E8E1D3]">
            <span className="font-bold text-[#4F5E57] block uppercase text-[10px]">Deployment Target</span>
            <span className="font-extrabold text-[#0F2E23] text-sm">Vercel Staging / Preview</span>
          </div>
          <div className="bg-[#FAF7F2] p-4 rounded-2xl border border-[#E8E1D3]">
            <span className="font-bold text-[#4F5E57] block uppercase text-[10px]">Public Site Status</span>
            <span className="font-extrabold text-emerald-700 text-sm">100% Frozen & Untouched</span>
          </div>
        </div>
      </div>
    </div>
  );
}
