import type { Metadata } from "next";

const BRAND_NAMES: Record<string, string> = {
  apple: "Apple iPhone",
  samsung: "Samsung Galaxy",
  oneplus: "OnePlus",
  xiaomi: "Xiaomi Redmi",
  vivo: "Vivo",
  oppo: "OPPO",
  realme: "Realme",
  poco: "POCO",
  motorola: "Motorola",
  google: "Google Pixel",
  iqoo: "iQOO",
  nothing: "Nothing Phone",
};

export async function generateMetadata({
  params,
}: {
  params: { brand: string };
}): Promise<Metadata> {
  const brandSlug = params.brand.toLowerCase();
  const brandName = BRAND_NAMES[brandSlug] || params.brand.toUpperCase();

  const title = `Sell Old ${brandName} Phone Online | Best Resale Price & Instant Cash`;
  const description = `Sell your old ${brandName} smartphone online for fair market value on CashALL. Free doorstep pickup, instant UPI cash transfer, and safe data wiping across India.`;

  return {
    title,
    description,
    keywords: [
      `sell old ${brandName}`,
      `sell used ${brandName} for cash`,
      `sell ${brandName} phone online`,
      `best price for old ${brandName}`,
      `doorstep ${brandName} selling`,
      `used ${brandName} valuation`,
      "sell old phone online",
      "instant cash for old phones"
    ],
    alternates: {
      canonical: `https://www.cashall.in/sell/mobile/${brandSlug}`,
    },
    openGraph: {
      title: `${title} | CashALL`,
      description,
      url: `https://www.cashall.in/sell/mobile/${brandSlug}`,
    },
  };
}

export default function MobileBrandLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
