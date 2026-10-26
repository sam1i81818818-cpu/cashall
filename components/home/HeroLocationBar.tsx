"use client";

import React, { useState, useEffect } from "react";
import { MapPin, ChevronDown, Check } from "lucide-react";
import { LocationModal } from "@/components/common/LocationModal";

const SERVICEABLE_STATES = [
  { state: "West Bengal", city: "Kolkata", tag: "2-4 Hr Doorstep" },
  { state: "Uttar Pradesh", city: "Gorakhpur", tag: "Doorstep Hub" },
  { state: "Bihar", city: "Patna", tag: "Doorstep Hub" },
];

export function HeroLocationBar() {
  const [selectedLoc, setSelectedLoc] = useState<{ city: string; state: string } | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    const updateLoc = () => {
      try {
        const stored = localStorage.getItem("cashall_location");
        if (stored) {
          setSelectedLoc(JSON.parse(stored));
        } else {
          setSelectedLoc(null);
        }
      } catch (e) {}
    };

    updateLoc();
    window.addEventListener("cashall_location_updated", updateLoc);
    return () => window.removeEventListener("cashall_location_updated", updateLoc);
  }, []);

  const handleSelectQuickState = (item: { state: string; city: string }) => {
    const loc = { state: item.state, city: item.city, isServiceable: true };
    localStorage.setItem("cashall_location", JSON.stringify(loc));
    setSelectedLoc(loc);
    window.dispatchEvent(new Event("cashall_location_updated"));
  };

  return (
    <>
      <div className="pt-2 max-w-3xl mx-auto">
        <div className="p-3 sm:px-4 sm:py-3 rounded-2xl bg-neutral-900/60 border border-neutral-800 backdrop-blur-md shadow-xl flex flex-col sm:flex-row items-center justify-between gap-3 text-left">
          
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="w-8 h-8 rounded-xl bg-brand-yellow/15 flex items-center justify-center text-brand-yellow shrink-0 border border-brand-yellow/30">
              <MapPin className="w-4 h-4" />
            </div>
            <div>
              <div className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">
                Doorstep Resale Service Area
              </div>
              <div className="text-xs sm:text-sm font-bold text-white flex items-center gap-1.5">
                <span>{selectedLoc ? `${selectedLoc.state} (${selectedLoc.city})` : "Select Your State"}</span>
                {selectedLoc && (
                  <span className="text-[10px] bg-emerald-500/15 text-emerald-400 font-semibold px-1.5 py-0.5 rounded-full border border-emerald-500/30">
                    Live
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* SERVICEABLE STATE PILLS */}
          <div className="flex items-center gap-1.5 flex-wrap justify-center sm:justify-end w-full sm:w-auto">
            {SERVICEABLE_STATES.map((item) => {
              const isSelected = selectedLoc?.state?.toLowerCase() === item.state.toLowerCase();
              return (
                <button
                  key={item.state}
                  type="button"
                  onClick={() => handleSelectQuickState(item)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                    isSelected
                      ? "bg-brand-yellow text-brand-black shadow-sm font-extrabold"
                      : "bg-white/5 text-neutral-300 hover:bg-white/10 hover:text-white border border-white/10"
                  }`}
                >
                  {isSelected && <Check className="w-3.5 h-3.5 text-brand-black" />}
                  <span>{item.state}</span>
                </button>
              );
            })}

            <button
              type="button"
              onClick={() => setModalOpen(true)}
              className="px-3 py-1.5 rounded-xl text-xs font-bold bg-white/5 hover:bg-brand-yellow hover:text-brand-black text-brand-yellow border border-brand-yellow/30 transition-all flex items-center gap-1"
            >
              <span>{selectedLoc ? "Change" : "Select City"}</span>
              <ChevronDown className="w-3 h-3" />
            </button>
          </div>

        </div>
      </div>

      <LocationModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        selectedLocation={selectedLoc}
        onSelectLocation={(loc) => {
          localStorage.setItem("cashall_location", JSON.stringify(loc));
          setSelectedLoc(loc);
          window.dispatchEvent(new Event("cashall_location_updated"));
        }}
      />
    </>
  );
}
