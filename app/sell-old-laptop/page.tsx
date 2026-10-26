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
  Laptop,
  Star,
  CheckCircle2,
  Clock,
  Sparkles,
  HelpCircle,
  Cpu,
  HardDrive,
  RotateCcw,
  Check,
  ChevronDown
} from "lucide-react";

// Top Selling Laptop Models to highlight (Strictly Cashify +1% Valuation)
const TOP_SELLING_LAPTOPS = [
  {
    name: "Apple MacBook Pro 2024",
    brandSlug: "apple",
    modelSlug: "macbook-pro-2024",
    upToPrice: "1,42,000",
    badge: "Top Seller",
    imageUrl: "https://s3ng.cashify.in/cashify/product/img/xhdpi/32cf8149-3645.jpg?w=800",
  },
  {
    name: "Apple MacBook Air 2025",
    brandSlug: "apple",
    modelSlug: "macbook-air-2025",
    upToPrice: "71,500",
    badge: "Most Popular",
    imageUrl: "https://s3ng.cashify.in/cashify/product/img/xhdpi/866ba979-b24c.jpg?w=800",
  },
  {
    name: "Dell XPS 15 (Core i7 / i9)",
    brandSlug: "dell",
    modelSlug: "dell-xps-15-series",
    upToPrice: "72,800",
    badge: "High Demand",
    imageUrl: "https://s3ng.cashify.in/cashify/product/img/xhdpi/082b2afc-85c7.jpg?w=800",
  },
  {
    name: "HP Pavilion 15 Gaming / Intel",
    brandSlug: "hp",
    modelSlug: "hp-pavilion-series",
    upToPrice: "38,900",
    badge: "Trending",
    imageUrl: "https://s3ng.cashify.in/cashify/product/img/xhdpi/532d7a4a-3ad8.jpg?w=800",
  },
  {
    name: "Lenovo ThinkPad X1 Carbon",
    brandSlug: "lenovo",
    modelSlug: "thinkpad-x-series",
    upToPrice: "56,600",
    badge: "Business Choice",
    imageUrl: "https://s3ng.cashify.in/cashify/product/img/xhdpi/fa4c6c5f-b279.jpg?w=800",
  },
  {
    name: "Asus ROG Strix G16 Gaming",
    brandSlug: "asus",
    modelSlug: "rog-series",
    upToPrice: "64,700",
    badge: "Gamers Top Pick",
    imageUrl: "https://s3ng.cashify.in/cashify/product/img/xhdpi/486a4239-2e1e.jpg?w=800",
  },
  {
    name: "Apple MacBook Pro 2023",
    brandSlug: "apple",
    modelSlug: "macbook-pro-2023",
    upToPrice: "89,000",
    badge: "Fast Selling",
    imageUrl: "https://s3ng.cashify.in/cashify/product/img/xhdpi/5f32d963-46a3.jpg?w=800",
  },
  {
    name: "Microsoft Surface Series",
    brandSlug: "microsoft",
    modelSlug: "surface-laptop-5",
    upToPrice: "53,000",
    badge: "Premium Ultrabook",
    imageUrl: "https://s3ng.cashify.in/cashify/product/img/xhdpi/532d7a4a-3ad8.jpg?w=800",
  },
];

// Curated Top Laptop Brand Quick Bar
const QUICK_LAPTOP_BRAND_SLUGS = ["apple", "dell", "hp", "lenovo", "asus", "samsung", "acer", "xiaomi"];

