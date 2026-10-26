"use client";

import React, { useState, useEffect, useCallback } from "react";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminHeader } from "@/components/admin/AdminHeader";
import {
  FileText,
  Smartphone,
  Loader2,
  Phone,
  User,
  Search,
  RefreshCw,
  Calendar,
  Clock,
  AlertCircle,
  Download,
  Printer,
  CheckCircle2,
  Ban,
  ListChecks,
} from "lucide-react";
import { CustomerAnswersModal } from "@/components/admin/CustomerAnswersModal";

function getAdminToken() {
  if (typeof window === "undefined") return "tok_admin_master_session";
  try {
    const saved = JSON.parse(localStorage.getItem("cashall_admin_session") || "{}");
    return saved?.token || "tok_admin_master_session";
  } catch {
    return "tok_admin_master_session";
  }
}

interface Quote {
  id: string;
  quoteNumber: string;
  customerName?: string;
  customerPhone?: string;
  deviceName: string;
  basePrice: number;
  estimatedPrice: number;
  status: string;
  createdAt: string;
  orderNumber?: string | null;
  pickupDate?: string | null;
  pickupTimeSlot?: string | null;
}

export default function AdminQuotesPage() {
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedQuoteForAnswers, setSelectedQuoteForAnswers] = useState<any | null>(null);

  const [quoteToConvert, setQuoteToConvert] = useState<Quote | null>(null);
  const [convertForm, setConvertForm] = useState({
    customerName: "",
    customerPhone: "",
    line1: "158, Ghughupara Road, Bhattanagar",
    line2: "Near Liluah Railway Station",
    state: "West Bengal",
    pincode: "711203",
    pickupDate: "Tomorrow",
    pickupTimeSlot: "10 AM - 1 PM",
    agentNotes: "Converted from admin console leads pipeline.",
  });
  const [convertingOrder, setConvertingOrder] = useState(false);

  const handleConvertSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!quoteToConvert) return;

    setConvertingOrder(true);
    try {
      const token = getAdminToken();
      const res = await fetch("/api/v1/admin/quotes/convert", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          quoteNumber: quoteToConvert.quoteNumber,
          customerName: convertForm.customerName.trim(),
          customerPhone: convertForm.customerPhone.trim(),
          address: {
            line1: convertForm.line1.trim(),
            line2: convertForm.line2.trim(),
            state: convertForm.state.trim(),
            pincode: convertForm.pincode.trim(),
          },
          pickupDate: convertForm.pickupDate,
          pickupTimeSlot: convertForm.pickupTimeSlot,
          agentNotes: convertForm.agentNotes,
        }),
      });

      const json = await res.json();
      if (res.ok && json.success) {
        setQuotes((prev) =>
          prev.map((q) =>
            q.quoteNumber === quoteToConvert.quoteNumber
              ? { ...q, status: "ORDERED", orderNumber: json.data?.orderNumber || "CA" + q.quoteNumber }
              : q
          )
        );
        setQuoteToConvert(null);
        alert(`✅ Success: Quote #${quoteToConvert.quoteNumber} converted into Order #${json.data?.orderNumber || "CA" + quoteToConvert.quoteNumber}!`);
      } else {
        alert(json.error || json.message || "Failed to convert quote into confirmed order.");
      }
    } catch (err: any) {
      alert(err.message || "Error converting quote");
    } finally {
      setConvertingOrder(false);
    }
  };

  const handleCancelQuoteAdmin = async (q: Quote) => {
    if (!window.confirm(`Are you sure you want to cancel quote #${q.quoteNumber}?`)) return;

    try {
      const token = getAdminToken();
      const res = await fetch(`/api/v1/admin/quotes/${q.quoteNumber}/cancel`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        setQuotes((prev) =>
          prev.map((item) => (item.quoteNumber === q.quoteNumber ? { ...item, status: "CANCELLED" } : item))
        );
      } else {
        const j = await res.json().catch(() => ({}));
        alert(j.error || "Failed to cancel quote");
      }
    } catch (err: any) {
      alert(err.message || "Error cancelling quote");
    }
  };

  const fetchQuotes = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const token = getAdminToken();
      const res = await fetch("/api/v1/admin/quotes?limit=60", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const json = await res.json();
      if (json.success && Array.isArray(json.quotes)) {
        setQuotes(json.quotes);
      } else {
        setError(json.error || "Failed to fetch quotes");
      }
    } catch (err: any) {
      setError(err.message || "Network error fetching quotes");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchQuotes();
  }, [fetchQuotes]);

  const filteredQuotes = quotes.filter((q) => {
    const qStr = (q.quoteNumber + " " + (q.customerName || "") + " " + (q.customerPhone || "") + " " + q.deviceName).toLowerCase();
    return qStr.includes(searchQuery.toLowerCase());
  });

  const handleDownloadCSV = () => {
    if (filteredQuotes.length === 0) return;
    const headers = ["Quote ID", "Customer Name", "Customer Phone", "Device Purchased", "Estimated Price (INR)", "Scheduled Visit", "Booking Status", "Generated Date", "Generated Time"];
    const rows = filteredQuotes.map((q) => {
      let genDate = "—";
      let genTime = "—";
      try {
        const d = new Date(q.createdAt);
        if (!isNaN(d.getTime())) {
          genDate = d.toLocaleDateString("en-IN", { day: "2-digit", month: "2-digit", year: "numeric", timeZone: "Asia/Kolkata" });
          genTime = d.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: true, timeZone: "Asia/Kolkata" });
        }
      } catch {}
      return [
        q.quoteNumber,
        `"${(q.customerName || "Customer Lead").replace(/"/g, '""')}"`,
        q.customerPhone || "—",
        `"${q.deviceName.replace(/"/g, '""')}"`,
        q.estimatedPrice,
        q.pickupDate ? `"${q.pickupDate} (${q.pickupTimeSlot || "Standard"})"` : "Not Scheduled",
        q.status,
        genDate,
        genTime,
      ];
    });
    const csvContent = "data:text/csv;charset=utf-8,\uFEFF" + [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `CashALL_Quotes_Leads_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const uncompletedCount = quotes.filter((q) => q.status.includes("UNCOMPLETED")).length;
  const orderedCount = quotes.filter((q) => q.status === "ORDERED" || q.status === "CONVERTED").length;
  const completedCount = quotes.filter((q) => q.status === "COMPLETED").length;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col lg:flex-row w-full max-w-full overflow-x-hidden font-sans">
      <AdminSidebar />

      <div className="flex-1 flex flex-col min-w-0">
        <AdminHeader title="Quotes & Leads Repository" />

        <main className="flex-1 w-full max-w-full p-4 sm:p-6 lg:p-8 overflow-x-hidden space-y-6">
          {/* HEADER RIBBON */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs print:hidden">
            <div>
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-amber-100 border border-amber-300 flex items-center justify-center">
                  <FileText className="w-5 h-5 text-amber-700" />
                </div>
                <div>
                  <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                    Quotes Repository
                  </h1>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Customer valuation inquiries &amp; follow-up leads
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 flex-wrap">
              <button
                onClick={handleDownloadCSV}
                disabled={filteredQuotes.length === 0}
                className="flex items-center gap-2 bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100 text-xs font-bold px-4 py-2.5 rounded-xl transition disabled:opacity-50"
              >
                <Download className="w-4 h-4" />
                <span>Export CSV</span>
              </button>

              <button
                onClick={fetchQuotes}
                disabled={loading}
                className="flex items-center gap-2 text-xs font-bold text-amber-950 bg-amber-400 hover:bg-amber-500 px-4 py-2.5 rounded-xl border border-amber-500 transition shadow-2xs disabled:opacity-50"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
                <span>Refresh Leads</span>
              </button>
            </div>
          </div>

          {/* METRICS STATS */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-xs flex items-center justify-between">
              <div>
                <div className="text-xs text-slate-500 font-bold uppercase tracking-wider">Total Quotes Generated</div>
                <div className="text-2xl font-black text-slate-900 mt-1">{quotes.length}</div>
              </div>
              <div className="w-10 h-10 rounded-xl bg-amber-100 border border-amber-300 flex items-center justify-center text-amber-800 font-black">
                {quotes.length}
              </div>
            </div>

            <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-xs flex items-center justify-between">
              <div>
                <div className="text-xs text-slate-500 font-bold uppercase tracking-wider">Converted Bookings</div>
                <div className="text-2xl font-black text-emerald-600 mt-1">{completedCount + orderedCount}</div>
              </div>
              <div className="w-10 h-10 rounded-xl bg-emerald-100 border border-emerald-300 flex items-center justify-center text-emerald-800 font-black">
                {completedCount + orderedCount}
              </div>
            </div>

            <div className="bg-white border border-amber-200 p-5 rounded-2xl shadow-xs flex items-center justify-between bg-amber-50/40">
              <div>
                <div className="text-xs text-amber-800 font-bold uppercase tracking-wider">Pending Call Follow-Ups</div>
                <div className="text-2xl font-black text-amber-950 mt-1">{uncompletedCount}</div>
              </div>
              <div className="w-10 h-10 rounded-xl bg-amber-200 border border-amber-400 flex items-center justify-center text-amber-950 font-black">
                {uncompletedCount}
              </div>
            </div>
          </div>

          {/* QUOTES FEED CONTAINER */}
          <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-xs space-y-4">
            {/* SEARCH FILTER */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="relative flex-grow">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  placeholder="Search Quote ID, Customer Name, Mobile or Device..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-xs rounded-xl pl-10 pr-4 py-2.5 focus:bg-white focus:outline-none focus:border-amber-400 transition"
                />
              </div>
              <span className="text-xs text-slate-500 font-semibold shrink-0">
                Showing {filteredQuotes.length} of {quotes.length} quotes
              </span>
            </div>

            {loading ? (
              <div className="py-16 text-center">
                <Loader2 className="w-6 h-6 animate-spin text-amber-500 mx-auto mb-2" />
                <span className="text-xs text-slate-500 font-semibold">Loading saved quotes & leads...</span>
              </div>
            ) : error ? (
              <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-800 text-xs p-4 rounded-xl font-medium">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
                <span>{error}</span>
              </div>
            ) : filteredQuotes.length === 0 ? (
              <div className="text-center py-16 text-slate-400">
                <FileText className="w-10 h-10 mx-auto mb-3 opacity-30 text-amber-500" />
                <p className="text-sm font-bold text-slate-800">No quotes found</p>
                <p className="text-xs mt-1">Customer valuation quotes will populate here in real-time.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredQuotes.map((q) => (
                  <div
                    key={q.id}
                    className="bg-slate-50 border border-slate-200 hover:border-amber-400 hover:bg-white rounded-xl p-4 sm:p-5 transition shadow-2xs space-y-3"
                  >
                    {/* CARD TOP ROW: ID + TIME + STATUS */}
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-black text-amber-700 text-sm tracking-wide">
                          #{q.quoteNumber}
                        </span>
                        <span className="text-[11px] text-slate-500 flex items-center gap-1 font-medium">
                          <Clock className="w-3 h-3 text-slate-400" />
                          {q.createdAt
                            ? new Date(q.createdAt).toLocaleString("en-IN", {
                                day: "numeric",
                                month: "short",
                                hour: "2-digit",
                                minute: "2-digit",
                              })
                            : "—"}
                        </span>
                      </div>

                      <span
                        className={`text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider border ${
                          q.status === "COMPLETED"
                            ? "bg-emerald-50 text-emerald-800 border-emerald-300"
                            : q.status === "ORDERED" || q.status === "CONVERTED"
                            ? "bg-blue-50 text-blue-800 border-blue-300"
                            : q.status === "CANCELLED"
                            ? "bg-red-50 text-red-800 border-red-300"
                            : "bg-amber-100 text-amber-900 border-amber-300"
                        }`}
                      >
                        {q.status}
                      </span>
                    </div>

                    {/* DEVICE & VALUATION ROW */}
                    <div className="flex items-center justify-between gap-2 bg-white border border-slate-200 rounded-xl p-3">
                      <div className="flex items-center gap-2 min-w-0">
                        <Smartphone className="w-4 h-4 text-amber-600 shrink-0" />
                        <span className="font-bold text-slate-900 text-xs sm:text-sm truncate">
                          {q.deviceName}
                        </span>
                      </div>
                      <div className="text-right shrink-0">
                        <span className="text-[10px] text-slate-500 block font-semibold">Valuation</span>
                        <span className="font-black text-emerald-700 text-sm sm:text-base">
                          ₹{q.estimatedPrice.toLocaleString("en-IN")}
                        </span>
                      </div>
                    </div>

                    {/* CUSTOMER & CALL & SCHEDULE */}
                    <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                      <div className="flex items-center gap-2 flex-wrap">
                        <div className="font-bold text-slate-800 flex items-center gap-1.5">
                          <User className="w-3.5 h-3.5 text-slate-400" />
                          <span>{q.customerName || "Customer Lead"}</span>
                        </div>
                        {q.customerPhone && (
                          <a
                            href={`tel:${q.customerPhone}`}
                            className="inline-flex items-center gap-1 text-emerald-800 hover:text-emerald-900 font-mono font-bold bg-emerald-50 border border-emerald-300 px-2 py-0.5 rounded-lg transition"
                            title="Call customer lead"
                          >
                            <Phone className="w-3 h-3" />
                            <span>{q.customerPhone}</span>
                          </a>
                        )}
                      </div>

                      {q.pickupDate && (
                        <div className="inline-flex items-center gap-1 text-slate-600 text-[11px] bg-slate-100 px-2.5 py-1 rounded-lg border border-slate-200">
                          <Calendar className="w-3 h-3 text-amber-600" />
                          <span>{q.pickupDate} ({q.pickupTimeSlot || "Slot"})</span>
                        </div>
                      )}
                    </div>

                    {/* ACTION BUTTONS TOOLBAR */}
                    <div className="pt-2 border-t border-slate-200 flex items-center gap-2">
                      <button
                        onClick={() => setSelectedQuoteForAnswers(q)}
                        className="flex-1 inline-flex items-center justify-center gap-1.5 bg-white hover:bg-slate-100 text-cyan-800 border border-cyan-300 font-bold text-xs py-2 px-3 rounded-xl transition"
                      >
                        <ListChecks className="w-3.5 h-3.5 text-cyan-600" />
                        <span>Answers</span>
                      </button>

                      {q.status !== "ORDERED" && q.status !== "COMPLETED" && q.status !== "CONVERTED" && q.status !== "CANCELLED" ? (
                        <>
                          <button
                            onClick={() => {
                              setQuoteToConvert(q);
                              setConvertForm((prev) => ({
                                ...prev,
                                customerName: q.customerName || "",
                                customerPhone: q.customerPhone || "",
                              }));
                            }}
                            className="flex-1 inline-flex items-center justify-center gap-1.5 bg-amber-400 hover:bg-amber-500 text-amber-950 font-black text-xs py-2 px-3 rounded-xl border border-amber-500 transition shadow-2xs"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Convert to Order</span>
                          </button>
                          <button
                            onClick={() => handleCancelQuoteAdmin(q)}
                            className="p-2 bg-red-50 hover:bg-red-100 text-red-700 border border-red-300 rounded-xl transition"
                            title="Cancel Quote"
                          >
                            <Ban className="w-3.5 h-3.5" />
                          </button>
                        </>
                      ) : null}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>

      {/* CONVERT QUOTE TO ORDER MODAL */}
      {quoteToConvert && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white border border-slate-200 w-full max-w-xl rounded-2xl p-6 shadow-2xl space-y-5 my-8">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-amber-600" />
                <h3 className="text-base font-extrabold text-slate-900">Convert Lead Quote to Confirmed Order</h3>
              </div>
              <button
                onClick={() => setQuoteToConvert(null)}
                className="text-slate-400 hover:text-slate-700 text-xs font-bold"
              >
                ✕ Close
              </button>
            </div>

            {/* QUOTE SUMMARY */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-slate-500">Incoming Quote ID:</span>
                <span className="font-mono font-bold text-amber-900 bg-amber-100 px-2 py-0.5 rounded border border-amber-300">
                  {quoteToConvert.quoteNumber}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500">Target Generated Order ID:</span>
                <span className="font-mono font-black text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded border border-emerald-300 text-sm">
                  {`CA${quoteToConvert.quoteNumber.replace(/^(CAQ|Q)-?/i, "").replace(/[^0-9]/g, "")}`}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Device:</span>
                <span className="font-bold text-slate-800">{quoteToConvert.deviceName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Final Agreed Payout:</span>
                <span className="font-black text-emerald-700 text-sm">
                  ₹{quoteToConvert.estimatedPrice.toLocaleString("en-IN")}
                </span>
              </div>
            </div>

            <form onSubmit={handleConvertSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Customer Full Name</label>
                  <input
                    type="text"
                    required
                    value={convertForm.customerName}
                    onChange={(e) => setConvertForm({ ...convertForm, customerName: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-xl p-2.5 focus:bg-white focus:border-amber-400 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Customer Mobile Number</label>
                  <input
                    type="tel"
                    required
                    value={convertForm.customerPhone}
                    onChange={(e) => setConvertForm({ ...convertForm, customerPhone: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-xl p-2.5 focus:bg-white focus:border-amber-400 focus:outline-none font-mono"
                  />
                </div>
              </div>

              <div className="space-y-3 pt-2 border-t border-slate-100">
                <span className="text-slate-500 font-extrabold uppercase text-[10px] block">Doorstep Pickup Address</span>
                <div>
                  <label className="block text-slate-600 text-[11px] mb-1">
                    Address Line 1 <span className="text-amber-600">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Flat/House No., Building, Street / Road"
                    value={convertForm.line1}
                    onChange={(e) => setConvertForm({ ...convertForm, line1: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-xl p-2.5 focus:bg-white focus:border-amber-400 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 text-[11px] mb-1">
                    Address Line 2 <span className="text-slate-400">(Optional)</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Area, Landmark, Colony"
                    value={convertForm.line2}
                    onChange={(e) => setConvertForm({ ...convertForm, line2: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-xl p-2.5 focus:bg-white focus:border-amber-400 focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-600 text-[11px] mb-1">
                      State <span className="text-amber-600">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={convertForm.state}
                      onChange={(e) => setConvertForm({ ...convertForm, state: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-xl p-2.5 focus:bg-white focus:border-amber-400 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 text-[11px] mb-1">
                      PIN Code <span className="text-amber-600">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      maxLength={6}
                      value={convertForm.pincode}
                      onChange={(e) => setConvertForm({ ...convertForm, pincode: e.target.value.replace(/\D/g, "") })}
                      className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-xl p-2.5 focus:bg-white focus:border-amber-400 focus:outline-none font-mono"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-100">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Pickup Date</label>
                  <select
                    value={convertForm.pickupDate}
                    onChange={(e) => setConvertForm({ ...convertForm, pickupDate: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-xl p-2.5 focus:bg-white focus:border-amber-400 focus:outline-none"
                  >
                    <option value="Today">Today</option>
                    <option value="Tomorrow">Tomorrow</option>
                    <option value="Day After Tomorrow">Day After Tomorrow</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Pickup Time Slot</label>
                  <select
                    value={convertForm.pickupTimeSlot}
                    onChange={(e) => setConvertForm({ ...convertForm, pickupTimeSlot: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-xl p-2.5 focus:bg-white focus:border-amber-400 focus:outline-none"
                  >
                    <option value="10 AM - 1 PM">10 AM - 1 PM</option>
                    <option value="1 PM - 4 PM">1 PM - 4 PM</option>
                    <option value="4 PM - 7 PM">4 PM - 7 PM</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setQuoteToConvert(null)}
                  className="w-1/2 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={convertingOrder}
                  className="w-1/2 flex items-center justify-center gap-2 py-3 bg-amber-400 hover:bg-amber-500 text-amber-950 font-black rounded-xl border border-amber-500 transition shadow-xs disabled:opacity-60"
                >
                  {convertingOrder ? <Loader2 className="w-4 h-4 animate-spin text-amber-950" /> : <CheckCircle2 className="w-4 h-4" />}
                  <span>CONFIRM &amp; BOOK ORDER</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CUSTOMER ANSWERS & QC AUDIT MODAL */}
      <CustomerAnswersModal
        isOpen={!!selectedQuoteForAnswers}
        onClose={() => setSelectedQuoteForAnswers(null)}
        orderOrQuote={selectedQuoteForAnswers}
      />
    </div>
  );
}
