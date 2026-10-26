"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import Link from "next/link";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminHeader } from "@/components/admin/AdminHeader";
import {
  Gamepad2,
  Calendar,
  Clock,
  MapPin,
  CheckCircle2,
  AlertTriangle,
  Search,
  RefreshCw,
  Video,
  FileText,
  ShieldCheck,
  Disc,
  UserCheck,
  Phone,
  IndianRupee,
  ExternalLink,
  Plus,
  X,
  AlertCircle,
  Download,
  RotateCw,
  SlidersHorizontal,
  Layers,
  Sparkles,
} from "lucide-react";

export default function AdminRentalsPage() {
  const [rentals, setRentals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  // Return Inspection & Damage Claim Modal
  const [selectedRentalForReturn, setSelectedRentalForReturn] = useState<any | null>(null);
  const [returnVideoUrl, setReturnVideoUrl] = useState("");
  const [defectsFound, setDefectsFound] = useState(false);
  const [reportedDefects, setReportedDefects] = useState("");
  const [repairCost, setRepairCost] = useState(0);
  const [savingReturn, setSavingReturn] = useState(false);

  const fetchRentals = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`/api/v1/rentals?t=${Date.now()}`, {
        cache: "no-store",
      });
      const data = await res.json();
      if (data.success && Array.isArray(data.rentals)) {
        setRentals(data.rentals);
      } else {
        setError(data.error || "Failed to load rentals");
      }
    } catch (err: any) {
      setError(err.message || "Network error loading rentals");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRentals();
  }, [fetchRentals]);

  // Counts & KPIs
  const kpis = useMemo(() => {
    let active = 0;
    let booked = 0;
    let returnDue = 0;
    let completed = 0;
    let totalRevenue = 0;

    const today = new Date().toISOString().split("T")[0];

    for (const r of rentals) {
      if (r.rentalStatus === "ACTIVE" || r.rentalStatus === "EXTENDED") active++;
      if (r.rentalStatus === "BOOKED" || r.rentalStatus === "AGENT_ASSIGNED") booked++;
      if (r.rentalStatus === "COMPLETED") completed++;
      if (r.endDate <= today && (r.rentalStatus === "ACTIVE" || r.rentalStatus === "EXTENDED")) {
        returnDue++;
      }
      totalRevenue += Number(r.totalAmount || 0);
    }

    return {
      total: rentals.length,
      active,
      booked,
      returnDue,
      completed,
      totalRevenue,
    };
  }, [rentals]);

  // Filtered List
  const filteredRentals = useMemo(() => {
    return rentals.filter((r) => {
      // 1. Status Filter
      if (statusFilter !== "ALL") {
        if (statusFilter === "BOOKED" && r.rentalStatus !== "BOOKED" && r.rentalStatus !== "AGENT_ASSIGNED") return false;
        if (statusFilter === "ACTIVE" && r.rentalStatus !== "ACTIVE" && r.rentalStatus !== "EXTENDED") return false;
        if (statusFilter === "COMPLETED" && r.rentalStatus !== "COMPLETED") return false;
        if (statusFilter === "OVERDUE") {
          const today = new Date().toISOString().split("T")[0];
          if (r.endDate > today || r.rentalStatus === "COMPLETED") return false;
        }
      }

      // 2. Search Query Filter
      if (searchQuery.trim()) {
        const q = searchQuery.trim().toLowerCase();
        const match =
          (r.rentalNumber && r.rentalNumber.toLowerCase().includes(q)) ||
          (r.customerName && r.customerName.toLowerCase().includes(q)) ||
          (r.customerPhone && r.customerPhone.includes(q)) ||
          (r.consoleModel && r.consoleModel.toLowerCase().includes(q)) ||
          (r.pincode && r.pincode.includes(q));
        if (!match) return false;
      }

      return true;
    });
  }, [rentals, statusFilter, searchQuery]);

  const handleReturnInspectionSubmit = async () => {
    if (!selectedRentalForReturn) return;
    setSavingReturn(true);

    try {
      const res = await fetch(`/api/v1/rentals/${selectedRentalForReturn.rentalNumber}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "return_inspection",
          returnVideoUrl,
          reportedDefects: defectsFound ? reportedDefects : "",
          repairCost: defectsFound ? Number(repairCost) : 0,
          rentalStatus: "COMPLETED",
        }),
      });

      const data = await res.json();
      if (data.success) {
        setSelectedRentalForReturn(null);
        fetchRentals();
      } else {
        alert(data.error || "Failed to update return inspection.");
      }
    } catch (err: any) {
      alert(err.message || "Network error.");
    } finally {
      setSavingReturn(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col lg:flex-row w-full max-w-full">
      <AdminSidebar />

      <div className="flex-1 flex flex-col min-w-0">
        <AdminHeader />

        <main className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto w-full">
          {/* Top Breadcrumb & Actions Bar */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-1.5 text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">
                <Link href="/admin" className="hover:text-slate-800 transition">Admin</Link>
                <span>/</span>
                <span className="hover:text-slate-800 transition">Operations</span>
                <span>/</span>
                <span className="text-amber-600 font-extrabold">Rentals</span>
              </div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
                  <Gamepad2 className="w-7 h-7 text-amber-500" />
                  <span>PS5 Rentals Console</span>
                </h1>
                <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 font-black text-xs border border-amber-300">
                  {kpis.active} Active
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                PlayStation 5 console bookings, security deposits &amp; return inspections
              </p>
            </div>

            <div className="flex items-center gap-2.5 shrink-0">
              <button
                onClick={() => {
                  const csvContent =
                    "data:text/csv;charset=utf-8," +
                    ["LeaseID,Customer,Phone,Model,TotalDays,StartDate,EndDate,Amount,Status", ...rentals.map((r) => `${r.rentalNumber},"${r.customerName}",${r.customerPhone},"${r.consoleModel}",${r.totalDays},${r.startDate},${r.endDate},${r.totalAmount},${r.rentalStatus}`)].join("\n");
                  const encodedUri = encodeURI(csvContent);
                  const link = document.createElement("a");
                  link.setAttribute("href", encodedUri);
                  link.setAttribute("download", `Cashall_Rentals_${Date.now()}.csv`);
                  document.body.appendChild(link);
                  link.click();
                }}
                className="flex items-center gap-1.5 px-3.5 py-2 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 rounded-xl text-xs font-bold shadow-sm transition"
              >
                <Download className="w-3.5 h-3.5 text-slate-500" />
                <span>Export CSV</span>
              </button>

              <button
                onClick={() => fetchRentals()}
                className="flex items-center gap-1.5 px-3.5 py-2 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 rounded-xl text-xs font-bold shadow-sm transition"
              >
                <RefreshCw className="w-3.5 h-3.5 text-slate-500" />
                <span>Sync Live</span>
              </button>

              <Link
                href="/rent"
                target="_blank"
                className="flex items-center gap-1.5 px-4 py-2 bg-amber-400 hover:bg-amber-500 text-amber-950 font-black rounded-xl text-xs shadow-sm transition"
              >
                <Plus className="w-4 h-4 text-amber-950" />
                <span>+ New Rental Booking</span>
              </Link>
            </div>
          </div>

          {/* KPI Strip (5 Institutional Micro-Cards) */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3.5">
            <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm flex flex-col justify-between">
              <div className="flex items-center justify-between text-slate-400">
                <span className="text-[11px] font-bold uppercase">Total Bookings</span>
                <Gamepad2 className="w-4 h-4 text-amber-500" />
              </div>
              <div className="mt-2">
                <div className="text-2xl font-black text-slate-900">{kpis.total}</div>
                <div className="text-[11px] text-slate-500 mt-0.5">All-time PS5 leases</div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm flex flex-col justify-between">
              <div className="flex items-center justify-between text-slate-400">
                <span className="text-[11px] font-bold uppercase">Active Leases</span>
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              </div>
              <div className="mt-2">
                <div className="text-2xl font-black text-emerald-700">{kpis.active}</div>
                <div className="text-[11px] text-emerald-600 font-bold mt-0.5">Currently with players</div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm flex flex-col justify-between">
              <div className="flex items-center justify-between text-slate-400">
                <span className="text-[11px] font-bold uppercase">Pending Delivery</span>
                <Clock className="w-4 h-4 text-amber-500" />
              </div>
              <div className="mt-2">
                <div className="text-2xl font-black text-amber-600">{kpis.booked}</div>
                <div className="text-[11px] text-slate-500 mt-0.5">Awaiting agent dispatch</div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm flex flex-col justify-between">
              <div className="flex items-center justify-between text-slate-400">
                <span className="text-[11px] font-bold uppercase">Returns Due (7D)</span>
                <AlertTriangle className="w-4 h-4 text-orange-500" />
              </div>
              <div className="mt-2">
                <div className="text-2xl font-black text-orange-600">{kpis.returnDue}</div>
                <div className="text-[11px] text-orange-600 font-bold mt-0.5">Return inspection due</div>
              </div>
            </div>

            <div className="col-span-2 md:col-span-1 bg-white rounded-2xl p-4 border border-slate-200 shadow-sm flex flex-col justify-between">
              <div className="flex items-center justify-between text-slate-400">
                <span className="text-[11px] font-bold uppercase">Rental Volume</span>
                <IndianRupee className="w-4 h-4 text-emerald-600" />
              </div>
              <div className="mt-2">
                <div className="text-2xl font-black text-slate-900">
                  ₹{kpis.totalRevenue.toLocaleString("en-IN")}
                </div>
                <div className="text-[11px] text-emerald-600 font-bold mt-0.5">₹500/day + Disc library</div>
              </div>
            </div>
          </div>

          {/* Segmented Filter & Controls Toolbar */}
          <div className="bg-white rounded-2xl p-3 border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            {/* Filter Pills */}
            <div className="flex flex-wrap gap-1.5">
              {[
                { id: "ALL", label: `All Agreements (${rentals.length})` },
                { id: "BOOKED", label: `Pending Delivery (${kpis.booked})` },
                { id: "ACTIVE", label: `Active Leases (${kpis.active})` },
                { id: "OVERDUE", label: `Returns Due (${kpis.returnDue})` },
                { id: "COMPLETED", label: `Completed (${kpis.completed})` },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setStatusFilter(tab.id)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    statusFilter === tab.id
                      ? "bg-amber-400 text-amber-950 font-black shadow-sm"
                      : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Search Input */}
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search lease #, customer, phone, PIN..."
                className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-amber-400 transition"
              />
            </div>
          </div>

          {/* Rentals List Container */}
          {loading ? (
            <div className="bg-white rounded-3xl p-16 text-center border border-slate-200 space-y-3">
              <RefreshCw className="w-8 h-8 text-amber-500 animate-spin mx-auto" />
              <span className="text-xs font-semibold text-slate-500">Loading PS5 rental agreements...</span>
            </div>
          ) : filteredRentals.length === 0 ? (
            <div className="bg-white rounded-3xl p-16 text-center border border-slate-200 space-y-3">
              <Gamepad2 className="w-12 h-12 text-slate-300 mx-auto" />
              <h3 className="text-base font-black text-slate-800">No PS5 Rental Bookings Found</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                {searchQuery
                  ? "No bookings match your current search query."
                  : "New PS5 rental requests from the website will appear here in real-time."}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredRentals.map((rental) => {
                const totalDays = rental.totalDays + (rental.extendedDays || 0);
                return (
                  <div
                    key={rental.id || rental.rentalNumber}
                    className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm hover:shadow-md transition-all space-y-4"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
                      <div className="flex items-center gap-3 flex-wrap">
                        <span className="font-mono text-xs font-black text-amber-950 bg-amber-100 border border-amber-300 px-2.5 py-1 rounded-xl">
                          #{rental.rentalNumber}
                        </span>
                        <span className="text-sm font-extrabold text-slate-900 flex items-center gap-1.5">
                          <Gamepad2 className="w-4 h-4 text-amber-500" />
                          {rental.consoleModel || "PlayStation 5 Disc Edition"}
                        </span>
                        {rental.extendedDays > 0 && (
                          <span className="text-[10px] font-bold bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full border border-purple-200">
                            +{rental.extendedDays} Days Extended
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        <span
                          className={`text-[10px] font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wider ${
                            rental.rentalStatus === "ACTIVE" || rental.rentalStatus === "EXTENDED"
                              ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                              : rental.rentalStatus === "COMPLETED"
                              ? "bg-slate-100 text-slate-700 border border-slate-300"
                              : "bg-amber-100 text-amber-900 border border-amber-300"
                          }`}
                        >
                          {rental.rentalStatus}
                        </span>

                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-lg border ${
                            rental.paymentStatus === "PAID"
                              ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                              : "bg-orange-50 text-orange-700 border-orange-200"
                          }`}
                        >
                          {rental.paymentStatus || "PENDING"}
                        </span>
                      </div>
                    </div>

                    {/* Content 4-Column Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
                      <div>
                        <span className="text-slate-400 block text-[11px] font-semibold">Customer:</span>
                        <strong className="text-slate-900 text-sm block mt-0.5">{rental.customerName}</strong>
                        <span className="text-slate-500 font-mono text-[11px]">{rental.customerPhone}</span>
                      </div>

                      <div>
                        <span className="text-slate-400 block text-[11px] font-semibold">Rental Tenancy:</span>
                        <div className="font-bold text-slate-800 mt-0.5">
                          {rental.startDate} → <strong className="text-amber-700">{rental.endDate}</strong>
                        </div>
                        <span className="text-slate-500 text-[11px]">{totalDays} Days Total Window</span>
                      </div>

                      <div>
                        <span className="text-slate-400 block text-[11px] font-semibold">
                          Selected Game Discs ({rental.cdCount || 0}):
                        </span>
                        {rental.selectedGames && rental.selectedGames.length > 0 ? (
                          <div className="truncate text-slate-800 font-bold mt-0.5">
                            {rental.selectedGames.join(", ")}
                          </div>
                        ) : (
                          <span className="text-slate-400 italic block mt-0.5">Standard Pack (0 Extra Discs)</span>
                        )}
                        <span className="text-slate-500 text-[11px] block mt-0.5">
                          DualSense Controllers: {rental.extraControllers ? "2 Units (Duo)" : "1 Unit"}
                        </span>
                      </div>

                      <div>
                        <span className="text-slate-400 block text-[11px] font-semibold">Total Rental Escrow:</span>
                        <div className="text-base font-black text-slate-900 mt-0.5">
                          ₹{Number(rental.totalAmount || 0).toLocaleString("en-IN")}
                        </div>
                        <span className="text-[10px] text-slate-500">Includes Security Float</span>
                      </div>
                    </div>

                    {/* Address & Video Proof Toolbar */}
                    <div className="bg-slate-50 rounded-xl p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs border border-slate-200">
                      <div className="flex items-center gap-2 text-slate-700 truncate">
                        <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span className="truncate">{rental.deliveryAddress}, PIN: {rental.pincode}</span>
                      </div>

                      <div className="flex items-center gap-2.5 shrink-0 flex-wrap">
                        {rental.preDeliveryVideoUrl ? (
                          <a
                            href={rental.preDeliveryVideoUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1 text-[11px] font-bold text-sky-700 hover:underline"
                          >
                            <Video className="w-3.5 h-3.5" />
                            <span>Pre-Delivery Proof</span>
                          </a>
                        ) : (
                          <span className="text-[10px] text-slate-400 italic">No video logged</span>
                        )}

                        <Link
                          href={`/rent/inspect/${rental.rentalNumber}`}
                          className="flex items-center gap-1 text-[11px] font-bold text-slate-800 bg-white px-3 py-1.5 rounded-lg border border-slate-300 hover:bg-slate-50 transition shadow-xs"
                        >
                          <FileText className="w-3.5 h-3.5 text-amber-500" />
                          <span>Handover Form</span>
                        </Link>

                        <Link
                          href={`/rent/track/${rental.rentalNumber}`}
                          target="_blank"
                          className="flex items-center gap-1 text-[11px] font-bold text-slate-700 bg-white px-3 py-1.5 rounded-lg border border-slate-300 hover:bg-slate-50 transition shadow-xs"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                          <span>Customer Link</span>
                        </Link>

                        <button
                          onClick={() => {
                            setSelectedRentalForReturn(rental);
                            setReturnVideoUrl(rental.returnVideoUrl || "");
                            setDefectsFound(Boolean(rental.repairCost && rental.repairCost > 0));
                            setReportedDefects(rental.reportedDefects || "");
                            setRepairCost(rental.repairCost || 0);
                          }}
                          className="px-3.5 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-500 text-amber-950 text-xs font-black transition shadow-sm"
                        >
                          Return Inspection
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </main>
      </div>

      {/* RETURN INSPECTION & DAMAGE CLAIM MODAL */}
      {selectedRentalForReturn && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div>
                <h3 className="text-base font-black text-slate-900">Return Inspection & Damage Claim</h3>
                <p className="text-xs text-slate-500 font-mono">Lease #{selectedRentalForReturn.rentalNumber}</p>
              </div>
              <button
                onClick={() => setSelectedRentalForReturn(null)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Return Video Recording Proof URL:
                </label>
                <input
                  type="text"
                  value={returnVideoUrl}
                  onChange={(e) => setReturnVideoUrl(e.target.value)}
                  placeholder="https://storage.googleapis.com/... or Google Drive URL"
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-3">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={defectsFound}
                    onChange={(e) => setDefectsFound(e.target.checked)}
                    className="w-4 h-4 accent-amber-500 rounded"
                  />
                  <span className="font-bold text-slate-800">
                    Hardware Damage, Missing Discs, or Stick Drift Found?
                  </span>
                </label>

                {defectsFound && (
                  <div className="space-y-3 pt-2 border-t border-slate-200">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">
                        Reported Defects & Damage Notes:
                      </label>
                      <textarea
                        value={reportedDefects}
                        onChange={(e) => setReportedDefects(e.target.value)}
                        placeholder="e.g. Scratched Spider-Man 2 disc, DualSense stick drift on left analog stick..."
                        rows={2}
                        className="w-full p-2.5 rounded-xl bg-white border border-slate-200 text-slate-900 focus:outline-none focus:border-amber-400 resize-none"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1">
                        Repair / Replacement Cost (Deducted from Escrow Deposit):
                      </label>
                      <div className="relative">
                        <span className="absolute left-3 top-2 text-slate-400 font-bold">₹</span>
                        <input
                          type="number"
                          value={repairCost}
                          onChange={(e) => setRepairCost(Number(e.target.value))}
                          placeholder="e.g. 1500"
                          className="w-full pl-7 pr-3 py-2 rounded-xl bg-white border border-slate-200 text-slate-900 font-mono font-bold focus:outline-none focus:border-amber-400"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => setSelectedRentalForReturn(null)}
                className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={savingReturn}
                onClick={handleReturnInspectionSubmit}
                className="flex-1 py-2.5 bg-amber-400 hover:bg-amber-500 text-amber-950 font-black text-xs rounded-xl shadow-md transition disabled:opacity-60 flex items-center justify-center gap-2"
              >
                {savingReturn ? <RefreshCw className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                <span>Finalize Return & Close Lease</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
