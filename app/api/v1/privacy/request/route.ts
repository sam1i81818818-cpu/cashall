import { NextRequest, NextResponse } from "next/server";
import { apiWrapper } from "@/lib/utils/api-wrapper";
import { prisma } from "@/lib/db";
import { AppError } from "@/lib/utils/AppError";
import { verifyAuthToken } from "@/lib/middlewares/auth";
import { rateLimiter } from "@/lib/middlewares/security";
import { AuditService } from "@/lib/services/audit.service";
import { z } from "zod";

const createPrivacyRequestSchema = z.object({
  requestType: z.enum([
    "ACCESS_SUMMARY",
    "CORRECTION",
    "ERASURE_DELETION",
    "NOMINATION",
    "GRIEVANCE",
  ]),
  dataPrincipalName: z.string().min(2, "Full name is required (min 2 characters)"),
  dataPrincipalPhone: z.string().min(10, "10-digit mobile number is required"),
  dataPrincipalEmail: z.string().email("Valid email address is required"),
  requestDetails: z.string().min(10, "Detailed description of your request is required (min 10 characters)"),
});

export const POST = apiWrapper(async (req: NextRequest) => {
  rateLimiter(req, 10, 60000);

  const body = await req.json().catch(() => ({}));
  const validation = createPrivacyRequestSchema.safeParse(body);

  if (!validation.success) {
    throw new AppError(validation.error.issues[0].message, 400);
  }

  const {
    requestType,
    dataPrincipalName,
    dataPrincipalPhone,
    dataPrincipalEmail,
    requestDetails,
  } = validation.data;

  const cleanPhone = dataPrincipalPhone.replace(/\D/g, "").slice(-10);
  if (cleanPhone.length !== 10) {
    throw new AppError("Invalid 10-digit mobile number.", 400);
  }

  // Attempt to link to authenticated user or match existing phone
  let linkedUserId: string | null = null;
  let identityVerified = false;

  try {
    const authUser = await verifyAuthToken(req);
    if (authUser && authUser.uid) {
      linkedUserId = authUser.uid;
      identityVerified = true;
    }
  } catch {
    // Unauthenticated public submission: look up by verified phone in DB
    const existingUser = await prisma.user.findFirst({
      where: { phone: cleanPhone, deletedAt: null },
    });
    if (existingUser) {
      linkedUserId = existingUser.id;
    }
  }

  const record = await prisma.dataPrivacyRequest.create({
    data: {
      requestType,
      userId: linkedUserId,
      dataPrincipalName: dataPrincipalName.trim(),
      dataPrincipalPhone: cleanPhone,
      dataPrincipalEmail: dataPrincipalEmail.trim().toLowerCase(),
      identityVerified,
      verificationMethod: identityVerified ? "AUTHENTICATED_SESSION" : "PHONE_MATCH_PENDING",
      requestDetails: requestDetails.trim(),
      status: "RECEIVED",
    },
  });

  await AuditService.log({
    actorId: linkedUserId || "00000000-0000-0000-0000-000000000000",
    actorRole: identityVerified ? "CUSTOMER" : "ANONYMOUS_DATA_PRINCIPAL",
    action: "DPDP_PRIVACY_REQUEST_SUBMITTED",
    tableName: "DataPrivacyRequest",
    recordId: record.id,
    newValues: {
      requestId: record.id,
      requestType: record.requestType,
      phone: `${cleanPhone.slice(0, 2)}******${cleanPhone.slice(-2)}`,
      status: record.status,
    },
  });

  return NextResponse.json({
    success: true,
    message:
      "Your privacy request under the Digital Personal Data Protection Act, 2023 has been recorded. Our Grievance Officer will review your request within statutory timelines.",
    data: {
      requestId: record.id,
      requestType: record.requestType,
      status: record.status,
      submittedAt: record.createdAt.toISOString(),
      statutoryDeadlineDays: 30,
    },
  });
});

export const GET = apiWrapper(async (req: NextRequest) => {
  rateLimiter(req, 20, 60000);

  const { searchParams } = new URL(req.url);
  const requestId = searchParams.get("id");
  const phone = searchParams.get("phone");

  if (!requestId) {
    throw new AppError("Request ID is required to check privacy request status.", 400);
  }

  const record = await prisma.dataPrivacyRequest.findUnique({
    where: { id: requestId },
  });

  if (!record) {
    throw new AppError("Privacy request not found.", 404);
  }

  // Verification check: caller must be privileged or match the registered phone
  let authorized = false;
  try {
    const authUser = await verifyAuthToken(req);
    if (["ADMIN", "SUPER_ADMIN", "MANAGER"].includes(authUser.role)) {
      authorized = true;
    } else if (authUser.uid === record.userId || (authUser.phone && authUser.phone.slice(-10) === record.dataPrincipalPhone)) {
      authorized = true;
    }
  } catch {
    // If checking with phone confirmation
    if (phone && phone.replace(/\D/g, "").slice(-10) === record.dataPrincipalPhone) {
      authorized = true;
    }
  }

  if (!authorized) {
    throw new AppError("Access denied. Please provide the matching phone number or log in.", 403);
  }

  return NextResponse.json({
    success: true,
    data: {
      id: record.id,
      requestType: record.requestType,
      status: record.status,
      createdAt: record.createdAt.toISOString(),
      updatedAt: record.updatedAt.toISOString(),
      completedAt: record.completedAt?.toISOString() || null,
      adminRemarks: record.adminRemarks || null,
    },
  });
});
