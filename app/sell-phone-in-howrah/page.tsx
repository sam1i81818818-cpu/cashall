import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import {
  Smartphone,
  CheckCircle2,
  MapPin,
  Clock,
  ShieldCheck,
  Zap,
  ArrowRight,
  PhoneCall,
  BadgeCheck,
  Building2,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Sell Old Phone in Howrah | Instant Cash & Free Doorstep Pickup | CashALL",
  description:
    "Sell your used smartphone online in Howrah for fair market value. Free doorstep pickup across Bally, Belur, Liluah, Shibpur, Salkia, Santragachi & Kadamtala. Instant UPI cash payout & certified data wipe.",
  keywords: [
    "sell old phone in howrah",
    "sell used phone howrah",
    "best place to sell old phone in howrah",
    "best phone selling platform howrah",
    "sell phone bally howrah",
    "sell phone liluah howrah",
    "sell phone shibpur howrah",
    "sell phone salkia howrah",
    "sell second hand mobile howrah",
    "doorstep phone selling howrah",
    "instant cash for phone howrah",
    "sell old iphone howrah",
    "sell used samsung phone howrah",
    "old phone buyback howrah west bengal",
  ],
  alternates: {
    canonical: "https://www.cashall.in/sell-phone-in-howrah",
  },
  openGraph: {
    title: "Sell Old Phone in Howrah | Instant Cash & Free Pickup | CashALL",
    description:
      "Get fair market cash for your old smartphone in Howrah. Free doorstep evaluation across Bally, Belur, Liluah, Shibpur, zero hidden deductions, and instant payment.",
    url: "https://www.cashall.in/sell-phone-in-howrah",
    images: ["/photos/CashALL_logo.png"],
  },
};

const HOWRAH_AREAS = [
  { name: "Bally & Belur", desc: "Express 1-hour doorstep collection from our primary hub" },
  { name: "Liluah & Don Bosco", desc: "Same-day pickup across GT Road & Station road" },
  { name: "Salkia & Golabari", desc: "Free doorstep pickup near Salkia Chowrasta & Aurobindo Road" },
  { name: "Shibpur & Mandirtala", desc: "Pickup near IIEST Shibpur, Avani Riverside & Nabanna" },
  { name: "Kadamtala & Bantra", desc: "Doorstep inspection across Narasingha Dutta road & Ichapur" },
  { name: "Santragachi & Kona Expressway", desc: "Fast pickup near Santragachi Bus Terminus & Station" },
  { name: "Dasnagar & Baltikuri", desc: "Same-day doorstep evaluation across industrial & residential hubs" },
  { name: "Shalimar & Botanical Garden", desc: "Free pickup across Foreshore Road & Shalimar station" },
];

const LOCAL_FAQS = [
  {
    q: "How does CashALL provide free doorstep pickup in Howrah?",
    a: "CashALL's operational logistics center is located directly in Bally, Howrah (PIN 711203). Because our field agents are locally stationed, we provide rapid, zero-cost doorstep pickups within 1 to 2 hours across all Howrah neighborhoods.",
  },
  {
    q: "Can I sell a phone with a broken display or dead screen in Howrah?",
    a: "Yes. CashALL accepts damaged screens, broken back glass, green lines, and non-working devices. Our valuation tool calculates an objective salvage quote and pays cash on the spot.",
  },
  {
    q: "How fast do I receive payment when selling in Howrah?",
    a: "Payment is disbursed immediately upon physical evaluation via UPI (Google Pay, PhonePe, Paytm) or IMPS bank transfer before our technician takes custody of the device.",
  },
  {
    q: "Do I need the original box and invoice to sell my phone in Howrah?",
    a: "While original accessories and bill increase your valuation payout, they are not mandatory. You can sell any phone by presenting a valid government ID (Aadhaar or Voter ID) and completing our statutory ownership declaration.",
  },
];

