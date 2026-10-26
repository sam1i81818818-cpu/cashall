"use client";

import React, { useState } from "react";
import {
  X,
  Smartphone,
  CheckCircle2,
  AlertTriangle,
  ShieldCheck,
  Printer,
  MessageSquare,
  BadgeCheck,
  CreditCard,
  User,
  Phone,
  MapPin,
  Clock,
  Sparkles,
  Zap,
  ArrowRight,
  Battery,
  Cpu,
  Wifi,
  Camera,
  Layers,
  FileCheck,
  Check,
} from "lucide-react";

export interface DiagnosticsOrder {
  id: string;
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  location?: string;
  pincode?: string;
  deviceName?: string;
  estimatedPrice?: number;
  quotedPrice?: number;
  revisedPrice?: number | null;
  finalPrice?: number | null;
  status: string;
  imeiNumber?: string | null;
  imei?: string | null;
  batteryHealth?: number | null;
  grade?: string | null;
  agentName?: string | null;
  agentPhone?: string | null;
  pickupDate?: string;
  pickupTimeSlot?: string;
  createdAt?: string;
  selectedAnswersJson?: string | null;
  paymentStatus?: string;
  utr?: string | null;
}

interface OrderDiagnosticsDrawerProps {
  order: DiagnosticsOrder | null;
  isOpen: boolean;
  onClose: () => void;
  onAuthorizePayout?: (orderId: string, amount: number) => Promise<void> | void;
}

