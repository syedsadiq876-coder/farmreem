import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Lock,
  Phone,
  MessageSquare,
  MapPin,
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
      alt: "Foodservice Quality Inspection",
    },
    {
      src: "/images/farm_facility.jpg",
      alt: "Professional Hospitality Sourcing Environment",
    },
  ];

  const sourcingSlides = [
    {
      src: "/images/farm_sunrise.jpg",
      alt: "Tell us what you need",
      captionTitle: "01 · Tell us what you need",
      captionSub: "Bird count, preferred weight and delivery requirement.",
    },
    {
      src: "/images/quality_inspect.jpg",
      alt: "We source your supply",
      captionTitle: "02 · We source your supply",
      captionSub: "We coordinate supply through our sourcing network based on your requirement and availability.",
    },
    {
      src: "/images/farm_facility.jpg",
      alt: "Weight check",
      captionTitle: "03 · Weight check",
      captionSub: "Birds are checked against the requested weight range before dispatch.",
    },
    {
      src: "/images/delivery_fleet.jpg",
      alt: "Planned delivery",
      captionTitle: "04 · Planned delivery",
      captionSub: "Supply is scheduled around the agreed route and delivery window.",
    },
    {
      src: "/images/hero_chef_kitchen.jpg",
      alt: "Ready for your kitchen",
      captionTitle: "05 · Ready for your kitchen",
      captionSub: "Your team receives the quantity and specification agreed for the order.",
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
      alt: "Kitchen Quality Inspection",
    },
    {
      src: "/images/farm_facility.jpg",
      alt: "Hospitality Foodservice Operation",
    },
  ];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": "FarmReem",
    "url": "https://www.farmreem.com",
    "logo": "https://www.farmreem.com/images/farmreem-logo.png",
    "image": "https://www.farmreem.com/images/hero_foodservice.jpg",
    "description": "B2B live broiler sourcing and scheduled poultry supply for hotels, restaurants, caterers and institutional kitchens based in Dehradun, Uttarakhand.",
    "telephone": "+918475863634",
    "email": "contact@farmreem.com",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "39, Siddharth Vihar, Kandoli, Sahastradhara Road",
      "addressLocality": "Dehradun",
      "addressRegion": "Uttarakhand",
      "postalCode": "248001",
      "addressCountry": "IN"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": 30.3165,
      "longitude": 78.0322
    },
    "priceRange": "$$"
  };

  return (
    <div className="bg-[#FAF7F2] text-[#111A17] space-y-0 selection:bg-[#C59B27] selection:text-[#0F2E23]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      
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
                <span>B2B POULTRY SUPPLY</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-[#0F2E23] leading-[1.08]">
                Poultry supply, <br />
                <span className="text-[#C59B27] underline decoration-[#C59B27]/30 underline-offset-8">
                  built around your kitchen.
                </span>
              </h1>

              <p className="text-base sm:text-lg text-[#4F5E57] font-normal leading-relaxed max-w-lg mx-auto lg:mx-0">
                The birds you need, in the weight you prefer, delivered around your kitchen schedule. FarmReem makes poultry sourcing simpler for hotels, restaurants, caterers and institutional kitchens.
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

                <a
                  href="tel:+918475863634"
                  className="w-full sm:w-auto bg-white hover:bg-[#FAF7F2] text-[#0F2E23] font-bold text-base px-6 py-4 rounded-xl border border-[#E8E1D3] transition-colors flex items-center justify-center gap-2 shadow-sm cursor-pointer"
                >
                  <Phone className="w-4 h-4 text-[#C59B27]" />
                  Talk to FarmReem
                </a>
              </div>
            </div>

            {/* Hero Right Visual: Rotating Photography + Fixed Mini B2B Ordering Card */}
            <div className="lg:col-span-6 relative">
              <ImageCarousel
                slides={heroSlides}
                aspectRatio="h-[460px]"
                autoPlayInterval={2000}
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
                          <span className="font-extrabold text-[#0F2E23]">Scheduled</span>
                        </div>
                        <div className="bg-[#FAF7F2] p-2 rounded-lg border border-[#E8E1D3]">
                          <span className="text-[9px] text-[#4F5E57] uppercase block">Window</span>
                          <span className="font-extrabold text-[#0F2E23]">6–8 AM</span>
                        </div>
                      </div>

                      <div className="pt-1 flex items-center justify-between text-xs">
                        <span className="text-[10px] text-[#4F5E57] font-semibold flex items-center gap-1">
                          <span>Sample B2B Account</span>
                          <span className="text-[9px] text-[#C59B27] bg-[#FAF7F2] px-1.5 py-0.5 rounded border border-[#E8E1D3]">Interface preview · demonstration data</span>
                        </span>
                        <Link
                          href="/request-pricing"
                          className="font-extrabold text-[#C59B27] hover:underline text-[11px]"
                        >
                          Request B2B Pricing &rarr;
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
          SECTION 2 — HOW FARMREEM WORKS (Automatic Carousel Sequence)
         ------------------------------------------------------------- */}
      <section className="py-20 bg-white border-y border-[#E8E1D3]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-xs font-extrabold uppercase tracking-wider text-[#C59B27]">
              HOW FARMREEM WORKS
            </span>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-[#0F2E23] tracking-tight">
              You tell us what your kitchen needs. <br className="hidden sm:inline" />
              We take care of the supply.
            </h2>
            <p className="text-base text-[#4F5E57]">
              Every kitchen works differently. Tell us your quantity, preferred bird weight and delivery requirement. We source accordingly and plan the supply around your operation.
            </p>
          </div>

          {/* Automatic Image Carousel */}
          <div className="space-y-6">
            <ImageCarousel
              slides={sourcingSlides}
              aspectRatio="h-[420px] sm:h-[480px] lg:h-[520px]"
              autoPlayInterval={2000}
            />

            {/* Directional Step Indicator Bar */}
            <div className="bg-[#FAF7F2] rounded-2xl p-4 border border-[#E8E1D3] shadow-sm">
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-xs font-bold text-[#0F2E23]">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-[#C59B27] text-[#0F2E23] flex items-center justify-center text-xs font-extrabold">1</span>
                  <span>Your Requirement</span>
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
          SECTION 3 — PROFESSIONAL KITCHEN / RECEIVING VISUAL
         ------------------------------------------------------------- */}
      <section className="py-20 bg-[#FAF7F2]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left: Clean Kitchen Visual Carousel + Editorial Block Below */}
            <div className="lg:col-span-6 space-y-4">
              <ImageCarousel
                slides={kitchenSlides}
                aspectRatio="h-[380px] sm:h-[420px]"
                autoPlayInterval={2000}
              />

              {/* Text Placement Directly BELOW Photograph */}
              <div className="p-6 rounded-2xl bg-white border border-[#E8E1D3] shadow-sm space-y-2">
                <span className="text-xs font-extrabold uppercase tracking-wider text-[#C59B27]">
                  BUILT FOR PROFESSIONAL KITCHENS
                </span>
                <h2 className="text-2xl font-extrabold text-[#0F2E23]">
                  The right supply makes the whole kitchen run better.
                </h2>
                <p className="text-sm text-[#4F5E57] leading-relaxed">
                  From everyday service to busy weekends and large events, FarmReem helps you plan poultry supply around the way your kitchen actually works.
                </p>
              </div>
            </div>

            {/* Right: CUSTOMER REQUIREMENT POINTS */}
            <div className="lg:col-span-6 space-y-8">
              <div className="space-y-3">
                <span className="text-xs font-extrabold uppercase tracking-wider text-[#C59B27]">
                  SUPPLY THAT FITS YOUR BUSINESS
                </span>
                <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0F2E23] tracking-tight">
                  Your kitchen. <br />
                  Your requirement.
                </h2>
              </div>

              <div className="space-y-6 pt-2">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-2xl bg-[#0F2E23] text-[#C59B27] flex items-center justify-center font-extrabold text-sm flex-shrink-0">
                    01
                  </div>
                  <div>
                    <h3 className="font-extrabold text-lg text-[#0F2E23]">Quantity that works for you</h3>
                    <p className="text-xs sm:text-sm text-[#4F5E57] mt-0.5">From regular daily requirements to larger event and banquet demand.</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-2xl bg-[#0F2E23] text-[#C59B27] flex items-center justify-center font-extrabold text-sm flex-shrink-0">
                    02
                  </div>
                  <div>
                    <h3 className="font-extrabold text-lg text-[#0F2E23]">The weight you prefer</h3>
                    <p className="text-xs sm:text-sm text-[#4F5E57] mt-0.5">Tell us the bird-weight range that works best for your portions and menu.</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-2xl bg-[#0F2E23] text-[#C59B27] flex items-center justify-center font-extrabold text-sm flex-shrink-0">
                    03
                  </div>
                  <div>
                    <h3 className="font-extrabold text-lg text-[#0F2E23]">Delivery that fits your day</h3>
                    <p className="text-xs sm:text-sm text-[#4F5E57] mt-0.5">Plan supply around your receiving and preparation schedule.</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-2xl bg-[#0F2E23] text-[#C59B27] flex items-center justify-center font-extrabold text-sm flex-shrink-0">
                    04
                  </div>
                  <div>
                    <h3 className="font-extrabold text-lg text-[#0F2E23]">Repeat supply made simpler</h3>
                    <p className="text-xs sm:text-sm text-[#4F5E57] mt-0.5">For recurring requirements, we can plan supply around your regular buying pattern.</p>
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <Link
                  href="/request-pricing"
                  className="inline-flex items-center gap-2 bg-[#0F2E23] hover:bg-[#184636] text-white font-extrabold text-xs px-7 py-3.5 rounded-xl transition-all shadow-md group"
                >
                  Tell Us Your Requirement
                  <ArrowRight className="w-4 h-4 text-[#C59B27] group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* -------------------------------------------------------------
          SECTION 5 — SUPPLY NETWORK (Deep Forest Green Brand Moment)
         ------------------------------------------------------------- */}
      <section className="py-20 bg-[#0F2E23] text-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 relative z-10">
          
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-[#C59B27]">
              A NETWORK BUILT FOR CONSISTENCY
            </span>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
              More than one source. <br />
              One FarmReem relationship.
            </h2>
            <p className="text-base text-[#FAF7F2]/80">
              Demand changes. Availability changes. Your kitchen still needs to keep moving. FarmReem is building a flexible supply network that combines wholesale sourcing, selected farm partners and, over time, our own production.
            </p>
          </div>

          {/* Animated Supply Flow Diagram */}
          <div className="bg-[#0A2118] rounded-3xl p-8 sm:p-12 border border-[#184636] shadow-2xl space-y-10">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
              
              <div className="p-6 rounded-2xl bg-[#0F2E23] border border-[#25634e] space-y-2">
                <span className="text-[10px] font-bold text-slate-300 uppercase tracking-wider block">
                  Active Sourcing
                </span>
                <h3 className="font-extrabold text-lg text-white">WHOLESALE SOURCING</h3>
                <p className="text-xs text-[#FAF7F2]/70">Supporting today's supply requirements.</p>
              </div>

              <div className="p-6 rounded-2xl bg-[#0F2E23] border border-[#25634e] space-y-2">
                <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider block">
                  Developing Network
                </span>
                <h3 className="font-extrabold text-lg text-white">PARTNER FARM NETWORK</h3>
                <p className="text-xs text-[#FAF7F2]/70">Building direct relationships with poultry producers.</p>
              </div>

              <div className="p-6 rounded-2xl bg-[#0F2E23] border border-[#25634e] space-y-2">
                <span className="text-[10px] font-bold text-[#C59B27] uppercase tracking-wider block">
                  Under Development
                </span>
                <h3 className="font-extrabold text-lg text-white">FARMREEM FARMS</h3>
                <p className="text-xs text-[#FAF7F2]/70">Our own production capacity is under development.</p>
              </div>

            </div>

            {/* Central Convergence Node */}
            <div className="flex flex-col items-center justify-center gap-3 pt-2 border-t border-[#184636]">
              <div className="inline-flex items-center gap-3 bg-[#C59B27] text-[#0F2E23] font-extrabold text-sm px-8 py-3.5 rounded-full shadow-xl">
                <span>FARMREEM SOURCING & LOGISTICS</span>
              </div>
              <p className="text-xs text-[#FAF7F2]/70 font-semibold pt-2">
                Hotels · Restaurants · Caterers · Institutions
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* -------------------------------------------------------------
          SECTION 6 — B2B EXPERIENCE (Light Premium Canvas)
         ------------------------------------------------------------- */}
      <section className="py-20 bg-[#FFFDF9] border-t border-[#E8E1D3]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-xs font-extrabold uppercase tracking-wider text-[#C59B27]">
              FARMREEM B2B PORTAL — PREVIEW
            </span>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-[#0F2E23] tracking-tight">
              Ordering should be the easy part.
            </h2>
            <p className="text-base text-[#4F5E57]">
              As FarmReem grows, we're building a simpler way for B2B customers to manage repeat requirements, preferred specifications, delivery schedules and account pricing—all in one place.
            </p>
          </div>

          {/* ONE Polished Interface Composition */}
          <div className="bg-white rounded-3xl border border-[#E8E1D3] p-8 sm:p-12 shadow-xl space-y-8 max-w-4xl mx-auto">
            <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-[#E8E1D3]">
              <div>
                <span className="text-xs font-bold text-[#C59B27] uppercase tracking-wider">FarmReem B2B Portal — Preview</span>
                <h3 className="text-xl font-extrabold text-[#0F2E23]">Sample B2B Account</h3>
                <p className="text-[11px] text-[#4F5E57] font-medium mt-0.5">Demonstration interface · customer portal in development</p>
              </div>
              <span className="px-3 py-1 rounded-full bg-[#FAF7F2] text-[#0F2E23] border border-[#E8E1D3] text-xs font-extrabold">
                Demo B2B Account
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
                <p className="font-extrabold text-sm text-[#0F2E23]">Assigned Account Pricing</p>
                <span className="text-[10px] text-[#4F5E57] block pt-1">Dual Weighment Ticket Basis</span>
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
            <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
              Tell us what your kitchen needs.
            </h2>
            <p className="text-base text-[#FAF7F2]/80 max-w-xl mx-auto">
              Whether it's a regular daily requirement, a busy weekend or an upcoming event, talk to FarmReem about your poultry supply.
            </p>

            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/request-pricing"
                className="w-full sm:w-auto bg-[#C59B27] hover:bg-[#b0881f] text-[#0F2E23] font-extrabold text-base px-9 py-4 rounded-xl shadow-xl transition-all"
              >
                Request B2B Pricing
              </Link>

              <a
                href="https://wa.me/918475863634"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto bg-emerald-800 hover:bg-emerald-700 text-white font-semibold text-base px-7 py-4 rounded-xl border border-emerald-700 transition-colors flex items-center justify-center gap-2"
              >
                <MessageSquare className="w-4 h-4 text-emerald-300" /> WhatsApp FarmReem
              </a>
            </div>

            <p className="text-xs text-[#FAF7F2]/60 pt-2 font-medium">
              B2B poultry supply · Dehradun, Uttarakhand
            </p>
          </div>

        </div>
      </section>

    </div>
  );
}
