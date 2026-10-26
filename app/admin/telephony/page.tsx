"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  PhoneCall,
  PhoneIncoming,
  PhoneOutgoing,
  RefreshCw,
  Search,
  Filter,
  Play,
  Pause,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Shield,
  ExternalLink,
  Volume2,
  Calendar,
  User,
  ShoppingBag,
  ArrowUpRight,
  Radio,
  FileAudio,
} from "lucide-react";

interface TelephonyCall {
  id: string;
  callSid?: string;
  direction: "INBOUND" | "OUTBOUND";
  status: string;
  callerId: string;
  fromNumber: string;
  toNumber: string;
  customerName: string;
  agentName: string;
  orderNumber?: string;
  orderId?: string;
  purpose: string;
  durationSeconds: number;
  durationFormatted: string;
  price?: number;
  currency: string;
  recordingStatus: string;
  hasRecording: boolean;
  recordingUrl?: string;
  createdAtIST: string;
}

interface TelephonyStats {
  balance: {
    amount: number;
    currency: string;
    isLowBalance: boolean;
    threshold: number;
    lastRefreshedAt: string;
  };
  account: {
    sid: string;
    friendlyName: string;
    type: string;
    status: string;
    kycStatus: string;
  };
  config: {
    callerId: string;
    appName: string;
    businessNumber: string;
    subdomain: string;
    isConfigured: boolean;
  };
  usage: {
    today: { calls: number; durationSeconds: number; spendINR: number };
    monthly: { calls: number; durationSeconds: number; spendINR: number };
    lifetime: { calls: number; durationSeconds: number; spendINR: number };
  };
  health: {
    status: string;
    lastCallAt?: string;
  };
}

