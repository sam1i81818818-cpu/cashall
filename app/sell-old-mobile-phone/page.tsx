"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { INITIAL_BRANDS, INITIAL_MODELS, BrandData } from "@/lib/store";
import { BrandIcon } from "@/components/common/BrandIcon";
import { AiVerificationBar } from "@/components/common/AiVerificationBar";
import { CUSTOMER_REVIEWS, REVIEW_STATS } from "@/lib/data/reviewsData";
import {
  Search,
  ChevronRight,
  ShieldCheck,
  Zap,
  TrendingUp,
  ArrowRight,
  Smartphone,
  Star,
  CheckCircle2,
  Clock,
  MapPin,
  Sparkles,
  HelpCircle,
  Truck,
  RotateCcw,
  Check,
  ChevronDown
} from "lucide-react";

// Top Trending Models to highlight (Strictly Cashify +1% Buyback Valuation)
const TOP_SELLING_MODELS = [
  {
    name: "Apple iPhone 16 Pro Max",
    brandSlug: "apple",
    modelSlug: "apple-iphone-16-pro-max",
    upToPrice: "91,300",
    badge: "Top Seller",
    imageUrl: "https://s3ng.cashify.in/cashify/product/img/xhdpi/d197ee88-ccff.jpg?w=800",
  },
  {
    name: "Samsung Galaxy S24 Ultra 5G",
    brandSlug: "samsung",
    modelSlug: "samsung-galaxy-s24-ultra-5g",
    upToPrice: "67,200",
    badge: "High Demand",
    imageUrl: "https://s3ng.cashify.in/cashify/product/img/xhdpi/a69ef28f-fe68.jpg?w=800",
  },
  {
    name: "Apple iPhone 16",
    brandSlug: "apple",
    modelSlug: "apple-iphone-16",
    upToPrice: "45,000",
    badge: "Trending",
    imageUrl: "https://s3ng.cashify.in/cashify/product/img/xhdpi/db36cde6-e6e5.jpg?w=800",
  },
  {
    name: "Samsung Galaxy S24 5G",
    brandSlug: "samsung",
    modelSlug: "samsung-galaxy-s24-5g",
    upToPrice: "38,600",
    badge: "Popular",
    imageUrl: "https://s3ng.cashify.in/cashify/product/img/xhdpi/dab0d987-4d22.jpg?w=800",
  },
  {
    name: "Apple iPhone 15 Pro Max",
    brandSlug: "apple",
    modelSlug: "apple-iphone-15-pro-max",
    upToPrice: "69,200",
    badge: "Best Value",
    imageUrl: "https://s3ng.cashify.in/cashify/product/img/xhdpi/e14bb4d9-988f.jpg?w=800",
  },
  {
    name: "OnePlus 12 5G",
    brandSlug: "oneplus",
    modelSlug: "oneplus-12",
    upToPrice: "36,900",
    badge: "Fast Selling",
    imageUrl: "https://s3ng.cashify.in/cashify/product/img/xhdpi/3ba10c91-7df6.jpg?w=800",
  },
  {
    name: "Google Pixel 9 Pro",
    brandSlug: "google",
    modelSlug: "google-pixel-9-pro",
    upToPrice: "52,500",
    badge: "Hot Deal",
    imageUrl: "https://s3ng.cashify.in/cashify/product/img/xhdpi/0e3992a1-b89f.jpg?w=800",
  },
  {
    name: "Apple iPhone 15",
    brandSlug: "apple",
    modelSlug: "apple-iphone-15",
    upToPrice: "39,900",
    badge: "Most Sold",
    imageUrl: "https://s3ng.cashify.in/cashify/product/img/xhdpi/e2c7dff8-23a0.jpg?w=800",
  },
];

// Curated Top Brand Quick Bar
const QUICK_BRAND_SLUGS = ["apple", "samsung", "xiaomi", "vivo", "realme", "oneplus", "oppo", "google", "motorola"];

