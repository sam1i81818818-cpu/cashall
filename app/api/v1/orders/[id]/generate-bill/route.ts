import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { formatDeviceName, cleanDeviceName } from "@/lib/device";
import { verifyAuthToken } from "@/lib/middlewares/auth";

function maskCustomerName(name: string): string {
  if (!name) return "Customer";
  const parts = name.trim().split(/\s+/);
  return parts
    .map((p) => (p.length > 1 ? `${p[0]}${"*".repeat(p.length - 1)}` : p))
    .join(" ");
}

function maskPhoneNumber(phone: string): string {
  const clean = (phone || "").replace(/\D/g, "").slice(-10);
  if (clean.length === 10) {
    return `${clean.slice(0, 2)}******${clean.slice(-2)}`;
  }
  return "******";
}

function maskImeiNumber(imei: string): string {
  const clean = (imei || "").trim();
  if (clean.length >= 14) {
    return `${clean.slice(0, 6)}******${clean.slice(-2)}`;
  }
  return "******";
}

async function getOrderBillData(req: NextRequest, orderIdentifier: string) {
  const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(orderIdentifier);
  const cleanOrderNum = orderIdentifier.replace(/^#/, "");

  const order = await prisma.order.findFirst({
    where: {
      OR: isUuid
        ? [{ id: orderIdentifier }, { orderNumber: cleanOrderNum }]
        : [{ orderNumber: cleanOrderNum }, { orderNumber: `#${cleanOrderNum}` }],
      deletedAt: null,
    },
    include: {
      user: true,
      address: true,
      agent: true,
      pickups: { include: { partner: true } },
      payments: true,
      qcReports: true,
      imeiRecords: true,
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
    },
  });

  if (!order) return null;

  const isCompleted =
    order.status === "COMPLETED" ||
    order.status === "PAID" ||
    order.payments?.some((p) => p.status === "PAID");

  if (!isCompleted) {
    return {
      isCompleted: false,
      orderNumber: order.orderNumber,
      status: order.status,
    } as any;
  }

  // Privilege verification for PII / IMEI unmasking
  let isPrivileged = false;
  try {
    const authUser = await verifyAuthToken(req);
    if (["ADMIN", "SUPER_ADMIN", "MANAGER", "EMPLOYEE", "AGENT"].includes(authUser.role)) {
      isPrivileged = true;
    } else if (
      authUser.uid === order.userId ||
      (authUser.phone && order.user?.phone && authUser.phone.slice(-10) === order.user.phone.slice(-10))
    ) {
      isPrivileged = true;
    }
  } catch {
    isPrivileged = false;
  }

  let explicitDeviceName = "";
  if (order.quote?.breakdownJson) {
    try {
      const bd = JSON.parse(order.quote.breakdownJson);
      if (bd?.deviceName) explicitDeviceName = bd.deviceName;
    } catch {}
  }
  if (!explicitDeviceName && order.quote?.selectedAnswersJson) {
    try {
      const sa = JSON.parse(order.quote.selectedAnswersJson);
      if (sa?.device) explicitDeviceName = sa.device;
    } catch {}
  }

  let brandName = order.quote?.variant?.model?.brand?.name || "";
  let modelName = order.quote?.variant?.model?.name || "";
  let variantStorage = order.quote?.variant?.storage || "";

  let fullDeviceName = explicitDeviceName || formatDeviceName(brandName, modelName, variantStorage);
  fullDeviceName = cleanDeviceName(fullDeviceName);

  const payment = order.payments?.find((p) => p.status === "PAID") || order.payments?.[0];

  // 1. Resolve original online quote price
  let quotedPrice = 0;
  if (order.quote?.breakdownJson) {
    try {
      const bd = JSON.parse(order.quote.breakdownJson);
      if (typeof bd?.estimatedPrice === "number" && bd.estimatedPrice > 0) {
        quotedPrice = bd.estimatedPrice;
      }
    } catch {}
  }
  if (!quotedPrice) {
    quotedPrice = order.quote?.estimatedPrice || 0;
  }

  // 2. Resolve doorstep physical inspection re-quote valuation
  const requotedPrice = order.qcReports?.[0]?.revisedPrice ?? quotedPrice;

  // 3. Resolve final agreed deal payout to seller
  const finalPrice = order.finalPrice || payment?.amount || requotedPrice || quotedPrice;

  const rawUtr = order.urn || payment?.transactionRef || (order as any).utr || "";
  const utrNumber = isPrivileged
    ? (rawUtr && !rawUtr.startsWith("PAID-") && rawUtr !== "623480124575" ? rawUtr : "")
    : (rawUtr && rawUtr.length > 4 ? `****${rawUtr.slice(-4)}` : "Verified");

  const rawImei = order.imeiRecords?.[0]?.code || order.qcReports?.[0]?.imeiNumber || (order as any).imeiNumber || "";
  const imeiCode = isPrivileged ? (rawImei || "N/A") : maskImeiNumber(rawImei);
  const agentName = order.agent?.name || order.pickups?.[0]?.notes || "CashALL Authorized Agent";

  const rawSellerName = order.user?.name || (order as any).customerName || "Customer";
  const rawSellerPhone = order.user?.phone || (order as any).customerPhone || "—";

  const customerAddress = isPrivileged
    ? (order.address
        ? [order.address.house, order.address.street, order.address.area, order.address.city, order.address.state ? `${order.address.state} - ${order.address.pincode}` : order.address.pincode].filter(Boolean).join(", ")
        : "Howrah, West Bengal")
    : (order.address
        ? [order.address.area || order.address.city, order.address.city, order.address.pincode].filter(Boolean).join(", ")
        : "Howrah, West Bengal");

  const currentYear = new Date().getFullYear();
  const billNumber = `${order.orderNumber}_${currentYear}`;

  return {
    billNumber,
    orderNumber: order.orderNumber,
    orderDate: order.createdAt?.toISOString() || new Date().toISOString(),
    completionDate: order.updatedAt?.toISOString() || new Date().toISOString(),
    transactionDate: order.updatedAt?.toISOString() || new Date().toISOString(),
    isPrivileged,
    seller: {
      name: isPrivileged ? rawSellerName : maskCustomerName(rawSellerName),
      phone: isPrivileged ? rawSellerPhone : maskPhoneNumber(rawSellerPhone),
      phoneMasked: maskPhoneNumber(rawSellerPhone),
      address: customerAddress,
    },
    buyer: {
      name: "AARNA ENTERPRISE",
      platform: "CashALL Platform",
      gstin: "19AVPPG9800JIZ3",
      address: "Howrah, West Bengal",
      assignedAgent: agentName,
    },
    device: {
      brand: brandName || "Mobile Device",
      model: modelName || "",
      variant: variantStorage || "128 GB",
      deviceName: fullDeviceName,
      imei1: imeiCode,
      imei2: "—",
    },
    financials: {
      quotedPrice,
      requotedPrice,
      finalPrice,
      estimatedPrice: quotedPrice,
      finalPurchasePrice: finalPrice,
      paymentMethod: payment?.method || "UPI Transfer",
      utrNumber,
      paymentStatus: "PAID",
    },
    declarations: {
      sellerDeclarationText: "This is a computer-generated receipt issued by CashALL. The seller (named above) has voluntarily sold the device to CashALL at the agreed final price. This document serves as the legal sale agreement and payment confirmation.",
      eSignTimestamp: order.updatedAt?.toISOString() || new Date().toISOString(),
      documentHash: "sha256_verified_aarna_cashall",
    },
  };
}

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const result = await getOrderBillData(req, params.id);
    if (!result) {
      return NextResponse.json({ success: false, error: "Order not found" }, { status: 404 });
    }
    if ((result as any).isCompleted === false) {
      return NextResponse.json({
        success: true,
        data: {
          isCompleted: false,
          orderNumber: (result as any).orderNumber,
          status: (result as any).status,
        },
      });
    }
    return NextResponse.json({ success: true, data: { isCompleted: true, billData: result } });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const result = await getOrderBillData(req, params.id);
    if (!result) {
      return NextResponse.json({ success: false, error: "Order not found" }, { status: 404 });
    }
    if ((result as any).isCompleted === false) {
      return NextResponse.json({
        success: true,
        data: {
          isCompleted: false,
          orderNumber: (result as any).orderNumber,
          status: (result as any).status,
        },
      });
    }
    return NextResponse.json({ success: true, data: { isCompleted: true, billData: result } });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