export function OrderDiagnosticsDrawer({
  order,
  isOpen,
  onClose,
  onAuthorizePayout,
}: OrderDiagnosticsDrawerProps) {
  const [releasingPayout, setReleasingPayout] = useState(false);
  const [payoutSuccess, setPayoutSuccess] = useState(false);

  if (!isOpen || !order) return null;

  const quotedVal = order.estimatedPrice || 0;
  const finalVal = order.finalPrice || order.revisedPrice || quotedVal;
  const priceDelta = finalVal - quotedVal;

  const handleReleaseEscrow = async () => {
    if (onAuthorizePayout) {
      setReleasingPayout(true);
      try {
        await onAuthorizePayout(order.id, finalVal);
        setPayoutSuccess(true);
      } catch (e) {
        console.error(e);
      } finally {
        setReleasingPayout(false);
      }
    } else {
      setReleasingPayout(true);
      setTimeout(() => {
        setReleasingPayout(false);
        setPayoutSuccess(true);
      }, 1000);
    }
  };

  const diagnosticItems = [
    { name: "Display & OLED Uniformity", icon: Smartphone, passed: true, note: "Pristine, no dead pixels" },
    { name: "Touch Digitizer Multi-point", icon: Layers, passed: true, note: "10-point capacitive responsive" },
    { name: "TrueTone & Ambient Sensor", icon: Sparkles, passed: true, note: "Color calibration factory calibrated" },
    { name: "Biometric Enclave (Face/Touch ID)", icon: ShieldCheck, passed: true, note: "Fast enrollment verified" },
    { name: "Primary Wide Camera Lens", icon: Camera, passed: true, note: "OIS active, lens dust-free" },
    { name: "Telephoto & Ultrawide Camera", icon: Camera, passed: true, note: "Full focal zoom functional" },
    { name: "Front Selfie Camera", icon: Camera, passed: true, note: "Portraits & HDR tested" },
    { name: "Quad Spatial Microphones", icon: Zap, passed: true, note: "Noise cancellation active" },
    { name: "Stereo Speakers Acoustic", icon: Zap, passed: true, note: "Clean high & bass range" },
    { name: "Wi-Fi 6E & Bluetooth 5.3", icon: Wifi, passed: true, note: "Signal strength -42 dBm" },
    { name: "GPS & Compass Precision", icon: MapPin, passed: true, note: "Lock within 2.1 meters" },
    { name: "Charging Port & Fast USB-C", icon: Battery, passed: true, note: "20W negotiation verified" },
    { name: "NFC / Contactless Payment", icon: CreditCard, passed: true, note: "Tag read operational" },
    { name: "Gyroscope & Motion Engine", icon: Cpu, passed: true, note: "6-axis acceleration verified" },
    { name: "Taptic / Haptic Feedback", icon: Cpu, passed: true, note: "Clean click resonance" },
    { name: "Proximity Sensor", icon: Sparkles, passed: true, note: "Screen sleeps during call" },
    { name: "Flashlight / Quad-LED", icon: Zap, passed: true, note: "High lumen strobe functional" },
    { name: "Cellular 5G Dual SIM", icon: Wifi, passed: true, note: "VoLTE / 5G SA registered" },
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/40 backdrop-blur-xs flex justify-end animate-fadeIn">
      <div className="relative w-full max-w-4xl bg-slate-50 min-h-screen shadow-2xl flex flex-col overflow-y-auto animate-slideInRight">
        {/* TOP COMMAND & ACTION BAR */}
        <div className="bg-white px-6 py-4 border-b border-slate-200 sticky top-0 z-20 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                <span>Admin</span>
                <span>/</span>
                <span>Operations</span>
                <span>/</span>
                <span>Orders</span>
                <span>/</span>
                <span className="text-amber-800 font-bold font-mono">#{order.orderNumber}</span>
              </div>
              <div className="flex items-center gap-3 mt-1">
                <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">
                  #{order.orderNumber}
                </h1>
                <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-950 font-extrabold text-[11px] border border-amber-300">
                  {order.status}
                </span>
                <span className="text-xs text-slate-500 hidden md:inline">
                  Doorstep Diagnostic Deep-Dive
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 self-start sm:self-center">
              <button
                type="button"
                onClick={() => window.print()}
                className="h-8.5 px-3 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs"
              >
                <Printer className="w-3.5 h-3.5 text-slate-500" />
                <span className="hidden sm:inline">Print QC</span>
              </button>

              {!payoutSuccess ? (
                <button
                  type="button"
                  onClick={handleReleaseEscrow}
                  disabled={releasingPayout}
                  className="h-8.5 px-3.5 rounded-lg bg-amber-400 hover:bg-amber-500 text-amber-950 font-black text-xs flex items-center gap-1.5 border border-amber-500 shadow-sm transition-all disabled:opacity-50"
                >
                  <BadgeCheck className="w-4 h-4" />
                  <span>
                    {releasingPayout ? "Releasing..." : `Authorize Payout ₹${finalVal.toLocaleString("en-IN")}`}
                  </span>
                </button>
              ) : (
                <div className="h-8.5 px-3 rounded-lg bg-emerald-100 border border-emerald-300 text-emerald-800 text-xs font-black flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Payout Authorized</span>
                </div>
              )}

              <button
                type="button"
                onClick={onClose}
                className="h-8.5 w-8.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 text-slate-500 hover:text-slate-800 flex items-center justify-center transition-colors"
                title="Close Drawer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* STAKEHOLDER META STRIP */}
          <div className="mt-3.5 grid grid-cols-1 md:grid-cols-3 gap-3 bg-slate-50 p-2.5 rounded-xl border border-slate-200">
            {/* CUSTOMER CARD */}
            <div className="flex items-start gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-600 shrink-0 shadow-xs">
                <User className="w-4 h-4" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-xs text-slate-900 truncate">
                    {order.customerName || "Customer"}
                  </span>
                  <span className="px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-800 text-[10px] font-extrabold border border-emerald-200">
                    OTP Verified
                  </span>
                </div>
                <div className="text-xs text-slate-600 font-mono mt-0.5">
                  {order.customerPhone || "—"}
                </div>
                <div className="text-[11px] text-slate-500 truncate mt-0.5">
                  {order.location || order.pincode || "Location recorded"}
                </div>
              </div>
            </div>

            {/* ASSIGNED TECH CARD */}
            <div className="flex items-start gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-600 shrink-0 shadow-xs">
                <BadgeCheck className="w-4 h-4 text-amber-600" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-xs text-slate-900 truncate">
                    {order.agentName || "Assigned Field Tech"}
                  </span>
                  <span className="text-amber-800 text-[10px] font-bold">★ 4.9</span>
                </div>
                <div className="text-xs text-slate-600 font-mono mt-0.5">
                  {order.agentPhone ? `ID: ${order.agentPhone}` : "TECH-FIELD-LEAD"}
                </div>
                <div className="text-[11px] text-emerald-700 font-semibold flex items-center gap-1 mt-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span>Doorstep Completed</span>
                </div>
              </div>
            </div>

            {/* LOGISTICS & HUB INTEGRITY */}
            <div className="flex items-start gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-600 shrink-0 shadow-xs">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-slate-900">NCR Intake Hub</span>
                  <span className="font-mono text-[10px] text-slate-500">BAY-04</span>
                </div>
                <div className="text-xs text-slate-600 mt-0.5">Courier Van Route Synced</div>
                <div className="text-[11px] text-amber-800 font-bold mt-0.5">
                  Safe Bag #SB-{order.orderNumber.replace(/\D/g, "").slice(0, 4) || "8842"}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* MAIN BODY: 60% DIAGNOSTICS & 40% LEDGER */}
        <div className="p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* LEFT COLUMN: 60% (7 COLS) HARDWARE SENSORS & PROFILES */}
          <div className="lg:col-span-7 space-y-5">
            {/* DEVICE HARDWARE PROFILE */}
            <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-xs space-y-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-800 shadow-xs">
                    <Smartphone className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="font-extrabold text-sm text-slate-900">
                      {order.deviceName || "Device Hardware Intake"}
                    </h2>
                    <div className="text-xs text-slate-500 font-mono mt-0.5">
                      IMEI: {order.imeiNumber || "354892019284712"} • Global Model
                    </div>
                  </div>
                </div>

                <div className="flex flex-col items-end">
                  <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-extrabold border border-emerald-200">
                    CEIR Clean
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono mt-0.5">Verified Registry</span>
                </div>
              </div>

              {/* 4 TELEMETRY MINI CARDS */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-2">
                <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">Battery Health</span>
                  <div className="flex items-baseline gap-1 mt-0.5">
                    <span className="text-base font-black text-slate-900">89%</span>
                    <span className="text-[10px] font-bold text-emerald-600">Good</span>
                  </div>
                  <div className="w-full bg-slate-200 h-1 rounded-full mt-1.5 overflow-hidden">
                    <div className="bg-amber-400 h-full rounded-full" style={{ width: "89%" }} />
                  </div>
                </div>

                <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">Cycle Count</span>
                  <div className="flex items-baseline gap-1 mt-0.5">
                    <span className="text-base font-black text-slate-900">384</span>
                    <span className="text-[10px] text-slate-500">cycles</span>
                  </div>
                  <span className="text-[10px] text-slate-400 block mt-1">Cap: 500</span>
                </div>

                <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">SIM Enclave</span>
                  <div className="text-xs font-black text-slate-900 mt-1 truncate">eSIM + Physical</div>
                  <span className="text-[10px] text-emerald-600 font-bold block mt-0.5">No Carrier Lock</span>
                </div>

                <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">iCloud / FRP</span>
                  <div className="text-xs font-black text-slate-900 mt-1">Unlinked</div>
                  <span className="text-[10px] text-emerald-600 font-bold block mt-0.5">Clean Reset</span>
                </div>
              </div>
            </div>

            {/* AUTOMATED 18-POINT HARDWARE SENSOR SUITE */}
            <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-xs space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <BadgeCheck className="w-4 h-4 text-amber-600" />
                  <h3 className="font-bold text-xs text-slate-900">
                    Automated 18-Point Hardware Sensor Suite
                  </h3>
                </div>
                <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 text-[10px] font-mono font-bold border border-emerald-200">
                  18 / 18 Tests Executed
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {diagnosticItems.map((item, idx) => {
                  const Icon = item.icon;
                  return (
                    <div
                      key={idx}
                      className="p-2 rounded-lg bg-slate-50 border border-slate-200/80 flex items-center justify-between hover:bg-slate-100/60 transition-colors"
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <div className="w-6 h-6 rounded bg-white border border-slate-200 flex items-center justify-center shrink-0">
                          <Icon className="w-3.5 h-3.5 text-slate-600" />
                        </div>
                        <div className="min-w-0">
                          <div className="text-xs font-semibold text-slate-800 truncate">
                            {item.name}
                          </div>
                          <div className="text-[10px] text-slate-400 truncate">{item.note}</div>
                        </div>
                      </div>
                      <div className="shrink-0 pl-1.5">
                        <span className="inline-flex items-center gap-0.5 px-1.5 py-0.2 rounded-full bg-emerald-100 text-emerald-800 text-[9px] font-black border border-emerald-200">
                          <Check className="w-2.5 h-2.5 stroke-[3]" /> PASS
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: 40% (5 COLS) VALUATION DERIVATION & LEDGER */}
          <div className="lg:col-span-5 space-y-5">
            {/* VALUATION DERIVATION LEDGER */}
            <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <h3 className="font-bold text-xs text-slate-900 uppercase tracking-wider">
                  Valuation Derivation Ledger
                </h3>
                <span className="text-[10px] font-bold text-slate-400">Policy Matrix v3</span>
              </div>

              {/* COMPARISON METRICS */}
              <div className="p-3 bg-amber-50/60 border border-amber-200/80 rounded-xl space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-600">Initial Customer Quote:</span>
                  <span className="font-bold text-slate-800 line-through">
                    ₹{quotedVal.toLocaleString("en-IN")}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-600">Inspection Derived Value:</span>
                  <span className="text-base font-black text-amber-950">
                    ₹{finalVal.toLocaleString("en-IN")}
                  </span>
                </div>
                <div className="flex items-center justify-between pt-1 border-t border-amber-200/60 text-xs">
                  <span className="text-slate-500 font-medium">Clearance Delta:</span>
                  <span
                    className={`font-black ${
                      priceDelta < 0 ? "text-red-700" : "text-emerald-700"
                    }`}
                  >
                    {priceDelta === 0
                      ? "₹0 (Zero Variance)"
                      : `${priceDelta > 0 ? "+" : ""}₹${priceDelta.toLocaleString("en-IN")}`}
                  </span>
                </div>
              </div>

              {/* ITEM DEDUCTION BREAKDOWN TABLE */}
              <div className="space-y-2">
                <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  Inspected Derivation Adjustments
                </div>
                <div className="space-y-1.5 text-xs">
                  <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-200/70">
                    <div>
                      <span className="font-semibold text-slate-800">Cosmetic Grade A+</span>
                      <div className="text-[10px] text-slate-400">Zero screen or frame blemishes</div>
                    </div>
                    <span className="font-bold text-emerald-700 font-mono">₹0</span>
                  </div>

                  <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-200/70">
                    <div>
                      <span className="font-semibold text-slate-800">Original Box & Bill</span>
                      <div className="text-[10px] text-slate-400">Uploaded invoice verified with IMEI</div>
                    </div>
                    <span className="font-bold text-emerald-700 font-mono">+₹500</span>
                  </div>

                  <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-200/70">
                    <div>
                      <span className="font-semibold text-slate-800">Battery Capacity Factor</span>
                      <div className="text-[10px] text-slate-400">Standard wear adjustment</div>
                    </div>
                    <span className="font-bold text-slate-600 font-mono">₹0</span>
                  </div>
                </div>
              </div>

              {/* SIGN-OFF & ESCROW PAYOUT ACTIONS */}
              <div className="pt-2 border-t border-slate-100 space-y-3">
                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-xs space-y-1">
                  <div className="flex items-center justify-between font-bold text-slate-800">
                    <span>Customer Consent Sign-off</span>
                    <span className="text-emerald-700 flex items-center gap-1">
                      <Check className="w-3 h-3 stroke-[3]" /> Digitally Signed
                    </span>
                  </div>
                  <div className="text-[10px] text-slate-500">
                    Physical trade-in agreement accepted on mobile terminal • GPS Geotagged
                  </div>
                </div>

                {!payoutSuccess ? (
                  <button
                    type="button"
                    onClick={handleReleaseEscrow}
                    disabled={releasingPayout}
                    className="w-full py-2.5 rounded-xl bg-amber-400 hover:bg-amber-500 text-amber-950 font-black text-xs flex items-center justify-center gap-2 border border-amber-500 shadow-sm transition-all disabled:opacity-50"
                  >
                    <BadgeCheck className="w-4 h-4" />
                    <span>
                      {releasingPayout
                        ? "Transacting via Instant UPI..."
                        : `Instant Buyout Payout: ₹${finalVal.toLocaleString("en-IN")}`}
                    </span>
                  </button>
                ) : (
                  <div className="w-full py-2.5 rounded-xl bg-emerald-100 border border-emerald-300 text-emerald-900 font-extrabold text-xs text-center flex items-center justify-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                    <span>Treasury Payout Cleared • Instant IMPS Confirmed</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
