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
      m.slug.toLowerCase() === modelSlug ||
      m.slug.toLowerCase() === `${brandSlug}-${modelSlug}` ||
      m.slug.toLowerCase().replace(`${brandSlug}-`, "") === modelSlug
  );

  const modelName =
    foundModel?.name ||
    modelSlug
      .split("-")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ");

  const title = `Sell Old ${modelName} Online | Best Resale Price & Instant Cash`;
  const description = `Sell your used ${modelName} online for the highest cash payout on CashALL. Free doorstep evaluation, zero hidden deductions, and instant UPI bank transfer.`;

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
      `sell ${modelName} online Kolkata`,
      `${modelName} buyback price India`,
    ],
    alternates: {
      canonical: `https://www.cashall.in/sell/mobile/${brandSlug}/${modelSlug}`,
    },
    openGraph: {
      title: `${title} | CashALL`,
      description,
      url: `https://www.cashall.in/sell/mobile/${brandSlug}/${modelSlug}`,
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

export default function MobileModelLayout({
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
      m.slug.toLowerCase() === modelSlug ||
      m.slug.toLowerCase() === `${brandSlug}-${modelSlug}` ||
      m.slug.toLowerCase().replace(`${brandSlug}-`, "") === modelSlug
  );

  const modelName =
    foundModel?.name ||
    modelSlug
      .split("-")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ");

  const brand = INITIAL_BRANDS.find((b) => b.slug.toLowerCase() === brandSlug) || {
    name: brandSlug.toUpperCase(),
  };

  const variants = foundModel ? INITIAL_VARIANTS.filter((v) => {
    if (v.modelId === foundModel.id) return true;
    const vId = v.modelId.toLowerCase();
    const mId = foundModel.id.toLowerCase();
    const mSlug = foundModel.slug.toLowerCase();
    if (vId === mId) return true;
    if (vId === `m-${mSlug}` || vId === `m-${brandSlug.toLowerCase()}-${mSlug}`) return true;
    if (vId.replace(/^m-([a-z0-9]+-)?/, "") === mSlug.replace(/^([a-z0-9]+-)?/, "")) return true;
    return false;
  }) : [];
  const maxPrice = variants.length > 0 ? Math.max(...variants.map((v) => v.basePrice)) : 12000;
  const minPrice = variants.length > 0 ? Math.round(Math.min(...variants.map((v) => v.basePrice)) * 0.65) : 18000;

  const productSchema = {
    "@context": "https://schema.org/",
    "@type": "Product",
    "name": modelName,
    "image": foundModel?.imageUrl || "https://www.cashall.in/photos/CashALL_favicon.png",
    "description": `Sell old used ${modelName} online for instant doorstep cash on CashALL. Free doorstep pickup and instant UPI payment.`,
    "brand": {
      "@type": "Brand",
      "name": brand.name,
    },
    "offers": {
      "@type": "AggregateOffer",
      "priceCurrency": "INR",
      "lowPrice": minPrice,
      "highPrice": maxPrice,
      "offerCount": variants.length || 2,
      "availability": "https://schema.org/InStock",
      "seller": {
        "@type": "Organization",
        "name": "CashALL",
        "url": "https://www.cashall.in",
      },
    },
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
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
        "name": "Sell Mobile",
        "item": "https://www.cashall.in/sell/mobile",
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": brand.name,
        "item": `https://www.cashall.in/sell/mobile/${brandSlug}`,
      },
      {
        "@type": "ListItem",
        "position": 4,
        "name": modelName,
        "item": `https://www.cashall.in/sell/mobile/${brandSlug}/${modelSlug}`,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      {children}
    </>
  );
}
