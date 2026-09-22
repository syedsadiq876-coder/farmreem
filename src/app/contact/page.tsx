"use client";

import { useState } from "react";
import Link from "next/link";
import { Phone, Mail, MapPin, Send, CheckCircle2, MessageSquare, ArrowRight } from "lucide-react";

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: "FarmReem",
    url: "https://farmreem.com",
    telephone: "+918475863634",
    email: "contact@farmreem.com",
    address: {
      "@type": "PostalAddress",
      streetAddress: "39, Siddharth Vihar, Kandoli, Sahastradhara Road",
      addressLocality: "Dehradun",
      addressRegion: "Uttarakhand",
      postalCode: "248001",
      addressCountry: "IN",
    },
  };

  return (
    <div className="bg-[#FAF7F2] py-12 lg:py-20">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Header */}
        <div className="max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0F2E23]/10 text-[#0F2E23] text-xs font-bold uppercase tracking-wider">
            Dehradun, Uttarakhand · B2B Sourcing
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-[#0F2E23] tracking-tight">
            Contact FarmReem
          </h1>
          <p className="text-base text-[#4F5E57] leading-relaxed">
            Reach our B2B commercial team for live broiler procurement, weight specifications, delivery schedules, and account pricing.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Official Primary Contact Block */}
          <div className="lg:col-span-5 space-y-8">
            <div className="bg-white p-8 rounded-2xl border border-[#E8E1D3] space-y-6 shadow-sm">
              <div>
                <span className="text-xs font-extrabold uppercase tracking-wider text-[#C59B27] block">
                  Official Business Details
                </span>
                <h2 className="text-2xl font-extrabold text-[#0F2E23]">
                  FarmReem
                </h2>
                <p className="text-xs font-semibold text-[#4F5E57]">
                  B2B Poultry & Foodservice Supply
                </p>
              </div>

              <div className="space-y-5 text-sm pt-2 border-t border-[#E8E1D3]">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-[#FAF7F2] border border-[#E8E1D3] flex items-center justify-center text-[#C59B27] flex-shrink-0">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-[#4F5E57] block">
                      Phone Contact
                    </span>
                    <a href="tel:+918475863634" className="font-bold text-[#0F2E23] hover:text-[#C59B27] text-base">
                      +91 8475863634
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-[#FAF7F2] border border-[#E8E1D3] flex items-center justify-center text-[#C59B27] flex-shrink-0">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-[#4F5E57] block">
                      Official Email
                    </span>
                    <a href="mailto:contact@farmreem.com" className="font-bold text-[#0F2E23] hover:text-[#C59B27] text-base">
                      contact@farmreem.com
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-[#FAF7F2] border border-[#E8E1D3] flex items-center justify-center text-[#C59B27] flex-shrink-0">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-[#4F5E57] block">
                      Registered Business Address
                    </span>
                    <address className="not-italic font-medium text-[#0F2E23] text-sm leading-relaxed">
                      39, Siddharth Vihar,<br />
                      Kandoli, Sahastradhara Road,<br />
                      Dehradun, Uttarakhand 248001,<br />
                      India
                    </address>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-[#E8E1D3] space-y-3">
                <a
                  href="tel:+918475863634"
                  className="w-full bg-[#0F2E23] hover:bg-[#184636] text-white font-bold text-sm py-3.5 px-6 rounded-xl transition-all shadow flex items-center justify-center gap-2 text-center"
                >
                  <Phone className="w-4 h-4 text-[#C59B27]" /> Call FarmReem (+91 8475863634)
                </a>

                <a
                  href="https://wa.me/918475863634"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full bg-emerald-800 hover:bg-emerald-700 text-white font-bold text-sm py-3 px-6 rounded-xl transition-all shadow flex items-center justify-center gap-2 text-center"
                >
                  <MessageSquare className="w-4 h-4 text-emerald-300" /> WhatsApp FarmReem
                </a>

                <Link
                  href="/request-pricing"
                  className="w-full bg-[#C59B27] hover:bg-[#b0881f] text-[#0F2E23] font-bold text-sm py-3 px-6 rounded-xl transition-all shadow flex items-center justify-center gap-2 text-center"
                >
                  Request B2B Pricing <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>

          {/* Form Card */}
          <div className="lg:col-span-7">
            {submitted ? (
              <div className="bg-white rounded-2xl border border-[#E8E1D3] p-8 text-center space-y-4 shadow-sm">
                <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
                <h3 className="text-xl font-bold text-[#0F2E23]">Inquiry Submitted</h3>
                <p className="text-sm text-[#4F5E57]">
                  Thank you for reaching out to FarmReem. Our commercial team will contact you shortly.
                </p>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
                className="bg-white p-8 rounded-2xl border border-[#E8E1D3] shadow-sm space-y-6"
              >
                <h2 className="text-xl font-bold text-[#0F2E23] pb-2 border-b border-[#E8E1D3]">
                  Send Inquiry to FarmReem Commercial Desk
                </h2>

                <div className="space-y-4">
                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-[#0F2E23] uppercase tracking-wider">
                      Your Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Full Name"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-[#E8E1D3] bg-[#FAF7F2] text-sm text-[#0F2E23] focus:outline-none focus:ring-2 focus:ring-[#0F2E23]"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="block text-xs font-bold text-[#0F2E23] uppercase tracking-wider">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        required
                        placeholder="buyer@kitchen.com"
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl border border-[#E8E1D3] bg-[#FAF7F2] text-sm text-[#0F2E23] focus:outline-none focus:ring-2 focus:ring-[#0F2E23]"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="block text-xs font-bold text-[#0F2E23] uppercase tracking-wider">
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        required
                        placeholder="+91 98765 43210"
                        value={form.phone}
                        onChange={(e) => setForm({ ...form, phone: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl border border-[#E8E1D3] bg-[#FAF7F2] text-sm text-[#0F2E23] focus:outline-none focus:ring-2 focus:ring-[#0F2E23]"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-[#0F2E23] uppercase tracking-wider">
                      Kitchen Sourcing Requirement / Message *
                    </label>
                    <textarea
                      rows={4}
                      required
                      placeholder="Specify your business requirement, preferred bird weight range, or daily quantity..."
                      value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-[#E8E1D3] bg-[#FAF7F2] text-sm text-[#0F2E23] focus:outline-none focus:ring-2 focus:ring-[#0F2E23]"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-[#0F2E23] hover:bg-[#184636] text-white font-bold text-sm px-6 py-3.5 rounded-xl transition-all shadow flex items-center justify-center gap-2"
                >
                  Send Inquiry <Send className="w-4 h-4" />
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
