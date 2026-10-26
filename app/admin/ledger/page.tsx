"use client";

import React, { useState, useEffect, useCallback } from "react";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminHeader } from "@/components/admin/AdminHeader";
import {
  FileText,
  Download,
  Loader2,
  RefreshCw,
  IndianRupee,
  ShoppingBag,
  CheckCircle2,
  Search,
  Receipt,
  Printer,
  Smartphone,
  Phone,
  User,
  Copy,
  Check,
  Clock,
} from "lucide-react";

function getAdminToken() {
  if (typeof window === "undefined") return "tok_admin_master_session";
  try {
    const saved = JSON.parse(localStorage.getItem("cashall_admin_session") || "{}");
    return saved?.token || "tok_admin_master_session";
  } catch {
    return "tok_admin_master_session";
  }
}

interface LedgerEntry {
  id: string;
  orderNumber: string;
  date: string;
  orderPlacedAt?: string;
  settledAt?: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  pincode: string;
  address: string;
  deviceName: string;
  amountPaid: number;
  paymentStatus: string;
  urn: string;
  agentName: string;
  status: string;
}

export default function AdminLedgerPage() {
  const [entries, setEntries] = useState<LedgerEntry[]>([]);
  const [summary, setSummary] = useState({ totalOrders: 0, paidOrders: 0, totalPayoutAmount: 0 });
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [copiedUtr, setCopiedUtr] = useState<string | null>(null);

  const fetchLedgerData = useCallback(async () => {
    setLoading(true);
    try {
      const token = getAdminToken();
      const res = await fetch(`/api/v1/admin/reports?t=${Date.now()}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const json = await res.json();
      if (json.success) {
        setEntries(json.data || []);
        if (json.summary) setSummary(json.summary);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLedgerData();
  }, [fetchLedgerData]);

  const filteredEntries = entries.filter((item) => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    return (
      item.orderNumber.toLowerCase().includes(q) ||
      item.customerName.toLowerCase().includes(q) ||
      item.customerPhone.includes(q) ||
      item.pincode.includes(q) ||
      item.urn.toLowerCase().includes(q) ||
      item.deviceName.toLowerCase().includes(q) ||
      item.agentName.toLowerCase().includes(q) ||
      item.status.toLowerCase().includes(q)
    );
  });

  const parseDateTimeParts = (dateStr?: string) => {
    if (!dateStr || dateStr === "—") return { date: "—", time: "—" };
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return { date: dateStr, time: "—" };
      return {
        date: d.toLocaleDateString("en-IN", { timeZone: "Asia/Kolkata", day: "2-digit", month: "short", year: "numeric" }),
        time: d.toLocaleTimeString("en-IN", { timeZone: "Asia/Kolkata", hour: "2-digit", minute: "2-digit", hour12: true }),
      };
    } catch {
      return { date: dateStr, time: "—" };
    }
  };

  const handleDownloadCSV = () => {
    if (filteredEntries.length === 0) return;
    const headers = [
      "Order Number",
      "Order Placed Date",
      "Order Placed Time",
      "Settlement Date",
      "Settlement Time",
      "Customer Name",
      "Customer Phone",
      "Pincode",
      "Doorstep Address",
      "Device Model",
      "Disbursed Amount (INR)",
      "Payment Status",
      "Banking Reference / UTR",
      "Assigned Agent",
      "Order Status",
    ];
    const rows = filteredEntries.map((item) => {
      const placed = parseDateTimeParts(item.orderPlacedAt || item.date);
      const settled = parseDateTimeParts(item.settledAt);
      return [
        item.orderNumber,
        `"${placed.date}"`,
        `"${placed.time}"`,
        `"${settled.date}"`,
        `"${settled.time}"`,
        `"${item.customerName.replace(/"/g, '""')}"`,
        item.customerPhone,
        item.pincode,
        `"${item.address.replace(/"/g, '""')}"`,
        `"${item.deviceName.replace(/"/g, '""')}"`,
        item.amountPaid,
        item.paymentStatus,
        item.urn,
        `"${item.agentName.replace(/"/g, '""')}"`,
        item.status,
      ];
    });
    const csvContent = "data:text/csv;charset=utf-8,\uFEFF" + [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `CashALL_Audit_Ledger_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDownloadPDF = () => {
    if (typeof document !== "undefined") {
      document.title = `CashALL_Audit_Ledger_${new Date().toISOString().slice(0, 10)}`;
    }
    window.print();
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col lg:flex-row w-full max-w-full overflow-x-hidden font-sans">
      <AdminSidebar />

      <div className="flex-1 flex flex-col min-w-0">
        <AdminHeader title="Treasury & Ledger" />

        <main className="flex-1 w-full max-w-full p-4 sm:p-6 lg:p-8 overflow-x-hidden space-y-6">
          {/* HEADER RIBBON */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs print:hidden">
            <div>
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-amber-100 border border-amber-300 flex items-center justify-center">
                  <Receipt className="w-5 h-5 text-amber-700" />
                </div>
                <div>
                  <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                    Transaction Audit Ledger
                  </h1>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Settlements, UTR references &amp; payment records
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 flex-wrap">
              <button
                onClick={handleDownloadCSV}
                disabled={filteredEntries.length === 0}
                className="flex items-center gap-2 bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100 text-xs font-bold px-4 py-2.5 rounded-xl transition disabled:opacity-50"
              >
                <Download className="w-4 h-4" />
                <span>Export CSV</span>
              </button>

              <button
                onClick={handleDownloadPDF}
                disabled={filteredEntries.length === 0}
                className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold px-4 py-2.5 rounded-xl border border-slate-200 transition disabled:opacity-50"
              >
                <Printer className="w-4 h-4" />
                <span>Print PDF</span>
              </button>

              <button
                onClick={fetchLedgerData}
                disabled={loading}
                className="flex items-center gap-2 text-xs font-bold text-amber-950 bg-amber-400 hover:bg-amber-500 px-4 py-2.5 rounded-xl border border-amber-500 transition shadow-2xs disabled:opacity-50"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
                <span>Refresh Ledger</span>
              </button>
            </div>
          </div>

          {/* SUMMARY STAT CARDS */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 print:hidden">
            <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-xs flex items-center gap-4">
              <div className="p-3 bg-amber-100 text-amber-800 border border-amber-300 rounded-xl">
                <ShoppingBag className="w-6 h-6" />
              </div>
              <div>
                <div className="text-xs text-slate-500 font-bold uppercase">Total Orders</div>
                <div className="text-2xl font-black text-slate-900 font-price">{summary.totalOrders}</div>
              </div>
            </div>

            <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-xs flex items-center gap-4">
              <div className="p-3 bg-emerald-100 text-emerald-800 border border-emerald-300 rounded-xl">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <div className="text-xs text-slate-500 font-bold uppercase">Settled Payments</div>
                <div className="text-2xl font-black text-emerald-700 font-price">{summary.paidOrders}</div>
              </div>
            </div>

            <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-xs flex items-center gap-4">
              <div className="p-3 bg-amber-100 text-amber-900 border border-amber-300 rounded-xl">
                <IndianRupee className="w-6 h-6" />
              </div>
              <div>
                <div className="text-xs text-slate-500 font-bold uppercase">Total Disbursed Payout</div>
                <div className="text-2xl font-black text-emerald-700 font-price">
                  ₹{summary.totalPayoutAmount.toLocaleString("en-IN")}
                </div>
              </div>
            </div>
          </div>

          {/* FULL AUDIT LEDGER TABLE */}
          <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 pb-4 print:hidden">
              <h2 className="text-lg font-extrabold text-slate-900">Transaction Audit Stream</h2>

              <div className="relative w-full sm:w-80">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  placeholder="Search order number, customer, UTR, agent..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-xs rounded-xl pl-10 pr-4 py-2.5 focus:bg-white focus:outline-none focus:border-amber-400 transition"
                />
              </div>
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-16">
                <Loader2 className="w-6 h-6 animate-spin text-amber-500" />
                <span className="ml-2 text-xs text-slate-500 font-semibold">Generating live audit ledger...</span>
              </div>
            ) : filteredEntries.length === 0 ? (
              <div className="text-center py-16 text-slate-400">
                <FileText className="w-10 h-10 mx-auto mb-3 opacity-30 text-amber-600" />
                <p className="text-sm font-bold text-slate-800">No ledger entries found</p>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredEntries.map((item) => (
                  <div
                    key={item.id}
                    className="bg-slate-50 border border-slate-200 hover:border-amber-400 hover:bg-white rounded-xl p-4 sm:p-5 transition shadow-2xs space-y-3"
                  >
                    {/* CARD HEADER: ORDER NUMBER + SETTLED DATE + STATUS */}
                    <div className="flex items-center justify-between gap-2 flex-wrap">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-black text-amber-800 text-sm tracking-wide">
                          #{item.orderNumber}
                        </span>
                        <span className="text-[11px] text-slate-500 flex items-center gap-1 font-medium bg-white border border-slate-200 px-2 py-0.5 rounded-md">
                          <Clock className="w-3 h-3 text-slate-400" />
                          <span>Settled: {item.settledAt || item.date}</span>
                        </span>
                      </div>

                      <span
                        className={`text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider border ${
                          item.paymentStatus === "PAID" || item.status === "COMPLETED"
                            ? "bg-emerald-50 text-emerald-800 border-emerald-300"
                            : "bg-amber-100 text-amber-900 border-amber-300"
                        }`}
                      >
                        {item.paymentStatus}
                      </span>
                    </div>

                    {/* DEVICE & DISBURSED AMOUNT */}
                    <div className="flex items-center justify-between gap-2 bg-white border border-slate-200 rounded-xl p-3">
                      <div className="flex items-center gap-2 min-w-0">
                        <Smartphone className="w-4 h-4 text-amber-600 shrink-0" />
                        <span className="font-bold text-slate-900 text-xs sm:text-sm truncate">
                          {item.deviceName}
                        </span>
                      </div>
                      <div className="text-right shrink-0">
                        <span className="text-[10px] text-slate-500 block font-semibold">Disbursed</span>
                        <span className="font-black text-emerald-700 font-price text-sm sm:text-base">
                          ₹{item.amountPaid.toLocaleString("en-IN")}
                        </span>
                      </div>
                    </div>

                    {/* CUSTOMER & CONTACT & PINCODE */}
                    <div className="flex items-center justify-between gap-2 text-xs flex-wrap">
                      <div>
                        <div className="font-bold text-slate-900">{item.customerName}</div>
                        <div className="text-[11px] text-slate-500">
                          PIN: {item.pincode} • {item.address}
                        </div>
                      </div>

                      {item.customerPhone && (
                        <a
                          href={`tel:${item.customerPhone}`}
                          className="inline-flex items-center gap-1 text-emerald-800 hover:text-emerald-900 font-mono font-bold text-xs bg-emerald-50 border border-emerald-300 px-2.5 py-1 rounded-xl transition"
                        >
                          <Phone className="w-3.5 h-3.5" />
                          <span>{item.customerPhone}</span>
                        </a>
                      )}
                    </div>

                    {/* BANKING & ASSIGNED AGENT FOOTER */}
                    <div className="pt-2 border-t border-slate-200 flex items-center justify-between gap-2 flex-wrap text-xs">
                      {/* BANK UTR WITH COPY BUTTON */}
                      <div className="flex items-center gap-1.5 font-mono">
                        <span className="text-slate-500 text-[11px]">UTR:</span>
                        <span className="font-bold text-amber-900 bg-amber-100 px-2 py-0.5 rounded border border-amber-300">
                          {item.urn}
                        </span>
                        {item.urn && item.urn !== "—" && item.urn !== "N/A" && (
                          <button
                            type="button"
                            onClick={() => {
                              navigator.clipboard.writeText(item.urn);
                              setCopiedUtr(item.urn);
                              setTimeout(() => setCopiedUtr(null), 2000);
                            }}
                            className="text-slate-400 hover:text-amber-800 transition p-1"
                            title="Copy UTR Reference"
                          >
                            {copiedUtr === item.urn ? (
                              <Check className="w-3.5 h-3.5 text-emerald-600" />
                            ) : (
                              <Copy className="w-3.5 h-3.5" />
                            )}
                          </button>
                        )}
                      </div>

                      <div className="flex items-center gap-1 text-slate-600 text-[11px]">
                        <User className="w-3.5 h-3.5 text-slate-400" />
                        <span>Field Tech: {item.agentName}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
