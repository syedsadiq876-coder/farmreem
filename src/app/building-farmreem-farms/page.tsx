import Link from "next/link";
import Image from "next/image";
import { CheckCircle2, ArrowRight } from "lucide-react";

export const metadata = {
  title: "FarmReem Poultry Production Development | FarmReem",
  description: "Building greater control into our supply network. FarmReem is developing owned poultry production capacity to complement external sourcing.",
  alternates: {
    canonical: "https://www.farmreem.com/building-farmreem-farms",
  },
  openGraph: {
    title: "FarmReem Poultry Production Development | FarmReem",
    description: "Building greater control into our supply network. FarmReem is developing owned poultry production capacity.",
    url: "https://www.farmreem.com/building-farmreem-farms",
  },
};

export default function BuildingFarmReemFarmsPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    "name": "Building FarmReem Farms",
    "description": "FarmReem is developing owned poultry production capacity to complement external sourcing and strengthen B2B supply continuity.",
    "publisher": {
      "@type": "Organization",
      "name": "FarmReem",
      "url": "https://www.farmreem.com"
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
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#C59B27]/15 text-[#0F2E23] text-xs font-extrabold uppercase tracking-wider border border-[#C59B27]/30">
            FUTURE / IN DEVELOPMENT
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-[#0F2E23] tracking-tight">
            Building greater control into our supply network.
          </h1>
          <p className="text-base sm:text-lg text-[#4F5E57] leading-relaxed">
            FarmReem is developing owned poultry-production capacity to complement external sourcing and strengthen B2B supply continuity for commercial kitchen accounts.
          </p>
        </div>

        {/* Conceptual Image Section */}
        <div className="rounded-3xl overflow-hidden border border-[#E8E1D3] shadow-md relative h-[380px] sm:h-[440px]">
          <Image
            src="/images/farm_facility.jpg"
            alt="Building FarmReem Farms Facility Development Concept"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0F2E23] via-[#0F2E23]/40 to-transparent p-8 flex flex-col justify-end text-white">
            <span className="text-[10px] sm:text-xs font-extrabold uppercase tracking-wider text-[#C59B27] bg-[#0F2E23]/80 px-2.5 py-1 rounded w-fit mb-2 border border-[#C59B27]/30">
              Facility preview · illustrative development concept
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold">Planned Farm Infrastructure</h2>
            <p className="text-xs sm:text-sm text-[#FAF7F2]/80 max-w-2xl mt-1">
              Developing modern broiler housing engineered for flock health, controlled ventilation, and structured biosecurity standards.
            </p>
          </div>
        </div>

        {/* Position Statement */}
        <div className="bg-white p-8 lg:p-12 rounded-3xl border border-[#E8E1D3] space-y-6 shadow-sm">
          <div className="inline-block px-3 py-1 rounded bg-[#FAF7F2] text-[#0F2E23] border border-[#E8E1D3] font-extrabold text-xs uppercase tracking-wider">
            Supply Capability Roadmap
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0F2E23]">Why We Are Building Farm Production Capacity</h2>
          <p className="text-sm text-[#4F5E57] leading-relaxed">
            FarmReem currently fulfills customer requirements through active wholesale sourcing channels and developing partner farm relationships.
          </p>
          <p className="text-sm text-[#4F5E57] leading-relaxed">
            Developing owned production capacity will provide FarmReem with greater operational control over bird growing conditions, feed standards, and uniform weight sorting.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 border-t border-[#E8E1D3] text-xs">
            <div className="p-4 rounded-xl bg-[#FAF7F2] border border-[#E8E1D3] space-y-1">
              <span className="font-extrabold text-[#0F2E23] block text-sm">CURRENT SOURCING</span>
              <span className="text-[#4F5E57] block">Wholesale Sourcing & Available Supplier Networks</span>
            </div>
            <div className="p-4 rounded-xl bg-[#FAF7F2] border border-[#E8E1D3] space-y-1">
              <span className="font-extrabold text-[#0F2E23] block text-sm">PARTNER NETWORK</span>
              <span className="text-[#4F5E57] block">Developing Selected Partner Farm Relationships</span>
            </div>
            <div className="p-4 rounded-xl bg-[#FAF7F2] border border-[#E8E1D3] space-y-1">
              <span className="font-extrabold text-[#C59B27] block text-sm">OWNED PRODUCTION</span>
              <span className="text-[#4F5E57] block">FarmReem Owned Farms (Under Active Development)</span>
            </div>
          </div>
        </div>

        {/* Future Standards */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-[#0F2E23]">Standards Being Built Into Future Facilities</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              {
                title: "Controlled Ventilation Systems",
                desc: "Airflow and temperature controls to maintain comfortable housing conditions for flock welfare.",
              },
              {
                title: "Bio-Security Protocol Zones",
                desc: "Vehicle sanitation areas and controlled access barriers to minimize external contamination risks.",
              },
              {
                title: "Quality Grain Feed Programs",
                desc: "Structured nutrition to promote consistent natural growth and target portion sizing.",
              },
              {
                title: "Pre-Dispatch Weight Sorting",
                desc: "Dedicated weighment checks before birds are loaded into route crates for kitchen dispatch.",
              },
            ].map((item, idx) => (
              <div key={idx} className="bg-white p-6 rounded-2xl border border-[#E8E1D3] space-y-2 shadow-sm">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-[#C59B27]" />
                  <h3 className="font-extrabold text-base text-[#0F2E23]">{item.title}</h3>
                </div>
                <p className="text-xs text-[#4F5E57] leading-relaxed pl-7">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="bg-[#0F2E23] text-white rounded-3xl p-8 lg:p-14 text-center space-y-4 shadow-xl">
          <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">Looking for B2B Poultry Supply in Dehradun?</h2>
          <p className="text-sm text-[#FAF7F2]/80 max-w-2xl mx-auto">
            Contact FarmReem to discuss daily or weekly broiler supply requirements for your hotel, restaurant, or catering operation.
          </p>
          <div className="pt-3 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/request-pricing"
              className="bg-[#C59B27] hover:bg-[#b0881f] text-[#0F2E23] font-extrabold text-sm px-8 py-4 rounded-xl transition-all shadow"
            >
              Request B2B Pricing
            </Link>
            <Link
              href="/become-partner"
              className="bg-[#184636] hover:bg-[#205945] text-white font-extrabold text-sm px-7 py-4 rounded-xl border border-[#25634e] transition-colors"
            >
              Supply Partner Application
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
