import Link from "next/link";
import { Lock, Phone, UserPlus, ArrowRight, MessageSquare } from "lucide-react";
import Logo from "@/components/layout/Logo";

export const metadata = {
  title: "FarmReem B2B Portal",
  description: "Customer portal access notice for FarmReem commercial accounts.",
  alternates: {
    canonical: "https://www.farmreem.com/login",
  },
};

export default function LoginPage() {
  return (
    <div className="bg-[#FAF7F2] py-12 lg:py-20 min-h-[75vh] text-[#111A17] flex items-center justify-center">
      <div className="max-w-md w-full mx-auto px-4 space-y-6">
        
        {/* Header */}
        <div className="text-center space-y-3 flex flex-col items-center">
          <Logo variant="auth" />
          <p className="text-xs text-[#4F5E57] pt-1 font-semibold">
            B2B Foodservice Portal
          </p>
        </div>

        {/* Portal Preparation Notice */}
        <div className="bg-white rounded-3xl border border-[#E8E1D3] p-6 sm:p-8 shadow-sm space-y-5 text-center">
          <div className="w-12 h-12 rounded-2xl bg-[#FAF7F2] border border-[#E8E1D3] flex items-center justify-center text-[#C59B27] mx-auto">
            <Lock className="w-6 h-6" />
          </div>

          <div className="space-y-2">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#C59B27]">
              Customer Portal Access
            </span>
            <h1 className="text-2xl font-extrabold text-[#0F2E23]">
              FarmReem B2B Portal
            </h1>
            <p className="text-sm text-[#4F5E57] leading-relaxed">
              Customer portal access is being prepared. Digital ordering and portal features will be activated for verified B2B accounts.
            </p>
          </div>

          <div className="pt-2 space-y-3">
            <Link
              href="/contact"
              className="w-full bg-[#0F2E23] hover:bg-[#184636] text-[#FAF7F2] font-extrabold text-sm py-3.5 px-6 rounded-xl transition-all shadow-md flex items-center justify-center gap-2"
            >
              <Phone className="w-4 h-4 text-[#C59B27]" />
              Existing / Future Customer: Contact FarmReem
            </Link>

            <Link
              href="/register"
              className="w-full bg-[#FAF7F2] hover:bg-white text-[#0F2E23] font-bold text-xs py-3 px-5 rounded-xl border border-[#E8E1D3] transition-colors flex items-center justify-center gap-2"
            >
              <UserPlus className="w-4 h-4 text-[#C59B27]" />
              New Customer: Apply for a B2B Account
            </Link>
          </div>
        </div>

        <p className="text-[11px] text-[#4F5E57] text-center">
          For urgent supply inquiries or order modifications, call <a href="tel:+918475863634" className="font-bold underline text-[#0F2E23]">+91 8475863634</a>
        </p>

      </div>
    </div>
  );
}
