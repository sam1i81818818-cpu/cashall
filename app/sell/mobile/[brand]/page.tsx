"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useParams } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { DeviceCardImage } from "@/components/common/DeviceCardImage";
import { INITIAL_BRANDS, INITIAL_MODELS } from "@/lib/store";
import { getSeriesForBrand, filterModelsBySeries } from "@/lib/series-data";
import { Search, ChevronRight, Smartphone, Sparkles, Layers } from "lucide-react";
import { trackMetaStandardEvent } from "@/lib/analytics/meta";
import { AiVerificationBar } from "@/components/common/AiVerificationBar";

export default function ModelSelectionPage() {
  const params = useParams();
  const brandSlug = (params?.brand as string) || "apple";
  const [search, setSearch] = useState("");
  const [selectedSeriesId, setSelectedSeriesId] = useState<string | null>(null);

  const brand = INITIAL_BRANDS.find(
    (b) => b.slug.toLowerCase() === brandSlug.toLowerCase()
  ) || {
    id: `b-${brandSlug}`,
    name: brandSlug.toUpperCase(),
    slug: brandSlug,
    category: "MOBILE",
  };

  const brandModels = INITIAL_MODELS.filter(
    (m) =>
      (m.brandId === brand.id || m.brandSlug?.toLowerCase() === brandSlug.toLowerCase()) &&
      (m.category === "MOBILE" || !m.category)
  );

  const availableSeries = getSeriesForBrand(brand.slug);
  const activeSeries = availableSeries.find((s) => s.id === selectedSeriesId) || null;

  let filteredModels = filterModelsBySeries(brandModels, activeSeries);
  if (search.trim()) {
    filteredModels = filteredModels.filter((m) =>
      m.name.toLowerCase().includes(search.toLowerCase().trim())
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-brand-bg text-brand-black">
      <Header />
      <main className="flex-grow py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* BREADCRUMB */}
          <div className="flex items-center gap-2 text-xs font-semibold text-neutral-400 mb-6">
            <Link href="/" className="hover:text-brand-black">Home</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <Link href="/sell/mobile" className="hover:text-brand-black">Sell Mobile</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-brand-black font-bold">{brand.name}</span>
          </div>

          <div className="text-center max-w-xl mx-auto mb-8">
            <h1 className="text-2xl sm:text-4xl font-extrabold text-brand-black tracking-tight">
              Sell Your {brand.name} Phone
            </h1>
            <p className="text-xs sm:text-sm text-neutral-500 mt-2 font-normal leading-relaxed">
              Select your exact {brand.name} model to calculate an instant guaranteed price quote.
            </p>
          </div>

          {/* SEARCH MODEL INPUT */}
          <div className="max-w-md mx-auto mb-8 relative">
            <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={`Search ${brand.name} model (e.g. ${brand.slug === 'apple' ? 'iPhone 15' : 'S24 Ultra'})...`}
              className="w-full pl-11 pr-4 py-3 text-sm font-medium bg-white rounded-2xl border border-neutral-200/90 focus:outline-none focus:border-brand-yellow/80 focus:ring-2 focus:ring-brand-yellow/20 shadow-[0_2px_12px_-2px_rgba(0,0,0,0.03)] transition-all"
            />
          </div>

          {/* SELECT SERIES SECTION */}
          {availableSeries.length > 0 && (
            <div className="mb-8 bg-white p-5 rounded-2xl border border-neutral-200/80 shadow-[0_2px_12px_-2px_rgba(0,0,0,0.03)]">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-xs font-bold text-neutral-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-amber-600" />
                  <span>Filter by Series</span>
                </h2>
                {selectedSeriesId && (
                  <button
                    onClick={() => setSelectedSeriesId(null)}
                    className="text-xs font-semibold text-amber-700 hover:text-amber-800 underline"
                  >
                    Clear Filter
                  </button>
                )}
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() => setSelectedSeriesId(null)}
                  className={`px-3.5 py-1.5 text-xs font-bold rounded-xl transition-all border ${
                    selectedSeriesId === null
                      ? "bg-brand-yellow text-brand-black border-brand-yellow shadow-sm font-extrabold"
                      : "bg-[#FAFAF9] text-neutral-700 border-neutral-200/70 hover:border-brand-yellow/60 hover:bg-white"
                  }`}
                >
                  All Series
                </button>
                {availableSeries.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => setSelectedSeriesId(selectedSeriesId === s.id ? null : s.id)}
                    className={`px-3.5 py-1.5 text-xs font-bold rounded-xl transition-all border ${
                      selectedSeriesId === s.id
                        ? "bg-brand-yellow text-brand-black border-brand-yellow shadow-sm font-extrabold"
                        : "bg-[#FAFAF9] text-neutral-700 border-neutral-200/70 hover:border-brand-yellow/60 hover:bg-white"
                    }`}
                  >
                    {s.name}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* MODELS GRID */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3.5 sm:gap-4">
            {filteredModels.map((model) => (
              <Link
                key={model.id}
                href={`/sell/mobile/${brand.slug}/${model.slug}`}
                onClick={() => {
                  if (search.trim()) {
                    trackMetaStandardEvent("Search", {
                      search_string: search.trim(),
                      content_category: "mobile",
                      brand: brand.name,
                      content_name: model.name,
                    }, { eventId: `search_${brand.slug}_${search.trim().toLowerCase()}` });
                  }
                }}
                className="bg-white rounded-2xl p-4 border border-neutral-200/80 hover:border-brand-yellow/80 hover:shadow-[0_10px_25px_-5px_rgba(255,212,0,0.2)] transition-all duration-200 text-center group flex flex-col justify-between hover:-translate-y-0.5"
              >
                <div className="w-full aspect-square bg-[#FAFAF9] rounded-xl mb-3 flex items-center justify-center p-2.5 border border-neutral-100 group-hover:border-amber-200/50 relative overflow-hidden">
                  <DeviceCardImage
                    src={model.imageUrl}
                    alt={model.name}
                    category="MOBILE"
                    className="object-contain max-h-24 w-auto group-hover:scale-105 transition-transform"
                  />
                </div>

                <div>
                  <h3 className="text-xs sm:text-sm font-bold text-neutral-900 group-hover:text-black leading-snug line-clamp-2 min-h-[2.5rem] flex items-center justify-center text-center">
                    {model.name}
                  </h3>
                </div>
              </Link>
            ))}
          </div>

          {filteredModels.length === 0 && (
            <div className="bg-white rounded-2xl p-10 text-center border border-neutral-200 mt-6">
              <Smartphone className="w-8 h-8 text-neutral-300 mx-auto mb-2" />
              <p className="text-sm font-bold text-brand-black">No {brand.name} models matching &quot;{search}&quot;</p>
              <button
                onClick={() => setSearch("")}
                className="text-xs font-semibold text-amber-600 underline mt-2"
              >
                Clear search
              </button>
            </div>
          )}

          {/* AI VERIFICATION TRUST BAR */}
          <div className="pt-8">
            <AiVerificationBar deviceName={`${brand.name} phones`} />
          </div>

        </div>
      </main>
      <Footer />
    </div>
  );
}
