"use client";

import React, { useState } from "react";
import { ChevronDown } from "lucide-react";

interface ModelFaqSectionProps {
  brandName: string;
  modelName: string;
  minPrice: number;
  maxPrice: number;
  category?: "MOBILE" | "LAPTOP" | "TABLET" | string;
}

export function ModelFaqSection({
  brandName,
  modelName,
  minPrice,
  maxPrice,
  category = "MOBILE",
}: ModelFaqSectionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const displayName = modelName.toLowerCase().startsWith(brandName.toLowerCase())
    ? modelName
    : `${brandName} ${modelName}`;

  const isLaptop = category.toUpperCase() === "LAPTOP";
  const isTablet = category.toUpperCase() === "TABLET";
  const deviceTypeLabel = isLaptop ? "laptop" : isTablet ? "tablet" : "phone";

  const faqs = isLaptop
    ? [
        {
          question: `Where can I sell my ${displayName} laptop for instant cash in India?`,
          answer: `You can sell your ${displayName} laptop online on CashALL with 100% free doorstep pickup across Kolkata, Howrah, Gorakhpur, and surrounding hubs. Simply select your processor, RAM, and SSD storage configuration, answer a few quick condition questions to get a guaranteed locked quote, and our verified evaluation agent will visit your home or office to inspect the laptop and transfer instant payment directly to your UPI or bank account before taking the device.`,
        },
        {
          question: `How much is my used ${displayName} worth today?`,
          answer: `A used ${displayName} on CashALL has an estimated buyback value ranging from ₹${minPrice.toLocaleString("en-IN")} up to ₹${maxPrice.toLocaleString("en-IN")}, depending on your laptop's processor generation, RAM capacity, SSD health, display condition, physical chassis condition, battery cycle count, and whether you include the original working power adapter and box.`,
        },
        {
          question: `How does CashALL handle data privacy and SSD wiping on my ${displayName}?`,
          answer: `Data security is our non-negotiable priority. When you sell your ${displayName} to CashALL, our technician performs a DPDP-compliant on-site cryptographic disk sanitization right in front of you. Once erased, we issue an official timestamped digital Bill of Sale linking the laptop's serial number, completely severing your legal liability.`,
        },
        {
          question: `Can I sell a ${displayName} with a dead battery, damaged screen, or broken hinge?`,
          answer: `Yes! CashALL purchases laptops in all functional and physical conditions, including laptops with degraded battery health, broken display hinges, cracked screens, faulty trackpads, or keyboard defects. Transparent algorithmic deductions are shown upfront before you confirm your order.`,
        },
        {
          question: `How should I prepare my ${displayName} laptop before the pickup agent arrives?`,
          answer: `Before handover: 1) Back up your personal files, work data, and browser profiles to an external drive or cloud storage. 2) Sign out of all personal accounts (Apple ID/iCloud on Mac, Microsoft Account on Windows) and remove any BIOS/BitLocker or firmware passwords. 3) Keep your original charger/power adapter, power cord, and invoice ready if available to claim full value.`,
        },
      ]
    : [
        {
          question: `Where can I sell my ${displayName} for instant cash in India?`,
          answer: `You can sell your ${displayName} online on CashALL with free doorstep pickup across Kolkata, Howrah, Gorakhpur, and surrounding hubs. Simply select your storage variant, answer a few quick condition questions to get a guaranteed quote, and our verified evaluation agent will visit your location to inspect the phone and transfer instant payment to your UPI or bank account before taking the device.`,
        },
        {
          question: `How much is my used ${displayName} worth today?`,
          answer: `A used ${displayName} on CashALL has an estimated buyback value ranging from ₹${minPrice.toLocaleString("en-IN")} up to ₹${maxPrice.toLocaleString("en-IN")}, depending on your phone's storage capacity, screen condition, physical scratches, functional performance (touch, camera, battery, biometrics), and original accessories (box and invoice).`,
        },
        {
          question: `What is the step-by-step process to sell my ${displayName} on CashALL?`,
          answer: `Selling your ${displayName} takes only 3 simple steps: 1) Select your phone's storage variant and answer basic functional questions. 2) Lock your valuation quote and choose a convenient doorstep pickup date and time. 3) Our verified agent verifies the device at your doorstep, performs a certified data wipe, and transfers your payment via instant UPI or IMPS bank transfer on the spot.`,
        },
        {
          question: `Can I sell a damaged or cracked screen ${displayName}?`,
          answer: `Yes! CashALL buys ${displayName} units in all physical states, including minor scratches, deep body dents, cracked display glass, dead pixels, non-working touchscreens, or battery degradation. Transparent deduction rules are applied automatically so you receive a fair price without any surprise haggling at your doorstep.`,
        },
        {
          question: `How should I prepare my ${displayName} before handing it over?`,
          answer: `Before handover: 1) Back up your personal photos, chats, and files to cloud or laptop. 2) Sign out of all personal accounts (Google Account, Apple ID / iCloud, Samsung Account, etc.) and remove your screen lock PIN/passcode. 3) Remove your physical SIM card and MicroSD card. 4) Keep original charger, box, and bill ready if available to claim bonus value. CashALL will also conduct an on-site certified data wipe and hand you an official digital Bill of Sale.`,
        },
      ];

  const jsonLdFaq = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map((faq) => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer,
      },
    })),
  };

  return (
    <section className="bg-white rounded-3xl p-6 sm:p-10 border border-neutral-200/90 shadow-[0_2px_16px_-4px_rgba(0,0,0,0.04)] space-y-6">
      {/* FAQ Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdFaq) }}
      />

      <div>
        <h2 className="text-xl sm:text-2xl font-black text-brand-black tracking-tight">
          Frequently asked questions
        </h2>
        <p className="text-xs sm:text-sm text-neutral-500 mt-1">
          Pricing, pickup, and secure payments for {displayName} &mdash; answered.
        </p>
      </div>

      <div className="divide-y divide-neutral-100 border-t border-neutral-100">
        {faqs.map((faq, idx) => {
          const isOpen = openIndex === idx;
          return (
            <div key={idx} className="py-4">
              <button
                onClick={() => setOpenIndex(isOpen ? null : idx)}
                className="w-full flex items-center justify-between text-left gap-4 group"
                aria-expanded={isOpen}
              >
                <span className="text-sm font-bold text-neutral-900 group-hover:text-black">
                  {faq.question}
                </span>
                <span className={`p-1 rounded-lg text-neutral-400 group-hover:text-neutral-900 transition-transform ${isOpen ? "rotate-180" : ""}`}>
                  <ChevronDown className="w-4 h-4" />
                </span>
              </button>

              {isOpen && (
                <div className="pt-3 text-xs sm:text-sm text-neutral-600 leading-relaxed animate-fadeIn">
                  {faq.answer}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
