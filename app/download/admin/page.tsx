"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Download, ShieldCheck, Navigation, Bell, Smartphone, Lock, Unlock, KeyRound, AlertCircle } from "lucide-react";

export default function DownloadAdminPage() {
  const [downloading, setDownloading] = useState(false);
  const [passkey, setPasskey] = useState("");
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = sessionStorage.getItem("cashall_admin_download_key") || sessionStorage.getItem("cashall_app_access_key");
      const adminSession = localStorage.getItem("cashall_admin_session");
      if (stored || adminSession) {
        setIsAuthorized(true);
        if (stored) setPasskey(stored);
      }
    }
  }, []);

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanKey = passkey.trim();
    const validKeys = ["CASHALL_ADMIN_SECURE_2026", "CASHALL_VIP_2026", "Ank933967@"];
    if (validKeys.some((k) => k.toLowerCase() === cleanKey.toLowerCase())) {
      setIsAuthorized(true);
      setError("");
      sessionStorage.setItem("cashall_admin_download_key", cleanKey);
    } else {
      setError("Invalid Admin Passkey. Access restricted to authorized operators.");
    }
  };

  const handleDownload = () => {
    if (!isAuthorized) {
      setError("Please verify passkey to download.");
      return;
    }
    setDownloading(true);
    const keyToUse = passkey.trim() || sessionStorage.getItem("cashall_admin_download_key") || "CASHALL_VIP_2026";
    window.location.href = `/api/v1/download/admin?key=${encodeURIComponent(keyToUse)}`;
    setTimeout(() => setDownloading(false), 4000);
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-white flex flex-col justify-center items-center p-4 sm:p-6">
      <div className="max-w-md w-full bg-neutral-900 border border-neutral-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 text-center relative overflow-hidden">
        {/* Glow */}
        <div className="absolute -top-24 -left-24 w-48 h-48 bg-yellow-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-yellow-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* LOGO & TITLE */}
        <div className="space-y-3">
          <div className="w-20 h-20 bg-black border-2 border-yellow-500/40 rounded-2xl mx-auto flex items-center justify-center shadow-lg p-2">
            <Image src="/logo.webp" alt="CashALL" width={64} height={64} className="object-contain" priority />
          </div>
          <div>
            <h1 className="text-2xl font-black text-white font-price tracking-wide">
              CashALL <span className="text-yellow-400">Admin App</span>
            </h1>
            <p className="text-xs text-neutral-400 mt-1 font-medium">
              Private Executive Mobile Console v1.0.0
            </p>
          </div>
        </div>

        {/* 4 ADMIN ACCESS BADGE */}
        <div className="bg-yellow-950/40 border border-yellow-500/30 rounded-2xl p-3 text-xs text-yellow-300 flex items-center justify-center gap-2 font-bold">
          <Lock className="w-4 h-4 text-yellow-400 shrink-0" />
          <span>Restricted to Authorized Operators</span>
        </div>

        {/* PASSKEY VERIFICATION */}
        {!isAuthorized ? (
          <form onSubmit={handleVerify} className="space-y-3 bg-neutral-950/70 p-4 rounded-2xl border border-neutral-800 text-left">
            <label className="text-xs font-bold text-neutral-300 flex items-center gap-1.5">
              <KeyRound className="w-3.5 h-3.5 text-yellow-400" />
              <span>Enter Operator Passkey</span>
            </label>
            <input
              type="password"
              value={passkey}
              onChange={(e) => {
                setPasskey(e.target.value);
                if (error) setError("");
              }}
              placeholder="Enter Admin Security Passkey"
              className="w-full px-3 py-2.5 rounded-xl bg-neutral-800 border border-neutral-700 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-yellow-400"
            />
            {error && (
              <p className="text-[11px] text-red-400 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" /> {error}
              </p>
            )}
            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-yellow-400 text-black font-extrabold text-xs uppercase hover:bg-yellow-300 transition-colors"
            >
              Verify Passkey
            </button>
          </form>
        ) : (
          <div className="bg-emerald-950/40 border border-emerald-800/80 rounded-2xl p-3 text-xs text-emerald-300 flex items-center justify-between font-bold">
            <span className="flex items-center gap-1.5">
              <Unlock className="w-4 h-4 text-emerald-400" /> Authorized Access Granted
            </span>
            <button
              onClick={() => setIsAuthorized(false)}
              className="text-[10px] text-neutral-400 hover:text-white underline"
            >
              Lock
            </button>
          </div>
        )}

        {/* DOWNLOAD BUTTON */}
        <div className="space-y-2">
          <button
            onClick={handleDownload}
            disabled={downloading || !isAuthorized}
            className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-yellow-400 via-yellow-500 to-amber-500 hover:from-yellow-300 hover:to-amber-400 text-black font-black text-sm transition shadow-xl active:scale-95 flex items-center justify-center gap-2.5 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Download className="w-5 h-5 stroke-[2.5]" />
            <span>
              {!isAuthorized
                ? "Locked (Enter Passkey Above)"
                : downloading
                ? "Starting Download..."
                : "Download CashALL Admin APK"}
            </span>
          </button>
          <div className="text-[11px] text-neutral-400 flex items-center justify-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-400"></span>
            <span>Production Signed • 5.7 MB • Android 7.0 - 15</span>
          </div>
        </div>

        <div className="text-center pt-2">
          <Link href="/admin/login" className="text-xs text-yellow-400 hover:underline font-semibold">
            &larr; Return to Admin Web Console
          </Link>
        </div>
      </div>
    </div>
  );
}
