"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import Logo from "@/components/layout/Logo";

export default function ForgotPasswordPage() {
  const [submitted, setSubmitted] = useState(false);
  const [email, setEmail] = useState("");

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
            B2B Account Password Recovery
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-[#E8E1D3] p-6 sm:p-8 shadow-sm space-y-5">
          {submitted ? (
            <div className="text-center space-y-4">
              <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
              <h2 className="text-xl font-bold text-[#0F2E23]">Recovery Link Sent</h2>
              <p className="text-xs text-[#4F5E57] leading-relaxed">
                If an account exists for <strong>{email}</strong>, password reset instructions have been sent to your inbox.
              </p>
              <Link
                href="/login"
                className="inline-block bg-[#0F2E23] text-white font-bold text-xs px-6 py-3 rounded-xl"
              >
                Return to Login
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#C59B27]">
                  Reset Access
                </span>
                <h2 className="text-lg font-bold text-[#0F2E23]">Forgot Password</h2>
                <p className="text-xs text-[#4F5E57]">
                  Enter your registered authorized email to receive a password reset link.
                </p>
              </div>

              <div className="space-y-1 pt-2">
                <label className="block text-xs font-bold text-[#0F2E23] uppercase tracking-wider">
                  Authorized Email
                </label>
                <input
                  type="email"
                  required
                  placeholder="buyer@hotel.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-[#E8E1D3] bg-[#FAF7F2] text-sm text-[#0F2E23] focus:outline-none focus:ring-2 focus:ring-[#0F2E23]"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-[#0F2E23] hover:bg-[#184636] text-white font-bold text-sm py-3.5 rounded-xl transition-all shadow flex items-center justify-center gap-2 cursor-pointer"
              >
                Send Password Reset Link <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}
        </div>

        <div className="text-center text-xs text-[#4F5E57]">
          Remembered password?{" "}
          <Link href="/login" className="font-bold text-[#0F2E23] hover:text-[#C59B27] underline">
            Back to Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}
