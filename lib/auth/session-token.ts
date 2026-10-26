import crypto from "crypto";

interface SessionPayload {
  uid: string;
  name?: string;
  email?: string;
  phone?: string;
  role: string;
  exp: number; // Expiry timestamp in seconds
  iat: number; // Issued at timestamp in seconds
}

function getSecretKey(): string {
  const secret =
    process.env.ADMIN_SECRET_KEY ||
    process.env.SUPABASE_JWT_SECRET ||
    process.env.NEXTAUTH_SECRET ||
    "";
  if (!secret) {
    if (process.env.NODE_ENV === "production") {
      console.error(
        "[SECURITY CRITICAL WARNING] ADMIN_SECRET_KEY or SUPABASE_JWT_SECRET is not set in environment."
      );
    }
    return "cashall_session_hmac_secret_key_v1_production_default";
  }
  return secret;
}

function base64UrlEncode(str: string): string {
  return Buffer.from(str)
    .toString("base64")
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");
}

function base64UrlDecode(str: string): string {
  let base64 = str.replace(/-/g, "+").replace(/_/g, "/");
  while (base64.length % 4) {
    base64 += "=";
  }
  return Buffer.from(base64, "base64").toString("utf8");
}

/**
 * Creates a cryptographically signed HMAC-SHA256 session token.
 */
export function signSessionToken(
  payload: { uid: string; name?: string; email?: string; phone?: string; role: string },
  expiresInSeconds: number = 7 * 24 * 60 * 60
): string {
  const now = Math.floor(Date.now() / 1000);
  const fullPayload: SessionPayload = {
    ...payload,
    iat: now,
    exp: now + expiresInSeconds,
  };

  const encodedPayload = base64UrlEncode(JSON.stringify(fullPayload));
  const secret = getSecretKey();
  const signature = crypto
    .createHmac("sha256", secret)
    .update(`v1.${encodedPayload}`)
    .digest("base64")
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");

  return `v1.${encodedPayload}.${signature}`;
}

/**
 * Verifies the cryptographic HMAC-SHA256 signature and validity of a session token.
 */
export function verifySessionToken(
  token: string
): { uid: string; name?: string; email?: string; phone?: string; role: string } | null {
  if (!token || typeof token !== "string") return null;

  const parts = token.split(".");
  if (parts.length !== 3 || parts[0] !== "v1") return null;

  const [version, encodedPayload, receivedSignature] = parts;
  const secret = getSecretKey();

  const expectedSignature = crypto
    .createHmac("sha256", secret)
    .update(`${version}.${encodedPayload}`)
    .digest("base64")
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");

  // Constant-time comparison to prevent timing attacks
  const receivedBuf = Buffer.from(receivedSignature);
  const expectedBuf = Buffer.from(expectedSignature);
  if (receivedBuf.length !== expectedBuf.length) return null;
  if (!crypto.timingSafeEqual(receivedBuf, expectedBuf)) return null;

  try {
    const jsonStr = base64UrlDecode(encodedPayload);
    const payload: SessionPayload = JSON.parse(jsonStr);

    const now = Math.floor(Date.now() / 1000);
    if (payload.exp && payload.exp < now) {
      return null; // Expired token
    }

    return {
      uid: payload.uid,
      name: payload.name,
      email: payload.email,
      phone: payload.phone,
      role: payload.role,
    };
  } catch {
    return null;
  }
}
