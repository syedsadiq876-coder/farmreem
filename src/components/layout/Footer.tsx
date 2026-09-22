import Link from "next/link";
import { Phone, Mail, MapPin } from "lucide-react";
import Logo from "@/components/layout/Logo";

export default function Footer() {
  return (
    <footer className="bg-[#0A2118] text-[#FAF7F2] border-t border-[#184636]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        
        {/* Brand & Address Column */}
        <div className="md:col-span-6 space-y-4">
          <Logo variant="footer" />
          <p className="text-xs text-[#FAF7F2]/75 max-w-sm leading-relaxed">
            Reliable live broiler sourcing and scheduled B2B delivery for professional kitchens in Dehradun and surrounding regions.
          </p>

          <div className="pt-2 space-y-2 text-xs text-[#FAF7F2]/70">
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-[#C59B27]" />
              <a href="tel:+918475863634" className="hover:text-white transition-colors">
                +91 8475863634
              </a>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-[#C59B27]" />
              <a href="mailto:contact@farmreem.com" className="hover:text-white transition-colors">
                contact@farmreem.com
              </a>
            </div>
            <div className="flex items-start gap-2">
              <MapPin className="w-4 h-4 text-[#C59B27] flex-shrink-0 mt-0.5" />
              <span>
                39, Siddharth Vihar, Kandoli, Sahastradhara Road, Dehradun, Uttarakhand 248001, India
              </span>
            </div>
          </div>
        </div>

        {/* Navigation Column */}
        <div className="md:col-span-3 space-y-3">
          <h5 className="font-bold text-xs uppercase tracking-wider text-[#C59B27]">Navigation</h5>
          <ul className="space-y-2 text-xs text-[#FAF7F2]/80">
            <li>
              <Link href="/products" className="hover:text-white transition-colors">
                Products & Specifications
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
              <Link href="/supply-network" className="hover:text-white transition-colors">
                Supply Network
              </Link>
            </li>
            <li>
              <Link href="/about" className="hover:text-white transition-colors">
                About FarmReem
              </Link>
            </li>
          </ul>
        </div>

        {/* Business CTAs Column */}
        <div className="md:col-span-3 space-y-3">
          <h5 className="font-bold text-xs uppercase tracking-wider text-[#C59B27]">Commercial Actions</h5>
          <ul className="space-y-2 text-xs text-[#FAF7F2]/80">
            <li>
              <Link href="/request-pricing" className="hover:text-white transition-colors">
                Request B2B Pricing
              </Link>
            </li>
            <li>
              <Link href="/become-partner" className="hover:text-white transition-colors">
                Become a Supply Partner
              </Link>
            </li>
            <li>
              <Link href="/contact" className="hover:text-white transition-colors">
                Contact Desk
              </Link>
            </li>
            <li>
              <Link href="/login" className="hover:text-white transition-colors">
                B2B Customer Login
              </Link>
            </li>
          </ul>
        </div>

      </div>

      {/* Simplified Copyright Bar */}
      <div className="border-t border-[#184636] py-4 bg-[#071711]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between text-[11px] text-[#FAF7F2]/50 gap-2">
          <p>© {new Date().getFullYear()} FarmReem (farmreem.com). Dehradun, Uttarakhand. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <span className="text-[#FAF7F2]/40">B2B Sourcing Terms</span>
            <span>·</span>
            <span className="text-[#FAF7F2]/40">Privacy Policy</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
