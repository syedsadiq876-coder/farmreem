import Link from "next/link";
import { ArrowRight } from "lucide-react";

export const metadata = {
  title: "About FarmReem | B2B Poultry Sourcing & Foodservice Supply",
  description: "FarmReem is a modern B2B poultry sourcing and foodservice supply company based in Dehradun, Uttarakhand, supplying hotels, restaurants, caterers, and institutions.",
  alternates: {
    canonical: "https://www.farmreem.com/about",
  },
  openGraph: {
    title: "About FarmReem | B2B Poultry Sourcing & Foodservice Supply",
    description: "Learn why FarmReem exists, what we do today, and what we are building for commercial kitchen supply.",
    url: "https://www.farmreem.com/about",
  },
};

export default function AboutPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "FarmReem",
    "url": "https://www.farmreem.com",
    "logo": "https://www.farmreem.com/images/farmreem-logo.png",
    "description": "Modern B2B poultry sourcing and foodservice supply company based in Dehradun, Uttarakhand.",
    "telephone": "+918475863634",
    "email": "contact@farmreem.com",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "39, Siddharth Vihar, Kandoli, Sahastradhara Road",
      "addressLocality": "Dehradun",
      "addressRegion": "Uttarakhand",
      "postalCode": "248001",
      "addressCountry": "IN"
    }
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
            Foodservice Supply · India
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-[#0F2E23] tracking-tight">
            About FarmReem
          </h1>
          <p className="text-base sm:text-lg text-[#4F5E57] leading-relaxed">
            FarmReem is a modern B2B poultry sourcing and foodservice supply company based in Dehradun, Uttarakhand. We build dependable supply solutions around commercial kitchen requirements.
          </p>
        </div>

        {/* 3 Structured Story Sections */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* 1. Why FarmReem Exists */}
          <div className="bg-white p-8 rounded-3xl border border-[#E8E1D3] space-y-4 shadow-sm flex flex-col justify-between">
            <div className="space-y-3">
              <span className="text-xs font-extrabold uppercase tracking-wider text-[#C59B27]">01 · Foundation</span>
              <h2 className="text-2xl font-extrabold text-[#0F2E23]">Why FarmReem Exists</h2>
              <p className="text-sm text-[#4F5E57] leading-relaxed">
                Hospitality and commercial kitchens require reliable poultry supply with predictable weight bands and scheduled delivery windows. Traditional supply channels can be fragmented and unpredictable. FarmReem was created to bring structure, clear weighment records, and dependable B2B service to commercial buyers.
              </p>
            </div>
          </div>

          {/* 2. What We Do Today */}
          <div className="bg-white p-8 rounded-3xl border border-[#E8E1D3] space-y-4 shadow-sm flex flex-col justify-between">
            <div className="space-y-3">
              <span className="text-xs font-extrabold uppercase tracking-wider text-[#0F2E23]">02 · Present Capability</span>
              <h2 className="text-2xl font-extrabold text-[#0F2E23]">What We Do Today</h2>
              <p className="text-sm text-[#4F5E57] leading-relaxed">
                We focus on live commercial broiler sourcing and scheduled B2B supply for hotels, restaurants, caterers, and institutional kitchens. Operating from Dehradun, we provide requested bird weight specifications, scheduled morning deliveries, and clear weighment documentation.
              </p>
            </div>
          </div>

          {/* 3. What We're Building */}
          <div className="bg-white p-8 rounded-3xl border border-[#E8E1D3] space-y-4 shadow-sm flex flex-col justify-between">
            <div className="space-y-3">
              <span className="text-xs font-extrabold uppercase tracking-wider text-[#C59B27]">03 · Future Roadmap</span>
              <h2 className="text-2xl font-extrabold text-[#0F2E23]">What We're Building</h2>
              <p className="text-sm text-[#4F5E57] leading-relaxed">
                We are actively building a dedicated partner supply network, developing owned poultry-production capacity (FarmReem Farms), building digital B2B ordering tools, and establishing a more structured foodservice distribution model across Northern India.
              </p>
            </div>
          </div>

        </div>

        {/* Company Summary Card */}
        <div className="bg-white rounded-3xl border border-[#E8E1D3] p-8 lg:p-12 shadow-sm space-y-6">
          <h2 className="text-2xl font-extrabold text-[#0F2E23]">Our Operational Positioning</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-xs">
            <div className="p-4 rounded-xl bg-[#FAF7F2] border border-[#E8E1D3] space-y-1">
              <span className="font-extrabold text-[#0F2E23] block text-sm">Primary Customers</span>
              <span className="text-[#4F5E57] block">Hotels, Restaurants, Caterers, Banquets, Institutional Kitchens</span>
            </div>
            <div className="p-4 rounded-xl bg-[#FAF7F2] border border-[#E8E1D3] space-y-1">
              <span className="font-extrabold text-[#0F2E23] block text-sm">Current Product</span>
              <span className="text-[#4F5E57] block">Live Commercial Broiler Supply (Standard 1.8–2.0 kg & Heavy 2.0–2.4 kg)</span>
            </div>
            <div className="p-4 rounded-xl bg-[#FAF7F2] border border-[#E8E1D3] space-y-1">
              <span className="font-extrabold text-[#0F2E23] block text-sm">Operating Location</span>
              <span className="text-[#4F5E57] block">Based in Dehradun, Uttarakhand</span>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="bg-[#0F2E23] text-white rounded-3xl p-8 lg:p-14 text-center space-y-4 shadow-xl">
          <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">Connect with FarmReem</h2>
          <p className="text-sm text-[#FAF7F2]/80 max-w-2xl mx-auto">
            Discuss your kitchen's poultry requirements or explore partnership opportunities with our commercial team.
          </p>
          <div className="pt-3 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/request-pricing"
              className="bg-[#C59B27] hover:bg-[#b0881f] text-[#0F2E23] font-extrabold text-sm px-8 py-4 rounded-xl transition-all shadow"
            >
              Request B2B Pricing
            </Link>
            <Link
              href="/contact"
              className="bg-[#184636] hover:bg-[#205945] text-white font-extrabold text-sm px-7 py-4 rounded-xl border border-[#25634e] transition-colors"
            >
              Contact Commercial Desk
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
