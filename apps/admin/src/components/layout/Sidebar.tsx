"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Building2,
  Package,
  DollarSign,
  FileText,
  ShoppingCart,
  Truck,
  Tractor,
  Boxes,
  Receipt,
  CreditCard,
  LifeBuoy,
  UserCheck,
  ShieldCheck,
  Settings,
  Shield,
} from "lucide-react";
import { ADMIN_BRAND } from "@farmreem/ui";

interface NavItem {
  name: string;
  href: string;
  icon: React.ElementType;
}

const navItems: NavItem[] = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "CRM / Leads", href: "/crm", icon: Users },
  { name: "Customers", href: "/customers", icon: Building2 },
  { name: "Products", href: "/products", icon: Package },
  { name: "Pricing Engine", href: "/pricing", icon: DollarSign },
  { name: "Quotations", href: "/quotations", icon: FileText },
  { name: "Orders", href: "/orders", icon: ShoppingCart },
  { name: "Procurement", href: "/procurement", icon: Tractor },
  { name: "Suppliers & Farms", href: "/suppliers", icon: Boxes },
  { name: "Dispatch Dock", href: "/dispatch", icon: Truck },
  { name: "Deliveries & PoD", href: "/deliveries", icon: Truck },
  { name: "Invoices", href: "/invoices", icon: Receipt },
  { name: "Payments", href: "/payments", icon: CreditCard },
  { name: "Support Desk", href: "/support", icon: LifeBuoy },
  { name: "Staff Users", href: "/users", icon: UserCheck },
  { name: "Audit Log", href: "/audit", icon: ShieldCheck },
  { name: "Settings", href: "/settings", icon: Settings },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-[#0F2E23] text-white flex flex-col flex-shrink-0 border-r border-[#184636]">
      {/* Brand Header */}
      <div className="p-5 border-b border-[#184636] flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-[#C59B27] text-[#0F2E23] flex items-center justify-center font-extrabold shadow">
          <Shield className="w-5 h-5" />
        </div>
        <div>
          <h1 className="font-extrabold text-base tracking-tight text-white leading-none">
            Farm<span className="text-[#C59B27]">Reem</span> OS
          </h1>
          <p className="text-[10px] font-bold text-[#C59B27]/80 uppercase tracking-wider mt-1">
            {ADMIN_BRAND.subdomain}
          </p>
        </div>
      </div>

      {/* Nav List */}
      <nav className="flex-1 overflow-y-auto p-4 space-y-1 custom-scrollbar">
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname?.startsWith(`${item.href}/`);
          const Icon = item.icon;

          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                isActive
                  ? "bg-[#C59B27] text-[#0F2E23] shadow-md"
                  : "text-[#FAF7F2]/70 hover:bg-[#184636] hover:text-white"
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? "text-[#0F2E23]" : "text-[#C59B27]"}`} />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* Footer System Status */}
      <div className="p-4 border-t border-[#184636] text-[10px] text-[#FAF7F2]/60 flex items-center justify-between">
        <span className="font-semibold">NOINDEX Restricted</span>
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
      </div>
    </aside>
  );
}
