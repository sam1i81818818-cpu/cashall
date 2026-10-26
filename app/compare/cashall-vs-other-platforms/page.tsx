import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import {
  CheckCircle2,
  XCircle,
  ArrowRight,
  ShieldCheck,
  Zap,
  TrendingUp,
  HelpCircle,
  ChevronRight,
  Sparkles,
  AlertTriangle,
  Scale,
  Building2,
  Store,
  Users
} from "lucide-react";

export const metadata: Metadata = {
  title: "CashALL vs Other Platforms & Local Sellers | Used Device Comparison",
  description:
    "Compare CashALL against typical online buyback platforms, local offline mobile shop dealers, and classified sites. Discover why CashALL guarantees higher prices, ₹0 pickup fees, and verified on-site data safety.",
  keywords: [
    "cashall vs other platforms",
    "cashall vs local sellers",
    "cashall vs local mobile shops",
    "best place to sell old phone india",
    "sell phone kolkata best price",
    "cashall vs classified sites",
    "avoid phone selling scams",
    "highest buyback price old phone"
  ],
  alternates: {
    canonical: "https://www.cashall.in/compare/cashall-vs-other-platforms",
  },
  openGraph: {
    title: "CashALL vs Other Platforms & Local Sellers: Unbiased Comparison",
    description: "See how CashALL compares to other online portals, local offline phone shops, and classified marketplaces.",
    url: "https://www.cashall.in/compare/cashall-vs-other-platforms",
    images: ["/photos/CashALL_logo.png"],
  },
};

const COMPARISON_MATRIX = [
  {
    feature: "Guaranteed Fair Valuation",
    cashall: "Up to 5% higher guaranteed market price with transparent line-item diagnostics",
    aggregators: "High initial quotes but frequent 25-45% doorstep price drops for micro-scratches",
    localShops: "Arbitrary, unscientific lowballing (shopkeepers cut price to maximize personal margins)",
    classifieds: "Endless lowball offers ('bhai aade daam me de do'), time wasters, and ghosting",
  },
  {
    feature: "Doorstep Pickup Fee",
    cashall: "₹0 (100% Free Doorstep Service with 15-30 min express dispatch)",
    aggregators: "₹100 to ₹199 hidden convenience/handling fee deducted from payout",
    localShops: "No doorstep service. You must travel, waste petrol, find parking, and visit multiple shops",
    classifieds: "You must coordinate meeting strangers at public places or invite unverified individuals home",
  },
  {
    feature: "Payment Speed & Mode",
    cashall: "Instant UPI (GPay/PhonePe/Paytm) or IMPS Transfer credited BEFORE phone handover",
    aggregators: "UPI or wallet transfer (frequently delayed by several hours or next business day)",
    localShops: "Cash shortages, delayed payouts, or requests to 'leave device and take money tomorrow'",
    classifieds: "High risk of fake UPI payment screenshots, fraudulent chargebacks, or counterfeit currency",
  },
  {
    feature: "Personal Data Safety Protocol",
    cashall: "Assisted on-site factory reset before phone leaves your hands",
    aggregators: "Basic factory reset; devices often transported off-site for processing",
    localShops: "Zero data safety. High risk of technicians snooping private photos, chats, or cloud syncs",
    classifieds: "Zero assistance. If you forget to delete eSIM or unlink Google/iCloud, buyer inherits your data",
  },
  {
    feature: "Legal Liability Transfer (Bill of Sale)",
    cashall: "Official digital Bill of Sale with IMEI timestamp. Total legal immunity for seller",
    aggregators: "Standard automated email receipt",
    localShops: "Rarely provide formal purchase undertakings; non-standard paper slips",
    classifieds: "Zero legal protection. If buyer commits a cybercrime using your old IMEI, police contact YOU",
  },
  {
    feature: "Cancellation Fee If You Disagree",
    cashall: "₹0. Total freedom. You can decline revised offer with zero fee or penalty",
    aggregators: "Free, but re-attempt fees may be imposed for rebooking",
    localShops: "Wasted time and travel expenses if deal falls through",
    classifieds: "Hours of wasted negotiations and awkward arguments",
  },
  {
    feature: "Dedicated Human Support",
    cashall: "Direct human phone & WhatsApp helpline (+91 7604092333) with live agent tracking",
    aggregators: "Automated chatbot trees with slow ticket resolution",
    localShops: "Personal relationship dependent; variable accountability",
    classifieds: "No platform arbitration or customer support for transaction disputes",
  },
  {
    feature: "Console & Gaming Ecosystem",
    cashall: "Full Gaming Console Buyback + PlayStation 5 (PS5) Rental Services available",
    aggregators: "Limited console buyback; no gaming console rental services",
    localShops: "Very limited console expertise; steep discounts on game hardware",
    classifieds: "Unreliable condition testing for consoles and accessories",
  },
];

