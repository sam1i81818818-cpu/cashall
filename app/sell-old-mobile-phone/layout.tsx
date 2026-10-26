import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sell Old Mobile Phone for Instant Cash | Free Doorstep Pickup | CashALL",
  description:
    "Sell your old mobile phone online at CashALL for the highest market price. Get an instant quote for Apple iPhone, Samsung, OnePlus, Vivo, Realme, Xiaomi & more in 60 seconds with free doorstep pickup, certified data wipe, and instant same-day UPI payment.",
  keywords: [
    "sell old mobile phone",
    "sell old mobile phone online",
    "sell old phone online",
    "sell old phone for instant cash",
    "sell used mobile phone",
    "sell my old phone",
    "sell my phone online",
    "second hand mobile price check",
    "used phone valuation",
    "sell old smartphone for cash",
    "cash for phone",
    "best place to sell old phone",
    "cashify alternative",
    "cashkr alternative",
    "sell old iphone online",
    "sell iphone 16",
    "sell iphone 15 pro max",
    "sell samsung s24 ultra",
    "sell old samsung phone",
    "sell old oneplus phone",
    "sell old xiaomi phone",
    "sell old vivo phone",
    "free doorstep mobile pickup",
    "sell old phone Kolkata",
    "sell old phone Howrah",
    "sell old phone Patna",
    "sell old phone Gorakhpur",
    "sell old phone Ranchi"
  ],
  alternates: {
    canonical: "https://www.cashall.in/sell-old-mobile-phone",
  },
  openGraph: {
    title: "Sell Old Mobile Phone Online for Instant Cash | CashALL",
    description:
      "Get up to 5% higher valuation for your used phone. Free doorstep pickup in 24 hours, zero hidden deductions, and direct instant UPI payout before handover.",
    url: "https://www.cashall.in/sell-old-mobile-phone",
    siteName: "CashALL Recommerce",
    images: [
      {
        url: "/photos/CashALL_logo.png",
        width: 1200,
        height: 630,
        alt: "Sell Old Mobile Phone Online - CashALL",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Sell Old Mobile Phone Online for Instant Cash | CashALL",
    description:
      "Instant price calculator, free doorstep pickup & same-day cash payout for old smartphones.",
    images: ["/photos/CashALL_logo.png"],
  },
};

export default function SellOldMobilePhoneLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            "name": "Sell Old Mobile Phone for Instant Cash",
            "description": "Sell your old mobile phone online on CashALL for the highest valuation, free doorstep pickup and instant cash payout.",
            "url": "https://www.cashall.in/sell-old-mobile-phone",
            "breadcrumb": {
              "@type": "BreadcrumbList",
              "itemListElement": [
                {
                  "@type": "ListItem",
                  "position": 1,
                  "name": "Home",
                  "item": "https://www.cashall.in"
                },
                {
                  "@type": "ListItem",
                  "position": 2,
                  "name": "Sell Old Mobile Phone",
                  "item": "https://www.cashall.in/sell-old-mobile-phone"
                }
              ]
            },
            "mainEntity": {
              "@type": "Service",
              "name": "Old Mobile Phone Buyback & Doorstep Cash Service",
              "provider": {
                "@type": "Organization",
                "name": "CashALL",
                "url": "https://www.cashall.in"
              },
              "areaServed": ["Kolkata", "Howrah", "Patna", "Gorakhpur", "Ranchi", "India"],
              "offers": {
                "@type": "AggregateOffer",
                "priceCurrency": "INR",
                "lowPrice": "500",
                "highPrice": "125000",
                "offerCount": "1500"
              }
            }
          })
        }}
      />
      {children}
    </>
  );
}
