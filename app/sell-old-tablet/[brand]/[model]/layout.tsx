import type { Metadata } from "next";
import { INITIAL_MODELS, INITIAL_BRANDS, INITIAL_VARIANTS } from "@/lib/store";

export async function generateMetadata({
  params,
}: {
  params: { brand: string; model: string };
}): Promise<Metadata> {
  const brandSlug = params.brand.toLowerCase();
  const modelSlug = params.model.toLowerCase();

  const foundModel = INITIAL_MODELS.find(
    (m) =>
      (m.category === "TABLET" || m.id.startsWith("m-tablet-") || m.slug.includes("ipad") || m.slug.includes("tab")) &&
      (m.slug.toLowerCase() === modelSlug ||
        m.slug.toLowerCase() === `${brandSlug}-${modelSlug}` ||
        m.slug.toLowerCase().replace(`${brandSlug}-`, "") === modelSlug)
  ) || INITIAL_MODELS.find(
    (m) =>
      m.slug.toLowerCase() === modelSlug ||
      m.slug.toLowerCase() === `${brandSlug}-${modelSlug}`
  );

  const modelName =
    foundModel?.name ||
    modelSlug
      .split("-")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ");

  const title = `Sell Old ${modelName} Online | Highest Payout & Instant Cash | CashALL`;
  const description = `Sell your used ${modelName} tablet online for the highest locked resale price on CashALL. Free doorstep inspection, safe account reset, and spot UPI transfer before handover.`;

  return {
    title,
    description,
    keywords: [
      `sell ${modelName}`,
      `sell old ${modelName}`,
      `sell used ${modelName} for cash`,
      `best price for ${modelName}`,
      `${modelName} resale value`,
      `doorstep ${modelName} selling`,
      `cashify alternative sell ${modelName}`,
      `cashkr alternative sell ${modelName}`,
      `${modelName} buyback price India`,
    ],
    alternates: {
      canonical: `https://www.cashall.in/sell-old-tablet/${brandSlug}/${modelSlug}`,
    },
    openGraph: {
      title: `${title} | CashALL`,
      description,
      url: `https://www.cashall.in/sell-old-tablet/${brandSlug}/${modelSlug}`,
      images: [
        {
          url: foundModel?.imageUrl || "https://www.cashall.in/photos/CashALL_facebookcover.png",
          width: 1200,
          height: 630,
          alt: `Sell ${modelName} on CashALL`,
        },
      ],
    },
  };
}

export default function TabletModelLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { brand: string; model: string };
}) {
  const brandSlug = params.brand.toLowerCase();
  const modelSlug = params.model.toLowerCase();

  const foundModel = INITIAL_MODELS.find(
    (m) =>
      (m.category === "TABLET" || m.id.startsWith("m-tablet-") || m.slug.includes("ipad") || m.slug.includes("tab")) &&
      (m.slug.toLowerCase() === modelSlug ||
        m.slug.toLowerCase() === `${brandSlug}-${modelSlug}`)
  ) || INITIAL_MODELS.find(
    (m) => m.slug.toLowerCase() === modelSlug
  );

  const modelName =
    foundModel?.name ||
    modelSlug
      .split("-")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ");

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Product",
        "name": `Used ${modelName}`,
        "image": foundModel?.imageUrl || "https://www.cashall.in/photos/CashALL_facebookcover.png",
        "description": `Sell your old or used ${modelName} tablet on CashALL for maximum instant cash payout.`,
        "offers": {
          "@type": "AggregateOffer",
          "priceCurrency": "INR",
          "lowPrice": "1200",
          "highPrice": "118000",
          "offerCount": "1",
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
            "name": params.brand.toUpperCase(),
            "item": `https://www.cashall.in/sell-old-tablet/${brandSlug}`,
          },
          {
            "@type": "ListItem",
            "position": 4,
            "name": modelName,
            "item": `https://www.cashall.in/sell-old-tablet/${brandSlug}/${modelSlug}`,
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
