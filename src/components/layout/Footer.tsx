import Link from "next/link";
import { Truck, Phone, Mail, MapPin, ExternalLink } from "lucide-react";
import Logo from "@/components/layout/Logo";

export default function Footer() {
  return (
    <footer className="bg-[#0A2118] text-[#FAF7F2] border-t border-[#184636]">
      {/* Top Banner */}
      <div className="border-b border-[#184636] bg-[#0F2E23]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-[#C59B27]/10 border border-[#C59B27]/30 flex items-center justify-center text-[#C59B27]">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-lg text-white">Scheduled Morning Commercial Delivery</h4>
              <p className="text-xs text-[#FAF7F2]/70">Delivery slots allocated per route and approved B2B kitchen account</p>
            </div>
          </div>
          <Link
            href="/request-pricing"
            className="bg-[#C59B27] hover:bg-[#b0881f] text-[#0F2E23] font-bold text-sm px-6 py-3 rounded-lg transition-all shadow-md whitespace-nowrap"
          >
            Request B2B Pricing
          </Link>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
        {/* Brand Info */}
        <div className="lg:col-span-2 space-y-4">
          <Logo variant="footer" />
          <p className="text-sm text-[#FAF7F2]/75 leading-relaxed max-w-sm pt-2">
            FarmReem — Reliable Poultry Supply for Professional Kitchens. B2B live broiler sourcing and scheduled delivery for hotels, restaurants, caterers, and institutions.
          </p>
          <div className="pt-2 flex flex-col gap-2.5 text-xs text-[#FAF7F2]/70">
            <div className="flex items-start gap-2.5">
              <Phone className="w-4 h-4 text-[#C59B27] flex-shrink-0 mt-0.5" />
              <a href="tel:+918475863634" className="hover:text-white transition-colors">
                +91 8475863634
              </a>
            </div>
            <div className="flex items-start gap-2.5">
              <Mail className="w-4 h-4 text-[#C59B27] flex-shrink-0 mt-0.5" />
              <a href="mailto:contact@farmreem.com" className="hover:text-white transition-colors">
                contact@farmreem.com
              </a>
            </div>
            <div className="flex items-start gap-2.5">
              <MapPin className="w-4 h-4 text-[#C59B27] flex-shrink-0 mt-0.5" />
              <span>
                39, Siddharth Vihar, Kandoli, Sahastradhara Road, Dehradun, Uttarakhand 248001, India
              </span>
            </div>
          </div>
        </div>

        {/* Column 1: Navigation */}
        <div className="space-y-3">
          <h5 className="font-bold text-sm uppercase tracking-wider text-[#C59B27]">Sourcing & Specs</h5>
          <ul className="space-y-2 text-sm text-[#FAF7F2]/80">
            <li>
              <Link href="/products" className="hover:text-white transition-colors">
                Products
              </Link>
            </li>
            <li>
              <Link href="/solutions/hotels-restaurants" className="hover:text-white transition-colors">
                Hotels & Restaurants
              </Link>
            </li>
            <li>
              <Link href="/solutions/caterers-institutions" className="hover:text-white transition-colors">
                Caterers & Institutions
              </Link>
            </li>
            <li>
              <Link href="/quality-sourcing" className="hover:text-white transition-colors">
                Quality & Sourcing
              </Link>
            </li>
          </ul>
        </div>

        {/* Column 2: Supply Network */}
        <div className="space-y-3">
          <h5 className="font-bold text-sm uppercase tracking-wider text-[#C59B27]">Supply Network</h5>
          <ul className="space-y-2 text-sm text-[#FAF7F2]/80">
            <li>
              <Link href="/supply-network" className="hover:text-white transition-colors">
                Supply Network
              </Link>
            </li>
            <li>
              <Link href="/building-farmreem-farms" className="hover:text-white transition-colors">
                Building FarmReem Farms
              </Link>
            </li>
            <li>
              <Link href="/become-partner" className="hover:text-white transition-colors">
                Become a Partner
              </Link>
            </li>
            <li>
              <Link href="/about" className="hover:text-white transition-colors">
                About
              </Link>
            </li>
          </ul>
        </div>

        {/* Column 3: B2B Actions */}
        <div className="space-y-3">
          <h5 className="font-bold text-sm uppercase tracking-wider text-[#C59B27]">B2B Actions</h5>
          <ul className="space-y-2 text-sm text-[#FAF7F2]/80">
            <li>
              <Link href="/contact" className="hover:text-white transition-colors">
                Contact
              </Link>
            </li>
            <li>
              <Link href="/request-pricing" className="hover:text-white transition-colors">
                Request B2B Pricing
              </Link>
            </li>
            <li>
              <Link href="/login" className="hover:text-white transition-colors flex items-center gap-1">
                B2B Login <ExternalLink className="w-3 h-3" />
              </Link>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom Legal Bar */}
      <div className="border-t border-[#184636] py-6 bg-[#071711]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between text-xs text-[#FAF7F2]/50 gap-4">
          <p>© {new Date().getFullYear()} FarmReem (farmreem.com). Dehradun, Uttarakhand. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <span className="text-[#FAF7F2]/40">[ B2B Supply Terms (Placeholder) ]</span>
            <span>·</span>
            <span className="text-[#FAF7F2]/40">[ Privacy Policy (Placeholder) ]</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
