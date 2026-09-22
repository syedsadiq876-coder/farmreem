"use client";

import { useState } from "react";
import Link from "next/link";
import { Lock, ArrowRight, CheckCircle2, ShieldCheck } from "lucide-react";
import Logo from "@/components/layout/Logo";

export default function RegisterPage() {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    businessName: "",
    businessType: "Hotel",
    contactPerson: "",
    email: "",
    phone: "",
    location: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="bg-[#FAF7F2] py-12 lg:py-20 min-h-[80vh] flex items-center justify-center">
      <div className="max-w-xl w-full mx-auto px-4 space-y-6">
        {/* Header */}
        <div className="text-center space-y-3 flex flex-col items-center">
          <Logo variant="auth" />
          <p className="text-xs text-[#4F5E57]">
            B2B Commercial Account Application & Verification
          </p>
        </div>

        {submitted ? (
          <div className="bg-white rounded-2xl border border-[#E8E1D3] p-8 text-center space-y-4 shadow-sm">
            <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
            <h2 className="text-2xl font-bold text-[#0F2E23]">Application Received</h2>
            <p className="text-sm text-[#4F5E57]">
              Thank you, {form.contactPerson}. Your account application for {form.businessName} has been submitted to the FarmReem verification desk. You will receive an email upon account approval.
            </p>
            <div className="pt-2">
              <Link
                href="/login"
                className="inline-block bg-[#0F2E23] text-white font-bold text-xs px-6 py-3 rounded-xl"
              >
                Return to Login Screen
              </Link>
            </div>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="bg-white rounded-2xl border border-[#E8E1D3] p-6 sm:p-8 shadow-sm space-y-5"
          >
            <div className="pb-3 border-b border-[#E8E1D3]">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#C59B27]">
                New Account Application
              </span>
              <h2 className="text-xl font-bold text-[#0F2E23]">Register B2B Account</h2>
            </div>

            <div className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="block font-bold text-[#0F2E23] uppercase tracking-wider">
                  Business / Establishment Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Grand Heritage Hotel"
                  value={form.businessName}
                  onChange={(e) => setForm({ ...form, businessName: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-[#E8E1D3] bg-[#FAF7F2] text-sm text-[#0F2E23] focus:outline-none focus:ring-2 focus:ring-[#0F2E23]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="block font-bold text-[#0F2E23] uppercase tracking-wider">
                    Contact Person Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Full Name"
                    value={form.contactPerson}
                    onChange={(e) => setForm({ ...form, contactPerson: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-[#E8E1D3] bg-[#FAF7F2] text-sm text-[#0F2E23] focus:outline-none focus:ring-2 focus:ring-[#0F2E23]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block font-bold text-[#0F2E23] uppercase tracking-wider">
                    Business Category *
                  </label>
                  <select
                    value={form.businessType}
                    onChange={(e) => setForm({ ...form, businessType: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-[#E8E1D3] bg-[#FAF7F2] text-sm text-[#0F2E23] focus:outline-none focus:ring-2 focus:ring-[#0F2E23]"
                  >
                    <option value="Hotel">Hotel / Luxury Resort</option>
                    <option value="Restaurant">Restaurant</option>
                    <option value="Caterer">Event Caterer</option>
                    <option value="Banquet">Banquet Operator</option>
                    <option value="Institutional">Institutional Kitchen</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="block font-bold text-[#0F2E23] uppercase tracking-wider">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="buyer@hotel.com"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-[#E8E1D3] bg-[#FAF7F2] text-sm text-[#0F2E23] focus:outline-none focus:ring-2 focus:ring-[#0F2E23]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block font-bold text-[#0F2E23] uppercase tracking-wider">
                    Mobile Number *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="+91 8475863634"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-[#E8E1D3] bg-[#FAF7F2] text-sm text-[#0F2E23] focus:outline-none focus:ring-2 focus:ring-[#0F2E23]"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="block font-bold text-[#0F2E23] uppercase tracking-wider">
                  Location / City *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Dehradun, Uttarakhand"
                  value={form.location}
                  onChange={(e) => setForm({ ...form, location: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-[#E8E1D3] bg-[#FAF7F2] text-sm text-[#0F2E23] focus:outline-none focus:ring-2 focus:ring-[#0F2E23]"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-[#0F2E23] hover:bg-[#184636] text-white font-bold text-sm py-3.5 rounded-xl transition-all shadow flex items-center justify-center gap-2 cursor-pointer"
            >
              Submit Account Application <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}

        <div className="text-center text-xs text-[#4F5E57]">
          Already have an approved account?{" "}
          <Link href="/login" className="font-bold text-[#0F2E23] hover:text-[#C59B27] underline">
            Sign In to Customer Portal
          </Link>
        </div>
      </div>
    </div>
  );
}
