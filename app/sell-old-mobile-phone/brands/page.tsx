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
  Smartphone,
  ArrowRight,
  Sparkles,
} from "lucide-react";

export default function SellMobileBrandsDirectoryPage() {
  const [search, setSearch] = useState("");

  // Only mobile brands
  const mobileBrands = useMemo(() => {
    return INITIAL_BRANDS.filter((b) =>
      INITIAL_MODELS.some(
        (m) =>
          (m.brandId === b.id || m.brandSlug?.toLowerCase() === b.slug?.toLowerCase()) &&
          (m.category === "MOBILE" || !m.category)
      )
    );
  }, []);

  const filteredBrands = useMemo(() => {
    if (!search.trim()) return mobileBrands;
    const q = search.toLowerCase().trim();
    return mobileBrands.filter(
      (b) => b.name.toLowerCase().includes(q) || b.slug.toLowerCase().includes(q)
    );
  }, [mobileBrands, search]);

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
            <Link href="/sell-old-mobile-phone" className="hover:text-brand-black transition-colors">
              Sell Old Mobile Phone
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-neutral-300" />
            <span className="text-brand-black font-bold">All Brands</span>
          </nav>

          {/* PAGE HERO */}
          <div className="text-center max-w-2xl mx-auto mb-10">
            <h1 className="text-2xl sm:text-4xl font-black text-brand-black tracking-tight">
              Select Your Smartphone Brand
            </h1>
            <p className="text-xs sm:text-sm text-neutral-600 mt-2 leading-relaxed">
              Choose your phone maker below to view all models, variants, and calculate your guaranteed instant resale quote with free doorstep evaluation.
            </p>

            {/* BRAND SEARCH INPUT */}
            <div className="max-w-md mx-auto mt-6 relative">
              <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search phone brand (e.g. Apple, Samsung, Vivo, OnePlus)..."
                className="w-full pl-11 pr-4 py-3 text-sm font-medium bg-white rounded-2xl border border-neutral-200 focus:outline-none focus:border-brand-yellow focus:ring-4 focus:ring-brand-yellow/20 shadow-xs transition-all"
              />
            </div>
          </div>

          {/* ALL BRANDS GRID */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3.5 sm:gap-4">
            {filteredBrands.map((brand) => {
              const modelCount = INITIAL_MODELS.filter(
                (m) =>
                  (m.brandId === brand.id || m.brandSlug?.toLowerCase() === brand.slug?.toLowerCase()) &&
                  (m.category === "MOBILE" || !m.category)
              ).length;

              return (
                <Link
                  key={brand.id}
                  href={`/sell-old-mobile-phone/${brand.slug}`}
                  className="bg-white rounded-2xl p-4 sm:p-5 border border-neutral-200/80 hover:border-brand-yellow hover:shadow-[0_10px_25px_-5px_rgba(255,212,0,0.25)] transition-all duration-200 flex flex-col items-center justify-between text-center group hover:-translate-y-1"
                >
                  <div className="w-16 h-16 sm:w-20 sm:h-20 bg-white rounded-2xl flex items-center justify-center p-2.5 mb-3 border border-neutral-100 shadow-2xs group-hover:border-brand-yellow group-hover:shadow-xs transition-all">
                    <BrandIcon
                      name={brand.name}
                      logoUrl={brand.logoUrl}
                      className="w-12 h-12 sm:w-16 sm:h-16 flex items-center justify-center"
                      imageClassName="max-h-10 max-w-10 sm:max-h-12 sm:max-w-12 object-contain"
                    />
                  </div>
                  <div>
                    <h2 className="text-xs sm:text-sm font-bold text-neutral-900 group-hover:text-black leading-snug">
                      {brand.name}
                    </h2>
                    {modelCount > 0 && (
                      <span className="text-[10px] text-neutral-400 font-semibold mt-0.5 block">
                        {modelCount} Models
                      </span>
                    )}
                  </div>
                  <span className="mt-3 text-[11px] font-bold text-amber-700 flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                    Sell Now <ChevronRight className="w-3 h-3" />
                  </span>
                </Link>
              );
            })}
          </div>

          {filteredBrands.length === 0 && (
            <div className="bg-white rounded-3xl p-12 text-center border border-neutral-200 max-w-md mx-auto my-6">
              <Smartphone className="w-10 h-10 text-neutral-300 mx-auto mb-3" />
              <p className="text-base font-bold text-brand-black">No brand found matching &quot;{search}&quot;</p>
              <button
                onClick={() => setSearch("")}
                className="text-xs font-semibold text-amber-600 underline mt-2"
              >
                Clear search filter
              </button>
            </div>
          )}

          {/* AI TRUST VERIFICATION */}
          <div className="pt-12">
            <AiVerificationBar deviceName="All Mobile Phone Brands" />
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
