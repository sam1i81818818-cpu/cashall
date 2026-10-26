import crypto from "crypto";

/**
 * CashALL Centralized Meta Conversions API (CAPI) Client
 *
 * Sends server-side business events directly to Meta Graph API.
 * Uses SHA-256 for all PII hashing according to Meta's strict privacy rules.
 *
 * Environment variables:
 * - META_PIXEL_ID (default: 1249229847363732)
 * - META_CONVERSIONS_API_ACCESS_TOKEN (server-side secret)
 * - META_TEST_EVENT_CODE (optional for Meta Events Manager test console)
 */

const META_GRAPH_API_VERSION = process.env.META_GRAPH_API_VERSION || "v26.0";
const DEFAULT_PIXEL_ID = "1249229847363732";

export interface ServerUserData {
  email?: string | null;
  phone?: string | null;
  firstName?: string | null;
  lastName?: string | null;
  city?: string | null;
  state?: string | null;
  pincode?: string | null;
  clientIpAddress?: string | null;
  clientUserAgent?: string | null;
  fbp?: string | null;
  fbc?: string | null;
  leadId?: number | string | null;
  lead_id?: number | string | null;
  external_id?: string | null;
}

export interface ServerCustomData {
  currency?: string;
  value?: number;
  content_name?: string;
  content_category?: string;
  content_ids?: string[];
  content_type?: string;
  order_number?: string;
  pincode?: string;
  city?: string;
  pickup_date?: string;
  pickup_time_slot?: string;
  status?: string;
  event_source?: string;
  lead_event_source?: string;
  [key: string]: any;
}

export interface MetaServerEventOptions {
  eventName: string;
  eventId?: string;
  eventTime?: number;
  eventSourceUrl?: string;
  actionSource?: "website" | "system_generated" | "app" | "phone_call" | "chat" | "email" | "other";
  userData?: ServerUserData;
  customData?: ServerCustomData;
}

/**
 * Hash a string using SHA-256 according to Meta's formatting guidelines.
 */
function hashSha256(value: string): string {
  return crypto.createHash("sha256").update(value.trim().toLowerCase()).digest("hex");
}

/**
 * Normalize and hash phone number (E.164 without leading plus).
 * For 10-digit Indian numbers, prepends 91.
 */
function hashPhone(phone: string): string {
  let cleaned = phone.replace(/\D/g, "");
  if (cleaned.length === 10) {
    cleaned = `91${cleaned}`;
  }
  return crypto.createHash("sha256").update(cleaned).digest("hex");
}

/**
 * Build Meta user_data object with normalized, hashed parameters.
 */
function buildUserData(user: ServerUserData = {}) {
  const data: Record<string, any> = {};

  if (user.clientIpAddress) {
    data.client_ip_address = user.clientIpAddress;
  }
  if (user.clientUserAgent) {
    data.client_user_agent = user.clientUserAgent;
  }
  if (user.email && user.email.includes("@")) {
    data.em = [hashSha256(user.email)];
  }
  if (user.phone) {
    const cleaned = user.phone.replace(/\D/g, "");
    if (cleaned.length >= 10) {
      data.ph = [hashPhone(user.phone)];
    }
  }
  if (user.firstName) {
    data.fn = [hashSha256(user.firstName)];
  }
  if (user.lastName) {
    data.ln = [hashSha256(user.lastName)];
  }
  if (user.city) {
    data.ct = [hashSha256(user.city)];
  }
  if (user.state) {
    data.st = [hashSha256(user.state)];
  }
  if (user.pincode) {
    data.zp = [hashSha256(user.pincode)];
  }
  if (user.fbp) {
    data.fbp = user.fbp;
  }
  if (user.fbc) {
    data.fbc = user.fbc;
  }
  const lId = user.lead_id || user.leadId;
  if (lId) {
    const num = Number(lId);
    data.lead_id = !isNaN(num) && num > 0 ? num : lId;
  }
  if (user.external_id) {
    data.external_id = [hashSha256(user.external_id)];
  }

  return data;
}

/**
 * Dispatch an event to Meta Conversions API.
 * Never throws an error or interrupts the calling business logic.
 */
