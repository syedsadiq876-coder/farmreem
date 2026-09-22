"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, ChevronDown, Lock } from "lucide-react";
import Logo from "@/components/layout/Logo";

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [solutionsDropdown, setSolutionsDropdown] = useState(false);
  const pathname = usePathname();

  const isCurrent = (path: string) => pathname === path;

  return (
    <header className="sticky top-0 z-50 bg-[#0F2E23]/95 backdrop-blur-md border-b border-[#184636] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Brand Logo */}
          <Logo variant="header" />

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-[#FAF7F2]/90">
            <Link
              href="/products"
              className={`hover:text-[#C59B27] transition-colors ${
                isCurrent("/products") ? "text-[#C59B27] font-semibold" : ""
              }`}
            >
              Products & Specs
            </Link>

            {/* Solutions Dropdown */}
            <div
              className="relative group py-6"
              onMouseEnter={() => setSolutionsDropdown(true)}
              onMouseLeave={() => setSolutionsDropdown(false)}
            >
              <button
                type="button"
                className="flex items-center gap-1 hover:text-[#C59B27] transition-colors focus:outline-none cursor-pointer"
              >
                Solutions <ChevronDown className="w-4 h-4 opacity-70 group-hover:rotate-180 transition-transform" />
              </button>

              {solutionsDropdown && (
                <div className="absolute top-16 left-0 w-64 bg-[#0A2118] border border-[#184636] rounded-xl shadow-2xl p-3 flex flex-col gap-1 z-50">
                  <Link
                    href="/solutions/hotels-restaurants"
                    className="px-3 py-2.5 rounded-lg hover:bg-[#184636] transition-colors text-sm font-medium text-white flex items-center gap-2"
                  >
                    <span>Hotels & Restaurants</span>
                  </Link>
                  <Link
                    href="/solutions/caterers-institutions"
                    className="px-3 py-2.5 rounded-lg hover:bg-[#184636] transition-colors text-sm font-medium text-white flex items-center gap-2"
                  >
                    <span>Caterers & Institutions</span>
                  </Link>
                </div>
              )}
            </div>

            <Link
              href="/supply-network"
              className={`hover:text-[#C59B27] transition-colors ${
                isCurrent("/supply-network") ? "text-[#C59B27] font-semibold" : ""
              }`}
            >
              Supply Network
            </Link>

            <Link
              href="/building-farmreem-farms"
              className={`hover:text-[#C59B27] transition-colors ${
                isCurrent("/building-farmreem-farms") ? "text-[#C59B27] font-semibold" : ""
              }`}
            >
              Building FarmReem Farms
            </Link>

            <Link
              href="/quality-sourcing"
              className={`hover:text-[#C59B27] transition-colors ${
                isCurrent("/quality-sourcing") ? "text-[#C59B27] font-semibold" : ""
              }`}
            >
              Quality & Sourcing
            </Link>

            <Link
              href="/become-partner"
              className={`hover:text-[#C59B27] transition-colors ${
                isCurrent("/become-partner") ? "text-[#C59B27] font-semibold" : ""
              }`}
            >
              Farm Partner
            </Link>

            <Link
              href="/about"
              className={`hover:text-[#C59B27] transition-colors ${
                isCurrent("/about") ? "text-[#C59B27] font-semibold" : ""
              }`}
            >
              About
            </Link>

            <Link
              href="/contact"
              className={`hover:text-[#C59B27] transition-colors ${
                isCurrent("/contact") ? "text-[#C59B27] font-semibold" : ""
              }`}
            >
              Contact
            </Link>
          </nav>

          {/* Right Action Buttons */}
          <div className="hidden lg:flex items-center gap-4">
            <Link
              href="/login"
              className="text-xs font-semibold uppercase tracking-wider text-[#FAF7F2] hover:text-[#C59B27] px-3 py-2 transition-colors flex items-center gap-1.5"
            >
              <Lock className="w-3.5 h-3.5" />
              B2B Login
            </Link>

            <Link
              href="/request-pricing"
              className="bg-[#C59B27] hover:bg-[#b0881f] text-[#0F2E23] font-bold text-sm px-5 py-2.5 rounded-lg transition-all shadow-md hover:shadow-lg focus:ring-2 focus:ring-[#C59B27] focus:ring-offset-2 focus:ring-offset-[#0F2E23]"
            >
              Request B2B Pricing
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden flex items-center gap-2">
            <Link
              href="/request-pricing"
              className="bg-[#C59B27] text-[#0F2E23] font-bold text-xs px-3.5 py-2 rounded-md"
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

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#0A2118] border-b border-[#184636] px-4 pt-4 pb-6 space-y-3">
          <Link
            href="/"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-base font-medium text-white hover:text-[#C59B27]"
          >
            Home
          </Link>
          <Link
            href="/products"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-base font-medium text-white hover:text-[#C59B27]"
          >
            Products & Specifications
          </Link>
          <Link
            href="/solutions/hotels-restaurants"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-base font-medium text-white hover:text-[#C59B27] pl-4 border-l-2 border-[#184636]"
          >
            Hotels & Restaurants
          </Link>
          <Link
            href="/solutions/caterers-institutions"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-base font-medium text-white hover:text-[#C59B27] pl-4 border-l-2 border-[#184636]"
          >
            Caterers & Institutions
          </Link>
          <Link
            href="/supply-network"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-base font-medium text-white hover:text-[#C59B27]"
          >
            Supply Network
          </Link>
          <Link
            href="/building-farmreem-farms"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-base font-medium text-white hover:text-[#C59B27]"
          >
            Building FarmReem Farms
          </Link>
          <Link
            href="/quality-sourcing"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-base font-medium text-white hover:text-[#C59B27]"
          >
            Quality & Sourcing
          </Link>
          <Link
            href="/become-partner"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-base font-medium text-white hover:text-[#C59B27]"
          >
            Become a Supply Partner
          </Link>
          <Link
            href="/about"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-base font-medium text-white hover:text-[#C59B27]"
          >
            About FarmReem
          </Link>
          <Link
            href="/contact"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-base font-medium text-white hover:text-[#C59B27]"
          >
            Contact
          </Link>

          <div className="pt-4 border-t border-[#184636] flex flex-col gap-2">
            <Link
              href="/login"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full text-center py-2.5 rounded-lg border border-[#184636] text-white text-sm font-semibold hover:bg-[#184636]"
            >
              B2B Customer Login
            </Link>
            <Link
              href="/request-pricing"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full text-center py-2.5 rounded-lg bg-[#C59B27] text-[#0F2E23] text-sm font-bold shadow-md"
            >
              Request B2B Pricing
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
