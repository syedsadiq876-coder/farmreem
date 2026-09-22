import Link from "next/link";
import Logo from "@/components/layout/Logo";
import { Scale, Truck, Calendar, ShoppingBag, Clock, FileText, User } from "lucide-react";

export const metadata = {
  title: "Customer Portal Dashboard | FarmReem B2B Sourcing",
};

export default function CustomerPortalDashboardPage() {
  return (
    <div className="bg-[#FAF7F2] min-h-screen">
      {/* Portal Top Bar */}
      <div className="bg-[#0F2E23] text-white border-b border-[#184636] px-4 sm:px-8 py-4 flex items-center justify-between">
        <Logo variant="compact" />
        <div className="flex items-center gap-4 text-xs font-semibold">
          <span className="bg-[#184636] px-3 py-1.5 rounded-lg border border-[#25634e]">
            Account: Grand Heritage Hotel (FR-8842)
          </span>
          <Link href="/login" className="text-[#C59B27] hover:underline">
            Sign Out
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8 space-y-8">
        {/* Welcome Header */}
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-[#E8E1D3] shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-bold text-[#C59B27] uppercase tracking-wider">
              B2B Customer Portal · Dehradun Desk
            </span>
            <h1 className="text-2xl font-extrabold text-[#0F2E23]">Good Morning, Executive Chef</h1>
            <p className="text-xs text-[#4F5E57] mt-1">
              Active Contract Tier: Luxury Hospitality · Assigned Weight Band: 1.8 kg – 2.0 kg
            </p>
          </div>
          <Link
            href="/request-pricing"
            className="bg-[#C59B27] hover:bg-[#b0881f] text-[#0F2E23] font-extrabold text-xs px-5 py-3 rounded-xl transition-all shadow text-center"
          >
            + Place New Live Broiler Order
          </Link>
        </div>

        {/* Dashboard Grid Preview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-xl border border-[#E8E1D3] space-y-2">
            <span className="text-xs text-[#4F5E57]">Outstanding Balance</span>
            <p className="text-2xl font-extrabold text-[#0F2E23]">₹ 42,850</p>
            <span className="text-[11px] text-emerald-700 font-semibold block">Within Credit Limit</span>
          </div>

          <div className="bg-white p-6 rounded-xl border border-[#E8E1D3] space-y-2">
            <span className="text-xs text-[#4F5E57]">Tomorrow's Scheduled Delivery</span>
            <p className="text-2xl font-extrabold text-[#0F2E23]">100 Birds</p>
            <span className="text-[11px] text-[#C59B27] font-semibold block">06:00 – 08:00 AM Slot</span>
          </div>

          <div className="bg-white p-6 rounded-xl border border-[#E8E1D3] space-y-2">
            <span className="text-xs text-[#4F5E57]">Standing Recurring Schedule</span>
            <p className="text-2xl font-extrabold text-[#0F2E23]">Mon – Sat Active</p>
            <span className="text-[11px] text-blue-700 font-semibold block">80 Birds / Day</span>
          </div>

          <div className="bg-white p-6 rounded-xl border border-[#E8E1D3] space-y-2">
            <span className="text-xs text-[#4F5E57]">Assigned Rate (₹/KG)</span>
            <p className="text-2xl font-extrabold text-[#C59B27]">₹ [Account Rate]</p>
            <span className="text-[11px] text-[#4F5E57] block">Weighment Reconciled</span>
          </div>
        </div>
      </div>
    </div>
  );
}
