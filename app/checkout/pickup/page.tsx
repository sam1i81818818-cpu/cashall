"use client";

import React, { useState, useEffect, useRef, Suspense } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import Image from "next/image";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/Button";
import { INITIAL_SERVICE_AREAS, OrderData, QuoteData, INITIAL_VARIANTS, INITIAL_MODELS, INITIAL_BRANDS } from "@/lib/store";
import { removeQuoteFromCart } from "@/lib/cart";
import { SERVICEABLE_DISTRICTS, isPincodeServiced, getPincodeDetails, getStateFromPincode } from "@/lib/serviceability";
import { trackMetaStandardEvent, trackMetaCustomEvent } from "@/lib/analytics/meta";
import { formatDeviceName, cleanDeviceName } from "@/lib/device";
import { formatAddress } from "@/lib/address";
import { cleanPhoneNumber, getSavedCustomerAddress, saveCustomerAddress } from "@/lib/utils/customer-storage";
import {
  getRecordedPickupDate,
  getPickupDatePresets,
  getAvailableTimeSlotsForDate,
  getMinCalendarDateISO,
  getDefaultPickupDate,
  isTodayAvailable,
} from "@/lib/utils/pickup-date";
import {
  MapPin,
  Calendar,
  CheckCircle2,
  AlertCircle,
  Truck,
  ArrowRight,
  ShieldCheck,
  Building,
  ChevronDown,
  ChevronUp,
  Wallet,
  CreditCard,
  Gift,
  QrCode,
  Lock,
} from "lucide-react";

function PickupCheckoutContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const quoteId = searchParams.get("quoteId") || "quote-demo";

  const [quote, setQuote] = useState<QuoteData | null>(null);
  const [pincode, setPincode] = useState("");
  const [serviceStatus, setServiceStatus] = useState<"IDLE" | "AVAILABLE" | "UNAVAILABLE">("IDLE");
  const [expandedDistrict, setExpandedDistrict] = useState<string | null>(null);
  const [city, setCity] = useState("Kolkata");
  const [selectedState, setSelectedState] = useState("West Bengal");
  const [resolvedDeviceName, setResolvedDeviceName] = useState("");

  // Standardized Address fields: Line 1, Line 2 (optional), State, PIN Code
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [line1, setLine1] = useState("");
  const [line2, setLine2] = useState("");
  const [hasPrefilledAddress, setHasPrefilledAddress] = useState(false);

  // Pickup slot - initialized with real-time slot availability
  const [pickupDate, setPickupDate] = useState(() => getDefaultPickupDate());
  const [isCustomDate, setIsCustomDate] = useState(false);
  const [customDateInput, setCustomDateInput] = useState("");
  const [pickupSlot, setPickupSlot] = useState(() => {
    const initialDate = getDefaultPickupDate();
    const available = getAvailableTimeSlotsForDate(initialDate);
    return available[0] || "10 AM - 1 PM";
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isSubmittingRef = useRef(false);

  // Automatically keep selected slot valid when date changes
  useEffect(() => {
    const validSlots = getAvailableTimeSlotsForDate(pickupDate);
    if (validSlots.length > 0 && !validSlots.includes(pickupSlot)) {
      setPickupSlot(validSlots[0]);
    }
  }, [pickupDate, pickupSlot]);

  // Preferred Payout Choice states
  const [payoutMethod, setPayoutMethod] = useState<"UPI" | "BANK_TRANSFER" | "GIFT_CARD">("UPI");
  const [upiId, setUpiId] = useState("");
  const [bankAccount, setBankAccount] = useState("");
  const [bankIfsc, setBankIfsc] = useState("");

  // Security Reassurance Check state
  const [securityChecked, setSecurityChecked] = useState(false);

  // Legal declarations & consent states (strictly non-prechecked)
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [marketingAccepted, setMarketingAccepted] = useState(false);
  const [showAgreementModal, setShowAgreementModal] = useState(false);

  const ALL_INDIAN_STATES = [
    "West Bengal",
    "Bihar",
    "Uttar Pradesh",
    "Jharkhand",
    "Delhi",
    "Maharashtra",
    "Karnataka",
    "Tamil Nadu",
    "Telangana",
    "Gujarat",
    "Rajasthan",
    "Madhya Pradesh",
    "Haryana",
    "Punjab",
    "Odisha",
    "Assam",
    "Kerala",
    "Andhra Pradesh",
    "Chhattisgarh",
    "Uttarakhand",
    "Goa",
    "Himachal Pradesh",
    "Jammu & Kashmir",
    "Chandigarh",
    "Tripura",
    "Meghalaya",
    "Manipur",
    "Nagaland",
    "Arunachal Pradesh",
    "Mizoram",
    "Sikkim",
    "Puducherry",
    "Andaman & Nicobar Islands",
    "Ladakh",
    "Dadra and Nagar Haveli and Daman and Diu",
    "Lakshadweep",
  ];

  const checkPincode = (pinToCheck?: string) => {
    const pinStr = (typeof pinToCheck === "string" ? pinToCheck : pincode).trim();
    if (!pinStr || pinStr.length !== 6) {
      setServiceStatus("UNAVAILABLE");
      return;
    }

    // Auto-detect and auto-select state as per PIN code
    const detectedState = getStateFromPincode(pinStr);
    if (detectedState) {
      setSelectedState(detectedState);
    }

    const isServiced = isPincodeServiced(pinStr);
    const details = isServiced ? getPincodeDetails(pinStr) : null;
    if (isServiced && details) {
      setCity(details.city);
      if (details.state) setSelectedState(details.state);
      setServiceStatus("AVAILABLE");
    } else {
      setServiceStatus("UNAVAILABLE");
    }

    trackMetaCustomEvent("ServiceabilityChecked", {
      pincode: pinStr,
      serviceable: isServiced,
      city: details?.city || city,
      state: details?.state || detectedState || selectedState,
    }, { eventId: `serviceability_${pinStr}` });
  };

  const handlePincodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, "").slice(0, 6);
    setPincode(val);

    // Auto-select state dynamically as customer types PIN code
    if (val.length >= 2) {
      const detectedState = getStateFromPincode(val);
      if (detectedState) {
        setSelectedState(detectedState);
      }
    }

    if (val.length === 6) {
      checkPincode(val);
    } else if (serviceStatus !== "IDLE") {
      setServiceStatus("IDLE");
    }
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedUser = localStorage.getItem("cashall_user");
      let currentCleanPhone = "";

      if (storedUser) {
        try {
          const u = JSON.parse(storedUser);
          if (u.name) setFullName(u.name);
          if (u.phone) {
            const clean = cleanPhoneNumber(u.phone);
            currentCleanPhone = clean;
            setPhone(clean || u.phone);
          }
          if (u.email) setEmail(u.email);
        } catch (e) {
          console.error(e);
        }
      }

      // Purge legacy un-scoped addresses to prevent cross-customer data leakage
      localStorage.removeItem("cashall_saved_address");

      let prefilledPin = "";
      let didPrefill = false;

      // STRICT USER ISOLATION:
      // Only prefill previous address if the customer is logged in with a valid phone number.
      if (currentCleanPhone && currentCleanPhone.length === 10) {
        // A. Check user-scoped address in localStorage
        const savedAddr = getSavedCustomerAddress(currentCleanPhone);
        if (savedAddr) {
          if (savedAddr.fullName) setFullName(savedAddr.fullName);
          if (savedAddr.email) setEmail(savedAddr.email);
          if (savedAddr.line1) setLine1(savedAddr.line1);
          if (savedAddr.line2 !== undefined) setLine2(savedAddr.line2);
          if (savedAddr.city) setCity(savedAddr.city);
          if (savedAddr.state) setSelectedState(savedAddr.state);
          if (savedAddr.pincode) {
            setPincode(savedAddr.pincode);
            prefilledPin = savedAddr.pincode;
          }
          didPrefill = true;
        }

        // B. Check user-scoped latest order in localStorage
        if (!didPrefill) {
          const userScopedOrderStr = localStorage.getItem(`cashall_latest_order_${currentCleanPhone}`) || localStorage.getItem("cashall_latest_order");
          if (userScopedOrderStr) {
            try {
              const lo = JSON.parse(userScopedOrderStr);
              const orderPhone = cleanPhoneNumber(lo.customerPhone);
              // Ensure order phone strictly matches the current logged in user
              if (orderPhone === currentCleanPhone) {
                if (lo.pincode) {
                  setPincode(lo.pincode);
                  prefilledPin = lo.pincode;
                }
                if (lo.customerName) setFullName(lo.customerName);
                if (lo.customerEmail) setEmail(lo.customerEmail);

                if (lo.addressSummary) {
                  const parts = lo.addressSummary.split(",").map((s: string) => s.trim());
                  if (parts.length >= 1 && parts[0]) setLine1(parts[0]);
                  if (parts.length >= 2 && parts[1]) setLine2(parts.slice(1).join(", "));
                  didPrefill = true;
                }
              }
            } catch (e) {}
          }
        }

        // C. Database Fallback: For returning customers across devices/cache clears
        if (!didPrefill) {
          fetch(`/api/v1/orders/user?phone=${encodeURIComponent(currentCleanPhone)}`)
            .then((res) => res.json())
            .then((data) => {
              if (data.success && Array.isArray(data.orders) && data.orders.length > 0) {
                const latest = data.orders[0];
                if (latest) {
                  if (latest.customerName) setFullName(latest.customerName);
                  if (latest.customerEmail) setEmail(latest.customerEmail);

                  let pin = "";
                  let l1 = "";
                  let l2 = "";
                  let cty = "";
                  let st = "";

                  if (latest.address) {
                    l1 = latest.address.line1 || "";
                    l2 = latest.address.line2 || "";
                    cty = latest.address.city || "";
                    st = latest.address.state || "";
                    pin = latest.address.pincode || "";
                  } else if (latest.addressSummary && latest.addressSummary !== "Address on file") {
                    const parts = latest.addressSummary.split(",").map((s: string) => s.trim());
                    if (parts.length >= 1) l1 = parts[0];
                    if (parts.length >= 2) l2 = parts.slice(1).join(", ");
                    pin = latest.pincode || "";
                  }

                  if (l1) setLine1(l1);
                  if (l2) setLine2(l2);
                  if (cty) setCity(cty);
                  if (st) setSelectedState(st);
                  if (pin) {
                    setPincode(pin);
                    checkPincode(pin);
                  }

                  if (l1 || pin) {
                    setHasPrefilledAddress(true);
                    saveCustomerAddress(currentCleanPhone, {
                      fullName: latest.customerName,
                      phone: currentCleanPhone,
                      email: latest.customerEmail || "",
                      line1: l1,
                      line2: l2,
                      city: cty,
                      state: st || "West Bengal",
                      pincode: pin,
                    });
                  }
                }
              }
            })
            .catch(() => {});
        }
      } else {
        // GUEST / UNLOGGED USER: Ensure no residual address data from any previous user
        setFullName("");
        setPhone("");
        setEmail("");
        setLine1("");
        setLine2("");
        setPincode("");
        setServiceStatus("IDLE");
        setHasPrefilledAddress(false);
      }

      if (didPrefill) {
        setHasPrefilledAddress(true);
      }

      if (prefilledPin && prefilledPin.length === 6) {
        checkPincode(prefilledPin);
      }

      let foundQuote: QuoteData | null = null;
      const isSpecificQuote = quoteId && quoteId !== "quote-demo";

      if (isSpecificQuote) {
        // 1. Check if specific quote is cached locally
        const specificKey = `cashall_quote_${quoteId}`;
        const storedSpecific = localStorage.getItem(specificKey);
        if (storedSpecific) {
          try {
            const parsed = JSON.parse(storedSpecific);
            if (parsed && (parsed.id === quoteId || parsed.quoteNumber === quoteId)) {
              foundQuote = parsed;
            }
          } catch (e) {
            console.error(e);
          }
        }

        // 2. Check cart quotes for matching quote
        if (!foundQuote) {
          try {
            const cart = JSON.parse(localStorage.getItem("cashall_cart_quotes") || "[]");
            const item = cart.find((c: any) => c.quoteNumber === quoteId || c.quoteId === quoteId);
            if (item) {
              const dName = item.deviceName || formatDeviceName(item.brandName, item.modelName, item.storage);
              foundQuote = {
                id: item.quoteId,
                quoteNumber: item.quoteNumber,
                variantId: item.variantId || "",
                estimatedPrice: item.estimatedPrice,
                basePrice: item.basePrice || item.estimatedPrice,
                totalDeductions: (item.basePrice || item.estimatedPrice) - item.estimatedPrice,
                breakdownJson: item.breakdownJson || JSON.stringify({ deviceName: cleanDeviceName(dName) }),
                selectedAnswersJson: item.selectedAnswersJson || "{}",
                expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
                status: "ACTIVE",
                createdAt: item.createdAt,
              };
              setResolvedDeviceName(cleanDeviceName(dName));
            }
          } catch (e) {}
        }

        // 3. If found locally, set immediate state
        if (foundQuote) {
          setQuote(foundQuote);
          let dName = "";
          if (foundQuote.breakdownJson) {
            try {
              const bd = JSON.parse(foundQuote.breakdownJson);
              if (bd.deviceName) dName = bd.deviceName;
            } catch {}
          }
          if (dName) {
            setResolvedDeviceName(cleanDeviceName(dName));
          }
        }

        // 4. ALWAYS fetch server quote to ensure authentic database details (fresh price, device name)
        fetch(`/api/v1/quotes/${encodeURIComponent(quoteId)}`)
          .then((res) => res.json())
          .then((data) => {
            if (data.success && data.quote) {
              setQuote(data.quote);
              const dName = data.quote.deviceName || formatDeviceName(data.quote.brandName, data.quote.modelName, data.quote.storage);
              const cleanedName = cleanDeviceName(dName);
              setResolvedDeviceName(cleanedName);
              try {
                localStorage.setItem(`cashall_quote_${quoteId}`, JSON.stringify(data.quote));
              } catch {}
            }
          })
          .catch((err) => console.warn("Error fetching quote from server:", err));
      } else {
        // Fallback only if no quoteId specified
        const storedQuote = localStorage.getItem("cashall_active_quote") || localStorage.getItem("cashall_latest_quote");
        if (storedQuote) {
          try {
            foundQuote = JSON.parse(storedQuote);
            if (foundQuote) {
              setQuote(foundQuote);
              let dName = "";
              if (foundQuote.breakdownJson) {
                try {
                  const bd = JSON.parse(foundQuote.breakdownJson);
                  if (bd.deviceName) dName = bd.deviceName;
                } catch {}
              }
              if (dName) setResolvedDeviceName(cleanDeviceName(dName));
            }
          } catch (e) {}
        }
      }
    }
  }, [quoteId]);

  useEffect(() => {
    if (quote) {
      trackMetaStandardEvent("InitiateCheckout", {
        content_name: resolvedDeviceName || "Assessed Device",
        value: quote.estimatedPrice,
        currency: "INR",
        num_items: 1,
      }, { eventId: `init_checkout_${quote.id || quote.quoteNumber}` });
    }
  }, [quote?.id, quote?.estimatedPrice, resolvedDeviceName]);

  const handleConfirmOrder = async (e: React.FormEvent) => {
    e.preventDefault();

    // Prevent duplicate clicks or submissions immediately
    if (isSubmittingRef.current || isSubmitting) {
      return;
    }

    // Validate mandatory PIN code
    const cleanPin = pincode.trim();
    if (!cleanPin || cleanPin.length !== 6) {
      alert("Please enter a valid 6-digit PIN code for pickup.");
      return;
    }

    if (!isPincodeServiced(cleanPin)) {
      setServiceStatus("UNAVAILABLE");
      const districtList = SERVICEABLE_DISTRICTS.map((d) => d.name).join(", ");
      alert(`Currently, we only serve ${districtList}. PIN code ${cleanPin} is outside our service area.`);
      return;
    }

    // Validate phone — critical for cross-device sync
    const cleanPhone = phone.trim().replace(/\D/g, "");
    if (cleanPhone.length < 10) {
      alert("Please enter a valid 10-digit mobile number.");
      return;
    }

    // Validate mandatory email address
    if (!email.trim() || !email.includes("@")) {
      alert("Please enter a valid email address to receive your official Tax Invoice and Bill.");
      return;
    }

    if (!line1.trim()) {
      alert("Please enter Address Line 1 for doorstep pickup.");
      return;
    }

    // Strictly validate non-prechecked legal declaration & terms
    if (!termsAccepted) {
      alert("Please confirm the Seller Legal Declaration and accept the Purchase Agreement to schedule your pickup.");
      return;
    }

    // Lock submission immediately to prevent duplicate requests
    isSubmittingRef.current = true;
    setIsSubmitting(true);

    const finalName = fullName.trim() || "Customer";
    const finalPhone = cleanPhone;
    const finalEmail = email.trim();
    const finalLine1 = line1.trim();
    const finalLine2 = line2.trim();
    let fullDeviceName = resolvedDeviceName;
    if (!fullDeviceName && quote?.breakdownJson) {
      try {
        const bd = JSON.parse(quote.breakdownJson);
        if (bd?.deviceName) fullDeviceName = bd.deviceName;
      } catch {}
    }
    if (!fullDeviceName && quote?.selectedAnswersJson) {
      try {
        const sa = JSON.parse(quote.selectedAnswersJson);
        if (sa?.device && sa.device !== "Customer Mobile Device") fullDeviceName = sa.device;
      } catch {}
    }
    if (!fullDeviceName && quote) {
      fullDeviceName = (quote as any).deviceName || formatDeviceName((quote as any).brandName, (quote as any).modelName, (quote as any).storage);
    }
    fullDeviceName = cleanDeviceName(fullDeviceName || "Mobile Device");

    // Update user profile and address in local storage (strictly user-scoped)
    if (typeof window !== "undefined") {
      localStorage.setItem("cashall_user", JSON.stringify({ name: finalName, phone: finalPhone, email: finalEmail }));
      saveCustomerAddress(finalPhone, {
        fullName: finalName,
        phone: finalPhone,
        email: finalEmail,
        line1: finalLine1,
        line2: finalLine2,
        city,
        state: selectedState,
        pincode: cleanPin,
      });
      localStorage.removeItem("cashall_saved_address");
    }

    let createdOrderNum = "";
    let apiSuccess = false;
    let serverErrorMsg = "";

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 25000);

      const res = await fetch("/api/v1/orders/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          quoteId: quote?.id || quoteId,
          quoteNumber: quote?.quoteNumber || "",
          fullName: finalName,
          phone: finalPhone,
          email: finalEmail,
          line1: finalLine1,
          line2: finalLine2,
          house: finalLine1,
          street: finalLine2,
          state: selectedState,
          pincode: cleanPin,
          pickupDate,
          pickupTimeSlot: pickupSlot,
          deviceName: fullDeviceName,
          estimatedPrice: quote?.estimatedPrice || 32500,
          selectedAnswersJson: quote?.selectedAnswersJson || "{}",
          breakdownJson: quote?.breakdownJson || "{}",
          termsAccepted: true,
          marketingConsent: marketingAccepted,
          agreementVersion: "1.0",
        }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      const json = await res.json().catch(() => null);

      if (json && json.success && json.data?.orderNumber) {
        createdOrderNum = json.data.orderNumber;
        apiSuccess = true;
      } else if (json && json.error) {
        serverErrorMsg = json.error;
      } else {
        serverErrorMsg = `Order confirmation failed (HTTP ${res.status}). Please try again.`;
      }
    } catch (err: any) {
      console.warn("Order creation error:", err);
      serverErrorMsg = err.name === "AbortError"
        ? "Network timeout while confirming your order. Please check your Orders page or try again."
        : (err.message || "An unexpected error occurred. Please try again.");
    }

    if (!apiSuccess) {
      isSubmittingRef.current = false;
      setIsSubmitting(false);
      alert(serverErrorMsg || "Unable to process order right now. Please check your details and try again.");
      return;
    }

    // ── FIRE META CONVERSIONS ONLY ON BACKEND CONFIRMED SUCCESS ──
    const orderValue = quote?.estimatedPrice || 32500;
    let categoryName = "MOBILE";
    if (quote?.breakdownJson) {
      try {
        const bd = JSON.parse(quote.breakdownJson);
        if (bd.category) categoryName = bd.category;
      } catch {}
    }

    // 1. Lead (Funnel event)
    trackMetaStandardEvent("Lead", {
      currency: "INR",
      value: orderValue,
      content_name: fullDeviceName,
      order_number: createdOrderNum,
    }, { eventId: `lead_${createdOrderNum}` });

    // 2. Schedule (Funnel event)
    trackMetaStandardEvent("Schedule", {
      currency: "INR",
      value: orderValue,
      content_name: fullDeviceName,
      order_number: createdOrderNum,
      pickup_date: pickupDate,
      pickup_time_slot: pickupSlot,
    }, { eventId: `schedule_${createdOrderNum}` });

    // 3. PickupBooked (PRIMARY FINAL BUSINESS CONVERSION)
    trackMetaCustomEvent("PickupBooked", {
      order_number: createdOrderNum,
      content_name: fullDeviceName,
      content_category: categoryName,
      value: orderValue,
      currency: "INR",
      pincode: pincode,
      city: city,
      pickup_date: pickupDate,
      pickup_time_slot: pickupSlot,
    }, { eventId: `pickup_${createdOrderNum}` });

    if (typeof window !== "undefined" && window.sessionStorage) {
      try {
        sessionStorage.setItem(`cashall_tracked_order_${createdOrderNum}`, "true");
      } catch {}
    }

    const fullAddress = formatAddress({ line1: finalLine1, line2: finalLine2, state: selectedState, pincode });

    const newOrder: any = {
      id: `ord-${Date.now()}`,
      orderNumber: createdOrderNum,
      quoteId: quote?.id || quoteId,
      userId: `u-${finalPhone}`,
      customerName: finalName,
      customerPhone: finalPhone,
      customerEmail: finalEmail,
      deviceName: fullDeviceName,   // Always store device name
      pincode,
      addressSummary: fullAddress,
      pickupDate,
      pickupTimeSlot: pickupSlot,
      status: "PICKUP_SCHEDULED",
      revisedPrice: quote?.estimatedPrice,
      estimatedPrice: quote?.estimatedPrice,
      declaredConditionSummary: fullDeviceName,
      selectedAnswersJson: quote?.selectedAnswersJson || "{}",
      payoutMethod,
      payoutDetails: payoutMethod === "UPI" ? (upiId || "UPI on-site") : payoutMethod === "BANK_TRANSFER" ? `${bankAccount} / ${bankIfsc}` : "Brand e-Gift Card (+5% Bonus)",
      securityWipeConfirmed: securityChecked,
      quote: quote || null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    if (typeof window !== "undefined") {
      localStorage.setItem(`cashall_order_${createdOrderNum}`, JSON.stringify(newOrder));
      localStorage.setItem(`cashall_latest_order_${finalPhone}`, JSON.stringify(newOrder));
      localStorage.setItem("cashall_latest_order", JSON.stringify(newOrder));

      const existing = JSON.parse(localStorage.getItem("cashall_all_orders") || "[]");
      localStorage.setItem("cashall_all_orders", JSON.stringify([newOrder, ...existing]));

      // Save user session details and address for auto-prefilling future orders (strictly user-scoped)
      localStorage.setItem("cashall_user", JSON.stringify({
        id: newOrder.userId,
        name: finalName,
        phone: finalPhone,
        email: finalEmail,
      }));

      saveCustomerAddress(finalPhone, {
        fullName: finalName,
        phone: finalPhone,
        email: finalEmail,
        line1: finalLine1,
        line2: finalLine2,
        city,
        state: selectedState,
        pincode: pincode,
      });
      localStorage.removeItem("cashall_saved_address");

      // Remove converted quote from customer Cart
      if (quote?.quoteNumber) {
        removeQuoteFromCart(quote.quoteNumber);
      }
      if (quoteId) {
        removeQuoteFromCart(quoteId);
      }

      // Purge converted quote from Saved Price Quotes in customer portal
      try {
        const storedQuotes = JSON.parse(localStorage.getItem("cashall_quotes") || "[]");
        if (Array.isArray(storedQuotes)) {
          const targetQId = (quote?.id || quoteId || "").toLowerCase();
          const targetQNum = (quote?.quoteNumber || "").toUpperCase();
          const targetQDigits = targetQNum.replace(/\D/g, "");
          const ordDigits = (createdOrderNum || "").replace(/\D/g, "");

          const cleanedQuotes = storedQuotes.filter((sq: any) => {
            const sqId = (sq.id || "").toLowerCase();
            const sqNum = (sq.quoteNumber || "").toUpperCase();
            const sqDigits = sqNum.replace(/\D/g, "");

            if (targetQId && sqId === targetQId) return false;
            if (targetQNum && sqNum === targetQNum) return false;
            if (targetQDigits && sqDigits && targetQDigits === sqDigits) return false;
            if (ordDigits && sqDigits && (ordDigits === sqDigits || ordDigits.includes(sqDigits) || sqDigits.includes(ordDigits))) return false;
            return true;
          });
          localStorage.setItem("cashall_quotes", JSON.stringify(cleanedQuotes));
        }

        const latQuote = localStorage.getItem("cashall_latest_quote");
        if (latQuote) {
          const parsed = JSON.parse(latQuote);
          const latId = (parsed.id || "").toLowerCase();
          const latNum = (parsed.quoteNumber || "").toUpperCase();
          if (
            (quote?.id && latId === quote.id.toLowerCase()) ||
            (quoteId && latId === quoteId.toLowerCase()) ||
            (quote?.quoteNumber && latNum === quote.quoteNumber.toUpperCase())
          ) {
            localStorage.removeItem("cashall_latest_quote");
          }
        }
      } catch (e) {}
    }

    // Instant transition — zero artificial wait
    setIsSubmitting(false);
    router.push(`/order/${createdOrderNum}`);
  };

  // Resolve display device name for sidebar - read from stored data, never fall back to INITIAL_VARIANTS[0]
  const sidebarDeviceName = (() => {
    let name = "";
    if (resolvedDeviceName) name = resolvedDeviceName;
    else if (quote?.breakdownJson) {
      try {
        const bd = JSON.parse(quote.breakdownJson);
        if (bd.deviceName) name = bd.deviceName;
      } catch {}
    }
    if (!name) {
      // Only use INITIAL_VARIANTS if variantId actually matches
      const matchedVariant = INITIAL_VARIANTS.find((v) => v.id === quote?.variantId);
      if (matchedVariant) {
        const matchedModel = INITIAL_MODELS.find((m) => m.id === matchedVariant.modelId);
        const matchedBrand = matchedModel ? INITIAL_BRANDS.find((b) => b.id === matchedModel.brandId) : null;
        if (matchedModel && matchedBrand) {
          name = formatDeviceName(matchedBrand.name, matchedModel.name, matchedVariant.storage);
        }
      }
    }
    return cleanDeviceName(name || "Your Device");
  })();
  const sidebarStorage = (() => {
    if (sidebarDeviceName && (sidebarDeviceName.includes("GB") || sidebarDeviceName.includes("TB"))) {
      return "";
    }
    const matchedVariant = INITIAL_VARIANTS.find((v) => v.id === quote?.variantId);
    return matchedVariant?.storage || "";
  })();
  const sidebarImageUrl = (() => {
    const matchedVariant = INITIAL_VARIANTS.find((v) => v.id === quote?.variantId);
    if (matchedVariant) {
      const matchedModel = INITIAL_MODELS.find((m) => m.id === matchedVariant.modelId);
      return matchedModel?.imageUrl || null;
    }
    return null;
  })();

  return (
    <div className="min-h-screen flex flex-col bg-brand-bg text-brand-black">
      <Header />
      <main className="flex-grow py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          
          <div className="text-center max-w-xl mx-auto">
            <h1 className="text-3xl font-black text-brand-black">
              Schedule Fast Doorstep Pickup
            </h1>
            <p className="text-xs text-brand-muted mt-1">
              Complete your pickup address and select a convenient time slot
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
            
            {/* ORDER FORM */}
            <form onSubmit={handleConfirmOrder} className="md:col-span-8 space-y-6">
              
              {/* STEP 1: SERVICEABILITY PIN CHECK */}
              <div className="bg-white rounded-3xl p-6 border border-brand-border shadow-subtleCard space-y-4">
                <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-brand-yellow shrink-0" />
                    <h2 className="text-base font-bold text-brand-black">1. Pickup PIN Code & Serviceability <span className="text-red-500">*</span></h2>
                  </div>
                  <span className="text-[11px] font-semibold text-gray-500 bg-gray-100 px-2.5 py-1 rounded-full">
                    {SERVICEABLE_DISTRICTS.length} Districts Serviced
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <input
                    type="text"
                    required
                    value={pincode}
                    onChange={handlePincodeChange}
                    maxLength={6}
                    placeholder="Enter 6-digit PIN code *"
                    className={`w-52 px-3.5 py-2.5 text-xs font-bold rounded-xl border focus:outline-none transition-colors ${
                      serviceStatus === "AVAILABLE"
                        ? "border-green-500 bg-green-50/30 text-green-900 focus:border-green-600"
                        : serviceStatus === "UNAVAILABLE"
                        ? "border-red-400 bg-red-50/30 text-red-900 focus:border-red-500"
                        : "border-brand-border bg-white text-brand-black focus:border-brand-yellow"
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => checkPincode()}
                    className="px-5 py-2.5 bg-brand-black text-white text-xs font-bold rounded-xl hover:bg-brand-dark transition-colors shadow-sm"
                  >
                    Check Serviceability
                  </button>
                </div>

                {serviceStatus === "AVAILABLE" && (
                  <div className="bg-green-50/90 border border-green-200 rounded-2xl p-4 flex items-start gap-3 animate-fadeIn">
                    <div className="w-8 h-8 rounded-xl bg-green-100 flex items-center justify-center shrink-0 text-green-700">
                      <CheckCircle2 className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-xs font-extrabold text-green-900">
                        Doorstep Pickup Available!
                      </h3>
                      <p className="text-xs text-green-800 mt-0.5">
                        CashALL doorstep pickup is active in <strong className="font-bold">{city}, {selectedState}</strong> (PIN: <span className="font-mono font-bold">{pincode}</span>). Free doorstep verification & instant payment.
                      </p>
                    </div>
                  </div>
                )}

                {serviceStatus === "UNAVAILABLE" && (
                  <div className="bg-gradient-to-br from-red-50/90 to-amber-50/60 border border-red-200/90 rounded-2xl p-4 space-y-3.5 animate-fadeIn">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-xl bg-red-100 flex items-center justify-center shrink-0 text-red-600">
                        <AlertCircle className="w-5 h-5" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-sm font-extrabold text-red-900">
                          We Don&apos;t Serve Here Yet
                        </h3>
                        <p className="text-xs text-red-700 mt-0.5 leading-relaxed">
                          Sorry! CashALL doorstep pickup is currently not available for PIN code <strong className="font-mono font-bold underline decoration-red-400">{pincode || "entered"}</strong>.
                        </p>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-red-200/60">
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-xs font-black text-brand-black flex items-center gap-1.5">
                          <MapPin className="w-4 h-4 text-brand-yellow" />
                          <span>Our Servicable Districts ({SERVICEABLE_DISTRICTS.length}):</span>
                        </p>
                        <span className="text-[10px] text-gray-500 font-medium">Click a district to view PINs</span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        {SERVICEABLE_DISTRICTS.map((dist) => {
                          const isExpanded = expandedDistrict === dist.id;
                          return (
                            <div
                              key={dist.id}
                              className="bg-white/95 border border-red-200/70 hover:border-brand-yellow/60 rounded-xl p-3 shadow-xs transition-all"
                            >
                              <div className="flex items-center justify-between">
                                <div>
                                  <span className="text-xs font-black text-brand-black block">{dist.name}</span>
                                  <span className="text-[11px] text-gray-500">{dist.state}</span>
                                </div>
                                <button
                                  type="button"
                                  onClick={() => setExpandedDistrict(isExpanded ? null : dist.id)}
                                  className="text-[10px] font-extrabold px-2.5 py-1 bg-neutral-100 hover:bg-brand-yellow hover:text-brand-black text-gray-700 rounded-lg transition-colors flex items-center gap-1"
                                >
                                  <span>View Areas</span>
                                  {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                                </button>
                              </div>

                              {isExpanded && (
                                <div className="mt-2.5 pt-2.5 border-t border-gray-100 max-h-32 overflow-y-auto pr-1">
                                  <p className="text-[10px] text-gray-500 font-medium mb-1.5">Direct Doorstep Hubs in {dist.name}:</p>
                                  <div className="flex flex-wrap gap-1">
                                    {dist.pincodes.map((pin) => (
                                      <span
                                        key={pin}
                                        className="px-1.5 py-0.5 text-[10px] font-mono font-medium bg-neutral-100 text-gray-600 rounded"
                                      >
                                        {pin}
                                      </span>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* STEP 2: ADDRESS DETAILS */}
              <div className="bg-white rounded-3xl p-6 border border-brand-border shadow-subtleCard space-y-4">
                <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                  <div className="flex items-center gap-2">
                    <Building className="w-5 h-5 text-brand-yellow shrink-0" />
                    <h2 className="text-base font-bold text-brand-black">2. Pickup Address</h2>
                  </div>
                  {hasPrefilledAddress && (
                    <span className="text-[11px] font-bold text-green-700 bg-green-100 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Auto-Prefilled
                    </span>
                  )}
                </div>

                {hasPrefilledAddress && (
                  <div className="p-3 rounded-2xl bg-green-50 border border-green-200 text-green-800 text-xs flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 shrink-0 text-green-600" />
                    <span>Your pickup address and contact details have been automatically pre-filled from your previous order! You can edit any field below.</span>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-brand-black mb-1">
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Customer Name"
                      required
                      className="w-full px-3 py-2 text-xs bg-white rounded-xl border border-brand-border focus:outline-none focus:border-brand-yellow"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-brand-black mb-1">
                      Phone Number <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="10-Digit Mobile"
                      required
                      className="w-full px-3 py-2 text-xs bg-white rounded-xl border border-brand-border focus:outline-none focus:border-brand-yellow"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-brand-black mb-1">
                      Email Address <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="e.g. customer@gmail.com"
                      required
                      className="w-full px-3 py-2 text-xs bg-white rounded-xl border border-brand-border focus:outline-none focus:border-brand-yellow"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-brand-black mb-1">
                      Address Line 1 <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={line1}
                      onChange={(e) => setLine1(e.target.value)}
                      placeholder="e.g. Flat 402, Sunshine Heights, MG Road"
                      required
                      className="w-full px-3 py-2 text-xs bg-white rounded-xl border border-brand-border focus:outline-none focus:border-brand-yellow font-medium"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-brand-black mb-1">
                      Address Line 2 <span className="text-gray-400 font-normal">(Optional)</span>
                    </label>
                    <input
                      type="text"
                      value={line2}
                      onChange={(e) => setLine2(e.target.value)}
                      placeholder="e.g. Near Liluah Station / Shibpur Bazaar"
                      className="w-full px-3 py-2 text-xs bg-white rounded-xl border border-brand-border focus:outline-none focus:border-brand-yellow font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-brand-black mb-1">
                      State / Union Territory <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={selectedState}
                      onChange={(e) => setSelectedState(e.target.value)}
                      required
                      className="w-full px-3 py-2 text-xs bg-white rounded-xl border border-brand-border focus:outline-none focus:border-brand-yellow font-bold text-brand-black cursor-pointer"
                    >
                      {selectedState && !ALL_INDIAN_STATES.includes(selectedState) && (
                        <option value={selectedState}>{selectedState}</option>
                      )}
                      {ALL_INDIAN_STATES.map((st) => (
                        <option key={st} value={st}>
                          {st}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-brand-black mb-1">
                      PIN Code <span className="text-red-500">*</span>
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={pincode}
                        readOnly
                        className="w-full px-3 py-2 text-xs bg-gray-50 rounded-xl border border-brand-border text-brand-black font-mono font-bold cursor-not-allowed"
                      />
                      <span className="text-[10px] font-bold text-green-700 bg-green-100 px-2 py-1 rounded-lg shrink-0">
                        Serviced ✓
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* STEP 3: PICKUP SLOT */}
              <div className="bg-white rounded-3xl p-6 border border-brand-border shadow-subtleCard space-y-4">
                <div className="flex items-center gap-2 border-b border-gray-100 pb-3">
                  <Calendar className="w-5 h-5 text-brand-yellow shrink-0" />
                  <h2 className="text-base font-bold text-brand-black">3. Pickup Date & Time Slot</h2>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-xs font-bold text-brand-black">Select Date</label>
                    <span className="text-xs font-bold text-brand-blue bg-brand-blue/10 px-2.5 py-0.5 rounded-full">
                      {pickupDate}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {getPickupDatePresets().map((preset) => {
                      const isSelected = !isCustomDate && (pickupDate === preset.value || pickupDate.toLowerCase().includes(preset.key.toLowerCase()));
                      return (
                        <button
                          type="button"
                          key={preset.key}
                          onClick={() => {
                            setPickupDate(preset.value);
                            setIsCustomDate(false);
                          }}
                          className={`p-2.5 sm:p-3 rounded-xl border text-xs font-bold text-center transition-all flex flex-col items-center justify-center gap-0.5 ${
                            isSelected
                              ? "border-brand-yellow bg-brand-yellow/15 text-brand-black shadow-sm ring-1 ring-brand-yellow/50"
                              : "border-brand-border bg-white text-gray-600 hover:border-gray-300"
                          }`}
                        >
                          <span className="font-extrabold">{preset.label}</span>
                          <span className={`text-[10px] ${isSelected ? "text-brand-black/80 font-semibold" : "text-gray-400"}`}>
                            {preset.subLabel}
                          </span>
                        </button>
                      );
                    })}
                    <button
                      type="button"
                      onClick={() => setIsCustomDate(true)}
                      className={`p-2.5 sm:p-3 rounded-xl border text-xs font-bold text-center transition-all flex flex-col items-center justify-center gap-0.5 ${
                        isCustomDate
                          ? "border-brand-yellow bg-brand-yellow/15 text-brand-black shadow-sm ring-1 ring-brand-yellow/50"
                          : "border-brand-border bg-white text-gray-600 hover:border-gray-300"
                      }`}
                    >
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-brand-yellow" />
                        <span className="font-extrabold">Custom Date</span>
                      </div>
                      <span className={`text-[10px] ${isCustomDate ? "text-brand-black/80 font-semibold" : "text-gray-400"}`}>
                        Choose Date
                      </span>
                    </button>
                  </div>

                  {isCustomDate && (
                    <div className="mt-3 p-3 bg-brand-bg rounded-2xl border border-brand-border animate-in fade-in duration-200">
                      <label className="block text-[11px] font-bold text-gray-600 mb-1.5">
                        Pick Any Upcoming Preferred Date:
                      </label>
                      <input
                        type="date"
                        min={getMinCalendarDateISO()}
                        value={customDateInput}
                        onChange={(e) => {
                          const val = e.target.value;
                          setCustomDateInput(val);
                          if (val) {
                            const d = new Date(val);
                            if (!isNaN(d.getTime())) {
                              const recorded = getRecordedPickupDate(d);
                              setPickupDate(recorded);
                            }
                          }
                        }}
                        className="w-full px-3.5 py-2.5 bg-white border border-brand-border rounded-xl text-xs font-bold text-brand-black focus:outline-none focus:border-brand-yellow shadow-sm cursor-pointer"
                      />
                    </div>
                  )}
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-xs font-bold text-brand-black">Select Time Window</label>
                    {getAvailableTimeSlotsForDate(pickupDate).length > 0 && (
                      <span className="text-[11px] text-gray-500 font-semibold">
                        {getAvailableTimeSlotsForDate(pickupDate).length} slot{getAvailableTimeSlotsForDate(pickupDate).length > 1 ? "s" : ""} available
                      </span>
                    )}
                  </div>
                  {getAvailableTimeSlotsForDate(pickupDate).length > 0 ? (
                    <div className={`grid gap-2.5 sm:gap-3 ${
                      getAvailableTimeSlotsForDate(pickupDate).length === 1
                        ? "grid-cols-1 sm:grid-cols-2"
                        : getAvailableTimeSlotsForDate(pickupDate).length === 2
                        ? "grid-cols-2"
                        : "grid-cols-3"
                    }`}>
                      {getAvailableTimeSlotsForDate(pickupDate).map((slot) => (
                        <button
                          type="button"
                          key={slot}
                          onClick={() => setPickupSlot(slot)}
                          className={`p-3 rounded-xl border text-xs font-bold text-center transition-all ${
                            pickupSlot === slot
                              ? "border-brand-yellow bg-brand-yellow/15 text-brand-black shadow-sm ring-1 ring-brand-yellow/50"
                              : "border-brand-border bg-white text-gray-600 hover:border-gray-300"
                          }`}
                        >
                          {slot}
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-2xl text-center text-xs text-amber-900 font-bold space-y-1">
                      <p>⚠️ All doorstep pickup slots for today are closed.</p>
                      <p className="text-[11px] text-amber-700 font-medium">Please select Tomorrow or a preferred upcoming date above.</p>
                    </div>
                  )}
                </div>
              </div>

              {/* STEP 4: PREFERRED PAYOUT CHOICE */}
              <div className="bg-white rounded-3xl p-6 border border-brand-border shadow-subtleCard space-y-4">
                <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                  <div className="flex items-center gap-2">
                    <Wallet className="w-5 h-5 text-brand-yellow shrink-0" />
                    <h2 className="text-base font-bold text-brand-black">4. Preferred Payout Choice <span className="text-red-500">*</span></h2>
                  </div>
                  <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                    Instant Spot Credit
                  </span>
                </div>

                <p className="text-xs text-slate-500 font-medium">
                  Select how you would like to receive your spot payment during doorstep inspection:
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {/* UPI OPTION */}
                  <label
                    className={`p-4 rounded-2xl border-2 cursor-pointer transition-all flex flex-col justify-between ${
                      payoutMethod === "UPI"
                        ? "border-emerald-600 bg-emerald-50/40 ring-2 ring-emerald-500/20 shadow-sm"
                        : "border-slate-200 bg-white hover:border-slate-300"
                    }`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="w-9 h-9 rounded-xl bg-emerald-100/70 text-emerald-700 flex items-center justify-center">
                        <QrCode className="w-5 h-5" />
                      </div>
                      <input
                        type="radio"
                        name="payout"
                        value="UPI"
                        checked={payoutMethod === "UPI"}
                        onChange={() => setPayoutMethod("UPI")}
                        className="accent-emerald-600 cursor-pointer"
                      />
                    </div>
                    <div>
                      <div className="text-xs font-extrabold text-slate-900">Direct UPI Transfer</div>
                      <div className="text-[11px] text-slate-500 mt-0.5">GPay, PhonePe, Paytm, BHIM</div>
                    </div>
                  </label>

                  {/* BANK TRANSFER OPTION */}
                  <label
                    className={`p-4 rounded-2xl border-2 cursor-pointer transition-all flex flex-col justify-between ${
                      payoutMethod === "BANK_TRANSFER"
                        ? "border-emerald-600 bg-emerald-50/40 ring-2 ring-emerald-500/20 shadow-sm"
                        : "border-slate-200 bg-white hover:border-slate-300"
                    }`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="w-9 h-9 rounded-xl bg-blue-100/70 text-blue-700 flex items-center justify-center">
                        <CreditCard className="w-5 h-5" />
                      </div>
                      <input
                        type="radio"
                        name="payout"
                        value="BANK_TRANSFER"
                        checked={payoutMethod === "BANK_TRANSFER"}
                        onChange={() => setPayoutMethod("BANK_TRANSFER")}
                        className="accent-emerald-600 cursor-pointer"
                      />
                    </div>
                    <div>
                      <div className="text-xs font-extrabold text-slate-900">Direct Bank IMPS</div>
                      <div className="text-[11px] text-slate-500 mt-0.5">Instant NEFT/IMPS to Account</div>
                    </div>
                  </label>

                  {/* BRAND GIFT CARD WITH BONUS */}
                  <label
                    className={`p-4 rounded-2xl border-2 cursor-pointer transition-all flex flex-col justify-between ${
                      payoutMethod === "GIFT_CARD"
                        ? "border-amber-500 bg-amber-50/40 ring-2 ring-amber-500/20 shadow-sm"
                        : "border-slate-200 bg-white hover:border-slate-300"
                    }`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="w-9 h-9 rounded-xl bg-amber-100/80 text-amber-700 flex items-center justify-center">
                        <Gift className="w-5 h-5" />
                      </div>
                      <span className="text-[9px] font-black uppercase tracking-wider bg-amber-500 text-slate-950 px-1.5 py-0.5 rounded">
                        +5% Bonus
                      </span>
                    </div>
                    <div>
                      <div className="text-xs font-extrabold text-slate-900">Brand e-Gift Card</div>
                      <div className="text-[11px] text-amber-700 font-semibold mt-0.5">
                        +₹{Math.round((quote?.estimatedPrice || 30000) * 0.05).toLocaleString("en-IN")} Extra Value!
                      </div>
                    </div>
                  </label>
                </div>

                {/* PAYOUT DETAIL INPUT (CONDITIONAL) */}
                {payoutMethod === "UPI" && (
                  <div className="pt-2 animate-fadeIn">
                    <label className="block text-xs font-bold text-slate-900 mb-1">
                      UPI ID (Virtual Payment Address) <span className="text-slate-400 font-normal">(Optional now, can be verified on-site)</span>
                    </label>
                    <input
                      type="text"
                      value={upiId}
                      onChange={(e) => setUpiId(e.target.value)}
                      placeholder="e.g., yourname@okhdfcbank or 9876543210@paytm"
                      className="w-full px-3.5 py-2.5 text-xs bg-slate-50 rounded-xl border border-slate-200 focus:outline-none focus:border-slate-900 font-mono font-medium"
                    />
                  </div>
                )}

                {payoutMethod === "BANK_TRANSFER" && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 animate-fadeIn">
                    <div>
                      <label className="block text-xs font-bold text-slate-900 mb-1">Bank Account Number</label>
                      <input
                        type="text"
                        value={bankAccount}
                        onChange={(e) => setBankAccount(e.target.value)}
                        placeholder="e.g., 50100234567890"
                        className="w-full px-3.5 py-2.5 text-xs bg-slate-50 rounded-xl border border-slate-200 focus:outline-none focus:border-slate-900 font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-900 mb-1">IFSC Code</label>
                      <input
                        type="text"
                        value={bankIfsc}
                        onChange={(e) => setBankIfsc(e.target.value.toUpperCase())}
                        placeholder="e.g., HDFC0001234"
                        className="w-full px-3.5 py-2.5 text-xs bg-slate-50 rounded-xl border border-slate-200 focus:outline-none focus:border-slate-900 font-mono uppercase"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* STEP 5: SECURITY REASSURANCE CHECK & SELLER DECLARATION */}
              <div className="bg-white rounded-3xl p-6 border border-brand-border shadow-subtleCard space-y-4">
                <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
                    <h2 className="text-base font-bold text-brand-black">5. Security Reassurance &amp; Legal Affirmation <span className="text-red-500">*</span></h2>
                  </div>
                  <span className="text-[11px] font-bold text-gray-500 bg-gray-100 px-2.5 py-0.5 rounded-full">
                    Zero-Risk Handover
                  </span>
                </div>

                {/* SECURITY REASSURANCE PROMPT BOX */}
                <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200 space-y-2">
                  <div className="flex items-center gap-2 text-xs font-extrabold text-emerald-950">
                    <Lock className="w-4 h-4 text-emerald-600" />
                    <span>Security Reassurance Check Before Pickup</span>
                  </div>
                  <p className="text-xs text-emerald-900 leading-relaxed font-medium">
                    Please back up your device and sign out of your iCloud, Google, or Samsung Account. Our certified CashALL agent will securely perform an on-site data wipe in your presence before device handover.
                  </p>
                  <label className="flex items-center gap-2.5 pt-1 cursor-pointer">
                    <input
                      type="checkbox"
                      required
                      checked={securityChecked}
                      onChange={(e) => setSecurityChecked(e.target.checked)}
                      className="w-4 h-4 accent-emerald-600 rounded cursor-pointer shrink-0"
                    />
                    <span className="text-xs font-bold text-emerald-950">
                      I understand that personal accounts must be signed out, and CashALL will conduct an on-site certified wipe.
                    </span>
                  </label>
                </div>

                <div className="space-y-3.5 pt-1">
                  {/* Statutory Affirmation Box */}
                  <div className="bg-neutral-50 rounded-2xl p-4 border border-brand-border text-xs text-brand-muted space-y-2 leading-relaxed">
                    <p className="font-bold text-brand-black">
                      Pursuant to the Indian Contract Act, 1872, the DPDP Act 2023, and recommerce regulations, CashALL (operated by Aarna Enterprise) purchases pre-owned devices directly from lawful owners.
                    </p>
                    <ul className="list-disc pl-4 space-y-1 text-[11px]">
                      <li>You declare you are the lawful, authorized owner with unrestricted right to sell.</li>
                      <li>The device is not stolen, lost, or subject to EMI financing claims, liens, or telecommunication blacklisting.</li>
                      <li>Your personal data &amp; KYC details are processed strictly in compliance with the Digital Personal Data Protection (DPDP) Act 2023.</li>
                      <li>The online quote is an automated estimate; final purchase price is confirmed after physical inspection.</li>
                      <li>You retain full right to decline any revised valuation at doorstep with <strong className="text-brand-black font-bold">₹0 cancellation fee</strong>.</li>
                    </ul>
                    <button
                      type="button"
                      onClick={() => setShowAgreementModal(true)}
                      className="text-[11px] font-bold text-brand-blue underline hover:text-blue-800 pt-1 block"
                    >
                      Read Complete Used Device Purchase Agreement &rarr;
                    </button>
                  </div>

                  {/* Mandatory Affirmative Consent Checkbox */}
                  <label className="flex items-start gap-3 p-3.5 bg-brand-bg rounded-2xl border border-brand-border cursor-pointer hover:border-brand-yellow transition-all">
                    <input
                      type="checkbox"
                      required
                      checked={termsAccepted}
                      onChange={(e) => setTermsAccepted(e.target.checked)}
                      className="w-4 h-4 mt-0.5 accent-brand-yellow rounded shrink-0 cursor-pointer"
                    />
                    <span className="text-xs text-brand-black leading-snug">
                      <strong className="font-bold text-brand-black">Mandatory:</strong> I confirm that I am the lawful owner with authority to sell this device, consent to personal data and KYC processing under the DPDP Act 2023 for doorstep evaluation, and agree to the{" "}
                      <Link href="/seller-terms" target="_blank" className="font-bold underline text-brand-black hover:text-brand-blue">
                        Seller Terms
                      </Link>
                      {" "}and{" "}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setShowAgreementModal(true);
                        }}
                        className="font-bold underline text-brand-black hover:text-brand-blue"
                      >
                        Used Device Purchase Agreement
                      </button>
                      .
                    </span>
                  </label>

                  {/* Optional Separate Marketing Consent Checkbox */}
                  <label className="flex items-start gap-3 p-3 rounded-2xl border border-gray-100 cursor-pointer hover:bg-gray-50 transition-all">
                    <input
                      type="checkbox"
                      checked={marketingAccepted}
                      onChange={(e) => setMarketingAccepted(e.target.checked)}
                      className="w-4 h-4 mt-0.5 accent-brand-yellow rounded shrink-0 cursor-pointer"
                    />
                    <span className="text-[11px] text-gray-500 leading-snug">
                      (Optional) Send me high-value buyback offers, price drop alerts, and order updates via WhatsApp &amp; SMS.
                    </span>
                  </label>
                </div>
              </div>

              <Button
                type="submit"
                variant="primary"
                size="lg"
                fullWidth
                disabled={isSubmitting}
                className="font-black text-base py-4 gap-2 shadow-yellowGlow"
              >
                <span>{isSubmitting ? "Confirming Order..." : "CONFIRM FAST PICKUP"}</span>
                <ArrowRight className="w-5 h-5" />
              </Button>

            </form>

            {/* SIDEBAR SUMMARY */}
            <div className="md:col-span-4 space-y-6">
              <div className="bg-white rounded-3xl p-6 border border-brand-border shadow-subtleCard space-y-4">
                <h3 className="text-sm font-black text-brand-black border-b border-gray-100 pb-3">
                  Selling Order Summary
                </h3>

                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center p-1 border border-gray-100 shrink-0">
                      {sidebarImageUrl ? (
                        <Image src={sidebarImageUrl} alt={sidebarDeviceName} width={32} height={32} className="object-contain max-h-8" />
                      ) : (
                        <Truck className="w-5 h-5 text-gray-400" />
                      )}
                    </div>
                    <div>
                      <div className="text-xs font-extrabold text-brand-black">
                        {sidebarDeviceName}
                      </div>
                      {sidebarStorage && <div className="text-[11px] text-brand-muted">{sidebarStorage} Storage</div>}
                    </div>
                  </div>

                  <div className="pt-3 border-t border-gray-100 flex items-center justify-between text-xs font-extrabold">
                    <span>Estimated Payout</span>
                    <span className="text-base font-price text-brand-black">
                      ₹{(quote?.estimatedPrice || 31400).toLocaleString("en-IN")}
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-brand-black text-white rounded-3xl p-6 border border-neutral-800 space-y-3 text-xs">
                <div className="flex items-center gap-2 text-brand-yellow font-bold">
                  <ShieldCheck className="w-4 h-4" />
                  <span>CashALL Assurance</span>
                </div>
                <p className="text-gray-400 leading-relaxed text-[11px]">
                  Fast doorstep pickup with assisted factory data wipe. Direct instant payout upon physical verification.
                </p>
              </div>
            </div>

          </div>

        </div>
      </main>
      <Footer />
    </div>
  );
}

export default function PickupCheckoutPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-brand-bg text-brand-black text-xs font-bold">Loading Pickup Form...</div>}>
      <PickupCheckoutContent />
    </Suspense>
  );
}
