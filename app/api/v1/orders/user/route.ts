import { NextRequest, NextResponse } from "next/server";
import { apiWrapper } from "@/lib/utils/api-wrapper";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export const GET = apiWrapper(async (req: NextRequest) => {
  const { searchParams } = new URL(req.url);
  const phone = searchParams.get("phone") || searchParams.get("mobile");

  if (!phone) {
    return NextResponse.json({ success: true, orders: [] });
  }

  // Clean phone number (strip +91, spaces, dashes) — match last 10 digits
  const rawClean = phone.replace(/\D/g, "");
  const cleanPhone10 = rawClean.slice(-10); // last 10 digits only
  const cleanPhone12 = rawClean.length === 10 ? `91${rawClean}` : rawClean; // with country code

  // Try both: user.phone and address.phone matching last 10 digits
  const orders = await prisma.order.findMany({
    where: {
      deletedAt: null,
      OR: [
        {
          user: {
            OR: [
              { phone: { contains: cleanPhone10 } },
              { phone: { equals: cleanPhone12 } },
              { phone: { equals: cleanPhone10 } },
            ],
          },
        },
        {
          address: {
            OR: [
              { phone: { contains: cleanPhone10 } },
              { phone: { equals: cleanPhone12 } },
              { phone: { equals: cleanPhone10 } },
            ],
          },
        },
      ],
    },
    include: {
      user: true,
      agent: true,
      address: true,
      quote: {
        include: {
          variant: {
            include: {
              model: {
                include: { brand: true },
              },
            },
          },
        },
      },
      pickups: {
        include: { partner: true },
        orderBy: { createdAt: "desc" },
      },
      qcReports: {
        orderBy: { inspectedAt: "desc" },
      },
      payments: {
        orderBy: { createdAt: "desc" },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
    take: 50,
  });

  const formattedOrders = orders.map((ord) => {
    // Resolve deviceName from multiple sources in priority order
    let deviceName = "Mobile Device";

    // 1. Try breakdownJson (new object format with deviceName key)
    if (ord.quote?.breakdownJson) {
      try {
        const bd = JSON.parse(ord.quote.breakdownJson);
        if (bd && typeof bd === "object" && !Array.isArray(bd) && bd.deviceName) {
          deviceName = bd.deviceName;
        }
      } catch (e) {}
    }

    // 2. Try selectedAnswersJson.device (backup)
    if (deviceName === "Mobile Device" && ord.quote?.selectedAnswersJson) {
      try {
        const sa = JSON.parse(ord.quote.selectedAnswersJson);
        if (sa?.device && sa.device !== "Customer Mobile Device") deviceName = sa.device;
      } catch (e) {}
    }

    // 3. Try variant -> model -> brand chain
    if (deviceName === "Mobile Device" && ord.quote?.variant?.model) {
      const m = ord.quote.variant.model;
      deviceName = m.brand ? `${m.brand.name} ${m.name}` : m.name;
    }

    const basePrice = ord.quote?.basePrice || 0;
    let originalQuotedPrice = 0;
    if (ord.quote?.breakdownJson) {
      try {
        const bd = JSON.parse(ord.quote.breakdownJson);
        if (typeof bd?.estimatedPrice === "number" && bd.estimatedPrice > 0) {
          originalQuotedPrice = bd.estimatedPrice;
        }
      } catch (e) {}
    }
    if (!originalQuotedPrice) {
      originalQuotedPrice = ord.quote?.estimatedPrice || ord.finalPrice || 0;
    }
    const estimatedPrice = originalQuotedPrice;

    const pickup = ord.pickups && ord.pickups.length > 0 ? ord.pickups[0] : null;
    const assignedAgentName = ord.agent?.name || (pickup?.notes && pickup.notes !== "Doorstep pickup order confirmed." && pickup.notes !== "Order synced to database automatically." ? pickup.notes : null);
    const assignedAgentPhone = ord.agent?.phone || pickup?.partner?.phone || (assignedAgentName ? "7604092333" : null);

    return {
      id: ord.id,
      orderNumber: ord.orderNumber,
      quoteId: ord.quoteId,
      userId: ord.userId,
      customerName: ord.user?.name || "Customer",
      customerPhone: ord.user?.phone || phone,
      customerEmail: ord.user?.email || null,
      deviceName,
      pincode: ord.address?.pincode || "700001",
      addressSummary: ord.address
        ? `${ord.address.house || ""}, ${ord.address.street || ""}, ${ord.address.city || ""}, ${ord.address.state || ""} - ${ord.address.pincode || ""}`
        : "Address on file",
      address: ord.address ? {
        fullName: ord.address.fullName || ord.user?.name || "",
        phone: ord.address.phone || ord.user?.phone || phone,
        line1: ord.address.line1 || ord.address.house || "",
        line2: ord.address.line2 || ord.address.street || ord.address.area || "",
        city: ord.address.city || "",
        state: ord.address.state || "",
        pincode: ord.address.pincode || "",
      } : null,
      pickupDate: ord.pickupDate || pickup?.date || "Tomorrow",
      pickupTimeSlot: ord.pickupTimeSlot || pickup?.timeSlot || "10 AM - 1 PM",
      status: ord.status,
      assignedPartnerName: assignedAgentName,
      assignedPartnerPhone: assignedAgentPhone,
      agentName: assignedAgentName,
      agentPhone: assignedAgentPhone,
      quotedPrice: estimatedPrice,
      estimatedPrice,
      finalPrice: ord.finalPrice || estimatedPrice,
      revisedPrice: ord.finalPrice || estimatedPrice,
      paymentStatus: ord.payments?.find((p: any) => p.status === "PAID")?.status || (ord.status === "COMPLETED" ? "PAID" : "PENDING"),
      selectedAnswersJson: ord.quote?.selectedAnswersJson || (ord as any).selectedAnswersJson || null,
      breakdownJson: ord.quote?.breakdownJson || (ord as any).breakdownJson || null,
      quote: ord.quote ? {
        id: ord.quote.id,
        quoteNumber: ord.quote.quoteNumber,
        selectedAnswersJson: ord.quote.selectedAnswersJson,
        breakdownJson: ord.quote.breakdownJson,
        estimatedPrice: ord.quote.estimatedPrice,
        basePrice: ord.quote.basePrice,
      } : null,
      quoteNumber: ord.quote?.quoteNumber || null,
      qcReports: ord.qcReports || [],
      declaredConditionSummary: `${deviceName} - ₹${estimatedPrice.toLocaleString("en-IN")}`,
      createdAt: ord.createdAt.toISOString(),
      updatedAt: ord.updatedAt.toISOString(),
    };
  });

  return NextResponse.json({
    success: true,
    orders: formattedOrders,
  });
});
