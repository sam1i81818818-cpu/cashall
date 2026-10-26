"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ChevronDown, ArrowRight } from "lucide-react";
import { INITIAL_FAQS } from "@/lib/store";

export function FAQAccordion() {
  const [openId, setOpenId] = useState<string | null>("faq-1");
  const topFaqs = INITIAL_FAQS.slice(0, 3);

  return (
    <section className="py-16 sm:py-20 bg-white border-t border-slate-200/80">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-xl mx-auto mb-10">
          <h2 className="font-heading text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Frequently Asked Questions
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-2 font-normal leading-relaxed">
            Everything you need to know about transparent device valuation and doorstep payout.
          </p>
        </div>

        <div className="space-y-3">
          {topFaqs.map((faq) => {
            const isOpen = openId === faq.id;
            return (
              <div
                key={faq.id}
                className="bg-slate-50/50 rounded-2xl border border-slate-200/80 overflow-hidden transition-all duration-200 hover:border-slate-300"
              >
                <button
                  onClick={() => setOpenId(isOpen ? null : faq.id)}
                  className="w-full flex items-center justify-between p-4 sm:p-5 text-left font-extrabold text-sm sm:text-base text-slate-900 hover:text-black focus:outline-none cursor-pointer"
                >
                  <span>{faq.question}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-slate-400 shrink-0 transition-transform duration-200 ${
                      isOpen ? "rotate-180 text-emerald-600" : ""
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-200/60 pt-3 font-normal">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="mt-8 text-center">
          <Link
            href="/faq"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-slate-950 hover:bg-slate-900 text-white text-xs sm:text-sm font-extrabold shadow-xs transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
          >
            <span>View All Frequently Asked Questions</span>
            <ArrowRight className="w-4 h-4 text-brand-yellow" />
          </Link>
        </div>

      </div>
    </section>
  );
}
