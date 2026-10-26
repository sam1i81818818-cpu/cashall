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
  PhoneCall,
  BadgeCheck,
  Building2,
  ChevronRight
} from "lucide-react";

export const metadata: Metadata = {
  title: "Sell Old Phone in Kolkata | Instant Cash & Free Doorstep Pickup | CashALL",
  description:
    "Sell your used smartphone online in Kolkata for fair market value. Free 2-hour doorstep pickup across Salt Lake, New Town, South Kolkata, North Kolkata & Howrah. Instant UPI cash payout & certified data wipe.",
  keywords: [
    "sell old phone in kolkata",
    "sell used phone kolkata",
    "best place to sell old phone in kolkata",
    "best used phone buyer kolkata",
    "online phone selling kolkata",
    "doorstep mobile buyer kolkata",
    "sell phone chandni chowk kolkata",
    "sell second hand phone kolkata",
    "doorstep phone selling kolkata",
    "sell broken phone kolkata",
    "instant cash for phone kolkata",
    "sell old iphone kolkata",
    "sell used samsung phone kolkata",
    "sell phone salt lake kolkata",
    "sell phone new town kolkata",
    "sell old phone howrah",
    "sell old phone behala",
    "sell old phone jadavpur",
    "sell old laptop in kolkata",
    "ps5 rental kolkata",
    "old phone buyback kolkata west bengal"
  ],
  alternates: {
    canonical: "https://www.cashall.in/sell-phone-in-kolkata",
  },
  openGraph: {
    title: "Sell Old Phone in Kolkata | Highest Cash Payout | CashALL",
    description:
      "Get up to 5% more cash for your old smartphone in Kolkata. Free doorstep evaluation, zero hidden deductions, and instant UPI bank payment on the spot.",
    url: "https://www.cashall.in/sell-phone-in-kolkata",
    images: ["/photos/CashALL_logo.png"],
  },
};

const KOLKATA_AREAS = [
  { name: "Salt Lake (Bidhannagar)", desc: "Sector I, II, III & Sector V", time: "Within 2 Hours" },
  { name: "New Town & Rajarhat", desc: "Action Area 1, 2, 3 & Eco Park", time: "Within 2 Hours" },
  { name: "South Kolkata", desc: "Ballygunge, Gariahat, Park Street, Alipore", time: "Same Day" },
  { name: "Jadavpur & Garia", desc: "Tollygunge, Baghajatin, Naktala", time: "Same Day" },
  { name: "Behala & Taratala", desc: "Parnasree, Sakher Bazar, James Long Sarani", time: "Same Day" },
  { name: "North Kolkata", desc: "Shyambazar, Dum Dum, Ultadanga, Bagbazar", time: "Same Day" },
  { name: "Howrah & Shibpur", desc: "Salkia, Liluah, Mandirtala, Kona", time: "Same Day" },
  { name: "Barasat & Madhyamgram", desc: "Jessore Road, Airport, Birati", time: "Same Day" },
];

const LOCAL_FAQS = [
  {
    q: "How fast is doorstep pickup for old phones in Kolkata?",
    a: "CashALL provides same-day doorstep pickup across Kolkata. In major hubs like Salt Lake, New Town, Park Street, and Ballygunge, verified pickup agents can reach your doorstep within 2 to 4 hours of quote confirmation.",
  },
  {
    q: "Why choose CashALL doorstep pickup over selling at Chandni Chowk or local mobile shops in Kolkata?",
    a: "Selling at offline markets like Chandni Chowk or local second-hand shops requires traveling in traffic, enduring aggressive haggling, risk of unverified cash, and questionable data handling. CashALL brings transparent automated valuation, 100% free doorstep pickup, on-the-spot UPI payment, and certified data wiping directly to your home.",
  },
  {
    q: "How do I receive payment when selling my phone in Kolkata?",
    a: "Payment is transferred 100% on the spot during doorstep inspection via UPI (Google Pay, PhonePe, Paytm) or direct IMPS bank transfer before our pickup executive leaves your address.",
  },
  {
    q: "Can I sell a phone without bill or box in Kolkata?",
    a: "Yes. CashALL accepts smartphones without original bills or boxes across Kolkata. You only need to verify your identity with a valid Government ID proof (Aadhaar or Voter ID) and sign a simple electronic ownership undertaking.",
  },
  {
    q: "Why is CashALL rated better than other online platforms in Kolkata?",
    a: "CashALL offers up to 5% higher payouts, charges zero doorstep pickup fees (saving you the ₹100–₹199 convenience fee charged by other platforms), performs transparent diagnostics without unfair price cuts, and delivers local Kolkata customer support over WhatsApp and phone.",
  },
  {
    q: "Is my personal data completely erased before selling?",
    a: "Yes. Our executive assists you in performing an on-site factory data reset in your presence, ensuring all Google/Apple accounts, photos, and personal documents are permanently wiped before handover.",
  },
  {
    q: "Which Kolkata pin codes are serviceable for same-day pickup?",
    a: "We service over 100 pin codes across Kolkata, Salt Lake, New Town, Howrah, Barrackpore, and South 24 Parganas including 700001 to 700108.",
  },
];

