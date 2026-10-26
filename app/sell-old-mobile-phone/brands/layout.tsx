import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sell Old Mobile Phone by Brand | All Smartphone Brands | CashALL",
  description:
    "Select your smartphone brand to sell old mobile phones online for the best price. Free doorstep evaluation, safe data wiping, and instant UPI cash across India.",
  keywords: [
    "sell old mobile phone by brand",
    "all mobile brands cashall",
    "sell apple iphone online",
    "sell samsung phone online",
    "sell oneplus phone online",
    "sell xiaomi redmi online",
    "sell vivo phone online",
    "sell oppo phone online",
    "sell realme phone online",
    "cash for used phones all brands",
  ],
  alternates: {
    canonical: "https://www.cashall.in/sell-old-mobile-phone/brands",
  },
  openGraph: {
    title: "Sell Old Mobile Phone by Brand | CashALL",
    description:
      "Select your smartphone brand to sell old mobile phones online for the best price with free doorstep pickup.",
    url: "https://www.cashall.in/sell-old-mobile-phone/brands",
  },
};

export default function SellMobileBrandsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
