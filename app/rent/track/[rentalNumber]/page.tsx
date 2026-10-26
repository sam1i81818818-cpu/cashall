"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  Gamepad2,
  Calendar,
  Clock,
  MapPin,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Plus,
  Minus,
  RefreshCw,
  Video,
  FileText,
  ShieldCheck,
  Disc,
  CreditCard,
  User,
  Phone,
  Printer,
  ChevronRight,
} from "lucide-react";

export default function Ps5RentalTrackPage() {
  const params = useParams();
  const rentalNumber = String(params.rentalNumber || "");

  const [rental, setRental] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Plan Extension State
  const [extendModalOpen, setExtendModalOpen] = useState(false);
  const [additionalDays, setAdditionalDays] = useState(1);
  const [extending, setExtending] = useState(false);
  const [extendSuccess, setExtendSuccess] = useState("");

  const fetchRental = useCallback(async () => {
    if (!rentalNumber) return;
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`/api/v1/rentals/${rentalNumber}?t=${Date.now()}`);
      const data = await res.json();
      if (data.success && data.rental) {
        setRental(data.rental);
      } else {
        setError(data.error || "Rental booking not found");
      }
    } catch (err: any) {
      setError(err.message || "Failed to load rental details");
    } finally {
      setLoading(false);
    }
  }, [rentalNumber]);

  useEffect(() => {
    fetchRental();
  }, [fetchRental]);

  const handleExtend = async () => {
    if (!rental) return;
    setExtending(true);
    setExtendSuccess("");
    setError("");

    try {
      const res = await fetch(`/api/v1/rentals/${rentalNumber}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "extend",
          additionalDays,
        }),
      });

      const data = await res.json();
      if (data.success && data.rental) {
        setRental(data.rental);
        setExtendSuccess(data.message || `Plan successfully extended by ${additionalDays} day(s)!`);
        setTimeout(() => {
          setExtendModalOpen(false);
          setExtendSuccess("");
        }, 2500);
      } else {
        setError(data.error || "Failed to extend plan.");
      }
    } catch (err: any) {
      setError(err.message || "Network error. Please try again.");
    } finally {
      setExtending(false);
    }
  };

  // Status Stepper Calculation
  const getStepIndex = (status: string) => {
    switch (status) {
      case "BOOKED":
        return 0;
      case "AGENT_ASSIGNED":
      case "OUT_FOR_DELIVERY":
        return 1;
      case "ACTIVE":
      case "EXTENDED":
        return 2;
      case "RETURN_SCHEDULED":
        return 3;
      case "COMPLETED":
        return 4;
      default:
        return 0;
    }
  };

  const steps = [
    { label: "Booked", desc: "Order confirmed" },
    { label: "Delivery Scheduled", desc: "Agent assigned" },
    { label: "Active Rental", desc: "Delivered & verified" },
    { label: "Return Scheduled", desc: "Pickup window set" },
    { label: "Completed", desc: "Inspected & closed" },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-[#07090E] text-white flex flex-col items-center justify-center p-4">
        <div className="w-12 h-12 rounded-full border-2 border-brand-yellow border-t-transparent animate-spin mb-4" />
        <p className="text-sm font-bold text-gray-300">Loading PS5 Rental Details...</p>
      </div>
    );
  }

  if (error || !rental) {
    return (
      <div className="min-h-screen bg-[#07090E] text-white flex flex-col items-center justify-center p-4 text-center">
        <AlertTriangle className="w-12 h-12 text-red-400 mb-4" />
        <h1 className="text-xl font-black text-white mb-2">Rental Not Found</h1>
        <p className="text-xs text-gray-400 max-w-md mb-6">{error || "The requested rental booking could not be retrieved."}</p>
        <Link
          href="/rent/ps5"
          className="px-6 py-3 rounded-xl bg-brand-yellow text-black font-black text-xs hover:bg-yellow-400"
        >
          Book a New PS5 Rental
        </Link>
      </div>
    );
  }

  const currentStep = getStepIndex(rental.rentalStatus);
  const totalDaysCombined = rental.totalDays + (rental.extendedDays || 0);
  const extraCDs = rental.rentalPackage === "CONSOLE_CD" ? Math.max(0, (rental.cdCount || 0) - 1) : 0;
  const extensionCostPerDay = rental.rentalPackage === "CONSOLE_CD"
    ? (499 + extraCDs * 100)
    : rental.rentalPackage === "CONSOLE_DIGITAL_ID"
    ? 599
    : (rental.dailyRate || 399);
  const addedCost = additionalDays * extensionCostPerDay;

  return (
    <div className="min-h-screen bg-[#07090E] text-white selection:bg-brand-yellow selection:text-black">
      {/* HEADER BREADCRUMB */}
      <div className="border-b border-neutral-800/80 bg-neutral-950/60 backdrop-blur-md sticky top-0 z-30">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="text-gray-400 hover:text-white text-xs font-semibold">
              CashALL
            </Link>
            <span className="text-gray-600 text-xs">/</span>
            <Link href="/rent/ps5" className="text-gray-400 hover:text-white text-xs font-semibold">
              PS5 Rental
            </Link>
            <span className="text-gray-600 text-xs">/</span>
            <span className="text-brand-yellow text-xs font-bold font-mono">
              #{rental.rentalNumber}
            </span>
          </div>

          <button
            onClick={fetchRental}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-neutral-900 border border-neutral-800 text-xs font-bold text-gray-300 hover:text-white"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Refresh Status</span>
          </button>
        </div>
      </div>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
        {/* RENTAL TITLE CARD */}
        <div className="bg-gradient-to-r from-blue-950/40 via-neutral-900 to-neutral-950 border border-neutral-800 rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-6 shadow-xl">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full text-[11px] font-black bg-brand-yellow/20 text-brand-yellow border border-brand-yellow/30 font-mono">
                {rental.rentalNumber}
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-black bg-blue-500/20 text-blue-400 border border-blue-500/30">
                {rental.rentalStatus.replace(/_/g, " ")}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white">
              {rental.consoleModel} Rental
            </h1>
            <p className="text-xs text-gray-400">
              Booked by <strong className="text-white">{rental.customerName}</strong> • {totalDaysCombined} Days Total ({rental.startDate} to {rental.endDate})
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setExtendModalOpen(true)}
              className="px-5 py-3 rounded-2xl bg-brand-yellow text-black font-black text-xs hover:bg-yellow-400 shadow-yellowGlow flex items-center gap-2 transition-transform active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>Extend Rental Plan</span>
            </button>

            <Link
              href={`/rent/inspect/${rental.rentalNumber}`}
              className="px-5 py-3 rounded-2xl bg-neutral-900 border border-neutral-800 text-gray-200 hover:text-white hover:bg-neutral-800 font-bold text-xs flex items-center gap-2 transition-colors"
            >
              <FileText className="w-4 h-4 text-brand-yellow" />
              <span>Inspection Form / Receipt</span>
            </Link>
          </div>
        </div>

        {/* STATUS STEPPER */}
        <div className="bg-neutral-900/90 border border-neutral-800 rounded-3xl p-6 sm:p-8 shadow-lg">
          <h2 className="text-sm font-black text-gray-300 mb-6 uppercase tracking-wider">
            Live Order Stepper
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 relative">
            {steps.map((step, idx) => {
              const isPast = idx < currentStep;
              const isCurrent = idx === currentStep;
              return (
                <div
                  key={step.label}
                  className={`p-4 rounded-2xl border transition-all ${
                    isCurrent
                      ? "border-brand-yellow bg-brand-yellow/10 ring-1 ring-brand-yellow/30"
                      : isPast
                      ? "border-neutral-800 bg-neutral-950/80 text-gray-400"
                      : "border-neutral-900 bg-neutral-950/40 text-gray-600 opacity-60"
                  }`}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                        isCurrent
                          ? "bg-brand-yellow text-black"
                          : isPast
                          ? "bg-green-500/20 text-green-400"
                          : "bg-neutral-800 text-gray-500"
                      }`}
                    >
                      {isPast ? "✓" : idx + 1}
                    </div>
                    <span className={`text-xs font-black ${isCurrent ? "text-white" : isPast ? "text-gray-300" : "text-gray-500"}`}>
                      {step.label}
                    </span>
                  </div>
                  <p className="text-[11px] text-gray-400 pl-8">{step.desc}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* DETAILS GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* RENTAL DETAILS CARD */}
          <div className="lg:col-span-2 bg-neutral-900/90 border border-neutral-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-lg">
            <h2 className="text-base font-black text-white flex items-center gap-2">
              <Gamepad2 className="w-5 h-5 text-brand-yellow" /> Hardware & Rental Specification
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-2xl bg-neutral-950 border border-neutral-800 space-y-1">
                <span className="text-gray-400 block">Console Model:</span>
                <span className="font-bold text-white text-sm">{rental.consoleModel}</span>
                <span className="text-[10px] text-brand-yellow block">₹500 / day rate</span>
              </div>

              <div className="p-4 rounded-2xl bg-neutral-950 border border-neutral-800 space-y-1">
                <span className="text-gray-400 block">Rental Duration:</span>
                <span className="font-bold text-white text-sm">
                  {totalDaysCombined} Days {rental.extendedDays > 0 && `(+${rental.extendedDays} extended)`}
                </span>
                <span className="text-[10px] text-gray-400 block">
                  Return Due: <strong className="text-white">{rental.endDate}</strong>
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-neutral-950 border border-neutral-800 space-y-1">
                <span className="text-gray-400 block">Rented Game Discs:</span>
                {rental.selectedGames && rental.selectedGames.length > 0 ? (
                  <div className="space-y-1 pt-1">
                    {rental.selectedGames.map((game: string) => (
                      <div key={game} className="font-bold text-white flex items-center gap-1.5">
                        <Disc className="w-3.5 h-3.5 text-brand-yellow" />
                        <span>{game}</span>
                      </div>
                    ))}
                    <span className="text-[10px] text-brand-yellow block pt-0.5">
                      {rental.selectedGames.length} CD(s) @ ₹100/day per CD
                    </span>
                  </div>
                ) : (
                  <span className="text-gray-500 italic">No game CDs rented</span>
                )}
              </div>

              <div className="p-4 rounded-2xl bg-neutral-950 border border-neutral-800 space-y-1">
                <span className="text-gray-400 block">DualSense Controllers:</span>
                <span className="font-bold text-white text-sm">
                  {rental.extraControllers ? "2 Controllers (Multiplayer)" : "1 Controller"}
                </span>
                <span className="text-[10px] text-gray-400 block">
                  Cables: HDMI 2.1, Power, Type-C Charging
                </span>
              </div>
            </div>

            {/* Video Inspection Section */}
            <div className="p-5 rounded-2xl bg-blue-950/30 border border-blue-900/40 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-bold text-blue-300">
                  <Video className="w-4 h-4 text-blue-400" />
                  <span>Pre-Delivery Video Proof Status</span>
                </div>
                <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-blue-500/20 text-blue-400">
                  {rental.preDeliveryVideoUrl ? "Verified & Uploaded" : "Pending Handover"}
                </span>
              </div>

              <p className="text-xs text-gray-300 leading-relaxed">
                {rental.preDeliveryVideoUrl ? (
                  <>
                    A complete video showing working condition, warranty seals, and controllers has been recorded.
                    <a
                      href={rental.preDeliveryVideoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-brand-yellow underline ml-1 font-bold inline-block"
                    >
                      View Setup Video Recording →
                    </a>
                  </>
                ) : (
                  "Our delivery agent will record the setup and working test video in your presence during doorstep handover."
                )}
              </p>
            </div>
          </div>

          {/* PAYMENT & SUMMARY CARD */}
          <div className="bg-neutral-900/90 border border-neutral-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-lg">
            <h2 className="text-base font-black text-white flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-brand-yellow" /> Payment & Delivery Info
            </h2>

            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between text-gray-300">
                <span>Payment Mode:</span>
                <span className="font-bold text-white">Pay & Use on Handover</span>
              </div>

              <div className="flex items-center justify-between text-gray-300">
                <span>Payment Status:</span>
                <span className={`font-black px-2 py-0.5 rounded text-[10px] ${
                  rental.paymentStatus === "PAID" ? "bg-green-500/20 text-green-400" : "bg-brand-yellow/20 text-brand-yellow"
                }`}>
                  {rental.paymentStatus}
                </span>
              </div>

              <div className="flex items-center justify-between text-gray-300">
                <span>Assigned Agent:</span>
                <span className="font-bold text-white">{rental.assignedAgentName || "Dispatching Soon"}</span>
              </div>

              <div className="pt-3 border-t border-neutral-800">
                <span className="text-gray-400 block text-[11px] mb-1">Delivery Address:</span>
                <p className="text-gray-200 text-xs leading-relaxed">
                  {rental.deliveryAddress}, PIN: {rental.pincode}
                </p>
              </div>

              <div className="pt-3 border-t border-neutral-800 flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-gray-300 block">Total Rental Fee</span>
                  <span className="text-[10px] text-gray-500">{totalDaysCombined} Days Total</span>
                </div>
                <div className="text-right">
                  <span className="text-2xl font-black text-brand-yellow">
                    ₹{rental.totalAmount.toLocaleString("en-IN")}
                  </span>
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-neutral-800">
              <Link
                href={`/rent/inspect/${rental.rentalNumber}`}
                className="w-full py-3 rounded-xl bg-neutral-950 border border-neutral-800 text-center text-xs font-bold text-brand-yellow hover:bg-neutral-800 flex items-center justify-center gap-2 transition-colors"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>View Signed Undertaking & Form</span>
              </Link>
            </div>
          </div>
        </div>
      </main>

      {/* EXTEND PLAN MODAL */}
      {extendModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-neutral-900 border border-neutral-800 rounded-3xl max-w-md w-full p-6 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
              <h3 className="text-base font-black text-white flex items-center gap-2">
                <Plus className="w-5 h-5 text-brand-yellow" /> Extend PS5 Rental Plan
              </h3>
              <button
                onClick={() => setExtendModalOpen(false)}
                className="text-gray-400 hover:text-white text-xs font-bold"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-gray-300 leading-relaxed">
              Want to keep the PlayStation 5 longer? Choose additional days. Your return date will be automatically updated!
            </p>

            {/* Additional Days Selector */}
            <div className="p-4 rounded-2xl bg-neutral-950 border border-neutral-800 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-white block">Additional Days</span>
                <span className="text-[10px] text-gray-400">
                  Rate: ₹{extensionCostPerDay}/day {rental.rentalPackage === "CONSOLE_CD" ? `(Console + 1st CD ₹499${extraCDs > 0 ? ` + ${extraCDs} extra CD ₹${extraCDs * 100}` : ""})` : ""}
                </span>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  disabled={additionalDays <= 1}
                  onClick={() => setAdditionalDays(Math.max(1, additionalDays - 1))}
                  className="w-8 h-8 rounded-lg bg-neutral-800 text-white flex items-center justify-center font-bold disabled:opacity-40"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="text-lg font-black text-white w-8 text-center">{additionalDays}</span>
                <button
                  type="button"
                  onClick={() => setAdditionalDays(additionalDays + 1)}
                  className="w-8 h-8 rounded-lg bg-neutral-800 text-white flex items-center justify-center font-bold"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Extension Calculation */}
            <div className="p-3.5 rounded-xl bg-neutral-950 border border-neutral-800 text-xs space-y-1.5">
              <div className="flex justify-between text-gray-300">
                <span>Additional Cost:</span>
                <span className="font-bold text-white">₹{addedCost.toLocaleString("en-IN")}</span>
              </div>
              <div className="flex justify-between text-gray-300">
                <span>New Total Days:</span>
                <span className="font-bold text-white">{totalDaysCombined + additionalDays} Days</span>
              </div>
            </div>

            {extendSuccess && (
              <div className="p-3 rounded-xl bg-green-950 border border-green-800 text-green-300 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-400 shrink-0" />
                <span>{extendSuccess}</span>
              </div>
            )}

            {error && (
              <div className="p-3 rounded-xl bg-red-950 border border-red-800 text-red-300 text-xs">
                {error}
              </div>
            )}

            <button
              onClick={handleExtend}
              disabled={extending}
              className="w-full py-3.5 rounded-xl bg-brand-yellow text-black font-black text-xs hover:bg-yellow-400 shadow-yellowGlow disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {extending ? "Extending Plan..." : `Confirm Extension (+₹${addedCost})`}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
