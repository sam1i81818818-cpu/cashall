export interface AddressInput {
  line1?: string | null;
  line2?: string | null;
  house?: string | null;
  street?: string | null;
  area?: string | null;
  landmark?: string | null;
  city?: string | null;
  state?: string | null;
  pincode?: string | null;
}

/**
 * Standardized address formatter for CashALL across Customer, Support, Admin, Agent, and Partner panels.
 * Format: "Line 1, Line 2 (if present), State - PIN Code"
 */
export function formatAddress(addr?: AddressInput | null, fallback: string = "—"): string {
  if (!addr) return fallback;

  // Resolve Line 1
  let line1 = (addr.line1 || "").trim();
  if (!line1) {
    line1 = [addr.house, addr.street].filter(Boolean).map((s) => String(s).trim()).filter(Boolean).join(", ");
  }

  // Resolve Line 2 (Optional)
  let line2 = addr.line2 !== undefined && addr.line2 !== null ? String(addr.line2).trim() : "";
  if (!line2) {
    line2 = [addr.area, addr.landmark].filter(Boolean).map((s) => String(s).trim()).filter(Boolean).join(", ");
  }

  const state = (addr.state || "").trim() || "West Bengal";
  const pincode = (addr.pincode || "").trim();

  const parts: string[] = [];
  if (line1) parts.push(line1);
  if (line2 && line2 !== line1) parts.push(line2);
  if (state && pincode) parts.push(`${state} - ${pincode}`);
  else if (pincode) parts.push(`PIN: ${pincode}`);
  else if (state) parts.push(state);

  return parts.length > 0 ? parts.join(", ") : fallback;
}
