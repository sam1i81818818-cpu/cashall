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

  const title = `Sell Old ${modelName} Online | Highest Cash Payout | CashALL`;
  const description = `Sell your used ${modelName} online for the best resale value on CashALL. Free doorstep pickup, instant UPI cash payment, and certified data wiping.`;

  return {
    title,
    description,
    keywords: [
      `sell ${modelName}`,
      `sell old ${modelName}`,
      `sell used ${modelName}`,
      `best price for ${modelName}`,
      `${modelName} resale value`,
      `sell ${modelName} Kolkata`
    ],
    alternates: {
      canonical: `https://www.cashall.in/sell/tablet/${brandSlug}/${modelSlug}`,
    },
    openGraph: {
      title: `${title} | CashALL`,
      description,
      url: `https://www.cashall.in/sell/tablet/${brandSlug}/${modelSlug}`,
    },
  };
}

export default function TabletModelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
