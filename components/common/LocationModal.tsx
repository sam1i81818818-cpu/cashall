"use client";

import React, { useState, useEffect } from "react";
import {
  MapPin,
  X,
  Search,
  Check,
  Building2,
  AlertCircle,
  Sparkles,
  ChevronRight,
  ArrowRight,
  ShieldCheck,
  Truck,
  ArrowLeft,
} from "lucide-react";
import {
  SERVICEABLE_DISTRICTS,
  getPincodeDetails,
} from "@/lib/serviceability";

interface LocationModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedLocation: { city: string; state: string; isServiceable?: boolean } | null;
  onSelectLocation: (loc: { city: string; state: string; isServiceable?: boolean }) => void;
}

// Serviceable States with direct doorstep field fleets
interface ServiceableStateConfig {
  state: string;
  badge: string;
  districts: { name: string; tag: string; image: string }[];
  description: string;
  image: string;
}

const SERVICEABLE_STATES: ServiceableStateConfig[] = [
  {
    state: "West Bengal",
    badge: "Primary Hub • 2-4 Hr Doorstep",
    image: "/images/locations/kolkata.jpg",
    description: "Kolkata, Howrah, Hooghly, Barrackpore",
    districts: [
      { name: "Kolkata", tag: "Free Doorstep in 2-4 hrs", image: "/images/locations/kolkata.jpg" },
      { name: "Howrah", tag: "Express Doorstep Active", image: "/images/locations/howrah.jpg" },
      { name: "Hooghly", tag: "Doorstep Pickup Active", image: "/images/locations/hooghly.jpg" },
      { name: "Barrackpore", tag: "Doorstep Pickup Active", image: "/images/locations/barrackpore.jpg" },
    ],
  },
  {
    state: "Uttar Pradesh",
    badge: "Express Doorstep Hub",
    image: "/images/locations/gorakhpur.jpg",
    description: "Gorakhpur & Ballia Express Pickup Hubs",
    districts: [
      { name: "Gorakhpur", tag: "Express Doorstep", image: "/images/locations/gorakhpur.jpg" },
      { name: "Ballia", tag: "Doorstep Pickup Hub", image: "/images/locations/gorakhpur.jpg" },
    ],
  },
  {
    state: "Bihar",
    badge: "Doorstep Service Active",
    image: "/images/locations/kolkata.jpg",
    description: "Patna Central & Surrounding Districts",
    districts: [
      { name: "Patna", tag: "Express Doorstep", image: "/images/locations/kolkata.jpg" },
    ],
  },
  {
    state: "Jharkhand",
    badge: "Doorstep Pickup Active",
    image: "/images/locations/howrah.jpg",
    description: "Ranchi Urban Corridors & City Hubs",
    districts: [
      { name: "Ranchi", tag: "Express Doorstep", image: "/images/locations/howrah.jpg" },
    ],
  },
];

