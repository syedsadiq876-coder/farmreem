import Image from "next/image";
import Link from "next/link";
import {
  ShieldCheck,
  Truck,
  Scale,
  Building2,
  Utensils,
  Clock,
  ArrowRight,
  CheckCircle2,
  Users,
  ChevronRight,
  Sparkles,
  BarChart3,
  Calendar,
  Lock,
  Phone,
  MessageSquare,
  MapPin,
} from "lucide-react";

export default function HomePage() {
  return (
    <div className="space-y-0">
      {/* 1. PREMIUM HERO */}
      <section className="relative bg-[#0F2E23] text-white overflow-hidden pt-12 pb-24 lg:pt-20 lg:pb-32">
        {/* Subtle background glow */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#C59B27]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-[#184636]/40 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Hero Left Content */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#184636] border border-[#25634e] text-[#C59B27] text-xs font-semibold uppercase tracking-wider">
                <MapPin className="w-3.5 h-3.5" />
                <span>Dehradun, Uttarakhand · B2B Poultry Sourcing</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.12]">
                Reliable Poultry Supply. <br />
                <span className="text-[#C59B27]">Built for Professional Kitchens.</span>
              </h1>

              <p className="text-lg sm:text-xl text-[#FAF7F2]/80 font-normal leading-relaxed max-w-2xl mx-auto lg:mx-0">
                Live broiler sourcing and scheduled B2B delivery for hotels, restaurants, caterers and institutions.
              </p>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-4">
                <Link
                  href="/request-pricing"
                  className="w-full sm:w-auto bg-[#C59B27] hover:bg-[#b0881f] text-[#0F2E23] font-extrabold text-base px-8 py-4 rounded-xl shadow-xl hover:shadow-2xl transition-all flex items-center justify-center gap-2 group"
                >
                  Request B2B Pricing
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>

                <a
                  href="tel:+918475863634"
                  className="w-full sm:w-auto bg-[#184636] hover:bg-[#205945] text-white font-semibold text-base px-7 py-4 rounded-xl border border-[#25634e] transition-colors flex items-center justify-center gap-2"
                >
                  <Phone className="w-4 h-4 text-[#C59B27]" />
                  Call +91 8475863634
                </a>
              </div>

              {/* Trust & Value Strip */}
              <div className="pt-10 border-t border-[#184636]/80 grid grid-cols-2 sm:grid-cols-4 gap-4 text-left">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-[#C59B27]/10 flex items-center justify-center text-[#C59B27]">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-semibold text-[#FAF7F2]">Reliable Sourcing</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-[#C59B27]/10 flex items-center justify-center text-[#C59B27]">
                    <Scale className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-semibold text-[#FAF7F2]">Weight Verification</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-[#C59B27]/10 flex items-center justify-center text-[#C59B27]">
                    <Clock className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-semibold text-[#FAF7F2]">Scheduled Delivery</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-[#C59B27]/10 flex items-center justify-center text-[#C59B27]">
                    <Building2 className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-semibold text-[#FAF7F2]">B2B Bulk Supply</span>
                </div>
              </div>
            </div>

            {/* Hero Right Visual */}
            <div className="lg:col-span-5 relative">
              <div className="relative rounded-2xl overflow-hidden border border-[#25634e] shadow-2xl group">
                <Image
                  src="/images/hero_foodservice.jpg"
                  alt="FarmReem Commercial Kitchen Poultry Sourcing"
                  width={800}
                  height={600}
                  className="w-full h-[420px] object-cover group-hover:scale-105 transition-transform duration-700"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0F2E23] via-transparent to-transparent opacity-80" />

                {/* Floating Operational Badge */}
                <div className="absolute bottom-6 left-6 right-6 p-4 rounded-xl bg-[#0A2118]/90 backdrop-blur-md border border-[#184636] flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full bg-emerald-400 animate-pulse" />
                    <div>
                      <p className="text-xs font-bold text-white">Daily Kitchen Dispatch</p>
                      <p className="text-[11px] text-[#FAF7F2]/70">Route-Planned Commercial Deliveries</p>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-[#C59B27] bg-[#C59B27]/10 px-2.5 py-1 rounded">
                    Active
                  </span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 2. WHO WE SERVE */}
      <section className="py-20 bg-[#FAF7F2]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-[#C59B27]">Targeted Foodservice Solutions</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0F2E23]">
              Supply Built Around Your Kitchen Requirement
            </h2>
            <p className="text-base text-[#4F5E57]">
              Every foodservice business has specific bird weight preferences, delivery schedules, and commercial terms. We align supply protocols to match your kitchen needs.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {[
              {
                title: "Hotels",
                desc: "Requested weight specifications (e.g. 1.8–2.0 kg), morning kitchen dock delivery, and account terms.",
                icon: Building2,
                link: "/solutions/hotels-restaurants",
              },
              {
                title: "Restaurants",
                desc: "Dependable live broiler supply supporting menu consistency and daily kitchen prep schedules.",
                icon: Utensils,
                link: "/solutions/hotels-restaurants",
              },
              {
                title: "Caterers",
                desc: "High-volume batch sourcing capability for weddings, banquets, and large event functions.",
                icon: Users,
                link: "/solutions/caterers-institutions",
              },
              {
                title: "Banquets",
                desc: "Pre-scheduled bulk bird allocations backed by route-planned delivery windows.",
                icon: Calendar,
                link: "/solutions/caterers-institutions",
              },
              {
                title: "Institutional Kitchens",
                desc: "Contracted rate agreements for hospitals, corporate dining, and educational cafeterias.",
                icon: CheckCircle2,
                link: "/solutions/caterers-institutions",
              },
            ].map((item, idx) => (
              <div
                key={idx}
                className="bg-white p-6 rounded-xl border border-[#E8E1D3] shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className="w-12 h-12 rounded-lg bg-[#FAF7F2] border border-[#E8E1D3] flex items-center justify-center text-[#0F2E23]">
                    <item.icon className="w-6 h-6" />
                  </div>
                  <h3 className="font-bold text-lg text-[#0F2E23]">{item.title}</h3>
                  <p className="text-xs text-[#4F5E57] leading-relaxed">{item.desc}</p>
                </div>
                <div className="pt-4 mt-2">
                  <Link
                    href={item.link}
                    className="text-xs font-bold text-[#0F2E23] hover:text-[#C59B27] flex items-center gap-1 group"
                  >
                    Learn More <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. THE FARMREEM DIFFERENCE */}
      <section className="py-20 bg-white border-y border-[#E8E1D3]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-5 space-y-6">
              <span className="text-xs font-bold uppercase tracking-wider text-[#C59B27]">Operational Focus</span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0F2E23]">
                The FarmReem Difference
              </h2>
              <p className="text-base text-[#4F5E57] leading-relaxed">
                Traditional wholesale purchasing often brings weight variance and delivery uncertainty. FarmReem modernizes B2B sourcing with structured logistics and account support.
              </p>
              <div className="pt-4">
                <Link
                  href="/quality-sourcing"
                  className="inline-flex items-center gap-2 text-sm font-bold text-[#0F2E23] hover:text-[#C59B27] border-b-2 border-[#0F2E23] hover:border-[#C59B27] pb-1 transition-colors"
                >
                  Explore Quality & Sourcing Framework <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-6">
              {[
                {
                  title: "Reliable Sourcing Network",
                  desc: "Multi-layered supply structure connecting partner farms and wholesale procurement to fulfill demand.",
                },
                {
                  title: "Requested Weight Specs",
                  desc: "Specify target bird weight bands (e.g. 1.8–2.0 kg) based on requirement and availability.",
                },
                {
                  title: "Scheduled Commercial Delivery",
                  desc: "Planned morning delivery routes tailored to hotel and restaurant receiving dock schedules.",
                },
                {
                  title: "Transparent Weighment",
                  desc: "Dual weighment recording (dispatch vs receiving weighment slips) for verified billing accuracy.",
                },
                {
                  title: "Dedicated B2B Account Support",
                  desc: "Direct access to account representatives for volume adjustments and commercial terms.",
                },
              ].map((diff, i) => (
                <div key={i} className="p-6 rounded-xl bg-[#FAF7F2] border border-[#E8E1D3] space-y-2">
                  <div className="w-8 h-8 rounded-full bg-[#0F2E23] text-[#C59B27] flex items-center justify-center font-bold text-sm">
                    0{i + 1}
                  </div>
                  <h3 className="font-bold text-base text-[#0F2E23]">{diff.title}</h3>
                  <p className="text-xs text-[#4F5E57] leading-relaxed">{diff.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 4. LIVE BROILER SUPPLY (Core Product Section) */}
      <section className="py-20 bg-[#FAF7F2]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-2 max-w-2xl">
              <span className="text-xs font-bold uppercase tracking-wider text-[#C59B27]">Current Core Offering</span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0F2E23]">
                Live Broiler Sourcing & Specifications
              </h2>
              <p className="text-sm text-[#4F5E57]">
                FarmReem focuses on live broiler supply for commercial kitchens. B2B rates are set per customer account based on volume and commercial terms.
              </p>
            </div>
            <Link
              href="/products"
              className="bg-[#0F2E23] hover:bg-[#184636] text-white font-bold text-sm px-6 py-3 rounded-lg transition-colors whitespace-nowrap self-start md:self-auto"
            >
              View Product Specs
            </Link>
          </div>

          {/* Product Spec Card */}
          <div className="bg-white rounded-2xl border border-[#E8E1D3] p-8 shadow-sm grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-5 space-y-4">
              <div className="inline-block px-3 py-1 rounded bg-[#0F2E23]/10 text-[#0F2E23] font-bold text-xs">
                Active Core Product
              </div>
              <h3 className="text-2xl font-bold text-[#0F2E23]">Live Commercial Broiler</h3>
              <p className="text-sm text-[#4F5E57] leading-relaxed">
                Farm-sourced live broilers selected for uniform weight bands and flock health. Delivered to commercial kitchens in Dehradun and surrounding regions.
              </p>

              <div className="space-y-2 pt-2">
                <div className="flex items-center justify-between text-xs py-1.5 border-b border-[#E8E1D3]">
                  <span className="text-[#4F5E57]">Requested Weight Spec:</span>
                  <span className="font-bold text-[#0F2E23]">1.8 kg – 2.0 kg (Customizable)</span>
                </div>
                <div className="flex items-center justify-between text-xs py-1.5 border-b border-[#E8E1D3]">
                  <span className="text-[#4F5E57]">Minimum Bulk Order:</span>
                  <span className="font-bold text-[#0F2E23]">50 Live Birds (~95 KG)</span>
                </div>
                <div className="flex items-center justify-between text-xs py-1.5 border-b border-[#E8E1D3]">
                  <span className="text-[#4F5E57]">Availability Status:</span>
                  <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                    Available (Scheduled Dispatches)
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs py-1.5 border-b border-[#E8E1D3]">
                  <span className="text-[#4F5E57]">Pricing Structure:</span>
                  <span className="font-bold text-[#0F2E23]">Customer-Specific B2B Pricing</span>
                </div>
              </div>

              <div className="pt-4">
                <Link
                  href="/request-pricing"
                  className="w-full bg-[#C59B27] hover:bg-[#b0881f] text-[#0F2E23] font-bold text-sm px-6 py-3.5 rounded-xl transition-all shadow text-center block"
                >
                  Request B2B Pricing
                </Link>
                <p className="text-[11px] text-[#4F5E57] text-center mt-2">
                  *Public rates are not displayed. B2B contract terms agreed per account.
                </p>
              </div>
            </div>

            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-[#FAF7F2] p-5 rounded-xl border border-[#E8E1D3] space-y-2">
                <Scale className="w-6 h-6 text-[#C59B27]" />
                <h4 className="font-bold text-sm text-[#0F2E23]">Weighment Basis</h4>
                <p className="text-xs text-[#4F5E57]">Dual weighment tickets recording dispatch and receiving weight for clear billing.</p>
              </div>

              <div className="bg-[#FAF7F2] p-5 rounded-xl border border-[#E8E1D3] space-y-2">
                <Truck className="w-6 h-6 text-[#C59B27]" />
                <h4 className="font-bold text-sm text-[#0F2E23]">Live Bird Transport</h4>
                <p className="text-xs text-[#4F5E57]">Ventilated vehicles designed specifically for live bird transportation.</p>
              </div>

              <div className="bg-[#FAF7F2] p-5 rounded-xl border border-[#E8E1D3] space-y-2">
                <Calendar className="w-6 h-6 text-[#C59B27]" />
                <h4 className="font-bold text-sm text-[#0F2E23]">Recurring Supply</h4>
                <p className="text-xs text-[#4F5E57]">Standing daily or weekly bird allocations for verified accounts.</p>
              </div>

              <div className="bg-[#FAF7F2] p-5 rounded-xl border border-[#E8E1D3] space-y-2">
                <BarChart3 className="w-6 h-6 text-[#C59B27]" />
                <h4 className="font-bold text-sm text-[#0F2E23]">Future Expansion</h4>
                <p className="text-xs text-[#4F5E57]">Dressed, chilled, and portioned cuts planned for future category expansion.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. HOW FARMREEM WORKS */}
      <section className="py-20 bg-white border-b border-[#E8E1D3]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-[#C59B27]">End-to-End Fulfillment</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0F2E23]">
              How FarmReem Works
            </h2>
            <p className="text-sm text-[#4F5E57]">
              A structured 5-step operational workflow from order intake to receiving dock weighment.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 relative">
            {[
              { step: "01", name: "Requirement", text: "Customer submits bird count & preferred weight spec." },
              { step: "02", name: "Sourcing", text: "Allocated against partner farms or procurement lots." },
              { step: "03", name: "Weight Check", text: "Dispatch weighment slip recorded with bird count and live weight." },
              { step: "04", name: "Dispatch", text: "Loaded onto live transport vehicle for assigned delivery route." },
              { step: "05", name: "Kitchen Delivery", text: "Receiving weighment verified at dock, generating reconciled final invoice." },
            ].map((st, i) => (
              <div key={i} className="bg-[#FAF7F2] p-6 rounded-xl border border-[#E8E1D3] space-y-3 relative group hover:border-[#C59B27] transition-colors">
                <span className="text-3xl font-extrabold text-[#C59B27]">{st.step}</span>
                <h3 className="font-bold text-base text-[#0F2E23]">{st.name}</h3>
                <p className="text-xs text-[#4F5E57] leading-relaxed">{st.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. SUPPLY NETWORK */}
      <section className="py-20 bg-[#FAF7F2]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-[#C59B27]">Hybrid Sourcing Model</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0F2E23]">
              Multi-Layered Sourcing Network
            </h2>
            <p className="text-sm text-[#4F5E57]">
              FarmReem combines developing owned production with commercial partner farms and wholesale market networks.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-2xl border border-[#E8E1D3] space-y-4">
              <div className="inline-block px-3 py-1 rounded bg-[#C59B27]/10 text-[#C59B27] font-bold text-xs">
                Under Active Development
              </div>
              <h3 className="text-xl font-bold text-[#0F2E23]">Building FarmReem Farms</h3>
              <p className="text-xs text-[#4F5E57] leading-relaxed">
                FarmReem is developing owned biosecure poultry production capacity to complement its sourcing network and establish baseline standards.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl border border-[#E8E1D3] space-y-4">
              <div className="inline-block px-3 py-1 rounded bg-[#0F2E23]/10 text-[#0F2E23] font-bold text-xs">
                Active Partner Network
              </div>
              <h3 className="text-xl font-bold text-[#0F2E23]">Partner Poultry Farms</h3>
              <p className="text-xs text-[#4F5E57] leading-relaxed">
                Contracted commercial poultry farms audited for biosecurity standards, flock health, and weight sorting capability.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl border border-[#E8E1D3] space-y-4">
              <div className="inline-block px-3 py-1 rounded bg-slate-100 text-slate-700 font-bold text-xs">
                Active Wholesale Procurement
              </div>
              <h3 className="text-xl font-bold text-[#0F2E23]">Wholesale Procurement</h3>
              <p className="text-xs text-[#4F5E57] leading-relaxed">
                Direct wholesale mandi procurement providing immediate volume buffering during peak demand dates and event surges.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 7. BUILDING FARMREEM FARMS (Storytelling) */}
      <section className="py-20 bg-[#0F2E23] text-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-6 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#184636] text-[#C59B27] text-xs font-bold uppercase tracking-wider">
                Production Infrastructure Roadmap
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
                Building FarmReem Farms
              </h2>
              <p className="text-base text-[#FAF7F2]/80 leading-relaxed">
                FarmReem is actively acquiring land and developing dedicated biosecure poultry production capacity.
              </p>
              <p className="text-sm text-[#FAF7F2]/70 leading-relaxed">
                While current kitchen supply is fulfilled through partner farms and wholesale procurement, developing owned production allows us to establish direct standards for biosecurity, feed quality, and flock management.
              </p>

              <div className="pt-4 flex items-center gap-4">
                <Link
                  href="/building-farmreem-farms"
                  className="bg-[#C59B27] hover:bg-[#b0881f] text-[#0F2E23] font-bold text-sm px-6 py-3.5 rounded-xl transition-all shadow"
                >
                  Read Farm Development Roadmap
                </Link>
              </div>
            </div>

            <div className="lg:col-span-6">
              <div className="rounded-2xl overflow-hidden border border-[#25634e] shadow-2xl">
                <Image
                  src="/images/farm_facility.jpg"
                  alt="Building FarmReem Farms Production Facility"
                  width={800}
                  height={500}
                  className="w-full h-[380px] object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 8. QUALITY & SOURCING (Factual Operational Language) */}
      <section className="py-20 bg-white border-b border-[#E8E1D3]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-[#C59B27]">Operational Standards</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0F2E23]">
              Quality & Sourcing Framework
            </h2>
            <p className="text-sm text-[#4F5E57]">
              Factual operational procedures applied across all procurement lots to maintain consistency.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
            {[
              {
                title: "Supplier Screening",
                desc: "Initial audit of partner farm bio-security measures, flock health, and supplier reliability.",
              },
              {
                title: "Bird Condition Checks",
                desc: "Inspection of flock health, weight uniformity, and vigor prior to crate loading.",
              },
              {
                title: "Weight Verification",
                desc: "Dual weighment protocol recording gross weight at dispatch and weight upon receiving dock arrival.",
              },
              {
                title: "Careful Handling",
                desc: "Ventilated crate transport designed to minimize bird stress and mortality during transit.",
              },
              {
                title: "Scheduled Delivery",
                desc: "Time-windowed morning dispatches aligned with kitchen receiving dock schedules.",
              },
            ].map((q, idx) => (
              <div key={idx} className="p-6 rounded-xl bg-[#FAF7F2] border border-[#E8E1D3] space-y-3">
                <div className="w-8 h-8 rounded-lg bg-[#0F2E23] text-[#C59B27] flex items-center justify-center font-bold text-xs">
                  0{idx + 1}
                </div>
                <h3 className="font-bold text-base text-[#0F2E23]">{q.title}</h3>
                <p className="text-xs text-[#4F5E57] leading-relaxed">{q.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 9. B2B ORDERING PREVIEW (Mockup Demo) */}
      <section className="py-20 bg-[#0A2118] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#184636] text-[#C59B27] text-xs font-bold uppercase tracking-wider">
              Technology-Enabled Procurement
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
              The FarmReem B2B Customer Portal
            </h2>
            <p className="text-sm text-[#FAF7F2]/80">
              Designed so purchase managers and executive chefs can place repeat orders efficiently from mobile or desktop devices.
            </p>
          </div>

          {/* Interactive Mockup Container */}
          <div className="max-w-4xl mx-auto bg-[#0F2E23] rounded-2xl border border-[#25634e] shadow-2xl p-6 sm:p-8 space-y-6">
            <div className="flex flex-wrap items-center justify-between pb-6 border-b border-[#184636] gap-4">
              <div className="space-y-1">
                <span className="text-xs font-bold text-[#C59B27] uppercase tracking-wider">B2B Portal Preview</span>
                <h3 className="text-xl font-bold text-white">Good Morning, Hotel ABC</h3>
                <p className="text-xs text-[#FAF7F2]/60">Account #: FR-8842 · Hospitality Sourcing Tier</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="px-3 py-1 rounded-full bg-emerald-950 border border-emerald-700 text-emerald-300 text-xs font-semibold">
                  Approved B2B Account
                </span>
              </div>
            </div>

            {/* Quick Order Widget */}
            <div className="bg-[#0A2118] p-6 rounded-xl border border-[#184636] space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h4 className="font-bold text-base text-white">Live Commercial Broiler</h4>
                  <p className="text-xs text-[#FAF7F2]/60">Standard Spec · Uniform Weight Band</p>
                </div>
                <div className="text-right">
                  <span className="text-xs text-[#FAF7F2]/60">Contract Rate:</span>
                  <p className="text-lg font-extrabold text-[#C59B27]">₹ [Assigned Account Rate] / KG</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs">
                <div className="bg-[#0F2E23] p-3 rounded-lg border border-[#184636]">
                  <span className="text-[#FAF7F2]/60 block mb-1">Preferred Weight Spec</span>
                  <span className="font-bold text-white text-sm">1.8 – 2.0 kg</span>
                </div>
                <div className="bg-[#0F2E23] p-3 rounded-lg border border-[#184636]">
                  <span className="text-[#FAF7F2]/60 block mb-1">Bird Quantity</span>
                  <span className="font-bold text-white text-sm">100 Birds (~190 KG)</span>
                </div>
                <div className="bg-[#0F2E23] p-3 rounded-lg border border-[#184636]">
                  <span className="text-[#FAF7F2]/60 block mb-1">Delivery Date</span>
                  <span className="font-bold text-white text-sm">Tomorrow (Morning)</span>
                </div>
                <div className="bg-[#0F2E23] p-3 rounded-lg border border-[#184636]">
                  <span className="text-[#FAF7F2]/60 block mb-1">Kitchen Slot</span>
                  <span className="font-bold text-white text-sm">06:00 – 08:00 AM</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-between pt-4 border-t border-[#184636] gap-4">
                <div className="text-xs text-[#FAF7F2]/70">
                  <span>PO Reference: </span>
                  <span className="font-mono bg-[#0F2E23] px-2 py-1 rounded text-white">PO-2026-0941</span>
                </div>

                <div className="w-full sm:w-auto">
                  <button
                    type="button"
                    className="w-full sm:w-auto bg-[#C59B27] hover:bg-[#b0881f] text-[#0F2E23] font-extrabold text-sm px-8 py-3 rounded-xl transition-all shadow cursor-default"
                  >
                    [ Place Order ]
                  </button>
                </div>
              </div>
            </div>

            <p className="text-xs text-center text-[#FAF7F2]/50 italic">
              *Interface demonstration data. Active account credentials required to submit live orders.
            </p>
          </div>
        </div>
      </section>

      {/* 10. BECOME A FARMREEM SUPPLY PARTNER */}
      <section className="py-20 bg-[#FAF7F2]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl border border-[#E8E1D3] p-8 lg:p-12 shadow-sm grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-4">
              <span className="text-xs font-bold uppercase tracking-wider text-[#C59B27]">Supply Network Expansion</span>
              <h2 className="text-3xl font-extrabold text-[#0F2E23]">
                Are You a Commercial Poultry Producer or Farm Owner?
              </h2>
              <p className="text-sm text-[#4F5E57] leading-relaxed">
                FarmReem is expanding its partner farm network in Uttarakhand and northern supply zones. We partner with commercial poultry growers maintaining flock health and weight sorting capability.
              </p>
              <div className="pt-2 flex flex-wrap gap-4 text-xs font-semibold text-[#0F2E23]">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-[#C59B27]" />
                  <span>Off-Take Arrangements</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-[#C59B27]" />
                  <span>Prompt Settlement</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-[#C59B27]" />
                  <span>Transparent Weighment</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5 text-left lg:text-right">
              <Link
                href="/become-partner"
                className="bg-[#0F2E23] hover:bg-[#184636] text-white font-bold text-base px-8 py-4 rounded-xl transition-all shadow-lg inline-block"
              >
                Apply as a Supply Partner
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 11. FINAL B2B CTA */}
      <section className="py-20 bg-[#0F2E23] text-white text-center relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 relative z-10">
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            Need Dependable Poultry Supply for Your Kitchen?
          </h2>
          <p className="text-base sm:text-lg text-[#FAF7F2]/80 leading-relaxed max-w-2xl mx-auto">
            Contact FarmReem in Dehradun at +91 8475863634 to discuss live broiler sourcing, weight specifications, and commercial account pricing.
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
          </div>
        </div>
      </section>
    </div>
  );
}
