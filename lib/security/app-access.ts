import { NextRequest } from "next/server";

export type AppType = "CUSTOMER" | "ADMIN" | "AGENT" | "CALLER";

const MASTER_KEYS = [
  process.env.CASHALL_APP_ACCESS_KEY,
  process.env.APP_DOWNLOAD_KEY,
  "CASHALL_VIP_2026",
  "CASHALL_PRIVATE_ACCESS",
  "CASHALL_INTERNAL_BUILD",
].filter(Boolean) as string[];

const ROLE_KEYS: Record<AppType, string[]> = {
  CUSTOMER: ["CASHALL_VIP_CUSTOMER", "CASHALL_SELECT_2026", ...MASTER_KEYS],
  ADMIN: ["CASHALL_ADMIN_SECURE_2026", "Ank933967@", ...MASTER_KEYS],
  AGENT: ["CASHALL_AGENT_SECURE_2026", "AGENT_DIRECT_2026", ...MASTER_KEYS],
  CALLER: ["CASHALL_CALLER_SECURE_2026", "CALLER_DESK_2026", ...MASTER_KEYS],
};

/**
 * Validates whether an incoming request has permission to download a restricted CashALL APK.
 * Returns { authorized: boolean, reason?: string }
 */
export function verifyAppDownloadAccess(req: NextRequest, appType: AppType): { authorized: boolean; reason?: string } {
  // 1. Check query parameters: ?key=, ?token=, ?access_code=, ?passkey=
  const { searchParams } = new URL(req.url);
  const queryKey = searchParams.get("key") || searchParams.get("token") || searchParams.get("access_code") || searchParams.get("passkey");
  
  // 2. Check request headers: x-download-key, x-access-code, authorization
  const headerKey = req.headers.get("x-download-key") || req.headers.get("x-access-code");
  const authHeader = req.headers.get("authorization");
  const bearerToken = authHeader?.startsWith("Bearer ") ? authHeader.substring(7).trim() : null;

  // 3. Check cookies
  const cookieKey = req.cookies.get("cashall_download_access")?.value;
  const adminCookie = req.cookies.get("cashall_admin_token")?.value;

  const candidateKeys = [queryKey, headerKey, bearerToken, cookieKey].filter(Boolean) as string[];

  // If role is ADMIN, check admin session token
  if (appType === "ADMIN" && adminCookie && adminCookie.startsWith("tok_admin")) {
    return { authorized: true };
  }

  const allowedKeys = ROLE_KEYS[appType] || MASTER_KEYS;

  for (const candidate of candidateKeys) {
    const cleanCandidate = candidate.trim();
    if (allowedKeys.some((validKey) => validKey.toLowerCase() === cleanCandidate.toLowerCase())) {
      return { authorized: true };
    }
  }

  return {
    authorized: false,
    reason: "Access Restricted: CashALL Android applications are restricted to selected users and authorized personnel only. Please contact admin@cashall.in to request access.",
  };
}
