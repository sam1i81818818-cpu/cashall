import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { TECH_NEWS } from "@/lib/data/newsData";
import {
  Newspaper,
  TrendingUp,
  Clock,
  Sparkles,
  ArrowRight,
  Flame,
  Globe,
  Tag,
  Share2
} from "lucide-react";

export const metadata: Metadata = {
  title: "Tech News & Gadget Market Updates | CashALL News Wire",
  description:
    "Stay ahead with the latest smartphone launches, tech news, gadget price trends, AI hardware updates, and secondary electronics market intelligence.",
  alternates: {
    canonical: "https://www.cashall.in/news",
  },
  openGraph: {
    title: "Tech News & Gadget Market Updates | CashALL News Wire",
    description: "Stay ahead with the latest smartphone launches, tech news, and gadget price trends.",
    url: "https://www.cashall.in/news",
    images: ["/photos/CashALL_logo.png"],
  },
};

export default function NewsPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "NewsMediaOrganization",
    "name": "CashALL Tech News",
    "url": "https://www.cashall.in/news",
    "description": "Daily technology news and second-hand smartphone re-commerce market updates in India.",
  };

  return (
    <div className="min-h-screen flex flex-col bg-brand-bg text-brand-black">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Header />

      <main className="flex-grow py-10 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          {/* HEADER */}
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-yellow/20 border border-brand-yellow/40 text-brand-black text-xs font-black shadow-xs">
              <Newspaper className="w-4 h-4" />
              <span>CashALL Live Tech Wire</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-black text-brand-black tracking-tight">
              Latest <span className="bg-brand-black text-brand-yellow px-3 py-1 rounded-2xl">Tech & Gadget</span> News
            </h1>

            <p className="text-sm sm:text-base text-brand-muted max-w-xl mx-auto leading-relaxed">
              Real-time updates on smartphone launches, trade-in market trends, circular economy policy, and next-generation mobile silicon.
            </p>
          </div>

          {/* TRENDING TICKER */}
          <div className="bg-white border border-brand-border rounded-2xl p-4 shadow-xs flex items-center gap-3 overflow-x-auto">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-red-50 text-red-700 border border-red-200 text-xs font-black shrink-0">
              <Flame className="w-3.5 h-3.5 fill-red-500 text-red-500" />
              Trending Now
            </span>
            <span className="text-xs text-brand-black font-semibold shrink-0">
              Secondary Market Surges by 28% • CEIR Lost-Phone Blacklist Integration Live • AI NPUs Drive Premium Resale Value
            </span>
          </div>

          {/* NEWS FEED GRID */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {TECH_NEWS.map((news) => (
              <article
                key={news.id}
                className="bg-white rounded-3xl border border-brand-border p-6 shadow-subtleCard hover:shadow-premium hover:border-brand-yellow transition-all duration-200 flex flex-col justify-between space-y-5"
              >
                <div className="space-y-3.5">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[11px] font-black uppercase tracking-wider text-brand-black bg-neutral-100 border border-brand-border px-2.5 py-0.5 rounded-full">
                      {news.category}
                    </span>
                    {news.trending && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-extrabold text-red-600 bg-red-50 px-2 py-0.5 rounded-full border border-red-200">
                        <Flame className="w-3 h-3 fill-red-500 text-red-500" />
                        Trending
                      </span>
                    )}
                  </div>

                  <h2 className="text-lg sm:text-xl font-black text-brand-black leading-snug">
                    {news.title}
                  </h2>

                  <p className="text-xs text-brand-muted leading-relaxed">
                    {news.excerpt}
                  </p>

                  <div className="space-y-2 pt-2 border-t border-brand-border/60">
                    {news.content.slice(0, 2).map((p, idx) => (
                      <p key={idx} className="text-xs text-neutral-700 leading-relaxed">
                        {p}
                      </p>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-brand-border/60 flex items-center justify-between text-xs text-brand-muted">
                  <div className="flex items-center gap-1.5 font-medium">
                    <Globe className="w-3.5 h-3.5 text-neutral-400" />
                    <span>{news.source}</span>
                  </div>
                  <span>{new Date(news.publishedAt).toLocaleDateString("en-IN", { month: "short", day: "numeric" })}</span>
                </div>
              </article>
            ))}
          </div>

          {/* CHECK OLD PHONE PRICE BANNER */}
          <div className="bg-brand-black text-white rounded-3xl p-8 sm:p-10 shadow-premium flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="space-y-2 text-center sm:text-left">
              <h3 className="text-2xl font-black">
                Upgrading After Reading The Latest Tech News?
              </h3>
              <p className="text-xs sm:text-sm text-neutral-300 max-w-lg">
                Sell your existing smartphone on CashALL to unlock immediate cash towards your next upgrade with 0 doorstep fees.
              </p>
            </div>
            <Link
              href="/sell"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-brand-yellow hover:bg-amber-400 text-brand-black font-black text-xs sm:text-sm shadow-md transition hover:scale-105"
            >
              <span>Sell Old Device Now</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
