"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Cookie, X } from "lucide-react";

export function CookieConsentBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      const consent = localStorage.getItem("cashall_cookie_consent");
      if (!consent) {
        // Small delay so it doesn't pop aggressively on initial paint
        const timer = setTimeout(() => setVisible(true), 1200);
        return () => clearTimeout(timer);
      }
    } catch {
      // Ignore localStorage access restrictions
    }
  }, []);

  const handleAccept = () => {
    try {
      localStorage.setItem("cashall_cookie_consent", "accepted");
    } catch {}
    setVisible(false);
  };

  const handleDecline = () => {
    try {
      localStorage.setItem("cashall_cookie_consent", "essential_only");
    } catch {}
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <aside
      aria-label="Cookie and Privacy Consent"
      className="fixed bottom-4 left-4 right-4 md:left-auto md:right-6 md:max-w-md z-50 animate-in fade-in slide-in-from-bottom-5 duration-300"
    >
      <div className="bg-brand-black/95 backdrop-blur-md text-white p-4 sm:p-5 rounded-2xl border border-white/10 shadow-2xl space-y-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-brand-yellow/20 text-brand-yellow flex items-center justify-center shrink-0">
              <Cookie className="w-4 h-4 text-brand-yellow" />
            </div>
            <h4 className="text-xs sm:text-sm font-bold text-white">Privacy & Cookies</h4>
          </div>
          <button
            onClick={handleDecline}
            aria-label="Close cookie banner"
            className="text-white/60 hover:text-white transition-colors p-1"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <p className="text-[11px] sm:text-xs text-white/70 leading-relaxed">
          We use cookies and telemetry to guarantee accurate device quotes, prevent fraud, and facilitate doorstep pickups.
          Learn more in our{" "}
          <Link href="/privacy" className="text-brand-yellow hover:underline font-medium">
            Privacy Policy
          </Link>{" "}
          and{" "}
          <Link href="/cookie-policy" className="text-brand-yellow hover:underline font-medium">
            Cookie Policy
          </Link>
          .
        </p>

        <div className="flex items-center gap-2 pt-1">
          <button
            onClick={handleAccept}
            className="flex-1 py-2 px-3 text-xs font-black bg-brand-yellow text-brand-black rounded-xl hover:bg-brand-yellowHover transition shadow-sm active:scale-95"
          >
            Accept All
          </button>
          <button
            onClick={handleDecline}
            className="py-2 px-3 text-xs font-medium text-white/80 hover:text-white border border-white/20 rounded-xl hover:bg-white/5 transition"
          >
            Essential Only
          </button>
        </div>
      </div>
    </aside>
  );
}
