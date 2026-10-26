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
} from "lucide-react";

export const metadata: Metadata = {
  title: "Sell Old Phone in Gorakhpur | Instant Cash & Doorstep Pickup | CashALL",
  description:
    "Sell your used smartphone online in Gorakhpur for fair market value. Free doorstep pickup across Golghar, Betiahata, Medical Road, Mohaddipur & Taramandal. Instant UPI cash payout & certified data wipe.",
  keywords: [
    "sell old phone in gorakhpur",
    "sell used phone gorakhpur",
    "best place to sell old phone in gorakhpur",
    "best phone selling platform gorakhpur",
    "sell phone golghar gorakhpur",
    "sell phone betiahata gorakhpur",
    "sell phone medical college gorakhpur",
    "sell phone mohaddipur gorakhpur",
    "sell second hand mobile gorakhpur",
    "doorstep phone selling gorakhpur",
    "instant cash for phone gorakhpur uttar pradesh",
    "old phone buyback gorakhpur",
  ],
  alternates: {
    canonical: "https://www.cashall.in/sell-phone-in-gorakhpur",
  },
  openGraph: {
    title: "Sell Old Phone in Gorakhpur | Instant Cash & Free Pickup | CashALL",
    description:
      "Get fair market cash for your old smartphone in Gorakhpur. Free doorstep evaluation across Golghar, Betiahata, Medical College, zero hidden fees, and instant UPI payout.",
    url: "https://www.cashall.in/sell-phone-in-gorakhpur",
    images: ["/photos/CashALL_logo.png"],
  },
};

const GORAKHPUR_AREAS = [
  { name: "Golghar & City Center", desc: "Express doorstep collection across City Mall & Park Road" },
  { name: "Betiahata & Civil Lines", desc: "Same-day doorstep evaluation in central residential localities" },
  { name: "Medical College Road & Asuran", desc: "Fast pickup near BRD Medical College & Asuran Chowk" },
  { name: "Mohaddipur & University Area", desc: "Doorstep pickup near DDU Gorakhpur University & Four-lane" },
  { name: "Taramandal & Nauka Vihar", desc: "Free pickup across Ramgarh Taal & tourist complex zones" },
  { name: "Basharatpur & Shahpur", desc: "Doorstep inspection across Medical College connector roads" },
  { name: "Rustampur & Transport Nagar", desc: "Fast doorstep collection across South Gorakhpur" },
  { name: "Railway Station & Dharamshala", desc: "Pickup near Junction & Gorakhnath Temple road" },
];

const LOCAL_FAQS = [
  {
    q: "Does CashALL provide doorstep pickup across Gorakhpur?",
    a: "Yes. CashALL has a dedicated field technician network serving Gorakhpur city and nearby regions, providing fast, free doorstep pickups at your home or office.",
  },
  {
    q: "How do I receive payment when selling my device in Gorakhpur?",
    a: "Our technician evaluates your device on the spot and immediately transfers the agreed amount to your UPI ID (Google Pay, PhonePe, Paytm) or bank account before taking the device.",
  },
  {
    q: "Can I sell a broken or damaged mobile phone in Gorakhpur?",
    a: "Yes. CashALL purchases cracked screens, non-working buttons, camera faults, and dead mobile devices. You receive an honest salvage quote with zero hassle.",
  },
  {
    q: "Is doorstep cancellation free in Gorakhpur?",
    a: "Yes, 100% free. If our technician proposes a re-quote that you do not agree with, you can decline immediately with ₹0 fee or charge.",
  },
];

export default function SellPhoneInGorakhpurPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "LocalBusiness",
        "@id": "https://www.cashall.in/sell-phone-in-gorakhpur#business",
        "name": "CashALL - Sell Old Phone in Gorakhpur",
        "legalName": "Aarna Enterprise",
        "url": "https://www.cashall.in/sell-phone-in-gorakhpur",
        "logo": "https://www.cashall.in/photos/CashALL_favicon.png",
        "image": "https://www.cashall.in/photos/CashALL_logo.png",
        "telephone": "+917604092333",
        "email": "support@cashall.in",
        "address": {
          "@type": "PostalAddress",
          "addressLocality": "Gorakhpur",
          "addressRegion": "Uttar Pradesh",
          "postalCode": "273001",
          "addressCountry": "IN",
        },
        "priceRange": "₹1,000 - ₹1,20,000",
      },
      {
        "@type": "FAQPage",
        "@id": "https://www.cashall.in/sell-phone-in-gorakhpur#faq",
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
                Gorakhpur Hub • Golghar, Betiahata, Medical Road &amp; Mohaddipur
              </p>

              <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
                Sell Old Phone in <span className="text-brand-yellow">Gorakhpur</span> for Instant Cash
              </h1>

              <p className="text-sm sm:text-base text-gray-300 leading-relaxed max-w-2xl">
                Get fair market value for your used smartphone with convenient doorstep collection in Gorakhpur. Instant UPI payout before handover and 100% free certified on-site data wipe.
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
                  Call Support: +91 7604092333
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* GORAKHPUR SERVICE LOCALITIES */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <h2 className="text-2xl sm:text-3xl font-black text-brand-black">
              Serviceable Neighborhoods in Gorakhpur
            </h2>
            <p className="text-xs sm:text-sm text-brand-muted">
              Doorstep pickup technicians operating across all municipal wards of Gorakhpur
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {GORAKHPUR_AREAS.map((area, idx) => (
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
              Frequently Asked Questions (Gorakhpur)
            </h2>
            <p className="text-xs sm:text-sm text-brand-muted">
              Everything you need to know about selling your used mobile phone in Gorakhpur
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
