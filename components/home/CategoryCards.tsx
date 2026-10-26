"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Smartphone, Laptop, Tablet, ArrowRight, Gamepad2, CheckCircle2 } from "lucide-react";
import { Badge } from "@/components/ui/Badge";

export function CategoryCards() {
  const [isWestBengal, setIsWestBengal] = useState(false);

  useEffect(() => {
    const checkLocation = () => {
      if (typeof window !== "undefined") {
        try {
          const locStr = localStorage.getItem("cashall_location");
          if (locStr) {
            const parsed = JSON.parse(locStr);
            const state = (parsed?.state || "").toLowerCase();
            const city = (parsed?.city || "").toLowerCase();
            setIsWestBengal(
              state.includes("west bengal") ||
              state.includes("bengal") ||
              state.trim() === "wb" ||
              city.includes("kolkata") ||
              city.includes("howrah")
            );
          } else {
            setIsWestBengal(false);
          }
        } catch {
          setIsWestBengal(false);
        }
      }
    };

    checkLocation();
    window.addEventListener("cashall_location_updated", checkLocation);
    window.addEventListener("storage", checkLocation);
    return () => {
      window.removeEventListener("cashall_location_updated", checkLocation);
      window.removeEventListener("storage", checkLocation);
    };
  }, []);

  const categories = [
    {
      id: "mobile",
      title: "Mobile Phone",
      subtitle: "Sell iPhone, Samsung, OnePlus, Pixel & more with instant spot valuation.",
      image: "/images/devices/phone.jpg",
      icon: Smartphone,
      status: "AVAILABLE",
      available: true,
      href: "/sell-old-mobile-phone",
      btnText: "Sell Mobile Phone",
    },
    {
      id: "laptop",
      title: "Laptop & MacBook",
      subtitle: "Sell MacBook, Dell, HP, Lenovo, Asus & Acer with certified SSD erasure.",
      image: "/images/devices/laptop.jpg",
      icon: Laptop,
      status: "AVAILABLE",
      available: true,
      href: "/sell-old-laptop",
      btnText: "Sell Laptop",
    },
    {
      id: "tablet",
      title: "Tablet / iPad",
      subtitle: "Sell Apple iPad, Galaxy Tab & Lenovo Pad with guaranteed locked buyback.",
      image: "/images/devices/tablet.jpg",
      icon: Tablet,
      status: "AVAILABLE",
      available: true,
      href: "/sell-old-tablet",
      btnText: "Sell Tablet",
    },
  ];

  return (
    <section className="py-14 sm:py-16 bg-[#F8FAFC]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-xl mx-auto mb-10">
          <h2 className="font-heading text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Sell Your Device
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-2 font-normal leading-relaxed">
            Select your device category to calculate a guaranteed algorithmic price quote with ₹0 convenience fees.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={cat.href}
              className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/80 hover:border-slate-300 shadow-xs hover:shadow-subtleCard transition-all duration-200 group flex flex-col justify-between hover:-translate-y-0.5 cursor-pointer"
            >
              <div>
                {/* ACTUAL DEVICE PHOTOGRAPH */}
                <div className="relative h-44 w-full rounded-2xl overflow-hidden mb-5 border border-slate-100 shadow-2xs bg-slate-950 group-hover:border-slate-300 transition-all">
                  <Image
                    src={cat.image}
                    alt={cat.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 768px) 100vw, 360px"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                </div>

                <h3 className="font-heading text-lg font-extrabold text-slate-900 group-hover:text-black">
                  {cat.title}
                </h3>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed font-normal">
                  {cat.subtitle}
                </p>
              </div>

              <div className="flex items-center gap-1.5 text-xs font-extrabold text-slate-900 mt-6 group-hover:text-amber-600 group-hover:translate-x-0.5 transition-all">
                <span>{cat.btnText}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </Link>
          ))}
        </div>

        {/* PS5 RENTAL FEATURED BANNER - EXCLUSIVE TO WEST BENGAL / KOLKATA */}
        {isWestBengal && (
          <div className="mt-8 rounded-3xl p-6 sm:p-8 bg-gradient-to-r from-neutral-950 via-[#0a1636] to-neutral-950 border border-blue-900/40 text-white shadow-xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-2.5 max-w-xl">
              <div className="flex items-center gap-2 text-brand-yellow text-xs font-bold uppercase tracking-wider">
                <Gamepad2 className="w-3.5 h-3.5" />
                PlayStation 5 Console Rental • Kolkata &amp; WB
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                Rent PS5 at Just <span className="text-brand-yellow">₹500 / Day</span>
              </h3>
              <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed font-normal">
                Doorstep delivery, pre-delivery working video proof, optional top game CDs (GTA V, Spider-Man 2, FC 24) at ₹100/day, and pay-and-use on arrival. Extend anytime online!
              </p>
              <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-neutral-300 pt-1">
                <span className="flex items-center gap-1.5 text-blue-200">
                  <CheckCircle2 className="w-3.5 h-3.5 text-brand-yellow" /> Min 1 Day to Custom Days
                </span>
                <span className="flex items-center gap-1.5 text-blue-200">
                  <CheckCircle2 className="w-3.5 h-3.5 text-brand-yellow" /> Pay to Agent on Delivery
                </span>
              </div>
            </div>

            <div className="shrink-0 flex items-center gap-4">
              <div className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-2xl overflow-hidden border border-blue-500/40 shadow-2xl shrink-0 bg-neutral-950">
                <Image
                  src="/images/devices/ps5.jpg"
                  alt="Sony PlayStation 5 Rental"
                  fill
                  className="object-cover"
                  sizes="128px"
                />
              </div>

              <Link
                href="/rent/ps5"
                className="px-6 py-3.5 rounded-xl bg-brand-yellow text-black font-extrabold text-xs hover:bg-yellow-400 shadow-yellowGlow transition-transform active:scale-95 flex items-center gap-2 whitespace-nowrap cursor-pointer"
              >
                <span>Rent PS 5</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
