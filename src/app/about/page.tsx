import Link from "next/link";
import Image from "next/image";
import { Building2, ShieldCheck, Truck, Scale, Users } from "lucide-react";

export const metadata = {
  title: "About FarmReem | B2B Poultry Sourcing & Logistics",
  description: "FarmReem is a technology-enabled B2B foodservice supply company delivering reliable live broiler sourcing for hotels, restaurants, caterers and institutions.",
};

export default function AboutPage() {
  return (
    <div className="bg-[#FAF7F2] py-12 lg:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Header */}
        <div className="max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0F2E23]/10 text-[#0F2E23] text-xs font-bold uppercase tracking-wider">
            About FarmReem
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-[#0F2E23] tracking-tight">
            Modernizing B2B Poultry & Foodservice Logistics
          </h1>
          <p className="text-base text-[#4F5E57] leading-relaxed">
            FarmReem was established to solve a fundamental challenge faced by professional kitchens: traditional poultry markets are fragmented, prone to weight inconsistency, and lack scheduled delivery guarantees.
          </p>
        </div>

        {/* Story Section */}
        <div className="bg-white rounded-2xl border border-[#E8E1D3] p-8 lg:p-12 shadow-sm space-y-6">
          <h2 className="text-2xl font-bold text-[#0F2E23]">Our Operational Vision</h2>
          <p className="text-sm text-[#4F5E57] leading-relaxed">
            FarmReem operates as a specialized B2B foodservice supply and logistics partner. We bridge commercial poultry production with professional kitchens by offering specified bird weight bands, scheduled morning deliveries, transparent dual weighment slips, and B2B credit terms.
          </p>
          <p className="text-sm text-[#4F5E57] leading-relaxed">
            While our Day-1 core capability focuses on live broiler procurement and distribution, we are actively building owned biosecure farm capacity and expanding our digital procurement architecture to support future processed and chilled poultry categories.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-6 border-t border-[#E8E1D3]">
            <div className="space-y-1">
              <span className="text-xs font-bold uppercase tracking-wider text-[#C59B27]">Core Customers</span>
              <p className="font-bold text-[#0F2E23] text-base">Hotels, Restaurants, Caterers, Banquets & Institutions</p>
            </div>
            <div className="space-y-1">
              <span className="text-xs font-bold uppercase tracking-wider text-[#C59B27]">Core Product</span>
              <p className="font-bold text-[#0F2E23] text-base">Live Broiler Sourcing & Scheduled Delivery</p>
            </div>
            <div className="space-y-1">
              <span className="text-xs font-bold uppercase tracking-wider text-[#C59B27]">Sourcing Architecture</span>
              <p className="font-bold text-[#0F2E23] text-base">FarmReem Farms + Partner Farms + Wholesale</p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="bg-[#0F2E23] text-white rounded-2xl p-8 lg:p-12 text-center space-y-4">
          <h2 className="text-2xl sm:text-3xl font-bold">Partner with FarmReem</h2>
          <p className="text-sm text-[#FAF7F2]/80 max-w-2xl mx-auto">
            Open a commercial account or join our farm supply network today.
          </p>
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/request-pricing"
              className="bg-[#C59B27] hover:bg-[#b0881f] text-[#0F2E23] font-bold text-sm px-8 py-3.5 rounded-xl transition-all shadow"
            >
              Request B2B Kitchen Pricing
            </Link>
            <Link
              href="/become-partner"
              className="bg-[#184636] hover:bg-[#205945] text-white font-semibold text-sm px-7 py-3.5 rounded-xl border border-[#25634e] transition-colors"
            >
              Apply as a Supply Partner
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
