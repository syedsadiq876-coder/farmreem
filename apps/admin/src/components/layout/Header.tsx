"use client";

import { useEffect, useState } from "react";
import { LogOut, User, Shield } from "lucide-react";
import { useUser } from "../auth/UserContext";

export default function AdminHeader() {
  const { user } = useUser();
  const [isProduction, setIsProduction] = useState(true);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const hostname = window.location.hostname;
      setIsProduction(hostname === "admin.farmreem.com" || process.env.NODE_ENV === "production");
    }
  }, []);

  const handleSignOut = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } catch (e) {
      // Ignore network errors on logout
    }
    // Clear session cookies & redirect to login
    document.cookie = "__Host-farmreem-admin-session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    document.cookie = "farmreem_admin_dev_session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    window.location.href = "/login";
  };

  const displayName = user?.fullName || "Syed Sadiq";
  const displayRole = user?.role || "SUPER_ADMIN";

  return (
    <header className="h-16 bg-white border-b border-[#E8E1D3] px-6 flex items-center justify-between flex-shrink-0">
      <div className="flex items-center gap-3">
        <span className="bg-[#FAF7F2] text-[#0F2E23] text-xs font-extrabold px-3 py-1 rounded-full border border-[#E8E1D3] flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
          {isProduction ? "Environment: Production" : "Environment: Preview / Staging"}
        </span>
      </div>

      <div className="flex items-center gap-4">
        {/* Dynamic User Identity Info */}
        <div className="flex items-center gap-3 bg-[#FAF7F2] px-3.5 py-1.5 rounded-2xl border border-[#E8E1D3]">
          <div className="w-8 h-8 rounded-full bg-[#0F2E23] text-[#C59B27] flex items-center justify-center font-bold text-xs">
            <User className="w-4 h-4" />
          </div>
          <div className="text-left leading-tight">
            <div className="text-xs font-extrabold text-[#0F2E23]">{displayName}</div>
            <div className="text-[10px] font-bold text-[#C59B27] flex items-center gap-1">
              <Shield className="w-3 h-3" /> {displayRole}
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
