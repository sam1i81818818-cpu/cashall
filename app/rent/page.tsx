"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/Button";
import {
  Gamepad2,
  Tv,
  Disc,
  Truck,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Zap,
  ChevronRight,
} from "lucide-react";
import { AiVerificationBar } from "@/components/common/AiVerificationBar";

export default function RentHubPage() {
  const rentalPlans = [
    {
      duration: "1 Day (24 Hours)",
      price: 699,
      badge: "Weekend Special",
      features: [
        "PS5 Disc Edition Console",
        "2 DualSense Wireless Controllers",
        "2 Preloaded AAA Games Included",
        "HDMI 2.1 & Power Cables",
        "Free Doorstep Delivery & Setup",
      ],
    },
    {
      duration: "3 Days (72 Hours)",
      price: 1699,
      badge: "Most Popular",
      popular: true,
      features: [
        "PS5 Disc Edition Console",
        "2 DualSense Wireless Controllers",
        "3 Preloaded AAA Games Included",
        "Doorstep Technician Testing",
        "Zero Security Deposit with KYC",
      ],
    },
    {
      duration: "7 Days (1 Week)",
      price: 3299,
      badge: "Best Value",
      features: [
        "PS5 Disc Edition Console",
        "2 DualSense Wireless Controllers",
        "5 Preloaded AAA Games Included",
        "Free Doorstep Pickup & Return",
        "Full Hardware Insurance Coverage",
      ],
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#FAFAF9] text-brand-black selection:bg-brand-yellow/30">
      <Header />

      <main className="flex-grow py-10 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          {/* BREADCRUMB */}
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs font-semibold text-neutral-400">
            <Link href="/" className="hover:text-brand-black transition-colors">
              Home
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-neutral-300" />
            <span className="text-brand-black font-bold">Gadget &amp; Gaming Rentals</span>
          </nav>

          {/* HERO BANNER - STUDIO CLEAN */}
          <div className="relative overflow-hidden rounded-3xl bg-white border border-neutral-200/90 shadow-[0_4px_30px_-4px_rgba(0,0,0,0.05)] p-8 sm:p-12">
            <div className="absolute top-0 right-0 w-96 h-96 bg-brand-yellow/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-10 left-10 w-72 h-72 bg-blue-500/5 rounded-full blur-2xl pointer-events-none" />

            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-7 space-y-5">
                <p className="text-xs font-bold text-blue-600 uppercase tracking-wider flex items-center gap-2">
                  <Gamepad2 className="w-4 h-4" />
                  <span>Doorstep Gaming Console Rentals • Kolkata &amp; Howrah</span>
                </p>

                <h1 className="text-3xl sm:text-5xl font-black text-brand-black tracking-tight leading-tight">
                  Rent PlayStation 5 <br />
                  <span className="bg-brand-yellow px-2 py-0.5 rounded-xl">At Your Doorstep</span>
                </h1>

                <p className="text-sm sm:text-base text-neutral-600 max-w-xl font-normal leading-relaxed">
                  Experience next-generation 4K 120Hz gaming with zero purchase cost. CashALL delivers genuine PS5 Disc Editions with dual controllers and blockbuster games directly to your home with free on-site setup.
                </p>

                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <Link href="/rent/ps5">
                    <Button
                      variant="primary"
                      size="lg"
                      className="font-black px-8 py-3.5 text-sm gap-2 shadow-yellowGlow rounded-2xl hover:scale-[1.02] active:scale-[0.98] transition-all"
                    >
                      <span>Configure PS5 Rental &rarr;</span>
                    </Button>
                  </Link>

                  <Link href="/rent/track">
                    <Button
                      variant="secondary"
                      size="lg"
                      className="text-xs font-bold px-6 py-3.5 rounded-2xl border border-neutral-200"
                    >
                      Track Existing Rental
                    </Button>
                  </Link>
                </div>

                <div className="pt-2 flex flex-wrap items-center gap-4 text-xs font-semibold text-neutral-500">
                  <span className="flex items-center gap-1.5">
                    <Truck className="w-4 h-4 text-blue-600" /> Free Doorstep Setup
                  </span>
                  <span className="flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" /> Genuine Sony Hardware
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Disc className="w-4 h-4 text-brand-yellow" /> 10+ AAA Disc Titles
                  </span>
                </div>
              </div>

              {/* CONSOLE PREVIEW */}
              <div className="lg:col-span-5 flex items-center justify-center">
                <div className="relative w-64 h-64 sm:w-80 sm:h-80 rounded-3xl bg-neutral-900 p-6 flex flex-col items-center justify-center border border-neutral-800 shadow-2xl group">
                  <div className="w-20 h-20 rounded-2xl bg-brand-yellow/10 border border-brand-yellow/30 flex items-center justify-center text-brand-yellow mb-4 group-hover:scale-110 transition-transform">
                    <Gamepad2 className="w-10 h-10" />
                  </div>
                  <h3 className="text-xl font-black text-white text-center">
                    PS5 Disc Edition Console
                  </h3>
                  <p className="text-xs text-neutral-400 text-center mt-1">
                    Includes 2 DualSense Wireless Controllers + HDMI 2.1 Cable
                  </p>
                  <span className="mt-4 px-3 py-1 rounded-full bg-brand-yellow text-brand-black text-xs font-black">
                    Starting from ₹699/day
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* RENTAL PACKAGES GRID */}
          <div className="space-y-6">
            <div className="text-center max-w-xl mx-auto">
              <h2 className="text-2xl sm:text-3xl font-black text-brand-black tracking-tight">
                Transparent Rental Packages
              </h2>
              <p className="text-xs sm:text-sm text-neutral-500 mt-1">
                Zero hidden charges. Includes doorstep delivery, setup, and retrieval.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {rentalPlans.map((plan, idx) => (
                <div
                  key={idx}
                  className={`bg-white rounded-3xl p-7 border flex flex-col justify-between transition-all duration-300 ${
                    plan.popular
                      ? "border-brand-yellow ring-2 ring-brand-yellow/30 shadow-[0_12px_32px_-6px_rgba(255,212,0,0.2)]"
                      : "border-neutral-200/90 shadow-[0_2px_16px_-4px_rgba(0,0,0,0.04)] hover:border-neutral-300"
                  }`}
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span
                        className={`text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full ${
                          plan.popular
                            ? "bg-brand-yellow text-brand-black"
                            : "bg-neutral-100 text-neutral-700"
                        }`}
                      >
                        {plan.badge}
                      </span>
                    </div>

                    <div>
                      <h3 className="text-lg font-black text-brand-black">{plan.duration}</h3>
                      <div className="mt-2 flex items-baseline gap-1">
                        <span className="text-3xl font-black text-brand-black font-price">
                          ₹{plan.price.toLocaleString("en-IN")}
                        </span>
                        <span className="text-xs text-neutral-500 font-semibold">all inclusive</span>
                      </div>
                    </div>

                    <div className="space-y-2 pt-2 border-t border-neutral-100 text-xs text-neutral-600">
                      {plan.features.map((f, i) => (
                        <div key={i} className="flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                          <span>{f}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-6">
                    <Link href="/rent/ps5" className="block">
                      <Button
                        variant={plan.popular ? "primary" : "secondary"}
                        size="md"
                        fullWidth
                        className="font-black text-xs py-3 rounded-xl"
                      >
                        Book {plan.duration}
                      </Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* AI VERIFICATION BAR */}
          <AiVerificationBar />

        </div>
      </main>

      <Footer />
    </div>
  );
}
