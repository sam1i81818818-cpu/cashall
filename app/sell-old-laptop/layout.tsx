import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sell Old Laptop Online for Instant Cash | Free Doorstep Pickup | CashALL",
  description:
    "Sell your used laptop or MacBook online for the highest locked price in India. Certified NIST 800-88 cryptographic SSD wipe, free doorstep evaluation, and instant UPI payment before handover.",
  keywords: [
    "sell old laptop online",
    "sell used laptop for cash",
    "sell laptop online india",
    "sell macbook online",
    "sell dell laptop for cash",
    "sell hp laptop online",
    "sell lenovo thinkpad online",
    "second hand laptop price calculator",
    "cashify laptop alternative",
    "cashkr sell laptop online",
    "doorstep laptop buyer kolkata howrah patna",
  ],
  alternates: {
    canonical: "https://www.cashall.in/sell-old-laptop",
  },
  openGraph: {
    title: "Sell Old Laptop Online for Instant Cash | CashALL",
    description:
      "Get guaranteed top value for used MacBooks & Windows laptops. 100% cryptographic data wipe, free doorstep collection, and instant UPI bank transfer.",
    url: "https://www.cashall.in/sell-old-laptop",
    type: "website",
    images: ["/photos/CashALL_logo.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Sell Used Laptop Online - Instant Price Quote | CashALL",
    description:
      "Highest price for old laptops & MacBooks with certified on-site SSD data wipe and spot payment.",
    images: ["/photos/CashALL_logo.png"],
  },
};

export default function SellOldLaptopLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": "https://www.cashall.in/sell-old-laptop",
        "url": "https://www.cashall.in/sell-old-laptop",
        "name": "Sell Old Laptop Online for Instant Cash",
        "description":
          "Calculate guaranteed resale value for old laptops & MacBooks. Free doorstep pickup, on-site hardware check, and instant bank transfer.",
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
            "name": "Sell Old Laptop",
            "item": "https://www.cashall.in/sell-old-laptop",
          },
        ],
      },
      {
        "@type": "Service",
        "name": "Laptop Recommerce & Buyback Service",
        "serviceType": "Electronics Recommerce",
        "provider": {
          "@type": "Organization",
          "name": "CashALL",
          "url": "https://www.cashall.in",
        },
        "areaServed": ["IN-WB", "IN-BR", "IN-UP", "IN"],
        "hasOfferCatalog": {
          "@type": "OfferCatalog",
          "name": "Laptop Resale Catalog",
          "itemListElement": [
            {
              "@type": "Offer",
              "itemOffered": {
                "@type": "Product",
                "name": "Used Apple MacBook Pro & Air",
              },
            },
            {
              "@type": "Offer",
              "itemOffered": {
                "@type": "Product",
                "name": "Used Dell XPS & Inspiron Laptops",
              },
            },
            {
              "@type": "Offer",
              "itemOffered": {
                "@type": "Product",
                "name": "Used HP Pavilion, Spectre & Envy Laptops",
              },
            },
            {
              "@type": "Offer",
              "itemOffered": {
                "@type": "Product",
                "name": "Used Lenovo ThinkPad & IdeaPad Laptops",
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
