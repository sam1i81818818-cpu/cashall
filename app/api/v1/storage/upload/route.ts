import { NextRequest, NextResponse } from "next/server";
import { apiWrapper } from "@/lib/utils/api-wrapper";
import { verifyAuthToken } from "@/lib/middlewares/auth";
import { StorageService } from "@/lib/services/storage.service";
import { AppError } from "@/lib/utils/AppError";
import { prisma } from "@/lib/db";
import { v4 as uuidv4 } from "uuid";

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB

const ALLOWED_MIME_TYPES = new Set([
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
  "image/heic",
  "image/heif",
  "application/pdf",
]);

export const POST = apiWrapper(async (req: NextRequest) => {
  // Validate authorization
  const decodedUser = await verifyAuthToken(req);

  const formData = await req.formData();
  const file = formData.get("file") as File | null;
  const bucket = formData.get("bucket") as string | null; // e.g. "customer-devices", "qc-reports"
  const orderId = formData.get("orderId") as string | null;

  if (!file) {
    throw new AppError("No file uploaded.", 400);
  }
  if (!bucket) {
    throw new AppError("Storage bucket name is required.", 400);
  }

  if (file.size > MAX_FILE_SIZE) {
    throw new AppError("File size exceeds the 10MB limit.", 400);
  }

  const mimeType = (file.type || "").toLowerCase();
  if (!ALLOWED_MIME_TYPES.has(mimeType)) {
    throw new AppError("Invalid file type. Only JPEG, PNG, WebP, HEIC, and PDF documents are allowed.", 400);
  }

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  const rawExt = file.name.split(".").pop() || "bin";
  const fileExt = rawExt.replace(/[^a-zA-Z0-9]/g, "").toLowerCase();
  const uniqueId = uuidv4();
  const fileName = `${uniqueId}.${fileExt}`;
  const filePath = `${decodedUser.uid}/${fileName}`;

  // Upload file buffer
  const path = await StorageService.uploadFile(bucket, filePath, buffer, mimeType);

  // Generate signed URL (expires in 1 year)
  const signedUrl = await StorageService.getSignedUrl(bucket, path, 31536000);

  // If orderId is provided, save image reference in database
  if (orderId) {
    const order = await prisma.order.findUnique({
      where: { id: orderId },
    });

    if (order && (order.userId === decodedUser.uid || decodedUser.role === "ADMIN" || decodedUser.role === "SUPER_ADMIN")) {
      await prisma.imageReference.create({
        data: {
          url: signedUrl,
          bucket,
          key: path,
          entityType: bucket === "qc-reports" ? "QC_REPORT" : "ORDER",
          entityId: orderId,
        },
      });
    }
  }

  return NextResponse.json({
    success: true,
    data: {
      path,
      url: signedUrl,
    },
  });
});
