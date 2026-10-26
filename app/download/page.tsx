"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Download,
  ShieldCheck,
  Smartphone,
  PhoneCall,
  Bell,
  Headphones,
  CheckCircle2,
  Lock,
  Unlock,
  KeyRound,
  ArrowRight,
  Sparkles,
  ChevronRight,
  AlertCircle,
  FileCheck,
} from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

const PRESET_APP_TYPES = [
  {
    id: "customer",
    name: "Customer App",
    category: "CUSTOMER",
    badge: "Selected Beta Users",
    version: "v1.0.0 Stable",
    size: "4.8 MB",
    description: "Sell smartphones, laptops & tablets with live real-time price quotes, doorstep tracking, and instant UPI payouts.",
    features: [
      "Instant 60s algorithmic quote calculator",
      "Doorstep pickup slot booking & rescheduling",
      "Live field agent arrival tracking on map",
      "Digital Bill of Sale & instant receipt storage",
    ],
    downloadEndpoint: "/api/v1/download/customer",
    fileName: "CashALL-Customer.apk",
  },
  {
    id: "admin",
    name: "Operations Admin App",
    category: "ADMIN",
    badge: "Internal Executive Staff",
    version: "v1.0.0 Executive",
    size: "5.7 MB",
    description: "Real-time command center for leadership. Instant buzzer alarm for incoming bookings, agent dispatch, and live ledger.",
    features: [
      "10-second real-time audio buzzer alarm",
      "Instant order review & status override",
      "Dynamic catalog & price multiplier controls",
      "Complete agent & customer audit trails",
    ],
    downloadEndpoint: "/api/v1/download/admin",
    fileName: "CashALL-Admin.apk",
  },
  {
    id: "agent",
    name: "Field Operations Agent App",
    category: "AGENT",
    badge: "Authorized Field Personnel",
    version: "v1.0.0 Field",
    size: "6.0 MB",
    description: "Dedicated mobile workflow for on-site pickup executives. Full hardware diagnostic checklists, offline sync, and signature capture.",
    features: [
      "Assisted 24-point hardware inspection tool",
      "1-tap Google Maps turn-by-turn navigation",
      "Customer digital signature & KYC capture",
      "Real-time instant UPI payment verification",
    ],
    downloadEndpoint: "/api/v1/download/agent",
    fileName: "CashALL-Agent.apk",
  },
  {
    id: "caller",
    name: "Caller Desk CRM App",
    category: "CALLER",
    badge: "Operations Telecalling Staff",
    version: "v1.0.0 CRM",
    size: "5.8 MB",
    description: "Automated calling and customer verification desk for tele-executives. Fast 1-click SIM dialer with auto-call recording storage.",
    features: [
      "Zero-latency automated SIM dialing",
      "Integrated customer enquiry CRM sheet",
      "Pickup confirmation & address verification",
      "Caller performance logs and recording backup",
    ],
    downloadEndpoint: "/api/v1/download/caller",
    fileName: "CashALL-Caller.apk",
  },
];

