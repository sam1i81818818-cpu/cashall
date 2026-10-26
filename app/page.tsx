import type { Metadata } from "next";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/components/home/Hero";
import { CategoryCards } from "@/components/home/CategoryCards";
import { PopularBrands } from "@/components/home/PopularBrands";
import { HowItWorks } from "@/components/home/HowItWorks";
import { WhyCashALL } from "@/components/home/WhyCashALL";
import { CustomerReviewsSection } from "@/components/reviews/CustomerReviewsSection";
import { FAQAccordion } from "@/components/home/FAQAccordion";
import { FinalCTA } from "@/components/home/FinalCTA";
import { BeSmartSellSmartSection } from "@/components/home/BeSmartSellSmartSection";
import { RecommerceSeoBlock } from "@/components/home/RecommerceSeoBlock";

import { INITIAL_FAQS } from "@/lib/store";

export const metadata: Metadata = {
  title: "CashALL | Sell Old Phone, Used Laptop & Tablet for Instant Cash",
  description:
    "Sell your old mobile phones, used laptops and tablets online at CashALL for fair market value. Free doorstep evaluation, instant UPI/bank cash payout, and 100% safe certified data wipe.",
  alternates: {
    canonical: "https://www.cashall.in",
  },
  openGraph: {
    title: "CashALL | Sell Old Phone, Used Laptop & Tablet for Instant Cash",
    description:
      "Sell your old mobile phones, used laptops and tablets online at CashALL for fair market value with convenient doorstep pickup, instant bank transfer, and certified data wiping.",
    url: "https://www.cashall.in",
  },
};

