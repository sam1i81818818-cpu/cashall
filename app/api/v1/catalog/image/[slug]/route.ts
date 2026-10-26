import { NextRequest, NextResponse } from "next/server";
import { PRODUCT_IMAGE_MAP } from "@/lib/data/product-images-map";

export const revalidate = 31536000; // Cache on Edge for 1 year
export const runtime = "edge";

const DEFAULT_CDN_IMAGES: Record<string, string> = {
  "default-phone": "https://s3ng.cashify.in/cashify/product/img/xhdpi/dab0d987-4d22.jpg?w=800",
  "default-laptop": "https://s3ng.cashify.in/cashify/product/img/xhdpi/cb8d3fcc-76f8.jpg?w=800",
  "default-tablet": "https://s3ng.cashify.in/cashify/product/img/xhdpi/57301cf3a2212.jpg?w=800",
};

export async function GET(
  req: NextRequest,
  { params }: { params: { slug: string } }
) {
  const rawSlug = params?.slug || "";
  const slug = rawSlug.toLowerCase().trim();
  let targetUrl = PRODUCT_IMAGE_MAP[slug];

  if (!targetUrl) {
    if (
      slug.includes("macbook") ||
      slug.includes("laptop") ||
      slug.includes("xps") ||
      slug.includes("thinkpad") ||
      slug.includes("aspire") ||
      slug.includes("dell") ||
      slug.includes("hp")
    ) {
      targetUrl = DEFAULT_CDN_IMAGES["default-laptop"];
    } else if (slug.includes("pad") || slug.includes("tab")) {
      targetUrl = DEFAULT_CDN_IMAGES["default-tablet"];
    } else {
      targetUrl = DEFAULT_CDN_IMAGES["default-phone"];
    }
  }

  return NextResponse.redirect(targetUrl, {
    status: 301,
    headers: {
      "Cache-Control": "public, max-age=31536000, s-maxage=31536000, immutable",
    },
  });
}
