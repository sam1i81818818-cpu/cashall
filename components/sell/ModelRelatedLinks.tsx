"use client";

import React from "react";
import Link from "next/link";
import { INITIAL_MODELS, INITIAL_BRANDS, DeviceModelData, DeviceVariantData } from "@/lib/store";

interface ModelRelatedLinksProps {
  currentBrandSlug: string;
  brandName: string;
  currentModelSlug: string;
  modelName: string;
  variants: DeviceVariantData[];
  onSelectVariant?: (variantId: string) => void;
  selectedVariantId?: string;
}

export function ModelRelatedLinks({
  currentBrandSlug,
  brandName,
  currentModelSlug,
  modelName,
  variants,
  onSelectVariant,
  selectedVariantId,
}: ModelRelatedLinksProps) {
  // Find other models for the same brand
  const sameBrandModels = INITIAL_MODELS.filter(
    (m) =>
      (m.brandSlug?.toLowerCase() === currentBrandSlug.toLowerCase() ||
        m.brandId.toLowerCase().includes(currentBrandSlug.toLowerCase())) &&
      m.slug.toLowerCase() !== currentModelSlug.toLowerCase() &&
      (m.category === "MOBILE" || !m.category)
  ).slice(0, 10);

  return (
    <div className="space-y-8 bg-white rounded-3xl p-6 sm:p-10 border border-neutral-200/90 shadow-[0_2px_16px_-4px_rgba(0,0,0,0.04)]">
      
      {/* SAME BRAND RELATED MODELS */}
      <div>
        <h3 className="text-base sm:text-lg font-extrabold text-neutral-900 tracking-tight mb-1">
          More {brandName} models
        </h3>
        <p className="text-xs text-neutral-500 mb-3.5">
          Selling a different model? Browse other {brandName} devices you can sell on CashALL.
        </p>
        <div className="flex flex-wrap gap-2">
          <Link
            href="/sell-old-mobile-phone"
            className="px-3.5 py-1.5 text-xs font-semibold rounded-full bg-[#FAFAF9] text-neutral-700 border border-neutral-200/80 hover:border-brand-yellow hover:bg-white hover:text-black transition-all"
          >
            Sell Old Phone Online
          </Link>
          <Link
            href={`/sell-old-mobile-phone/${currentBrandSlug}`}
            className="px-3.5 py-1.5 text-xs font-semibold rounded-full bg-[#FAFAF9] text-neutral-700 border border-neutral-200/80 hover:border-brand-yellow hover:bg-white hover:text-black transition-all"
          >
            Sell Old {brandName} Phone Online
          </Link>
          {sameBrandModels.map((m) => (
            <Link
              key={m.id}
              href={`/sell-old-mobile-phone/${currentBrandSlug}/${m.slug}`}
              className="px-3.5 py-1.5 text-xs font-semibold rounded-full bg-[#FAFAF9] text-neutral-700 border border-neutral-200/80 hover:border-brand-yellow hover:bg-white hover:text-black transition-all"
            >
              {m.name}
            </Link>
          ))}
        </div>
      </div>

      {/* STORAGE VARIANT QUICK LINKS */}
      {variants.length > 0 && (
        <div className="pt-6 border-t border-neutral-100">
          <h3 className="text-base sm:text-lg font-extrabold text-neutral-900 tracking-tight mb-1">
            Sell your Old {modelName} on CashALL
          </h3>
          <p className="text-xs text-neutral-500 mb-3.5">
            Choose your variant to see its exact algorithmic buyback price:
          </p>
          <div className="flex flex-wrap gap-2">
            {variants.map((v) => {
              const isSelected = selectedVariantId === v.id;
              const label = v.ram && v.ram !== v.storage ? `${v.ram} / ${v.storage}` : v.storage;
              return (
                <button
                  key={v.id}
                  onClick={() => onSelectVariant && onSelectVariant(v.id)}
                  className={`px-3.5 py-1.5 text-xs font-semibold rounded-full transition-all border ${
                    isSelected
                      ? "bg-brand-yellow text-brand-black border-brand-yellow font-extrabold shadow-sm"
                      : "bg-[#FAFAF9] text-neutral-700 border-neutral-200/80 hover:border-brand-yellow hover:bg-white hover:text-black"
                  }`}
                >
                  {modelName} {label}
                </button>
              );
            })}
          </div>
        </div>
      )}

    </div>
  );
}
