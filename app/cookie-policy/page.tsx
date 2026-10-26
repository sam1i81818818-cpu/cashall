import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Cookie, ShieldCheck, Settings, CheckCircle2 } from "lucide-react";

export const metadata: Metadata = {
  title: "Cookie Policy | CashALL (Aarna Enterprise)",
  description:
    "CashALL's cookie policy explaining how we use session cookies, essential storage, and telemetry to power device valuations and orders.",
  alternates: {
    canonical: "https://www.cashall.in/cookie-policy",
  },
  openGraph: {
    title: "Cookie Policy | CashALL (Aarna Enterprise)",
    description:
      "CashALL's cookie policy explaining how we use session cookies, essential storage, and telemetry to power device valuations and orders.",
    url: "https://www.cashall.in/cookie-policy",
  },
};

export default function CookiePolicyPage() {
  return (
    <div className="min-h-screen flex flex-col bg-brand-bg text-brand-black">
      <Header />
      <main className="flex-grow py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="bg-white rounded-3xl p-6 sm:p-10 border border-brand-border shadow-premium space-y-8 text-xs sm:text-sm text-brand-muted leading-relaxed">
            
            {/* HEADER */}
            <div className="border-b border-gray-100 pb-6 space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-yellow/20 text-brand-black text-xs font-bold">
                <Cookie className="w-3.5 h-3.5" />
                Transparency &amp; Cookies
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-brand-black tracking-tight">
                CashALL Cookie Policy
              </h1>
              <p className="text-xs text-brand-muted">
                Effective Date: January 1, 2026 • Operated by Aarna Enterprise
              </p>
            </div>

            <section className="space-y-3">
              <h2 className="text-base sm:text-lg font-black text-brand-black">1. What Are Cookies?</h2>
              <p>
                Cookies and browser local storage entries are small text files stored on your computer or mobile device when you browse websites. They enable the CashALL web application to remember your selected device, diagnostic condition answers, doorstep serviceability location, and active quote state.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-base sm:text-lg font-black text-brand-black">2. Categories of Cookies We Use</h2>
              
              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-gray-50 border border-brand-border space-y-1.5">
                  <h3 className="font-bold text-brand-black flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    Essential &amp; Operational Cookies (Strictly Necessary)
                  </h3>
                  <p className="text-xs">
                    These cookies are necessary for core site navigation, order tracking, authentication sessions, and security protection. They cannot be disabled without compromising platform functionality. Examples include session authentication tokens and current device quote draft persistence.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-gray-50 border border-brand-border space-y-1.5">
                  <h3 className="font-bold text-brand-black flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-brand-yellow" />
                    Functional &amp; Preference Cookies
                  </h3>
                  <p className="text-xs">
                    These cookies allow CashALL to remember choices you make, such as your selected city (Kolkata, Howrah, etc.) and diagnostic answers across different tabs, saving you from re-entering specifications.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-gray-50 border border-brand-border space-y-1.5">
                  <h3 className="font-bold text-brand-black flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-blue-600" />
                    Analytical &amp; Telemetry Cookies
                  </h3>
                  <p className="text-xs">
                    We collect aggregated, anonymized usage telemetry to measure page speed, identify broken links, and optimize device evaluation steps. We never correlate marketing telemetry with personal banking details.
                  </p>
                </div>
              </div>
            </section>

            <section className="space-y-3">
              <h2 className="text-base sm:text-lg font-black text-brand-black">3. How Can You Manage Cookies?</h2>
              <p>
                Most modern web browsers allow you to control cookie settings through their preferences menu. You can configure your browser to reject all cookies or notify you when a cookie is being saved. Note that blocking essential cookies may prevent the device valuation calculator and checkout process from functioning properly.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-base sm:text-lg font-black text-brand-black">4. Contact Our Privacy Team</h2>
              <p>
                If you have questions regarding our cookie practices, please contact us at{" "}
                <a href="mailto:support@cashall.in" className="text-brand-black font-semibold hover:underline">
                  support@cashall.in
                </a>{" "}
                or call our hotline at <a href="tel:+917604092333" className="text-brand-black font-semibold hover:underline">+91 7604092333</a>.
              </p>
            </section>

          </div>

        </div>
      </main>
      <Footer />
    </div>
  );
}
