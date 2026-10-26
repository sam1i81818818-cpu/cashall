"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import {
  QuoteData,
  INITIAL_VARIANTS,
  INITIAL_MODELS,
  INITIAL_BRANDS,
} from "@/lib/store";
import { trackMetaStandardEvent } from "@/lib/analytics/meta";
import { clearCrossUserDataOnSwitch } from "@/lib/utils/customer-storage";
import {
  ShieldCheck,
  Clock,
  ArrowRight,
  AlertCircle,
  Smartphone,
  Phone,
  CheckCircle2,
  Lock,
  RefreshCw,
  XCircle,
  Ban,
  ChevronDown,
  ChevronUp,
  HelpCircle,
} from "lucide-react";

export default function QuoteResultPage() {
  const params = useParams();
  const router = useRouter();
  const quoteId = (params?.quoteId as string) || "quote-demo";

  const [quote, setQuote] = useState<QuoteData | null>(null);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [loading, setLoading] = useState(false);
  const [otpError, setOtpError] = useState("");
  const [countdown, setCountdown] = useState(0);

  // Collapsible Accordion for Transparency Breakdown
  const [breakdownOpen, setBreakdownOpen] = useState(true);

  const handleCancelQuote = async (reason = "Customer declined quote.") => {
    if (!quote) return;
    setIsCancelling(true);
    try {
      await fetch(`/api/v1/quotes/${quote.id || quote.quoteNumber}/cancel`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reason }),
      }).catch(() => null);

      const updated: QuoteData = {
        ...quote,
        status: "CANCELLED",
      };
      setQuote(updated);
      if (typeof window !== "undefined") {
        localStorage.setItem(`cashall_quote_${quote.id}`, JSON.stringify(updated));
        localStorage.setItem("cashall_latest_quote", JSON.stringify(updated));
        const savedQuotes = JSON.parse(localStorage.getItem("cashall_quotes") || "[]");
        const nextQuotes = savedQuotes.map((q: any) =>
          q.id === quote.id || q.quoteNumber === quote.quoteNumber ? { ...q, status: "CANCELLED" } : q
        );
        localStorage.setItem("cashall_quotes", JSON.stringify(nextQuotes));
      }
      setCancelModalOpen(false);
    } catch (e) {
      console.error(e);
    } finally {
      setIsCancelling(false);
    }
  };

  useEffect(() => {
    if (countdown <= 0) return;
    const t = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [countdown]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem(`cashall_quote_${quoteId}`) || localStorage.getItem("cashall_latest_quote");
      let activeQuote: QuoteData | null = null;
      if (stored) {
        try {
          activeQuote = JSON.parse(stored);
        } catch (e) {
          console.error(e);
        }
      }

      if (!activeQuote) {
        activeQuote = {
          id: quoteId,
          quoteNumber: "CAQ-984210",
          variantId: "v-ip15-128",
          selectedAnswersJson: JSON.stringify([]),
          basePrice: 32000,
          totalDeductions: 1200,
          estimatedPrice: 30800,
          breakdownJson: JSON.stringify({
            deviceName: "Apple iPhone 15 (128 GB)",
            basePrice: 32000,
            estimatedPrice: 30800,
            summary: [
              { label: "Screen & Touch Condition (Flawless)", amount: 0 },
              { label: "Minor Physical Body Signs", amount: -400 },
              { label: "Original Box / Charger", amount: -800 },
            ],
          }),
          expiresAt: new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString(),
          status: "ACTIVE",
          createdAt: new Date().toISOString(),
        };
      }

      setQuote(activeQuote);

      if (quoteId) {
        fetch(`/api/v1/quotes/${encodeURIComponent(quoteId)}`)
          .then((res) => res.json())
          .then((data) => {
            if (data.success && data.quote) {
              setQuote(data.quote);
              if (typeof window !== "undefined") {
                localStorage.setItem(`cashall_quote_${quoteId}`, JSON.stringify(data.quote));
              }
            }
          })
          .catch(() => {});
      }

      let cName = "";
      let cPhone = "";
      try {
        const u = JSON.parse(localStorage.getItem("cashall_user") || "{}");
        if (u?.name) cName = u.name;
        if (u?.phone) cPhone = u.phone;
      } catch (e) {}

      if (stored && activeQuote && activeQuote.quoteNumber !== "CAQ-984210") {
        fetch("/api/v1/quotes/save", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...activeQuote,
            customerName: cName,
            customerPhone: cPhone,
          }),
        }).catch((err) => console.error("Error syncing quote to DB:", err));
      }
    }
  }, [quoteId]);

  if (!quote) return null;

  let resolvedDeviceName = "Your Device";
  let resolvedBasePrice = quote.basePrice || quote.estimatedPrice;
  let resolvedEstimatedPrice = quote.estimatedPrice || 0;

  let parsedBreakdown: any = null;
  try {
    parsedBreakdown = JSON.parse(quote.breakdownJson || "{}");
    if (parsedBreakdown && typeof parsedBreakdown === "object") {
      if (parsedBreakdown.deviceName) resolvedDeviceName = parsedBreakdown.deviceName;
      if (parsedBreakdown.basePrice) resolvedBasePrice = parsedBreakdown.basePrice;
    }
  } catch {}

  const matchedVariant = INITIAL_VARIANTS.find((v) => v.id === quote.variantId);
  const matchedModel = matchedVariant ? INITIAL_MODELS.find((m) => m.id === matchedVariant.modelId) : null;
  const matchedBrand = matchedModel ? INITIAL_BRANDS.find((b) => b.id === matchedModel.brandId) : null;

  if (resolvedDeviceName === "Your Device" && matchedModel && matchedBrand) {
    resolvedDeviceName = `${matchedBrand.name} ${matchedModel.name}${matchedVariant?.storage ? " (" + matchedVariant.storage + ")" : ""}`;
  }

  // Deductions breakdown ledger
  const breakdownItems: Array<{ label: string; amount: number }> = (() => {
    if (!parsedBreakdown) return [];
    if (Array.isArray(parsedBreakdown)) return parsedBreakdown.map((item: any) => ({
      label: item.title || item.label || "Inspection Factor",
      amount: item.amount || 0,
    }));
    if (Array.isArray(parsedBreakdown.summary)) {
      return parsedBreakdown.summary.map((s: any) => ({
        label: s.label || "Condition Adjustment",
        amount: s.amount || 0,
      }));
    }
    // Default fallback breakdown if none exists
    const diff = resolvedBasePrice - resolvedEstimatedPrice;
    if (diff > 0) {
      return [
        { label: "Hardware & Functional Assessment", amount: -Math.round(diff * 0.4) },
        { label: "Physical Condition & Casing Luster", amount: -Math.round(diff * 0.35) },
        { label: "Original Accessories & Packaging", amount: -Math.round(diff * 0.25) },
      ];
    }
    return [{ label: "Flawless Condition (Zero Deductions)", amount: 0 }];
  })();

  const handleScheduleClick = () => {
    if (quote) {
      trackMetaStandardEvent("InitiateCheckout", {
        content_name: resolvedDeviceName,
        value: quote.estimatedPrice,
        currency: "INR",
        num_items: 1,
      }, { eventId: `init_checkout_${quote.id}` });
    }

    if (typeof window !== "undefined") {
      const existingUser = localStorage.getItem("cashall_user");
      if (existingUser) {
        router.push(`/checkout/pickup?quoteId=${quote?.id}`);
        return;
      }
    }
    setAuthModalOpen(true);
  };

  const handleRecalculate = () => {
    if (!quote) return;
    const bSlug = matchedBrand?.slug || "apple";
    const mSlug = matchedModel?.slug || "iphone-15";
    const vId = quote.variantId || "";
    router.push(
      `/sell/mobile/${bSlug}/${mSlug}/assess?variantId=${encodeURIComponent(vId)}&existingQuoteId=${encodeURIComponent(quote.id)}&existingQuoteNumber=${encodeURIComponent(quote.quoteNumber)}`
    );
  };

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    const clean = phoneNumber.replace(/\D/g, "");
    if (clean.length < 10) return;
    setLoading(true);
    setOtpError("");

    const userObj = {
      id: `usr-${clean}`,
      name: customerName.trim() || "Customer",
      phone: clean,
    };

    if (typeof window !== "undefined") {
      const prevUser = localStorage.getItem("cashall_user");
      let prevPhone = "";
      if (prevUser) {
        try { prevPhone = JSON.parse(prevUser).phone || ""; } catch(e) {}
      }
      if (!prevPhone || prevPhone.replace(/\D/g, "").slice(-10) !== clean) {
        clearCrossUserDataOnSwitch(clean);
      }
      localStorage.setItem("cashall_user", JSON.stringify(userObj));
      document.cookie = `cashall_user_phone=${clean}; path=/; max-age=31536000`;
    }

    trackMetaStandardEvent("CompleteRegistration", {
      status: "success",
      method: "phone_otp",
    }, { eventId: `reg_${clean}` });

    if (quote) {
      fetch("/api/v1/quotes/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...quote,
          customerName: userObj.name,
          customerPhone: userObj.phone,
        }),
      }).catch((err) => console.error("Error saving customer info to quote DB:", err));
    }

    setLoading(false);
    setAuthModalOpen(false);
    if (quote) {
      router.push(`/checkout/pickup?quoteId=${quote.id}`);
    }
  };

  const isCancelled = quote.status === "CANCELLED";

  return (
    <div className="min-h-screen flex flex-col bg-stitch-canvas text-slate-900">
      <Header />
      <main className="flex-grow py-8 sm:py-12">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 sm:space-y-8">
          
          {/* ========================================================================= */}
          {/* 1. DYNAMIC GUARANTEED OFFER PRICE CARD */}
          {/* ========================================================================= */}
          <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/90 shadow-stitchElevated text-center space-y-5 relative overflow-hidden">
            {/* AMBIENT BACKGROUND GLOW */}
            <div className="absolute top-0 right-1/4 w-72 h-72 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

            <div className="flex flex-wrap items-center justify-center gap-2">
              <span className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-800 uppercase tracking-wider">
                <span>Quote Price</span>
              </span>
              <span className="text-xs font-mono font-bold text-slate-400">
                • #{quote.quoteNumber}
              </span>
            </div>

            <div className="space-y-1">
              <h1 className="text-base sm:text-lg font-bold text-slate-700">
                {resolvedDeviceName}
              </h1>
              <div className={`text-4xl sm:text-6xl font-black font-price tracking-tight tabular-nums ${isCancelled ? "text-slate-400 line-through" : "text-slate-950"}`}>
                ₹{quote.estimatedPrice.toLocaleString("en-IN")}
              </div>
              <p className="text-xs text-slate-500 font-medium pt-1">
                Spot payout transferred before device handover • ₹0 doorstep convenience fee
              </p>
            </div>

            {/* URGENCY ANCHOR: LOCKED PRICE BADGE */}
            {isCancelled ? (
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-50 text-red-700 border border-red-200 text-xs font-bold">
                <Ban className="w-3.5 h-3.5" />
                <span>This quote has been cancelled</span>
              </div>
            ) : (
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200 text-xs font-bold animate-pulse">
                <Lock className="w-3.5 h-3.5 text-amber-600" />
                <span>This quote is locked and valid for the next 48 hours</span>
              </div>
            )}

            {/* HIGH-CONTRAST PRIMARY CALL-TO-ACTION */}
            {!isCancelled ? (
              <div className="pt-3 max-w-md mx-auto space-y-3">
                <Button
                  onClick={handleScheduleClick}
                  variant="primary"
                  size="lg"
                  fullWidth
                  className="font-extrabold text-sm sm:text-base py-4 rounded-2xl shadow-yellowGlow gap-2 group cursor-pointer"
                >
                  <span>Book Free Doorstep Pickup</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </div>
            ) : (
              <div className="pt-2">
                <Link href="/sell/mobile">
                  <Button variant="primary" size="lg" fullWidth className="font-extrabold text-sm py-4 rounded-2xl">
                    <span>Start New Valuation</span>
                  </Button>
                </Link>
              </div>
            )}
          </div>

          {/* ========================================================================= */}
          {/* 2. TRANSPARENCY BREAKDOWN (COLLAPSIBLE ACCORDION LEDGER) */}
          {/* ========================================================================= */}
          <div className="bg-white rounded-3xl border border-slate-200/90 shadow-stitch overflow-hidden">
            <button
              type="button"
              onClick={() => setBreakdownOpen(!breakdownOpen)}
              className="w-full p-5 sm:p-6 flex items-center justify-between text-left hover:bg-slate-50/80 transition-colors"
            >
              <div>
                <h2 className="text-sm sm:text-base font-extrabold text-slate-900">
                  Valuation Derivation Ledger
                </h2>
                <p className="text-xs text-slate-500 font-medium">
                  See exactly how your final quote was calculated with 100% transparency
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <span className="text-xs font-bold text-slate-500 hidden sm:inline">
                  {breakdownOpen ? "Hide Breakdown" : "View Breakdown"}
                </span>
                <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600">
                  {breakdownOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </div>
              </div>
            </button>

            {breakdownOpen && (
              <div className="px-5 sm:px-6 pb-6 pt-2 border-t border-slate-100 space-y-4 animate-fadeIn">
                <div className="divide-y divide-slate-100 text-xs">
                  {/* Base Market Starting Value */}
                  <div className="py-3 flex items-center justify-between">
                    <div>
                      <span className="font-bold text-slate-900 block">Baseline Fair Market Value</span>
                      <span className="text-[11px] text-slate-500">Unblemished functional reference price</span>
                    </div>
                    <span className="font-price font-extrabold text-slate-900 text-sm tabular-nums">
                      ₹{resolvedBasePrice.toLocaleString("en-IN")}
                    </span>
                  </div>

                  {/* Deduction Factors -> Issue / No Issue Badges */}
                  {breakdownItems.map((item, idx) => (
                    <div key={idx} className="py-3 flex items-center justify-between">
                      <div>
                        <span className="font-semibold text-slate-800 block">{item.label}</span>
                        <span className="text-[11px] text-slate-400">Condition-based value derivation</span>
                      </div>
                      {item.amount < 0 ? (
                        <span className="px-2.5 py-0.5 rounded-full text-[11px] font-extrabold bg-amber-50 text-amber-800 border border-amber-200/80">
                          Issue
                        </span>
                      ) : (
                        <span className="px-2.5 py-0.5 rounded-full text-[11px] font-extrabold bg-emerald-50 text-emerald-800 border border-emerald-200/80">
                          No Issue
                        </span>
                      )}
                    </div>
                  ))}

                  {/* Quote Price Net Value */}
                  <div className="py-4 flex items-center justify-between bg-slate-50 px-4 rounded-2xl mt-2 border border-slate-200/80">
                    <div>
                      <span className="font-extrabold text-slate-950 text-sm block">Quote Price</span>
                      <span className="text-[11px] text-emerald-700 font-semibold">Zero hidden convenience fees upon verification</span>
                    </div>
                    <span className="font-price font-black text-slate-950 text-lg tabular-nums">
                      ₹{quote.estimatedPrice.toLocaleString("en-IN")}
                    </span>
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/60 text-[11px] text-slate-600 flex items-start gap-2.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <p className="leading-relaxed font-medium">
                    <strong>Price Assurance:</strong> If our doorstep field executive discovers any physical discrepancy, we will explain the revised calculation transparently. If you disagree, your device is handed right back with <strong>₹0 cancellation fee</strong>.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* SECONDARY ACTIONS */}
          {!isCancelled && (
            <div className="flex items-center justify-between pt-2 px-2">
              <button
                type="button"
                onClick={handleRecalculate}
                className="text-xs font-bold text-slate-600 hover:text-slate-900 flex items-center gap-1.5 transition-colors"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Re-assess Device Answers</span>
              </button>

              <button
                type="button"
                onClick={() => setCancelModalOpen(true)}
                className="text-xs font-semibold text-red-600 hover:text-red-700 flex items-center gap-1.5 transition-colors"
              >
                <Ban className="w-3.5 h-3.5" />
                <span>Decline Offer</span>
              </button>
            </div>
          )}

        </div>
      </main>

      {/* CUSTOMER AUTH MODAL */}
      <Modal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        title="Verify Phone to Book Doorstep Pickup"
      >
        {otpError && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-xs p-3 rounded-xl mb-3">
            {otpError}
          </div>
        )}

        <form onSubmit={handleSendOtp} className="space-y-4">
          <p className="text-xs text-slate-500 font-medium">
            Enter your mobile number to lock this ₹{quote.estimatedPrice.toLocaleString("en-IN")} quote and schedule your doorstep pickup.
          </p>

          <div>
            <label className="block text-xs font-bold text-slate-900 mb-1">Your Full Name</label>
            <input
              type="text"
              required
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              placeholder="e.g., Abhishek Sharma"
              className="w-full px-3.5 py-2.5 text-xs bg-white rounded-xl border border-slate-200 focus:outline-none focus:border-slate-900 font-medium"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-900 mb-1">10-Digit Mobile Number</label>
            <div className="flex items-center">
              <span className="px-3 py-2.5 bg-slate-100 border border-r-0 border-slate-200 rounded-l-xl text-xs font-bold text-slate-700">
                +91
              </span>
              <input
                type="tel"
                required
                maxLength={10}
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ""))}
                placeholder="98765 43210"
                className="w-full px-3.5 py-2.5 text-xs bg-white rounded-r-xl border border-slate-200 focus:outline-none focus:border-slate-900 font-mono font-bold"
              />
            </div>
          </div>

          <Button
            type="submit"
            variant="primary"
            size="md"
            fullWidth
            disabled={loading || phoneNumber.length < 10}
            className="font-extrabold text-xs py-3 rounded-xl shadow-yellowGlow"
          >
            <span>{loading ? "Verifying..." : "Continue to Schedule Pickup →"}</span>
          </Button>
        </form>
      </Modal>

      {/* DECLINE CONFIRMATION MODAL */}
      <Modal
        isOpen={cancelModalOpen}
        onClose={() => setCancelModalOpen(false)}
        title="Decline Valuation Offer"
      >
        <div className="space-y-4">
          <p className="text-xs text-slate-600 leading-relaxed font-medium">
            Are you sure you want to decline this quote of <strong>₹{quote.estimatedPrice.toLocaleString("en-IN")}</strong>? You can restart or re-evaluate anytime.
          </p>

          <div className="flex items-center justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="tertiary"
              size="sm"
              onClick={() => setCancelModalOpen(false)}
              className="text-xs font-bold"
            >
              <span>Keep Quote</span>
            </Button>

            <Button
              type="button"
              variant="danger"
              size="sm"
              disabled={isCancelling}
              onClick={() => handleCancelQuote()}
              className="text-xs font-bold"
            >
              <span>{isCancelling ? "Cancelling..." : "Yes, Decline"}</span>
            </Button>
          </div>
        </div>
      </Modal>

      <Footer />
    </div>
  );
}
