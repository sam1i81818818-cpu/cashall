import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { CUSTOMER_REVIEWS, CustomerReview } from "@/lib/data/reviewsData";

export const revalidate = 3600; // Edge cached for 1 hour

export async function GET(req: NextRequest) {
  try {
    let dbReviews: any[] = [];
    try {
      dbReviews = await prisma.review.findMany({
        orderBy: { createdAt: "desc" },
        take: 100,
      });
    } catch (e) {
      console.warn("Could not fetch DB reviews:", e);
    }

    const mappedDbReviews: CustomerReview[] = dbReviews.map((r) => ({
      id: r.id,
      customerName: r.name,
      phone: r.phone ? `${r.phone.slice(0, 5)}*****` : undefined,
      location: r.location || "West Bengal",
      deviceSold: r.deviceModel || "Mobile Device",
      payoutAmount: r.payout || 0,
      payoutMethod: r.payout ? "Instant UPI" : "UPI / Bank Transfer",
      rating: r.rating || 5,
      reviewTitle: r.headline || "Great Selling Experience",
      reviewText: r.comment,
      date: "Recent",
      verified: Boolean(r.verified),
      payoutSpeed: r.verified ? "Verified Customer" : "Customer Review",
      deviceCategory: (r.deviceModel || "").toLowerCase().includes("laptop") || (r.deviceModel || "").toLowerCase().includes("macbook")
        ? "LAPTOP"
        : (r.deviceModel || "").toLowerCase().includes("ipad") || (r.deviceModel || "").toLowerCase().includes("tablet")
        ? "TABLET"
        : "MOBILE",
      helpfulCount: r.helpfulCount || 0,
    }));

    // Merge new DB reviews at the top, followed by existing verified reviews
    const allReviews = [...mappedDbReviews, ...CUSTOMER_REVIEWS];

    return NextResponse.json(
      {
        success: true,
        reviews: allReviews,
        totalCount: allReviews.length,
      },
      { headers: { "Cache-Control": "public, s-maxage=600, stale-while-revalidate=3600" } }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to load reviews" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      customerName,
      phone,
      rating = 5,
      reviewTitle,
      reviewText,
      deviceSold,
      location = "Kolkata, West Bengal",
    } = body;

    const name = String(customerName || "").trim();
    const comment = String(reviewText || "").trim();

    if (!name || name.length < 2) {
      return NextResponse.json(
        { success: false, error: "Please enter your name (at least 2 characters)." },
        { status: 400 }
      );
    }

    if (!comment || comment.length < 5) {
      return NextResponse.json(
        { success: false, error: "Please write a review comment (at least 5 characters)." },
        { status: 400 }
      );
    }

    const cleanRating = Math.max(1, Math.min(5, Number(rating) || 5));
    const cleanPhone = phone ? String(phone).replace(/\D/g, "").slice(-10) : null;

    // Check if reviewer has a completed order to mark verified
    let isVerified = false;
    let verifiedPayout: number | null = null;
    if (cleanPhone) {
      try {
        const order = await prisma.order.findFirst({
          where: {
            user: { phone: { contains: cleanPhone } },
            status: "COMPLETED",
            deletedAt: null,
          },
          select: { finalPrice: true },
        });
        if (order) {
          isVerified = true;
          verifiedPayout = order.finalPrice || null;
        }
      } catch {}
    }

    const newReview = await prisma.review.create({
      data: {
        name,
        phone: cleanPhone,
        rating: cleanRating,
        headline: reviewTitle ? String(reviewTitle).trim() : null,
        comment,
        deviceModel: deviceSold ? String(deviceSold).trim() : "Mobile Device",
        location: location ? String(location).trim() : "West Bengal",
        verified: isVerified,
        payout: verifiedPayout,
        helpfulCount: 0,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Thank you! Your review has been submitted.",
      review: {
        id: newReview.id,
        customerName: newReview.name,
        phone: newReview.phone ? `${newReview.phone.slice(0, 5)}*****` : undefined,
        location: newReview.location || "West Bengal",
        deviceSold: newReview.deviceModel || "Mobile Device",
        payoutAmount: verifiedPayout || undefined,
        payoutMethod: verifiedPayout ? "Instant UPI" : undefined,
        rating: newReview.rating,
        reviewTitle: newReview.headline || "Customer Review",
        reviewText: newReview.comment,
        date: "Just now",
        verified: isVerified,
        payoutSpeed: isVerified ? "Verified Customer" : "Customer Review",
        deviceCategory: "MOBILE",
        helpfulCount: 0,
      },
    });
  } catch (error: any) {
    console.error("Error creating review:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to submit review." },
      { status: 500 }
    );
  }
}
