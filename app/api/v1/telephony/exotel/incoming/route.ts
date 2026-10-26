import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { exotelService } from "@/lib/services/exotel.service";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  return handleInbound(req);
}

export async function POST(req: NextRequest) {
  return handleInbound(req);
}

async function handleInbound(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    // Parse parameters sent by Exotel Inbound Passthrough
    let callerNumber = searchParams.get("From") || searchParams.get("CallFrom") || "";
    let calledNumber = searchParams.get("To") || searchParams.get("CallTo") || "";
    let callSid = searchParams.get("CallSid") || searchParams.get("Sid") || "";

    if (!callerNumber) {
      const body = await req.json().catch(() => null);
      if (body) {
        callerNumber = body.From || body.CallFrom || "";
        calledNumber = body.To || body.CallTo || "";
        callSid = body.CallSid || body.Sid || "";
      }
    }

    const cleanCaller = callerNumber.replace(/[^0-9]/g, "").slice(-10);
    const fallbackSupportNumber = process.env.EXOTEL_BUSINESS_NUMBER || "7604096333";

    let destinationNumber = fallbackSupportNumber;
    let customerUserId: string | null = null;
    let customerName: string = "Valued Customer";
    let matchedOrderId: string | null = null;
    let matchedOrderNumber: string | null = null;
    let assignedAgentId: string | null = null;
    let assignedAgentName: string | null = null;

    if (cleanCaller) {
      // 1. Identify customer and active orders
      const order = await prisma.order.findFirst({
        where: {
          OR: [
            { address: { phone: { contains: cleanCaller } } },
            { user: { phone: { contains: cleanCaller } } },
          ],
          deletedAt: null,
          status: { in: ["PICKUP_SCHEDULED", "PARTNER_ASSIGNED", "INSPECTION_STARTED", "ACCEPTED"] },
        },
        include: {
          user: true,
          address: true,
          agent: true,
        },
        orderBy: { createdAt: "desc" },
      });

      if (order) {
        matchedOrderId = order.id;
        matchedOrderNumber = order.orderNumber;
        customerUserId = order.userId;
        customerName = order.address?.fullName || order.user?.name || "Customer";

        if (order.agent?.phone) {
          destinationNumber = order.agent.phone;
          assignedAgentId = order.agentId;
          assignedAgentName = order.agent.name;
        }
      }
    }


    // 2. Record Inbound Call in Database
    const inboundRecord = await prisma.telephonyCall.create({
      data: {
        callSid: callSid || undefined,
        direction: "INBOUND",
        status: "RINGING",
        callerId: calledNumber || process.env.EXOTEL_CALLER_ID || "09513886363",
        fromNumber: callerNumber || "UNKNOWN",
        toNumber: destinationNumber,
        customerName,
        customerId: customerUserId,
        orderId: matchedOrderId,
        orderNumber: matchedOrderNumber,
        agentId: assignedAgentId,
        agentName: assignedAgentName || "Support Team",
        purpose: "CUSTOMER_INBOUND_SUPPORT",
        recordingStatus: "PENDING",
      },
    });

    console.log(
      `[Inbound Call Routed] Call ${inboundRecord.id} from ${exotelService.maskPhoneNumber(
        callerNumber
      )} -> Routed to: ${exotelService.maskPhoneNumber(destinationNumber)} (Order: ${matchedOrderNumber || "None"})`
    );

    // Return destination number for Exotel Passthrough applet
    return new NextResponse(destinationNumber, {
      status: 200,
      headers: {
        "Content-Type": "text/plain",
      },
    });
  } catch (error: any) {
    console.error("[Inbound Call Error]:", error);
    // In case of error, gracefully fallback to primary business line
    const fallbackSupportNumber = process.env.EXOTEL_BUSINESS_NUMBER || "7604096333";
    return new NextResponse(fallbackSupportNumber, {
      status: 200,
      headers: { "Content-Type": "text/plain" },
    });
  }
}
