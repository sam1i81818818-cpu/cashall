"use client";

import React, { useState, useEffect } from "react";
import { Volume2, VolumeX, Music, Bell } from "lucide-react";
import {
  isSoundAlertEnabled,
  setSoundAlertEnabled,
  testMelodiousChime,
} from "@/lib/utils/sound";

interface SoundControlBadgeProps {
  className?: string;
  compact?: boolean;
}

export function SoundControlBadge({ className = "", compact = false }: SoundControlBadgeProps) {
  const [enabled, setEnabled] = useState(true);
  const [testing, setTesting] = useState(false);

  useEffect(() => {
    setEnabled(isSoundAlertEnabled());
  }, []);

  const handleToggle = () => {
    const next = !enabled;
    setEnabled(next);
    setSoundAlertEnabled(next);
    if (next) {
      // Play brief melodious chime on enable
      testMelodiousChime("update");
    }
  };

  const handleTest = (e: React.MouseEvent) => {
    e.stopPropagation();
    setTesting(true);
    testMelodiousChime("new_order");
    setTimeout(() => setTesting(false), 1200);
  };

  return (
    <div
      className={`inline-flex items-center gap-1.5 bg-neutral-900/90 border border-neutral-700/80 rounded-full px-2.5 py-1 text-xs shadow-sm backdrop-blur-md transition-all ${className}`}
    >
      <button
        onClick={handleToggle}
        type="button"
        title={enabled ? "Click to Mute Sound Alerts" : "Click to Enable Melodious Sound Alerts"}
        className={`flex items-center gap-1.5 font-semibold transition-colors ${
          enabled ? "text-emerald-400 hover:text-emerald-300" : "text-neutral-400 hover:text-neutral-200"
        }`}
      >
        <span className="relative flex h-2 w-2">
          {enabled && (
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          )}
          <span
            className={`relative inline-flex rounded-full h-2 w-2 ${
              enabled ? "bg-emerald-500" : "bg-neutral-500"
            }`}
          ></span>
        </span>
        {enabled ? (
          <Volume2 className="w-3.5 h-3.5 text-emerald-400" />
        ) : (
          <VolumeX className="w-3.5 h-3.5 text-neutral-400" />
        )}
        <span className="text-[11px] font-bold">
          {enabled ? (compact ? "Sound ON" : "Soothing Alerts: ON") : (compact ? "Muted" : "Alerts: Muted")}
        </span>
      </button>

      {enabled && (
        <button
          onClick={handleTest}
          type="button"
          title="Play soothing sample chime"
          className={`flex items-center gap-1 px-1.5 py-0.5 rounded-md text-[10px] font-bold transition-all ${
            testing
              ? "bg-emerald-500/20 text-emerald-300 scale-95"
              : "bg-neutral-800 text-neutral-300 hover:bg-neutral-700 hover:text-white"
          }`}
        >
          <Music className={`w-3 h-3 ${testing ? "animate-bounce text-emerald-400" : "text-neutral-400"}`} />
          <span>{testing ? "Playing..." : "Test Chime"}</span>
        </button>
      )}
    </div>
  );
}
