"use client";

import { useState } from "react";
import Link from "next/link";
import { CheckCircle2, Send } from "lucide-react";

export default function BecomePartnerPage() {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    supplierName: "",
    contactPerson: "",
    mobile: "",
    location: "",
    supplierType: "Commercial Poultry Farm",
    capacity: "",
    typicalWeight: "1.8–2.0 kg",
    notes: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="bg-[#FAF7F2] py-12 lg:py-20 text-[#111A17]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Header */}
        <div className="text-center space-y-4 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0F2E23]/10 text-[#0F2E23] text-xs font-bold uppercase tracking-wider">
            Supply Network Expansion
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-[#0F2E23] tracking-tight">
            Become a FarmReem Supply Partner
          </h1>
          <p className="text-base text-[#4F5E57] leading-relaxed">
            FarmReem is developing relationships with commercial poultry farms and suppliers who maintain bird health and consistent weight sorting capability.
          </p>
        </div>

        {submitted ? (
          <div className="bg-white rounded-3xl border border-[#E8E1D3] p-8 lg:p-12 text-center space-y-6 shadow-sm">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-extrabold text-[#0F2E23]">Application Submitted</h2>
              <p className="text-sm text-[#4F5E57] max-w-md mx-auto">
                Thank you for applying to join the FarmReem supply network. Our procurement team will review your details and contact you.
              </p>
            </div>
            <button
              onClick={() => setSubmitted(false)}
              className="text-xs font-bold text-[#0F2E23] underline cursor-pointer"
            >
              Submit another application
            </button>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="bg-white rounded-3xl border border-[#E8E1D3] p-6 sm:p-10 shadow-sm space-y-6"
          >
            <h2 className="text-xl font-extrabold text-[#0F2E23] pb-2 border-b border-[#E8E1D3]">
              Supplier Application Details
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-xs font-extrabold text-[#0F2E23] uppercase tracking-wider">
                  Farm / Supplier Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. GreenValley Poultry Farm"
                  value={formData.supplierName}
                  onChange={(e) => setFormData({ ...formData, supplierName: e.target.value })}
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
                  placeholder="Full Name"
                  value={formData.contactPerson}
                  onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-[#E8E1D3] bg-[#FAF7F2] text-sm text-[#0F2E23] focus:outline-none focus:ring-2 focus:ring-[#0F2E23]"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-extrabold text-[#0F2E23] uppercase tracking-wider">
                  Mobile Number *
                </label>
                <input
                  type="tel"
                  required
                  placeholder="+91 98765 43210"
                  value={formData.mobile}
                  onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-[#E8E1D3] bg-[#FAF7F2] text-sm text-[#0F2E23] focus:outline-none focus:ring-2 focus:ring-[#0F2E23]"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-extrabold text-[#0F2E23] uppercase tracking-wider">
                  Location / District *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Dehradun / Surrounding Region"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-[#E8E1D3] bg-[#FAF7F2] text-sm text-[#0F2E23] focus:outline-none focus:ring-2 focus:ring-[#0F2E23]"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-extrabold text-[#0F2E23] uppercase tracking-wider">
                  Supplier Type *
                </label>
                <select
                  value={formData.supplierType}
                  onChange={(e) => setFormData({ ...formData, supplierType: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-[#E8E1D3] bg-[#FAF7F2] text-sm text-[#0F2E23] focus:outline-none focus:ring-2 focus:ring-[#0F2E23]"
                >
                  <option value="Commercial Poultry Farm">Commercial Poultry Farm</option>
                  <option value="Wholesale Supplier">Wholesale Market Supplier</option>
                  <option value="Contract Breeder">Breeder / Hatchery</option>
                  <option value="Other Supplier">Other Sourcing Entity</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-extrabold text-[#0F2E23] uppercase tracking-wider">
                  Approximate Capacity *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 2,000 birds/batch or 500 birds/day"
                  value={formData.capacity}
                  onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-[#E8E1D3] bg-[#FAF7F2] text-sm text-[#0F2E23] focus:outline-none focus:ring-2 focus:ring-[#0F2E23]"
                />
              </div>

              <div className="space-y-2 sm:col-span-2">
                <label className="block text-xs font-extrabold text-[#0F2E23] uppercase tracking-wider">
                  Typical Bird Weight Range
                </label>
                <input
                  type="text"
                  placeholder="e.g. 1.8–2.2 kg"
                  value={formData.typicalWeight}
                  onChange={(e) => setFormData({ ...formData, typicalWeight: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-[#E8E1D3] bg-[#FAF7F2] text-sm text-[#0F2E23] focus:outline-none focus:ring-2 focus:ring-[#0F2E23]"
                />
              </div>

              <div className="space-y-2 sm:col-span-2">
                <label className="block text-xs font-extrabold text-[#0F2E23] uppercase tracking-wider">
                  Notes & Overview
                </label>
                <textarea
                  rows={3}
                  placeholder="Describe your farm setup or supply details..."
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-[#E8E1D3] bg-[#FAF7F2] text-sm text-[#0F2E23] focus:outline-none focus:ring-2 focus:ring-[#0F2E23]"
                />
              </div>
            </div>

            <div className="pt-4 border-t border-[#E8E1D3] flex justify-end">
              <button
                type="submit"
                className="w-full sm:w-auto bg-[#0F2E23] hover:bg-[#184636] text-white font-extrabold text-sm px-8 py-3.5 rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
              >
                Submit Partner Application <Send className="w-4 h-4 text-[#C59B27]" />
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
