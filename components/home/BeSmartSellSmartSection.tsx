"use client";

import React from "react";
import Link from "next/link";
import { BLOG_POSTS } from "@/lib/data/blogData";
import { ArrowRight } from "lucide-react";

export function BeSmartSellSmartSection() {
  return (
    <section className="py-16 sm:py-20 bg-white border-t border-brand-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* SECTION HEADER */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-brand-border pb-5">
          <div className="space-y-1.5">
            <h2 className="text-2xl sm:text-3xl font-black text-brand-black tracking-tight">
              Phone Selling Questions &amp; Practical Guides
            </h2>
            <p className="text-xs sm:text-sm text-neutral-600 max-w-xl leading-relaxed">
              Direct answers to common questions about resale pricing, device security, storage value, and doorstep selling.
            </p>
          </div>

          <Link
            href="/blog"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-black hover:text-neutral-700 bg-brand-yellow hover:bg-amber-400 px-4 py-2 rounded-xl transition shrink-0 self-start sm:self-auto"
          >
            <span>All Guides ({BLOG_POSTS.length})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* DIRECT Q&A GUIDES GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {BLOG_POSTS.map((post) => (
            <article
              key={post.slug}
              className="bg-white rounded-2xl border border-neutral-200/90 p-6 hover:border-brand-yellow/80 hover:shadow-md transition-all duration-200 flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between text-[11px] text-neutral-400 font-medium">
                  <span>
                    {new Date(post.publishedAt).toLocaleDateString("en-IN", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </span>
                  <span>{post.readTime}</span>
                </div>

                <Link href={`/${post.slug}`} className="block group">
                  <h3 className="text-base font-bold text-neutral-900 group-hover:text-amber-600 transition leading-snug">
                    {post.aeoQuickAnswer.question || post.title}
                  </h3>
                </Link>

                <p className="text-xs text-neutral-600 leading-relaxed font-normal line-clamp-4">
                  {post.aeoQuickAnswer.answer || post.excerpt}
                </p>
              </div>

              <div className="pt-3 border-t border-neutral-100 flex items-center justify-between">
                <Link
                  href={`/${post.slug}`}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-neutral-900 hover:text-amber-600 transition"
                >
                  <span>Read Full Answer</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </article>
          ))}
        </div>

      </div>
    </section>
  );
}
