"use client";

import React from "react";
import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Smartphone, Laptop, Tablet, ArrowRight, ChevronRight } from "lucide-react";
import { AiVerificationBar } from "@/components/common/AiVerificationBar";

export default function CategorySelectionPage() {
  return (
    <div className="min-h-screen flex flex-col bg-brand-bg text-brand-black">
      <Header />
      <main className="flex-grow py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* BREADCRUMB */}
          <div className="flex items-center gap-2 text-xs font-semibold text-neutral-400 mb-6 justify-center">
            <Link href="/" className="hover:text-brand-black">Home</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-brand-black font-bold">Sell Device</span>
          </div>

          <div className="text-center max-w-xl mx-auto mb-10">
            <h1 className="text-2xl sm:text-4xl font-extrabold text-brand-black tracking-tight">
              What Do You Want To Sell Today?
            </h1>
            <p className="text-xs sm:text-sm text-neutral-500 mt-2 font-normal leading-relaxed">
              Select your device category to calculate a guaranteed doorstep buyback quote.
            </p>
          </div>

          {/* CATEGORY SELECTION CARDS */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 max-w-4xl mx-auto">
            
            {/* MOBILE PHONE CARD */}
            <Link
              href="/sell-old-mobile-phone"
              className="bg-white rounded-2xl p-7 border border-neutral-200/80 hover:border-brand-yellow/70 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.04)] hover:shadow-[0_12px_32px_-6px_rgba(255,212,0,0.2)] transition-all duration-300 group text-left flex flex-col justify-between hover:-translate-y-0.5"
            >
              <div>
                <div className="w-12 h-12 rounded-xl bg-brand-yellow/15 border border-brand-yellow/30 flex items-center justify-center text-brand-black mb-5 group-hover:scale-105 transition-transform">
                  <Smartphone className="w-6 h-6 text-brand-black" />
                </div>
                <h2 className="text-lg font-bold text-brand-black group-hover:text-black">
                  Mobile Phone
                </h2>
                <p className="text-xs text-neutral-500 mt-1.5 leading-relaxed font-normal">
                  Sell iPhone, Samsung, OnePlus, Xiaomi, Vivo, Oppo, Realme, Motorola, Google Pixel &amp; more.
                </p>
              </div>
              <div className="flex items-center gap-2 text-xs font-bold text-brand-black mt-6 group-hover:text-amber-600 group-hover:translate-x-1 transition-all">
                <span>Sell Mobile Phone</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </Link>

            {/* LAPTOP CARD */}
            <Link
              href="/sell/laptop"
              className="bg-white rounded-2xl p-7 border border-neutral-200/80 hover:border-brand-yellow/70 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.04)] hover:shadow-[0_12px_32px_-6px_rgba(255,212,0,0.2)] transition-all duration-300 group text-left flex flex-col justify-between hover:-translate-y-0.5"
            >
              <div>
                <div className="w-12 h-12 rounded-xl bg-brand-yellow/15 border border-brand-yellow/30 flex items-center justify-center text-brand-black mb-5 group-hover:scale-105 transition-transform">
                  <Laptop className="w-6 h-6 text-brand-black" />
                </div>
                <h2 className="text-lg font-bold text-brand-black group-hover:text-black">
                  Laptop
                </h2>
                <p className="text-xs text-neutral-500 mt-1.5 leading-relaxed font-normal">
                  Sell Apple MacBook Air/Pro, Dell, HP, Lenovo, Asus, Acer, Microsoft &amp; MSI.
                </p>
              </div>
              <div className="flex items-center gap-2 text-xs font-bold text-brand-black mt-6 group-hover:text-amber-600 group-hover:translate-x-1 transition-all">
                <span>Sell Laptop</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </Link>

            {/* TABLET CARD */}
            <Link
              href="/sell/tablet"
              className="bg-white rounded-2xl p-7 border border-neutral-200/80 hover:border-brand-yellow/70 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.04)] hover:shadow-[0_12px_32px_-6px_rgba(255,212,0,0.2)] transition-all duration-300 group text-left flex flex-col justify-between hover:-translate-y-0.5"
            >
              <div>
                <div className="w-12 h-12 rounded-xl bg-brand-yellow/15 border border-brand-yellow/30 flex items-center justify-center text-brand-black mb-5 group-hover:scale-105 transition-transform">
                  <Tablet className="w-6 h-6 text-brand-black" />
                </div>
                <h2 className="text-lg font-bold text-brand-black group-hover:text-black">
                  Tablet / iPad
                </h2>
                <p className="text-xs text-neutral-500 mt-1.5 leading-relaxed font-normal">
                  Sell Apple iPad, iPad Air/Pro, Samsung Galaxy Tab, Lenovo, OnePlus &amp; Xiaomi Pad.
                </p>
              </div>
              <div className="flex items-center gap-2 text-xs font-bold text-brand-black mt-6 group-hover:text-amber-600 group-hover:translate-x-1 transition-all">
                <span>Sell Tablet</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </Link>

          </div>

          {/* AI VERIFICATION TRUST BAR */}
          <div className="pt-10 max-w-4xl mx-auto">
            <AiVerificationBar />
          </div>

        </div>
      </main>
      <Footer />
    </div>
  );
}
