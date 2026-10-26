"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useParams } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/Button";
import { OrderData, INITIAL_VARIANTS, INITIAL_MODELS, INITIAL_BRANDS, INITIAL_ORDERS } from "@/lib/store";
import { CheckCircle2, Calendar, MapPin, Smartphone, ArrowRight, ShieldCheck, Copy, Check, UserCheck, Phone } from "lucide-react";
import { formatPickupDateTimeSlot } from "@/lib/utils/pickup-date";

export default function OrderConfirmationPage() {
  const params = useParams();
  const orderId = (params?.orderId as string) || "";

  const [order, setOrder] = useState<OrderData | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem(`cashall_order_${orderId}`) || localStorage.getItem("cashall_latest_order");
      if (stored) {
        try {
          setOrder(JSON.parse(stored));
          return;
        } catch (e) {
          console.error(e);
        }
      }

      if (INITIAL_ORDERS.length > 0) {
        setOrder(INITIAL_ORDERS[0]);
      } else {
        setOrder(null);
      }
    }
  }, [orderId]);

  if (!order) {
    return (
      <div className="min-h-screen flex flex-col bg-brand-bg text-brand-black">
        <Header />
        <main className="flex-grow py-16 flex items-center justify-center">
          <div className="max-w-md w-full mx-auto px-4 text-center space-y-6 bg-white rounded-3xl p-8 border border-brand-border shadow-premium">
            <h1 className="text-xl font-black text-brand-black">Order Confirmation Not Available</h1>
            <p className="text-xs text-brand-muted leading-relaxed">
              No active order found for <strong className="text-brand-black">#{orderId}</strong>.
            </p>
            <Link href="/account">
              <Button variant="primary" size="md" fullWidth className="font-extrabold shadow-yellowGlow">
                Go to My Account
              </Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const handleCopyOrderId = () => {
    navigator.clipboard.writeText(order.orderNumber);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC] text-slate-900">
      <Header />
      <main className="flex-grow py-12">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          
          {/* CONFIRMATION HERO CARD */}
          <div className="bg-white rounded-3xl p-8 sm:p-10 border border-slate-200/80 shadow-subtleCard text-center space-y-6">
            <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto border border-emerald-200/60 shadow-xs">
              <CheckCircle2 className="w-9 h-9 stroke-[2.2]" />
            </div>

            <div>
              <span className="text-[10px] font-extrabold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200/60 uppercase tracking-widest">
                Pickup Scheduled Successfully
              </span>
              <h1 className="font-heading text-2xl sm:text-3xl font-extrabold text-slate-900 mt-3 tracking-tight">
                Doorstep Evaluation Confirmed
              </h1>
              <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto leading-relaxed">
                Your buyback request has been logged. An executive has been scheduled for on-site device inspection and instant payout.
              </p>
            </div>

            {/* ORDER ID BADGE */}
            <div className="inline-flex items-center gap-2.5 bg-slate-50 px-4 py-2 rounded-xl border border-slate-200/80">
              <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">ORDER REF</span>
              <span className="text-sm font-extrabold text-slate-900 font-mono tracking-wider">{order.orderNumber}</span>
              <button
                onClick={handleCopyOrderId}
                className="p-1 text-slate-400 hover:text-slate-900 transition-colors cursor-pointer"
                title="Copy Order ID"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>

            {/* SUMMARY GRID */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left pt-4 border-t border-slate-100">
              <div className="p-4 bg-slate-50/70 rounded-2xl border border-slate-200/70">
                <div className="flex items-center gap-2 text-[10px] font-extrabold text-slate-500 uppercase tracking-wider mb-1">
                  <Calendar className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Scheduled Pickup Time</span>
                </div>
                <div className="text-sm font-extrabold text-slate-900">
                  {formatPickupDateTimeSlot(order.pickupDate, order.pickupTimeSlot, order.createdAt)}
                </div>
              </div>

              <div className="p-4 bg-slate-50/70 rounded-2xl border border-slate-200/70">
                <div className="flex items-center gap-2 text-[10px] font-extrabold text-slate-500 uppercase tracking-wider mb-1">
                  <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Pickup Location</span>
                </div>
                <div className="text-xs font-bold text-slate-900 line-clamp-2">
                  {order.addressSummary || "Customer Address • PIN: " + order.pincode}
                </div>
              </div>
            </div>

            {/* ASSIGNED EXECUTIVE BANNER */}
            {order.assignedPartnerName && (
              <div className="p-4 bg-slate-900 text-white rounded-2xl border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-left">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold shrink-0 border border-emerald-500/20">
                    <UserCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-[10px] uppercase font-extrabold text-slate-400 tracking-wider">Assigned Pickup Executive</div>
                    <div className="text-sm font-extrabold text-white">{order.assignedPartnerName} ({order.assignedPartnerBusiness || "CashALL Express Logistics"})</div>
                  </div>
                </div>
                <a
                  href={`tel:${order.assignedPartnerPhone || "+919876543210"}`}
                  className="bg-emerald-600 text-white font-extrabold text-xs px-4 py-2 rounded-xl flex items-center gap-2 hover:bg-emerald-500 transition-all shadow-xs"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>Call Executive</span>
                </a>
              </div>
            )}

            {/* ACTION BUTTON */}
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link href={`/track/${order.orderNumber}`} className="w-full sm:w-auto">
                <Button variant="primary" size="lg" className="w-full font-extrabold bg-slate-950 hover:bg-slate-900 text-white border-slate-900 px-8 gap-2 shadow-xs cursor-pointer">
                  <span>Track Live Order Status</span>
                  <ArrowRight className="w-4 h-4 text-emerald-400" />
                </Button>
              </Link>

              <Link href="/account" className="w-full sm:w-auto">
                <Button variant="outline" size="lg" className="w-full font-semibold border-slate-200 text-slate-700 hover:bg-slate-50 cursor-pointer">
                  View My Orders
                </Button>
              </Link>
            </div>

          </div>

        </div>
      </main>
      <Footer />
    </div>
  );
}
