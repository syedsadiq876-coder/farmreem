import Link from "next/link";
import { Lock, ArrowRight, ShieldCheck, CheckCircle2 } from "lucide-react";

export const metadata = {
  title: "Live Broilers, Chicken Cuts & B2B Poultry Supply | FarmReem",
  description:
    "Explore live-bird sizes and FarmReem's growing range of whole, cut and boneless poultry supply options for professional kitchens.",
  alternates: {
    canonical: "https://www.farmreem.com/products",
  },
  openGraph: {
    title: "Live Broilers, Chicken Cuts & B2B Poultry Supply | FarmReem",
    description:
      "Explore live-bird sizes and FarmReem's growing range of whole, cut and boneless poultry supply options for professional kitchens.",
    url: "https://www.farmreem.com/products",
  },
};

export default function ProductsPage() {
  const productGroups = [
    {
      groupId: "group-a",
      title: "PRODUCT GROUP A · LIVE BIRDS",
      subtitle: "Live commercial broiler supply categorized by typical working weight ranges for predictable kitchen yields.",
      status: "AVAILABLE",
      statusBadge: "bg-emerald-100 text-emerald-800 border-emerald-300",
      items: [
        {
          name: "Small Live Broiler",
          range: "800 g – 1.0 kg",
          useCase: "Whole-bird / tandoor / smaller-portion requirements",
          status: "AVAILABLE",
          badge: "bg-emerald-100 text-emerald-800 border-emerald-300",
          desc: "Preferred for specialized tandoori preparation and smaller portioning.",
        },
        {
          name: "Medium Live Broiler",
          range: "1.0 kg – 1.4 kg",
          useCase: "General restaurant / curry / portion requirements",
          status: "AVAILABLE",
          badge: "bg-emerald-100 text-emerald-800 border-emerald-300",
          desc: "Standard commercial size preferred by standalone restaurants and casual dining.",
        },
        {
          name: "Large Live Broiler",
          range: "1.4 kg – 1.8 kg",
          useCase: "Larger portions / banquet / higher-yield requirements",
          status: "AVAILABLE",
          badge: "bg-emerald-100 text-emerald-800 border-emerald-300",
          desc: "Heavy weight live broilers preferred for banquet catering and high-volume meat yield.",
        },
        {
          name: "Custom Weight Requirement",
          range: "Account Specific",
          useCase: "Tailored weight specification per commercial contract",
          status: "AVAILABLE",
          badge: "bg-emerald-100 text-emerald-800 border-emerald-300",
          desc: "Custom weight ranges agreed for standing B2B account orders.",
        },
      ],
    },
    {
      groupId: "group-b",
      title: "PRODUCT GROUP B · WHOLE / DRESSED CHICKEN",
      subtitle: "Processed whole chicken capability supplied through the FarmReem supply network.",
      status: "ON REQUEST",
      statusBadge: "bg-amber-100 text-amber-900 border-amber-300",
      items: [
        {
          name: "Whole Dressed Chicken",
          range: "Standard Yield",
          useCase: "General roasting and kitchen portioning",
          status: "ON REQUEST",
          badge: "bg-amber-100 text-amber-900 border-amber-300",
          desc: "Clean whole dressed bird with giblets removed.",
        },
        {
          name: "Whole Chicken Skin-On",
          range: "Portioned to Spec",
          useCase: "Crispy skin applications and roast chicken",
          status: "ON REQUEST",
          badge: "bg-amber-100 text-amber-900 border-amber-300",
          desc: "Hygienically processed whole chicken with skin intact.",
        },
        {
          name: "Whole Chicken Skinless",
          range: "Portioned to Spec",
          useCase: "Health-focused menus and lean preparation",
          status: "ON REQUEST",
          badge: "bg-amber-100 text-amber-900 border-amber-300",
          desc: "Dressed chicken with skin completely removed.",
        },
        {
          name: "Whole Tandoori Bird",
          range: "800 g – 1.1 kg",
          useCase: "Tandoori marinades and whole grill preparation",
          status: "ON REQUEST",
          badge: "bg-amber-100 text-amber-900 border-amber-300",
          desc: "Small size dressed whole bird scored for marinade absorption.",
        },
        {
          name: "Half Chicken",
          range: "Half Bird Cuts",
          useCase: "Buffet lines and half-portion menu items",
          status: "ON REQUEST",
          badge: "bg-amber-100 text-amber-900 border-amber-300",
          desc: "Halved whole dressed chicken cut along the backbone.",
        },
      ],
    },
    {
      groupId: "group-c",
      title: "PRODUCT GROUP C · CUT CHICKEN",
      subtitle: "Portioned curry and speciality cuts for commercial menu preparation.",
      status: "ON REQUEST",
      statusBadge: "bg-amber-100 text-amber-900 border-amber-300",
      items: [
        {
          name: "Curry Cut (Standard)",
          range: "12 – 16 Pieces / KG",
          useCase: "Commercial curry and gravies",
          status: "ON REQUEST",
          badge: "bg-amber-100 text-amber-900 border-amber-300",
          desc: "Mixed bone-in chicken cuts suitable for standard Indian curries.",
        },
        {
          name: "Small Curry Cut",
          range: "18 – 22 Pieces / KG",
          useCase: "Thick gravies and fast-cooking curries",
          status: "ON REQUEST",
          badge: "bg-amber-100 text-amber-900 border-amber-300",
          desc: "Smaller piece size for quick cooking and high piece count per portion.",
        },
        {
          name: "Medium Curry Cut",
          range: "14 – 16 Pieces / KG",
          useCase: "Restaurant ala-carte curry orders",
          status: "ON REQUEST",
          badge: "bg-amber-100 text-amber-900 border-amber-300",
          desc: "Balanced piece sizing for standard restaurant menu items.",
        },
        {
          name: "Large Curry Cut",
          range: "8 – 10 Pieces / KG",
          useCase: "Banquet buffet spreads and heavy curry portions",
          status: "ON REQUEST",
          badge: "bg-amber-100 text-amber-900 border-amber-300",
          desc: "Substantial piece sizing for high-end banquets and catering.",
        },
        {
          name: "Biryani Cut",
          range: "6 – 8 Pieces / KG",
          useCase: "Commercial Dum Biryani preparation",
          status: "ON REQUEST",
          badge: "bg-amber-100 text-amber-900 border-amber-300",
          desc: "Large bone-in cuts specified for long dum cooking times without fragmenting.",
        },
        {
          name: "Tandoori Cut",
          range: "4 Pieces / Bird",
          useCase: "Tandoori chicken platters",
          status: "ON REQUEST",
          badge: "bg-amber-100 text-amber-900 border-amber-300",
          desc: "4-piece whole bird cut (2 leg quarters, 2 breast quarters) with deep cuts.",
        },
        {
          name: "Custom Cut Specification",
          range: "Account Specific",
          useCase: "Custom piece counts and skin preferences",
          status: "ON REQUEST",
          badge: "bg-amber-100 text-amber-900 border-amber-300",
          desc: "Custom butchery cuts tailored to hotel standard operating procedures.",
        },
      ],
    },
    {
      groupId: "group-d",
      title: "PRODUCT GROUP D · LEGS / THIGHS",
      subtitle: "Leg quarters, drumsticks, and thigh portions for specialized dish requirements.",
      status: "ON REQUEST",
      statusBadge: "bg-amber-100 text-amber-900 border-amber-300",
      items: [
        {
          name: "Drumstick",
          range: "Bone-in Leg",
          useCase: "Starter platters, fried chicken, and appetizers",
          status: "ON REQUEST",
          badge: "bg-amber-100 text-amber-900 border-amber-300",
          desc: "Clean drumsticks with uniform bone length.",
        },
        {
          name: "Whole Leg",
          range: "Leg Quarter",
          useCase: "Roast leg, tandoori leg, and main course platters",
          status: "ON REQUEST",
          badge: "bg-amber-100 text-amber-900 border-amber-300",
          desc: "Full leg quarter combining drumstick and thigh.",
        },
        {
          name: "Thigh (Bone-In)",
          range: "Juicy Dark Meat",
          useCase: "Slow-cooked gravies and braised dishes",
          status: "ON REQUEST",
          badge: "bg-amber-100 text-amber-900 border-amber-300",
          desc: "Flavorful bone-in chicken thigh cuts.",
        },
        {
          name: "Boneless Thigh",
          range: "Skinless Boneless",
          useCase: "Tikka skewers, kebabs, and burgers",
          status: "ON REQUEST",
          badge: "bg-amber-100 text-amber-900 border-amber-300",
          desc: "Deboned dark meat preferred for juicy kebabs and grilling.",
        },
        {
          name: "Tikka-size Boneless Thigh",
          range: "Diced Cubes",
          useCase: "Chicken Tikka and kebab prep",
          status: "ON REQUEST",
          badge: "bg-amber-100 text-amber-900 border-amber-300",
          desc: "Pre-cubed boneless thigh meat for immediate marination.",
        },
      ],
    },
    {
      groupId: "group-e",
      title: "PRODUCT GROUP E · BREAST",
      subtitle: "Lean white meat cuts, fillets, and boneless breast portions.",
      status: "ON REQUEST",
      statusBadge: "bg-amber-100 text-amber-900 border-amber-300",
      items: [
        {
          name: "Breast with Bone",
          range: "Bone-In White Meat",
          useCase: "Soups, stocks, and bone-in roasting",
          status: "ON REQUEST",
          badge: "bg-amber-100 text-amber-900 border-amber-300",
          desc: "Whole breast section with sternum bone intact.",
        },
        {
          name: "Boneless Breast Fillet",
          range: "Single / Double Fillet",
          useCase: "Schnittzels, grilled chicken, and continental mains",
          status: "ON REQUEST",
          badge: "bg-amber-100 text-amber-900 border-amber-300",
          desc: "Trimmed boneless breast fillets.",
        },
        {
          name: "Breast Cubes",
          range: "Diced 20–30 g",
          useCase: "Chilli chicken, stir-fries, and pasta",
          status: "ON REQUEST",
          badge: "bg-amber-100 text-amber-900 border-amber-300",
          desc: "Uniformly diced breast cubes for quick wok cooking.",
        },
        {
          name: "Breast Strips / Finger Cut",
          range: "Strip Cut",
          useCase: "Chicken tenders, finger foods, and wraps",
          status: "ON REQUEST",
          badge: "bg-amber-100 text-amber-900 border-amber-300",
          desc: "Elongated breast strips prepared for breading and frying.",
        },
      ],
    },
    {
      groupId: "group-f",
      title: "PRODUCT GROUP F · WINGS",
      subtitle: "Whole wings, winglets, and lollipop cuts for bar menus and starters.",
      status: "ON REQUEST",
      statusBadge: "bg-amber-100 text-amber-900 border-amber-300",
      items: [
        {
          name: "Whole Wings",
          range: "3-Joint Wings",
          useCase: "BBQ wings and buffet starters",
          status: "ON REQUEST",
          badge: "bg-amber-100 text-amber-900 border-amber-300",
          desc: "Full wing comprising drumette, flat, and tip.",
        },
        {
          name: "Winglets (Drumette & Flat)",
          range: "2-Joint Cuts",
          useCase: "Buffalo wings and pub snacks",
          status: "ON REQUEST",
          badge: "bg-amber-100 text-amber-900 border-amber-300",
          desc: "Separated drumettes and wing flats with tips removed.",
        },
        {
          name: "Chicken Lollipop",
          range: "Frenzied Drumette",
          useCase: "Indo-Chinese starters and appetizers",
          status: "ON REQUEST",
          badge: "bg-amber-100 text-amber-900 border-amber-300",
          desc: "Cleanly frenched wing drumettes shaped into lollipops.",
        },
      ],
    },
    {
      groupId: "group-g",
      title: "PRODUCT GROUP G · OTHER POULTRY",
      subtitle: "Minced meat and specialized poultry offal components.",
      status: "COMING SOON",
      statusBadge: "bg-slate-100 text-slate-700 border-slate-300",
      items: [
        {
          name: "Chicken Keema / Mince",
          range: "Coarse / Fine Grind",
          useCase: "Keema parathas, seekh kebabs, and stuffing",
          status: "COMING SOON",
          badge: "bg-slate-100 text-slate-700 border-slate-300",
          desc: "Freshly ground chicken mince under development for future release.",
        },
        {
          name: "Liver & Gizzard",
          range: "Offal Component",
          useCase: "Specialty starters and traditional dishes",
          status: "COMING SOON",
          badge: "bg-slate-100 text-slate-700 border-slate-300",
          desc: "Cleaned poultry liver and gizzard components.",
        },
        {
          name: "Neck & Feet",
          range: "Stock Components",
          useCase: "Rich broth and stock reduction",
          status: "COMING SOON",
          badge: "bg-slate-100 text-slate-700 border-slate-300",
          desc: "Gelatin-rich stock ingredients for soup bases.",
        },
      ],
    },
  ];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: "FarmReem B2B Poultry Supply Catalogue",
    brand: {
      "@type": "Brand",
      name: "FarmReem",
    },
    description:
      "Explore live-bird sizes and FarmReem's growing range of whole, cut and boneless poultry supply options for professional kitchens.",
    category: "Foodservice Poultry Supply",
  };

  return (
    <div className="bg-[#FAF7F2] py-12 lg:py-20 text-[#111A17]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Header */}
        <div className="max-w-4xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#0F2E23]/10 text-[#0F2E23] text-xs font-bold uppercase tracking-wider">
            B2B Poultry Product Catalogue
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-[#0F2E23] tracking-tight">
            Poultry supply for different kitchen requirements.
          </h1>
          <p className="text-base text-[#4F5E57] leading-relaxed">
            Explore live-bird sizes and FarmReem's growing range of whole, cut and boneless poultry supply options for professional kitchens.
          </p>
        </div>

        {/* Pricing Notice & Network Disclaimer */}
        <div className="bg-white border border-[#E8E1D3] rounded-2xl p-5 flex items-start gap-4 shadow-sm text-xs text-[#4F5E57]">
          <Lock className="w-5 h-5 text-[#C59B27] flex-shrink-0 mt-0.5" />
          <div className="space-y-1">
            <span className="font-bold text-[#0F2E23] block text-sm">
              Account-Specific B2B Pricing & Network Supply
            </span>
            <p>
              Live broiler supply is currently available for direct commercial orders. Processed, cut, and boneless chicken products are supplied through the FarmReem supply network upon commercial account confirmation.
            </p>
          </div>
        </div>

        {/* Product Groups */}
        <div className="space-y-14">
          {productGroups.map((group, idx) => (
            <div key={idx} id={group.groupId} className="space-y-6 pt-4">
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#E8E1D3] pb-4">
                <div>
                  <h2 className="text-xl sm:text-2xl font-extrabold text-[#0F2E23]">
                    {group.title}
                  </h2>
                  <p className="text-xs text-[#4F5E57] mt-0.5">{group.subtitle}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-extrabold border ${group.statusBadge}`}>
                  {group.status}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {group.items.map((item, itemIdx) => (
                  <div
                    key={itemIdx}
                    className="bg-white rounded-2xl border border-[#E8E1D3] p-6 shadow-sm space-y-4 flex flex-col justify-between hover:shadow-md transition-shadow"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between gap-2">
                        <span className={`px-2.5 py-0.5 rounded text-[10px] font-extrabold border ${item.badge}`}>
                          {item.status}
                        </span>
                        <span className="text-[10px] font-bold text-[#4F5E57] uppercase bg-[#FAF7F2] px-2 py-0.5 rounded border border-[#E8E1D3]">
                          {item.range}
                        </span>
                      </div>

                      <h3 className="text-lg font-bold text-[#0F2E23]">{item.name}</h3>
                      <p className="text-xs text-[#4F5E57] leading-relaxed">{item.desc}</p>

                      <div className="p-3 rounded-xl bg-[#FAF7F2] border border-[#E8E1D3] text-[11px] text-[#0F2E23]">
                        <span className="font-bold block text-[#4F5E57]">Kitchen Application:</span>
                        <span>{item.useCase}</span>
                      </div>
                    </div>

                    <div className="pt-2">
                      <Link
                        href="/request-pricing"
                        className="w-full bg-[#0F2E23] hover:bg-[#184636] text-[#FAF7F2] font-extrabold text-xs py-3 rounded-xl transition-all shadow-sm text-center flex items-center justify-center gap-1.5 group"
                      >
                        Request Supply
                        <ArrowRight className="w-3.5 h-3.5 text-[#C59B27] group-hover:translate-x-1 transition-transform" />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Footer CTA */}
        <div className="bg-[#0F2E23] rounded-3xl text-white p-8 lg:p-14 text-center space-y-4 shadow-xl">
          <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
            Need custom bird sizes or specific portion cuts?
          </h2>
          <p className="text-sm text-[#FAF7F2]/80 max-w-2xl mx-auto">
            FarmReem works with commercial kitchens in Dehradun to coordinate poultry supply around exact operational requirements.
          </p>
          <div className="pt-3">
            <Link
              href="/request-pricing"
              className="bg-[#C59B27] hover:bg-[#b0881f] text-[#0F2E23] font-extrabold text-sm px-9 py-4 rounded-xl transition-all inline-block shadow-lg"
            >
              Tell Us Your Requirement
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
