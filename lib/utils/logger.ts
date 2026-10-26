const SENSITIVE_KEY_PATTERNS = [
  /passw(or)?d/i,
  /secret/i,
  /token/i,
  /auth(orization)?/i,
  /api[_-]?key/i,
  /otp/i,
  /aadhaar/i,
  /pan/i,
  /signature/i,
  /account[_-]?num(ber)?/i,
  /ifsc/i,
  /vpa/i,
  /upi/i,
  /cvv/i,
];

function redactValue(key: string, value: any): any {
  if (value === null || value === undefined) return value;

  // Check key name
  if (SENSITIVE_KEY_PATTERNS.some((pattern) => pattern.test(key))) {
    if (typeof value === "string") {
      if (value.length <= 4) return "REDACTED";
      return `${value.slice(0, 2)}***[REDACTED]***${value.slice(-2)}`;
    }
    return "[REDACTED]";
  }

  // Check string values for sensitive formats
  if (typeof value === "string") {
    // 12-digit Aadhaar pattern
    if (/^\d{4}\s?\d{4}\s?\d{4}$/.test(value.trim())) {
      const clean = value.replace(/\s/g, "");
      return `XXXX-XXXX-${clean.slice(-4)}`;
    }
    // Bearer token
    if (value.startsWith("Bearer ") || value.startsWith("tok_") || value.startsWith("v1.")) {
      return "[TOKEN_REDACTED]";
    }
  }

  return value;
}

export function redactSensitiveData(data: any): any {
  if (!data) return data;
  if (typeof data !== "object") return data;

  if (Array.isArray(data)) {
    return data.map((item) => redactSensitiveData(item));
  }

  const sanitized: Record<string, any> = {};
  for (const [key, value] of Object.entries(data)) {
    if (value && typeof value === "object") {
      sanitized[key] = redactSensitiveData(value);
    } else {
      sanitized[key] = redactValue(key, value);
    }
  }
  return sanitized;
}

export const logger = {
  info(message: string, meta?: any, correlationId?: string) {
    console.log(
      JSON.stringify({
        level: "INFO",
        timestamp: new Date().toISOString(),
        service: "cashall-backend",
        correlationId: correlationId || meta?.correlationId || undefined,
        message,
        ...(meta ? redactSensitiveData(meta) : {}),
      })
    );
  },
  warn(message: string, meta?: any, correlationId?: string) {
    console.warn(
      JSON.stringify({
        level: "WARN",
        timestamp: new Date().toISOString(),
        service: "cashall-backend",
        correlationId: correlationId || meta?.correlationId || undefined,
        message,
        ...(meta ? redactSensitiveData(meta) : {}),
      })
    );
  },
  error(message: string, meta?: any, correlationId?: string) {
    console.error(
      JSON.stringify({
        level: "ERROR",
        timestamp: new Date().toISOString(),
        service: "cashall-backend",
        correlationId: correlationId || meta?.correlationId || undefined,
        message,
        ...(meta ? redactSensitiveData(meta) : {}),
      })
    );
  },
  adminAction(adminId: string, action: string, details?: any) {
    console.log(
      JSON.stringify({
        level: "INFO",
        type: "ADMIN_ACTION",
        timestamp: new Date().toISOString(),
        adminId,
        action,
        ...(details ? redactSensitiveData(details) : {}),
      })
    );
  },
  userAction(userId: string, action: string, details?: any) {
    console.log(
      JSON.stringify({
        level: "INFO",
        type: "USER_ACTION",
        timestamp: new Date().toISOString(),
        userId,
        action,
        ...(details ? redactSensitiveData(details) : {}),
      })
    );
  },
  email(to: string, subject: string, status: string, error?: string) {
    const maskedTo = to && to.includes("@") ? `${to.slice(0, 2)}***@${to.split("@")[1]}` : to;
    console.log(
      JSON.stringify({
        level: status === "SENT" ? "INFO" : "ERROR",
        type: "EMAIL",
        timestamp: new Date().toISOString(),
        to: maskedTo,
        subject,
        status,
        error,
      })
    );
  },
  auth(phone: string, event: string, success: boolean, details?: any) {
    const clean = (phone || "").replace(/\D/g, "").slice(-10);
    const maskedPhone = clean.length === 10 ? `${clean.slice(0, 2)}******${clean.slice(-2)}` : phone;
    console.log(
      JSON.stringify({
        level: success ? "INFO" : "WARN",
        type: "AUTH",
        timestamp: new Date().toISOString(),
        phone: maskedPhone,
        event,
        success,
        ...(details ? redactSensitiveData(details) : {}),
      })
    );
  },
};
