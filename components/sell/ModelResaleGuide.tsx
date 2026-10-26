"use client";

import React from "react";
import { ShieldCheck, Zap, Truck, CheckCircle2 } from "lucide-react";

interface ModelResaleGuideProps {
  brandName: string;
  modelName: string;
  minPrice: number;
  maxPrice: number;
}

export function ModelResaleGuide({
  brandName,
  modelName,
  minPrice,
  maxPrice,
}: ModelResaleGuideProps) {
  const displayName = modelName.toLowerCase().startsWith(brandName.toLowerCase())
    ? modelName
    : `${brandName} ${modelName}`;

  return (
    <section className="bg-white rounded-3xl p-6 sm:p-10 border border-neutral-200/90 shadow-[0_2px_16px_-4px_rgba(0,0,0,0.04)] space-y-6">
      <div>
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
        depending on the storage variant, cosmetic condition, and functional health. The quote you receive is locked when you book your slot, backed by free doorstep pickup, ISO-grade data wipe, and instant bank or UPI payout before handover.
      </p>

      {/* THREE VALUE PROMISES */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
        <div className="p-4 rounded-2xl bg-[#FAFAF9] border border-neutral-200/80 flex items-start gap-3">
          <div className="w-8 h-8 rounded-xl bg-amber-100/70 text-amber-800 flex items-center justify-center shrink-0">
            <Zap className="w-4 h-4 text-amber-600" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-neutral-900">Zero Deduction Lock</h4>
            <p className="text-[11px] text-neutral-500 mt-0.5">
              Price stays locked during doorstep verification if device matches answered condition.
            </p>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-[#FAFAF9] border border-neutral-200/80 flex items-start gap-3">
          <div className="w-8 h-8 rounded-xl bg-emerald-100/70 text-emerald-800 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-neutral-900">100% Certified Data Wipe</h4>
            <p className="text-[11px] text-neutral-500 mt-0.5">
              Complete on-site data erasure with official digital Bill of Sale for complete security.
            </p>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-[#FAFAF9] border border-neutral-200/80 flex items-start gap-3">
          <div className="w-8 h-8 rounded-xl bg-blue-100/70 text-blue-800 flex items-center justify-center shrink-0">
            <Truck className="w-4 h-4 text-blue-600" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-neutral-900">Free Doorstep Pickup</h4>
            <p className="text-[11px] text-neutral-500 mt-0.5">
              Trained valuation agent visits your home or office with same-day time slot availability.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
