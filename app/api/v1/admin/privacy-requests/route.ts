import { NextRequest, NextResponse } from "next/server";
import { apiWrapper } from "@/lib/utils/api-wrapper";
import { prisma } from "@/lib/db";
import { AppError } from "@/lib/utils/AppError";
import { verifyAuthToken, requireRole } from "@/lib/middlewares/auth";
import { AuditService } from "@/lib/services/audit.service";
import { z } from "zod";

const updateStatusSchema = z.object({
  requestId: z.string().uuid("Valid UUID is required"),
  status: z.enum([
    "RECEIVED",
    "UNDER_VERIFICATION",
    "IN_REVIEW",
    "FULFILLED",
    "REJECTED",
    "EXEMPTION_APPLIED",
  ]),
  adminRemarks: z.string().optional(),
  legalExemptionReason: z.string().optional(),
});

export const GET = apiWrapper(async (req: NextRequest) => {
  const authUser = await verifyAuthToken(req);
  requireRole(["ADMIN", "SUPER_ADMIN", "MANAGER"], authUser.role);

  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status");
  const type = searchParams.get("type");
  const page = parseInt(searchParams.get("page") || "1", 10);
  const limit = Math.min(parseInt(searchParams.get("limit") || "50", 10), 100);
  const skip = (page - 1) * limit;

  const where: any = {};
  if (status) where.status = status;
  if (type) where.requestType = type;

  const [total, requests] = await Promise.all([
    prisma.dataPrivacyRequest.count({ where }),
    prisma.dataPrivacyRequest.findMany({
      where,
      include: {
        user: {
          select: { id: true, name: true, phone: true, email: true },
        },
      },
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
    }),
  ]);

  return NextResponse.json({
    success: true,
    data: {
      requests,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    },
  });
});

export const PATCH = apiWrapper(async (req: NextRequest) => {
  const authUser = await verifyAuthToken(req);
  requireRole(["ADMIN", "SUPER_ADMIN"], authUser.role);

  const body = await req.json().catch(() => ({}));
  const validation = updateStatusSchema.safeParse(body);

  if (!validation.success) {
    throw new AppError(validation.error.issues[0].message, 400);
  }

  const { requestId, status, adminRemarks, legalExemptionReason } = validation.data;

  const existing = await prisma.dataPrivacyRequest.findUnique({
    where: { id: requestId },
  });

  if (!existing) {
    throw new AppError("Privacy request record not found.", 404);
  }

  const isCompletedStatus = status === "FULFILLED" || status === "REJECTED" || status === "EXEMPTION_APPLIED";

  const updated = await prisma.dataPrivacyRequest.update({
    where: { id: requestId },
    data: {
      status,
      adminRemarks: adminRemarks ?? existing.adminRemarks,
      legalExemptionReason: legalExemptionReason ?? existing.legalExemptionReason,
      completedAt: isCompletedStatus ? new Date() : null,
    },
  });

  await AuditService.log({
    actorId: authUser.uid,
    actorRole: authUser.role,
    action: "DPDP_PRIVACY_REQUEST_STATUS_UPDATED",
    tableName: "DataPrivacyRequest",
    recordId: requestId,
    oldValues: { status: existing.status },
    newValues: { status, adminRemarks, legalExemptionReason },
  });

  return NextResponse.json({
    success: true,
    message: `Privacy request status updated to ${status}.`,
    data: updated,
  });
});
