import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { verifySessionToken } from "@/lib/auth/session-token";
import { exotelService } from "@/lib/services/exotel.service";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    // 1. Authenticate user via session token
    const authHeader = req.headers.get("authorization") || "";
    const cookieToken = req.cookies.get("session_token")?.value || "";
    const token = authHeader.replace(/^Bearer\s+/i, "") || cookieToken;

    const session = verifySessionToken(token);
    if (!session) {
      return NextResponse.json(
        { success: false, error: "Unauthorized: Invalid or expired session" },
        { status: 401 }
      );
    }

    const { role, uid } = session;
    const allowedRoles = ["ADMIN", "SUPER_ADMIN", "EMPLOYEE", "AGENT"];
    if (!allowedRoles.includes(role)) {
      return NextResponse.json(
        { success: false, error: "Forbidden: Insufficient privileges for placing calls" },
        { status: 403 }
      );
    }

    // 2. Parse request payload
    const body = await req.json().catch(() => ({}));
    const { orderId, orderNumber, customerPhone: rawCustomerPhone, customerName, purpose = "ORDER_COORDINATION", notes } = body;

    let targetCustomerPhone = rawCustomerPhone;
    let targetCustomerName = customerName;
    let resolvedOrderId = orderId;
    let resolvedOrderNumber = orderNumber;
    let customerUserId: string | null = null;

    // 3. If orderId or orderNumber is provided, look up order and verify assignment
    if (orderId || orderNumber) {
      const order = await prisma.order.findFirst({
        where: {
          OR: [
            ...(orderId ? [{ id: orderId }] : []),
            ...(orderNumber ? [{ orderNumber: orderNumber }] : []),
          ],
          deletedAt: null,
        },
        include: {
          user: true,
          address: true,
          pickups: true,
        },
      });

      if (!order) {
        return NextResponse.json(
          { success: false, error: "Referenced order not found" },
          { status: 404 }
        );
      }

      resolvedOrderId = order.id;
      resolvedOrderNumber = order.orderNumber;
      customerUserId = order.userId;

      // If customer phone was not passed, resolve from order address or customer user
      if (!targetCustomerPhone) {
        targetCustomerPhone = order.address?.phone || order.user?.phone;
      }
      if (!targetCustomerName) {
        targetCustomerName = order.address?.fullName || order.user?.name || "Customer";
      }

      // If caller is an AGENT, ensure they are assigned to this order or pickup
      if (role === "AGENT") {
        const isAssigned =
          order.agentId === uid ||
          order.pickups?.some((p) => p.partnerId === uid);

        if (!isAssigned) {
          // Allow if order is in partner/agent queue, otherwise require assignment
          const isAvailableQueue = ["PARTNER_ASSIGNED", "PICKUP_SCHEDULED"].includes(order.status);
          if (!isAvailableQueue) {
            return NextResponse.json(
              { success: false, error: "You are not assigned to this customer order" },
              { status: 403 }
            );
          }
        }
      }
    }

    if (!targetCustomerPhone) {
      return NextResponse.json(
        { success: false, error: "Target customer phone number is required" },
        { status: 400 }
      );
    }

    // 4. Retrieve Agent/Initiator phone number
    const initiatorUser = await prisma.user.findUnique({
      where: { id: uid },
      select: { id: true, name: true, phone: true, role: true },
    });

    const agentPhone = session.phone || initiatorUser?.phone;
    if (!agentPhone) {
      return NextResponse.json(
        {
          success: false,
          error: "Your user profile does not have a registered phone number. Please update your profile before placing calls.",
        },
        { status: 400 }
      );
    }

    // 5. Throttling / Duplicate Call Prevention (check if a call was initiated to this number in last 30s)
    const thirtySecondsAgo = new Date(Date.now() - 30 * 1000);
    const recentCall = await prisma.telephonyCall.findFirst({
      where: {
        initiatorUserId: uid,
        toNumber: { contains: targetCustomerPhone.slice(-10) },
        createdAt: { gte: thirtySecondsAgo },
        status: { in: ["INITIATED", "RINGING", "IN_PROGRESS"] },
      },
    });

    if (recentCall) {
      return NextResponse.json(
        {
          success: false,
          error: "A call attempt was already initiated in the last 30 seconds. Please wait before retrying.",
          existingCallId: recentCall.id,
        },
        { status: 429 }
      );
    }

    // 6. Pre-create internal call record
    const internalCall = await prisma.telephonyCall.create({
      data: {
        direction: "OUTBOUND",
        status: "INITIATED",
        initiatorUserId: uid,
        agentId: role === "AGENT" ? uid : undefined,
        customerId: customerUserId,
        orderId: resolvedOrderId,
        orderNumber: resolvedOrderNumber,
        callerId: process.env.EXOTEL_CALLER_ID || "09513886363",
        fromNumber: agentPhone,
        toNumber: targetCustomerPhone,
        agentName: initiatorUser?.name || session.name || "Agent",
        customerName: targetCustomerName,
        purpose,
        notes,
        recordingStatus: "PENDING",
      },
    });

    // 7. Trigger Exotel Connect Two Numbers Flow
    let exotelResponse;
    const origin = req.nextUrl?.origin || "https://www.cashall.in";
    const callbackUrl = `${origin}/api/v1/telephony/exotel/callback?secret=${encodeURIComponent(
      process.env.EXOTEL_WEBHOOK_SECRET || "cashall_exotel_wh_sec_2026_9823"
    )}`;

    try {
      exotelResponse = await exotelService.connectTwoNumbers({
        from: agentPhone,
        to: targetCustomerPhone,
        customField: internalCall.id,
        record: true,
        statusCallback: callbackUrl,
        timeLimit: 1800, // 30 minutes max
      });
    } catch (apiErr: any) {
      // Mark internal call as failed
      await prisma.telephonyCall.update({
        where: { id: internalCall.id },
        data: {
          status: "FAILED",
          failureReason: apiErr.message,
          providerStatus: "failed-to-initiate",
        },
      });

      return NextResponse.json(
        {
          success: false,
          error: `Telephony Gateway Error: ${apiErr.message}`,
        },
        { status: 502 }
      );
    }

    // 8. Update internal call record with provider CallSid
    const updatedCall = await prisma.telephonyCall.update({
      where: { id: internalCall.id },
      data: {
        callSid: exotelResponse.sid,
        providerStatus: exotelResponse.status,
        startTime: new Date(),
      },
    });

    // 9. Log audit trail
    await prisma.auditLog.create({
      data: {
        actorId: uid,
        actorRole: role,
        action: "TELEPHONY_CALL_INITIATED",
        tableName: "TelephonyCall",
        recordId: internalCall.id,
        newValuesJson: JSON.stringify({
          callId: internalCall.id,
          callSid: exotelResponse.sid,
          agentName: updatedCall.agentName,
          orderNumber: resolvedOrderNumber,
          customerMaskedPhone: exotelService.maskPhoneNumber(targetCustomerPhone),
        }),
      },
    }).catch(() => {});

    return NextResponse.json({
      success: true,
      message: "Call initiated successfully. Your phone will ring first, followed by the customer.",
      call: {
        id: updatedCall.id,
        callSid: updatedCall.callSid,
        status: updatedCall.status,
        callerId: updatedCall.callerId,
        customerName: updatedCall.customerName,
        customerMaskedPhone: exotelService.maskPhoneNumber(targetCustomerPhone),
        createdAt: updatedCall.createdAt,
      },
    });
  } catch (error: any) {
    console.error("[Telephony Call Error]:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Internal Telephony Error" },
      { status: 500 }
    );
  }
}
