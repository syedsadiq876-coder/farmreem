import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";

export const metadata = {
  title: "Poultry Sourcing & Supply Network | FarmReem",
  description: "Learn how FarmReem combines wholesale sourcing, partner farm networks, and developing owned production to provide reliable B2B poultry supply.",
  alternates: {
    canonical: "https://www.farmreem.com/supply-network",
  },
  openGraph: {
    title: "Poultry Sourcing & Supply Network | FarmReem",
    description: "Learn how FarmReem combines wholesale sourcing, partner farm networks, and developing owned production to supply commercial kitchens.",
    url: "https://www.farmreem.com/supply-network",
  },
};

export default function SupplyNetworkPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": "Poultry Sourcing & Supply Network",
    "provider": {
      "@type": "Organization",
      "name": "FarmReem",
      "url": "https://www.farmreem.com"
    },
    "description": "Multi-tier poultry supply network combining wholesale sourcing, partner farm relationships, and owned production development."
  };

  return (
    <div className="bg-[#FAF7F2] py-12 lg:py-20 text-[#111A17]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Header */}
        <div className="max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0F2E23]/10 text-[#0F2E23] text-xs font-bold uppercase tracking-wider">
            Multi-Tier Supply Sourcing
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-[#0F2E23] tracking-tight">
            FarmReem Supply Network & Sourcing Model
          </h1>
          <p className="text-base sm:text-lg text-[#4F5E57] leading-relaxed">
            Relying solely on single-source suppliers creates vulnerability during market surges. FarmReem operates a multi-tier sourcing model designed to support dependable B2B kitchen supply.
          </p>
        </div>

        {/* 3 Pillars Breakdown */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Pillar 1 — DEVELOPING */}
          <div className="bg-white p-8 rounded-2xl border border-[#E8E1D3] space-y-4 shadow-sm flex flex-col justify-between">
            <div className="space-y-4">
              <div className="inline-block px-3 py-1 rounded bg-[#C59B27]/10 text-[#C59B27] font-extrabold text-xs uppercase tracking-wider">
                DEVELOPING · IN FUTURE PLAN
              </div>
              <h2 className="text-2xl font-bold text-[#0F2E23]">Building FarmReem Farms</h2>
              <p className="text-sm text-[#4F5E57] leading-relaxed">
                FarmReem is developing owned poultry-production capacity to complement external sourcing and establish internal quality benchmarks.
              </p>
            </div>
            <div className="pt-4 border-t border-[#E8E1D3]">
              <span className="text-xs font-semibold text-[#4F5E57] block mb-2">Status: Under Active Site Development</span>
              <Link
                href="/building-farmreem-farms"
                className="text-xs font-extrabold text-[#0F2E23] hover:text-[#C59B27] flex items-center gap-1"
              >
                Read Farm Roadmap <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Pillar 2 — DEVELOPING / PARTNER RELATIONSHIPS */}
          <div className="bg-white p-8 rounded-2xl border border-[#E8E1D3] space-y-4 shadow-sm flex flex-col justify-between">
            <div className="space-y-4">
              <div className="inline-block px-3 py-1 rounded bg-emerald-100 text-emerald-800 font-extrabold text-xs uppercase tracking-wider">
                DEVELOPING · SUPPLY PARTNERS
              </div>
              <h2 className="text-2xl font-bold text-[#0F2E23]">Partner Farm Network</h2>
              <p className="text-sm text-[#4F5E57] leading-relaxed">
                FarmReem is developing relationships with regional poultry farms based on supply capability, bird condition, and operational requirements.
              </p>
            </div>
            <div className="pt-4 border-t border-[#E8E1D3]">
              <span className="text-xs font-semibold text-[#4F5E57] block mb-2">Status: Selected Supply Partners</span>
              <Link
                href="/become-partner"
                className="text-xs font-extrabold text-[#0F2E23] hover:text-[#C59B27] flex items-center gap-1"
              >
                Apply as Supply Partner <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Pillar 3 — CURRENT ACTIVE */}
          <div className="bg-white p-8 rounded-2xl border border-[#E8E1D3] space-y-4 shadow-sm flex flex-col justify-between">
            <div className="space-y-4">
              <div className="inline-block px-3 py-1 rounded bg-slate-100 text-slate-700 font-extrabold text-xs uppercase tracking-wider">
                CURRENT · ACTIVE SOURCING
              </div>
              <h2 className="text-2xl font-bold text-[#0F2E23]">Wholesale Sourcing</h2>
              <p className="text-sm text-[#4F5E57] leading-relaxed">
                Available supplier networks and wholesale procurement providing immediate volume fulfillment for daily commercial requirements.
              </p>
            </div>
            <div className="pt-4 border-t border-[#E8E1D3]">
              <span className="text-xs font-semibold text-[#4F5E57] block mb-2">Status: Active Wholesale Sourcing</span>
              <span className="text-xs text-[#4F5E57]">Managed via Daily Procurement Desk</span>
            </div>
          </div>
        </div>

        {/* Network Diagram */}
        <div className="bg-[#0F2E23] text-white rounded-3xl p-8 lg:p-12 space-y-8 shadow-xl">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              Supply Flow Architecture
            </h2>
            <p className="text-sm text-[#FAF7F2]/80">
              Building FarmReem Farms + Partner Farm Network + Wholesale Sourcing &rarr; FarmReem &rarr; Professional Kitchens
            </p>
          </div>

          <div className="bg-[#0A2118] p-6 sm:p-8 rounded-2xl border border-[#184636] grid grid-cols-1 sm:grid-cols-3 gap-4 text-center text-xs">
            <div className="bg-[#0F2E23] p-4 rounded-xl border border-[#25634e]">
              <span className="text-[10px] text-[#C59B27] font-bold block uppercase">Developing</span>
              <span className="font-extrabold text-sm text-white block mt-1">FarmReem Farms</span>
              <span className="text-[11px] text-[#FAF7F2]/70 block mt-1">Owned Production Capacity</span>
            </div>
            <div className="bg-[#0F2E23] p-4 rounded-xl border border-[#25634e]">
              <span className="text-[10px] text-emerald-400 font-bold block uppercase">Developing</span>
              <span className="font-extrabold text-sm text-white block mt-1">Partner Network</span>
              <span className="text-[11px] text-[#FAF7F2]/70 block mt-1">Selected Regional Farms</span>
            </div>
            <div className="bg-[#0F2E23] p-4 rounded-xl border border-[#25634e]">
              <span className="text-[10px] text-slate-300 font-bold block uppercase">Current</span>
              <span className="font-extrabold text-sm text-white block mt-1">Wholesale Sourcing</span>
              <span className="text-[11px] text-[#FAF7F2]/70 block mt-1">Active Sourcing Channels</span>
            </div>
          </div>

          <div className="pt-4 border-t border-[#184636] flex flex-col sm:flex-row items-center justify-between gap-4">
            <span className="text-xs text-[#FAF7F2]/80 font-semibold">
              Based in Dehradun, Uttarakhand · Serving Commercial Accounts
            </span>
            <Link
              href="/request-pricing"
              className="bg-[#C59B27] hover:bg-[#b0881f] text-[#0F2E23] font-extrabold text-xs px-7 py-3 rounded-xl transition-all shadow"
            >
              Request B2B Pricing &rarr;
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
