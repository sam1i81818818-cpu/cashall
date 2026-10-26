import { NextRequest, NextResponse } from "next/server";
import { apiWrapper } from "@/lib/utils/api-wrapper";
import { verifyAuthToken } from "@/lib/middlewares/auth";
import { prisma } from "@/lib/db";
import { AppError } from "@/lib/utils/AppError";

export const GET = apiWrapper(async (req: NextRequest, { params }: { params: { id: string } }) => {
  const orderIdentifier = params.id;

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
      agent: true,
      quote: {
        include: {
          variant: {
            include: {
              model: {
                include: {
                  brand: true,
                },
              },
            },
          },
        },
      },
      address: true,
      pickups: {
        include: {
          partner: true,
        },
        orderBy: { createdAt: "desc" },
      },
      qcReports: {
        orderBy: { inspectedAt: "desc" },
      },
      offers: {
        orderBy: { createdAt: "desc" },
      },
      payments: {
        orderBy: { createdAt: "desc" },
      },
      invoices: {
        orderBy: { createdAt: "desc" },
      },
      imeiRecords: true,
    },
  });

  if (!order) {
    throw new AppError("Order not found.", 404);
  }

  // Authenticate user to determine privilege level for PII masking
  let isPrivileged = false;
  try {
    const authUser = await verifyAuthToken(req);
    if (["ADMIN", "SUPER_ADMIN", "MANAGER", "EMPLOYEE", "AGENT"].includes(authUser.role)) {
      isPrivileged = true;
    } else if (authUser.uid === order.userId || (authUser.phone && order.user?.phone && authUser.phone.slice(-10) === order.user.phone.slice(-10))) {
      isPrivileged = true;
    }
  } catch {
    isPrivileged = false;
  }

  // Resolve device name & location summary
  const addr = order.address;
  const addressSummary = isPrivileged
    ? (addr
        ? [addr.house, addr.street, addr.area, addr.landmark, addr.city, addr.state].filter(Boolean).join(", ") + (addr.pincode ? ` - ${addr.pincode}` : "")
        : "Doorstep Location")
    : (addr
        ? [addr.area || addr.city, addr.city, addr.pincode].filter(Boolean).join(", ")
        : "Doorstep Location");

  let deviceName = "Mobile Device";
  if (order.quote?.breakdownJson) {
    try {
      const bd = JSON.parse(order.quote.breakdownJson);
      if (bd?.deviceName) deviceName = bd.deviceName;
    } catch {}
  }
  if (deviceName === "Mobile Device" && order.quote?.variant?.model) {
    const m = order.quote.variant.model;
    deviceName = m.brand ? `${m.brand.name} ${m.name}` : m.name;
  }

  const assignedPartner = order.pickups?.[0]?.partner;
  const pickup = order.pickups?.[0];
  const assignedAgentName = order.agent?.name || ((pickup?.notes && pickup.notes !== "Doorstep pickup order confirmed." && pickup.notes !== "Order synced to database automatically.")
    ? pickup.notes
    : (assignedPartner?.name || assignedPartner?.businessName || null));

  const assignedAgentPhone = order.agent?.phone || assignedPartner?.phone || (assignedAgentName ? "7604092333" : null);

  const activePayment = order.payments?.find((p: any) => p.status === "PAID") || order.payments?.[0];

  // 1. Resolve original online quoted price
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

  // 2. Resolve doorstep physical QC re-quote price
  const requotedPrice = order.qcReports?.[0]?.revisedPrice ?? quotedPrice;

  // 3. Resolve final agreed deal payout to seller
  const finalPrice = order.finalPrice ?? activePayment?.amount ?? requotedPrice ?? quotedPrice;

  // Mask PII if caller is unauthenticated public visitor
  const rawPhone = order.user?.phone || "";
  const maskedPhone = rawPhone.length >= 10
    ? `${rawPhone.slice(0, 2)}******${rawPhone.slice(-2)}`
    : (rawPhone ? "******" : "—");

  const rawEmail = order.user?.email || "";
  const maskedEmail = rawEmail.includes("@")
    ? `${rawEmail.slice(0, 2)}***@${rawEmail.split("@")[1]}`
    : null;

  const sanitizedUser = isPrivileged
    ? order.user
    : (order.user ? { name: order.user.name, phone: maskedPhone } : null);

  const sanitizedAddress = isPrivileged
    ? order.address
    : (order.address ? { city: order.address.city, state: order.address.state, pincode: order.address.pincode } : null);

  const sanitizedQcReports = isPrivileged
    ? order.qcReports
    : order.qcReports?.map((qc: any) => ({
        ...qc,
        imeiNumber: qc.imeiNumber ? `${qc.imeiNumber.slice(0, 6)}******${qc.imeiNumber.slice(-2)}` : null,
      }));

  const sanitizedImeiRecords = isPrivileged
    ? (order as any).imeiRecords
    : (order as any).imeiRecords?.map((im: any) => ({
        ...im,
        code: im.code ? `${im.code.slice(0, 6)}******${im.code.slice(-2)}` : null,
      }));

  const sanitizedPayments = isPrivileged
    ? order.payments
    : order.payments?.map((pm: any) => ({
        ...pm,
        transactionRef: pm.transactionRef && pm.transactionRef.length > 4 ? `****${pm.transactionRef.slice(-4)}` : "Verified",
      }));

  return NextResponse.json({
    success: true,
    data: {
      ...order,
      user: sanitizedUser,
      address: sanitizedAddress,
      qcReports: sanitizedQcReports,
      imeiRecords: sanitizedImeiRecords,
      payments: sanitizedPayments,
      deviceName,
      addressSummary,
      customerName: order.user?.name || "Customer",
      customerPhone: isPrivileged ? (order.user?.phone || "—") : maskedPhone,
      customerEmail: isPrivileged ? (order.user?.email || null) : maskedEmail,
      assignedPartnerName: assignedAgentName,
      assignedPartnerPhone: assignedAgentPhone,
      agentName: assignedAgentName,
      agentPhone: assignedAgentPhone,
      assignedPartnerBusiness: assignedPartner?.businessName || "CashALL Express Logistics",
      utr: isPrivileged ? (order.urn || activePayment?.transactionRef || "") : (order.urn ? `****${order.urn.slice(-4)}` : "Verified"),
      urn: isPrivileged ? (order.urn || activePayment?.transactionRef || "") : (order.urn ? `****${order.urn.slice(-4)}` : "Verified"),
      quotedPrice,
      estimatedPrice: quotedPrice,
      requotedPrice,
      revisedPrice: requotedPrice,
      finalPrice,
      amount: finalPrice,
      selectedAnswersJson: order.quote?.selectedAnswersJson || (order as any).selectedAnswersJson || null,
      breakdownJson: order.quote?.breakdownJson || (order as any).breakdownJson || null,
      quote: order.quote || null,
    },
  });
});
