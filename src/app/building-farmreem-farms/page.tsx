import Link from "next/link";
import Image from "next/image";
import { Building2, ShieldCheck, CheckCircle2, ArrowRight } from "lucide-react";

export const metadata = {
  title: "Building FarmReem Farms | Infrastructure Roadmap",
  description: "FarmReem is developing its owned poultry production capacity alongside its partner network and wholesale sourcing.",
};

export default function BuildingFarmReemFarmsPage() {
  return (
    <div className="bg-[#FAF7F2] py-12 lg:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Header */}
        <div className="max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0F2E23]/10 text-[#0F2E23] text-xs font-bold uppercase tracking-wider">
            Infrastructure & Production Roadmap
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-[#0F2E23] tracking-tight">
            Building FarmReem Farms
          </h1>
          <p className="text-base text-[#4F5E57] leading-relaxed">
            FarmReem is developing owned poultry production capacity to complement its established sourcing network. Here is how our dual production strategy benefits commercial kitchen accounts.
          </p>
        </div>

        {/* Hero Image Section */}
        <div className="rounded-2xl overflow-hidden border border-[#E8E1D3] shadow-md relative h-[400px]">
          <Image
            src="/images/farm_facility.jpg"
            alt="Building FarmReem Farms Facility Roadmap"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0F2E23] via-[#0F2E23]/40 to-transparent p-8 flex flex-col justify-end text-white">
            <span className="text-xs font-bold uppercase tracking-wider text-[#C59B27] mb-1">
              Production Development Plan
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold">Biosecure Farm Production Facilities</h2>
            <p className="text-xs sm:text-sm text-[#FAF7F2]/80 max-w-2xl mt-1">
              Developing modern broiler housing engineered for bird health, environmentally controlled ventilation, and strict biosecurity protocols.
            </p>
          </div>
        </div>

        {/* Transparent Operational Statement */}
        <div className="bg-white p-8 lg:p-10 rounded-2xl border border-[#E8E1D3] space-y-6">
          <div className="inline-block px-3 py-1 rounded bg-amber-100 text-amber-900 font-bold text-xs">
            Transparent Operational Position
          </div>
          <h2 className="text-2xl font-bold text-[#0F2E23]">Dual Production & Sourcing Strategy</h2>
          <p className="text-sm text-[#4F5E57] leading-relaxed">
            To be completely transparent with our B2B partners: FarmReem currently procures live broilers through audited commercial partner farms and wholesale procurement markets. Owned farm production is actively under construction and site development.
          </p>
          <p className="text-sm text-[#4F5E57] leading-relaxed">
            Once fully operational, FarmReem Owned Farms will serve as our core production baseline, setting technical standards for feed quality, biosecurity, and bird weight uniformity across all partner farms.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 border-t border-[#E8E1D3] text-xs">
            <div className="space-y-1">
              <span className="font-bold text-[#0F2E23] block">Stage 1 (Current):</span>
              <span className="text-[#4F5E57]">Partner Farm Sourcing & Wholesale Procurement</span>
            </div>
            <div className="space-y-1">
              <span className="font-bold text-[#0F2E23] block">Stage 2 (Under Construction):</span>
              <span className="text-[#4F5E57]">FarmReem Bio-Secure Farm Construction</span>
            </div>
            <div className="space-y-1">
              <span className="font-bold text-[#0F2E23] block">Stage 3 (Future Target):</span>
              <span className="text-[#4F5E57]">Integrated Owned + Partner Supply Network</span>
            </div>
          </div>
        </div>

        {/* Key Features of Future Farm Facility */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-[#0F2E23]">Standards Being Built into FarmReem Farms</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              {
                title: "Enclosed Environment Controls",
                desc: "Automated climate management systems regulating temperature and airflow to maintain flock health.",
              },
              {
                title: "Strict Biosecurity Zones",
                desc: "Vehicle sanitation bays, visitor protocols, and pathogen exclusion barriers protecting bird welfare.",
              },
              {
                title: "Formulated Nutrition Programs",
                desc: "Custom grain feed formulations designed to optimize natural growth and meat yield without artificial additives.",
              },
              {
                title: "Precision Batch Weighment Sorting",
                desc: "Integrated digital weighing systems ensuring exact live weight bands are sorted prior to kitchen dispatch.",
              },
            ].map((item, idx) => (
              <div key={idx} className="bg-white p-6 rounded-xl border border-[#E8E1D3] space-y-2">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-[#C59B27]" />
                  <h3 className="font-bold text-base text-[#0F2E23]">{item.title}</h3>
                </div>
                <p className="text-xs text-[#4F5E57] leading-relaxed pl-7">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="bg-[#0F2E23] text-white rounded-2xl p-8 lg:p-12 text-center space-y-4">
          <h2 className="text-2xl sm:text-3xl font-bold">Interested in Partnering with FarmReem Sourcing?</h2>
          <p className="text-sm text-[#FAF7F2]/80 max-w-2xl mx-auto">
            Whether you are a commercial kitchen seeking reliable live broiler supply or a poultry grower looking for off-take agreements, we welcome your inquiry.
          </p>
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/request-pricing"
              className="bg-[#C59B27] hover:bg-[#b0881f] text-[#0F2E23] font-bold text-sm px-8 py-3.5 rounded-xl transition-all shadow"
            >
              Request B2B Kitchen Pricing
            </Link>
            <Link
              href="/become-partner"
              className="bg-[#184636] hover:bg-[#205945] text-white font-semibold text-sm px-7 py-3.5 rounded-xl border border-[#25634e] transition-colors"
            >
              Become a Farm Partner
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
