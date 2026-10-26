"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { DeviceCardImage } from "@/components/common/DeviceCardImage";
import { INITIAL_BRANDS, INITIAL_MODELS } from "@/lib/store";
import { Search, ChevronRight, Tablet, Layers, ArrowLeft } from "lucide-react";
import { trackMetaStandardEvent } from "@/lib/analytics/meta";
import { AiVerificationBar } from "@/components/common/AiVerificationBar";

export default function SellTabletBrandModelsPage() {
  const params = useParams();
  const brandSlug = (params?.brand as string) || "apple";
  const [search, setSearch] = useState("");

  const brand = INITIAL_BRANDS.find(
    (b) => b.slug.toLowerCase() === brandSlug.toLowerCase() || b.slug.toLowerCase() === `${brandSlug.toLowerCase()}-tablet`
  ) || {
    id: `b-${brandSlug}`,
    name: brandSlug
      .split("-")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" "),
    slug: brandSlug,
    category: "TABLET",
  };

  const brandModels = INITIAL_MODELS.filter(
    (m) =>
      (m.brandId === brand.id || m.brandSlug?.toLowerCase() === brandSlug.toLowerCase()) &&
      (m.category === "TABLET" || m.id.startsWith("m-tablet-") || m.slug.includes("ipad") || m.slug.includes("tab"))
  );

  let filteredModels = brandModels;
  if (search.trim()) {
    filteredModels = filteredModels.filter((m) =>
      m.name.toLowerCase().includes(search.toLowerCase().trim())
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-brand-bg text-brand-black">
      <Header />
      <main className="flex-grow py-8 sm:py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* BREADCRUMB */}
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs font-semibold text-neutral-400 mb-6">
            <Link href="/" className="hover:text-brand-black transition-colors">
              Home
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-neutral-300" />
            <Link href="/sell-old-tablet" className="hover:text-brand-black transition-colors">
              Sell Old Tablet
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-neutral-300" />
            <span className="text-brand-black font-bold">{brand.name}</span>
          </nav>

          {/* PAGE HEADER */}
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4 pb-6 border-b border-neutral-200">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold mb-2">
                <Tablet className="w-3.5 h-3.5 text-emerald-600" />
                <span>Certified {brand.name} Buyback</span>
              </div>
              <h1 className="text-2xl sm:text-4xl font-black text-brand-black tracking-tight">
                Sell Old {brand.name} Tablets &amp; iPads
              </h1>
              <p className="text-xs sm:text-sm text-neutral-500 mt-1 font-medium">
                Select your {brand.name} tablet model below to calculate instant locked resale price.
              </p>
            </div>

            <Link
              href="/sell-old-tablet/brands"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-neutral-600 hover:text-neutral-900 bg-white px-3.5 py-2 rounded-xl border border-neutral-200 shadow-2xs self-start md:self-auto"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Change Brand</span>
            </Link>
          </div>

          {/* SEARCH INPUT */}
          <div className="max-w-md mx-auto mb-8 relative">
            <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={`Search ${brand.name} tablet model...`}
              className="w-full pl-11 pr-4 py-3 text-sm font-medium bg-white rounded-2xl border border-neutral-200 focus:outline-none focus:border-brand-yellow focus:ring-4 focus:ring-brand-yellow/20 shadow-xs transition-all"
            />
          </div>

          {/* MODELS GRID */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-4 sm:gap-6">
            {filteredModels.map((model) => (
              <Link
                key={model.id}
                href={`/sell-old-tablet/${brandSlug}/${model.slug}`}
                onClick={() => {
                  trackMetaStandardEvent("ViewContent", {
                    content_name: model.name,
                    content_category: "Sell Tablet",
                    content_ids: [model.id],
                    content_type: "product",
                  });
                }}
                className="bg-white rounded-2xl p-4 sm:p-5 border border-neutral-200/80 hover:border-emerald-500 hover:shadow-lg transition-all duration-200 flex flex-col items-center justify-between text-center group hover:-translate-y-0.5"
              >
                <div className="relative w-full h-32 sm:h-36 my-2 flex items-center justify-center">
                  <DeviceCardImage
                    src={model.imageUrl}
                    alt={model.name}
                    category="TABLET"
                    className="max-h-full object-contain group-hover:scale-105 transition-transform duration-200"
                  />
                </div>

                <div className="w-full pt-3 border-t border-neutral-100 space-y-1.5">
                  <h3 className="text-xs sm:text-sm font-bold text-neutral-900 group-hover:text-emerald-700 transition-colors line-clamp-2">
                    {model.name}
                  </h3>
                  <div className="w-full py-1.5 rounded-lg bg-neutral-50 group-hover:bg-emerald-50 text-[11px] font-bold text-neutral-700 group-hover:text-emerald-800 transition-colors flex items-center justify-center gap-1">
                    <span>Calculate Value</span>
                    <ChevronRight className="w-3 h-3" />
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {filteredModels.length === 0 && (
            <div className="text-center py-16 bg-white rounded-3xl border border-neutral-200 max-w-md mx-auto">
              <Tablet className="w-12 h-12 text-neutral-300 mx-auto mb-3" />
              <p className="text-base font-bold text-neutral-800">No {brand.name} tablet models found</p>
              <p className="text-xs text-neutral-500 mt-1 max-w-xs mx-auto">
                Try clearing your search query or contact our valuation desk for custom appraisal.
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
