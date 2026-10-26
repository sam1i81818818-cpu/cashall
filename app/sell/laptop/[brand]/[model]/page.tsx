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
  Laptop,
  ArrowRight,
  CheckCircle2,
  Cpu,
  ShieldCheck,
  Zap,
  Truck,
  Sparkles,
  Phone,
  HardDrive,
} from "lucide-react";
import { trackMetaStandardEvent } from "@/lib/analytics/meta";
import { AiVerificationBar } from "@/components/common/AiVerificationBar";
import { ModelFaqSection } from "@/components/sell/ModelFaqSection";

export default function LaptopVariantSelectionPage() {
  const params = useParams();
  const router = useRouter();
  const brandSlug = (params?.brand as string) || "apple";
  const modelSlug = (params?.model as string) || "macbook-air-2025";

  const brand =
    INITIAL_BRANDS.find((b) => b.slug.toLowerCase() === brandSlug.toLowerCase()) || {
      id: `b-${brandSlug}`,
      name: brandSlug
        .split("-")
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(" "),
      slug: brandSlug,
      category: "LAPTOP",
      sortOrder: 99,
      active: true,
    };

  const cleanModelSlug = modelSlug.toLowerCase();
  const strippedSlug = cleanModelSlug.replace(new RegExp(`^${brandSlug.toLowerCase()}-`), "");
  const model =
    INITIAL_MODELS.find(
      (m) =>
        m.category === "LAPTOP" &&
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
      id: `m-laptop-${brandSlug}-${strippedSlug}`,
      brandId: brand.id,
      brandSlug: brand.slug,
      name: modelSlug
        .split("-")
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(" "),
      slug: modelSlug,
      popular: true,
      active: true,
      category: "LAPTOP",
      imageUrl: null,
    };

  const variants = INITIAL_VARIANTS.filter((v) => {
    if (!model) return false;
    if (v.modelId === model.id) return true;
    const vId = v.modelId.toLowerCase();
    const mId = model.id.toLowerCase();
    const mSlug = model.slug.toLowerCase();
    if (vId === mId) return true;
    if (vId === `m-${mSlug}` || vId === `m-laptop-${mSlug}` || vId === `m-${brandSlug.toLowerCase()}-${mSlug}`) return true;
    if (vId.replace(/^m-(laptop-)?([a-z0-9]+-)?/, "") === mSlug.replace(/^([a-z0-9]+-)?/, "")) return true;
    return false;
  });
  const fallbackVariants =
    variants.length > 0
      ? variants
      : [
          {
            id: `v-${model.slug}-std`,
            modelId: model.id,
            ram: "8 GB",
            storage: "256 GB SSD",
            basePrice: 32000,
            active: true,
          },
          {
            id: `v-${model.slug}-high`,
            modelId: model.id,
            ram: "16 GB",
            storage: "512 GB SSD",
            basePrice: 42000,
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
          content_category: "laptop",
          brand: brand.name,
          model: model.name,
          value: selectedVariant?.basePrice || 0,
          currency: "INR",
        },
        { eventId: `view_laptop_${brand.slug}_${model.slug}` }
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
    router.push(`/sell/laptop/${brand.slug}/${model.slug}/assess?variantId=${selectedVariant.id}`);
  };

  const isContactPrice = model?.contactForPrice === true;

  if (isContactPrice) {
    return (
      <div className="min-h-screen flex flex-col bg-[#FAFAF9] text-brand-black selection:bg-brand-yellow/30">
        <Header />
        <main className="flex-grow py-12">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
            <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs font-semibold text-neutral-400">
              <Link href="/" className="hover:text-brand-black">Home</Link>
              <ChevronRight className="w-3.5 h-3.5 text-neutral-300" />
              <Link href="/sell/laptop" className="hover:text-brand-black">Sell Laptop</Link>
              <ChevronRight className="w-3.5 h-3.5 text-neutral-300" />
              <Link href={`/sell/laptop/${brand.slug}`} className="hover:text-brand-black">{brand.name}</Link>
              <ChevronRight className="w-3.5 h-3.5 text-neutral-300" />
              <span className="text-brand-black font-bold">{model.name}</span>
            </nav>

            <div className="bg-white rounded-3xl p-8 sm:p-12 border border-neutral-200/90 shadow-[0_4px_30px_-4px_rgba(0,0,0,0.05)] text-center space-y-6">
              <div className="w-20 h-20 bg-amber-50 rounded-2xl flex items-center justify-center mx-auto border border-amber-200/60 text-amber-600">
                <Laptop className="w-10 h-10" />
              </div>
              <div className="inline-flex items-center gap-2 bg-amber-100 text-amber-900 text-xs font-bold px-3 py-1 rounded-full">
                <span>Personalized Laptop Appraisal</span>
              </div>
              <h1 className="text-3xl font-black text-brand-black">
                {displayName}
              </h1>
              <p className="text-xs sm:text-sm text-neutral-600 max-w-md mx-auto leading-relaxed">
                Due to processor, GPU, and RAM variations, this model receives a manual high-accuracy valuation to ensure you get the absolute maximum market payout.
              </p>

              <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
                <a
                  href="tel:+917604092333"
                  className="inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-brand-yellow text-brand-black font-extrabold rounded-2xl shadow-yellowGlow hover:opacity-90 transition-all text-xs uppercase tracking-wider"
                >
                  <Phone className="w-4 h-4" />
                  <span>Call Valuation Desk</span>
                </a>
                <a
                  href={`https://wa.me/917604092333?text=Hi%20CashALL,%20I%20want%20to%20sell%20my%20${encodeURIComponent(displayName)}%20laptop`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-emerald-600 text-white font-extrabold rounded-2xl hover:bg-emerald-700 transition-colors text-xs uppercase tracking-wider"
                >
                  <span>WhatsApp Quote</span>
                </a>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

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
            <Link href="/sell/laptop" className="hover:text-brand-black transition-colors">
              Sell Laptop
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-neutral-300" />
            <Link href={`/sell/laptop/${brand.slug}`} className="hover:text-brand-black transition-colors">
              {brand.name}
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-neutral-300" />
            <span className="text-brand-black font-bold truncate max-w-[200px] sm:max-w-none">
              {model.name}
            </span>
          </nav>

          {/* MAIN EVALUATION CARD - OPTION 1: THE STUDIO CLEAN */}
          <div className="bg-white rounded-3xl p-6 sm:p-10 border border-neutral-200/90 shadow-[0_4px_30px_-4px_rgba(0,0,0,0.05)] transition-all">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12 items-center">
              
              {/* LEFT COLUMN: FRAMELESS FLOATING LAPTOP SHOWCASE */}
              <div className="md:col-span-5 flex flex-col items-center text-center">
                <div className="relative w-64 h-52 sm:w-72 sm:h-56 flex items-center justify-center p-2 mb-2 group">
                  <div className="absolute inset-4 rounded-full bg-neutral-100/70 blur-xl -z-10 group-hover:bg-amber-100/30 transition-colors duration-500" />
                  
                  {model.imageUrl ? (
                    <Image
                      src={model.imageUrl}
                      alt={displayName}
                      width={240}
                      height={160}
                      unoptimized
                      onError={(e) => {
                        (e.target as HTMLElement).style.display = "none";
                      }}
                      className="object-contain max-h-44 drop-shadow-[0_20px_30px_rgba(0,0,0,0.12)] transition-transform duration-300 group-hover:scale-105"
                      priority
                    />
                  ) : (
                    <Laptop className="w-24 h-24 text-neutral-300" />
                  )}
                </div>

                <div className="space-y-1">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-neutral-100 text-neutral-600 text-[10px] font-bold uppercase tracking-wider mb-1">
                    <Image src="/photos/CashALL_favicon.png" alt="CashALL" width={12} height={12} className="w-3 h-3 rounded-full" />
                    <span>CashALL Price Lock Guarantee</span>
                  </div>
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
                
                {/* SOCIAL PROOF */}
                <div className="flex flex-wrap items-center justify-between gap-2 pb-1 border-b border-neutral-100">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/60 shadow-2xs">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span>8+ {brand.name} laptops sold in last 30 days</span>
                  </div>
                </div>

                <div>
                  <h2 className="text-base sm:text-lg font-extrabold text-brand-black tracking-tight">
                    Select your laptop specification
                  </h2>
                  <p className="text-xs text-neutral-500 mt-0.5">
                    Choose processor / RAM / storage configuration
                  </p>
                </div>

                {/* VARIANT GRID */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {fallbackVariants.map((variant) => {
                    const isSelected = selectedVariantId === variant.id;
                    const label =
                      variant.ram && variant.ram !== "Standard"
                        ? `${variant.ram} / ${variant.storage}`
                        : variant.storage || "Standard Configuration";

                    return (
                      <button
                        key={variant.id}
                        type="button"
                        onClick={() => setSelectedVariantId(variant.id)}
                        className={`p-3.5 sm:p-4 rounded-2xl border text-left transition-all duration-200 flex items-center justify-between ${
                          isSelected
                            ? "border-brand-yellow bg-amber-500/5 ring-2 ring-brand-yellow/30 shadow-xs"
                            : "border-neutral-200/80 bg-white hover:border-neutral-300 hover:bg-neutral-50/50"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                              isSelected
                                ? "bg-brand-yellow text-black font-bold"
                                : "bg-neutral-100 text-neutral-400"
                            }`}
                          >
                            <Cpu className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="text-sm font-black text-brand-black">
                              {label}
                            </div>
                            <div className="text-[11px] text-neutral-500">
                              Estimated: ₹{variant.basePrice.toLocaleString("en-IN")}
                            </div>
                          </div>
                        </div>

                        {isSelected ? (
                          <CheckCircle2 className="w-5 h-5 text-brand-black fill-brand-yellow shrink-0 ml-2" />
                        ) : (
                          <div className="w-4 h-4 rounded-full border border-neutral-300 shrink-0 ml-2" />
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* VALUATION ROW & CONTINUE CTA */}
                <div className="pt-4 border-t border-neutral-100 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
                  <div>
                    <div className="text-[11px] font-medium text-neutral-500 uppercase tracking-wider">
                      Selected Laptop Base Value
                    </div>
                    <div className="text-2xl sm:text-3xl font-black text-brand-black font-price">
                      ₹{selectedVariant.basePrice.toLocaleString("en-IN")}
                    </div>
                  </div>

                  <Button
                    onClick={handleContinue}
                    variant="primary"
                    size="lg"
                    className="font-black px-8 py-3.5 text-sm gap-2 shadow-yellowGlow rounded-2xl hover:scale-[1.02] active:scale-[0.98] transition-all"
                  >
                    <span>Continue to Condition Assessment</span>
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </div>

              </div>

            </div>
          </div>

          {/* THREE INLINE TRUST REASSURANCES */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-3.5 rounded-2xl bg-white border border-neutral-200/80 shadow-2xs flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-800 flex items-center justify-center shrink-0">
                <Zap className="w-4 h-4 text-amber-600" />
              </div>
              <span className="text-xs font-bold text-neutral-800">
                Instant UPI &amp; Bank Transfer
              </span>
            </div>

            <div className="p-3.5 rounded-2xl bg-white border border-neutral-200/80 shadow-2xs flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-blue-500/10 text-blue-800 flex items-center justify-center shrink-0">
                <Truck className="w-4 h-4 text-blue-600" />
              </div>
              <span className="text-xs font-bold text-neutral-800">
                100% Free Doorstep Pickup
              </span>
            </div>

            <div className="p-3.5 rounded-2xl bg-white border border-neutral-200/80 shadow-2xs flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-800 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
              </div>
              <span className="text-xs font-bold text-neutral-800">
                Certified NVMe/SSD Data Wipe &amp; Bill
              </span>
            </div>
          </div>

          {/* AEO / GEO PROGRAMMATIC RESALE GUIDE */}
          <div className="bg-white rounded-3xl p-6 sm:p-10 border border-neutral-200/90 shadow-[0_2px_16px_-4px_rgba(0,0,0,0.04)] space-y-4">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 border border-amber-200/60 text-amber-900 text-[11px] font-bold uppercase tracking-wider mb-2">
                Laptop Recommerce Index (2026 Updated)
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
              depending on processor generation, battery cycle count, and physical chassis condition. The quote you receive is locked at booking with ₹0 doorstep pickup, certified SSD data wiping, and immediate spot payment before handover.
            </p>
          </div>

          {/* CHECK IF CASHALL IS RIGHT FOR YOU? AI VERIFICATION BAR */}
          <AiVerificationBar deviceName={displayName} />

          {/* LAPTOP MODEL-SPECIFIC FAQS WITH FAQPAGE SCHEMA */}
          <ModelFaqSection
            brandName={brand.name}
            modelName={model.name}
            minPrice={minPrice}
            maxPrice={maxPrice}
            category="LAPTOP"
          />

        </div>
      </main>

      <Footer />
    </div>
  );
}
