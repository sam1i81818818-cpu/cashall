"use client";

import React from "react";
import { Bell, Sparkles, X, ChevronRight, CheckCircle2, ArrowRight } from "lucide-react";

export interface LiveUpdateNotification {
  id: string;
  type: "new_order" | "update" | "assignment";
  orderNumber: string;
  title: string;
  subtitle: string;
  details?: string;
  timestamp: string;
  onView?: () => void;
}

interface LiveUpdateToastProps {
  notifications: LiveUpdateNotification[];
  onDismiss: (id: string) => void;
}

export function LiveUpdateToast({ notifications, onDismiss }: LiveUpdateToastProps) {
  if (!notifications || notifications.length === 0) return null;

  return (
    <aside aria-label="Real-time Order Updates" className="fixed top-4 right-4 z-[9999] flex flex-col gap-2.5 max-w-sm w-full pointer-events-none sm:max-w-md">
      {notifications.slice(0, 3).map((item) => {
        const isNewOrder = item.type === "new_order";
        const isAssignment = item.type === "assignment";

        return (
          <div
            key={item.id}
            role="status"
            aria-live="polite"
            className="pointer-events-auto w-full bg-neutral-900/95 border-2 border-emerald-500/60 text-white rounded-2xl shadow-2xl shadow-emerald-950/50 backdrop-blur-xl p-3.5 transition-all duration-300 transform translate-y-0 opacity-100 animate-in slide-in-from-top-4"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-3">
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-md ${
                    isNewOrder
                      ? "bg-gradient-to-br from-emerald-500 to-green-600 text-black shadow-emerald-500/30"
                      : isAssignment
                      ? "bg-gradient-to-br from-amber-400 to-yellow-500 text-black shadow-amber-500/30"
                      : "bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-blue-500/30"
                  }`}
                >
                  {isNewOrder ? (
                    <Bell className="w-5 h-5 animate-bounce" />
                  ) : (
                    <Sparkles className="w-5 h-5" />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-black uppercase tracking-wider text-emerald-400">
                      {item.title}
                    </span>
                    <span className="bg-neutral-800 text-neutral-300 font-mono text-[11px] font-bold px-2 py-0.5 rounded-full border border-neutral-700">
                      #{item.orderNumber.replace(/^[#\s]+/, "")}
                    </span>
                    <span className="text-[10px] text-neutral-400 ml-auto">
                      {item.timestamp}
                    </span>
                  </div>

                  <p className="text-sm font-bold text-neutral-100 truncate mt-1">
                    {item.subtitle}
                  </p>

                  {item.details && (
                    <p className="text-xs text-neutral-400 line-clamp-2 mt-0.5">
                      {item.details}
                    </p>
                  )}

                  {item.onView && (
                    <button
                      onClick={() => {
                        item.onView?.();
                        onDismiss(item.id);
                      }}
                      className="mt-2.5 inline-flex items-center gap-1.5 text-xs font-extrabold text-emerald-400 hover:text-emerald-300 transition-colors bg-emerald-950/60 hover:bg-emerald-900/60 px-3 py-1 rounded-lg border border-emerald-800/80"
                    >
                      <span>View Order</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>

              <button
                onClick={() => onDismiss(item.id)}
                title="Dismiss"
                className="text-neutral-400 hover:text-white p-1 rounded-lg hover:bg-neutral-800 transition-colors shrink-0"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        );
      })}
    </aside>
  );
}
