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
  Sparkles,
  HelpCircle,
  TrendingUp,
  Scale,
  Award,
  ChevronRight,
  Laptop,
  Tablet
} from "lucide-react";

export const metadata: Metadata = {
  title: "Sell Used Phone Online | Second Hand Mobile Price Calculator & Doorstep Cash | CashALL",
  description:
    "Sell your used phone online at CashALL for the highest market price. Instant quote in 60 seconds with our second hand mobile price calculator, free doorstep pickup in 24 hours, zero hidden deductions, and direct UPI payout before handover.",
  keywords: [
    "sell used phone",
    "sell used phone online",
    "sell my old phone",
    "sell my phone",
    "old phone sell online",
    "sell old phone online",
    "second hand mobile",
    "2nd hand mobile phones",
    "used second hand mobile",
    "2 hand mobile phone",
    "mobile price",
    "mobile resale value calculator",
    "used phone price calculator",
    "second hand mobile price check",
    "phone valuation tool online",
    "sell old phone near me",
    "second hand mobile shop near me",
    "cash for phone",
    "refurbished mobiles",
    "second hand iphone",
    "sold old phone",
    "old sell phone",
    "sell old handset",
    "sell old phone Ranchi",
    "sell old phone Kolkata",
    "sell old phone Patna",
    "sell old phone Gorakhpur",
    "best buyback platform alternative",
    "apple trade in alternative"
  ],
  alternates: {
    canonical: "https://www.cashall.in/sell-used-phone",
  },
  openGraph: {
    title: "Sell Used Phone Online for Instant Cash | Second Hand Mobile Price Check | CashALL",
    description:
      "Get up to 5% higher valuation for your used phone. Free doorstep evaluation, certified data wiping, zero hidden charges, and instant UPI payment.",
    url: "https://www.cashall.in/sell-used-phone",
    images: ["/photos/CashALL_logo.png"],
  },
};

const POPULAR_BRANDS = [
  { name: "Apple iPhone", slug: "apple", popular: "iPhone 11 to 16 Pro Max, 17 Pro", href: "/sell-old-mobile-phone/apple" },
  { name: "Samsung Galaxy", slug: "samsung", popular: "S21 to S25 Ultra, Z Fold/Flip", href: "/sell-old-mobile-phone/samsung" },
  { name: "OnePlus", slug: "oneplus", popular: "OnePlus 9 to 13, Nord Series", href: "/sell-old-mobile-phone/oneplus" },
  { name: "Xiaomi / Redmi", slug: "xiaomi", popular: "Note 10 to 14 Pro, Mi Series", href: "/sell-old-mobile-phone/xiaomi" },
  { name: "Vivo", slug: "vivo", popular: "V25 to V40, X80 to X100 Pro", href: "/sell-old-mobile-phone/vivo" },
  { name: "Oppo", slug: "oppo", popular: "Reno 8 to 12, Find Series", href: "/sell-old-mobile-phone/oppo" },
  { name: "Realme", slug: "realme", popular: "GT Series, Number Series", href: "/sell-old-mobile-phone/realme" },
  { name: "Google Pixel", slug: "google", popular: "Pixel 6 to 9 Pro XL", href: "/sell-old-mobile-phone/google" },
  { name: "Motorola", slug: "motorola", popular: "Edge & Razr Series", href: "/sell-old-mobile-phone/motorola" },
];

const SERVICE_REGIONS = [
  { state: "West Bengal", cities: "Kolkata, Howrah, Hooghly, Barrackpore", eta: "Within 2 to 4 Hours" },
  { state: "Uttar Pradesh", cities: "Gorakhpur, Ballia", eta: "Same Day / 24 Hours" },
  { state: "Bihar", cities: "Patna", eta: "Same Day / 24 Hours" },
  { state: "Jharkhand", cities: "Ranchi", eta: "Same Day / 24 Hours" },
];

