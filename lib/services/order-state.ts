import { OrderStatus } from "@prisma/client";
import { AppError } from "@/lib/utils/AppError";

/**
 * Normalizes legacy / intermediate sub-status strings to authoritative PostgreSQL OrderStatus enums.
 */
export function normalizeOrderStatus(status: string): OrderStatus {
  const map: Record<string, OrderStatus> = {
    CREATED: "QUOTE_CREATED",
    QUOTE_CREATED: "QUOTE_CREATED",
    PICKUP_SCHEDULED: "PICKUP_SCHEDULED",
    ASSIGNED: "PARTNER_ASSIGNED",
    PARTNER_ASSIGNED: "PARTNER_ASSIGNED",
    PARTNER_ACCEPTED: "PARTNER_ON_THE_WAY",
    PARTNER_ON_THE_WAY: "PARTNER_ON_THE_WAY",
    INSPECTION_STARTED: "INSPECTION_STARTED",
    INSPECTION_COMPLETED: "FINAL_OFFER_PENDING",
    IMEI_VERIFICATION_PENDING: "FINAL_OFFER_PENDING",
    IMEI_VERIFIED: "FINAL_OFFER_PENDING",
    IMEI_FLAGGED: "DECLINED",
    FINAL_OFFER: "FINAL_OFFER_PENDING",
    FINAL_OFFER_PENDING: "FINAL_OFFER_PENDING",
    CUSTOMER_ACCEPTED: "ACCEPTED",
    ACCEPTED: "ACCEPTED",
    IDENTITY_VERIFICATION_PENDING: "ACCEPTED",
    IDENTITY_VERIFIED: "ACCEPTED",
    ESIGN_PENDING: "ACCEPTED",
    ESIGNED: "ACCEPTED",
    PAYMENT_PENDING: "PAYMENT_PROCESSING",
    PAYMENT_PROCESSING: "PAYMENT_PROCESSING",
    PAYMENT_CONFIRMED: "PAID",
    PAID: "PAID",
    DEVICE_RECEIVED: "PAID",
    BILL_GENERATED: "COMPLETED",
    COMPLETED: "COMPLETED",
    CANCELLED: "CANCELLED",
    REJECTED: "DECLINED",
    DECLINED: "DECLINED",
  };
  return map[status] || (status as OrderStatus);
}

/**
 * Valid state transitions for the authoritative PostgreSQL OrderStatus state machine.
 */
const CANONICAL_TRANSITIONS: Record<OrderStatus, OrderStatus[]> = {
  QUOTE_CREATED: ["PICKUP_SCHEDULED", "CANCELLED"],
  PICKUP_SCHEDULED: ["PARTNER_ASSIGNED", "PARTNER_ON_THE_WAY", "INSPECTION_STARTED", "CANCELLED"],
  PARTNER_ASSIGNED: ["PARTNER_ON_THE_WAY", "INSPECTION_STARTED", "PICKUP_SCHEDULED", "CANCELLED"],
  PARTNER_ON_THE_WAY: ["INSPECTION_STARTED", "PICKUP_SCHEDULED", "CANCELLED"],
  INSPECTION_STARTED: ["FINAL_OFFER_PENDING", "ACCEPTED", "DECLINED", "CANCELLED"],
  FINAL_OFFER_PENDING: ["ACCEPTED", "DECLINED", "CANCELLED"],
  ACCEPTED: ["PAYMENT_PROCESSING", "PAID", "COMPLETED", "CANCELLED"],
  PAYMENT_PROCESSING: ["PAID", "ACCEPTED", "CANCELLED"],
  PAID: ["COMPLETED", "CANCELLED"],
  COMPLETED: [],
  DECLINED: ["FINAL_OFFER_PENDING", "CANCELLED"],
  CANCELLED: [],
};

export class OrderStateMachine {
  /**
   * Validates whether a state transition from `currentStatus` to `targetStatus` is permitted.
   */
  static canTransition(currentStatus: string, targetStatus: string): boolean {
    const from = normalizeOrderStatus(currentStatus);
    const to = normalizeOrderStatus(targetStatus);

    // Self-transition is always permitted (idempotent updates)
    if (from === to) return true;

    const allowed = CANONICAL_TRANSITIONS[from] || [];
    return allowed.includes(to);
  }

  /**
   * Asserts state transition or throws an AppError.
   */
  static assertTransition(currentStatus: string, targetStatus: string): void {
    if (!this.canTransition(currentStatus, targetStatus)) {
      throw new AppError(
        `Invalid transaction state transition from '${currentStatus}' to '${targetStatus}'.`,
        400
      );
    }
  }

  /**
   * Strict backend verification before marking an order as COMPLETED.
   */
  static verifyCompletionCriteria(order: {
    status: string;
    identityVerifications?: any[];
    imeiVerifications?: any[];
    qcReports?: any[];
    offers?: any[];
    payments?: any[];
    signatures?: any[];
    bills?: any[];
    finalPrice?: number | null;
  }): { valid: boolean; missingConditions: string[] } {
    const missing: string[] = [];

    // 1. Identity Verified
    const hasIdentityVerified = order.identityVerifications?.some(
      (v) => v.status === "VERIFIED"
    );
    if (!hasIdentityVerified) missing.push("Identity verification incomplete");

    // 2. IMEI Clear
    const hasImeiClear = order.imeiVerifications?.some(
      (v) => v.status === "CLEAR" || v.status === "VERIFIED"
    );
    if (!hasImeiClear) missing.push("Device IMEI verification not cleared");

    // 3. Inspection Completed
    const hasQcReport = (order.qcReports && order.qcReports.length > 0) || order.status === "INSPECTION_COMPLETED" || order.status === "COMPLETED" || order.status === "DEVICE_RECEIVED";
    if (!hasQcReport) missing.push("Device inspection report missing");

    // 4. Customer Accepted Final Offer
    const hasAcceptedOffer = order.offers?.some((o) => o.status === "ACCEPTED") || order.finalPrice !== null;
    if (!hasAcceptedOffer) missing.push("Customer final price offer acceptance missing");

    // 5. Electronic Signature Completed
    const hasSignature = order.signatures?.some((s) => s.status === "ESIGNED");
    if (!hasSignature) missing.push("Signed Sale Agreement missing");

    // 6. Payment Confirmed
    const hasPaidPayment = order.payments?.some(
      (p) => p.status === "PAID" || p.status === "CONFIRMED"
    );
    if (!hasPaidPayment) missing.push("Manual UPI payment confirmation missing");

    // 7. Device Received
    const isDeviceReceived = order.status === "DEVICE_RECEIVED" || order.status === "BILL_GENERATED" || order.status === "COMPLETED";
    if (!isDeviceReceived) missing.push("Device physical custody confirmation missing");

    // 8. Bill Generated
    const hasBill = order.bills && order.bills.length > 0;
    if (!hasBill) missing.push("Generated Purchase Receipt / Bill missing");

    return {
      valid: missing.length === 0,
      missingConditions: missing,
    };
  }
}
