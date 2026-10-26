export interface SavedCustomerAddress {
  fullName: string;
  phone: string;
  email: string;
  line1: string;
  line2?: string;
  city?: string;
  state: string;
  pincode: string;
}

export function cleanPhoneNumber(phone?: string | null): string {
  if (!phone) return "";
  const raw = phone.replace(/\D/g, "");
  return raw.slice(-10);
}

export function getSavedCustomerAddress(phone: string): SavedCustomerAddress | null {
  if (typeof window === "undefined") return null;
  const clean = cleanPhoneNumber(phone);
  if (!clean || clean.length !== 10) return null;

  try {
    const raw = localStorage.getItem(`cashall_address_${clean}`);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed === "object") {
        return parsed as SavedCustomerAddress;
      }
    }
  } catch (e) {
    console.error("Error reading saved customer address:", e);
  }
  return null;
}

export function saveCustomerAddress(phone: string, data: Partial<SavedCustomerAddress>) {
  if (typeof window === "undefined") return;
  const clean = cleanPhoneNumber(phone);
  if (!clean || clean.length !== 10) return;

  try {
    const existing = getSavedCustomerAddress(clean) || ({} as SavedCustomerAddress);
    const updated: SavedCustomerAddress = {
      fullName: data.fullName || existing.fullName || "",
      phone: clean,
      email: data.email || existing.email || "",
      line1: data.line1 || existing.line1 || "",
      line2: data.line2 !== undefined ? data.line2 : (existing.line2 || ""),
      city: data.city || existing.city || "",
      state: data.state || existing.state || "West Bengal",
      pincode: data.pincode || existing.pincode || "",
    };

    localStorage.setItem(`cashall_address_${clean}`, JSON.stringify(updated));
    // Always wipe legacy un-scoped address to avoid cross-user leakage
    localStorage.removeItem("cashall_saved_address");
  } catch (e) {
    console.error("Error saving customer address:", e);
  }
}

export function clearCrossUserDataOnSwitch(newCleanPhone?: string) {
  if (typeof window === "undefined") return;
  // Always clean un-scoped legacy keys that caused cross-user data leakage
  localStorage.removeItem("cashall_saved_address");
  localStorage.removeItem("cashall_latest_order");
  localStorage.removeItem("cashall_latest_rental");
  localStorage.removeItem("cashall_cart_quotes");
  localStorage.removeItem("cashall_quotes");
  localStorage.removeItem("cashall_all_orders");
  localStorage.removeItem("cashall_latest_quote");
}
