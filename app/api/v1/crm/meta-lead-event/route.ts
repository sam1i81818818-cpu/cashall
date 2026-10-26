import { NextRequest, NextResponse } from "next/server";
import { sendServerCrmLeadEvent } from "@/lib/analytics/meta-server";

export const dynamic = "force-dynamic";

/**
 * POST /api/v1/crm/meta-lead-event
 *
 * Endpoint to trigger Meta Qualified Leads / CRM Conversion Events.
 * Sends CRM events to Meta Dataset ID 1249229847363732 using:
 * - action_source: "system_generated"
 * - custom_data: { event_source: "crm", lead_event_source: "CashALL CRM" }
 * - user_data: { em: [...], ph: [...], lead_id: ... }
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const {
      eventName,
      leadId,
      orderNumber,
      email,
      phone,
      value,
      currency,
      stageName,
      testEventCode,
    } = body;

    const result = await sendServerCrmLeadEvent({
      eventName: eventName || "Lead",
      leadId: leadId || undefined,
      orderNumber: orderNumber || undefined,
      email: email || undefined,
      phone: phone || undefined,
      value: typeof value === "number" ? value : undefined,
      currency: currency || "INR",
      stageName: stageName || undefined,
      testEventCode: testEventCode || undefined,
    });

    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          error: result.error || "Failed to dispatch Meta CRM event",
          details: result.data,
        },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `Meta CRM event '${eventName || "Lead"}' sent successfully!`,
      data: result.data,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err?.message || "Internal server error" },
      { status: 500 }
    );
  }
}
