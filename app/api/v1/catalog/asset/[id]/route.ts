import { NextRequest, NextResponse } from "next/server";

export const revalidate = 31536000; // Cache on Edge for 1 year
export const runtime = "edge";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const id = params?.id;
  if (!id) {
    return new NextResponse("Asset ID required", { status: 400 });
  }

  const targetUrl = `https://s3ng.cashify.in/cashify/productLinePartVariation/img/xhdpi/${id}`;

  return NextResponse.redirect(targetUrl, {
    status: 301,
    headers: {
      "Cache-Control": "public, max-age=31536000, s-maxage=31536000, immutable",
    },
  });
}
