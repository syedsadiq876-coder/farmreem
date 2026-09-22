import Link from "next/link";
import { Users, Calendar, CheckCircle2, Truck, ArrowRight } from "lucide-react";

export const metadata = {
  title: "Bulk Poultry Supply for Caterers & Institutions | FarmReem",
  description: "FarmReem provides bulk live broiler supply for caterers and institutional kitchens: volume planning, event requirements, recurring supply, and account pricing.",
  alternates: {
    canonical: "https://www.farmreem.com/solutions/caterers-institutions",
  },
  openGraph: {
    title: "Bulk Poultry Supply for Caterers & Institutions | FarmReem",
    description: "Bulk live broiler supply for caterers and institutional kitchens: volume planning, event requirements, and recurring supply.",
    url: "https://www.farmreem.com/solutions/caterers-institutions",
  },
};

export default function CaterersInstitutionsPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": "Bulk Poultry Supply for Caterers & Institutions",
    "provider": {
      "@type": "Organization",
      "name": "FarmReem",
      "url": "https://www.farmreem.com"
    },
    "areaServed": "Dehradun, Uttarakhand, India",
    "description": "Bulk live broiler supply, volume event planning, and recurring delivery for banquet caterers and institutional dining facilities."
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
            Institutional & Large Volume Sourcing
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-[#0F2E23] tracking-tight">
            Bulk Poultry Supply for Caterers & Institutions
          </h1>
          <p className="text-base sm:text-lg text-[#4F5E57] leading-relaxed">
            Banquet caterers, institutional kitchens, and large dining operations require volume planning, event-specific supply capability, and predictable route logistics.
          </p>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-8 rounded-2xl border border-[#E8E1D3] space-y-4 shadow-sm">
            <div className="w-12 h-12 rounded-xl bg-[#FAF7F2] border border-[#E8E1D3] flex items-center justify-center text-[#0F2E23]">
              <Users className="w-6 h-6 text-[#C59B27]" />
            </div>
            <h2 className="text-xl font-bold text-[#0F2E23]">Volume & Event Planning</h2>
            <p className="text-sm text-[#4F5E57] leading-relaxed">
              Plan bird-count requirements for weddings, conventions, and institutional menus backed by our regional sourcing network.
            </p>
          </div>

          <div className="bg-white p-8 rounded-2xl border border-[#E8E1D3] space-y-4 shadow-sm">
            <div className="w-12 h-12 rounded-xl bg-[#FAF7F2] border border-[#E8E1D3] flex items-center justify-center text-[#0F2E23]">
              <Calendar className="w-6 h-6 text-[#C59B27]" />
            </div>
            <h2 className="text-xl font-bold text-[#0F2E23]">Recurring Supply Schedules</h2>
            <p className="text-sm text-[#4F5E57] leading-relaxed">
              Establish standing weekly supply schedules for regular dining operations, with advance notice modifications for special events.
            </p>
          </div>

          <div className="bg-white p-8 rounded-2xl border border-[#E8E1D3] space-y-4 shadow-sm">
            <div className="w-12 h-12 rounded-xl bg-[#FAF7F2] border border-[#E8E1D3] flex items-center justify-center text-[#0F2E23]">
              <Truck className="w-6 h-6 text-[#C59B27]" />
            </div>
            <h2 className="text-xl font-bold text-[#0F2E23]">Delivery Planning</h2>
            <p className="text-sm text-[#4F5E57] leading-relaxed">
              Coordinated morning route transport directly to central kitchens, commissary locations, or designated event receiving points.
            </p>
          </div>
        </div>

        {/* Sourcing Capabilities */}
        <div className="bg-white rounded-3xl border border-[#E8E1D3] p-8 lg:p-12 space-y-8 shadow-sm">
          <div className="space-y-2">
            <span className="text-xs font-extrabold uppercase tracking-wider text-[#C59B27]">
              Commercial Capability
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0F2E23]">Bulk Sourcing & Operational Support</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
            {[
              "Volume planning tailored to event guest counts or daily institution meals",
              "Preferred bird weight specifications (1.8–2.0 kg and 2.0–2.4 kg heavy spec)",
              "Scheduled morning delivery to central commissaries or venue docks",
              "Clear weighment documentation and delivery records",
              "Single point of contact for account supply coordination",
              "Commercial account pricing agreed per B2B contract",
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-[#C59B27] flex-shrink-0 mt-0.5" />
                <span className="text-[#0F2E23] font-medium">{item}</span>
              </div>
            ))}
          </div>

          <div className="pt-6 border-t border-[#E8E1D3] flex items-center justify-between flex-wrap gap-4">
            <div>
              <h3 className="font-extrabold text-base text-[#0F2E23]">Planning event or institutional supply?</h3>
              <p className="text-xs text-[#4F5E57]">Contact FarmReem in Dehradun to discuss your volume requirements.</p>
            </div>
            <Link
              href="/request-pricing"
              className="bg-[#0F2E23] hover:bg-[#184636] text-white font-extrabold text-sm px-7 py-3.5 rounded-xl transition-all shadow flex items-center gap-2 group"
            >
              Request B2B Pricing
              <ArrowRight className="w-4 h-4 text-[#C59B27] group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
