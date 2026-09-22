import Link from "next/link";
import Image from "next/image";

export const metadata = {
  title: "Quality & Sourcing Standards | FarmReem",
  description: "Factual operational standards for live broiler sourcing: supplier screening, bird condition checks, weight verification, careful handling, and scheduled delivery.",
  alternates: {
    canonical: "https://www.farmreem.com/quality-sourcing",
  },
};

export default function QualitySourcingPage() {
  const steps = [
    {
      num: "01",
      title: "Supplier Screening",
      subtitle: "Supplier & Farm Selection",
      description: "Operational screening of partner farms and wholesale procurement sources. Evaluates flock condition, biosecurity measures, and historical supply reliability.",
    },
    {
      num: "02",
      title: "Bird Condition Checks",
      subtitle: "Physical Inspection Prior to Loading",
      description: "Flock health inspection checking bird vigor, feather condition, and weight uniformity. Non-conforming or undersized birds are excluded from commercial kitchen dispatches.",
    },
    {
      num: "03",
      title: "Weight Verification",
      subtitle: "Dual Weighment Protocol",
      description: "Calibrated weighment at dispatch point and upon receiving dock arrival. Both dispatch bird count/weight and receiving bird count/weight are recorded to eliminate billing discrepancies.",
    },
    {
      num: "04",
      title: "Careful Handling",
      subtitle: "Ventilated Live Bird Transport",
      description: "Crate loading and transport in ventilated live bird vehicles. Reduces stress and minimizes shrinkage during transit to kitchen receiving docks.",
    },
    {
      num: "05",
      title: "Scheduled Delivery",
      subtitle: "Time-Windowed Morning Dispatches",
      description: "Route-planned morning deliveries scheduled to ensure kitchen receiving staff can verify bird count and weight before morning prep.",
    },
  ];

  return (
    <div className="bg-[#FAF7F2] py-12 lg:py-20 text-[#111A17]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Header */}
        <div className="max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0F2E23]/10 text-[#0F2E23] text-xs font-bold uppercase tracking-wider">
            Operational Standards
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-[#0F2E23] tracking-tight">
            Quality & Sourcing Framework
          </h1>
          <p className="text-base text-[#4F5E57] leading-relaxed">
            FarmReem operates on transparent, documented procedures across every delivery batch. We focus on verifiable operational checks and dependable service.
          </p>
        </div>

        {/* Visual Showcase */}
        <div className="rounded-3xl overflow-hidden border border-[#E8E1D3] shadow-md relative h-[360px]">
          <Image
            src="/images/quality_inspect.jpg"
            alt="FarmReem Quality & Weight Verification Inspection"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0F2E23] via-[#0F2E23]/30 to-transparent p-8 flex flex-col justify-end text-white">
            <span className="text-xs font-extrabold uppercase tracking-wider text-[#C59B27] mb-1">
              Inspection Standard
            </span>
            <h2 className="text-2xl font-bold">Calibrated Weighment & Condition Check</h2>
            <p className="text-xs sm:text-sm text-[#FAF7F2]/80 max-w-2xl mt-1">
              Verifying weight, bird count, and flock condition at dispatch and delivery.
            </p>
          </div>
        </div>

        {/* 5 Operational Steps */}
        <div className="space-y-8">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0F2E23]">The 5-Step Operational Sourcing Standard</h2>
          <div className="grid grid-cols-1 gap-6">
            {steps.map((st, idx) => (
              <div
                key={idx}
                className="bg-white p-6 sm:p-8 rounded-3xl border border-[#E8E1D3] shadow-sm grid grid-cols-1 lg:grid-cols-12 gap-6 items-center"
              >
                <div className="lg:col-span-2 flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-[#0F2E23] text-[#C59B27] font-extrabold text-xl flex items-center justify-center">
                    {st.num}
                  </div>
                </div>
                <div className="lg:col-span-10 space-y-1">
                  <span className="text-xs font-extrabold text-[#C59B27] uppercase tracking-wider block">
                    {st.subtitle}
                  </span>
                  <h3 className="text-xl font-bold text-[#0F2E23]">{st.title}</h3>
                  <p className="text-sm text-[#4F5E57] leading-relaxed pt-1">{st.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="bg-[#0F2E23] text-white rounded-3xl p-8 lg:p-14 text-center space-y-4 shadow-xl">
          <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">Ready for Verifiable B2B Poultry Sourcing?</h2>
          <p className="text-sm text-[#FAF7F2]/80 max-w-2xl mx-auto">
            Contact our commercial team to discuss weight specifications, delivery slots, and customer rate structures.
          </p>
          <div className="pt-3">
            <Link
              href="/request-pricing"
              className="bg-[#C59B27] hover:bg-[#b0881f] text-[#0F2E23] font-extrabold text-sm px-8 py-4 rounded-xl transition-all shadow inline-block"
            >
              Request B2B Kitchen Pricing
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
