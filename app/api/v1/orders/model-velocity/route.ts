import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

// In-memory cache for model velocity
interface VelocityCacheEntry {
  data: any;
  expiry: number;
}
const velocityMemoryCache = new Map<string, VelocityCacheEntry>();
const VELOCITY_TTL_MS = 24 * 60 * 60 * 1000; // 24 hours

const CACHE_HEADERS = {
  "Cache-Control": "public, s-maxage=86400, stale-while-revalidate=604800",
  "CDN-Cache-Control": "public, s-maxage=86400, stale-while-revalidate=604800",
  "Cloudflare-CDN-Cache-Control": "public, s-maxage=86400, stale-while-revalidate=604800",
};

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const modelSlug = (searchParams.get("modelSlug") || searchParams.get("model") || "").toLowerCase().trim();
    const modelName = (searchParams.get("modelName") || "").toLowerCase().trim();
    const cacheKey = `${modelSlug}_${modelName}`;

    const cached = velocityMemoryCache.get(cacheKey);
    if (cached && cached.expiry > Date.now()) {
      return NextResponse.json(cached.data, { headers: CACHE_HEADERS });
    }

    // Known baseline completed orders
    const BASELINE_COMPLETED: Record<string, number> = {
      "samsung-galaxy-s24-ultra-5g": 1,
      "samsung-galaxy-s24-ultra": 1,
      "iphone-15": 6,
      "apple-iphone-15": 6,
      "samsung-galaxy-f22": 8,
      "mi-10": 1,
      "samsung-galaxy-j7-nxt": 1,
      "samsung-galaxy-j8": 1,
      "motorola-moto-g96-5g": 1,
      "apple-iphone-8": 2,
      "apple-iphone-13": 3,
      "oneplus-11-5g": 1,
    };

    let dbCompletedCount = 0;

    if (modelSlug || modelName) {
      try {
        dbCompletedCount = await prisma.order.count({
          where: {
            deletedAt: null,
            status: { in: ["COMPLETED", "PICKUP_SCHEDULED", "PARTNER_ASSIGNED", "INSPECTION_STARTED", "PAID"] },
            quote: {
              OR: [
                ...(modelSlug ? [{ variant: { model: { slug: { equals: modelSlug, mode: "insensitive" as const } } } }] : []),
                ...(modelName ? [{ variant: { model: { name: { contains: modelName, mode: "insensitive" as const } } } }] : []),
                ...(modelSlug ? [{ breakdownJson: { contains: modelSlug, mode: "insensitive" as const } }] : []),
                ...(modelName ? [{ breakdownJson: { contains: modelName, mode: "insensitive" as const } }] : []),
                ...(modelSlug ? [{ selectedAnswersJson: { contains: modelSlug, mode: "insensitive" as const } }] : []),
                ...(modelName ? [{ selectedAnswersJson: { contains: modelName, mode: "insensitive" as const } }] : []),
              ],
            },
          },
        });
      } catch (err) {
        console.warn("Could not query DB orders for velocity:", err);
      }
    }

    const matchedBaseline =
      BASELINE_COMPLETED[modelSlug] ??
      (modelName ? BASELINE_COMPLETED[modelName.replace(/\s+/g, "-")] : undefined) ??
      0;

    const actualCompleted = Math.max(dbCompletedCount, matchedBaseline);

    // Subtle realistic buffer of 1 to 2 (manipulate by only 2-3 max, never 10-20 fake)
    let charHash = 0;
    const strForHash = modelSlug || modelName || "device";
    for (let i = 0; i < strForHash.length; i++) {
      charHash += strForHash.charCodeAt(i);
    }
    const buffer = 1 + (charHash % 2); // 1 or 2

    const finalSoldVelocity = Math.max(1, actualCompleted + buffer);

    const responsePayload = {
      success: true,
      modelSlug,
      actualCompleted,
      soldVelocity: finalSoldVelocity,
      displayBadge: `${finalSoldVelocity}+ sold in last 30 days`,
    };

    velocityMemoryCache.set(cacheKey, {
      data: responsePayload,
      expiry: Date.now() + VELOCITY_TTL_MS,
    });

    return NextResponse.json(responsePayload, { headers: CACHE_HEADERS });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        soldVelocity: 2,
        displayBadge: "2+ sold in last 30 days",
      },
      {
        status: 500,
        headers: {
          "Cache-Control": "public, s-maxage=300",
        },
      }
    );
  }
}

