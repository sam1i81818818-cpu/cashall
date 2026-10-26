import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sell Old Phone, Laptop & Tablet for Instant Cash | CashALL",
  description:
    "Select your device category to sell your used mobile, laptop, or tablet online. Best price guarantee, doorstep evaluation, and instant UPI payout.",
  alternates: {
    canonical: "https://www.cashall.in/sell",
  },
  openGraph: {
    title: "Sell Old Phone, Laptop & Tablet for Instant Cash | CashALL",
    description:
      "Select your device category to sell your used mobile, laptop, or tablet online. Best price guarantee, doorstep evaluation, and instant UPI payout.",
    url: "https://www.cashall.in/sell",
  },
};

export default function SellLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
