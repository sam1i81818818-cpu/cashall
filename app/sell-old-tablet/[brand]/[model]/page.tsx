"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/Button";
import { INITIAL_BRANDS, INITIAL_MODELS, INITIAL_VARIANTS } from "@/lib/store";
import {
  ChevronRight,
  ArrowRight,
  Sparkles,
  Tablet,
  CheckCircle2,
  HardDrive,
  ShieldCheck,
  Zap,
  Truck,
} from "lucide-react";
import { trackMetaStandardEvent } from "@/lib/analytics/meta";
import { AiVerificationBar } from "@/components/common/AiVerificationBar";
import { ModelFaqSection } from "@/components/sell/ModelFaqSection";

export default function SellTabletVariantSelectionPage() {
  const params = useParams();
  const router = useRouter();

  const brandSlug = (params?.brand as string) || "apple";
  const modelSlug = (params?.model as string) || "ipad-air-1st-gen-wi-fi-only";

  const brand =
    INITIAL_BRANDS.find((b) => b.slug.toLowerCase() === brandSlug.toLowerCase() || b.slug.toLowerCase() === `${brandSlug.toLowerCase()}-tablet`) || {
      id: `b-${brandSlug}`,
      name: brandSlug
        .split("-")
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(" "),
      slug: brandSlug,
      category: "TABLET",
      sortOrder: 99,
      active: true,
    };

  const cleanModelSlug = modelSlug.toLowerCase();
  const strippedSlug = cleanModelSlug.replace(new RegExp(`^${brandSlug.toLowerCase()}-`), "");
  const model =
    INITIAL_MODELS.find(
      (m) =>
        (m.category === "TABLET" || m.id.startsWith("m-tablet-") || m.slug.includes("ipad") || m.slug.includes("tab")) &&
        (m.slug.toLowerCase() === cleanModelSlug ||
          m.slug.toLowerCase() === strippedSlug ||
          m.slug.toLowerCase() === `${brandSlug.toLowerCase()}-${strippedSlug}` ||
          m.slug.toLowerCase().replace(new RegExp(`^${brandSlug.toLowerCase()}-`), "") === strippedSlug ||
          m.id.toLowerCase() === cleanModelSlug ||
          m.name.toLowerCase().replace(/\s+/g, "-") === cleanModelSlug)
    ) ||
    INITIAL_MODELS.find(
      (m) =>
        m.slug.toLowerCase() === cleanModelSlug ||
        m.slug.toLowerCase() === strippedSlug ||
        m.slug.toLowerCase().replace(new RegExp(`^${brandSlug.toLowerCase()}-`), "") === strippedSlug
    ) || {
      id: `m-tablet-${brandSlug}-${strippedSlug}`,
      brandId: brand.id,
      brandSlug: brand.slug,
      name: modelSlug
        .split("-")
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(" "),
      slug: modelSlug,
      popular: true,
      active: true,
      category: "TABLET",
      imageUrl: null,
    };

  const variants = INITIAL_VARIANTS.filter((v) => {
    if (!model) return false;
    if (v.modelId === model.id) return true;
    const vId = v.modelId.toLowerCase();
    const mId = model.id.toLowerCase();
    const mSlug = model.slug.toLowerCase();
    if (vId === mId) return true;
    if (vId === `m-${mSlug}` || vId === `m-tablet-${mSlug}` || vId === `m-${brandSlug.toLowerCase()}-${mSlug}`) return true;
    if (vId.replace(/^m-(tablet-)?([a-z0-9]+-)?/, "") === mSlug.replace(/^([a-z0-9]+-)?/, "")) return true;
    return false;
  });

  const fallbackVariants =
    variants.length > 0
      ? variants
      : [
          {
            id: `v-${model.slug}-64`,
            modelId: model.id,
            storage: "64 GB",
            basePrice: 18000,
            active: true,
          },
          {
            id: `v-${model.slug}-128`,
            modelId: model.id,
            storage: "128 GB",
            basePrice: 22000,
            active: true,
          },
          {
            id: `v-${model.slug}-256`,
            modelId: model.id,
            storage: "256 GB",
            basePrice: 28000,
            active: true,
          },
        ];

  const [selectedVariantId, setSelectedVariantId] = useState<string>(fallbackVariants[0].id);

  useEffect(() => {
    if (fallbackVariants.length > 0) {
      if (!fallbackVariants.some((v) => v.id === selectedVariantId)) {
        setSelectedVariantId(fallbackVariants[0].id);
      }
    }
  }, [fallbackVariants, selectedVariantId]);

  const selectedVariant =
    fallbackVariants.find((v) => v.id === selectedVariantId) || fallbackVariants[0];

  const soldCount = React.useMemo(() => {
    let charHash = 0;
    for (let i = 0; i < model.name.length; i++) {
      charHash += model.name.charCodeAt(i);
    }
    return 1 + (charHash % 2);
  }, [model.name]);

  const maxPrice = Math.max(...fallbackVariants.map((v) => v.basePrice));
  const minPrice = Math.round(Math.min(...fallbackVariants.map((v) => v.basePrice)) * 0.65);

  const displayName = model.name.toLowerCase().startsWith(brand.name.toLowerCase())
    ? model.name
    : `${brand.name} ${model.name}`;

  useEffect(() => {
    if (model && brand) {
      trackMetaStandardEvent(
        "ViewContent",
        {
          content_type: "product",
          content_name: displayName,
          content_category: "tablet",
          brand: brand.name,
          model: model.name,
          value: selectedVariant?.basePrice || 0,
          currency: "INR",
        },
        { eventId: `view_tablet_${brand.slug}_${model.slug}` }
      );
    }
  }, [model?.id, brand?.id, displayName, selectedVariant?.basePrice, brand.name, model.name, brand.slug, model.slug]);

  const handleContinue = () => {
    if (typeof window !== "undefined") {
      localStorage.setItem(
        "cashall_current_variant",
        JSON.stringify({
          ...selectedVariant,
          modelName: model.name,
          brandName: brand.name,
        })
      );
    }
    router.push(`/sell-old-tablet/${brand.slug}/${model.slug}/assess?variantId=${selectedVariant.id}`);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAFAF9] text-brand-black selection:bg-brand-yellow/30">
      <Header />

      <main className="flex-grow py-8 sm:py-12">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          
          {/* BREADCRUMB */}
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs font-semibold text-neutral-400">
            <Link href="/" className="hover:text-brand-black transition-colors">Home</Link>
            <ChevronRight className="w-3.5 h-3.5 text-neutral-300" />
            <Link href="/sell-old-tablet" className="hover:text-brand-black transition-colors">Sell Old Tablet</Link>
            <ChevronRight className="w-3.5 h-3.5 text-neutral-300" />
            <Link href={`/sell-old-tablet/${brand.slug}`} className="hover:text-brand-black transition-colors">{brand.name}</Link>
            <ChevronRight className="w-3.5 h-3.5 text-neutral-300" />
            <span className="text-brand-black font-bold">{model.name}</span>
          </nav>

          {/* MAIN HERO CARD */}
          <div className="bg-white rounded-3xl p-6 sm:p-10 border border-neutral-200/90 shadow-sm relative overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
              
              {/* LEFT: IMAGE & BADGES */}
              <div className="md:col-span-5 flex flex-col items-center justify-center p-4 bg-neutral-50/80 rounded-2xl border border-neutral-100">
                <div className="relative w-full h-48 sm:h-56 flex items-center justify-center">
                  {model.imageUrl ? (
                    <Image
                      src={model.imageUrl}
                      alt={`Sell ${displayName} online`}
                      width={280}
                      height={200}
                      className="object-contain max-h-full drop-shadow-md"
                      priority
                    />
                  ) : (
                    <div className="w-24 h-24 rounded-2xl bg-white flex items-center justify-center text-amber-500 shadow-inner">
                      <Tablet className="w-12 h-12" />
                    </div>
                  )}
                </div>

                <div className="mt-4 flex flex-wrap items-center justify-center gap-2 text-[11px] font-bold text-neutral-600">
                  <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-800 px-2.5 py-1 rounded-full border border-emerald-200">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                    {soldCount} Sold Recently
                  </span>
                  <span className="inline-flex items-center gap-1 bg-blue-50 text-blue-800 px-2.5 py-1 rounded-full border border-blue-200">
                    <ShieldCheck className="w-3 h-3 text-blue-600" />
                    100% Data Safe
                  </span>
                </div>
              </div>

              {/* RIGHT: DETAILS & VARIANT SELECTOR */}
              <div className="md:col-span-7 space-y-6">
                <div>
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 border border-amber-200/60 text-amber-900 text-xs font-bold mb-2">
                    <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                    <span>Instant Price Guarantee • ₹0 Doorstep Pickup</span>
                  </div>
                  <h1 className="text-2xl sm:text-3xl font-black text-brand-black tracking-tight">
                    Sell {displayName}
                  </h1>
                  <p className="text-xs sm:text-sm text-neutral-500 mt-1 font-medium">
                    Select your storage variant to calculate your guaranteed instant resale quote.
                  </p>
                </div>

                {/* PRICE HIGHLIGHT */}
                <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-emerald-50/70 via-emerald-50/30 to-white border border-emerald-200/80 flex items-baseline justify-between">
                  <div>
                    <span className="text-xs font-bold text-emerald-900 uppercase tracking-wider block">
                      Maximum Resale Value
                    </span>
                    <span className="text-2xl sm:text-3xl font-black text-neutral-900 tracking-tight font-price">
                      ₹{selectedVariant.basePrice.toLocaleString("en-IN")}
                    </span>
                  </div>
                  <span className="text-xs font-extrabold text-emerald-700 bg-white px-3 py-1.5 rounded-xl border border-emerald-200 shadow-2xs">
                    Guaranteed Payout
                  </span>
                </div>

                {/* VARIANT TILES */}
                <div className="space-y-3">
                  <label className="text-xs font-extrabold text-neutral-700 uppercase tracking-wider block">
                    Choose Storage Variant:
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                    {fallbackVariants.map((v) => {
                      const isSelected = v.id === selectedVariantId;
                      return (
                        <button
                          key={v.id}
                          type="button"
                          onClick={() => setSelectedVariantId(v.id)}
                          className={`p-3 rounded-2xl border text-left transition-all ${
                            isSelected
                              ? "border-emerald-600 bg-emerald-50/40 ring-2 ring-emerald-600/20 shadow-xs"
                              : "border-neutral-200 hover:border-neutral-300 bg-white"
                          }`}
                        >
                          <div className="text-xs font-extrabold text-neutral-900 flex items-center gap-1.5">
                            <HardDrive className="w-3.5 h-3.5 text-neutral-400" />
                            <span>{v.storage}</span>
                          </div>
                          <div className="text-[11px] font-bold text-emerald-700 mt-1 font-price">
                            Up to ₹{v.basePrice.toLocaleString("en-IN")}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* ACTION BUTTON */}
                <div className="pt-2">
                  <Button
                    onClick={handleContinue}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-base shadow-lg shadow-emerald-600/25 transition-all active:scale-[0.99]"
                  >
                    <span>Check Exact Value &amp; Book Free Pickup</span>
                    <ArrowRight className="w-5 h-5" />
                  </Button>
                </div>

              </div>

            </div>
          </div>

          {/* VALUE ASSURANCE TILES */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white rounded-2xl p-4 border border-neutral-200/80 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                <Truck className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs font-bold text-neutral-900">Free Doorstep Pickup</div>
                <div className="text-[11px] text-neutral-500">Kolkata, Howrah, Patna &amp; Pan India</div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-4 border border-neutral-200/80 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs font-bold text-neutral-900">100% Data Sanitized</div>
                <div className="text-[11px] text-neutral-500">iCloud &amp; Google Account Reset</div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-4 border border-neutral-200/80 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
                <Zap className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs font-bold text-neutral-900">Instant UPI Transfer</div>
                <div className="text-[11px] text-neutral-500">Spot payment before device handover</div>
              </div>
            </div>
          </div>

          {/* AEO / GEO RESALE GUIDE */}
          <div className="bg-white rounded-3xl p-6 sm:p-10 border border-neutral-200/90 shadow-2xs space-y-4">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 border border-amber-200/60 text-amber-900 text-[11px] font-bold uppercase tracking-wider mb-2">
                Tablet Recommerce Index (2026 Updated)
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-brand-black tracking-tight">
                {displayName} resale value in India
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed font-normal">
              You can sell a used <strong className="text-neutral-900">{displayName}</strong> on CashALL for{" "}
              <strong className="text-neutral-900 font-extrabold font-price">
                up to ₹{maxPrice.toLocaleString("en-IN")}
              </strong>
              , with quotes starting at{" "}
              <strong className="text-neutral-900 font-extrabold font-price">
                ₹{minPrice.toLocaleString("en-IN")}
              </strong>{" "}
              depending on display glass condition, touch responsiveness, battery health, and body scratches. The quote you receive is locked at booking with ₹0 doorstep pickup and instant UPI bank payment before device handover.
            </p>
          </div>

          {/* AI VERIFICATION BAR */}
          <AiVerificationBar deviceName={displayName} />

          {/* MODEL-SPECIFIC FAQS */}
          <ModelFaqSection
            brandName={brand.name}
            modelName={model.name}
            minPrice={minPrice}
            maxPrice={maxPrice}
            category="TABLET"
          />

        </div>
      </main>

      <Footer />
    </div>
  );
}
