"use client";

import { useState } from "react";
import Link from "next/link";
import { Lock, ShieldCheck, ArrowRight, AlertCircle } from "lucide-react";
import { ADMIN_BRAND } from "@farmreem/ui";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Operational Authentication Logic simulation/placeholder
    if (!email || !password) {
      setError("Please enter your staff email and password.");
      setLoading(false);
      return;
    }

    // Direct redirect to /dashboard for dev/demo testing
    setTimeout(() => {
      window.location.href = "/dashboard";
    }, 600);
  };

  return (
    <div className="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8 bg-[#FAF7F2]">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center space-y-3">
        <div className="mx-auto w-16 h-16 rounded-2xl bg-[#0F2E23] p-1.5 shadow-xl ring-4 ring-[#C59B27]/20 flex items-center justify-center overflow-hidden">
          {/* Official FarmReem Brand Emblem */}
          <img
            src="/icon.jpg"
            alt="FarmReem Brand Emblem"
            className="w-full h-full object-cover rounded-xl"
          />
        </div>

        <h1 className="text-3xl font-extrabold text-[#0F2E23] tracking-tight">
          Farm<span className="text-[#C59B27]">Reem</span> Admin
        </h1>
        <p className="text-xs font-bold text-[#4F5E57] uppercase tracking-widest">
          Internal Operations Portal · admin.farmreem.com
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 shadow-xl border border-[#E8E1D3] rounded-3xl sm:px-10 space-y-6">
          <div className="bg-[#FAF7F2] p-3.5 rounded-2xl border border-[#E8E1D3] flex items-center gap-3 text-xs text-[#4F5E57]">
            <ShieldCheck className="w-5 h-5 text-emerald-700 flex-shrink-0" />
            <span>Restricted internal system. Unauthenticated attempts are logged and audited.</span>
          </div>

          {error && (
            <div className="bg-rose-50 text-rose-800 p-3.5 rounded-2xl border border-rose-200 flex items-center gap-2 text-xs font-semibold">
              <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-extrabold text-[#0F2E23] uppercase tracking-wider mb-2">
                Staff Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="staff@farmreem.com"
                className="w-full px-4 py-3 rounded-xl border border-[#E8E1D3] focus:ring-2 focus:ring-[#C59B27] focus:outline-none text-sm font-medium bg-[#FAF7F2]/50"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-xs font-extrabold text-[#0F2E23] uppercase tracking-wider">
                  Password
                </label>
                <Link
                  href="/forgot-password"
                  className="text-xs font-bold text-[#C59B27] hover:underline"
                >
                  Forgot Password?
                </Link>
              </div>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full px-4 py-3 rounded-xl border border-[#E8E1D3] focus:ring-2 focus:ring-[#C59B27] focus:outline-none text-sm font-medium bg-[#FAF7F2]/50"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#0F2E23] hover:bg-[#184636] text-white font-extrabold text-sm px-6 py-3.5 rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {loading ? "Authenticating..." : "Sign In to FarmReem OS"}
              <ArrowRight className="w-4 h-4 text-[#C59B27]" />
            </button>
          </form>

          <div className="pt-4 border-t border-[#E8E1D3] text-center">
            <p className="text-[11px] text-[#4F5E57]">
              No public registration. Staff credentials must be provisioned by a FarmReem Super Administrator.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
