import type { Metadata } from "next";
import "./globals.css";
import { AIChatAssistant } from "@/components/common/AIChatAssistant";
import { CookieConsentBanner } from "@/components/common/CookieConsentBanner";
import Script from "next/script";
import { Suspense } from "react";
import { MetaPageViewTracker } from "@/components/analytics/MetaPageViewTracker";

export const revalidate = 86400; // Cache pages on Edge CDN for 24 hours (Freezes Fast Origin Transfer)

export const metadata: Metadata = {
  metadataBase: new URL("https://www.cashall.in"),

  title: {
    default: "CashALL | Sell Old Phone Online, Used Laptop & Tablet for Instant Cash",
    template: "%s | CashALL",
  },

  description:
    "Sell your old phone online, used laptop & tablet at CashALL for highest market cash value. Free doorstep evaluation, instant UPI payout before handover, certified data wipe & official Bill of Sale.",

  keywords: [
    "CashALL",
    "CashALL India",
    "cashall.in",
    "phone sell online",
    "old phone sell online",
    "sell phone online",
    "sell old phone online",
    "sell my phone",
    "sell my old phone",
    "old mobile sell",
    "sell old mobile phone",
    "sell old mobile",
    "sell old phone best price",
    "sell old iphone",
    "iphone 17",
    "iphone 17 pro",
    "iphone 17 pro max",
    "i phone 17 pro",
    "iphone 17 price",
    "i phone 16",
    "i phone 15",
    "apple trade in alternative",
    "sell laptop online",
    "samsung s26 ultra",
    "samsung s25",
    "samsung s24",
    "phone selling app",
    "buy old phone",
    "old phone buy",
    "sell used phone",
    "sell your old phone online",
    "old phone sell online best price",
    "best website to sell old phone",
    "where can i sell my old phone",
    "where to sell my old phone",
    "where to sell old phone",
    "where i can sell my old phone",
    "cash for phone",
    "best app to sell old phone",
    "how to sell old phone",
    "how to sell my old phone",
    "best way to sell old phone",
    "exchange old phone",
    "second hand mobile",
    "selling old phone",
    "online buyback platform",
    "best device trade in value",
    "where can I sell my old phone",
    "best place to sell old phone",
    "best website to sell old phone",
    "best app to sell old phone",
    "phone selling website",
    "old phone buyer near me",
    "used phone buyer near me",
    "sell phone near me",
    "sell mobile near me",
    "sell old phone near me",
    "get cash for old phone",
    "instant cash for phone",
    "instant cash for old phone",
    "same day cash for phone",
    "same day payment phone",
    "highest price for old phone",
    "best price for used phone",
    "how much is my phone worth",
    "how much can I sell my phone for",
    "phone resale calculator",
    "phone valuation",
    "used phone valuation",
    "phone depreciation",
    "why phone value drops",
    "sell damaged phone",
    "sell broken phone",
    "sell cracked phone",
    "sell dead phone",
    "sell water damaged phone",
    "sell phone that doesn't turn on",
    "sell completely dead phone",
    "sell phone with broken screen",
    "sell phone with cracked display",
    "sell phone with battery problem",
    "sell phone with green line display",
    "sell phone with motherboard problem",
    "sell phone without charger",
    "sell phone without box",
    "sell phone without bill",
    "sell phone without invoice",
    "sell phone in any condition",
    "sell old iphone",
    "sell used iphone",
    "sell iphone for cash",
    "iphone resale value",
    "iphone buyback",
    "how much is my iphone worth",
    "sell broken iphone",
    "sell cracked iphone",
    "sell iphone 13",
    "sell iphone 14",
    "sell iphone 15",
    "sell iphone 16",
    "sell old samsung phone",
    "sell used samsung phone",
    "samsung resale value",
    "sell broken samsung",
    "sell samsung s23",
    "sell samsung s24",
    "sell samsung fold",
    "sell samsung flip",
    "sell old oneplus",
    "oneplus resale value",
    "sell old redmi",
    "sell old xiaomi",
    "sell old realme",
    "sell old vivo",
    "sell old oppo",
    "sell old pixel",
    "sell old motorola",
    "sell old nothing phone",
    "sell old laptop",
    "sell used laptop",
    "sell laptop for cash",
    "sell laptop online",
    "sell laptop near me",
    "laptop buyback",
    "laptop resale value",
    "how much is my laptop worth",
    "sell broken laptop",
    "sell damaged laptop",
    "sell dead laptop",
    "sell laptop that won't turn on",
    "sell laptop with broken screen",
    "sell laptop without charger",
    "sell old Dell laptop",
    "sell old HP laptop",
    "sell old Lenovo laptop",
    "sell old Asus laptop",
    "sell old Acer laptop",
    "sell old MacBook",
    "sell used MacBook",
    "MacBook resale value",
    "sell MacBook for cash",
    "sell broken MacBook",
    "sell old MacBook Air",
    "sell old MacBook Pro",
    "sell old tablet",
    "sell used tablet",
    "sell tablet for cash",
    "sell old iPad",
    "sell used iPad",
    "iPad resale value",
    "sell broken iPad",
    "sell old Samsung tablet",
    "phone upgrade",
    "what to do with old phone",
    "trade in vs sell phone",
    "sell vs exchange phone",
    "phone exchange",
    "mobile exchange",
    "what to do before selling phone",
    "phone selling checklist",
    "how to erase phone before selling",
    "how to wipe phone before selling",
    "factory reset before selling phone",
    "phone data privacy",
    "is factory reset enough",
    "remove google account before selling phone",
    "remove apple id before selling iphone",
    "how to wipe laptop before selling",
    "phone selling scam",
    "safe way to sell old phone",
    "how to avoid phone selling scams",
    "classified phone scam",
    "fake payment screenshot phone",
    "UPI scam phone selling",
    "IMEI check before selling",
    "electronic waste India",
    "phone e waste",
    "phone recycling India",
    "sell old phone Kolkata",
    "sell used phone Kolkata",
    "sell phone for cash Kolkata",
    "phone buyer Kolkata",
    "sell old laptop Kolkata",
    "sell old tablet Kolkata",
    "sell old phone Howrah",
    "sell old phone Liluah",
    "sell old phone Barrackpore",
    "sell old phone Hooghly",
    "sell old phone Salt Lake",
    "sell old phone New Town",
    "sell old phone Patna",
    "sell old phone Gorakhpur",
    "sell old phone Ballia",
    "sell old phone Ranchi",
    "sell used mobile Ranchi",
    "second hand mobile shop Ranchi",
    "doorstep phone pickup Ranchi",
    "sell phone Ranchi",
    "phone buyer Ranchi",
    "sell old phone near me",
    "phone buyer near me",
    "laptop buyer near me",
    "mobile shop near me",
    "mobile phone shop near me",
    "second hand mobile shop near me",
    "second hand phone shop near me",
    "second hand phone store near me",
    "second hand mobile",
    "2nd hand mobile phones",
    "used second hand mobile",
    "2 hand mobile phone",
    "2nd hand mobile",
    "secondhand phones",
    "refurbished mobiles",
    "refurbished phones",
    "second hand iphone",
    "second hand phone iphone",
    "sold old phone",
    "old sell phone",
    "sell old handset",
    "sale a phone",
    "quick mobile",
    "quick mobile in",
    "mobile price",
    "mobile resale value calculator",
    "used phone price calculator",
    "second hand mobile price check",
    "phone valuation tool online",
    "mobile phone price",
    "sell old phone online",
    "used phone buyback",
    "instant cash for electronics",
    "best mobile selling platform",
    "sell old phone same day pickup",
    "sell old phone before Diwali",
    "sell old phone before Durga Puja",
    "ps5 rent",
    "rent ps5",
    "ps5 rental Kolkata",
    "sell ps5",
    "recommerce India",
    "CashALL",
    "CashALL India"
  ],

  authors: [
    {
      name: "CashALL",
    },
  ],

  creator: "CashALL",
  publisher: "CashALL",

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },

  alternates: {
    canonical: "https://www.cashall.in",
    types: {
      "application/rss+xml": "https://www.cashall.in/feed.xml",
    },
  },

  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://www.cashall.in/",
    siteName: "CashALL",
    title: "CashALL | Sell Old Phone, Used Laptop & Tablet for Instant Cash",
    description:
      "Sell your old mobile phones, used laptops and tablets online at CashALL for fair market value with convenient doorstep pickup, instant bank transfer, and certified data wiping.",
    images: [
      {
        url: "/photos/CashALL_logo.png",
        width: 1200,
        height: 630,
        alt: "CashALL - Sell Old Devices for Instant Cash",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "CashALL | Sell Old Phone, Used Laptop & Tablet for Instant Cash",
    description:
      "Sell your old mobile phones, used laptops and tablets online at CashALL. Best price, doorstep evaluation, and instant UPI payout.",
    images: ["/photos/CashALL_logo.png"],
  },

  icons: {
    icon: [
      { url: "/photos/CashALL_favicon.png", sizes: "1024x1024", type: "image/png" },
      { url: "/favicon.png", sizes: "1024x1024", type: "image/png" },
    ],
    shortcut: "/photos/CashALL_favicon.png",
    apple: "/photos/CashALL_favicon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="alternate" type="text/plain" href="/llms.txt" title="LLM Knowledge Base" />
        <link rel="alternate" type="text/plain" href="/llms-full.txt" title="Full LLM Knowledge Reference" />
        <link rel="author" href="/humans.txt" />
        <link rel="help" href="/llms.txt" />
        <link rel="search" type="application/opensearchdescription+xml" href="/opensearch.xml" title="CashALL Search" />
        {/* Google tag (gtag.js) */}
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-ERW4207TJ8" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());

              gtag('config', 'G-ERW4207TJ8');
            `,
          }}
        />
      </head>
      <body className="bg-brand-bg text-brand-black min-h-screen font-sans antialiased">

        <Script
          id="meta-pixel"
          strategy="afterInteractive"
        >
          {`
      !function(f,b,e,v,n,t,s)
      {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
      n.callMethod.apply(n,arguments):n.queue.push(arguments)};
      if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
      n.queue=[];t=b.createElement(e);t.async=!0;
      t.src=v;s=b.getElementsByTagName(e)[0];
      s.parentNode.insertBefore(t,s)}(window, document,'script',
      'https://connect.facebook.net/en_US/fbevents.js');

      fbq('init', '1249229847363732');
      fbq('track', 'PageView');
    `}
        </Script>
        <noscript>
          <img
            height="1"
            width="1"
            style={{ display: "none" }}
            src="https://www.facebook.com/tr?id=1249229847363732&ev=PageView&noscript=1"
            alt=""
          />
        </noscript>
        <Suspense fallback={null}>
          <MetaPageViewTracker />
        </Suspense>
        {children}
        <AIChatAssistant />
        <CookieConsentBanner />
      </body>
    </html>
  );
}
