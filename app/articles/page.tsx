import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ARTICLES_DATA } from "@/lib/data/articlesData";
import {
  BookOpen,
  ArrowRight,
  Clock,
  Calendar,
  User,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Device Guides, Security Protocols & Valuation Articles | CashALL",
  description:
    "In-depth technical guides on NIST 800-88 data sanitization, display testing, battery chemistry degradation, eSIM removal, and statutory bill of sale protections.",
  alternates: {
    canonical: "https://www.cashall.in/articles",
  },
  openGraph: {
    title: "Device Guides, Security Protocols & Valuation Articles | CashALL",
    description: "In-depth technical guides on NIST data wiping, battery chemistry, eSIM removal, and device inspection.",
    url: "https://www.cashall.in/articles",
    images: ["/photos/CashALL_logo.png"],
  },
};

export default function ArticlesPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": "CashALL Device Technical Guides & Articles",
    "url": "https://www.cashall.in/articles",
    "description": "Technical documentation, data privacy standards, and device inspection tutorials for used electronics.",
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
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <h1 className="text-3xl sm:text-5xl font-black text-brand-black tracking-tight">
              Device Guides &amp; Security Articles
            </h1>
            <p className="text-sm sm:text-base text-brand-muted max-w-2xl mx-auto leading-relaxed">
              Step-by-step technical guides, NIST data sanitization protocols, display grading standards, and legal safeguards for selling used smartphones and laptops.
            </p>
          </div>

          {/* ARTICLES GRID */}
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-brand-border pb-3">
              <h2 className="text-lg sm:text-xl font-black text-brand-black">
                Technical Handover &amp; Inspection Guides
              </h2>
              <span className="text-xs text-brand-muted font-bold">
                {ARTICLES_DATA.length} Articles
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {ARTICLES_DATA.map((article) => (
                <article
                  key={article.slug}
                  className="bg-white rounded-3xl border border-brand-border p-6 shadow-subtleCard hover:shadow-premium hover:border-brand-yellow transition-all duration-200 flex flex-col justify-between space-y-5"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-[11px] text-brand-muted">
                      <span className="font-semibold">{article.author.name}</span>
                      <span className="flex items-center gap-1 font-medium">
                        <Clock className="w-3 h-3" />
                        {article.readTime}
                      </span>
                    </div>

                    <h3 className="text-base font-black text-brand-black leading-snug">
                      {article.title}
                    </h3>

                    <p className="text-xs text-neutral-600 leading-relaxed">
                      {article.excerpt}
                    </p>

                    {/* DIRECT QUESTION & ANSWER */}
                    <div className="bg-neutral-50 rounded-2xl p-4 border border-brand-border/60 space-y-2">
                      <div className="text-xs font-black text-brand-black">
                        Q: {article.directQuestion}
                      </div>
                      <p className="text-xs text-neutral-700 leading-relaxed">
                        A: {article.directAnswer}
                      </p>
                    </div>

                    {/* BULLETS */}
                    <ul className="space-y-1.5 pt-1 text-xs text-neutral-700">
                      {article.bullets.map((bullet, bIdx) => (
                        <li key={bIdx} className="flex items-start gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-brand-yellow shrink-0 mt-1.5" />
                          <span>{bullet}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="pt-3 border-t border-brand-border/60 flex items-center justify-between">
                    <span className="text-[11px] text-brand-muted font-medium">
                      Updated {new Date(article.updatedAt).toLocaleDateString("en-IN", { month: "short", day: "numeric", year: "numeric" })}
                    </span>
                    <Link
                      href="/sell"
                      className="inline-flex items-center gap-1 text-xs font-black text-brand-black hover:text-amber-600 transition"
                    >
                      <span>Check Phone Value</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          </div>

          {/* VALUATION CALCULATOR BANNER */}
          <div className="bg-brand-black text-white rounded-3xl p-8 sm:p-10 shadow-premium flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="space-y-2 text-center sm:text-left">
              <h3 className="text-2xl font-black">
                Ready to Turn Your Old Device Into Cash?
              </h3>
              <p className="text-xs sm:text-sm text-neutral-300 max-w-lg">
                Sell your old smartphone, laptop, or tablet in 60 seconds with free doorstep pickup across Kolkata, Howrah, Hooghly, and Gorakhpur.
              </p>
            </div>
            <Link
              href="/sell"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-brand-yellow hover:bg-amber-400 text-brand-black font-black text-xs sm:text-sm shadow-md transition hover:scale-105"
            >
              <span>Calculate Phone Price</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
