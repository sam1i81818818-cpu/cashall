"use client";

import React from "react";
import Image from "next/image";
import { ShieldCheck, Truck, Zap, CheckCircle2, ArrowRight, Sparkles } from "lucide-react";

interface AssessmentSidebarProps {
  deviceName: string;
  deviceImageUrl?: string | null;
  storageOrSpecs?: string;
  basePrice: number;
  estimatedPrice?: number;
  onNext: () => void;
  nextButtonText?: string;
  isNextDisabled?: boolean;
  onBack?: () => void;
  currentStep: number;
  totalSteps: number;
  deductionBreakdown?: { label: string; amount: number }[];
  showLivePrice?: boolean;
}

export function AssessmentSidebar({
  deviceName,
  deviceImageUrl,
  storageOrSpecs,
  basePrice,
  estimatedPrice,
  onNext,
  nextButtonText = "Continue",
  isNextDisabled = false,
  onBack,
  currentStep,
  totalSteps,
  deductionBreakdown = [],
  showLivePrice = false,
}: AssessmentSidebarProps) {
  const isFinalStep = currentStep === totalSteps;

  return (
    <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/80 shadow-subtleCard sticky top-24 space-y-6">
      {/* DEVICE SUMMARY */}
      <div className="flex items-center gap-4 pb-4 border-b border-slate-100">
        <div className="relative w-16 h-16 sm:w-20 sm:h-20 shrink-0 bg-slate-50 rounded-2xl p-2 border border-slate-100 flex items-center justify-center">
          {deviceImageUrl ? (
            <Image
              src={deviceImageUrl}
              alt={deviceName}
              fill
              sizes="80px"
              className="object-contain p-1"
              unoptimized
            />
          ) : (
            <div className="w-full h-full bg-slate-200 rounded-lg" />
          )}
        </div>
        <div className="min-w-0 flex-1">
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-emerald-800 bg-emerald-50 border border-emerald-200/60 px-2 py-0.5 rounded-md">
            CashALL Valuation
          </span>
          <h2 className="font-heading text-sm sm:text-base font-extrabold text-slate-900 truncate mt-1">
            {deviceName}
          </h2>
          {storageOrSpecs && (
            <p className="text-xs text-slate-500 font-medium">{storageOrSpecs}</p>
          )}
        </div>
      </div>

      {/* VALUATION STATUS CARD */}
      {showLivePrice && estimatedPrice !== undefined ? (
        <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl p-4 border border-emerald-200/60">
          <span className="text-[10px] font-extrabold text-slate-500 uppercase tracking-widest block">
            Estimated Selling Price
          </span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight font-price tabular-nums">
              ₹{estimatedPrice.toLocaleString("en-IN")}
            </span>
            {basePrice > estimatedPrice && (
              <span className="text-xs text-slate-400 line-through font-semibold tabular-nums">
                ₹{basePrice.toLocaleString("en-IN")}
              </span>
            )}
          </div>
          <p className="text-[11px] text-emerald-800 font-medium mt-1.5 flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span>Guaranteed offer upon doorstep inspection</span>
          </p>
        </div>
      ) : (
        <div className="bg-slate-900 text-white rounded-2xl p-4 sm:p-5 border border-slate-800 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">
              Valuation Range
            </span>
            <span className="text-[10px] font-extrabold text-amber-400 bg-amber-400/10 border border-amber-400/30 px-2.5 py-0.5 rounded-full">
              Step {currentStep} of {totalSteps}
            </span>
          </div>

          <div>
            <div className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight font-price tabular-nums">
              Up to <span className="text-amber-400">₹{basePrice.toLocaleString("en-IN")}</span>
            </div>
            <p className="text-[11px] text-slate-300 font-medium mt-1 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span>Exact final offer locked after evaluation</span>
            </p>
          </div>

          {/* EVALUATION PROGRESS BAR */}
          <div className="pt-2 border-t border-slate-800 space-y-1.5">
            <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-emerald-500 h-full rounded-full transition-all duration-300"
                style={{ width: `${Math.min(100, Math.round((currentStep / totalSteps) * 100))}%` }}
              />
            </div>
            <div className="flex justify-between items-center text-[10px] text-slate-400 font-semibold">
              <span>Diagnostic Progress</span>
              <span className="text-emerald-400">{Math.round((currentStep / totalSteps) * 100)}%</span>
            </div>
          </div>
        </div>
      )}

      {/* DEDUCTIONS / ADJUSTMENTS LIST */}
      {showLivePrice && deductionBreakdown.length > 0 && (
        <div className="space-y-2 text-xs">
          <span className="font-extrabold text-slate-600 block text-[10px] uppercase tracking-widest">
            Price Adjustments
          </span>
          <div className="max-h-36 overflow-y-auto space-y-1.5 pr-1">
            {deductionBreakdown.map((item, idx) => (
              <div key={idx} className="flex justify-between items-center text-slate-600">
                <span className="truncate pr-2">{item.label}</span>
                <span className="font-extrabold text-red-600 shrink-0 tabular-nums">
                  -₹{item.amount.toLocaleString("en-IN")}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ACTION CTA */}
      <div className="space-y-2 pt-2">
        <button
          type="button"
          onClick={onNext}
          disabled={isNextDisabled}
          className={`w-full py-3.5 px-6 rounded-2xl font-extrabold text-sm transition-all duration-200 flex items-center justify-center gap-2 shadow-xs cursor-pointer ${
            isNextDisabled
              ? "bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200"
              : "bg-slate-950 text-white hover:bg-slate-900 active:scale-[0.99] border border-slate-900"
          }`}
        >
          <span>{nextButtonText}</span>
          <ArrowRight className="w-4 h-4 text-emerald-400" />
        </button>

        {currentStep > 1 && onBack && (
          <button
            type="button"
            onClick={onBack}
            className="w-full py-2 px-4 text-xs font-semibold text-slate-500 hover:text-slate-900 text-center transition cursor-pointer"
          >
            ← Previous Step
          </button>
        )}
      </div>

      {/* TRUST BADGES */}
      <div className="pt-3 border-t border-slate-100 grid grid-cols-3 gap-2 text-center text-[10px] text-slate-500">
        <div className="flex flex-col items-center">
          <Zap className="w-4 h-4 text-amber-500 mb-1" />
          <span className="font-bold text-slate-700">Instant Pay</span>
        </div>
        <div className="flex flex-col items-center">
          <Truck className="w-4 h-4 text-emerald-600 mb-1" />
          <span className="font-bold text-slate-700">Free Pickup</span>
        </div>
        <div className="flex flex-col items-center">
          <ShieldCheck className="w-4 h-4 text-blue-600 mb-1" />
          <span className="font-bold text-slate-700">100% Safe</span>
        </div>
      </div>
    </div>
  );
}
