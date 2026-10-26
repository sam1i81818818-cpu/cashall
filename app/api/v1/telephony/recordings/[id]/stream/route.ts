import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { verifySessionToken } from "@/lib/auth/session-token";
import { exotelService } from "@/lib/services/exotel.service";
import https from "https";

export const dynamic = "force-dynamic";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const authHeader = req.headers.get("authorization") || "";
    const cookieToken = req.cookies.get("session_token")?.value || "";
    const token = authHeader.replace(/^Bearer\s+/i, "") || cookieToken;

    const session = verifySessionToken(token);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { role, uid } = session;
    const allowedRoles = ["ADMIN", "SUPER_ADMIN", "EMPLOYEE", "AGENT"];
    if (!allowedRoles.includes(role)) {
      return NextResponse.json({ error: "Forbidden: Recording playback denied" }, { status: 403 });
    }

    const callId = params.id;
    const call = await prisma.telephonyCall.findUnique({
      where: { id: callId },
    });

    if (!call || !call.recordingUrl) {
      return NextResponse.json({ error: "Recording not found or not available" }, { status: 404 });
    }

    // Agent access restriction: Agents can only listen to calls they participated in
    if (role === "AGENT") {
      const isParticipant = call.agentId === uid || call.initiatorUserId === uid;
      if (!isParticipant) {
        return NextResponse.json(
          { error: "Access denied: You can only listen to recordings of your own calls" },
          { status: 403 }
        );
      }
    }

    // Stream the audio via Exotel Service
    return new Promise<NextResponse>((resolve) => {
      exotelService.streamRecording(
        call.recordingUrl!,
        (stream) => {
          const contentType = stream.headers["content-type"] || "audio/wav";
          const contentLength = stream.headers["content-length"];

          const responseHeaders: Record<string, string> = {
            "Content-Type": contentType,
            "Cache-Control": "private, max-age=3600",
            "Accept-Ranges": "bytes",
          };

          if (contentLength) {
            responseHeaders["Content-Length"] = contentLength;
          }

          // Convert Node stream to Web ReadableStream
          const webStream = new ReadableStream({
            start(controller) {
              stream.on("data", (chunk: any) => controller.enqueue(chunk));
              stream.on("end", () => controller.close());
              stream.on("error", (err: any) => controller.error(err));
            },
          });


          resolve(
            new NextResponse(webStream, {
              status: 200,
              headers: responseHeaders,
            })
          );
        },
        (err) => {
          console.error("[Recording Stream Error]:", err);
          resolve(
            NextResponse.json(
              { error: `Recording playback error: ${err.message}` },
              { status: 502 }
            )
          );
        }
      );
    });
  } catch (error: any) {
    console.error("[Recording Stream Exception]:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
