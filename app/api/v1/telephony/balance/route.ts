import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { verifySessionToken } from "@/lib/auth/session-token";
import { exotelService } from "@/lib/services/exotel.service";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  return fetchBalanceAndStats(req);
}

export async function POST(req: NextRequest) {
  return fetchBalanceAndStats(req);
}

async function fetchBalanceAndStats(req: NextRequest) {
  try {
    const authHeader = req.headers.get("authorization") || "";
    const cookieToken = req.cookies.get("session_token")?.value || "";
    const token = authHeader.replace(/^Bearer\s+/i, "") || cookieToken;

    const session = verifySessionToken(token);
    if (!session) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const { role } = session;
    if (!["ADMIN", "SUPER_ADMIN", "EMPLOYEE"].includes(role)) {
      return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 });
    }

    // 1. Fetch live Balance & Account Details from Exotel API
    let balanceData = { amount: 500, currency: "INR", isLowBalance: false, threshold: 50 };
    let accountData: any = { type: "Trial", status: "active", kycStatus: "notstarted" };
    let providerError: string | null = null;

    try {
      const [balanceRes, accountRes] = await Promise.all([
        exotelService.getCreditBalance(),
        exotelService.getAccountDetails(),
      ]);
      balanceData = balanceRes;
      accountData = accountRes;
    } catch (err: any) {
      console.warn("[Exotel Balance/Account Fetch Warning]:", err.message);
      providerError = err.message;
    }

    // 2. Compute Today's and This Month's usage analytics from local DB
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const [todayAgg, monthAgg, totalAgg, lastCall] = await Promise.all([
      prisma.telephonyCall.aggregate({
        where: { createdAt: { gte: startOfToday } },
        _count: { id: true },
        _sum: { durationSeconds: true, price: true },
      }),
      prisma.telephonyCall.aggregate({
        where: { createdAt: { gte: startOfMonth } },
        _count: { id: true },
        _sum: { durationSeconds: true, price: true },
      }),
      prisma.telephonyCall.aggregate({
        _count: { id: true },
        _sum: { durationSeconds: true, price: true },
      }),
      prisma.telephonyCall.findFirst({
        orderBy: { createdAt: "desc" },
        select: { createdAt: true, status: true, metadataJson: true },
      }),
    ]);

    const configStatus = exotelService.getConfigStatus();

    return NextResponse.json({
      success: true,
      balance: {
        amount: balanceData.amount,
        currency: balanceData.currency,
        isLowBalance: balanceData.isLowBalance,
        threshold: balanceData.threshold,
        lastRefreshedAt: new Date().toISOString(),
      },
      account: {
        sid: accountData.sid || configStatus.accountSid,
        friendlyName: accountData.friendlyName || "CashALL Telephony",
        type: accountData.type,
        status: accountData.status,
        kycStatus: accountData.kycStatus,
      },
      config: configStatus,
      usage: {
        today: {
          calls: todayAgg._count.id || 0,
          durationSeconds: todayAgg._sum.durationSeconds || 0,
          spendINR: todayAgg._sum.price || 0,
        },
        monthly: {
          calls: monthAgg._count.id || 0,
          durationSeconds: monthAgg._sum.durationSeconds || 0,
          spendINR: monthAgg._sum.price || 0,
        },
        lifetime: {
          calls: totalAgg._count.id || 0,
          durationSeconds: totalAgg._sum.durationSeconds || 0,
          spendINR: totalAgg._sum.price || 0,
        },
      },
      health: {
        status: providerError ? "DEGRADED" : "HEALTHY",
        providerError,
        lastCallAt: lastCall?.createdAt || null,
        isConfigured: configStatus.isConfigured,
      },
    });
  } catch (error: any) {
    console.error("[Telephony Balance Error]:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
