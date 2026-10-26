"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  MapPin,
  FileDown,
  Plus,
  Bell,
  CheckCircle2,
  ChevronDown,
  Command,
} from "lucide-react";

interface AdminHeaderProps {
  title?: string;
  onSearch?: (query: string) => void;
  onExportCsv?: () => void;
  onNewOrder?: () => void;
  selectedHub?: string;
  onSelectHub?: (hub: string) => void;
}

export function AdminHeader({
  title,
  onSearch,
  onExportCsv,
  onNewOrder,
  selectedHub = "All Hubs / New Delhi NCR",
  onSelectHub,
}: AdminHeaderProps) {
  const router = useRouter();
  const [searchVal, setSearchVal] = useState("");
  const [hubDropdownOpen, setHubDropdownOpen] = useState(false);
  const [adminName, setAdminName] = useState("Sangeet Shaw");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const session = localStorage.getItem("cashall_admin_session");
      if (session) {
        try {
          const parsed = JSON.parse(session);
          if (parsed?.name) setAdminName(parsed.name);
        } catch (e) {}
      }
    }
  }, []);

  const hubs = [
    "All Hubs / New Delhi NCR",
    "Kolkata Central Hub (WB)",
    "Mumbai Bandra West Hub (MH)",
    "Bengaluru Koramangala Hub (KA)",
    "Hyderabad Hitech City (TS)",
  ];

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      if (onSearch) onSearch(searchVal);
      else if (searchVal.trim()) {
        router.push(`/admin/orders?q=${encodeURIComponent(searchVal.trim())}`);
      }
    }
  };

  return (
    <header className="sticky top-0 z-30 h-14 bg-white/95 backdrop-blur-md border-b border-slate-200 px-4 md:px-6 flex items-center justify-between gap-4">
      {/* LEFT: SEARCH BAR & HUB SELECTOR */}
      <div className="flex items-center gap-3 flex-1 max-w-2xl">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="search"
            value={searchVal}
            onChange={(e) => {
              setSearchVal(e.target.value);
              if (onSearch) onSearch(e.target.value);
            }}
            onKeyDown={handleKeyDown}
            placeholder="Search Order ID, IMEI, Customer phone, SKU... [⌘K]"
            className="w-full h-8.5 pl-9 pr-12 text-xs font-medium bg-slate-50 border border-slate-200 rounded-lg text-slate-800 placeholder:text-slate-400 focus:outline-none focus:bg-white focus:border-amber-400 focus:ring-2 focus:ring-amber-200/50 transition-all"
          />
          <kbd className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-200/70 text-slate-500 border border-slate-300/80 hidden sm:inline-block">
            ⌘K
          </kbd>
        </div>

        {/* HUB DROPDOWN */}
        <div className="relative hidden xl:block shrink-0">
          <button
            type="button"
            onClick={() => setHubDropdownOpen(!hubDropdownOpen)}
            className="flex items-center gap-1.5 px-3 h-8.5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-semibold transition-colors"
          >
            <MapPin className="w-3.5 h-3.5 text-amber-600" />
            <span className="truncate max-w-[170px]">{selectedHub}</span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {hubDropdownOpen && (
            <div className="absolute left-0 mt-1.5 w-60 bg-white border border-slate-200 rounded-xl shadow-lg py-1 z-50 text-xs animate-in fade-in zoom-in-95">
              {hubs.map((h) => (
                <button
                  key={h}
                  onClick={() => {
                    if (onSelectHub) onSelectHub(h);
                    setHubDropdownOpen(false);
                  }}
                  className={`w-full text-left px-3.5 py-2 hover:bg-slate-50 transition-colors flex items-center justify-between ${
                    selectedHub === h ? "font-bold text-amber-900 bg-amber-50" : "text-slate-700"
                  }`}
                >
                  <span className="truncate">{h}</span>
                  {selectedHub === h && <CheckCircle2 className="w-3.5 h-3.5 text-amber-600" />}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* RIGHT: SYSTEM STATUS, ACTIONS, USER */}
      <div className="flex items-center gap-2.5 shrink-0">
        <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-100 border border-slate-200">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-[11px] font-semibold text-slate-600">All Systems Normal</span>
        </div>

        {onExportCsv && (
          <button
            type="button"
            onClick={onExportCsv}
            className="h-8.5 px-3 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs"
          >
            <FileDown className="w-3.5 h-3.5 text-slate-500" />
            <span className="hidden sm:inline">Export CSV</span>
          </button>
        )}

        <button
          type="button"
          onClick={onNewOrder ? onNewOrder : () => router.push("/sell-used-phone")}
          className="h-8.5 px-3.5 rounded-lg bg-amber-400 hover:bg-amber-500 text-amber-950 font-bold text-xs flex items-center gap-1.5 border border-amber-500 transition-all shadow-xs"
        >
          <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
          <span>New Order</span>
        </button>

        <div className="relative">
          <button
            type="button"
            className="h-8.5 w-8.5 flex items-center justify-center rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-600 transition-colors"
            title="Notifications"
          >
            <Bell className="w-4 h-4" />
          </button>
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-amber-500 ring-2 ring-white" />
        </div>

        <div
          className="w-8.5 h-8.5 rounded-full bg-amber-400 text-amber-950 font-black text-xs flex items-center justify-center border border-amber-500 shadow-xs cursor-pointer"
          title={adminName}
        >
          {adminName.slice(0, 2).toUpperCase()}
        </div>
      </div>
    </header>
  );
}
