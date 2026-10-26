import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { WhatsAppService } from "@/lib/services/whatsapp.service";
import { EmailService } from "@/lib/services/email.service";
import { logger } from "@/lib/utils/logger";
import { formatDeviceName, cleanDeviceName } from "@/lib/device";
import { formatAddress } from "@/lib/address";
import { verifyAuthToken, requireRole } from "@/lib/middlewares/auth";

export async function POST(req: NextRequest) {
  try {
    const authUser = await verifyAuthToken(req);
    requireRole(["ADMIN", "SUPER_ADMIN", "MANAGER", "EMPLOYEE", "AGENT"], authUser.role);

    const body = await req.json();
    const {
      quoteNumber,
      customerName,
      customerPhone,
      customerEmail,
      line1: rawLine1,
      line2: rawLine2,
      house,
      street,
      area,
      landmark,
      city = "Howrah",
      state = "West Bengal",
      pincode = "711203",
      pickupDate = "Tomorrow",
      pickupTimeSlot = "10 AM - 1 PM",
      agentNotes,
    } = body;

    const line1 = (rawLine1 || house || "").trim() || "Address Line 1";
    const line2 = rawLine2 !== undefined ? (rawLine2 ? String(rawLine2).trim() : null) : (street || area || null);

    if (!quoteNumber) {
      return NextResponse.json(
        { success: false, error: "Quote number is required for conversion." },
        { status: 400 }
      );
    }

    const cleanQuoteNum = String(quoteNumber).trim();

    // 1. Find Quote in DB
    const quote = await prisma.quote.findFirst({
      where: {
        OR: [
          { quoteNumber: cleanQuoteNum },
          { quoteNumber: `CAQ-${cleanQuoteNum.replace(/^CAQ-?/i, "")}` },
          { quoteNumber: `CAQ${cleanQuoteNum.replace(/^CAQ-?/i, "")}` },
        ],
      },
      include: {
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
      return NextResponse.json(
        { success: false, error: `Quote ${quoteNumber} not found in database.` },
        { status: 404 }
      );
    }

    // 2. Check if order already exists for this quote
    const existingOrderForQuote = await prisma.order.findFirst({
      where: { quoteId: quote.id, deletedAt: null },
      include: { user: true, address: true },
    });
    if (existingOrderForQuote) {
      return NextResponse.json({
        success: true,
        data: existingOrderForQuote,
        message: `Order #${existingOrderForQuote.orderNumber} already exists for this quote.`,
      });
    }

    // Generate matching Order ID (e.g. CAQ12345 -> CA12345)
    const digits = quote.quoteNumber.replace(/^(CAQ|Q)-?/i, "").replace(/[^0-9]/g, "");
    let orderNumber = digits ? `CA${digits}` : `CA${Math.floor(10000 + Math.random() * 90000)}`;

    const existingOrder = await prisma.order.findUnique({ where: { orderNumber } });
    if (existingOrder) {
      return NextResponse.json({
        success: true,
        data: existingOrder,
        message: `Order #${existingOrder.orderNumber} already exists.`,
      });
    }

    // 3. Find or create user
    const phone = customerPhone ? String(customerPhone).replace(/[^0-9]/g, "").slice(-10) : "9999999999";
    const name = customerName || "Valued Customer";

    let user = await prisma.user.findFirst({ where: { phone } });
    if (!user) {
      user = await prisma.user.create({
        data: {
          phone,
          name,
          email: customerEmail || null,
          firebaseUid: `uid_${phone}_${Date.now()}`,
          role: "CUSTOMER",
        },
      });
    } else {
      user = await prisma.user.update({
        where: { id: user.id },
        data: {
          name: name || user.name,
          email: customerEmail || user.email,
        },
      });
    }

    // 4. Create Address
    const address = await prisma.address.create({
      data: {
        userId: user.id,
        fullName: name,
        phone,
        line1: line1,
        line2: line2,
        house: line1,
        street: line2 || "",
        area: line2 || "",
        landmark: null,
        city: city || "Howrah",
        state: state || "West Bengal",
        pincode: pincode || "711203",
      },
    });

    // 5. Create Order Record
    const order = await prisma.order.create({
      data: {
        orderNumber,
        userId: user.id,
        quoteId: quote.id,
        addressId: address.id,
        pickupDate,
        pickupTimeSlot,
        status: "PICKUP_SCHEDULED",
        finalPrice: quote.estimatedPrice,
      },
    });

    // 6. Create Pickup Schedule
    await prisma.pickup.create({
      data: {
        orderId: order.id,
        date: pickupDate,
        timeSlot: pickupTimeSlot,
        status: "SCHEDULED",
        notes: agentNotes || "Converted from quote cart by Support Team.",
      },
    });

    // 7. Update Quote status to CONVERTED
    await prisma.quote.update({
      where: { id: quote.id },
      data: { status: "CONVERTED" },
    });

    let deviceName = "";
    if (quote.breakdownJson) {
      try {
        const bd = JSON.parse(quote.breakdownJson);
        if (bd?.deviceName) deviceName = cleanDeviceName(bd.deviceName);
      } catch {}
    }
    if (!deviceName && quote.selectedAnswersJson) {
      try {
        const sa = JSON.parse(quote.selectedAnswersJson);
        if (sa?.device && sa.device !== "Customer Mobile Device") deviceName = cleanDeviceName(sa.device);
      } catch {}
    }
    if (!deviceName && quote.variant) {
      deviceName = formatDeviceName(quote.variant.model?.brand?.name || "", quote.variant.model?.name || "", quote.variant.storage);
    }
    if (!deviceName) {
      deviceName = "Assessed Device";
    }

    const fullAddress = formatAddress(address, `${line1}${line2 ? `, ${line2}` : ""}, ${state} - ${pincode}`);

    // WhatsApp Notification
    WhatsAppService.notifyNewOrder({
      orderNumber: order.orderNumber,
      customerName: name,
      customerPhone: phone,
      deviceName,
      estimatedPrice: quote.estimatedPrice,
      pickupDate,
      pickupTimeSlot,
      address: fullAddress,
    }).catch((e) => logger.error("WhatsApp notification error:", e));

    return NextResponse.json({
      success: true,
      message: `Quote ${quote.quoteNumber} successfully converted to Order ${order.orderNumber}!`,
      data: {
        orderNumber: order.orderNumber,
        orderId: order.id,
        quoteNumber: quote.quoteNumber,
        customerName: name,
        customerPhone: phone,
        deviceName,
        estimatedPrice: quote.estimatedPrice,
        pickupDate,
        pickupTimeSlot,
      },
    });
  } catch (error: any) {
    logger.error("Quote conversion error:", error);
    const status = error.statusCode || 500;
    return NextResponse.json(
      { success: false, error: error.message || "Failed to convert quote to order." },
      { status }
    );
  }
}
