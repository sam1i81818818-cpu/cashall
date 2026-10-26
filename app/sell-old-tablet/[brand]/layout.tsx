import type { Metadata } from "next";

const TABLET_BRAND_NAMES: Record<string, string> = {
  apple: "Apple iPad",
  samsung: "Samsung Galaxy Tab",
  lenovo: "Lenovo Tab",
  xiaomi: "Xiaomi Pad",
  oneplus: "OnePlus Pad",
  realme: "Realme Pad",
  honor: "Honor Pad",
  motorola: "Moto Tab",
};

export async function generateMetadata({
  params,
}: {
  params: { brand: string };
}): Promise<Metadata> {
  const brandSlug = params.brand.toLowerCase();
  const brandName = TABLET_BRAND_NAMES[brandSlug] || params.brand.toUpperCase();

  const title = `Sell Old ${brandName} Online | Highest Payout & Instant Cash | CashALL`;
  const description = `Sell your old ${brandName} online for maximum resale price on CashALL. Free doorstep pickup, safe account reset, and spot UPI bank transfer before handover.`;

  return {
    title,
    description,
    keywords: [
      `sell old ${brandName}`,
      `sell used ${brandName} for cash`,
      `sell ${brandName} online`,
      `best price for old ${brandName}`,
      `doorstep ${brandName} buyer`,
      `used ${brandName} valuation`,
      "sell old tablet online",
      "instant cash for old tablets",
      `cashify alternative sell ${brandName}`,
      `cashkr alternative sell ${brandName}`,
    ],
    alternates: {
      canonical: `https://www.cashall.in/sell-old-tablet/${brandSlug}`,
    },
    openGraph: {
      title: `${title} | CashALL`,
      description,
      url: `https://www.cashall.in/sell-old-tablet/${brandSlug}`,
    },
  };
}

export default function TabletBrandLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { brand: string };
}) {
  const brandSlug = params.brand.toLowerCase();
  const brandName = TABLET_BRAND_NAMES[brandSlug] || params.brand.toUpperCase();

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": `https://www.cashall.in/sell-old-tablet/${brandSlug}`,
        "url": `https://www.cashall.in/sell-old-tablet/${brandSlug}`,
        "name": `Sell Old ${brandName} Online`,
        "description": `Get guaranteed resale quotes for used ${brandName} with free doorstep inspection.`,
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
          {
            "@type": "ListItem",
            "position": 3,
            "name": brandName,
            "item": `https://www.cashall.in/sell-old-tablet/${brandSlug}`,
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
