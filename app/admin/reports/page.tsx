"use client";

import React, { useState, useEffect, useCallback } from "react";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminHeader } from "@/components/admin/AdminHeader";
import {
  BarChart3,
  Download,
  FileText,
  Loader2,
  RefreshCw,
  IndianRupee,
  ShoppingBag,
  CheckCircle2,
  UserCheck,
  Search,
  Headset,
  ShieldCheck,
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

interface ReportEntry {
  id: string;
  orderNumber: string;
  date: string;
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

interface AgentPerf {
  agentName: string;
  completedLeads: number;
  totalPayout: number;
}

interface AdminLoginLog {
  id: string;
  adminName: string;
  loginTimeIST: string;
  ipAddress: string;
}

interface SupportCallLog {
  id: string;
  supportPersonName: string;
  quoteId: string;
  customerName: string;
  customerPhone: string;
  callOutcome: string;
  callTimeIST: string;
}

export default function AdminReportsPage() {
  const [entries, setEntries] = useState<ReportEntry[]>([]);
  const [summary, setSummary] = useState({ totalOrders: 0, paidOrders: 0, totalPayoutAmount: 0 });
  const [agentPerformance, setAgentPerformance] = useState<AgentPerf[]>([]);
  const [adminLogins, setAdminLogins] = useState<AdminLoginLog[]>([]);
  const [supportCalls, setSupportCalls] = useState<SupportCallLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchReportData = useCallback(async () => {
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
        if (json.agentPerformance) setAgentPerformance(json.agentPerformance);
        if (json.adminLogins) setAdminLogins(json.adminLogins);
        if (json.supportCalls) setSupportCalls(json.supportCalls);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchReportData();
  }, [fetchReportData]);

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
      item.agentName.toLowerCase().includes(q)
    );
  });

  const handleDownloadCSV = () => {
    if (filteredEntries.length === 0) return;
    const headers = [
      "Order Number",
      "Date",
      "Customer Name",
      "Customer Phone",
      "Pincode",
      "Address",
      "Device",
      "Amount Paid",
      "Payment Status",
      "URN / UTR",
      "Agent Name",
      "Status",
    ];
    const rows = filteredEntries.map((item) => [
      item.orderNumber,
      `"${item.date}"`,
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
    ]);
    const csvContent = "data:text/csv;charset=utf-8,\uFEFF" + [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `CashALL_Reports_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDownloadPDF = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col lg:flex-row w-full max-w-full overflow-x-hidden font-sans">
      <AdminSidebar />

      <div className="flex-1 flex flex-col min-w-0">
        <AdminHeader title="Reports & Intel Analytics" />

        <main className="flex-1 w-full max-w-full p-4 sm:p-6 lg:p-8 overflow-x-hidden space-y-6">
          {/* HEADER RIBBON */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs print:hidden">
            <div>
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-amber-100 border border-amber-300 flex items-center justify-center">
                  <BarChart3 className="w-5 h-5 text-amber-700" />
                </div>
                <div>
                  <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                    Reports &amp; Analytics
                  </h1>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Disbursements, agent metrics &amp; productivity records
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
                <FileText className="w-4 h-4" />
                <span>Print PDF</span>
              </button>

              <button
                onClick={fetchReportData}
                disabled={loading}
                className="flex items-center gap-2 text-xs font-bold text-amber-950 bg-amber-400 hover:bg-amber-500 px-4 py-2.5 rounded-xl border border-amber-500 transition shadow-2xs disabled:opacity-50"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
                <span>Refresh Analytics</span>
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

          {/* AGENT PERFORMANCE & INCENTIVES MATRIX */}
          <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                <UserCheck className="w-5 h-5 text-amber-600" />
                <span>Agent Completed Leads &amp; Incentive Matrix</span>
              </h2>
              <span className="text-xs text-slate-500 font-semibold">Database Record for Agent Salaries</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {agentPerformance.map((ap) => (
                <div key={ap.agentName} className="bg-slate-50 border border-slate-200 p-4 rounded-xl space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold text-sm text-slate-900">{ap.agentName}</span>
                    <span className="bg-emerald-50 text-emerald-800 border border-emerald-300 text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase">
                      ACTIVE AGENT
                    </span>
                  </div>
                  <div className="flex justify-between text-xs pt-1 border-t border-slate-200">
                    <span className="text-slate-500 uppercase font-bold text-[11px]">LEADS COMPLETED:</span>
                    <span className="font-bold text-emerald-700 font-mono">{ap.completedLeads}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-500 uppercase font-bold text-[11px]">LEADS NOT COMPLETED:</span>
                    <span className="font-bold text-amber-800 font-mono">{(ap as any).uncompletedLeads || 0}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-500 uppercase font-bold text-[11px]">Total Value:</span>
                    <span className="font-black text-emerald-700 font-price">₹{ap.totalPayout.toLocaleString("en-IN")}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* RECENT ADMIN LOGINS AUDIT TRAIL */}
          <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-amber-600" />
                <span>Recent Admin Login Audit Trail ({adminLogins.length})</span>
              </h2>
              <span className="text-xs text-slate-500 font-semibold">Recorded Logins for Operators</span>
            </div>

            {adminLogins.length === 0 ? (
              <div className="text-center py-6 text-slate-400 text-xs">No admin logins logged yet in database.</div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {adminLogins.map((log) => (
                  <div
                    key={log.id}
                    className="bg-slate-50 border border-slate-200 hover:border-amber-400 hover:bg-white rounded-xl p-4 transition shadow-2xs space-y-2"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-bold text-slate-900 text-xs sm:text-sm">{log.adminName}</span>
                      <span className="bg-amber-100 text-amber-900 border border-amber-300 text-[9px] font-black px-2 py-0.5 rounded-full uppercase">
                        ADMIN
                      </span>
                    </div>
                    <div className="text-xs text-slate-600 font-mono">
                      <div className="text-[11px] text-slate-500">Login Time (IST):</div>
                      <div className="font-semibold">{log.loginTimeIST}</div>
                    </div>
                    <div className="pt-1.5 border-t border-slate-200 text-[10px] text-slate-500 font-mono flex items-center justify-between">
                      <span>IP Address:</span>
                      <span className="text-slate-800">{log.ipAddress}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* SUPPORT TEAM CALL LOGS AUDIT TRAIL */}
          <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                <Headset className="w-5 h-5 text-blue-600" />
                <span>Support Team Call Records &amp; Incentive Log ({supportCalls.length})</span>
              </h2>
              <span className="text-xs text-slate-500 font-semibold">Database Records for Support Salaries</span>
            </div>

            {supportCalls.length === 0 ? (
              <div className="text-center py-6 text-slate-400 text-xs">
                No support calls recorded yet. Logged calls will populate here automatically.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {supportCalls.map((sc) => (
                  <div
                    key={sc.id}
                    className="bg-slate-50 border border-slate-200 hover:border-amber-400 hover:bg-white rounded-xl p-4 transition shadow-2xs space-y-2.5"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-bold text-slate-900 text-xs">{sc.supportPersonName}</span>
                      <span className="bg-blue-50 text-blue-800 border border-blue-300 text-[9px] font-black px-2 py-0.5 rounded-full uppercase">
                        {sc.callOutcome.replace(/_/g, " ")}
                      </span>
                    </div>

                    <div className="bg-white border border-slate-200 rounded-xl p-2.5 space-y-1 text-xs">
                      <div className="flex items-center justify-between gap-1 font-mono text-[11px]">
                        <span className="text-slate-500">Quote:</span>
                        <span className="text-amber-800 font-bold">#{sc.quoteId}</span>
                      </div>
                      <div className="font-bold text-slate-900 truncate">{sc.customerName}</div>
                      {sc.customerPhone && (
                        <a
                          href={`tel:${sc.customerPhone}`}
                          className="inline-flex items-center gap-1 text-[11px] text-emerald-700 font-mono font-bold hover:underline"
                        >
                          📞 {sc.customerPhone}
                        </a>
                      )}
                    </div>

                    <div className="text-[10px] text-slate-500 font-mono text-right">
                      {sc.callTimeIST}
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
