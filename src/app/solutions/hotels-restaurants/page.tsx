import Link from "next/link";
import { Scale, Clock, ShieldCheck, CheckCircle2, ArrowRight } from "lucide-react";

export const metadata = {
  title: "Poultry Sourcing for Hotels & Restaurants | FarmReem",
  description: "Live broiler supply built around your kitchen requirement: requested bird count, preferred weight specs, scheduled delivery, and account-specific commercial terms.",
};

export default function HotelsRestaurantsPage() {
  return (
    <div className="bg-[#FAF7F2] py-12 lg:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Hero */}
        <div className="max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0F2E23]/10 text-[#0F2E23] text-xs font-bold uppercase tracking-wider">
            Hospitality Foodservice Sourcing
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-[#0F2E23] tracking-tight">
            Supply Built Around Your Kitchen Requirement
          </h1>
          <p className="text-base text-[#4F5E57] leading-relaxed">
            Executive chefs and hotel procurement directors need dependable live broiler sourcing, requested weight specifications, and transparent weighment. FarmReem builds custom commercial supply protocols for each account.
          </p>
        </div>

        {/* Core Value Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-8 rounded-2xl border border-[#E8E1D3] space-y-4 shadow-sm">
            <div className="w-12 h-12 rounded-xl bg-[#FAF7F2] border border-[#E8E1D3] flex items-center justify-center text-[#0F2E23]">
              <Scale className="w-6 h-6 text-[#C59B27]" />
            </div>
            <h3 className="text-xl font-bold text-[#0F2E23]">Preferred Weight Specifications</h3>
            <p className="text-sm text-[#4F5E57] leading-relaxed">
              Select requested bird weight bands (e.g. 1.8–2.0 kg) based on requirement and availability to maintain recipe portion control and yield predictability.
            </p>
          </div>

          <div className="bg-white p-8 rounded-2xl border border-[#E8E1D3] space-y-4 shadow-sm">
            <div className="w-12 h-12 rounded-xl bg-[#FAF7F2] border border-[#E8E1D3] flex items-center justify-center text-[#0F2E23]">
              <Clock className="w-6 h-6 text-[#C59B27]" />
            </div>
            <h3 className="text-xl font-bold text-[#0F2E23]">Scheduled Commercial Delivery</h3>
            <p className="text-sm text-[#4F5E57] leading-relaxed">
              Planned morning delivery windows aligned with your kitchen receiving dock schedule, allowing kitchen staff to verify bird count and weighment.
            </p>
          </div>

          <div className="bg-white p-8 rounded-2xl border border-[#E8E1D3] space-y-4 shadow-sm">
            <div className="w-12 h-12 rounded-xl bg-[#FAF7F2] border border-[#E8E1D3] flex items-center justify-center text-[#0F2E23]">
              <ShieldCheck className="w-6 h-6 text-[#C59B27]" />
            </div>
            <h3 className="text-xl font-bold text-[#0F2E23]">Account Commercial Terms</h3>
            <p className="text-sm text-[#4F5E57] leading-relaxed">
              Commercial terms, payment cycles, and billing arrangements agreed per account for approved B2B customers following verification.
            </p>
          </div>
        </div>

        {/* Benefits Checklist */}
        <div className="bg-white rounded-2xl border border-[#E8E1D3] p-8 lg:p-12 space-y-8">
          <h2 className="text-2xl font-bold text-[#0F2E23]">Operational Capabilities for Hotel & Restaurant Accounts</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
            {[
              "Dual weighment ticket tracking (dispatch weight and receiving weight verification)",
              "Bird-count based order placement with reconciled final live weight invoicing",
              "Recurring daily or weekly supply schedule capability",
              "Customer-specific B2B rate contracts based on volume commitment",
              "Traceability from procurement lot source to delivery slip",
              "Dedicated account desk support for volume adjustments",
            ].map((adv, i) => (
              <div key={i} className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-[#C59B27] flex-shrink-0 mt-0.5" />
                <span className="text-[#0F2E23] font-medium">{adv}</span>
              </div>
            ))}
          </div>

          <div className="pt-4 border-t border-[#E8E1D3] flex items-center justify-between flex-wrap gap-4">
            <p className="text-xs text-[#4F5E57]">Ready to discuss kitchen supply specifications?</p>
            <Link
              href="/request-pricing"
              className="bg-[#C59B27] hover:bg-[#b0881f] text-[#0F2E23] font-bold text-sm px-6 py-3 rounded-xl transition-all shadow"
            >
              Request Account Pricing
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
