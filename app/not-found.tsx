import React from "react";
import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Smartphone, Home, Search, ArrowRight, HelpCircle } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col bg-brand-bg text-brand-black">
      <Header />
      <main className="flex-grow flex items-center justify-center py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-xl w-full text-center space-y-8">
          
          {/* 404 VISUAL BADGE */}
          <div className="relative inline-flex items-center justify-center">
            <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-3xl bg-brand-yellow/15 border-2 border-brand-yellow/30 flex items-center justify-center shadow-premium">
              <span className="text-4xl sm:text-5xl font-black text-brand-black tracking-tight">404</span>
            </div>
            <div className="absolute -bottom-2 -right-2 w-10 h-10 rounded-xl bg-brand-black text-brand-yellow flex items-center justify-center shadow-md">
              <Search className="w-5 h-5" />
            </div>
          </div>

          <div className="space-y-3">
            <h1 className="text-2xl sm:text-3xl font-black text-brand-black tracking-tight">
              Looking for a Device or Page?
            </h1>
            <p className="text-xs sm:text-sm text-brand-muted max-w-md mx-auto leading-relaxed">
              We couldn&apos;t find the exact link you were looking for. The device model or valuation quote may have updated.
            </p>
          </div>

          {/* ACTION BUTTONS */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Link
              href="/sell-old-mobile-phone"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-brand-yellow text-brand-black font-extrabold text-xs sm:text-sm hover:bg-brand-yellowHover transition shadow-yellowGlow active:scale-95"
            >
              <Smartphone className="w-4 h-4" />
              Sell Old Phone Now
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              href="/"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-white border border-brand-border text-brand-black font-bold text-xs sm:text-sm hover:bg-gray-50 transition active:scale-95 shadow-subtleCard"
            >
              <Home className="w-4 h-4" />
              Back to Home
            </Link>
          </div>

          {/* QUICK LINKS */}
          <div className="pt-6 border-t border-brand-border/60">
            <p className="text-xs font-semibold text-brand-muted mb-3">Popular Helpful Destinations:</p>
            <div className="flex flex-wrap justify-center gap-2 text-xs">
              <Link href="/sell/laptop" className="px-3 py-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 text-brand-black transition">
                Sell Laptop
              </Link>
              <Link href="/rent/ps5" className="px-3 py-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 text-brand-black transition">
                Rent PS5
              </Link>
              <Link href="/faq" className="px-3 py-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 text-brand-black transition">
                FAQ & Pricing
              </Link>
              <Link href="/contact" className="px-3 py-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 text-brand-black transition flex items-center gap-1">
                <HelpCircle className="w-3 h-3" />
                Support Desk
              </Link>
            </div>
          </div>

        </div>
      </main>
      <Footer />
    </div>
  );
}
