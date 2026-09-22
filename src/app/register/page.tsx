"use client";

import { useState } from "react";
import Link from "next/link";
import { Lock, ArrowRight, CheckCircle2 } from "lucide-react";
import Logo from "@/components/layout/Logo";

export default function RegisterPage() {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    businessName: "",
    businessType: "Hotel",
    contactPerson: "",
    designation: "",
    mobile: "",
    whatsapp: "",
    email: "",
    businessAddress: "",
    city: "Dehradun",
    state: "Uttarakhand",
    pincode: "",
    dailyRequirement: "",
    preferredWeight: "1.8–2.0 kg",
    deliveryRequirement: "Scheduled Morning Window",
    gstin: "",
    fssai: "",
    notes: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="bg-[#FAF7F2] py-12 lg:py-20 min-h-[85vh] text-[#111A17] flex items-center justify-center">
      <div className="max-w-2xl w-full mx-auto px-4 space-y-6">
        
        {/* Header */}
        <div className="text-center space-y-3 flex flex-col items-center">
          <Logo variant="auth" />
          <p className="text-xs text-[#4F5E57] pt-1 font-semibold">
            B2B Commercial Account Application
          </p>
        </div>

        {submitted ? (
          <div className="bg-white rounded-3xl border border-[#E8E1D3] p-8 sm:p-10 text-center space-y-5 shadow-md">
            <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <div className="space-y-2">
              <h1 className="text-2xl font-extrabold text-[#0F2E23]">
                Application Received
              </h1>
              <p className="text-sm text-[#4F5E57] max-w-md mx-auto leading-relaxed">
                Application received. FarmReem will review your business requirements and contact you regarding account setup.
              </p>
            </div>

            <div className="bg-[#FAF7F2] p-4 rounded-xl border border-[#E8E1D3] text-left text-xs space-y-2 max-w-md mx-auto text-[#0F2E23]">
              <div className="flex justify-between font-bold border-b border-[#E8E1D3] pb-2">
                <span>Business Name:</span>
                <span>{form.businessName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#4F5E57]">Contact Person:</span>
                <span>{form.contactPerson}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#4F5E57]">City Location:</span>
                <span>{form.city}, {form.state}</span>
              </div>
            </div>

            <div className="pt-3">
              <Link
                href="/login"
                className="inline-flex items-center gap-2 bg-[#0F2E23] text-white font-extrabold text-xs px-6 py-3.5 rounded-xl shadow-md hover:bg-[#184636] transition-colors"
              >
                Go to B2B Portal Notice
                <ArrowRight className="w-4 h-4 text-[#C59B27]" />
              </Link>
            </div>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="bg-white rounded-3xl border border-[#E8E1D3] p-6 sm:p-10 shadow-sm space-y-6"
          >
            <div className="pb-4 border-b border-[#E8E1D3] space-y-1">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#C59B27]">
                Commercial Partnership
              </span>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0F2E23]">
                Apply for a FarmReem B2B Account
              </h1>
              <p className="text-xs text-[#4F5E57] leading-relaxed">
                For businesses looking for recurring poultry supply and account-specific commercial terms.
              </p>
            </div>

            <div className="space-y-4">
              
              {/* Business Identity */}
              <div className="space-y-3">
                <h2 className="text-xs font-extrabold uppercase tracking-wider text-[#0F2E23] border-b border-[#E8E1D3] pb-1">
                  1. Business & Contact Information
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1 sm:col-span-2">
                    <label className="block text-xs font-extrabold text-[#0F2E23]">
                      Business Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Grand Hotel & Resort"
                      value={form.businessName}
                      onChange={(e) => setForm({ ...form, businessName: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-[#E8E1D3] bg-[#FAF7F2] text-sm text-[#0F2E23] focus:outline-none focus:ring-2 focus:ring-[#0F2E23]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-xs font-extrabold text-[#0F2E23]">
                      Business Type *
                    </label>
                    <select
                      value={form.businessType}
                      onChange={(e) => setForm({ ...form, businessType: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-[#E8E1D3] bg-[#FAF7F2] text-sm text-[#0F2E23] focus:outline-none focus:ring-2 focus:ring-[#0F2E23]"
                    >
                      <option value="Hotel">Hotel / Resort</option>
                      <option value="Restaurant">Standalone / Chain Restaurant</option>
                      <option value="Caterer">Event & Banquet Caterer</option>
                      <option value="Institutional Kitchen">Institutional Kitchen / Mess</option>
                      <option value="Other">Other Commercial Foodservice</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="block text-xs font-extrabold text-[#0F2E23]">
                      Contact Person *
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
                    <label className="block text-xs font-extrabold text-[#0F2E23]">
                      Designation
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Executive Chef / Purchase Manager"
                      value={form.designation}
                      onChange={(e) => setForm({ ...form, designation: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-[#E8E1D3] bg-[#FAF7F2] text-sm text-[#0F2E23] focus:outline-none focus:ring-2 focus:ring-[#0F2E23]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-xs font-extrabold text-[#0F2E23]">
                      Mobile *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="+91 98765 43210"
                      value={form.mobile}
                      onChange={(e) => setForm({ ...form, mobile: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-[#E8E1D3] bg-[#FAF7F2] text-sm text-[#0F2E23] focus:outline-none focus:ring-2 focus:ring-[#0F2E23]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-xs font-extrabold text-[#0F2E23]">
                      WhatsApp
                    </label>
                    <input
                      type="tel"
                      placeholder="+91 98765 43210"
                      value={form.whatsapp}
                      onChange={(e) => setForm({ ...form, whatsapp: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-[#E8E1D3] bg-[#FAF7F2] text-sm text-[#0F2E23] focus:outline-none focus:ring-2 focus:ring-[#0F2E23]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-xs font-extrabold text-[#0F2E23]">
                      Email *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="purchase@hotel.com"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-[#E8E1D3] bg-[#FAF7F2] text-sm text-[#0F2E23] focus:outline-none focus:ring-2 focus:ring-[#0F2E23]"
                    />
                  </div>
                </div>
              </div>

              {/* Delivery Address */}
              <div className="space-y-3 pt-2">
                <h2 className="text-xs font-extrabold uppercase tracking-wider text-[#0F2E23] border-b border-[#E8E1D3] pb-1">
                  2. Business Address & Location
                </h2>

                <div className="space-y-3">
                  <div className="space-y-1">
                    <label className="block text-xs font-extrabold text-[#0F2E23]">Business Address *</label>
                    <input
                      type="text"
                      required
                      placeholder="Street address / Receiving dock location"
                      value={form.businessAddress}
                      onChange={(e) => setForm({ ...form, businessAddress: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-[#E8E1D3] bg-[#FAF7F2] text-sm text-[#0F2E23] focus:outline-none focus:ring-2 focus:ring-[#0F2E23]"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="space-y-1">
                      <label className="block text-xs font-extrabold text-[#0F2E23]">City *</label>
                      <input
                        type="text"
                        required
                        value={form.city}
                        onChange={(e) => setForm({ ...form, city: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl border border-[#E8E1D3] bg-[#FAF7F2] text-sm text-[#0F2E23] focus:outline-none focus:ring-2 focus:ring-[#0F2E23]"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="block text-xs font-extrabold text-[#0F2E23]">State *</label>
                      <input
                        type="text"
                        required
                        value={form.state}
                        onChange={(e) => setForm({ ...form, state: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl border border-[#E8E1D3] bg-[#FAF7F2] text-sm text-[#0F2E23] focus:outline-none focus:ring-2 focus:ring-[#0F2E23]"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="block text-xs font-extrabold text-[#0F2E23]">PIN Code</label>
                      <input
                        type="text"
                        placeholder="248001"
                        value={form.pincode}
                        onChange={(e) => setForm({ ...form, pincode: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl border border-[#E8E1D3] bg-[#FAF7F2] text-sm text-[#0F2E23] focus:outline-none focus:ring-2 focus:ring-[#0F2E23]"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Requirement Specifications */}
              <div className="space-y-3 pt-2">
                <h2 className="text-xs font-extrabold uppercase tracking-wider text-[#0F2E23] border-b border-[#E8E1D3] pb-1">
                  3. Sourcing & Delivery Specifications
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <label className="block text-xs font-extrabold text-[#0F2E23]">
                      Approximate Requirement
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. 100 birds/day"
                      value={form.dailyRequirement}
                      onChange={(e) => setForm({ ...form, dailyRequirement: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-[#E8E1D3] bg-[#FAF7F2] text-sm text-[#0F2E23] focus:outline-none focus:ring-2 focus:ring-[#0F2E23]"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="block text-xs font-extrabold text-[#0F2E23]">
                      Preferred Weight
                    </label>
                    <select
                      value={form.preferredWeight}
                      onChange={(e) => setForm({ ...form, preferredWeight: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-[#E8E1D3] bg-[#FAF7F2] text-sm text-[#0F2E23] focus:outline-none focus:ring-2 focus:ring-[#0F2E23]"
                    >
                      <option value="1.8–2.0 kg">Standard Range: 1.8 – 2.0 kg</option>
                      <option value="2.0–2.4 kg">Heavy Range: 2.0 – 2.4 kg</option>
                      <option value="Flexible">Flexible Sizing</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="block text-xs font-extrabold text-[#0F2E23]">
                      Delivery Requirement
                    </label>
                    <select
                      value={form.deliveryRequirement}
                      onChange={(e) => setForm({ ...form, deliveryRequirement: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-[#E8E1D3] bg-[#FAF7F2] text-sm text-[#0F2E23] focus:outline-none focus:ring-2 focus:ring-[#0F2E23]"
                    >
                      <option value="Scheduled Morning Window">Scheduled Morning Window (6–8 AM)</option>
                      <option value="Mid-day Delivery">Mid-day Delivery (10 AM–12 PM)</option>
                      <option value="Event Specific">Event Specific Schedule</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Tax & Licensing */}
              <div className="space-y-3 pt-2">
                <h2 className="text-xs font-extrabold uppercase tracking-wider text-[#0F2E23] border-b border-[#E8E1D3] pb-1">
                  4. Commercial Verification (Optional)
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="block text-xs font-extrabold text-[#0F2E23]">
                      GSTIN (Optional)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. 05AAAAA0000A1Z5"
                      value={form.gstin}
                      onChange={(e) => setForm({ ...form, gstin: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-[#E8E1D3] bg-[#FAF7F2] text-sm text-[#0F2E23] focus:outline-none focus:ring-2 focus:ring-[#0F2E23]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-xs font-extrabold text-[#0F2E23]">
                      FSSAI License (Optional)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. 10000000000000"
                      value={form.fssai}
                      onChange={(e) => setForm({ ...form, fssai: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-[#E8E1D3] bg-[#FAF7F2] text-sm text-[#0F2E23] focus:outline-none focus:ring-2 focus:ring-[#0F2E23]"
                    />
                  </div>
                </div>
              </div>

              {/* Additional Notes */}
              <div className="space-y-1 pt-2">
                <label className="block text-xs font-extrabold text-[#0F2E23]">
                  Notes
                </label>
                <textarea
                  rows={3}
                  placeholder="Special dock access, credit requests, or existing supplier arrangements..."
                  value={form.notes}
                  onChange={(e) => setForm({ ...form, notes: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-[#E8E1D3] bg-[#FAF7F2] text-sm text-[#0F2E23] focus:outline-none focus:ring-2 focus:ring-[#0F2E23]"
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="w-full bg-[#0F2E23] hover:bg-[#184636] text-[#FAF7F2] font-extrabold py-4 rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer text-sm"
              >
                <Lock className="w-4 h-4 text-[#C59B27]" />
                Submit B2B Account Application
              </button>
            </div>

            <p className="text-[11px] text-[#4F5E57] text-center">
              Submission does NOT mean automatic approval. FarmReem will review your business requirements and contact you regarding account setup.
            </p>

          </form>
        )}

      </div>
    </div>
  );
}
