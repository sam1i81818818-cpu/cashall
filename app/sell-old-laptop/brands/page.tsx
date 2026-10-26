"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { INITIAL_BRANDS, INITIAL_MODELS, BrandData } from "@/lib/store";
import { BrandIcon } from "@/components/common/BrandIcon";
import { AiVerificationBar } from "@/components/common/AiVerificationBar";
import {
  Search,
  ChevronRight,
  ShieldCheck,
  TrendingUp,
  Zap,
  Laptop,
  Sparkles,
} from "lucide-react";

export default function SellLaptopBrandsDirectoryPage() {
  const [search, setSearch] = useState("");

  // Only laptop brands
  const laptopBrands = useMemo(() => {
    return INITIAL_BRANDS.filter((b) =>
      INITIAL_MODELS.some(
        (m) =>
          (m.brandId === b.id || m.brandSlug?.toLowerCase() === b.slug?.toLowerCase()) &&
          (m.category === "LAPTOP" || m.id.startsWith("m-laptop-"))
      ) || ["apple", "dell", "hp", "lenovo", "asus", "acer", "samsung", "msi", "microsoft", "xiaomi"].includes(b.slug.toLowerCase())
    );
  }, []);

  const filteredBrands = useMemo(() => {
    if (!search.trim()) return laptopBrands;
    const q = search.toLowerCase().trim();
    return laptopBrands.filter(
      (b) => b.name.toLowerCase().includes(q) || b.slug.toLowerCase().includes(q)
    );
  }, [laptopBrands, search]);

  return (
    <div className="min-h-screen flex flex-col bg-brand-bg text-brand-black">
      <Header />

      <main className="flex-grow py-8 sm:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* BREADCRUMB */}
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs font-semibold text-neutral-400 mb-6">
            <Link href="/" className="hover:text-brand-black transition-colors">
              Home
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-neutral-300" />
            <Link href="/sell-old-laptop" className="hover:text-brand-black transition-colors">
              Sell Old Laptop
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-neutral-300" />
            <span className="text-brand-black font-bold">All Laptop Brands</span>
          </nav>

          {/* PAGE HERO */}
          <div className="text-center max-w-2xl mx-auto mb-10">
            <h1 className="text-2xl sm:text-4xl font-black text-brand-black tracking-tight">
              Select Your Laptop Brand
            </h1>
            <p className="text-xs sm:text-sm text-neutral-600 mt-2 leading-relaxed">
              Choose your laptop brand below to view all supported models, configure hardware specs, and unlock your guaranteed instant quote with free doorstep inspection.
            </p>

            {/* BRAND SEARCH INPUT */}
            <div className="max-w-md mx-auto mt-6 relative">
              <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search laptop brand (e.g. Apple, Dell, HP, Lenovo, Asus)..."
                className="w-full pl-11 pr-4 py-3 text-sm font-medium bg-white rounded-2xl border border-neutral-200 focus:outline-none focus:border-brand-yellow focus:ring-4 focus:ring-brand-yellow/20 shadow-xs transition-all"
              />
            </div>
          </div>

          {/* BRANDS GRID */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
            {filteredBrands.map((brand) => (
              <Link
                key={brand.id}
                href={`/sell-old-laptop/${brand.slug}`}
                className="bg-white rounded-2xl p-5 border border-neutral-200/80 hover:border-brand-yellow hover:shadow-md transition-all duration-200 flex flex-col items-center justify-center text-center group hover:-translate-y-0.5"
              >
                <div className="w-14 h-14 flex items-center justify-center transition-transform group-hover:scale-110">
                  <BrandIcon name={brand.name} logoUrl={brand.logoUrl} fallbackType="LAPTOP" className="w-14 h-14" />
                </div>
                <span className="text-sm font-bold text-neutral-900 mt-3 group-hover:text-black">
                  {brand.name}
                </span>
                <span className="text-[11px] text-neutral-500 font-medium mt-0.5 flex items-center gap-1 group-hover:text-amber-700">
                  View Models <ChevronRight className="w-3 h-3" />
                </span>
              </Link>
            ))}
          </div>

          {filteredBrands.length === 0 && (
            <div className="text-center py-12 bg-white rounded-2xl border border-neutral-200 max-w-md mx-auto">
              <Laptop className="w-10 h-10 text-neutral-300 mx-auto mb-2" />
              <p className="text-sm font-bold text-neutral-800">No laptop brands found</p>
              <p className="text-xs text-neutral-500 mt-1">
                Try searching for Apple, Dell, HP, Lenovo, or Asus
              </p>
            </div>
          )}

        </div>
      </main>

      <AiVerificationBar />
      <Footer />
    </div>
  );
}
