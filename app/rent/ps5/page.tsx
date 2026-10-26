"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { formatAddress } from "@/lib/address";
import { cleanPhoneNumber, getSavedCustomerAddress, saveCustomerAddress } from "@/lib/utils/customer-storage";
import {
  Gamepad2,
  Disc,
  ShieldCheck,
  Calendar,
  Clock,
  MapPin,
  CheckCircle2,
  Video,
  FileText,
  AlertTriangle,
  Plus,
  Minus,
  Sparkles,
  ArrowRight,
  Info,
  Tv,
  Check,
  X,
  Lock,
} from "lucide-react";

interface GameCD {
  id: string;
  title: string;
  genre: string;
  rating: string;
  imageUrl: string;
}

const AVAILABLE_GAMES: GameCD[] = [
  {
    id: "gta5",
    title: "Grand Theft Auto V",
    genre: "Action / Open World",
    rating: "18+",
    imageUrl: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400&auto=format&fit=crop&q=60",
  },
  {
    id: "spiderman2",
    title: "Marvel's Spider-Man 2",
    genre: "Action / Superhero",
    rating: "16+",
    imageUrl: "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=400&auto=format&fit=crop&q=60",
  },
  {
    id: "fc24",
    title: "EA Sports FC 24",
    genre: "Sports / Football",
    rating: "3+",
    imageUrl: "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=400&auto=format&fit=crop&q=60",
  },
  {
    id: "gow_ragnarok",
    title: "God of War Ragnarök",
    genre: "Action / Mythology",
    rating: "18+",
    imageUrl: "https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=400&auto=format&fit=crop&q=60",
  },
  {
    id: "cricket24",
    title: "Cricket 24",
    genre: "Sports / Cricket",
    rating: "3+",
    imageUrl: "https://images.unsplash.com/photo-1531415074868-036b1c57e329?w=400&auto=format&fit=crop&q=60",
  },
  {
    id: "tekken8",
    title: "Tekken 8",
    genre: "Fighting / Arcade",
    rating: "16+",
    imageUrl: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=400&auto=format&fit=crop&q=60",
  },
  {
    id: "mortal_kombat_1",
    title: "Mortal Kombat 1",
    genre: "Fighting / Action",
    rating: "18+",
    imageUrl: "https://images.unsplash.com/photo-1579373903781-fd5c0c30c4cd?w=400&auto=format&fit=crop&q=60",
  },
  {
    id: "hogwarts_legacy",
    title: "Hogwarts Legacy",
    genre: "RPG / Fantasy",
    rating: "12+",
    imageUrl: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=400&auto=format&fit=crop&q=60",
  },
  {
    id: "call_of_duty_mw3",
    title: "Call of Duty: Modern Warfare III",
    genre: "Shooter / Military",
    rating: "18+",
    imageUrl: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400&auto=format&fit=crop&q=60",
  },
];

type RentalPackage = "CONSOLE_ONLY" | "CONSOLE_CD" | "CONSOLE_DIGITAL_ID";