export default function SellPhoneInHowrahPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "LocalBusiness",
        "@id": "https://www.cashall.in/sell-phone-in-howrah#business",
        "name": "CashALL - Sell Old Phone in Howrah",
        "legalName": "Aarna Enterprise",
        "url": "https://www.cashall.in/sell-phone-in-howrah",
        "logo": "https://www.cashall.in/photos/CashALL_favicon.png",
        "image": "https://www.cashall.in/photos/CashALL_logo.png",
        "telephone": "+917604092333",
        "email": "support@cashall.in",
        "address": {
          "@type": "PostalAddress",
          "streetAddress": "Bally",
          "addressLocality": "Howrah",
          "addressRegion": "West Bengal",
          "postalCode": "711203",
          "addressCountry": "IN",
        },
        "priceRange": "₹1,000 - ₹1,20,000",
      },
      {
        "@type": "FAQPage",
        "@id": "https://www.cashall.in/sell-phone-in-howrah#faq",
        "mainEntity": LOCAL_FAQS.map((item) => ({
          "@type": "Question",
          "name": item.q,
          "acceptedAnswer": {
            "@type": "Answer",
            "text": item.a,
          },
        })),
      },
    ],
  };

  return (
    <div className="min-h-screen flex flex-col bg-brand-bg text-brand-black">
      <Header />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <main className="flex-grow space-y-12 sm:space-y-16 py-8">
        
        {/* HERO SECTION */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-brand-black text-white rounded-3xl p-6 sm:p-12 relative overflow-hidden border border-neutral-800 shadow-2xl">
            <div className="max-w-3xl space-y-6 relative z-10">
              <p className="text-xs font-bold text-brand-yellow uppercase tracking-wider flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5" />
                Howrah Logistics Hub • Bally, Belur, Liluah &amp; Shibpur
              </p>

              <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
                Sell Old Phone in <span className="text-brand-yellow">Howrah</span> for Instant Cash
              </h1>

              <p className="text-sm sm:text-base text-gray-300 leading-relaxed max-w-2xl">
                Get fair market value for your used smartphone with express 1 to 2-hour doorstep collection directly from our Howrah logistics center. Instant UPI payment before handover and 100% free certified data wipe.
              </p>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
                <Link
                  href="/sell-old-mobile-phone"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl bg-brand-yellow text-brand-black font-extrabold text-sm hover:bg-brand-yellowHover transition shadow-yellowGlow active:scale-95"
                >
                  <Smartphone className="w-5 h-5" />
                  Check Your Phone&apos;s Price
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <a
                  href="tel:+917604092333"
                  className="inline-flex items-center justify-center gap-2 px-6 py-4 rounded-2xl bg-white/10 text-white font-bold text-sm hover:bg-white/20 transition border border-white/15"
                >
                  <PhoneCall className="w-4 h-4 text-brand-yellow" />
                  Call Howrah Hub: +91 7604092333
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* HOWRAH SERVICE LOCALITIES */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <h2 className="text-2xl sm:text-3xl font-black text-brand-black">
              Serviceable Neighborhoods in Howrah
            </h2>
            <p className="text-xs sm:text-sm text-brand-muted">
              Our doorstep pickup technicians operate across all municipal wards of Howrah and Bally
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {HOWRAH_AREAS.map((area, idx) => (
              <div
                key={idx}
                className="bg-white rounded-2xl p-5 border border-brand-border shadow-subtleCard space-y-2 hover:border-brand-yellow/60 transition"
              >
                <div className="w-8 h-8 rounded-xl bg-brand-yellow/15 flex items-center justify-center text-brand-black font-bold">
                  <MapPin className="w-4 h-4 text-brand-black" />
                </div>
                <h3 className="font-extrabold text-sm text-brand-black">{area.name}</h3>
                <p className="text-xs text-brand-muted leading-relaxed">{area.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* FAQS */}
        <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="text-center space-y-2">
            <h2 className="text-2xl sm:text-3xl font-black text-brand-black">
              Frequently Asked Questions (Howrah)
            </h2>
            <p className="text-xs sm:text-sm text-brand-muted">
              Everything you need to know about selling your used mobile phone in Howrah
            </p>
          </div>

          <div className="space-y-3">
            {LOCAL_FAQS.map((faq, idx) => (
              <div
                key={idx}
                className="bg-white rounded-2xl p-5 border border-brand-border shadow-subtleCard space-y-2"
              >
                <h3 className="font-bold text-sm text-brand-black flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  {faq.q}
                </h3>
                <p className="text-xs text-brand-muted leading-relaxed pl-6">{faq.a}</p>
              </div>
            ))}
          </div>
        </section>

      </main>
      <Footer />
    </div>
  );
}
