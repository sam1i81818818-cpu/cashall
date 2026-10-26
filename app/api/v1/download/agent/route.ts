import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { verifyAppDownloadAccess } from "@/lib/security/app-access";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    // 1. Verify access authorization - strictly restricted to assigned field agents
    const access = verifyAppDownloadAccess(req, "AGENT");
    if (!access.authorized) {
      return NextResponse.json(
        {
          success: false,
          error: access.reason || "Access Restricted: CashALL Field Agent App is restricted to registered pickup personnel.",
          code: "UNAUTHORIZED_AGENT_APP_ACCESS",
        },
        { status: 403 }
      );
    }

    // 2. Check for external CDN / Storage URL (GitHub Releases or Supabase bucket) to eliminate Vercel Origin Transfer
    const externalStorageBase = process.env.APK_STORAGE_BASE_URL || process.env.NEXT_PUBLIC_APK_STORAGE_URL;
    if (externalStorageBase) {
      const targetUrl = `${externalStorageBase.replace(/\/$/, "")}/CashALL-Agent.apk`;
      return NextResponse.redirect(targetUrl, 302);
    }

    // 3. Fallback: Locate APK file from secure root directory (NOT in public directory)
    const apkPath = path.join(process.cwd(), "CashALL-Agent.apk");

    if (!fs.existsSync(apkPath)) {
      return NextResponse.json(
        { success: false, error: "Field Agent APK build not found. Please compile the app first." },
        { status: 404 }
      );
    }

    const fileBuffer = fs.readFileSync(apkPath);
    const stat = fs.statSync(apkPath);

    return new NextResponse(fileBuffer, {
      status: 200,
      headers: {
        "Content-Type": "application/vnd.android.package-archive",
        "Content-Disposition": 'attachment; filename="CashALL-Agent.apk"',
        "Content-Length": stat.size.toString(),
        "Cache-Control": "public, max-age=86400, s-maxage=2592000, immutable",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch (error: any) {
    console.error("Error serving Agent APK:", error);
    return NextResponse.json(
      { success: false, error: "Failed to download Agent APK" },
      { status: 500 }
    );
  }
}
