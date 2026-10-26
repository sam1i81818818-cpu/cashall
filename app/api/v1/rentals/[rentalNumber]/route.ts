import { NextRequest, NextResponse } from "next/server";
import { getRentalByNumber, updateRental } from "@/lib/rentals-store";

export const dynamic = "force-dynamic";

export async function GET(
  req: NextRequest,
  { params }: { params: { rentalNumber: string } }
) {
  try {
    const { rentalNumber } = params;
    const rental = await getRentalByNumber(rentalNumber);

    if (!rental) {
      return NextResponse.json({ success: false, error: "Rental not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, rental });
  } catch (err: any) {
    console.error("GET /api/v1/rentals/[rentalNumber] error:", err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { rentalNumber: string } }
) {
  try {
    const { rentalNumber } = params;
    const body = await req.json();
    const rental = await getRentalByNumber(rentalNumber);

    if (!rental) {
      return NextResponse.json({ success: false, error: "Rental not found" }, { status: 404 });
    }

    const { action } = body;

    // 1. EXTEND PLAN ACTION
    if (action === "extend") {
      const additionalDays = Math.max(1, parseInt(String(body.additionalDays), 10) || 1);
      const newExtendedDays = (rental.extendedDays || 0) + additionalDays;
      const combinedDays = rental.totalDays + newExtendedDays;

      // Calculate new end date
      const start = new Date(rental.startDate);
      const end = new Date(start);
      end.setDate(end.getDate() + combinedDays);
      const newEndDate = end.toISOString().split("T")[0];

      // Add to total amount: additionalDays * effectiveDailyCost
      const extraCDs = rental.rentalPackage === "CONSOLE_CD" ? Math.max(0, (rental.cdCount || 0) - 1) : 0;
      const effectiveDailyCost = rental.rentalPackage === "CONSOLE_CD"
        ? (499 + extraCDs * 100)
        : (rental.rentalPackage === "CONSOLE_DIGITAL_ID" ? 599 : (rental.dailyRate || 399));
      const addedCost = additionalDays * effectiveDailyCost;
      const newTotal = rental.totalAmount + addedCost;

      const updated = await updateRental(rentalNumber, {
        extendedDays: newExtendedDays,
        endDate: newEndDate,
        totalAmount: newTotal,
        rentalStatus: rental.rentalStatus === "BOOKED" ? "BOOKED" : "EXTENDED",
      });

      return NextResponse.json({
        success: true,
        rental: updated,
        message: `Rental plan extended by ${additionalDays} day(s)! Added ₹${addedCost}.`,
      });
    }

    // 2. DIGITAL HANDOVER & INSPECTION SIGN-OFF ACTION
    if (action === "inspection") {
      const {
        consoleSerialNumber,
        controller1SerialNumber,
        controller2SerialNumber,
        accessoriesDelivered,
        inspectionChecklist,
        customerSignature,
        agentSignature,
        preDeliveryVideoUrl,
        assignedAgentName,
        paymentStatus,
      } = body;

      const updated = await updateRental(rentalNumber, {
        consoleSerialNumber,
        controller1SerialNumber,
        controller2SerialNumber,
        accessoriesDelivered,
        inspectionChecklist,
        customerSignature,
        agentSignature,
        signedAt: new Date().toISOString(),
        preDeliveryVideoUrl: preDeliveryVideoUrl || rental.preDeliveryVideoUrl,
        assignedAgentName: assignedAgentName || rental.assignedAgentName,
        rentalStatus: "ACTIVE",
        paymentStatus: paymentStatus || "PAID",
      });

      return NextResponse.json({
        success: true,
        rental: updated,
        message: "Digital Handover Inspection & Undertaking signed successfully!",
      });
    }

    // 3. RETURN INSPECTION & DAMAGE CLAIM ACTION
    if (action === "return_inspection") {
      const { returnVideoUrl, reportedDefects, repairCost, rentalStatus } = body;

      const updated = await updateRental(rentalNumber, {
        returnVideoUrl,
        reportedDefects,
        repairCost: Number(repairCost) || 0,
        rentalStatus: rentalStatus || "COMPLETED",
      });

      return NextResponse.json({
        success: true,
        rental: updated,
        message: "Return inspection and video recording updated.",
      });
    }

    // 4. GENERAL ADMIN UPDATE
    const updated = await updateRental(rentalNumber, body);
    return NextResponse.json({
      success: true,
      rental: updated,
      message: "Rental updated successfully.",
    });
  } catch (err: any) {
    console.error("PATCH /api/v1/rentals/[rentalNumber] error:", err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
