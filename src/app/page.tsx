import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Lock,
  Phone,
  MessageSquare,
  MapPin,
  CheckCircle2,
  Sliders,
  Utensils,
  Store,
  Users,
  Flame,
} from "lucide-react";
import ImageCarousel from "@/components/ui/ImageCarousel";
import RequirementBuilder from "@/components/ui/RequirementBuilder";

export const metadata = {
  title: "B2B Poultry & Chicken Supply for Hotels & Restaurants | FarmReem",
  description:
    "FarmReem provides B2B poultry sourcing for hotels, restaurants, caterers and institutional kitchens, with live broiler supply and expanding poultry product capabilities.",
  alternates: {
    canonical: "https://www.farmreem.com",
  },
  openGraph: {
    title: "B2B Poultry & Chicken Supply for Hotels & Restaurants | FarmReem",
    description:
      "FarmReem provides B2B poultry sourcing for hotels, restaurants, caterers and institutional kitchens, with live broiler supply and expanding poultry product capabilities.",
    url: "https://www.farmreem.com",
  },
};

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
      captionSub: "Live bird, whole chicken, cuts or a specific requirement.",
    },
    {
      src: "/images/quality_inspect.jpg",
      alt: "We source accordingly",
      captionTitle: "02 · We source accordingly",
      captionSub: "Supply is matched to your requested quantity and specification.",
    },
    {
      src: "/images/farm_facility.jpg",
      alt: "Specification check",
      captionTitle: "03 · Specification check",
      captionSub: "Weight, cut or product requirement is checked before dispatch.",
    },
    {
      src: "/images/delivery_fleet.jpg",
      alt: "Planned delivery",
      captionTitle: "04 · Planned delivery",
      captionSub: "Supply is scheduled around the agreed delivery requirement.",
    },
    {
      src: "/images/hero_chef_kitchen.jpg",
      alt: "Ready for your kitchen",
      captionTitle: "05 · Ready for your kitchen",
      captionSub: "Your team receives the agreed poultry specification.",
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
    "description":
      "B2B poultry sourcing and scheduled supply for hotels, restaurants, caterers and institutional kitchens based in Dehradun, Uttarakhand.",
    "telephone": "+918475863634",
    "email": "contact@farmreem.com",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "39, Siddharth Vihar, Kandoli, Sahastradhara Road",
      "addressLocality": "Dehradun",
      "addressRegion": "Uttarakhand",
      "postalCode": "248001",
      "addressCountry": "IN",
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": 30.3165,
      "longitude": 78.0322,
    },
    "priceRange": "$$",
  };

  return (
    <div className="bg-[#FAF7F2] text-[#111A17] space-y-0 selection:bg-[#C59B27] selection:text-[#0F2E23]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* -------------------------------------------------------------
          SECTION 1 — HERO: SUPPLIER-FIRST POSITIONING
         ------------------------------------------------------------- */}
      <section className="relative bg-[#FAF7F2] text-[#0F2E23] pt-10 pb-20 lg:pt-16 lg:pb-28 overflow-hidden border-b border-[#E8E1D3]">
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
                From live birds to kitchen-ready poultry requirements, FarmReem helps hotels, restaurants, caterers and institutions source the size, quantity and specification their operation needs.
              </p>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 pt-2">
                <Link
                  href="/request-pricing"
                  className="w-full sm:w-auto bg-[#0F2E23] hover:bg-[#184636] text-[#FAF7F2] font-extrabold text-base px-7 py-4 rounded-xl shadow-xl transition-all flex items-center justify-center gap-2 group cursor-pointer"
                >
                  Tell Us Your Requirement
                  <ArrowRight className="w-5 h-5 text-[#C59B27] group-hover:translate-x-1 transition-transform" />
                </Link>

                <Link
                  href="/request-pricing"
                  className="w-full sm:w-auto bg-white hover:bg-[#FAF7F2] text-[#0F2E23] font-bold text-base px-6 py-4 rounded-xl border border-[#E8E1D3] transition-colors flex items-center justify-center gap-2 shadow-sm cursor-pointer"
                >
                  <Phone className="w-4 h-4 text-[#C59B27]" />
                  Request B2B Pricing
                </Link>
              </div>
            </div>

            {/* Hero Right Visual: Rotating Photography + Fixed B2B Requirement Card */}
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
                            Kitchen Sourcing Specs
                          </span>
                        </div>
                        <span className="text-[10px] font-bold bg-[#FAF7F2] text-[#0F2E23] px-2 py-0.5 rounded border border-[#E8E1D3]">
                          Multi-Category Sourcing
                        </span>
                      </div>

                      <div className="grid grid-cols-4 gap-2 text-center text-xs">
                        <div className="bg-[#FAF7F2] p-2 rounded-lg border border-[#E8E1D3]">
                          <span className="text-[9px] text-[#4F5E57] uppercase block">Live Bird</span>
                          <span className="font-extrabold text-[#0F2E23]">Available</span>
                        </div>
                        <div className="bg-[#FAF7F2] p-2 rounded-lg border border-[#E8E1D3]">
                          <span className="text-[9px] text-[#4F5E57] uppercase block">Whole</span>
                          <span className="font-extrabold text-[#0F2E23]">On Request</span>
                        </div>
                        <div className="bg-[#FAF7F2] p-2 rounded-lg border border-[#E8E1D3]">
                          <span className="text-[9px] text-[#4F5E57] uppercase block">Cuts</span>
                          <span className="font-extrabold text-[#0F2E23]">On Request</span>
                        </div>
                        <div className="bg-[#FAF7F2] p-2 rounded-lg border border-[#E8E1D3]">
                          <span className="text-[9px] text-[#4F5E57] uppercase block">Boneless</span>
                          <span className="font-extrabold text-[#0F2E23]">On Request</span>
                        </div>
                      </div>

                      <div className="pt-1 flex items-center justify-between text-xs">
                        <span className="text-[10px] text-[#4F5E57] font-semibold flex items-center gap-1">
                          <span>Sample B2B Account</span>
                          <span className="text-[9px] text-[#C59B27] bg-[#FAF7F2] px-1.5 py-0.5 rounded border border-[#E8E1D3]">
                            Interface preview · demonstration data
                          </span>
                        </span>
                        <Link
                          href="/products"
                          className="font-extrabold text-[#C59B27] hover:underline text-[11px]"
                        >
                          Explore Products &rarr;
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
          SECTION 2 — HOMEPAGE PRODUCT STORY
         ------------------------------------------------------------- */}
      <section className="py-16 bg-white border-b border-[#E8E1D3]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="text-xs font-extrabold uppercase tracking-wider text-[#C59B27]">
              BUILT AROUND YOUR REQUIREMENT
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0F2E23] tracking-tight">
              Different kitchens need chicken differently.
            </h2>
            <p className="text-base text-[#4F5E57] leading-relaxed">
              A tandoor kitchen may want smaller whole birds. A banquet may need consistent curry cuts. A restaurant may require breast, thighs, wings or boneless meat. FarmReem is being built to supply around the requirement—not force every buyer into one specification.
            </p>
          </div>
        </div>
      </section>

      {/* -------------------------------------------------------------
          SECTION 3 — LIVE BROILER SIZE CATEGORIES
         ------------------------------------------------------------- */}
      <section className="py-20 bg-[#FAF7F2] border-b border-[#E8E1D3]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="text-xs font-extrabold uppercase tracking-wider text-[#C59B27]">
              LIVE BROILER SIZING
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0F2E23] tracking-tight">
              Choose the bird size that works for your kitchen.
            </h2>
            <p className="text-sm text-[#4F5E57]">
              FarmReem categorizes live broilers into typical working ranges so commercial buyers can align supply with portion costs and preparation requirements.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* SMALL */}
            <div className="bg-white rounded-3xl border border-[#E8E1D3] p-8 shadow-sm space-y-6 flex flex-col justify-between hover:shadow-md transition-shadow">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-extrabold uppercase tracking-wider text-[#C59B27]">
                    Category 01
                  </span>
                  <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2.5 py-1 rounded border border-emerald-300">
                    AVAILABLE
                  </span>
                </div>
                <div>
                  <h3 className="text-2xl font-extrabold text-[#0F2E23]">SMALL BROILER</h3>
                  <div className="mt-2 text-xl font-black text-[#C59B27]">
                    800 g – 1.0 kg
                  </div>
                  <span className="text-[11px] text-[#4F5E57] font-semibold">Typical working range</span>
                </div>
                <div className="p-4 rounded-xl bg-[#FAF7F2] border border-[#E8E1D3] text-xs space-y-1 text-[#0F2E23]">
                  <span className="font-extrabold block">Suitable Positioning:</span>
                  <p className="text-[#4F5E57]">Whole-bird / tandoor / smaller-portion requirements</p>
                </div>
              </div>
              <Link
                href="/request-pricing"
                className="w-full bg-[#0F2E23] hover:bg-[#184636] text-white font-extrabold text-xs py-3.5 rounded-xl transition-all text-center block shadow-sm"
              >
                Request Small Size Pricing
              </Link>
            </div>

            {/* MEDIUM */}
            <div className="bg-white rounded-3xl border-2 border-[#C59B27] p-8 shadow-md space-y-6 flex flex-col justify-between hover:shadow-lg transition-shadow relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#C59B27] text-[#0F2E23] text-[10px] font-extrabold uppercase tracking-wider px-3 py-0.5 rounded-full shadow-sm">
                Most Popular for Restaurants
              </div>
              <div className="space-y-4 pt-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-extrabold uppercase tracking-wider text-[#C59B27]">
                    Category 02
                  </span>
                  <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2.5 py-1 rounded border border-emerald-300">
                    AVAILABLE
                  </span>
                </div>
                <div>
                  <h3 className="text-2xl font-extrabold text-[#0F2E23]">MEDIUM BROILER</h3>
                  <div className="mt-2 text-xl font-black text-[#C59B27]">
                    1.0 kg – 1.4 kg
                  </div>
                  <span className="text-[11px] text-[#4F5E57] font-semibold">Typical working range</span>
                </div>
                <div className="p-4 rounded-xl bg-[#FAF7F2] border border-[#E8E1D3] text-xs space-y-1 text-[#0F2E23]">
                  <span className="font-extrabold block">Suitable Positioning:</span>
                  <p className="text-[#4F5E57]">General restaurant / curry / portion requirements</p>
                </div>
              </div>
              <Link
                href="/request-pricing"
                className="w-full bg-[#0F2E23] hover:bg-[#184636] text-white font-extrabold text-xs py-3.5 rounded-xl transition-all text-center block shadow-sm"
              >
                Request Medium Size Pricing
              </Link>
            </div>

            {/* LARGE */}
            <div className="bg-white rounded-3xl border border-[#E8E1D3] p-8 shadow-sm space-y-6 flex flex-col justify-between hover:shadow-md transition-shadow">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-extrabold uppercase tracking-wider text-[#C59B27]">
                    Category 03
                  </span>
                  <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2.5 py-1 rounded border border-emerald-300">
                    AVAILABLE
                  </span>
                </div>
                <div>
                  <h3 className="text-2xl font-extrabold text-[#0F2E23]">LARGE BROILER</h3>
                  <div className="mt-2 text-xl font-black text-[#C59B27]">
                    1.4 kg – 1.8 kg
                  </div>
                  <span className="text-[11px] text-[#4F5E57] font-semibold">Typical working range</span>
                </div>
                <div className="p-4 rounded-xl bg-[#FAF7F2] border border-[#E8E1D3] text-xs space-y-1 text-[#0F2E23]">
                  <span className="font-extrabold block">Suitable Positioning:</span>
                  <p className="text-[#4F5E57]">Larger portions / banquet / higher-yield requirements</p>
                </div>
              </div>
              <Link
                href="/request-pricing"
                className="w-full bg-[#0F2E23] hover:bg-[#184636] text-white font-extrabold text-xs py-3.5 rounded-xl transition-all text-center block shadow-sm"
              >
                Request Large Size Pricing
              </Link>
            </div>

          </div>

          <div className="text-center text-xs text-[#4F5E57] italic bg-white p-4 rounded-2xl border border-[#E8E1D3] max-w-2xl mx-auto">
            * Typical working ranges. Exact weight specifications are subject to availability and account requirements.
          </div>

        </div>
      </section>

      {/* -------------------------------------------------------------
          SECTION 4 — CUSTOMER REQUIREMENT UX (Interactive Builder)
         ------------------------------------------------------------- */}
      <section className="py-20 bg-[#FFFDF9] border-b border-[#E8E1D3]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <RequirementBuilder />
        </div>
      </section>

      {/* -------------------------------------------------------------
          SECTION 5 — HOW FARMREEM WORKS
         ------------------------------------------------------------- */}
      <section className="py-20 bg-white border-b border-[#E8E1D3]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-xs font-extrabold uppercase tracking-wider text-[#C59B27]">
              HOW FARMREEM WORKS
            </span>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-[#0F2E23] tracking-tight">
              Tell us what you need. <br className="hidden sm:inline" />
              We source around your requirement.
            </h2>
            <p className="text-base text-[#4F5E57]">
              Every kitchen buys differently. Tell us the product, quantity, preferred size or cut and delivery requirement. FarmReem coordinates the supply around what works for your operation.
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
                  <span>Specification Check</span>
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
          SECTION 6 — PROFESSIONAL KITCHEN EXAMPLES
         ------------------------------------------------------------- */}
      <section className="py-20 bg-[#FAF7F2] border-b border-[#E8E1D3]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="text-xs font-extrabold uppercase tracking-wider text-[#C59B27]">
              ONE SUPPLIER. MORE FLEXIBILITY.
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0F2E23] tracking-tight">
              The chicken you need depends on what you're cooking.
            </h2>
            <p className="text-base text-[#4F5E57] leading-relaxed">
              Small whole birds for tandoor. Consistent cuts for banquets. Breast, thighs, legs or wings for specific menu requirements. FarmReem is building a supply model around professional kitchen demand.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            
            <div className="bg-white rounded-2xl border border-[#E8E1D3] p-6 space-y-4 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-2xl bg-[#0F2E23] text-[#C59B27] flex items-center justify-center font-bold">
                <Flame className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h3 className="font-extrabold text-lg text-[#0F2E23]">TANDOOR / GRILL</h3>
                <p className="text-xs text-[#4F5E57]">Smaller whole-bird requirements for tandoori preparation and whole roasted birds.</p>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-[#E8E1D3] p-6 space-y-4 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-2xl bg-[#0F2E23] text-[#C59B27] flex items-center justify-center font-bold">
                <Utensils className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h3 className="font-extrabold text-lg text-[#0F2E23]">RESTAURANT KITCHEN</h3>
                <p className="text-xs text-[#4F5E57]">Consistent everyday poultry supply for regular menu prep and portion control.</p>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-[#E8E1D3] p-6 space-y-4 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-2xl bg-[#0F2E23] text-[#C59B27] flex items-center justify-center font-bold">
                <Users className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h3 className="font-extrabold text-lg text-[#0F2E23]">BANQUETS & CATERING</h3>
                <p className="text-xs text-[#4F5E57]">Volume and portion planning for large events, weddings, and institutional dining.</p>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-[#E8E1D3] p-6 space-y-4 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-2xl bg-[#0F2E23] text-[#C59B27] flex items-center justify-center font-bold">
                <Store className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h3 className="font-extrabold text-lg text-[#0F2E23]">SPECIALITY MENU</h3>
                <p className="text-xs text-[#4F5E57]">Breast, thighs, legs, wings and boneless requirements for specific dish profiles.</p>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* -------------------------------------------------------------
          SECTION 7 — SUPPLY NETWORK (Deep Forest Green Brand Moment)
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
              Different requirements need different sourcing. FarmReem is building a flexible supply network across wholesale sourcing, poultry producers and future owned production so professional kitchens can work with one supply relationship.
            </p>
          </div>

          {/* Supply Flow Diagram */}
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
                <h3 className="font-extrabold text-lg text-white">PARTNER POULTRY FARMS</h3>
                <p className="text-xs text-[#FAF7F2]/70">Building direct relationships with poultry producers.</p>
              </div>

              <div className="p-6 rounded-2xl bg-[#0F2E23] border border-[#25634e] space-y-2">
                <span className="text-[10px] font-bold text-[#C59B27] uppercase tracking-wider block">
                  Under Development
                </span>
                <h3 className="font-extrabold text-lg text-white">BUILDING FARMREEM FARMS</h3>
                <p className="text-xs text-[#FAF7F2]/70">
                  FarmReem is developing its own broiler production capacity to become an additional source within the wider FarmReem supply network.
                </p>
              </div>

            </div>

            {/* Central Convergence Node */}
            <div className="flex flex-col items-center justify-center gap-3 pt-2 border-t border-[#184636]">
              <div className="inline-flex items-center gap-3 bg-[#C59B27] text-[#0F2E23] font-extrabold text-sm px-8 py-3.5 rounded-full shadow-xl">
                <span>FARMREEM B2B POULTRY SUPPLY</span>
              </div>
              <p className="text-xs text-[#FAF7F2]/70 font-semibold pt-2">
                Hotels · Restaurants · Caterers · Institutions
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* -------------------------------------------------------------
          SECTION 8 — FINAL CTA BLOCK
         ------------------------------------------------------------- */}
      <section className="py-20 bg-[#FFFDF9] border-t border-[#E8E1D3]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
