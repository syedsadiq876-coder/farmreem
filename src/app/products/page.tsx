import Link from "next/link";
import { Lock } from "lucide-react";

export const metadata = {
  title: "Products & Specifications | FarmReem B2B Poultry",
  description: "Live broiler specifications, weight ranges, bulk quantities, and availability status for commercial foodservice accounts in Dehradun and surrounding regions.",
};

export default function ProductsPage() {
  const products = [
    {
      name: "Live Commercial Broiler (Standard Spec)",
      category: "Live Broiler (Active Product)",
      status: "Available",
      statusColor: "bg-emerald-100 text-emerald-800 border-emerald-300",
      weightRange: "1.8 kg – 2.0 kg (Requested Spec)",
      minOrder: "50 Birds (~95 KG)",
      deliveryWindow: "Scheduled Route Delivery",
      description: "Healthy, farm-sourced live broilers selected for uniform sizing. Preferred by restaurant and hotel kitchens for consistent portion yield.",
      active: true,
    },
    {
      name: "Live Commercial Broiler (Heavy Spec)",
      category: "Live Broiler (Active Product)",
      status: "Limited Availability",
      statusColor: "bg-amber-100 text-amber-800 border-amber-300",
      weightRange: "2.0 kg – 2.4 kg (Requested Spec)",
      minOrder: "50 Birds (~110 KG)",
      deliveryWindow: "Scheduled Route Delivery",
      description: "Higher weight live broilers preferred by banquet caterers and institutional kitchens seeking higher meat yield per bird.",
      active: true,
    },
    {
      name: "Dressed Whole Chicken (Chilled)",
      category: "Future Category / Coming Later",
      status: "Coming Later",
      statusColor: "bg-slate-100 text-slate-600 border-slate-300",
      weightRange: "1.2 kg – 1.6 kg",
      minOrder: "Under Development",
      deliveryWindow: "Future Expansion",
      description: "Hygienically processed dressed chicken. Planned for future capability expansion alongside cold-chain logistics.",
      active: false,
    },
    {
      name: "Boneless Portion Cuts",
      category: "Future Category / Coming Later",
      status: "Coming Later",
      statusColor: "bg-slate-100 text-slate-600 border-slate-300",
      weightRange: "Custom Pack Specs",
      minOrder: "Under Development",
      deliveryWindow: "Future Expansion",
      description: "Portioned boneless chicken cuts. Planned as a future product offering as processing facilities expand.",
      active: false,
    },
  ];

  return (
    <div className="bg-[#FAF7F2] py-12 lg:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Header */}
        <div className="max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0F2E23]/10 text-[#0F2E23] text-xs font-bold uppercase tracking-wider">
            Dehradun, Uttarakhand · Catalogue & Specs
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-[#0F2E23] tracking-tight">
            Live Broiler Products & Sizing Specs
          </h1>
          <p className="text-base text-[#4F5E57] leading-relaxed">
            FarmReem provides live broiler sourcing for commercial accounts. Final billing is calculated based on agreed weighment basis (dispatch or receiving weight) and customer-specific B2B rates.
          </p>
        </div>

        {/* Pricing Privacy Note */}
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3 text-xs text-amber-900">
          <Lock className="w-4 h-4 text-amber-700 flex-shrink-0 mt-0.5" />
          <div>
            <span className="font-bold">Customer-Specific B2B Pricing: </span>
            Universal public prices are not displayed. Approved B2B buyers view their designated rate structures inside the customer portal or quote agreements.
          </div>
        </div>

        {/* Product Cards List */}
        <div className="space-y-8">
          {products.map((p, idx) => (
            <div
              key={idx}
              className={`bg-white rounded-2xl border ${
                p.active ? "border-[#E8E1D3] shadow-sm hover:shadow-md" : "border-slate-200 bg-slate-50/50"
              } p-6 sm:p-8 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center`}
            >
              <div className="lg:col-span-8 space-y-4">
                <div className="flex flex-wrap items-center gap-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold border ${p.statusColor}`}>
                    {p.status}
                  </span>
                  <span className="text-xs font-semibold text-[#4F5E57] uppercase tracking-wider">
                    {p.category}
                  </span>
                </div>

                <h3 className="text-xl sm:text-2xl font-bold text-[#0F2E23]">{p.name}</h3>
                <p className="text-sm text-[#4F5E57] leading-relaxed">{p.description}</p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 text-xs">
                  <div className="bg-[#FAF7F2] p-3 rounded-lg border border-[#E8E1D3]">
                    <span className="text-[#4F5E57] block">Weight Specification:</span>
                    <span className="font-bold text-[#0F2E23]">{p.weightRange}</span>
                  </div>
                  <div className="bg-[#FAF7F2] p-3 rounded-lg border border-[#E8E1D3]">
                    <span className="text-[#4F5E57] block">Minimum Bulk Order:</span>
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
                      className="w-full sm:w-auto bg-[#C59B27] hover:bg-[#b0881f] text-[#0F2E23] font-bold text-sm px-6 py-3 rounded-xl transition-all shadow text-center"
                    >
                      Request B2B Pricing
                    </Link>
                    <span className="text-[11px] text-[#4F5E57]">Subject to weighment verification</span>
                  </>
                ) : (
                  <button
                    disabled
                    className="w-full sm:w-auto bg-slate-200 text-slate-500 font-bold text-xs px-6 py-3 rounded-xl cursor-not-allowed text-center uppercase tracking-wider"
                  >
                    Coming Later / Future Category
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Footer CTA */}
        <div className="bg-[#0F2E23] rounded-2xl text-white p-8 lg:p-12 text-center space-y-4">
          <h2 className="text-2xl sm:text-3xl font-bold">Require Account Pricing or Specific Weight Bands?</h2>
          <p className="text-sm text-[#FAF7F2]/80 max-w-2xl mx-auto">
            Contact our commercial team at +91 8475863634 to discuss your kitchen requirement in Dehradun and surrounding regions.
          </p>
          <div className="pt-2">
            <Link
              href="/request-pricing"
              className="bg-[#C59B27] hover:bg-[#b0881f] text-[#0F2E23] font-bold text-sm px-8 py-3.5 rounded-xl transition-all inline-block shadow-lg"
            >
              Request B2B Pricing
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
