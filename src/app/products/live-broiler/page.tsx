import Link from "next/link";
import { Lock, ArrowRight, CheckCircle2, ShieldCheck, MapPin, Truck, Scale } from "lucide-react";

export const metadata = {
  title: "Live Broiler Sourcing & Commercial Specifications | FarmReem",
  description:
    "Commercial live broiler supply categorized in Small (800g–1.0kg), Medium (1.0kg–1.4kg), and Large (1.4kg–1.8kg) weight ranges for hotels, restaurants, caterers, and institutional kitchens in Dehradun.",
  alternates: {
    canonical: "https://www.farmreem.com/products/live-broiler",
  },
  openGraph: {
    title: "Live Broiler Sourcing & Commercial Specifications | FarmReem",
    description:
      "Commercial live broiler supply categorized in Small, Medium, and Large weight ranges for professional kitchens.",
    url: "https://www.farmreem.com/products/live-broiler",
  },
};

export default function LiveBroilerProductPage() {
  const categories = [
    {
      name: "Small Live Broiler",
      range: "800 g – 1.0 kg",
      badge: "AVAILABLE",
      badgeClass: "bg-emerald-100 text-emerald-800 border-emerald-300",
      description: "Selected smaller live broilers preferred for tandoori marinades, whole roasted chicken, and smaller portion requirements.",
      applications: "Tandoori Preparation · Whole Bird Roasts · Specialty Platters",
    },
    {
      name: "Medium Live Broiler",
      range: "1.0 kg – 1.4 kg",
      badge: "AVAILABLE",
      badgeClass: "bg-emerald-100 text-emerald-800 border-emerald-300",
      description: "Standard commercial weight range favored by casual dining restaurants, cafes, and regular kitchen prep desks.",
      applications: "Standard Curry Cuts · Restaurant Menu Prep · Everyday Service",
    },
    {
      name: "Large Live Broiler",
      range: "1.4 kg – 1.8 kg",
      badge: "AVAILABLE",
      badgeClass: "bg-emerald-100 text-emerald-800 border-emerald-[#C59B27]",
      description: "Heavy weight live broilers specified for banquet catering, wedding functions, and high-volume meat yield per bird.",
      applications: "Banquets & Events · High-Yield Catering · Bulk Curry Prep",
    },
    {
      name: "Custom Weight Specification",
      range: "Account Specific",
      badge: "AVAILABLE",
      badgeClass: "bg-emerald-100 text-emerald-800 border-emerald-300",
      description: "Custom weight bands established per commercial account agreement based on hotel standard operating procedures.",
      applications: "Hotel Chains · Contract Catering · Standing B2B Orders",
    },
  ];

  const breadcrumbs = [
    { name: "Home", item: "https://www.farmreem.com" },
    { name: "Products", item: "https://www.farmreem.com/products" },
    { name: "Live Broiler", item: "https://www.farmreem.com/products/live-broiler" },
  ];

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: breadcrumbs.map((b, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: b.name,
      item: b.item,
    })),
  };

  const pageJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Live Broiler Sourcing & Commercial Specifications",
    description: "Commercial live broiler supply categorized into typical working weight ranges for hotels, restaurants, and caterers.",
    url: "https://www.farmreem.com/products/live-broiler",
    isPartOf: {
      "@type": "WebSite",
      name: "FarmReem",
      url: "https://www.farmreem.com",
    },
  };

  return (
    <div className="bg-[#FAF7F2] py-12 lg:py-20 text-[#111A17]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(pageJsonLd) }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Breadcrumb Navigation */}
        <nav aria-label="Breadcrumb" className="text-xs text-[#4F5E57]">
          <ol className="flex items-center space-x-2">
            <li>
              <Link href="/" className="hover:text-[#0F2E23] transition-colors">
                Home
              </Link>
            </li>
            <li>/</li>
            <li>
              <Link href="/products" className="hover:text-[#0F2E23] transition-colors">
                Products
              </Link>
            </li>
            <li>/</li>
            <li className="font-bold text-[#0F2E23]">Live Broiler</li>
          </ol>
        </nav>

        {/* Hero Section */}
        <div className="max-w-4xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#0F2E23]/10 text-[#0F2E23] text-xs font-bold uppercase tracking-wider">
            <Scale className="w-3.5 h-3.5 text-[#C59B27]" />
            Core Capability · Live Broiler Sourcing
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-[#0F2E23] tracking-tight">
            Live Broiler Supply & Sizing Specifications
          </h1>
          <p className="text-base sm:text-lg text-[#4F5E57] leading-relaxed">
            FarmReem provides commercial live broiler supply categorized into typical working weight ranges so professional kitchens can plan portioning, yield, and daily food costs predictably.
          </p>
        </div>

        {/* Commercial Terms Notice */}
        <div className="bg-white border border-[#E8E1D3] rounded-2xl p-6 shadow-sm space-y-3">
          <div className="flex items-center gap-2 text-sm font-extrabold text-[#0F2E23]">
            <Lock className="w-4 h-4 text-[#C59B27]" />
            <span>Commercial & Weighment Standards</span>
          </div>
          <p className="text-xs text-[#4F5E57] leading-relaxed">
            Commercial live broiler pricing is structured around order volume, requested weight bands, and delivery frequency. All shipments are weighed before dispatch, with weighment details recorded for account verification.
          </p>
        </div>

        {/* Weight Categories Grid */}
        <div className="space-y-6">
          <div className="border-b border-[#E8E1D3] pb-3">
            <h2 className="text-2xl font-extrabold text-[#0F2E23]">
              Working Weight Categories
            </h2>
            <p className="text-xs text-[#4F5E57] mt-0.5">
              Typical working ranges subject to availability and account requirements.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {categories.map((cat, idx) => (
              <div
                key={idx}
                className="bg-white rounded-2xl border border-[#E8E1D3] p-6 sm:p-8 shadow-sm space-y-5 flex flex-col justify-between hover:shadow-md transition-shadow"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className={`px-2.5 py-0.5 rounded text-[10px] font-extrabold border ${cat.badgeClass}`}>
                      {cat.badge}
                    </span>
                    <span className="text-xs font-black text-[#C59B27] bg-[#FAF7F2] px-3 py-1 rounded-full border border-[#E8E1D3]">
                      {cat.range}
                    </span>
                  </div>

                  <h3 className="text-xl font-extrabold text-[#0F2E23]">{cat.name}</h3>
                  <p className="text-xs text-[#4F5E57] leading-relaxed">{cat.description}</p>

                  <div className="p-3 rounded-xl bg-[#FAF7F2] border border-[#E8E1D3] text-xs text-[#0F2E23]">
                    <span className="font-bold block text-[#4F5E57]">Kitchen Application:</span>
                    <span>{cat.applications}</span>
                  </div>
                </div>

                <div className="pt-2">
                  <Link
                    href="/request-pricing"
                    className="w-full bg-[#0F2E23] hover:bg-[#184636] text-[#FAF7F2] font-extrabold text-xs py-3.5 rounded-xl transition-all shadow-sm text-center flex items-center justify-center gap-2 group"
                  >
                    Request Live Broiler Pricing
                    <ArrowRight className="w-3.5 h-3.5 text-[#C59B27] group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Operational Workflow */}
        <div className="bg-white rounded-3xl border border-[#E8E1D3] p-8 sm:p-12 shadow-sm space-y-8">
          <div className="space-y-2">
            <span className="text-xs font-extrabold uppercase tracking-wider text-[#C59B27]">
              Sourcing & Delivery Workflow
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0F2E23]">
              How FarmReem Fulfills Live Broiler Supply
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-xs text-[#0F2E23]">
            <div className="p-5 rounded-2xl bg-[#FAF7F2] border border-[#E8E1D3] space-y-2">
              <div className="w-8 h-8 rounded-full bg-[#0F2E23] text-white flex items-center justify-center font-extrabold">
                1
              </div>
              <h3 className="font-extrabold text-sm">Specify Requirement</h3>
              <p className="text-[#4F5E57]">Bird count, preferred weight range (Small, Medium, Large) and delivery date.</p>
            </div>

            <div className="p-5 rounded-2xl bg-[#FAF7F2] border border-[#E8E1D3] space-y-2">
              <div className="w-8 h-8 rounded-full bg-[#0F2E23] text-white flex items-center justify-center font-extrabold">
                2
              </div>
              <h3 className="font-extrabold text-sm">Sourcing Network Match</h3>
              <p className="text-[#4F5E57]">Supply is coordinated through our network based on requested specs and availability.</p>
            </div>

            <div className="p-5 rounded-2xl bg-[#FAF7F2] border border-[#E8E1D3] space-y-2">
              <div className="w-8 h-8 rounded-full bg-[#0F2E23] text-white flex items-center justify-center font-extrabold">
                3
              </div>
              <h3 className="font-extrabold text-sm">Weighment Check</h3>
              <p className="text-[#4F5E57]">Birds are checked against agreed weight parameters before truck dispatch.</p>
            </div>

            <div className="p-5 rounded-2xl bg-[#FAF7F2] border border-[#E8E1D3] space-y-2">
              <div className="w-8 h-8 rounded-full bg-[#0F2E23] text-white flex items-center justify-center font-extrabold">
                4
              </div>
              <h3 className="font-extrabold text-sm">Scheduled Delivery</h3>
              <p className="text-[#4F5E57]">Delivered around agreed receiving windows for your kitchen team.</p>
            </div>
          </div>
        </div>

        {/* Regional Coverage */}
        <div className="bg-[#FAF7F2] rounded-2xl border border-[#E8E1D3] p-6 sm:p-8 space-y-3">
          <div className="flex items-center gap-2 text-sm font-extrabold text-[#0F2E23]">
            <MapPin className="w-4 h-4 text-[#C59B27]" />
            <span>Regional Operational Coverage · Dehradun & Uttarakhand</span>
          </div>
          <p className="text-xs text-[#4F5E57] leading-relaxed">
            FarmReem coordinates live broiler supply for commercial accounts across Dehradun, including Sahastradhara Road, Rajpur Road, Clement Town, Mussoorie Road, Haridwar Bypass, and neighboring hospitality corridors.
          </p>
        </div>

        {/* CTA Banner */}
        <div className="bg-[#0F2E23] rounded-3xl text-white p-8 lg:p-14 text-center space-y-4 shadow-xl">
          <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
            Ready to discuss live broiler supply for your kitchen?
          </h2>
          <p className="text-sm text-[#FAF7F2]/80 max-w-xl mx-auto">
            Submit your daily or weekly bird requirements to receive tailored B2B rate structures.
          </p>
          <div className="pt-3">
            <Link
              href="/request-pricing"
              className="bg-[#C59B27] hover:bg-[#b0881f] text-[#0F2E23] font-extrabold text-sm px-9 py-4 rounded-xl transition-all inline-block shadow-lg"
            >
              Request Live Broiler Pricing
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
