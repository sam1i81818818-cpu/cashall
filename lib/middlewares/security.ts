import { NextRequest, NextResponse } from "next/server";
import { AppError } from "../utils/AppError";

const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

// Periodic cleanup of stale rate-limit records every 2 minutes
setInterval(() => {
  const now = Date.now();
  for (const [ip, record] of rateLimitMap.entries()) {
    if (now > record.resetTime) {
      rateLimitMap.delete(ip);
    }
  }
}, 120000).unref?.();

export function rateLimiter(req: NextRequest, limit: number = 60, windowMs: number = 60000) {
  const forwarded = req.headers.get("x-forwarded-for");
  const ip = forwarded ? forwarded.split(",")[0].trim() : "127.0.0.1";
  const now = Date.now();

  const record = rateLimitMap.get(ip);
  if (!record) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + windowMs });
    return;
  }

  if (now > record.resetTime) {
    record.count = 1;
    record.resetTime = now + windowMs;
    return;
  }

  record.count++;
  if (record.count > limit) {
    throw new AppError("Too many requests, please try again later.", 429);
  }
}

const ALLOWED_ORIGINS = new Set([
  "https://www.cashall.in",
  "https://cashall.in",
  "http://localhost:3000",
  "http://127.0.0.1:3000",
]);

export function corsHeaders(response: NextResponse, req?: NextRequest) {
  const origin = req ? req.headers.get("origin") : null;

  if (origin && ALLOWED_ORIGINS.has(origin)) {
    response.headers.set("Access-Control-Allow-Origin", origin);
    response.headers.set("Access-Control-Allow-Credentials", "true");
  } else {
    response.headers.set("Access-Control-Allow-Origin", "https://www.cashall.in");
  }

  response.headers.set("Vary", "Origin");
  response.headers.set("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, OPTIONS");
  response.headers.set(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization, X-Requested-With, X-Correlation-ID"
  );
  return response;
}

export function securityHeaders(response: NextResponse) {
  response.headers.set("X-DNS-Prefetch-Control", "on");
  response.headers.set("X-Frame-Options", "SAMEORIGIN");
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set("X-XSS-Protection", "1; mode=block");
  response.headers.set(
    "Strict-Transport-Security",
    "max-age=63072000; includeSubDomains; preload"
  );
  response.headers.set(
    "Permissions-Policy",
    "camera=(self), microphone=(), geolocation=(self)"
  );
  return response;
}
