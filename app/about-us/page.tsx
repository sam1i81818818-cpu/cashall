"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import {
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  HeartHandshake,
  TrendingUp,
  Award,
  Users,
  Building2,
  Clock,
  ArrowRight,
  Leaf,
  FileCheck,
  Smartphone,
  ChevronRight,
  HelpCircle
} from "lucide-react";

const MILESTONES = [
  {
    year: "Aug 2026",
    title: "The Genesis in Howrah",
    description:
      "Founded in Howrah, West Bengal under Aarna Enterprise with a singular mission: end the era of offline dealer lowballing and doorstep price slashing by introducing mathematical, line-item pricing transparency.",
    badge: "Genesis"
  },
  {
    year: "Sep 2026",
    title: "Direct Doorstep Hub Expansion",
    description:
      "Expanded direct field coverage across Howrah, Kolkata, Hooghly, Barrackpore, Gorakhpur, Ranchi, and Patna with verified doorstep technicians and instant UPI payouts.",
    badge: "Expansion"
  },
  {
    year: "Oct 2026",
    title: "Verified Payouts & Gaming Hub",
    description:
      "Crossed 180+ verified customer device evaluations, disbursed 100% instant on-the-spot bank UPI payouts with digital Bills of Sale, and launched premier PlayStation 5 console rentals.",
    badge: "Milestone"
  }
];

const CORE_VALUES = [
  {
    icon: Sparkles,
    title: "Radical Pricing Transparency",
    desc: "We show sellers exactly how their price is calculated. Normal wear is never penalized as damage, and you approve any diagnostic changes before final payment."
  },
  {
    icon: ShieldCheck,
    title: "Military-Grade Data Safety",
    desc: "Your photos, banking details, and contacts are irreversibly wiped before the device leaves your hands. We issue a formal legal Bill of Sale indemnifying you."
  },
  {
    icon: Clock,
    title: "Zero Delay, Instant UPI",
    desc: "No waiting for cheques, courier inspections, or wallet vouchers. The agreed amount is credited directly to your bank account via UPI before handover."
  },
  {
    icon: Leaf,
    title: "Circular Electronics Economy",
    desc: "By repairing, refurbishing, and extending the operational lifecycle of consumer tech, we divert e-waste from landfills and promote sustainable reuse."
  }
];

