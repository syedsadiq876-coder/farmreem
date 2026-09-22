"use client";

import { useState } from "react";
import Link from "next/link";
import { Lock, Building2, ShieldCheck, ArrowRight, UserCheck } from "lucide-react";
import Logo from "@/components/layout/Logo";

export default function LoginPage() {
  const [activeTab, setActiveTab] = useState<"customer" | "admin">("customer");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <div className="bg-[#FAF7F2] py-12 lg:py-20 min-h-[75vh] flex items-center justify-center">
      <div className="max-w-md w-full mx-auto px-4 space-y-6">
        {/* Header */}
        <div className="text-center space-y-3 flex flex-col items-center">
          <Logo variant="auth" />
          <p className="text-xs text-[#4F5E57] pt-1">
            Authorized B2B Customer Portal & Admin Operations Desk
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="bg-[#E8E1D3] p-1 rounded-xl flex items-center text-xs font-bold">
          <button
            onClick={() => setActiveTab("customer")}
            className={`flex-1 py-2.5 rounded-lg transition-all ${
              activeTab === "customer"
                ? "bg-[#0F2E23] text-white shadow"
                : "text-[#4F5E57] hover:text-[#0F2E23]"
            }`}
          >
            B2B Customer Login
          </button>
          <button
            onClick={() => setActiveTab("admin")}
            className={`flex-1 py-2.5 rounded-lg transition-all ${
              activeTab === "admin"
                ? "bg-[#0F2E23] text-white shadow"
                : "text-[#4F5E57] hover:text-[#0F2E23]"
            }`}
          >
            FarmReem Admin
          </button>
        </div>

        {/* Login Form (Visual Demonstration) */}
        <div className="bg-white rounded-2xl border border-[#E8E1D3] p-6 sm:p-8 shadow-sm space-y-5">
          <div className="space-y-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#C59B27]">
              {activeTab === "customer" ? "Commercial Kitchen Account" : "Staff Operations Workspace"}
            </span>
            <h2 className="text-lg font-bold text-[#0F2E23]">
              {activeTab === "customer" ? "Customer Portal Sign In" : "Operations Center Sign In"}
            </h2>
          </div>

          <div className="space-y-4">
            <div className="space-y-1">
              <label className="block text-xs font-bold text-[#0F2E23] uppercase tracking-wider">
                Authorized Email Address
              </label>
              <input
                type="email"
                placeholder={activeTab === "customer" ? "buyer@hotelabc.com" : "ops@farmreem.com"}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-[#E8E1D3] bg-[#FAF7F2] text-sm text-[#0F2E23] focus:outline-none focus:ring-2 focus:ring-[#0F2E23]"
              />
            </div>

            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-bold text-[#0F2E23] uppercase tracking-wider">
                  Password
                </label>
                <a href="#" className="text-xs text-[#C59B27] font-semibold hover:underline">
                  Forgot Password?
                </a>
              </div>
              <input
                type="password"
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-[#E8E1D3] bg-[#FAF7F2] text-sm text-[#0F2E23] focus:outline-none focus:ring-2 focus:ring-[#0F2E23]"
              />
            </div>
          </div>

          <div className="p-3 bg-amber-50 rounded-lg border border-amber-200 text-xs text-amber-900 flex items-start gap-2">
            <ShieldCheck className="w-4 h-4 text-amber-700 flex-shrink-0 mt-0.5" />
            <span>
              Stage 1–2 Preview Notice: Full backend authentication and Row Level Security (RLS) activation occur in Stage 6.
            </span>
          </div>

          <button
            type="button"
            className="w-full bg-[#0F2E23] hover:bg-[#184636] text-white font-bold text-sm py-3.5 rounded-xl transition-all shadow flex items-center justify-center gap-2 cursor-pointer"
          >
            Sign In to {activeTab === "customer" ? "Customer Portal" : "Admin Workbench"} <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Footer Link */}
        <div className="text-center text-xs text-[#4F5E57]">
          Don't have an approved account yet?{" "}
          <Link href="/request-pricing" className="font-bold text-[#0F2E23] hover:text-[#C59B27] underline">
            Request B2B Kitchen Account
          </Link>
        </div>
      </div>
    </div>
  );
}
