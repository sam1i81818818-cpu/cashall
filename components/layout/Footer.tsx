"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { ShieldCheck, Truck, Banknote, HelpCircle, Facebook, Instagram, Youtube, Linkedin } from "lucide-react";

export function Footer() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isWestBengal, setIsWestBengal] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedUser = localStorage.getItem("cashall_user");
      setIsLoggedIn(!!storedUser);

      const checkLocation = () => {
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
      };

      checkLocation();
      window.addEventListener("cashall_location_updated", checkLocation);
      window.addEventListener("storage", checkLocation);
      return () => {
        window.removeEventListener("cashall_location_updated", checkLocation);
        window.removeEventListener("storage", checkLocation);
      };
    }
  }, []);

  return (
    <footer className="bg-brand-black text-gray-400 border-t border-neutral-800 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* TRUST BADGES RIBBON */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pb-12 mb-12 border-b border-neutral-800">
          <div className="flex items-center gap-3.5">
            <div className="relative w-12 h-12 rounded-xl overflow-hidden shrink-0 border border-neutral-800 shadow-sm">
              <Image
                src="/images/trust/pickup.svg"
                alt="Fast & Free Doorstep Pickup"
                fill
                className="object-cover"
                unoptimized
              />
            </div>
            <div>
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">Fast & Free Pickup</h4>
              <p className="text-[11px] text-gray-400">Express doorstep dispatch</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5">
            <div className="relative w-12 h-12 rounded-xl overflow-hidden shrink-0 border border-neutral-800 shadow-sm">
              <Image
                src="/images/trust/upi.svg"
                alt="Instant UPI Spot Payout"
                fill
                className="object-cover"
                unoptimized
              />
            </div>
            <div>
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">Instant Payment</h4>
              <p className="text-[11px] text-gray-400">UPI or direct bank transfer</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5">
            <div className="relative w-12 h-12 rounded-xl overflow-hidden shrink-0 border border-neutral-800 shadow-sm">
              <Image
                src="/images/trust/shield.svg"
                alt="Transparent 100% Fair Pricing"
                fill
                className="object-cover"
                unoptimized
              />
            </div>
            <div>
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">Transparent Pricing</h4>
              <p className="text-[11px] text-gray-400">No hidden deductions</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5">
            <div className="relative w-12 h-12 rounded-xl overflow-hidden shrink-0 border border-neutral-800 shadow-sm">
              <Image
                src="/images/trust/support.svg"
                alt="24/7 Human Support"
                fill
                className="object-cover"
                unoptimized
              />
            </div>
            <div>
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">Human Support</h4>
              <p className="text-[11px] text-gray-400">Assistance at every step</p>
            </div>
          </div>
        </div>

        {/* FOOTER LINKS MATRIX */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">
          
          {/* BRAND COLUMN */}
          <div className="col-span-2 space-y-4">
            <div className="relative h-10 w-36">
              <Image
                src="/logo.webp"
                alt="CashALL"
                width={160}
                height={45}
                className="object-contain object-left h-full w-auto"
              />
            </div>

            {/* SOCIAL MEDIA LINKS DIRECTLY BELOW LOGO */}
            <div className="pt-2 flex items-center gap-3">
              <span className="text-xs font-bold text-gray-300 uppercase tracking-wider">Follow us on:</span>
              <a
                href="https://www.facebook.com/profile.php?id=61592749535143"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full bg-neutral-900 border border-neutral-800 flex items-center justify-center text-gray-400 hover:text-brand-yellow hover:border-brand-yellow/50 transition-all group"
                title="Facebook"
              >
                <Facebook className="w-4 h-4 group-hover:scale-110 transition-transform" />
              </a>
              <a
                href="https://www.instagram.com/cashall_official"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full bg-neutral-900 border border-neutral-800 flex items-center justify-center text-gray-400 hover:text-brand-yellow hover:border-brand-yellow/50 transition-all group"
                title="Instagram"
              >
                <Instagram className="w-4 h-4 group-hover:scale-110 transition-transform" />
              </a>
              <a
                href="https://www.youtube.com/channel/UCymYHMF8-grP7txUbqIt6sQ"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full bg-neutral-900 border border-neutral-800 flex items-center justify-center text-gray-400 hover:text-brand-yellow hover:border-brand-yellow/50 transition-all group"
                title="YouTube"
              >
                <Youtube className="w-4 h-4 group-hover:scale-110 transition-transform" />
              </a>
              <a
                href="https://www.linkedin.com/company/cashall/?viewAsMember=true"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full bg-neutral-900 border border-neutral-800 flex items-center justify-center text-gray-400 hover:text-brand-yellow hover:border-brand-yellow/50 transition-all group"
                title="LinkedIn"
              >
                <Linkedin className="w-4 h-4 group-hover:scale-110 transition-transform" />
              </a>
            </div>

            {/* OFFICIAL EMAIL SUPPORT DIRECTLY BELOW FOLLOW US ON */}
            <div className="pt-3 text-xs text-gray-400 flex flex-wrap items-center gap-1.5">
              <span className="font-semibold text-gray-300">Official Email Support:</span>
              <a
                href="mailto:support@cashall.in"
                className="text-brand-yellow font-bold hover:underline"
              >
                support@cashall.in
              </a>
            </div>
          </div>

          {/* SELL */}
          <div>
            <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-4">Sell Devices</h3>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/sell-old-mobile-phone" className="hover:text-brand-yellow transition-colors">
                  Sell Mobile Phone
                </Link>
              </li>
              <li>
                <Link href="/sell-old-laptop" className="hover:text-brand-yellow transition-colors">
                  Sell Laptop
                </Link>
              </li>
              <li>
                <Link href="/sell-old-tablet" className="hover:text-brand-yellow transition-colors">
                  Sell Tablet / iPad
                </Link>
              </li>
              {isWestBengal && (
                <li>
                  <Link href="/rent/ps5" className="hover:text-brand-yellow transition-colors text-blue-400 font-semibold">
                    Rent PS5 Console
                  </Link>
                </li>
              )}
              <li>
                <Link href="/sell-phone-in-kolkata" className="hover:text-brand-yellow transition-colors text-brand-yellow/90 font-semibold">
                  Sell Phone in Kolkata
                </Link>
              </li>
              <li>
                <Link href="/sell-phone-in-howrah" className="hover:text-brand-yellow transition-colors">
                  Sell Phone in Howrah
                </Link>
              </li>
              <li>
                <Link href="/sell-phone-in-gorakhpur" className="hover:text-brand-yellow transition-colors">
                  Sell Phone in Gorakhpur
                </Link>
              </li>
            </ul>
          </div>

          {/* COMPANY */}
          <div>
            <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-4">Company</h3>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/about-us" className="hover:text-brand-yellow transition-colors">
                  About CashALL
                </Link>
              </li>
              <li>
                <Link href="/reviews" className="hover:text-brand-yellow transition-colors">
                  Customer Reviews
                </Link>
              </li>
              <li>
                <Link href="/blog" className="hover:text-brand-yellow transition-colors">
                  Resale Q&amp;A &amp; Blog
                </Link>
              </li>
              <li>
                <Link href="/news" className="hover:text-brand-yellow transition-colors">
                  Tech News
                </Link>
              </li>
              <li>
                <Link href="/articles" className="hover:text-brand-yellow transition-colors">
                  Articles &amp; Guides
                </Link>
              </li>
              <li>
                <Link href="/compare/cashall-vs-other-platforms" className="hover:text-brand-yellow transition-colors">
                  CashALL vs Other Platforms
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-brand-yellow transition-colors">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* SUPPORT & LEGAL */}
          <div>
            <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-4">Support &amp; Legal</h3>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/faq" className="hover:text-brand-yellow transition-colors">
                  FAQ
                </Link>
              </li>
              {isLoggedIn && (
                <li>
                  <Link href="/account" className="hover:text-brand-yellow transition-colors">
                    Track My Order
                  </Link>
                </li>
              )}
              <li>
                <Link href="/privacy" className="hover:text-brand-yellow transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/cookie-policy" className="hover:text-brand-yellow transition-colors">
                  Cookie Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-brand-yellow transition-colors">
                  Terms &amp; Conditions
                </Link>
              </li>
              <li>
                <Link href="/doorstep-pickup-policy" className="hover:text-brand-yellow transition-colors">
                  Doorstep Pickup Policy
                </Link>
              </li>
              <li>
                <Link href="/cancellation-policy" className="hover:text-brand-yellow transition-colors">
                  Cancellation Policy
                </Link>
              </li>
            </ul>
          </div>

        </div>

        {/* COMPANY LEGAL INFORMATION */}
        <div className="pt-8 border-t border-neutral-800 text-xs text-neutral-400 space-y-1.5">
          <p className="font-semibold text-neutral-300">
            CashALL • Operating under Aarna Enterprise | Headquartered in Howrah, West Bengal, India.
          </p>
          <p className="text-[11px] text-neutral-500 leading-relaxed">
            Official Email Support: <span className="text-brand-yellow font-bold">support@cashall.in</span> • Customer Helpline: <span className="text-white font-bold">+91 7604092333</span>. All brand names, logos, and trademarks (Apple, Samsung, OnePlus, Sony PlayStation, etc.) are the property of their respective owners and used solely for identification purposes.
          </p>
        </div>

        {/* BOTTOM COPYRIGHT */}
        <div className="pt-6 border-t border-neutral-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-400">
          <p className="font-medium text-gray-300">© 2026 Aarna Enterprise (CashALL). All Rights Reserved</p>
        </div>

      </div>
    </footer>
  );
}
