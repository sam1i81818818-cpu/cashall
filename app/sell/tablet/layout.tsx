import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sell Old Tablet & iPad Online | Highest Resale Price",
  description:
    "Sell your used tablet and iPad online on CashALL. Instant price valuation for Apple iPad, Samsung Galaxy Tab, Lenovo & Xiaomi tablets with free doorstep pickup and instant cash.",
  keywords: [
    "sell old tablet online",
    "sell used ipad online",
    "sell ipad for cash",
    "sell old ipad pro",
    "sell ipad air mini used",
    "sell samsung galaxy tab online",
    "tablet resale value India",
    "instant cash for old tablet",
    "doorstep tablet pickup",
    "sell broken ipad online"
  ],
  alternates: {
    canonical: "https://www.cashall.in/sell/tablet",
  },
  openGraph: {
    title: "Sell Old Tablet & iPad Online | Best Price | CashALL",
    description:
      "Get top cash for your old tablet or iPad. Free doorstep pickup, on-the-spot verification, and instant UPI payment.",
    url: "https://www.cashall.in/sell/tablet",
  },
};

export default function SellTabletLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
