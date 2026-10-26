import { NextRequest, NextResponse } from "next/server";
import { apiWrapper } from "@/lib/utils/api-wrapper";
import { AppError } from "@/lib/utils/AppError";
import { prisma } from "@/lib/db";
import { signSessionToken } from "@/lib/auth/session-token";
import { rateLimiter } from "@/lib/middlewares/security";

export const dynamic = "force-dynamic";

const ALLOWED_ADMINS = [
  "SANGEET SHAW",
  "ABHISHEK BISWAKARMA",
  "ANKIT GUPTA",
  "AYUSH GUPTA",
];

export const POST = apiWrapper(async (req: NextRequest) => {
  // Strict rate limiting to prevent brute force
  rateLimiter(req, 10, 60000);

  const body = await req.json();

  // Accept input via name, operatorName, email, or username
  const inputName = (body.name || body.operatorName || body.email || "").trim();
  const inputPassword = body.password;

  if (!inputName) {
    throw new AppError("Operator name is required.", 400);
  }

  if (!inputPassword) {
    throw new AppError("Password is required.", 400);
  }

  // Load authoritative admin password from environment
  const expectedPassword = process.env.ADMIN_PASSWORD;
  if (!expectedPassword) {
    throw new AppError("Admin authentication is not configured on this server.", 500);
  }

  // Case-insensitive operator name matching or Admin phone/email lookup
  let matchedAdmin = ALLOWED_ADMINS.find(
    (adminName) => adminName.toLowerCase() === inputName.toLowerCase()
  );

  if (!matchedAdmin) {
    const cleanPhone = inputName.replace(/\D/g, "");
    const adminUser = await prisma.user.findFirst({
      where: {
        role: "ADMIN",
        OR: [
          ...(cleanPhone ? [{ phone: cleanPhone }] : []),
          { email: { equals: inputName, mode: "insensitive" } },
          { name: { equals: inputName, mode: "insensitive" } },
        ],
        deletedAt: null,
      },
    });

    if (adminUser?.name) {
      const uName = adminUser.name;
      matchedAdmin = ALLOWED_ADMINS.find((a) => a.toLowerCase() === uName.toLowerCase()) || uName;
    }
  }

  // Verify credentials
  if (!matchedAdmin || inputPassword !== expectedPassword) {
    throw new AppError("Invalid operator name or password.", 401);
  }

  // Record Admin Login Event in Database
  try {
    const ip = req.headers.get("x-forwarded-for") || "127.0.0.1";
    await prisma.auditLog.create({
      data: {
        actorId: "00000000-0000-0000-0000-000000000000",
        actorRole: "ADMIN",
        action: "ADMIN_LOGIN",
        tableName: "AdminSession",
        recordId: "00000000-0000-0000-0000-000000000000",
        newValuesJson: JSON.stringify({
          adminName: matchedAdmin,
          loginTimeIST: new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" }),
          ipAddress: ip,
        }),
      },
    });
  } catch (logErr) {
    console.warn("Could not log admin login event:", logErr);
  }

  const slugifiedId = `admin_${matchedAdmin.toLowerCase().replace(/\s+/g, "_")}`;
  const adminEmail = `${matchedAdmin.toLowerCase().replace(/\s+/g, ".")}@cashall.in`;

  // Issue cryptographically signed HMAC-SHA256 session token (valid 30 days)
  const signedToken = signSessionToken({
    uid: slugifiedId,
    email: adminEmail,
    role: "ADMIN",
  }, 30 * 24 * 60 * 60);

  const response = NextResponse.json({
    success: true,
    data: {
      user: {
        id: slugifiedId,
        name: matchedAdmin,
        email: adminEmail,
        role: "ADMIN",
        status: "ACTIVE",
      },
      token: signedToken,
    },
  });

  const cookieOptions = {
    path: "/",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    maxAge: 30 * 24 * 60 * 60,
  };

  response.cookies.set("cashall_admin_token", signedToken, cookieOptions);
  response.cookies.set("cashall_session_token", signedToken, cookieOptions);

  return response;
});
