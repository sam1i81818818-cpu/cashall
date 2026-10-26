import crypto from "crypto";
import { logger } from "@/lib/utils/logger";
import { prisma } from "@/lib/db";

interface StoredOtp {
  code: string;
  expiresAt: number;
  attempts: number;
  lastSentAt: number;
}

// In-memory fallback cache across serverless requests in same instance
const globalOtpStore = new Map<string, StoredOtp>();

export class SmsService {
  private static readonly API_BASE = "https://api.startmessaging.com";
  // Pre-approved DLT Template: "Your {{appName}} OTP is {{otp}}. Do not share this code with anyone. Powered by Start Messaging."
  private static readonly TEMPLATE_ID = "39beb731-de09-4a1d-bbbf-3cc9a12936f9";
  private static readonly APP_NAME = "CashALL";
  private static readonly OTP_TTL_MS = 10 * 60 * 1000; // 10 minutes
  private static readonly RATE_LIMIT_MS = 30 * 1000; // 30s resend cooldown

  /**
   * Generates and dispatches a cryptographically secure 6-digit OTP SMS via StartMessaging
   */
  public static async sendOtp(
    phone: string
  ): Promise<{ success: boolean; message: string; cooldownSeconds?: number }> {
    const cleanPhone = (phone || "").replace(/\D/g, "").slice(-10);
    if (cleanPhone.length !== 10) {
      return { success: false, message: "Invalid 10-digit mobile number." };
    }

    const now = Date.now();

    // Check recent attempts in DB for rate limiting
    try {
      const recentLog = await prisma.otpLog.findFirst({
        where: {
          phone: cleanPhone,
          createdAt: { gte: new Date(now - this.RATE_LIMIT_MS) },
        },
        orderBy: { createdAt: "desc" },
      });

      if (recentLog) {
        const elapsed = now - recentLog.createdAt.getTime();
        const waitSec = Math.max(1, Math.ceil((this.RATE_LIMIT_MS - elapsed) / 1000));
        return {
          success: false,
          message: `Please wait ${waitSec}s before requesting a new OTP.`,
          cooldownSeconds: waitSec,
        };
      }
    } catch {
      // If DB check fails, fallback to in-memory check
      const existing = globalOtpStore.get(cleanPhone);
      if (existing && now - existing.lastSentAt < this.RATE_LIMIT_MS) {
        const waitSec = Math.ceil((this.RATE_LIMIT_MS - (now - existing.lastSentAt)) / 1000);
        return {
          success: false,
          message: `Please wait ${waitSec}s before requesting a new OTP.`,
          cooldownSeconds: waitSec,
        };
      }
    }

    // Cryptographically secure 6-digit code (100000 - 999999)
    const code = crypto.randomInt(100000, 1000000).toString();
    const apiKey = process.env.STARTMESSAGING_API_KEY || "";

    if (!apiKey) {
      logger.error("StartMessaging API Key is missing in environment!");
      return { success: false, message: "SMS Gateway is not configured." };
    }

    try {
      const payload = {
        phoneNumber: `+91${cleanPhone}`,
        templateId: this.TEMPLATE_ID,
        variables: {
          appName: this.APP_NAME,
          otp: code,
        },
      };

      const res = await fetch(`${this.API_BASE}/otp/send`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-API-Key": apiKey,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok || !data.success) {
        logger.error("StartMessaging SMS delivery error:", data);
        return {
          success: false,
          message: data?.error?.message || "Failed to deliver SMS OTP. Please try again.",
        };
      }

      // 1. Persist OTP in database for distributed serverless reliability
      const expiresAtDate = new Date(now + this.OTP_TTL_MS);
      try {
        await prisma.otpLog.create({
          data: {
            phone: cleanPhone,
            code,
            expiresAt: expiresAtDate,
            verified: false,
            type: "LOGIN",
          },
        });
      } catch (dbErr) {
        logger.warn("Database OtpLog save warning:", dbErr);
      }

      // 2. Also save in memory fallback
      globalOtpStore.set(cleanPhone, {
        code,
        expiresAt: now + this.OTP_TTL_MS,
        attempts: 0,
        lastSentAt: now,
      });

      logger.info(
        `Live OTP SMS sent successfully to +91${cleanPhone} (StartMsg reqId: ${
          data.requestId || data.data?.messageId
        })`
      );

      return {
        success: true,
        message: `OTP sent successfully to +91 ${cleanPhone}.`,
      };
    } catch (err: any) {
      logger.error("SmsService.sendOtp exception:", err);
      return {
        success: false,
        message: err.message || "Failed to connect to SMS service.",
      };
    }
  }

  /**
   * Verifies the 6-digit OTP code entered by the customer
   */
  public static async verifyOtp(
    phone: string,
    inputCode: string
  ): Promise<{ success: boolean; message: string }> {
    const cleanPhone = (phone || "").replace(/\D/g, "").slice(-10);
    const cleanInput = (inputCode || "").trim();

    if (!cleanInput || cleanInput.length < 4) {
      return { success: false, message: "Valid OTP code is required." };
    }

    // 1. Check persistent database OtpLog first
    try {
      const activeOtpRecord = await prisma.otpLog.findFirst({
        where: {
          phone: cleanPhone,
          verified: false,
          expiresAt: { gt: new Date() },
        },
        orderBy: { createdAt: "desc" },
      });

      if (activeOtpRecord) {
        if (activeOtpRecord.code === cleanInput) {
          // Mark OTP verified
          await prisma.otpLog.update({
            where: { id: activeOtpRecord.id },
            data: { verified: true },
          });
          globalOtpStore.delete(cleanPhone);
          return { success: true, message: "OTP verified successfully." };
        }
      }
    } catch (dbErr) {
      logger.warn("Database OtpLog check warning, falling back to memory:", dbErr);
    }

    // 2. Fallback to in-memory store
    const stored = globalOtpStore.get(cleanPhone);
    if (!stored) {
      return { success: false, message: "OTP not found or expired. Please request a new OTP." };
    }

    if (Date.now() > stored.expiresAt) {
      globalOtpStore.delete(cleanPhone);
      return { success: false, message: "OTP has expired. Please request a new OTP." };
    }

    if (stored.attempts >= 5) {
      globalOtpStore.delete(cleanPhone);
      return { success: false, message: "Too many incorrect attempts. Please request a new OTP." };
    }

    if (stored.code !== cleanInput) {
      stored.attempts += 1;
      return { success: false, message: "Incorrect OTP. Please enter the valid 6-digit code." };
    }

    // Success: Clear used OTP
    globalOtpStore.delete(cleanPhone);
    return { success: true, message: "OTP verified successfully." };
  }
}
