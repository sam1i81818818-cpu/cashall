import type { Metadata } from "next";
import { CUSTOMER_REVIEWS, REVIEW_STATS } from "@/lib/data/reviewsData";

export const metadata: Metadata = {
  title: "Customer Reviews & Real Selling Experiences | CashALL",
  description:
    "Read 65 verified customer reviews for CashALL (Aarna Enterprise). 4.8/5 average rating across Kolkata, Howrah, Gorakhpur, Patna, and India. Safe instant UPI payouts, free doorstep inspection, and 100% certified data wipe.",
  alternates: {
    canonical: "https://www.cashall.in/reviews",
  },
  openGraph: {
    title: "CashALL Customer Reviews | 4.8/5 Star Rated Device Buyback",
    description:
      "See real feedback from 65 verified customers who sold their old phones, laptops, and tablets to CashALL. Real reviews, transparent valuations, and instant doorstep payments.",
    url: "https://www.cashall.in/reviews",
    type: "website",
    images: ["/photos/CashALL_logo.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "CashALL Verified Customer Reviews & Testimonials",
    description:
      "4.8/5 stars across 65 verified sellers. Instant bank and UPI payouts at your doorstep with CashALL.",
    images: ["/photos/CashALL_logo.png"],
  },
};

export default function ReviewsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Construct rich Schema.org JSON-LD for Search Engines & AI Crawlers (AEO / GEO)
  const schemaReviews = CUSTOMER_REVIEWS.slice(0, 25).map((rev) => ({
    "@type": "Review",
    "author": {
      "@type": "Person",
      "name": rev.customerName,
    },
    "datePublished": "2025-01-15",
    "reviewRating": {
      "@type": "Rating",
      "ratingValue": rev.rating.toString(),
      "bestRating": "5",
      "worstRating": "1",
    },
    "name": rev.reviewTitle,
    "reviewBody": rev.reviewText,
    "itemReviewed": {
      "@type": "Product",
      "name": rev.deviceSold,
      "description": `Used ${rev.deviceSold} sold on CashALL recommerce buyback platform.`,
    },
    "publisher": {
      "@type": "Organization",
      "name": "CashALL",
      "legalName": "Aarna Enterprise",
    },
  }));

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "LocalBusiness",
        "@id": "https://www.cashall.in/#organization",
        "name": "CashALL",
        "legalName": "Aarna Enterprise",
        "url": "https://www.cashall.in/",
        "logo": "https://www.cashall.in/photos/CashALL_favicon.png",
        "image": "https://www.cashall.in/photos/CashALL_favicon.png",
        "telephone": "+917604092333",
        "email": "support@cashall.in",
        "priceRange": "₹₹",
        "address": {
          "@type": "PostalAddress",
          "addressLocality": "Kolkata",
          "addressRegion": "West Bengal",
          "addressCountry": "IN",
        },
        "aggregateRating": {
          "@type": "AggregateRating",
          "ratingValue": REVIEW_STATS.averageRating.toString(),
          "reviewCount": REVIEW_STATS.totalReviews.toString(),
          "ratingCount": REVIEW_STATS.totalReviews.toString(),
          "bestRating": "5",
          "worstRating": "3",
        },
        "review": schemaReviews,
      },
      {
        "@type": "BreadcrumbList",
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "name": "Home",
            "item": "https://www.cashall.in",
          },
          {
            "@type": "ListItem",
            "position": 2,
            "name": "Customer Reviews",
            "item": "https://www.cashall.in/reviews",
          },
        ],
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {children}
    </>
  );
}
