"use client";

import { useState } from "react";
import Link from "next/link";
import { Lock, ArrowRight, ShieldCheck, UserPlus } from "lucide-react";
import Logo from "@/components/layout/Logo";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <div className="bg-[#FAF7F2] py-12 lg:py-20 min-h-[75vh] flex items-center justify-center">
      <div className="max-w-md w-full mx-auto px-4 space-y-6">
        
        {/* Header */}
        <div className="text-center space-y-3 flex flex-col items-center">
          <Logo variant="auth" />
          <p className="text-xs text-[#4F5E57] pt-1">
            Authorized B2B Customer Portal
          </p>
        </div>

        {/* Login Form Container */}
        <div className="bg-white rounded-2xl border border-[#E8E1D3] p-6 sm:p-8 shadow-sm space-y-5">
          <div className="space-y-1 text-center">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#C59B27]">
              Commercial Account Access
            </span>
            <h1 className="text-xl font-extrabold text-[#0F2E23]">
              B2B Customer Login
            </h1>
          </div>

          <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
            <div className="space-y-1">
              <label className="block text-xs font-bold text-[#0F2E23] uppercase tracking-wider">
                Email Address
              </label>
              <input
                type="email"
                placeholder="chef@hotelabc.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-[#E8E1D3] bg-[#FAF7F2] text-sm text-[#0F2E23] focus:outline-none focus:ring-2 focus:ring-[#0F2E23]"
                required
              />
            </div>

            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-bold text-[#0F2E23] uppercase tracking-wider">
                  Password
                </label>
                <Link href="/forgot-password" className="text-xs text-[#C59B27] font-semibold hover:underline">
                  Forgot Password?
                </Link>
              </div>
              <input
                type="password"
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-[#E8E1D3] bg-[#FAF7F2] text-sm text-[#0F2E23] focus:outline-none focus:ring-2 focus:ring-[#0F2E23]"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-[#0F2E23] hover:bg-[#184636] text-[#FAF7F2] font-extrabold py-3.5 rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer text-sm"
            >
              <Lock className="w-4 h-4 text-[#C59B27]" />
              B2B Customer Login
            </button>
          </form>
        </div>

        {/* Apply for B2B Account Card */}
        <div className="bg-[#FFFDF9] rounded-2xl border border-[#E8E1D3] p-5 text-center space-y-2 shadow-sm">
          <h2 className="text-sm font-extrabold text-[#0F2E23]">New to FarmReem?</h2>
          <p className="text-xs text-[#4F5E57]">
            Register your hotel, restaurant, caterer or institution to setup scheduled morning poultry supply.
          </p>
          <div className="pt-2">
            <Link
              href="/register"
              className="inline-flex items-center justify-center gap-2 text-xs font-extrabold text-[#0F2E23] hover:text-[#C59B27] bg-[#FAF7F2] border border-[#E8E1D3] px-5 py-2.5 rounded-xl transition-colors w-full sm:w-auto"
            >
              <UserPlus className="w-4 h-4 text-[#C59B27]" />
              Apply for a B2B Account
              <ArrowRight className="w-3.5 h-3.5 text-[#C59B27]" />
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
