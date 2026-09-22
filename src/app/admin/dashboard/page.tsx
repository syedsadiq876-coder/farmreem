import Link from "next/link";
import Logo from "@/components/layout/Logo";

export const metadata = {
  title: "Admin Operations Desk | FarmReem",
};

export default function AdminDashboardPage() {
  return (
    <div className="bg-[#FAF7F2] min-h-screen">
      {/* Admin Top Bar */}
      <div className="bg-[#0A2118] text-white border-b border-[#184636] px-4 sm:px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Logo variant="compact" />
          <span className="text-xs bg-[#C59B27]/20 text-[#C59B27] border border-[#C59B27]/40 px-2.5 py-1 rounded font-bold uppercase tracking-wider">
            Admin Workbench
          </span>
        </div>
        <div className="flex items-center gap-4 text-xs font-semibold">
          <Link href="/admin/email-templates" className="text-[#C59B27] hover:underline">
            Email Templates Preview
          </Link>
          <Link href="/login" className="text-white hover:underline">
            Sign Out
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8 space-y-8">
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-[#E8E1D3] shadow-sm">
          <span className="text-xs font-bold text-[#C59B27] uppercase tracking-wider">
            Executive Command & Operations
          </span>
          <h1 className="text-2xl font-extrabold text-[#0F2E23]">FarmReem Financial & Operating Workbench</h1>
          <p className="text-xs text-[#4F5E57] mt-1">
            Real-time daily mandi pricing, landed cost calculation, dual weighment reconciliation, and demand forecasting.
          </p>
        </div>

        {/* Financial & Operating KPIs */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-[#0F2E23] text-white p-6 rounded-xl space-y-2">
            <span className="text-xs text-[#FAF7F2]/70 uppercase tracking-wider">Tomorrow's Birds Required</span>
            <p className="text-3xl font-extrabold text-[#C59B27]">5,800 Birds</p>
            <span className="text-xs text-[#FAF7F2]/80 block">Confirmed Web (2,400) + Recurring (3,400)</span>
          </div>

          <div className="bg-[#0F2E23] text-white p-6 rounded-xl space-y-2">
            <span className="text-xs text-[#FAF7F2]/70 uppercase tracking-wider">Tomorrow's Procurement Gap</span>
            <p className="text-3xl font-extrabold text-amber-400">3,400 Birds</p>
            <span className="text-xs text-[#FAF7F2]/80 block">Wholesale Mandi Procurement Requirement</span>
          </div>

          <div className="bg-[#0F2E23] text-white p-6 rounded-xl space-y-2">
            <span className="text-xs text-[#FAF7F2]/70 uppercase tracking-wider">7-Day Avg Gross Contribution</span>
            <p className="text-3xl font-extrabold text-emerald-400">₹ 21.40 / KG</p>
            <span className="text-xs text-[#FAF7F2]/80 block">Average Margin Across Accounts</span>
          </div>
        </div>

        <div className="flex gap-4">
          <Link
            href="/admin/email-templates"
            className="bg-[#0F2E23] text-white font-bold text-xs px-6 py-3 rounded-xl shadow"
          >
            View System Email Templates Preview
          </Link>
        </div>
      </div>
    </div>
  );
}
