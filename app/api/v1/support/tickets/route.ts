import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { EmailService } from "@/lib/services/email.service";
import { logger } from "@/lib/utils/logger";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, phone, email, orderId, issueType, message } = body;

    if (!name || !phone || !message) {
      return NextResponse.json(
        { success: false, error: "Name, phone number, and message are required." },
        { status: 400 }
      );
    }

    const cleanPhone = String(phone).replace(/\D/g, "").slice(-10);
    const cleanEmail = email && typeof email === "string" && email.includes("@")
      ? email.trim().toLowerCase()
      : `customer_${cleanPhone || Date.now()}@cashall.in`;

    const subject = `[${issueType || "Query"}] ${orderId ? `Order #${orderId} - ` : ""}${name.trim()}`;
    const fullMessage = `Customer Name: ${name.trim()}
Mobile: ${phone.trim()}
Email: ${email || "Not Provided"}
Order Reference: ${orderId || "N/A"}
Issue Category: ${issueType || "General Query"}

Message:
${message.trim()}`;

    // Find linked user if exists
    let userId: string | null = null;
    if (cleanPhone) {
      const existingUser = await prisma.user.findFirst({
        where: { phone: { contains: cleanPhone }, deletedAt: null },
        select: { id: true },
      });
      if (existingUser) {
        userId = existingUser.id;
      }
    }

    // Persist SupportTicket to Database
    const ticket = await prisma.supportTicket.create({
      data: {
        userId,
        name: name.trim(),
        email: cleanEmail,
        subject,
        message: fullMessage,
        status: "OPEN",
        repliesJson: "[]",
      },
    });

    // Log in AuditLog for Support Activity tracking
    try {
      await prisma.auditLog.create({
        data: {
          actorId: userId || "00000000-0000-0000-0000-000000000000",
          actorRole: "CUSTOMER",
          action: "SUPPORT_TICKET_CREATED",
          tableName: "SupportTicket",
          recordId: ticket.id,
          newValuesJson: JSON.stringify({
            ticketId: ticket.id,
            name: ticket.name,
            phone: cleanPhone,
            issueType: issueType || "General Query",
            orderId: orderId || null,
          }),
        },
      });
    } catch (auditErr) {
      logger.warn("Could not log support ticket creation:", auditErr);
    }

    // Dispatch asynchronous email notification to support team
    const emailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
        <h2 style="color: #050505; border-bottom: 2px solid #FFD400; padding-bottom: 8px;">New Customer Support Request</h2>
        <table style="width: 100%; border-collapse: collapse; margin: 16px 0;">
          <tr><td style="padding: 8px 0; font-weight: bold; width: 140px;">Customer Name:</td><td>${name.trim()}</td></tr>
          <tr><td style="padding: 8px 0; font-weight: bold;">Mobile Number:</td><td><a href="tel:${cleanPhone}">${phone.trim()}</a></td></tr>
          <tr><td style="padding: 8px 0; font-weight: bold;">Email:</td><td>${email || "Not Provided"}</td></tr>
          <tr><td style="padding: 8px 0; font-weight: bold;">Issue Category:</td><td>${issueType || "General"}</td></tr>
          <tr><td style="padding: 8px 0; font-weight: bold;">Order ID:</td><td>${orderId || "N/A"}</td></tr>
          <tr><td style="padding: 8px 0; font-weight: bold;">Ticket ID:</td><td>${ticket.id}</td></tr>
        </table>
        <div style="background-color: #f9f9f9; padding: 14px; border-radius: 6px; border-left: 4px solid #FFD400; margin-top: 12px;">
          <p style="margin: 0; font-weight: bold; margin-bottom: 6px;">Customer Message:</p>
          <p style="margin: 0; white-space: pre-wrap; color: #333;">${message.trim()}</p>
        </div>
      </div>
    `;

    EmailService.sendEmail(
      "support@cashall.in",
      `New Support Ticket: ${subject}`,
      emailHtml
    ).catch((emailErr) => logger.warn("Failed to dispatch support notification email:", emailErr));

    return NextResponse.json({
      success: true,
      data: {
        ticketId: ticket.id,
      },
      message: "Support request submitted successfully.",
    });
  } catch (error: any) {
    logger.error("Error creating support ticket:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to submit support request." },
      { status: 500 }
    );
  }
}
