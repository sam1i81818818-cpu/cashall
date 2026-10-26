import type { Metadata } from "next";
import SellUsedPhonePage from "../sell-used-phone/page";

export const metadata: Metadata = {
  title: "Sell Old Phone Online for Instant Cash | Free Doorstep Pickup | CashALL",
  description:
    "Sell your old mobile phone online on CashALL. Get the best price quote, free doorstep pickup in 24 hours, zero pickup fees, certified data wipe & instant UPI payment.",
  keywords: [
    "sell old phone",
    "sell old phone online",
    "old phone sell online",
    "sell my old phone",
    "old mobile sell",
    "sell old mobile phone",
    "sell old phone near me",
    "where to sell old phone",
    "best place to sell old phone",
    "sell old iphone",
    "how to sell old phone"
  ],
  alternates: {
    canonical: "https://www.cashall.in/sell-old-phone",
  },
  openGraph: {
    title: "Sell Old Phone Online for Instant Cash | CashALL",
    description:
      "Sell your old smartphone online with free doorstep evaluation and instant cash payout via UPI.",
    url: "https://www.cashall.in/sell-old-phone",
    images: ["/photos/CashALL_logo.png"],
  },
};

export default function SellOldPhonePage() {
  return <SellUsedPhonePage />;
}
