"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ShieldCheck, ArrowRight, AlertCircle, ShieldAlert } from "lucide-react";

export default function ActivatePage() {
  const [targetUrl, setTargetUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isRedirecting, setIsRedirecting] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const queryParams = new URLSearchParams(window.location.search);
      const rawTarget = queryParams.get("target") || queryParams.get("url");

      if (!rawTarget) {
        setError("Activation link is missing required parameters. Please request a new activation link.");
        return;
      }

      try {
        const parsed = new URL(rawTarget);

        // Open-Redirect Protection: Strict domain, path, and redirect_to validation
        const isAllowedDomain = parsed.hostname.endsWith(".supabase.co") || parsed.hostname === "supabase.co";
        const isAllowedPath = parsed.pathname === "/auth/v1/verify";
        const redirectToParam = parsed.searchParams.get("redirect_to") || "";
        const isAllowedRedirect = redirectToParam.includes("/set-password");

        if (!isAllowedDomain || !isAllowedPath || !isAllowedRedirect) {
          setError("Unauthorized or malformed activation link destination.");
          return;
        }

        // Store validated target URL (DO NOT redirect automatically)
        setTargetUrl(parsed.toString());
      } catch (err) {
        setError("Invalid activation URL format.");
      }
    }
  }, []);

  const handleContinue = () => {
    if (!targetUrl) return;
    setIsRedirecting(true);
    // Explicit human interaction trigger: navigate to Supabase single-use verification URL
    window.location.href = targetUrl;
  };

  return (
    <div className="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8 bg-[#FAF7F2]">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center space-y-3">
        <div className="mx-auto w-16 h-16 rounded-2xl bg-[#0F2E23] p-1.5 shadow-xl ring-4 ring-[#C59B27]/20 flex items-center justify-center overflow-hidden">
          <img
            src="/icon.jpg"
            alt="FarmReem Brand Emblem"
            className="w-full h-full object-cover rounded-xl"
          />
        </div>

        <h1 className="text-2xl font-extrabold text-[#0F2E23] tracking-tight">
          Activate your FarmReem Admin Account
        </h1>
        <p className="text-xs font-bold text-[#4F5E57] uppercase tracking-widest">
          First-Time Staff Account Setup
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 shadow-xl border border-[#E8E1D3] rounded-3xl sm:px-10 space-y-6">
          {error ? (
            <div className="text-center space-y-5">
              <div className="mx-auto w-14 h-14 rounded-full bg-rose-100 flex items-center justify-center text-rose-700">
                <ShieldAlert className="w-7 h-7" />
              </div>
              <div className="space-y-2">
                <h2 className="text-lg font-extrabold text-[#0F2E23]">
                  Activation link expired or invalid
                </h2>
                <p className="text-xs font-semibold text-rose-800 bg-rose-50 p-3.5 rounded-2xl border border-rose-200 leading-relaxed">
                  {error}
                </p>
                <p className="text-xs text-[#4F5E57]">
                  Please contact your FarmReem administrator for a new activation link.
                </p>
              </div>
              <Link
                href="/login"
                className="w-full inline-flex items-center justify-center gap-2 bg-[#0F2E23] hover:bg-[#184636] text-white font-extrabold text-xs px-6 py-3.5 rounded-xl shadow-md transition-all"
              >
                Return to Sign In <ArrowRight className="w-4 h-4 text-[#C59B27]" />
              </Link>
            </div>
          ) : (
            <div className="space-y-6 text-center">
              <div className="bg-[#FAF7F2] p-4 rounded-2xl border border-[#E8E1D3] text-left flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-[#C59B27] flex-shrink-0 mt-0.5" />
                <div className="text-xs text-[#4F5E57] space-y-1">
                  <p className="font-bold text-[#0F2E23]">Human Verification Protection Active</p>
                  <p>Click the button below to verify your activation token and proceed to create your FarmReem password.</p>
                </div>
              </div>

              <button
                type="button"
                onClick={handleContinue}
                disabled={isRedirecting || !targetUrl}
                className="w-full bg-[#0F2E23] hover:bg-[#184636] text-white font-extrabold text-sm px-6 py-3.5 rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isRedirecting ? "Verifying Activation Token..." : "Continue to Activate Account"}
                <ArrowRight className="w-4 h-4 text-[#C59B27]" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