export default function AdminTelephonyPage() {
  const [stats, setStats] = useState<TelephonyStats | null>(null);
  const [calls, setCalls] = useState<TelephonyCall[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshingBalance, setRefreshingBalance] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [directionFilter, setDirectionFilter] = useState("");

  // Audio Playback state
  const [activePlayingId, setActivePlayingId] = useState<string | null>(null);
  const [audioError, setAudioError] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Manual Dial Modal
  const [showDialModal, setShowDialModal] = useState(false);
  const [dialOrderNumber, setDialOrderNumber] = useState("");
  const [dialCustomerPhone, setDialCustomerPhone] = useState("");
  const [dialCustomerName, setDialCustomerName] = useState("");
  const [dialing, setDialing] = useState(false);
  const [dialFeedback, setDialFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const fetchTelephonyData = async () => {
    try {
      setLoading(true);
      const token = typeof window !== "undefined" ? localStorage.getItem("cashall_admin_token") || "" : "";
      const headers = { Authorization: `Bearer ${token}` };

      const [balanceRes, callsRes] = await Promise.all([
        fetch("/api/v1/telephony/balance", { headers }).then((r) => r.json()),
        fetch(`/api/v1/telephony/calls?status=${statusFilter}&direction=${directionFilter}&search=${searchQuery}`, {
          headers,
        }).then((r) => r.json()),
      ]);

      if (balanceRes.success) setStats(balanceRes);
      if (callsRes.success) setCalls(callsRes.data || []);
    } catch (err) {
      console.error("Failed to load telephony data:", err);
    } finally {
      setLoading(false);
    }
  };

  const refreshBalance = async () => {
    try {
      setRefreshingBalance(true);
      const token = typeof window !== "undefined" ? localStorage.getItem("cashall_admin_token") || "" : "";
      const res = await fetch("/api/v1/telephony/balance", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) {
        setStats(data);
      }
    } catch (err) {
      console.error("Failed to refresh balance:", err);
    } finally {
      setRefreshingBalance(false);
    }
  };

  useEffect(() => {
    fetchTelephonyData();
  }, [statusFilter, directionFilter]);

  const handlePlayRecording = (call: TelephonyCall) => {
    if (!call.recordingUrl) return;

    if (activePlayingId === call.id) {
      if (audioRef.current) {
        audioRef.current.pause();
        setActivePlayingId(null);
      }
      return;
    }

    setAudioError(null);
    if (audioRef.current) {
      audioRef.current.pause();
    }

    const audio = new Audio(call.recordingUrl);
    audioRef.current = audio;
    setActivePlayingId(call.id);

    audio.play().catch((err) => {
      console.error("Playback error:", err);
      setAudioError("Unable to play recording. Audio may still be processing by Exotel.");
      setActivePlayingId(null);
    });

    audio.onended = () => {
      setActivePlayingId(null);
    };
  };

  const handleInitiateCall = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!dialCustomerPhone && !dialOrderNumber) {
      setDialFeedback({ type: "error", message: "Enter an Order Number or Customer Phone Number" });
      return;
    }

    try {
      setDialing(true);
      setDialFeedback(null);
      const token = typeof window !== "undefined" ? localStorage.getItem("cashall_admin_token") || "" : "";

      const res = await fetch("/api/v1/telephony/call", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          orderNumber: dialOrderNumber || undefined,
          customerPhone: dialCustomerPhone || undefined,
          customerName: dialCustomerName || "Customer Lead",
          purpose: "ADMIN_ASSISTED_CALL",
        }),
      });

      const data = await res.json();
      if (data.success) {
        setDialFeedback({
          type: "success",
          message: "Call initiated! Your phone will ring first, followed by the customer.",
        });
        setTimeout(() => {
          setShowDialModal(false);
          setDialOrderNumber("");
          setDialCustomerPhone("");
          setDialFeedback(null);
          fetchTelephonyData();
        }, 3000);
      } else {
        setDialFeedback({ type: "error", message: data.error || "Failed to initiate call" });
      }
    } catch (err: any) {
      setDialFeedback({ type: "error", message: err.message || "Network error" });
    } finally {
      setDialing(false);
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      {/* HEADER SECTION */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl border border-blue-100 shadow-xs">
              <PhoneCall className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
                Exotel Telephony Console
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Live Mumbai Gateway
                </span>
              </h1>
              <p className="text-sm text-slate-500 mt-0.5">
                Cloud calling, two-way automatic recording, number privacy, and real-time credit monitoring.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowDialModal(true)}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg shadow-xs transition-colors flex items-center gap-2"
          >
            <PhoneOutgoing className="w-4 h-4" />
            Place Call
          </button>
          <a
            href="https://my.exotel.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="px-3.5 py-2 border border-slate-200 hover:bg-slate-50 text-slate-700 text-sm font-medium rounded-lg shadow-xs transition-colors flex items-center gap-1.5"
          >
            Exotel Portal
            <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
          </a>
        </div>
      </div>

      {/* LOW CREDIT BANNER */}
      {stats?.balance?.isLowBalance && (
        <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 flex items-start sm:items-center justify-between gap-3 text-amber-900 shadow-xs">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
            <div>
              <p className="text-sm font-bold">Low Exotel Credit Balance Alert</p>
              <p className="text-xs text-amber-700">
                Current balance is {stats.balance.amount} credits (Threshold: {stats.balance.threshold}). Please recharge
                your account on the Exotel portal to prevent call interruptions.
              </p>
            </div>
          </div>
          <a
            href="https://my.exotel.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-1.5 bg-amber-600 text-white text-xs font-semibold rounded-lg hover:bg-amber-700 transition-colors shrink-0"
          >
            Recharge Now
          </a>
        </div>
      )}

      {/* METRICS & OVERVIEW CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Balance Card */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Exotel Balance</span>
            <button
              onClick={refreshBalance}
              disabled={refreshingBalance}
              title="Refresh Balance from Exotel API"
              className="p-1.5 text-slate-400 hover:text-blue-600 rounded-lg hover:bg-slate-100 transition-colors"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${refreshingBalance ? "animate-spin text-blue-600" : ""}`} />
            </button>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-slate-900 tracking-tight">
              {stats?.balance ? stats.balance.amount : "—"}
            </span>
            <span className="text-xs font-semibold text-slate-500">Credits</span>
          </div>
          <div className="flex items-center justify-between pt-1 text-xs text-slate-500 border-t border-slate-100">
            <span>Type: {stats?.account?.type || "Trial"}</span>
            <span className="text-emerald-600 font-semibold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> Active
            </span>
          </div>
        </div>

        {/* Today's Usage Card */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Calls Today</span>
            <div className="p-1.5 bg-blue-50 text-blue-600 rounded-lg">
              <PhoneOutgoing className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-slate-900 tracking-tight">
              {stats?.usage?.today?.calls ?? 0}
            </span>
            <span className="text-xs font-semibold text-slate-500">Calls</span>
          </div>
          <div className="flex items-center justify-between pt-1 text-xs text-slate-500 border-t border-slate-100">
            <span>Duration: {Math.round((stats?.usage?.today?.durationSeconds ?? 0) / 60)} mins</span>
            <span>Spend: ₹{(stats?.usage?.today?.spendINR ?? 0).toFixed(2)}</span>
          </div>
        </div>

        {/* Monthly Usage Card */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Monthly Usage</span>
            <div className="p-1.5 bg-indigo-50 text-indigo-600 rounded-lg">
              <Calendar className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-slate-900 tracking-tight">
              {stats?.usage?.monthly?.calls ?? 0}
            </span>
            <span className="text-xs font-semibold text-slate-500">Total Calls</span>
          </div>
          <div className="flex items-center justify-between pt-1 text-xs text-slate-500 border-t border-slate-100">
            <span>Duration: {Math.round((stats?.usage?.monthly?.durationSeconds ?? 0) / 60)} mins</span>
            <span>Spend: ₹{(stats?.usage?.monthly?.spendINR ?? 0).toFixed(2)}</span>
          </div>
        </div>

        {/* Gateway & Privacy Status */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Gateway Status</span>
            <div className="p-1.5 bg-emerald-50 text-emerald-600 rounded-lg">
              <Shield className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
              <span>{stats?.config?.callerId || "09513886363"}</span>
              <span className="text-[10px] font-extrabold px-1.5 py-0.5 rounded bg-blue-100 text-blue-800">
                EXOPHONE
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">Caller ID Masking Active</p>
          </div>
          <div className="flex items-center justify-between pt-1 text-xs text-slate-500 border-t border-slate-100">
            <span>App: {stats?.config?.appName || "Landing Flow"}</span>
            <span className="text-blue-600 font-semibold">2-Way Rec</span>
          </div>
        </div>
      </div>

      {/* CALL LOGS & PLAYBACK SECTION */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        {/* Table Filters Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="relative flex-1 sm:w-72">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search by customer, order #, phone..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && fetchTelephonyData()}
                className="w-full pl-9 pr-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button
              onClick={fetchTelephonyData}
              className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg transition-colors"
            >
              Search
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <select
              value={directionFilter}
              onChange={(e) => setDirectionFilter(e.target.value)}
              className="px-3 py-2 text-xs border border-slate-200 rounded-lg bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Directions</option>
              <option value="OUTBOUND">Outbound</option>
              <option value="INBOUND">Inbound</option>
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 text-xs border border-slate-200 rounded-lg bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Statuses</option>
              <option value="COMPLETED">Completed</option>
              <option value="BUSY">Busy</option>
              <option value="NO_ANSWER">No Answer</option>
              <option value="FAILED">Failed</option>
            </select>
          </div>
        </div>

        {/* Audio Error Alert if any */}
        {audioError && (
          <div className="mx-5 mt-4 p-3 bg-red-50 text-red-700 text-xs rounded-lg border border-red-200 flex items-center justify-between">
            <span>{audioError}</span>
            <button onClick={() => setAudioError(null)} className="font-bold ml-2">
              Dismiss
            </button>
          </div>
        )}

        {/* Calls Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50 text-slate-500 uppercase font-semibold text-[11px] tracking-wider border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Time (IST)</th>
                <th className="py-3 px-4">Direction</th>
                <th className="py-3 px-4">Agent / Caller</th>
                <th className="py-3 px-4">Customer</th>
                <th className="py-3 px-4">Order #</th>
                <th className="py-3 px-4">Duration</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Charges</th>
                <th className="py-3 px-4 text-right">Recording Playback</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-slate-400">
                    <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-blue-500" />
                    Loading telephony records from database...
                  </td>
                </tr>
              ) : calls.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-slate-400">
                    <PhoneCall className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                    No telephony calls recorded yet. Use the "Place Call" button or initiate an agent call to test!
                  </td>
                </tr>
              ) : (
                calls.map((call) => (
                  <tr key={call.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4 font-medium text-slate-900 whitespace-nowrap">
                      {call.createdAtIST}
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      {call.direction === "INBOUND" ? (
                        <span className="inline-flex items-center gap-1 text-emerald-700 bg-emerald-50 border border-emerald-200 font-semibold px-2 py-0.5 rounded">
                          <PhoneIncoming className="w-3 h-3" /> Inbound
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-blue-700 bg-blue-50 border border-blue-200 font-semibold px-2 py-0.5 rounded">
                          <PhoneOutgoing className="w-3 h-3" /> Outbound
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 font-medium text-slate-800 whitespace-nowrap">
                      <div>{call.agentName}</div>
                      <div className="text-[10px] text-slate-400">{call.fromNumber}</div>
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <div className="font-semibold text-slate-900">{call.customerName}</div>
                      <div className="text-[10px] text-slate-500 font-mono">{call.toNumber}</div>
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      {call.orderNumber ? (
                        <Link
                          href={`/admin/orders?orderNumber=${call.orderNumber}`}
                          className="font-bold text-blue-600 hover:underline flex items-center gap-1"
                        >
                          {call.orderNumber}
                          <ArrowUpRight className="w-3 h-3" />
                        </Link>
                      ) : (
                        <span className="text-slate-400">—</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 font-medium text-slate-700 whitespace-nowrap">
                      {call.durationFormatted}
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                          call.status === "COMPLETED"
                            ? "bg-emerald-100 text-emerald-800"
                            : call.status === "BUSY" || call.status === "NO_ANSWER"
                            ? "bg-amber-100 text-amber-800"
                            : call.status === "IN_PROGRESS" || call.status === "RINGING"
                            ? "bg-blue-100 text-blue-800 animate-pulse"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {call.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-medium text-slate-700 whitespace-nowrap">
                      {call.price !== undefined && call.price !== null ? `₹${call.price.toFixed(2)}` : "—"}
                    </td>
                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      {call.hasRecording ? (
                        <button
                          onClick={() => handlePlayRecording(call)}
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                            activePlayingId === call.id
                              ? "bg-blue-600 text-white shadow-xs"
                              : "bg-slate-100 hover:bg-blue-50 hover:text-blue-600 text-slate-700"
                          }`}
                        >
                          {activePlayingId === call.id ? (
                            <>
                              <Pause className="w-3.5 h-3.5" /> Playing
                            </>
                          ) : (
                            <>
                              <Play className="w-3.5 h-3.5 text-blue-600" /> Play Recording
                            </>
                          )}
                        </button>
                      ) : call.recordingStatus === "PENDING" ? (
                        <span className="text-[11px] text-slate-400 italic">Processing...</span>
                      ) : (
                        <span className="text-[11px] text-slate-400">Unavailable</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* PLACE CALL MODAL */}
      {showDialModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <PhoneOutgoing className="w-5 h-5 text-blue-600" />
                Place Customer Call
              </h2>
              <button
                onClick={() => setShowDialModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-500">
              This initiates an Exotel two-way call. The gateway calls the admin/agent phone first, then connects to the
              customer displaying the business ExoPhone ({stats?.config?.callerId || "09513886363"}).
            </p>

            <form onSubmit={handleInitiateCall} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  CashALL Order Number (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. CA73378"
                  value={dialOrderNumber}
                  onChange={(e) => setDialOrderNumber(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Customer Phone Number
                </label>
                <input
                  type="text"
                  placeholder="10-digit mobile number"
                  value={dialCustomerPhone}
                  onChange={(e) => setDialCustomerPhone(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Customer Name (Optional)
                </label>
                <input
                  type="text"
                  placeholder="Customer name"
                  value={dialCustomerName}
                  onChange={(e) => setDialCustomerName(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {dialFeedback && (
                <div
                  className={`p-3 text-xs rounded-lg ${
                    dialFeedback.type === "success"
                      ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                      : "bg-red-50 text-red-800 border border-red-200"
                  }`}
                >
                  {dialFeedback.message}
                </div>
              )}

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowDialModal(false)}
                  className="px-4 py-2 border border-slate-200 text-slate-700 text-xs font-semibold rounded-lg hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={dialing}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg shadow-xs flex items-center gap-1.5 disabled:opacity-50"
                >
                  {dialing ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <PhoneCall className="w-3.5 h-3.5" />}
                  {dialing ? "Dialing..." : "Connect Call"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
