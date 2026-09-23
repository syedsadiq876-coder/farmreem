"use client";

import { useState } from "react";
import Link from "next/link";
import { CheckCircle2, Send, Lock, ArrowRight } from "lucide-react";

export default function RequestPricingPage() {
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState<string[]>(["Live Broiler"]);
  const [formData, setFormData] = useState({
    businessName: "",
    contactPerson: "",
    mobileNumber: "",
    businessType: "Hotel",
    city: "Dehradun",
    approxRequirement: "",
    preferredSpec: "",
    email: "",
    notes: "",
  });

  const productOptions = [
    "Live Broiler",
    "Whole / Dressed",
    "Curry Cut",
    "Breast",
    "Leg / Drumstick",
    "Thigh",
    "Wings",
    "Boneless Breast",
    "Boneless Thigh",
    "Keema / Mince",
    "Other",
  ];

  const handleProductToggle = (product: string) => {
    if (selectedProducts.includes(product)) {
      setSelectedProducts(selectedProducts.filter((p) => p !== product));
    } else {
      setSelectedProducts([...selectedProducts, product]);
    }
  };

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
            B2B Sourcing Enquiry
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-[#0F2E23] tracking-tight">
            Tell us what your kitchen needs.
          </h1>
          <p className="text-base text-[#4F5E57] leading-relaxed">
            Share your poultry requirement and FarmReem will review the specification, quantity and delivery need with you.
          </p>
        </div>

        {submitted ? (
          <div className="bg-white rounded-3xl border border-[#E8E1D3] p-8 lg:p-12 text-center space-y-6 shadow-sm">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-extrabold text-[#0F2E23]">Requirement Received</h2>
              <p className="text-sm text-[#4F5E57] max-w-md mx-auto">
                Thank you. The FarmReem team will review your requirement and contact you shortly.
              </p>
            </div>

            {/* Account Application Pathway */}
            <div className="bg-[#FAF7F2] p-5 rounded-2xl border border-[#E8E1D3] space-y-2 max-w-md mx-auto text-center">
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-[#0F2E23]">
                Looking for regular standing weekly supply & account terms?
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
              Submit another requirement
            </button>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="bg-white rounded-3xl border border-[#E8E1D3] p-6 sm:p-10 shadow-sm space-y-6"
          >
            <div className="flex items-center justify-between pb-4 border-b border-[#E8E1D3]">
              <h2 className="text-xl font-extrabold text-[#0F2E23]">Kitchen Requirement Form</h2>
              <span className="text-xs font-semibold text-[#C59B27] flex items-center gap-1">
                <Lock className="w-3.5 h-3.5" /> Commercial Sales Desk
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
                  placeholder="e.g. Hotel / Restaurant / Catering Business"
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
                  placeholder="Full Name"
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
                  <option value="Restaurant">Standalone / Chain Restaurant</option>
                  <option value="Caterer">Caterer / Banquet Operator</option>
                  <option value="Institutional Kitchen">Institutional Kitchen / Mess</option>
                  <option value="Other">Other B2B Foodservice Buyer</option>
                </select>
              </div>

              <div className="space-y-2 sm:col-span-2">
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

              {/* Multi-Select Products Required */}
              <div className="space-y-2 sm:col-span-2 pt-2 border-t border-[#E8E1D3]">
                <label className="block text-xs font-extrabold text-[#0F2E23] uppercase tracking-wider">
                  What do you require? *
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 pt-1">
                  {productOptions.map((opt, idx) => (
                    <label
                      key={idx}
                      className={`flex items-center gap-2 p-3 rounded-xl border text-xs font-bold cursor-pointer transition-all ${
                        selectedProducts.includes(opt)
                          ? "bg-[#0F2E23] text-white border-[#0F2E23] shadow-sm"
                          : "bg-[#FAF7F2] text-[#0F2E23] border-[#E8E1D3] hover:bg-white"
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={selectedProducts.includes(opt)}
                        onChange={() => handleProductToggle(opt)}
                        className="rounded text-[#C59B27] focus:ring-[#0F2E23]"
                      />
                      <span>{opt}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-extrabold text-[#0F2E23] uppercase tracking-wider">
                  Approximate Requirement *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Birds per day/week OR KG per day/week"
                  value={formData.approxRequirement}
                  onChange={(e) => setFormData({ ...formData, approxRequirement: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-[#E8E1D3] bg-[#FAF7F2] text-sm text-[#0F2E23] focus:outline-none focus:ring-2 focus:ring-[#0F2E23]"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-extrabold text-[#0F2E23] uppercase tracking-wider">
                  Preferred Specification
                </label>
                <input
                  type="text"
                  placeholder="e.g. Small bird 800g-1kg OR Boneless thigh"
                  value={formData.preferredSpec}
                  onChange={(e) => setFormData({ ...formData, preferredSpec: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-[#E8E1D3] bg-[#FAF7F2] text-sm text-[#0F2E23] focus:outline-none focus:ring-2 focus:ring-[#0F2E23]"
                />
              </div>

              <div className="space-y-2 sm:col-span-2">
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
                  Notes
                </label>
                <textarea
                  rows={3}
                  placeholder="Delivery timing window or specific kitchen preferences..."
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-[#E8E1D3] bg-[#FAF7F2] text-sm text-[#0F2E23] focus:outline-none focus:ring-2 focus:ring-[#0F2E23]"
                />
              </div>
            </div>

            <div className="pt-4 border-t border-[#E8E1D3] flex items-center justify-between flex-wrap gap-4">
              <span className="text-xs text-[#4F5E57]">
                Commercial sales desk
              </span>
              <button
                type="submit"
                disabled={submitting}
                className="w-full sm:w-auto bg-[#0F2E23] hover:bg-[#184636] text-white font-extrabold text-sm px-8 py-3.5 rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70"
              >
                {submitting ? "Submitting..." : "Submit Requirement"}{" "}
                {!submitting && <Send className="w-4 h-4 text-[#C59B27]" />}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
