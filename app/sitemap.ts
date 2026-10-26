import type { MetadataRoute } from "next";
import { INITIAL_MODELS, INITIAL_BRANDS } from "@/lib/store";
import { BLOG_POSTS } from "@/lib/data/blogData";
import { ARTICLES_DATA } from "@/lib/data/articlesData";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://www.cashall.in";
  const now = new Date();

  // Core Static & Landing Pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: now,
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/sell`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.95,
    },
    {
      url: `${baseUrl}/sell-used-phone`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.95,
    },
    {
      url: `${baseUrl}/sell-old-phone`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.95,
    },
    // Mobile Phone Hubs (Canonical)
    {
      url: `${baseUrl}/sell-old-mobile-phone`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/sell-old-mobile-phone/brands`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.95,
    },
    // Laptop Hubs (Canonical)
    {
      url: `${baseUrl}/sell-old-laptop`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/sell-old-laptop/brands`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.95,
    },
    // Tablet Hubs (Canonical)
    {
      url: `${baseUrl}/sell-old-tablet`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/sell-old-tablet/brands`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.95,
    },
    // Gaming Rental
    {
      url: `${baseUrl}/rent/ps5`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.9,
    },
    // Corporate & Help
    {
      url: `${baseUrl}/about`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/about-us`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/faq`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.85,
    },
    {
      url: `${baseUrl}/reviews`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.9,
    },
    // Content Hubs
    {
      url: `${baseUrl}/blog`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/news`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/articles`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    // City Landing Pages (High Recommerce Velocity)
    {
      url: `${baseUrl}/sell-phone-in-kolkata`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.95,
    },
    {
      url: `${baseUrl}/sell-phone-in-howrah`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.95,
    },
    {
      url: `${baseUrl}/sell-phone-in-gorakhpur`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.95,
    },
    // Competitive & Topic Pages
    {
      url: `${baseUrl}/compare/cashall-vs-other-platforms`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/512gb-phones-the-sweet-spot-for-resale-value`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.85,
    },
    {
      url: `${baseUrl}/why-iphones-hold-more-resale-value-than-android-in-india`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.85,
    },
    {
      url: `${baseUrl}/verify-your-phones-clean-status-before-selling-avoid-surprises`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.85,
    },
    {
      url: `${baseUrl}/steps-to-ensure-your-digital-sim-doesnt-go-with-sold-phones`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.85,
    },
    {
      url: `${baseUrl}/does-phones-with-dedicated-neural-engines-could-make-you-more-money`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.85,
    },
    // Legal & Consumer Safeguards
    {
      url: `${baseUrl}/privacy`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${baseUrl}/cookie-policy`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${baseUrl}/pickup-policy`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${baseUrl}/doorstep-pickup-policy`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${baseUrl}/cancellation-policy`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.5,
    },
  ];

  // Mobile Brand Pages
  const mobileBrands = [
    "apple",
    "samsung",
    "oneplus",
    "xiaomi",
    "vivo",
    "oppo",
    "realme",
    "poco",
    "motorola",
    "google",
    "iqoo",
    "nothing",
  ];

  const mobileBrandPages: MetadataRoute.Sitemap = mobileBrands.map((brand) => ({
    url: `${baseUrl}/sell-old-mobile-phone/${brand}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.9,
  }));

  // Laptop Brand Pages (Canonical)
  const laptopBrands = [
    "apple",
    "dell",
    "hp",
    "lenovo",
    "asus",
    "acer",
    "samsung",
    "msi",
    "microsoft",
    "xiaomi",
  ];

  const laptopBrandPages: MetadataRoute.Sitemap = laptopBrands.map((brand) => ({
    url: `${baseUrl}/sell-old-laptop/${brand}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.9,
  }));

  // Tablet Brand Pages (Canonical)
  const tabletBrands = [
    "apple",
    "samsung",
    "lenovo",
    "xiaomi",
    "oneplus",
    "realme",
    "honor",
  ];

  const tabletBrandPages: MetadataRoute.Sitemap = tabletBrands.map((brand) => ({
    url: `${baseUrl}/sell-old-tablet/${brand}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.85,
  }));

  // Brand ID to slug lookup map
  const brandSlugMap = new Map<string, string>();
  for (const b of INITIAL_BRANDS) {
    brandSlugMap.set(b.id, b.slug.toLowerCase());
  }

  // Model Pages (Using Canonical Recommerce URLs)
  const popularModels = INITIAL_MODELS.filter((m) => m.active && m.slug);
  const modelPages: MetadataRoute.Sitemap = popularModels.slice(0, 1000).map((m) => {
    const brandSlug = m.brandSlug?.toLowerCase() || brandSlugMap.get(m.brandId) || "apple";
    const category = (m.category || "MOBILE").toUpperCase();
    const basePath =
      category === "LAPTOP" || m.id.startsWith("m-laptop-")
        ? "sell-old-laptop"
        : category === "TABLET" || m.id.startsWith("m-tablet-") || m.slug.includes("ipad") || m.slug.includes("tab")
        ? "sell-old-tablet"
        : "sell-old-mobile-phone";
    
    return {
      url: `${baseUrl}/${basePath}/${brandSlug}/${m.slug.toLowerCase()}`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: m.popular ? 0.85 : 0.75,
    };
  });

  // Blog Article Pages (AEO & GEO Pillars - Updated October 2026)
  const blogPages: MetadataRoute.Sitemap = BLOG_POSTS.map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: new Date(post.updatedAt || post.publishedAt || now),
    changeFrequency: "weekly",
    priority: 0.9,
  }));

  // Technical Security & Valuation Articles (AEO/GEO)
  const articlePages: MetadataRoute.Sitemap = ARTICLES_DATA.map((article) => ({
    url: `${baseUrl}/articles/${article.slug}`,
    lastModified: new Date(article.updatedAt || article.publishedAt || now),
    changeFrequency: "weekly",
    priority: 0.85,
  }));

  return [
    ...staticPages,
    ...mobileBrandPages,
    ...laptopBrandPages,
    ...tabletBrandPages,
    ...blogPages,
    ...articlePages,
    ...modelPages,
  ];
}
