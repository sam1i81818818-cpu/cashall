import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sell Old Laptop Online | Instant Cash & Free Doorstep Pickup",
  description:
    "Sell your used laptop online on CashALL. Get the best price for Apple MacBook, Dell, HP, Lenovo, Asus, Acer & gaming laptops with free doorstep inspection and instant bank payout.",
  keywords: [
    "sell old laptop online",
    "sell used laptop for cash",
    "sell macbook online",
    "sell old macbook air pro",
    "sell used dell laptop",
    "sell old hp laptop online",
    "sell lenovo laptop for cash",
    "sell gaming laptop used",
    "old laptop resale price India",
    "doorstep laptop pickup",
    "sell broken laptop online",
    "instant cash for used laptop",
    "sell old laptop Kolkata"
  ],
  alternates: {
    canonical: "https://www.cashall.in/sell/laptop",
  },
  openGraph: {
    title: "Sell Old Laptop Online | Best Price & Instant Cash | CashALL",
    description:
      "Get the highest resale value for your used laptop. Free doorstep evaluation, certified data wipe, and instant payment.",
    url: "https://www.cashall.in/sell/laptop",
  },
};

export default function SellLaptopLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