export default function Ps5RentalPage() {
  const router = useRouter();

  // 3-Tier Rental Package Selection:
  // 1. CONSOLE_ONLY: ₹399/day (No CD, No Digital ID)
  // 2. CONSOLE_CD: ₹499/day (PS5 Disc Edition with Game CD included at ₹0 extra)
  // 3. CONSOLE_DIGITAL_ID: ₹599/day (PS5 with Digital ID 100+ games access with login ID/pass)
  const [rentalPackage, setRentalPackage] = useState<RentalPackage>("CONSOLE_ONLY");
  const [extraControllers, setExtraControllers] = useState(false);

  // Dates: Start Date (Delivery) and End Date (Return Pickup)
  const [startDate, setStartDate] = useState(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split("T")[0];
  });

  const [endDate, setEndDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 3); // 2 days default
    return d.toISOString().split("T")[0];
  });

  // Rental Duration: Minimum 1 day, up to N days
  const [days, setDays] = useState<number>(2);

  // Game CDs Selection (Included in ₹499 plan)
  const [selectedGames, setSelectedGames] = useState<string[]>(["gta5"]);

  // Customer & Delivery Info
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [pincode, setPincode] = useState("");
  const [timeSlot, setTimeSlot] = useState("10:00 AM - 01:00 PM");
  const [govtIdType, setGovtIdType] = useState("Aadhaar Card");
  const [govtIdNumber, setGovtIdNumber] = useState("");
  const [isPrefilled, setIsPrefilled] = useState(false);

  // Terms & Liability Modal
  const [termsModalOpen, setTermsModalOpen] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);

  // Submission State
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [userLocationState, setUserLocationState] = useState<string>("");

  // PRE-FILL CUSTOMER & ADDRESS DETAILS FROM PREVIOUS ORDERS/RENTALS
  React.useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const storedLoc = localStorage.getItem("cashall_location");
        if (storedLoc) {
          const parsed = JSON.parse(storedLoc);
          if (parsed?.state) setUserLocationState(parsed.state);
        }
      } catch {}

      const storedUser = localStorage.getItem("cashall_user");
      let currentCleanPhone = "";

      if (storedUser) {
        try {
          const u = JSON.parse(storedUser);
          if (u.name) setCustomerName(u.name);
          if (u.phone) {
            const clean = cleanPhoneNumber(u.phone);
            currentCleanPhone = clean;
            setCustomerPhone(clean || u.phone);
          }
          if (u.email) setCustomerEmail(u.email);
        } catch (e) {}
      }

      // Purge legacy un-scoped addresses to prevent cross-customer leakage
      localStorage.removeItem("cashall_saved_address");

      let didPrefill = false;

      // Only prefill previous address/rental details if customer is logged in
      if (currentCleanPhone && currentCleanPhone.length === 10) {
        // 1. Check user-scoped address storage
        const savedAddr = getSavedCustomerAddress(currentCleanPhone);
        if (savedAddr) {
          if (savedAddr.fullName) setCustomerName(savedAddr.fullName);
          if (savedAddr.email) setCustomerEmail(savedAddr.email);
          const fullAddr = [savedAddr.line1, savedAddr.line2, savedAddr.city, savedAddr.state].filter(Boolean).join(", ");
          if (fullAddr) setDeliveryAddress(fullAddr);
          if (savedAddr.pincode) setPincode(savedAddr.pincode);
          didPrefill = true;
        }

        // 2. Check user-scoped rental storage
        if (!didPrefill) {
          const storedRental = localStorage.getItem(`cashall_latest_rental_${currentCleanPhone}`) || localStorage.getItem("cashall_latest_rental");
          if (storedRental) {
            try {
              const r = JSON.parse(storedRental);
              const rPhone = cleanPhoneNumber(r.customerPhone);
              if (rPhone === currentCleanPhone) {
                if (r.customerName) setCustomerName(r.customerName);
                if (r.customerEmail) setCustomerEmail(r.customerEmail);
                if (r.deliveryAddress) setDeliveryAddress(r.deliveryAddress);
                if (r.pincode) setPincode(r.pincode);
                if (r.govtIdType) setGovtIdType(r.govtIdType);
                if (r.govtIdNumber) setGovtIdNumber(r.govtIdNumber);
                didPrefill = true;
              }
            } catch (e) {}
          }
        }
      } else {
        // GUEST: ensure fields are completely clean
        setCustomerName("");
        setCustomerPhone("");
        setCustomerEmail("");
        setDeliveryAddress("");
        setPincode("");
        setIsPrefilled(false);
      }

      if (didPrefill) {
        setIsPrefilled(true);
      }
    }
  }, []);

  // Handlers for Calendar Dates
  const handleStartDateChange = (newStart: string) => {
    setStartDate(newStart);
    if (!newStart) return;
    const start = new Date(newStart);
    const end = new Date(endDate);
    if (isNaN(start.getTime())) return;

    if (isNaN(end.getTime()) || end <= start) {
      const nextEnd = new Date(start);
      nextEnd.setDate(nextEnd.getDate() + days);
      setEndDate(nextEnd.toISOString().split("T")[0]);
    } else {
      const diffTime = end.getTime() - start.getTime();
      const diffDays = Math.max(1, Math.round(diffTime / (1000 * 60 * 60 * 24)));
      setDays(diffDays);
    }
  };

  const handleEndDateChange = (newEnd: string) => {
    setEndDate(newEnd);
    if (!newEnd) return;
    const start = new Date(startDate);
    const end = new Date(newEnd);
    if (isNaN(start.getTime()) || isNaN(end.getTime())) return;

    if (end <= start) {
      const nextEnd = new Date(start);
      nextEnd.setDate(nextEnd.getDate() + 1);
      setEndDate(nextEnd.toISOString().split("T")[0]);
      setDays(1);
    } else {
      const diffTime = end.getTime() - start.getTime();
      const diffDays = Math.max(1, Math.round(diffTime / (1000 * 60 * 60 * 24)));
      setDays(diffDays);
    }
  };

  const handleDaysPreset = (count: number) => {
    const validDays = Math.max(1, count);
    setDays(validDays);
    const start = new Date(startDate);
    if (!isNaN(start.getTime())) {
      const nextEnd = new Date(start);
      nextEnd.setDate(nextEnd.getDate() + validDays);
      setEndDate(nextEnd.toISOString().split("T")[0]);
    }
  };

  // Helper date formatter
  const formatDateDisplay = (dateStr: string) => {
    if (!dateStr) return "";
    try {
      const d = new Date(dateStr + "T00:00:00");
      if (isNaN(d.getTime())) return dateStr;
      return d.toLocaleDateString("en-IN", {
        weekday: "short",
        day: "numeric",
        month: "short",
      });
    } catch {
      return dateStr;
    }
  };

  // Dynamic Pricing Calculation:
  // CONSOLE_ONLY: ₹399/day
  // CONSOLE_CD: ₹499/day (1st Game CD included free! Extra CDs: ₹100/day each)
  // CONSOLE_DIGITAL_ID: ₹599/day (100+ Games Access)
  const baseDailyRate = rentalPackage === "CONSOLE_ONLY" ? 399 : rentalPackage === "CONSOLE_CD" ? 499 : 599;
  const extraCDs = rentalPackage === "CONSOLE_CD" ? Math.max(0, selectedGames.length - 1) : 0;
  const extraCDCostPerDay = extraCDs * 100;
  const effectiveDailyRate = baseDailyRate + extraCDCostPerDay;
  const totalAmount = days * effectiveDailyRate;

  const toggleGame = (gameId: string) => {
    if (rentalPackage !== "CONSOLE_CD") return;
    if (selectedGames.includes(gameId)) {
      if (selectedGames.length > 1) {
        setSelectedGames(selectedGames.filter((id) => id !== gameId));
      }
    } else {
      setSelectedGames([...selectedGames, gameId]);
    }
  };

  const handleBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!termsAccepted) {
      setTermsModalOpen(true);
      return;
    }

    if (!customerName || !customerPhone || !deliveryAddress || !pincode || !govtIdNumber) {
      setError("Please complete all required customer, delivery & full Govt ID fields.");
      return;
    }

    if (pincode && !/^(70|71|72|73|74)/.test(pincode.trim())) {
      setError("⚠️ PS5 Console Rental is currently available exclusively across Kolkata & West Bengal pincodes (700001–749999). For device resale, all states are supported.");
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      const res = await fetch("/api/v1/rentals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName,
          customerPhone,
          customerEmail,
          deliveryAddress,
          pincode,
          govtIdType,
          govtIdNumber,
          consoleModel: rentalPackage === "CONSOLE_CD" ? "PS5 Disc Edition" : "PS5 Console",
          rentalPackage,
          startDate,
          endDate,
          totalDays: days,
          cdCount: rentalPackage === "CONSOLE_CD" ? selectedGames.length : 0,
          cdRate: extraCDs > 0 ? 100 : 0,
          selectedGames: rentalPackage === "CONSOLE_CD" ? selectedGames.map((id) => AVAILABLE_GAMES.find((g) => g.id === id)?.title || id) : [],
          extraControllers,
        }),
      });

      const data = await res.json();
      if (data.success && data.rental) {
        // Save for auto-prefill on future rental or selling visits (strictly user-scoped)
        try {
          const cleanPhone = cleanPhoneNumber(customerPhone);
          const rentalObj = {
            customerName,
            customerPhone: cleanPhone || customerPhone,
            customerEmail,
            deliveryAddress,
            pincode,
            govtIdType,
            govtIdNumber,
          };
          if (cleanPhone) {
            localStorage.setItem(`cashall_latest_rental_${cleanPhone}`, JSON.stringify(rentalObj));
            saveCustomerAddress(cleanPhone, {
              fullName: customerName,
              phone: cleanPhone,
              email: customerEmail,
              line1: deliveryAddress,
              pincode,
            });
          }
          localStorage.setItem("cashall_latest_rental", JSON.stringify(rentalObj));
          localStorage.setItem("cashall_user", JSON.stringify({
            name: customerName,
            phone: cleanPhone || customerPhone,
            email: customerEmail,
          }));
          localStorage.removeItem("cashall_saved_address");
        } catch (e) {}

        router.push(`/rent/track/${data.rental.rentalNumber}`);
      } else {
        setError(data.error || "Failed to create rental booking. Please try again.");
      }
    } catch (err: any) {
      setError(err.message || "Network error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#07090E] text-white selection:bg-brand-yellow selection:text-black">
      {/* GLOW DECORATIONS */}
      <div className="fixed top-0 right-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="fixed top-1/3 left-10 w-80 h-80 bg-brand-yellow/5 rounded-full blur-3xl pointer-events-none" />

      {/* HEADER BREADCRUMB WITH CASHALL LOGO */}
      <div className="border-b border-neutral-800/80 bg-neutral-950/60 backdrop-blur-md sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3 sm:gap-4">
            <Link href="/" className="flex items-center group shrink-0" title="Go to CashALL Home" aria-label="CashALL">
              <div className="relative h-8 sm:h-9 w-24 sm:w-28 flex items-center justify-start">
                <Image
                  src="/logo.webp"
                  alt="CashALL"
                  width={140}
                  height={40}
                  className="object-contain object-left h-7 sm:h-8 w-auto transition-transform group-hover:scale-105"
                  priority
                />
              </div>
            </Link>
            <span className="text-gray-700 text-xs">/</span>
            <span className="text-brand-yellow text-xs font-bold flex items-center gap-1.5">
              <Gamepad2 className="w-3.5 h-3.5" />
              PS5 Rental Service
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-full text-[11px] font-black bg-blue-500/20 text-blue-400 border border-blue-500/30">
              Pay & Use on Delivery
            </span>
            <span className="px-2.5 py-1 rounded-full text-[11px] font-black bg-brand-yellow/20 text-brand-yellow border border-brand-yellow/30">
              From ₹399 / Day
            </span>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* HERO BANNER */}
        <div className="relative rounded-3xl p-6 sm:p-10 mb-10 overflow-hidden bg-gradient-to-r from-blue-950/50 via-neutral-900 to-neutral-950 border border-blue-900/40 shadow-2xl">
          <div className="relative z-10 max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-400/30 text-blue-400 text-xs font-black uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" /> Official PlayStation 5 Doorstep Rental
            </div>
            <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white leading-tight">
              Rent Sony PlayStation 5 <br />
              <span className="text-brand-yellow">Starting Just ₹399/Day. Pay on Handover.</span>
            </h1>
            <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
              Experience ultra-high-speed 4K HDR gaming at home. Choose from Console Only (₹399/day), Console with Game CD included (₹499/day), or Console with Digital ID granting 100+ top games access (₹599/day). Complete with DualSense wireless controller, HDMI 2.1 cable, and doorstep delivery.
            </p>

            <div className="flex flex-wrap gap-4 pt-2 text-xs font-semibold text-gray-300">
              <span className="flex items-center gap-1.5 text-blue-300">
                <CheckCircle2 className="w-4 h-4 text-blue-400" /> Free Doorstep Setup
              </span>
              <span className="flex items-center gap-1.5 text-blue-300">
                <CheckCircle2 className="w-4 h-4 text-blue-400" /> Pre-Delivery Video Proof
              </span>
              <span className="flex items-center gap-1.5 text-blue-300">
                <CheckCircle2 className="w-4 h-4 text-blue-400" /> Extend Online Anytime
              </span>
              <span className="flex items-center gap-1.5 text-brand-yellow">
                <Lock className="w-4 h-4 text-brand-yellow" /> Pay & Use upon Handover
              </span>
            </div>
          </div>
        </div>

        {userLocationState && !userLocationState.toLowerCase().includes("west bengal") && !userLocationState.toLowerCase().includes("bengal") && (
          <div className="mb-8 p-4 sm:p-5 rounded-2xl bg-amber-500/10 border-2 border-amber-500/40 text-amber-200 flex items-start gap-3 shadow-lg">
            <AlertTriangle className="w-5 h-5 text-brand-yellow shrink-0 mt-0.5" />
            <div className="text-xs sm:text-sm">
              <span className="font-black text-brand-yellow">Notice for {userLocationState} visitors:</span> PS5 Console Rental is currently available exclusively across <strong>Kolkata &amp; West Bengal</strong>. If you are looking to sell your old phone, laptop, or tablet, our doorstep buyback service is fully active in <strong>{userLocationState}</strong>!
              <div className="mt-2">
                <Link href="/sell" className="inline-flex items-center gap-1 font-black text-brand-yellow underline hover:text-yellow-400">
                  Sell Your Device in {userLocationState} instead &rarr;
                </Link>
              </div>
            </div>
          </div>
        )}

        <form onSubmit={handleBooking} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* LEFT COLUMN: CUSTOMIZATION & DETAILS */}
          <div className="lg:col-span-8 space-y-8">
            {/* 1. SELECT PS5 RENTAL PACKAGE (3 TIERS) */}
            <div className="bg-neutral-900/90 border border-neutral-800 rounded-3xl p-6 sm:p-8 space-y-5 shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-black text-white flex items-center gap-2">
                    <Tv className="w-5 h-5 text-brand-yellow" />
                    1. Choose Your PS5 Rental Package
                  </h2>
                  <p className="text-xs text-gray-400 mt-0.5">
                    All options include DualSense controller, power cable, and ultra-high-speed HDMI 2.1 cable.
                  </p>
                </div>
                <span className="text-xs font-bold text-brand-yellow bg-brand-yellow/10 px-2.5 py-1 rounded-full border border-brand-yellow/30">
                  3 Options Available
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* TIER 1: CONSOLE ONLY (₹399/day) */}
                <button
                  type="button"
                  onClick={() => {
                    setRentalPackage("CONSOLE_ONLY");
                    setSelectedGames([]);
                  }}
                  className={`p-5 rounded-2xl border text-left transition-all flex flex-col justify-between ${
                    rentalPackage === "CONSOLE_ONLY"
                      ? "border-brand-yellow bg-brand-yellow/10 ring-2 ring-brand-yellow/30 shadow-lg"
                      : "border-neutral-800 bg-neutral-950/60 hover:border-neutral-700"
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-black text-white">Console Only</span>
                      <Gamepad2 className={`w-5 h-5 ${rentalPackage === "CONSOLE_ONLY" ? "text-brand-yellow" : "text-gray-500"}`} />
                    </div>
                    <div className="text-[10px] uppercase font-bold text-gray-400 tracking-wider mb-2">
                      No CD • No Digital ID
                    </div>
                    <p className="text-xs text-gray-400 leading-relaxed">
                      Only PlayStation 5 without any CD or Digital ID. Ideal if you already have your own games or PSN account.
                    </p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-neutral-800/80 flex items-center justify-between">
                    <span className="text-base font-black text-brand-yellow">₹399 / day</span>
                    {rentalPackage === "CONSOLE_ONLY" && (
                      <span className="text-[10px] font-black text-brand-yellow bg-brand-yellow/20 px-2 py-0.5 rounded">SELECTED</span>
                    )}
                  </div>
                </button>

                {/* TIER 2: CONSOLE + GAME CD (₹499/day) */}
                <button
                  type="button"
                  onClick={() => {
                    setRentalPackage("CONSOLE_CD");
                    if (selectedGames.length === 0) setSelectedGames(["gta5"]);
                  }}
                  className={`p-5 rounded-2xl border text-left transition-all flex flex-col justify-between ${
                    rentalPackage === "CONSOLE_CD"
                      ? "border-brand-yellow bg-brand-yellow/10 ring-2 ring-brand-yellow/30 shadow-lg"
                      : "border-neutral-800 bg-neutral-950/60 hover:border-neutral-700"
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-black text-white">Console + Game CD</span>
                      <Disc className={`w-5 h-5 ${rentalPackage === "CONSOLE_CD" ? "text-brand-yellow" : "text-gray-500"}`} />
                    </div>
                    <div className="text-[10px] uppercase font-bold text-green-400 tracking-wider mb-2">
                      Game CD Included (₹0 Extra)
                    </div>
                    <p className="text-xs text-gray-400 leading-relaxed">
                      PlayStation 5 Disc Edition with physical game CD included at no extra cost. Pick your favorite game disc below!
                    </p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-neutral-800/80 flex items-center justify-between">
                    <span className="text-base font-black text-brand-yellow">₹499 / day</span>
                    {rentalPackage === "CONSOLE_CD" && (
                      <span className="text-[10px] font-black text-brand-yellow bg-brand-yellow/20 px-2 py-0.5 rounded">SELECTED</span>
                    )}
                  </div>
                </button>

                {/* TIER 3: CONSOLE + DIGITAL ID (₹599/day) */}
                <button
                  type="button"
                  onClick={() => {
                    setRentalPackage("CONSOLE_DIGITAL_ID");
                    setSelectedGames([]);
                  }}
                  className={`p-5 rounded-2xl border text-left transition-all flex flex-col justify-between ${
                    rentalPackage === "CONSOLE_DIGITAL_ID"
                      ? "border-brand-yellow bg-brand-yellow/10 ring-2 ring-brand-yellow/30 shadow-lg"
                      : "border-neutral-800 bg-neutral-950/60 hover:border-neutral-700"
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-black text-white">Console + Digital ID</span>
                      <Sparkles className={`w-5 h-5 ${rentalPackage === "CONSOLE_DIGITAL_ID" ? "text-brand-yellow" : "text-gray-500"}`} />
                    </div>
                    <div className="text-[10px] uppercase font-bold text-blue-400 tracking-wider mb-2">
                      100+ Games Access
                    </div>
                    <p className="text-xs text-gray-400 leading-relaxed">
                      PlayStation with pre-loaded Digital ID giving instant access to 100+ games. We provide login ID & password on delivery!
                    </p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-neutral-800/80 flex items-center justify-between">
                    <span className="text-base font-black text-brand-yellow">₹599 / day</span>
                    {rentalPackage === "CONSOLE_DIGITAL_ID" && (
                      <span className="text-[10px] font-black text-brand-yellow bg-brand-yellow/20 px-2 py-0.5 rounded">SELECTED</span>
                    )}
                  </div>
                </button>
              </div>

              {/* Extra Controller Toggle */}
              <div className="pt-2 border-t border-neutral-800/80 flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-white">DualSense Controller 2 (For Multiplayer)</div>
                  <div className="text-[11px] text-gray-400">Add a 2nd controller for 2-player co-op / competitive games</div>
                </div>
                <button
                  type="button"
                  onClick={() => setExtraControllers(!extraControllers)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                    extraControllers
                      ? "bg-brand-yellow text-black font-black"
                      : "bg-neutral-800 text-gray-300 hover:bg-neutral-700"
                  }`}
                >
                  {extraControllers ? "✓ 2nd Controller Added" : "+ Add 2nd Controller"}
                </button>
              </div>
            </div>

            {/* 2. RENTAL DURATION & CALENDAR SELECTOR */}
            <div className="bg-neutral-900/90 border border-neutral-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-lg">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-neutral-800/80 pb-4">
                <div>
                  <h2 className="text-lg font-black text-white flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-brand-yellow" />
                    2. Select Rental Dates & Duration
                  </h2>
                  <p className="text-xs text-gray-400 mt-0.5">
                    Pick your starting & ending calendar dates or choose custom days. Extend anytime!
                  </p>
                </div>
                <div className="flex items-center gap-2 self-start sm:self-auto bg-brand-yellow/10 border border-brand-yellow/30 px-3.5 py-1.5 rounded-2xl">
                  <span className="text-xs text-gray-400">Total Duration:</span>
                  <span className="text-sm font-black text-brand-yellow">{days} {days === 1 ? "Day" : "Days"}</span>
                </div>
              </div>

              {/* Interactive Calendar Date Range Picker */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-neutral-950 border border-neutral-800 space-y-2 hover:border-neutral-700 transition-colors">
                  <label className="block text-xs font-bold text-gray-300 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-brand-yellow" />
                    Starting Date (Delivery & Setup) <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="date"
                    required
                    min={new Date().toISOString().split("T")[0]}
                    value={startDate}
                    onChange={(e) => handleStartDateChange(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-neutral-900 border border-neutral-800 text-white text-xs font-semibold focus:border-brand-yellow focus:outline-none cursor-pointer"
                  />
                  <span className="text-[11px] text-gray-400 block">
                    Our agent delivers & sets up PS5 on <span className="text-brand-yellow font-medium">{formatDateDisplay(startDate) || "selected date"}</span>
                  </span>
                </div>

                <div className="p-4 rounded-2xl bg-neutral-950 border border-neutral-800 space-y-2 hover:border-neutral-700 transition-colors">
                  <label className="block text-xs font-bold text-gray-300 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-brand-yellow" />
                    Ending Date (Return Pickup) <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="date"
                    required
                    min={startDate || new Date().toISOString().split("T")[0]}
                    value={endDate}
                    onChange={(e) => handleEndDateChange(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-neutral-900 border border-neutral-800 text-white text-xs font-semibold focus:border-brand-yellow focus:outline-none cursor-pointer"
                  />
                  <span className="text-[11px] text-gray-400 block">
                    Doorstep return inspection on <span className="text-brand-yellow font-medium">{formatDateDisplay(endDate) || "selected date"}</span>
                  </span>
                </div>
              </div>

              {/* Visual Schedule Timeline Banner */}
              <div className="p-4 rounded-2xl bg-neutral-950 border border-neutral-800/80 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <div className="text-center bg-neutral-900 border border-neutral-800 px-3 py-2 rounded-xl shrink-0">
                    <span className="block text-[10px] text-gray-400 font-bold uppercase">Delivery</span>
                    <span className="text-xs font-black text-white">{formatDateDisplay(startDate)}</span>
                  </div>
                  <div className="flex-1 sm:flex-none flex items-center justify-center text-gray-500">
                    <div className="h-0.5 w-6 sm:w-12 bg-neutral-800 relative flex items-center justify-center">
                      <ArrowRight className="w-3.5 h-3.5 text-brand-yellow absolute" />
                    </div>
                  </div>
                  <div className="text-center bg-neutral-900 border border-neutral-800 px-3 py-2 rounded-xl shrink-0">
                    <span className="block text-[10px] text-gray-400 font-bold uppercase">Return</span>
                    <span className="text-xs font-black text-white">{formatDateDisplay(endDate)}</span>
                  </div>
                </div>

                {/* Day Stepper Control */}
                <div className="flex items-center justify-between sm:justify-end gap-3 w-full sm:w-auto">
                  <span className="text-xs font-semibold text-gray-400">Adjust Days:</span>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      disabled={days <= 1}
                      onClick={() => handleDaysPreset(days - 1)}
                      className="w-9 h-9 rounded-xl bg-neutral-800 hover:bg-neutral-700 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center text-white font-bold transition-colors"
                      title="Decrease days"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <div className="w-14 text-center">
                      <span className="text-lg font-black text-white">{days}</span>
                      <span className="block text-[9px] text-gray-400 uppercase font-bold">Days</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleDaysPreset(days + 1)}
                      className="w-9 h-9 rounded-xl bg-neutral-800 hover:bg-neutral-700 flex items-center justify-center text-white font-bold transition-colors"
                      title="Increase days"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Quick Select Preset Duration Pills */}
              <div className="space-y-2">
                <div className="text-xs font-bold text-gray-300 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-brand-yellow" />
                  Quick Select Duration:
                </div>
                <div className="flex flex-wrap gap-2">
                  {[
                    { label: "1 Day (Trial)", count: 1 },
                    { label: "2 Days (Weekend)", count: 2 },
                    { label: "3 Days (Long Weekend)", count: 3 },
                    { label: "5 Days (Workweek)", count: 5 },
                    { label: "7 Days (1 Week)", count: 7 },
                    { label: "14 Days (2 Weeks)", count: 14 },
                    { label: "30 Days (1 Month)", count: 30 },
                  ].map((preset) => (
                    <button
                      key={preset.count}
                      type="button"
                      onClick={() => handleDaysPreset(preset.count)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                        days === preset.count
                          ? "bg-brand-yellow text-black shadow-yellowGlow font-black"
                          : "bg-neutral-950 border border-neutral-800 text-gray-300 hover:border-neutral-700"
                      }`}
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* 3. GAME DISCS / DIGITAL ACCESS */}
            <div className="bg-neutral-900/90 border border-neutral-800 rounded-3xl p-6 sm:p-8 space-y-5 shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-black text-white flex items-center gap-2">
                    <Disc className="w-5 h-5 text-brand-yellow" />
                    3. Game Discs / Library Access
                  </h2>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {rentalPackage === "CONSOLE_CD"
                      ? "1 Game CD included FREE in your ₹499/day plan. Extra CDs available at ₹100/day each."
                      : rentalPackage === "CONSOLE_DIGITAL_ID"
                      ? "Digital ID with 100+ blockbuster titles access included with login credentials."
                      : "Console Only plan selected. No CD or Digital ID included."}
                  </p>
                </div>
                {rentalPackage === "CONSOLE_CD" && (
                  <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${
                    extraCDs > 0
                      ? "text-brand-yellow bg-brand-yellow/10 border-brand-yellow/30"
                      : "text-green-400 bg-green-500/10 border-green-500/30"
                  }`}>
                    {extraCDs > 0
                      ? `1 CD Free + ${extraCDs} Extra (+₹${extraCDCostPerDay}/day)`
                      : "1 CD Included (₹0 Extra)"}
                  </span>
                )}
              </div>

              {rentalPackage === "CONSOLE_ONLY" ? (
                <div className="p-5 rounded-2xl bg-neutral-950 border border-neutral-800 space-y-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-gray-400">
                    <Info className="w-4 h-4 text-brand-yellow" />
                    <span>Console Only Plan (₹399 / day)</span>
                  </div>
                  <p className="text-xs text-gray-400 leading-relaxed">
                    This plan includes the PS5 console and DualSense controller without any CD or Digital ID. If you want physical game discs included, choose the{" "}
                    <button
                      type="button"
                      onClick={() => {
                        setRentalPackage("CONSOLE_CD");
                        if (selectedGames.length === 0) setSelectedGames(["gta5"]);
                      }}
                      className="text-brand-yellow font-bold underline hover:text-white"
                    >
                      Console + Game CD plan (₹499/day)
                    </button>
                    !
                  </p>
                </div>
              ) : rentalPackage === "CONSOLE_DIGITAL_ID" ? (
                <div className="p-5 rounded-2xl bg-neutral-950 border border-neutral-800 space-y-3">
                  <div className="flex items-center gap-2 text-xs font-bold text-brand-yellow">
                    <Sparkles className="w-4 h-4 text-brand-yellow" />
                    <span>100+ Games Digital Library Access Included (₹599 / day)</span>
                  </div>
                  <p className="text-xs text-gray-300 leading-relaxed">
                    You will receive official PlayStation Network (PSN) login credentials (ID & Password) upon delivery. This gives you instant digital access to over 100+ blockbuster titles (Spider-Man, GTA V, God of War, FIFA/FC, Assassin's Creed, and more) with no physical discs required!
                  </p>
                  <div className="flex flex-wrap gap-2 text-[10px] font-bold">
                    <span className="px-2.5 py-1 rounded-lg bg-blue-500/20 text-blue-300 border border-blue-500/30">✓ 100+ Blockbuster Games</span>
                    <span className="px-2.5 py-1 rounded-lg bg-brand-yellow/20 text-brand-yellow border border-brand-yellow/30">✓ Login ID & Password Provided</span>
                    <span className="px-2.5 py-1 rounded-lg bg-green-500/20 text-green-300 border border-green-500/30">✓ Instant Play — No Discs Needed</span>
                  </div>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                    {AVAILABLE_GAMES.map((game) => {
                      const isSelected = selectedGames.includes(game.id);
                      const isFirstSelected = selectedGames[0] === game.id;
                      const isExtraSelected = isSelected && !isFirstSelected;

                      return (
                        <div
                          key={game.id}
                          onClick={() => toggleGame(game.id)}
                          className={`cursor-pointer rounded-2xl p-4 border transition-all relative overflow-hidden flex flex-col justify-between ${
                            isFirstSelected
                              ? "border-green-500/80 bg-green-950/20 ring-1 ring-green-500/40 shadow-md"
                              : isExtraSelected
                              ? "border-brand-yellow bg-brand-yellow/10 ring-1 ring-brand-yellow/40 shadow-md"
                              : "border-neutral-800 bg-neutral-950/60 hover:border-neutral-700 hover:bg-neutral-950"
                          }`}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <div className="text-xs font-black text-white leading-tight">{game.title}</div>
                              <div className="text-[10px] text-gray-400 mt-0.5">{game.genre}</div>
                            </div>
                            <div
                              className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 text-xs ${
                                isFirstSelected
                                  ? "bg-green-500 text-black font-black"
                                  : isExtraSelected
                                  ? "bg-brand-yellow text-black font-black"
                                  : "border border-neutral-700 text-transparent"
                              }`}
                            >
                              ✓
                            </div>
                          </div>

                          <div className="mt-4 flex items-center justify-between text-[11px] pt-2 border-t border-neutral-800/60">
                            <span className="text-gray-400">Rating: {game.rating}</span>
                            {isFirstSelected ? (
                              <span className="font-black text-green-400">1ST CD (FREE)</span>
                            ) : isExtraSelected ? (
                              <span className="font-black text-brand-yellow">+₹100 / DAY</span>
                            ) : selectedGames.length >= 1 ? (
                              <span className="font-semibold text-gray-400">+₹100 / Day</span>
                            ) : (
                              <span className="font-bold text-green-400">INCLUDED FREE</span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="text-[11px] text-gray-400 bg-neutral-950 p-3 rounded-xl border border-neutral-800/80 flex items-center gap-2">
                    <Info className="w-4 h-4 text-blue-400 shrink-0" />
                    <span>
                      1st Game CD is 100% free with the ₹499 plan. Each additional CD is ₹100/day. All game discs are verified scratch-free prior to delivery.
                    </span>
                  </div>
                </>
              )}
            </div>

            {/* 4. DOORSTEP DELIVERY & CUSTOMER DETAILS */}
            <div className="bg-neutral-900/90 border border-neutral-800 rounded-3xl p-6 sm:p-8 space-y-5 shadow-lg">
              <div>
                <h2 className="text-lg font-black text-white flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-brand-yellow" />
                  4. Doorstep Delivery & Customer Details
                </h2>
                <p className="text-xs text-gray-400 mt-0.5">
                  Our logistics executive will deliver, setup, and test the console directly at your doorstep.
                </p>
              </div>

              {isPrefilled && (
                <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                  <div className="text-xs text-emerald-200">
                    <span className="font-bold text-emerald-300">Welcome back!</span> Your delivery address, contact details, and Govt ID have been auto-filled from your previous order. You can edit them anytime.
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-300 mb-1.5">
                    Full Name <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="e.g. Rahul Sharma"
                    className="w-full px-4 py-3 rounded-xl bg-neutral-950 border border-neutral-800 text-white text-xs font-medium focus:border-brand-yellow focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-300 mb-1.5">
                    Mobile Number <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    placeholder="e.g. 9876543210"
                    className="w-full px-4 py-3 rounded-xl bg-neutral-950 border border-neutral-800 text-white text-xs font-medium focus:border-brand-yellow focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-300 mb-1.5">
                    Email Address (For Invoices & Handover Receipt)
                  </label>
                  <input
                    type="email"
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    placeholder="rahul.sharma@gmail.com"
                    className="w-full px-4 py-3 rounded-xl bg-neutral-950 border border-neutral-800 text-white text-xs font-medium focus:border-brand-yellow focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-300 mb-1.5">
                    PIN Code <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={6}
                    value={pincode}
                    onChange={(e) => setPincode(e.target.value)}
                    placeholder="e.g. 110001"
                    className="w-full px-4 py-3 rounded-xl bg-neutral-950 border border-neutral-800 text-white text-xs font-medium focus:border-brand-yellow focus:outline-none"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-gray-300 mb-1.5">
                    Complete Delivery Address <span className="text-red-400">*</span>
                  </label>
                  <textarea
                    required
                    rows={2}
                    value={deliveryAddress}
                    onChange={(e) => setDeliveryAddress(e.target.value)}
                    placeholder="Flat / House No., Building Name, Street, Landmark, City"
                    className="w-full px-4 py-3 rounded-xl bg-neutral-950 border border-neutral-800 text-white text-xs font-medium focus:border-brand-yellow focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-300 mb-1.5">
                    Delivery Date <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="date"
                    required
                    min={new Date().toISOString().split("T")[0]}
                    value={startDate}
                    onChange={(e) => handleStartDateChange(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-neutral-950 border border-neutral-800 text-white text-xs font-medium focus:border-brand-yellow focus:outline-none cursor-pointer"
                  />
                  <span className="text-[10px] text-gray-500 mt-1 block">
                    Return pickup scheduled for {formatDateDisplay(endDate)} ({days} days)
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-300 mb-1.5">Preferred Time Window</label>
                  <select
                    value={timeSlot}
                    onChange={(e) => setTimeSlot(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-neutral-950 border border-neutral-800 text-white text-xs font-medium focus:border-brand-yellow focus:outline-none"
                  >
                    <option value="10:00 AM - 01:00 PM">Morning (10:00 AM - 01:00 PM)</option>
                    <option value="01:00 PM - 04:00 PM">Afternoon (01:00 PM - 04:00 PM)</option>
                    <option value="04:00 PM - 07:00 PM">Evening (04:00 PM - 07:00 PM)</option>
                    <option value="07:00 PM - 09:30 PM">Night (07:00 PM - 09:30 PM)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-300 mb-1.5">Govt ID Verification Type</label>
                  <select
                    value={govtIdType}
                    onChange={(e) => setGovtIdType(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-neutral-950 border border-neutral-800 text-white text-xs font-medium focus:border-brand-yellow focus:outline-none"
                  >
                    <option value="Aadhaar Card">Aadhaar Card</option>
                    <option value="Driving License">Driving License</option>
                    <option value="Voter ID">Voter ID</option>
                    <option value="Passport">Passport</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-300 mb-1.5">
                    Govt ID Number (Enter Full) <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={govtIdNumber}
                    onChange={(e) => setGovtIdNumber(e.target.value)}
                    placeholder="Enter full 12-digit Aadhaar / DL / Voter ID Number"
                    className="w-full px-4 py-3 rounded-xl bg-neutral-950 border border-neutral-800 text-white text-xs font-medium focus:border-brand-yellow focus:outline-none"
                  />
                  <p className="text-[11px] text-brand-yellow/90 mt-1.5 flex items-center gap-1.5">
                    <Info className="w-3.5 h-3.5 shrink-0 text-brand-yellow" />
                    Please enter your authentic official document number. Our delivery executive will physically verify the original document during doorstep handover.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: PRICING BREAKDOWN & UNDERTAKING */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-6 sm:p-7 sticky top-20 shadow-2xl space-y-6">
              <div className="flex items-center justify-between border-b border-neutral-800 pb-4">
                <h3 className="text-base font-black text-white flex items-center gap-2">
                  <FileText className="w-4 h-4 text-brand-yellow" /> Rental Summary
                </h3>
                <span className="text-[10px] font-black uppercase tracking-wider bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded">
                  Pay & Use
                </span>
              </div>

              {/* Itemized Calculation */}
              <div className="space-y-3 text-xs">
                <div className="flex items-center justify-between text-gray-300">
                  <span>
                    {rentalPackage === "CONSOLE_ONLY"
                      ? `Console Only (${days}d × ₹399)`
                      : rentalPackage === "CONSOLE_CD"
                      ? `Console + 1st Game CD (${days}d × ₹499)`
                      : `Console + Digital ID 100+ Games (${days}d × ₹599)`}
                  </span>
                  <span className="font-bold text-white">
                    ₹{(days * baseDailyRate).toLocaleString("en-IN")}
                  </span>
                </div>

                {rentalPackage === "CONSOLE_CD" && (
                  <>
                    <div className="flex items-center justify-between text-gray-300">
                      <span>1st Game CD ({AVAILABLE_GAMES.find((g) => g.id === selectedGames[0])?.title || "1 CD"})</span>
                      <span className="font-bold text-green-400">INCLUDED (₹0)</span>
                    </div>

                    {extraCDs > 0 && (
                      <div className="flex items-center justify-between text-gray-300">
                        <span>
                          Extra Game CDs ({extraCDs} CD{extraCDs > 1 ? "s" : ""} × ₹100/d × {days}d)
                        </span>
                        <span className="font-bold text-brand-yellow">
                          +₹{(extraCDCostPerDay * days).toLocaleString("en-IN")}
                        </span>
                      </div>
                    )}
                  </>
                )}

                {rentalPackage === "CONSOLE_DIGITAL_ID" && (
                  <div className="flex items-center justify-between text-gray-300">
                    <span>100+ Games PSN Access</span>
                    <span className="font-bold text-blue-400">ID & Password Provided</span>
                  </div>
                )}

                {rentalPackage === "CONSOLE_ONLY" && (
                  <div className="flex items-center justify-between text-gray-400">
                    <span>Game Discs / Digital ID</span>
                    <span className="font-semibold text-gray-400">Not Included (Console Only)</span>
                  </div>
                )}

                {extraControllers && (
                  <div className="flex items-center justify-between text-gray-300">
                    <span>DualSense Controller 2</span>
                    <span className="font-bold text-green-400">FREE INCLUDED</span>
                  </div>
                )}

                <div className="flex items-center justify-between text-gray-300">
                  <span>Doorstep Delivery & Setup</span>
                  <span className="font-bold text-green-400">FREE</span>
                </div>

                <div className="pt-3 border-t border-neutral-800 flex items-center justify-between">
                  <div>
                    <span className="text-sm font-black text-white block">Total Payable on Handover</span>
                    <span className="text-[10px] text-gray-400">
                      {extraCDs > 0
                        ? `₹${effectiveDailyRate}/day × ${days} days (includes ₹${extraCDCostPerDay}/day for ${extraCDs} extra CD${extraCDs > 1 ? "s" : ""})`
                        : "Pay directly to delivery agent (Cash / UPI)"}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-2xl font-black text-brand-yellow">₹{totalAmount.toLocaleString("en-IN")}</span>
                  </div>
                </div>
              </div>

              {/* Video Inspection & Repair/Replacement Undertaking Checkbox */}
              <div className="pt-4 border-t border-neutral-800 space-y-3">
                <div
                  onClick={() => {
                    if (!termsAccepted) {
                      setTermsModalOpen(true);
                    }
                  }}
                  className={`rounded-2xl p-4 border transition-all cursor-pointer ${
                    termsAccepted
                      ? "bg-green-950/20 border-green-800/60"
                      : "bg-neutral-950 border-brand-yellow/50 hover:border-brand-yellow hover:bg-neutral-900/60"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      id="termsCheckbox"
                      checked={termsAccepted}
                      onChange={(e) => {
                        if (!termsAccepted) {
                          setTermsModalOpen(true);
                        } else {
                          setTermsAccepted(false);
                        }
                      }}
                      onClick={(e) => {
                        if (!termsAccepted) {
                          e.preventDefault();
                          setTermsModalOpen(true);
                        }
                      }}
                      className="mt-0.5 w-4 h-4 rounded text-brand-yellow focus:ring-brand-yellow bg-neutral-900 border-neutral-700 cursor-pointer"
                    />
                    <div className="text-[11px] leading-relaxed select-none">
                      {termsAccepted ? (
                        <div className="space-y-1">
                          <span className="font-bold text-green-400 flex items-center gap-1">
                            ✓ Terms & Undertaking Read and Accepted
                          </span>
                          <p className="text-gray-300 text-[11px]">
                            You agreed to the Pre-Delivery Video Inspection, Controller Repair / Console Replacement Undertaking, and physical handover sign-off.
                          </p>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setTermsModalOpen(true);
                            }}
                            className="text-brand-yellow underline font-bold hover:text-white text-[10px]"
                          >
                            Re-read Terms & Undertaking
                          </button>
                        </div>
                      ) : (
                        <div className="space-y-1">
                          <span className="font-bold text-brand-yellow flex items-center gap-1">
                            ⚠️ Mandatory: Click to Read Terms & Conditions First
                          </span>
                          <p className="text-gray-300 text-[11px]">
                            Click here to read and accept the{" "}
                            <span className="text-brand-yellow underline font-bold">
                              PS5 Video Inspection, Replacement & Controller Repair Undertaking
                            </span>
                            . You must review the terms before booking.
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setTermsModalOpen(true)}
                  className="w-full text-center text-[11px] text-blue-400 hover:text-blue-300 underline font-semibold flex items-center justify-center gap-1"
                >
                  <ShieldCheck className="w-3.5 h-3.5" /> View Official Form & Undertaking Clauses
                </button>
              </div>

              {error && (
                <div className="p-3 rounded-xl bg-red-950/80 border border-red-800 text-red-200 text-xs flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 shrink-0 text-red-400" />
                  <span>{error}</span>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={submitting}
                className="w-full py-4 rounded-2xl font-black text-sm transition-all duration-200 shadow-yellowGlow bg-brand-yellow text-black hover:bg-yellow-400 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {submitting ? (
                  <span>Creating Your Booking...</span>
                ) : (
                  <>
                    <span>CONFIRM PS5 RENTAL BOOKING</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              <div className="text-[10px] text-gray-500 text-center space-y-1">
                <div>✓ No upfront online payment required</div>
                <div>✓ Pay via UPI/Cash when our agent brings the PS5</div>
                <div>✓ Extend your rental days online from your order page</div>
              </div>
            </div>
          </div>
        </form>
      </main>

      {/* TERMS & LIABILITY UNDERTAKING MODAL */}
      {termsModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-neutral-900 border border-neutral-800 rounded-3xl max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden shadow-2xl">
            {/* MODAL HEADER */}
            <div className="p-6 border-b border-neutral-800 flex items-center justify-between bg-neutral-950">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-brand-yellow/20 text-brand-yellow flex items-center justify-center font-bold">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-white">PS5 Equipment Condition, Controller Repair & Console Replacement Liability</h3>
                  <p className="text-xs text-gray-400">Official Undertaking (CashALL / Aarna Enterprises)</p>
                </div>
              </div>
              <button
                onClick={() => setTermsModalOpen(false)}
                className="p-2 rounded-xl text-gray-400 hover:text-white hover:bg-neutral-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* MODAL BODY */}
            <div className="p-6 overflow-y-auto space-y-5 text-xs text-gray-300 leading-relaxed">
              <div className="p-4 rounded-2xl bg-blue-950/40 border border-blue-800/40 text-blue-200">
                <span className="font-bold">Summary: </span>
                Our delivery executive will set up and test the PlayStation 5 in your presence. A brief video recording of the working console, ports, and controllers will be taken and saved with your receipt. You will sign the physical handover form upon verification.
              </div>

              <div className="space-y-4">
                <div>
                  <h4 className="font-bold text-white text-sm mb-1">1. Pre-Delivery Video Proof & Recording</h4>
                  <p>
                    I, the Customer, acknowledge and agree that the delivery agent will record a detailed live video showing the physical condition, ports, body warranty seal, serial numbers, and working status of the PS5 Console and DualSense Controller(s) prior to handover.
                  </p>
                </div>

                <div>
                  <h4 className="font-bold text-white text-sm mb-1">2. Return Verification & Physical Matching</h4>
                  <p>
                    At the time of return, the PS5 Console and Controller(s) will be inspected again. The returned equipment <strong className="text-white">MUST MATCH EXACTLY</strong> with the pre-delivery video recording in terms of physical condition, working status, body seal, and serial numbers.
                  </p>
                </div>

                <div>
                  <h4 className="font-bold text-white text-sm mb-1">3. Equipment Damage, Controller Repair & Console Replacement Liability</h4>
                  <p className="mb-2">
                    In case of any damage, cracks, liquid spills, tampering, or defects not present in the pre-delivery video recording:
                  </p>
                  <ul className="list-disc pl-5 space-y-2 text-gray-300">
                    <li>
                      <strong className="text-brand-yellow">PS5 Console (Non-Repairable — Full Replacement Value):</strong> The PlayStation 5 console cannot be repaired for internal hardware defects or board-level damage. If the console suffers major internal/external damage, liquid spillage, motherboard failure, body cracks, or warranty seal tampering, I agree and undertake to pay the <strong>Full Market Replacement Value</strong> of the PS5 console.
                    </li>
                    <li>
                      <strong className="text-brand-yellow">DualSense Controller (Repairable — 100% Repair Cost):</strong> Unlike the console, controllers are repairable. For controller defects (such as stick drift from drops, broken triggers, stuck buttons, or casing damage), I undertake to pay <strong>100% of the Controller Repair and Genuine Parts Replacement Cost</strong> (or full replacement value if broken beyond repair or lost).
                    </li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-bold text-white text-sm mb-1">4. Pay & Use Handover</h4>
                  <p>
                    The agreed rental fee must be paid in full to the delivery agent upon handover. The customer will sign the <strong>physical handover form</strong> alongside the agent on the spot.
                  </p>
                </div>

                <div>
                  <h4 className="font-bold text-white text-sm mb-1">5. Original Govt ID Physical Verification & Customer Cooperation</h4>
                  <p>
                    The customer undertakes to present their authentic, original physical Govt ID (Aadhaar Card, Driving License, Voter ID, or Passport) corresponding to the number provided during booking to our delivery executive upon arrival. When our delivery agent asks for the customer's physical ID for verification, the customer agrees to fully cooperate with them.
                  </p>
                </div>

                <div>
                  <h4 className="font-bold text-white text-sm mb-1">6. Plan Extension</h4>
                  <p>
                    Customers can extend their rental period directly from the CashALL tracking link at their plan's daily rate (₹399/day for Console Only, ₹499/day for Console + Game CD, ₹599/day for Console + Digital ID). Extension requests must be placed before the scheduled return pickup time.
                  </p>
                </div>
              </div>
            </div>

            {/* MODAL FOOTER */}
            <div className="p-4 border-t border-neutral-800 bg-neutral-950 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setTermsModalOpen(false)}
                className="px-4 py-2.5 rounded-xl text-xs font-bold text-gray-400 hover:text-white"
              >
                Close
              </button>

              <button
                type="button"
                onClick={() => {
                  setTermsAccepted(true);
                  setTermsModalOpen(false);
                }}
                className="px-6 py-2.5 rounded-xl text-xs font-black bg-brand-yellow text-black hover:bg-yellow-400 shadow-yellowGlow flex items-center gap-1.5"
              >
                <span>I Have Read & Accept Terms & Undertaking</span>
                <Check className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
