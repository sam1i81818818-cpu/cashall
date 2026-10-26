import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Rent PS5 (PlayStation 5) Online | Daily & Weekly Rental with Top Games | CashALL",
  description:
    "Rent PlayStation 5 (PS5) console in Kolkata & West Bengal on CashALL. Comes with 2 DualSense wireless controllers, top games (GTA V, Spider-Man 2, FC 24, God of War), free doorstep delivery, and setup.",
  keywords: [
    "ps5 rent",
    "rent ps5",
    "rent ps5 online",
    "playstation 5 rent",
    "rent playstation 5 online",
    "ps5 rental Kolkata",
    "ps5 on rent per day",
    "ps5 weekly rent",
    "rent ps5 with games",
    "rent ps5 dual controller",
    "playstation on rent near me",
    "sell ps5",
    "buy used ps5",
    "ps5 gaming console rental"
  ],
  alternates: {
    canonical: "https://www.cashall.in/rent/ps5",
  },
  openGraph: {
    title: "Rent PlayStation 5 (PS5) Console Online | Doorstep Delivery | CashALL",
    description:
      "Play next-gen gaming without buying! Rent PS5 console with 2 controllers and 4K games. Instant doorstep delivery and easy ID verification.",
    url: "https://www.cashall.in/rent/ps5",
  },
};

export default function RentPS5Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
