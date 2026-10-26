import { NextRequest, NextResponse } from "next/server";
import { apiWrapper } from "@/lib/utils/api-wrapper";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export const GET = apiWrapper(async (req: NextRequest) => {
  const { searchParams } = new URL(req.url);
  const phone = searchParams.get("phone") || searchParams.get("mobile");

  if (!phone) {
    return NextResponse.json({ success: true, quotes: [] });
  }

  const rawClean = phone.replace(/\D/g, "");
  const cleanPhone10 = rawClean.slice(-10);
  const cleanPhone12 = rawClean.length === 10 ? `91${rawClean}` : rawClean;

  if (!cleanPhone10) {
    return NextResponse.json({ success: true, quotes: [] });
  }

  // Also fetch any placed orders for this user to ensure quotes converted into orders are not shown
  const userOrders = await prisma.order.findMany({
    where: {
      deletedAt: null,
      OR: [
        { user: { phone: { contains: cleanPhone10 } } },
        { address: { phone: { contains: cleanPhone10 } } },
      ],
    },
    select: {
      id: true,
      orderNumber: true,
      quoteId: true,
    },
  });

  const convertedQuoteIds = new Set<string>();
  const convertedNumericDigits = new Set<string>();

  userOrders.forEach((o) => {
    if (o.quoteId) convertedQuoteIds.add(String(o.quoteId).toLowerCase());
    const digits = (o.orderNumber || "").replace(/\D/g, "");
    if (digits.length >= 4) convertedNumericDigits.add(digits);
  });

  // Egress protection: take max 50 recent quotes, select specific relation fields
  const quotes = await prisma.quote.findMany({
    where: {
      deletedAt: null,
      status: { notIn: ["CONVERTED", "ORDERED", "COMPLETED"] },
      orders: { none: {} },
      OR: [
        { customerPhone: cleanPhone10 },
        { customerPhone: cleanPhone12 },
        { customerPhone: { contains: cleanPhone10 } },
        { breakdownJson: { contains: cleanPhone10 } },
        { selectedAnswersJson: { contains: cleanPhone10 } },
        { user: { phone: { contains: cleanPhone10 } } },
      ],
    },
    include: {
      orders: {
        take: 1,
        select: {
          id: true,
          orderNumber: true,
          status: true,
        },
      },
      variant: {
        select: {
          id: true,
          storage: true,
          model: {
            select: {
              name: true,
              imageUrl: true,
              category: true,
              brand: {
                select: {
                  name: true,
                },
              },
            },
          },
        },
      },
    },
    orderBy: { createdAt: "desc" },
    take: 50,
  });

  // Additional filter: guarantee any quote matching a placed order by quoteId or orderNumber digits is excluded
  const unbookedQuotes = quotes.filter((q) => {
    if (q.orders && q.orders.length > 0) return false;
    if (convertedQuoteIds.has(String(q.id).toLowerCase())) return false;
    if (convertedQuoteIds.has(String(q.quoteNumber).toLowerCase())) return false;

    const qDigits = (q.quoteNumber || "").replace(/\D/g, "");
    if (qDigits.length >= 4) {
      for (const ordDigits of convertedNumericDigits) {
        if (qDigits === ordDigits || qDigits.includes(ordDigits) || ordDigits.includes(qDigits)) {
          return false;
        }
      }
    }
    return true;
  });

  const formattedQuotes = unbookedQuotes.map((q) => {
    let deviceName = q.variant
      ? `${q.variant.model.brand.name} ${q.variant.model.name}${q.variant.storage ? ` (${q.variant.storage})` : ""}`
      : "Mobile Device";

    if (q.breakdownJson) {
      try {
        const bd = JSON.parse(q.breakdownJson);
        if (bd.deviceName) deviceName = bd.deviceName;
      } catch (e) {}
    }
    if (deviceName === "Mobile Device" && q.selectedAnswersJson) {
      try {
        const sa = JSON.parse(q.selectedAnswersJson);
        if (sa?.device && sa.device !== "Customer Mobile Device") deviceName = sa.device;
      } catch (e) {}
    }

    let estimatedPrice = q.estimatedPrice;
    if (q.breakdownJson) {
      try {
        const bd = JSON.parse(q.breakdownJson);
        if (typeof bd?.estimatedPrice === "number" && bd.estimatedPrice > 0) {
          estimatedPrice = bd.estimatedPrice;
        }
      } catch (e) {}
    }

    const brandName = q.variant?.model?.brand?.name || "";
    const modelName = q.variant?.model?.name || "";
    const imageUrl = q.variant?.model?.imageUrl || null;
    const category = q.variant?.model?.category || "MOBILE";

    return {
      id: q.id,
      quoteNumber: q.quoteNumber,
      variantId: q.variantId,
      deviceName,
      brandName,
      modelName,
      imageUrl,
      category,
      storage: q.variant?.storage || "",
      basePrice: q.basePrice,
      totalDeductions: q.totalDeductions,
      estimatedPrice,
      status: q.status,
      orderNumber: null,
      orderStatus: null,
      createdAt: q.createdAt.toISOString(),
      expiresAt: q.expiresAt.toISOString(),
      customerName: q.customerName || "",
      customerPhone: q.customerPhone || cleanPhone10,
      breakdownJson: q.breakdownJson,
      selectedAnswersJson: q.selectedAnswersJson,
    };
  });

  return NextResponse.json({
    success: true,
    quotes: formattedQuotes,
    count: formattedQuotes.length,
  });
});
