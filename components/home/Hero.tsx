"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/Button";
import {
  ChevronLeft,
  ChevronRight,
  ArrowRight,
} from "lucide-react";

// Curated Hero Spotlight Slides
const HERO_SLIDES = [
  {
    id: "slide-phone",
    badge: "Spotlight Trade-In",
    title: "Sell Your Old Phone for the Highest Payout",
    highlight: "Highest Payout",
    subtitle: "Free doorstep pickup in 2-4 hours, zero convenience fees, and guaranteed spot payment before handover.",
    ctaText: "Sell Phone Now",
    ctaLink: "/sell-old-mobile-phone",
    secondaryCtaText: "Check Phone Value",
    secondaryCtaLink: "/sell-old-mobile-phone",
    deviceBadge: "+1% Higher Than Market Rates",
    deviceType: "phone",
    image: "/images/hero/hero_phone.jpg",
  },
  {
    id: "slide-laptop",
    badge: "Mac & PC Recommerce",
    title: "Sell Used Laptops with Certified Cryptographic Wipe",
    highlight: "Certified Cryptographic Wipe",
    subtitle: "From MacBook Pro to Dell & HP gaming machines. On-site functional testing and instant direct bank credit.",
    ctaText: "Sell Laptop",
    ctaLink: "/sell-old-laptop",
    secondaryCtaText: "All Laptop Brands",
    secondaryCtaLink: "/sell-old-laptop/brands",
    deviceBadge: "100% Cryptographic Data Erasure",
    deviceType: "laptop",
    image: "/images/hero/hero_laptop.jpg",
  },
  {
    id: "slide-ps5",
    badge: "Gaming Rental Hub • WB",
    title: "Rent PlayStation 5 Console at Just ₹500/Day",
    highlight: "₹500/Day",
    subtitle: "Doorstep delivery with top game titles (GTA V, Spider-Man 2, FC 24) with pay on delivery convenience.",
    ctaText: "Rent PS5",
    ctaLink: "/rent/ps5",
    secondaryCtaText: "View Rental Games",
    secondaryCtaLink: "/rent/ps5",
    deviceBadge: "Kolkata & Howrah Same-Day",
    deviceType: "ps5",
    image: "/images/hero/hero_ps5.jpg",
    wbOnly: true,
  },
  {
    id: "slide-tablet",
    badge: "Tablets & iPads Buyback",
    title: "Sell Old iPads & Galaxy Tabs with Zero Haggling",
    highlight: "Zero Haggling",
    subtitle: "Lock guaranteed buyback valuation online for any Apple iPad, Samsung Tab, or Lenovo tablet.",
    ctaText: "Sell Tablet",
    ctaLink: "/sell-old-tablet",
    secondaryCtaText: "Select Tablet Model",
    secondaryCtaLink: "/sell-old-tablet/brands",
    deviceBadge: "48-Hour Locked Price Quote",
    deviceType: "tablet",
    image: "/images/hero/hero_tablet.jpg",
  },
];

