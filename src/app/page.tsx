import Link from "next/link";
import {
  ArrowRight,
  Lock,
  Phone,
  MessageSquare,
  Scale,
  Clock,
  ShieldCheck,
  Building2,
  Check,
  RotateCcw,
  Calendar,
  CheckCircle2,
  ChevronRight,
} from "lucide-react";

export default function HomePage() {
  return (
    <div className="bg-[#FAF7F2] text-[#111A17] space-y-0">
      
      {/* SECTION 1 — HERO */}
      <section className="relative bg-[#0F2E23] text-white pt-14 pb-20 lg:pt-24 lg:pb-32 overflow-hidden">
        {/* Ambient background glows */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#C59B27]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-[#184636]/40 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Hero Left Typography */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#184636] border border-[#25634e] text-[#C59B27] text-xs font-bold uppercase tracking-wider">
                Dehradun, Uttarakhand · Professional Foodservice Supply
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.1]">
                Poultry supply, <br />
                <span className="text-[#C59B27]">simplified for professional kitchens.</span>
              </h1>

              <p className="text-base sm:text-lg text-[#FAF7F2]/80 font-normal leading-relaxed max-w-xl mx-auto lg:mx-0">
                Live broiler sourcing and scheduled B2B delivery for hotels, restaurants, caterers and institutions.
              </p>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
                <Link
                  href="/request-pricing"
                  className="w-full sm:w-auto bg-[#C59B27] hover:bg-[#b0881f] text-[#0F2E23] font-extrabold text-base px-8 py-4 rounded-xl shadow-xl transition-all flex items-center justify-center gap-2 group"
                >
                  Request B2B Pricing
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>

                <Link
                  href="/login"
                  className="w-full sm:w-auto bg-[#184636] hover:bg-[#205945] text-white font-semibold text-base px-7 py-4 rounded-xl border border-[#25634e] transition-colors flex items-center justify-center gap-2"
                >
                  <Lock className="w-4 h-4 text-[#C59B27]" />
                  B2B Login
                </Link>
              </div>
            </div>

            {/* Hero Right Visual: Product/Order Interface Mockup */}
            <div className="lg:col-span-5 relative">
              <div className="bg-[#0A2118] border border-[#184636] rounded-2xl shadow-2xl p-6 sm:p-8 space-y-6">
                <div className="flex items-center justify-between border-b border-[#184636] pb-4">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-xs font-extrabold uppercase tracking-wider text-[#C59B27]">
                      Live B2B Ordering Interface
                    </span>
                  </div>
                  <span className="text-[10px] font-bold bg-[#184636] px-2.5 py-1 rounded text-[#FAF7F2]/80">
                    FR-8842
                  </span>
                </div>

                {/* Product Box */}
                <div className="bg-[#0F2E23] p-5 rounded-xl border border-[#25634e] space-y-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-extrabold text-lg text-white">Live Commercial Broiler</h3>
                      <p className="text-xs text-[#FAF7F2]/60">Specified Weight Spec · Receiving Dock Delivery</p>
                    </div>
                    <span className="text-xs font-bold text-emerald-400 bg-emerald-950 border border-emerald-800 px-2 py-1 rounded">
                      Available
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div className="bg-[#0A2118] p-3 rounded-lg border border-[#184636]">
                      <span className="text-[#FAF7F2]/60 block mb-0.5">Preferred Weight</span>
                      <span className="font-extrabold text-white text-sm">1.8 – 2.0 kg</span>
                    </div>
                    <div className="bg-[#0A2118] p-3 rounded-lg border border-[#184636]">
                      <span className="text-[#FAF7F2]/60 block mb-0.5">Bird Quantity</span>
                      <span className="font-extrabold text-[#C59B27] text-sm">120 Birds (~228 KG)</span>
                    </div>
                    <div className="bg-[#0A2118] p-3 rounded-lg border border-[#184636]">
                      <span className="text-[#FAF7F2]/60 block mb-0.5">Delivery Date</span>
                      <span className="font-bold text-white">Tomorrow</span>
                    </div>
                    <div className="bg-[#0A2118] p-3 rounded-lg border border-[#184636]">
                      <span className="text-[#FAF7F2]/60 block mb-0.5">Kitchen Slot</span>
                      <span className="font-bold text-white">06:00 – 08:00 AM</span>
                    </div>
                  </div>

                  <div className="pt-2 flex justify-between items-center text-xs">
                    <span className="text-[#FAF7F2]/60">Account Rate: <strong className="text-white">Customer Contract</strong></span>
                    <button
                      type="button"
                      className="bg-[#C59B27] text-[#0F2E23] font-extrabold text-xs px-5 py-2.5 rounded-lg shadow cursor-default"
                    >
                      [ Confirm Order ]
                    </button>
                  </div>
                </div>

                <p className="text-[11px] text-center text-[#FAF7F2]/50">
                  *Visual demonstration of the FarmReem B2B ordering experience.
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* SECTION 2 — COMPACT VALUE STRIP */}
      <section className="bg-white border-y border-[#E8E1D3] py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center md:text-left">
            
            <div className="flex items-center gap-3 justify-center md:justify-start">
              <div className="w-10 h-10 rounded-xl bg-[#FAF7F2] border border-[#E8E1D3] flex items-center justify-center text-[#0F2E23] flex-shrink-0">
                <Scale className="w-5 h-5 text-[#C59B27]" />
              </div>
              <div className="text-left">
                <h4 className="font-extrabold text-sm text-[#0F2E23]">Weight-Matched Supply</h4>
                <p className="text-[11px] text-[#4F5E57]">Uniform bird size bands</p>
              </div>
            </div>

            <div className="flex items-center gap-3 justify-center md:justify-start">
              <div className="w-10 h-10 rounded-xl bg-[#FAF7F2] border border-[#E8E1D3] flex items-center justify-center text-[#0F2E23] flex-shrink-0">
                <Clock className="w-5 h-5 text-[#C59B27]" />
              </div>
              <div className="text-left">
                <h4 className="font-extrabold text-sm text-[#0F2E23]">Scheduled Delivery</h4>
                <p className="text-[11px] text-[#4F5E57]">Planned morning routes</p>
              </div>
            </div>

            <div className="flex items-center gap-3 justify-center md:justify-start">
              <div className="w-10 h-10 rounded-xl bg-[#FAF7F2] border border-[#E8E1D3] flex items-center justify-center text-[#0F2E23] flex-shrink-0">
                <ShieldCheck className="w-5 h-5 text-[#C59B27]" />
              </div>
              <div className="text-left">
                <h4 className="font-extrabold text-sm text-[#0F2E23]">Transparent Weighment</h4>
                <p className="text-[11px] text-[#4F5E57]">Verified dual tickets</p>
              </div>
            </div>

            <div className="flex items-center gap-3 justify-center md:justify-start">
              <div className="w-10 h-10 rounded-xl bg-[#FAF7F2] border border-[#E8E1D3] flex items-center justify-center text-[#0F2E23] flex-shrink-0">
                <Building2 className="w-5 h-5 text-[#C59B27]" />
              </div>
              <div className="text-left">
                <h4 className="font-extrabold text-sm text-[#0F2E23]">Account-Specific Pricing</h4>
                <p className="text-[11px] text-[#4F5E57]">Customer contract rates</p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* SECTION 3 — BUILT AROUND YOUR KITCHEN */}
      <section className="py-20 bg-[#FAF7F2]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-xs font-extrabold uppercase tracking-wider text-[#C59B27]">
              Tailored Foodservice Logistics
            </span>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-[#0F2E23] tracking-tight">
              Tell us what your kitchen needs.
            </h2>
            <p className="text-sm text-[#4F5E57] leading-relaxed">
              We configure your supply protocol based on requested bird count, preferred weight ranges, and kitchen dock schedules.
            </p>
          </div>

          {/* Interactive UI Showcase Mockup */}
          <div className="bg-white rounded-2xl border border-[#E8E1D3] p-6 sm:p-10 shadow-sm space-y-8 max-w-4xl mx-auto">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              
              <div className="p-4 rounded-xl bg-[#FAF7F2] border border-[#E8E1D3] space-y-1">
                <span className="text-[10px] font-bold text-[#C59B27] uppercase tracking-wider block">01 · Bird Quantity</span>
                <span className="text-base font-extrabold text-[#0F2E23] block">100 Birds (Custom)</span>
                <span className="text-[11px] text-[#4F5E57]">Selected bird count per day</span>
              </div>

              <div className="p-4 rounded-xl bg-[#FAF7F2] border border-[#E8E1D3] space-y-1">
                <span className="text-[10px] font-bold text-[#C59B27] uppercase tracking-wider block">02 · Preferred Weight</span>
                <span className="text-base font-extrabold text-[#0F2E23] block">1.8 kg – 2.0 kg Spec</span>
                <span className="text-[11px] text-[#4F5E57]">Uniform portion yield</span>
              </div>

              <div className="p-4 rounded-xl bg-[#FAF7F2] border border-[#E8E1D3] space-y-1">
                <span className="text-[10px] font-bold text-[#C59B27] uppercase tracking-wider block">03 · Delivery Slot</span>
                <span className="text-base font-extrabold text-[#0F2E23] block">06:00 – 08:00 AM</span>
                <span className="text-[11px] text-[#4F5E57]">Morning dock receiving</span>
              </div>

              <div className="p-4 rounded-xl bg-[#FAF7F2] border border-[#E8E1D3] space-y-1">
                <span className="text-[10px] font-bold text-[#C59B27] uppercase tracking-wider block">04 · Repeat Schedule</span>
                <span className="text-base font-extrabold text-emerald-800 block">Active Mon–Sat</span>
                <span className="text-[11px] text-[#4F5E57]">Automated standing order</span>
              </div>

            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between pt-6 border-t border-[#E8E1D3] gap-4">
              <p className="text-xs text-[#4F5E57]">
                Commercial accounts receive assigned rate sheets and dual weighment tickets.
              </p>
              <Link
                href="/request-pricing"
                className="bg-[#0F2E23] hover:bg-[#184636] text-white font-bold text-xs px-6 py-3 rounded-xl transition-colors shadow whitespace-nowrap"
              >
                Configure Your Kitchen Account
              </Link>
            </div>
          </div>

        </div>
      </section>

      {/* SECTION 4 — HOW FARMREEM WORKS */}
      <section id="how-it-works" className="py-20 bg-white border-y border-[#E8E1D3]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-xs font-extrabold uppercase tracking-wider text-[#C59B27]">
              End-to-End Fulfillment
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0F2E23]">
              How FarmReem Works
            </h2>
            <p className="text-sm text-[#4F5E57]">
              Four simple steps from kitchen requirement to receiving dock weighment.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { num: "01", title: "Requirement", desc: "Submit your requested bird count, preferred weight spec, and delivery date." },
              { num: "02", title: "Sourcing", desc: "Order allocated against partner farms or procurement lots." },
              { num: "03", name: "Weight Verification", desc: "Dispatch weighment recorded with bird count and live weight slip." },
              { num: "04", title: "Scheduled Delivery", desc: "Receiving weighment verified at hotel dock, issuing reconciled final invoice." },
            ].map((st, i) => (
              <div key={i} className="bg-[#FAF7F2] p-6 rounded-2xl border border-[#E8E1D3] space-y-3">
                <span className="text-3xl font-extrabold text-[#C59B27]">{st.num}</span>
                <h3 className="font-extrabold text-lg text-[#0F2E23]">{st.title || st.name}</h3>
                <p className="text-xs text-[#4F5E57] leading-relaxed">{st.desc}</p>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* SECTION 5 — SUPPLY NETWORK */}
      <section className="py-20 bg-[#FAF7F2]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-xs font-extrabold uppercase tracking-wider text-[#C59B27]">
              Multi-Layer Sourcing Architecture
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0F2E23]">
              Hybrid Supply Network
            </h2>
            <p className="text-sm text-[#4F5E57]">
              FarmReem combines developing owned capacity with commercial partner farms and wholesale procurement networks.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-[#E8E1D3] space-y-3">
              <span className="text-[10px] font-extrabold text-[#C59B27] uppercase tracking-wider block">
                Under Active Development
              </span>
              <h3 className="font-bold text-lg text-[#0F2E23]">Building FarmReem Farms</h3>
              <p className="text-xs text-[#4F5E57] leading-relaxed">
                Developing owned biosecure poultry farming capacity to complement sourcing and set direct standards.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-[#E8E1D3] space-y-3">
              <span className="text-[10px] font-extrabold text-[#0F2E23] uppercase tracking-wider block">
                Active Sourcing Core
              </span>
              <h3 className="font-bold text-lg text-[#0F2E23]">Partner Poultry Farms</h3>
              <p className="text-xs text-[#4F5E57] leading-relaxed">
                Contracted commercial poultry farms audited for biosecurity measures, flock health, and weight sorting.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-[#E8E1D3] space-y-3">
              <span className="text-[10px] font-extrabold text-slate-600 uppercase tracking-wider block">
                Volume Buffer
              </span>
              <h3 className="font-bold text-lg text-[#0F2E23]">Wholesale Procurement</h3>
              <p className="text-xs text-[#4F5E57] leading-relaxed">
                Wholesale mandi procurement providing immediate volume buffering during peak demand dates.
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* SECTION 6 — REPEAT PROCUREMENT */}
      <section className="py-20 bg-[#0A2118] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-xs font-extrabold uppercase tracking-wider text-[#C59B27]">
              Platform Ordering Mindset
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
              Order once. Repeat in seconds.
            </h2>
            <p className="text-sm text-[#FAF7F2]/80">
              Built so purchase managers and executive chefs can manage kitchen procurement effortlessly.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-[#0F2E23] p-6 rounded-2xl border border-[#184636] space-y-3">
              <RotateCcw className="w-6 h-6 text-[#C59B27]" />
              <h3 className="font-bold text-base text-white">Repeat Previous Order</h3>
              <p className="text-xs text-[#FAF7F2]/70 leading-relaxed">
                Reorder your usual bird count and weight spec with a single click from desktop or mobile.
              </p>
            </div>

            <div className="bg-[#0F2E23] p-6 rounded-2xl border border-[#184636] space-y-3">
              <Calendar className="w-6 h-6 text-[#C59B27]" />
              <h3 className="font-bold text-base text-white">Standing Weekly Schedule</h3>
              <p className="text-xs text-[#FAF7F2]/70 leading-relaxed">
                Set recurring daily bird allocations (e.g. Mon 80 birds, Tue 60 birds) with pause and modify controls.
              </p>
            </div>

            <div className="bg-[#0F2E23] p-6 rounded-2xl border border-[#184636] space-y-3">
              <Building2 className="w-6 h-6 text-[#C59B27]" />
              <h3 className="font-bold text-base text-white">Customer-Specific Pricing</h3>
              <p className="text-xs text-[#FAF7F2]/70 leading-relaxed">
                Authenticated buyers view designated contract rates and net statements directly inside the portal.
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* SECTION 7 — FINAL CTA */}
      <section className="py-20 bg-[#0F2E23] text-white text-center">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            Ready to simplify poultry procurement?
          </h2>
          <p className="text-base text-[#FAF7F2]/80 max-w-xl mx-auto">
            Contact FarmReem in Dehradun at +91 8475863634 to set up live broiler supply for your commercial kitchen.
          </p>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/request-pricing"
              className="w-full sm:w-auto bg-[#C59B27] hover:bg-[#b0881f] text-[#0F2E23] font-extrabold text-base px-9 py-4 rounded-xl shadow-xl transition-all"
            >
              Request B2B Pricing
            </Link>
            
            <a
              href="tel:+918475863634"
              className="w-full sm:w-auto bg-[#184636] hover:bg-[#205945] text-white font-semibold text-base px-8 py-4 rounded-xl border border-[#25634e] transition-colors flex items-center justify-center gap-2"
            >
              <Phone className="w-4 h-4 text-[#C59B27]" /> Call +91 8475863634
            </a>

            <a
              href="https://wa.me/918475863634"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto bg-emerald-800 hover:bg-emerald-700 text-white font-semibold text-base px-7 py-4 rounded-xl border border-emerald-700 transition-colors flex items-center justify-center gap-2"
            >
              <MessageSquare className="w-4 h-4 text-emerald-300" /> WhatsApp
            </a>
          </div>
        </div>
      </section>

    </div>
  );
}
