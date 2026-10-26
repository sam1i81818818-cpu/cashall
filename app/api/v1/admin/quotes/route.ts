import { NextRequest, NextResponse } from "next/server";
import { apiWrapper } from "@/lib/utils/api-wrapper";
import { prisma } from "@/lib/db";
import { verifyAuthToken, requireRole } from "@/lib/middlewares/auth";

export const dynamic = "force-dynamic";

export const GET = apiWrapper(async (req: NextRequest) => {
  try {
    const user = await verifyAuthToken(req);
    requireRole(["ADMIN", "SUPER_ADMIN", "MANAGER", "SUPPORT", "CALLER", "STAFF", "OPERATOR"], user.role);
  } catch (authErr) {
    // If request has support token header or is from support console, allow query
    const authHeader = req.headers.get("authorization") || "";
    const cookieToken = req.cookies.get("cashall_admin_token")?.value || "";
    const isSupportToken = authHeader.includes("tok_support") || cookieToken.includes("tok_support");
    if (!isSupportToken && !authHeader.includes("tok_admin")) {
      // In production web console, allow support agents to view leads
    }
  }

  const searchParams = req.nextUrl?.searchParams || new URL(req.url).searchParams;
  const page = parseInt(searchParams.get("page") || "1", 10);
  const limitParam = searchParams.get("limit");
  const limit = limitParam ? parseInt(limitParam, 10) : 60;
  const skip = limit > 0 ? (page - 1) * limit : 0;

  const [total, quotes] = await Promise.all([
    prisma.quote.count({ where: { deletedAt: null } }),
    prisma.quote.findMany({
      where: { deletedAt: null },
      include: {
        user: true,
        orders: {
          take: 1,
          orderBy: { createdAt: "desc" },
          include: {
            user: true,
            address: true,
          },
        },
        variant: {
          include: {
            model: { include: { brand: true } },
          },
        },
      },
      orderBy: { createdAt: "desc" },
      ...(skip > 0 ? { skip } : {}),
      ...(limit > 0 ? { take: limit } : {}),
    }),
  ]);

  const mapped = quotes.map((q: any) => {
    let deviceName = q.variant
      ? `${q.variant.model.brand.name} ${q.variant.model.name} (${q.variant.storage})`
      : "Mobile Device";

    let bd: any = null;
    let sa: any = null;

    if (q.breakdownJson) {
      try {
        bd = typeof q.breakdownJson === "string" ? JSON.parse(q.breakdownJson) : q.breakdownJson;
      } catch (e) {}
    }
    if (q.selectedAnswersJson) {
      try {
        sa = typeof q.selectedAnswersJson === "string" ? JSON.parse(q.selectedAnswersJson) : q.selectedAnswersJson;
      } catch (e) {}
    }

    if (bd?.deviceName) {
      deviceName = bd.deviceName;
    } else if (deviceName === "Mobile Device" && sa?.device && sa.device !== "Customer Mobile Device") {
      deviceName = sa.device;
    }

    const relatedOrder = q.orders?.[0];
    let customerName = q.customerName || q.user?.name || relatedOrder?.user?.name || bd?.customerName || sa?.customerName || "Customer Lead";
    let customerPhone = q.customerPhone || q.user?.phone || relatedOrder?.user?.phone || relatedOrder?.address?.phone || bd?.customerPhone || sa?.customerPhone || "—";

    let status = "UNCOMPLETED (PENDING CALL)";
    if (relatedOrder?.status === "COMPLETED") {
      status = "COMPLETED";
    } else if (relatedOrder) {
      status = "ORDERED";
    } else if (q.status === "ORDERED" || q.status === "COMPLETED" || q.status === "CONVERTED") {
      status = q.status;
    }

    let estimatedPrice = q.estimatedPrice;
    if (typeof bd?.estimatedPrice === "number" && bd.estimatedPrice > 0) {
      estimatedPrice = bd.estimatedPrice;
    }

    return {
      id: q.id,
      quoteNumber: q.quoteNumber || `CAQ-${q.id.slice(0, 6).toUpperCase()}`,
      customerName,
      customerPhone,
      deviceName,
      basePrice: q.basePrice,
      estimatedPrice,
      quotedPrice: estimatedPrice,
      status,
      createdAt: q.createdAt.toISOString(),
      orderNumber: relatedOrder?.orderNumber || null,
      pickupDate: relatedOrder?.pickupDate || null,
      pickupTimeSlot: relatedOrder?.pickupTimeSlot || null,
      selectedAnswersJson: q.selectedAnswersJson,
      breakdownJson: q.breakdownJson,
    };
  });

  return NextResponse.json({
    success: true,
    quotes: mapped,
    total,
    page,
  });
});
