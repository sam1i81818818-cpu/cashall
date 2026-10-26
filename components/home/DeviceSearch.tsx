"use client";

import React, { useState, useMemo, useRef, useEffect } from "react";
import Link from "next/link";
import { Search, ArrowRight, Smartphone, Laptop, Tablet, Sparkles, Calculator, MapPin, CheckCircle2, ShieldCheck, Zap } from "lucide-react";
import { INITIAL_MODELS, INITIAL_BRANDS, INITIAL_VARIANTS } from "@/lib/store";
import { trackMetaStandardEvent } from "@/lib/analytics/meta";

interface SearchVariantItem {
  id: string;
  modelId: string;
  storage: string;
  ram?: string;
  basePrice: number;
  modelName: string;
  brandName: string;
  brandSlug: string;
  modelSlug: string;
  category: string;
  imageUrl?: string | null;
}

interface DeviceSearchProps {
  inHeader?: boolean;
}

export function DeviceSearch({ inHeader = false }: DeviceSearchProps) {
  const [query, setQuery] = useState("");
  const [focused, setFocused] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setFocused(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Detect semantic intent from high-volume keyword queries (corridors, general valuations)
  const intentMatch = useMemo(() => {
    if (!query.trim()) return null;
    const q = query.toLowerCase().trim();

    if (q.includes("kolkata")) {
      return {
        type: "city",
        title: "Sell Old Phone in Kolkata Hub",
        subtitle: "Express 2–4 Hr Doorstep Pickup across Kolkata & Salt Lake with ₹0 Fee",
        url: "/sell-phone-in-kolkata",
      };
    }
    if (q.includes("howrah")) {
      return {
        type: "city",
        title: "Sell Old Phone in Howrah",
        subtitle: "Express Doorstep Pickup across Howrah, Liluah & Bally",
        url: "/sell-phone-in-howrah",
      };
    }
    if (q.includes("gorakhpur")) {
      return {
        type: "city",
        title: "Sell Old Phone in Gorakhpur",
        subtitle: "Doorstep Buyback Service across Gorakhpur Hub",
        url: "/sell-phone-in-gorakhpur",
      };
    }
    if (q.includes("price") || q.includes("calculator") || q.includes("valuation") || q.includes("rate") || q.includes("worth") || q.includes("cashify")) {
      return {
        type: "calculator",
        title: "Used Device Resale Calculator & Instant Valuation",
        subtitle: "Get guaranteed quote in 60 seconds with ₹0 inspection fee",
        url: "/sell-used-phone",
      };
    }
    return null;
  }, [query]);

  // Zero-friction variant and model matcher
  const searchResults = useMemo(() => {
    if (!query.trim() || query.trim().length < 2) return { models: [], variants: [] };
    const q = query.toLowerCase().trim();

    // 1. Find matching models
    const matchedModels = INITIAL_MODELS.filter((m) => {
      const brand = INITIAL_BRANDS.find((b) => b.id === m.brandId);
      const fullName = `${brand?.name || ""} ${m.name}`.toLowerCase();
      return fullName.includes(q) || m.name.toLowerCase().includes(q) || m.slug.toLowerCase().includes(q);
    }).slice(0, 5);

    // 2. Expand into exact variants for instant 1-click valuation
    const matchedVariants: SearchVariantItem[] = [];
    matchedModels.forEach((model) => {
      const brand = INITIAL_BRANDS.find((b) => b.id === model.brandId);
      const brandName = brand?.name || "Device";
      const brandSlug = brand?.slug || "general";
      const modelVariants = INITIAL_VARIANTS.filter((v) => v.modelId === model.id && v.active);

      if (modelVariants.length > 0) {
        // Take top 2-3 most common storage tiers
        modelVariants.slice(0, 3).forEach((v) => {
          matchedVariants.push({
            id: v.id,
            modelId: model.id,
            storage: v.storage,
            ram: v.ram,
            basePrice: v.basePrice,
            modelName: model.name,
            brandName,
            brandSlug,
            modelSlug: model.slug,
            category: (model.category || "MOBILE").toLowerCase(),
            imageUrl: model.imageUrl,
          });
        });
      }
    });

    return {
      models: matchedModels,
      variants: matchedVariants.slice(0, 6),
    };
  }, [query]);

  return (
    <div className={`w-full ${inHeader ? "" : "max-w-3xl mx-auto"} relative z-40`} ref={dropdownRef}>
      <div className="relative">
        <div
          className={
            inHeader
              ? "relative flex items-center rounded-full bg-neutral-900 border border-neutral-700/90 hover:border-neutral-500 focus-within:border-brand-yellow focus-within:ring-2 focus-within:ring-brand-yellow/30 transition-all shadow-inner"
              : "relative flex items-center shadow-stitchElevated rounded-2xl bg-white border border-slate-200/90 hover:border-slate-300 focus-within:border-slate-900 focus-within:ring-4 focus-within:ring-slate-900/5 transition-all"
          }
        >
          <Search
            className={
              inHeader
                ? "w-4 h-4 absolute left-3.5 text-brand-yellow pointer-events-none"
                : "w-5 h-5 absolute left-4 text-slate-400 pointer-events-none"
            }
          />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setFocused(true)}
            placeholder={
              inHeader
                ? "Search phone, laptop, or tablet to sell..."
                : "Type your device (e.g., 'iPhone 13', 'MacBook Air', 'S24 Ultra')..."
            }
            className={
              inHeader
                ? "w-full pl-10 pr-16 py-2 sm:py-2.5 text-xs sm:text-sm font-medium text-white bg-transparent rounded-full focus:outline-none placeholder:text-neutral-400"
                : "w-full pl-12 pr-16 py-3.5 sm:py-4 text-sm sm:text-base font-medium text-slate-900 bg-transparent rounded-2xl focus:outline-none placeholder:text-slate-400"
            }
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              className={
                inHeader
                  ? "absolute right-2.5 text-[11px] font-bold text-neutral-300 hover:text-white bg-neutral-800 hover:bg-neutral-700 px-2.5 py-0.5 rounded-full transition-colors cursor-pointer"
                  : "absolute right-3 text-xs font-semibold text-slate-500 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 px-2.5 py-1 rounded-lg transition-colors cursor-pointer"
              }
            >
              Clear
            </button>
          )}
        </div>

        {/* ZERO-FRICTION AUTOCOMPLETE DROPDOWN */}
        {focused && query.trim().length >= 2 && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden z-50 animate-fadeIn divide-y divide-slate-100">
            {/* INTENT-DRIVEN QUICK ACTION CARD */}
            {intentMatch && (
              <Link
                href={intentMatch.url}
                className="flex items-center justify-between px-4 py-3 bg-slate-50 hover:bg-slate-100/80 transition-colors group"
                onClick={() => setFocused(false)}
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold shrink-0">
                    {intentMatch.type === "city" ? (
                      <MapPin className="w-4 h-4 text-brand-yellow" />
                    ) : (
                      <Calculator className="w-4 h-4 text-brand-yellow" />
                    )}
                  </div>
                  <div>
                    <div className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-black">
                      {intentMatch.title}
                    </div>
                    <div className="text-[11px] text-slate-500 font-medium">
                      {intentMatch.subtitle}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-1 text-[11px] font-bold text-slate-900 bg-brand-yellow px-2.5 py-1.5 rounded-lg group-hover:bg-brand-yellowHover transition-colors shrink-0">
                  <span>Explore Hub</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </Link>
            )}

            {/* INSTANT VARIANTS: ZERO-FRICTION VALUATION */}
            {searchResults.variants.length > 0 ? (
              <div>
                <div className="px-4 py-2 bg-slate-50/80 flex items-center justify-between">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                    <Zap className="w-3.5 h-3.5 text-amber-500" />
                    <span>Exact Variants • Instant Valuation</span>
                  </span>
                  <span className="text-[10px] text-slate-400 font-medium">Click to assess condition</span>
                </div>

                <div className="divide-y divide-slate-100 max-h-[380px] overflow-y-auto">
                  {searchResults.variants.map((variant) => {
                    const assessUrl = `/sell/${variant.category}/${variant.brandSlug}/${variant.modelSlug}/assess?variantId=${variant.id}`;
                    return (
                      <Link
                        key={variant.id}
                        href={assessUrl}
                        onClick={() => {
                          setFocused(false);
                          trackMetaStandardEvent("Search", {
                            search_string: query,
                            content_category: variant.category,
                            content_name: `${variant.brandName} ${variant.modelName} ${variant.storage}`,
                          });
                        }}
                        className="flex items-center justify-between px-4 py-3 hover:bg-slate-50 transition-colors group"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center p-1 border border-slate-200/70 shrink-0">
                            {variant.imageUrl ? (
                              <img
                                src={variant.imageUrl}
                                alt={variant.modelName}
                                className="object-contain max-h-8 max-w-8"
                              />
                            ) : variant.category === "laptop" ? (
                              <Laptop className="w-5 h-5 text-slate-400" />
                            ) : variant.category === "tablet" ? (
                              <Tablet className="w-5 h-5 text-slate-400" />
                            ) : (
                              <Smartphone className="w-5 h-5 text-slate-400" />
                            )}
                          </div>
                          <div className="min-w-0">
                            <div className="text-xs sm:text-sm font-bold text-slate-900 truncate group-hover:text-black">
                              {variant.modelName.toLowerCase().startsWith(variant.brandName.toLowerCase())
                                ? variant.modelName
                                : `${variant.brandName} ${variant.modelName}`}{" "}
                              <span className="text-slate-500 font-medium">({variant.storage})</span>
                            </div>
                            <div className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1.5 mt-0.5">
                              <span className="tabular-nums">Up to ₹{variant.basePrice.toLocaleString("en-IN")}</span>
                              <span className="text-slate-300">•</span>
                              <span className="text-slate-500 font-normal">₹0 Pickup</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5 shrink-0 pl-3">
                          <span className="text-xs font-bold text-slate-900 px-2.5 py-1.5 rounded-lg bg-slate-100 group-hover:bg-slate-900 group-hover:text-white transition-all flex items-center gap-1">
                            <span>Get Price</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </span>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>
            ) : !intentMatch ? (
              <div className="p-8 text-center bg-white">
                <Smartphone className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                <p className="text-sm font-bold text-slate-900">No exact device found for &quot;{query}&quot;</p>
                <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
                  Try searching for brand or series like &quot;iPhone 14&quot;, &quot;Samsung S23&quot;, or &quot;MacBook M2&quot;.
                </p>
                <Link
                  href="/sell"
                  onClick={() => setFocused(false)}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-900 bg-brand-yellow px-4 py-2 rounded-xl mt-4 hover:bg-brand-yellowHover transition-colors"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Browse Full Device Catalog</span>
                </Link>
              </div>
            ) : null}
          </div>
        )}
      </div>
    </div>
  );
}
