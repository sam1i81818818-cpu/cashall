import { NextRequest, NextResponse } from "next/server";
import { apiWrapper } from "@/lib/utils/api-wrapper";
import { verifyAuthToken } from "@/lib/middlewares/auth";
import { prisma } from "@/lib/db";
import { AppError } from "@/lib/utils/AppError";
import { AuditService } from "@/lib/services/audit.service";
import { z } from "zod";

const blockSchema = z.object({
  action: z.enum(["block", "unblock"]),
  reason: z.string().min(3).max(500).optional(),
});

export const POST = apiWrapper(
  async (req: NextRequest, { params }: { params: { id: string } }) => {
    const admin = await verifyAuthToken(req);
    if (admin.role !== "ADMIN" && admin.role !== "SUPER_ADMIN") throw new AppError("Forbidden: Admin access required.", 403);

    const body = await req.json();
    const validation = blockSchema.safeParse(body);
    if (!validation.success) {
      throw new AppError(validation.error.issues[0].message, 400);
    }

    const { action, reason } = validation.data;
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(params.id);
    const cleanPhone = params.id.replace(/\D/g, "").slice(-10);

    const targetUser = isUuid
      ? await prisma.user.findUnique({ where: { id: params.id } })
      : await prisma.user.findFirst({
          where: {
            OR: [
              { id: params.id },
              ...(cleanPhone ? [{ phone: cleanPhone }] : []),
            ],
          },
        });

    if (!targetUser) throw new AppError("User not found.", 404);
    if (targetUser.role === "ADMIN" || targetUser.role === "SUPER_ADMIN") throw new AppError("Admin accounts cannot be blocked.", 400);

    if (action === "block") {
      if (!reason || reason.trim().length < 3) throw new AppError("A block reason is required.", 400);

      const updated = await prisma.user.update({
        where: { id: targetUser.id },
        data: { isBlocked: true, blockedAt: new Date(), blockReason: reason.trim(), blockedByAdminId: admin.uid },
        select: { id: true, phone: true, name: true, isBlocked: true, blockedAt: true, blockReason: true },
      });

      await AuditService.log({
        actorId: admin.uid, actorRole: admin.role, action: "USER_BLOCKED",
        tableName: "User", recordId: params.id,
        oldValues: { isBlocked: false }, newValues: { isBlocked: true, blockReason: reason.trim() },
      });

      return NextResponse.json({ success: true, message: `User ${targetUser.phone} has been permanently blocked.`, data: updated });
    }

    const updated = await prisma.user.update({
      where: { id: targetUser.id },
      data: { isBlocked: false, blockedAt: null, blockReason: null, blockedByAdminId: null },
      select: { id: true, phone: true, name: true, isBlocked: true },
    });

    await AuditService.log({
      actorId: admin.uid, actorRole: admin.role, action: "USER_UNBLOCKED",
      tableName: "User", recordId: params.id,
      oldValues: { isBlocked: true }, newValues: { isBlocked: false },
    });

    return NextResponse.json({ success: true, message: `User ${targetUser.phone} has been unblocked.`, data: updated });
  }
);