export default function SellOldLaptopPage() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [brands, setBrands] = useState<BrandData[]>(INITIAL_BRANDS);
  const [modelSearch, setModelSearch] = useState("");
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  useEffect(() => {
    async function loadBrands() {
      try {
        const res = await fetch("/api/v1/catalog?category=LAPTOP");
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
        console.error("Error loading laptop brands", e);
      }
    }
    loadBrands();
  }, []);

  const laptopBrands = useMemo(() => {
    const list = brands.filter((b) =>
      INITIAL_MODELS.some(
        (m) =>
          (m.brandId === b.id || m.brandSlug?.toLowerCase() === b.slug?.toLowerCase()) &&
          (m.category === "LAPTOP" || m.id.startsWith("m-laptop-"))
      ) || ["apple", "dell", "hp", "lenovo", "asus", "acer", "samsung", "msi", "microsoft", "xiaomi"].includes(b.slug.toLowerCase())
    );
    return list;
  }, [brands]);

  const quickBrands = useMemo(() => {
    return QUICK_LAPTOP_BRAND_SLUGS.map((slug) =>
      laptopBrands.find((b) => b.slug.toLowerCase() === slug)
    ).filter(Boolean) as BrandData[];
  }, [laptopBrands]);

  const filteredBrands = useMemo(() => {
    if (!search.trim()) return laptopBrands;
    return laptopBrands.filter((b) =>
      b.name.toLowerCase().includes(search.toLowerCase().trim())
    );
  }, [laptopBrands, search]);

  // Global search autocomplete for laptop models
  const searchedModels = useMemo(() => {
    if (!modelSearch.trim() || modelSearch.trim().length < 2) return [];
    const q = modelSearch.toLowerCase().trim();
    return INITIAL_MODELS.filter(
      (m) =>
        (m.category === "LAPTOP" || m.id.startsWith("m-laptop-")) &&
        (m.name.toLowerCase().includes(q) || (m.brandSlug && m.brandSlug.toLowerCase().includes(q)))
    ).slice(0, 6);
  }, [modelSearch]);

  const scrollToBrands = () => {
    const el = document.getElementById("all-laptop-brands-section");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  const laptopReviews = useMemo(() => {
    return CUSTOMER_REVIEWS.filter((r) => r.deviceCategory === "LAPTOP" || r.deviceSold.toLowerCase().includes("macbook") || r.deviceSold.toLowerCase().includes("laptop")).slice(0, 8);
  }, []);

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
              <span className="text-brand-black font-bold">Sell Old Laptop</span>
            </nav>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
              
              {/* LEFT COLUMN: HERO CONTENT & BRAND QUICK SELECTOR */}
              <div className="lg:col-span-7 space-y-6">
                
                {/* H1 HEADLINE (Clean Recommerce) */}
                <div>
                  <h1 className="text-3xl sm:text-5xl font-black text-brand-black tracking-tight leading-[1.15]">
                    Sell Old{" "}
                    <span className="text-amber-500">
                      Laptop Online
                    </span>{" "}
                    for Instant Cash
                  </h1>
                  <p className="text-sm sm:text-base text-neutral-600 mt-3 font-normal leading-relaxed max-w-xl">
                    Get India&apos;s highest locked resale quote for your used MacBook, Dell, HP, Lenovo or Gaming laptop in 60 seconds. Free doorstep evaluation and instant UPI bank transfer before handover.
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
                      <div className="text-[10px] text-neutral-500 hidden sm:block">Certified SSD Erase</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 p-2.5 sm:p-3 rounded-2xl bg-white border border-neutral-200/90 shadow-xs">
                    <div className="w-8 h-8 rounded-xl bg-amber-100 flex items-center justify-center text-amber-700 shrink-0">
                      <TrendingUp className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-extrabold text-neutral-900 leading-tight">Top Value</div>
                      <div className="text-[10px] text-neutral-500 hidden sm:block">Instant Locked Valuation</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 p-2.5 sm:p-3 rounded-2xl bg-white border border-neutral-200/90 shadow-xs">
                    <div className="w-8 h-8 rounded-xl bg-amber-100 flex items-center justify-center text-amber-700 shrink-0">
                      <Zap className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-extrabold text-neutral-900 leading-tight">Spot Payment</div>
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
                      placeholder="Search your laptop (e.g. MacBook Air M2, Dell XPS 15, ThinkPad X1)..."
                      className="w-full pl-12 pr-4 py-3.5 text-sm font-medium bg-white rounded-2xl border-2 border-neutral-200 focus:outline-none focus:border-brand-yellow focus:ring-4 focus:ring-brand-yellow/20 shadow-sm transition-all"
                    />
                  </div>

                  {/* AUTOCOMPLETE DROPDOWN */}
                  {searchedModels.length > 0 && (
                    <div className="absolute z-30 left-0 right-0 mt-2 bg-white rounded-2xl border border-neutral-200 shadow-xl overflow-hidden divide-y divide-neutral-100 animate-in fade-in slide-in-from-top-2 duration-150">
                      {searchedModels.map((m) => (
                        <Link
                          key={m.id}
                          href={`/sell-old-laptop/${m.brandSlug || 'laptop'}/${m.slug}`}
                          className="flex items-center justify-between px-4 py-3 hover:bg-amber-50/60 transition-colors group"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-neutral-50 flex items-center justify-center text-neutral-500">
                              <Laptop className="w-4 h-4 text-amber-600" />
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

                {/* SELECT LAPTOP BRAND: QUICK ROW (CASHKR & CASHIFY PATTERN) */}
                <div className="pt-2">
                  <div className="flex items-center justify-between mb-3">
                    <h2 className="text-xs sm:text-sm font-black text-neutral-800 tracking-wide uppercase">
                      Select Laptop Brand
                    </h2>
                    <Link
                      href="/sell-old-laptop/brands"
                      className="text-xs font-bold text-amber-700 hover:text-amber-800 hover:underline flex items-center gap-1"
                    >
                      View all brands ({laptopBrands.length}) <ChevronRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>

                  <div className="grid grid-cols-4 sm:grid-cols-6 gap-2 sm:gap-3">
                    {quickBrands.slice(0, 5).map((brand) => (
                      <Link
                        key={brand.id}
                        href={`/sell-old-laptop/${brand.slug}`}
                        className="bg-white rounded-2xl p-3 border border-neutral-200/80 hover:border-brand-yellow hover:shadow-md transition-all duration-200 flex flex-col items-center justify-center text-center group hover:-translate-y-0.5"
                      >
                        <div className="w-10 h-10 flex items-center justify-center transition-transform group-hover:scale-110">
                          <BrandIcon name={brand.name} logoUrl={brand.logoUrl} fallbackType="LAPTOP" className="w-10 h-10" />
                        </div>
                        <span className="text-xs font-bold text-neutral-800 mt-1.5 group-hover:text-black">
                          {brand.name}
                        </span>
                      </Link>
                    ))}

                    {/* "MORE (ALL BRANDS)" CARD LIKE CASHKR / CASHIFY */}
                    <Link
                      href="/sell-old-laptop/brands"
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
                    <span>Start Selling Laptop</span>
                    <ArrowRight className="w-5 h-5" />
                  </button>
                </div>

              </div>

              {/* RIGHT COLUMN: HERO LAPTOP SHOWCASE (CASHALL BRAND YELLOW THEME) */}
              <div className="lg:col-span-5 flex justify-center lg:justify-end">
                <div className="relative w-full max-w-sm sm:max-w-md">
                  
                  {/* BACKGROUND YELLOW GLOW */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-amber-300/40 via-yellow-300/30 to-amber-100/50 rounded-3xl blur-2xl -z-10" />

                  {/* HERO SHOWCASE CARD (APPLE MACBOOK PRO M5 SHOWCASE) */}
                  <div className="bg-white rounded-3xl p-6 sm:p-7 shadow-xl border-2 border-brand-yellow/70 relative overflow-hidden flex flex-col justify-between">
                    <div className="flex items-center justify-between mb-2">
                      <span className="px-3 py-1 rounded-full bg-brand-yellow text-brand-black font-black text-[11px] uppercase tracking-wider">
                        Premium Laptop Buyback
                      </span>
                      <div className="flex items-center gap-1.5 text-xs text-neutral-600 font-bold">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                        <span>Pickup in 2-4 Hours</span>
                      </div>
                    </div>

                    <h3 className="text-xl sm:text-2xl font-black text-brand-black tracking-tight leading-tight mt-1">
                      Apple MacBook Pro (M4 / M5)
                    </h3>
                    <p className="text-xs text-neutral-500 mt-1 leading-relaxed">
                      Instant quote in 60s with free doorstep evaluation &amp; instant bank transfer.
                    </p>

                    {/* MACBOOK SHOWCASE IMAGE */}
                    <div className="my-3 py-2 flex items-center justify-center">
                      <img
                        src="https://itechstore.co.in/uploads/products/mac_m5_product.webp"
                        alt="Apple MacBook Pro M5"
                        className="h-48 sm:h-56 object-contain drop-shadow-xl hover:scale-105 transition-transform duration-300"
                      />
                    </div>

                    {/* MINI SPEC COMPARISON TABLE */}
                    <div className="p-3.5 rounded-2xl bg-amber-50/80 border border-amber-200/80 space-y-2 text-xs">
                      <div className="flex items-center justify-between text-neutral-800">
                        <span className="font-semibold">MacBook Pro 16" (M4 Pro / M5)</span>
                        <span className="font-black text-brand-black">Up to ₹1,84,000</span>
                      </div>
                      <div className="flex items-center justify-between text-neutral-800">
                        <span className="font-semibold">MacBook Pro 14" (M4 / M5)</span>
                        <span className="font-black text-brand-black">Up to ₹1,42,000</span>
                      </div>
                      <div className="flex items-center justify-between text-neutral-800">
                        <span className="font-semibold">MacBook Air 15" (M3 / M4)</span>
                        <span className="font-black text-brand-black">Up to ₹78,500</span>
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

        {/* AI VERIFICATION SYSTEM BAR */}
        <AiVerificationBar />

        {/* ========================================================= */}
        {/* TOP SELLING LAPTOPS SECTION (ALIGNED WITH COMPETITOR CARDS) */}
        {/* ========================================================= */}
        <section className="py-12 sm:py-16 bg-white border-b border-neutral-200/80">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
              <div>
                <h2 className="text-2xl sm:text-3xl font-black text-brand-black tracking-tight">
                  Top Selling Laptops &amp; MacBooks
                </h2>
                <p className="text-xs sm:text-sm text-neutral-500 mt-1 font-medium">
                  Instant locked payouts for trending laptops this week in Kolkata, Howrah, Patna &amp; Across India.
                </p>
              </div>

              <Link
                href="/sell-old-laptop/brands"
                className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-amber-700 hover:text-amber-800"
              >
                <span>View all models</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
              {TOP_SELLING_LAPTOPS.map((laptop, idx) => (
                <Link
                  key={idx}
                  href={`/sell-old-laptop/${laptop.brandSlug}/${laptop.modelSlug}`}
                  className="group relative bg-white rounded-2xl p-4 sm:p-5 border border-neutral-200/80 hover:border-brand-yellow hover:shadow-xl transition-all duration-200 flex flex-col justify-between"
                >
                  <span className="absolute top-3 left-3 px-2 py-0.5 rounded-md bg-amber-100 text-amber-800 text-[10px] font-extrabold uppercase tracking-wider">
                    {laptop.badge}
                  </span>

                  <div className="relative w-full h-36 sm:h-40 my-3 flex items-center justify-center">
                    <img
                      src={laptop.imageUrl}
                      alt={`Sell ${laptop.name} online for cash`}
                      className="object-contain max-h-36 w-auto group-hover:scale-105 transition-transform duration-200"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = "/images/devices/laptop.jpg";
                      }}
                    />
                  </div>

                  <div className="space-y-1.5 pt-2 border-t border-neutral-100">
                    <h3 className="text-xs sm:text-sm font-bold text-neutral-900 line-clamp-2 group-hover:text-amber-800 transition-colors">
                      {laptop.name}
                    </h3>
                    <div className="flex items-baseline justify-between pt-1">
                      <span className="text-[11px] text-neutral-500 font-medium">Get up to</span>
                      <span className="text-sm sm:text-base font-black text-amber-800">
                        ₹{laptop.upToPrice}
                      </span>
                    </div>

                    <div className="w-full mt-2 py-2 rounded-xl bg-neutral-50 group-hover:bg-amber-100 text-neutral-700 group-hover:text-amber-950 text-xs font-bold text-center transition-colors flex items-center justify-center gap-1">
                      <span>Sell Now</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ========================================================= */}
        {/* ALL LAPTOP BRANDS DIRECTORY SECTION                       */}
        {/* ========================================================= */}
        <section id="all-laptop-brands-section" className="py-12 sm:py-16 bg-brand-bg border-b border-neutral-200/80">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-10">
              <h2 className="text-2xl sm:text-3xl font-black text-brand-black tracking-tight">
                Select Your Laptop Manufacturer
              </h2>
              <p className="text-xs sm:text-sm text-neutral-600 mt-2 font-medium">
                CashALL evaluates processors (Intel Core i3/i5/i7/i9, AMD Ryzen, Apple Silicon M1/M2/M3/M4), dedicated graphics, RAM, SSD health, and battery cycle counts.
              </p>

              {/* SEARCH FILTER FOR BRANDS */}
              <div className="max-w-md mx-auto mt-6 relative">
                <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Filter laptop brand (Apple, Dell, HP, Lenovo, Asus)..."
                  className="w-full pl-11 pr-4 py-3 text-sm font-medium bg-white rounded-2xl border border-neutral-200 focus:outline-none focus:border-brand-yellow focus:ring-4 focus:ring-brand-yellow/20 shadow-xs transition-all"
                />
              </div>
            </div>

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

            <div className="text-center mt-10">
              <Link
                href="/sell-old-laptop/brands"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-white border border-neutral-300 hover:border-neutral-400 text-neutral-800 font-bold text-xs shadow-xs hover:shadow-sm transition-all"
              >
                <span>View Full Laptop Brands Directory</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>

        {/* ========================================================= */}
        {/* HOW TO SELL LAPTOP ONLINE ON CASHALL (3 STEPS)            */}
        {/* ========================================================= */}
        <section className="py-12 sm:py-16 bg-white border-b border-neutral-200/80">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <h2 className="text-2xl sm:text-3xl font-black text-brand-black tracking-tight">
                How to Sell Your Used Laptop in 3 Easy Steps
              </h2>
              <p className="text-xs sm:text-sm text-neutral-600 mt-2 font-medium">
                No bargaining with random classified buyers. Transparent pricing backed by certified diagnostic evaluation.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
              <div className="bg-brand-bg rounded-3xl p-6 sm:p-8 border border-neutral-200/80 hover:border-amber-300 transition-colors flex flex-col justify-between">
                <div>
                  <div className="w-20 h-20 rounded-2xl bg-white border border-neutral-200/80 flex items-center justify-center mb-4 p-2.5 shadow-sm">
                    <img src="/images/trust/valuation.svg" alt="Select Model & Specifications" className="w-full h-full object-contain" />
                  </div>
                  <span className="inline-block px-2.5 py-0.5 rounded-md bg-brand-yellow/80 text-brand-black font-black text-[11px] uppercase tracking-wider mb-2">
                    Step 1
                  </span>
                  <h3 className="text-lg font-black text-neutral-900 mb-2">
                    Select Model &amp; Specifications
                  </h3>
                  <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed font-normal">
                    Choose your laptop manufacturer and configure your processor, RAM, and SSD storage. Answer simple questions about your screen condition, keyboard, and battery health.
                  </p>
                </div>
              </div>

              <div className="bg-brand-bg rounded-3xl p-6 sm:p-8 border border-neutral-200/80 hover:border-amber-300 transition-colors flex flex-col justify-between">
                <div>
                  <div className="w-20 h-20 rounded-2xl bg-white border border-neutral-200/80 flex items-center justify-center mb-4 p-2.5 shadow-sm">
                    <img src="/images/trust/pickup.svg" alt="Free Doorstep Inspection Slot" className="w-full h-full object-contain" />
                  </div>
                  <span className="inline-block px-2.5 py-0.5 rounded-md bg-brand-yellow/80 text-brand-black font-black text-[11px] uppercase tracking-wider mb-2">
                    Step 2
                  </span>
                  <h3 className="text-lg font-black text-neutral-900 mb-2">
                    Free Doorstep Inspection Slot
                  </h3>
                  <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed font-normal">
                    Schedule a pickup slot convenient for your schedule. Our certified technician visits your home or workplace with full diagnostic tools at zero pickup fee.
                  </p>
                </div>
              </div>

              <div className="bg-brand-bg rounded-3xl p-6 sm:p-8 border border-neutral-200/80 hover:border-amber-300 transition-colors flex flex-col justify-between">
                <div>
                  <div className="w-20 h-20 rounded-2xl bg-white border border-neutral-200/80 flex items-center justify-center mb-4 p-2.5 shadow-sm">
                    <img src="/images/trust/upi.svg" alt="Data Wipe & Instant Cash Handover" className="w-full h-full object-contain" />
                  </div>
                  <span className="inline-block px-2.5 py-0.5 rounded-md bg-brand-yellow/80 text-brand-black font-black text-[11px] uppercase tracking-wider mb-2">
                    Step 3
                  </span>
                  <h3 className="text-lg font-black text-neutral-900 mb-2">
                    Data Wipe &amp; Instant Cash Handover
                  </h3>
                  <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed font-normal">
                    We assist with a certified NIST 800-88 cryptographic SSD data wipe so no files remain. The agreed payment is credited straight to your UPI or Bank account before device handover.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================= */}
        {/* WHY CASHALL FOR LAPTOPS: VALUE MATRIX                     */}
        {/* ========================================================= */}
        <section className="py-12 sm:py-16 bg-gradient-to-b from-brand-bg to-white border-b border-neutral-200/80">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <h2 className="text-2xl sm:text-3xl font-black text-brand-black tracking-tight">
                Why CashALL is India&apos;s Preferred Laptop Buyer
              </h2>
              <p className="text-xs sm:text-sm text-neutral-600 mt-2 font-medium">
                Built specifically to eliminate classified scams, low-ball dealer offers, and data security worries.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white rounded-3xl p-6 border border-neutral-200/90 shadow-xs space-y-3">
                <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <h3 className="text-base font-extrabold text-neutral-900">
                  NIST 800-88 Data Erase
                </h3>
                <p className="text-xs text-neutral-600 leading-relaxed font-normal">
                  Your corporate or personal files are 100% permanently destroyed using cryptographic wipe protocols before refurbishment.
                </p>
              </div>

              <div className="bg-white rounded-3xl p-6 border border-neutral-200/90 shadow-xs space-y-3">
                <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center">
                  <TrendingUp className="w-5 h-5" />
                </div>
                <h3 className="text-base font-extrabold text-neutral-900">
                  Transparent Component Pricing
                </h3>
                <p className="text-xs text-neutral-600 leading-relaxed font-normal">
                  Fair value for your upgraded RAM, NVMe SSD storage, dedicated NVIDIA RTX graphics cards, and authentic power adapter.
                </p>
              </div>

              <div className="bg-white rounded-3xl p-6 border border-neutral-200/90 shadow-xs space-y-3">
                <div className="w-10 h-10 rounded-2xl bg-blue-100 text-blue-700 flex items-center justify-center">
                  <Cpu className="w-5 h-5" />
                </div>
                <h3 className="text-base font-extrabold text-neutral-900">
                  Accepts Broken &amp; Dead Units
                </h3>
                <p className="text-xs text-neutral-600 leading-relaxed font-normal">
                  Damaged hinges, cracked displays, failed batteries, or water-damaged motherboards still receive competitive spare-parts salvage value.
                </p>
              </div>

              <div className="bg-white rounded-3xl p-6 border border-neutral-200/90 shadow-xs space-y-3">
                <div className="w-10 h-10 rounded-2xl bg-purple-100 text-purple-700 flex items-center justify-center">
                  <Zap className="w-5 h-5" />
                </div>
                <h3 className="text-base font-extrabold text-neutral-900">
                  Zero Negotiation at Doorstep
                </h3>
                <p className="text-xs text-neutral-600 leading-relaxed font-normal">
                  No sudden unannounced deductions. If condition matches your self-declaration, the quoted price is honored down to the last rupee.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================= */}
        {/* LAPTOP REVIEWS SECTION                                    */}
        {/* ========================================================= */}
        <section className="py-12 sm:py-16 bg-white border-b border-neutral-200/80">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-800 text-xs font-bold mb-2">
                  <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                  <span>4.8/5 Star Rating from 65+ Verified Customers</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-black text-brand-black tracking-tight">
                  What Laptop Sellers Say About CashALL
                </h2>
                <p className="text-xs sm:text-sm text-neutral-500 mt-1 font-medium">
                  Real feedback from customers who sold used MacBooks, gaming rigs, and office laptops.
                </p>
              </div>

              <Link
                href="/reviews"
                className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-emerald-600 hover:text-emerald-700"
              >
                <span>Read all 65 verified reviews</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {laptopReviews.map((review) => (
                <div
                  key={review.id}
                  className="bg-neutral-50 rounded-2xl p-5 border border-neutral-200/80 flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex text-amber-500">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={`w-3.5 h-3.5 ${
                              i < Math.floor(review.rating)
                                ? "fill-amber-400 text-amber-400"
                                : "text-neutral-300"
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-[10px] text-neutral-400 font-mono font-medium">
                        {review.date}
                      </span>
                    </div>

                    <h4 className="text-xs font-extrabold text-neutral-900 line-clamp-1">
                      {review.reviewTitle}
                    </h4>

                    <p className="text-xs text-neutral-600 font-normal line-clamp-3 leading-relaxed">
                      &quot;{review.reviewText}&quot;
                    </p>
                  </div>

                  <div className="pt-3 border-t border-neutral-200/60 flex items-center justify-between text-xs">
                    <div>
                      <div className="font-bold text-neutral-900">{review.customerName}</div>
                      <div className="text-[10px] text-neutral-500">{review.location}</div>
                    </div>
                    <span className="text-[10px] font-mono font-semibold bg-white px-2 py-0.5 rounded border border-neutral-200 text-neutral-700">
                      {review.deviceSold}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ========================================================= */}
        {/* LAPTOP FAQS ACCORDION (AEO & GEO SCHEMA READY)             */}
        {/* ========================================================= */}
        <section className="py-12 sm:py-16 bg-brand-bg">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-xl mx-auto mb-10">
              <h2 className="text-2xl sm:text-3xl font-black text-brand-black tracking-tight">
                Frequently Asked Questions
              </h2>
              <p className="text-xs sm:text-sm text-neutral-500 mt-2 font-medium">
                Everything you need to know about selling old laptops and MacBooks on CashALL.
              </p>
            </div>

            <div className="space-y-3">
              {[
                {
                  q: "Can I sell a broken, dead, or water-damaged laptop?",
                  a: "Yes. CashALL accepts non-working laptops with cracked displays, dead batteries, faulty keyboards, shorted motherboards, or liquid damage. We calculate fair scrap and spare-parts salvage value for authorized refurbishment."
                },
                {
                  q: "How does CashALL ensure my laptop SSD data is completely erased?",
                  a: "Before taking possession, our certified technician assists you with a multi-pass cryptographic disk sanitization adhering to NIST SP 800-88 standards. This guarantees that your sensitive passwords, photos, documents, and banking tokens are impossible to recover."
                },
                {
                  q: "Do I need the original charger and invoice to sell my laptop?",
                  a: "Having the authentic charger increases your payout. While the original bill is helpful, it is not mandatory for out-of-warranty units. Valid government photo identification (Aadhaar or Voter ID) is required to ensure authentic ownership."
                },
                {
                  q: "How long does doorstep inspection take and when do I get paid?",
                  a: "A typical laptop inspection takes 10 to 15 minutes to run diagnostic checks on the display, keyboard, battery cycles, ports, and storage. Payment is transferred immediately via UPI or IMPS before the technician leaves your doorstep."
                },
                {
                  q: "Which laptop brands does CashALL buy?",
                  a: "CashALL purchases laptops from Apple (MacBook Air & MacBook Pro - Intel, M1, M2, M3, M4), Dell (XPS, Inspiron, Alienware), HP (Pavilion, Envy, Spectre, Omen), Lenovo (ThinkPad, IdeaPad, Legion), Asus (ROG, TUF, ZenBook), Acer, MSI, Samsung Galaxy Book, and Microsoft Surface."
                }
              ].map((faq, idx) => (
                <div
                  key={idx}
                  className="bg-white rounded-2xl border border-neutral-200/90 overflow-hidden shadow-2xs"
                >
                  <button
                    onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                    className="w-full px-5 py-4 text-left flex items-center justify-between gap-4 font-bold text-sm text-neutral-900 hover:text-emerald-700 transition-colors"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown
                      className={`w-4 h-4 text-neutral-400 shrink-0 transition-transform duration-200 ${
                        openFaq === idx ? "rotate-180 text-emerald-600" : ""
                      }`}
                    />
                  </button>
                  {openFaq === idx && (
                    <div className="px-5 pb-4 text-xs sm:text-sm text-neutral-600 font-normal leading-relaxed border-t border-neutral-100 pt-3">
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
