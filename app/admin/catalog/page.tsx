"use client";

import React, { useState, useEffect } from "react";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { INITIAL_BRANDS, INITIAL_MODELS, INITIAL_VARIANTS, BrandData } from "@/lib/store";
import { Smartphone, Plus, HardDrive, Search, Image as ImageIcon, Loader2 } from "lucide-react";
import { BrandIcon } from "@/components/common/BrandIcon";

function getAdminToken() {
  if (typeof window === "undefined") return "tok_admin_master_session";
  try {
    const saved = JSON.parse(localStorage.getItem("cashall_admin_session") || "{}");
    return saved?.token || "tok_admin_master_session";
  } catch {
    return "tok_admin_master_session";
  }
}

export default function AdminCatalogPage() {
  const [activeTab, setActiveTab] = useState<"MODELS" | "BRANDS" | "VARIANTS">("MODELS");
  const [search, setSearch] = useState("");
  const [brands, setBrands] = useState<any[]>(INITIAL_BRANDS);
  const [models, setModels] = useState<any[]>(INITIAL_MODELS);
  const [variants, setVariants] = useState<any[]>(INITIAL_VARIANTS);
  const [loading, setLoading] = useState(false);
  const [editingBrand, setEditingBrand] = useState<any | null>(null);
  const [newLogoUrl, setNewLogoUrl] = useState("");

  useEffect(() => {
    setLoading(true);
    fetch("/api/v1/admin/catalog")
      .then((res) => res.json())
      .then((json) => {
        if (json.success && json.data) {
          if (Array.isArray(json.data.brands) && json.data.brands.length > 0) {
            setBrands(json.data.brands);
          }
          if (Array.isArray(json.data.models) && json.data.models.length > 0) {
            setModels(json.data.models);
          }
          if (Array.isArray(json.data.variants) && json.data.variants.length > 0) {
            setVariants(json.data.variants);
          }
        }
      })
      .catch((err) => console.warn("Catalog fetch fallback to local:", err))
      .finally(() => setLoading(false));
  }, []);

  const handleUpdateLogo = async (brandId: string) => {
    if (!newLogoUrl) return;
    try {
      const token = getAdminToken();
      await fetch("/api/v1/admin/catalog", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          type: "brand",
          id: brandId,
          data: { logoUrl: newLogoUrl },
        }),
      });
    } catch {}

    setBrands((prev) =>
      prev.map((b) => (b.id === brandId ? { ...b, logoUrl: newLogoUrl } : b))
    );
    setEditingBrand(null);
    setNewLogoUrl("");
  };

  const filteredBrands = brands.filter((b) =>
    (b.name || "").toLowerCase().includes(search.toLowerCase().trim())
  );

  const filteredModels = models.filter((m) =>
    (m.name || "").toLowerCase().includes(search.toLowerCase().trim())
  ).sort((a, b) => (b.releaseYear ?? 0) - (a.releaseYear ?? 0));

  const filteredVariants = variants.filter((v) => {
    const s = search.toLowerCase().trim();
    return (
      (v.storage || "").toLowerCase().includes(s) ||
      (v.model?.name || "").toLowerCase().includes(s) ||
      (v.id || "").toLowerCase().includes(s)
    );
  });

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col lg:flex-row w-full max-w-full overflow-x-hidden font-sans">
      <AdminSidebar />

      <div className="flex-1 flex flex-col min-w-0">
        <AdminHeader title="Device Catalog Management" />

        <main className="flex-1 w-full max-w-full p-4 sm:p-6 lg:p-8 overflow-x-hidden space-y-6">
          {/* HEADER RIBBON */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
            <div>
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-amber-100 border border-amber-300 flex items-center justify-center">
                  <Smartphone className="w-5 h-5 text-amber-700" />
                </div>
                <div>
                  <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                    Device Catalog
                  </h1>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Manage device brands, models &amp; variants
                  </p>
                </div>
              </div>
            </div>

            <button className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-amber-400 hover:bg-amber-500 text-amber-950 text-xs font-black rounded-xl border border-amber-500 shadow-xs transition self-start sm:self-auto">
              <Plus className="w-4 h-4" />
              <span>Add Device Model</span>
            </button>
          </div>

          {/* TABS & SEARCH */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2 border-b border-slate-200 pb-2 overflow-x-auto scrollbar-none">
              {(["MODELS", "BRANDS", "VARIANTS"] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all shrink-0 ${
                    activeTab === tab
                      ? "bg-amber-400 text-amber-950 border border-amber-500 shadow-2xs"
                      : "bg-white text-slate-600 hover:bg-slate-100 hover:text-slate-900 border border-slate-200"
                  }`}
                >
                  {tab} ({tab === "MODELS" ? models.length : tab === "BRANDS" ? brands.length : variants.length})
                </button>
              ))}
            </div>

            <div className="max-w-md w-full relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={`Filter ${activeTab.toLowerCase()}...`}
                className="w-full pl-10 pr-3 py-2 text-xs bg-white text-slate-900 rounded-xl border border-slate-200 focus:outline-none focus:border-amber-400"
              />
            </div>
          </div>

          {/* CONTENT MATRIX */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs">
            {loading ? (
              <div className="py-16 text-center">
                <Loader2 className="w-6 h-6 animate-spin text-amber-500 mx-auto mb-2" />
                <span className="text-xs text-slate-500 font-semibold">Loading catalog from PostgreSQL...</span>
              </div>
            ) : activeTab === "MODELS" ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {filteredModels.map((model) => (
                  <div key={model.id} className="p-4 bg-slate-50 rounded-xl border border-slate-200 hover:border-amber-400 hover:bg-white transition flex items-center justify-between shadow-2xs">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-10 h-10 rounded-xl bg-amber-100 border border-amber-300 flex items-center justify-center p-1 text-amber-800 shrink-0">
                        <Smartphone className="w-5 h-5" />
                      </div>
                      <div className="min-w-0">
                        <div className="text-xs font-extrabold text-slate-900 truncate">{model.name}</div>
                        <div className="text-[11px] text-slate-500">
                          {model.brand?.name ? `${model.brand.name} • ` : ""}Released: {model.releaseYear || "Recent"}
                        </div>
                      </div>
                    </div>
                    <span className={`text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase border shrink-0 ${
                      model.popular ? "bg-amber-100 text-amber-900 border-amber-300" : "bg-slate-100 text-slate-600 border-slate-200"
                    }`}>
                      {model.popular ? "Popular" : "Active"}
                    </span>
                  </div>
                ))}
              </div>
            ) : activeTab === "BRANDS" ? (
              <div className="space-y-4">
                <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Phone &amp; Laptop Brands ({filteredBrands.length})
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {filteredBrands.map((brand) => (
                    <div key={brand.id} className="p-4 bg-slate-50 rounded-xl border border-slate-200 hover:border-amber-400 hover:bg-white transition flex items-center justify-between shadow-2xs">
                      <div className="flex items-center gap-3 min-w-0">
                        <BrandIcon name={brand.name} logoUrl={brand.logoUrl} className="w-12 h-12" />
                        <div className="min-w-0">
                          <div className="text-sm font-extrabold text-slate-900 truncate">{brand.name}</div>
                          <div className="text-[11px] text-slate-500 uppercase font-semibold">
                            {brand.category || "MOBILE"} {brand._count?.models ? `(${brand._count.models} models)` : ""}
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => {
                          setEditingBrand(brand);
                          setNewLogoUrl(brand.logoUrl || "");
                        }}
                        className="px-3 py-1.5 rounded-lg bg-white border border-slate-200 hover:border-amber-400 text-xs font-bold text-slate-700 flex items-center gap-1 transition shadow-2xs shrink-0"
                      >
                        <ImageIcon className="w-3.5 h-3.5 text-amber-600" />
                        <span>Edit Logo</span>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="divide-y divide-slate-100 text-xs">
                {filteredVariants.map((v) => (
                  <div key={v.id} className="py-3.5 flex items-center justify-between font-bold">
                    <div className="flex items-center gap-2 min-w-0">
                      <HardDrive className="w-4 h-4 text-amber-600 shrink-0" />
                      <span className="text-slate-800 truncate">
                        {v.model?.name ? `${v.model.name} — ` : ""}{v.storage || "Standard"} (ID: {v.id.slice(0, 8)}...)
                      </span>
                    </div>
                    <span className="font-price font-black text-emerald-700 text-sm shrink-0">
                      Base Valuation: ₹{(v.basePrice || 0).toLocaleString("en-IN")}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* EDIT BRAND LOGO MODAL */}
          {editingBrand && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
              <div className="bg-white rounded-2xl p-6 max-w-md w-full border border-slate-200 shadow-2xl space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <h3 className="text-base font-extrabold text-slate-900">Update Brand Logo — {editingBrand.name}</h3>
                  <button onClick={() => setEditingBrand(null)} className="text-slate-400 hover:text-slate-700">✕</button>
                </div>
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">New Image URL (WebP/PNG)</label>
                    <input
                      type="url"
                      value={newLogoUrl}
                      onChange={(e) => setNewLogoUrl(e.target.value)}
                      placeholder="https://example.com/logo.png"
                      className="w-full text-xs p-2.5 bg-slate-50 text-slate-900 rounded-xl border border-slate-200 focus:bg-white focus:outline-none focus:border-amber-400"
                    />
                  </div>
                  <div className="flex items-center gap-2 justify-end pt-2">
                    <button
                      onClick={() => setEditingBrand(null)}
                      className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-100 text-slate-700 hover:bg-slate-200 transition"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => handleUpdateLogo(editingBrand.id)}
                      className="px-4 py-2 rounded-xl text-xs font-black bg-amber-400 hover:bg-amber-500 text-amber-950 border border-amber-500 transition shadow-xs"
                    >
                      Save Logo
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
