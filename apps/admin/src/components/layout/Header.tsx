"use client";

import { LogOut, User, Shield } from "lucide-react";

export default function AdminHeader() {
  const handleSignOut = () => {
    // Clear session cookies & redirect to login
    document.cookie = "__Host-farmreem-admin-session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    document.cookie = "farmreem_admin_dev_session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    window.location.href = "/login";
  };

  return (
    <header className="h-16 bg-white border-b border-[#E8E1D3] px-6 flex items-center justify-between flex-shrink-0">
      <div className="flex items-center gap-3">
        <span className="bg-[#FAF7F2] text-[#0F2E23] text-xs font-extrabold px-3 py-1 rounded-full border border-[#E8E1D3] flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-600" />
          Environment: Preview / Staging
        </span>
      </div>

      <div className="flex items-center gap-4">
        {/* User Identity Info */}
        <div className="flex items-center gap-3 bg-[#FAF7F2] px-3.5 py-1.5 rounded-2xl border border-[#E8E1D3]">
          <div className="w-8 h-8 rounded-full bg-[#0F2E23] text-[#C59B27] flex items-center justify-center font-bold text-xs">
            <User className="w-4 h-4" />
          </div>
          <div className="text-left leading-tight">
            <div className="text-xs font-extrabold text-[#0F2E23]">Syed Sadiq</div>
            <div className="text-[10px] font-bold text-[#C59B27] flex items-center gap-1">
              <Shield className="w-3 h-3" /> SUPER_ADMIN
            </div>
          </div>
        </div>

        {/* Sign Out Button */}
        <button
          onClick={handleSignOut}
          title="Sign Out"
          className="p-2 text-[#4F5E57] hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer"
        >
          <LogOut className="w-5 h-5" />
        </button>
      </div>
    </header>
  );
}
