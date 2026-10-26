import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { verifyAuthToken, requireRole } from "@/lib/middlewares/auth";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const user = await verifyAuthToken(req);
    requireRole(["ADMIN", "SUPER_ADMIN", "MANAGER"], user.role);

    const logs = await prisma.auditLog.findMany({
      where: {
        action: "ADMIN_LOGIN",
      },
      orderBy: { createdAt: "desc" },
      take: 20,
    });

    const formatted = logs.map((log) => {
      let adminName = "CashALL Operator";
      let loginTimeIST = new Date(log.createdAt).toLocaleString("en-IN", { timeZone: "Asia/Kolkata" });
      let ipAddress = "127.0.0.1";

      if (log.newValuesJson) {
        try {
          const parsed = JSON.parse(log.newValuesJson);
          if (parsed.adminName) adminName = parsed.adminName;
          if (parsed.loginTimeIST) loginTimeIST = parsed.loginTimeIST;
          if (parsed.ipAddress) ipAddress = parsed.ipAddress;
        } catch {}
      }

      return {
        id: log.id,
        adminName,
        loginTimeIST,
        ipAddress,
        createdAt: log.createdAt.toISOString(),
      };
    });

    return NextResponse.json({
      success: true,
      logins: formatted,
    });
  } catch (error: any) {
    console.error("Error fetching admin login logs:", error);
    const status = error.statusCode || 500;
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch login logs" },
      { status }
    );
  }
}
