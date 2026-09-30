"use client";

import { useState } from "react";
import Link from "next/link";
import { Lock, ArrowLeft, Send, CheckCircle2, AlertCircle } from "lucide-react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Unable to send password reset email.");
        setLoading(false);
        return;
      }

      setSubmitted(true);
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
          Reset Password
        </h1>
        <p className="text-xs text-[#4F5E57]">
          Enter your staff email to receive a password reset link.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 shadow-xl border border-[#E8E1D3] rounded-3xl sm:px-10 space-y-6">
          {submitted ? (
            <div className="text-center space-y-4">
              <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
              <h2 className="text-lg font-bold text-[#0F2E23]">Reset Link Sent</h2>
              <p className="text-xs text-[#4F5E57]">
                If an active staff account exists for <span className="font-semibold text-[#0F2E23]">{email}</span>, password reset instructions have been dispatched by Supabase Auth.
              </p>
              <Link
                href="/login"
                className="inline-flex items-center gap-2 text-xs font-extrabold text-[#C59B27] hover:underline pt-2"
              >
                <ArrowLeft className="w-4 h-4" /> Return to Sign In
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

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#0F2E23] hover:bg-[#184636] text-white font-extrabold text-sm px-6 py-3.5 rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {loading ? "Sending Link..." : "Send Reset Link"} <Send className="w-4 h-4 text-[#C59B27]" />
              </button>

              <div className="text-center pt-2">
                <Link
                  href="/login"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-[#4F5E57] hover:text-[#0F2E23]"
                >
                  <ArrowLeft className="w-3.5 h-3.5" /> Back to Login
                </Link>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
