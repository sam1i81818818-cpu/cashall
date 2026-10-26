"use client";

import React, { useState } from "react";
import { Calendar, Clock, X, CheckCircle2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/Button";
import {
  getRecordedPickupDate,
  getPickupDatePresets,
  formatPickupDateTimeSlot,
  getAvailableTimeSlotsForDate,
  getMinCalendarDateISO,
  getDefaultPickupDate,
} from "@/lib/utils/pickup-date";

interface RescheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
  orderId?: string;
  orderNumber?: string;
  currentDate?: string;
  currentTimeSlot?: string;
  actorRole: "CUSTOMER" | "ADMIN" | "SUPPORT" | "PARTNER";
  actorName?: string;
  allowInputOrder?: boolean;
  onSuccess: (newDate: string, newSlot: string) => void;
}

export function RescheduleModal({
  isOpen,
  onClose,
  orderId = "",
  orderNumber = "",
  currentDate,
  currentTimeSlot,
  actorRole,
  actorName,
  allowInputOrder = false,
  onSuccess,
}: RescheduleModalProps) {
  const [inputOrderNumber, setInputOrderNumber] = useState(orderNumber || orderId || "");
  const [selectedDate, setSelectedDate] = useState(() => getRecordedPickupDate(currentDate || getDefaultPickupDate()));
  const [isCustomDate, setIsCustomDate] = useState(false);
  const [customDateInput, setCustomDateInput] = useState("");
  const [selectedSlot, setSelectedSlot] = useState(() => {
    const slots = getAvailableTimeSlotsForDate(currentDate || getDefaultPickupDate());
    if (currentTimeSlot && slots.includes(currentTimeSlot)) return currentTimeSlot;
    return slots[0] || "10 AM - 1 PM";
  });
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  React.useEffect(() => {
    if (orderNumber || orderId) {
      setInputOrderNumber(orderNumber || orderId || "");
    }
  }, [orderNumber, orderId]);

  // Keep selected slot valid when date changes
  React.useEffect(() => {
    const valid = getAvailableTimeSlotsForDate(selectedDate);
    if (valid.length > 0 && !valid.includes(selectedSlot)) {
      setSelectedSlot(valid[0]);
    }
  }, [selectedDate, selectedSlot]);

  if (!isOpen) return null;

  const minDateISO = getMinCalendarDateISO();

  const handleCustomDateChange = (val: string) => {
    setCustomDateInput(val);
    if (!val) return;
    const d = new Date(val);
    if (!isNaN(d.getTime())) {
      setSelectedDate(getRecordedPickupDate(d));
    }
  };

  const handleReschedule = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDate) {
      setError("Please select a valid reschedule date.");
      return;
    }

    const targetOrder = (allowInputOrder ? inputOrderNumber : (orderId || orderNumber || inputOrderNumber)).replace(/^#/, "").trim();
    if (!targetOrder) {
      setError("Please enter a valid Order Number (e.g. CA56029).");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`/api/v1/orders/${encodeURIComponent(targetOrder)}/reschedule`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          pickupDate: selectedDate,
          pickupTimeSlot: selectedSlot,
          reason: reason || `${actorRole} requested visit reschedule`,
          actorRole,
          actorName: actorName || `${actorRole} Operator`,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || data.message || "Failed to reschedule order.");
      }

      setSuccessMsg(`Order #${targetOrder} successfully rescheduled for ${selectedDate}!`);
      setTimeout(() => {
        onSuccess(selectedDate, selectedSlot);
        onClose();
      }, 1000);
    } catch (err: any) {
      setError(err.message || "Could not reschedule order. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-lg rounded-3xl p-6 sm:p-7 shadow-2xl border border-brand-border relative space-y-5 text-left">
        {/* Close Button */}
        <button
          onClick={onClose}
          disabled={loading}
          className="absolute top-5 right-5 p-2 text-gray-400 hover:text-black rounded-full hover:bg-gray-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 border-b border-gray-100 pb-4">
          <div className="w-11 h-11 rounded-2xl bg-brand-yellow/20 text-brand-black flex items-center justify-center font-bold shrink-0">
            <Calendar className="w-6 h-6 text-brand-black" />
          </div>
          <div>
            <h3 className="text-lg font-black text-brand-black">
              Reschedule Pickup Visit
            </h3>
            <p className="text-xs text-brand-muted">
              {inputOrderNumber ? (
                <>Order <strong className="text-black font-extrabold">#{inputOrderNumber}</strong> • Current: {formatPickupDateTimeSlot(currentDate, currentTimeSlot)}</>
              ) : (
                <>Select new doorstep pickup date and time slot</>
              )}
            </p>
          </div>
        </div>

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-2xl text-xs text-red-700 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {successMsg && (
          <div className="p-3 bg-green-50 border border-green-200 rounded-2xl text-xs text-green-700 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {allowInputOrder && (
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-700">
              Order Number <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="e.g. CA56029"
              value={inputOrderNumber}
              onChange={(e) => setInputOrderNumber(e.target.value.toUpperCase().trim())}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-xs font-mono font-bold text-black focus:outline-none focus:border-brand-yellow"
            />
          </div>
        )}

        <form onSubmit={handleReschedule} className="space-y-4">
          {/* DATE SELECTION */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-xs font-bold text-brand-black">
                Select New Pickup Date
              </label>
              <span className="text-xs font-bold text-brand-blue bg-brand-blue/10 px-2.5 py-0.5 rounded-full">
                {selectedDate}
              </span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {getPickupDatePresets().map((preset) => {
                const isSelected = !isCustomDate && (selectedDate === preset.value || selectedDate.toLowerCase().includes(preset.key.toLowerCase()));
                return (
                  <button
                    type="button"
                    key={preset.key}
                    onClick={() => {
                      setSelectedDate(preset.value);
                      setIsCustomDate(false);
                    }}
                    className={`p-2.5 sm:p-3 rounded-xl border text-xs font-bold text-center transition-all flex flex-col items-center justify-center gap-0.5 ${
                      isSelected
                        ? "border-brand-yellow bg-brand-yellow/20 text-brand-black shadow-sm font-extrabold ring-1 ring-brand-yellow/50"
                        : "border-brand-border bg-white text-gray-600 hover:border-gray-300"
                    }`}
                  >
                    <span className="font-extrabold">{preset.label}</span>
                    <span className={`text-[10px] ${isSelected ? "text-brand-black/80 font-semibold" : "text-gray-400"}`}>
                      {preset.subLabel}
                    </span>
                  </button>
                );
              })}
              <button
                type="button"
                onClick={() => setIsCustomDate(true)}
                className={`p-2.5 sm:p-3 rounded-xl border text-xs font-bold text-center transition-all flex flex-col items-center justify-center gap-0.5 ${
                  isCustomDate
                    ? "border-brand-yellow bg-brand-yellow/20 text-brand-black shadow-sm font-extrabold ring-1 ring-brand-yellow/50"
                    : "border-brand-border bg-white text-gray-600 hover:border-gray-300"
                }`}
              >
                <div className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-brand-yellow" />
                  <span className="font-extrabold">Custom Date</span>
                </div>
                <span className={`text-[10px] ${isCustomDate ? "text-brand-black/80 font-semibold" : "text-gray-400"}`}>
                  Choose Date
                </span>
              </button>
            </div>

            {isCustomDate && (
              <div className="mt-3 p-3 bg-brand-bg rounded-2xl border border-brand-border animate-in fade-in duration-200">
                <label className="block text-[11px] font-bold text-gray-600 mb-1.5">
                  Pick Specific Calendar Date:
                </label>
                <input
                  type="date"
                  min={minDateISO}
                  value={customDateInput}
                  onChange={(e) => handleCustomDateChange(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-white border border-brand-border rounded-xl text-xs font-bold text-brand-black focus:outline-none focus:border-brand-yellow shadow-sm cursor-pointer"
                />
              </div>
            )}
          </div>

          {/* TIME WINDOW */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-xs font-bold text-brand-black">
                Select Time Window
              </label>
              {getAvailableTimeSlotsForDate(selectedDate).length > 0 && (
                <span className="text-[11px] text-gray-500 font-semibold">
                  {getAvailableTimeSlotsForDate(selectedDate).length} slot{getAvailableTimeSlotsForDate(selectedDate).length > 1 ? "s" : ""} available
                </span>
              )}
            </div>
            {getAvailableTimeSlotsForDate(selectedDate).length > 0 ? (
              <div className={`grid gap-2 ${
                getAvailableTimeSlotsForDate(selectedDate).length === 1
                  ? "grid-cols-1"
                  : getAvailableTimeSlotsForDate(selectedDate).length === 2
                  ? "grid-cols-2"
                  : "grid-cols-3"
              }`}>
                {getAvailableTimeSlotsForDate(selectedDate).map((slot) => (
                  <button
                    type="button"
                    key={slot}
                    onClick={() => setSelectedSlot(slot)}
                    className={`p-3 rounded-xl border text-xs font-bold text-center transition-all ${
                      selectedSlot === slot
                        ? "border-brand-yellow bg-brand-yellow/20 text-brand-black shadow-sm font-extrabold ring-1 ring-brand-yellow/50"
                        : "border-brand-border bg-white text-gray-600 hover:border-gray-300"
                    }`}
                  >
                    {slot}
                  </button>
                ))}
              </div>
            ) : (
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-center text-xs text-amber-900 font-bold">
                ⚠️ All doorstep pickup slots for today are closed. Please select Tomorrow or another upcoming date above.
              </div>
            )}
          </div>

          {/* REASON / NOTES */}
          <div>
            <label className="block text-xs font-bold text-brand-black mb-1.5">
              Reason / Special Instructions (Optional)
            </label>
            <input
              type="text"
              placeholder="e.g. Customer requested evening pickup, Out of town until Friday"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-gray-50 border border-brand-border rounded-xl text-xs text-brand-black focus:outline-none focus:border-brand-yellow placeholder:text-gray-400"
            />
          </div>

          {/* SUBMIT BUTTONS */}
          <div className="pt-2 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-5 py-2.5 rounded-xl border border-gray-200 text-xs font-bold text-gray-600 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <Button
              type="submit"
              variant="primary"
              size="md"
              disabled={loading}
              className="font-black text-xs px-6 py-2.5 shadow-yellowGlow gap-2"
            >
              <Clock className="w-4 h-4" />
              <span>{loading ? "Updating Date..." : "CONFIRM RESCHEDULE"}</span>
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