const COMPARISON_FAQS = [
  {
    question: "Why should I sell to CashALL instead of local mobile shops in Kolkata?",
    answer: "Local mobile shops in areas like Chandni Chowk, Fancy Market, or neighborhood dealers operate with high overheads and cut your payout by 20% to 35% to protect their own retail profit margin. They rarely assist with complete data wiping or formal legal purchase undertakings. With CashALL, you receive a transparent algorithmic quote, 100% free doorstep pickup, on-site assisted data wipe, and instant UPI payment directly into your bank account before our agent leaves."
  },
  {
    question: "How is CashALL different from other online buyback platforms?",
    answer: "While typical online aggregators often quote high prices online only to slash them by 30-50% at your doorstep while deducting ₹100-₹199 convenience fees, CashALL uses transparent diagnostic pricing. Normal minor wear is never penalized as screen damage, doorstep pickup is always 100% free, and our payment is credited instantly on the spot via UPI."
  },
  {
    question: "Is selling on unverified classified websites dangerous?",
    answer: "Yes, peer-to-peer marketplaces carry significant security risks. Scammers frequently use fake UPI payment apps (like spoofed PhonePe or Paytm screens) to trick sellers into thinking money was sent. Furthermore, meeting unknown strangers or having them visit your home poses personal safety risks. Most crucially, selling on unverified P2P platforms does not provide a legal transfer of IMEI liability—if the buyer subsequently uses your phone for fraudulent activities, law enforcement traces the original IMEI back to you."
  },
  {
    question: "What happens if I reject the revised doorstep offer from CashALL?",
    answer: "At CashALL, you are never under any pressure. If physical inspection results in a revised quote and you choose not to accept it, the pickup is cancelled immediately with ₹0 fees charged. We never penalize sellers for declining an offer."
  }
];

