import type { Metadata } from "next";

const LAPTOP_BRAND_NAMES: Record<string, string> = {
  apple: "Apple MacBook",
  dell: "Dell",
  hp: "HP",
  lenovo: "Lenovo ThinkPad & IdeaPad",
  asus: "Asus ROG & ZenBook",
  acer: "Acer Predator & Aspire",
  samsung: "Samsung Galaxy Book",
  msi: "MSI Gaming",
  microsoft: "Microsoft Surface",
  xiaomi: "Xiaomi Mi Notebook",
};

export async function generateMetadata({
  params,
}: {
  params: { brand: string };
}): Promise<Metadata> {
  const brandSlug = params.brand.toLowerCase();
  const brandName = LAPTOP_BRAND_NAMES[brandSlug] || params.brand.toUpperCase();

  const title = `Sell Old ${brandName} Laptop Online | Highest Payout & Instant Cash | CashALL`;
  const description = `Sell your old ${brandName} laptop online for maximum resale price on CashALL. Free doorstep pickup, NIST 800-88 certified SSD erase, and spot UPI transfer before handover.`;

  return {
    title,
    description,
    keywords: [
      `sell old ${brandName} laptop`,
      `sell used ${brandName} for cash`,
      `sell ${brandName} laptop online`,
      `best price for old ${brandName} laptop`,
      `doorstep ${brandName} laptop buyer`,
      `used ${brandName} valuation`,
      "sell old laptop online",
      "instant cash for old laptops",
      `cashify alternative sell ${brandName} laptop`,
      `cashkr alternative sell ${brandName} laptop`,
    ],
    alternates: {
      canonical: `https://www.cashall.in/sell-old-laptop/${brandSlug}`,
    },
    openGraph: {
      title: `${title} | CashALL`,
      description,
      url: `https://www.cashall.in/sell-old-laptop/${brandSlug}`,
    },
  };
}

export default function LaptopBrandLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { brand: string };
}) {
  const brandSlug = params.brand.toLowerCase();
  const brandName = LAPTOP_BRAND_NAMES[brandSlug] || params.brand.toUpperCase();

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": `https://www.cashall.in/sell-old-laptop/${brandSlug}`,
        "url": `https://www.cashall.in/sell-old-laptop/${brandSlug}`,
        "name": `Sell Old ${brandName} Laptop Online`,
        "description": `Get guaranteed resale quotes for used ${brandName} laptops with free doorstep inspection.`,
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
          {
            "@type": "ListItem",
            "position": 3,
            "name": brandName,
            "item": `https://www.cashall.in/sell-old-laptop/${brandSlug}`,
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
