import Link from "next/link";
import Image from "next/image";
import { Network, Building, ShieldCheck, ArrowRight } from "lucide-react";

export const metadata = {
  title: "Supply Network & Sourcing Model | FarmReem B2B Poultry",
  description: "Learn how FarmReem combines developing owned farms, audited partner poultry farms, and wholesale market sourcing to guarantee B2B kitchen supply.",
};

export default function SupplyNetworkPage() {
  return (
    <div className="bg-[#FAF7F2] py-12 lg:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Header */}
        <div className="max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0F2E23]/10 text-[#0F2E23] text-xs font-bold uppercase tracking-wider">
            Multi-Tier Supply Infrastructure
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-[#0F2E23] tracking-tight">
            FarmReem Supply Network & Sourcing Model
          </h1>
          <p className="text-base text-[#4F5E57] leading-relaxed">
            Relying solely on single-source farms creates supply vulnerability when disease or flock cycles occur. FarmReem operates a multi-tier sourcing architecture engineered for 100% kitchen delivery reliability.
          </p>
        </div>

        {/* 3 Pillars Breakdown */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Pillar 1 */}
          <div className="bg-white p-8 rounded-2xl border border-[#E8E1D3] space-y-4 shadow-sm flex flex-col justify-between">
            <div className="space-y-4">
              <div className="inline-block px-3 py-1 rounded bg-[#C59B27]/10 text-[#C59B27] font-bold text-xs">
                Future Owned Production
              </div>
              <h3 className="text-2xl font-bold text-[#0F2E23]">Building FarmReem Farms</h3>
              <p className="text-sm text-[#4F5E57] leading-relaxed">
                FarmReem is developing owned biosecure poultry farming facilities. This future infrastructure will provide baseline production and set technical standards across our partner network.
              </p>
            </div>
            <div className="pt-4 border-t border-[#E8E1D3]">
              <span className="text-xs font-semibold text-[#0F2E23] block mb-2">Status: Under Active Development</span>
              <Link
                href="/building-farmreem-farms"
                className="text-xs font-bold text-[#0F2E23] hover:text-[#C59B27] flex items-center gap-1"
              >
                Read Farm Roadmap <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Pillar 2 */}
          <div className="bg-white p-8 rounded-2xl border border-[#E8E1D3] space-y-4 shadow-sm flex flex-col justify-between">
            <div className="space-y-4">
              <div className="inline-block px-3 py-1 rounded bg-[#0F2E23]/10 text-[#0F2E23] font-bold text-xs">
                Active Partner Network
              </div>
              <h3 className="text-2xl font-bold text-[#0F2E23]">Partner Poultry Farms</h3>
              <p className="text-sm text-[#4F5E57] leading-relaxed">
                Contracted commercial poultry farms audited for flock health, vaccination compliance, bio-security measures, and target weight sorting capability.
              </p>
            </div>
            <div className="pt-4 border-t border-[#E8E1D3]">
              <span className="text-xs font-semibold text-[#0F2E23] block mb-2">Status: Active Sourcing Core</span>
              <Link
                href="/become-partner"
                className="text-xs font-bold text-[#0F2E23] hover:text-[#C59B27] flex items-center gap-1"
              >
                Apply as Farm Partner <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Pillar 3 */}
          <div className="bg-white p-8 rounded-2xl border border-[#E8E1D3] space-y-4 shadow-sm flex flex-col justify-between">
            <div className="space-y-4">
              <div className="inline-block px-3 py-1 rounded bg-slate-100 text-slate-700 font-bold text-xs">
                Active Wholesale Procurement
              </div>
              <h3 className="text-2xl font-bold text-[#0F2E23]">Wholesale Procurement</h3>
              <p className="text-sm text-[#4F5E57] leading-relaxed">
                Direct wholesale mandi procurement providing immediate volume buffering during unexpected demand surges, wedding seasons, and major catering events.
              </p>
            </div>
            <div className="pt-4 border-t border-[#E8E1D3]">
              <span className="text-xs font-semibold text-[#0F2E23] block mb-2">Status: Active Volume Buffer</span>
              <span className="text-xs text-[#4F5E57]">Managed via Daily Procurement Engine</span>
            </div>
          </div>
        </div>

        {/* Traceability Guarantee Banner */}
        <div className="bg-[#0F2E23] text-white rounded-2xl p-8 lg:p-12 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center shadow-xl">
          <div className="lg:col-span-8 space-y-4">
            <h2 className="text-2xl sm:text-3xl font-bold text-white">
              Complete Procurement Lot Traceability
            </h2>
            <p className="text-sm text-[#FAF7F2]/80 leading-relaxed">
              Every customer order is allocated against verified procurement lots (Source &rarr; Procurement Lot &rarr; Delivery Vehicle &rarr; Customer). You receive complete transparency regarding the origin and weighment slip of every batch.
            </p>
          </div>
          <div className="lg:col-span-4 text-left lg:text-right">
            <Link
              href="/request-pricing"
              className="bg-[#C59B27] hover:bg-[#b0881f] text-[#0F2E23] font-bold text-sm px-8 py-3.5 rounded-xl transition-all shadow inline-block"
            >
              Open B2B Supply Account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
