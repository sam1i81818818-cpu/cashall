"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/Button";
import { Search, Truck, ArrowRight, Smartphone, ShieldCheck, Clock, MapPin, ChevronRight } from "lucide-react";
import { OrderData } from "@/lib/store";
import { AiVerificationBar } from "@/components/common/AiVerificationBar";

export default function TrackOrderHubPage() {
  const router = useRouter();
  const [orderQuery, setOrderQuery] = useState("");
  const [recentOrders, setRecentOrders] = useState<OrderData[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("cashall_all_orders");
      const latest = localStorage.getItem("cashall_latest_order");
      let list: OrderData[] = [];
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed)) list = parsed;
        } catch (e) {}
      }
      if (latest && list.length === 0) {
        try {
          const parsed = JSON.parse(latest);
          if (parsed?.orderNumber) list.push(parsed);
        } catch (e) {}
      }
      setRecentOrders(list.slice(0, 3));
    }
  }, []);

  const handleTrack = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = orderQuery.trim().toUpperCase().replace("#", "");
    if (!clean) {
      setError("Please enter your Order ID or mobile number.");
      return;
    }
    setError("");
    router.push(`/track/${encodeURIComponent(clean)}`);
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
            <span className="text-brand-black font-bold">Track Doorstep Pickup</span>
          </nav>

          {/* TRACKING HERO CARD */}
          <div className="bg-white rounded-3xl p-8 sm:p-12 border border-neutral-200/90 shadow-[0_4px_30px_-4px_rgba(0,0,0,0.05)] text-center space-y-6">
            <div className="w-16 h-16 rounded-2xl bg-amber-50 border border-amber-200/60 flex items-center justify-center text-brand-black mx-auto">
              <Truck className="w-8 h-8 text-brand-black" />
            </div>

            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-800 bg-amber-50 px-3 py-1 rounded-full border border-amber-200/60">
                Live Doorstep Pickup Tracking
              </span>
              <h1 className="text-2xl sm:text-4xl font-black text-brand-black tracking-tight">
                Where Is Your CashALL Executive?
              </h1>
              <p className="text-xs sm:text-sm text-neutral-500 max-w-lg mx-auto">
                Enter your Order Number to view assigned technician details, verification status, and estimated arrival time.
              </p>
            </div>

            {/* SEARCH FORM */}
            <form onSubmit={handleTrack} className="max-w-lg mx-auto space-y-3">
              <div className="relative">
                <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400" />
                <input
                  type="text"
                  value={orderQuery}
                  onChange={(e) => {
                    setOrderQuery(e.target.value);
                    if (error) setError("");
                  }}
                  placeholder="Enter Order ID (e.g. CA72512)..."
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
                <span>Track Live Pickup Status</span>
                <ArrowRight className="w-4 h-4" />
              </Button>
            </form>
          </div>

          {/* RECENT ORDERS IF FOUND */}
          {recentOrders.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-base font-black text-brand-black">Your Recent Orders</h2>
              <div className="grid grid-cols-1 gap-3">
                {recentOrders.map((ord) => (
                  <div
                    key={ord.id || ord.orderNumber}
                    className="p-5 rounded-2xl bg-white border border-neutral-200/80 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold text-sm text-brand-black">#{ord.orderNumber}</span>
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200/60">
                          {ord.status.replace("_", " ")}
                        </span>
                      </div>
                      <p className="text-xs text-neutral-600 font-semibold">{ord.deviceName}</p>
                      <p className="text-[11px] text-neutral-400">
                        Pickup: {ord.pickupDate} ({ord.pickupTimeSlot})
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="text-right hidden sm:block">
                        <div className="text-xs text-neutral-400 font-semibold">Offer Price</div>
                        <div className="text-base font-black text-brand-black font-price">
                          ₹{(ord.estimatedPrice || 0).toLocaleString("en-IN")}
                        </div>
                      </div>
                      <Link href={`/track/${ord.orderNumber}`}>
                        <Button variant="secondary" size="sm" className="font-bold text-xs rounded-xl">
                          Track Live &rarr;
                        </Button>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* THREE VALUE PROMISES */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-4 rounded-2xl bg-white border border-neutral-200/80 shadow-2xs flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-amber-500/10 flex items-center justify-center shrink-0">
                <Clock className="w-4 h-4 text-amber-600" />
              </div>
              <span className="text-xs font-bold text-neutral-800">
                On-Time 30-Minute Dispatch Window
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-neutral-200/80 shadow-2xs flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-blue-500/10 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-4 h-4 text-blue-600" />
              </div>
              <span className="text-xs font-bold text-neutral-800">
                Government Verified Field Agents
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-neutral-200/80 shadow-2xs flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-emerald-500/10 flex items-center justify-center shrink-0">
                <Smartphone className="w-4 h-4 text-emerald-600" />
              </div>
              <span className="text-xs font-bold text-neutral-800">
                Spot UPI Payment Before Handover
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
