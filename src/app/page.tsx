import Image from "next/image";
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
  RotateCcw,
  Calendar,
  ChevronRight,
  MapPin,
  CheckCircle2,
  UserPlus,
} from "lucide-react";
import ImageCarousel from "@/components/ui/ImageCarousel";

export default function HomePage() {
  const heroSlides = [
    {
      src: "/images/hero_chef_kitchen.jpg",
      alt: "Executive Hotel Kitchen Chef",
    },
    {
      src: "/images/hero_foodservice.jpg",
      alt: "Commercial Kitchen Foodservice Preparation",
    },
    {
      src: "/images/quality_inspect.jpg",
      alt: "Hotel Foodservice Receiving Dock Verification",
    },
    {
      src: "/images/farm_facility.jpg",
      alt: "Professional Hospitality Sourcing Environment",
    },
  ];

  const sourcingSlides = [
    {
      src: "/images/farm_sunrise.jpg",
      alt: "Partner Poultry Farm Sourcing",
      captionTitle: "01 · Regional Farm Sourcing",
      captionSub: "Vetted poultry farms with monitored flock condition.",
    },
    {
      src: "/images/quality_inspect.jpg",
      alt: "Bird Inspection & Calibrated Weighment",
      captionTitle: "02 · Calibrated Weighment",
      captionSub: "Dual weighment tickets recorded at dispatch.",
    },
    {
      src: "/images/farm_facility.jpg",
      alt: "FarmReem Bio-Secure Facility Infrastructure",
      captionTitle: "03 · Controlled Infrastructure",
      captionSub: "Biosecure handling and specialized crate transport.",
    },
    {
      src: "/images/delivery_fleet.jpg",
      alt: "Scheduled B2B Delivery Logistics",
      captionTitle: "04 · Direct Route Logistics",
      captionSub: "Scheduled morning dispatch straight to hotel receiving docks.",
    },
    {
      src: "/images/hero_chef_kitchen.jpg",
      alt: "Commercial Kitchen Receiving",
      captionTitle: "05 · Kitchen Receiving",
      captionSub: "Receiving dock verification and account reconciliation.",
    },
  ];

  const kitchenSlides = [
    {
      src: "/images/hero_foodservice.jpg",
      alt: "Commercial Kitchen Foodservice Preparation",
    },
    {
      src: "/images/hero_chef_kitchen.jpg",
      alt: "Executive Kitchen Chef Receiving",
    },
    {
      src: "/images/quality_inspect.jpg",
      alt: "Receiving Dock Verification",
    },
    {
      src: "/images/farm_facility.jpg",
      alt: "Hospitality Foodservice Operation",
    },
  ];

  return (
    <div className="bg-[#FAF7F2] text-[#111A17] space-y-0 selection:bg-[#C59B27] selection:text-[#0F2E23]">
      
      {/* -------------------------------------------------------------
          SECTION 1 — HERO: BRAND FIRST (Light Editorial Canvas)
         ------------------------------------------------------------- */}
      <section className="relative bg-[#FAF7F2] text-[#0F2E23] pt-10 pb-20 lg:pt-16 lg:pb-28 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Hero Left Content */}
            <div className="lg:col-span-6 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-[#E8E1D3] text-[#0F2E23] text-xs font-bold uppercase tracking-wider shadow-sm">
                <MapPin className="w-3.5 h-3.5 text-[#C59B27]" />
                <span>Foodservice Supply · India</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-[#0F2E23] leading-[1.08]">
                Poultry supply, <br />
                <span className="text-[#C59B27] underline decoration-[#C59B27]/30 underline-offset-8">
                  built around your kitchen.
                </span>
              </h1>

              <p className="text-base sm:text-lg text-[#4F5E57] font-normal leading-relaxed max-w-lg mx-auto lg:mx-0">
                Reliable live broiler sourcing and scheduled B2B delivery for hotels, restaurants, caterers and institutions.
              </p>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 pt-2">
                <Link
                  href="/request-pricing"
                  className="w-full sm:w-auto bg-[#0F2E23] hover:bg-[#184636] text-[#FAF7F2] font-extrabold text-base px-7 py-4 rounded-xl shadow-xl transition-all flex items-center justify-center gap-2 group cursor-pointer"
                >
                  Request B2B Pricing
                  <ArrowRight className="w-5 h-5 text-[#C59B27] group-hover:translate-x-1 transition-transform" />
                </Link>

                <Link
                  href="/login"
                  className="w-full sm:w-auto bg-white hover:bg-[#FAF7F2] text-[#0F2E23] font-bold text-base px-6 py-4 rounded-xl border border-[#E8E1D3] transition-colors flex items-center justify-center gap-2 shadow-sm cursor-pointer"
                >
                  <Lock className="w-4 h-4 text-[#C59B27]" />
                  B2B Login
                </Link>
              </div>
            </div>

            {/* Hero Right Visual: Rotating Photography + Fixed Mini B2B Ordering Card */}
            <div className="lg:col-span-6 relative">
              <ImageCarousel
                slides={heroSlides}
                aspectRatio="h-[460px]"
                autoPlayInterval={4500}
                dotsPosition="top-4"
                overlayChildren={
                  <div className="p-6">
                    {/* Integrated Small B2B Order Interface Card */}
                    <div className="bg-white/95 backdrop-blur-md rounded-2xl p-5 border border-[#E8E1D3] shadow-2xl text-[#0F2E23] space-y-3">
                      <div className="flex items-center justify-between border-b border-[#E8E1D3] pb-2.5">
                        <div className="flex items-center gap-2">
                          <div className="w-2.5 h-2.5 rounded-full bg-emerald-600 animate-pulse" />
                          <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#0F2E23]">
                            Live Broiler Supply
                          </span>
                        </div>
                        <span className="text-[10px] font-bold bg-[#FAF7F2] text-[#0F2E23] px-2 py-0.5 rounded border border-[#E8E1D3]">
                          Scheduled Morning Route
                        </span>
                      </div>

                      <div className="grid grid-cols-4 gap-2 text-center text-xs">
                        <div className="bg-[#FAF7F2] p-2 rounded-lg border border-[#E8E1D3]">
                          <span className="text-[9px] text-[#4F5E57] uppercase block">Birds</span>
                          <span className="font-extrabold text-[#0F2E23]">120</span>
                        </div>
                        <div className="bg-[#FAF7F2] p-2 rounded-lg border border-[#E8E1D3]">
                          <span className="text-[9px] text-[#4F5E57] uppercase block">Weight Spec</span>
                          <span className="font-extrabold text-[#0F2E23]">1.8–2.0 kg</span>
                        </div>
                        <div className="bg-[#FAF7F2] p-2 rounded-lg border border-[#E8E1D3]">
                          <span className="text-[9px] text-[#4F5E57] uppercase block">Schedule</span>
                          <span className="font-extrabold text-[#0F2E23]">Tomorrow</span>
                        </div>
                        <div className="bg-[#FAF7F2] p-2 rounded-lg border border-[#E8E1D3]">
                          <span className="text-[9px] text-[#4F5E57] uppercase block">Window</span>
                          <span className="font-extrabold text-[#0F2E23]">6–8 AM</span>
                        </div>
                      </div>

                      <div className="pt-1 flex items-center justify-between text-xs">
                        <span className="text-[11px] text-[#4F5E57] font-semibold">
                          Account #FR-8842 · Grand Heritage Hotel
                        </span>
                        <Link
                          href="/request-pricing"
                          className="font-extrabold text-[#C59B27] hover:underline text-[11px]"
                        >
                          Request / Confirm Supply &rarr;
                        </Link>
                      </div>
                    </div>
                  </div>
                }
              />
            </div>

          </div>
        </div>
      </section>

      {/* -------------------------------------------------------------
          SECTION 2 — ONE VISUAL BRAND STORY (Automatic Carousel Sequence)
         ------------------------------------------------------------- */}
      <section className="py-20 bg-white border-y border-[#E8E1D3]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-xs font-extrabold uppercase tracking-wider text-[#C59B27]">
              The Sourcing Protocol
            </span>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-[#0F2E23] tracking-tight">
              From requirement to kitchen.
            </h2>
            <p className="text-base text-[#4F5E57]">
              A continuous, verified supply journey connecting regional farm production to executive receiving docks.
            </p>
          </div>

          {/* Automatic Image Carousel */}
          <div className="space-y-6">
            <ImageCarousel
              slides={sourcingSlides}
              aspectRatio="h-[420px] sm:h-[480px] lg:h-[520px]"
            />

            {/* Directional Step Indicator Bar */}
            <div className="bg-[#FAF7F2] rounded-2xl p-4 border border-[#E8E1D3] shadow-sm">
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-xs font-bold text-[#0F2E23]">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-[#C59B27] text-[#0F2E23] flex items-center justify-center text-xs font-extrabold">1</span>
                  <span>Requirement</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-[#0F2E23] text-white flex items-center justify-center text-xs font-extrabold">2</span>
                  <span>Sourcing</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-[#0F2E23] text-white flex items-center justify-center text-xs font-extrabold">3</span>
                  <span>Weight Check</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-[#0F2E23] text-white flex items-center justify-center text-xs font-extrabold">4</span>
                  <span>Delivery</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-[#0F2E23] text-white flex items-center justify-center text-xs font-extrabold">5</span>
                  <span>Your Kitchen</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* -------------------------------------------------------------
          SECTION 3 — SUPPLY BUILT AROUND THE BUYER (Clean Visual + Editorial Copy Below)
         ------------------------------------------------------------- */}
      <section className="py-20 bg-[#FAF7F2]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left: Clean Kitchen Visual Carousel + Editorial Block Below (NO Text Overlay) */}
            <div className="lg:col-span-6 space-y-4">
              <ImageCarousel
                slides={kitchenSlides}
                aspectRatio="h-[380px] sm:h-[420px]"
              />

              {/* Text Placement Directly BELOW Photograph */}
              <div className="p-5 rounded-2xl bg-white border border-[#E8E1D3] shadow-sm space-y-1">
                <span className="text-xs font-extrabold uppercase tracking-wider text-[#C59B27]">
                  Receiving Dock Reliability
                </span>
                <h3 className="text-xl font-extrabold text-[#0F2E23]">
                  Specified bird counts & portions
                </h3>
                <p className="text-xs sm:text-sm text-[#4F5E57] leading-relaxed">
                  Scheduled morning delivery tailored to your kitchen's daily operational prep.
                </p>
              </div>
            </div>

            {/* Right: Tactile Specification Controls */}
            <div className="lg:col-span-6 space-y-8">
              <div className="space-y-3">
                <span className="text-xs font-extrabold uppercase tracking-wider text-[#C59B27]">
                  Commercial Account Configuration
                </span>
                <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0F2E23] tracking-tight">
                  Tell us what you need.
                </h2>
                <p className="text-sm text-[#4F5E57] leading-relaxed">
                  Every hospitality menu relies on consistent portioning and predictable receiving schedules. Configure your kitchen account settings:
                </p>
              </div>

              <div className="space-y-6 pt-2">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-2xl bg-[#0F2E23] text-[#C59B27] flex items-center justify-center font-extrabold text-sm flex-shrink-0">
                    01
                  </div>
                  <div>
                    <h3 className="font-extrabold text-lg text-[#0F2E23]">Bird Quantity & Frequency</h3>
                    <p className="text-xs text-[#4F5E57] mt-0.5">Specify daily or event bird counts matched to your prep timelines.</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-2xl bg-[#0F2E23] text-[#C59B27] flex items-center justify-center font-extrabold text-sm flex-shrink-0">
                    02
                  </div>
                  <div>
                    <h3 className="font-extrabold text-lg text-[#0F2E23]">Preferred Weight Range</h3>
                    <p className="text-xs text-[#4F5E57] mt-0.5">Request uniform weight bands (e.g. 1.8–2.0 kg) based on availability.</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-2xl bg-[#0F2E23] text-[#C59B27] flex items-center justify-center font-extrabold text-sm flex-shrink-0">
                    03
                  </div>
                  <div>
                    <h3 className="font-extrabold text-lg text-[#0F2E23]">Scheduled Delivery Slot</h3>
                    <p className="text-xs text-[#4F5E57] mt-0.5">Planned morning receiving dock windows before kitchen prep shifts begin.</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-2xl bg-[#0F2E23] text-[#C59B27] flex items-center justify-center font-extrabold text-sm flex-shrink-0">
                    04
                  </div>
                  <div>
                    <h3 className="font-extrabold text-lg text-[#0F2E23]">Standing Repeat Schedule</h3>
                    <p className="text-xs text-[#4F5E57] mt-0.5">Automated standing weekly supply with single-click pause and modify options.</p>
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <Link
                  href="/request-pricing"
                  className="inline-flex items-center gap-2 bg-[#0F2E23] hover:bg-[#184636] text-white font-extrabold text-xs px-7 py-3.5 rounded-xl transition-all shadow-md"
                >
                  Configure Account Pricing &rarr;
                </Link>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* -------------------------------------------------------------
          SECTION 4 — FARMREEM SUPPLY NETWORK (Deep Forest Green Brand Moment)
         ------------------------------------------------------------- */}
      <section className="py-20 bg-[#0F2E23] text-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 relative z-10">
          
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-[#C59B27]">
              Continuous Supply Reliability
            </span>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
              A stronger supply network.
            </h2>
            <p className="text-base text-[#FAF7F2]/80">
              FarmReem connects developing owned production capacity with vetted partner farms and wholesale sourcing networks.
            </p>
          </div>

          {/* Animated Supply Flow Diagram */}
          <div className="bg-[#0A2118] rounded-3xl p-8 sm:p-12 border border-[#184636] shadow-2xl space-y-10">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
              
              <div className="p-6 rounded-2xl bg-[#0F2E23] border border-[#25634e] space-y-2">
                <span className="text-[10px] font-bold text-[#C59B27] uppercase tracking-wider block">
                  Under Active Development
                </span>
                <h3 className="font-extrabold text-lg text-white">Building FarmReem Farms</h3>
                <p className="text-xs text-[#FAF7F2]/70">Owned bio-secure broiler production facilities</p>
              </div>

              <div className="p-6 rounded-2xl bg-[#0F2E23] border border-[#25634e] space-y-2">
                <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider block">
                  Core Volume Partner
                </span>
                <h3 className="font-extrabold text-lg text-white">Partner Poultry Farms</h3>
                <p className="text-xs text-[#FAF7F2]/70">Audited commercial poultry growers & weight sorting</p>
              </div>

              <div className="p-6 rounded-2xl bg-[#0F2E23] border border-[#25634e] space-y-2">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Volume Buffer
                </span>
                <h3 className="font-extrabold text-lg text-white">Wholesale Sourcing</h3>
                <p className="text-xs text-[#FAF7F2]/70">Wholesale mandi procurement for demand surges</p>
              </div>

            </div>

            {/* Central Convergence Node */}
            <div className="flex flex-col items-center justify-center gap-3 pt-2 border-t border-[#184636]">
              <div className="inline-flex items-center gap-3 bg-[#C59B27] text-[#0F2E23] font-extrabold text-sm px-8 py-3.5 rounded-full shadow-xl">
                <span>FARMREEM SOURCING & LOGISTICS</span>
              </div>
              <p className="text-xs text-[#FAF7F2]/70 font-semibold pt-2">
                Delivering to Hotels · Restaurants · Caterers · Institutions
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* -------------------------------------------------------------
          SECTION 5 — B2B EXPERIENCE + FINAL CTA (Light Premium Canvas)
         ------------------------------------------------------------- */}
      <section className="py-20 bg-[#FFFDF9] border-t border-[#E8E1D3]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-xs font-extrabold uppercase tracking-wider text-[#C59B27]">
              Digital Procurement Experience
            </span>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-[#0F2E23] tracking-tight">
              Ordering should be the easy part.
            </h2>
            <p className="text-base text-[#4F5E57]">
              Repeat previous orders in seconds, manage standing weekly allocations, and track customer contract pricing from any device.
            </p>
          </div>

          {/* ONE Polished Interface Composition */}
          <div className="bg-white rounded-3xl border border-[#E8E1D3] p-8 sm:p-12 shadow-xl space-y-8 max-w-4xl mx-auto">
            <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-[#E8E1D3]">
              <div>
                <span className="text-xs font-bold text-[#C59B27] uppercase tracking-wider">Customer Portal Experience</span>
                <h3 className="text-xl font-extrabold text-[#0F2E23]">Grand Heritage Hotel (Account FR-8842)</h3>
              </div>
              <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-extrabold">
                Approved Commercial Account
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-xl bg-[#FAF7F2] border border-[#E8E1D3] space-y-1">
                <span className="text-[#4F5E57] block font-semibold">Repeat Previous Order</span>
                <p className="font-extrabold text-sm text-[#0F2E23]">120 Live Birds @ 1.8–2.0 kg Spec</p>
                <span className="text-[10px] text-emerald-700 font-bold block pt-1">1-Click Reorder Ready</span>
              </div>

              <div className="p-4 rounded-xl bg-[#FAF7F2] border border-[#E8E1D3] space-y-1">
                <span className="text-[#4F5E57] block font-semibold">Weekly Supply Schedule</span>
                <p className="font-extrabold text-sm text-[#0F2E23]">Mon–Sat Standing Allocation</p>
                <span className="text-[10px] text-[#C59B27] font-bold block pt-1">Active Morning Slot</span>
              </div>

              <div className="p-4 rounded-xl bg-[#FAF7F2] border border-[#E8E1D3] space-y-1">
                <span className="text-[#4F5E57] block font-semibold">Contract Account Rate</span>
                <p className="font-extrabold text-sm text-[#0F2E23]">₹ [Assigned Rate / KG]</p>
                <span className="text-[10px] text-[#4F5E57] block pt-1">Dual Weighment Ticket Reconciled</span>
              </div>

              <div className="p-4 rounded-xl bg-[#FAF7F2] border border-[#E8E1D3] space-y-1">
                <span className="text-[#4F5E57] block font-semibold">Recent Order Status</span>
                <p className="font-extrabold text-sm text-emerald-800">Delivered & Verified</p>
                <span className="text-[10px] text-[#4F5E57] block pt-1">Dispatch Slip Recorded</span>
              </div>
            </div>
          </div>

          {/* FINAL CTA BLOCK */}
          <div className="bg-[#0F2E23] text-white rounded-3xl p-10 sm:p-14 text-center space-y-6 shadow-2xl">
            <h3 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
              Ready to simplify poultry procurement?
            </h3>
            <p className="text-base text-[#FAF7F2]/80 max-w-xl mx-auto">
              Contact FarmReem in Dehradun at +91 8475863634 to configure your commercial kitchen supply account.
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

        </div>
      </section>

    </div>
  );
}
