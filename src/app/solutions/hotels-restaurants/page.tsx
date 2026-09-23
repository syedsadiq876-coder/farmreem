import Link from "next/link";
import { Scale, Clock, ShieldCheck, CheckCircle2, ArrowRight } from "lucide-react";

export const metadata = {
  title: "Poultry Supply for Hotels & Restaurants | FarmReem",
  description:
    "Poultry supply built around your kitchen. Tell us quantity, preferred bird size, product specification, and delivery requirement. FarmReem coordinates supply around what works for your kitchen.",
  alternates: {
    canonical: "https://www.farmreem.com/solutions/hotels-restaurants",
  },
  openGraph: {
    title: "Poultry Supply for Hotels & Restaurants | FarmReem",
    description:
      "Poultry supply built around your kitchen. Tell us quantity, preferred bird size, product specification, and delivery requirement.",
    url: "https://www.farmreem.com/solutions/hotels-restaurants",
  },
};

export default function HotelsRestaurantsPage() {
  const capabilityPoints = [
    {
      title: "Preferred Size & Product Requirements",
      desc: "Specify bird weight ranges (Small, Medium, Large) or product requirements to maintain portion yield.",
    },
    {
      title: "Planned Quantities",
      desc: "Order quantities tailored to daily restaurant seating and room occupancy.",
    },
    {
      title: "Scheduled Delivery",
      desc: "Delivery aligned with receiving hours so kitchen staff can inspect bird count and weight records.",
    },
    {
      title: "Weight Documentation",
      desc: "Clear weighment documentation and dispatch records with every order.",
    },
    {
      title: "Repeat Supply Planning",
      desc: "Standing order schedules with flex options for weekend volume spikes.",
    },
    {
      title: "Account-Specific Commercial Terms",
      desc: "Structured B2B pricing and commercial terms agreed per account.",
    },
    {
      title: "Dedicated B2B Support",
      desc: "Direct contact with our Dehradun sales desk for quick requirement adjustments.",
    },
  ];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Poultry Supply for Hotels & Restaurants",
    provider: {
      "@type": "Organization",
      name: "FarmReem",
      url: "https://www.farmreem.com",
    },
    areaServed: "Dehradun, Uttarakhand, India",
    description:
      "Poultry supply built around your kitchen. Tell us quantity, preferred bird size, product specification, and delivery requirement.",
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
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#0F2E23]/10 text-[#0F2E23] text-xs font-bold uppercase tracking-wider">
            Hospitality Foodservice Supply
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-[#0F2E23] tracking-tight">
            Poultry supply built around your kitchen.
          </h1>
          <p className="text-base sm:text-lg text-[#4F5E57] leading-relaxed">
            Tell us the quantity, preferred bird size or product specification and delivery requirement. FarmReem coordinates supply around what works for your kitchen.
          </p>
        </div>

        {/* Capability Grid */}
        <div className="bg-white rounded-3xl border border-[#E8E1D3] p-8 lg:p-12 space-y-8 shadow-sm">
          <div className="space-y-2">
            <span className="text-xs font-extrabold uppercase tracking-wider text-[#C59B27]">
              SUPPLY CAPABILITIES
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0F2E23]">
              Designed for Hotel & Restaurant Buyers
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
            {capabilityPoints.map((pt, i) => (
              <div key={i} className="flex items-start gap-3 p-4 rounded-xl bg-[#FAF7F2] border border-[#E8E1D3]">
                <CheckCircle2 className="w-5 h-5 text-[#C59B27] flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-[#0F2E23] font-bold text-sm">{pt.title}</h3>
                  <p className="text-xs text-[#4F5E57] mt-0.5">{pt.desc}</p>
                </div>
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
              className="bg-[#0F2E23] hover:bg-[#184636] text-white font-extrabold text-sm px-7 py-3.5 rounded-xl transition-all shadow flex items-center gap-2 group cursor-pointer"
            >
              Tell Us Your Requirement
              <ArrowRight className="w-4 h-4 text-[#C59B27] group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
