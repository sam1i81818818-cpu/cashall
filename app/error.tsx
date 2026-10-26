"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, RefreshCcw, Home, Phone, MessageSquare } from "lucide-react";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log unexpected frontend crash to console for observability
    console.error("CashALL Application Error Boundary caught:", error);
  }, [error]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-brand-bg text-brand-black p-4 sm:p-6">
      <div className="max-w-md w-full bg-white rounded-3xl p-6 sm:p-8 border border-brand-border shadow-premium text-center space-y-6">
        
        {/* ICON */}
        <div className="w-16 h-16 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto border border-amber-200 shadow-sm">
          <AlertTriangle className="w-8 h-8 text-amber-600" />
        </div>

        {/* HEADINGS */}
        <div className="space-y-2">
          <h1 className="text-xl sm:text-2xl font-black text-brand-black tracking-tight">
            Something went wrong
          </h1>
          <p className="text-xs sm:text-sm text-brand-muted leading-relaxed">
            An unexpected error occurred while loading this page. Our engineering team has been notified.
          </p>
        </div>

        {/* ACTIONS */}
        <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
          <button
            onClick={() => reset()}
            className="w-full sm:flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-brand-yellow text-brand-black font-extrabold text-xs sm:text-sm hover:bg-brand-yellowHover transition shadow-yellowGlow active:scale-95"
          >
            <RefreshCcw className="w-4 h-4" />
            Try Again
          </button>

          <Link
            href="/"
            className="w-full sm:flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-white border border-brand-border text-brand-black font-bold text-xs sm:text-sm hover:bg-gray-50 transition active:scale-95 shadow-subtleCard"
          >
            <Home className="w-4 h-4" />
            Home
          </Link>
        </div>

        {/* DIRECT HUMAN ASSISTANCE */}
        <div className="pt-4 border-t border-brand-border/60 text-xs text-brand-muted space-y-2">
          <p className="font-semibold text-brand-black">Need immediate help with an active order?</p>
          <div className="flex items-center justify-center gap-4 pt-1">
            <a
              href="tel:+917604092333"
              className="inline-flex items-center gap-1.5 text-brand-black font-bold hover:underline"
            >
              <Phone className="w-3.5 h-3.5 text-brand-muted" />
              Call Support
            </a>
            <span className="text-gray-300">•</span>
            <a
              href="https://wa.me/917604092333?text=Hi%20CashALL,%20I%20faced%20an%20error%20on%20the%20website."
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-emerald-600 font-bold hover:underline"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              WhatsApp Us
            </a>
          </div>
        </div>

      </div>
    </div>
  );
}
