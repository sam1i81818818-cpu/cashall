"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  ShoppingBag,
  Gamepad2,
  FileText,
  ClipboardCheck,
  Smartphone,
  Calculator,
  UserCheck,
  Navigation,
  MapPin,
  ShieldAlert,
  Award,
  Receipt,
  BarChart3,
  Headset,
  PhoneCall,
  LogOut,
  Menu,
  X,
  Sparkles,
  ChevronRight,
} from "lucide-react";

interface NavItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
  badgeColor?: string;
}

interface NavSection {
  title: string;
  items: NavItem[];
}

export function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [adminEmail, setAdminEmail] = useState("sangeetshaw39@gmail.com");
  const [adminName, setAdminName] = useState("Sangeet Shaw");
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const session = localStorage.getItem("cashall_admin_session");
      if (session) {
        try {
          const parsed = JSON.parse(session);
          if (parsed?.email) setAdminEmail(parsed.email);
          if (parsed?.name) setAdminName(parsed.name);
        } catch (e) {}
      }
    }
  }, []);

  const handleLogout = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("cashall_admin_session");
    }
    router.replace("/admin/login");
  };

  const navItems: NavItem[] = [
    { label: "Dashboard Overview", href: "/admin", icon: LayoutDashboard },
    { label: "PS5 Rentals Console", href: "/admin/rentals", icon: Gamepad2, badge: "NEW" },
    { label: "Order Management", href: "/admin/orders", icon: ShoppingBag },
    { label: "Exotel Telephony Console", href: "/admin/telephony", icon: PhoneCall, badge: "LIVE" },
    { label: "Device Catalog", href: "/admin/catalog", icon: Smartphone },
    { label: "Pricing Rules Matrix", href: "/admin/pricing", icon: Calculator },
    { label: "Quotes Repository", href: "/admin/quotes", icon: FileText },
    { label: "Agent Management", href: "/admin/agents", icon: UserCheck },
    { label: "Support Team Management", href: "/admin/support", icon: Headset },
    { label: "Transaction Audit Ledger", href: "/admin/ledger", icon: Receipt },
    { label: "Reports & Analytics", href: "/admin/reports", icon: BarChart3 },
    { label: "Physical Inspections", href: "/admin/inspections", icon: ClipboardCheck },
    { label: "Service Areas (PINs)", href: "/admin/service-areas", icon: MapPin },
  ];


  // Helper to determine active state
  const isItemActive = (href: string) => {
    if (href === "/admin") {
      return pathname === "/admin";
    }
    return pathname === href || pathname.startsWith(href + "/");
  };

  return (
    <>
      {/* MOBILE STICKY TOP BAR (SCREENS < LG) */}
      <div className="lg:hidden sticky top-0 z-40 bg-white border-b border-slate-200 px-4 py-2.5 flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMobileOpen(true)}
            className="p-1.5 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-100 transition-colors"
            aria-label="Open Admin Menu"
          >
            <Menu className="w-5 h-5" />
          </button>
          <Link href="/admin" className="flex items-center gap-2">
            <Image src="/logo.webp" alt="CashALL" width={110} height={30} className="h-6 w-auto object-contain" priority />
            <span className="bg-[#FEF08A] text-amber-950 text-[10px] font-extrabold px-1.5 py-0.5 rounded border border-amber-300">
              ADMIN
            </span>
          </Link>
        </div>

        <button
          onClick={handleLogout}
          title="Sign out"
          className="p-1.5 rounded-lg text-slate-500 hover:text-red-600 hover:bg-red-50 transition-colors"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </div>

      {/* MOBILE SLIDE-OVER DRAWER BACKDROP */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs lg:hidden animate-fadeIn"
          onClick={() => setMobileOpen(false)}
        >
          <div
            className="w-72 max-w-[85vw] h-full bg-white border-r border-slate-200 flex flex-col justify-between p-4 overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div>
              {/* DRAWER HEADER */}
              <div className="pb-3 mb-3 border-b border-slate-200 flex items-center justify-between">
                <Link href="/admin" onClick={() => setMobileOpen(false)} className="flex items-center gap-2">
                  <Image src="/logo.webp" alt="CashALL" width={120} height={32} className="h-7 w-auto object-contain" priority />
                  <span className="bg-[#FEF08A] text-amber-950 text-[10px] font-extrabold px-1.5 py-0.5 rounded border border-amber-300">
                    ADMIN
                  </span>
                </Link>
                <button
                  onClick={() => setMobileOpen(false)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                  aria-label="Close Menu"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* DRAWER NAV ITEMS */}
              <nav className="space-y-1">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const active = isItemActive(item.href);
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMobileOpen(false)}
                      className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs transition-all ${
                        active
                          ? "bg-amber-400 text-slate-950 font-bold shadow-xs"
                          : "text-slate-600 hover:text-slate-900 hover:bg-slate-100 font-medium"
                      }`}
                    >
                      <Icon className={`w-4 h-4 shrink-0 ${active ? "text-slate-950" : "text-slate-500"}`} />
                      <span className="truncate flex-1">{item.label}</span>
                      {item.badge && (
                        <span className="text-[9px] font-black px-1.5 py-0.5 rounded bg-amber-200 text-amber-950 uppercase tracking-wider">
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  );
                })}
              </nav>
            </div>

            {/* DRAWER FOOTER */}
            <div className="pt-3 border-t border-slate-200 space-y-2.5">
              <div className="flex items-center gap-2.5 px-2">
                <div className="w-8 h-8 rounded-full bg-amber-400 text-amber-950 font-black text-xs flex items-center justify-center shrink-0 border border-amber-500 shadow-xs">
                  {adminName.slice(0, 2).toUpperCase()}
                </div>
                <div className="truncate text-xs min-w-0">
                  <div className="font-bold text-slate-900 truncate">{adminName}</div>
                  <div className="text-[10px] text-slate-500 truncate">{adminEmail}</div>
                </div>
              </div>

              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-slate-100 hover:bg-red-50 hover:text-red-700 text-slate-700 text-xs font-semibold rounded-lg border border-slate-200 transition-colors"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DESKTOP SIDEBAR (SCREENS >= LG) - CLEAN WHITE WITH CASHALL YELLOW PILL */}
      <aside className="hidden lg:flex w-64 bg-white border-r border-slate-200 flex-col justify-between shrink-0 min-h-screen select-none">
        <div className="flex flex-col flex-1 min-h-0">
          {/* HEADER LOGO */}
          <div className="h-16 px-4 flex items-center justify-between border-b border-slate-200 bg-white">
            <Link href="/admin" className="flex items-center gap-2">
              <Image src="/logo.webp" alt="CashALL" width={120} height={32} className="h-7 w-auto object-contain" priority />
              <span className="bg-amber-400 text-slate-950 text-[10px] font-black px-1.5 py-0.5 rounded border border-amber-500 tracking-wider">
                ADMIN
              </span>
            </Link>
          </div>

          {/* FLAT NAV ITEMS */}
          <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = isItemActive(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs transition-all ${
                    active
                      ? "bg-amber-400 text-slate-950 font-bold shadow-xs"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-100 font-medium"
                  }`}
                >
                  <Icon className={`w-4 h-4 shrink-0 ${active ? "text-slate-950" : "text-slate-500"}`} />
                  <span className="truncate flex-1">{item.label}</span>
                  {item.badge && (
                    <span className="text-[9px] font-black px-1.5 py-0.5 rounded bg-amber-200 text-amber-950 uppercase tracking-wider">
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>
        </div>

        {/* FOOTER USER INFO & LOGOUT */}
        <div className="p-3 border-t border-slate-200 bg-slate-50/70">
          <div className="flex items-center justify-between p-2 rounded-lg bg-white border border-slate-200 shadow-xs">
            <div className="flex items-center gap-2 min-w-0">
              <div className="relative shrink-0">
                <div className="w-8 h-8 rounded-full bg-amber-400 text-amber-950 font-black text-xs flex items-center justify-center border border-amber-500 shadow-xs">
                  {adminName.slice(0, 2).toUpperCase()}
                </div>
                <span className="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-white" />
              </div>
              <div className="min-w-0">
                <div className="font-bold text-xs text-slate-900 truncate leading-tight">{adminName}</div>
                <div className="text-[10px] text-slate-500 truncate">Operations Lead</div>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="text-slate-400 hover:text-red-600 p-1 rounded-md hover:bg-red-50 transition-colors shrink-0"
              title="Sign out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
