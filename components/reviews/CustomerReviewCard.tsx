"use client";

import React, { useState } from "react";
import { CustomerReview } from "@/lib/data/reviewsData";
import {
  Star,
  CheckCircle2,
  ThumbsUp,
  Smartphone,
  Laptop,
  Tablet,
} from "lucide-react";

interface CustomerReviewCardProps {
  review: CustomerReview;
}

export function CustomerReviewCard({ review }: CustomerReviewCardProps) {
  const [helpfulCount, setHelpfulCount] = useState(review.helpfulCount);
  const [hasVoted, setHasVoted] = useState(false);

  const handleHelpfulClick = () => {
    if (hasVoted) {
      setHelpfulCount((prev) => prev - 1);
      setHasVoted(false);
    } else {
      setHelpfulCount((prev) => prev + 1);
      setHasVoted(true);
    }
  };

  const getDeviceIcon = (category: CustomerReview["deviceCategory"]) => {
    if (category === "LAPTOP") return <Laptop className="w-3.5 h-3.5" />;
    if (category === "TABLET") return <Tablet className="w-3.5 h-3.5" />;
    return <Smartphone className="w-3.5 h-3.5" />;
  };

  return (
    <div className="bg-white rounded-2xl border border-neutral-200/80 p-5 sm:p-6 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.04)] hover:shadow-[0_12px_30px_-6px_rgba(255,212,0,0.18)] hover:border-brand-yellow/70 transition-all duration-200 flex flex-col justify-between space-y-4 overflow-hidden relative">
      <div className="space-y-3.5">
        {/* HEADER: USER INFO & VERIFIED BADGE */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-neutral-950 text-brand-yellow font-black flex items-center justify-center text-sm shadow-sm border border-neutral-800 shrink-0">
            {review.customerName.charAt(0)}
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="font-extrabold text-brand-black text-sm truncate">
                {review.customerName}
              </span>
              {review.verified && (
                <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 shrink-0">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                  <span>Verified Seller</span>
                </span>
              )}
            </div>
            <div className="text-[11px] text-brand-muted flex flex-wrap items-center gap-x-2 gap-y-0.5 mt-0.5">
              <span>{review.location}</span>
              {review.phone && (
                <>
                  <span>•</span>
                  <span className="font-mono text-neutral-700 font-bold">{review.phone}</span>
                </>
              )}
              <span>•</span>
              <span>{review.date}</span>
            </div>
          </div>
        </div>

        {/* STARS & RATING PILL ROW (NEAT & CONTAINED) */}
        <div className="flex items-center justify-between gap-2 bg-amber-50/70 border border-amber-200/80 rounded-xl px-3 py-1.5">
          <div className="flex items-center gap-1">
            <div className="flex items-center gap-0.5 shrink-0">
              {[1, 2, 3, 4, 5].map((starNum) => {
                if (review.rating >= starNum) {
                  return <Star key={starNum} className="w-3.5 h-3.5 text-amber-500 fill-amber-500 shrink-0" />;
                } else if (review.rating >= starNum - 0.5) {
                  return (
                    <span key={starNum} className="relative inline-block w-3.5 h-3.5 shrink-0">
                      <Star className="w-3.5 h-3.5 text-amber-200 fill-amber-100 shrink-0" />
                      <span className="absolute inset-0 overflow-hidden w-[50%]">
                        <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500 shrink-0" />
                      </span>
                    </span>
                  );
                } else {
                  return <Star key={starNum} className="w-3.5 h-3.5 text-neutral-300 fill-neutral-200 shrink-0" />;
                }
              })}
            </div>
            <span className="text-xs font-black text-amber-950 ml-1.5">{review.rating.toFixed(1)} Star</span>
          </div>
          <span className="text-[10px] font-bold text-neutral-600 bg-white/90 border border-amber-200/80 px-2 py-0.5 rounded-md shrink-0">
            Verified Sale
          </span>
        </div>

        {/* DEVICE SOLD, ORDER NUMBER & PAYOUT SPEED TAGS */}
        <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
          {review.orderNumber && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-neutral-900 text-brand-yellow text-xs font-mono font-bold shadow-sm">
              Order #{review.orderNumber}
            </span>
          )}

          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-brand-bg text-brand-black text-xs font-semibold border border-brand-border/70">
            {getDeviceIcon(review.deviceCategory)}
            <span>{review.deviceSold}</span>
          </span>

          <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-xl">
            ⚡ {review.payoutSpeed}
          </span>
        </div>

        {/* REVIEW TITLE & CONTENT */}
        <div className="space-y-1.5 pt-1">
          <h4 className="text-sm font-black text-brand-black leading-snug">
            {review.reviewTitle}
          </h4>
          <p className="text-xs text-brand-muted leading-relaxed">
            &ldquo;{review.reviewText}&rdquo;
          </p>
        </div>
      </div>

      {/* FOOTER: HELPFUL COUNT */}
      <div className="pt-3 border-t border-brand-border/60 flex items-center justify-between text-xs text-brand-muted">
        <span>Payout: <strong className="text-brand-black font-price">₹{review.payoutAmount.toLocaleString("en-IN")}</strong> ({review.payoutMethod})</span>
        <button
          onClick={handleHelpfulClick}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold transition-all ${
            hasVoted
              ? "bg-brand-yellow/30 text-brand-black border border-brand-yellow"
              : "hover:bg-neutral-100 text-brand-muted"
          }`}
        >
          <ThumbsUp className={`w-3.5 h-3.5 ${hasVoted ? "fill-brand-black text-brand-black" : ""}`} />
          <span>Helpful ({helpfulCount})</span>
        </button>
      </div>
    </div>
  );
}
