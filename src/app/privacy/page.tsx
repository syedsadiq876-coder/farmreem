import type { Metadata } from "next";
import Link from "next/link";
import { ShieldCheck, Mail, Phone, MapPin } from "lucide-react";

export const metadata: Metadata = {
  title: "Privacy Policy | FarmReem B2B Poultry Sourcing",
  description: "FarmReem privacy policy covering business information collection, data protection, and commercial contact standards.",
  alternates: {
    canonical: "https://farmreem.com/privacy",
  },
  openGraph: {
    title: "Privacy Policy | FarmReem",
    description: "FarmReem privacy policy and commercial data protection commitment.",
    url: "https://farmreem.com/privacy",
  },
};

export default function PrivacyPage() {
  return (
    <div className="bg-[#FAF7F2] py-12 lg:py-20 text-[#0F2E23]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Header */}
        <div className="space-y-3 pb-6 border-b border-[#E8E1D3]">
          <span className="text-xs font-extrabold uppercase tracking-wider text-[#C59B27]">
            Legal & Governance
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-[#0F2E23] tracking-tight">
            Privacy Policy
          </h1>
          <p className="text-xs text-[#4F5E57]">
            Effective Date: September 2026 · FarmReem Sourcing & Logistics (farmreem.com)
          </p>
        </div>

        {/* Content Section */}
        <div className="bg-white rounded-3xl border border-[#E8E1D3] p-6 sm:p-12 shadow-sm space-y-8 text-sm text-[#4F5E57] leading-relaxed">
          
          <div className="space-y-3">
            <h2 className="text-lg font-extrabold text-[#0F2E23]">1. Information We Collect</h2>
            <p>
              FarmReem collects business contact information submitted voluntarily through our B2B pricing requests, commercial account applications, supplier inquiries, and direct communication channels.
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Establishment or business name, type, and operational location</li>
              <li>Contact person name, designation, mobile number, WhatsApp number, and business email</li>
              <li>Sourcing requirements (approximate daily bird volume, preferred weight specifications, delivery schedules)</li>
              <li>Optional tax or licensing information (GSTIN, FSSAI) provided during account setup</li>
            </ul>
          </div>

          <div className="space-y-3">
            <h2 className="text-lg font-extrabold text-[#0F2E23]">2. Purpose of Information Use</h2>
            <p>Information provided to FarmReem is used exclusively for legitimate B2B commercial purposes:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Responding to pricing inquiries and providing account-specific quotations</li>
              <li>Evaluating and verifying B2B customer accounts for recurring supply schedules</li>
              <li>Coordinating morning receiving dock deliveries and logistics routes</li>
              <li>Issuing weighment records, invoices, and commercial documentation</li>
              <li>Communicating operational updates regarding supply availability or schedule adjustments</li>
            </ul>
          </div>

          <div className="space-y-3">
            <h2 className="text-lg font-extrabold text-[#0F2E23]">3. Data Sharing & Confidentiality</h2>
            <p>
              FarmReem respects commercial confidentiality. We do not sell, rent, or trade business contact lists or purchasing data to third parties. Information may only be shared with logistics partners or service providers strictly necessary to execute scheduled deliveries and account operations.
            </p>
          </div>

          <div className="space-y-3">
            <h2 className="text-lg font-extrabold text-[#0F2E23]">4. Data Security</h2>
            <p>
              We implement appropriate technical and organizational safeguards to protect business information submitted to our website against unauthorized access, loss, or misuse.
            </p>
          </div>

          <div className="space-y-3">
            <h2 className="text-lg font-extrabold text-[#0F2E23]">5. Communication Preferences & Contact</h2>
            <p>
              If you have questions regarding this Privacy Policy or wish to update your business contact preferences, please contact our administrative desk:
            </p>
            <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#E8E1D3] space-y-2 text-xs font-medium text-[#0F2E23]">
              <p className="font-extrabold">FarmReem Sourcing & Logistics</p>
              <p>39, Siddharth Vihar, Kandoli, Sahastradhara Road, Dehradun, Uttarakhand 248001, India</p>
              <p>Email: <a href="mailto:contact@farmreem.com" className="text-[#C59B27] underline">contact@farmreem.com</a> | Phone: <a href="tel:+918475863634" className="text-[#C59B27] underline">+91 8475863634</a></p>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
