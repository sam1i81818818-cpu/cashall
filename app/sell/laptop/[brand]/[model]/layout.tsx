import type { Metadata } from "next";
import { INITIAL_MODELS } from "@/lib/store";

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

  const title = `Sell Old ${modelName} Laptop Online | Highest Payout | CashALL`;
  const description = `Sell your used ${modelName} laptop online on CashALL. Free doorstep inspection, safe data wipe, and instant bank payout across India.`;

  return {
    title,
    description,
    keywords: [
      `sell ${modelName}`,
      `sell old ${modelName}`,
      `sell used ${modelName} laptop`,
      `best price for ${modelName} laptop`,
      `${modelName} resale value`,
      `sell ${modelName} online Kolkata`
    ],
    alternates: {
      canonical: `https://www.cashall.in/sell/laptop/${brandSlug}/${modelSlug}`,
    },
    openGraph: {
      title: `${title} | CashALL`,
      description,
      url: `https://www.cashall.in/sell/laptop/${brandSlug}/${modelSlug}`,
    },
  };
}

export default function LaptopModelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