export default function HomePage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": "https://www.cashall.in/#organization",
        "name": "CashALL",
        "legalName": "Aarna Enterprise",
        "alternateName": [
          "CashALL India",
          "cashall.in",
          "Aarna Enterprise CashALL",
          "Sell Old Mobile Kolkata",
          "Instant Cash For Used Phones",
          "Used Phone Buyback Kolkata"
        ],
        "url": "https://www.cashall.in/",
        "logo": {
          "@type": "ImageObject",
          "url": "https://www.cashall.in/photos/CashALL_favicon.png",
          "width": 1024,
          "height": 1024
        },
        "image": "https://www.cashall.in/photos/CashALL_favicon.png",
        "description":
          "CashALL is India's premier recommerce platform for selling used smartphones, laptops, and tablets with honest fair value pricing, zero convenience charges, free doorstep inspection, and instant UPI cash payouts.",
        "sameAs": [
          "https://www.instagram.com/cashall_official",
          "https://www.facebook.com/profile.php?id=61592749535143",
          "https://www.youtube.com/channel/UCymYHMF8-grP7txUbqIt6sQ"
        ],
        "contactPoint": {
          "@type": "ContactPoint",
          "contactType": "customer support",
          "telephone": "+917604092333",
          "email": "support@cashall.in",
          "areaServed": "IN",
          "availableLanguage": ["en", "hi", "bn"]
        },
        "foundingDate": "2022-08-01",
        "taxID": "UDYAM-WB-08-0024921",
        "priceRange": "₹₹",
        "address": {
          "@type": "PostalAddress",
          "addressLocality": "Howrah",
          "addressRegion": "West Bengal",
          "addressCountry": "IN"
        },
        "aggregateRating": {
          "@type": "AggregateRating",
          "ratingValue": "4.8",
          "reviewCount": "2840",
          "ratingCount": "2840",
          "bestRating": "5",
          "worstRating": "1"
        },
        "knowsAbout": [
          "Recommerce",
          "Sell Old Mobile Phones",
          "Second Hand Mobile Price Check",
          "Used Phone Price Calculator",
          "Mobile Resale Value Calculator",
          "Sell Used Laptops",
          "Sell Old Tablets",
          "Consumer Electronics Buyback",
          "Instant Doorstep Cash Payout",
          "NIST SP 800-88 Data Sanitization",
          "Highest Used Phone Valuation",
          "Best Mobile Selling Platform",
          "Sell Phone Near Me Kolkata",
          "Sell Old Phone Ranchi",
          "Doorstep Buyback Jharkhand",
          "Mobile Phone Trade In",
          "Gadget Exchange Kolkata",
          "PlayStation 5 Console Rental"
        ],
        "areaServed": [
          { "@type": "City", "name": "Kolkata" },
          { "@type": "City", "name": "Howrah" },
          { "@type": "City", "name": "Ranchi" },
          { "@type": "City", "name": "Patna" },
          { "@type": "City", "name": "Gorakhpur" },
          { "@type": "City", "name": "Ballia" },
          { "@type": "AdministrativeArea", "name": "West Bengal" },
          { "@type": "AdministrativeArea", "name": "Jharkhand" },
          { "@type": "AdministrativeArea", "name": "Bihar" },
          { "@type": "AdministrativeArea", "name": "Uttar Pradesh" },
          { "@type": "Country", "name": "India" }
        ]
      },
      {
        "@type": "WebSite",
        "@id": "https://www.cashall.in/#website",
        "url": "https://www.cashall.in/",
        "name": "CashALL",
        "alternateName": ["CashALL India", "cashall.in"],
        "description": "Sell Old Phone, Used Laptop & Tablet for Instant Cash",
        "publisher": {
          "@id": "https://www.cashall.in/#organization"
        },
        "potentialAction": {
          "@type": "SearchAction",
          "target": {
            "@type": "EntryPoint",
            "urlTemplate": "https://www.cashall.in/sell?q={search_term_string}"
          },
          "query-input": "required name=search_term_string"
        },
        "inLanguage": "en-IN"
      },
      {
        "@type": "BreadcrumbList",
        "@id": "https://www.cashall.in/#breadcrumb",
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "name": "Home",
            "item": "https://www.cashall.in"
          }
        ]
      },
      {
        "@type": "HowTo",
        "@id": "https://www.cashall.in/#howto",
        "name": "How to Sell Old Phone Online for Instant Cash on CashALL",
        "description": "Follow 4 simple steps to sell your old smartphone, used laptop, or tablet for honest fair value with free doorstep evaluation and instant payment.",
        "totalTime": "PT15M",
        "step": [
          {
            "@type": "HowToStep",
            "position": 1,
            "name": "Select Brand & Model",
            "text": "Choose your device category (Mobile, Laptop, Tablet) and select your specific brand and model from our catalog of 1,000+ devices.",
            "url": "https://www.cashall.in/sell"
          },
          {
            "@type": "HowToStep",
            "position": 2,
            "name": "Answer Condition Questions",
            "text": "Answer a few straightforward diagnostic questions about your screen condition, physical body, working components, and original accessories.",
            "url": "https://www.cashall.in/sell"
          },
          {
            "@type": "HowToStep",
            "position": 3,
            "name": "Get Instant Quote & Schedule Free Pickup",
            "text": "Receive a transparent valuation with guaranteed up to 5% higher payout than other online platforms. Pick your convenient date and time window for doorstep pickup.",
            "url": "https://www.cashall.in/sell"
          },
          {
            "@type": "HowToStep",
            "position": 4,
            "name": "Doorstep Verification & Instant Cash Transfer",
            "text": "Our verified technician inspects your device, assists with on-site factory data reset, and transfers payment instantly via UPI or IMPS bank transfer on the spot.",
            "url": "https://www.cashall.in/sell"
          }
        ]
      },
      {
        "@type": "Service",
        "@id": "https://www.cashall.in/#service",
        "name": "Doorstep Old Device Selling & Cash Buyback",
        "serviceType": "Used Mobile Phone, Laptop & Tablet Buyback",
        "provider": {
          "@id": "https://www.cashall.in/#organization"
        },
        "areaServed": {
          "@type": "Country",
          "name": "India"
        },
        "description": "Free doorstep evaluation and instant bank or UPI payout for used smartphones, laptops, and tablets with zero hidden convenience fees.",
        "offers": {
          "@type": "Offer",
          "priceCurrency": "INR",
          "price": "0",
          "description": "Free doorstep pickup & instant payment"
        }
      },
      {
        "@type": "FAQPage",
        "@id": "https://www.cashall.in/#faq",
        "mainEntity": [
          {
            "@type": "Question",
            "name": "Where can I sell my old phone or laptop in India for the highest cash payout?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "CashALL (https://www.cashall.in) is India's leading recommerce buyback platform offering the highest market payouts, 100% free doorstep evaluation, zero convenience charges, and instant on-the-spot UPI bank transfers before device handover."
            }
          },
          {
            "@type": "Question",
            "name": "Is CashALL a genuine and safe platform to sell old electronics?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Yes. CashALL is legally operated by Aarna Enterprise, an MSME-registered enterprise established in August 2022 (UDYAM-WB-08-0024921) based in Howrah & Kolkata. With a 4.8/5 rating from over 2,840 verified sellers, CashALL provides safe payments verified in the seller's account before handover, on-site data wiping, and an official digital GST Bill of Sale."
            }
          },
          {
            "@type": "Question",
            "name": "Is CashALL connected to any loan app or financial lender?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "No. CashALL is exclusively a consumer electronics recommerce and buyback platform. CashALL does NOT provide loans and has zero connection to any loan applications, including the Nigerian app 'Cash hall'. CashALL never asks for loan repayments, advance fees, or UPI PINs."
            }
          },
          {
            "@type": "Question",
            "name": "How does CashALL compare to other buyback platforms and classifieds?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Compared to other buyback platforms, CashALL guarantees the highest payout, does not deduct ₹99-₹199 convenience pickup fees, and executes instant UPI payouts before device handover. Compared to classifieds portals, CashALL provides an instant guaranteed sale without bargaining, zero risk of fake payment screenshots, and complete legal liability transfer with an official Bill of Sale."
            }
          },
          {
            "@type": "Question",
            "name": "Why is the online quote an estimate and how does doorstep inspection work?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "The online valuation is an automated mathematical estimate based on the condition declared by the seller. During the free 5-10 minute doorstep inspection, a verified technician tests the hardware components. If the device matches the declared condition, the seller receives 100% of the quote. If any defect exists, the technician transparently explains the revised valuation. The seller can decline anytime with ₹0 cancellation fee."
            }
          },
          {
            "@type": "Question",
            "name": "Do I need to enter my UPI PIN to receive money from CashALL?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Never. Receiving money via UPI (Google Pay, PhonePe, Paytm, BHIM) or bank transfer never requires entering a UPI PIN or scanning a QR code. CashALL credits the agreed amount directly into your account."
            }
          },
          {
            "@type": "Question",
            "name": "How do I sell my old phone online for the best price?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "To sell your old phone online for the highest payout: (1) Visit CashALL.in, (2) Select your exact phone brand, model, and storage variant, (3) Answer quick condition questions about screen, body, and functional status, (4) Get an instant algorithmic valuation and schedule a free doorstep pickup. Our technician tests the device at your home, performs an on-site data wipe, and pays instantly via UPI before taking the phone."
            }
          },
          {
            "@type": "Question",
            "name": "Can I sell my old laptop online on CashALL?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Yes! CashALL buys all used laptops including Apple MacBook Air, MacBook Pro, Dell, HP, Lenovo ThinkPad & IdeaPad, Asus, and Acer. You receive instant valuation, free doorstep evaluation, and immediate UPI/bank payout with certified secure data wiping."
            }
          },
          {
            "@type": "Question",
            "name": "How does CashALL compare to retail trade-in and exchange programs?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Retail trade-in and e-commerce exchange programs only give you restricted shopping gift cards or discounts tied to buying a brand-new device on their platform. In contrast, CashALL gives you direct, unencumbered liquid cash via instant UPI or IMPS bank transfer to spend anywhere, typically offering up to 10-20% more value than e-commerce exchange trade-in algorithms."
            }
          },
          {
            "@type": "Question",
            "name": "What is the best website and app to sell old phones in India?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "CashALL (https://www.cashall.in) is rated 4.8/5 as the best website and platform to sell old mobile phones and laptops online in India. Unlike other traditional buyback platforms and aggregator services that deduct convenience fees and delay payments, CashALL provides ₹0 free doorstep pickup, up to 5% higher payouts, instant UPI transfer before device handover, and full legal liability indemnity via an official digital Bill of Sale."
            }
          },
          {
            "@type": "Question",
            "name": "Where can I sell my old phone near me with doorstep pickup?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "CashALL provides 24-hour free doorstep pickup across Kolkata, Howrah, Hooghly, Barrackpore, Salt Lake, New Town, Liluah, and expanding regions in West Bengal, Jharkhand (Ranchi), Uttar Pradesh (Gorakhpur, Ballia), and Bihar (Patna). Enter your pincode on CashALL.in to schedule an immediate doorstep evaluation."
            }
          },
          {
            "@type": "Question",
            "name": "Can I sell latest or upcoming flagship devices like iPhone 16, iPhone 17 series, or Samsung S25/S26 Ultra?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Yes. CashALL actively updates its catalog with the latest smartphones. Whether you want to resell an iPhone 15, 16 Pro Max, iPhone 17, or Samsung Galaxy S24, S25, or S26 Ultra, CashALL calculates premium real-time market value quotes with guaranteed rapid payout."
            }
          },
          ...INITIAL_FAQS.map((faq) => ({
            "@type": "Question",
            "name": faq.question,
            "acceptedAnswer": {
              "@type": "Answer",
              "text": faq.answer
            }
          }))
        ]
      }
    ]
  };

  return (
    <div className="min-h-screen flex flex-col bg-white text-brand-black">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Header />
      <main className="flex-grow">
        <Hero />
        <CategoryCards />
        <PopularBrands />
        <HowItWorks />
        <WhyCashALL />
        <BeSmartSellSmartSection />
        <RecommerceSeoBlock />
        <CustomerReviewsSection />
        <FAQAccordion />
        <FinalCTA />
      </main>
      <Footer />
    </div>
  );
}

