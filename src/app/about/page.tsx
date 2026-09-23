import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";

export const metadata = {
  title: "About FarmReem | B2B Poultry Sourcing & Foodservice Supply",
  description:
    "FarmReem is a B2B poultry sourcing and foodservice supply business built around the day-to-day needs of professional kitchens in Dehradun, Uttarakhand.",
  alternates: {
    canonical: "https://www.farmreem.com/about",
  },
  openGraph: {
    title: "About FarmReem | B2B Poultry Sourcing & Foodservice Supply",
    description:
      "FarmReem is a B2B poultry sourcing and foodservice supply business built around the day-to-day needs of professional kitchens.",
    url: "https://www.farmreem.com/about",
  },
};

export default function AboutPage() {
  const whoWeServe = [
    "Hotels & Fine Dining",
    "Standalone & Chain Restaurants",
    "Event & Banquet Caterers",
    "Banquets & Wedding Venues",
    "Institutional Kitchens & Messes",
  ];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "FarmReem",
    url: "https://www.farmreem.com",
    logo: "https://www.farmreem.com/images/farmreem-logo.png",
    description:
      "B2B poultry sourcing and foodservice supply business built around the day-to-day needs of professional kitchens.",
    telephone: "+918475863634",
    email: "contact@farmreem.com",
    address: {
      "@type": "PostalAddress",
      streetAddress: "39, Siddharth Vihar, Kandoli, Sahastradhara Road",
      addressLocality: "Dehradun",
      addressRegion: "Uttarakhand",
      postalCode: "248001",
      addressCountry: "IN",
    },
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
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#0F2E23]/10 text-[#0F2E23] text-xs font-bold uppercase tracking-wider">
            FOODSERVICE SUPPLY · INDIA
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-[#0F2E23] tracking-tight">
            About FarmReem
          </h1>
          <p className="text-base sm:text-lg text-[#4F5E57] leading-relaxed font-medium">
            FarmReem is a B2B poultry sourcing and foodservice supply business built around the day-to-day needs of professional kitchens.
          </p>
        </div>

        {/* 2 Core Story Blocks */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* What We Do Today */}
          <div className="bg-white p-8 sm:p-10 rounded-3xl border border-[#E8E1D3] space-y-4 shadow-sm flex flex-col justify-between">
            <div className="space-y-3">
              <span className="text-xs font-extrabold uppercase tracking-wider text-[#C59B27]">
                01 · PRESENT CAPABILITY
              </span>
              <h2 className="text-2xl font-extrabold text-[#0F2E23]">What We Do Today</h2>
              <p className="text-sm text-[#4F5E57] leading-relaxed">
                We work with hotels, restaurants, caterers and institutions to coordinate poultry supply based on quantity, preferred bird size, product requirement and delivery needs.
              </p>
            </div>
          </div>

          {/* What We're Building */}
          <div className="bg-white p-8 sm:p-10 rounded-3xl border border-[#E8E1D3] space-y-4 shadow-sm flex flex-col justify-between">
            <div className="space-y-3">
              <span className="text-xs font-extrabold uppercase tracking-wider text-[#C59B27]">
                02 · FUTURE ROADMAP
              </span>
              <h2 className="text-2xl font-extrabold text-[#0F2E23]">What We're Building</h2>
              <p className="text-sm text-[#4F5E57] leading-relaxed">
                FarmReem is developing a wider partner supply network, its own broiler production capacity and a digital B2B ordering experience to make repeat purchasing simpler over time.
              </p>
            </div>
          </div>
        </div>

        {/* Who We Serve */}
        <div className="bg-white rounded-3xl border border-[#E8E1D3] p-8 lg:p-12 shadow-sm space-y-6">
          <div className="space-y-1">
            <span className="text-xs font-extrabold uppercase tracking-wider text-[#C59B27]">
              OUR CUSTOMER BASE
            </span>
            <h2 className="text-2xl font-extrabold text-[#0F2E23]">Who We Serve</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {whoWeServe.map((item, idx) => (
              <div key={idx} className="flex items-center gap-3 p-4 rounded-xl bg-[#FAF7F2] border border-[#E8E1D3] text-sm font-bold text-[#0F2E23]">
                <CheckCircle2 className="w-5 h-5 text-[#C59B27] flex-shrink-0" />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="bg-[#0F2E23] text-white rounded-3xl p-8 lg:p-14 text-center space-y-4 shadow-xl">
          <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
            Connect with FarmReem
          </h2>
          <p className="text-sm text-[#FAF7F2]/80 max-w-xl mx-auto">
            Tell us about your kitchen's poultry requirements or discuss commercial supply terms with our team in Dehradun.
          </p>
          <div className="pt-3">
            <Link
              href="/request-pricing"
              className="bg-[#C59B27] hover:bg-[#b0881f] text-[#0F2E23] font-extrabold text-sm px-9 py-4 rounded-xl transition-all inline-block shadow-lg cursor-pointer"
            >
              Tell Us Your Requirement
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
