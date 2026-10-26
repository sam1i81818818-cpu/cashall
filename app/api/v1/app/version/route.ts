import { NextRequest, NextResponse } from "next/server";

export const revalidate = 86400; // Edge cached for 24 hours

export async function GET(req: NextRequest) {
  try {
    return NextResponse.json({
      success: true,
      agent: {
        versionCode: 9,
        versionName: "1.0.9",
        downloadUrl: "https://cashall.in/api/v1/download/agent",
        forceUpdate: false,
        title: "CashALL Agent Update Available (v1.0.9)",
        releaseNotes: "Soothing melodious notification chime (replaces harsh siren) and standardized address layout.",
        announcement: "Updated with soothing chime notifications and simplified address entry.",
      },
      admin: {
        versionCode: 2,
        versionName: "1.0.1",
        downloadUrl: "https://cashall.in/api/v1/download/admin",
        forceUpdate: false,
        title: "CashALL Admin Update Available (v1.0.1)",
        releaseNotes: "Soothing melodious order chime (replaces harsh siren), simplified address handling, and in-app updater.",
        announcement: "Updated with soothing order alerts and simplified address format.",
      },
      caller: {
        versionCode: 3,
        versionName: "1.0.3",
        downloadUrl: "https://cashall.in/api/v1/download/caller",
        forceUpdate: false,
        title: "CashALL Caller Desk Update Available",
        releaseNotes: "Company phone support desk call tagging and HD audio sync.",
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch app version" },
      { status: 500 }
    );
  }
}
