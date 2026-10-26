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
    "/account/",
    "/my-account/",
    "/profile/",
    "/privacy-request/",
    "/*.apk$",
  ];

  const searchAndAiBots = [
    "*",
    "Googlebot",
    "Googlebot-Mobile",
    "Googlebot-Image",
    "Bingbot",
    "Applebot",
    "DuckDuckBot",
    "YandexBot",
    "Slurp",
    "GPTBot",
    "OAI-SearchBot",
    "PerplexityBot",
    "ClaudeBot",
    "Google-Extended",
    "Applebot-Extended",
  ];

  return {
    rules: searchAndAiBots.map((bot) => ({
      userAgent: bot,
      allow: "/",
      disallow: disallowedPaths,
    })),
    sitemap: "https://www.cashall.in/sitemap.xml",
    host: "https://www.cashall.in",
  };
}
