import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sell Old Tablet by Brand | Apple iPad, Samsung Tab, Lenovo | CashALL",
  description:
    "Choose your tablet brand to sell old Apple iPads & Android tablets online for maximum value. Free doorstep evaluation, certified data wiping, and instant UPI payout.",
  keywords: [
    "sell old tablet by brand",
    "sell ipad online",
    "sell samsung galaxy tab online",
    "sell lenovo tablet for cash",
    "sell xiaomi pad online",
    "sell oneplus pad online",
    "all tablet brands cashall",
    "cashify tablet alternative brands",
    "cashkr sell tablet brand directory",
  ],
  alternates: {
    canonical: "https://www.cashall.in/sell-old-tablet/brands",
  },
  openGraph: {
    title: "Sell Old Tablet by Brand | CashALL",
    description:
      "Select your tablet brand to calculate instant guaranteed resale price with free doorstep evaluation.",
    url: "https://www.cashall.in/sell-old-tablet/brands",
  },
};

export default function SellTabletBrandsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
