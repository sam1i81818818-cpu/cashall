import { NextResponse } from "next/server";

const INDEXNOW_KEY = "4a58b54f67c24483a903e1b0d778d912";
const HOST = "www.cashall.in";
const KEY_LOCATION = `https://${HOST}/${INDEXNOW_KEY}.txt`;

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const urls: string[] = Array.isArray(body?.urls) && body.urls.length > 0
      ? body.urls
      : [
          `https://${HOST}/`,
          `https://${HOST}/sell-old-mobile-phone`,
          `https://${HOST}/sell-old-laptop`,
          `https://${HOST}/sell-old-tablet`,
          `https://${HOST}/blog`,
          `https://${HOST}/sitemap.xml`,
        ];

    const payload = {
      host: HOST,
      key: INDEXNOW_KEY,
      keyLocation: KEY_LOCATION,
      urlList: urls,
    };

    // Submit to IndexNow API (shared across Bing, Yandex, Seznam, Naver)
    const response = await fetch("https://api.indexnow.org/indexnow", {
      method: "POST",
      headers: {
        "Content-Type": "application/json; charset=utf-8",
      },
      body: JSON.stringify(payload),
    });

    return NextResponse.json({
      success: response.ok,
      status: response.status,
      submittedUrls: urls.length,
      message: response.ok ? "IndexNow submission accepted" : "IndexNow responded with status",
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({
    status: "active",
    indexNowKey: INDEXNOW_KEY,
    keyLocation: KEY_LOCATION,
    supportedEngines: ["Microsoft Bing", "Yandex", "Seznam.cz", "Naver"],
  });
}
