import { NextRequest, NextResponse } from "next/server";
import { SmsService } from "@/lib/services/sms.service";

/**
 * POST /api/v1/auth/otp/send
 * Dispatches a 6-digit OTP SMS via StartMessaging API
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const phone = String(body.phone || body.phoneNumber || "").trim();

    if (!phone) {
      return NextResponse.json(
        { success: false, message: "Phone number is required." },
        { status: 400 }
      );
    }

    const cleanPhone = phone.replace(/\D/g, "").slice(-10);
    if (cleanPhone.length !== 10) {
      return NextResponse.json(
        { success: false, message: "Please provide a valid 10-digit mobile number." },
        { status: 400 }
      );
    }

    const result = await SmsService.sendOtp(cleanPhone);

    if (!result.success) {
      return NextResponse.json(
        { success: false, message: result.message, cooldownSeconds: result.cooldownSeconds },
        { status: result.cooldownSeconds ? 429 : 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: result.message,
      phone: cleanPhone,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || "Failed to process OTP dispatch." },
      { status: 500 }
    );
  }
}
