"use client";

import { useState } from "react";
import Image from "next/image";

export default function EmailTemplatesPreview() {
  const [selectedTemplate, setSelectedTemplate] = useState<"received" | "approved" | "info" | "rejected" | "activation">("approved");

  const templates = {
    received: {
      subject: "Application Received — FarmReem B2B Account",
      badge: "Application Intake",
      badgeColor: "bg-blue-100 text-blue-800",
      content: (
        <div className="space-y-4">
          <p className="text-sm font-semibold text-[#0F2E23]">Dear Purchasing Director,</p>
          <p className="text-xs text-[#4F5E57] leading-relaxed">
            Thank you for applying for a commercial kitchen account with <strong>FarmReem</strong>. Your application for <strong>Grand Hotel & Suites</strong> has been received by our verification desk in Dehradun.
          </p>
          <p className="text-xs text-[#4F5E57] leading-relaxed">
            Our account managers will review your business category, requested live broiler weight specifications, and delivery route requirements. You will receive a follow-up confirmation within 2 hours.
          </p>
        </div>
      ),
    },
    approved: {
      subject: "Account Approved — Welcome to FarmReem B2B Sourcing",
      badge: "Account Verification Approved",
      badgeColor: "bg-emerald-100 text-emerald-800",
      content: (
        <div className="space-y-4">
          <p className="text-sm font-semibold text-[#0F2E23]">Congratulations, Executive Chef,</p>
          <p className="text-xs text-[#4F5E57] leading-relaxed">
            Your B2B kitchen account with <strong>FarmReem</strong> has been verified and approved. You can now access your account-specific live broiler contract rates and submit daily morning orders.
          </p>

          <div className="p-4 rounded-xl bg-[#FAF7F2] border border-[#E8E1D3] text-xs space-y-2">
            <div className="flex justify-between">
              <span className="text-[#4F5E57]">Assigned Customer ID:</span>
              <span className="font-bold text-[#0F2E23]">FR-8842-DDN</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#4F5E57]">Live Broiler Rate Tier:</span>
              <span className="font-bold text-[#0F2E23]">Hospitality Contract Tier</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#4F5E57]">Weighment Basis:</span>
              <span className="font-bold text-[#0F2E23]">Receiving Weight Verification</span>
            </div>
          </div>

          <div className="pt-2 text-center">
            <a
              href="/login"
              className="inline-block bg-[#0F2E23] text-[#C59B27] font-bold text-xs px-6 py-3 rounded-lg shadow"
            >
              Sign In to B2B Customer Portal
            </a>
          </div>
        </div>
      ),
    },
    info: {
      subject: "Action Required — FarmReem Account Verification",
      badge: "Information Requested",
      badgeColor: "bg-amber-100 text-amber-800",
      content: (
        <div className="space-y-4">
          <p className="text-sm font-semibold text-[#0F2E23]">Dear Purchase Manager,</p>
          <p className="text-xs text-[#4F5E57] leading-relaxed">
            We require additional information to complete the verification of your FarmReem B2B account application.
          </p>
          <p className="text-xs text-[#4F5E57] leading-relaxed">
            Please reply to this email or contact our Dehradun commercial desk at <strong>+91 8475863634</strong> to provide your delivery dock receiving window and tax identifier.
          </p>
        </div>
      ),
    },
    rejected: {
      subject: "Update Regarding FarmReem Account Application",
      badge: "Application Status Update",
      badgeColor: "bg-slate-100 text-slate-800",
      content: (
        <div className="space-y-4">
          <p className="text-sm font-semibold text-[#0F2E23]">Dear Applicant,</p>
          <p className="text-xs text-[#4F5E57] leading-relaxed">
            Thank you for your interest in FarmReem. At this time, we are unable to approve your commercial account application due to delivery route coverage limitations in your specified zone.
          </p>
          <p className="text-xs text-[#4F5E57] leading-relaxed">
            We will retain your details and notify you as our transport delivery routes expand.
          </p>
        </div>
      ),
    },
    activation: {
      subject: "Activate Your FarmReem Account Password",
      badge: "Password Activation",
      badgeColor: "bg-purple-100 text-purple-800",
      content: (
        <div className="space-y-4">
          <p className="text-sm font-semibold text-[#0F2E23]">Account Activation,</p>
          <p className="text-xs text-[#4F5E57] leading-relaxed">
            Please click the button below to set your secure password and activate your FarmReem B2B customer portal credentials.
          </p>
          <div className="pt-2 text-center">
            <button className="bg-[#C59B27] text-[#0F2E23] font-extrabold text-xs px-6 py-3 rounded-lg shadow">
              Activate B2B Account Password
            </button>
          </div>
        </div>
      ),
    },
  }[selectedTemplate];

  return (
    <div className="bg-white rounded-2xl border border-[#E8E1D3] p-6 space-y-6 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-[#E8E1D3]">
        <div className="space-y-1">
          <span className="text-xs font-bold text-[#C59B27] uppercase tracking-wider">
            System Email Notification Preview
          </span>
          <h3 className="text-lg font-bold text-[#0F2E23]">Transactional Brand Email Templates</h3>
        </div>

        {/* Template Selector */}
        <div className="flex flex-wrap gap-1.5 text-xs font-semibold">
          {[
            { id: "approved", label: "Account Approved" },
            { id: "received", label: "Application Received" },
            { id: "info", label: "Request Info" },
            { id: "rejected", label: "Rejection Notice" },
            { id: "activation", label: "Activation Password" },
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setSelectedTemplate(t.id as any)}
              className={`px-3 py-1.5 rounded-lg border transition-all ${
                selectedTemplate === t.id
                  ? "bg-[#0F2E23] text-white border-[#0F2E23]"
                  : "bg-[#FAF7F2] text-[#4F5E57] border-[#E8E1D3] hover:text-[#0F2E23]"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Email Body Container (Standard 600px width email client format) */}
      <div className="max-w-[600px] mx-auto bg-[#FAF7F2] border border-[#E8E1D3] rounded-2xl overflow-hidden shadow-md">
        {/* Email Header */}
        <div className="bg-[#0F2E23] p-6 text-white text-center space-y-3">
          <div className="w-14 h-14 rounded-full bg-white p-1 mx-auto shadow-md">
            <Image
              src="/images/farmreem-logo.png"
              alt="FarmReem"
              width={56}
              height={56}
              className="rounded-full object-cover w-full h-full"
            />
          </div>
          <div>
            <span className="font-extrabold text-2xl tracking-tight text-white block">
              Farm<span className="text-[#C59B27]">Reem</span>
            </span>
            <span style={{ fontSize: "10px", color: "#C59B27", fontWeight: "bold", textTransform: "uppercase", letterSpacing: "1px" }}>
              Foodservice Supply · India
            </span>
          </div>
        </div>

        {/* Subject Bar */}
        <div className="bg-white p-4 px-6 border-b border-[#E8E1D3] flex items-center justify-between gap-4">
          <span className="text-xs font-bold text-[#0F2E23] truncate">{templates.subject}</span>
          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${templates.badgeColor}`}>
            {templates.badge}
          </span>
        </div>

        {/* Main Content */}
        <div className="p-6 sm:p-8 bg-white space-y-4">{templates.content}</div>

        {/* Email Footer (Mandatory Official Contact Info) */}
        <div className="bg-[#0A2118] text-[#FAF7F2] p-6 text-center text-xs space-y-3 border-t border-[#184636]">
          <div className="space-y-1">
            <p className="font-extrabold text-white text-sm">FarmReem B2B Foodservice Supply</p>
            <p className="text-[11px] text-[#FAF7F2]/70">
              39, Siddharth Vihar, Kandoli, Sahastradhara Road, Dehradun, Uttarakhand 248001, India
            </p>
          </div>

          <div className="flex items-center justify-center gap-4 text-[11px] text-[#C59B27] font-semibold pt-2 border-t border-[#184636]">
            <span>Phone: +91 8475863634</span>
            <span>·</span>
            <span>Email: contact@farmreem.com</span>
            <span>·</span>
            <span>Web: farmreem.com</span>
          </div>
        </div>
      </div>
    </div>
  );
}
