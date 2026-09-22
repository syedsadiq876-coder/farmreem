"use client";

import { useState } from "react";
import Link from "next/link";
import { CheckCircle2, Send, Lock, ArrowRight } from "lucide-react";

export default function RequestPricingPage() {
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    businessName: "",
    contactPerson: "",
    mobileNumber: "",
    businessType: "Hotel",
    city: "",
    dailyRequirement: "",
    preferredWeight: "1.8–2.0 kg",
    email: "",
    notes: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    setTimeout(() => {
      setSubmitting(false);
      setSubmitted(true);
    }, 500);
  };

  return (
    <div className="bg-[#FAF7F2] py-12 lg:py-20 text-[#111A17]">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Header */}
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0F2E23]/10 text-[#0F2E23] text-xs font-bold uppercase tracking-wider">
            Fast B2B Sourcing Enquiry
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-[#0F2E23] tracking-tight">
            Request B2B Pricing
          </h1>
          <p className="text-base text-[#4F5E57] leading-relaxed">
            Tell us about your kitchen requirements and our commercial team in Dehradun will provide live broiler pricing structures.
          </p>
        </div>

        {submitted ? (
          <div className="bg-white rounded-3xl border border-[#E8E1D3] p-8 lg:p-12 text-center space-y-6 shadow-sm">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-extrabold text-[#0F2E23]">Pricing Request Received</h2>
              <p className="text-sm text-[#4F5E57] max-w-md mx-auto">
                Thank you. The FarmReem team will review your requirement and contact you.
              </p>
            </div>

            {/* Account Application Pathway */}
            <div className="bg-[#FAF7F2] p-5 rounded-2xl border border-[#E8E1D3] space-y-2 max-w-md mx-auto text-center">
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-[#0F2E23]">
                Looking for regular morning supply & credit terms?
              </h3>
              <p className="text-xs text-[#4F5E57]">
                Submit a complete B2B account application for standing weekly allocations.
              </p>
              <div className="pt-1">
                <Link
                  href="/register"
                  className="inline-flex items-center gap-1.5 text-xs font-extrabold text-[#0F2E23] hover:text-[#C59B27] bg-white px-4 py-2 rounded-xl border border-[#E8E1D3] transition-colors shadow-sm"
                >
                  Apply for a B2B Account
                  <ArrowRight className="w-3.5 h-3.5 text-[#C59B27]" />
                </Link>
              </div>
            </div>

            <button
              onClick={() => setSubmitted(false)}
              className="text-xs font-bold text-[#4F5E57] hover:text-[#0F2E23] underline cursor-pointer"
            >
              Submit another pricing request
            </button>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="bg-white rounded-3xl border border-[#E8E1D3] p-6 sm:p-10 shadow-sm space-y-6"
          >
            <div className="flex items-center justify-between pb-4 border-b border-[#E8E1D3]">
              <h2 className="text-xl font-extrabold text-[#0F2E23]">Quick Pricing Request</h2>
              <span className="text-xs font-semibold text-[#C59B27] flex items-center gap-1">
                <Lock className="w-3.5 h-3.5" /> Direct Sales Desk
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-xs font-extrabold text-[#0F2E23] uppercase tracking-wider">
                  Business Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Royal Palace Hotel & Restaurant"
                  value={formData.businessName}
                  onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-[#E8E1D3] bg-[#FAF7F2] text-sm text-[#0F2E23] focus:outline-none focus:ring-2 focus:ring-[#0F2E23]"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-extrabold text-[#0F2E23] uppercase tracking-wider">
                  Contact Person *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Chef Rajesh / Purchase Manager"
                  value={formData.contactPerson}
                  onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-[#E8E1D3] bg-[#FAF7F2] text-sm text-[#0F2E23] focus:outline-none focus:ring-2 focus:ring-[#0F2E23]"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-extrabold text-[#0F2E23] uppercase tracking-wider">
                  Mobile / WhatsApp Number *
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
                <label className="block text-xs font-extrabold text-[#0F2E23] uppercase tracking-wider">
                  Business Type *
                </label>
                <select
                  value={formData.businessType}
                  onChange={(e) => setFormData({ ...formData, businessType: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-[#E8E1D3] bg-[#FAF7F2] text-sm text-[#0F2E23] focus:outline-none focus:ring-2 focus:ring-[#0F2E23]"
                >
                  <option value="Hotel">Hotel / Resort</option>
                  <option value="Restaurant">Restaurant / Cafe</option>
                  <option value="Caterer">Caterer / Banquet Operator</option>
                  <option value="Institutional Kitchen">Institutional Kitchen</option>
                  <option value="Other">Other B2B Buyer</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-extrabold text-[#0F2E23] uppercase tracking-wider">
                  City *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Dehradun"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-[#E8E1D3] bg-[#FAF7F2] text-sm text-[#0F2E23] focus:outline-none focus:ring-2 focus:ring-[#0F2E23]"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-extrabold text-[#0F2E23] uppercase tracking-wider">
                  Approximate Daily Requirement *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 50 birds/day or 100 kg/day"
                  value={formData.dailyRequirement}
                  onChange={(e) => setFormData({ ...formData, dailyRequirement: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-[#E8E1D3] bg-[#FAF7F2] text-sm text-[#0F2E23] focus:outline-none focus:ring-2 focus:ring-[#0F2E23]"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-extrabold text-[#0F2E23] uppercase tracking-wider">
                  Preferred Weight Range *
                </label>
                <select
                  value={formData.preferredWeight}
                  onChange={(e) => setFormData({ ...formData, preferredWeight: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-[#E8E1D3] bg-[#FAF7F2] text-sm text-[#0F2E23] focus:outline-none focus:ring-2 focus:ring-[#0F2E23]"
                >
                  <option value="1.8–2.0 kg">Standard Range: 1.8 kg – 2.0 kg</option>
                  <option value="2.0–2.4 kg">Heavy Range: 2.0 kg – 2.4 kg</option>
                  <option value="Flexible">Flexible / Open to Recommendation</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-extrabold text-[#0F2E23] uppercase tracking-wider">
                  Email Address (Optional)
                </label>
                <input
                  type="email"
                  placeholder="purchasing@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-[#E8E1D3] bg-[#FAF7F2] text-sm text-[#0F2E23] focus:outline-none focus:ring-2 focus:ring-[#0F2E23]"
                />
              </div>

              <div className="space-y-2 sm:col-span-2">
                <label className="block text-xs font-extrabold text-[#0F2E23] uppercase tracking-wider">
                  Notes (Optional)
                </label>
                <textarea
                  rows={2}
                  placeholder="Any specific delivery window or volume details..."
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-[#E8E1D3] bg-[#FAF7F2] text-sm text-[#0F2E23] focus:outline-none focus:ring-2 focus:ring-[#0F2E23]"
                />
              </div>
            </div>

            <div className="pt-4 border-t border-[#E8E1D3] flex items-center justify-between flex-wrap gap-4">
              <span className="text-xs text-[#4F5E57]">
                Fast B2B pricing inquiry desk
              </span>
              <button
                type="submit"
                disabled={submitting}
                className="w-full sm:w-auto bg-[#0F2E23] hover:bg-[#184636] text-white font-extrabold text-sm px-8 py-3.5 rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70"
              >
                {submitting ? "Submitting..." : "Request B2B Pricing"}{" "}
                {!submitting && <Send className="w-4 h-4 text-[#C59B27]" />}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