export async function sendMetaServerEvent(
  options: MetaServerEventOptions
): Promise<{ success: boolean; data?: any; error?: string }> {
  const pixelId = process.env.META_PIXEL_ID || DEFAULT_PIXEL_ID;
  const accessToken = process.env.META_CONVERSIONS_API_ACCESS_TOKEN;

  if (!accessToken) {
    if (process.env.NODE_ENV === "development") {
      console.warn(
        "[MetaCAPI] META_CONVERSIONS_API_ACCESS_TOKEN is not configured. Server event dropped:",
        options.eventName
      );
    }
    return { success: false, error: "Missing META_CONVERSIONS_API_ACCESS_TOKEN" };
  }

  const endpoint = `https://graph.facebook.com/${META_GRAPH_API_VERSION}/${pixelId}/events`;

  const payloadData: Record<string, any> = {
    event_name: options.eventName,
    event_time: options.eventTime || Math.floor(Date.now() / 1000),
    action_source: options.actionSource || "system_generated",
    user_data: buildUserData(options.userData),
    custom_data: {
      event_source: "crm",
      lead_event_source: "CashALL CRM",
      ...(options.customData || {}),
    },
  };

  if (options.eventId) {
    payloadData.event_id = options.eventId;
  }
  if (options.eventSourceUrl) {
    payloadData.event_source_url = options.eventSourceUrl;
  }

  const requestBody: Record<string, any> = {
    data: [payloadData],
  };

  // Support Meta Events Manager Test Events Tab
  const testCode = process.env.META_TEST_EVENT_CODE;
  if (testCode) {
    requestBody.test_event_code = testCode;
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 6000);

    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(requestBody),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    const result = await response.json().catch(() => ({}));

    if (!response.ok) {
      console.error("[MetaCAPI] Meta Graph API error:", {
        status: response.status,
        result,
        eventName: options.eventName,
        eventId: options.eventId,
      });
      return { success: false, error: result?.error?.message || `HTTP ${response.status}` };
    }

    if (process.env.NODE_ENV === "development") {
      console.log(
        `%c[MetaCAPI] Delivered: ${options.eventName}`,
        "color: #10b981; font-weight: bold;",
        { eventId: options.eventId, eventsReceived: result?.events_received }
      );
    }

    return { success: true, data: result };
  } catch (error: any) {
    console.error("[MetaCAPI] Network / Dispatch error:", error?.message || error);
    return { success: false, error: error?.message || "Unknown CAPI error" };
  }
}

/**
 * Helper to extract client IP and User Agent from NextRequest headers and cookies.
 */
export function extractClientMetadata(req: {
  headers: { get: (key: string) => string | null };
  cookies?: { get: (key: string) => { value: string } | undefined };
}): { clientIpAddress: string | null; clientUserAgent: string | null; fbp: string | null; fbc: string | null } {
  const forwarded = req.headers.get("x-forwarded-for");
  const clientIpAddress = forwarded ? forwarded.split(",")[0].trim() : req.headers.get("x-real-ip");
  const clientUserAgent = req.headers.get("user-agent");
  const fbp = req.cookies?.get("_fbp")?.value || null;
  const fbc = req.cookies?.get("_fbc")?.value || null;

  return { clientIpAddress, clientUserAgent, fbp, fbc };
}

/**
 * Dispatch Server Lead event.
 */
export async function sendServerLeadEvent(params: {
  orderNumber: string;
  value: number;
  contentName: string;
  userData: ServerUserData;
  eventSourceUrl?: string;
}) {
  return sendMetaServerEvent({
    eventName: "Lead",
    eventId: `lead_${params.orderNumber}`,
    eventSourceUrl: params.eventSourceUrl,
    userData: params.userData,
    customData: {
      currency: "INR",
      value: params.value,
      content_name: params.contentName,
      order_number: params.orderNumber,
    },
  });
}

/**
 * Dispatch Server Schedule event.
 */
export async function sendServerScheduleEvent(params: {
  orderNumber: string;
  value: number;
  contentName: string;
  pickupDate: string;
  pickupTimeSlot: string;
  userData: ServerUserData;
  eventSourceUrl?: string;
}) {
  return sendMetaServerEvent({
    eventName: "Schedule",
    eventId: `schedule_${params.orderNumber}`,
    eventSourceUrl: params.eventSourceUrl,
    userData: params.userData,
    customData: {
      currency: "INR",
      value: params.value,
      content_name: params.contentName,
      order_number: params.orderNumber,
      pickup_date: params.pickupDate,
      pickup_time_slot: params.pickupTimeSlot,
    },
  });
}