export default function SellPhoneInKolkataPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "LocalBusiness",
        "@id": "https://www.cashall.in/sell-phone-in-kolkata#business",
        "name": "CashALL Kolkata - Sell Old Phone & Laptop for Instant Cash",
        "url": "https://www.cashall.in/sell-phone-in-kolkata",
        "logo": "https://www.cashall.in/photos/CashALL_favicon.png",
        "image": "https://www.cashall.in/photos/CashALL_logo.png",
        "description":
          "CashALL is Kolkata's top re-commerce platform for selling used smartphones, laptops, and tablets with free 2-hour doorstep pickup and instant UPI payment.",
        "telephone": "+917604092333",
        "email": "support@cashall.in",
        "address": {
          "@type": "PostalAddress",
          "addressLocality": "Kolkata",
          "addressRegion": "West Bengal",
          "addressCountry": "IN"
        },
        "geo": {
          "@type": "GeoCoordinates",
          "latitude": "22.5726",
          "longitude": "88.3639"
        },
        "areaServed": [
          "Kolkata",
          "Salt Lake",
          "New Town",
          "Howrah",
          "Ballygunge",
          "Park Street",
          "Garia",
          "Jadavpur",
          "Behala",
          "Dum Dum",
          "Barasat"
        ],
        "priceRange": "₹1,000 - ₹1,20,000"
      },
      {
        "@type": "FAQPage",
        "@id": "https://www.cashall.in/sell-phone-in-kolkata#faq",
        "mainEntity": LOCAL_FAQS.map((item) => ({
          "@type": "Question",
          "name": item.q,
          "acceptedAnswer": {
            "@type": "Answer",
            "text": item.a
          }
        }))
      }
    ]
  };

  return (
    <div className="min-h-screen flex flex-col bg-brand-bg text-brand-black">
      <Header />

      {/* JSON-LD INJECTION */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <main className="flex-grow">
        {/* HERO SECTION */}
        <section className="relative bg-brand-black text-white py-16 sm:py-20 overflow-hidden border-b border-neutral-900">
          <div className="absolute top-0 right-1/4 w-96 h-96 bg-brand-yellow/10 rounded-full blur-3xl pointer-events-none" />
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            {/* BREADCRUMB */}
            <div className="flex items-center gap-2 text-xs font-semibold text-gray-400 mb-6">
              <Link href="/" className="hover:text-white transition-colors">Home</Link>
              <ChevronRight className="w-3.5 h-3.5" />
              <Link href="/sell" className="hover:text-white transition-colors">Sell</Link>
              <ChevronRight className="w-3.5 h-3.5" />
              <span className="text-brand-yellow font-bold">Kolkata</span>
            </div>

            <div className="max-w-3xl space-y-5">
              <p className="text-xs font-bold text-brand-yellow uppercase tracking-wider flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5" />
                <span>Kolkata & Howrah Dedicated Doorstep Service</span>
              </p>

              <h1 className="text-3xl sm:text-5xl font-black text-white leading-tight">
                Sell Old Phone in Kolkata <br />
                <span className="text-brand-yellow">Get Instant Cash at Your Doorstep</span>
              </h1>

              <p className="text-sm sm:text-base text-gray-300 leading-relaxed max-w-2xl">
                Get up to 5% higher valuation than other online platforms with free same-day pickup across Kolkata, Salt Lake, New Town, and Howrah. Free diagnostics, 100% safe factory data wipe, and instant on-the-spot UPI payout.
              </p>

              <div className="pt-4 flex flex-wrap items-center gap-4">
                <Link
                  href="/sell-old-mobile-phone"
                  className="px-8 py-4 rounded-2xl bg-brand-yellow text-black font-black text-sm hover:bg-yellow-400 shadow-yellowGlow transition-transform active:scale-95 flex items-center gap-2"
                >
                  <Smartphone className="w-4 h-4" />
                  <span>Check Phone Value Now</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/sell/laptop"
                  className="px-6 py-4 rounded-2xl bg-neutral-900 border border-neutral-700 text-white font-bold text-sm hover:bg-neutral-800 transition-colors"
                >
                  Sell Used Laptop Instead
                </Link>
              </div>

              {/* TRUST HIGHLIGHTS */}
              <div className="pt-6 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs text-gray-300">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-brand-yellow shrink-0" />
                  <span>Free Pickup (₹0 Fee)</span>
                </div>
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-brand-yellow shrink-0" />
                  <span>Instant UPI on Arrival</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-brand-yellow shrink-0" />
                  <span>2–4 Hr Fast Pickup</span>
                </div>
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-brand-yellow shrink-0" />
                  <span>100% Certified Data Wipe</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* POPULAR BRANDS QUICK SELECTION */}
        <section className="py-12 bg-white border-b border-brand-border">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-xl sm:text-2xl font-black text-brand-black text-center mb-8">
              Select Your Mobile Brand in Kolkata
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3">
              {[
                { name: "Apple iPhone", slug: "apple", color: "hover:border-black" },
                { name: "Samsung Galaxy", slug: "samsung", color: "hover:border-blue-600" },
                { name: "OnePlus", slug: "oneplus", color: "hover:border-red-600" },
                { name: "Xiaomi / Redmi", slug: "xiaomi", color: "hover:border-orange-500" },
                { name: "Vivo", slug: "vivo", color: "hover:border-blue-500" },
                { name: "OPPO", slug: "oppo", color: "hover:border-green-600" },
                { name: "Realme", slug: "realme", color: "hover:border-yellow-500" },
                { name: "POCO", slug: "poco", color: "hover:border-yellow-600" },
                { name: "Motorola", slug: "motorola", color: "hover:border-blue-700" },
                { name: "Google Pixel", slug: "google", color: "hover:border-red-500" },
                { name: "iQOO", slug: "iqoo", color: "hover:border-orange-600" },
                { name: "Nothing Phone", slug: "nothing", color: "hover:border-neutral-800" },
              ].map((brand) => (
                <Link
                  key={brand.slug}
                  href={`/sell-old-mobile-phone/${brand.slug}`}
                  className={`p-4 rounded-2xl bg-brand-bg border border-brand-border text-center font-bold text-xs hover:bg-white hover:shadow-premium transition-all ${brand.color}`}
                >
                  <span className="block truncate">{brand.name}</span>
                  <span className="text-[10px] text-brand-muted font-normal mt-1 block">
                    Instant Payout &rarr;
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* KOLKATA LOCALITIES COVERED */}
        <section className="py-16 bg-brand-bg">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <span className="text-xs font-bold text-brand-muted uppercase tracking-wider">
                Hyper-Local Doorstep Coverage
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-brand-black mt-1">
                Kolkata Neighborhoods Covered by CashALL
              </h2>
              <p className="text-xs sm:text-sm text-brand-muted mt-2">
                Our certified executives are stationed across North, South, Central Kolkata & Howrah for rapid same-day pickup.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {KOLKATA_AREAS.map((area, idx) => (
                <div
                  key={idx}
                  className="bg-white p-5 rounded-2xl border border-brand-border shadow-subtleCard hover:shadow-premium transition-all"
                >
                  <div className="flex items-start justify-between mb-2">
                    <MapPin className="w-5 h-5 text-brand-yellow shrink-0 mt-0.5" />
                    <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-bold text-[10px] border border-emerald-200">
                      {area.time}
                    </span>
                  </div>
                  <h3 className="font-extrabold text-sm text-brand-black">{area.name}</h3>
                  <p className="text-xs text-brand-muted mt-1 leading-relaxed">{area.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* WHY CHOOSE CASHALL OVER CASHIFY IN KOLKATA */}
        <section className="py-16 bg-white border-t border-b border-brand-border">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-xl mx-auto mb-10">
              <span className="text-xs font-bold text-brand-yellow bg-black px-3 py-1 rounded-full uppercase tracking-wider">
                Transparent Comparison
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-brand-black mt-3">
                Why Kolkata Chooses CashALL
              </h2>
            </div>

            <div className="bg-brand-bg rounded-3xl p-6 sm:p-8 border border-brand-border shadow-premium overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead>
                  <tr className="border-b border-brand-border text-brand-muted uppercase text-[11px]">
                    <th className="pb-3 font-bold">Feature</th>
                    <th className="pb-3 font-extrabold text-black">CashALL</th>
                    <th className="pb-3 font-bold">Other Online Portals</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-brand-border/60">
                  <tr>
                    <td className="py-3.5 font-semibold text-brand-black">Doorstep Pickup Fee</td>
                    <td className="py-3.5 font-bold text-emerald-600">₹0 (100% Free)</td>
                    <td className="py-3.5 text-gray-500">₹100 – ₹199 convenience fee</td>
                  </tr>
                  <tr>
                    <td className="py-3.5 font-semibold text-brand-black">Final Device Payout</td>
                    <td className="py-3.5 font-bold text-emerald-600">Up to 5% Higher Value</td>
                    <td className="py-3.5 text-gray-500">Standard market rates</td>
                  </tr>
                  <tr>
                    <td className="py-3.5 font-semibold text-brand-black">Payment Timing</td>
                    <td className="py-3.5 font-bold text-emerald-600">Instant UPI on the Spot</td>
                    <td className="py-3.5 text-gray-500">Delayed or Wallet credit</td>
                  </tr>
                  <tr>
                    <td className="py-3.5 font-semibold text-brand-black">Minor Scratches Policy</td>
                    <td className="py-3.5 font-bold text-emerald-600">Transparent minimal deduction</td>
                    <td className="py-3.5 text-gray-500">Aggressive re-quotes on arrival</td>
                  </tr>
                  <tr>
                    <td className="py-3.5 font-semibold text-brand-black">Personal Data Protection</td>
                    <td className="py-3.5 font-bold text-emerald-600">On-site verified factory reset</td>
                    <td className="py-3.5 text-gray-500">Variable protocols</td>
                  </tr>
                  <tr>
                    <td className="py-3.5 font-semibold text-brand-black">Local Support in Kolkata</td>
                    <td className="py-3.5 font-bold text-emerald-600">Direct WhatsApp &amp; Phone Support</td>
                    <td className="py-3.5 text-gray-500">Automated Bot support</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* KOLKATA FAQ ACCORDION (AEO TARGETED) */}
        <section className="py-16 bg-brand-bg">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
            <div className="text-center space-y-2">
              <h2 className="text-2xl sm:text-3xl font-black text-brand-black">
                Frequently Asked Questions (Kolkata Selling)
              </h2>
              <p className="text-xs sm:text-sm text-brand-muted">
                Everything you need to know about selling your used mobile in Kolkata
              </p>
            </div>

            <div className="space-y-4 pt-4">
              {LOCAL_FAQS.map((faq, i) => (
                <div
                  key={i}
                  className="bg-white p-6 rounded-2xl border border-brand-border shadow-subtleCard"
                >
                  <h3 className="font-extrabold text-sm sm:text-base text-brand-black mb-2">
                    {faq.q}
                  </h3>
                  <p className="text-xs sm:text-sm text-brand-muted leading-relaxed">
                    {faq.a}
                  </p>
                </div>
              ))}
            </div>

            {/* FINAL CTA */}
            <div className="mt-12 p-8 rounded-3xl bg-brand-black text-white text-center space-y-4 border border-neutral-800">
              <h3 className="text-2xl font-black text-white">
                Ready to Sell Your Old Phone in Kolkata?
              </h3>
              <p className="text-xs sm:text-sm text-gray-300 max-w-lg mx-auto">
                Calculate your phone&apos;s exact value in under 60 seconds and schedule your free doorstep pickup.
              </p>
              <div className="pt-2">
                <Link
                  href="/sell-old-mobile-phone"
                  className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-brand-yellow text-black font-black text-sm hover:bg-yellow-400 shadow-yellowGlow transition-transform active:scale-95"
                >
                  <span>Start Valuation Now</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
