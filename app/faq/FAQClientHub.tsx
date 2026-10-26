"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { MasterFAQ } from "@/lib/faqs";
import { Search, ChevronDown, HelpCircle, ArrowRight, Smartphone, ShieldCheck, Zap } from "lucide-react";

interface FAQClientHubProps {
  faqs: MasterFAQ[];
}

const CATEGORIES = [
  { id: "ALL", label: "All Questions" },
  { id: "VALUATION", label: "Valuation & Pricing" },
  { id: "CONDITIONS", label: "Broken & Damaged Phones" },
  { id: "DEAD_DEVICES", label: "Dead Devices" },
  { id: "DATA_PRIVACY", label: "Data Safety & Reset" },
  { id: "COMPETITORS", label: "Selling Comparisons" },
  { id: "LAPTOPS", label: "Laptops & MacBooks" },
  { id: "TABLETS", label: "Tablets & iPads" },
  { id: "SAFETY_SCAMS", label: "Scam Prevention" },
  { id: "LOCAL_CITIES", label: "City Coverage" },
  { id: "UPGRADE_TIMING", label: "Upgrade Timing" },
  { id: "GAMING", label: "PS5 & Gaming" },
];

export function FAQClientHub({ faqs }: FAQClientHubProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("ALL");
  const [openId, setOpenId] = useState<string | null>("faq-what-is-buyback");

  const filteredFaqs = useMemo(() => {
    return faqs.filter((faq) => {
      const matchesCategory =
        selectedCategory === "ALL" || faq.category === selectedCategory;

      if (!searchQuery.trim()) return matchesCategory;

      const q = searchQuery.toLowerCase();
      const inQuestion = faq.question.toLowerCase().includes(q);
      const inAnswer = faq.answer.toLowerCase().includes(q);
      const inTags = faq.tags.some((tag) => tag.toLowerCase().includes(q));

      return matchesCategory && (inQuestion || inAnswer || inTags);
    });
  }, [faqs, selectedCategory, searchQuery]);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* HEADER SECTION */}
      <div className="text-center max-w-2xl mx-auto mb-10">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-brand-yellow/15 border border-brand-yellow/30 text-xs font-black text-brand-black mb-4 uppercase tracking-wider">
          <HelpCircle className="w-3.5 h-3.5 text-brand-black" />
          <span>Knowledge & Answer Center</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-brand-black tracking-tight leading-tight">
          Frequently Asked Questions
        </h1>
        <p className="text-sm sm:text-base text-brand-muted mt-3">
          Instant authoritative answers for selling old smartphones, laptops, damaged screens, data security, and instant payouts.
        </p>

        {/* SEARCH BAR */}
        <div className="mt-8 relative max-w-xl mx-auto">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
            <Search className="w-5 h-5" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search questions (e.g., broken screen, data wipe, dead laptop, no bill)..."
            className="w-full pl-11 pr-4 py-3.5 bg-white border-2 border-brand-border rounded-2xl text-sm sm:text-base font-medium placeholder-gray-400 focus:outline-none focus:border-brand-black focus:ring-1 focus:ring-brand-black shadow-sm transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute inset-y-0 right-0 pr-4 flex items-center text-xs font-bold text-gray-400 hover:text-black"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* CATEGORY PILLS */}
      <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 scrollbar-none">
        {CATEGORIES.map((cat) => {
          const isSelected = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all ${
                isSelected
                  ? "bg-brand-black text-white shadow-sm"
                  : "bg-white border border-brand-border text-brand-muted hover:text-brand-black hover:border-brand-black/40"
              }`}
            >
              {cat.label}
            </button>
          );
        })}
      </div>

      {/* RESULTS COUNT */}
      <div className="flex items-center justify-between text-xs font-bold text-brand-muted mb-4 px-1">
        <span>Showing {filteredFaqs.length} questions</span>
        {searchQuery && <span>Filter: &quot;{searchQuery}&quot;</span>}
      </div>

      {/* FAQ ACCORDION LIST */}
      {filteredFaqs.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-brand-border space-y-4">
          <p className="text-base font-bold text-brand-black">No questions found matching your search.</p>
          <p className="text-xs text-brand-muted">Try using broader search terms like &quot;screen&quot;, &quot;pickup&quot;, or &quot;laptop&quot;.</p>
          <button
            onClick={() => {
              setSearchQuery("");
              setSelectedCategory("ALL");
            }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-brand-yellow font-bold text-xs hover:bg-brand-yellow/80"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="space-y-3.5">
          {filteredFaqs.map((faq) => {
            const isOpen = openId === faq.id;
            return (
              <div
                key={faq.id}
                className="bg-white rounded-2xl border border-brand-border overflow-hidden transition-all shadow-sm hover:border-brand-black/30"
              >
                <button
                  onClick={() => setOpenId(isOpen ? null : faq.id)}
                  className="w-full flex items-center justify-between p-5 text-left font-extrabold text-sm sm:text-base text-brand-black hover:text-black focus:outline-none gap-4"
                >
                  <span className="leading-snug">{faq.question}</span>
                  <div className="w-8 h-8 rounded-full bg-brand-bg flex items-center justify-center shrink-0 border border-brand-border">
                    <ChevronDown
                      className={`w-4 h-4 text-brand-black transition-transform duration-200 ${
                        isOpen ? "rotate-180" : ""
                      }`}
                    />
                  </div>
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 text-xs sm:text-sm text-brand-black/80 leading-relaxed border-t border-brand-border/40 pt-4 space-y-3">
                    <p>{faq.answer}</p>
                    <div className="flex flex-wrap items-center gap-1.5 pt-2">
                      <span className="text-[10px] font-black uppercase text-brand-muted tracking-wider mr-1">
                        Topic:
                      </span>
                      {faq.tags.slice(0, 4).map((tag, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 rounded-md bg-brand-bg text-[10px] font-semibold text-brand-muted border border-brand-border/60"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* QUICK VALUE PROPOSITION CTA */}
      <div className="mt-14 bg-brand-black rounded-3xl p-8 sm:p-10 text-white text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 text-brand-yellow font-black text-xs uppercase tracking-wider">
            <Zap className="w-4 h-4" />
            <span>Ready to sell your device?</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-white">
            Get an instant quote with up to 5% higher price
          </h3>
          <p className="text-xs sm:text-sm text-gray-300 max-w-xl">
            Free doorstep evaluation, zero convenience charges, and instant on-the-spot UPI payment.
          </p>
        </div>
        <Link
          href="/sell"
          className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-brand-yellow text-brand-black font-black text-sm hover:bg-yellow-400 transition-colors shrink-0 shadow-lg"
        >
          <span>Calculate Price Now</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
