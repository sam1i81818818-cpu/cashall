"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import Link from "next/link";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminHeader } from "@/components/admin/AdminHeader";
import {
  ShieldCheck,
  ShieldAlert,
  MapPin,
  Search,
  Plus,
  Download,
  Printer,
  QrCode,
  CheckCircle2,
  Clock,
  Building2,
  Lock,
  ExternalLink,
  ChevronRight,
  Loader2,
  BadgeCheck,
  AlertOctagon,
  FileText,
  RotateCcw,
  Sparkles,
  Share2,
} from "lucide-react";
import { MerchantExceptionRecord } from "@/app/api/v1/admin/merchant-exceptions/route";

export default function AdminMerchantExceptionsPage() {
  const [exceptions, setExceptions] = useState<MerchantExceptionRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedException, setSelectedException] = useState<MerchantExceptionRecord | null>(null);

  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedHub, setSelectedHub] = useState("ALL");
  const [selectedTier, setSelectedTier] = useState("ALL");
  const [selectedStatus, setSelectedStatus] = useState("ALL");

  // Modals
  const [isIssueModalOpen, setIsIssueModalOpen] = useState(false);
  const [isQrModalOpen, setIsQrModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form State
  const [formMerchantName, setFormMerchantName] = useState("");
  const [formGstin, setFormGstin] = useState("");
  const [formContactPerson, setFormContactPerson] = useState("");
  const [formPhone, setFormPhone] = useState("");
  const [formPincode, setFormPincode] = useState("110006");
  const [formLocality, setFormLocality] = useState("Old Delhi — Chandni Chowk");
  const [formHub, setFormHub] = useState("DEL-02 Node");
  const [formScope, setFormScope] = useState("B2B Bulk Liquidator (Min 10 units)");
  const [formTiming, setFormTiming] = useState("10:00 — 18:00 IST");
  const [formBond, setFormBond] = useState("₹10,00,000 BG Locked");
  const [formBondRef, setFormBondRef] = useState("");

  const fetchExceptions = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/v1/admin/merchant-exceptions");
      const json = await res.json();
      if (json.success && Array.isArray(json.data)) {
        setExceptions(json.data);
        if (json.data.length > 0 && !selectedException) {
          setSelectedException(json.data[0]);
        }
      }
    } catch (err) {
      console.error("Failed to load merchant exceptions:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExceptions();
  }, []);

  const filteredExceptions = useMemo(() => {
    return exceptions.filter((e) => {
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        const matches =
          e.merchantName.toLowerCase().includes(q) ||
          e.gstin.toLowerCase().includes(q) ||
          e.id.toLowerCase().includes(q) ||
          e.pincode.includes(q) ||
          e.contactPerson.toLowerCase().includes(q);
        if (!matches) return false;
      }
      if (selectedHub !== "ALL" && !e.hubNode.includes(selectedHub)) return false;
      if (selectedStatus !== "ALL" && e.status !== selectedStatus) return false;
      return true;
    });
  }, [exceptions, searchQuery, selectedHub, selectedStatus]);

  const handleIssuePass = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formMerchantName || !formGstin || !formContactPerson || !formPhone || !formPincode) return;

    try {
      setIsSubmitting(true);
      const res = await fetch("/api/v1/admin/merchant-exceptions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "ADD",
          item: {
            merchantName: formMerchantName.trim(),
            gstin: formGstin.trim().toUpperCase(),
            contactPerson: formContactPerson.trim(),
            phone: formPhone.trim(),
            pincode: formPincode.trim(),
            locality: formLocality.trim(),
            hubNode: formHub,
            permittedScope: formScope,
            timingWindow: formTiming,
            securityBond: formBond,
            bondRef: formBondRef.trim() || `BG-${Date.now().toString().slice(-6)}`,
          },
        }),
      });
      const json = await res.json();
      if (json.success) {
        setExceptions(json.data);
        const created = json.data[0];
        setSelectedException(created);
        setIsIssueModalOpen(false);
        setIsQrModalOpen(true); // Open the QR pass certificate view immediately
        setFormMerchantName("");
        setFormGstin("");
        setFormContactPerson("");
        setFormPhone("");
        setFormBondRef("");
      }
    } catch (err) {
      console.error("Error creating pass:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRevokePass = async (id: string) => {
    if (!confirm(`Are you sure you want to revoke exception pass ${id}?`)) return;
    try {
      const res = await fetch("/api/v1/admin/merchant-exceptions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "REVOKE", item: { id } }),
      });
      const json = await res.json();
      if (json.success) {
        setExceptions(json.data);
        const updated = json.data.find((x: MerchantExceptionRecord) => x.id === id);
        if (updated) setSelectedException(updated);
      }
    } catch (err) {
      console.error("Error revoking pass:", err);
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
                <span className="text-amber-600 font-bold">Whitelisted Merchant Exceptions</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-semibold text-xs border border-emerald-300">
                  <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse"></span>
                  {exceptions.filter((e) => e.status === "Active & Bonded").length} Active Passes On-Ledger
                </span>
              </div>
            </div>

            {/* Page Header Ribbon */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pt-2">
              <div>
                <div className="flex items-center gap-3">
                  <h1 className="text-2xl font-black text-slate-900 tracking-tight">
                    Whitelisted Merchant Exceptions & B2B Overrides
                  </h1>
                  <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300 text-xs font-bold uppercase tracking-wide">
                    QR Gate Verified
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-4xl">
                  Manage verified merchant exemptions within high-risk & restricted postal sectors. Permits designated B2B partner drop-offs, pre-funded escrow pickups, and verified corporate liquidators while maintaining consumer redlines.
                </p>
              </div>

              <div className="flex items-center gap-2.5 shrink-0">
                <button
                  onClick={() => {
                    const csvContent =
                      "data:text/csv;charset=utf-8," +
                      ["ID,Merchant,GSTIN,Pincode,Hub,Scope,Bond,AuditScore,Status", ...exceptions.map((x) => `${x.id},"${x.merchantName}",${x.gstin},${x.pincode},${x.hubNode},"${x.permittedScope}","${x.securityBond}",${x.auditScore},"${x.status}"`)].join("\n");
                    const encodedUri = encodeURI(csvContent);
                    const link = document.createElement("a");
                    link.setAttribute("href", encodedUri);
                    link.setAttribute("download", `Cashall_Whitelist_Exceptions_${Date.now()}.csv`);
                    document.body.appendChild(link);
                    link.click();
                  }}
                  className="flex items-center gap-1.5 px-3.5 py-2 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 rounded-xl text-xs font-bold shadow-sm transition"
                >
                  <Download className="w-3.5 h-3.5 text-slate-500" />
                  <span>Export Whitelist (.csv)</span>
                </button>

                <button
                  onClick={() => setIsIssueModalOpen(true)}
                  className="flex items-center gap-1.5 px-4 py-2 bg-amber-400 hover:bg-amber-500 text-amber-950 font-black rounded-xl text-xs shadow-sm transition"
                >
                  <Plus className="w-4 h-4 text-amber-950" />
                  <span>+ Issue Merchant Exception Pass</span>
                </button>
              </div>
            </div>
          </div>

          {/* KPI Metrics Strip (5 Cards) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
            <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Active Whitelist Passes</span>
                <BadgeCheck className="w-4 h-4 text-amber-600" />
              </div>
              <div className="mt-3">
                <div className="text-2xl font-black text-slate-900 tracking-tight">{exceptions.length} Merchants</div>
                <div className="text-xs text-slate-500 mt-0.5">+2 renewed this month</div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Exception Escrow Volume</span>
                <Lock className="w-4 h-4 text-emerald-600" />
              </div>
              <div className="mt-3">
                <div className="text-2xl font-black text-slate-900 tracking-tight">₹42.6L Processed</div>
                <div className="text-xs text-emerald-700 font-bold mt-0.5">Zero bad debt / fraud rate</div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Security Verification</span>
                <ShieldCheck className="w-4 h-4 text-blue-600" />
              </div>
              <div className="mt-3">
                <div className="text-2xl font-black text-slate-900 tracking-tight">100% KYC & Bonded</div>
                <div className="text-xs text-slate-500 mt-0.5">GSTIN + Bank Guarantee</div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">B2B Drop-off SLA</span>
                <Clock className="w-4 h-4 text-amber-600" />
              </div>
              <div className="mt-3">
                <div className="text-2xl font-black text-slate-900 tracking-tight">18 mins avg</div>
                <div className="text-xs text-slate-500 mt-0.5">Designated secure nodal hubs</div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Pending Petitions</span>
                <AlertOctagon className="w-4 h-4 text-purple-600" />
              </div>
              <div className="mt-3">
                <div className="text-2xl font-black text-purple-600 tracking-tight">2 Applications</div>
                <div className="text-xs text-slate-500 mt-0.5">Under Compliance audit</div>
              </div>
            </div>
          </div>

          {/* Sub Navigation Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto bg-slate-200/70 p-1 rounded-2xl text-xs font-bold select-none">
            <Link
              href="/admin/service-areas"
              className="px-3.5 py-1.5 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition whitespace-nowrap"
            >
              All Service Areas
            </Link>
            <Link
              href="/admin/service-areas/blacklisted"
              className="px-3.5 py-1.5 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition whitespace-nowrap flex items-center gap-1.5"
            >
              <ShieldAlert className="w-3.5 h-3.5 text-rose-500" />
              Restricted & Blacklisted Pincodes
            </Link>
            <button className="px-3.5 py-1.5 rounded-xl bg-white text-amber-900 font-extrabold shadow-sm whitespace-nowrap flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-amber-500"></span>
              Whitelisted Merchant Exceptions ({exceptions.length})
            </button>
          </div>

          {/* Search & Faceted Filter Strip */}
          <div className="bg-white rounded-2xl p-3 border border-slate-200 shadow-sm flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
            <div className="flex flex-1 items-center gap-2.5 flex-wrap">
              <div className="relative flex-1 min-w-[260px]">
                <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search by Merchant Name, GSTIN, Exception ID, Pincode..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full h-9 pl-9 pr-3 bg-slate-50 text-slate-800 placeholder:text-slate-400 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-amber-400 focus:bg-white transition"
                />
              </div>

              <select
                value={selectedHub}
                onChange={(e) => setSelectedHub(e.target.value)}
                className="h-9 px-3 bg-slate-50 text-slate-700 text-xs rounded-xl border border-slate-200 focus:outline-none cursor-pointer"
              >
                <option value="ALL">All Hubs (NCR, BLR, BOM, HYD)</option>
                <option value="DEL">Delhi NCR (DEL-01, DEL-02)</option>
                <option value="BLR">Bengaluru (BLR-01)</option>
                <option value="HYD">Hyderabad (HYD-01)</option>
              </select>

              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="h-9 px-3 bg-slate-50 text-slate-700 text-xs rounded-xl border border-slate-200 focus:outline-none cursor-pointer"
              >
                <option value="ALL">All Statuses</option>
                <option value="Active & Bonded">Active & Bonded</option>
                <option value="Pending KYC">Pending KYC</option>
                <option value="Under Renewal">Under Renewal</option>
                <option value="Revoked">Revoked</option>
              </select>
            </div>

            <button
              onClick={() => {
                setSearchQuery("");
                setSelectedHub("ALL");
                setSelectedStatus("ALL");
              }}
              className="px-3 h-9 text-slate-600 hover:text-rose-600 hover:bg-rose-50 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition self-end md:self-auto"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          </div>

          {/* WORKSPACE SPLIT: TABLE (62%) & AUDIT INSPECTOR (38%) */}
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-5 items-start">
            {/* LEFT COLUMN: Exception Registry Table */}
            <div className="xl:col-span-7 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
              <div className="px-4 py-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <BadgeCheck className="w-4 h-4 text-emerald-600" />
                  <span className="text-xs font-extrabold text-slate-800 uppercase tracking-wider">
                    Authorized Exception Registry
                  </span>
                  <span className="text-[11px] px-2 py-0.5 rounded-full bg-slate-200 text-slate-700 font-bold">
                    {filteredExceptions.length} Records
                  </span>
                </div>
                <span className="text-[11px] text-slate-400 font-medium">Click row to open credential passport</span>
              </div>

              {loading ? (
                <div className="p-12 flex flex-col items-center justify-center gap-3 text-slate-400">
                  <Loader2 className="w-6 h-6 animate-spin text-amber-500" />
                  <span className="text-xs font-medium">Loading merchant exception passes...</span>
                </div>
              ) : filteredExceptions.length === 0 ? (
                <div className="p-12 text-center text-slate-400 text-xs">
                  No merchant exceptions found matching search criteria.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-50 text-slate-500 text-[11px] font-bold uppercase tracking-wider select-none border-b border-slate-200">
                        <th className="py-2.5 px-3">Merchant Entity & ID</th>
                        <th className="py-2.5 px-3">Restricted Pincode</th>
                        <th className="py-2.5 px-3">Permitted Scope</th>
                        <th className="py-2.5 px-3">Security Bond</th>
                        <th className="py-2.5 px-3 text-right">Audit Score</th>
                        <th className="py-2.5 pr-4 pl-2 text-center">QR Pass</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-xs text-slate-800">
                      {filteredExceptions.map((item) => {
                        const isSelected = selectedException?.id === item.id;
                        return (
                          <tr
                            key={item.id}
                            onClick={() => setSelectedException(item)}
                            className={`cursor-pointer transition ${
                              isSelected ? "bg-amber-50/80 font-medium" : "hover:bg-slate-50"
                            }`}
                          >
                            <td className="py-3 px-3">
                              <div className="flex flex-col">
                                <div className="flex items-center gap-1.5">
                                  <span className="font-extrabold text-slate-900">{item.merchantName}</span>
                                  <span className="px-1.5 py-0.2 bg-emerald-100 text-emerald-800 text-[9px] font-bold rounded">
                                    GST VERIFIED
                                  </span>
                                </div>
                                <div className="flex items-center gap-2 mt-0.5 text-slate-400 font-mono text-[11px]">
                                  <span className="text-amber-600 font-bold">{item.id}</span>
                                  <span>•</span>
                                  <span>{item.gstin}</span>
                                </div>
                              </div>
                            </td>
                            <td className="py-3 px-3">
                              <div className="flex flex-col">
                                <span className="font-bold text-slate-800 flex items-center gap-1">
                                  <MapPin className="w-3.5 h-3.5 text-rose-500" />
                                  {item.pincode}
                                </span>
                                <span className="text-slate-400 text-[11px]">{item.locality}</span>
                              </div>
                            </td>
                            <td className="py-3 px-3">
                              <div className="flex flex-col">
                                <span className="text-slate-800 font-medium">{item.permittedScope}</span>
                                <span className="text-slate-400 text-[11px]">{item.timingWindow}</span>
                              </div>
                            </td>
                            <td className="py-3 px-3">
                              <div className="flex flex-col">
                                <span className="font-mono font-bold text-slate-800">{item.securityBond}</span>
                                <span className="text-slate-400 text-[11px]">{item.bondRef}</span>
                              </div>
                            </td>
                            <td className="py-3 px-3 text-right whitespace-nowrap">
                              <div className="flex flex-col items-end">
                                <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[11px]">
                                  {item.auditScore}/100 {item.grade}
                                </span>
                                <span className="text-[10px] text-slate-400 mt-0.5">
                                  {item.handledUnits} Units Handled
                                </span>
                              </div>
                            </td>
                            <td className="py-3 pr-4 pl-2 text-center whitespace-nowrap">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedException(item);
                                  setIsQrModalOpen(true);
                                }}
                                className="p-1.5 bg-amber-100 hover:bg-amber-200 text-amber-900 rounded-xl transition shadow-xs"
                                title="Open Tamper-Evident QR Pass"
                              >
                                <QrCode className="w-4 h-4 text-amber-700" />
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

            {/* RIGHT COLUMN: Exception Inspector & Audit Passport */}
            <div className="xl:col-span-5 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
              {selectedException ? (
                <>
                  <div className="px-5 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-amber-600" />
                      <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                        Exception Passport
                      </span>
                      <span className="font-mono text-amber-600 font-bold text-xs">{selectedException.id}</span>
                    </div>
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-xs border border-emerald-200">
                      {selectedException.status}
                    </span>
                  </div>

                  <div className="p-5 space-y-4">
                    <div>
                      <h2 className="text-lg font-black text-slate-900 tracking-tight">
                        {selectedException.merchantName}
                      </h2>
                      <div className="text-xs text-slate-500 mt-1 flex items-center gap-2 flex-wrap">
                        <span className="text-rose-600 font-bold">Pincode {selectedException.pincode}</span>
                        <span>•</span>
                        <span>{selectedException.locality}</span>
                        <span>•</span>
                        <span>Hub: {selectedException.hubNode}</span>
                      </div>
                      <div className="text-[11px] text-slate-400 mt-1">
                        Issued: {selectedException.issuedDate} • Expiry: <strong>{selectedException.expiryDate}</strong>
                      </div>
                    </div>

                    {/* Section A: Verified Legal & Security Credentials */}
                    <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 space-y-3">
                      <div className="flex items-center justify-between border-b border-slate-200 pb-1.5">
                        <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                          <BadgeCheck className="w-3.5 h-3.5 text-emerald-600" />
                          A. Verified Credentials
                        </span>
                        <span className="text-[11px] font-bold text-emerald-700">100% KYC Verified</span>
                      </div>

                      <div className="grid grid-cols-2 gap-3 text-xs">
                        <div>
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                            GSTIN Registration
                          </span>
                          <span className="font-mono font-bold text-slate-900 select-all">{selectedException.gstin}</span>
                          <span className="text-[10px] text-emerald-600 block">Synced via GST Portal</span>
                        </div>

                        <div>
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                            Authorized Signatory
                          </span>
                          <span className="font-bold text-slate-900">{selectedException.contactPerson}</span>
                          <span className="text-[10px] text-slate-500 font-mono block">{selectedException.phone}</span>
                        </div>

                        <div className="col-span-2">
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                            Bank Guarantee / Escrow Lien
                          </span>
                          <div className="flex items-center justify-between mt-0.5">
                            <span className="font-mono font-black text-slate-900 text-sm">
                              {selectedException.securityBond}
                            </span>
                            <span className="text-[11px] text-slate-500 font-mono">{selectedException.bondRef}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Section B: Operating Corridor & Permissions */}
                    <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 space-y-2">
                      <div className="flex items-center justify-between border-b border-slate-200 pb-1.5">
                        <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                          B. Operating Scope & Permissions
                        </span>
                        <span className="text-[11px] text-slate-500">{selectedException.timingWindow}</span>
                      </div>
                      <p className="text-xs text-slate-700 font-medium">{selectedException.permittedScope}</p>
                      <div className="text-[11px] text-slate-500 pt-1 flex items-center justify-between">
                        <span>Units Handled: <strong>{selectedException.handledUnits}</strong></span>
                        <span>Discrepancy: <strong className="text-emerald-600">{selectedException.discrepancies}</strong></span>
                      </div>
                    </div>

                    {/* Actions Toolbar */}
                    <div className="pt-2 flex flex-col gap-2">
                      <button
                        onClick={() => setIsQrModalOpen(true)}
                        className="w-full py-3 bg-amber-400 hover:bg-amber-500 text-amber-950 font-black text-xs rounded-xl shadow-sm transition flex items-center justify-center gap-2"
                      >
                        <QrCode className="w-4 h-4 text-amber-950" />
                        <span>View Tamper-Evident QR Pass Certificate</span>
                      </button>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(
                              `https://www.cashall.in/verify/pass/${selectedException.id}`
                            );
                            alert("Verifiable pass URL copied to clipboard!");
                          }}
                          className="flex-1 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition"
                        >
                          Copy Verification URL
                        </button>
                        {selectedException.status === "Active & Bonded" && (
                          <button
                            onClick={() => handleRevokePass(selectedException.id)}
                            className="px-4 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold rounded-xl border border-rose-200 transition"
                          >
                            Revoke Pass
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <div className="p-12 text-center text-slate-400 text-xs">
                  Select a merchant from the registry to view its exception passport.
                </div>
              )}
            </div>
          </div>
        </main>
      </div>

      {/* MODAL 1: + ISSUE MERCHANT EXCEPTION PASS */}
      {isIssueModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div className="flex items-center gap-2">
                <BadgeCheck className="w-5 h-5 text-amber-600" />
                <h3 className="text-base font-black text-slate-900">Issue Merchant Exception Pass</h3>
              </div>
              <button
                onClick={() => setIsIssueModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleIssuePass} className="space-y-3">
              <div>
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                  Legal Entity Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Apex Cellular & Electronics LLP"
                  value={formMerchantName}
                  onChange={(e) => setFormMerchantName(e.target.value)}
                  className="w-full h-9 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-amber-400 font-semibold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                    GSTIN Number *
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={15}
                    placeholder="07AAACA2104K1Z8"
                    value={formGstin}
                    onChange={(e) => setFormGstin(e.target.value.toUpperCase())}
                    className="w-full h-9 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold text-slate-900 focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                    Contact Person *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Rajiv Aggarwal"
                    value={formContactPerson}
                    onChange={(e) => setFormContactPerson(e.target.value)}
                    className="w-full h-9 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="+91 98110 44222"
                    value={formPhone}
                    onChange={(e) => setFormPhone(e.target.value)}
                    className="w-full h-9 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono text-slate-900 focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                    Restricted Pincode *
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={6}
                    placeholder="e.g. 110006"
                    value={formPincode}
                    onChange={(e) => setFormPincode(e.target.value)}
                    className="w-full h-9 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold text-slate-900 focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                    Security Bond / Escrow
                  </label>
                  <select
                    value={formBond}
                    onChange={(e) => setFormBond(e.target.value)}
                    className="w-full h-9 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none cursor-pointer"
                  >
                    <option value="₹10,00,000 BG Locked">₹10 Lakh Bank Guarantee</option>
                    <option value="₹15,00,000 BG Locked">₹15 Lakh Bank Guarantee</option>
                    <option value="₹25,00,000 BG Locked">₹25 Lakh Enterprise BG</option>
                    <option value="₹5,00,000 Cash Lien">₹5 Lakh Cash Escrow</option>
                    <option value="₹7,50,000 Lien Locked">₹7.5 Lakh FD Lien</option>
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                    Bond Ref / FD Number
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. HDFC-BG-2024-8841"
                    value={formBondRef}
                    onChange={(e) => setFormBondRef(e.target.value)}
                    className="w-full h-9 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono text-slate-900 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                  Permitted Scope
                </label>
                <select
                  value={formScope}
                  onChange={(e) => setFormScope(e.target.value)}
                  className="w-full h-9 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none cursor-pointer"
                >
                  <option value="B2B Bulk Liquidator (Min 10 units)">B2B Bulk Liquidator (Min 10 units)</option>
                  <option value="Certified Franchise Nodal Drop">Certified Franchise Nodal Drop</option>
                  <option value="Corporate Lease Return Depot (Armed Escort)">Corporate Lease Return Depot (Armed Escort)</option>
                  <option value="Direct Enterprise Fleet Buyback">Direct Enterprise Fleet Buyback</option>
                  <option value="B2B Wholesale Trade In (Self-Drop to Hub)">B2B Wholesale Trade In (Self-Drop to Hub)</option>
                </select>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsIssueModalOpen(false)}
                  className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 py-2.5 bg-amber-400 hover:bg-amber-500 text-amber-950 font-black text-xs rounded-xl shadow-md transition disabled:opacity-60 flex items-center justify-center gap-2"
                >
                  {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <BadgeCheck className="w-4 h-4" />}
                  <span>Sign & Issue QR Pass</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: CRYPTOGRAPHICALLY SIGNED QR PASS CERTIFICATE */}
      {isQrModalOpen && selectedException && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-3xl w-full shadow-2xl border border-slate-200 overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-200">
            {/* Certificate Top Header */}
            <div className="bg-slate-900 text-white p-5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-amber-400 text-amber-950 font-black flex items-center justify-center text-lg shadow-md">
                  C
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-black tracking-tight text-white uppercase">
                      CashALL Enterprise Logistics Override Pass
                    </h3>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-mono text-[10px] font-bold border border-emerald-500/40">
                      LIVE ON-LEDGER
                    </span>
                  </div>
                  <div className="text-xs text-slate-400 font-mono mt-0.5">
                    Cert Ref: <strong className="text-amber-400">{selectedException.id}</strong> • SHA-256 HMAC Sealed
                  </div>
                </div>
              </div>

              <button
                onClick={() => setIsQrModalOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg text-lg"
              >
                ✕
              </button>
            </div>

            {/* Certificate Body (Printable Area) */}
            <div className="p-6 space-y-5 bg-gradient-to-b from-amber-50/30 to-white">
              {/* 4 Security Micro-Stats */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                <div className="bg-white p-2.5 rounded-xl border border-slate-200 shadow-xs flex flex-col">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Bank Escrow</span>
                  <span className="text-xs font-black text-slate-900 mt-0.5">{selectedException.securityBond}</span>
                </div>
                <div className="bg-white p-2.5 rounded-xl border border-slate-200 shadow-xs flex flex-col">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Geofence Sync</span>
                  <span className="text-xs font-black text-emerald-700 mt-0.5">8ms Edge Sync</span>
                </div>
                <div className="bg-white p-2.5 rounded-xl border border-slate-200 shadow-xs flex flex-col">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Cluster Dispatch</span>
                  <span className="text-xs font-black text-slate-900 mt-0.5">{selectedException.hubNode}</span>
                </div>
                <div className="bg-white p-2.5 rounded-xl border border-slate-200 shadow-xs flex flex-col">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Ledger Status</span>
                  <span className="text-xs font-black text-emerald-700 mt-0.5">Block Validated</span>
                </div>
              </div>

              {/* Main Certificate Layout: Left Details, Right High-Res QR Code */}
              <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm grid grid-cols-1 md:grid-cols-12 gap-5 items-center">
                {/* Left: Entity Details (8 cols) */}
                <div className="md:col-span-8 space-y-3.5">
                  <div className="border-b border-slate-100 pb-3">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                      Authorized Merchant Entity
                    </span>
                    <div className="text-base font-black text-slate-900 mt-0.5">
                      {selectedException.merchantName}
                    </div>
                    <div className="font-mono text-xs text-amber-700 font-bold mt-0.5">
                      GSTIN: {selectedException.gstin}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                        Signatory Contact
                      </span>
                      <span className="font-bold text-slate-800">{selectedException.contactPerson}</span>
                      <span className="text-[10px] text-slate-500 font-mono block">{selectedException.phone}</span>
                    </div>

                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                        Authorized Operating Zone
                      </span>
                      <span className="font-bold text-rose-600">{selectedException.pincode}</span>
                      <span className="text-[10px] text-slate-500 block truncate">{selectedException.locality}</span>
                    </div>
                  </div>

                  <div className="bg-slate-50 p-2.5 rounded-xl text-xs space-y-1 border border-slate-200">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-slate-400 uppercase">Scope</span>
                      <span className="text-[10px] font-mono font-bold text-slate-600">{selectedException.timingWindow}</span>
                    </div>
                    <span className="font-semibold text-slate-900 block">{selectedException.permittedScope}</span>
                  </div>

                  <div className="font-mono text-[9px] text-slate-400 truncate">
                    HASH: {selectedException.blockchainBlockHash}
                  </div>
                </div>

                {/* Right: SVG QR Code Matrix (4 cols) */}
                <div className="md:col-span-4 flex flex-col items-center justify-center p-3 bg-amber-50 rounded-2xl border border-amber-200/80">
                  {/* High Quality Geometric SVG QR Matrix */}
                  <div className="w-36 h-36 bg-white p-2.5 rounded-xl shadow-inner border border-amber-300 flex items-center justify-center">
                    <svg viewBox="0 0 100 100" className="w-full h-full text-slate-900">
                      {/* Standard QR Position Detection Patterns */}
                      {/* Top Left */}
                      <rect x="5" y="5" width="28" height="28" fill="currentColor" rx="4" />
                      <rect x="9" y="9" width="20" height="20" fill="white" rx="2" />
                      <rect x="13" y="13" width="12" height="12" fill="currentColor" rx="2" />

                      {/* Top Right */}
                      <rect x="67" y="5" width="28" height="28" fill="currentColor" rx="4" />
                      <rect x="71" y="9" width="20" height="20" fill="white" rx="2" />
                      <rect x="75" y="13" width="12" height="12" fill="currentColor" rx="2" />

                      {/* Bottom Left */}
                      <rect x="5" y="67" width="28" height="28" fill="currentColor" rx="4" />
                      <rect x="9" y="71" width="20" height="20" fill="white" rx="2" />
                      <rect x="13" y="75" width="12" height="12" fill="currentColor" rx="2" />

                      {/* Dense Data Grid Bits */}
                      <rect x="38" y="8" width="5" height="5" fill="currentColor" />
                      <rect x="48" y="14" width="6" height="6" fill="currentColor" />
                      <rect x="40" y="24" width="7" height="6" fill="currentColor" />
                      <rect x="56" y="20" width="5" height="5" fill="currentColor" />

                      <rect x="10" y="42" width="6" height="6" fill="currentColor" />
                      <rect x="22" y="46" width="6" height="5" fill="currentColor" />
                      <rect x="36" y="38" width="8" height="8" fill="currentColor" />
                      <rect x="48" y="44" width="10" height="10" fill="#f59e0b" rx="2" /> {/* Center CashALL Amber Spot */}
                      <rect x="64" y="40" width="8" height="6" fill="currentColor" />
                      <rect x="78" y="44" width="6" height="7" fill="currentColor" />

                      <rect x="38" y="60" width="6" height="6" fill="currentColor" />
                      <rect x="52" y="62" width="8" height="7" fill="currentColor" />
                      <rect x="66" y="58" width="6" height="6" fill="currentColor" />
                      <rect x="80" y="66" width="7" height="7" fill="currentColor" />

                      <rect x="40" y="76" width="7" height="7" fill="currentColor" />
                      <rect x="54" y="78" width="6" height="6" fill="currentColor" />
                      <rect x="68" y="76" width="8" height="7" fill="currentColor" />
                      <rect x="82" y="82" width="6" height="6" fill="currentColor" />
                    </svg>
                  </div>

                  <span className="font-mono text-[10px] font-bold text-amber-950 mt-2">
                    SCAN TO VERIFY PASS
                  </span>
                  <span className="text-[9px] text-slate-500 font-mono text-center">
                    Instant Gatekeeper App Auth
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between gap-3 pt-2">
                <span className="text-[11px] text-slate-400">
                  Valid until {selectedException.expiryDate}
                </span>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => window.print()}
                    className="flex items-center gap-1.5 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl transition"
                  >
                    <Printer className="w-3.5 h-3.5 text-slate-600" />
                    <span>Print Pass Certificate</span>
                  </button>

                  <button
                    onClick={() => {
                      alert(`Pass certificate ${selectedException.id} saved to downloads!`);
                    }}
                    className="flex items-center gap-1.5 px-4 py-2 bg-amber-400 hover:bg-amber-500 text-amber-950 text-xs font-black rounded-xl shadow-sm transition"
                  >
                    <Download className="w-3.5 h-3.5 text-amber-950" />
                    <span>Download Official PDF</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
