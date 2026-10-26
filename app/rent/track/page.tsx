"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/Button";
import { Search, Gamepad2, ArrowRight, Truck, Clock, ShieldCheck, ChevronRight } from "lucide-react";
import { AiVerificationBar } from "@/components/common/AiVerificationBar";

export default function RentTrackHubPage() {
  const router = useRouter();
  const [rentalQuery, setRentalQuery] = useState("");
  const [recentRentals, setRecentRentals] = useState<any[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("cashall_ps5_rentals");
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed)) setRecentRentals(parsed.slice(0, 3));
        } catch (e) {}
      }
    }
  }, []);

  const handleTrack = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = rentalQuery.trim().toUpperCase().replace("#", "");
    if (!clean) {
      setError("Please enter your Rental Booking Number or mobile number.");
      return;
    }
    setError("");
    router.push(`/rent/track/${encodeURIComponent(clean)}`);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAFAF9] text-brand-black selection:bg-brand-yellow/30">
      <Header />

      <main className="flex-grow py-10 sm:py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          
          {/* BREADCRUMB */}
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs font-semibold text-neutral-400">
            <Link href="/" className="hover:text-brand-black transition-colors">
              Home
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-neutral-300" />
            <Link href="/rent" className="hover:text-brand-black transition-colors">
              Rentals
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-neutral-300" />
            <span className="text-brand-black font-bold">Track PS5 Rental</span>
          </nav>

          {/* TRACKING HERO CARD */}
          <div className="bg-white rounded-3xl p-8 sm:p-12 border border-neutral-200/90 shadow-[0_4px_30px_-4px_rgba(0,0,0,0.05)] text-center space-y-6">
            <div className="w-16 h-16 rounded-2xl bg-blue-50 border border-blue-200/60 flex items-center justify-center text-blue-600 mx-auto">
              <Gamepad2 className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-700 bg-blue-50 px-3 py-1 rounded-full border border-blue-200/60">
                Live PS5 Rental Delivery Tracking
              </span>
              <h1 className="text-2xl sm:text-4xl font-black text-brand-black tracking-tight">
                Track Your PS5 Rental Delivery
              </h1>
              <p className="text-xs sm:text-sm text-neutral-500 max-w-lg mx-auto">
                Enter your Rental Booking ID or phone number to view setup agent dispatch status and return schedule.
              </p>
            </div>

            {/* SEARCH FORM */}
            <form onSubmit={handleTrack} className="max-w-lg mx-auto space-y-3">
              <div className="relative">
                <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400" />
                <input
                  type="text"
                  value={rentalQuery}
                  onChange={(e) => {
                    setRentalQuery(e.target.value);
                    if (error) setError("");
                  }}
                  placeholder="Enter Rental ID (e.g. RNT-94821)..."
                  className="w-full pl-12 pr-4 py-3.5 text-sm font-semibold rounded-2xl border border-neutral-200/90 focus:outline-none focus:border-brand-yellow focus:ring-2 focus:ring-brand-yellow/30 bg-[#FAFAF9]"
                />
              </div>

              {error && (
                <p className="text-xs font-bold text-red-600 text-left pl-2">{error}</p>
              )}

              <Button
                type="submit"
                variant="primary"
                size="lg"
                fullWidth
                className="font-black text-sm py-3.5 shadow-yellowGlow rounded-2xl gap-2"
              >
                <span>Track Rental Status</span>
                <ArrowRight className="w-4 h-4" />
              </Button>
            </form>
          </div>

          {/* RECENT RENTALS IF ANY */}
          {recentRentals.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-base font-black text-brand-black">Your Recent Rental Bookings</h2>
              <div className="grid grid-cols-1 gap-3">
                {recentRentals.map((r, i) => (
                  <div
                    key={i}
                    className="p-5 rounded-2xl bg-white border border-neutral-200/80 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold text-sm text-brand-black">#{r.rentalNumber || r.id}</span>
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200/60">
                          {r.status || "CONFIRMED"}
                        </span>
                      </div>
                      <p className="text-xs text-neutral-600 font-semibold">{r.planName || "PS5 Console Rental"}</p>
                      <p className="text-[11px] text-neutral-400">
                        Delivery Date: {r.deliveryDate || "Scheduled"}
                      </p>
                    </div>

                    <Link href={`/rent/track/${r.rentalNumber || r.id}`}>
                      <Button variant="secondary" size="sm" className="font-bold text-xs rounded-xl">
                        Track Delivery &rarr;
                      </Button>
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* THREE VALUE PROMISES */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-4 rounded-2xl bg-white border border-neutral-200/80 shadow-2xs flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-blue-500/10 flex items-center justify-center shrink-0">
                <Truck className="w-4 h-4 text-blue-600" />
              </div>
              <span className="text-xs font-bold text-neutral-800">
                Free Doorstep Setup &amp; Cable Connection
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-neutral-200/80 shadow-2xs flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-emerald-500/10 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
              </div>
              <span className="text-xs font-bold text-neutral-800">
                Clean Sanitized Hardware &amp; Controllers
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-neutral-200/80 shadow-2xs flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-amber-500/10 flex items-center justify-center shrink-0">
                <Clock className="w-4 h-4 text-amber-600" />
              </div>
              <span className="text-xs font-bold text-neutral-800">
                Doorstep Return Pickup at Booking End
              </span>
            </div>
          </div>

          {/* AI VERIFICATION TRUST BAR */}
          <AiVerificationBar />

        </div>
      </main>

      <Footer />
    </div>
  );
}