/**
 * Dispatch Server PickupBooked event (THE PRIMARY FINAL CONVERSION).
 */
export async function sendServerPickupBookedEvent(params: {
  orderNumber: string;
  value: number;
  contentName: string;
  contentCategory?: string;
  pincode: string;
  city: string;
  pickupDate: string;
  pickupTimeSlot: string;
  userData: ServerUserData;
  eventSourceUrl?: string;
}) {
  return sendMetaServerEvent({
    eventName: "PickupBooked",
    eventId: `pickup_${params.orderNumber}`,
    eventSourceUrl: params.eventSourceUrl,
    userData: params.userData,
    customData: {
      currency: "INR",
      value: params.value,
      content_name: params.contentName,
      content_category: params.contentCategory || "DEVICE",
      order_number: params.orderNumber,
      pincode: params.pincode,
      city: params.city,
      pickup_date: params.pickupDate,
      pickup_time_slot: params.pickupTimeSlot,
    },
  });
}

/**
 * Dispatch Server OfferAccepted event.
 */
export async function sendServerOfferAcceptedEvent(params: {
  orderId: string;
  orderNumber: string;
  value: number;
  userData: ServerUserData;
  eventSourceUrl?: string;
}) {
  return sendMetaServerEvent({
    eventName: "OfferAccepted",
    eventId: `offer_accept_${params.orderId}`,
    eventSourceUrl: params.eventSourceUrl,
    userData: params.userData,
    customData: {
      currency: "INR",
      value: params.value,
      order_id: params.orderId,
      order_number: params.orderNumber,
    },
  });
}

/**
 * Dispatch Qualified Leads / CRM Lead Event directly to Meta Conversions API
 * Strictly formatted as required by Meta CRM / Qualified Leads integration:
 * - action_source: "system_generated"
 * - custom_data: { event_source: "crm", lead_event_source: "CashALL CRM" }
 * - user_data: { em: [...], ph: [...], lead_id: ... }
 */
export async function sendServerCrmLeadEvent(params: {
  eventName?: string; // "Lead", "QualifiedLead", "Schedule", "Converted", etc.
  leadId?: number | string | null;
  orderNumber?: string | null;
  email?: string | null;
  phone?: string | null;
  value?: number;
  currency?: string;
  stageName?: string;
  testEventCode?: string;
}): Promise<{ success: boolean; data?: any; error?: string }> {
  const pixelId = process.env.META_PIXEL_ID || DEFAULT_PIXEL_ID;
  const accessToken = process.env.META_CONVERSIONS_API_ACCESS_TOKEN;

  if (!accessToken) {
    return { success: false, error: "Missing META_CONVERSIONS_API_ACCESS_TOKEN" };
  }

  const endpoint = `https://graph.facebook.com/${META_GRAPH_API_VERSION}/${pixelId}/events`;

  const userData: Record<string, any> = {};
  if (params.email && params.email.includes("@")) {
    userData.em = [hashSha256(params.email)];
  }
  if (params.phone) {
    const cleaned = params.phone.replace(/\D/g, "");
    if (cleaned.length >= 10) {
      userData.ph = [hashPhone(params.phone)];
    }
  }
  if (params.leadId) {
    const num = Number(params.leadId);
    userData.lead_id = !isNaN(num) && num > 0 ? num : params.leadId;
  }

  const payload: Record<string, any> = {
    action_source: "system_generated",
    event_name: params.eventName || "Lead",
    event_time: Math.floor(Date.now() / 1000),
    user_data: userData,
    custom_data: {
      event_source: "crm",
      lead_event_source: "CashALL CRM",
      ...(params.value !== undefined ? { value: params.value, currency: params.currency || "INR" } : {}),
      ...(params.orderNumber ? { order_number: params.orderNumber } : {}),
      ...(params.stageName ? { stage_name: params.stageName } : {}),
    },
  };

  const body: Record<string, any> = {
    data: [payload],
  };

  if (params.testEventCode || process.env.META_TEST_EVENT_CODE) {
    body.test_event_code = params.testEventCode || process.env.META_TEST_EVENT_CODE;
  }

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(body),
    });

    const result = await response.json().catch(() => ({}));

    if (!response.ok) {
      return { success: false, error: result?.error?.message || `HTTP ${response.status}`, data: result };
    }

    return { success: true, data: result };
  } catch (err: any) {
    return { success: false, error: err?.message || "CAPI error" };
  }
}

