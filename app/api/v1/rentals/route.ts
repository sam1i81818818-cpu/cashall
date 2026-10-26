import { NextRequest, NextResponse } from "next/server";
import { getAllRentals, createRental, Ps5Rental } from "@/lib/rentals-store";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");
    const phone = searchParams.get("phone");
    const query = searchParams.get("query");

    let rentals = await getAllRentals();

    if (status && status !== "ALL") {
      rentals = rentals.filter((r) => r.rentalStatus.toUpperCase() === status.toUpperCase());
    }

    if (phone) {
      rentals = rentals.filter((r) => r.customerPhone.includes(phone));
    }

    if (query) {
      const q = query.toLowerCase().trim();
      rentals = rentals.filter(
        (r) =>
          r.rentalNumber.toLowerCase().includes(q) ||
          r.customerName.toLowerCase().includes(q) ||
          r.customerPhone.includes(q) ||
          r.pincode.includes(q)
      );
    }

    return NextResponse.json({
      success: true,
      count: rentals.length,
      rentals,
    });
  } catch (err: any) {
    console.error("GET /api/v1/rentals error:", err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const {
      customerName,
      customerPhone,
      customerEmail,
      deliveryAddress,
      pincode,
      govtIdType,
      govtIdNumber,
      consoleModel = "PS5 Disc Edition",
      rentalPackage = "CONSOLE_ONLY",
      startDate,
      totalDays = 1,
      cdCount = 0,
      selectedGames = [],
      extraControllers = false,
    } = body;

    if (!customerName || !customerPhone || !deliveryAddress || !pincode || !startDate) {
      return NextResponse.json(
        { success: false, error: "Missing required fields: name, phone, address, pincode, startDate" },
        { status: 400 }
      );
    }

    const days = Math.max(1, parseInt(String(totalDays), 10) || 1);

    // Calculate end date based on start date + totalDays
    const start = new Date(startDate);
    const end = new Date(start);
    end.setDate(end.getDate() + days);
    const endDate = end.toISOString().split("T")[0];

    // Pricing Rules (3 Tiers):
    // 1. CONSOLE_ONLY: ₹399/day (No CD, No Digital ID)
    // 2. CONSOLE_CD: ₹499/day (1st Game CD included free, extra CDs at ₹100/day each)
    // 3. CONSOLE_DIGITAL_ID: ₹599/day (100+ Games Digital Library Access with login credentials)
    let dailyRate = 399;
    let effectivePackage = rentalPackage;
    let cds = 0;
    let games: string[] = [];
    let cdRate = 0;

    if (rentalPackage === "CONSOLE_CD" || (!rentalPackage && selectedGames.length > 0)) {
      effectivePackage = "CONSOLE_CD";
      cds = Math.max(1, selectedGames.length || parseInt(String(cdCount), 10) || 1);
      games = selectedGames;
      const extraCDs = Math.max(0, cds - 1);
      cdRate = extraCDs > 0 ? 100 : 0;
      dailyRate = 499 + (extraCDs * 100);
    } else if (rentalPackage === "CONSOLE_DIGITAL_ID") {
      effectivePackage = "CONSOLE_DIGITAL_ID";
      dailyRate = 599;
      cds = 0;
      games = [];
      cdRate = 0;
    } else {
      effectivePackage = "CONSOLE_ONLY";
      dailyRate = 399;
      cds = 0;
      games = [];
      cdRate = 0;
    }

    const totalAmount = days * dailyRate;

    // Generate unique Rental Number: e.g. PS5-R10482
    const randomNum = Math.floor(10000 + Math.random() * 90000);
    const rentalNumber = `PS5-R${randomNum}`;

    const newRental = await createRental({
      rentalNumber,
      customerName: customerName.trim(),
      customerPhone: customerPhone.trim(),
      customerEmail: customerEmail?.trim(),
      deliveryAddress: deliveryAddress.trim(),
      pincode: pincode.trim(),
      govtIdType: govtIdType || "Aadhaar Card",
      govtIdNumber: govtIdNumber?.trim() || "",
      consoleModel,
      rentalPackage: effectivePackage as any,
      startDate,
      endDate,
      totalDays: days,
      extendedDays: 0,
      dailyRate,
      cdCount: cds,
      cdRate,
      selectedGames: games,
      extraControllers: Boolean(extraControllers),
      totalAmount,
      paymentStatus: "PENDING_ON_DELIVERY",
      rentalStatus: "BOOKED",
      reportedDefects: "",
      repairCost: 0,
    });

    return NextResponse.json({
      success: true,
      rental: newRental,
      message: "PS5 Rental successfully booked!",
    });
  } catch (err: any) {
    console.error("POST /api/v1/rentals error:", err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