export default function AboutUsPage() {
  const [activeTab, setActiveTab] = useState<number>(0);

  return (
    <div className="min-h-screen flex flex-col bg-brand-bg text-brand-black">
      <Header />

      <main className="flex-grow py-10 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          {/* 1. HERO SECTION */}
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <h1 className="text-3xl sm:text-5xl font-black text-brand-black tracking-tight leading-tight">
              Reinventing How India <br className="hidden sm:inline" />
              <span className="bg-brand-black text-brand-yellow px-3 py-1 rounded-2xl">Sells Used Electronics</span>
            </h1>

            <p className="text-sm sm:text-base text-brand-muted max-w-2xl mx-auto leading-relaxed">
              CashALL was founded on a simple premise: selling your old smartphone, laptop, or tablet should be as fast, transparent, and dignified as ordering dinner online.
            </p>
          </div>

          {/* 2. LIVE IMPACT METRICS COUNTER */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            <div className="bg-white border border-brand-border rounded-3xl p-6 text-center shadow-subtleCard space-y-1">
              <div className="text-2xl sm:text-4xl font-black text-brand-black">180+</div>
              <div className="text-xs font-bold text-brand-muted uppercase tracking-wider">Devices Evaluated</div>
            </div>
            <div className="bg-white border border-brand-border rounded-3xl p-6 text-center shadow-subtleCard space-y-1">
              <div className="text-2xl sm:text-4xl font-black text-emerald-600">100%</div>
              <div className="text-xs font-bold text-brand-muted uppercase tracking-wider">Instant UPI Payouts</div>
            </div>
            <div className="bg-white border border-brand-border rounded-3xl p-6 text-center shadow-subtleCard space-y-1">
              <div className="text-2xl sm:text-4xl font-black text-brand-black">Same-Day</div>
              <div className="text-xs font-bold text-brand-muted uppercase tracking-wider">Doorstep Pickup</div>
            </div>
            <div className="bg-white border border-brand-border rounded-3xl p-6 text-center shadow-subtleCard space-y-1">
              <div className="text-2xl sm:text-4xl font-black text-amber-500">Zero</div>
              <div className="text-xs font-bold text-brand-muted uppercase tracking-wider">Hidden Fees</div>
            </div>
          </div>

          {/* 3. THE CASHALL STORY: WHY WE EXIST */}
          <div className="bg-white border border-brand-border rounded-3xl p-8 sm:p-12 shadow-subtleCard space-y-6">
            <div className="max-w-3xl space-y-4">
              <span className="text-xs font-black uppercase tracking-wider text-amber-800 bg-amber-50 border border-amber-200 px-3 py-1 rounded-full">
                Our Genesis &amp; Mission
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-brand-black leading-snug">
                Tired of Shady Dealers, Fake Buyers, and Doorstep Bait-and-Switch
              </h2>
              <p className="text-sm text-neutral-700 leading-relaxed">
                Every year in India, millions of functional smartphones sit gathering dust in drawers. Why? Because the existing options to sell them were fundamentally broken.
              </p>
              <p className="text-sm text-neutral-700 leading-relaxed">
                Take your phone to a local offline shop in neighborhood markets, and the dealer lowballs you by 35% without any verifiable rationale. Try selling on peer-to-peer classified websites, and you are inundated with scammers sending fake UPI QR codes or strangers demanding to meet in isolated locations. Try legacy online aggregators, and they quote you ₹20,000 online only to send an agent who slashes it to ₹11,000 on arrival for microscopic scuffs.
              </p>
              <p className="text-sm text-neutral-700 leading-relaxed font-semibold">
                CashALL was born to eliminate this exploitation. We engineered an objective, line-item valuation algorithm. We eliminated convenience fees. And we built a customer-first policy where you get paid in full via instant bank UPI before our technician steps out of your door.
              </p>
            </div>
          </div>

          {/* 4. INTERACTIVE MILESTONES TIMELINE */}
          <div className="space-y-8">
            <div className="text-center space-y-2">
              <h2 className="text-2xl sm:text-3xl font-black text-brand-black">
                The Journey of CashALL
              </h2>
              <p className="text-xs sm:text-sm text-brand-muted">
                From our headquarters in Howrah to Eastern India's most transparent device re-commerce engine.
              </p>
            </div>

            {/* Interactive Timeline Tabs */}
            <div className="flex items-center justify-center gap-2 sm:gap-4 overflow-x-auto pb-2">
              {MILESTONES.map((m, idx) => (
                <button
                  key={m.year}
                  onClick={() => setActiveTab(idx)}
                  className={`px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-black transition-all ${
                    activeTab === idx
                      ? "bg-brand-black text-brand-yellow shadow-md scale-105"
                      : "bg-white text-neutral-700 hover:bg-neutral-100 border border-brand-border"
                  }`}
                >
                  <span>{m.year}</span>
                </button>
              ))}
            </div>

            {/* Selected Milestone Card */}
            <div className="max-w-2xl mx-auto bg-white border-2 border-brand-yellow rounded-3xl p-8 shadow-premium space-y-3 transition-all duration-300">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black bg-brand-yellow text-brand-black px-3 py-1 rounded-full uppercase">
                  {MILESTONES[activeTab].badge} • {MILESTONES[activeTab].year}
                </span>
                <span className="text-xs text-brand-muted font-bold">Milestone #{activeTab + 1} of {MILESTONES.length}</span>
              </div>
              <h3 className="text-xl font-black text-brand-black">
                {MILESTONES[activeTab].title}
              </h3>
              <p className="text-sm text-neutral-700 leading-relaxed">
                {MILESTONES[activeTab].description}
              </p>
            </div>
          </div>

          {/* 5. CORE VALUES */}
          <div className="space-y-8 pt-6">
            <div className="text-center space-y-2">
              <h2 className="text-2xl sm:text-3xl font-black text-brand-black">
                Our Core Principles
              </h2>
              <p className="text-xs sm:text-sm text-brand-muted">
                The non-negotiable promises that guide every doorstep interaction.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {CORE_VALUES.map((val, idx) => {
                const IconComponent = val.icon;
                return (
                  <div
                    key={idx}
                    className="bg-white rounded-3xl border border-brand-border p-6 sm:p-8 shadow-subtleCard flex items-start gap-4 hover:border-brand-yellow transition"
                  >
                    <div className="w-12 h-12 rounded-2xl bg-brand-yellow/15 border border-brand-yellow/30 flex items-center justify-center shrink-0">
                      <IconComponent className="w-6 h-6 text-brand-black" />
                    </div>
                    <div className="space-y-1.5">
                      <h3 className="text-base font-black text-brand-black">{val.title}</h3>
                      <p className="text-xs text-neutral-600 leading-relaxed">{val.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 6. ON-SITE DATA PROTECTION & INSTANT PAYOUT */}
          <div className="bg-neutral-950 text-white rounded-3xl p-8 sm:p-12 border border-neutral-800 shadow-premium flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="space-y-3 max-w-xl text-center md:text-left">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-yellow/20 text-brand-yellow text-xs font-black">
                <ShieldCheck className="w-4 h-4" />
                <span>On-Site Assisted Data Protection</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
                Complete Privacy &amp; Data Safety
              </h2>
              <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed">
                Your personal security is our top priority. Every phone, tablet, and laptop purchased by CashALL undergoes an assisted on-site factory reset before the device leaves your possession. We ensure that no photo, chat, or personal account token remains on your device.
              </p>
            </div>

            <div className="bg-neutral-900 border border-neutral-700 rounded-2xl p-6 text-center space-y-2 shrink-0 w-full sm:w-auto">
              <div className="w-12 h-12 rounded-full bg-brand-yellow text-brand-black font-black flex items-center justify-center mx-auto text-lg shadow-md">
                ✓
              </div>
              <div className="text-sm font-black text-white">100% Assisted Reset</div>
              <div className="text-[11px] text-neutral-400">Legal Bill of Sale Provided</div>
            </div>
          </div>

          {/* 7. BOTTOM CTA */}
          <div className="bg-brand-black text-white rounded-3xl p-8 sm:p-10 shadow-premium flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="space-y-2 text-center sm:text-left">
              <h3 className="text-2xl font-black">
                Ready to Experience Honest Device Selling?
              </h3>
              <p className="text-xs sm:text-sm text-neutral-300 max-w-lg">
                Join verified sellers across Howrah, Kolkata, Ranchi, Patna, and Eastern India. Book your 100% free doorstep evaluation now.
              </p>
            </div>
            <Link
              href="/sell"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-2xl bg-brand-yellow hover:bg-amber-400 text-brand-black font-black text-sm shadow-md transition hover:scale-105 active:scale-95"
            >
              <span>Get Your Device Price</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
