import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { BLOG_POSTS } from "@/lib/data/blogData";
import {
  ArrowRight,
  BookOpen,
  Clock,
  Newspaper
} from "lucide-react";

export const metadata: Metadata = {
  title: "Phone Resale Value Guides & Frequently Asked Questions | CashALL",
  description:
    "Direct answers and guides on smartphone resale values, storage ROI, account removal checklists, and how to get maximum cash for your used phone in India.",
  alternates: {
    canonical: "https://www.cashall.in/blog",
  },
  openGraph: {
    title: "Phone Resale Value Guides & Frequently Asked Questions | CashALL",
    description:
      "Direct answers on device valuation, storage ROI, clean phone checklists, and how to get maximum cash for your used phone in India.",
    url: "https://www.cashall.in/blog",
    images: ["/photos/CashALL_logo.webp"],
  },
};

export default function BlogIndexPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Blog",
    "name": "CashALL Resale Guides",
    "description": "Clear answers and guides for selling old smartphones and electronics.",
    "publisher": {
      "@type": "Organization",
      "name": "CashALL",
      "url": "https://www.cashall.in"
    },
    "blogPost": BLOG_POSTS.map((post) => ({
      "@type": "BlogPosting",
      "headline": post.title,
      "description": post.excerpt,
      "datePublished": post.publishedAt,
      "url": `https://www.cashall.in/${post.slug}`
    }))
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
            <h1 className="text-3xl sm:text-5xl font-black text-brand-black tracking-tight">
              Phone Selling <span className="bg-brand-black text-brand-yellow px-3 py-1 rounded-2xl">Questions & Guides</span>
            </h1>

            <p className="text-sm sm:text-base text-brand-muted max-w-2xl mx-auto leading-relaxed">
              Clear, practical answers about phone valuation, price depreciation, storage choices, and how to safely prepare your device before selling.
            </p>

            <div className="flex items-center justify-center gap-3 pt-2">
              <Link
                href="/news"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white border border-brand-border text-xs font-extrabold text-brand-black hover:border-brand-black transition"
              >
                <Newspaper className="w-3.5 h-3.5 text-brand-black" />
                <span>Tech News Feed</span>
              </Link>
              <Link
                href="/articles"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white border border-brand-border text-xs font-extrabold text-brand-black hover:border-brand-black transition"
              >
                <BookOpen className="w-3.5 h-3.5 text-brand-black" />
                <span>All Guides</span>
              </Link>
            </div>
          </div>

          {/* QUESTIONS & ANSWERS GUIDES GRID */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {BLOG_POSTS.map((post) => (
              <article
                key={post.slug}
                className="bg-white rounded-3xl border border-brand-border p-6 sm:p-7 shadow-subtleCard hover:shadow-premium hover:border-brand-yellow transition-all duration-200 flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-[11px] text-brand-muted font-medium">
                    <span>
                      {new Date(post.publishedAt).toLocaleDateString("en-IN", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {post.readTime}
                    </span>
                  </div>

                  <Link href={`/${post.slug}`} className="block group">
                    <h2 className="text-lg sm:text-xl font-black text-brand-black group-hover:text-amber-600 transition leading-snug">
                      {post.aeoQuickAnswer.question || post.title}
                    </h2>
                  </Link>

                  <p className="text-xs text-neutral-600 leading-relaxed font-normal line-clamp-4">
                    {post.aeoQuickAnswer.answer || post.excerpt}
                  </p>
                </div>

                <div className="pt-4 border-t border-brand-border/60 flex items-center justify-between">
                  <span className="text-[11px] text-brand-muted">
                    {post.author.name}
                  </span>

                  <Link
                    href={`/${post.slug}`}
                    className="inline-flex items-center gap-1 text-xs font-black text-brand-black hover:text-amber-600 transition"
                  >
                    <span>Read Full Guide</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </article>
            ))}
          </div>

          {/* BOTTOM VALUATION CTA */}
          <div className="bg-brand-black text-white rounded-3xl p-8 sm:p-10 shadow-premium flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="space-y-2 text-center sm:text-left">
              <h3 className="text-2xl font-black">
                How Much Is Your Old Device Worth Right Now?
              </h3>
              <p className="text-xs sm:text-sm text-neutral-300 max-w-lg">
                Answer simple questions about your screen and body condition to receive an instant, guaranteed transparent quote.
              </p>
            </div>
            <Link
              href="/sell"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-brand-yellow hover:bg-amber-400 text-brand-black font-black text-xs sm:text-sm shadow-md transition hover:scale-105"
            >
              <span>Get Instant Valuation</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
