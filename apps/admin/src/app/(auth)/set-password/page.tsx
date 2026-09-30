"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { KeyRound, ArrowLeft, CheckCircle2, AlertCircle, ShieldAlert, Eye, EyeOff } from "lucide-react";

export default function SetPasswordPage() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [tokenHash, setTokenHash] = useState<string | null>(null);
  const [code, setCode] = useState<string | null>(null);
  const [inviteType, setInviteType] = useState<string>("invite");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [isExpiredOrInvalid, setIsExpiredOrInvalid] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const hashString = window.location.hash.startsWith("#")
        ? window.location.hash.substring(1)
        : window.location.hash;
      const hashParams = new URLSearchParams(hashString);
      const queryParams = new URLSearchParams(window.location.search);

      // Check for error parameters in URL (e.g. otp_expired, access_denied)
      const errorParam = hashParams.get("error") || queryParams.get("error");
      const errorCode = hashParams.get("error_code") || queryParams.get("error_code");

      if (errorParam || errorCode) {
        setIsExpiredOrInvalid(true);
        setError("This activation link has expired or has already been used. Please contact your FarmReem administrator for a new activation link.");
        return;
      }

      // Check for type recovery vs invite
      const type = hashParams.get("type") || queryParams.get("type") || "invite";
      setInviteType(type);

      if (type === "recovery") {
        // Redirect existing users doing password reset to /reset-password
        window.location.href = `/reset-password${window.location.search}${window.location.hash}`;
        return;
      }

      // Extract credentials from standard redirect (access_token), token_hash parameter, or PKCE (code)
      const token = hashParams.get("access_token") || queryParams.get("access_token");
      const th = queryParams.get("token_hash") || queryParams.get("token") || hashParams.get("token_hash");
      const authCode = queryParams.get("code") || hashParams.get("code");

      if (token) {
        setAccessToken(token);
      } else if (th) {
        setTokenHash(th);
      } else if (authCode) {
        setCode(authCode);
      } else {
        setIsExpiredOrInvalid(true);
        setError("This activation link has expired or has already been used. Please contact your FarmReem administrator for a new activation link.");
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
      setError("Passwords do not match. Please re-enter your new password.");
      return;
    }

    if (!accessToken && !tokenHash && !code) {
      setIsExpiredOrInvalid(true);
      setError("This activation link has expired or has already been used. Please contact your FarmReem administrator for a new activation link.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/auth/set-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          password,
          accessToken,
          tokenHash,
          code,
          type: inviteType,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (res.status === 401 || data.error?.includes("expired")) {
          setIsExpiredOrInvalid(true);
        }
        setError(data.error || "Unable to create password. Activation link may have expired.");
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
        <div className="mx-auto w-16 h-16 rounded-2xl bg-[#0F2E23] p-1.5 shadow-xl ring-4 ring-[#C59B27]/20 flex items-center justify-center overflow-hidden">
          <img
            src="/icon.jpg"
            alt="FarmReem Brand Emblem"
            className="w-full h-full object-cover rounded-xl"
          />
        </div>

        <h1 className="text-2xl font-extrabold text-[#0F2E23] tracking-tight">
          Create your FarmReem password
        </h1>
        <p className="text-xs font-bold text-[#4F5E57] uppercase tracking-widest">
          Set a secure password to activate your FarmReem Admin account.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 shadow-xl border border-[#E8E1D3] rounded-3xl sm:px-10 space-y-6">
          {done ? (
            <div className="text-center space-y-4">
              <CheckCircle2 className="w-14 h-14 text-emerald-600 mx-auto" />
              <h2 className="text-xl font-extrabold text-[#0F2E23]">
                Password created successfully
              </h2>
              <p className="text-xs font-medium text-[#4F5E57] leading-relaxed">
                Your staff password has been successfully established in Supabase Auth. You can now log in to the FarmReem Admin Portal.
              </p>
              <Link
                href="/login"
                className="w-full inline-flex items-center justify-center gap-2 bg-[#0F2E23] hover:bg-[#184636] text-white font-extrabold text-xs px-6 py-3.5 rounded-xl shadow-md transition-all mt-2"
              >
                Sign In to FarmReem OS <ArrowLeft className="w-4 h-4 rotate-180 text-[#C59B27]" />
              </Link>
            </div>
          ) : isExpiredOrInvalid ? (
            <div className="text-center space-y-5">
              <div className="mx-auto w-14 h-14 rounded-full bg-rose-100 flex items-center justify-center text-rose-700">
                <ShieldAlert className="w-7 h-7" />
              </div>
              <div className="space-y-2">
                <h2 className="text-lg font-extrabold text-[#0F2E23]">
                  Activation link expired or invalid
                </h2>
                <p className="text-xs font-semibold text-rose-800 bg-rose-50 p-3.5 rounded-2xl border border-rose-200 leading-relaxed">
                  This activation link has expired or has already been used.
                </p>
                <p className="text-xs text-[#4F5E57]">
                  Please contact your FarmReem administrator for a new activation link.
                </p>
              </div>
              <Link
                href="/login"
                className="w-full inline-flex items-center justify-center gap-2 bg-[#0F2E23] hover:bg-[#184636] text-white font-extrabold text-xs px-6 py-3.5 rounded-xl shadow-md transition-all"
              >
                Return to Sign In <ArrowLeft className="w-4 h-4 rotate-180 text-[#C59B27]" />
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="bg-[#FAF7F2] p-3.5 rounded-2xl border border-[#E8E1D3] flex items-center gap-3 text-xs text-[#4F5E57]">
                <KeyRound className="w-5 h-5 text-[#C59B27] flex-shrink-0" />
                <span>Create a strong password for your FarmReem staff account. Minimum 8 characters.</span>
              </div>

              {error && (
                <div className="bg-rose-50 text-rose-800 p-3.5 rounded-2xl border border-rose-200 flex items-center gap-2 text-xs font-semibold">
                  <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-extrabold text-[#0F2E23] uppercase tracking-wider mb-2">
                  New Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Minimum 8 characters"
                    className="w-full px-4 py-3 pr-10 rounded-xl border border-[#E8E1D3] focus:ring-2 focus:ring-[#C59B27] focus:outline-none text-sm font-medium bg-[#FAF7F2]/50"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#4F5E57] hover:text-[#0F2E23] transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-extrabold text-[#0F2E23] uppercase tracking-wider mb-2">
                  Confirm Password
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Re-enter new password"
                    className="w-full px-4 py-3 pr-10 rounded-xl border border-[#E8E1D3] focus:ring-2 focus:ring-[#C59B27] focus:outline-none text-sm font-medium bg-[#FAF7F2]/50"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#4F5E57] hover:text-[#0F2E23] transition-colors"
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading || (!accessToken && !tokenHash && !code)}
                className="w-full bg-[#0F2E23] hover:bg-[#184636] text-white font-extrabold text-sm px-6 py-3.5 rounded-xl shadow-md transition-all cursor-pointer disabled:opacity-50"
              >
                {loading ? "Creating Password..." : "Create Password"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
