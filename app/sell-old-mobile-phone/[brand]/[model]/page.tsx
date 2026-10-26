"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { INITIAL_BRANDS, INITIAL_MODELS, INITIAL_VARIANTS } from "@/lib/store";
import {
  ChevronRight,
  Smartphone,
  HelpCircle,
  ArrowRight,
  HardDrive,
  CheckCircle2,
  ShieldCheck,
  Zap,
  Truck,
  TrendingUp,
} from "lucide-react";
import { trackMetaStandardEvent } from "@/lib/analytics/meta";
import { ModelResaleGuide } from "@/components/sell/ModelResaleGuide";
import { ModelFaqSection } from "@/components/sell/ModelFaqSection";
import { AiVerificationBar } from "@/components/common/AiVerificationBar";

export default function SellMobileVariantSelectionPage() {
  const params = useParams();
  const router = useRouter();
  const brandSlug = (params?.brand as string) || "apple";
  const modelSlug = (params?.model as string) || "iphone-15";

  const [notSureOpen, setNotSureOpen] = useState(false);

  const brand =
    INITIAL_BRANDS.find((b) => b.slug.toLowerCase() === brandSlug.toLowerCase()) || {
      id: `b-${brandSlug}`,
      name: brandSlug
        .split("-")
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(" "),
      slug: brandSlug,
      category: "MOBILE",
      sortOrder: 99,
      active: true,
    };

  const cleanModelSlug = modelSlug.toLowerCase();
  const model =
    INITIAL_MODELS.find(
      (m) =>
        m.slug.toLowerCase() === cleanModelSlug ||
        m.slug.toLowerCase() === `${brandSlug.toLowerCase()}-${cleanModelSlug}` ||
        m.slug.toLowerCase().replace(`${brandSlug.toLowerCase()}-`, "") ===
          cleanModelSlug.replace(`${brandSlug.toLowerCase()}-`, "") ||
        m.slug.toLowerCase().replace("note-", "") === cleanModelSlug.replace("note-", "") ||
        m.name.toLowerCase().replace(/\s+/g, "-") === cleanModelSlug
    ) || {
      id: `m-${brandSlug}-${cleanModelSlug}`,
      brandId: brand.id,
      brandSlug: brand.slug,
      name: modelSlug
        .split("-")
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(" "),
      slug: modelSlug,
      imageUrl: `/api/v1/catalog/image/${modelSlug}`,
      popular: true,
      active: true,
      category: "MOBILE",
    };

  const seenVariantKeys = new Set<string>();
  const variants = INITIAL_VARIANTS.filter((v) => {
    let matches = false;
    if (v.modelId === model.id) matches = true;
    const vId = v.modelId.toLowerCase();
    const mId = model.id.toLowerCase();
    const mSlug = model.slug.toLowerCase();
    if (vId === mId) matches = true;
    if (vId === `m-${mSlug}` || vId === `m-${brandSlug.toLowerCase()}-${mSlug}`) matches = true;
    if (vId.replace(/^m-([a-z0-9]+-)?/, "") === mSlug.replace(/^([a-z0-9]+-)?/, "")) matches = true;
    if (!matches) return false;

    const key = `${v.ram || ""}-${v.storage}`;
    if (seenVariantKeys.has(key)) return false;
    seenVariantKeys.add(key);
    return true;
  });

  const fallbackVariants =
    variants.length > 0
      ? variants
      : [
          {
            id: `v-${model.slug}-128`,
            modelId: model.id,
            storage: "128 GB",
            basePrice: 8500,
            active: true,
          },
          {
            id: `v-${model.slug}-256`,
            modelId: model.id,
            storage: "256 GB",
            basePrice: 10500,
            active: true,
          },
        ];

  const [selectedVariantId, setSelectedVariantId] = useState<string>(fallbackVariants[0].id);
  const [liveSoldCount, setLiveSoldCount] = useState<number | null>(null);

  // Sync selected variant when model or variants change
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
    if (liveSoldCount !== null) return liveSoldCount;

    const BASELINE_COMPLETED: Record<string, number> = {
      "apple-iphone-16-pro-max": 12,
      "samsung-galaxy-s24-ultra-5g": 9,
      "apple-iphone-16": 15,
      "samsung-galaxy-s24-5g": 7,
      "iphone-15": 14,
      "apple-iphone-15": 14,
      "oneplus-12": 8,
    };

    const cleanSlug = model.slug.toLowerCase();
    const actualCompleted = BASELINE_COMPLETED[cleanSlug] ?? 0;

    let charHash = 0;
    for (let i = 0; i < model.name.length; i++) {
      charHash += model.name.charCodeAt(i);
    }
    const buffer = 2 + (charHash % 3);

    return Math.max(2, actualCompleted + buffer);
  }, [model.slug, model.name, liveSoldCount]);

  useEffect(() => {
    if (model.slug) {
      fetch(`/api/v1/orders/model-velocity?modelSlug=${encodeURIComponent(model.slug)}&modelName=${encodeURIComponent(model.name)}`)
        .then((r) => r.json())
        .then((data) => {
          if (data?.success && typeof data.soldVelocity === "number") {
            setLiveSoldCount(data.soldVelocity);
          }
        })
        .catch(() => {});
    }
  }, [model.slug, model.name]);

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
          content_category: "mobile",
          brand: brand.name,
          model: model.name,
          value: selectedVariant?.basePrice || 0,
          currency: "INR",
        },
        { eventId: `view_mobile_${brand.slug}_${model.slug}` }
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
    router.push(`/sell-old-mobile-phone/${brand.slug}/${model.slug}/assess?variantId=${selectedVariant.id}`);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAFAF9] text-brand-black selection:bg-brand-yellow/30">
      <Header />

      <main className="flex-grow py-8 sm:py-12">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">

          {/* BREADCRUMB */}
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs font-semibold text-neutral-400">
            <Link href="/" className="hover:text-brand-black transition-colors">
              Home
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-neutral-300" />
            <Link href="/sell-old-mobile-phone" className="hover:text-brand-black transition-colors">
              Sell Old Mobile Phone
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-neutral-300" />
            <Link href={`/sell-old-mobile-phone/${brand.slug}`} className="hover:text-brand-black transition-colors">
              {brand.name}
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-neutral-300" />
            <span className="text-brand-black font-bold truncate max-w-[200px] sm:max-w-none">
              {model.name}
            </span>
          </nav>

          {/* MAIN EVALUATION CARD */}
          <div className="bg-white rounded-3xl p-6 sm:p-10 border border-neutral-200/90 shadow-[0_4px_30px_-4px_rgba(0,0,0,0.05)] transition-all">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12 items-center">

              {/* LEFT COLUMN: DEVICE SHOWCASE */}
              <div className="md:col-span-5 flex flex-col items-center text-center">
                <div className="relative w-56 h-56 sm:w-64 sm:h-64 flex items-center justify-center p-2 mb-2 group">
                  <div className="absolute inset-4 rounded-full bg-neutral-100/70 blur-xl -z-10 group-hover:bg-amber-100/30 transition-colors duration-500" />
                  
                  {model.imageUrl ? (
                    <Image
                      src={model.imageUrl}
                      alt={displayName}
                      width={220}
                      height={220}
                      unoptimized
                      onError={(e) => {
                        const target = e.target as HTMLElement;
                        target.style.display = "none";
                        const fallback = document.getElementById("device-fallback-icon");
                        if (fallback) fallback.style.display = "flex";
                      }}
                      className="object-contain max-h-52 drop-shadow-[0_20px_30px_rgba(0,0,0,0.12)] transition-transform duration-300 group-hover:scale-105"
                      priority
                    />
                  ) : null}
                  <div
                    id="device-fallback-icon"
                    style={{ display: model.imageUrl ? "none" : "flex" }}
                    className="flex-col items-center justify-center text-neutral-300"
                  >
                    <Smartphone className="w-24 h-24 text-neutral-300" />
                    <span className="text-[11px] font-bold text-neutral-400 mt-2">{displayName}</span>
                  </div>
                </div>

                <div className="space-y-1">
                  <p className="text-[11px] font-bold text-amber-700 uppercase tracking-wider mb-1">
                    CashALL Price Lock Guarantee
                  </p>
                  <h1 className="text-2xl sm:text-3xl font-black text-brand-black tracking-tight">
                    {displayName}
                  </h1>
                  <p className="text-xs text-neutral-500 font-medium">
                    Base Valuation:{" "}
                    <span className="font-extrabold text-brand-black font-price text-sm sm:text-base">
                      ₹{selectedVariant.basePrice.toLocaleString("en-IN")}
                    </span>{" "}
                    {fallbackVariants.length > 1 && (
                      <span className="text-neutral-400 font-normal">
                        (up to ₹{maxPrice.toLocaleString("en-IN")})
                      </span>
                    )}
                  </p>
                </div>
              </div>

              {/* RIGHT COLUMN: VARIANT SELECTION & CALL TO ACTION */}
              <div className="md:col-span-7 space-y-6">

                {/* SOCIAL PROOF & STATUS */}
                <div className="flex flex-wrap items-center justify-between gap-2 pb-1 border-b border-neutral-100">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/60 shadow-2xs">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span>{soldCount}+ sold in last 30 days</span>
                  </div>

                  <button
                    onClick={() => setNotSureOpen(true)}
                    className="inline-flex items-center gap-1 text-xs font-medium text-neutral-500 hover:text-brand-black transition-colors"
                  >
                    <HelpCircle className="w-3.5 h-3.5 text-neutral-400" />
                    <span>Not sure about variant?</span>
                  </button>
                </div>

                {/* VARIANT SELECTOR */}
                <div>
                  <label className="text-xs font-bold text-neutral-400 uppercase tracking-wider block mb-3">
                    Select Device Variant (Storage / RAM)
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {fallbackVariants.map((v) => {
                      const isSelected = v.id === selectedVariantId;
                      return (
                        <button
                          key={v.id}
                          onClick={() => setSelectedVariantId(v.id)}
                          className={`flex flex-col items-center justify-center p-3.5 rounded-2xl border-2 transition-all relative text-center ${
                            isSelected
                              ? "border-brand-yellow bg-amber-50/20 shadow-sm"
                              : "border-neutral-200/80 bg-white hover:border-neutral-300 hover:bg-neutral-50/50"
                          }`}
                        >
                          {isSelected && (
                            <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-brand-yellow" />
                          )}
                          <div className="flex items-center gap-1 text-xs font-black text-brand-black mb-1">
                            <HardDrive className="w-3.5 h-3.5 text-neutral-400" />
                            <span>{v.ram && v.ram !== v.storage ? `${v.ram} / ${v.storage}` : v.storage}</span>
                          </div>
                          <span className="text-xs font-bold text-emerald-600 font-price">
                            Up to ₹{v.basePrice.toLocaleString("en-IN")}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* TRUST VALUE PILLS */}
                <div className="grid grid-cols-3 gap-2 py-2">
                  <div className="flex items-center gap-2 p-2 rounded-xl bg-neutral-50 border border-neutral-100 text-[11px] font-semibold text-neutral-700">
                    <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Data Wiped</span>
                  </div>
                  <div className="flex items-center gap-2 p-2 rounded-xl bg-neutral-50 border border-neutral-100 text-[11px] font-semibold text-neutral-700">
                    <Truck className="w-4 h-4 text-blue-600 shrink-0" />
                    <span>Free Pickup</span>
                  </div>
                  <div className="flex items-center gap-2 p-2 rounded-xl bg-neutral-50 border border-neutral-100 text-[11px] font-semibold text-neutral-700">
                    <Zap className="w-4 h-4 text-amber-600 shrink-0" />
                    <span>Instant UPI</span>
                  </div>
                </div>

                {/* CTA BUTTON */}
                <div className="pt-2">
                  <Button
                    onClick={handleContinue}
                    size="lg"
                    className="w-full h-14 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-black text-base shadow-lg shadow-emerald-600/20 hover:shadow-emerald-600/30 flex items-center justify-center gap-2 group transition-all"
                  >
                    <span>
                      Get Exact Value for {selectedVariant.ram && selectedVariant.ram !== selectedVariant.storage ? `${selectedVariant.ram} / ${selectedVariant.storage}` : selectedVariant.storage}
                    </span>
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                  <p className="text-[11px] text-center text-neutral-400 mt-2">
                    Takes only 60 seconds • Locked price guarantee • ₹0 Doorstep fee
                  </p>
                </div>

              </div>
            </div>
          </div>

          {/* STEP BY STEP GUIDELINE */}
          <ModelResaleGuide
            brandName={brand.name}
            modelName={displayName}
            minPrice={minPrice}
            maxPrice={maxPrice}
          />

          {/* FAQS SECTION */}
          <ModelFaqSection
            brandName={brand.name}
            modelName={displayName}
            minPrice={minPrice}
            maxPrice={maxPrice}
          />

          {/* AI VERIFICATION TRUST BAR */}
          <div className="pt-4">
            <AiVerificationBar deviceName={displayName} />
          </div>

        </div>
      </main>

      <Footer />

      {/* NOT SURE ABOUT VARIANT MODAL */}
      <Modal
        isOpen={notSureOpen}
        onClose={() => setNotSureOpen(false)}
        title="How to find your phone variant?"
      >
        <div className="space-y-4 text-sm text-neutral-600 py-2">
          <p>
            You can verify your exact model name and internal storage in your phone settings:
          </p>
          <div className="p-4 rounded-xl bg-neutral-50 border border-neutral-200 space-y-2">
            <p className="font-bold text-neutral-800">For Apple iPhone:</p>
            <p className="text-xs text-neutral-600">
              Open <strong>Settings</strong> &gt; <strong>General</strong> &gt; <strong>About</strong>. Check &quot;Model Name&quot; and &quot;Capacity&quot;.
            </p>
          </div>
          <div className="p-4 rounded-xl bg-neutral-50 border border-neutral-200 space-y-2">
            <p className="font-bold text-neutral-800">For Android (Samsung, OnePlus, etc.):</p>
            <p className="text-xs text-neutral-600">
              Open <strong>Settings</strong> &gt; <strong>About Phone</strong> or <strong>System Info</strong>. Check &quot;Device name&quot; and &quot;Storage&quot;.
            </p>
          </div>
          <Button
            onClick={() => setNotSureOpen(false)}
            className="w-full bg-brand-yellow text-brand-black font-bold mt-4"
          >
            Got it
          </Button>
        </div>
      </Modal>
    </div>
  );
}
