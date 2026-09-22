"use client";

import Link from "next/link";
import { ArrowRight, Phone, MessageSquare } from "lucide-react";

export default function MobileStickyCTA() {
  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#0F2E23]/95 backdrop-blur-md border-t border-[#184636] p-3 px-4 shadow-2xl flex items-center justify-between gap-2">
      <div className="flex items-center gap-1.5">
        <a
          href="tel:+918475863634"
          className="p-2.5 rounded-lg bg-[#184636] text-white hover:bg-[#205945] transition-colors flex items-center justify-center"
          aria-label="Call FarmReem (+91 8475863634)"
        >
          <Phone className="w-4 h-4" />
        </a>

        <a
          href="https://wa.me/918475863634"
          target="_blank"
          rel="noopener noreferrer"
          className="p-2.5 rounded-lg bg-emerald-800 text-white hover:bg-emerald-700 transition-colors flex items-center justify-center"
          aria-label="WhatsApp FarmReem"
        >
          <MessageSquare className="w-4 h-4 text-emerald-300" />
        </a>
      </div>

      <Link
        href="/request-pricing"
        className="flex-1 bg-[#C59B27] hover:bg-[#b0881f] text-[#0F2E23] font-extrabold text-xs py-2.5 px-3 rounded-lg transition-all flex items-center justify-center gap-1.5 shadow-md text-center"
      >
        Request B2B Pricing <ArrowRight className="w-3.5 h-3.5" />
      </Link>
    </div>
  );
}
