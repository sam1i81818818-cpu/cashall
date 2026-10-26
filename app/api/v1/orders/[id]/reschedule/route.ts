import { NextRequest, NextResponse } from "next/server";
import { apiWrapper } from "@/lib/utils/api-wrapper";
import { prisma } from "@/lib/db";
import { AppError } from "@/lib/utils/AppError";
import { getRecordedPickupDate } from "@/lib/utils/pickup-date";

export const dynamic = "force-dynamic";

export const POST = apiWrapper(async (req: NextRequest, { params }: { params: { id: string } }) => {
  const orderIdentifier = params.id;
  const body = await req.json();
  const { pickupDate, pickupTimeSlot, reason, actorRole = "USER", actorName } = body;

  if (!pickupDate || typeof pickupDate !== "string" || !pickupDate.trim()) {
    throw new AppError("A valid pickupDate is required to reschedule.", 400);
  }

  const cleanDate = getRecordedPickupDate(pickupDate.trim());
  const cleanSlot = (pickupTimeSlot && typeof pickupTimeSlot === "string") ? pickupTimeSlot.trim() : null;

  const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(orderIdentifier);
  const cleanOrderNum = orderIdentifier.replace(/^#/, "").trim();

  // Find order
  const order = await prisma.order.findFirst({
    where: {
      OR: isUuid
        ? [{ id: orderIdentifier }, { orderNumber: cleanOrderNum }]
        : [{ orderNumber: cleanOrderNum }, { orderNumber: `#${cleanOrderNum}` }],
      deletedAt: null,
    },
    include: {
      pickups: {
        where: { deletedAt: null },
        orderBy: { createdAt: "desc" },
        take: 1,
      },
    },
  });

  if (!order) {
    throw new AppError("Order not found.", 404);
  }

  // If order was already completed or cancelled, prevent reschedule unless admin
  if (order.status === "COMPLETED") {
    throw new AppError("Completed orders cannot be rescheduled.", 400);
  }

  const oldDate = order.pickupDate;
  const oldSlot = order.pickupTimeSlot;

  // Determine new status: if it was CANCELLED, restore to PICKUP_SCHEDULED
  const newStatus = order.status === "CANCELLED" ? "PICKUP_SCHEDULED" : order.status;

  // 1. Update Order
  const updatedOrder = await prisma.order.update({
    where: { id: order.id },
    data: {
      pickupDate: cleanDate,
      ...(cleanSlot ? { pickupTimeSlot: cleanSlot } : {}),
      status: newStatus,
      cancellationReason: null,
    },
  });

  // 2. Update active Pickup record or create one if missing
  let updatedPickup = null;
  if (order.pickups && order.pickups.length > 0) {
    const activePickup = order.pickups[0];
    updatedPickup = await prisma.pickup.update({
      where: { id: activePickup.id },
      data: {
        date: cleanDate,
        ...(cleanSlot ? { timeSlot: cleanSlot } : {}),
        status: activePickup.status === "FAILED" || activePickup.status === "CANCELLED" ? "SCHEDULED" : activePickup.status,
        notes: reason ? `Rescheduled: ${reason}` : `Rescheduled from ${oldDate} to ${cleanDate}`,
      },
    });
  } else {
    updatedPickup = await prisma.pickup.create({
      data: {
        orderId: order.id,
        date: cleanDate,
        timeSlot: cleanSlot || "10 AM - 1 PM",
        status: "SCHEDULED",
        notes: reason ? `Rescheduled: ${reason}` : `Initial pickup scheduled for ${cleanDate}`,
      },
    });
  }

  // 3. Log into AuditLog
  try {
    await prisma.auditLog.create({
      data: {
        actorId: order.userId || "00000000-0000-0000-0000-000000000000",
        actorRole: actorRole.toUpperCase(),
        action: "ORDER_RESCHEDULED",
        tableName: "Order",
        recordId: order.id,
        oldValuesJson: JSON.stringify({ pickupDate: oldDate, pickupTimeSlot: oldSlot, status: order.status }),
        newValuesJson: JSON.stringify({
          orderNumber: order.orderNumber,
          newPickupDate: cleanDate,
          newPickupTimeSlot: cleanSlot || oldSlot,
          actor: actorName || actorRole,
          reason: reason || "User / Staff request",
          rescheduledAt: new Date().toISOString(),
        }),
      },
    });
  } catch (logErr) {
    console.warn("Could not log reschedule audit event:", logErr);
  }

  return NextResponse.json({
    success: true,
    message: `Order #${order.orderNumber} successfully rescheduled for ${cleanDate}`,
    data: {
      order: updatedOrder,
      pickup: updatedPickup,
    },
  });
});
