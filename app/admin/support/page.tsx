"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminHeader } from "@/components/admin/AdminHeader";
import {
  Headset,
  Plus,
  Loader2,
  Phone,
  Lock,
  User,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Eye,
  EyeOff,
  UserPlus,
  Download,
  ExternalLink,
  Clock,
  Radio,
  Smartphone,
  Copy,
  Check,
  PhoneCall,
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

interface CallRecordingItem {
  id: string;
  supportPersonName: string;
  supportPersonPhone: string;
  customerName?: string;
  customerPhone: string;
  deviceName?: string;
  quoteId?: string;
  durationSeconds: number;
  durationFormatted: string;
  audioUrl: string;
  callOutcome: string;
  callNotes: string;
  callStartTime: string;
  callEndTime: string;
  createdAtIST: string;
}

interface SupportStaff {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: string;
  loginPassword?: string;
  createdAt: string;
  callsCount?: number;
  totalTalkTime?: string;
  recordingsCount?: number;
  lastLoginTime?: string;
  lastLogoutTime?: string;
  sessionStatus?: string;
}

interface SupportSessionLog {
  id: string;
  action: string;
  staffName: string;
  phone: string;
  event: string;
  timestamp: string;
}

export default function AdminSupportManagementPage() {
  const [supportStaff, setSupportStaff] = useState<SupportStaff[]>([]);
  const [sessionLogs, setSessionLogs] = useState<SupportSessionLog[]>([]);
  const [recordings, setRecordings] = useState<CallRecordingItem[]>([]);
  const [recordingSearch, setRecordingSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Form State: Full Name, User Name, Phone Number, Password
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    phone: "",
    password: "",
  });

  const fetchStaff = useCallback(async () => {
    setError("");
    try {
      const token = getAdminToken();
      const res = await fetch("/api/v1/admin/support", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const json = await res.json();
      if (json.success) {
        const staff = json.supportStaff || [];
        const sessions = json.sessionLogs || [];
        const recs = json.recordings || [];
        setSupportStaff(staff);
        setSessionLogs(sessions);
        setRecordings(recs);

        try {
          sessionStorage.setItem("cashall_admin_support_staff", JSON.stringify(staff));
          sessionStorage.setItem("cashall_admin_support_sessions", JSON.stringify(sessions));
          sessionStorage.setItem("cashall_admin_support_recs", JSON.stringify(recs));
        } catch {}
      } else {
        setError(json.error || "Failed to fetch support staff");
      }
    } catch (err: any) {
      setError(err.message || "Network error fetching support staff");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    try {
      const cachedStaff = sessionStorage.getItem("cashall_admin_support_staff");
      const cachedSessions = sessionStorage.getItem("cashall_admin_support_sessions");
      const cachedRecs = sessionStorage.getItem("cashall_admin_support_recs");
      if (cachedStaff) {
        setSupportStaff(JSON.parse(cachedStaff));
        if (cachedSessions) setSessionLogs(JSON.parse(cachedSessions));
        if (cachedRecs) setRecordings(JSON.parse(cachedRecs));
        setLoading(false);
      }
    } catch {}
    fetchStaff();
  }, [fetchStaff]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      setError("Full Name is required.");
      return;
    }
    if (!formData.username.trim()) {
      setError("User Name is required.");
      return;
    }
    if (!formData.phone.trim()) {
      setError("Phone Number is required.");
      return;
    }
    if (!formData.password.trim()) {
      setError("Password is required.");
      return;
    }

    setSubmitting(true);
    setError("");
    setSuccess("");

    try {
      const token = getAdminToken();
      const res = await fetch("/api/v1/admin/support", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const json = await res.json();

      if (json.success) {
        setSuccess(`✅ Support staff "${formData.name}" registered successfully!`);
        setFormData({
          name: "",
          username: "",
          phone: "",
          password: "",
        });
        fetchStaff();
      } else {
        setError(json.error || "Failed to create support staff.");
      }
    } catch (err: any) {
      setError(err.message || "Error submitting form.");
    } finally {
      setSubmitting(false);
    }
  };

  const copyPassword = (id: string, text: string) => {
    navigator.clipboard?.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDownloadCSV = () => {
    if (supportStaff.length === 0) return;
    const headers = [
      "Support Staff Name",
      "Email / User Name",
      "Phone Number",
      "Login Password",
      "Session Status",
      "Last Log In (Date & Time)",
      "Last Log Out (Date & Time)",
      "Customer Calls Logged",
      "Created Date",
    ];
    const rows = supportStaff.map((s) => [
      `"${(s.name || "").replace(/"/g, '""')}"`,
      `"${(s.email || "").replace(/"/g, '""')}"`,
      `"=""${s.phone || ""}"""`,
      `"${(s.loginPassword || s.phone || "Ank933967@").replace(/"/g, '""')}"`,
      `"${s.sessionStatus || "OFFLINE"}"`,
      `"${(s.lastLoginTime || "—").replace(/"/g, '""')}"`,
      `"${(s.lastLogoutTime || "—").replace(/"/g, '""')}"`,
      s.callsCount || 0,
      `"${new Date(s.createdAt).toLocaleDateString("en-IN", { timeZone: "Asia/Kolkata", day: "2-digit", month: "short", year: "numeric" })}"`,
    ]);
    const csvContent = "data:text/csv;charset=utf-8,\uFEFF" + [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `CashALL_Support_Team_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDownloadSessionLogsCSV = () => {
    if (sessionLogs.length === 0) return;
    const headers = ["Staff Name", "Session Event", "Date & Time (IST)", "Contact Phone"];
    const rows = sessionLogs.map((l) => [
      `"${(l.staffName || "").replace(/"/g, '""')}"`,
      `"${(l.event || "").replace(/"/g, '""')}"`,
      `"${(l.timestamp || "").replace(/"/g, '""')}"`,
      `"=""${l.phone || ""}"""`,
    ]);
    const csvContent = "data:text/csv;charset=utf-8,\uFEFF" + [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `CashALL_Support_Attendance_Audit_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col lg:flex-row w-full max-w-full overflow-x-hidden font-sans">
      <AdminSidebar />

      <div className="flex-1 flex flex-col min-w-0">
        <AdminHeader title="Support Operations Console" />

        <main className="flex-1 w-full max-w-full p-4 sm:p-6 lg:p-8 overflow-x-hidden space-y-6">
          {/* HEADER RIBBON */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs print:hidden">
            <div>
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-amber-100 border border-amber-300 flex items-center justify-center">
                  <Headset className="w-5 h-5 text-amber-700" />
                </div>
                <div>
                  <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                    Support Team Management
                  </h1>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Staff credentials &amp; customer calling records
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <Link
                href="/admin/support/calls"
                className="flex items-center gap-2 bg-amber-400 hover:bg-amber-500 text-amber-950 border border-amber-500 text-xs font-black px-4 py-2.5 rounded-xl transition shadow-xs"
              >
                <Radio className="w-4 h-4 text-amber-950 animate-pulse" />
                <span>Call Logs ({recordings.length})</span>
              </Link>

              <Link
                href="/support/dashboard"
                target="_blank"
                className="flex items-center gap-1.5 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 text-xs font-bold px-3.5 py-2.5 rounded-xl transition shadow-xs"
              >
                <ExternalLink className="w-3.5 h-3.5 text-amber-600" />
                <span>Support App</span>
              </Link>

              <button
                onClick={handleDownloadCSV}
                disabled={supportStaff.length === 0}
                className="flex items-center gap-1.5 bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100 text-xs font-bold px-3.5 py-2.5 rounded-xl transition disabled:opacity-50"
              >
                <Download className="w-3.5 h-3.5" />
                <span>CSV</span>
              </button>

              <button
                onClick={fetchStaff}
                disabled={loading}
                className="flex items-center gap-1.5 text-xs font-bold text-slate-700 bg-white hover:bg-slate-100 px-3.5 py-2.5 rounded-xl border border-slate-200 transition disabled:opacity-50"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
                <span>Refresh</span>
              </button>
            </div>
          </div>

          {/* FEEDBACK NOTIFICATIONS */}
          {error && (
            <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-800 text-xs p-4 rounded-xl font-medium">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs p-4 rounded-xl font-medium">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
              <span>{success}</span>
            </div>
          )}

          {/* 2-COLUMN LAYOUT: REGISTRATION FORM + ACTIVE STAFF CARDS */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* REGISTRATION FORM */}
            <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-xs space-y-4 print:hidden">
              <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                <UserPlus className="w-5 h-5 text-amber-600" />
                <h2 className="text-base font-extrabold text-slate-900">Create Staff Member</h2>
              </div>
              <p className="text-xs text-slate-500">
                Provide credentials for support agents to log into the CashALL Support App.
              </p>

              <form onSubmit={handleSubmit} className="space-y-3.5 pt-2">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Full Legal Name
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                    <input
                      type="text"
                      required
                      placeholder="e.g., Ankan Ghosh"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-xs rounded-xl pl-10 pr-3 py-3 focus:bg-white focus:outline-none focus:border-amber-400 transition"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    User Name / Email Handle
                  </label>
                  <div className="relative">
                    <ShieldCheck className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                    <input
                      type="text"
                      required
                      placeholder="e.g., ankan or ankan@cashall.in"
                      value={formData.username}
                      onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-xs rounded-xl pl-10 pr-3 py-3 focus:bg-white focus:outline-none focus:border-amber-400 transition"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Official Phone Number (10 Digits)
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                    <input
                      type="tel"
                      required
                      placeholder="e.g., 9339676767"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value.replace(/\D/g, "") })}
                      maxLength={10}
                      className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-xs rounded-xl pl-10 pr-3 py-3 focus:bg-white focus:outline-none focus:border-amber-400 transition"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Login Password
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      placeholder="Set login password"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-xs rounded-xl pl-10 pr-10 py-3 focus:bg-white focus:outline-none focus:border-amber-400 transition"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-3.5 text-slate-400 hover:text-amber-600 transition"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full flex items-center justify-center gap-2 bg-amber-400 hover:bg-amber-500 text-amber-950 font-black text-xs py-3 rounded-xl border border-amber-500 transition shadow-xs disabled:opacity-60 mt-2"
                >
                  {submitting ? (
                    <Loader2 className="w-4 h-4 animate-spin text-amber-950" />
                  ) : (
                    <>
                      <Plus className="w-4 h-4" />
                      <span>Register Support Staff</span>
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* ACTIVE SUPPORT STAFF CARDS */}
            <div className="lg:col-span-2 bg-white border border-slate-200 p-6 rounded-2xl shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                  <Headset className="w-5 h-5 text-amber-600" />
                  <span>Active Support Team ({supportStaff.length})</span>
                </h2>
                <span className="text-xs text-slate-500 font-mono">Real-time Session Status</span>
              </div>

              {loading ? (
                <div className="flex items-center justify-center py-16">
                  <Loader2 className="w-6 h-6 animate-spin text-amber-500" />
                  <span className="ml-2 text-xs text-slate-500 font-semibold">Loading support staff...</span>
                </div>
              ) : supportStaff.length === 0 ? (
                <div className="text-center py-12 text-slate-400 text-xs">
                  No support team staff members registered yet.
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                  {supportStaff.map((staff) => {
                    const password = staff.loginPassword || staff.phone || "Ank933967@";
                    const isOnline = staff.sessionStatus === "ONLINE";

                    return (
                      <div
                        key={staff.id}
                        className="bg-slate-50 border border-slate-200 hover:border-amber-400 hover:bg-white transition rounded-xl p-4 space-y-3 shadow-2xs flex flex-col justify-between"
                      >
                        <div>
                          {/* HEADER: NAME + ONLINE STATUS */}
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex items-center gap-2.5 min-w-0">
                              <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold text-xs shrink-0 border border-amber-300">
                                {staff.name.charAt(0).toUpperCase()}
                              </div>
                              <div className="min-w-0">
                                <h3 className="font-extrabold text-slate-900 text-sm truncate">{staff.name}</h3>
                                <p className="text-[11px] text-slate-500 truncate">{staff.email}</p>
                              </div>
                            </div>

                            <span
                              className={`inline-flex items-center gap-1.5 text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider shrink-0 border ${
                                isOnline
                                  ? "bg-emerald-50 text-emerald-800 border-emerald-300"
                                  : "bg-slate-100 text-slate-600 border-slate-200"
                              }`}
                            >
                              <span
                                className={`w-1.5 h-1.5 rounded-full ${
                                  isOnline ? "bg-emerald-500 animate-pulse" : "bg-slate-400"
                                }`}
                              />
                              <span>{staff.sessionStatus || "OFFLINE"}</span>
                            </span>
                          </div>

                          {/* PHONE & DIRECT CALL */}
                          <div className="mt-3 flex items-center justify-between gap-2 bg-white px-3 py-2 rounded-xl border border-slate-200">
                            <div className="flex items-center gap-2 min-w-0">
                              <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                              <span className="font-mono text-xs text-slate-700">{staff.phone}</span>
                            </div>
                            {staff.phone && (
                              <a
                                href={`tel:${staff.phone}`}
                                className="text-[10px] font-bold text-amber-700 hover:text-amber-800 transition"
                              >
                                Direct Call
                              </a>
                            )}
                          </div>

                          {/* PASSWORD BADGE WITH 1-TAP COPY */}
                          <div className="mt-2.5 flex items-center justify-between gap-2 bg-white px-3 py-2 rounded-xl border border-slate-200">
                            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                              Password:
                            </span>
                            <button
                              type="button"
                              onClick={() => copyPassword(staff.id, password)}
                              className="flex items-center gap-1.5 font-mono text-xs text-amber-950 font-bold hover:bg-amber-100 transition bg-amber-50 px-2 py-0.5 rounded border border-amber-300"
                              title="Click to copy password"
                            >
                              <span>{password}</span>
                              {copiedId === staff.id ? (
                                <Check className="w-3 h-3 text-emerald-600" />
                              ) : (
                                <Copy className="w-3 h-3 text-amber-700" />
                              )}
                            </button>
                          </div>
                        </div>

                        {/* STATS FOOTER */}
                        <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-500">
                          <div className="flex items-center gap-1 font-semibold text-slate-800">
                            <PhoneCall className="w-3.5 h-3.5 text-amber-600" />
                            <span>{staff.callsCount || 0} Calls</span>
                          </div>
                          {staff.totalTalkTime && (
                            <div className="flex items-center gap-1 font-mono text-amber-700">
                              <Clock className="w-3 h-3" />
                              <span>{staff.totalTalkTime}</span>
                            </div>
                          )}
                          <span className="text-[10px] font-mono text-slate-400">
                            {staff.lastLoginTime ? `Active: ${staff.lastLoginTime.split(" ")[0]}` : "No login yet"}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* SUPPORT ATTENDANCE & SESSION AUDIT LOG CARDS */}
          <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-xs space-y-4 print:hidden">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
              <div>
                <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-amber-600" />
                  <span>Support Attendance &amp; Activity Stream ({sessionLogs.length})</span>
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Exact log in and log out timestamps recorded for support staff members
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleDownloadSessionLogsCSV}
                  disabled={sessionLogs.length === 0}
                  className="flex items-center gap-1.5 text-xs font-bold text-slate-700 bg-slate-50 hover:bg-slate-100 px-3 py-1.5 rounded-xl border border-slate-200 transition disabled:opacity-50"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Export Attendance CSV</span>
                </button>
                <button
                  onClick={fetchStaff}
                  disabled={loading}
                  className="flex items-center gap-1.5 text-xs font-bold text-amber-950 bg-amber-400 hover:bg-amber-500 px-3 py-1.5 rounded-xl border border-amber-500 transition shadow-2xs"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
                  <span>Refresh</span>
                </button>
              </div>
            </div>

            {sessionLogs.length === 0 ? (
              <div className="text-center py-8 text-slate-400 text-xs">
                No recent session logs recorded. Activity will automatically log when staff signs in or signs out.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {sessionLogs.map((log) => (
                  <div
                    key={log.id}
                    className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 space-y-2.5 shadow-2xs"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2 min-w-0">
                        <User className="w-4 h-4 text-amber-600 shrink-0" />
                        <span className="font-extrabold text-slate-900 text-xs truncate">{log.staffName}</span>
                      </div>
                      <span
                        className={`inline-flex items-center gap-1 text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider border ${
                          log.action === "SUPPORT_LOGIN"
                            ? "bg-emerald-50 text-emerald-800 border-emerald-300"
                            : "bg-slate-100 text-slate-600 border-slate-200"
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            log.action === "SUPPORT_LOGIN" ? "bg-emerald-500 animate-pulse" : "bg-slate-400"
                          }`}
                        />
                        <span>{log.event}</span>
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-slate-500 font-mono pt-1 border-t border-slate-200">
                      <span>{log.timestamp}</span>
                      <span>{log.phone}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* CUSTOMER CALL LOGS CARDS */}
          <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-xs space-y-4 print:hidden">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
              <div>
                <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                  <Radio className="w-5 h-5 text-emerald-600 animate-pulse" />
                  <span>Customer Call Logs ({recordings.length})</span>
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Synced automatically by CashALL Caller App with duration, outcomes, and timestamps
                </p>
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                <Link
                  href="/admin/support/calls"
                  className="inline-flex items-center gap-1.5 text-xs text-amber-950 font-extrabold bg-amber-400 hover:bg-amber-500 px-3.5 py-1.5 rounded-xl border border-amber-500 transition shadow-2xs"
                >
                  <span>Dedicated Audio Logs →</span>
                </Link>
                <input
                  type="text"
                  placeholder="Search phone or agent..."
                  value={recordingSearch}
                  onChange={(e) => setRecordingSearch(e.target.value)}
                  className="bg-slate-50 border border-slate-200 text-slate-900 text-xs rounded-xl px-3 py-1.5 focus:bg-white focus:outline-none focus:border-amber-400 transition"
                />
                <button
                  onClick={fetchStaff}
                  className="inline-flex items-center gap-1.5 text-xs text-slate-700 bg-white hover:bg-slate-100 px-3 py-1.5 rounded-xl font-bold transition border border-slate-200"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Refresh</span>
                </button>
              </div>
            </div>

            {recordings.length === 0 ? (
              <div className="text-center py-12 text-slate-400 text-xs">
                No customer calls logged yet. Once the caller app dials customers, call logs will appear here automatically.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
                {recordings
                  .filter((rec) => {
                    if (!recordingSearch.trim()) return true;
                    const q = recordingSearch.toLowerCase();
                    return (
                      rec.customerPhone.includes(q) ||
                      rec.customerName?.toLowerCase().includes(q) ||
                      rec.deviceName?.toLowerCase().includes(q) ||
                      rec.supportPersonName.toLowerCase().includes(q) ||
                      rec.supportPersonPhone.includes(q) ||
                      rec.quoteId?.toLowerCase().includes(q)
                    );
                  })
                  .map((rec) => (
                    <div
                      key={rec.id}
                      className="bg-slate-50 border border-slate-200 hover:border-amber-400 hover:bg-white transition rounded-xl p-4 space-y-3 shadow-2xs flex flex-col justify-between"
                    >
                      <div>
                        {/* CALL HEADER: AGENT & OUTCOME */}
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0">
                            <div className="flex items-center gap-1.5">
                              <User className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                              <span className="font-bold text-slate-900 text-xs truncate">{rec.supportPersonName}</span>
                            </div>
                            <span className="text-[10px] text-slate-500 font-mono">{rec.supportPersonPhone}</span>
                          </div>

                          <span
                            className={`text-[9px] font-black uppercase px-2.5 py-0.5 rounded-full border shrink-0 ${
                              rec.callOutcome === "CALL_COMPLETED"
                                ? "bg-emerald-50 border-emerald-300 text-emerald-800"
                                : rec.callOutcome === "CUSTOMER_INTERESTED"
                                ? "bg-blue-50 border-blue-300 text-blue-800"
                                : "bg-slate-100 border-slate-200 text-slate-700"
                            }`}
                          >
                            {rec.callOutcome.replace(/_/g, " ")}
                          </span>
                        </div>

                        {/* CUSTOMER & DEVICE */}
                        <div className="mt-3 bg-white p-3 rounded-xl border border-slate-200 space-y-1.5">
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-slate-900 text-xs truncate">
                              {rec.customerName || "Customer Lead"}
                            </span>
                            <a
                              href={`tel:${rec.customerPhone}`}
                              className="text-emerald-700 hover:text-emerald-800 font-mono text-xs flex items-center gap-1 font-semibold"
                            >
                              <Phone className="w-3 h-3" />
                              <span>{rec.customerPhone}</span>
                            </a>
                          </div>

                          {rec.deviceName && rec.deviceName !== "—" && (
                            <div className="text-[11px] text-slate-700 font-medium flex items-center gap-1.5 truncate">
                              <Smartphone className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                              <span className="truncate">{rec.deviceName}</span>
                            </div>
                          )}

                          {rec.quoteId && rec.quoteId !== "N/A" && (
                            <div className="inline-block text-[10px] font-mono text-amber-950 font-extrabold bg-amber-100 border border-amber-300 px-2 py-0.5 rounded mt-0.5">
                              Quote: {rec.quoteId}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* FOOTER: DURATION & TIMESTAMP */}
                      <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-[11px] font-mono">
                        <span className="text-slate-500">{rec.createdAtIST}</span>
                        <span className="inline-flex items-center gap-1 text-amber-900 bg-amber-100 px-2 py-0.5 rounded border border-amber-300 font-bold">
                          <Clock className="w-3 h-3 text-amber-700" />
                          <span>{rec.durationFormatted}</span>
                        </span>
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
