"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import Logo from "@/components/layout/Logo";

export default function ResetPasswordPage() {
  const [submitted, setSubmitted] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="bg-[#FAF7F2] py-12 lg:py-20 min-h-[75vh] flex items-center justify-center">
      <div className="max-w-md w-full mx-auto px-4 space-y-6">
        <div className="text-center space-y-3 flex flex-col items-center">
          <Logo variant="auth" />
          <p className="text-xs text-[#4F5E57] pt-1">
            B2B Account Password Reset
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-[#E8E1D3] p-6 sm:p-8 shadow-sm space-y-5">
          {submitted ? (
            <div className="text-center space-y-4">
              <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
              <h2 className="text-xl font-bold text-[#0F2E23]">Password Reset Complete</h2>
              <p className="text-xs text-[#4F5E57]">
                Your password has been updated. You can now sign in to your FarmReem portal.
              </p>
              <Link
                href="/login"
                className="inline-block bg-[#0F2E23] text-white font-bold text-xs px-6 py-3 rounded-xl"
              >
                Sign In to Portal
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#C59B27]">
                  New Security Credentials
                </span>
                <h2 className="text-lg font-bold text-[#0F2E23]">Set New Password</h2>
              </div>

              <div className="space-y-3 pt-2">
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-[#0F2E23] uppercase tracking-wider">
                    New Password
                  </label>
                  <input
                    type="password"
                    required
                    placeholder="••••••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-[#E8E1D3] bg-[#FAF7F2] text-sm text-[#0F2E23] focus:outline-none focus:ring-2 focus:ring-[#0F2E23]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-bold text-[#0F2E23] uppercase tracking-wider">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    required
                    placeholder="••••••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-[#E8E1D3] bg-[#FAF7F2] text-sm text-[#0F2E23] focus:outline-none focus:ring-2 focus:ring-[#0F2E23]"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-[#0F2E23] hover:bg-[#184636] text-white font-bold text-sm py-3.5 rounded-xl transition-all shadow flex items-center justify-center gap-2 cursor-pointer"
              >
                Save New Password <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
