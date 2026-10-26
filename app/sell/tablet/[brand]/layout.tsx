import type { Metadata } from "next";

const TABLET_BRAND_NAMES: Record<string, string> = {
  apple: "Apple iPad",
  samsung: "Samsung Galaxy Tab",
  lenovo: "Lenovo Tab",
  xiaomi: "Xiaomi Pad",
};

export async function generateMetadata({
  params,
}: {
  params: { brand: string };
}): Promise<Metadata> {
  const brandSlug = params.brand.toLowerCase();
  const brandName = TABLET_BRAND_NAMES[brandSlug] || params.brand.toUpperCase();

  const title = `Sell Old ${brandName} Online | Highest Cash Payout & Free Doorstep Pickup`;
  const description = `Sell your used ${brandName} online for the best price on CashALL. Free doorstep pickup, instant UPI cash payout, and 100% certified data wipe.`;

  return {
    title,
    description,
    keywords: [
      `sell old ${brandName}`,
      `sell used ${brandName} for cash`,
      `sell ${brandName} online`,
      `best price for old ${brandName}`,
      `doorstep ${brandName} selling`,
      "sell old tablet online",
      "sell used iPad online",
      "instant cash for used tablet"
    ],
    alternates: {
      canonical: `https://www.cashall.in/sell/tablet/${brandSlug}`,
    },
    openGraph: {
      title: `${title} | CashALL`,
      description,
      url: `https://www.cashall.in/sell/tablet/${brandSlug}`,
    },
  };
}

export default function TabletBrandLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
