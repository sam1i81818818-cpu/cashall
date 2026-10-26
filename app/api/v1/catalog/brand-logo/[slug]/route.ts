import { NextRequest, NextResponse } from "next/server";

export const runtime = "edge";

const BRAND_LOGO_URLS: Record<string, string> = {
  "apple": "https://s3ng.cashify.in/cashify/brand/img/xhdpi/2e7cdc22-5a5f.jpg?w=200",
  "xiaomi": "https://s3ng.cashify.in/cashify/brand/img/xhdpi/cb96df6e-080f.jpg?w=200",
  "mi": "https://s3ng.cashify.in/cashify/brand/img/xhdpi/cb96df6e-080f.jpg?w=200",
  "samsung": "https://s3ng.cashify.in/cashify/brand/img/xhdpi/406a512d-e8dd.jpg?w=200",
  "vivo": "https://s3ng.cashify.in/cashify/brand/img/xhdpi/20922c34-8afc.jpg?w=200",
  "oneplus": "https://s3ng.cashify.in/cashify/brand/img/xhdpi/dfb6c340-010f.jpg?w=200",
  "oppo": "https://s3ng.cashify.in/cashify/brand/img/xhdpi/ac5c9a7b-76b5.jpg?w=200",
  "realme": "https://s3ng.cashify.in/cashify/brand/img/xhdpi/0124cc45-3a6c.jpg?w=200",
  "motorola": "https://s3ng.cashify.in/cashify/brand/img/xhdpi/1dcd7fda-0141.jpg?w=200",
  "lenovo": "https://s3ng.cashify.in/cashify/brand/img/xhdpi/4834825a-7f10.jpg?w=200",
  "nokia": "https://s3ng.cashify.in/cashify/brand/img/xhdpi/fef4e5ae-6507.jpg?w=200",
  "honor": "https://s3ng.cashify.in/cashify/brand/img/xhdpi/cfeaabff-69bf.jpg?w=200",
  "asus": "https://s3ng.cashify.in/cashify/brand/img/xhdpi/bf25222a-a2a7.jpg?w=200",
  "google": "https://s3ng.cashify.in/cashify/brand/img/xhdpi/dacc50a2-77a9.jpg?w=200",
  "poco": "https://s3ng.cashify.in/cashify/brand/img/xhdpi/3e072dc2-6d7b.jpg?w=200",
  "lg": "https://s3ng.cashify.in/cashify/brand/img/xhdpi/bdbdc48e-dd24.jpg?w=200",
  "infinix": "https://s3ng.cashify.in/cashify/brand/img/xhdpi/738cb1f1-7ddf.jpg?w=200",
  "tecno": "https://s3ng.cashify.in/cashify/brand/img/xhdpi/55424ad4-0400.jpg?w=200",
  "iqoo": "https://s3ng.cashify.in/cashify/brand/img/xhdpi/e1b13cbc-ef06.jpg?w=200",
  "nothing": "https://s3ng.cashify.in/cashify/brand/img/xhdpi/06bc74db-4d38.jpg?w=200",
  "dell": "https://s3ng.cashify.in/cashify/brand/img/xhdpi/d3b4fdda-2d57.jpg?w=200",
  "hp": "https://s3ng.cashify.in/cashify/brand/img/xhdpi/f78db5fb-857c.jpg?w=200",
  "hp/compaq": "https://s3ng.cashify.in/cashify/brand/img/xhdpi/f78db5fb-857c.jpg?w=200",
  "hp-compaq": "https://s3ng.cashify.in/cashify/brand/img/xhdpi/f78db5fb-857c.jpg?w=200",
  "acer": "https://s3ng.cashify.in/cashify/brand/img/xhdpi/2c350ab6-da4f.jpg?w=200",
  "microsoft": "https://s3ng.cashify.in/cashify/brand/img/xhdpi/b00e17d8-fdd0.jpg?w=200",
  "msi": "https://s3ng.cashify.in/cashify/brand/img/xhdpi/3e0e18bd-7fa2.jpg?w=200",
  "avita": "https://s3ng.cashify.in/cashify/brand/img/xhdpi/8ae5b678-550c.jpg?w=200",
  "huawei": "https://s3ng.cashify.in/cashify/brand/img/xhdpi/056706c5-adeb.jpg?w=200",
  "other-laptop": "https://s3ng.cashify.in/cashify/brand/img/xhdpi/da0de74d-0f4d.jpg?w=200"
};

export async function GET(
  req: NextRequest,
  { params }: { params: { slug: string } }
) {
  const slug = params?.slug?.toLowerCase() || "";
  const targetUrl = BRAND_LOGO_URLS[slug] || "https://s3ng.cashify.in/cashify/brand/img/xhdpi/2e7cdc22-5a5f.jpg?w=200";

  return NextResponse.redirect(targetUrl, {
    status: 301,
    headers: {
      "Cache-Control": "public, max-age=31536000, s-maxage=31536000, immutable",
      "CDN-Cache-Control": "public, max-age=31536000, s-maxage=31536000, immutable",
      "Cloudflare-CDN-Cache-Control": "public, max-age=31536000, s-maxage=31536000, immutable",
    },
  });
}

