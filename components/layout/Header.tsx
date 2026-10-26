"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { MapPin, Menu, X, User, ChevronDown, HelpCircle, LogIn, LogOut, ShoppingBag, ShoppingCart, Smartphone, Gamepad2 } from "lucide-react";
import { DeviceChoiceModal } from "@/components/common/DeviceChoiceModal";
import { CustomerAuthModal } from "@/components/common/CustomerAuthModal";
import { LocationModal } from "@/components/common/LocationModal";
import { NeedHelpModal } from "@/components/common/NeedHelpModal";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { getCartQuotes, CART_UPDATED_EVENT } from "@/lib/cart";
import { clearCrossUserDataOnSwitch } from "@/lib/utils/customer-storage";
import { DeviceSearch } from "@/components/home/DeviceSearch";

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [locationModalOpen, setLocationModalOpen] = useState(false);
  const [needHelpModalOpen, setNeedHelpModalOpen] = useState(false);
  const [deviceChoiceOpen, setDeviceChoiceOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [cartDrawerOpen, setCartDrawerOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  
  const [selectedLocation, setSelectedLocation] = useState<{ city: string; state: string } | null>(null);
  
  const [user, setUser] = useState<{ name?: string; phone?: string; email?: string } | null>(null);

  useEffect(() => {
    const updateCartCount = () => {
      const quotes = getCartQuotes();
      setCartCount(quotes.length);
    };
    updateCartCount();

    if (typeof window !== "undefined") {
      window.addEventListener(CART_UPDATED_EVENT, updateCartCount);
      window.addEventListener("storage", updateCartCount);
      return () => {
        window.removeEventListener(CART_UPDATED_EVENT, updateCartCount);
        window.removeEventListener("storage", updateCartCount);
      };
    }
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      // Restore user session
      const storedUser = localStorage.getItem("cashall_user");
      if (storedUser) {
        try {
          setUser(JSON.parse(storedUser));
        } catch (e) {
          console.error(e);
        }
      } else {
        setUser(null);
      }

      // Restore location session or auto-prompt on first visit
      const storedLoc = localStorage.getItem("cashall_location");
      if (storedLoc) {
        try {
          setSelectedLocation(JSON.parse(storedLoc));
        } catch (e) {
          console.error(e);
        }
      } else {
        // Customer visits site for first time without state selected:
        // Automatically prompt to select State!
        const timer = setTimeout(() => {
          setLocationModalOpen(true);
        }, 350);
        return () => clearTimeout(timer);
      }

      const handleLocationUpdate = () => {
        const loc = localStorage.getItem("cashall_location");
        if (loc) {
          try {
            setSelectedLocation(JSON.parse(loc));
          } catch (e) {}
        }
      };
      window.addEventListener("cashall_location_updated", handleLocationUpdate);
      return () => {
        window.removeEventListener("cashall_location_updated", handleLocationUpdate);
      };

      // Auto-sync any local storage orders to PostgreSQL database automatically (throttled)
      try {
        const lastSync = sessionStorage.getItem("cashall_orders_synced_at");
        if (!lastSync || Date.now() - Number(lastSync) > 600000) { // Throttle to max once per 10 minutes
          const localAll = JSON.parse(localStorage.getItem("cashall_all_orders") || "[]");
          const latestOrder: string = localStorage.getItem("cashall_latest_order") || "";
          let ordersToSync = Array.isArray(localAll) ? [...localAll] : [];
          if (latestOrder.trim()) {
            try {
              const lo = JSON.parse(latestOrder);
              if (lo?.orderNumber && !ordersToSync.some((o: any) => o.orderNumber === lo.orderNumber)) {
                ordersToSync.push(lo);
              }
            } catch (e) {}
          }
          if (ordersToSync.length > 0) {
            sessionStorage.setItem("cashall_orders_synced_at", String(Date.now()));
            fetch("/api/v1/orders/sync-local", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ orders: ordersToSync }),
            }).catch((err) => console.warn("Global background auto-sync error:", err));
          }
        }
      } catch (e) {}
    }
  }, [authModalOpen]);

  const handleSelectLocation = (loc: { city: string; state: string }) => {
    setSelectedLocation(loc);
    if (typeof window !== "undefined") {
      localStorage.setItem("cashall_location", JSON.stringify(loc));
      window.dispatchEvent(new Event("cashall_location_updated"));
    }
  };

  const isWestBengal = Boolean(
    selectedLocation?.state &&
      (selectedLocation.state.toLowerCase().includes("west bengal") ||
        selectedLocation.state.toLowerCase().includes("bengal") ||
        selectedLocation.state.toLowerCase().trim() === "wb")
  );

  const handleLogout = () => {
    if (typeof window !== "undefined") {
      clearCrossUserDataOnSwitch();
      localStorage.removeItem("cashall_user");
      document.cookie = "cashall_user_phone=; path=/; max-age=0";
      window.dispatchEvent(new Event("cashall_cart_updated"));
    }
    setUser(null);
  };

  return (
    <>
      {!selectedLocation && (
        <div className="bg-gradient-to-r from-brand-yellow via-amber-400 to-brand-yellow text-brand-black px-4 py-2 text-xs font-black shadow-md relative z-50">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 animate-bounce shrink-0" />
              <span>
                Please select your <strong>State</strong> to see doorstep pickup hubs & live cash offers in your area.
              </span>
            </div>
            <button
              onClick={() => setLocationModalOpen(true)}
              className="px-3 py-1 bg-brand-black text-brand-yellow text-[11px] font-extrabold rounded-lg hover:bg-neutral-800 transition-all shrink-0 flex items-center gap-1 shadow-sm"
            >
              Select State &rarr;
            </button>
          </div>
        </div>
      )}
      <header className="sticky top-0 z-40 bg-brand-black/95 backdrop-blur-md text-white border-b border-neutral-800/80 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            
            {/* LEFT LOGO & LOCATION */}
            <div className="flex items-center space-x-4 sm:space-x-6">
              
              {/* CASHALL LOGO */}
              <Link href="/" className="flex items-center gap-2 group shrink-0" aria-label="CashALL" title="CashALL">
                <div className="relative h-9 sm:h-12 w-28 sm:w-44 flex items-center justify-start py-0.5">
                  <Image
                    src="/logo.webp"
                    alt="CashALL"
                    width={240}
                    height={60}
                    className="object-contain object-left h-8 sm:h-10 w-auto transition-transform group-hover:scale-105"
                    priority
                  />
                </div>
              </Link>

              {/* LOCATION SELECTOR BUTTON */}
              <div className="relative hidden md:block">
                <button
                  onClick={() => setLocationModalOpen(true)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-semibold transition-all shadow-sm ${
                    selectedLocation
                      ? "bg-neutral-900/80 border-neutral-800 text-neutral-200 hover:text-white hover:border-brand-yellow/50"
                      : "bg-brand-yellow text-brand-black border-brand-yellow font-black animate-pulse"
                  }`}
                >
                  <MapPin className={`w-3.5 h-3.5 shrink-0 ${selectedLocation ? "text-brand-yellow" : "text-brand-black"}`} />
                  <span className="truncate max-w-[200px] font-bold">
                    {selectedLocation
                      ? `${selectedLocation.state}${selectedLocation.city && selectedLocation.city !== selectedLocation.state ? ` (${selectedLocation.city})` : ""}`
                      : "Select State"}
                  </span>
                  <ChevronDown className={`w-3 h-3 shrink-0 ${selectedLocation ? "text-neutral-400" : "text-brand-black"}`} />
                </button>
              </div>

            </div>

            {/* DESKTOP SEARCH BAR (BETWEEN LOCATION AND ACTIONS) */}
            <div className="hidden md:flex flex-1 max-w-md lg:max-w-xl mx-4 lg:mx-8">
              <DeviceSearch inHeader />
            </div>

            {/* RIGHT ACTION BUTTONS */}
            <div className="hidden sm:flex items-center space-x-2.5">
              
              {/* SAVED QUOTES CART BUTTON */}
              <button
                onClick={() => setCartDrawerOpen(true)}
                className="relative flex items-center gap-2 text-xs font-bold text-neutral-200 hover:text-brand-yellow px-3 py-2 rounded-xl bg-neutral-900/80 border border-neutral-800 hover:border-brand-yellow/40 transition-all shadow-sm"
                title="View Saved Quotes Cart"
              >
                <ShoppingCart className="w-4 h-4 text-brand-yellow" />
                <span>Cart</span>
                {cartCount > 0 && (
                  <span className="bg-brand-yellow text-brand-black text-[10px] font-black px-1.5 py-0.5 rounded-full">
                    {cartCount}
                  </span>
                )}
              </button>

              {/* MY ORDERS — ONLY SHOWN IF AUTHENTICATED */}
              {user && (
                <Link
                  href="/account"
                  className="flex items-center gap-1.5 text-xs font-bold text-gray-200 hover:text-brand-yellow px-3 py-2 rounded-lg hover:bg-neutral-800/80 border border-neutral-800/80 transition-colors"
                >
                  <User className="w-4 h-4 text-brand-yellow" />
                  <span>My Orders</span>
                </Link>
              )}

              {/* AUTHENTICATION CONTROL */}
              {user ? (
                <div className="flex items-center gap-2">
                  <Link
                    href="/account"
                    className="flex items-center gap-1.5 text-xs font-bold text-brand-yellow px-3 py-2 rounded-lg bg-neutral-900 border border-neutral-800 hover:bg-neutral-800 transition-colors"
                  >
                    <span>{user.name || user.phone || "Account"}</span>
                  </Link>
                  <button
                    onClick={handleLogout}
                    title="Sign Out"
                    className="p-2 text-gray-400 hover:text-red-400 rounded-lg hover:bg-neutral-800 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setAuthModalOpen(true)}
                  className="flex items-center gap-1.5 text-xs font-bold text-gray-200 hover:text-brand-yellow px-3 py-2 rounded-lg hover:bg-neutral-800/80 border border-neutral-800 transition-colors"
                >
                  <LogIn className="w-4 h-4 text-brand-yellow" />
                  <span>Customer Login</span>
                </button>
              )}
            </div>

            {/* MOBILE TRIGGER & CTAs (COMPACT FLUID LAYOUT) */}
            <div className="flex sm:hidden items-center gap-1.5 shrink-0">
              {/* MOBILE CART BUTTON */}
              <button
                onClick={() => setCartDrawerOpen(true)}
                className="relative p-1.5 rounded-lg bg-neutral-900 border border-neutral-800 text-brand-yellow text-xs font-bold flex items-center justify-center"
                title="Cart"
              >
                <ShoppingCart className="w-4 h-4" />
                {cartCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-brand-yellow text-brand-black text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </button>

              {/* MOBILE LOCATION PILL */}
              <button
                onClick={() => setLocationModalOpen(true)}
                className={`p-1 px-2.5 rounded-lg border text-[11px] font-bold flex items-center gap-1 max-w-[120px] transition-all ${
                  selectedLocation
                    ? "bg-neutral-900 border-neutral-800 text-brand-yellow"
                    : "bg-brand-yellow text-brand-black border-brand-yellow animate-pulse"
                }`}
                title="Select State"
              >
                <MapPin className="w-3 h-3 shrink-0" />
                <span className="truncate font-extrabold">{selectedLocation ? selectedLocation.state : "Select State"}</span>
              </button>

              {/* MOBILE MENU TOGGLE */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-1.5 text-gray-300 hover:text-white rounded-lg focus:outline-none"
                aria-label="Toggle Navigation"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>

          </div>
        </div>

        {/* MOBILE SEARCH BAR (ALWAYS ACCESSIBLE DIRECTLY ON MOBILE SCREENS) */}
        <div className="block md:hidden px-3 sm:px-4 pb-2.5 pt-0">
          <DeviceSearch inHeader />
        </div>

        {/* MOBILE DRAWER MENU */}
        {mobileMenuOpen && (
          <div className="sm:hidden bg-brand-black border-b border-neutral-800 px-4 pt-3 pb-6 space-y-3 animate-fadeIn">
            
            {/* LOCATION SELECTOR MOBILE TRIGGER */}
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                setLocationModalOpen(true);
              }}
              className="w-full flex items-center justify-between p-2.5 rounded-xl bg-neutral-900 border border-neutral-800 text-xs font-bold text-gray-200"
            >
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-brand-yellow" />
                <span>State: {selectedLocation ? selectedLocation.state : "Select State"}</span>
              </div>
              <ChevronDown className="w-4 h-4 text-gray-400" />
            </button>

            {/* MOBILE INSTANT DEVICE SEARCH */}
            <div className="pt-1 pb-1">
              <DeviceSearch inHeader />
            </div>

            {/* AUTHENTICATION STATE MOBILE BUTTON */}
            {user ? (
              <div className="flex items-center justify-between py-2 border-b border-neutral-800">
                <div className="flex items-center gap-2 text-sm font-bold text-brand-yellow">
                  <User className="w-4 h-4" />
                  <span>{user.name || user.phone || "Logged In"}</span>
                </div>
                <button
                  onClick={() => {
                    handleLogout();
                    setMobileMenuOpen(false);
                  }}
                  className="text-xs font-bold text-red-400 hover:underline flex items-center gap-1"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Sign Out</span>
                </button>
              </div>
            ) : (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  setAuthModalOpen(true);
                }}
                className="block w-full text-left py-2 text-base font-bold text-brand-yellow flex items-center gap-2"
              >
                <LogIn className="w-4 h-4" />
                <span>Customer Login / Sign In</span>
              </button>
            )}

            {/* MY ORDERS — SHOWN ONLY IF AUTHENTICATED IN MOBILE DRAWER */}
            {user && (
              <Link
                href="/account"
                onClick={() => setMobileMenuOpen(false)}
                className="block py-2 text-base font-bold text-brand-yellow flex items-center gap-2 border-b border-neutral-800/60"
              >
                <User className="w-4 h-4" />
                <span>My Orders / Account</span>
              </Link>
            )}

            {/* MAIN NAVIGATION MOBILE LINKS */}
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                setDeviceChoiceOpen(true);
              }}
              className="block w-full text-left py-2 text-base font-bold text-white hover:text-brand-yellow"
            >
              Sell Device (Phone, Laptop or Tablet)
            </button>
            <Link
              href="/sell-old-mobile-phone"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-base font-semibold text-gray-200 hover:text-brand-yellow"
            >
              Sell Phone
            </Link>
            <Link
              href="/sell-old-laptop"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-base font-semibold text-gray-200 hover:text-brand-yellow"
            >
              Sell Laptop
            </Link>
            <Link
              href="/sell-old-tablet"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-base font-semibold text-gray-200 hover:text-brand-yellow"
            >
              Sell Tablet
            </Link>
            {isWestBengal && (
              <Link
                href="/rent/ps5"
                onClick={() => setMobileMenuOpen(false)}
                className="py-2.5 px-3 rounded-xl bg-blue-950/60 border border-blue-800/60 text-blue-300 font-bold text-sm flex items-center gap-2 hover:text-white"
              >
                <Gamepad2 className="w-4 h-4 text-brand-yellow" />
                <span>Rent PS 5</span>
              </Link>
            )}
          </div>
        )}
      </header>

      {/* MODALS */}
      <DeviceChoiceModal
        isOpen={deviceChoiceOpen}
        onClose={() => setDeviceChoiceOpen(false)}
      />

      <CustomerAuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
      />

      <LocationModal
        isOpen={locationModalOpen}
        onClose={() => setLocationModalOpen(false)}
        selectedLocation={selectedLocation}
        onSelectLocation={handleSelectLocation}
      />

      <NeedHelpModal
        isOpen={needHelpModalOpen}
        onClose={() => setNeedHelpModalOpen(false)}
      />

      <CartDrawer
        isOpen={cartDrawerOpen}
        onClose={() => setCartDrawerOpen(false)}
      />
    </>
  );
}