export function LocationModal({
  isOpen,
  onClose,
  selectedLocation,
  onSelectLocation,
}: LocationModalProps) {
  const [search, setSearch] = useState("");
  const [selectedStateForDistricts, setSelectedStateForDistricts] = useState<ServiceableStateConfig | null>(null);

  // Auto-expand state if already selected
  useEffect(() => {
    if (selectedLocation?.state) {
      const match = SERVICEABLE_STATES.find(
        (s) => s.state.toLowerCase() === selectedLocation.state.toLowerCase()
      );
      if (match && !selectedLocation.city) {
        setSelectedStateForDistricts(match);
      }
    }
  }, [selectedLocation]);

  if (!isOpen) return null;

  const query = search.trim().toLowerCase();
  const isPinQuery = /^\d{6}$/.test(query);
  const pinMatch = isPinQuery ? getPincodeDetails(query) : null;

  const handleSelect = (city: string, state: string, isServiceable: boolean = true) => {
    onSelectLocation({ city, state, isServiceable });
    onClose();
  };

  // Filter based on search query across serviceable states & districts
  const filteredStates = SERVICEABLE_STATES.filter((s) => {
    if (!query) return true;
    if (s.state.toLowerCase().includes(query)) return true;
    if (s.districts.some((d) => d.name.toLowerCase().includes(query))) return true;
    return false;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-3 sm:p-4 animate-fadeIn">
      <div className="bg-[#111111] border-2 border-brand-yellow/40 rounded-3xl w-full max-w-xl overflow-hidden shadow-2xl flex flex-col max-h-[92vh] text-white">
        
        {/* MODAL HEADER */}
        <div className="p-5 sm:p-6 border-b border-neutral-800 bg-neutral-900/95 flex items-start justify-between relative">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-brand-yellow/15 flex items-center justify-center border border-brand-yellow/40 text-brand-yellow shrink-0 shadow-sm">
              <MapPin className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-lg sm:text-xl font-black text-white leading-tight">
                  {selectedStateForDistricts
                    ? `Select Your City in ${selectedStateForDistricts.state}`
                    : "Select Your State / अपना राज्य चुनें"}
                </h3>
                <span className="text-[10px] font-extrabold uppercase tracking-wider bg-brand-yellow text-brand-black px-2.5 py-0.5 rounded-full font-mono">
                  Doorstep Service Active
                </span>
              </div>
              <p className="text-xs text-gray-300 mt-1">
                {selectedStateForDistricts
                  ? `Choose your city for free doorstep pickup and instant cash payout.`
                  : "Choose from our active doorstep service areas for instant cash payouts."}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full text-gray-400 hover:text-white hover:bg-neutral-800 transition-colors shrink-0"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* BACK BUTTON IF IN DISTRICT SELECTION */}
        {selectedStateForDistricts && (
          <div className="px-5 py-2.5 bg-neutral-900/60 border-b border-neutral-800 flex items-center justify-between">
            <button
              onClick={() => setSelectedStateForDistricts(null)}
              className="flex items-center gap-1.5 text-xs font-bold text-brand-yellow hover:text-brand-yellowHover transition-colors"
            >
              <ArrowLeft className="w-4 h-4" /> &larr; Back to Serviceable States
            </button>
            <button
              onClick={() => handleSelect(selectedStateForDistricts.districts[0].name, selectedStateForDistricts.state, true)}
              className="text-xs font-bold text-gray-300 hover:text-white underline"
            >
              Select All {selectedStateForDistricts.state}
            </button>
          </div>
        )}

        {/* SEARCH BAR (PIN CODE OR CITY / STATE) */}
        {!selectedStateForDistricts && (
          <div className="p-4 border-b border-neutral-800 bg-[#161616]">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-brand-yellow" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search state, city or enter 6-digit PIN code (e.g. 700001, 273001, 800003)..."
                className="w-full pl-10 pr-16 py-3 text-xs sm:text-sm font-semibold bg-neutral-900 border border-neutral-700 text-white rounded-xl focus:outline-none focus:border-brand-yellow transition-all placeholder:text-gray-500"
                autoFocus
              />
              {search && (
                <button
                  onClick={() => setSearch("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white text-xs font-bold px-2 py-1 bg-neutral-800 rounded-md"
                >
                  Clear
                </button>
              )}
            </div>
          </div>
        )}

        {/* PINCODE MATCH BANNER */}
        {isPinQuery && !selectedStateForDistricts && (
          <div className="px-5 pt-3">
            {pinMatch ? (
              <div className="bg-emerald-500/10 border-2 border-emerald-500/50 rounded-2xl p-4 flex items-center justify-between animate-fadeIn">
                <div>
                  <div className="flex items-center gap-1.5 text-xs font-black text-emerald-400 uppercase tracking-wide">
                    <Check className="w-4 h-4" /> PIN Code {query} Serviceable!
                  </div>
                  <div className="text-sm font-black text-white mt-0.5">
                    {pinMatch.city}{pinMatch.locality ? ` (${pinMatch.locality})` : ""}, {pinMatch.state}
                  </div>
                  <div className="text-[11px] text-gray-400 mt-0.5">Free doorstep pickup available within 2-4 hours</div>
                </div>
                <button
                  type="button"
                  onClick={() => handleSelect(pinMatch.city, pinMatch.state, true)}
                  className="px-4 py-2 bg-brand-yellow text-brand-black text-xs font-black rounded-xl hover:bg-brand-yellowHover transition-all shadow-md shrink-0 flex items-center gap-1.5"
                >
                  Select & Proceed <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-3.5 text-xs text-amber-300 flex items-start gap-2.5 animate-fadeIn">
                <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white block font-bold">PIN Code {query} is outside our direct pickup hubs</strong>
                  <span>Doorstep pickup is currently active in West Bengal, Uttar Pradesh, and Bihar. Please choose from our active service areas below.</span>
                </div>
              </div>
            )}
          </div>
        )}

        {/* CONTENT LIST */}
        <div className="p-4 sm:p-5 flex-grow overflow-y-auto space-y-3.5 custom-scrollbar">

          {/* IF STATE CLICKED: DISTRICT SELECTION */}
          {selectedStateForDistricts ? (
            <div className="space-y-3 animate-fadeIn">
              <div className="text-xs font-bold text-gray-400 uppercase tracking-wider px-1 flex items-center justify-between">
                <span>Select Your District / City in {selectedStateForDistricts.state}</span>
                <span className="text-brand-yellow text-[11px] font-extrabold flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" /> 100% Free Doorstep Pickup
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {selectedStateForDistricts.districts.map((dist) => {
                  const isDistSelected =
                    selectedLocation?.city?.toLowerCase() === dist.name.toLowerCase() &&
                    selectedLocation?.state?.toLowerCase() === selectedStateForDistricts.state.toLowerCase();

                  return (
                    <button
                      key={dist.name}
                      type="button"
                      onClick={() => handleSelect(dist.name, selectedStateForDistricts.state, true)}
                      className={`p-3.5 rounded-2xl border text-left flex items-center justify-between gap-3 transition-all ${
                        isDistSelected
                          ? "bg-brand-yellow text-brand-black border-brand-yellow font-black shadow-lg"
                          : "bg-neutral-900 hover:bg-neutral-800 border-neutral-800 text-gray-200 hover:border-brand-yellow/60"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={dist.image}
                          alt={dist.name}
                          className="w-12 h-12 rounded-xl object-cover shrink-0 border border-white/10"
                        />
                        <div>
                          <div className={`text-sm font-extrabold ${isDistSelected ? "text-brand-black" : "text-white"}`}>
                            {dist.name}
                          </div>
                          <div className={`text-xs mt-0.5 ${isDistSelected ? "text-neutral-800" : "text-gray-400"}`}>
                            {dist.tag}
                          </div>
                        </div>
                      </div>
                      {isDistSelected ? (
                        <Check className="w-5 h-5 text-brand-black shrink-0" />
                      ) : (
                        <div className="w-7 h-7 rounded-full bg-neutral-800 flex items-center justify-center shrink-0 text-brand-yellow">
                          <ArrowRight className="w-3.5 h-3.5" />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* OPTION TO SELECT WHOLE STATE */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => handleSelect(selectedStateForDistricts.districts[0].name, selectedStateForDistricts.state, true)}
                  className="w-full py-3 px-4 rounded-xl border border-neutral-700 bg-neutral-900/60 hover:bg-neutral-800 text-xs font-bold text-gray-300 hover:text-white flex items-center justify-center gap-2"
                >
                  <MapPin className="w-4 h-4 text-brand-yellow" />
                  Select &quot;{selectedStateForDistricts.state} (General)&quot;
                </button>
              </div>
            </div>
          ) : (
            /* SERVICEABLE STATES LIST (ONLY SERVICEABLE AREAS) */
            <div className="space-y-3">
              <div className="text-xs font-black text-brand-yellow uppercase tracking-wider px-1 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <Truck className="w-3.5 h-3.5" /> Active Serviceable States ({SERVICEABLE_STATES.length})
                </span>
                <span className="text-[10px] text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                  Doorstep Active
                </span>
              </div>

              <div className="space-y-2.5">
                {filteredStates.map((stConfig) => {
                  const isStateSelected = selectedLocation?.state?.toLowerCase() === stConfig.state.toLowerCase();

                  return (
                    <div
                      key={stConfig.state}
                      onClick={() => setSelectedStateForDistricts(stConfig)}
                      className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                        isStateSelected
                          ? "bg-brand-yellow/10 border-brand-yellow shadow-yellowGlow/20"
                          : "bg-neutral-900 hover:bg-neutral-850 border-neutral-800 hover:border-brand-yellow/50"
                      }`}
                    >
                      <div className="flex items-center gap-3.5">
                        <img
                          src={stConfig.image}
                          alt={stConfig.state}
                          className="w-12 h-12 rounded-xl object-cover shrink-0 border border-neutral-700"
                        />
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-base font-black text-white">{stConfig.state}</span>
                            <span className="text-[10px] font-bold bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full border border-emerald-500/30">
                              Active
                            </span>
                          </div>
                          <div className="text-xs text-gray-300 font-medium mt-0.5">
                            {stConfig.description}
                          </div>
                          <div className="text-[11px] text-gray-400 mt-1 flex items-center gap-1.5 flex-wrap">
                            {stConfig.districts.map((d) => (
                              <span key={d.name} className="bg-neutral-800 px-2 py-0.5 rounded text-[10px] font-semibold text-gray-300">
                                {d.name}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedStateForDistricts(stConfig);
                          }}
                          className="px-3 py-1.5 bg-neutral-800 hover:bg-brand-yellow hover:text-brand-black text-xs font-bold text-brand-yellow rounded-xl border border-neutral-700 transition-all flex items-center gap-1"
                        >
                          <span>Select</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

        </div>

        {/* MODAL FOOTER */}
        <div className="p-4 border-t border-neutral-800 bg-neutral-900/95 flex items-center justify-between text-xs text-gray-400">
          <div className="flex items-center gap-1.5">
            <span className="text-gray-500">Current Location:</span>
            <strong className="text-brand-yellow font-bold">
              {selectedLocation
                ? `${selectedLocation.city}, ${selectedLocation.state}`
                : "None Selected"}
            </strong>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-[11px] text-gray-400 hover:text-white underline underline-offset-2"
          >
            Browse without selecting &rarr;
          </button>
        </div>

      </div>
    </div>
  );
}
