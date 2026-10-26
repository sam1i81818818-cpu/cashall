import { redirect } from "next/navigation";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "CashALL vs Other Platforms & Local Sellers | Used Device Comparison",
  description:
    "Compare CashALL against typical online buyback platforms, local offline mobile shop dealers, and classified sites.",
  robots: {
    index: false,
    follow: false,
  },
  alternates: {
    canonical: "https://www.cashall.in/compare/cashall-vs-other-platforms",
  },
};

export default function Page() {
  redirect("/compare/cashall-vs-other-platforms");
}
