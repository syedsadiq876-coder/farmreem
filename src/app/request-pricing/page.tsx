"use client";

import { useState } from "react";
import Link from "next/link";
import { CheckCircle2, Send, Lock, ArrowRight, ShieldCheck } from "lucide-react";

export default function RequestPricingPage() {
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    businessName: "",
    businessType: "Hotel",
    contactPerson: "",
    mobileNumber: "",
    whatsAppNumber: "",
    email: "",
    cityLocation: "",
    dailyRequirement: "",
    preferredWeight: "1.8–2.0 kg",
    currentSupplier: "",
    notes: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    setTimeout(() => {
      setSubmitting(false);
      setSubmitted(true);
    }, 600);
  };

  return (
    <div className="bg-[#FAF7F2] py-12 lg:py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Header */}
        <div className="text-center space-y-4 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0F2E23]/10 text-[#0F2E23] text-xs font-bold uppercase tracking-wider">
            B2B Account Opening & Rate Request
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-[#0F2E23] tracking-tight">
            Request B2B Kitchen Pricing
          </h1>
          <p className="text-base text-[#4F5E57] leading-relaxed">
            Get account-specific live broiler contract rates tailored to your kitchen volume, weight specifications, and delivery schedule.
          </p>
        </div>

        {submitted ? (
          <div className="bg-white rounded-2xl border border-[#E8E1D3] p-8 lg:p-12 text-center space-y-6 shadow-sm">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-[#0F2E23]">Pricing Request Submitted</h2>
              <p className="text-sm text-[#4F5E57] max-w-md mx-auto">
                Thank you, {formData.contactPerson}. Our B2B account manager will contact you within 2 hours with account pricing and credit verification details.
              </p>
            </div>
            <button
              onClick={() => setSubmitted(false)}
              className="text-xs font-bold text-[#0F2E23] underline"
            >
              Submit another pricing request
            </button>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="bg-white rounded-2xl border border-[#E8E1D3] p-6 sm:p-10 shadow-sm space-y-6"
          >
            <div className="flex items-center justify-between pb-4 border-b border-[#E8E1D3]">
              <h2 className="text-xl font-bold text-[#0F2E23]">Commercial Kitchen Application</h2>
              <span className="text-xs font-semibold text-[#C59B27] flex items-center gap-1">
                <Lock className="w-3.5 h-3.5" /> Confidential B2B Rate
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-xs font-bold text-[#0F2E23] uppercase tracking-wider">
                  Business / Establish Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Grand Palace Hotel & Suites"
                  value={formData.businessName}
                  onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-[#E8E1D3] bg-[#FAF7F2] text-sm text-[#0F2E23] focus:outline-none focus:ring-2 focus:ring-[#0F2E23]"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-bold text-[#0F2E23] uppercase tracking-wider">
                  Business Category *
                </label>
                <select
                  value={formData.businessType}
                  onChange={(e) => setFormData({ ...formData, businessType: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-[#E8E1D3] bg-[#FAF7F2] text-sm text-[#0F2E23] focus:outline-none focus:ring-2 focus:ring-[#0F2E23]"
                >
                  <option value="Hotel">Hotel / Luxury Resort</option>
                  <option value="Restaurant">Standalone / Chain Restaurant</option>
                  <option value="Caterer">Event & Banquet Caterer</option>
                  <option value="Banquet Operator">Banquet Hall Operator</option>
                  <option value="Institutional Kitchen">Institutional / Corporate Kitchen</option>
                  <option value="Other">Other Foodservice Business</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-bold text-[#0F2E23] uppercase tracking-wider">
                  Contact Person Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Executive Chef or Purchase Manager"
                  value={formData.contactPerson}
                  onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-[#E8E1D3] bg-[#FAF7F2] text-sm text-[#0F2E23] focus:outline-none focus:ring-2 focus:ring-[#0F2E23]"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-bold text-[#0F2E23] uppercase tracking-wider">
                  Mobile Phone Number *
                </label>
                <input
                  type="tel"
                  required
                  placeholder="+91 98765 43210"
                  value={formData.mobileNumber}
                  onChange={(e) => setFormData({ ...formData, mobileNumber: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-[#E8E1D3] bg-[#FAF7F2] text-sm text-[#0F2E23] focus:outline-none focus:ring-2 focus:ring-[#0F2E23]"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-bold text-[#0F2E23] uppercase tracking-wider">
                  WhatsApp Number (Optional)
                </label>
                <input
                  type="tel"
                  placeholder="+91 98765 43210"
                  value={formData.whatsAppNumber}
                  onChange={(e) => setFormData({ ...formData, whatsAppNumber: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-[#E8E1D3] bg-[#FAF7F2] text-sm text-[#0F2E23] focus:outline-none focus:ring-2 focus:ring-[#0F2E23]"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-bold text-[#0F2E23] uppercase tracking-wider">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  placeholder="purchasing@grandpalace.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-[#E8E1D3] bg-[#FAF7F2] text-sm text-[#0F2E23] focus:outline-none focus:ring-2 focus:ring-[#0F2E23]"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-bold text-[#0F2E23] uppercase tracking-wider">
                  Kitchen Location / City *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Central City / Hotel Belt"
                  value={formData.cityLocation}
                  onChange={(e) => setFormData({ ...formData, cityLocation: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-[#E8E1D3] bg-[#FAF7F2] text-sm text-[#0F2E23] focus:outline-none focus:ring-2 focus:ring-[#0F2E23]"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-bold text-[#0F2E23] uppercase tracking-wider">
                  Approx. Daily Requirement *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 100 birds/day or 200 KG/day"
                  value={formData.dailyRequirement}
                  onChange={(e) => setFormData({ ...formData, dailyRequirement: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-[#E8E1D3] bg-[#FAF7F2] text-sm text-[#0F2E23] focus:outline-none focus:ring-2 focus:ring-[#0F2E23]"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-bold text-[#0F2E23] uppercase tracking-wider">
                  Preferred Live Bird Weight Spec *
                </label>
                <select
                  value={formData.preferredWeight}
                  onChange={(e) => setFormData({ ...formData, preferredWeight: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-[#E8E1D3] bg-[#FAF7F2] text-sm text-[#0F2E23] focus:outline-none focus:ring-2 focus:ring-[#0F2E23]"
                >
                  <option value="1.8–2.0 kg">Standard Spec: 1.8 kg – 2.0 kg</option>
                  <option value="2.0–2.2 kg">Heavy Spec: 2.0 kg – 2.2 kg</option>
                  <option value="Custom Spec">Custom Weight Spec (Specify below)</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-bold text-[#0F2E23] uppercase tracking-wider">
                  Current Poultry Supplier (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Local Wholesale Trader"
                  value={formData.currentSupplier}
                  onChange={(e) => setFormData({ ...formData, currentSupplier: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-[#E8E1D3] bg-[#FAF7F2] text-sm text-[#0F2E23] focus:outline-none focus:ring-2 focus:ring-[#0F2E23]"
                />
              </div>

              <div className="space-y-2 sm:col-span-2">
                <label className="block text-xs font-bold text-[#0F2E23] uppercase tracking-wider">
                  Kitchen Delivery Notes & Special Requirements
                </label>
                <textarea
                  rows={3}
                  placeholder="Preferred morning delivery window, dock access requirements, or credit period requested..."
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-[#E8E1D3] bg-[#FAF7F2] text-sm text-[#0F2E23] focus:outline-none focus:ring-2 focus:ring-[#0F2E23]"
                />
              </div>
            </div>

            <div className="pt-4 border-t border-[#E8E1D3] flex items-center justify-between flex-wrap gap-4">
              <span className="text-xs text-[#4F5E57]">
                * Application routed to FarmReem Sales CRM Workbench
              </span>
              <button
                type="submit"
                disabled={submitting}
                className="w-full sm:w-auto bg-[#C59B27] hover:bg-[#b0881f] text-[#0F2E23] font-extrabold text-sm px-8 py-3.5 rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70"
              >
                {submitting ? "Submitting Request..." : "Request B2B Pricing"}{" "}
                {!submitting && <Send className="w-4 h-4" />}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
