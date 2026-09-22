import Link from "next/link";
import { Lock, ArrowRight } from "lucide-react";

export const metadata = {
  title: "Live Broiler Supply & Specifications | FarmReem",
  description: "Live commercial broiler specifications, weight ranges (1.8–2.0 kg & 2.0–2.4 kg), bulk B2B supply, and scheduled delivery for hotel and restaurant accounts.",
  alternates: {
    canonical: "https://www.farmreem.com/products",
  },
  openGraph: {
    title: "Live Broiler Supply & Specifications | FarmReem",
    description: "Live commercial broiler specifications, weight ranges, bulk B2B supply, and scheduled delivery for hotels and restaurants.",
    url: "https://www.farmreem.com/products",
  },
};

export default function ProductsPage() {
  const products = [
    {
      name: "Live Commercial Broiler — Standard Range",
      category: "Live Broiler Supply (Available Today)",
      status: "Available Today",
      statusColor: "bg-emerald-100 text-emerald-800 border-emerald-300",
      weightRange: "1.8 kg – 2.0 kg",
      minOrder: "Bulk B2B Supply",
      deliveryWindow: "Scheduled Morning Supply",
      description: "Healthy live broilers selected for uniform portioning. Preferred by hotels and restaurants requiring predictable kitchen yield and menu standardization.",
      active: true,
    },
    {
      name: "Live Commercial Broiler — Heavy Range",
      category: "Live Broiler Supply (Available Today)",
      status: "Available Today",
      statusColor: "bg-emerald-100 text-emerald-800 border-emerald-300",
      weightRange: "2.0 kg – 2.4 kg",
      minOrder: "Bulk B2B Supply",
      deliveryWindow: "Scheduled Morning Supply",
      description: "Higher weight live broilers preferred by banquet caterers and institutional kitchens requiring higher meat yield per bird.",
      active: true,
    },
    {
      name: "Dressed Whole Chicken (Chilled)",
      category: "Future Category",
      status: "COMING LATER",
      statusColor: "bg-slate-100 text-slate-600 border-slate-300",
      weightRange: "1.2 kg – 1.6 kg",
      minOrder: "Under Development",
      deliveryWindow: "Future Expansion",
      description: "Hygienically processed dressed chicken. Planned for future availability alongside cold-chain distribution.",
      active: false,
    },
    {
      name: "Boneless Portion Cuts",
      category: "Future Category",
      status: "COMING LATER",
      statusColor: "bg-slate-100 text-slate-600 border-slate-300",
      weightRange: "Custom Pack Specs",
      minOrder: "Under Development",
      deliveryWindow: "Future Expansion",
      description: "Portioned boneless cuts for high-volume commercial kitchens. Planned for future offering.",
      active: false,
    },
  ];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": "Live Commercial Broiler",
    "brand": {
      "@type": "Brand",
      "name": "FarmReem"
    },
    "description": "Live commercial broiler supply in Standard (1.8–2.0 kg) and Heavy (2.0–2.4 kg) weight ranges for hotel and restaurant accounts.",
    "category": "Foodservice Poultry Supply"
  };

  return (
    <div className="bg-[#FAF7F2] py-12 lg:py-20 text-[#111A17]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Header */}
        <div className="max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0F2E23]/10 text-[#0F2E23] text-xs font-bold uppercase tracking-wider">
            B2B Product Range · Live Broiler Sourcing
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-[#0F2E23] tracking-tight">
            Live Broiler Specifications & Supply Options
          </h1>
          <p className="text-base text-[#4F5E57] leading-relaxed">
            FarmReem provides bulk live broiler supply tailored to kitchen portioning requirements. Commercial and weighment terms are agreed per B2B account based on requested volume and supply schedules.
          </p>
        </div>

        {/* Pricing Notice */}
        <div className="bg-white border border-[#E8E1D3] rounded-2xl p-5 flex items-start gap-4 shadow-sm text-xs text-[#4F5E57]">
          <Lock className="w-5 h-5 text-[#C59B27] flex-shrink-0 mt-0.5" />
          <div className="space-y-1">
            <span className="font-bold text-[#0F2E23] block text-sm">Account-Specific B2B Pricing</span>
            <p>
              Pricing structure is determined by volume requirements, weight specifications, and delivery schedules. Commercial and weighment terms are agreed per B2B account.
            </p>
          </div>
        </div>

        {/* Product Cards List */}
        <div className="space-y-8">
          {products.map((p, idx) => (
            <div
              key={idx}
              className={`bg-white rounded-2xl border ${
                p.active ? "border-[#E8E1D3] shadow-sm hover:shadow-md" : "border-slate-200 bg-slate-50/60 opacity-90"
              } p-6 sm:p-8 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center`}
            >
              <div className="lg:col-span-8 space-y-4">
                <div className="flex flex-wrap items-center gap-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-extrabold border ${p.statusColor}`}>
                    {p.status}
                  </span>
                  <span className="text-xs font-semibold text-[#4F5E57] uppercase tracking-wider">
                    {p.category}
                  </span>
                </div>

                <h2 className="text-xl sm:text-2xl font-bold text-[#0F2E23]">{p.name}</h2>
                <p className="text-sm text-[#4F5E57] leading-relaxed">{p.description}</p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 text-xs">
                  <div className="bg-[#FAF7F2] p-3 rounded-lg border border-[#E8E1D3]">
                    <span className="text-[#4F5E57] block">Weight Specification:</span>
                    <span className="font-bold text-[#0F2E23]">{p.weightRange}</span>
                  </div>
                  <div className="bg-[#FAF7F2] p-3 rounded-lg border border-[#E8E1D3]">
                    <span className="text-[#4F5E57] block">Supply Format:</span>
                    <span className="font-bold text-[#0F2E23]">{p.minOrder}</span>
                  </div>
                  <div className="bg-[#FAF7F2] p-3 rounded-lg border border-[#E8E1D3]">
                    <span className="text-[#4F5E57] block">Delivery Route:</span>
                    <span className="font-bold text-[#0F2E23]">{p.deliveryWindow}</span>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-4 flex flex-col justify-center items-start lg:items-end gap-3 pt-4 lg:pt-0 border-t lg:border-t-0 border-[#E8E1D3]">
                {p.active ? (
                  <>
                    <Link
                      href="/request-pricing"
                      className="w-full sm:w-auto bg-[#0F2E23] hover:bg-[#184636] text-[#FAF7F2] font-extrabold text-sm px-7 py-3.5 rounded-xl transition-all shadow text-center flex items-center justify-center gap-2 group"
                    >
                      Request B2B Pricing
                      <ArrowRight className="w-4 h-4 text-[#C59B27] group-hover:translate-x-1 transition-transform" />
                    </Link>
                    <span className="text-[11px] text-[#4F5E57]">Availability subject to sourcing & supply</span>
                  </>
                ) : (
                  <div className="w-full sm:w-auto bg-slate-100 border border-slate-200 text-slate-500 font-extrabold text-xs px-6 py-3.5 rounded-xl text-center uppercase tracking-wider">
                    COMING LATER
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Footer CTA */}
        <div className="bg-[#0F2E23] rounded-3xl text-white p-8 lg:p-14 text-center space-y-4 shadow-xl">
          <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">Need specific bird weights or volume supply?</h2>
          <p className="text-sm text-[#FAF7F2]/80 max-w-2xl mx-auto">
            Our team works with commercial kitchens in Dehradun to establish scheduled supply matched to daily menu prep requirements.
          </p>
          <div className="pt-3">
            <Link
              href="/request-pricing"
              className="bg-[#C59B27] hover:bg-[#b0881f] text-[#0F2E23] font-extrabold text-sm px-9 py-4 rounded-xl transition-all inline-block shadow-lg"
            >
              Request B2B Pricing
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
