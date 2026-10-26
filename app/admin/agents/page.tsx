"use client";

import React, { useState, useEffect, useCallback } from "react";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminHeader } from "@/components/admin/AdminHeader";
import {
  UserCheck,
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
  PhoneCall,
  Download,
  Copy,
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

interface Agent {
  id: string;
  name: string | null;
  email: string | null;
  phone: string;
  status: string;
  createdAt: string;
  _count?: {
    assignedOrders: number;
  };
}

export default function AdminAgentsPage() {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  // Form State: Full Name, User Name, Phone Number, Password
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    phone: "",
    password: "",
  });

  const fetchAgents = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const token = getAdminToken();
      const res = await fetch("/api/v1/admin/agents", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const json = await res.json();
      if (json.success && Array.isArray(json.agents)) {
        setAgents(json.agents);
      } else {
        setError(json.error || "Failed to load agents list.");
      }
    } catch (err: any) {
      setError(err.message || "Network error loading agents.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAgents();
  }, [fetchAgents]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      setError("Agent Full Name is required.");
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
      const res = await fetch("/api/v1/admin/agents", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const json = await res.json();

      if (json.success) {
        setSuccess(`✅ Agent "${formData.name}" (Username: ${formData.username}) created successfully in PostgreSQL!`);
        setFormData({ name: "", username: "", phone: "", password: "" });
        await fetchAgents();
      } else {
        setError(json.error || "Failed to create agent.");
      }
    } catch (err: any) {
      setError(err.message || "Error submitting form.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col lg:flex-row w-full max-w-full overflow-x-hidden font-sans">
      <AdminSidebar />

      <div className="flex-1 flex flex-col min-w-0">
        <AdminHeader title="Field Agents & Technicians" />

        <main className="flex-1 w-full max-w-full p-4 sm:p-6 lg:p-8 overflow-x-hidden space-y-6">
          {/* HEADER RIBBON */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
            <div>
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-amber-100 border border-amber-300 flex items-center justify-center">
                  <UserCheck className="w-5 h-5 text-amber-700" />
                </div>
                <div>
                  <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                    Agent Management
                  </h1>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Onboard field agents &amp; manage app credentials
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 flex-wrap">
              <a
                href="/CashALL-Agent.apk"
                download="CashALL-Agent.apk"
                className="flex items-center gap-2 text-xs font-bold text-slate-700 bg-slate-50 hover:bg-slate-100 px-3.5 py-2.5 rounded-xl transition border border-slate-200 shadow-2xs"
                title="Download Latest CashALL Agent APK"
              >
                <Download className="w-3.5 h-3.5 text-amber-600" />
                <span>Agent APK</span>
              </a>

              <button
                onClick={() => {
                  if (typeof window !== "undefined") {
                    navigator.clipboard.writeText("https://cashall.in/download/agent");
                    setCopiedLink(true);
                    setTimeout(() => setCopiedLink(false), 2500);
                  }
                }}
                className="flex items-center gap-1.5 text-xs font-bold text-amber-950 bg-amber-100 hover:bg-amber-200 border border-amber-300 px-3.5 py-2.5 rounded-xl transition"
              >
                {copiedLink ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-amber-700" />}
                <span>{copiedLink ? "Link Copied!" : "Copy Link"}</span>
              </button>

              <button
                onClick={fetchAgents}
                disabled={loading}
                className="flex items-center gap-2 text-xs font-bold text-amber-950 bg-amber-400 hover:bg-amber-500 px-4 py-2.5 rounded-xl border border-amber-500 transition shadow-2xs disabled:opacity-50"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
                <span>Refresh List</span>
              </button>
            </div>
          </div>

          {/* GRID LAYOUT: FORM + AGENTS TABLE */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* CREATE AGENT FORM */}
            <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-xs space-y-4 h-fit">
              <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
                <Plus className="w-5 h-5 text-amber-600" />
                <h2 className="text-base font-extrabold text-slate-900">Register New Field Agent</h2>
              </div>

              {error && (
                <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-800 text-xs p-3.5 rounded-xl font-medium">
                  <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
                  <span>{error}</span>
                </div>
              )}

              {success && (
                <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs p-3.5 rounded-xl font-medium">
                  <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                  <span>{success}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* AGENT FULL NAME */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Agent Full Name</label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="text"
                      required
                      placeholder="e.g. HYDER ALI"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-xs rounded-xl pl-9 pr-3 py-2.5 focus:bg-white focus:outline-none focus:border-amber-400 transition"
                    />
                  </div>
                </div>

                {/* USER NAME */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">User Name (For Login)</label>
                  <div className="relative">
                    <UserPlus className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="text"
                      required
                      placeholder="e.g. hyderali or HYDER ALI"
                      value={formData.username}
                      onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-xs rounded-xl pl-9 pr-3 py-2.5 focus:bg-white focus:outline-none focus:border-amber-400 transition"
                    />
                  </div>
                </div>

                {/* PHONE NUMBER */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Phone Number</label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="tel"
                      required
                      placeholder="10-digit Mobile Number"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-xs rounded-xl pl-9 pr-3 py-2.5 focus:bg-white focus:outline-none focus:border-amber-400 transition"
                    />
                  </div>
                </div>

                {/* PASSWORD */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Password</label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      placeholder="Login Password for Agent Portal"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-xs rounded-xl pl-9 pr-9 py-2.5 focus:bg-white focus:outline-none focus:border-amber-400 transition"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-3 text-slate-400 hover:text-amber-600 transition"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full flex items-center justify-center gap-2 bg-amber-400 hover:bg-amber-500 text-amber-950 font-black text-xs py-3 rounded-xl border border-amber-500 transition shadow-xs disabled:opacity-60"
                >
                  {submitting ? <Loader2 className="w-4 h-4 animate-spin text-amber-950" /> : <ShieldCheck className="w-4 h-4" />}
                  <span>Register Agent (Role: AGENT)</span>
                </button>
              </form>
            </div>

            {/* AGENTS LIST TABLE */}
            <div className="lg:col-span-2 bg-white border border-slate-200 p-6 rounded-2xl shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <h2 className="text-base font-extrabold text-slate-900">
                  Active Field Agents ({agents.length})
                </h2>
                <span className="text-[11px] text-slate-500">Supabase &amp; Prisma Verified</span>
              </div>

              {loading ? (
                <div className="py-12 text-center">
                  <Loader2 className="w-6 h-6 animate-spin text-amber-500 mx-auto mb-2" />
                  <span className="text-xs text-slate-500">Loading registered agents...</span>
                </div>
              ) : agents.length === 0 ? (
                <div className="py-12 text-center text-slate-400 text-xs">
                  No field agents registered yet. Use the form on the left to add your first field agent.
                </div>
              ) : (
                <div className="space-y-3">
                  {agents.map((agent) => (
                    <div
                      key={agent.id}
                      className="bg-slate-50 border border-slate-200 hover:border-amber-400 hover:bg-white rounded-xl p-4 sm:p-5 transition shadow-2xs space-y-3"
                    >
                      {/* TOP ROW: NAME & STATUS */}
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2 min-w-0">
                          <div className="w-8 h-8 rounded-xl bg-amber-100 border border-amber-300 flex items-center justify-center shrink-0">
                            <User className="w-4 h-4 text-amber-800" />
                          </div>
                          <div className="min-w-0">
                            <span className="font-extrabold text-slate-900 text-sm block truncate">
                              {agent.name || "Field Agent"}
                            </span>
                            <span className="text-[10px] text-slate-400">
                              Joined {new Date(agent.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                            </span>
                          </div>
                        </div>

                        <span className="bg-emerald-50 text-emerald-800 border border-emerald-300 text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase shrink-0">
                          {agent.status || "ACTIVE"}
                        </span>
                      </div>

                      {/* CONTACT & ASSIGNMENT STATS */}
                      <div className="flex items-center justify-between gap-2 bg-white border border-slate-200 rounded-xl p-3 flex-wrap">
                        <div>
                          <span className="text-[10px] text-slate-500 block font-semibold">Mobile Contact</span>
                          {agent.phone ? (
                            <a
                              href={`tel:${agent.phone}`}
                              className="inline-flex items-center gap-1.5 text-emerald-700 hover:text-emerald-800 font-mono font-bold text-xs mt-0.5 transition"
                            >
                              <Phone className="w-3.5 h-3.5" />
                              <span>{agent.phone}</span>
                            </a>
                          ) : (
                            <span className="text-xs text-slate-400">No phone</span>
                          )}
                        </div>

                        <div className="text-right">
                          <span className="text-[10px] text-slate-500 block font-semibold">Assigned Leads</span>
                          <span className="inline-flex items-center gap-1 text-xs font-black text-amber-950 bg-amber-100 border border-amber-300 px-2.5 py-0.5 rounded-lg mt-0.5">
                            {agent._count?.assignedOrders ?? 0} Orders
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
