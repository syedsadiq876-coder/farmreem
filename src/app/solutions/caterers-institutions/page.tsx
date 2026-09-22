import Link from "next/link";
import { Users, Calendar, CheckCircle2, Truck } from "lucide-react";

export const metadata = {
  title: "Bulk Poultry Sourcing for Caterers & Institutions | FarmReem",
  description: "High-volume live broiler batch capacity, event supply fulfillment, and institutional commercial terms for caterers and dining operators.",
};

export default function CaterersInstitutionsPage() {
  return (
    <div className="bg-[#FAF7F2] py-12 lg:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Hero */}
        <div className="max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0F2E23]/10 text-[#0F2E23] text-xs font-bold uppercase tracking-wider">
            Institutional & Large Volume Sourcing
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-[#0F2E23] tracking-tight">
            High-Volume Poultry Sourcing for Caterers & Institutions
          </h1>
          <p className="text-base text-[#4F5E57] leading-relaxed">
            Banquet caterers, corporate dining operators, and institutional kitchens require batch volume capacity, bird-count ordering, and scheduled dispatches.
          </p>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-8 rounded-2xl border border-[#E8E1D3] space-y-4 shadow-sm">
            <div className="w-12 h-12 rounded-xl bg-[#FAF7F2] border border-[#E8E1D3] flex items-center justify-center text-[#0F2E23]">
              <Users className="w-6 h-6 text-[#C59B27]" />
            </div>
            <h3 className="text-xl font-bold text-[#0F2E23]">Bulk Event Sourcing</h3>
            <p className="text-sm text-[#4F5E57] leading-relaxed">
              Fulfill large bird-count requirements for weddings, conventions, and banquet events allocated across our multi-tier sourcing network.
            </p>
          </div>

          <div className="bg-white p-8 rounded-2xl border border-[#E8E1D3] space-y-4 shadow-sm">
            <div className="w-12 h-12 rounded-xl bg-[#FAF7F2] border border-[#E8E1D3] flex items-center justify-center text-[#0F2E23]">
              <Calendar className="w-6 h-6 text-[#C59B27]" />
            </div>
            <h3 className="text-xl font-bold text-[#0F2E23]">Recurring Supply Schedules</h3>
            <p className="text-sm text-[#4F5E57] leading-relaxed">
              Configure standing daily or weekly bird allocation schedules for approved accounts with flexible modification options.
            </p>
          </div>

          <div className="bg-white p-8 rounded-2xl border border-[#E8E1D3] space-y-4 shadow-sm">
            <div className="w-12 h-12 rounded-xl bg-[#FAF7F2] border border-[#E8E1D3] flex items-center justify-center text-[#0F2E23]">
              <Truck className="w-6 h-6 text-[#C59B27]" />
            </div>
            <h3 className="text-xl font-bold text-[#0F2E23]">Route-Planned Delivery</h3>
            <p className="text-sm text-[#4F5E57] leading-relaxed">
              Scheduled transport dispatches coordinated directly to central commissaries or designated delivery points.
            </p>
          </div>
        </div>

        {/* Contract Offerings */}
        <div className="bg-white rounded-2xl border border-[#E8E1D3] p-8 lg:p-12 space-y-8">
          <h2 className="text-2xl font-bold text-[#0F2E23]">Institutional Sourcing Options</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
            {[
              "Agreed contract rate periods based on volume commitments",
              "Multi-location delivery dispatch to multiple kitchen nodes",
              "Sourcing support for large event and banquet volume surges",
              "Procurement lot traceability from supplier to weighment slip",
              "Custom weight range sorting subject to availability",
              "Commercial terms agreed per account for verified B2B buyers",
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-[#C59B27] flex-shrink-0 mt-0.5" />
                <span className="text-[#0F2E23] font-medium">{item}</span>
              </div>
            ))}
          </div>

          <div className="pt-4 border-t border-[#E8E1D3] flex items-center justify-between flex-wrap gap-4">
            <p className="text-xs text-[#4F5E57]">Planning high-volume catering or institutional supply?</p>
            <Link
              href="/request-pricing"
              className="bg-[#C59B27] hover:bg-[#b0881f] text-[#0F2E23] font-bold text-sm px-6 py-3 rounded-xl transition-all shadow"
            >
              Request Institutional Pricing
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
