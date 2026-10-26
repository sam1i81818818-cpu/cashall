import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sell Old Tablet & iPad Online for Instant Cash | Free Doorstep Pickup | CashALL",
  description:
    "Sell your used Apple iPad, Samsung Galaxy Tab, or Android tablet online for India's highest locked price. Safe certified data wipe, free doorstep evaluation, and instant UPI bank payment before handover.",
  keywords: [
    "sell old tablet online",
    "sell used ipad for cash",
    "sell tablet online india",
    "sell ipad online",
    "sell samsung galaxy tab",
    "sell ipad pro online",
    "sell ipad air for cash",
    "sell lenovo tablet online",
    "tablet resale price calculator",
    "cashify tablet alternative",
    "cashkr sell tablet online",
    "doorstep tablet buyer kolkata howrah patna",
  ],
  alternates: {
    canonical: "https://www.cashall.in/sell-old-tablet",
  },
  openGraph: {
    title: "Sell Old Tablet & iPad Online for Instant Cash | CashALL",
    description:
      "Get guaranteed top value for used iPads & Android tablets. 100% safe certified data wipe, free doorstep pickup, and instant UPI bank transfer.",
    url: "https://www.cashall.in/sell-old-tablet",
    type: "website",
    images: ["/photos/CashALL_logo.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Sell Used Tablet Online - Instant Price Quote | CashALL",
    description:
      "Highest price for old tablets & Apple iPads with certified on-site data wipe and spot payment.",
    images: ["/photos/CashALL_logo.png"],
  },
};

export default function SellOldTabletLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": "https://www.cashall.in/sell-old-tablet",
        "url": "https://www.cashall.in/sell-old-tablet",
        "name": "Sell Old Tablet & iPad Online for Instant Cash",
        "description":
          "Calculate guaranteed resale value for old Apple iPads & Android tablets. Free doorstep pickup, on-site hardware check, and instant bank transfer.",
        "isPartOf": {
          "@type": "WebSite",
          "name": "CashALL",
          "url": "https://www.cashall.in",
        },
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
            "name": "Sell Old Tablet",
            "item": "https://www.cashall.in/sell-old-tablet",
          },
        ],
      },
      {
        "@type": "Service",
        "name": "Tablet & iPad Recommerce Service",
        "serviceType": "Electronics Recommerce",
        "provider": {
          "@type": "Organization",
          "name": "CashALL",
          "url": "https://www.cashall.in",
        },
        "areaServed": ["IN-WB", "IN-BR", "IN-UP", "IN"],
        "hasOfferCatalog": {
          "@type": "OfferCatalog",
          "name": "Tablet Resale Catalog",
          "itemListElement": [
            {
              "@type": "Offer",
              "itemOffered": {
                "@type": "Product",
                "name": "Used Apple iPad Pro, Air, & Mini",
              },
            },
            {
              "@type": "Offer",
              "itemOffered": {
                "@type": "Product",
                "name": "Used Samsung Galaxy Tab S9 & S8",
              },
            },
          ],
        },
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
