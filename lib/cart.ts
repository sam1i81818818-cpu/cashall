export interface CartQuoteItem {
  quoteId: string;
  quoteNumber: string; // e.g. "CAQ24640"
  variantId?: string;
  brandName: string;
  modelName: string;
  storage?: string;
  imageUrl?: string | null;
  category?: "MOBILE" | "TABLET" | "LAPTOP" | string;
  estimatedPrice: number;
  basePrice?: number;
  customerName?: string;
  customerPhone?: string;
  selectedAnswersJson?: string;
  breakdownJson?: string;
  createdAt: string;
}

export const CART_STORAGE_KEY = "cashall_cart_quotes";
export const CART_UPDATED_EVENT = "cashall_cart_updated";

export function getCartQuotes(): CartQuoteItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(CART_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];

    // Check if customer is logged in
    const userRaw = localStorage.getItem("cashall_user");
    let currentPhone = "";
    if (userRaw) {
      try {
        const u = JSON.parse(userRaw);
        if (u.phone) currentPhone = u.phone.replace(/\D/g, "").slice(-10);
      } catch (e) {}
    }

    if (currentPhone) {
      return parsed.filter((item) => {
        const itemPhone = (item.customerPhone || "").replace(/\D/g, "").slice(-10);
        return !itemPhone || itemPhone === currentPhone;
      });
    }

    return parsed;
  } catch (e) {
    return [];
  }
}

export function saveQuoteToCart(item: CartQuoteItem): CartQuoteItem[] {
  if (typeof window === "undefined") return [];
  try {
    const existing = getCartQuotes();
    const filtered = existing.filter(
      (q) => q.quoteNumber !== item.quoteNumber && q.quoteId !== item.quoteId
    );
    const updated = [item, ...filtered];
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new Event(CART_UPDATED_EVENT));
    return updated;
  } catch (e) {
    return [];
  }
}

export function removeQuoteFromCart(quoteNumberOrId: string): CartQuoteItem[] {
  if (typeof window === "undefined") return [];
  try {
    const existing = getCartQuotes();
    const updated = existing.filter(
      (q) => q.quoteNumber !== quoteNumberOrId && q.quoteId !== quoteNumberOrId
    );
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new Event(CART_UPDATED_EVENT));
    return updated;
  } catch (e) {
    return [];
  }
}

export function clearCart(): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(CART_STORAGE_KEY);
    window.dispatchEvent(new Event(CART_UPDATED_EVENT));
  } catch (e) {}
}

export async function syncCartWithUser(phone: string): Promise<CartQuoteItem[]> {
  if (typeof window === "undefined" || !phone) return [];
  const cleanPhone = phone.replace(/\D/g, "").slice(-10);
  if (!cleanPhone) return [];

  try {
    const res = await fetch(`/api/v1/quotes/user?phone=${encodeURIComponent(cleanPhone)}`);
    const json = await res.json();
    if (json.success && Array.isArray(json.quotes)) {
      const activeQuotes: CartQuoteItem[] = json.quotes
        .filter((q: any) => q.status === "ACTIVE")
        .map((q: any) => ({
          quoteId: q.id,
          quoteNumber: q.quoteNumber,
          variantId: q.variantId,
          brandName: q.brandName,
          modelName: q.modelName,
          storage: q.storage,
          imageUrl: q.imageUrl,
          category: q.category,
          estimatedPrice: q.estimatedPrice,
          basePrice: q.basePrice,
          customerName: q.customerName,
          customerPhone: q.customerPhone,
          selectedAnswersJson: q.selectedAnswersJson,
          breakdownJson: q.breakdownJson,
          createdAt: q.createdAt,
        }));

      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(activeQuotes));
      window.dispatchEvent(new Event(CART_UPDATED_EVENT));
      return activeQuotes;
    }
  } catch (e) {}
  return getCartQuotes();
}
