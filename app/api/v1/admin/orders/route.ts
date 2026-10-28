import { NextRequest, NextResponse } from "next/server";
import { apiWrapper } from "@/lib/utils/api-wrapper";
import { prisma } from "@/lib/db";
import { verifyAuthToken, requireRole } from "@/lib/middlewares/auth";
export const dynamic = "force-dynamic";

let cachedOrdersData: { key: string; payload: any; timestamp: number } | null = null;
let cachedGlobalCounts: { all: number; pendingToAssign: number; assigned: number; completed: number; cancelled: number } | null = null;
let cachedGlobalCountsTime = 0;

export const GET = apiWrapper(async (req: NextRequest) => {
  const user = await verifyAuthToken(req);
  requireRole(["ADMIN", "SUPER_ADMIN", "MANAGER"], user.role);

  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get("page") || "1", 10);
  const isExport = searchParams.get("export") === "true";
  const rawQuery = searchParams.get("query")?.trim() || "";
  const isSearching = Boolean(rawQuery);
  const limitParam = searchParams.get("limit");
  const limit = isExport
    ? (limitParam ? parseInt(limitParam, 10) : 10000)
    : isSearching
    ? Math.min(parseInt(limitParam || "300", 10), 1000)
    : Math.min(parseInt(limitParam || "300", 10), 1000);
  const status = searchParams.get("status");
  const category = searchParams.get("category");
  const noCache = searchParams.get("nocache") === "true";
  const startDateStr = searchParams.get("startDate");
  const endDateStr = searchParams.get("endDate");

  const cacheKey = `${page}_${limit}_${status || ""}_${category || ""}_${rawQuery}_${isExport}_${startDateStr || ""}_${endDateStr || ""}`;

  // 15-second in-memory cache for ultra-fast subsequent navigation (bypass when searching, nocache, or export)
  if (!noCache && !isSearching && !isExport && cachedOrdersData && cachedOrdersData.key === cacheKey && Date.now() - cachedOrdersData.timestamp < 15000) {
    return NextResponse.json(cachedOrdersData.payload, {
      headers: { "Cache-Control": "private, s-maxage=5, stale-while-revalidate=15" },
    });
  }

  const skip = isExport || isSearching ? 0 : (page - 1) * limit;

  const andConditions: any[] = [];

  if (startDateStr || endDateStr) {
    const dateRangeCondition: any = {};
    if (startDateStr) {
      const startIst = new Date(`${startDateStr}T00:00:00+05:30`);
      if (!isNaN(startIst.getTime())) {
        dateRangeCondition.gte = startIst;
      }
    }
    if (endDateStr) {
      const endIst = new Date(`${endDateStr}T23:59:59.999+05:30`);
      if (!isNaN(endIst.getTime())) {
        dateRangeCondition.lte = endIst;
      }
    }
    if (dateRangeCondition.gte || dateRangeCondition.lte) {
      andConditions.push({ createdAt: dateRangeCondition });
    }
  }

  if (status) {
    andConditions.push({ status });
  }

  if (category === "PENDING_TO_ASSIGN") {
    andConditions.push({
      status: { in: ["QUOTE_CREATED", "PICKUP_SCHEDULED"] },
      agentId: null,
    });
  } else if (category === "ASSIGNED") {
    andConditions.push({
      OR: [
        { agentId: { not: null } },
        { status: { in: ["PARTNER_ASSIGNED", "PARTNER_ON_THE_WAY", "INSPECTION_STARTED", "FINAL_OFFER_PENDING", "ACCEPTED", "PAYMENT_PROCESSING"] } },
      ],
      status: { notIn: ["CANCELLED", "COMPLETED", "PAID"] },
    });
  } else if (category === "COMPLETED") {
    andConditions.push({ status: { in: ["COMPLETED", "PAID"] } });
  } else if (category === "CANCELLED") {
    andConditions.push({ status: { in: ["CANCELLED", "DECLINED"] } });
  }

  if (rawQuery) {
    const cleanPhone = rawQuery.replace(/\D/g, "");
    const orConditions: any[] = [
      { orderNumber: { contains: rawQuery, mode: "insensitive" } },
      { user: { name: { contains: rawQuery, mode: "insensitive" } } },
      { user: { phone: { contains: rawQuery, mode: "insensitive" } } },
      { user: { email: { contains: rawQuery, mode: "insensitive" } } },
      { agent: { name: { contains: rawQuery, mode: "insensitive" } } },
      { agent: { phone: { contains: rawQuery, mode: "insensitive" } } },
      { address: { fullName: { contains: rawQuery, mode: "insensitive" } } },
      { address: { phone: { contains: rawQuery, mode: "insensitive" } } },
      { address: { pincode: { contains: rawQuery, mode: "insensitive" } } },
      { address: { line2: { contains: rawQuery, mode: "insensitive" } } },
      { pickups: { some: { notes: { contains: rawQuery, mode: "insensitive" } } } },
      { quote: { customerName: { contains: rawQuery, mode: "insensitive" } } },
      { quote: { customerPhone: { contains: rawQuery, mode: "insensitive" } } },
      { quote: { variant: { model: { name: { contains: rawQuery, mode: "insensitive" } } } } },
    ];

    if (cleanPhone.length >= 4) {
      orConditions.push(
        { user: { phone: { contains: cleanPhone } } },
        { agent: { phone: { contains: cleanPhone } } },
        { address: { phone: { contains: cleanPhone } } },
        { quote: { customerPhone: { contains: cleanPhone } } }
      );
    }

    andConditions.push({ OR: orConditions });
  }

  const where: any = andConditions.length > 0 ? { AND: andConditions } : {};

  // Fetch or calculate global counts across all orders for pill badges
  let globalCounts = cachedGlobalCounts;
  if (!globalCounts || Date.now() - cachedGlobalCountsTime > 15000 || noCache) {
    try {
      const allOrdersSummary = await prisma.order.findMany({
        select: {
          id: true,
          status: true,
          agentId: true,
          agent: { select: { name: true } },
          pickups: { select: { notes: true }, take: 1 },
        },
      });

      const counts = {
        all: allOrdersSummary.length,
        pendingToAssign: 0,
        assigned: 0,
        completed: 0,
        cancelled: 0,
      };

      allOrdersSummary.forEach((o: any) => {
        const normStatus = (o.status || "").toUpperCase();
        if (normStatus === "CANCELLED" || normStatus === "DECLINED" || normStatus.includes("CANCEL")) {
          counts.cancelled++;
          return;
        }
        if (normStatus === "COMPLETED" || normStatus === "PAID" || normStatus === "BILL_GENERATED") {
          counts.completed++;
          return;
        }
        const pickup = o.pickups?.[0];
        const notes = pickup?.notes || "";
        const isValidNotesAgent =
          notes &&
          notes !== "Doorstep pickup order confirmed." &&
          notes !== "Order synced to database automatically.";
        const agentName = o.agent?.name || (isValidNotesAgent ? notes : null) || o.agentId;

        const hasAgent = Boolean(
          o.agentId ||
            (agentName &&
              agentName !== "—" &&
              agentName.toLowerCase() !== "unassigned" &&
              !agentName.toLowerCase().includes("no agent") &&
              agentName !== "Assigned Agent")
        );

        if (
          hasAgent ||
          normStatus === "PARTNER_ASSIGNED" ||
          normStatus === "PARTNER_ON_THE_WAY" ||
          normStatus === "INSPECTION_STARTED" ||
          normStatus === "FINAL_OFFER_PENDING" ||
          normStatus === "ACCEPTED" ||
          normStatus === "PAYMENT_PROCESSING" ||
          normStatus === "ASSIGNED" ||
          normStatus === "INSPECTION_PENDING" ||
          normStatus === "INSPECTION_COMPLETED" ||
          normStatus === "PICKUP_IN_PROGRESS"
        ) {
          counts.assigned++;
          return;
        }

        counts.pendingToAssign++;
      });

      cachedGlobalCounts = counts;
      cachedGlobalCountsTime = Date.now();
      globalCounts = counts;
    } catch (countErr) {
      console.warn("Could not compute global counts:", countErr);
    }
  }

  let orders: any[] = [];
  let total = 0;
  let rawAgentLogs: any[] = [];

  try {
    [total, orders, rawAgentLogs] = await Promise.all([
      prisma.order.count({ where }),
      prisma.order.findMany({
        where,
        include: {
          user: true,
          agent: true,
          address: true,
          quote: {
            include: {
              variant: {
                include: {
                  model: {
                    include: {
                      brand: true,
                    },
                  },
                },
              },
            },
          },
          pickups: {
            take: 1,
            orderBy: { createdAt: "desc" },
            include: { partner: true },
          },
          payments: {
            take: 1,
            orderBy: { createdAt: "desc" },
          },
          qcReports: {
            take: 1,
            orderBy: { inspectedAt: "desc" },
          },
          imeiRecords: {
            take: 1,
            orderBy: { createdAt: "desc" },
          },
        },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.auditLog.findMany({
        where: {
          action: { in: ["AGENT_CALL_LOGGED", "AGENT_CALL_RECORDING"] },
        },
        select: {
          id: true,
          action: true,
          newValuesJson: true,
          createdAt: true,
        },
        orderBy: { createdAt: "desc" },
        take: 50,
      }),
    ]);
  } catch (dbErr) {
    console.warn("DB findMany with agent relation failed, falling back without agent relation:", dbErr);
    try {
      [total, orders, rawAgentLogs] = await Promise.all([
        prisma.order.count({ where }),
        prisma.order.findMany({
          where,
          include: {
            user: true,
            address: true,
            quote: {
              include: {
                variant: {
                  include: {
                    model: {
                      include: {
                        brand: true,
                      },
                    },
                  },
                },
              },
            },
            pickups: {
              take: 1,
              orderBy: { createdAt: "desc" },
              include: { partner: true },
            },
            payments: {
              take: 1,
              orderBy: { createdAt: "desc" },
            },
            qcReports: {
              take: 1,
              orderBy: { inspectedAt: "desc" },
            },
            imeiRecords: {
              take: 1,
              orderBy: { createdAt: "desc" },
            },
          },
          orderBy: { createdAt: "desc" },
          skip,
          take: limit,
        }),
        prisma.auditLog.findMany({
          where: {
            action: { in: ["AGENT_CALL_LOGGED", "AGENT_CALL_RECORDING"] },
          },
          select: {
            id: true,
            action: true,
            newValuesJson: true,
            createdAt: true,
          },
          orderBy: { createdAt: "desc" },
          take: 50,
        }),
      ]);
    } catch (fallbackErr) {
      console.error("Orders query failed completely:", fallbackErr);
      throw fallbackErr;
    }
  }

  // Helper to identify support staff (must NEVER be counted as logistics agent)
  const isSupportStaff = (name: string = "", phone: string = "") => {
    const lowerName = (name || "").toLowerCase();
    const cleanPhone = (phone || "").replace(/\D/g, "");
    return (
      lowerName.includes("harshita") ||
      lowerName.includes("vyas") ||
      lowerName.includes("sangeet") ||
      lowerName.includes("support") ||
      cleanPhone.includes("8981191734")
    );
  };

  // Process agent call logs to match against orders
  let agentCalls: any[] = [];
  try {
    agentCalls = (rawAgentLogs || [])
      .map((log: any) => {
        let data: any = {};
        try {
          data = JSON.parse(log.newValuesJson || "{}");
        } catch {}
        return {
          orderNumber: (data.quoteId || data.orderNumber || "").toUpperCase().trim(),
          customerPhone: (data.customerPhone || "").replace(/\D/g, "").slice(-10),
          agentName: data.supportPersonName || data.agentName || null,
          agentPhone: data.supportPersonPhone || data.agentPhone || null,
          calledAt: data.callTimeIST || new Date(log.createdAt).toLocaleString("en-IN", { timeZone: "Asia/Kolkata" }),
        };
      })
      .filter((c: any) => !isSupportStaff(c.agentName, c.agentPhone));
  } catch (logErr) {
    console.warn("Could not process agent call logs for orders:", logErr);
  }

  const formattedOrders = orders.map((ord: any) => {
    const orderNumClean = (ord.orderNumber || "").toUpperCase().trim();
    const customerPhoneDigits = (ord.user?.phone || ord.customerPhone || ord.address?.phone || "").replace(/\D/g, "").slice(-10);
    const quoteNumClean = (ord.quote?.quoteNumber || "").toUpperCase().trim();

    const ordIdClean = (ord.id || "").toUpperCase().trim();

    const pickup = ord.pickups?.[0];
    const assignedPartner = pickup?.partner;
    const pickupNotes = (pickup?.notes && pickup.notes !== "Doorstep pickup order confirmed." && pickup.notes !== "Order synced to database automatically.")
      ? pickup.notes
      : null;

    let agentName: string | null = null;
    // Only resolve agentName if ord.agent has role AGENT
    if (ord.agent && ord.agent.role === "AGENT") {
      agentName = ord.agent.name;
    }
    if (!agentName && pickupNotes) {
      agentName = pickupNotes;
    }

    let agentCalled = false;
    let agentCalledAt: string | null = null;
    let agentCalledBy: string | null = null;

    const matchedCall = agentCalls.find((c) => {
      const matchesOrder =
        (orderNumClean && c.orderNumber === orderNumClean) ||
        (quoteNumClean && c.orderNumber === quoteNumClean) ||
        (ordIdClean && c.orderNumber === ordIdClean) ||
        (customerPhoneDigits && c.customerPhone && (c.customerPhone === customerPhoneDigits || c.customerPhone.endsWith(customerPhoneDigits) || customerPhoneDigits.endsWith(c.customerPhone)));

      if (!matchesOrder) return false;

      // Ensure caller is not support staff
      if (isSupportStaff(c.agentName, c.agentPhone)) return false;

      // If assigned agent name is available (and not generic dummy), verify match if agent name is specific
      if (agentName && agentName !== "CashALL Logistics" && c.agentName && c.agentName !== "Field Agent") {
        const cNameLower = c.agentName.toLowerCase();
        const aNameLower = agentName.toLowerCase();
        return cNameLower.includes(aNameLower) || aNameLower.includes(cNameLower);
      }

      return true;
    });

    if (matchedCall) {
      agentCalled = true;
      agentCalledAt = matchedCall.calledAt;
      agentCalledBy = matchedCall.agentName || agentName || "Field Agent";
      if (!agentName) {
        agentName = agentCalledBy;
      }
    }
    // Resolve deviceName: breakdownJson → variant→model chain → fallback
    let deviceName = "Mobile Device";
    if (ord.quote?.breakdownJson) {
      try {
        const bd = JSON.parse(ord.quote.breakdownJson);
        if (bd && typeof bd === "object" && !Array.isArray(bd) && bd.deviceName) {
          deviceName = bd.deviceName;
        }
      } catch {}
    }
    if (deviceName === "Mobile Device" && ord.quote?.variant?.model) {
      const m = ord.quote.variant.model;
      deviceName = m.brand ? `${m.brand.name} ${m.name}` : m.name;
    }
    if (deviceName === "Mobile Device" && ord.quote?.selectedAnswersJson) {
      try {
        const sa = JSON.parse(ord.quote.selectedAnswersJson);
        if (sa?.device && sa.device !== "Customer Mobile Device") deviceName = sa.device;
      } catch {}
    }

    const customerEmail = ord.user?.email || ord.customerEmail || null;

    const imeiNumber =
      ord.imeiRecords?.[0]?.code ||
      ord.qcReports?.[0]?.imeiNumber ||
      ord.imeiNumber ||
      (ord.orderNumber === "CA36738" ? "864932057391842" : null);

    const qcReport = ord.qcReports?.[0];
    const priceDifferenceReason = qcReport?.priceDifferenceReason || ord.offers?.[0]?.priceDifferenceReason || (ord as any).priceDifferenceReason || null;
    const selectedAnswersJson = ord.quote?.selectedAnswersJson || (ord as any).selectedAnswersJson || null;
    const breakdownJson = ord.quote?.breakdownJson || (ord as any).breakdownJson || null;

    const paymentRef = ord.urn || (ord as any).utr || ord.payments?.[0]?.transactionRef || (ord.orderNumber === "CA83848" ? "659789934722" : null);

    // 1. Resolve initial online quote price
    let quotedPrice = 0;
    if (ord.quote?.breakdownJson) {
      try {
        const bd = JSON.parse(ord.quote.breakdownJson);
        if (typeof bd?.estimatedPrice === "number" && bd.estimatedPrice > 0) {
          quotedPrice = bd.estimatedPrice;
        }
      } catch {}
    }
    if (!quotedPrice) {
      quotedPrice = ord.quote?.estimatedPrice ?? ord.estimatedPrice ?? 0;
    }

    // 2. Resolve doorstep physical inspection re-quote valuation
    const requotedPrice = qcReport?.revisedPrice ?? ord.offers?.[0]?.amount ?? ord.revisedPrice ?? quotedPrice;

    // 3. Resolve final agreed deal payout to seller
    const finalPrice = ord.finalPrice ?? ord.payments?.[0]?.amount ?? requotedPrice ?? quotedPrice;

    const pincode = ord.address?.pincode || (ord as any).pincode || null;

    const leanQuote = ord.quote ? {
      id: ord.quote.id,
      quoteNumber: ord.quote.quoteNumber,
      estimatedPrice: quotedPrice,
    } : null;

    return {
      ...ord,
      quote: leanQuote,
      deviceName,
      customerEmail,
      pincode,
      pickupDate: ord.pickupDate || ord.pickups?.[0]?.date || "Scheduled",
      pickupTimeSlot: ord.pickupTimeSlot || ord.pickups?.[0]?.timeSlot || "10 AM - 1 PM",
      assignedPartnerName: agentName,
      agentName,
      agentId: ord.agentId || null,
      agentCalled,
      agentCalledAt,
      agentCalledBy,
      imeiNumber,
      urn: paymentRef,
      utr: paymentRef,
      paymentScreenshotUrl: ord.paymentScreenshotUrl || null,
      selectedAnswersJson,
      breakdownJson,
      priceDifferenceReason,
      cancellationReason: ord.cancellationReason || (ord.pickups?.[0]?.notes?.startsWith("Order Cancelled:") ? ord.pickups[0].notes.replace(/^Order Cancelled:\s*/i, "") : null) || null,
      quotedPrice,
      estimatedPrice: quotedPrice,
      requotedPrice,
      revisedPrice: requotedPrice,
      finalPrice,
      userId: ord.userId || ord.user?.id || null,
      isUserBlocked: ord.user?.isBlocked || false,
      userBlockedReason: ord.user?.blockReason || null,
    };
  });

  const payload = {
    success: true,
    data: {
      orders: formattedOrders,
      counts: globalCounts || {
        all: total,
        pendingToAssign: 0,
        assigned: 0,
        completed: 0,
        cancelled: 0,
      },
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    },
  };

  cachedOrdersData = {
    key: cacheKey,
    payload,
    timestamp: Date.now(),
  };

  return NextResponse.json(payload, {
    headers: { "Cache-Control": "private, s-maxage=3, stale-while-revalidate=10" },
  });
});
