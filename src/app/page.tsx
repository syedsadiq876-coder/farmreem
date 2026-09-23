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
  Sparkles,
} from "lucide-react";
import ImageCarousel from "@/components/ui/ImageCarousel";
import RequirementBuilder from "@/components/ui/RequirementBuilder";
import { HeroH1, SectionH2 } from "@/components/ui/AnimatedHeading";
import {
  LiveBirdIcon,
  WholeChickenIcon,
  CutsIcon,
  BonelessIcon,
  ChickenIllustration,
} from "@/components/ui/Icons";

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

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: "FarmReem",
    url: "https://www.farmreem.com",
    logo: "https://www.farmreem.com/images/farmreem-logo.png",
    image: "https://www.farmreem.com/images/hero_foodservice.jpg",
    description:
      "B2B poultry sourcing and scheduled supply for hotels, restaurants, caterers and institutional kitchens based in Dehradun, Uttarakhand.",
    telephone: "+918475863634",
    email: "contact@farmreem.com",
    address: {
      "@type": "PostalAddress",
      streetAddress: "39, Siddharth Vihar, Kandoli, Sahastradhara Road",
      addressLocality: "Dehradun",
      addressRegion: "Uttarakhand",
      postalCode: "248001",
      addressCountry: "IN",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: 30.3165,
      longitude: 78.0322,
    },
    priceRange: "$$",
  };

  return (
    <div className="bg-[#FAF7F2] text-[#111A17] space-y-0 selection:bg-[#C59B27] selection:text-[#0F2E23]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* -------------------------------------------------------------
          SECTION 1 — HERO: UNBROKEN PHOTOGRAPHY & SUBTLE GOLD ACCENT
         ------------------------------------------------------------- */}
      <section className="relative bg-[#FAF7F2] text-[#0F2E23] pt-8 pb-12 lg:pt-14 lg:pb-16 overflow-hidden border-b border-[#E8E1D3]">
        {/* Single Muted Gold 4-Point Star Accent with Gentle 2s Twinkle */}
        <div aria-hidden="true" className="absolute top-10 right-10 pointer-events-none z-20">
          <svg
            className="w-8 h-8 text-[#E5C365] animate-pulse motion-reduce:animate-none opacity-90 transition-all duration-1000"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z" />
          </svg>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Hero Left Content */}
            <div className="lg:col-span-6 space-y-6 text-center lg:text-left">
              <HeroH1
                line1="Poultry supply,"
                line2="built around your"
                line3="kitchen."
              />

              <p className="text-base sm:text-lg text-[#4F5E57] font-normal leading-relaxed max-w-xl mx-auto lg:mx-0">
                From live birds to kitchen-ready poultry, we work with hotels, restaurants, caterers and institutions to coordinate supply based on your quantity, preferred size and product requirements.
              </p>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
                <Link
                  href="/request-pricing"
                  className="w-full sm:w-auto bg-[#E5C365] hover:bg-[#d4b255] text-[#0F2E23] font-extrabold text-base px-8 py-4 rounded-full shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer group"
                >
                  Tell Us Your Requirement
                  <ArrowRight className="w-5 h-5 text-[#0F2E23] group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>

            {/* Hero Right Visual: Premium Rotating Photography */}
            <div className="lg:col-span-6 relative">
              <ImageCarousel
                slides={heroSlides}
                aspectRatio="h-[440px] sm:h-[480px]"
                autoPlayInterval={2000}
                dotsPosition="bottom-4"
              />
            </div>

          </div>
        </div>
      </section>

      {/* -------------------------------------------------------------
          SECTION 2 — COMPACT KITCHEN SOURCING SPECS BAR (Below Hero Carousel)
         ------------------------------------------------------------- */}
      <section className="bg-[#FAF7F2] py-6 border-b border-[#E8E1D3]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-3xl border border-[#E8E1D3] p-4 sm:p-5 shadow-sm flex flex-col lg:flex-row items-center justify-between gap-4">
            
            {/* Header / Label */}
            <div className="flex items-center gap-2 text-xs font-extrabold text-[#0F2E23] uppercase tracking-wider flex-shrink-0">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-600 animate-pulse" />
              <span>KITCHEN SOURCING SPECS</span>
            </div>

            {/* 4 Category Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs w-full lg:w-auto">
              <div className="flex items-center gap-3 bg-[#FAF7F2] px-4 py-3 rounded-2xl border border-[#E8E1D3]">
                <LiveBirdIcon className="w-6 h-6 text-[#C59B27]" />
                <div>
                  <span className="text-[10px] font-bold text-[#4F5E57] uppercase tracking-wider block">LIVE BIRD</span>
                  <span className="font-extrabold text-emerald-800 text-sm">Available</span>
                </div>
              </div>

              <div className="flex items-center gap-3 bg-[#FAF7F2] px-4 py-3 rounded-2xl border border-[#E8E1D3]">
                <WholeChickenIcon className="w-6 h-6 text-[#C59B27]" />
                <div>
                  <span className="text-[10px] font-bold text-[#4F5E57] uppercase tracking-wider block">WHOLE</span>
                  <span className="font-extrabold text-[#0F2E23] text-sm">On Request</span>
                </div>
              </div>

              <div className="flex items-center gap-3 bg-[#FAF7F2] px-4 py-3 rounded-2xl border border-[#E8E1D3]">
                <CutsIcon className="w-6 h-6 text-[#C59B27]" />
                <div>
                  <span className="text-[10px] font-bold text-[#4F5E57] uppercase tracking-wider block">CUTS</span>
                  <span className="font-extrabold text-[#0F2E23] text-sm">On Request</span>
                </div>
              </div>

              <div className="flex items-center gap-3 bg-[#FAF7F2] px-4 py-3 rounded-2xl border border-[#E8E1D3]">
                <BonelessIcon className="w-6 h-6 text-[#C59B27]" />
                <div>
                  <span className="text-[10px] font-bold text-[#4F5E57] uppercase tracking-wider block">BONELESS</span>
                  <span className="font-extrabold text-[#0F2E23] text-sm">On Request</span>
                </div>
              </div>
            </div>

            {/* Explore Link Button */}
            <Link
              href="/products"
              className="bg-[#E5C365] hover:bg-[#d4b255] text-[#0F2E23] font-extrabold text-xs px-6 py-3 rounded-full transition-all shadow-sm flex items-center justify-center gap-1.5 flex-shrink-0"
            >
              Explore Products &rarr;
            </Link>

          </div>
        </div>
      </section>

      {/* -------------------------------------------------------------
          SECTION 3 — LIVE BROILER SECTION (2-Column Editorial Layout)
         ------------------------------------------------------------- */}
      <section className="py-20 bg-[#FAF7F2] border-b border-[#E8E1D3]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            
            {/* Left Column: Eyebrow, H2, Copy, Footnote & Section CTA */}
            <div className="lg:col-span-5 space-y-6">
              <span className="text-xs font-extrabold uppercase tracking-wider text-[#C59B27]">
                LIVE BROILER
              </span>
              
              <SectionH2
                text="Choose the right bird size for your kitchen."
                className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#0F2E23] leading-tight"
              />

              <p className="text-base text-[#4F5E57] leading-relaxed">
                We offer live broilers in multiple weight ranges to suit different menu requirements, portioning and kitchen operations.
              </p>

              <p className="text-xs text-[#4F5E57] pt-2">
                Exact weight specifications are subject to availability and account requirements.
              </p>

              {/* ONE section-level CTA underneath */}
              <div className="pt-4">
                <Link
                  href="/request-pricing"
                  className="inline-flex items-center gap-2 bg-[#E5C365] hover:bg-[#d4b255] text-[#0F2E23] font-extrabold text-sm px-7 py-3.5 rounded-full shadow-md transition-all cursor-pointer group"
                >
                  Tell Us Your Requirement
                  <ArrowRight className="w-4 h-4 text-[#0F2E23] group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>

            {/* Right Column: 3 Product Cards Side-by-Side */}
            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-3 gap-6">
              
              {/* SMALL */}
              <div className="bg-white rounded-3xl border border-[#E8E1D3] p-6 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
                <div className="space-y-4">
                  {/* Chicken Illustration */}
                  <div className="h-32 w-full flex items-center justify-center bg-[#FAF7F2] rounded-2xl p-2">
                    <ChickenIllustration size="small" />
                  </div>

                  <div>
                    <h3 className="text-xl font-extrabold text-[#0F2E23]">Small</h3>
                    <div className="mt-1 text-xs text-[#4F5E57]">Typical working range:</div>
                    <div className="text-base font-black text-[#0F2E23]">800 g–1.0 kg</div>
                  </div>

                  <div className="text-xs text-[#4F5E57] space-y-1 pt-3 border-t border-[#E8E1D3]">
                    <span className="font-bold text-[#0F2E23] block">Often used for:</span>
                    <p>Smaller portion sizes and specific menu requirements.</p>
                  </div>
                </div>
              </div>

              {/* MEDIUM */}
              <div className="bg-white rounded-3xl border border-[#E8E1D3] p-6 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
                <div className="space-y-4">
                  {/* Chicken Illustration */}
                  <div className="h-32 w-full flex items-center justify-center bg-[#FAF7F2] rounded-2xl p-2">
                    <ChickenIllustration size="medium" />
                  </div>

                  <div>
                    <h3 className="text-xl font-extrabold text-[#0F2E23]">Medium</h3>
                    <div className="mt-1 text-xs text-[#4F5E57]">Typical working range:</div>
                    <div className="text-base font-black text-[#0F2E23]">1.0 kg–1.4 kg</div>
                  </div>

                  <div className="text-xs text-[#4F5E57] space-y-1 pt-3 border-t border-[#E8E1D3]">
                    <span className="font-bold text-[#0F2E23] block">Often used for:</span>
                    <p>General kitchen use for restaurants, hotels and caterers.</p>
                  </div>
                </div>
              </div>

              {/* LARGE */}
              <div className="bg-white rounded-3xl border border-[#E8E1D3] p-6 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
                <div className="space-y-4">
                  {/* Chicken Illustration */}
                  <div className="h-32 w-full flex items-center justify-center bg-[#FAF7F2] rounded-2xl p-2">
                    <ChickenIllustration size="large" />
                  </div>

                  <div>
                    <h3 className="text-xl font-extrabold text-[#0F2E23]">Large</h3>
                    <div className="mt-1 text-xs text-[#4F5E57]">Typical working range:</div>
                    <div className="text-base font-black text-[#0F2E23]">1.4 kg–1.8 kg</div>
                  </div>

                  <div className="text-xs text-[#4F5E57] space-y-1 pt-3 border-t border-[#E8E1D3]">
                    <span className="font-bold text-[#0F2E23] block">Often used for:</span>
                    <p>Larger portion requirements and institutional supply.</p>
                  </div>
                </div>
              </div>

            </div>

          </div>
        </div>
      </section>

      {/* -------------------------------------------------------------
          SECTION 4 — HOW FARMREEM WORKS (Sourcing Journey)
         ------------------------------------------------------------- */}
      <section className="py-20 bg-white border-b border-[#E8E1D3]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-xs font-extrabold uppercase tracking-wider text-[#C59B27]">
              HOW FARMREEM WORKS
            </span>
            <SectionH2
              line1="Tell us what you need."
              line2="We source around your requirement."
              className="text-3xl sm:text-5xl"
            />
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
          SECTION 5 — PROFESSIONAL KITCHEN EXAMPLES
         ------------------------------------------------------------- */}
      <section className="py-20 bg-[#FAF7F2] border-b border-[#E8E1D3]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="text-xs font-extrabold uppercase tracking-wider text-[#C59B27]">
              ONE SUPPLIER. MORE FLEXIBILITY.
            </span>
            <SectionH2
              text="The chicken you need depends on what you're cooking."
              className="text-3xl sm:text-4xl"
            />
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
          SECTION 6 — SUPPLY NETWORK (Deep Forest Green Brand Moment)
         ------------------------------------------------------------- */}
      <section className="py-20 bg-[#0F2E23] text-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 relative z-10">
          
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-[#C59B27]">
              A NETWORK BUILT FOR CONSISTENCY
            </span>
            <SectionH2
              line1="More than one source."
              line2="One FarmReem relationship."
              className="text-3xl sm:text-5xl !text-white"
            />
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
          SECTION 7 — B2B PORTAL PREVIEW (Moved lower as requested)
         ------------------------------------------------------------- */}
      <section className="py-20 bg-[#FFFDF9] border-b border-[#E8E1D3]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <RequirementBuilder />
        </div>
      </section>

      {/* -------------------------------------------------------------
          SECTION 8 — FINAL CTA BLOCK
         ------------------------------------------------------------- */}
      <section className="py-20 bg-[#FFFDF9] border-t border-[#E8E1D3]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-[#0F2E23] text-white rounded-3xl p-10 sm:p-14 text-center space-y-6 shadow-2xl">
            <SectionH2
              text="Tell us what your kitchen needs."
              className="text-3xl sm:text-5xl !text-white"
            />
            <p className="text-base text-[#FAF7F2]/80 max-w-xl mx-auto">
              Whether it's a regular daily requirement, a busy weekend or an upcoming event, talk to FarmReem about your poultry supply.
            </p>

            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/request-pricing"
                className="w-full sm:w-auto bg-[#E5C365] hover:bg-[#d4b255] text-[#0F2E23] font-extrabold text-base px-9 py-4 rounded-full shadow-xl transition-all"
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
