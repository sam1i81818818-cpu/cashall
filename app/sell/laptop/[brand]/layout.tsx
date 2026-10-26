import type { Metadata } from "next";

const LAPTOP_BRAND_NAMES: Record<string, string> = {
  apple: "Apple MacBook",
  dell: "Dell",
  hp: "HP",
  lenovo: "Lenovo",
  asus: "Asus",
  acer: "Acer",
  msi: "MSI",
};

export async function generateMetadata({
  params,
}: {
  params: { brand: string };
}): Promise<Metadata> {
  const brandSlug = params.brand.toLowerCase();
  const brandName = LAPTOP_BRAND_NAMES[brandSlug] || params.brand.toUpperCase();

  const title = `Sell Old ${brandName} Laptop Online | Highest Cash Payout & Free Pickup`;
  const description = `Sell your used ${brandName} laptop online on CashALL. Get the best market value with free doorstep diagnostic inspection and immediate bank transfer.`;

  return {
    title,
    description,
    keywords: [
      `sell old ${brandName} laptop`,
      `sell used ${brandName} laptop online`,
      `sell ${brandName} laptop for cash`,
      `best price for old ${brandName} laptop`,
      `doorstep ${brandName} laptop selling`,
      "sell old laptop online",
      "instant cash for used laptop"
    ],
    alternates: {
      canonical: `https://www.cashall.in/sell/laptop/${brandSlug}`,
    },
    openGraph: {
      title: `${title} | CashALL`,
      description,
      url: `https://www.cashall.in/sell/laptop/${brandSlug}`,
    },
  };
}

export default function LaptopBrandLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
