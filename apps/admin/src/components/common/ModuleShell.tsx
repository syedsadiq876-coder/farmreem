"use client";

import React from "react";
import { Shield, Clock, Construction } from "lucide-react";
import { useUser } from "@/components/auth/UserContext";

interface ModuleShellProps {
  title: string;
  category: string;
  description: string;
  icon: React.ElementType;
}

export default function ModuleShell({
  title,
  category,
  description,
  icon: Icon,
}: ModuleShellProps) {
  const { user } = useUser();
  const userName = user?.fullName || "Syed Sadiq";
  const userRole = user?.role || "SUPER_ADMIN";

  return (
    <div className="space-y-6">
      {/* Top Header Card */}
      <div className="bg-white p-6 rounded-3xl border border-[#E8E1D3] shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-[#0F2E23] text-[#C59B27] flex items-center justify-center font-extrabold shadow-md">
            <Icon className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-extrabold text-[#C59B27] uppercase tracking-wider bg-[#FAF7F2] px-2.5 py-0.5 rounded-md border border-[#E8E1D3]">
                {category}
              </span>
              <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-md border border-amber-200 flex items-center gap-1">
                <Clock className="w-3 h-3" /> Setup in Progress
              </span>
            </div>
            <h1 className="text-xl font-extrabold text-[#0F2E23] tracking-tight mt-1">
              {title}
            </h1>
            <p className="text-xs text-[#4F5E57] mt-0.5">{description}</p>
          </div>
        </div>

        {/* Authenticated Staff Badge */}
        <div className="bg-[#FAF7F2] p-3 rounded-2xl border border-[#E8E1D3] flex items-center gap-3">
          <div className="text-right leading-tight text-xs">
            <div className="font-extrabold text-[#0F2E23]">{userName}</div>
            <div className="text-[10px] font-bold text-[#C59B27] flex items-center justify-end gap-1">
              <Shield className="w-3 h-3" /> {userRole}
            </div>
          </div>
        </div>
      </div>

      {/* Production Module Setup State (Zero Mock Data) */}
      <div className="bg-white p-10 rounded-3xl border border-[#E8E1D3] shadow-sm text-center max-w-2xl mx-auto space-y-5 my-8">
        <div className="w-16 h-16 rounded-3xl bg-[#FAF7F2] text-[#0F2E23] border border-[#E8E1D3] flex items-center justify-center mx-auto shadow-inner">
          <Construction className="w-8 h-8 text-[#C59B27]" />
        </div>

        <div className="space-y-2">
          <h2 className="text-lg font-extrabold text-[#0F2E23]">
            {title} Module Setup in Progress
          </h2>
          <p className="text-xs text-[#4F5E57] leading-relaxed max-w-lg mx-auto">
            The operational schema and live API integration for {title.toLowerCase()} are currently being provisioned for Phase 2. Zero mock data is generated to preserve production integrity.
          </p>
        </div>

        <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
          <div className="text-[11px] font-bold text-[#0F2E23] bg-[#FAF7F2] px-4 py-2 rounded-xl border border-[#E8E1D3] flex items-center gap-1.5">
            <Shield className="w-3.5 h-3.5 text-[#C59B27]" /> Access Granted for {userRole}
          </div>
        </div>
      </div>
    </div>
  );
}
