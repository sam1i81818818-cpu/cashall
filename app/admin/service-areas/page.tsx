"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { INITIAL_SERVICE_AREAS, ServiceAreaData } from "@/lib/store";
import { EXCLUDED_UNSERVICEABLE_PINCODES } from "@/lib/serviceability";
import {
  MapPin,
  Plus,
  CheckCircle2,
  ShieldCheck,
  Search,
  Trash2,
  ShieldAlert,
  Building2,
  Check,
} from "lucide-react";

export default function AdminServiceAreasPage() {
  const [areas, setAreas] = useState<ServiceAreaData[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [newPincode, setNewPincode] = useState("");
  const [newCity, setNewCity] = useState("");
  const [newState, setNewState] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      let combined = [...INITIAL_SERVICE_AREAS];
      try {
        const stored = JSON.parse(localStorage.getItem("cashall_service_areas") || "[]");
        stored.forEach((item: any) => {
          if (item && item.pincode && !combined.some((a) => a.pincode === item.pincode)) {
            combined.unshift(item);
          }
        });
      } catch (e) {
        console.error(e);
      }
      // Strictly exclude any restricted / unserviceable PIN codes
      combined = combined.filter((item) => !EXCLUDED_UNSERVICEABLE_PINCODES.has(item.pincode));
      try {
        localStorage.setItem("cashall_service_areas", JSON.stringify(combined));
      } catch {}
      setAreas(combined);
    }
  }, []);

  const handleAddArea = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPincode || !newCity) return;

    if (EXCLUDED_UNSERVICEABLE_PINCODES.has(newPincode)) {
      alert(`⚠️ PIN Code ${newPincode} is permanently marked as UNSERVICEABLE.\nCannot enable doorstep collection in this restricted zone.`);
      return;
    }

    const newItem: ServiceAreaData = {
      id: `sa-${Date.now()}`,
      pincode: newPincode,
      city: newCity,
      state: newState.trim() || "West Bengal",
      active: true,
      pickupAvailable: true,
    };

    const updated = [newItem, ...areas];
    setAreas(updated);

    if (typeof window !== "undefined") {
      localStorage.setItem("cashall_service_areas", JSON.stringify(updated));
    }

    setNewPincode("");
    setNewCity("");
    setNewState("");
  };

  const handleRemoveArea = (pincode: string) => {
    if (!confirm(`Are you sure you want to disable pincode ${pincode}?`)) return;
    const updated = areas.filter((a) => a.pincode !== pincode);
    setAreas(updated);
    if (typeof window !== "undefined") {
      localStorage.setItem("cashall_service_areas", JSON.stringify(updated));
    }
  };

  const filteredAreas = areas.filter((sa) => {
    const q = searchQuery.toLowerCase();
    return (
      sa.pincode.toLowerCase().includes(q) ||
      sa.city.toLowerCase().includes(q) ||
      sa.state.toLowerCase().includes(q)
    );
  });

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col lg:flex-row w-full max-w-full">
      <AdminSidebar />

      <div className="flex-1 flex flex-col min-w-0">
        <AdminHeader />

        <main className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto w-full">
          {/* Breadcrumbs & Navigation */}
          <div className="flex flex-col gap-1">
            <div className="flex items-center justify-between text-slate-500 text-xs font-semibold uppercase tracking-wider">
              <div className="flex items-center gap-1.5">
                <Link href="/admin" className="hover:text-slate-800 transition">Admin</Link>
                <span>/</span>
                <span className="hover:text-slate-800 transition">Logistics</span>
                <span>/</span>
                <span className="text-amber-600 font-bold">Service Areas (PINs)</span>
              </div>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-semibold text-xs border border-emerald-200">
                <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse"></span>
                Doorstep Pickup Enabled
              </span>
            </div>

            {/* Header Ribbon */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
              <div>
                <div className="flex items-center gap-3">
                  <h1 className="text-2xl font-black text-slate-900 tracking-tight">
                    Service Areas (PINs)
                  </h1>
                  <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300 text-xs font-bold">
                    {areas.length} Active PINs
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  Manage serviceable postal PIN codes, cities &amp; delivery coverage
                </p>
              </div>

              <div className="flex items-center gap-2.5">
                <Link
                  href="/admin/service-areas/blacklisted"
                  className="flex items-center gap-1.5 px-4 py-2 bg-rose-50 hover:bg-rose-100 text-rose-800 border border-rose-300 font-bold rounded-xl text-xs shadow-sm transition"
                >
                  <ShieldAlert className="w-4 h-4 text-rose-600" />
                  <span>View Blacklisted Pincodes</span>
                </Link>
              </div>
            </div>
          </div>

          {/* Sub Navigation Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto bg-slate-200/70 p-1 rounded-2xl text-xs font-bold select-none">
            <button className="px-3.5 py-1.5 rounded-xl bg-white text-amber-900 font-extrabold shadow-sm whitespace-nowrap flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-amber-500"></span>
              All Active Service Areas ({areas.length})
            </button>
            <Link
              href="/admin/service-areas/blacklisted"
              className="px-3.5 py-1.5 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition whitespace-nowrap flex items-center gap-1.5"
            >
              <ShieldAlert className="w-3.5 h-3.5 text-rose-500" />
              Restricted & Blacklisted Pincodes
            </Link>
            <Link
              href="/admin/merchant-exceptions"
              className="px-3.5 py-1.5 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition whitespace-nowrap"
            >
              Whitelisted Merchant Exceptions
            </Link>
          </div>

          {/* ADD PIN CODE FORM */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
              <Plus className="w-4 h-4 text-amber-600" />
              <h2 className="text-xs sm:text-sm font-extrabold text-slate-900 uppercase tracking-wider">
                Enable New Service PIN Code
              </h2>
            </div>

            <form onSubmit={handleAddArea} className="flex flex-col sm:flex-row items-center gap-3">
              <div className="flex-grow grid grid-cols-1 sm:grid-cols-3 gap-3 w-full">
                <input
                  type="text"
                  value={newPincode}
                  onChange={(e) => setNewPincode(e.target.value.replace(/\D/g, ""))}
                  maxLength={6}
                  placeholder="6-Digit PIN Code (e.g. 700001)"
                  required
                  className="px-4 py-2.5 text-xs font-mono font-bold bg-slate-50 text-slate-900 rounded-xl border border-slate-200 focus:outline-none focus:border-amber-400 focus:bg-white transition"
                />
                <input
                  type="text"
                  value={newCity}
                  onChange={(e) => setNewCity(e.target.value)}
                  placeholder="City (e.g. Kolkata, Howrah)"
                  required
                  className="px-4 py-2.5 text-xs font-bold bg-slate-50 text-slate-900 rounded-xl border border-slate-200 focus:outline-none focus:border-amber-400 focus:bg-white transition"
                />
                <input
                  type="text"
                  value={newState}
                  onChange={(e) => setNewState(e.target.value)}
                  placeholder="State (e.g. West Bengal)"
                  className="px-4 py-2.5 text-xs font-bold bg-slate-50 text-slate-900 rounded-xl border border-slate-200 focus:outline-none focus:border-amber-400 focus:bg-white transition"
                />
              </div>

              <button
                type="submit"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-6 py-2.5 bg-amber-400 hover:bg-amber-500 text-amber-950 text-xs font-bold rounded-xl shadow-sm transition whitespace-nowrap"
              >
                <Plus className="w-4 h-4" />
                <span>Enable PIN</span>
              </button>
            </form>
          </div>

          {/* SERVICE AREAS LIST */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
              <h2 className="text-xs sm:text-sm font-extrabold text-slate-900 uppercase tracking-wider">
                Configured Service Areas ({filteredAreas.length})
              </h2>

              <div className="relative w-full sm:w-72">
                <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Filter by PIN, City, or State..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 text-slate-900 rounded-xl border border-slate-200 focus:outline-none focus:border-amber-400 transition"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {filteredAreas.map((sa) => (
                <div
                  key={sa.pincode}
                  className="bg-slate-50 rounded-xl p-3.5 border border-slate-200 hover:border-amber-300 transition flex items-center justify-between group"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="p-2 bg-amber-100 text-amber-900 rounded-lg">
                      <MapPin className="w-4 h-4" />
                    </span>
                    <div>
                      <div className="font-mono font-black text-sm text-slate-900">{sa.pincode}</div>
                      <div className="text-xs text-slate-500 font-medium">
                        {sa.city}, {sa.state}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" title="Active"></span>
                    <button
                      onClick={() => handleRemoveArea(sa.pincode)}
                      className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-rose-600 p-1 rounded transition"
                      title="Remove PIN"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