export default function SellOldMobilePhonePage() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [brands, setBrands] = useState<BrandData[]>(INITIAL_BRANDS);
  const [modelSearch, setModelSearch] = useState("");
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  useEffect(() => {
    async function loadBrands() {
      try {
        const res = await fetch("/api/v1/catalog?category=MOBILE");
        const json = await res.json();
        if (json.success && Array.isArray(json.data?.brands) && json.data.brands.length > 0) {
          const apiBrands = json.data.brands;
          setBrands((prev) => {
            const mergedMap = new Map<string, BrandData>();
            prev.forEach((b) => mergedMap.set(b.slug || b.name.toLowerCase(), b));
            apiBrands.forEach((b: BrandData) => mergedMap.set(b.slug || b.name.toLowerCase(), b));
            return Array.from(mergedMap.values());
          });
        }
      } catch (e) {
        console.error("Error loading brands", e);
      }
    }
    loadBrands();
  }, []);

  const mobileBrands = useMemo(() => {
    return brands.filter((b) =>
      INITIAL_MODELS.some(
        (m) =>
          (m.brandId === b.id || m.brandSlug?.toLowerCase() === b.slug?.toLowerCase()) &&
          (m.category === "MOBILE" || !m.category)
      )
    );
  }, [brands]);

  const quickBrands = useMemo(() => {
    return QUICK_BRAND_SLUGS.map((slug) =>
      mobileBrands.find((b) => b.slug.toLowerCase() === slug)
    ).filter(Boolean) as BrandData[];
  }, [mobileBrands]);

  const filteredBrands = useMemo(() => {
    if (!search.trim()) return mobileBrands;
    return mobileBrands.filter((b) =>
      b.name.toLowerCase().includes(search.toLowerCase().trim())
    );
  }, [mobileBrands, search]);

  // Global search autocomplete for models
  const searchedModels = useMemo(() => {
    if (!modelSearch.trim() || modelSearch.trim().length < 2) return [];
    const q = modelSearch.toLowerCase().trim();
    return INITIAL_MODELS.filter(
      (m) =>
        (m.category === "MOBILE" || !m.category) &&
        (m.name.toLowerCase().includes(q) || (m.brandSlug && m.brandSlug.toLowerCase().includes(q)))
    ).slice(0, 6);
  }, [modelSearch]);

  const scrollToBrands = () => {
    const el = document.getElementById("all-brands-section");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-brand-bg text-brand-black">
      <Header />

      <main className="flex-grow">
        {/* ========================================================= */}
        {/* HERO SECTION: ALIGNED WITH CASHKR & CASHIFY STRUCTURE     */}
        {/* ========================================================= */}
        <section className="relative bg-gradient-to-b from-white via-amber-50/20 to-brand-bg pt-6 pb-12 border-b border-neutral-200/80 overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            
            {/* BREADCRUMB */}
            <nav className="flex items-center gap-2 text-xs font-semibold text-neutral-400 mb-6">
              <Link href="/" className="hover:text-brand-black transition-colors">
                Home
              </Link>
              <ChevronRight className="w-3.5 h-3.5 text-neutral-400" />
              <span className="text-brand-black font-bold">Sell Old Mobile Phone</span>
            </nav>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
              
              {/* LEFT COLUMN: HERO CONTENT & BRAND QUICK SELECTOR */}
              <div className="lg:col-span-7 space-y-6">
                
                {/* H1 HEADLINE (Clean Recommerce) */}
                <div>
                  <h1 className="text-3xl sm:text-5xl font-black text-brand-black tracking-tight leading-[1.15]">
                    Sell Old{" "}
                    <span className="text-amber-500">
                      Phone Online
                    </span>{" "}
                    for Instant Cash
                  </h1>
                  <p className="text-sm sm:text-base text-neutral-600 mt-3 font-normal leading-relaxed max-w-xl">
                    Get an instant locked quote for any brand in 60 seconds, free doorstep pickup at your preferred time slot, and guaranteed same-day UPI payout before handover.
                  </p>
                </div>

                {/* VALUE PROPOSITION BADGES */}
                <div className="grid grid-cols-3 gap-2.5 sm:gap-4 pt-1 pb-1">
                  <div className="flex items-center gap-2 p-2.5 sm:p-3 rounded-2xl bg-white border border-neutral-200/90 shadow-xs">
                    <div className="w-8 h-8 rounded-xl bg-amber-100 flex items-center justify-center text-amber-700 shrink-0">
                      <ShieldCheck className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-extrabold text-neutral-900 leading-tight">100% Safe</div>
                      <div className="text-[10px] text-neutral-500 hidden sm:block">Certified Data Wipe</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 p-2.5 sm:p-3 rounded-2xl bg-white border border-neutral-200/90 shadow-xs">
                    <div className="w-8 h-8 rounded-xl bg-amber-100 flex items-center justify-center text-amber-700 shrink-0">
                      <TrendingUp className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-extrabold text-neutral-900 leading-tight">Best Prices</div>
                      <div className="text-[10px] text-neutral-500 hidden sm:block">Instant Locked Valuation</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 p-2.5 sm:p-3 rounded-2xl bg-white border border-neutral-200/90 shadow-xs">
                    <div className="w-8 h-8 rounded-xl bg-amber-100 flex items-center justify-center text-amber-700 shrink-0">
                      <Zap className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-extrabold text-neutral-900 leading-tight">Instant Cash</div>
                      <div className="text-[10px] text-neutral-500 hidden sm:block">Instant UPI Transfer</div>
                    </div>
                  </div>
                </div>

                {/* SEARCH INPUT WITH AUTOCOMPLETE */}
                <div className="relative pt-2">
                  <div className="relative flex items-center">
                    <Search className="w-5 h-5 absolute left-4 text-neutral-400 pointer-events-none" />
                    <input
                      type="text"
                      value={modelSearch}
                      onChange={(e) => setModelSearch(e.target.value)}
                      placeholder="Search your phone model (e.g. iPhone 16, Galaxy S24, OnePlus 12)..."
                      className="w-full pl-12 pr-4 py-3.5 text-sm font-medium bg-white rounded-2xl border-2 border-neutral-200 focus:outline-none focus:border-brand-yellow focus:ring-4 focus:ring-brand-yellow/20 shadow-sm transition-all"
                    />
                  </div>

                  {/* AUTOCOMPLETE DROPDOWN */}
                  {searchedModels.length > 0 && (
                    <div className="absolute z-30 left-0 right-0 mt-2 bg-white rounded-2xl border border-neutral-200 shadow-xl overflow-hidden divide-y divide-neutral-100 animate-in fade-in slide-in-from-top-2 duration-150">
                      {searchedModels.map((m) => (
                        <Link
                          key={m.id}
                          href={`/sell-old-mobile-phone/${m.brandSlug || 'mobile'}/${m.slug}`}
                          className="flex items-center justify-between px-4 py-3 hover:bg-amber-50/60 transition-colors group"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-neutral-50 flex items-center justify-center text-neutral-500">
                              <Smartphone className="w-4 h-4 text-amber-600" />
                            </div>
                            <span className="text-sm font-bold text-neutral-900 group-hover:text-amber-800">
                              {m.name}
                            </span>
                          </div>
                          <span className="text-xs font-bold text-amber-600 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                            Check Price <ChevronRight className="w-3.5 h-3.5" />
                          </span>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>

                {/* SELECT PHONE BRAND: QUICK ROW (CASHKR & CASHIFY PATTERN) */}
                <div className="pt-2">
                  <div className="flex items-center justify-between mb-3">
                    <h2 className="text-xs sm:text-sm font-black text-neutral-800 tracking-wide uppercase">
                      Select Phone Brand
                    </h2>
                    <Link
                      href="/sell-old-mobile-phone/brands"
                      className="text-xs font-bold text-amber-700 hover:text-amber-800 hover:underline flex items-center gap-1"
                    >
                      View all brands ({mobileBrands.length}) <ChevronRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>

                  <div className="grid grid-cols-4 sm:grid-cols-6 gap-2 sm:gap-3">
                    {quickBrands.slice(0, 5).map((brand) => (
                      <Link
                        key={brand.id}
                        href={`/sell-old-mobile-phone/${brand.slug}`}
                        className="bg-white rounded-2xl p-3 border border-neutral-200/80 hover:border-brand-yellow hover:shadow-md transition-all duration-200 flex flex-col items-center justify-center text-center group hover:-translate-y-0.5"
                      >
                        <div className="w-10 h-10 flex items-center justify-center transition-transform group-hover:scale-110">
                          <BrandIcon name={brand.name} logoUrl={brand.logoUrl} className="w-10 h-10" />
                        </div>
                        <span className="text-xs font-bold text-neutral-800 mt-1.5 group-hover:text-black">
                          {brand.name}
                        </span>
                      </Link>
                    ))}

                    {/* "MORE (ALL BRANDS)" CARD LIKE CASHKR / CASHIFY */}
                    <Link
                      href="/sell-old-mobile-phone/brands"
                      className="bg-amber-50/80 hover:bg-amber-100/90 rounded-2xl p-3 border border-amber-300/80 hover:border-amber-400 transition-all duration-200 flex flex-col items-center justify-center text-center group hover:-translate-y-0.5"
                    >
                      <div className="w-10 h-10 rounded-xl bg-amber-200/80 flex items-center justify-center text-amber-900 font-extrabold text-sm group-hover:scale-110 transition-transform">
                        More
                      </div>
                      <span className="text-xs font-black text-amber-900 mt-1.5">
                        All Brands &rarr;
                      </span>
                    </Link>
                  </div>
                </div>

                {/* BIG START SELLING BUTTON (BRAND YELLOW) */}
                <div className="pt-2">
                  <button
                    onClick={scrollToBrands}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 rounded-2xl bg-brand-yellow hover:bg-yellow-400 text-brand-black font-black text-base shadow-lg shadow-yellow-400/25 hover:shadow-yellow-400/35 transition-all duration-200 active:scale-[0.99]"
                  >
                    <span>Start Selling Phone</span>
                    <ArrowRight className="w-5 h-5" />
                  </button>
                </div>

              </div>

              {/* RIGHT COLUMN: HERO SMARTPHONE SHOWCASE (CASHALL BRAND YELLOW THEME) */}
              <div className="lg:col-span-5 flex justify-center lg:justify-end">
                <div className="relative w-full max-w-sm sm:max-w-md">
                  
                  {/* BACKGROUND YELLOW GLOW */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-amber-300/40 via-yellow-300/30 to-amber-100/50 rounded-3xl blur-2xl -z-10" />

                  {/* HERO SHOWCASE CARD (APPLE IPHONE 18 PRO MAX SHOWCASE) */}
                  <div className="bg-white rounded-3xl p-6 sm:p-7 shadow-xl border-2 border-brand-yellow/70 relative overflow-hidden flex flex-col justify-between">
                    <div className="flex items-center justify-between mb-2">
                      <span className="px-3 py-1 rounded-full bg-brand-yellow text-brand-black font-black text-[11px] uppercase tracking-wider">
                        Premium Buyback
                      </span>
                      <div className="flex items-center gap-1.5 text-xs text-neutral-600 font-bold">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                        <span>Pickup in 2-4 Hours</span>
                      </div>
                    </div>

                    <h3 className="text-xl sm:text-2xl font-black text-brand-black tracking-tight leading-tight mt-1">
                      Apple iPhone 18 Pro Max
                    </h3>
                    <p className="text-xs text-neutral-500 mt-1 leading-relaxed">
                      Instant quote in 60s with free doorstep evaluation & instant bank transfer.
                    </p>

                    {/* PHONE SHOWCASE IMAGE */}
                    <div className="my-3 py-2 flex items-center justify-center">
                      <img
                        src="https://media-ik.croma.com/Croma%20Assets/Communication/Mobiles/Images/324774_0_LTsaRyswN.png?updatedAt=1789034028966"
                        alt="Apple iPhone 18 Pro Max"
                        className="h-52 sm:h-60 object-contain drop-shadow-xl hover:scale-105 transition-transform duration-300"
                      />
                    </div>

                    {/* MINI SPEC COMPARISON TABLE (IPHONE 18 PRO MAX PRICING) */}
                    <div className="p-3.5 rounded-2xl bg-amber-50/80 border border-amber-200/80 space-y-2 text-xs">
                      <div className="flex items-center justify-between text-neutral-800">
                        <span className="font-semibold">iPhone 18 Pro Max (1 TB)</span>
                        <span className="font-black text-brand-black">Up to ₹1,46,450</span>
                      </div>
                      <div className="flex items-center justify-between text-neutral-800">
                        <span className="font-semibold">iPhone 18 Pro Max (512 GB)</span>
                        <span className="font-black text-brand-black">Up to ₹1,38,370</span>
                      </div>
                      <div className="flex items-center justify-between text-neutral-800">
                        <span className="font-semibold">iPhone 18 Pro Max (256 GB)</span>
                        <span className="font-black text-brand-black">Up to ₹1,31,300</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-3">
                      <div className="flex items-center gap-1.5 text-xs text-neutral-700 font-bold">
                        <Check className="w-4 h-4 text-emerald-600" />
                        <span>Instant UPI Payout</span>
                      </div>
                      <button
                        onClick={scrollToBrands}
                        className="text-xs font-black text-neutral-900 bg-brand-yellow hover:bg-yellow-400 px-4 py-2 rounded-xl transition-colors shadow-xs"
                      >
                        Check Exact Value &rarr;
                      </button>
                    </div>

                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* ========================================================= */}
        {/* TOP SELLING MOBILE PHONES SECTION (CASHIFY MATCH)         */}
        {/* ========================================================= */}
        <section className="py-12 bg-white border-b border-neutral-200/80">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8">
              <div>
                <h2 className="text-2xl sm:text-3xl font-black text-brand-black tracking-tight">
                  Top Selling Mobile Phones
                </h2>
                <p className="text-xs sm:text-sm text-neutral-500 mt-1">
                  Highest customer demand models serviced recently by CashALL with maximum cash value.
                </p>
              </div>
              <button
                onClick={scrollToBrands}
                className="mt-3 sm:mt-0 text-xs font-bold text-amber-700 hover:text-amber-800 hover:underline flex items-center gap-1 self-start sm:self-auto"
              >
                Explore All 500+ Models <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3.5 sm:gap-5">
              {TOP_SELLING_MODELS.map((item, idx) => (
                <Link
                  key={idx}
                  href={`/sell-old-mobile-phone/${item.brandSlug}/${item.modelSlug}`}
                  className="bg-brand-bg rounded-2xl p-4 border border-neutral-200/80 hover:border-brand-yellow hover:shadow-lg transition-all duration-200 flex flex-col justify-between group hover:-translate-y-0.5"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md bg-amber-200/80 text-amber-900">
                        {item.badge}
                      </span>
                      <span className="text-[10px] text-neutral-400 font-bold uppercase">
                        {item.brandSlug}
                      </span>
                    </div>

                    <div className="w-full aspect-square bg-white rounded-xl mb-3 p-3 flex items-center justify-center border border-neutral-100 group-hover:border-amber-200 transition-colors">
                      <img
                        src={item.imageUrl}
                        alt={item.name}
                        className="object-contain max-h-28 w-auto group-hover:scale-105 transition-transform"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = "/images/devices/phone.jpg";
                        }}
                      />
                    </div>

                    <h3 className="text-xs sm:text-sm font-bold text-neutral-900 group-hover:text-black line-clamp-2 min-h-[2.5rem]">
                      {item.name}
                    </h3>
                  </div>

                  <div className="pt-3 border-t border-neutral-200/60 mt-3 flex items-center justify-between">
                    <div>
                      <div className="text-[10px] text-neutral-500 font-medium">Get up to</div>
                      <div className="text-sm font-black text-amber-700">
                        ₹{item.upToPrice}
                      </div>
                    </div>
                    <span className="text-xs font-bold text-amber-700 group-hover:translate-x-1 transition-transform flex items-center">
                      Sell Now &rarr;
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ========================================================= */}
        {/* ALL SUPPORTED BRANDS DIRECTORY GRID                       */}
        {/* ========================================================= */}
        <section id="all-brands-section" className="py-14 bg-brand-bg border-b border-neutral-200/80 scroll-mt-6">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            
            <div className="text-center max-w-2xl mx-auto mb-10">
              <span className="inline-block text-xs font-black text-amber-700 uppercase tracking-widest mb-1.5">
                Complete Smartphone Manufacturer Directory
              </span>
              <h2 className="text-2xl sm:text-4xl font-black text-brand-black tracking-tight">
                Choose Your Smartphone Brand
              </h2>
              <p className="text-xs sm:text-sm text-neutral-500 mt-2">
                Select your phone brand to browse all series and exact models for an instant price check.
              </p>

              {/* SEARCH BRAND INPUT */}
              <div className="max-w-md mx-auto mt-6 relative">
                <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Filter brands (e.g. Apple, Samsung, OnePlus)..."
                  className="w-full pl-11 pr-4 py-2.5 text-xs sm:text-sm font-medium bg-white rounded-2xl border border-neutral-200 focus:outline-none focus:border-brand-yellow focus:ring-2 focus:ring-brand-yellow/20 shadow-xs"
                />
              </div>
            </div>

            {/* BRANDS GRID */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
              {filteredBrands.map((brand) => (
                <Link
                  key={brand.id}
                  href={`/sell-old-mobile-phone/${brand.slug}`}
                  className="bg-white rounded-2xl p-5 border border-neutral-200/80 hover:border-brand-yellow hover:shadow-[0_10px_25px_-5px_rgba(255,212,0,0.2)] transition-all duration-200 text-center group flex flex-col items-center justify-center space-y-2.5 hover:-translate-y-0.5"
                >
                  <div className="transition-transform group-hover:scale-105">
                    <BrandIcon name={brand.name} logoUrl={brand.logoUrl} className="w-12 h-12 sm:w-14 sm:h-14" />
                  </div>
                  <span className="text-xs sm:text-sm font-bold text-neutral-900 group-hover:text-black">
                    {brand.name}
                  </span>
                </Link>
              ))}
            </div>

            {filteredBrands.length === 0 && (
              <div className="bg-white rounded-2xl p-10 text-center border border-neutral-200 mt-6 max-w-md mx-auto">
                <p className="text-sm font-bold text-brand-black">No brands found matching &quot;{search}&quot;</p>
                <button
                  onClick={() => setSearch("")}
                  className="text-xs font-semibold text-amber-700 underline mt-2"
                >
                  Clear filter
                </button>
              </div>
            )}

            {/* AI TRUST BAR */}
            <div className="pt-10">
              <AiVerificationBar />
            </div>

          </div>
        </section>

        {/* ========================================================= */}
        {/* HOW CASHALL WORKS (3 STEPS WITH ILLUSTRATIONS)            */}
        {/* ========================================================= */}
        <section className="py-14 bg-white border-b border-neutral-200/80">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <h2 className="text-2xl sm:text-3xl font-black text-brand-black tracking-tight">
                How to Sell Your Old Phone on CashALL
              </h2>
              <p className="text-xs sm:text-sm text-neutral-500 mt-1.5">
                No complicated paperwork, no haggling with strangers, no waiting days for payment.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
              <div className="bg-brand-bg rounded-2xl p-6 border border-neutral-200/80 hover:border-amber-300 transition-colors flex flex-col justify-between">
                <div>
                  <div className="w-20 h-20 rounded-2xl bg-white border border-neutral-200/80 flex items-center justify-center mb-4 p-2.5 shadow-sm">
                    <img src="/images/trust/valuation.svg" alt="Check Price" className="w-full h-full object-contain" />
                  </div>
                  <span className="inline-block px-2.5 py-0.5 rounded-md bg-brand-yellow/80 text-brand-black font-black text-[11px] uppercase tracking-wider mb-2">
                    Step 1
                  </span>
                  <h3 className="text-base font-extrabold text-neutral-900 mb-2">
                    Check Price in 60s
                  </h3>
                  <p className="text-xs text-neutral-600 leading-relaxed">
                    Select your exact smartphone model and answer a few quick questions about screen condition, body scratches, and functional health for an instant locked quote.
                  </p>
                </div>
              </div>

              <div className="bg-brand-bg rounded-2xl p-6 border border-neutral-200/80 hover:border-amber-300 transition-colors flex flex-col justify-between">
                <div>
                  <div className="w-20 h-20 rounded-2xl bg-white border border-neutral-200/80 flex items-center justify-center mb-4 p-2.5 shadow-sm">
                    <img src="/images/trust/pickup.svg" alt="Free Doorstep Pickup" className="w-full h-full object-contain" />
                  </div>
                  <span className="inline-block px-2.5 py-0.5 rounded-md bg-brand-yellow/80 text-brand-black font-black text-[11px] uppercase tracking-wider mb-2">
                    Step 2
                  </span>
                  <h3 className="text-base font-extrabold text-neutral-900 mb-2">
                    Free Doorstep Pickup
                  </h3>
                  <p className="text-xs text-neutral-600 leading-relaxed">
                    Choose a convenient date and time slot. Our background-verified logistics executive arrives right at your home or office with ₹0 convenience or pickup fee.
                  </p>
                </div>
              </div>

              <div className="bg-brand-bg rounded-2xl p-6 border border-neutral-200/80 hover:border-amber-300 transition-colors flex flex-col justify-between">
                <div>
                  <div className="w-20 h-20 rounded-2xl bg-white border border-neutral-200/80 flex items-center justify-center mb-4 p-2.5 shadow-sm">
                    <img src="/images/trust/upi.svg" alt="Instant Payment Before Handover" className="w-full h-full object-contain" />
                  </div>
                  <span className="inline-block px-2.5 py-0.5 rounded-md bg-brand-yellow/80 text-brand-black font-black text-[11px] uppercase tracking-wider mb-2">
                    Step 3
                  </span>
                  <h3 className="text-base font-extrabold text-neutral-900 mb-2">
                    Instant Payment Before Handover
                  </h3>
                  <p className="text-xs text-neutral-600 leading-relaxed">
                    After a quick 3-minute physical inspection, the money is transferred immediately to your UPI (GPay, PhonePe, Paytm) or bank account before taking your phone.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================= */}
        {/* CUSTOMER REVIEWS SHOWCASE (65 REVIEWS • 3-5 STARS)        */}
        {/* ========================================================= */}
        <section className="py-14 bg-brand-bg border-b border-neutral-200/80">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8">
              <div>
                <div className="inline-flex items-center gap-1.5 text-xs font-black text-amber-700 tracking-wider uppercase mb-1">
                  <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                  <span>Real Customer Feedback</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-black text-brand-black tracking-tight">
                  Verified Reviews ({REVIEW_STATS.totalReviews} Customers • 4.8★ Rating)
                </h2>
                <p className="text-xs sm:text-sm text-neutral-500 mt-1">
                  Real selling experiences for iPhone 16, Galaxy S24, OnePlus 12 and more across West Bengal, Bihar, UP & Jharkhand.
                </p>
              </div>
              <Link
                href="/reviews"
                className="mt-3 sm:mt-0 text-xs font-bold text-amber-700 hover:text-amber-800 hover:underline flex items-center gap-1 self-start sm:self-auto"
              >
                View All {CUSTOMER_REVIEWS.length} Reviews <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* SHOWCASE TOP REVIEWS CARDS */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {CUSTOMER_REVIEWS.slice(0, 6).map((rev) => (
                <div
                  key={rev.id}
                  className="bg-white rounded-2xl p-5 border border-neutral-200/80 shadow-xs flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-3.5 h-3.5 ${
                              i < Math.floor(rev.rating)
                                ? "text-amber-400 fill-amber-400"
                                : "text-neutral-200 fill-neutral-200"
                            }`}
                          />
                        ))}
                        <span className="text-xs font-extrabold text-neutral-800 ml-1">
                          {rev.rating}.0
                        </span>
                      </div>
                      <span className="text-[10px] text-emerald-800 font-bold bg-emerald-100 px-2 py-0.5 rounded-full">
                        Verified Order
                      </span>
                    </div>

                    <h4 className="text-xs sm:text-sm font-extrabold text-neutral-900 mb-1 leading-snug">
                      {rev.reviewTitle}
                    </h4>

                    <p className="text-xs text-neutral-600 leading-relaxed line-clamp-3 mb-3">
                      &quot;{rev.reviewText}&quot;
                    </p>
                  </div>

                  <div className="pt-3 border-t border-neutral-100 flex items-center justify-between text-xs">
                    <div>
                      <div className="font-bold text-neutral-900">{rev.customerName}</div>
                      <div className="text-[10px] text-neutral-500">{rev.deviceSold}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-extrabold text-emerald-600">₹{rev.payoutAmount.toLocaleString("en-IN")}</div>
                      <div className="text-[10px] text-neutral-400">{rev.location.split(",")[0]}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="text-center mt-8">
              <Link
                href="/reviews"
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-white border border-neutral-200 hover:border-amber-400 text-xs font-extrabold text-neutral-800 shadow-xs hover:shadow transition-all"
              >
                <span>Read all 65 verified customer reviews & ratings</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

          </div>
        </section>

        {/* ========================================================= */}
        {/* RE-COMMERCE SEO CONTENT & FAQ ACCORDION                   */}
        {/* ========================================================= */}
        <section className="py-14 bg-white border-b border-neutral-200/80">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10">
              <h2 className="text-2xl sm:text-3xl font-black text-brand-black tracking-tight">
                Got Questions About Selling Your Old Phone?
              </h2>
            </div>

            <div className="space-y-3">
              {[
                {
                  q: "How does CashALL calculate the price for my old mobile phone?",
                  a: "Our algorithmic price engine factors in your smartphone's model, storage capacity, physical screen condition (touch responsiveness, scratches, lines), body condition (dents, scratches), camera health, battery status, and current secondary market resale demand. You get a transparent, locked quote with ₹0 hidden charges."
                },
                {
                  q: "Is doorstep mobile phone pickup free of cost?",
                  a: "Yes, 100% free! Unlike competitor platforms like Cashify or CashKR that charge ₹99 to ₹199 convenience/pickup fees, CashALL never charges a single rupee for doorstep pickup or inspection."
                },
                {
                  q: "When and how do I receive payment for my phone?",
                  a: "Payment is transferred directly to your bank account or UPI (Google Pay, PhonePe, Paytm, BHIM) on the spot at your doorstep before the device is handed over to our agent. You receive instant SMS and email confirmation with a formal Tax Invoice bill."
                },
                {
                  q: "Can I sell a dead, broken, or water-damaged phone on CashALL?",
                  a: "Yes! CashALL purchases working, partially working, cracked screen, and even dead non-working phones for component recycling and scrap valuation. Simply select your condition honestly to see your payout."
                },
                {
                  q: "What should I do before handing over my phone to the executive?",
                  a: "We recommend backing up your personal photos and data, removing your SIM card and memory card, and logging out of your Google / Apple iCloud account. Our executive performs a certified data wipe in your presence to ensure complete data security."
                },
                {
                  q: "Why should I sell to CashALL instead of local retail shops or OLX?",
                  a: "Local shops quote arbitrary low rates and OLX requires dealing with unreliable strangers, spam calls, and fraud risks. CashALL gives guaranteed upfront pricing, free doorstep service, certified data sanitization, and immediate cash."
                }
              ].map((faq, idx) => (
                <div
                  key={idx}
                  className="rounded-2xl border border-neutral-200 overflow-hidden bg-brand-bg transition-colors"
                >
                  <button
                    onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                    className="w-full px-5 py-4 text-left flex items-center justify-between font-extrabold text-sm text-neutral-900 hover:text-amber-800"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown
                      className={`w-4 h-4 text-neutral-400 transition-transform ${
                        openFaq === idx ? "rotate-180 text-amber-600" : ""
                      }`}
                    />
                  </button>
                  {openFaq === idx && (
                    <div className="px-5 pb-4 text-xs text-neutral-600 leading-relaxed border-t border-neutral-200/50 pt-3">
                      {faq.a}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

      </main>

      <Footer />
    </div>
  );
}