export function Hero() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isWestBengal, setIsWestBengal] = useState(false);

  useEffect(() => {
    const checkLocation = () => {
      if (typeof window !== "undefined") {
        try {
          const locStr = localStorage.getItem("cashall_location");
          if (locStr) {
            const parsed = JSON.parse(locStr);
            const state = (parsed?.state || "").toLowerCase();
            const city = (parsed?.city || "").toLowerCase();
            setIsWestBengal(
              state.includes("west bengal") ||
              state.includes("bengal") ||
              state.trim() === "wb" ||
              city.includes("kolkata") ||
              city.includes("howrah")
            );
          } else {
            setIsWestBengal(false);
          }
        } catch {
          setIsWestBengal(false);
        }
      }
    };

    checkLocation();
    window.addEventListener("cashall_location_updated", checkLocation);
    window.addEventListener("storage", checkLocation);
    return () => {
      window.removeEventListener("cashall_location_updated", checkLocation);
      window.removeEventListener("storage", checkLocation);
    };
  }, []);

  const activeSlides = isWestBengal ? HERO_SLIDES : HERO_SLIDES.filter((s) => !s.wbOnly);

  // Auto-slide carousel
  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % activeSlides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [isPaused, activeSlides.length]);

  const slide = activeSlides[currentSlide] || activeSlides[0];

  const touchStartX = useRef<number | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const diffX = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diffX) > 40) {
      if (diffX > 0) {
        setCurrentSlide((prev) => (prev + 1) % activeSlides.length);
      } else {
        setCurrentSlide((prev) => (prev === 0 ? activeSlides.length - 1 : prev - 1));
      }
    }
    touchStartX.current = null;
  };

  return (
    <section className="relative bg-stitch-canvas text-slate-900 pt-4 sm:pt-6 pb-8 sm:pb-12 border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* ========================================================================= */}
        {/* EDITORIAL SPOTLIGHT TRADE-IN SLIDER */}
        {/* ========================================================================= */}
        <div
          className="relative overflow-hidden rounded-3xl border border-slate-900/90 bg-slate-950 text-white shadow-2xl"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          <div className="relative p-3.5 sm:p-6 md:p-10 pb-6 sm:pb-9 flex flex-row items-center justify-between gap-2.5 sm:gap-6 md:gap-8 overflow-hidden">
            {/* AMBIENT GLOW */}
            <div className="absolute right-0 top-0 w-80 h-80 rounded-full bg-brand-yellow/10 blur-3xl pointer-events-none" />

            <div className="flex-1 min-w-0 space-y-1 sm:space-y-3 z-10 text-left pl-5 sm:pl-7 md:pl-0">
              <p className="text-[9px] sm:text-[11px] font-bold text-brand-yellow uppercase tracking-wider flex items-center gap-1.5 truncate">
                <span className="w-1.5 h-1.5 rounded-full bg-brand-yellow shrink-0" />
                <span>{slide.badge}</span>
              </p>

              <h2 className="text-xs xs:text-sm sm:text-2xl md:text-3xl font-extrabold text-white tracking-tight leading-snug line-clamp-2">
                {slide.title}
              </h2>

              <p className="text-[10px] sm:text-xs md:text-sm text-slate-300 font-normal leading-relaxed line-clamp-2 hidden xs:block">
                {slide.subtitle}
              </p>

              <div className="flex items-center gap-2 pt-0.5 sm:pt-2">
                <Link href={slide.ctaLink}>
                  <Button
                    variant="primary"
                    size="sm"
                    className="font-bold text-[10px] sm:text-sm px-3 py-1 sm:px-5 sm:py-2.5 rounded-lg sm:rounded-xl shadow-yellowGlow gap-1.5 group cursor-pointer"
                  >
                    <span>{slide.ctaText}</span>
                    <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>

                <Link href={slide.secondaryCtaLink} className="hidden sm:inline-block">
                  <Button
                    variant="secondary"
                    size="md"
                    className="font-semibold text-xs sm:text-sm px-4 py-2.5 rounded-xl bg-white/10 text-white hover:bg-white/20 border border-white/15 backdrop-blur-sm transition-all cursor-pointer"
                  >
                    <span>{slide.secondaryCtaText}</span>
                  </Button>
                </Link>
              </div>
            </div>

            {/* VISUAL BADGE & PRODUCT IMAGE (HORIZONTAL RECTANGLE ON ALL DEVICES) */}
            <div className="shrink-0 relative z-10 pr-5 sm:pr-7 md:pr-0">
              <div className="relative w-28 h-20 xs:w-36 xs:h-24 sm:w-48 sm:h-32 md:w-60 md:h-40 lg:w-72 lg:h-48 rounded-xl sm:rounded-2xl overflow-hidden border border-slate-800 bg-slate-900 shadow-xl group">
                <Image
                  src={slide.image}
                  alt={slide.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  sizes="(max-width: 640px) 144px, (max-width: 768px) 192px, 288px"
                  priority
                />
              </div>
            </div>

            {/* SLIDE INDICATOR PILLS / DOTS */}
            <div className="absolute bottom-2 sm:bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5 z-20">
              {activeSlides.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentSlide(idx)}
                  aria-label={`Go to slide ${idx + 1}`}
                  className={`transition-all duration-300 rounded-full cursor-pointer ${
                    currentSlide === idx
                      ? "w-6 h-1.5 bg-brand-yellow"
                      : "w-1.5 h-1.5 bg-slate-600 hover:bg-slate-400"
                  }`}
                />
              ))}
            </div>

            {/* SLIDE NAVIGATION CONTROLS */}
            <button
              onClick={() => setCurrentSlide((prev) => (prev === 0 ? activeSlides.length - 1 : prev - 1))}
              aria-label="Previous slide"
              className="absolute left-1 sm:left-3 top-1/2 -translate-y-1/2 w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-slate-900/80 border border-slate-700 text-white hover:bg-black transition-all flex items-center justify-center cursor-pointer z-20"
            >
              <ChevronLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </button>
            <button
              onClick={() => setCurrentSlide((prev) => (prev + 1) % activeSlides.length)}
              aria-label="Next slide"
              className="absolute right-1 sm:right-3 top-1/2 -translate-y-1/2 w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-slate-900/80 border border-slate-700 text-white hover:bg-black transition-all flex items-center justify-center cursor-pointer z-20"
            >
              <ChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </button>
          </div>
        </div>

      </div>
    </section>
  );
}
