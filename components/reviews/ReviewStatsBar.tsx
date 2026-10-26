"use client";

import React from "react";
import { REVIEW_STATS } from "@/lib/data/reviewsData";
import { Star, CheckCircle2 } from "lucide-react";

export function ReviewStatsBar() {
  const { averageRating, satisfactionRate, ratingBreakdown, totalOrders = 33, uniqueSellers = 26 } = REVIEW_STATS;

  const trustHighlights = [
    {
      title: "Instant UPI Payout",
      subtitle: "Credited in under 5 mins before handover",
    },
    {
      title: "Certified Data Wipe",
      subtitle: "100% cryptographic factory reset on-site",
    },
    {
      title: "100% Price Match",
      subtitle: "Zero hidden fees or surprise deductions",
    },
    {
      title: `${satisfactionRate}% Seller Love`,
      subtitle: `${REVIEW_STATS.totalReviews} verified customer reviews`,
    },
  ];

  return (
    <div className="bg-white rounded-3xl border border-brand-border p-6 sm:p-8 shadow-subtleCard">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* LEFT: BIG RATING NUMBER & STARS */}
        <div className="lg:col-span-4 text-center lg:text-left space-y-3">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Google & Platform Verified
          </p>

          <div className="flex items-baseline justify-center lg:justify-start gap-3">
            <span className="text-5xl sm:text-6xl font-black text-brand-black tracking-tight font-price">
              {averageRating.toFixed(1)}
            </span>
            <div className="space-y-1">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-amber-400 fill-amber-400" />
                ))}
              </div>
              <div className="text-xs text-brand-muted font-medium">
                out of 5.0 stars
              </div>
            </div>
          </div>

          <p className="text-sm text-brand-muted font-medium leading-relaxed">
            Based on <span className="font-extrabold text-brand-black">{totalOrders} verified device sales</span> across West Bengal & India.
          </p>
        </div>

        {/* MIDDLE: STAR BREAKDOWN PROGRESS BARS */}
        <div className="lg:col-span-4 space-y-2 border-y lg:border-y-0 lg:border-x border-brand-border py-4 lg:py-0 lg:px-6">
          {[5, 4, 3, 2, 1].map((star) => {
            const pct = ratingBreakdown[star as keyof typeof ratingBreakdown];
            return (
              <div key={star} className="flex items-center gap-2 text-xs">
                <span className="w-12 font-bold text-brand-black flex items-center gap-1">
                  {star} <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                </span>
                <div className="flex-1 h-2 rounded-full bg-neutral-100 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-amber-400 transition-all duration-500"
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <span className="w-10 text-right text-brand-muted font-medium font-price">
                  {pct}%
                </span>
              </div>
            );
          })}
        </div>

        {/* RIGHT: CLEAN VERIFIED SELLER GUARANTEES WITH TICK MARKS */}
        <div className="lg:col-span-4 space-y-3.5 pl-0 lg:pl-4">
          {trustHighlights.map((item) => (
            <div key={item.title} className="flex items-start gap-3">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-bold text-slate-900 leading-tight">
                  {item.title}
                </p>
                <p className="text-[11px] text-slate-500 font-medium mt-0.5">
                  {item.subtitle}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
