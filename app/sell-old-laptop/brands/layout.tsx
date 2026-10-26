import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sell Old Laptop by Brand | Apple MacBook, Dell, HP, Lenovo | CashALL",
  description:
    "Choose your laptop manufacturer to sell your old laptop online for highest instant cash. Free doorstep evaluation, certified NIST 800-88 SSD wipe, and spot payment.",
  keywords: [
    "sell old laptop by brand",
    "sell macbook online",
    "sell dell laptop online",
    "sell hp laptop for cash",
    "sell lenovo thinkpad online",
    "sell asus gaming laptop online",
    "sell acer laptop online",
    "all laptop brands cashall",
    "cashify laptop alternative brands",
    "cashkr sell laptop brand directory",
  ],
  alternates: {
    canonical: "https://www.cashall.in/sell-old-laptop/brands",
  },
  openGraph: {
    title: "Sell Old Laptop by Brand | CashALL",
    description:
      "Select your laptop brand to calculate instant guaranteed resale price with free doorstep evaluation.",
    url: "https://www.cashall.in/sell-old-laptop/brands",
  },
};

export default function SellLaptopBrandsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
