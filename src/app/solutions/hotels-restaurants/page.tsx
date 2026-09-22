import Link from "next/link";
import { Scale, Clock, ShieldCheck, CheckCircle2, ArrowRight, RotateCcw, FileText } from "lucide-react";

export const metadata = {
  title: "Poultry Supply for Hotels & Restaurants | FarmReem",
  description: "FarmReem provides live broiler supply built around hotel and restaurant kitchen requirements: preferred weight specs, planned quantities, scheduled morning delivery, and repeat supply.",
  alternates: {
    canonical: "https://www.farmreem.com/solutions/hotels-restaurants",
  },
  openGraph: {
    title: "Poultry Supply for Hotels & Restaurants | FarmReem",
    description: "Live broiler sourcing built around hotel and restaurant kitchen requirements with preferred weights and scheduled delivery.",
    url: "https://www.farmreem.com/solutions/hotels-restaurants",
  },
};

export default function HotelsRestaurantsPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": "Poultry Supply for Hotels & Restaurants",
    "provider": {
      "@type": "Organization",
      "name": "FarmReem",
      "url": "https://www.farmreem.com"
    },
    "areaServed": "Dehradun, Uttarakhand, India",
    "description": "Live broiler supply, preferred weight selection, and scheduled delivery for hotel and restaurant kitchens."
  };

  return (
    <div className="bg-[#FAF7F2] py-12 lg:py-20 text-[#111A17]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Hero */}
        <div className="max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0F2E23]/10 text-[#0F2E23] text-xs font-bold uppercase tracking-wider">
            Hospitality Foodservice Sourcing
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-[#0F2E23] tracking-tight">
            Poultry supply built around your kitchen.
          </h1>
          <p className="text-base sm:text-lg text-[#4F5E57] leading-relaxed">
            Executive chefs and hotel procurement teams need dependable live broiler sourcing, preferred weight selection, and scheduled morning delivery. FarmReem provides reliable B2B supply tailored to your daily prep timelines.
          </p>
        </div>

        {/* Core Buyer Outcomes */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-8 rounded-2xl border border-[#E8E1D3] space-y-4 shadow-sm">
            <div className="w-12 h-12 rounded-xl bg-[#FAF7F2] border border-[#E8E1D3] flex items-center justify-center text-[#0F2E23]">
              <Scale className="w-6 h-6 text-[#C59B27]" />
            </div>
            <h2 className="text-xl font-bold text-[#0F2E23]">Preferred Weight Requirements</h2>
            <p className="text-sm text-[#4F5E57] leading-relaxed">
              Select target bird weight ranges (e.g. 1.8–2.0 kg or 2.0–2.4 kg) based on requirement and availability to maintain portion yield across your menu items.
            </p>
          </div>

          <div className="bg-white p-8 rounded-2xl border border-[#E8E1D3] space-y-4 shadow-sm">
            <div className="w-12 h-12 rounded-xl bg-[#FAF7F2] border border-[#E8E1D3] flex items-center justify-center text-[#0F2E23]">
              <Clock className="w-6 h-6 text-[#C59B27]" />
            </div>
            <h2 className="text-xl font-bold text-[#0F2E23]">Scheduled Delivery</h2>
            <p className="text-sm text-[#4F5E57] leading-relaxed">
              Planned morning route delivery aligned with receiving dock hours so kitchen staff can inspect bird count and weight records before prep starts.
            </p>
          </div>

          <div className="bg-white p-8 rounded-2xl border border-[#E8E1D3] space-y-4 shadow-sm">
            <div className="w-12 h-12 rounded-xl bg-[#FAF7F2] border border-[#E8E1D3] flex items-center justify-center text-[#0F2E23]">
              <ShieldCheck className="w-6 h-6 text-[#C59B27]" />
            </div>
            <h2 className="text-xl font-bold text-[#0F2E23]">Account Commercial Terms</h2>
            <p className="text-sm text-[#4F5E57] leading-relaxed">
              Structured B2B pricing and commercial credit terms agreed per account following qualification and business setup.
            </p>
          </div>
        </div>

        {/* Key Features Grid */}
        <div className="bg-white rounded-3xl border border-[#E8E1D3] p-8 lg:p-12 space-y-8 shadow-sm">
          <div className="space-y-2">
            <span className="text-xs font-extrabold uppercase tracking-wider text-[#C59B27]">
              Kitchen Outcomes
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0F2E23]">Designed for Hotel & Restaurant Buyers</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
            {[
              "Preferred bird weight specifications to protect portion yield",
              "Planned quantities tailored to daily restaurant seating and room occupancy",
              "Scheduled morning receiving dock delivery windows",
              "Standing repeat supply schedules with flex option for volume spikes",
              "Clear weighment records and dispatch documentation",
              "Account-specific commercial pricing terms",
            ].map((adv, i) => (
              <div key={i} className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-[#C59B27] flex-shrink-0 mt-0.5" />
                <span className="text-[#0F2E23] font-medium">{adv}</span>
              </div>
            ))}
          </div>

          <div className="pt-6 border-t border-[#E8E1D3] flex items-center justify-between flex-wrap gap-4">
            <div>
              <h3 className="font-extrabold text-base text-[#0F2E23]">Ready to set up your kitchen supply?</h3>
              <p className="text-xs text-[#4F5E57]">Our team is based in Dehradun and serves hospitality partners across the region.</p>
            </div>
            <Link
              href="/request-pricing"
              className="bg-[#0F2E23] hover:bg-[#184636] text-white font-extrabold text-sm px-7 py-3.5 rounded-xl transition-all shadow flex items-center gap-2 group"
            >
              Discuss Your Requirement
              <ArrowRight className="w-4 h-4 text-[#C59B27] group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
