"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Lock, ArrowLeft, CheckCircle2, AlertCircle } from "lucide-react";

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Extract access_token from URL hash or query params (from Supabase email link redirect)
    if (typeof window !== "undefined") {
      const hashParams = new URLSearchParams(window.location.hash.replace("#", "?"));
      const queryParams = new URLSearchParams(window.location.search);
      const token = hashParams.get("access_token") || queryParams.get("access_token");
      if (token) {
        setAccessToken(token);
      } else {
        setError("Invalid or expired password reset link. Please request a new link.");
      }
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (!accessToken) {
      setError("Missing recovery token. Please open the reset link from your email.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password, accessToken }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Unable to update password. Link may have expired.");
        setLoading(false);
        return;
      }

      setDone(true);
      setLoading(false);
    } catch (err) {
      setError("Unable to connect to authentication service.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8 bg-[#FAF7F2]">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center space-y-3">
        <div className="mx-auto w-14 h-14 rounded-full bg-[#0F2E23] flex items-center justify-center text-[#C59B27] shadow-xl">
          <Lock className="w-7 h-7" />
        </div>
        <h1 className="text-2xl font-extrabold text-[#0F2E23] tracking-tight">
          Set New Password
        </h1>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 shadow-xl border border-[#E8E1D3] rounded-3xl sm:px-10 space-y-6">
          {done ? (
            <div className="text-center space-y-4">
              <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
              <h2 className="text-lg font-bold text-[#0F2E23]">Password Updated</h2>
              <p className="text-xs text-[#4F5E57]">
                Your password has been successfully updated in Supabase Auth. You may now sign in to FarmReem OS.
              </p>
              <Link
                href="/login"
                className="inline-flex items-center gap-2 bg-[#0F2E23] text-white font-extrabold text-xs px-6 py-3 rounded-xl shadow mt-2"
              >
                Go to Sign In <ArrowLeft className="w-4 h-4 rotate-180 text-[#C59B27]" />
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              {error && (
                <div className="bg-rose-50 text-rose-800 p-3 rounded-xl border border-rose-200 flex items-center gap-2 text-xs font-semibold">
                  <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-extrabold text-[#0F2E23] uppercase tracking-wider mb-2">
                  New Password
                </label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Minimum 8 characters"
                  className="w-full px-4 py-3 rounded-xl border border-[#E8E1D3] focus:ring-2 focus:ring-[#C59B27] focus:outline-none text-sm font-medium bg-[#FAF7F2]/50"
                />
              </div>

              <div>
                <label className="block text-xs font-extrabold text-[#0F2E23] uppercase tracking-wider mb-2">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter new password"
                  className="w-full px-4 py-3 rounded-xl border border-[#E8E1D3] focus:ring-2 focus:ring-[#C59B27] focus:outline-none text-sm font-medium bg-[#FAF7F2]/50"
                />
              </div>

              <button
                type="submit"
                disabled={loading || !accessToken}
                className="w-full bg-[#0F2E23] hover:bg-[#184636] text-white font-extrabold text-sm px-6 py-3.5 rounded-xl shadow-md transition-all cursor-pointer disabled:opacity-50"
              >
                {loading ? "Updating Password..." : "Update Password"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
