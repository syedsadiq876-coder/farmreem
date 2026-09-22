"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, ChevronDown, Lock, Phone, MessageSquare } from "lucide-react";
import Logo from "@/components/layout/Logo";

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [businessDropdownOpen, setBusinessDropdownOpen] = useState(false);
  const pathname = usePathname();

  const isCurrent = (path: string) => pathname === path;

  return (
    <header className="sticky top-0 z-50 bg-[#0F2E23]/95 backdrop-blur-md border-b border-[#184636] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Brand Logo */}
          <Logo variant="header" />

          {/* Desktop Primary Navigation (Max 5 Items) */}
          <nav className="hidden lg:flex items-center gap-7 text-sm font-semibold text-[#FAF7F2]/90">
            <Link
              href="/products"
              className={`hover:text-[#C59B27] transition-colors ${
                isCurrent("/products") ? "text-[#C59B27] font-bold" : ""
              }`}
            >
              Products
            </Link>

            <Link
              href="/#how-it-works"
              className="hover:text-[#C59B27] transition-colors"
            >
              How It Works
            </Link>

            {/* For Business Dropdown */}
            <div
              className="relative py-6 group"
              onMouseEnter={() => setBusinessDropdownOpen(true)}
              onMouseLeave={() => setBusinessDropdownOpen(false)}
            >
              <button
                type="button"
                className="flex items-center gap-1 hover:text-[#C59B27] transition-colors focus:outline-none cursor-pointer"
              >
                For Business{" "}
                <ChevronDown className="w-4 h-4 opacity-70 group-hover:rotate-180 transition-transform" />
              </button>

              {businessDropdownOpen && (
                <div className="absolute top-16 left-0 w-64 bg-[#0A2118] border border-[#184636] rounded-xl shadow-2xl p-2 flex flex-col gap-1 z-50">
                  <Link
                    href="/solutions/hotels-restaurants"
                    className="px-3 py-2.5 rounded-lg hover:bg-[#184636] transition-colors text-xs font-semibold text-white flex flex-col"
                  >
                    <span>Hotels & Restaurants</span>
                    <span className="text-[10px] text-[#FAF7F2]/60 font-normal">Uniform weights & morning dock delivery</span>
                  </Link>
                  <Link
                    href="/solutions/caterers-institutions"
                    className="px-3 py-2.5 rounded-lg hover:bg-[#184636] transition-colors text-xs font-semibold text-white flex flex-col"
                  >
                    <span>Caterers & Institutions</span>
                    <span className="text-[10px] text-[#FAF7F2]/60 font-normal">High-volume batch sourcing</span>
                  </Link>
                </div>
              )}
            </div>

            <Link
              href="/supply-network"
              className={`hover:text-[#C59B27] transition-colors ${
                isCurrent("/supply-network") ? "text-[#C59B27] font-bold" : ""
              }`}
            >
              Supply Network
            </Link>

            <Link
              href="/about"
              className={`hover:text-[#C59B27] transition-colors ${
                isCurrent("/about") ? "text-[#C59B27] font-bold" : ""
              }`}
            >
              About
            </Link>
          </nav>

          {/* Right Action CTAs */}
          <div className="hidden lg:flex items-center gap-4">
            <Link
              href="/login"
              className="text-xs font-bold uppercase tracking-wider text-[#FAF7F2] hover:text-[#C59B27] px-3 py-2 transition-colors flex items-center gap-1.5"
            >
              <Lock className="w-3.5 h-3.5" />
              B2B Login
            </Link>

            <Link
              href="/request-pricing"
              className="bg-[#C59B27] hover:bg-[#b0881f] text-[#0F2E23] font-extrabold text-xs px-5 py-2.5 rounded-xl transition-all shadow-md hover:shadow-lg focus:ring-2 focus:ring-[#C59B27]"
            >
              Request Pricing
            </Link>
          </div>

          {/* Mobile Navigation Trigger */}
          <div className="lg:hidden flex items-center gap-2">
            <Link
              href="/request-pricing"
              className="bg-[#C59B27] text-[#0F2E23] font-extrabold text-xs px-3.5 py-2 rounded-lg"
            >
              Pricing
            </Link>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              type="button"
              className="p-2 text-[#FAF7F2] hover:text-[#C59B27] focus:outline-none"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Simplified Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#0A2118] border-b border-[#184636] px-4 pt-4 pb-6 space-y-3">
          <Link
            href="/"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-base font-semibold text-white hover:text-[#C59B27]"
          >
            Home
          </Link>
          <Link
            href="/products"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-base font-semibold text-white hover:text-[#C59B27]"
          >
            Products & Specifications
          </Link>
          <Link
            href="/solutions/hotels-restaurants"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-sm font-medium text-[#FAF7F2]/80 hover:text-[#C59B27] pl-4 border-l-2 border-[#184636]"
          >
            Hotels & Restaurants
          </Link>
          <Link
            href="/solutions/caterers-institutions"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-sm font-medium text-[#FAF7F2]/80 hover:text-[#C59B27] pl-4 border-l-2 border-[#184636]"
          >
            Caterers & Institutions
          </Link>
          <Link
            href="/supply-network"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-base font-semibold text-white hover:text-[#C59B27]"
          >
            Supply Network
          </Link>
          <Link
            href="/about"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-base font-semibold text-white hover:text-[#C59B27]"
          >
            About FarmReem
          </Link>
          <Link
            href="/contact"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-base font-semibold text-white hover:text-[#C59B27]"
          >
            Contact Desk
          </Link>

          <div className="pt-4 border-t border-[#184636] flex flex-col gap-2">
            <a
              href="tel:+918475863634"
              className="w-full text-center py-2.5 rounded-xl border border-[#184636] text-white text-xs font-semibold flex items-center justify-center gap-2"
            >
              <Phone className="w-3.5 h-3.5 text-[#C59B27]" /> Call +91 8475863634
            </a>
            <Link
              href="/login"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full text-center py-2.5 rounded-xl border border-[#184636] text-white text-xs font-semibold"
            >
              B2B Login
            </Link>
            <Link
              href="/request-pricing"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full text-center py-2.5 rounded-xl bg-[#C59B27] text-[#0F2E23] text-xs font-extrabold shadow-md"
            >
              Request B2B Pricing
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
