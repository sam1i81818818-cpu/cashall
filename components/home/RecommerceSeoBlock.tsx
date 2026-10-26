import React from "react";
import Link from "next/link";
import {
  ShieldCheck,
  Zap,
  CheckCircle2,
  TrendingUp,
  Smartphone,
  Laptop,
  Tablet,
  ArrowRight,
  Sparkles,
  Lock,
  Layers,
  Leaf
} from "lucide-react";

export function RecommerceSeoBlock() {
  const BRANDS = [
    { name: "Apple", slug: "apple", desc: "Sell iPhone 11 to 16 Pro Max" },
    { name: "Samsung", slug: "samsung", desc: "Sell Galaxy S, Z Fold & A Series" },
    { name: "OnePlus", slug: "oneplus", desc: "Sell OnePlus 9, 10, 11 & 12 Series" },
    { name: "Xiaomi / Redmi", slug: "xiaomi", desc: "Sell Redmi Note & Xiaomi Flagships" },
    { name: "Google Pixel", slug: "google", desc: "Sell Pixel 6, 7, 8 & 9 Series" },
    { name: "Vivo", slug: "vivo", desc: "Sell V & X Series Flagships" },
    { name: "Oppo", slug: "oppo", desc: "Sell Reno & Find Series" },
    { name: "Realme", slug: "realme", desc: "Sell GT & Number Series" },
  ];

  return (
    <section className="py-20 bg-brand-bg border-t border-brand-border" id="recommerce-guide">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* SECTION 1: MASTER SEO BANNER & VALUE PROPOSITION */}
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-brand-border shadow-subtleCard space-y-6">
          <div className="max-w-3xl space-y-3">
            <h2 className="text-2xl sm:text-4xl font-black text-brand-black tracking-tight leading-tight">
              Sell Your Old Phone Online for Best Cash with CashALL
            </h2>
            <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">
              Every month, thousands of smartphone users across Kolkata, Howrah, and West Bengal trade in their older devices on CashALL. Instead of haggling with offline dealers or risking scams on open classified marketplaces, CashALL provides an instant algorithmic valuation, 100% free doorstep inspection, and immediate UPI bank transfer before handover.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-5 border-t border-brand-border/60">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2 font-bold text-brand-black text-sm">
                <span className="w-2 h-2 rounded-full bg-brand-yellow shrink-0 inline-block" />
                <span>Highest Price Guarantee</span>
              </div>
              <p className="text-xs text-brand-muted leading-relaxed pl-4">
                Guaranteed up to 5% higher payouts than legacy aggregators with zero hidden pickup or diagnostic deductions.
              </p>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center gap-2 font-bold text-brand-black text-sm">
                <span className="w-2 h-2 rounded-full bg-brand-yellow shrink-0 inline-block" />
                <span>Certified On-Site Data Wipe</span>
              </div>
              <p className="text-xs text-brand-muted leading-relaxed pl-4">
                Every device undergoes a NIST 800-88 compliant data wipe on-site with legal Bill of Sale indemnifying you.
              </p>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center gap-2 font-bold text-brand-black text-sm">
                <span className="w-2 h-2 rounded-full bg-brand-yellow shrink-0 inline-block" />
                <span>Instant Doorstep Payout</span>
              </div>
              <p className="text-xs text-brand-muted leading-relaxed pl-4">
                Funds are transferred via UPI (Google Pay, PhonePe, Paytm) directly into your bank account before our agent leaves.
              </p>
            </div>
          </div>
        </div>

        {/* SECTION 2: WHICH MOBILE PHONE BRANDS CAN BE SOLD ON CASHALL */}
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-brand-border pb-4">
            <div>
              <h2 className="text-2xl font-black text-brand-black">
                Which Mobile Phone Brands Can Be Sold on CashALL?
              </h2>
              <p className="text-xs sm:text-sm text-brand-muted mt-1">
                We buy all major Android &amp; iOS smartphones across any functional or cosmetic condition.
              </p>
            </div>
            <Link
              href="/sell-old-mobile-phone/brands"
              className="text-xs font-black text-brand-black hover:text-amber-600 flex items-center gap-1 shrink-0"
            >
              <span>Explore All 25+ Brands</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {BRANDS.map((brand) => (
              <Link
                key={brand.slug}
                href={`/sell-old-mobile-phone/${brand.slug}`}
                className="bg-white rounded-2xl p-5 border border-brand-border hover:border-brand-yellow hover:shadow-subtleCard transition text-center group space-y-1"
              >
                <div className="font-extrabold text-sm sm:text-base text-brand-black group-hover:text-black">
                  {brand.name}
                </div>
                <div className="text-[11px] text-brand-muted">
                  {brand.desc}
                </div>
                <div className="text-[10px] font-black text-amber-700 pt-1 flex items-center justify-center gap-1 group-hover:translate-x-0.5 transition-transform">
                  <span>Sell {brand.name}</span>
                  <ArrowRight className="w-2.5 h-2.5" />
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* SECTION 3: TOP & RISING QUERIES DEEP DIVE (SEO/AEO/GEO) */}
        <div className="space-y-12">
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <h2 className="text-2xl sm:text-3xl font-black text-brand-black">
              Why CashALL would be your best choice to sell your used devices
            </h2>
            <p className="text-xs sm:text-sm text-neutral-600">
              Direct comparison, guaranteed highest market price, zero doorstep deductions, and certified data wiping.
            </p>
          </div>

          {/* Cards Grid for Top Search Topics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Card 1: Alternative to Other Brands */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-brand-border shadow-subtleCard space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-brand-yellow shrink-0" />
                  <h3 className="text-lg font-black text-brand-black">
                    Zero Hidden Doorstep Charges
                  </h3>
                </div>
                <p className="text-xs text-neutral-600 leading-relaxed">
                  Looking to sell your old phone without heavy commission cuts? Unlike other brands and aggregators that deduct ₹99–₹199 convenience charges at your doorstep and slash up to 40% on minor hairline scratches, CashALL offers honest algorithmic pricing with <strong>₹0 pickup fee</strong> and <strong>up to 5% higher real cash payout</strong>.
                </p>
                {/* AEO, SEO & GEO Semantic Data for Search & AI Crawlers */}
                <div className="sr-only" aria-hidden="false">
                  Top online recommerce buyback comparison, trade-in exchange alternative, and doorstep electronics valuation. Instant phone resale with ₹0 convenience fee.
                </div>
              </div>
              <Link
                href="/compare/cashall-vs-other-platforms"
                className="inline-flex items-center gap-1.5 text-xs font-black text-amber-800 hover:text-amber-950 pt-2"
              >
                <span>Read Full Comparison vs Other Brands</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Card 2: Sell iPhone & Apple Trade In Alternative */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-brand-border shadow-subtleCard space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-brand-yellow shrink-0" />
                  <h3 className="text-lg font-black text-brand-black">
                    Sell Old iPhone Online for Direct Cash
                  </h3>
                </div>
                <p className="text-xs text-neutral-600 leading-relaxed">
                  Upgrading to the <strong>iPhone 16, 17 Pro, or 17 Pro Max</strong>? Official Apple Trade In and e-commerce exchange programs only offer store credits or low exchange values with strict deduction rules. Sell your iPhone 11, 12, 13, 14, 15, or 16 at CashALL for <strong>instant cash via UPI</strong> directly into your bank before handing over the device.
                </p>
              </div>
              <Link
                href="/sell-old-mobile-phone/apple"
                className="inline-flex items-center gap-1.5 text-xs font-black text-blue-800 hover:text-blue-950 pt-2"
              >
                <span>Check iPhone Resale Value</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Card 3: Sell Laptop Online */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-brand-border shadow-subtleCard space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-brand-yellow shrink-0" />
                  <h3 className="text-lg font-black text-brand-black">
                    Sell Used Laptop Online (MacBook, Dell, HP &amp; Lenovo)
                  </h3>
                </div>
                <p className="text-xs text-neutral-600 leading-relaxed">
                  Don&apos;t let your used laptop gather dust. CashALL buys MacBooks, gaming laptops, and Windows work laptops across Dell, HP, Lenovo, Asus, and Acer. Get instant doorstep evaluation, certified hardware assessment, and on-the-spot bank transfer.
                </p>
              </div>
              <Link
                href="/sell-old-laptop"
                className="inline-flex items-center gap-1.5 text-xs font-black text-emerald-800 hover:text-emerald-950 pt-2"
              >
                <span>Sell Used Laptop Online</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Card 4: Sell Samsung & Android Flagships */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-brand-border shadow-subtleCard space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-brand-yellow shrink-0" />
                  <h3 className="text-lg font-black text-brand-black">
                    Sell Samsung Galaxy, OnePlus &amp; Android Flagships
                  </h3>
                </div>
                <p className="text-xs text-neutral-600 leading-relaxed">
                  Get the best resale price for Samsung Galaxy S23, S24, S25, S26 Ultra, Z Fold, Z Flip, OnePlus 11, 12, 13, and Google Pixel devices. Even phones with screen cracks, battery wear, or missing original boxes get competitive buyback quotes.
                </p>
              </div>
              <Link
                href="/sell-old-mobile-phone/samsung"
                className="inline-flex items-center gap-1.5 text-xs font-black text-purple-800 hover:text-purple-950 pt-2"
              >
                <span>Sell Samsung Phone for Cash</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Card 5: Local GEO Coverage */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-brand-border shadow-subtleCard space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-brand-yellow shrink-0" />
                  <h3 className="text-lg font-black text-brand-black">
                    Free Doorstep Pickup Across Active Hubs
                  </h3>
                </div>
                <p className="text-xs text-neutral-600 leading-relaxed">
                  Serving Kolkata, Howrah, Hooghly, Barrackpore, Salt Lake, New Town, Ranchi, Patna, Gorakhpur &amp; Ballia. Free same-day or 24-hour doorstep inspection by verified technicians.
                </p>
              </div>
              <Link
                href="/sell-phone-in-kolkata"
                className="inline-flex items-center gap-1.5 text-xs font-black text-rose-800 hover:text-rose-950 pt-2"
              >
                <span>View Serviceable Cities</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Card 6: 100% Data Privacy & Safety */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-brand-border shadow-subtleCard space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-brand-yellow shrink-0" />
                  <h3 className="text-lg font-black text-brand-black">
                    Statutory Bill of Sale &amp; Verified Data Wiping
                  </h3>
                </div>
                <p className="text-xs text-neutral-600 leading-relaxed">
                  No meeting random strangers on classified sites. No fake payment screenshots. Every transaction is legally backed by an official digital Bill of Sale, transferring complete legal liability and guaranteeing 100% on-site data wiping under NIST guidelines.
                </p>
              </div>
              <Link
                href="/about-us"
                className="inline-flex items-center gap-1.5 text-xs font-black text-teal-800 hover:text-teal-950 pt-2"
              >
                <span>Learn About Our Legal Safeguards</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>

        {/* SECTION 4: HIGH-VOLUME SEARCH DIRECTORY — ACCESSIBLE TO SEARCH ENGINES, AI & CRAWLERS ONLY (NOT VISIBLE TO USERS) */}
        <div className="sr-only" aria-hidden="false">
          <h2>Popular Keyword Searches &amp; Valuation Corridors</h2>
          <nav aria-label="Device Resale Directory">
            <div>
              <h3>Sell Old Phone &amp; Buyback</h3>
              <div>
                {[
                  { label: "Sell Old Phone", href: "/sell-used-phone" },
                  { label: "Sell Used Phone Online", href: "/sell-used-phone" },
                  { label: "Cash for Phone", href: "/sell-old-mobile-phone" },
                  { label: "Old Phone Sell Online", href: "/sell-used-phone" },
                  { label: "Sell Old Handset", href: "/sell-old-mobile-phone" },
                  { label: "Sold Old Phone", href: "/sell-used-phone" },
                  { label: "Sell Dead Phone", href: "/sell-old-mobile-phone" },
                  { label: "Sell Broken Screen Phone", href: "/sell-old-mobile-phone" },
                ].map((item, idx) => (
                  <Link key={idx} href={item.href}>{item.label}</Link>
                ))}
              </div>
            </div>

            <div>
              <h3>Second Hand &amp; 2nd Hand Mobile</h3>
              <div>
                {[
                  { label: "Second Hand Mobile", href: "/sell-old-mobile-phone" },
                  { label: "2nd Hand Mobile Phones", href: "/sell-old-mobile-phone" },
                  { label: "Used Second Hand Mobile", href: "/sell-old-mobile-phone" },
                  { label: "2 Hand Mobile Phone", href: "/sell-old-mobile-phone" },
                  { label: "Second Hand iPhone", href: "/sell-old-mobile-phone/apple" },
                  { label: "Refurbished Mobiles", href: "/sell-old-mobile-phone" },
                  { label: "Refurbished Phones", href: "/sell-old-mobile-phone" },
                  { label: "Buy Second Hand Mobile", href: "/sell-old-mobile-phone" },
                ].map((item, idx) => (
                  <Link key={idx} href={item.href}>{item.label}</Link>
                ))}
              </div>
            </div>

            <div>
              <h3>Price Calculator &amp; Valuation</h3>
              <div>
                {[
                  { label: "Mobile Price", href: "/sell-used-phone" },
                  { label: "Mobile Resale Value Calculator", href: "/sell-used-phone" },
                  { label: "Used Phone Price Calculator", href: "/sell-used-phone" },
                  { label: "Second Hand Mobile Price Check", href: "/sell-used-phone" },
                  { label: "Phone Valuation Tool Online", href: "/sell-used-phone" },
                  { label: "iPhone Resale Value", href: "/sell-old-mobile-phone/apple" },
                  { label: "Laptop Resale Calculator", href: "/sell-old-laptop" },
                  { label: "Instant Guaranteed Quote", href: "/sell-used-phone" },
                ].map((item, idx) => (
                  <Link key={idx} href={item.href}>{item.label}</Link>
                ))}
              </div>
            </div>

            <div>
              <h3>Doorstep Pickup Hubs</h3>
              <div>
                {[
                  { label: "Mobile Shop Near Me", href: "/sell-used-phone" },
                  { label: "Second Hand Mobile Shop Near Me", href: "/sell-used-phone" },
                  { label: "Sell Old Phone Kolkata", href: "/sell-phone-in-kolkata" },
                  { label: "Sell Old Phone Ranchi", href: "/sell-used-phone" },
                  { label: "Sell Old Phone Howrah", href: "/sell-phone-in-howrah" },
                  { label: "Sell Old Phone Patna", href: "/sell-used-phone" },
                  { label: "Sell Old Phone Gorakhpur", href: "/sell-phone-in-gorakhpur" },
                  { label: "Sell Old Phone Ballia", href: "/sell-used-phone" },
                ].map((item, idx) => (
                  <Link key={idx} href={item.href}>{item.label}</Link>
                ))}
              </div>
            </div>
          </nav>
        </div>

        {/* SECTION 5: CIRCULAR ECONOMY COMMITMENT */}
        <div className="bg-neutral-950 text-white rounded-3xl p-8 sm:p-10 shadow-premium flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-3 max-w-xl text-center md:text-left">
            <h3 className="text-2xl sm:text-3xl font-black">
              Sell Old Devices, Reduce E-Waste in India
            </h3>
            <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed">
              When you sell your old smartphone or laptop to CashALL, you actively divert toxic heavy metals from landfills. Devices are refurbished or responsibly recycled, extending hardware lifespan and conserving vital natural resources.
            </p>
          </div>

          <div className="shrink-0">
            <Link
              href="/sell-used-phone"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-brand-yellow hover:bg-amber-400 text-brand-black font-black text-xs sm:text-sm shadow-md transition hover:scale-105"
            >
              <span>Calculate Old Phone Price</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

      </div>
    </section>
  );
}
