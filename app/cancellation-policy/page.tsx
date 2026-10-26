import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { XCircle, CheckCircle2, ShieldCheck, HelpCircle, Phone, ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Cancellation Policy | CashALL (Aarna Enterprise)",
  description:
    "CashALL's cancellation policy: 100% free doorstep cancellations, zero fee, zero hassle, and seller control.",
  alternates: {
    canonical: "https://www.cashall.in/cancellation-policy",
  },
  openGraph: {
    title: "Cancellation Policy | CashALL (Aarna Enterprise)",
    description:
      "CashALL's cancellation policy: 100% free doorstep cancellations, zero fee, zero hassle, and seller control.",
    url: "https://www.cashall.in/cancellation-policy",
  },
};

export default function CancellationPolicyPage() {
  return (
    <div className="min-h-screen flex flex-col bg-brand-bg text-brand-black">
      <Header />
      <main className="flex-grow py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="bg-white rounded-3xl p-6 sm:p-10 border border-brand-border shadow-premium space-y-8 text-xs sm:text-sm text-brand-muted leading-relaxed">
            
            {/* HEADER */}
            <div className="border-b border-gray-100 pb-6 space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-yellow/20 text-brand-black text-xs font-bold">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Zero-Hassle Seller Guarantee
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-brand-black tracking-tight">
                CashALL Cancellation Policy
              </h1>
              <p className="text-xs text-brand-muted">
                Effective Date: January 1, 2026 • Operated by Aarna Enterprise
              </p>
            </div>

            <section className="space-y-3">
              <h2 className="text-base sm:text-lg font-black text-brand-black">1. Zero Cancellation Fees (₹0 at All Times)</h2>
              <p>
                At CashALL, we respect your freedom of choice. You can cancel your order at any stage prior to device handover with <strong>absolutely zero cancellation fee or financial penalty</strong>:
              </p>
              <ul className="list-disc pl-5 space-y-1.5 text-xs">
                <li><strong>Pre-Dispatch Cancellation:</strong> You may cancel anytime before the agent arrives with one simple call or message.</li>
                <li><strong>On-Site Doorstep Cancellation:</strong> If our field technician inspects your device and proposes a revised re-quote due to condition discrepancies that you do not agree with, you can decline immediately. The agent will hand your phone back, thank you for your time, and depart with <strong>₹0 charged</strong>.</li>
              </ul>
            </section>

            <section className="space-y-3">
              <h2 className="text-base sm:text-lg font-black text-brand-black">2. How to Cancel Your Order</h2>
              <p>
                To cancel an active booking, you have three immediate options:
              </p>
              <ul className="list-disc pl-5 space-y-1.5 text-xs">
                <li><strong>Direct Call:</strong> Call our customer desk at <a href="tel:+917604092333" className="text-brand-black font-semibold hover:underline">+91 7604092333</a> with your order number.</li>
                <li><strong>WhatsApp:</strong> Send a quick message to our verified WhatsApp support desk mentioning your order reference.</li>
                <li><strong>To the Agent Directly:</strong> When the agent calls you before arrival, simply inform them that you wish to cancel or reschedule.</li>
              </ul>
            </section>

            <section className="space-y-3">
              <h2 className="text-base sm:text-lg font-black text-brand-black">3. When Can a Sale NOT Be Cancelled?</h2>
              <p>
                Once physical inspection is completed, both parties agree to the final price, the factory data reset is performed, and payment is credited to your bank account or UPI handle, <strong>the sale is officially concluded and irreversible</strong>. Because devices enter our refurbishment and parts sorting stream immediately, items cannot be retrieved or returned once payment has cleared.
              </p>
            </section>

            <section className="space-y-3 p-5 rounded-2xl bg-gray-50 border border-brand-border flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <h3 className="font-bold text-brand-black text-sm">Have Questions Regarding an Active Order?</h3>
                <p className="text-xs text-brand-muted">Our customer support team is available 7 days a week, 9 AM to 9 PM.</p>
              </div>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-yellow text-brand-black font-bold text-xs hover:bg-brand-yellowHover transition shrink-0"
              >
                Contact Support Desk
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </section>

          </div>

        </div>
      </main>
      <Footer />
    </div>
  );
}