export default function CompareAllPlatformsPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "name": "Home",
            "item": "https://www.cashall.in"
          },
          {
            "@type": "ListItem",
            "position": 2,
            "name": "CashALL vs Other Platforms & Local Sellers",
            "item": "https://www.cashall.in/compare/cashall-vs-other-platforms"
          }
        ]
      },
      {
        "@type": "Article",
        "headline": "CashALL vs Other Platforms & Local Sellers: The Complete 2026 Selling Comparison",
        "description": "Comprehensive comparison between CashALL, online aggregators, local mobile shops, and classified marketplaces.",
        "publisher": {
          "@type": "Organization",
          "name": "CashALL",
          "logo": {
            "@type": "ImageObject",
            "url": "https://www.cashall.in/photos/CashALL_logo.png"
          }
        }
      },
      {
        "@type": "FAQPage",
        "mainEntity": COMPARISON_FAQS.map((faq) => ({
          "@type": "Question",
          "name": faq.question,
          "acceptedAnswer": {
            "@type": "Answer",
            "text": faq.answer
          }
        }))
      }
    ]
  };

  return (
    <div className="min-h-screen flex flex-col bg-brand-bg text-brand-black">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Header />

      <main className="flex-grow py-10 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-14">
          {/* BREADCRUMB */}
          <nav className="flex items-center gap-1.5 text-xs text-brand-muted">
            <Link href="/" className="hover:text-brand-black transition">Home</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-brand-black font-semibold">CashALL vs Other Platforms & Local Sellers</span>
          </nav>

          {/* HEADER */}
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-yellow/20 border border-brand-yellow/40 text-brand-black text-xs font-black shadow-xs">
              <Scale className="w-4 h-4" />
              <span>Comprehensive 2026 Selling Benchmark</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-black text-brand-black tracking-tight leading-tight">
              CashALL vs <span className="bg-brand-black text-brand-yellow px-3 py-1 rounded-2xl">Other Platforms</span> & Local Sellers
            </h1>

            <p className="text-sm sm:text-base text-brand-muted max-w-2xl mx-auto leading-relaxed">
              Wondering where to get the most money for your old phone or laptop without hidden deductions or security risks? Here is an objective side-by-side comparison across all four major selling channels in India.
            </p>
          </div>

          {/* 4 CHANNELS AT A GLANCE CARDS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-brand-black text-white rounded-3xl p-6 border-2 border-brand-yellow shadow-premium flex flex-col justify-between space-y-4">
              <div className="space-y-2">
                <span className="text-[10px] font-black uppercase tracking-wider bg-brand-yellow text-brand-black px-2.5 py-1 rounded-full">
                  Recommended Choice
                </span>
                <h3 className="text-xl font-black text-brand-yellow">CashALL</h3>
                <p className="text-xs text-neutral-300 leading-relaxed">
                  Pioneering honest, transparent pricing. Free 15-min doorstep pickup, on-site certified data wipe, and instant on-the-spot UPI payment.
                </p>
              </div>
              <div className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" />
                <span>Highest Payout & Zero Hidden Fees</span>
              </div>
            </div>

            <div className="bg-white rounded-3xl p-6 border border-brand-border shadow-subtleCard flex flex-col justify-between space-y-4">
              <div className="space-y-2">
                <span className="text-[10px] font-bold text-neutral-600 bg-neutral-100 px-2.5 py-1 rounded-full uppercase">
                  Online Aggregators
                </span>
                <h3 className="text-lg font-black text-brand-black">Other Online Portals</h3>
                <p className="text-xs text-brand-muted leading-relaxed">
                  National buyback portals that quote high online prices but frequently apply 30-50% deductions at the doorstep, plus ₹100-₹199 convenience charges.
                </p>
              </div>
              <div className="text-xs font-semibold text-amber-700 flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4" />
                <span>Frequent Doorstep Price Cuts</span>
              </div>
            </div>

            <div className="bg-white rounded-3xl p-6 border border-brand-border shadow-subtleCard flex flex-col justify-between space-y-4">
              <div className="space-y-2">
                <span className="text-[10px] font-bold text-neutral-600 bg-neutral-100 px-2.5 py-1 rounded-full uppercase">
                  Offline Retail
                </span>
                <h3 className="text-lg font-black text-brand-black">Local Mobile Shops</h3>
                <p className="text-xs text-brand-muted leading-relaxed">
                  Requires travelling, shop hopping, and bargaining. Shopkeepers give arbitrary lowball quotes to maximize their profit margins.
                </p>
              </div>
              <div className="text-xs font-semibold text-red-600 flex items-center gap-1.5">
                <XCircle className="w-4 h-4" />
                <span>No Data Wipe & Heavy Bargaining</span>
              </div>
            </div>

            <div className="bg-white rounded-3xl p-6 border border-brand-border shadow-subtleCard flex flex-col justify-between space-y-4">
              <div className="space-y-2">
                <span className="text-[10px] font-bold text-neutral-600 bg-neutral-100 px-2.5 py-1 rounded-full uppercase">
                  P2P Marketplaces
                </span>
                <h3 className="text-lg font-black text-brand-black">Classifieds &amp; P2P Sites</h3>
                <p className="text-xs text-brand-muted leading-relaxed">
                  High risk of scams, fake UPI screenshots, and personal safety risks meeting unverified strangers. Zero transfer of legal IMEI liability.
                </p>
              </div>
              <div className="text-xs font-semibold text-red-600 flex items-center gap-1.5">
                <XCircle className="w-4 h-4" />
                <span>High Scam Risk & No Legal Bill</span>
              </div>
            </div>
          </div>

          {/* MASTER COMPARISON MATRIX TABLE */}
          <div className="bg-white rounded-3xl border border-brand-border p-6 sm:p-8 shadow-subtleCard space-y-6">
            <div className="space-y-1">
              <h2 className="text-2xl font-black text-brand-black">
                Comprehensive Side-by-Side Comparison
              </h2>
              <p className="text-xs sm:text-sm text-brand-muted">
                See how each selling channel performs across transparency, convenience, data safety, and legal security.
              </p>
            </div>

            <div className="overflow-x-auto rounded-2xl border border-brand-border">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead className="bg-brand-black text-white font-bold">
                  <tr>
                    <th className="p-4 w-1/4">Key Evaluation Criteria</th>
                    <th className="p-4 w-1/4 bg-brand-yellow text-brand-black font-black">
                      ⚡ CashALL
                    </th>
                    <th className="p-4 w-1/4">Other Online Portals</th>
                    <th className="p-4 w-1/4">Local Mobile Shops & Dealers</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-brand-border">
                  {COMPARISON_MATRIX.map((row, idx) => (
                    <tr key={idx} className={idx % 2 === 0 ? "bg-white" : "bg-neutral-50/60"}>
                      <td className="p-4 font-black text-brand-black align-top">
                        {row.feature}
                      </td>
                      <td className="p-4 bg-brand-yellow/10 font-bold text-neutral-900 border-x border-brand-yellow/30 align-top">
                        <div className="flex items-start gap-1.5">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                          <span>{row.cashall}</span>
                        </div>
                      </td>
                      <td className="p-4 text-neutral-700 align-top">
                        {row.aggregators}
                      </td>
                      <td className="p-4 text-neutral-700 align-top">
                        {row.localShops}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* DEEP DIVE: THE DANGERS OF LOCAL DEALERS & CLASSIFIED SCAMS */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white rounded-3xl border border-brand-border p-6 sm:p-8 shadow-subtleCard space-y-4">
              <div className="w-10 h-10 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center">
                <Store className="w-5 h-5 text-amber-600" />
              </div>
              <h3 className="text-xl font-black text-brand-black">
                The Hidden Cost of Selling to Local Mobile Shops
              </h3>
              <p className="text-xs sm:text-sm text-neutral-700 leading-relaxed">
                When you visit an offline mobile shop in Kolkata or any Indian city, the dealer's business model relies on buying low from you and reselling high to another customer. Because there are no standard evaluation tools, dealers deliberately exaggerate minor blemishes, claiming 'screen replacement cost' or 'motherboard risk' to slash your payout by ₹3,000 to ₹8,000.
              </p>
              <p className="text-xs sm:text-sm text-neutral-700 leading-relaxed">
                Worse yet, local dealers rarely assist with certified data sanitization. Your old device may be handed over to a buyer with recoverable residual data, putting your personal privacy at grave risk.
              </p>
            </div>

            <div className="bg-white rounded-3xl border border-brand-border p-6 sm:p-8 shadow-subtleCard space-y-4">
              <div className="w-10 h-10 rounded-2xl bg-red-50 border border-red-200 flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-red-600" />
              </div>
              <h3 className="text-xl font-black text-brand-black">
                The Serious Legal & Scam Risks of P2P Marketplaces
              </h3>
              <p className="text-xs sm:text-sm text-neutral-700 leading-relaxed">
                Unverified classified platforms and open peer-to-peer portals expose you to fraudsters using sophisticated fake UPI payment apps that produce believable payment screens without transferring funds. 
              </p>
              <p className="text-xs sm:text-sm text-neutral-700 leading-relaxed">
                Most dangerously, selling to an unknown stranger transfers NO legal liability. If that individual uses the phone's IMEI in a SIM swap scam, financial fraud, or harassment case, law enforcement traces the handset back to YOUR purchase invoice. CashALL provides a legally binding digital Bill of Sale that completely indemnifies you upon sale.
              </p>
            </div>
          </div>

          {/* FAQS */}
          <div className="bg-white rounded-3xl border border-brand-border p-6 sm:p-8 shadow-subtleCard space-y-6">
            <div className="flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-brand-black" />
              <h3 className="text-xl font-black text-brand-black">
                Comparison Frequently Asked Questions
              </h3>
            </div>

            <div className="space-y-3">
              {COMPARISON_FAQS.map((faq, idx) => (
                <div key={idx} className="bg-brand-bg rounded-2xl border border-brand-border p-5 space-y-2">
                  <h4 className="text-sm sm:text-base font-extrabold text-brand-black">
                    {faq.question}
                  </h4>
                  <p className="text-xs sm:text-sm text-brand-muted leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* FINAL CTA BANNER */}
          <div className="bg-brand-black text-white rounded-3xl p-8 sm:p-10 shadow-premium flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="space-y-2 text-center sm:text-left">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-yellow/20 text-brand-yellow text-xs font-black">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Zero Deductions • Instant UPI Transfer</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-black">
                Sell Your Device with Instant Doorstep Payout
              </h3>
              <p className="text-xs sm:text-sm text-neutral-300 max-w-lg">
                Sell your old smartphone, laptop, or tablet in 60 seconds with 100% free doorstep pickup and guaranteed instant payment.
              </p>
            </div>

            <Link
              href="/sell"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-2xl bg-brand-yellow hover:bg-amber-400 text-brand-black font-black text-sm shadow-md transition hover:scale-105"
            >
              <span>Get Your Instant Quote</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
