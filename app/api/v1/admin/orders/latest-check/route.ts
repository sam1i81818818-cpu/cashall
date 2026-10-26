import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { verifyAuthToken, requireRole } from "@/lib/middlewares/auth";
import { formatPickupDateDisplay } from "@/lib/utils/pickup-date";

export const dynamic = "force-dynamic";

interface LatestCheckCache {
  data: any;
  timestamp: number;
}

let latestOrderCache: LatestCheckCache | null = null;
const LATEST_CHECK_CACHE_TTL = 60000; // 60 seconds

const TEST_PHONE_BLACKLIST = new Set([
  "7604092333",
  "6289477287",
  "9999999999",
  "1234567890",
  "8888888888",
  "7777777777",
  "0000000000",
  "1111111111",
]);

const TEST_NAME_KEYWORDS = ["test", "fake", "demo", "sample", "dummy"];

function checkIsRealOrder(customerPhone: string, customerName: string, orderNumber: string): boolean {
  const cleanPhone = (customerPhone || "").replace(/\D/g, "").slice(-10);
  if (TEST_PHONE_BLACKLIST.has(cleanPhone)) {
    return false;
  }
  const cleanName = (customerName || "").toLowerCase().trim();
  for (const kw of TEST_NAME_KEYWORDS) {
    if (cleanName.includes(kw)) {
      return false;
    }
  }
  if (orderNumber.toUpperCase().includes("TEST")) {
    return false;
  }
  return true;
}

export async function GET(req: NextRequest) {
  try {
    let isAuthenticatedAdmin = false;
    try {
      const user = await verifyAuthToken(req);
      requireRole(["ADMIN", "SUPER_ADMIN", "MANAGER"], user.role);
      isAuthenticatedAdmin = true;
    } catch {
      // If unauthenticated or token expired, return 200 with success: false
      // so Vercel Edge CDN caches this response and completely eliminates 401 polling storms
      return NextResponse.json(
        { success: false, error: "Authentication required", order: null },
        {
          status: 200,
          headers: {
            "Cache-Control": "public, s-maxage=300, max-age=300, stale-while-revalidate=600",
          },
        }
      );
    }

    // Fast in-memory cache check to eliminate Supabase egress on repeated admin polls
    if (latestOrderCache && Date.now() - latestOrderCache.timestamp < LATEST_CHECK_CACHE_TTL) {
      return NextResponse.json(latestOrderCache.data, {
        headers: {
          "Cache-Control": "public, s-maxage=60, stale-while-revalidate=120",
          "X-Cache": "HIT",
        },
      });
    }

    const latestOrder = await prisma.order.findFirst({
      where: {
        deletedAt: null,
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 1,
      select: {
        id: true,
        orderNumber: true,
        status: true,
        createdAt: true,
        pickupDate: true,
        pickupTimeSlot: true,
        finalPrice: true,
        user: {
          select: {
            name: true,
            phone: true,
            email: true,
          },
        },
        address: {
          select: {
            street: true,
            city: true,
            state: true,
            pincode: true,
          },
        },
        quote: {
          select: {
            estimatedPrice: true,
            variant: {
              select: {
                ram: true,
                storage: true,
                model: {
                  select: {
                    name: true,
                    brand: {
                      select: {
                        name: true,
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!latestOrder) {
      const emptyRes = { success: true, order: null };
      return NextResponse.json(emptyRes, {
        headers: {
          "Cache-Control": "public, s-maxage=10, stale-while-revalidate=20",
        },
      });
    }

    const customerPhone = latestOrder.user?.phone || "";
    const customerName = latestOrder.user?.name || "Customer";
    const brandName = latestOrder.quote?.variant?.model?.brand?.name || "";
    const modelName = latestOrder.quote?.variant?.model?.name || "";
    const ram = latestOrder.quote?.variant?.ram || "";
    const storage = latestOrder.quote?.variant?.storage || "";
    const deviceName = `${brandName} ${modelName} ${ram ? `${ram}/` : ""}${storage}`.trim() || "Mobile Device";

    const fullAddress = [
      latestOrder.address?.street,
      latestOrder.address?.city,
      latestOrder.address?.state,
      latestOrder.address?.pincode,
    ].filter(Boolean).join(", ");

    const isRealOrder = checkIsRealOrder(customerPhone, customerName, latestOrder.orderNumber);

    const responseData = {
      success: true,
      order: {
        id: latestOrder.id,
        orderNumber: latestOrder.orderNumber,
        status: latestOrder.status,
        createdAt: latestOrder.createdAt,
        pickupDate: formatPickupDateDisplay(latestOrder.pickupDate, latestOrder.createdAt),
        pickupTimeSlot: latestOrder.pickupTimeSlot || "10 AM - 1 PM",
        quotedPrice: latestOrder.quote?.estimatedPrice || latestOrder.finalPrice || 0,
        customerName,
        customerPhone,
        customerEmail: latestOrder.user?.email || null,
        deviceName,
        location: fullAddress || "Doorstep Address Not Specified",
        pincode: latestOrder.address?.pincode || "",
        isRealOrder,
      },
    };

    latestOrderCache = {
      data: responseData,
      timestamp: Date.now(),
    };

    return NextResponse.json(responseData, {
      headers: {
        "Cache-Control": "public, s-maxage=60, stale-while-revalidate=120",
        "X-Cache": "MISS",
      },
    });
  } catch (error: any) {
    console.error("Latest order check error:", error);
    const status = error.statusCode || 500;
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch latest order" },
      {
        status,
        headers: {
          // Block unauthenticated background loops at Edge CDN for 5 minutes
          "Cache-Control": "public, s-maxage=300, max-age=300, stale-while-revalidate=600",
        },
      }
    );
  }
}