export default function AppDownloadHubPage() {
  const [accessKey, setAccessKey] = useState("");
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [authError, setAuthError] = useState("");
  const [authLoading, setAuthLoading] = useState(false);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  // Restore saved authorization key if present in session
  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = sessionStorage.getItem("cashall_app_access_key") || localStorage.getItem("cashall_app_access_key");
      if (stored) {
        setAccessKey(stored);
        setIsAuthorized(true);
      }
    }
  }, []);

  const handleVerifyKey = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const key = accessKey.trim();
    if (!key) {
      setAuthError("Please enter your assigned passkey or invitation token.");
      return;
    }

    setAuthLoading(true);
    setAuthError("");

    // Quick client validation against valid keys
    const validKeys = [
      "CASHALL_VIP_2026",
      "CASHALL_VIP_CUSTOMER",
      "CASHALL_ADMIN_SECURE_2026",
      "CASHALL_AGENT_SECURE_2026",
      "CASHALL_CALLER_SECURE_2026",
      "Ank933967@",
      "CASHALL_PRIVATE_ACCESS",
      "CASHALL_SELECT_2026",
    ];

    const isMatch = validKeys.some((k) => k.toLowerCase() === key.toLowerCase());

    if (isMatch) {
      setIsAuthorized(true);
      if (typeof window !== "undefined") {
        sessionStorage.setItem("cashall_app_access_key", key);
        document.cookie = `cashall_download_access=${encodeURIComponent(key)}; path=/; max-age=86400; SameSite=Lax`;
      }
      setAuthLoading(false);
    } else {
      // Also try pinging the customer download route to test server-side validation
      fetch(`/api/v1/download/customer?key=${encodeURIComponent(key)}`)
        .then((res) => {
          if (res.status === 200) {
            setIsAuthorized(true);
            sessionStorage.setItem("cashall_app_access_key", key);
            document.cookie = `cashall_download_access=${encodeURIComponent(key)}; path=/; max-age=86400; SameSite=Lax`;
          } else {
            setAuthError("Invalid Access Passkey. These builds are restricted to selected personnel only.");
          }
        })
        .catch(() => {
          setAuthError("Verification failed. Please check your internet connection.");
        })
        .finally(() => {
          setAuthLoading(false);
        });
    }
  };

  const handleDownload = (app: typeof PRESET_APP_TYPES[0]) => {
    if (!isAuthorized) {
      setAuthError("Please enter and verify your access passkey before downloading.");
      return;
    }

    setDownloadingId(app.id);
    const keyToUse = accessKey.trim() || sessionStorage.getItem("cashall_app_access_key") || "CASHALL_VIP_2026";
    window.location.href = `${app.downloadEndpoint}?key=${encodeURIComponent(keyToUse)}`;

    setTimeout(() => {
      setDownloadingId(null);
    }, 4500);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAFAF9] text-brand-black selection:bg-brand-yellow/30">
      <Header />

      <main className="flex-grow py-10 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          
          {/* BREADCRUMB */}
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs font-semibold text-neutral-400">
            <Link href="/" className="hover:text-brand-black transition-colors">
              Home
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-neutral-300" />
            <span className="text-brand-black font-bold">Restricted App Distribution</span>
          </nav>

          {/* HERO BANNER - RESTRICTED ACCESS NOTICE */}
          <div className="relative overflow-hidden rounded-3xl bg-white border border-neutral-200/90 shadow-[0_4px_30px_-4px_rgba(0,0,0,0.05)] p-8 sm:p-12">
            <div className="absolute top-0 right-0 w-96 h-96 bg-brand-yellow/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-10 left-10 w-72 h-72 bg-amber-500/5 rounded-full blur-2xl pointer-events-none" />

            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-8 space-y-4">
                <p className="text-xs font-bold text-amber-800 uppercase tracking-wider flex items-center gap-2">
                  <Lock className="w-3.5 h-3.5" />
                  <span>Private Distribution — Selected Access Only</span>
                </p>

                <h1 className="text-3xl sm:text-5xl font-black text-brand-black tracking-tight leading-tight">
                  CashALL Native <span className="bg-brand-yellow px-2 py-0.5 rounded-xl">Mobile Portals</span>
                </h1>

                <p className="text-sm sm:text-base text-neutral-600 max-w-2xl font-normal leading-relaxed">
                  To protect proprietary operations, diagnostic algorithms, and internal workflows, CashALL Android packages are restricted to selected beta customers, field agents, operations telecallers, and administrative staff.
                </p>

                <div className="pt-2 flex flex-wrap items-center gap-4 text-xs font-semibold text-neutral-500">
                  <span className="flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" /> Cryptographically Signed APKs
                  </span>
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-brand-yellow" /> Android 10+ Compatible
                  </span>
                  <span className="flex items-center gap-1.5">
                    <KeyRound className="w-4 h-4 text-amber-500" /> Passkey Verification Required
                  </span>
                </div>
              </div>

              {/* ACCESS VERIFICATION BOX */}
              <div className="lg:col-span-4 bg-neutral-900 text-white rounded-2xl p-6 sm:p-7 border border-neutral-800 shadow-xl space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 font-bold text-sm">
                    {isAuthorized ? (
                      <Unlock className="w-4 h-4 text-emerald-400" />
                    ) : (
                      <Lock className="w-4 h-4 text-brand-yellow" />
                    )}
                    <span>{isAuthorized ? "Passkey Verified" : "Authorized Access Key"}</span>
                  </div>
                  {isAuthorized && (
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold uppercase">
                      Unlocked
                    </span>
                  )}
                </div>

                {isAuthorized ? (
                  <div className="space-y-3">
                    <div className="bg-neutral-800/80 rounded-xl p-3 border border-neutral-700/80 text-xs text-neutral-300">
                      <p className="text-emerald-400 font-bold flex items-center gap-1.5 mb-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Downloads Unlocked
                      </p>
                      <p className="text-[11px] text-neutral-400">
                        You have verified access. Tap any app card below to download the official APK build.
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        setIsAuthorized(false);
                        setAccessKey("");
                        sessionStorage.removeItem("cashall_app_access_key");
                        document.cookie = "cashall_download_access=; path=/; max-age=0";
                      }}
                      className="text-[11px] text-neutral-400 hover:text-white underline cursor-pointer"
                    >
                      Lock / Switch Passkey
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleVerifyKey} className="space-y-3">
                    <p className="text-xs text-neutral-400">
                      Enter your invite token or staff security passkey to unlock download packages:
                    </p>
                    <div className="relative">
                      <input
                        type="password"
                        value={accessKey}
                        onChange={(e) => {
                          setAccessKey(e.target.value);
                          if (authError) setAuthError("");
                        }}
                        placeholder="Enter Access Passkey..."
                        className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-800 border border-neutral-700 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-brand-yellow font-mono"
                      />
                    </div>

                    {authError && (
                      <div className="text-[11px] text-red-400 flex items-start gap-1.5 bg-red-950/40 border border-red-900/60 p-2 rounded-lg">
                        <AlertCircle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                        <span>{authError}</span>
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={authLoading}
                      className="w-full py-2.5 rounded-xl bg-brand-yellow text-brand-black text-xs font-black uppercase tracking-wider hover:bg-yellow-400 transition-all shadow-md flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                    >
                      {authLoading ? "Verifying..." : "Unlock App Downloads"}
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>

          {/* APPLICATION CARDS GRID */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {PRESET_APP_TYPES.map((app) => (
              <div
                key={app.id}
                className="bg-white rounded-3xl p-6 sm:p-8 border border-neutral-200/90 shadow-[0_4px_24px_-4px_rgba(0,0,0,0.04)] hover:shadow-[0_12px_32px_-6px_rgba(255,212,0,0.18)] hover:border-brand-yellow/60 transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  {/* APP CARD TOP HEADER */}
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div className="flex items-center gap-3">
                      <div className="relative w-12 h-12 rounded-2xl bg-brand-black flex items-center justify-center p-2 shadow-sm shrink-0">
                        <Image
                          src="/photos/CashALL_app_icon.png"
                          alt="CashALL App"
                          width={40}
                          height={40}
                          className="object-contain rounded-xl"
                        />
                      </div>
                      <div>
                        <h3 className="text-lg font-black text-brand-black">
                          {app.name}
                        </h3>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-neutral-100 text-neutral-600 border border-neutral-200">
                            {app.version}
                          </span>
                          <span className="text-[10px] text-neutral-400 font-medium">
                            • {app.size}
                          </span>
                        </div>
                      </div>
                    </div>

                    <span className="text-[10px] font-extrabold px-2.5 py-1 rounded-full bg-amber-50 text-amber-900 border border-amber-200 uppercase tracking-wider shrink-0">
                      {app.badge}
                    </span>
                  </div>

                  <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed font-normal mb-5">
                    {app.description}
                  </p>

                  {/* FEATURE LIST */}
                  <div className="space-y-2 mb-6 bg-[#FAFAF9] p-4 rounded-2xl border border-neutral-200/70">
                    <div className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider mb-1">
                      Key Highlights:
                    </div>
                    {app.features.map((feat, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-xs text-neutral-700">
                        <CheckCircle2 className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* BOTTOM ACTION BUTTON */}
                <div className="pt-2">
                  <button
                    onClick={() => handleDownload(app)}
                    disabled={downloadingId === app.id}
                    className={`w-full py-3.5 px-6 rounded-2xl font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-md cursor-pointer ${
                      isAuthorized
                        ? "bg-brand-yellow text-brand-black hover:bg-yellow-400 shadow-yellowGlow active:scale-[0.98]"
                        : "bg-neutral-100 text-neutral-500 hover:bg-neutral-200 border border-neutral-200"
                    }`}
                  >
                    {isAuthorized ? (
                      <>
                        <Download className="w-4 h-4" />
                        <span>{downloadingId === app.id ? "Preparing Download..." : `Download ${app.name} (${app.size})`}</span>
                      </>
                    ) : (
                      <>
                        <Lock className="w-3.5 h-3.5 text-neutral-400" />
                        <span>Enter Passkey Above to Download</span>
                      </>
                    )}
                  </button>
                  <p className="text-[10px] text-center text-neutral-400 mt-2">
                    Restricted Android package ({app.fileName}) • Direct APK install
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* REQUEST ACCESS SUPPORT FOOTER */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-neutral-200/90 text-center space-y-3">
            <h3 className="text-base font-black text-brand-black">
              Need Access to CashALL Android Builds?
            </h3>
            <p className="text-xs sm:text-sm text-neutral-500 max-w-xl mx-auto font-normal leading-relaxed">
              If you are a selected customer, field executive, or business partner who requires access credentials, please contact our operations desk. We will issue you a personalized download passkey.
            </p>
            <div className="pt-2 flex flex-wrap items-center justify-center gap-4 text-xs font-bold">
              <a
                href="https://wa.me/917604092333?text=Hi%20CashALL,%20I%20need%20the%20access%20passkey%20for%20the%20CashALL%20app."
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100 transition-colors"
              >
                WhatsApp Access Desk (+91 7604092333)
              </a>
              <a
                href="mailto:support@cashall.in?subject=Request%20for%20CashALL%20App%20Access"
                className="px-4 py-2 rounded-xl bg-neutral-100 text-neutral-700 border border-neutral-200 hover:bg-neutral-200 transition-colors"
              >
                Email Support (support@cashall.in)
              </a>
            </div>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
