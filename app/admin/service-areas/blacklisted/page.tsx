"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminHeader } from "@/components/admin/AdminHeader";
import {
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  MapPin,
  Search,
  Plus,
  Download,
  Filter,
  CheckCircle2,
  XCircle,
  FileText,
  Clock,
  RotateCcw,
  ExternalLink,
  ChevronRight,
  Loader2,
  Trash2,
  AlertOctagon,
  Building2,
  Info,
  Check,
} from "lucide-react";

interface Incident {
  title: string;
  date: string;
  detail: string;
  type: "police" | "device" | "bot" | "warning";
}

interface BlacklistedZone {
  id: string;
  pincode: string;
  locality: string;
  subArea: string;
  hubNode: string;
  hubName: string;
  tier: "Hard Blacklist" | "Safety Redline" | "Fraud Syndicate" | "Escrow Pre-Auth" | "Slum Cluster";
  reason: string;
  riskScore: number;
  policeFirs?: string;
  failedVisits?: string;
  enforcement: string;
  status: "Active" | "Pending Field Audit" | "Bypass Exception";
  perimeterKm2: number;
  coordinates: string;
  notes?: string;
  incidents: Incident[];
  updatedAt: string;
}

export default function AdminBlacklistedPincodesPage() {
  const [zones, setZones] = useState<BlacklistedZone[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedZone, setSelectedZone] = useState<BlacklistedZone | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedHub, setSelectedHub] = useState("ALL");
  const [selectedTier, setSelectedTier] = useState("ALL");
  const [selectedStatus, setSelectedStatus] = useState("ALL");

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formPincode, setFormPincode] = useState("");
  const [formLocality, setFormLocality] = useState("");
  const [formSubArea, setFormSubArea] = useState("");
  const [formHub, setFormHub] = useState("DEL-02 Node");
  const [formTier, setFormTier] = useState<BlacklistedZone["tier"]>("Hard Blacklist");
  const [formReason, setFormReason] = useState("");
  const [formEnforcement, setFormEnforcement] = useState("Auto-Reject (₹0 Cap)");
  const [formRiskScore, setFormRiskScore] = useState(90);
  const [formNotes, setFormNotes] = useState("");

  // Override note in inspector
  const [overrideNote, setOverrideNote] = useState("");

  const fetchZones = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/v1/admin/service-areas/blacklist");
      const json = await res.json();
      if (json.success && Array.isArray(json.data)) {
        setZones(json.data);
        if (json.data.length > 0 && !selectedZone) {
          setSelectedZone(json.data[0]);
        }
      }
    } catch (err) {
      console.error("Failed to load blacklisted zones:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchZones();
  }, []);

  const filteredZones = useMemo(() => {
    return zones.filter((z) => {
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        const matches =
          z.pincode.includes(q) ||
          z.locality.toLowerCase().includes(q) ||
          z.subArea.toLowerCase().includes(q) ||
          z.reason.toLowerCase().includes(q);
        if (!matches) return false;
      }
      if (selectedHub !== "ALL" && !z.hubNode.includes(selectedHub)) {
        return false;
      }
      if (selectedTier !== "ALL" && z.tier !== selectedTier) {
        return false;
      }
      if (selectedStatus !== "ALL" && z.status !== selectedStatus) {
        return false;
      }
      return true;
    });
  }, [zones, searchQuery, selectedHub, selectedTier, selectedStatus]);

  const handleAddBlacklist = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formPincode || !formLocality || !formReason) return;
    try {
      setIsSubmitting(true);
      const newRecord = {
        pincode: formPincode.trim(),
        locality: formLocality.trim(),
        subArea: formSubArea.trim() || formLocality.trim(),
        hubNode: formHub,
        hubName: formHub.startsWith("DEL") ? "Delhi NCR" : formHub.startsWith("BLR") ? "Bengaluru" : formHub.startsWith("BOM") ? "Mumbai" : "Hyderabad",
        tier: formTier,
        reason: formReason.trim(),
        riskScore: Number(formRiskScore) || 85,
        enforcement: formEnforcement,
        status: "Active",
        perimeterKm2: 3.0,
        coordinates: "28.6139° N, 77.2090° E",
        notes: formNotes.trim(),
      };

      const res = await fetch("/api/v1/admin/service-areas/blacklist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "ADD", item: newRecord }),
      });
      const json = await res.json();
      if (json.success) {
        setZones(json.data);
        const added = json.data.find((x: BlacklistedZone) => x.pincode === formPincode.trim());
        if (added) setSelectedZone(added);
        setIsModalOpen(false);
        setFormPincode("");
        setFormLocality("");
        setFormSubArea("");
        setFormReason("");
        setFormNotes("");
      }
    } catch (err) {
      console.error("Error creating blacklisted zone:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (zone: BlacklistedZone) => {
    if (!confirm(`Are you sure you want to remove ${zone.pincode} (${zone.locality}) from the security exclusion blacklist?`)) {
      return;
    }
    try {
      const res = await fetch("/api/v1/admin/service-areas/blacklist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "DELETE", item: { pincode: zone.pincode } }),
      });
      const json = await res.json();
      if (json.success) {
        setZones(json.data);
        if (selectedZone?.pincode === zone.pincode) {
          setSelectedZone(json.data[0] || null);
        }
      }
    } catch (err) {
      console.error("Failed to delete zone:", err);
    }
  };

  const handleUpdateStatus = async (status: BlacklistedZone["status"]) => {
    if (!selectedZone) return;
    try {
      const res = await fetch("/api/v1/admin/service-areas/blacklist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "UPDATE_STATUS",
          item: { pincode: selectedZone.pincode, status, notes: overrideNote },
        }),
      });
      const json = await res.json();
      if (json.success) {
        setZones(json.data);
        const updated = json.data.find((x: BlacklistedZone) => x.pincode === selectedZone.pincode);
        if (updated) setSelectedZone(updated);
        setOverrideNote("");
      }
    } catch (err) {
      console.error("Failed to update status:", err);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col lg:flex-row w-full max-w-full">
      <AdminSidebar />

      <div className="flex-1 flex flex-col min-w-0">
        <AdminHeader />

        <main className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto w-full">
          {/* Breadcrumbs & Status Tag */}
          <div className="flex flex-col gap-1">
            <div className="flex items-center justify-between text-slate-500 text-xs font-semibold uppercase tracking-wider">
              <div className="flex items-center gap-1.5 flex-wrap">
                <Link href="/admin" className="hover:text-slate-800 transition">Admin</Link>
                <span>/</span>
                <span className="hover:text-slate-800 transition">Logistics</span>
                <span>/</span>
                <Link href="/admin/service-areas" className="hover:text-slate-800 transition">Service Areas</Link>
                <span>/</span>
                <span className="text-amber-600 font-bold">Restricted & Blacklisted Pincodes</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 font-semibold text-xs border border-amber-300">
                  <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
                  Geofence Engine v4.2 Active
                </span>
              </div>
            </div>

            {/* Page Header Ribbon */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pt-2">
              <div>
                <div className="flex items-center gap-3">
                  <h1 className="text-2xl font-black text-slate-900 tracking-tight">
                    Restricted & Blacklisted Pincodes
                  </h1>
                  <span className="px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-800 border border-rose-200 text-xs font-bold uppercase tracking-wide">
                    {zones.length} Active Redlines
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-slate-500 mt-1">
                  Manage security exclusion zones, high-fraud pin codes, technician safety redlines, chronic fake-order clusters, and unserviceable postal districts across NCR, BLR, BOM, and HYD.
                </p>
              </div>

              <div className="flex items-center gap-2.5 shrink-0">
                <button
                  onClick={() => {
                    const csvContent =
                      "data:text/csv;charset=utf-8," +
                      ["Pincode,Locality,Hub,Tier,RiskScore,Enforcement,Status", ...zones.map((z) => `${z.pincode},"${z.locality}",${z.hubNode},${z.tier},${z.riskScore},"${z.enforcement}",${z.status}`)].join("\n");
                    const encodedUri = encodeURI(csvContent);
                    const link = document.createElement("a");
                    link.setAttribute("href", encodedUri);
                    link.setAttribute("download", `Cashall_Exclusion_Master_${Date.now()}.csv`);
                    document.body.appendChild(link);
                    link.click();
                  }}
                  className="flex items-center gap-1.5 px-3.5 py-2 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 rounded-xl text-xs font-bold shadow-sm transition"
                >
                  <Download className="w-3.5 h-3.5 text-slate-500" />
                  <span>Export Master (.csv)</span>
                </button>

                <button
                  onClick={() => setIsModalOpen(true)}
                  className="flex items-center gap-1.5 px-4 py-2 bg-amber-400 hover:bg-amber-500 text-amber-950 font-bold rounded-xl text-xs shadow-sm transition"
                >
                  <Plus className="w-4 h-4 text-amber-950" />
                  <span>+ Blacklist Pincode / Sub-Sector</span>
                </button>
              </div>
            </div>
          </div>

          {/* KPI Metric Strip (5 Institutional Tiles) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
            {/* Tile 1 */}
            <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Total Blacklisted</span>
                <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 text-[10px] font-bold">3 Under Review</span>
              </div>
              <div className="mt-3">
                <div className="text-2xl font-black text-slate-900 tracking-tight">{zones.length} Pincodes</div>
                <div className="text-xs text-slate-500 mt-0.5">Across 4 Metro Hubs</div>
              </div>
            </div>

            {/* Tile 2 */}
            <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Fraud & Stolen Risk</span>
                <span className="px-2 py-0.5 rounded-full bg-rose-100 text-rose-700 text-[10px] font-bold">High Risk</span>
              </div>
              <div className="mt-3">
                <div className="text-2xl font-black text-rose-600 tracking-tight">₹8.4L Prevented</div>
                <div className="text-xs text-slate-500 mt-0.5">Fictitious device buyout attempts</div>
              </div>
            </div>

            {/* Tile 3 */}
            <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Safety Redlines</span>
                <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 text-[10px] font-bold">Field Techs</span>
              </div>
              <div className="mt-3">
                <div className="text-2xl font-black text-slate-900 tracking-tight">
                  {zones.filter((z) => z.tier === "Safety Redline").length} Zones
                </div>
                <div className="text-xs text-slate-500 mt-0.5">No late-evening / solo dispatches</div>
              </div>
            </div>

            {/* Tile 4 */}
            <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Bounce Accuracy</span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">Auto-Block</span>
              </div>
              <div className="mt-3">
                <div className="text-2xl font-black text-slate-900 tracking-tight">99.4%</div>
                <div className="text-xs text-slate-500 mt-0.5">Instant checkout intercept</div>
              </div>
            </div>

            {/* Tile 5 */}
            <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Disputed Appeals</span>
                <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[10px] font-bold">Pending</span>
              </div>
              <div className="mt-3">
                <div className="text-2xl font-black text-amber-600 tracking-tight">
                  {zones.filter((z) => z.status === "Pending Field Audit").length || 2} Pending
                </div>
                <div className="text-xs text-slate-500 mt-0.5">Merchant whitelist petitions</div>
              </div>
            </div>
          </div>

          {/* Sub Navigation Tab Ribbon */}
          <div className="flex items-center gap-1.5 overflow-x-auto bg-slate-200/70 p-1 rounded-2xl text-xs font-bold select-none">
            <Link
              href="/admin/service-areas"
              className="px-3.5 py-1.5 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition whitespace-nowrap"
            >
              All Hub Regions (4)
            </Link>
            <Link
              href="/admin/service-areas"
              className="px-3.5 py-1.5 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition whitespace-nowrap"
            >
              Active Geofences (18)
            </Link>
            <button
              className="px-3.5 py-1.5 rounded-xl bg-white text-amber-900 font-extrabold shadow-sm whitespace-nowrap flex items-center gap-1.5"
            >
              <span className="w-2 h-2 rounded-full bg-amber-500"></span>
              Restricted / Blacklisted Pincodes ({zones.length})
            </button>
            <Link
              href="/admin/merchant-exceptions"
              className="px-3.5 py-1.5 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition whitespace-nowrap"
            >
              Whitelisted Merchant Exceptions
            </Link>
          </div>

          {/* Filter & Search Toolbar Strip */}
          <div className="bg-white rounded-2xl p-3 border border-slate-200 shadow-sm flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
            <div className="flex flex-1 items-center gap-2.5 flex-wrap">
              <div className="relative flex-1 min-w-[240px]">
                <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search by Pincode (e.g. 110006), Area, or Reason..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full h-9 pl-9 pr-3 bg-slate-50 text-slate-800 placeholder:text-slate-400 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-amber-400 focus:bg-white transition"
                />
              </div>

              {/* Hub Dropdown */}
              <select
                value={selectedHub}
                onChange={(e) => setSelectedHub(e.target.value)}
                className="h-9 px-3 bg-slate-50 text-slate-700 text-xs rounded-xl border border-slate-200 focus:outline-none cursor-pointer"
              >
                <option value="ALL">All Hubs (NCR, BLR, BOM, HYD, CCU)</option>
                <option value="DEL">Delhi NCR (DEL-01, DEL-02)</option>
                <option value="BLR">Bengaluru (BLR-01)</option>
                <option value="BOM">Mumbai (BOM-02)</option>
                <option value="HYD">Hyderabad (HYD-01)</option>
                <option value="CCU">Kolkata (CCU-01)</option>
              </select>

              {/* Tier Dropdown */}
              <select
                value={selectedTier}
                onChange={(e) => setSelectedTier(e.target.value)}
                className="h-9 px-3 bg-slate-50 text-slate-700 text-xs rounded-xl border border-slate-200 focus:outline-none cursor-pointer"
              >
                <option value="ALL">All Tiers (Hard, Safety, Fraud, Escrow, Slum)</option>
                <option value="Hard Blacklist">Hard Blacklist</option>
                <option value="Safety Redline">Safety Redline</option>
                <option value="Fraud Syndicate">Fraud Syndicate</option>
                <option value="Escrow Pre-Auth">Escrow Pre-Auth</option>
                <option value="Slum Cluster">Slum Cluster</option>
              </select>

              {/* Status Dropdown */}
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="h-9 px-3 bg-slate-50 text-slate-700 text-xs rounded-xl border border-slate-200 focus:outline-none cursor-pointer"
              >
                <option value="ALL">All Statuses</option>
                <option value="Active">Active Enforcement</option>
                <option value="Pending Field Audit">Pending Field Audit</option>
                <option value="Bypass Exception">Bypass Exception</option>
              </select>
            </div>

            <div className="flex items-center gap-2 shrink-0 self-end md:self-auto">
              <button
                onClick={() => {
                  setSearchQuery("");
                  setSelectedHub("ALL");
                  setSelectedTier("ALL");
                  setSelectedStatus("ALL");
                }}
                className="px-3 h-9 text-slate-600 hover:text-rose-600 hover:bg-rose-50 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset</span>
              </button>
            </div>
          </div>

          {/* Main Split Layout: 62% Left Table, 38% Right Inspector Panel */}
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-5 items-start">
            {/* LEFT COLUMN: Blacklisted Zones Master Table */}
            <div className="xl:col-span-7 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
              <div className="px-4 py-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 text-amber-600" />
                  <span className="text-xs font-extrabold text-slate-800 uppercase tracking-wider">
                    Blacklisted Zones Master
                  </span>
                  <span className="text-[11px] px-2 py-0.5 rounded-full bg-slate-200 text-slate-700 font-bold">
                    {filteredZones.length} Records
                  </span>
                </div>
                <span className="text-[11px] text-slate-400 font-medium">Click row to inspect radar & audit trace</span>
              </div>

              {loading ? (
                <div className="p-12 flex flex-col items-center justify-center gap-3 text-slate-400">
                  <Loader2 className="w-6 h-6 animate-spin text-amber-500" />
                  <span className="text-xs font-medium">Loading exclusion registry from Supabase...</span>
                </div>
              ) : filteredZones.length === 0 ? (
                <div className="p-12 text-center text-slate-400 text-xs">
                  No blacklisted zones match your current search query.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-50 text-slate-500 text-[11px] font-bold uppercase tracking-wider select-none border-b border-slate-200">
                        <th className="py-2.5 pl-4 pr-2 w-8 text-center">Sel</th>
                        <th className="py-2.5 px-3">Pincode & Locality</th>
                        <th className="py-2.5 px-3">Hub Node</th>
                        <th className="py-2.5 px-3">Restriction Tier</th>
                        <th className="py-2.5 px-3 text-right">Risk Score</th>
                        <th className="py-2.5 px-3">Enforcement</th>
                        <th className="py-2.5 pr-4 pl-2 text-center">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-xs text-slate-800">
                      {filteredZones.map((z) => {
                        const isSelected = selectedZone?.pincode === z.pincode;
                        return (
                          <tr
                            key={z.pincode}
                            onClick={() => setSelectedZone(z)}
                            className={`cursor-pointer transition ${
                              isSelected ? "bg-amber-50/80 font-medium" : "hover:bg-slate-50"
                            }`}
                          >
                            <td className="py-3 pl-4 pr-2 text-center">
                              <div
                                className={`w-4 h-4 rounded-full mx-auto flex items-center justify-center ${
                                  isSelected ? "bg-amber-500 text-white" : "border border-slate-300 bg-white"
                                }`}
                              >
                                {isSelected && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                              </div>
                            </td>
                            <td className="py-3 px-3">
                              <div className="flex flex-col min-w-[130px]">
                                <span className="font-extrabold text-slate-900 tracking-tight">{z.pincode}</span>
                                <span className="text-slate-700 truncate">{z.locality}</span>
                                <span className="text-slate-400 text-[11px]">{z.subArea}</span>
                              </div>
                            </td>
                            <td className="py-3 px-3 whitespace-nowrap">
                              <div className="flex flex-col">
                                <span className="font-bold text-slate-800">{z.hubNode}</span>
                                <span className="text-slate-400 text-[11px]">{z.hubName}</span>
                              </div>
                            </td>
                            <td className="py-3 px-3">
                              <div className="flex flex-col gap-1 max-w-[180px]">
                                <span
                                  className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold w-max ${
                                    z.tier === "Hard Blacklist"
                                      ? "bg-rose-100 text-rose-800 border border-rose-200"
                                      : z.tier === "Safety Redline"
                                      ? "bg-amber-100 text-amber-900 border border-amber-200"
                                      : z.tier === "Fraud Syndicate"
                                      ? "bg-purple-100 text-purple-800 border border-purple-200"
                                      : "bg-slate-100 text-slate-700"
                                  }`}
                                >
                                  {z.tier}
                                </span>
                                <span className="text-slate-500 text-[11px] leading-tight line-clamp-1">
                                  {z.reason}
                                </span>
                              </div>
                            </td>
                            <td className="py-3 px-3 text-right whitespace-nowrap">
                              <div className="flex flex-col items-end">
                                <span
                                  className={`font-black text-sm ${
                                    z.riskScore >= 90
                                      ? "text-rose-600"
                                      : z.riskScore >= 75
                                      ? "text-amber-600"
                                      : "text-slate-700"
                                  }`}
                                >
                                  {z.riskScore}
                                  <span className="text-[10px] text-slate-400 font-normal">/100</span>
                                </span>
                                {z.policeFirs && (
                                  <span className="text-rose-600 text-[10px] font-bold">{z.policeFirs}</span>
                                )}
                                {z.failedVisits && (
                                  <span className="text-amber-600 text-[10px]">{z.failedVisits}</span>
                                )}
                              </div>
                            </td>
                            <td className="py-3 px-3">
                              <div className="flex flex-col">
                                <span className="font-bold text-slate-800 text-[11px]">{z.enforcement}</span>
                                <span className="text-slate-400 text-[10px]">{z.status}</span>
                              </div>
                            </td>
                            <td className="py-3 pr-4 pl-2 text-center whitespace-nowrap">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDelete(z);
                                }}
                                className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                                title="Remove Blacklist"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Table Footer */}
              <div className="px-4 py-2.5 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
                <span>
                  Showing <strong>{filteredZones.length}</strong> blacklisted postal zones
                </span>
                <span className="text-[11px]">Real-time edge exclusion sync active</span>
              </div>
            </div>

            {/* RIGHT COLUMN: Detailed Exclusion Inspector & Incident Trace Panel */}
            <div className="xl:col-span-5 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
              {selectedZone ? (
                <>
                  {/* Panel Header */}
                  <div className="px-4 py-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                        Exclusion Inspector
                      </span>
                      <span className="px-2 py-0.5 rounded-full bg-slate-200 text-slate-700 font-mono text-[11px] font-bold">
                        {selectedZone.id}
                      </span>
                    </div>
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                        selectedZone.status === "Active"
                          ? "bg-rose-100 text-rose-800 border border-rose-200"
                          : selectedZone.status === "Pending Field Audit"
                          ? "bg-amber-100 text-amber-800 border border-amber-200"
                          : "bg-emerald-100 text-emerald-800 border border-emerald-200"
                      }`}
                    >
                      {selectedZone.status}
                    </span>
                  </div>

                  <div className="p-5 space-y-4">
                    {/* Pincode Identity Header */}
                    <div>
                      <h2 className="text-lg font-black text-slate-900 tracking-tight">
                        {selectedZone.pincode} — {selectedZone.locality}
                      </h2>
                      <div className="text-xs text-slate-500 mt-1 flex items-center gap-2 flex-wrap">
                        <span>Geo: {selectedZone.coordinates}</span>
                        <span>•</span>
                        <span>Perimeter: {selectedZone.perimeterKm2} km² quadrant</span>
                        <span>•</span>
                        <span className="text-rose-600 font-bold">{selectedZone.tier}</span>
                      </div>
                    </div>

                    {/* Mini Visual Exclusion Map / Heatmap Graphic */}
                    <div className="relative w-full h-44 bg-slate-100 rounded-2xl overflow-hidden border border-slate-200 p-3 flex flex-col justify-between select-none">
                      <svg className="absolute inset-0 w-full h-full text-slate-200" height="100%" width="100%">
                        <defs>
                          <pattern id="grid-inspect" width="20" height="20" patternUnits="userSpaceOnUse">
                            <path d="M 20 0 L 0 0 0 20" fill="none" stroke="currentColor" strokeWidth="0.8" opacity="0.6" />
                          </pattern>
                        </defs>
                        <rect width="100%" height="100%" fill="url(#grid-inspect)" />
                        <polygon
                          points="30,20 160,15 260,40 320,95 290,150 150,160 40,120"
                          fill="rgba(239, 68, 68, 0.08)"
                          stroke="rgba(239, 68, 68, 0.7)"
                          strokeWidth="1.5"
                          strokeDasharray="4 2"
                        />
                        <circle cx="160" cy="85" r="45" fill="rgba(239, 68, 68, 0.12)" />
                        <circle cx="160" cy="85" r="16" fill="rgba(239, 68, 68, 0.25)" className="animate-pulse" />
                        <circle cx="160" cy="85" r="4" fill="rgb(220, 38, 38)" />
                        <line x1="10" y1="85" x2="350" y2="85" stroke="#cbd5e1" strokeWidth="1.5" />
                        <line x1="160" y1="10" x2="160" y2="160" stroke="#cbd5e1" strokeWidth="1.5" />
                      </svg>

                      <div className="relative z-10 flex items-center justify-between">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-white/95 backdrop-blur text-[11px] font-bold text-slate-800 shadow-sm border border-slate-200">
                          <AlertOctagon className="w-3.5 h-3.5 text-rose-600" />
                          <span>100% Doorstep Intercept Enforced</span>
                        </span>
                        <span className="px-2 py-0.5 rounded-full bg-rose-600 text-white text-[10px] font-extrabold shadow-sm">
                          0 Field Techs Permitted
                        </span>
                      </div>

                      <div className="relative z-10 bg-slate-900/90 backdrop-blur text-white px-3 py-1.5 rounded-xl flex items-center justify-between text-[11px]">
                        <div className="flex items-center gap-1.5 font-semibold">
                          <span className="w-2 h-2 rounded-full bg-amber-400"></span>
                          <span>Centroid Latency: Instant Edge Intercept</span>
                        </div>
                        <span className="font-mono text-amber-300 text-[10px]">RAD: 1,650m</span>
                      </div>
                    </div>

                    {/* Automation Rules */}
                    <div className="bg-slate-50 rounded-xl p-3 border border-slate-200 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                          Checkout Intercept Automation
                        </span>
                        <span className="text-[11px] font-bold text-emerald-600">Active</span>
                      </div>
                      <div className="grid grid-cols-2 gap-2 pt-1">
                        <div className="bg-white p-2.5 rounded-xl border border-slate-200 shadow-xs">
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Order Cap</span>
                          <div className="text-base font-black text-slate-900 mt-0.5">₹0.00</div>
                          <span className="text-[10px] text-rose-600 font-bold">No doorstep buyouts</span>
                        </div>
                        <div className="bg-white p-2.5 rounded-xl border border-slate-200 shadow-xs">
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Float Risk</span>
                          <div className="text-base font-black text-rose-600 mt-0.5">CRITICAL</div>
                          <span className="text-[10px] text-slate-500">&gt;₹5,000 cash prohibited</span>
                        </div>
                      </div>
                    </div>

                    {/* Incident Log & Audit History */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                          Incident Trace & Audit Log
                        </span>
                        <span className="text-[11px] text-slate-400">{selectedZone.incidents?.length || 0} Flags</span>
                      </div>
                      <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                        {selectedZone.incidents?.map((inc, i) => (
                          <div key={i} className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-2 text-xs">
                            <span className="p-1 rounded-lg bg-rose-100 text-rose-700 mt-0.5 shrink-0">
                              <ShieldAlert className="w-3.5 h-3.5" />
                            </span>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between gap-1">
                                <span className="font-bold text-slate-900">{inc.title}</span>
                                <span className="text-[10px] text-slate-400 font-mono shrink-0">{inc.date}</span>
                              </div>
                              <p className="text-slate-600 text-[11px] mt-0.5 leading-snug">{inc.detail}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Whitelisting & Exception Controls */}
                    <div className="pt-2 border-t border-slate-200 space-y-2.5">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                          Override & Whitelist Exception
                        </span>
                        <span className="text-[11px] text-slate-400">Risk Lead Auth</span>
                      </div>
                      <input
                        type="text"
                        placeholder="Rationale for Risk Officer / Operations Lead exception..."
                        value={overrideNote}
                        onChange={(e) => setOverrideNote(e.target.value)}
                        className="w-full h-8 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-amber-400 transition"
                      />
                      <div className="flex items-center gap-2 pt-1">
                        <button
                          onClick={() => handleUpdateStatus("Bypass Exception")}
                          className="flex-1 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl transition"
                        >
                          Bypass Filter
                        </button>
                        <button
                          onClick={() => handleUpdateStatus("Active")}
                          className="flex-1 py-2 bg-amber-400 hover:bg-amber-500 text-amber-950 text-xs font-bold rounded-xl shadow-sm transition"
                        >
                          Enforce Redline
                        </button>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <div className="p-12 text-center text-slate-400 text-xs">
                  Select a blacklisted zone from the table to view its risk inspector and radar profile.
                </div>
              )}
            </div>
          </div>
        </main>
      </div>

      {/* + BLACKLIST PINCODE MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-5 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div className="flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-rose-600" />
                <h3 className="text-base font-black text-slate-900">Blacklist Pincode / Sub-Sector</h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddBlacklist} className="space-y-3.5">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                    Postal PIN Code *
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={6}
                    placeholder="e.g. 110006"
                    value={formPincode}
                    onChange={(e) => setFormPincode(e.target.value.replace(/\D/g, ""))}
                    className="w-full h-9 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                    Hub Region Node
                  </label>
                  <select
                    value={formHub}
                    onChange={(e) => setFormHub(e.target.value)}
                    className="w-full h-9 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none cursor-pointer"
                  >
                    <option value="DEL-02 Node">DEL-02 Node (Delhi Central)</option>
                    <option value="DEL-01 Node">DEL-01 Node (Delhi South/Gurgaon)</option>
                    <option value="BLR-01 Node">BLR-01 Node (Bengaluru)</option>
                    <option value="BOM-02 Node">BOM-02 Node (Mumbai)</option>
                    <option value="HYD-01 Node">HYD-01 Node (Hyderabad)</option>
                    <option value="CCU-01 Node">CCU-01 Node (Kolkata)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                  Locality Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Old Delhi — Chandni Chowk"
                  value={formLocality}
                  onChange={(e) => setFormLocality(e.target.value)}
                  className="w-full h-9 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                  Sub-Area / Corridors
                </label>
                <input
                  type="text"
                  placeholder="e.g. Lahori Gate / Khari Baoli Quadrant"
                  value={formSubArea}
                  onChange={(e) => setFormSubArea(e.target.value)}
                  className="w-full h-9 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                    Restriction Tier
                  </label>
                  <select
                    value={formTier}
                    onChange={(e) => setFormTier(e.target.value as any)}
                    className="w-full h-9 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none cursor-pointer"
                  >
                    <option value="Hard Blacklist">Hard Blacklist</option>
                    <option value="Safety Redline">Safety Redline</option>
                    <option value="Fraud Syndicate">Fraud Syndicate</option>
                    <option value="Escrow Pre-Auth">Escrow Pre-Auth</option>
                    <option value="Slum Cluster">Slum Cluster</option>
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                    Risk Score (0 - 100)
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={100}
                    value={formRiskScore}
                    onChange={(e) => setFormRiskScore(Number(e.target.value))}
                    className="w-full h-9 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                  Primary Reason for Exclusion *
                </label>
                <textarea
                  required
                  rows={2}
                  placeholder="e.g. High cash theft history & repeated stolen IMEI swap attempts"
                  value={formReason}
                  onChange={(e) => setFormReason(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-amber-400 resize-none"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 py-2.5 bg-amber-400 hover:bg-amber-500 text-amber-950 font-black text-xs rounded-xl shadow-md transition disabled:opacity-60 flex items-center justify-center gap-2"
                >
                  {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <ShieldAlert className="w-4 h-4" />}
                  <span>Enforce Blacklist</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
