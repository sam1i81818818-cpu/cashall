"use client";

import React from "react";
import { ChevronLeft } from "lucide-react";

interface AssessmentHeaderProps {
  currentStep: number;
  totalSteps: number;
  stepTitle: string;
  stepSubtitle?: string;
  onBack?: () => void;
  canGoBack?: boolean;
}

export function AssessmentHeader({
  currentStep,
  totalSteps,
  stepTitle,
  stepSubtitle,
  onBack,
  canGoBack = true,
}: AssessmentHeaderProps) {
  const percentage = Math.round((currentStep / totalSteps) * 100);

  return (
    <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/80 shadow-xs mb-6 space-y-3">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          {canGoBack && onBack && currentStep > 1 && (
            <button
              type="button"
              onClick={onBack}
              className="p-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 transition active:scale-95"
              title="Previous Step"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
          )}
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-emerald-700 bg-emerald-50 border border-emerald-200/60 px-2.5 py-0.5 rounded-md">
                Step {currentStep} of {totalSteps}
              </span>
              <span className="text-[11px] font-semibold text-slate-500">
                {percentage}% Completed
              </span>
            </div>
            <h1 className="font-heading text-lg sm:text-xl font-extrabold text-slate-900 tracking-tight mt-1">
              {stepTitle}
            </h1>
          </div>
        </div>

        <div className="text-right shrink-0">
          <div className="w-24 sm:w-36 bg-slate-100 rounded-full h-2 overflow-hidden border border-slate-200/50">
            <div
              className="bg-emerald-600 h-full rounded-full transition-all duration-300"
              style={{ width: `${percentage}%` }}
            />
          </div>
        </div>
      </div>

      {stepSubtitle && (
        <p className="text-xs text-slate-600 border-t border-slate-100 pt-2.5 leading-relaxed">
          {stepSubtitle}
        </p>
      )}
    </div>
  );
}
