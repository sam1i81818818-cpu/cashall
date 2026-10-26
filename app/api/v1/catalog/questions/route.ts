import { NextRequest, NextResponse } from "next/server";
import { apiWrapper } from "@/lib/utils/api-wrapper";
import { prisma } from "@/lib/db";

export const revalidate = 86400; // Edge cached for 24 hours

let cachedQuestions: any = null;
let cachedQuestionsExpiry = 0;
const CACHE_TTL_MS = 24 * 60 * 60 * 1000; // 24 hours

const CACHE_HEADERS = {
  "Cache-Control": "public, s-maxage=86400, stale-while-revalidate=604800",
  "CDN-Cache-Control": "public, s-maxage=86400, stale-while-revalidate=604800",
  "Cloudflare-CDN-Cache-Control": "public, s-maxage=86400, stale-while-revalidate=604800",
};

export const GET = apiWrapper(async (req: NextRequest) => {
  if (cachedQuestions && cachedQuestionsExpiry > Date.now()) {
    return NextResponse.json(
      {
        success: true,
        data: cachedQuestions,
      },
      { headers: CACHE_HEADERS }
    );
  }

  const questions = await prisma.conditionQuestion.findMany({
    where: { active: true, deletedAt: null },
    include: {
      options: {
        orderBy: { sortOrder: "asc" },
      },
    },
    orderBy: { sortOrder: "asc" },
  });

  cachedQuestions = questions;
  cachedQuestionsExpiry = Date.now() + CACHE_TTL_MS;

  return NextResponse.json(
    {
      success: true,
      data: questions,
    },
    { headers: CACHE_HEADERS }
  );
});

