import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Terms of Service | FarmReem B2B Poultry Supply",
  description: "FarmReem terms of service governing website use, commercial quotations, and B2B account supply terms.",
  alternates: {
    canonical: "https://farmreem.com/terms",
  },
  openGraph: {
    title: "Terms of Service | FarmReem",
    description: "FarmReem B2B website use and commercial transaction terms.",
    url: "https://farmreem.com/terms",
  },
};

export default function TermsPage() {
  return (
    <div className="bg-[#FAF7F2] py-12 lg:py-20 text-[#0F2E23]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Header */}
        <div className="space-y-3 pb-6 border-b border-[#E8E1D3]">
          <span className="text-xs font-extrabold uppercase tracking-wider text-[#C59B27]">
            Legal & Governance
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-[#0F2E23] tracking-tight">
            Terms of Service
          </h1>
          <p className="text-xs text-[#4F5E57]">
            Effective Date: September 2026 · FarmReem Sourcing & Logistics (farmreem.com)
          </p>
        </div>

        {/* Content Section */}
        <div className="bg-white rounded-3xl border border-[#E8E1D3] p-6 sm:p-12 shadow-sm space-y-8 text-sm text-[#4F5E57] leading-relaxed">
          
          <div className="space-y-3">
            <h2 className="text-lg font-extrabold text-[#0F2E23]">1. Website Use & Purpose</h2>
            <p>
              The FarmReem website (farmreem.com) provides informational content, pricing request forms, and commercial account application gateways for B2B foodservice buyers, hotels, restaurants, caterers, and institutional kitchens.
            </p>
          </div>

          <div className="space-y-3">
            <h2 className="text-lg font-extrabold text-[#0F2E23]">2. Commercial Quotations & Account Contracts</h2>
            <p>
              Information presented on this website does not constitute a binding unilateral offer. All commercial pricing, weight specifications, delivery schedules, and weighment terms are confirmed individually through executed B2B account agreements or written quotations issued by FarmReem.
            </p>
          </div>

          <div className="space-y-3">
            <h2 className="text-lg font-extrabold text-[#0F2E23]">3. Product Availability & Specifications</h2>
            <p>
              Live broiler supply availability, weight bands (e.g. 1.8–2.0 kg), and delivery slots are subject to farm production schedules and regional sourcing capacity. FarmReem reserves the right to adjust account schedules with advance notification to customer purchasing desks.
            </p>
          </div>

          <div className="space-y-3">
            <h2 className="text-lg font-extrabold text-[#0F2E23]">4. Intellectual Property</h2>
            <p>
              All content, branding, trademarks, logos, and visual design assets displayed on farmreem.com are the property of FarmReem Sourcing & Logistics and protected under applicable intellectual property laws.
            </p>
          </div>

          <div className="space-y-3">
            <h2 className="text-lg font-extrabold text-[#0F2E23]">5. Limitation of Liability</h2>
            <p>
              While FarmReem makes reasonable efforts to maintain accurate website information, content is provided "as is" for informational purposes. Actual delivery logistics and commercial obligations are governed strictly by account contracts.
            </p>
          </div>

          <div className="space-y-3">
            <h2 className="text-lg font-extrabold text-[#0F2E23]">6. Contact Information</h2>
            <p>For inquiries regarding commercial terms or website governance:</p>
            <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#E8E1D3] space-y-1 text-xs font-medium text-[#0F2E23]">
              <p className="font-extrabold">FarmReem Sourcing & Logistics</p>
              <p>39, Siddharth Vihar, Kandoli, Sahastradhara Road, Dehradun, Uttarakhand 248001, India</p>
              <p>Email: <a href="mailto:contact@farmreem.com" className="text-[#C59B27] underline">contact@farmreem.com</a> | Phone: <a href="tel:+918475863634" className="text-[#C59B27] underline">+91 8475863634</a></p>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
