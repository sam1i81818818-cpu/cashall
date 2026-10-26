"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminHeader } from "@/components/admin/AdminHeader";
import {
  OrderDiagnosticsDrawer,
  DiagnosticsOrder,
} from "@/components/admin/OrderDiagnosticsDrawer";
import {
  ShoppingBag,
  FileText,
  Clock,
  CheckCircle2,
  RefreshCw,
  ChevronRight,
  ArrowRight,
  Smartphone,
  Plus,
  Loader2,
  User,
  Phone,
} from "lucide-react";

interface DashboardStats {
  todayQuotes: number;
  todayOrders: number;
  pickupsToday: number;
  pendingInspections: number;
  pendingPayments: number;
  completedSales: number;
}

export default function DashboardOverviewPage() {
  const router = useRouter();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastRefreshed, setLastRefreshed] = useState("Just now");

  // Selected Order for Diagnostics Drawer
  const [selectedOrderForDiag, setSelectedOrderForDiag] = useState<DiagnosticsOrder | null>(null);
  const [isDiagOpen, setIsDiagOpen] = useState(false);

  const fetchDashboard = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/v1/admin/dashboard?t=${Date.now()}`);
      if (res.ok) {
        const data = await res.json();
        setStats(data.stats);
        if (Array.isArray(data.recentOrders)) {
          setRecentOrders(data.recentOrders);
        }
      }
    } catch (e) {
      console.error("Failed to load dashboard stats", e);
    } finally {
      setLoading(false);
      setLastRefreshed(new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }));
    }
  }, []);

  useEffect(() => {
    fetchDashboard();
    const interval = setInterval(fetchDashboard, 30000);
    return () => clearInterval(interval);
  }, [fetchDashboard]);

  const openOrderDiagnostics = (item: any) => {
    const diagObj: DiagnosticsOrder = {
      id: item.id || item.orderNumber,
      orderNumber: item.orderNumber || "CA00000",
      customerName: item.customerName || "Customer",
      customerPhone: item.customerPhone || "—",
      deviceName: item.deviceName || item.device || "Mobile Device",
      estimatedPrice: item.estimatedPrice || item.quotedPrice || 0,
      revisedPrice: item.revisedPrice || item.requotedPrice || null,
      finalPrice: item.finalPrice || null,
      status: item.status || "PICKUP_SCHEDULED",
      imeiNumber: item.imeiNumber || "",
      agentName: item.agentName || item.assignedPartnerName || "Unassigned",
      location: item.location || item.addressSummary || "Doorstep Address",
    };
    setSelectedOrderForDiag(diagObj);
    setIsDiagOpen(true);
  };

  const todayOrdersCount = stats?.todayOrders ?? recentOrders.length;
  const todayQuotesCount = stats?.todayQuotes ?? 0;
  const pickupsTodayCount = stats?.pickupsToday ?? 0;
  const completedCount = stats?.completedSales ?? 0;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <div className="flex flex-1 min-h-0">
        <AdminSidebar />

        <div className="flex-1 flex flex-col min-w-0">
          <AdminHeader
            title="Dashboard Overview"
            onExportCsv={() => router.push("/admin/orders")}
            onNewOrder={() => router.push("/sell-used-phone")}
          />

          <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6">
            {/* CLEAN MINIMALIST HEADER */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
              <div>
                <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                  Dashboard Overview
                </h1>
                <p className="text-xs text-slate-500 mt-1">
                  Real-time operational summary • Last updated: {lastRefreshed}
                </p>
              </div>

              <div className="flex items-center gap-2.5">
                <button
                  type="button"
                  onClick={fetchDashboard}
                  disabled={loading}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold border border-slate-200 transition-colors disabled:opacity-50"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
                  <span>Refresh</span>
                </button>

                <Link
                  href="/admin/orders"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-500 text-amber-950 text-xs font-black border border-amber-500 shadow-xs transition-colors"
                >
                  <span>Orders Console</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            {/* 4 CLEAN MINIMALIST STAT CARDS */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Stat 1: Total Orders */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:border-amber-400 transition-all">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Total Orders
                  </span>
                  <div className="w-9 h-9 rounded-xl bg-amber-100 border border-amber-300 text-amber-950 flex items-center justify-center">
                    <ShoppingBag className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                  {todayOrdersCount}
                </div>
                <div className="text-xs text-slate-500 mt-1 font-medium">
                  Active in database
                </div>
              </div>

              {/* Stat 2: Valuation Quotes */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:border-amber-400 transition-all">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Quotes Generated
                  </span>
                  <div className="w-9 h-9 rounded-xl bg-blue-50 border border-blue-200 text-blue-700 flex items-center justify-center">
                    <FileText className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                  {todayQuotesCount.toLocaleString("en-IN")}
                </div>
                <div className="text-xs text-slate-500 mt-1 font-medium">
                  Online price inquiries
                </div>
              </div>

              {/* Stat 3: Pickups Scheduled */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:border-amber-400 transition-all">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Scheduled Pickups
                  </span>
                  <div className="w-9 h-9 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 flex items-center justify-center">
                    <Clock className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                  {pickupsTodayCount}
                </div>
                <div className="text-xs text-slate-500 mt-1 font-medium">
                  Doorstep slots allocated
                </div>
              </div>

              {/* Stat 4: Completed Sales */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:border-amber-400 transition-all">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Completed Sales
                  </span>
                  <div className="w-9 h-9 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 flex items-center justify-center">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                  {completedCount}
                </div>
                <div className="text-xs text-slate-500 mt-1 font-medium">
                  Settled and paid payouts
                </div>
              </div>
            </div>

            {/* RECENT ORDERS TABLE (REAL DATABASE) */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-base font-black text-slate-900">Recent Buyback Orders</h2>
                  <p className="text-xs text-slate-500 mt-0.5">Latest customer sell requests synced with Supabase</p>
                </div>
                <Link
                  href="/admin/orders"
                  className="text-xs font-bold text-amber-800 hover:text-amber-950 flex items-center gap-1 transition-colors"
                >
                  <span>View All</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              {recentOrders.length === 0 ? (
                <div className="text-center py-12 text-slate-400 text-xs">
                  {loading ? (
                    <div className="flex items-center justify-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin text-amber-500" />
                      <span>Loading recent orders...</span>
                    </div>
                  ) : (
                    "No recent orders found."
                  )}
                </div>
              ) : (
                <div className="overflow-x-auto rounded-xl border border-slate-200">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                        <th className="py-3 px-4">Order #</th>
                        <th className="py-3 px-4">Customer</th>
                        <th className="py-3 px-4">Device</th>
                        <th className="py-3 px-4">Amount</th>
                        <th className="py-3 px-4">Pickup Date</th>
                        <th className="py-3 px-4">Status</th>
                        <th className="py-3 px-4 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {recentOrders.slice(0, 8).map((ord) => {
                        const statusColor =
                          ord.status === "COMPLETED" || ord.status === "PAID"
                            ? "bg-emerald-100 text-emerald-800 border-emerald-200"
                            : ord.status === "CANCELLED"
                            ? "bg-rose-100 text-rose-800 border-rose-200"
                            : "bg-amber-100 text-amber-950 border-amber-300";

                        return (
                          <tr
                            key={ord.id}
                            className="hover:bg-slate-50 transition-colors cursor-pointer"
                            onClick={() => openOrderDiagnostics(ord)}
                          >
                            <td className="py-3.5 px-4 font-black font-mono text-slate-900">
                              #{ord.orderNumber}
                            </td>
                            <td className="py-3.5 px-4">
                              <div className="font-bold text-slate-900">{ord.customerName || "Customer"}</div>
                              <div className="text-[11px] text-slate-500 font-mono">{ord.customerPhone || "—"}</div>
                            </td>
                            <td className="py-3.5 px-4 font-medium text-slate-800">
                              {ord.deviceName || "Mobile Device"}
                            </td>
                            <td className="py-3.5 px-4 font-black text-slate-900">
                              ₹{(ord.revisedPrice || ord.estimatedPrice || ord.quotedPrice || 0).toLocaleString("en-IN")}
                            </td>
                            <td className="py-3.5 px-4 text-slate-600">
                              <div>{ord.pickupDate || "—"}</div>
                              <div className="text-[10px] text-slate-400">{ord.pickupTimeSlot || ""}</div>
                            </td>
                            <td className="py-3.5 px-4">
                              <span
                                className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold border uppercase tracking-wider ${statusColor}`}
                              >
                                {ord.status?.replace(/_/g, " ") || "SCHEDULED"}
                              </span>
                            </td>
                            <td className="py-3.5 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                              <button
                                type="button"
                                onClick={() => openOrderDiagnostics(ord)}
                                className="px-2.5 py-1 text-xs font-bold rounded-lg bg-slate-100 hover:bg-amber-400 hover:text-amber-950 text-slate-700 transition-colors"
                              >
                                Details
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* QUICK NAVIGATION SHORTCUTS */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <Link
                href="/admin/orders"
                className="bg-white p-4 rounded-xl border border-slate-200 hover:border-amber-400 hover:shadow-xs transition-all flex items-center justify-between group"
              >
                <div>
                  <div className="font-bold text-xs text-slate-900">Order Management</div>
                  <div className="text-[11px] text-slate-500 mt-0.5">Assign agents & track live orders</div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-amber-700 transition-colors" />
              </Link>

              <Link
                href="/admin/catalog"
                className="bg-white p-4 rounded-xl border border-slate-200 hover:border-amber-400 hover:shadow-xs transition-all flex items-center justify-between group"
              >
                <div>
                  <div className="font-bold text-xs text-slate-900">Device Catalog</div>
                  <div className="text-[11px] text-slate-500 mt-0.5">Brands, models & variants</div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-amber-700 transition-colors" />
              </Link>

              <Link
                href="/admin/pricing"
                className="bg-white p-4 rounded-xl border border-slate-200 hover:border-amber-400 hover:shadow-xs transition-all flex items-center justify-between group"
              >
                <div>
                  <div className="font-bold text-xs text-slate-900">Pricing Rules Matrix</div>
                  <div className="text-[11px] text-slate-500 mt-0.5">Condition percentage deductions</div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-amber-700 transition-colors" />
              </Link>

              <Link
                href="/admin/quotes"
                className="bg-white p-4 rounded-xl border border-slate-200 hover:border-amber-400 hover:shadow-xs transition-all flex items-center justify-between group"
              >
                <div>
                  <div className="font-bold text-xs text-slate-900">Quotes Repository</div>
                  <div className="text-[11px] text-slate-500 mt-0.5">Customer valuation leads</div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-amber-700 transition-colors" />
              </Link>
            </div>
          </main>
        </div>
      </div>

      {/* ORDER DIAGNOSTICS & VALUATION DRAWER */}
      <OrderDiagnosticsDrawer
        order={selectedOrderForDiag}
        isOpen={isDiagOpen}
        onClose={() => setIsDiagOpen(false)}
        onAuthorizePayout={() => {
          setIsDiagOpen(false);
          fetchDashboard();
        }}
      />
    </div>
  );
}