const FAQS = [
  {
    q: "How does CashALL's second hand mobile price calculator work?",
    a: "Our algorithmic price calculator evaluates your phone's exact brand, model, storage, screen status, battery wear, and camera functionality against live secondary market demand. You get a transparent, locked quote in under 60 seconds with ₹0 pickup fees and zero surprise deductions at your doorstep."
  },
  {
    q: "How can I sell my used phone online on CashALL?",
    a: "Selling your used phone takes 3 simple steps: 1) Select your brand and model, 2) Answer a few quick condition questions to get an instant guaranteed quote, and 3) Schedule a free doorstep pickup. Our field executive inspects the phone at your home and transfers cash to your UPI or bank account before taking the device."
  },
  {
    q: "Why should I choose CashALL over other brands or exchange programs?",
    a: "Unlike other brands and aggregators, CashALL charges ₹0 pickup fees (no ₹99–₹199 convenience charges), offers up to 5% higher base valuations, conducts transparent on-the-spot physical inspection without arbitrary quote-halving, and pays you full cash directly instead of delayed gift cards or exchange vouchers."
  },
  {
    q: "Can I sell my used phone in Ranchi, Patna, Kolkata, and UP?",
    a: "Yes! CashALL offers free doorstep pickup across Kolkata, Howrah, Hooghly, Barrackpore, Ranchi (Jharkhand), Patna (Bihar), Gorakhpur (UP), and Ballia (UP). Our agent visits your address, inspects your device, and makes payment immediately."
  },
  {
    q: "Is CashALL safe? What happens to my private data?",
    a: "CashALL strictly follows international NIST 800-88 compliant digital data sanitization standards. Every device is wiped clean with factory reset verification, and you receive an official legal digital Bill of Sale protecting you against any future liability."
  },
  {
    q: "When and how do I receive payment for my old phone?",
    a: "Payment is instant! Our field agent verifies the condition and initiates an instant bank transfer via UPI (Google Pay, PhonePe, Paytm) or IMPS right in front of you. Handover of the device occurs only after you verify the funds in your account."
  },
  {
    q: "Can I sell dead, broken, or water-damaged used phones?",
    a: "Yes. CashALL purchases used phones in all conditions—from brand-new condition to cracked screens, battery degradation, and non-working motherboards. Our dynamic pricing engine calculates fair scrap and component value."
  }
];

