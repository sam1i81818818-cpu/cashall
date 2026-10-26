import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us & Customer Support | CashALL",
  description:
    "Get in touch with CashALL support for order tracking, pickup scheduling, payments, or general device selling queries. Call, WhatsApp, or email us.",
  alternates: {
    canonical: "https://www.cashall.in/contact",
  },
  openGraph: {
    title: "Contact Us & Customer Support | CashALL",
    description:
      "Get in touch with CashALL support for order tracking, pickup scheduling, payments, or general device selling queries. Call, WhatsApp, or email us.",
    url: "https://www.cashall.in/contact",
  },
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
