import { NextRequest, NextResponse } from "next/server";
import { apiWrapper } from "@/lib/utils/api-wrapper";
import { prisma } from "@/lib/db";

// In-memory cache to prevent Supabase database egress on repeated hits
interface CacheEntry {
  data: any;
  expiry: number;
}
const catalogMemoryCache = new Map<string, CacheEntry>();
const CACHE_TTL_MS = 60 * 60 * 1000; // 1 hour memory TTL

const CACHE_HEADERS = {
  "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
  "CDN-Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
  "Cloudflare-CDN-Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
};

export const dynamic = "force-dynamic";

export const GET = apiWrapper(async (req: NextRequest) => {
  const { searchParams } = new URL(req.url);
  const brandSlug = searchParams.get("brand");
  const category = searchParams.get("category")?.toUpperCase();
  const cacheKey = `${brandSlug || "all"}_${category || "all"}`;

  const cached = catalogMemoryCache.get(cacheKey);
  if (cached && cached.expiry > Date.now()) {
    return NextResponse.json(
      { success: true, data: cached.data },
      { headers: CACHE_HEADERS }
    );
  }

  if (brandSlug) {
    const brand = await prisma.brand.findFirst({
      where: { slug: brandSlug, active: true, deletedAt: null },
      include: {
        models: {
          where: {
            active: true,
            deletedAt: null,
            ...(category ? { category } : {}),
          },
          orderBy: { releaseYear: "desc" },
          include: {
            variants: {
              where: { active: true, deletedAt: null },
            },
          },
        },
      },
    });

    catalogMemoryCache.set(cacheKey, {
      data: brand,
      expiry: Date.now() + CACHE_TTL_MS,
    });

    return NextResponse.json(
      { success: true, data: brand },
      { headers: CACHE_HEADERS }
    );
  }

  const brands = await prisma.brand.findMany({
    where: {
      active: true,
      deletedAt: null,
      ...(category
        ? {
            OR: [
              { category },
              { category: "ALL" },
              { category: "BOTH" },
              { category: "MOBILE_TABLET" },
              { category: "LAPTOP_TABLET" },
            ],
          }
        : {}),
    },
    orderBy: { sortOrder: "asc" },
  });

  const popularModels = await prisma.deviceModel.findMany({
    where: {
      active: true,
      popular: true,
      deletedAt: null,
      ...(category ? { category } : {}),
    },
    include: { brand: true },
  });

  const responseData = {
    brands,
    popularModels,
  };

  catalogMemoryCache.set(cacheKey, {
    data: responseData,
    expiry: Date.now() + CACHE_TTL_MS,
  });

  return NextResponse.json(
    {
      success: true,
      data: responseData,
    },
    { headers: CACHE_HEADERS }
  );
});

