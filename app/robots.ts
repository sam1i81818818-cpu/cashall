import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const disallowedPaths = [
    "/admin/",
    "/partner/",
    "/agent/",
    "/support/",
    "/api/",
    "/checkout/",
    "/track/",
    "/order/",
    "/orders/",
    "/quote/",
    "/quote",
    "/account/",
    "/account",
    "/my-account/",
    "/my-account",
    "/profile/",
    "/profile",
    "/auth/",
    "/receipt/",
    "/sale-receipt/",
    "/dashboard/",
    "/privacy-request/",
    "/privacy-request",
    "/download/",
    "/download",
    "/photos/",
    "/*.apk$",
    "/*.csv$",
    "/*.json$",
    "/*.txt$",
    "/*.pdf$",
  ];

  const allowedPaths = [
    "/",
    "/sell",
    "/sell-used-phone",
    "/sell-old-phone",
    "/sell-old-mobile-phone",
    "/sell-old-mobile-phone/",
    "/sell-old-laptop",
    "/sell-old-laptop/",
    "/sell-old-tablet",
    "/sell-old-tablet/",
    "/sell/mobile/",
    "/sell/laptop/",
    "/sell/tablet/",
    "/rent/",
    "/blog/",
    "/news/",
    "/articles/",
    "/compare/",
    "/about",
    "/about-us",
    "/contact",
    "/faq",
    "/reviews",
    "/sitemap.xml",
  ];

  // AI & Answer Engine Bots (AEO & GEO Optimization)
  // Explicitly welcomed to index CashALL recommerce valuations, blogs, and FAQs for citation in LLM answers
  const aiSearchBots = [
    "GPTBot",
    "OAI-SearchBot",
    "PerplexityBot",
    "ClaudeBot",
    "Google-Extended",
    "Applebot-Extended",
    "Bingbot",
  ];

  // Aggressive commercial scraper bots that burden bandwidth without attribution
  const blockedScrapers = [
    "Bytespider",
    "CCBot",
    "PetalBot",
    "SemrushBot",
    "AhrefsBot",
    "DotBot",
    "MJ12bot",
    "Diffbot",
    "Timpibot",
    "Webzio-Extended",
    "BLEXBot",
    "DataForSeoBot",
  ];

  return {
    rules: [
      // General web crawlers (Googlebot, Bing, etc.)
      {
        userAgent: "*",
        allow: allowedPaths,
        disallow: disallowedPaths,
      },
      // AI Search Bots (Perplexity, ChatGPT, Claude, Gemini, Apple Intelligence)
      // Maximum allowance for AEO / GEO citation indexing
      ...aiSearchBots.map((bot) => ({
        userAgent: bot,
        allow: allowedPaths,
        disallow: disallowedPaths,
      })),
      // Block unapproved scrapers
      ...blockedScrapers.map((bot) => ({
        userAgent: bot,
        disallow: "/",
      })),
    ],
    sitemap: "https://www.cashall.in/sitemap.xml",
    host: "https://www.cashall.in",
  };
}
