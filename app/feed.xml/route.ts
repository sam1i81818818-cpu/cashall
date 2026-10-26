import { NextResponse } from "next/server";
import { BLOG_POSTS } from "@/lib/data/blogData";
import { ARTICLES_DATA } from "@/lib/data/articlesData";

export const revalidate = 86400; // Cache feed for 24h

function escapeXml(unsafe: string): string {
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export async function GET() {
  const baseUrl = "https://www.cashall.in";

  const allItems: Array<{
    title: string;
    link: string;
    pubDate: string;
    description: string;
    category: string;
    author: string;
  }> = [];

  for (const post of BLOG_POSTS) {
    allItems.push({
      title: post.title,
      link: `${baseUrl}/blog/${post.slug}`,
      pubDate: new Date(post.updatedAt || post.publishedAt || "2026-10-15").toUTCString(),
      description: post.excerpt || post.subtitle || "",
      category: post.category || "Recommerce Insights",
      author: post.author?.name || "CashALL Editorial Team",
    });
  }

  for (const art of ARTICLES_DATA) {
    allItems.push({
      title: art.title,
      link: `${baseUrl}/articles/${art.slug}`,
      pubDate: new Date(art.updatedAt || art.publishedAt || "2026-10-10").toUTCString(),
      description: art.excerpt || art.subtitle || "",
      category: "Security & Trade-In Guides",
      author: art.author?.name || "CashALL Research Desk",
    });
  }

  const itemsXml = allItems
    .map(
      (item) => `
    <item>
      <title>${escapeXml(item.title)}</title>
      <link>${item.link}</link>
      <guid isPermaLink="true">${item.link}</guid>
      <pubDate>${item.pubDate}</pubDate>
      <category>${escapeXml(item.category)}</category>
      <dc:creator xmlns:dc="http://purl.org/dc/elements/1.1/">${escapeXml(item.author)}</dc:creator>
      <description>${escapeXml(item.description)}</description>
    </item>`
    )
    .join("");

  const rssXml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:dc="http://purl.org/dc/elements/1.1/">
  <channel>
    <title>CashALL Insights - Smartphone &amp; Electronics Buyback Valuation Feed</title>
    <link>${baseUrl}</link>
    <description>Latest smartphone market trends, second-hand resale value analysis, data security sanitization guides, and electronics buyback insights in India.</description>
    <language>en-in</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${baseUrl}/feed.xml" rel="self" type="application/rss+xml" />
    ${itemsXml}
  </channel>
</rss>`;

  return new NextResponse(rssXml.trim(), {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, s-maxage=86400, stale-while-revalidate=604800",
    },
  });
}