export default function SellUsedPhonePage() {
  const jsonLdFaq = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": FAQS.map((faq) => ({
      "@type": "Question",
      "name": faq.q,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.a
      }
    }))
  };

  const jsonLdService = {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": "Sell Used Phone Online",
    "serviceType": "Electronics Recommerce & Buyback",
    "provider": {
      "@type": "Organization",
      "name": "CashALL",
      "url": "https://www.cashall.in"
    },
    "areaServed": [
      { "@type": "City", "name": "Kolkata" },
      { "@type": "City", "name": "Howrah" },
      { "@type": "City", "name": "Ranchi" },
      { "@type": "City", "name": "Patna" },
      { "@type": "City", "name": "Gorakhpur" },
      { "@type": "City", "name": "Ballia" }
    ],
    "description": "Sell your used smartphone online for highest cash value with free 24h doorstep pickup."
  };

  return (
    <div className="min-h-screen flex flex-col bg-brand-bg text-brand-black">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdFaq) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdService) }}
      />
      
      <Header />

      <main className="flex-grow">
        {/* HERO SECTION */}
        <section className="bg-brand-black text-white pt-12 pb-16 px-4 sm:px-6 lg:px-8 border-b border-brand-yellow/20">
          <div className="max-w-6xl mx-auto">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-xs font-semibold text-gray-400 mb-6">
              <Link href="/" className="hover:text-brand-yellow">Home</Link>
              <ChevronRight className="w-3.5 h-3.5" />
              <Link href="/sell" className="hover:text-brand-yellow">Sell</Link>
              <ChevronRight className="w-3.5 h-3.5" />
              <span className="text-brand-yellow font-bold">Sell Used Phone</span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-8">
                <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white leading-tight">
                  Sell Used Phone Online for <span className="text-brand-yellow">Instant Cash</span>
                </h1>
                <p className="mt-4 text-base sm:text-lg text-gray-300 max-w-2xl leading-relaxed">
                  Get the maximum resale price for your old mobile device. Free 24-hour doorstep inspection, certified data wipe, zero hidden charges, and instant UPI payment before you hand over your phone.
                </p>

                {/* Quick Trust Badges */}
                <div className="mt-6 flex flex-wrap gap-4 text-xs font-semibold text-gray-300">
                  <div className="flex items-center gap-2 bg-white/5 border border-white/10 px-3 py-2 rounded-xl">
                    <span className="w-2 h-2 rounded-full bg-brand-yellow shrink-0" />
                    <span>₹0 Doorstep Pickup Fee</span>
                  </div>
                  <div className="flex items-center gap-2 bg-white/5 border border-white/10 px-3 py-2 rounded-xl">
                    <span className="w-2 h-2 rounded-full bg-brand-yellow shrink-0" />
                    <span>Instant UPI / Bank Payout</span>
                  </div>
                  <div className="flex items-center gap-2 bg-white/5 border border-white/10 px-3 py-2 rounded-xl">
                    <span className="w-2 h-2 rounded-full bg-brand-yellow shrink-0" />
                    <span>NIST 800-88 Data Wipe</span>
                  </div>
                </div>

                <div className="mt-8 flex flex-wrap gap-4">
                  <Link
                    href="/sell-old-mobile-phone"
                    className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-brand-yellow text-brand-black font-black text-sm uppercase tracking-wider hover:bg-yellow-400 transition-all shadow-yellowGlow"
                  >
                    <span>Select Your Phone Brand</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                  <Link
                    href="/compare/cashall-vs-other-platforms"
                    className="inline-flex items-center gap-2 px-6 py-4 rounded-2xl bg-white/10 text-white font-bold text-sm hover:bg-white/20 transition-all border border-white/20"
                  >
                    <Scale className="w-4 h-4 text-brand-yellow" />
                    <span>Compare vs Other Brands</span>
                  </Link>
                </div>
              </div>

              {/* STATS PANEL */}
              <div className="lg:col-span-4 bg-white/5 backdrop-blur-md border border-white/15 rounded-3xl p-6 space-y-4">
                <div className="border-b border-white/10 pb-4">
                  <div className="text-3xl font-black text-brand-yellow">₹41,000+</div>
                  <div className="text-xs text-gray-400 mt-1">Top Valuation for Flagships (iPhone &amp; S-Series)</div>
                </div>
                <div className="border-b border-white/10 pb-4">
                  <div className="text-3xl font-black text-white">60 Seconds</div>
                  <div className="text-xs text-gray-400 mt-1">Instant Online Valuation Calculator</div>
                </div>
                <div>
                  <div className="text-3xl font-black text-brand-yellow">24 Hours</div>
                  <div className="text-xs text-gray-400 mt-1">Guaranteed Free Doorstep Pickup</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* BRAND SELECTION GRID */}
        <section className="py-14 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <h2 className="text-2xl sm:text-3xl font-black text-brand-black">
              Select Your Phone Brand
            </h2>
            <p className="text-sm text-brand-muted mt-2">
              Choose your manufacturer to calculate guaranteed instant exchange value.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
            {POPULAR_BRANDS.map((b) => (
              <Link
                key={b.slug}
                href={b.href}
                className="bg-white rounded-2xl p-5 border border-brand-yellow/50 hover:border-brand-yellow shadow-premium hover:shadow-yellowGlow transition-all group flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-lg font-black text-brand-black group-hover:text-brand-yellow transition-colors">
                      {b.name}
                    </span>
                    <Smartphone className="w-5 h-5 text-brand-yellow group-hover:scale-110 transition-transform" />
                  </div>
                  <p className="text-xs text-brand-muted">
                    {b.popular}
                  </p>
                </div>
                <div className="mt-4 flex items-center gap-1 text-xs font-black text-brand-black group-hover:translate-x-1 transition-transform">
                  <span>Get Valuation</span>
                  <ArrowRight className="w-3.5 h-3.5 text-brand-yellow" />
                </div>
              </Link>
            ))}
          </div>

          {/* OTHER CATEGORIES */}
          <div className="mt-8 p-6 rounded-2xl bg-amber-50 border border-brand-yellow/40 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <div className="font-black text-sm text-brand-black">Want to sell a Laptop or Tablet too?</div>
              <div className="text-xs text-brand-muted mt-0.5">We buy MacBooks, Windows Laptops, iPads and Android Tablets.</div>
            </div>
            <div className="flex gap-3">
              <Link
                href="/sell/laptop"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-brand-black text-white text-xs font-bold hover:bg-neutral-800 transition-colors"
              >
                <Laptop className="w-3.5 h-3.5 text-brand-yellow" />
                <span>Sell Laptop</span>
              </Link>
              <Link
                href="/sell/tablet"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-brand-yellow text-brand-black text-xs font-bold hover:bg-yellow-400 transition-colors"
              >
                <Tablet className="w-3.5 h-3.5" />
                <span>Sell Tablet</span>
              </Link>
            </div>
          </div>
        </section>

        {/* HOW TO SELL OLD PHONE (STEP-BY-STEP) */}
        <section className="py-14 bg-white border-y border-brand-yellow/20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="text-center max-w-xl mx-auto mb-12">
              <h2 className="text-2xl sm:text-3xl font-black text-brand-black">
                How to Sell Your Used Phone in 3 Steps
              </h2>
              <p className="text-sm text-brand-muted mt-2">
                Fast, fair, and completely hassle-free from the comfort of your home.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-brand-bg rounded-3xl p-6 border border-brand-yellow/30 text-center flex flex-col items-center">
                <div className="w-12 h-12 rounded-2xl bg-brand-yellow flex items-center justify-center font-black text-lg text-brand-black mb-4">
                  1
                </div>
                <h3 className="font-black text-base text-brand-black">Check Value Online</h3>
                <p className="text-xs text-brand-muted mt-2 leading-relaxed">
                  Select your phone brand and answer a few simple questions regarding screen, body, and camera condition. Receive an instant calculated quote.
                </p>
              </div>

              <div className="bg-brand-bg rounded-3xl p-6 border border-brand-yellow/30 text-center flex flex-col items-center">
                <div className="w-12 h-12 rounded-2xl bg-brand-yellow flex items-center justify-center font-black text-lg text-brand-black mb-4">
                  2
                </div>
                <h3 className="font-black text-base text-brand-black">Free Doorstep Pickup</h3>
                <p className="text-xs text-brand-muted mt-2 leading-relaxed">
                  Pick a convenient time slot. Our verified field technician visits your address, conducts a transparent physical inspection, and wipes all data.
                </p>
              </div>

              <div className="bg-brand-bg rounded-3xl p-6 border border-brand-yellow/30 text-center flex flex-col items-center">
                <div className="w-12 h-12 rounded-2xl bg-brand-yellow flex items-center justify-center font-black text-lg text-brand-black mb-4">
                  3
                </div>
                <h3 className="font-black text-base text-brand-black">Instant Payment</h3>
                <p className="text-xs text-brand-muted mt-2 leading-relaxed">
                  Get paid immediately via UPI, GPay, PhonePe, or direct IMPS transfer. Hand over your device only after the money is credited to your bank.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* COMPARISON TABLE */}
        <section className="py-14 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <h2 className="text-2xl sm:text-3xl font-black text-brand-black">
              Why Sell to CashALL Instead of Others?
            </h2>
            <p className="text-sm text-brand-muted mt-2">
              See how CashALL compares directly with other brands, e-commerce exchanges, and local shops.
            </p>
          </div>

          <div className="overflow-x-auto bg-white rounded-3xl border border-brand-yellow/40 shadow-premium">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-brand-black text-white">
                <tr>
                  <th className="py-4 px-5 font-black">Feature</th>
                  <th className="py-4 px-5 font-black text-brand-yellow">CashALL</th>
                  <th className="py-4 px-5 font-bold text-gray-300">Other Brands</th>
                  <th className="py-4 px-5 font-bold text-gray-300">Other E-Commerce Platforms</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 font-medium">
                <tr>
                  <td className="py-3.5 px-5 font-bold text-brand-black">Doorstep Pickup Fee</td>
                  <td className="py-3.5 px-5 font-black text-green-700 bg-amber-50/50">₹0 Free</td>
                  <td className="py-3.5 px-5 text-gray-500">₹99 – ₹199</td>
                  <td className="py-3.5 px-5 text-gray-500">₹100 – ₹300</td>
                </tr>
                <tr>
                  <td className="py-3.5 px-5 font-bold text-brand-black">Payment Method</td>
                  <td className="py-3.5 px-5 font-black text-green-700 bg-amber-50/50">Direct UPI / Cash Before Handover</td>
                  <td className="py-3.5 px-5 text-gray-500">Wallet / Delayed Bank Transfer</td>
                  <td className="py-3.5 px-5 text-gray-500">Store Gift Card Vouchers</td>
                </tr>
                <tr>
                  <td className="py-3.5 px-5 font-bold text-brand-black">Quote Transparency</td>
                  <td className="py-3.5 px-5 font-black text-green-700 bg-amber-50/50">Fair physical evaluation</td>
                  <td className="py-3.5 px-5 text-gray-500">Frequent last-minute quote reductions</td>
                  <td className="py-3.5 px-5 text-gray-500">Delivery agent rejection risks</td>
                </tr>
                <tr>
                  <td className="py-3.5 px-5 font-bold text-brand-black">Data Safety Standard</td>
                  <td className="py-3.5 px-5 font-black text-green-700 bg-amber-50/50">NIST 800-88 Certified Wipe + Bill of Sale</td>
                  <td className="py-3.5 px-5 text-gray-500">Basic Factory Reset</td>
                  <td className="py-3.5 px-5 text-gray-500">No certified data guarantee</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* SERVICEABLE LOCATIONS */}
        <section className="py-12 bg-neutral-900 text-white px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="text-center max-w-xl mx-auto mb-8">
              <h2 className="text-2xl font-black text-white">
                Available Service Regions
              </h2>
              <p className="text-xs text-gray-400 mt-1">
                We currently provide direct doorstep pickup across verified districts.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {SERVICE_REGIONS.map((r) => (
                <div key={r.state} className="bg-white/5 border border-white/10 rounded-2xl p-4">
                  <div className="flex items-center gap-1.5 text-brand-yellow font-black text-sm">
                    <MapPin className="w-4 h-4" />
                    <span>{r.state}</span>
                  </div>
                  <div className="text-xs font-bold text-white mt-2">{r.cities}</div>
                  <div className="text-[11px] text-gray-400 mt-1 flex items-center gap-1">
                    <Clock className="w-3 h-3 text-brand-yellow" />
                    <span>{r.eta}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQS SECTION */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-black text-brand-black">
              Frequently Asked Questions About Selling Used Phones
            </h2>
            <p className="text-sm text-brand-muted mt-2">
              Everything you need to know before selling your old smartphone.
            </p>
          </div>

          <div className="space-y-4">
            {FAQS.map((faq, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 border border-brand-yellow/40 shadow-sm">
                <h3 className="font-black text-base text-brand-black flex items-start gap-2">
                  <HelpCircle className="w-5 h-5 text-brand-yellow flex-shrink-0 mt-0.5" />
                  <span>{faq.q}</span>
                </h3>
                <p className="text-xs sm:text-sm text-brand-muted mt-2.5 pl-7 leading-relaxed">
                  {faq.a}
                </p>
              </div>
            ))}
          </div>

          {/* POPULAR SEARCHES & VALUATION DIRECTORY */}
          <div className="mt-12 bg-white rounded-3xl p-6 sm:p-8 border border-brand-border shadow-subtleCard space-y-4">
            <h3 className="text-base font-black text-brand-black flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-brand-yellow" />
              <span>Popular Second Hand Mobile &amp; Valuation Searches</span>
            </h3>
            <div className="flex flex-wrap gap-2 text-xs">
              {[
                { label: "Second Hand Mobile Price Check", href: "/sell-old-mobile-phone" },
                { label: "Used Phone Price Calculator", href: "/sell-old-mobile-phone" },
                { label: "Sell Old Phone Online", href: "/sell-used-phone" },
                { label: "Cash for Phone", href: "/sell-old-mobile-phone" },
                { label: "2nd Hand Mobile Phones", href: "/sell-old-mobile-phone" },
                { label: "Sell Old Phone Ranchi", href: "/sell-old-mobile-phone" },
                { label: "Sell Old Phone Kolkata", href: "/sell-phone-in-kolkata" },
                { label: "Sell Old Phone Howrah", href: "/sell-phone-in-howrah" },
                { label: "Sell Old Phone Gorakhpur", href: "/sell-phone-in-gorakhpur" },
                { label: "Sell iPhone Online", href: "/sell-old-mobile-phone/apple" },
                { label: "Sell Samsung Galaxy", href: "/sell-old-mobile-phone/samsung" },
                { label: "Refurbished Mobiles Valuation", href: "/sell-old-mobile-phone" },
                { label: "Mobile Resale Value Calculator", href: "/sell-old-mobile-phone" },
              ].map((item, idx) => (
                <Link
                  key={idx}
                  href={item.href}
                  className="px-3 py-1.5 rounded-full bg-neutral-100 hover:bg-brand-yellow hover:text-brand-black text-neutral-700 font-bold transition-colors"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>

          {/* FINAL CTA */}
          <div className="mt-12 text-center bg-brand-yellow rounded-3xl p-8 shadow-yellowGlow">
            <h3 className="text-2xl font-black text-brand-black">Ready to Cash Out Your Old Phone?</h3>
            <p className="text-xs sm:text-sm text-brand-black/80 mt-1 max-w-md mx-auto">
              Get an instant quote in less than 60 seconds with zero obligation.
            </p>
            <div className="mt-6">
              <Link
                href="/sell-old-mobile-phone"
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-2xl bg-brand-black text-white font-black text-sm uppercase tracking-wider hover:bg-neutral-800 transition-colors shadow-lg"
              >
                <span>Calculate Your Price Now</span>
                <ArrowRight className="w-4 h-4 text-brand-yellow" />
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
