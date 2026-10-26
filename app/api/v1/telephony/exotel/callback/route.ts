import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { CallStatus, RecordingStatus } from "@prisma/client";

export const dynamic = "force-dynamic";

function mapExotelStatusToCallStatus(exotelStatus?: string): CallStatus {
  if (!exotelStatus) return "COMPLETED";
  const lower = exotelStatus.toLowerCase().trim();
  switch (lower) {
    case "completed":
      return "COMPLETED";
    case "busy":
      return "BUSY";
    case "no-answer":
    case "noanswer":
      return "NO_ANSWER";
    case "canceled":
    case "cancelled":
      return "CANCELLED";
    case "failed":
      return "FAILED";
    case "in-progress":
    case "inprogress":
      return "IN_PROGRESS";
    case "ringing":
      return "RINGING";
    default:
      return "COMPLETED";
  }
}

async function handleCallback(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const secret = searchParams.get("secret");
    const configuredSecret = process.env.EXOTEL_WEBHOOK_SECRET || "cashall_exotel_wh_sec_2026_9823";

    if (secret && secret !== configuredSecret) {
      console.warn("[Exotel Callback] Unauthorized webhook secret rejected");
      return NextResponse.json({ error: "Invalid webhook secret" }, { status: 401 });
    }

    let payload: Record<string, any> = {};

    // Exotel can send callbacks as form-urlencoded or JSON
    const contentType = req.headers.get("content-type") || "";
    if (contentType.includes("application/json")) {
      payload = await req.json().catch(() => ({}));
    } else if (contentType.includes("application/x-www-form-urlencoded")) {
      const formData = await req.formData().catch(() => null);
      if (formData) {
        formData.forEach((value, key) => {
          payload[key] = value.toString();
        });
      }
    } else {
      // Fallback to query parameters
      searchParams.forEach((value, key) => {
        payload[key] = value;
      });
    }

    // Normalized Exotel fields
    const callSid = payload.CallSid || payload.callSid || payload.Sid || payload.sid;
    const customField = payload.CustomField || payload.customField;
    const providerStatus = payload.Status || payload.status || payload.DialCallStatus;
    const duration = Number(payload.Duration || payload.duration || payload.CallDuration || 0);
    const recordingUrl = payload.RecordingUrl || payload.recordingUrl || payload.RecordUrl;
    const price = payload.Price ? parseFloat(payload.Price) : undefined;
    const startTimeStr = payload.StartTime || payload.startTime;
    const endTimeStr = payload.EndTime || payload.endTime;

    if (!callSid && !customField) {
      return NextResponse.json(
        { error: "Missing CallSid or CustomField in webhook" },
        { status: 400 }
      );
    }

    // Locate existing internal call record
    const existingCall = await prisma.telephonyCall.findFirst({
      where: {
        OR: [
          ...(callSid ? [{ callSid }] : []),
          ...(customField ? [{ id: customField }] : []),
        ],
      },
    });

    if (!existingCall) {
      console.warn(`[Exotel Callback] Call not found for Sid: ${callSid}, CustomField: ${customField}`);
      return NextResponse.json({ success: true, warning: "Call record not found" }, { status: 200 });
    }

    const mappedStatus = mapExotelStatusToCallStatus(providerStatus);
    let resolvedRecordingStatus: RecordingStatus = existingCall.recordingStatus;

    if (recordingUrl) {
      resolvedRecordingStatus = "AVAILABLE";
    } else if (mappedStatus === "COMPLETED" && duration === 0) {
      resolvedRecordingStatus = "UNAVAILABLE";
    } else if (["FAILED", "CANCELLED", "BUSY", "NO_ANSWER"].includes(mappedStatus)) {
      resolvedRecordingStatus = "NOT_ENABLED";
    }

    // Idempotent update
    const updatedCall = await prisma.telephonyCall.update({
      where: { id: existingCall.id },
      data: {
        callSid: callSid || existingCall.callSid,
        status: mappedStatus,
        providerStatus: providerStatus || existingCall.providerStatus,
        durationSeconds: duration > 0 ? duration : existingCall.durationSeconds,
        price: price !== undefined ? price : existingCall.price,
        recordingUrl: recordingUrl || existingCall.recordingUrl,
        recordingStatus: resolvedRecordingStatus,
        startTime: startTimeStr ? new Date(startTimeStr) : existingCall.startTime,
        endTime: endTimeStr ? new Date(endTimeStr) : new Date(),
        metadataJson: JSON.stringify(payload),
      },
    });

    console.log(
      `[Exotel Callback Updated] Call ${updatedCall.id} -> Status: ${updatedCall.status}, Duration: ${updatedCall.durationSeconds}s, Recording: ${updatedCall.recordingStatus}`
    );

    return NextResponse.json({
      success: true,
      message: "Call status and recording metadata updated",
      callId: updatedCall.id,
      status: updatedCall.status,
    });
  } catch (error: any) {
    console.error("[Exotel Callback Error]:", error);
    return NextResponse.json({ error: error.message || "Callback processing error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  return handleCallback(req);
}

export async function GET(req: NextRequest) {
  return handleCallback(req);
}
