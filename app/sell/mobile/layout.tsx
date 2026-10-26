import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sell Old Mobile Phone Online | Best Price & Instant Cash Payout",
  description:
    "Sell your old smartphone online on CashALL. Get instant valuations for Apple iPhone, Samsung, OnePlus, Xiaomi, Vivo, Oppo, Realme & more with free doorstep pickup and instant cash payout.",
  keywords: [
    "sell old phone online",
    "sell used mobile phone",
    "sell old smartphone for cash",
    "sell used phone for cash",
    "instant cash for old phones",
    "best place to sell old phone",
    "sell broken phone online",
    "sell old iphone online",
    "sell used iphone for cash",
    "sell old samsung phone",
    "sell used oneplus phone",
    "sell old xiaomi redmi",
    "sell old vivo phone",
    "sell old oppo phone",
    "doorstep mobile pickup",
    "sell old phone Kolkata",
    "sell used phone West Bengal"
  ],
  alternates: {
    canonical: "https://www.cashall.in/sell/mobile",
  },
  openGraph: {
    title: "Sell Old Mobile Phone Online | Best Price & Instant Cash | CashALL",
    description:
      "Get the highest resale value for your old smartphone. Free doorstep evaluation, certified data wiping, and instant UPI or bank payout.",
    url: "https://www.cashall.in/sell/mobile",
  },
};

export default function SellMobileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
