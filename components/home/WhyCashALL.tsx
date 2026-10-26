import React from "react";
import Image from "next/image";

export function WhyCashALL() {
  const features = [
    {
      title: "Transparent Valuation",
      description: "We show you exact itemized line items for why your phone is valued at its price. No guesswork.",
      image: "/images/trust/valuation.svg",
    },
    {
      title: "Fast & Free Doorstep Pickup",
      description: "Our certified agent collects your device directly from your home or office with express logistics.",
      image: "/images/trust/pickup.svg",
    },
    {
      title: "Quick Direct Payment",
      description: "Receive instant funds directly to your UPI ID or Bank account upon inspection approval.",
      image: "/images/trust/upi.svg",
    },
    {
      title: "Secure Data Wipe",
      description: "Assisted factory data wipe during pickup to keep your personal files completely safe.",
      image: "/images/trust/data-wipe.svg",
    },
    {
      title: "Zero Hidden Fees",
      description: "No processing deductions, pickup convenience fees or hidden service charges.",
      image: "/images/trust/shield.svg",
    },
    {
      title: "Human Support",
      description: "Real customer support team available to assist with questions or pickup adjustments.",
      image: "/images/trust/support.svg",
    },
  ];

  return (
    <section className="py-16 sm:py-20 bg-white border-t border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 sm:space-y-14">
        
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="font-heading text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Why Sell On CashALL?
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-2 font-normal leading-relaxed">
            Built on algorithmic accuracy, speed, and complete pricing transparency for gadget owners.
          </p>
        </div>

        {/* FEATURES GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
          {features.map((item) => (
            <div
              key={item.title}
              className="bg-slate-50/50 rounded-2xl p-6 border border-slate-200/80 hover:border-slate-300 hover:bg-white shadow-2xs hover:shadow-subtleCard transition-all duration-200 group flex flex-col justify-between"
            >
              <div>
                <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 group-hover:scale-105 transition-transform overflow-hidden">
                  <Image
                    src={item.image}
                    alt={item.title}
                    width={48}
                    height={48}
                    className="w-12 h-12 object-contain"
                  />
                </div>
                <h3 className="font-heading text-base font-extrabold text-slate-900 mb-1.5">{item.title}</h3>
                <p className="text-xs text-slate-500 leading-relaxed font-normal">{item.description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* COMMERCIAL PROMO BANNER CAROUSEL / HIGHLIGHT */}
        <div className="bg-neutral-950 rounded-2xl overflow-hidden border border-neutral-800 shadow-2xl text-white">
          <div className="grid grid-cols-1 md:grid-cols-2 items-center">
            
            {/* LEFT TEXT CONTENT */}
            <div className="p-7 sm:p-10 space-y-5">
              <h3 className="text-2xl sm:text-3xl font-black leading-tight tracking-tight">
                Sell Your Old Phone In <span className="text-brand-yellow">3 Simple Steps</span>
              </h3>
              <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed font-normal">
                Get an instant online quote, schedule a free doorstep pickup slot, and receive instant UPI / Bank payout directly upon doorstep inspection.
              </p>
              <div className="grid grid-cols-3 gap-3 pt-3 border-t border-neutral-800/80 text-center">
                <div>
                  <div className="text-lg font-black text-brand-yellow font-price">100%</div>
                  <div className="text-[11px] text-neutral-400 font-semibold mt-0.5">Safe Payout</div>
                </div>
                <div>
                  <div className="text-lg font-black text-brand-yellow font-price">₹0 Free</div>
                  <div className="text-[11px] text-neutral-400 font-semibold mt-0.5">Doorstep Pickup</div>
                </div>
                <div>
                  <div className="text-lg font-black text-brand-yellow font-price">Instant</div>
                  <div className="text-[11px] text-neutral-400 font-semibold mt-0.5">UPI Payout</div>
                </div>
              </div>
            </div>

            {/* RIGHT PROMOTIONAL IMAGE */}
            <div className="relative h-64 md:h-full min-h-[280px] bg-neutral-900 overflow-hidden">
              <Image
                src="/photos/CashALL_yt_banner.webp"
                alt="CashALL Promotional Banner"
                fill
                className="object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-neutral-950 via-transparent to-transparent opacity-80" />
            </div>

          </div>
        </div>

        {/* TRANSPARENT PRICING GUARANTEE BANNER */}
        <div className="bg-white rounded-2xl p-6 sm:p-7 border border-brand-yellow/50 shadow-[0_8px_30px_rgba(255,212,0,0.12)] max-w-4xl mx-auto">
          <div className="flex flex-col sm:flex-row items-center gap-5">
            <div className="w-12 h-12 flex items-center justify-center shrink-0">
              <Image
                src="/images/trust/shield.svg"
                alt="Pricing Guarantee"
                width={48}
                height={48}
                className="w-12 h-12 object-contain"
              />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-neutral-900">
                Our Transparent Pricing Guarantee
              </h3>
              <p className="text-xs text-neutral-600 mt-1 leading-relaxed font-normal">
                Your online value is an estimate based on the condition parameters you select. Your final price is confirmed after physical inspection. If anything changes, we&apos;ll show you the exact line-item reason before you decide whether to accept or decline the offer.
              </p>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
