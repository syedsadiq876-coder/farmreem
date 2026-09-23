import Link from "next/link";
import { BookOpen, Calculator, ArrowRight, FileText, CheckCircle2 } from "lucide-react";
import PoultryCalculator from "@/components/ui/PoultryCalculator";

export const metadata = {
  title: "B2B Poultry Procurement Resources & Calculator | FarmReem",
  description:
    "Genuinely useful B2B poultry procurement guides, portion yield calculators, and commercial sourcing specifications for hotels, restaurants, and caterers.",
  alternates: {
    canonical: "https://www.farmreem.com/resources",
  },
  openGraph: {
    title: "B2B Poultry Procurement Resources & Calculator | FarmReem",
    description:
      "Commercial poultry procurement resources, portion calculators, and sourcing guides for professional kitchens.",
    url: "https://www.farmreem.com/resources",
  },
};

export default function ResourcesPage() {
  const resourceTopics = [
    {
      title: "01 · Understanding Live Broiler Weight Bands for Commercial Kitchen Yields",
      intent: "Commercial / Informational",
      targetSearch: "Live broiler weight specs for hotels & portion yield calculations",
      summary:
        "A practical guide explaining how Small (800g–1.0kg), Medium (1.0kg–1.4kg), and Large (1.4kg–1.8kg) live broiler categories impact meat yield, bone-to-meat ratio, and dish cost control.",
    },
    {
      title: "02 · How Hotel Purchase Managers Evaluate B2B Poultry Weighment & Delivery Routes",
      intent: "Commercial",
      targetSearch: "Hotel poultry procurement & receiving dock weighment standards",
      summary:
        "Operational checklist for purchasing desks covering truck scale weighments, crate tare deductions, temperature checks, and morning receiving window schedules.",
    },
    {
      title: "03 · Whole Bird vs Portion Cut Sourcing for Restaurant Food Cost Control",
      intent: "Informational / Commercial",
      targetSearch: "Restaurant poultry cost control: whole bird butchery vs pre-cut supply",
      summary:
        "Financial comparison evaluating in-house butchery labor costs versus network portion cut sourcing for standalone and chain restaurant kitchens.",
    },
    {
      title: "04 · Tandoori Chicken Sourcing Guide: Selecting Bird Sizes for Tandoor Prep",
      intent: "Technical / Operational",
      targetSearch: "Tandoori chicken bird sizing & weight selection for restaurants",
      summary:
        "Why smaller live broilers (800g–1.0kg) are preferred for tandoori marinades, heat penetration, cook time, and quarter-plate portion presentation.",
    },
    {
      title: "05 · Banquet & Event Catering Poultry Logistics: Planning High-Volume Bird Counts",
      intent: "Commercial",
      targetSearch: "Catering poultry volume planning & banquet bird count calculation",
      summary:
        "Methodology for banquet chefs and caterers to compute live bird requirements for 200–2,000+ guest wedding functions without over-ordering.",
    },
    {
      title: "06 · Receiving Dock Quality Verification Checklist for Commercial Kitchen Poultry",
      intent: "Operational / Technical",
      targetSearch: "Poultry receiving dock inspection checklist for hotel kitchens",
      summary:
        "Step-by-step receiving verification protocol covering bird activity, plumage condition, crate weight documentation, and dispatch slip reconciliation.",
    },
    {
      title: "07 · Standing Weekly vs Spot Order Sourcing Models for Commercial Kitchens",
      intent: "Commercial",
      targetSearch: "B2B poultry purchasing models: standing orders vs spot procurement",
      summary:
        "Evaluating the trade-offs between fixed weekly standing allocations for regular menu items and flexible spot orders for weekend spikes.",
    },
    {
      title: "08 · Managing Seasonal Demand Shifts in Hospitality Foodservice Supply",
      intent: "Informational",
      targetSearch: "Hospitality poultry supply chain planning during peak tourism seasons",
      summary:
        "How hotels and resorts in Dehradun and Mussoorie manage peak holiday season poultry demand surges without supply disruption.",
    },
    {
      title: "09 · Foodservice Poultry Weight Specifications: Standardizing Portion Yields",
      intent: "Technical / Operational",
      targetSearch: "Poultry portion standardization & kitchen SOP yield management",
      summary:
        "Developing kitchen standard operating procedures (SOPs) around agreed weight bands to eliminate portion variance in multi-outlet restaurant chains.",
    },
    {
      title: "10 · Dehradun & Regional Hospitality Supply Logistics: Navigating Local Routes",
      intent: "Local B2B",
      targetSearch: "Dehradun hotel poultry supply logistics & regional delivery corridors",
      summary:
        "Local route planning overview detailing morning delivery windows across Sahastradhara Road, Rajpur Road, Clement Town, and Mussoorie Road corridors.",
    },
  ];

  return (
    <div className="bg-[#FAF7F2] py-12 lg:py-20 text-[#111A17]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* Page Header */}
        <div className="max-w-4xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#0F2E23]/10 text-[#0F2E23] text-xs font-bold uppercase tracking-wider">
            <BookOpen className="w-3.5 h-3.5 text-[#C59B27]" />
            B2B Procurement Knowledge Base
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-[#0F2E23] tracking-tight">
            Commercial Poultry Procurement Resources
          </h1>
          <p className="text-base text-[#4F5E57] leading-relaxed">
            Practical procurement guides, yield calculators, and commercial sourcing specifications built for hotel purchase managers, executive chefs, caterers, and restaurant operators.
          </p>
        </div>

        {/* SECTION 1 — POULTRY CALCULATOR */}
        <div className="space-y-6">
          <div className="border-b border-[#E8E1D3] pb-3 max-w-3xl">
            <span className="text-xs font-extrabold uppercase tracking-wider text-[#C59B27]">
              INTERACTIVE TOOL
            </span>
            <h2 className="text-2xl font-extrabold text-[#0F2E23]">
              B2B Poultry Requirement & Bird Count Calculator
            </h2>
            <p className="text-xs text-[#4F5E57] mt-1">
              Use our operational calculator to estimate raw kilograms and live bird count requirements for your kitchen's daily cover volume.
            </p>
          </div>

          <PoultryCalculator />
        </div>

        {/* SECTION 2 — 10 PLANNED PROCUREMENT GUIDES */}
        <div className="space-y-8">
          <div className="border-b border-[#E8E1D3] pb-3 max-w-3xl">
            <span className="text-xs font-extrabold uppercase tracking-wider text-[#C59B27]">
              PROCUREMENT ARCHITECTURE
            </span>
            <h2 className="text-2xl font-extrabold text-[#0F2E23]">
              Planned B2B Sourcing Guides & Technical Topics
            </h2>
            <p className="text-xs text-[#4F5E57] mt-1">
              Genuinely useful operational content designed around commercial buyer search intent and kitchen decision-making.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {resourceTopics.map((topic, idx) => (
              <div
                key={idx}
                className="bg-white rounded-2xl border border-[#E8E1D3] p-6 shadow-sm space-y-3 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[10px] font-bold bg-[#FAF7F2] text-[#0F2E23] px-2.5 py-1 rounded border border-[#E8E1D3]">
                    {topic.intent}
                  </span>
                  <span className="text-[10px] font-semibold text-[#4F5E57] italic">
                    Target Search Intent
                  </span>
                </div>

                <h3 className="text-base font-extrabold text-[#0F2E23] leading-snug">
                  {topic.title}
                </h3>
                <p className="text-xs text-[#4F5E57] leading-relaxed">{topic.summary}</p>

                <div className="pt-2 border-t border-[#E8E1D3] text-[11px] text-[#4F5E57]">
                  <span className="font-bold text-[#0F2E23]">Search Context: </span>
                  <span>{topic.targetSearch}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Banner */}
        <div className="bg-[#0F2E23] rounded-3xl text-white p-8 lg:p-14 text-center space-y-4 shadow-xl">
          <h2 className="text-2xl sm:text-4xl font-extrabold text-[#FAF7F2] tracking-tight">
            Have a specific procurement question for your kitchen?
          </h2>
          <p className="text-sm text-[#FAF7F2]/80 max-w-xl mx-auto">
            Talk to the FarmReem commercial desk in Dehradun for account-specific weighment protocols, delivery route availability, and pricing structures.
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
