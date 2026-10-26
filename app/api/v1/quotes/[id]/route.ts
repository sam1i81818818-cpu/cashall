import { NextRequest, NextResponse } from "next/server";
import { apiWrapper } from "@/lib/utils/api-wrapper";
import { prisma } from "@/lib/db";
import { formatDeviceName, cleanDeviceName } from "@/lib/device";
import { verifyAuthToken } from "@/lib/middlewares/auth";

export const dynamic = "force-dynamic";

export const GET = apiWrapper(async (
  req: NextRequest,
  { params }: { params: { id: string } }
) => {
  const quoteIdentifier = params.id;
  if (!quoteIdentifier) {
    return NextResponse.json({ success: false, error: "Quote identifier required" }, { status: 400 });
  }

  const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(quoteIdentifier);

  const quote = await prisma.quote.findFirst({
    where: {
      deletedAt: null,
      OR: [
        ...(isUuid ? [{ id: quoteIdentifier }] : []),
        { quoteNumber: quoteIdentifier },
      ],
    },
    include: {
      orders: {
        take: 1,
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          orderNumber: true,
          status: true,
        },
      },
      variant: {
        include: {
          model: {
            include: { brand: true },
          },
        },
      },
    },
  });

  if (!quote) {
    return NextResponse.json({ success: false, error: "Quote not found" }, { status: 404 });
  }

  let deviceName = quote.variant
    ? formatDeviceName(
        quote.variant.model?.brand?.name || "",
        quote.variant.model?.name || "",
        quote.variant.storage
      )
    : "Mobile Device";

  if (quote.breakdownJson) {
    try {
      const bd = JSON.parse(quote.breakdownJson);
      if (bd.deviceName) deviceName = cleanDeviceName(bd.deviceName);
    } catch (e) {}
  }
  if (deviceName === "Mobile Device" && quote.selectedAnswersJson) {
    try {
      const sa = JSON.parse(quote.selectedAnswersJson);
      if (sa?.device && sa.device !== "Customer Mobile Device") deviceName = cleanDeviceName(sa.device);
    } catch (e) {}
  }
  deviceName = cleanDeviceName(deviceName);

  let estimatedPrice = quote.estimatedPrice;
  if (quote.breakdownJson) {
    try {
      const bd = JSON.parse(quote.breakdownJson);
      if (typeof bd?.estimatedPrice === "number" && bd.estimatedPrice > 0) {
        estimatedPrice = bd.estimatedPrice;
      }
    } catch (e) {}
  }

  const relatedOrder = quote.orders?.[0];
  let displayStatus = quote.status;
  if (relatedOrder?.status === "COMPLETED") {
    displayStatus = "COMPLETED";
  } else if (relatedOrder) {
    displayStatus = "ORDERED";
  }

  // Check privilege level for customer phone privacy
  let isPrivileged = false;
  try {
    const authUser = await verifyAuthToken(req);
    if (["ADMIN", "SUPER_ADMIN", "MANAGER", "EMPLOYEE", "AGENT"].includes(authUser.role)) {
      isPrivileged = true;
    } else if (
      (quote.userId && authUser.uid === quote.userId) ||
      (authUser.phone && quote.customerPhone && authUser.phone.slice(-10) === quote.customerPhone.slice(-10))
    ) {
      isPrivileged = true;
    }
  } catch {
    isPrivileged = false;
  }

  const rawPhone = quote.customerPhone || "";
  const maskedPhone = rawPhone.length >= 10
    ? `${rawPhone.slice(0, 2)}******${rawPhone.slice(-2)}`
    : (rawPhone ? "******" : "");

  let resolvedBrandName = quote.variant?.model?.brand?.name || "";
  let resolvedModelName = quote.variant?.model?.name || "";
  let resolvedStorage = quote.variant?.storage || "";

  if (deviceName && deviceName !== "Mobile Device") {
    const cleanWithoutStorage = deviceName.replace(/\(.*?\)/g, "").trim();
    const firstWord = cleanWithoutStorage.split(" ")[0];
    if (firstWord && !resolvedBrandName) {
      resolvedBrandName = firstWord;
    }
    if (!resolvedModelName || !cleanWithoutStorage.toLowerCase().includes(resolvedModelName.toLowerCase())) {
      resolvedModelName = cleanWithoutStorage;
    }
    const storageMatch = deviceName.match(/(\d+\s*(?:GB|TB))/i);
    if (storageMatch && (!resolvedStorage || resolvedStorage === "6 GB")) {
      resolvedStorage = storageMatch[1].toUpperCase().replace(/\s+/g, " ");
    }
  }

  return NextResponse.json({
    success: true,
    quote: {
      id: quote.id,
      quoteNumber: quote.quoteNumber,
      variantId: quote.variantId,
      deviceName,
      brandName: resolvedBrandName,
      modelName: resolvedModelName,
      imageUrl: quote.variant?.model?.imageUrl || null,
      category: quote.variant?.model?.category || "MOBILE",
      storage: resolvedStorage,
      basePrice: quote.basePrice,
      totalDeductions: quote.totalDeductions,
      estimatedPrice,
      status: displayStatus,
      orderNumber: relatedOrder?.orderNumber || null,
      orderStatus: relatedOrder?.status || null,
      createdAt: quote.createdAt.toISOString(),
      expiresAt: quote.expiresAt.toISOString(),
      customerName: quote.customerName || "",
      customerPhone: isPrivileged ? rawPhone : maskedPhone,
      breakdownJson: quote.breakdownJson,
      selectedAnswersJson: quote.selectedAnswersJson,
    },
  });
});
