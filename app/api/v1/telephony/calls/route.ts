import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { verifySessionToken } from "@/lib/auth/session-token";
import { exotelService } from "@/lib/services/exotel.service";
import { CallDirection, CallStatus } from "@prisma/client";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const authHeader = req.headers.get("authorization") || "";
    const cookieToken = req.cookies.get("session_token")?.value || "";
    const token = authHeader.replace(/^Bearer\s+/i, "") || cookieToken;

    const session = verifySessionToken(token);
    if (!session) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const { role, uid } = session;
    const allowedRoles = ["ADMIN", "SUPER_ADMIN", "EMPLOYEE", "AGENT"];
    if (!allowedRoles.includes(role)) {
      return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const page = Math.max(1, parseInt(searchParams.get("page") || "1"));
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get("limit") || "25")));
    const skip = (page - 1) * limit;

    const direction = searchParams.get("direction") as CallDirection | null;
    const status = searchParams.get("status") as CallStatus | null;
    const orderNumber = searchParams.get("orderNumber");
    const orderId = searchParams.get("orderId");
    const search = (searchParams.get("search") || "").trim();
    const dateFrom = searchParams.get("dateFrom");
    const dateTo = searchParams.get("dateTo");

    // Build Prisma query filter
    const where: any = {};

    // Role-based scoping: Agents only see their own calls
    if (role === "AGENT") {
      where.OR = [{ agentId: uid }, { initiatorUserId: uid }];
    }

    if (direction) {
      where.direction = direction;
    }

    if (status) {
      where.status = status;
    }

    if (orderNumber) {
      where.orderNumber = { contains: orderNumber, mode: "insensitive" };
    }

    if (orderId) {
      where.orderId = orderId;
    }

    if (dateFrom || dateTo) {
      where.createdAt = {};
      if (dateFrom) where.createdAt.gte = new Date(dateFrom);
      if (dateTo) where.createdAt.lte = new Date(dateTo);
    }

    if (search) {
      where.OR = [
        ...(where.OR || []),
        { customerName: { contains: search, mode: "insensitive" } },
        { agentName: { contains: search, mode: "insensitive" } },
        { orderNumber: { contains: search, mode: "insensitive" } },
        { fromNumber: { contains: search } },
        { toNumber: { contains: search } },
        { callSid: { contains: search } },
      ];
    }

    const [totalCount, calls] = await Promise.all([
      prisma.telephonyCall.count({ where }),
      prisma.telephonyCall.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
    ]);

    // Aggregate summary
    const summaryAgg = await prisma.telephonyCall.aggregate({
      where: role === "AGENT" ? { OR: [{ agentId: uid }, { initiatorUserId: uid }] } : {},
      _count: { id: true },
      _sum: { durationSeconds: true, price: true },
    });

    const isFullPhonePermitted = ["ADMIN", "SUPER_ADMIN"].includes(role);

    const sanitizedCalls = calls.map((c) => ({
      id: c.id,
      callSid: c.callSid,
      direction: c.direction,
      status: c.status,
      providerStatus: c.providerStatus,
      callerId: c.callerId,
      fromNumber: isFullPhonePermitted ? c.fromNumber : exotelService.maskPhoneNumber(c.fromNumber),
      toNumber: isFullPhonePermitted ? c.toNumber : exotelService.maskPhoneNumber(c.toNumber),
      customerName: c.customerName || "Customer",
      agentName: c.agentName || "Agent",
      orderId: c.orderId,
      orderNumber: c.orderNumber,
      purpose: c.purpose,
      durationSeconds: c.durationSeconds,
      durationFormatted: formatDuration(c.durationSeconds),
      price: c.price,
      currency: c.currency,
      recordingStatus: c.recordingStatus,
      hasRecording: Boolean(c.recordingUrl && c.recordingStatus === "AVAILABLE"),
      recordingUrl: isFullPhonePermitted || role === "AGENT" ? `/api/v1/telephony/recordings/${c.id}/stream` : null,
      createdAt: c.createdAt,
      createdAtIST: new Date(c.createdAt).toLocaleString("en-IN", { timeZone: "Asia/Kolkata" }),
    }));

    return NextResponse.json({
      success: true,
      data: sanitizedCalls,
      pagination: {
        page,
        limit,
        totalCount,
        totalPages: Math.ceil(totalCount / limit),
      },
      summary: {
        totalCalls: summaryAgg._count.id || 0,
        totalDurationSeconds: summaryAgg._sum.durationSeconds || 0,
        totalDurationFormatted: formatDuration(summaryAgg._sum.durationSeconds || 0),
        totalSpendINR: summaryAgg._sum.price || 0,
      },
    });
  } catch (error: any) {
    console.error("[Telephony Calls Fetch Error]:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

function formatDuration(seconds: number): string {
  if (!seconds || seconds <= 0) return "0s";
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  if (m === 0) return `${s}s`;
  return `${m}m ${s.toString().padStart(2, "0")}s`;
}
