"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { INITIAL_BRANDS, BrandData } from "@/lib/store";
import { ArrowRight } from "lucide-react";
import { BrandIcon } from "@/components/common/BrandIcon";

export function PopularBrands() {
  const [brands, setBrands] = useState<BrandData[]>([]);

  useEffect(() => {
    async function loadBrands() {
      try {
        const res = await fetch("/api/v1/catalog");
        const json = await res.json();
        if (json.success && Array.isArray(json.data?.brands) && json.data.brands.length > 0) {
          const apiBrands = json.data.brands;
          setBrands(() => {
            const mergedMap = new Map<string, BrandData>();
            INITIAL_BRANDS.forEach((b) => mergedMap.set(b.slug || b.name.toLowerCase(), b));
            apiBrands.forEach((b: BrandData) => mergedMap.set(b.slug || b.name.toLowerCase(), b));
            return Array.from(mergedMap.values());
          });
        } else {
          setBrands(INITIAL_BRANDS);
        }
      } catch (err) {
        setBrands(INITIAL_BRANDS);
      }
    }
    loadBrands();
  }, []);

  const displayBrands = brands.length > 0 ? brands : INITIAL_BRANDS;
  const mobileBrands = displayBrands
    .filter((b) => b.category === "MOBILE" || b.category === "BOTH")
    .slice(0, 6);

  return (
    <section className="py-14 sm:py-16 bg-[#F8FAFC] border-t border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <h2 className="font-heading text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Popular Phone Brands
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1 font-normal leading-relaxed">
              Select your smartphone manufacturer to view available models and live quotes.
            </p>
          </div>

          <Link
            href="/sell-old-mobile-phone/brands"
            className="inline-flex items-center gap-1.5 text-xs font-extrabold text-slate-900 hover:text-emerald-700 group transition-colors cursor-pointer"
          >
            <span>View All Brands</span>
            <ArrowRight className="w-3.5 h-3.5 text-slate-900 group-hover:text-emerald-700 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3.5 sm:gap-4">
          {mobileBrands.map((brand) => (
            <Link
              key={brand.id}
              href={`/sell-old-mobile-phone/${brand.slug}`}
              className="bg-white rounded-2xl p-5 border border-slate-200/80 hover:border-slate-300 shadow-2xs hover:shadow-subtleCard hover:-translate-y-0.5 transition-all duration-200 text-center group flex flex-col items-center justify-center space-y-2.5 cursor-pointer"
            >
              <div className="transition-transform group-hover:scale-105">
                <BrandIcon name={brand.name} logoUrl={brand.logoUrl} />
              </div>
              <div>
                <h3 className="font-heading text-sm font-extrabold text-slate-900 group-hover:text-black">
                  {brand.name}
                </h3>
                <p className="text-[10px] text-slate-400 font-medium mt-0.5">
                  Sell {brand.name}
                </p>
              </div>
            </Link>
          ))}
        </div>

      </div>
    </section>
  );
}
