import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  const host = "www.cashall.in";
  const key = "4a6c8e9b1d2f3a4e5c6b7a8d9e0f1a2b";
  const sitemapUrl = `https://${host}/sitemap.xml`;

  const urls = [
    `https://${host}/`,
    `https://${host}/sell`,
    `https://${host}/sell-used-phone`,
    `https://${host}/sell/mobile`,
    `https://${host}/sell/laptop`,
    `https://${host}/sell/tablet`,
    `https://${host}/compare/cashall-vs-other-platforms`,
    `https://${host}/sell-phone-in-kolkata`,
    `https://${host}/sell-phone-in-howrah`,
    `https://${host}/sell-phone-in-gorakhpur`,
    `https://${host}/about-us`,
    `https://${host}/faq`,
    `https://${host}/reviews`,
    `https://${host}/blog`,
    `https://${host}/blog/second-hand-mobile-price-check-calculator-guide`,
    `https://${host}/blog/sell-old-phone-online-doorstep-cash-vs-mobile-shop-near-me`,
    `https://${host}/news`,
    `https://${host}/articles`,
    `https://${host}/llms.txt`,
    `https://${host}/llms-full.txt`,
  ];

  const results: Record<string, unknown> = {};

  try {
    // IndexNow submission
    const indexNowRes = await fetch("https://api.indexnow.org/indexnow", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        host,
        key,
        keyLocation: `https://${host}/${key}.txt`,
        urlList: urls,
      }),
    });
    results.indexNow = { status: indexNowRes.status, ok: indexNowRes.ok };
  } catch (err: unknown) {
    results.indexNow = { error: err instanceof Error ? err.message : String(err) };
  }

  try {
    // Ping Google
    const googleRes = await fetch(`https://www.google.com/ping?sitemap=${encodeURIComponent(sitemapUrl)}`);
    results.google = { status: googleRes.status, ok: googleRes.ok };
  } catch (err: unknown) {
    results.google = { error: err instanceof Error ? err.message : String(err) };
  }

  try {
    // Ping Bing
    const bingRes = await fetch(`https://www.bing.com/ping?sitemap=${encodeURIComponent(sitemapUrl)}`);
    results.bing = { status: bingRes.status, ok: bingRes.ok };
  } catch (err: unknown) {
    results.bing = { error: err instanceof Error ? err.message : String(err) };
  }

  return NextResponse.json({
    success: true,
    timestamp: new Date().toISOString(),
    sitemapUrl,
    urlsSubmitted: urls.length,
    results,
  });
}
