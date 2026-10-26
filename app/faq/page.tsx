import React from "react";
import type { Metadata } from "next";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { MASTER_FAQS } from "@/lib/faqs";
import { FAQClientHub } from "./FAQClientHub";

export const metadata: Metadata = {
  title: "Frequently Asked Questions (FAQ) | Sell Old Phone, Laptop & Tablet | CashALL",
  description:
    "Get instant answers to all questions about selling old phones, broken screens, dead laptops, pricing calculations, platform comparisons, data wiping, and doorstep pickup.",
  keywords: [
    "cashall faq",
    "sell old phone faq",
    "can I sell broken phone",
    "can I sell dead phone",
    "sell phone without bill or box",
    "platform comparison faq",
    "how to wipe phone before selling",
    "phone resale value calculator",
    "phone selling scams",
    "doorstep phone pickup Kolkata",
    "sell laptop for cash faq"
  ],
  alternates: {
    canonical: "https://www.cashall.in/faq",
  },
  openGraph: {
    title: "Frequently Asked Questions (FAQ) | CashALL Master Knowledge Base",
    description:
      "Find comprehensive answers for selling old smartphones, damaged laptops, iPads, data security, and instant payment on CashALL.",
    url: "https://www.cashall.in/faq",
    images: ["/photos/CashALL_logo.png"],
  },
};

export default function FAQPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        "@id": "https://www.cashall.in/faq#breadcrumb",
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
            "name": "Frequently Asked Questions",
            "item": "https://www.cashall.in/faq"
          }
        ]
      },
      {
        "@type": "FAQPage",
        "@id": "https://www.cashall.in/faq#faqpage",
        "mainEntity": MASTER_FAQS.map((item) => ({
          "@type": "Question",
          "name": item.question,
          "acceptedAnswer": {
            "@type": "Answer",
            "text": item.answer
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
      <main className="flex-grow py-12 sm:py-16">
        <FAQClientHub faqs={MASTER_FAQS} />
      </main>
      <Footer />
    </div>
  );
}
