"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, ChevronDown, Lock, Phone } from "lucide-react";
import Logo from "@/components/layout/Logo";

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [businessDropdownOpen, setBusinessDropdownOpen] = useState(false);
  const pathname = usePathname();

  const isCurrent = (path: string) => pathname === path;

  return (
    <header className="sticky top-0 z-50 bg-[#FAF7F2]/95 backdrop-blur-md border-b border-[#E8E1D3] text-[#0F2E23]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Brand Logo - Prominent & Crisp */}
          <Logo variant="header" />

          {/* Desktop Primary Navigation (Max 5 Top Items) */}
          <nav className="hidden lg:flex items-center gap-8 text-sm font-bold text-[#0F2E23]">
            <Link
              href="/products"
              className={`hover:text-[#C59B27] transition-colors ${
                isCurrent("/products") ? "text-[#C59B27]" : ""
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
                <div className="absolute top-16 left-0 w-64 bg-white border border-[#E8E1D3] rounded-xl shadow-xl p-2 flex flex-col gap-1 z-50">
                  <Link
                    href="/solutions/hotels-restaurants"
                    className="px-3 py-2.5 rounded-lg hover:bg-[#FAF7F2] transition-colors text-xs font-bold text-[#0F2E23] flex flex-col"
                  >
                    <span>Hotels & Restaurants</span>
                    <span className="text-[10px] text-[#4F5E57] font-normal">Uniform weights & morning dock delivery</span>
                  </Link>
                  <Link
                    href="/solutions/caterers-institutions"
                    className="px-3 py-2.5 rounded-lg hover:bg-[#FAF7F2] transition-colors text-xs font-bold text-[#0F2E23] flex flex-col"
                  >
                    <span>Caterers & Institutions</span>
                    <span className="text-[10px] text-[#4F5E57] font-normal">High-volume batch sourcing</span>
                  </Link>
                </div>
              )}
            </div>

            <Link
              href="/supply-network"
              className={`hover:text-[#C59B27] transition-colors ${
                isCurrent("/supply-network") ? "text-[#C59B27]" : ""
              }`}
            >
              Supply Network
            </Link>

            <Link
              href="/about"
              className={`hover:text-[#C59B27] transition-colors ${
                isCurrent("/about") ? "text-[#C59B27]" : ""
              }`}
            >
              About
            </Link>
          </nav>

          {/* Right Action CTAs */}
          <div className="hidden lg:flex items-center gap-4">
            <Link
              href="/login"
              className="text-xs font-bold uppercase tracking-wider text-[#0F2E23] hover:text-[#C59B27] px-3 py-2 transition-colors flex items-center gap-1.5"
            >
              <Lock className="w-3.5 h-3.5 text-[#C59B27]" />
              B2B Login
            </Link>

            <Link
              href="/request-pricing"
              className="bg-[#0F2E23] hover:bg-[#184636] text-[#FAF7F2] font-extrabold text-xs px-5 py-2.5 rounded-xl transition-all shadow-md hover:shadow-lg focus:ring-2 focus:ring-[#0F2E23]"
            >
              Request B2B Pricing
            </Link>
          </div>

          {/* Mobile Navigation Button */}
          <div className="lg:hidden flex items-center gap-2">
            <Link
              href="/request-pricing"
              className="bg-[#0F2E23] text-white font-extrabold text-xs px-3.5 py-2 rounded-lg"
            >
              Pricing
            </Link>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              type="button"
              className="p-2 text-[#0F2E23] hover:text-[#C59B27] focus:outline-none"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-[#E8E1D3] px-4 pt-4 pb-6 space-y-3">
          <Link
            href="/"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-base font-bold text-[#0F2E23] hover:text-[#C59B27]"
          >
            Home
          </Link>
          <Link
            href="/products"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-base font-bold text-[#0F2E23] hover:text-[#C59B27]"
          >
            Products & Specifications
          </Link>
          <Link
            href="/solutions/hotels-restaurants"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-sm font-semibold text-[#4F5E57] hover:text-[#0F2E23] pl-4 border-l-2 border-[#E8E1D3]"
          >
            Hotels & Restaurants
          </Link>
          <Link
            href="/solutions/caterers-institutions"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-sm font-semibold text-[#4F5E57] hover:text-[#0F2E23] pl-4 border-l-2 border-[#E8E1D3]"
          >
            Caterers & Institutions
          </Link>
          <Link
            href="/supply-network"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-base font-bold text-[#0F2E23] hover:text-[#C59B27]"
          >
            Supply Network
          </Link>
          <Link
            href="/about"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-base font-bold text-[#0F2E23] hover:text-[#C59B27]"
          >
            About FarmReem
          </Link>
          <Link
            href="/contact"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-base font-bold text-[#0F2E23] hover:text-[#C59B27]"
          >
            Contact Desk
          </Link>

          <div className="pt-4 border-t border-[#E8E1D3] flex flex-col gap-2">
            <a
              href="tel:+918475863634"
              className="w-full text-center py-2.5 rounded-xl border border-[#E8E1D3] text-[#0F2E23] text-xs font-bold flex items-center justify-center gap-2"
            >
              <Phone className="w-3.5 h-3.5 text-[#C59B27]" /> Call +91 8475863634
            </a>
            <Link
              href="/login"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full text-center py-2.5 rounded-xl border border-[#E8E1D3] text-[#0F2E23] text-xs font-bold"
            >
              B2B Login
            </Link>
            <Link
              href="/request-pricing"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full text-center py-2.5 rounded-xl bg-[#0F2E23] text-white text-xs font-extrabold shadow-md"
            >
              Request B2B Pricing
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
