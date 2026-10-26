"use client";

import React, { useRef } from "react";
import { VideoReview, VIDEO_REVIEWS } from "@/lib/data/reviewsData";
import {
  Play,
  Star,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Smartphone,
  Laptop,
  Tablet,
} from "lucide-react";

interface CustomerVideoCarouselProps {
  onSelectVideo: (review: VideoReview) => void;
}

export function CustomerVideoCarousel({ onSelectVideo }: CustomerVideoCarouselProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const offset = direction === "left" ? -300 : 300;
      scrollContainerRef.current.scrollBy({ left: offset, behavior: "smooth" });
    }
  };

  const getDeviceIcon = (category: VideoReview["deviceCategory"]) => {
    if (category === "LAPTOP") return <Laptop className="w-3.5 h-3.5" />;
    if (category === "TABLET") return <Tablet className="w-3.5 h-3.5" />;
    return <Smartphone className="w-3.5 h-3.5" />;
  };

  return (
    <div className="relative space-y-4">
      {/* SECTION SUBHEADER WITH SCROLL CONTROLS */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl sm:text-2xl font-black text-brand-black">
            Watch Them Sell & Get Paid Live
          </h3>
        </div>

        <div className="hidden sm:flex items-center gap-2">
          <button
            onClick={() => scroll("left")}
            className="w-10 h-10 rounded-full border border-brand-border bg-white hover:bg-neutral-50 shadow-subtleCard flex items-center justify-center text-brand-black transition-all"
            aria-label="Scroll left"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={() => scroll("right")}
            className="w-10 h-10 rounded-full border border-brand-border bg-white hover:bg-neutral-50 shadow-subtleCard flex items-center justify-center text-brand-black transition-all"
            aria-label="Scroll right"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* HORIZONTAL CAROUSEL OF VIDEO CARDS */}
      <div
        ref={scrollContainerRef}
        className="flex gap-4 sm:gap-6 overflow-x-auto pb-4 pt-1 px-1 no-scrollbar scroll-smooth snap-x snap-mandatory"
      >
        {VIDEO_REVIEWS.map((item) => (
          <div
            key={item.id}
            onClick={() => onSelectVideo(item)}
            className="group relative flex-shrink-0 w-64 sm:w-72 aspect-[9/15] rounded-3xl overflow-hidden cursor-pointer snap-start border border-brand-border/80 shadow-subtleCard hover:shadow-2xl hover:border-brand-yellow transition-all duration-300 transform hover:-translate-y-1 bg-neutral-900"
          >
            {/* BACKGROUND GRADIENT / POSTER */}
            <div className="absolute inset-0 bg-gradient-to-b from-neutral-800 via-neutral-900 to-black z-0" />

            {/* DECORATIVE TOP BADGES */}
            <div className="absolute top-4 inset-x-4 z-10 flex items-center justify-between">
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-white text-[11px] font-bold">
                <ShieldCheck className="w-3 h-3 text-emerald-400" />
                <span>Verified</span>
              </span>

              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-500/90 text-white text-[11px] font-extrabold shadow-sm">
                ⚡ {item.payoutSpeed}
              </span>
            </div>

            {/* CENTER PLAY BUTTON WITH HOVER RIPPLE */}
            <div className="absolute inset-0 z-10 flex flex-col items-center justify-center p-4">
              <div className="relative">
                <div className="absolute -inset-2 rounded-full bg-brand-yellow/30 blur-sm group-hover:scale-125 transition-transform duration-300" />
                <div className="relative w-14 h-14 rounded-full bg-brand-yellow text-brand-black flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform duration-200">
                  <Play className="w-6 h-6 fill-brand-black ml-1" />
                </div>
              </div>
              <span className="text-white text-xs font-bold mt-3 drop-shadow-md group-hover:text-brand-yellow transition-colors">
                Watch Story
              </span>
            </div>

            {/* BOTTOM INFO OVERLAY */}
            <div className="absolute bottom-0 inset-x-0 p-4 z-10 bg-gradient-to-t from-black via-black/85 to-transparent space-y-2">
              {/* STAR RATING */}
              <div className="flex items-center gap-1">
                {[...Array(item.rating)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                ))}
              </div>

              {/* CUSTOMER NAME & CITY */}
              <div className="flex items-center gap-2">
                <div
                  className={`w-7 h-7 rounded-full bg-gradient-to-br ${item.avatarColor} text-white font-bold text-xs flex items-center justify-center border border-white/20`}
                >
                  {item.customerName.charAt(0)}
                </div>
                <div className="truncate">
                  <div className="flex items-center gap-1 text-white text-xs font-bold truncate">
                    <span>{item.customerName}</span>
                    <CheckCircle2 className="w-3 h-3 text-emerald-400 flex-shrink-0" />
                  </div>
                  <div className="text-[10px] text-gray-300 truncate">{item.location}</div>
                </div>
              </div>

              {/* DEVICE SOLD & PAYOUT */}
              <div className="pt-2 border-t border-white/15 flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-gray-200 text-[11px] truncate max-w-[140px]">
                  {getDeviceIcon(item.deviceCategory)}
                  <span className="truncate">{item.deviceSold}</span>
                </div>
                <span className="text-xs font-black text-brand-yellow font-price">
                  ₹{item.payoutAmount.toLocaleString("en-IN")}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
