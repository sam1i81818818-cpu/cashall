"use client";

import React from "react";

// ============================================================================
// CASHALL LAPTOP HARDWARE ILLUSTRATIONS (Step 3: Functional Problems)
// ============================================================================

export type LaptopHardwareVariant =
  | "keyboard"
  | "cddvd"
  | "touchpad"
  | "battery_dead"
  | "speakers"
  | "wifi"
  | "usb"
  | "webcam"
  | "charging_port"
  | "hard_drive"
  | "motherboard";

export function LaptopHardwareIllustration({ variant }: { variant: LaptopHardwareVariant }) {
  return (
    <svg viewBox="0 0 100 100" className="w-full h-full max-w-[88px] max-h-[88px]" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* ── 1. KEYBOARD NOT WORKING ── */}
      {variant === "keyboard" && (
        <g>
          {/* Laptop keyboard deck chassis */}
          <rect x="14" y="24" width="72" height="52" rx="6" fill="#F8FAFC" stroke="#1E293B" strokeWidth="2.5" />
          {/* Chiclet Key Matrix */}
          <rect x="20" y="30" width="8" height="7" rx="1.5" fill="#334155" />
          <rect x="31" y="30" width="8" height="7" rx="1.5" fill="#334155" />
          <rect x="42" y="30" width="8" height="7" rx="1.5" fill="#334155" />
          <rect x="53" y="30" width="8" height="7" rx="1.5" fill="#EF4444" stroke="#DC2626" strokeWidth="1" /> {/* Broken key */}
          <rect x="64" y="30" width="8" height="7" rx="1.5" fill="#334155" />
          <rect x="75" y="30" width="5" height="7" rx="1.5" fill="#334155" />

          <rect x="20" y="40" width="10" height="7" rx="1.5" fill="#334155" />
          <rect x="33" y="40" width="8" height="7" rx="1.5" fill="#EF4444" stroke="#DC2626" strokeWidth="1" /> {/* Broken key */}
          <rect x="44" y="40" width="8" height="7" rx="1.5" fill="#334155" />
          <rect x="55" y="40" width="8" height="7" rx="1.5" fill="#334155" />
          <rect x="66" y="40" width="14" height="7" rx="1.5" fill="#334155" />

          {/* Space bar row */}
          <rect x="32" y="50" width="36" height="7" rx="1.5" fill="#334155" />
          {/* Trackpad area below */}
          <rect x="36" y="62" width="28" height="10" rx="2" fill="#E2E8F0" stroke="#94A3B8" strokeWidth="1" />

          {/* Alert badge over faulty key */}
          <circle cx="68" cy="62" r="14" fill="#FEF2F2" stroke="#EF4444" strokeWidth="2" />
          <path d="M63 57L73 67M73 57L63 67" stroke="#DC2626" strokeWidth="2.2" strokeLinecap="round" />
        </g>
      )}

      {/* ── 2. CD/DVD DRIVE NOT WORKING ── */}
      {variant === "cddvd" && (
        <g>
          {/* Optical disc tray ejecting */}
          <rect x="18" y="34" width="64" height="34" rx="4" fill="#F8FAFC" stroke="#1E293B" strokeWidth="2.5" />
          <line x1="24" y1="42" x2="76" y2="42" stroke="#1E293B" strokeWidth="2" />
          {/* Disc silhouette */}
          <circle cx="50" cy="52" r="18" fill="#E2E8F0" stroke="#64748B" strokeWidth="1.8" />
          <circle cx="50" cy="52" r="5" fill="#F8FAFC" stroke="#64748B" strokeWidth="1.5" />
          {/* Error cross */}
          <circle cx="68" cy="40" r="14" fill="#FEF2F2" stroke="#EF4444" strokeWidth="2" />
          <path d="M63 35L73 45M73 35L63 45" stroke="#DC2626" strokeWidth="2.2" strokeLinecap="round" />
        </g>
      )}

      {/* ── 3. TOUCHPAD NOT WORKING ── */}
      {variant === "touchpad" && (
        <g>
          {/* Laptop Base */}
          <rect x="14" y="20" width="72" height="60" rx="8" fill="#F8FAFC" stroke="#1E293B" strokeWidth="2.5" />
          {/* Keyboard faint line */}
          <line x1="22" y1="34" x2="78" y2="34" stroke="#CBD5E1" strokeWidth="2" strokeDasharray="4 2" />
          {/* Glass Trackpad centered */}
          <rect x="30" y="44" width="40" height="28" rx="4" fill="#E2E8F0" stroke="#1E293B" strokeWidth="2" />
          {/* Click divider line */}
          <line x1="50" y1="62" x2="50" y2="72" stroke="#94A3B8" strokeWidth="1.5" />
          {/* Finger gesture with error */}
          <circle cx="50" cy="52" r="12" fill="#FEF2F2" stroke="#EF4444" strokeWidth="1.8" />
          <path d="M46 48L54 56M54 48L46 56" stroke="#DC2626" strokeWidth="2" strokeLinecap="round" />
        </g>
      )}

      {/* ── 4. BATTERY DEAD / DEGRADED ── */}
      {variant === "battery_dead" && (
        <g>
          {/* Laptop Battery horizontal bar */}
          <rect x="18" y="32" width="58" height="36" rx="6" fill="#F8FAFC" stroke="#1E293B" strokeWidth="2.5" />
          <rect x="76" y="42" width="6" height="16" rx="3" fill="#1E293B" />
          {/* Depleted single red cell */}
          <rect x="22" y="36" width="12" height="28" rx="3" fill="#EF4444" />
          {/* Critical alert sign inside battery */}
          <circle cx="54" cy="50" r="10" fill="#FEF2F2" stroke="#DC2626" strokeWidth="1.8" />
          <path d="M54 45V50M54 53.5V54.5" stroke="#DC2626" strokeWidth="2" strokeLinecap="round" />
          {/* Cycle count / backup tag */}
          <g transform="translate(34, 74)">
            <rect x="0" y="0" width="52" height="16" rx="4" fill="#1E293B" />
            <text x="26" y="11.5" fill="#FBBF24" fontSize="8" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">
              &lt; 60 Mins
            </text>
          </g>
        </g>
      )}

      {/* ── 5. SPEAKERS NOT WORKING ── */}
      {variant === "speakers" && (
        <g>
          {/* Laptop top-down speaker grille deck */}
          <rect x="14" y="22" width="72" height="56" rx="6" fill="#F8FAFC" stroke="#1E293B" strokeWidth="2.5" />
          {/* Left speaker perforations */}
          <g fill="#475569">
            <circle cx="22" cy="32" r="1.5" /><circle cx="26" cy="32" r="1.5" />
            <circle cx="22" cy="38" r="1.5" /><circle cx="26" cy="38" r="1.5" />
            <circle cx="22" cy="44" r="1.5" /><circle cx="26" cy="44" r="1.5" />
            <circle cx="22" cy="50" r="1.5" /><circle cx="26" cy="50" r="1.5" />
            <circle cx="22" cy="56" r="1.5" /><circle cx="26" cy="56" r="1.5" />
          </g>
          {/* Right speaker perforations */}
          <g fill="#475569">
            <circle cx="74" cy="32" r="1.5" /><circle cx="78" cy="32" r="1.5" />
            <circle cx="74" cy="38" r="1.5" /><circle cx="78" cy="38" r="1.5" />
            <circle cx="74" cy="44" r="1.5" /><circle cx="78" cy="44" r="1.5" />
            <circle cx="74" cy="50" r="1.5" /><circle cx="78" cy="50" r="1.5" />
            <circle cx="74" cy="56" r="1.5" /><circle cx="78" cy="56" r="1.5" />
          </g>
          {/* Center speaker cone with crackle defect */}
          <path d="M40 42H46L54 34V66L46 58H40V42Z" fill="#E2E8F0" stroke="#1E293B" strokeWidth="2" strokeLinejoin="round" />
          {/* Sound waves crackling/slashed */}
          <path d="M58 42L66 38L62 48L70 46L64 58" stroke="#DC2626" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
        </g>
      )}

      {/* ── 6. WI-FI NOT WORKING ── */}
      {variant === "wifi" && (
        <g>
          {/* Open Laptop silhouette */}
          <path d="M24 64L32 28H68L76 64H24Z" fill="#F8FAFC" stroke="#1E293B" strokeWidth="2.5" strokeLinejoin="round" />
          <line x1="16" y1="64" x2="84" y2="64" stroke="#1E293B" strokeWidth="3" strokeLinecap="round" />
          {/* Wi-Fi Arcs on screen */}
          <circle cx="50" cy="52" r="2.5" fill="#EF4444" />
          <path d="M43 45C47 41 53 41 57 45" stroke="#EF4444" strokeWidth="2.2" strokeLinecap="round" />
          <path d="M37 38C44 32 56 32 63 38" stroke="#EF4444" strokeWidth="2" strokeLinecap="round" />
          {/* Strikethrough slash */}
          <line x1="32" y1="24" x2="68" y2="60" stroke="#DC2626" strokeWidth="3" strokeLinecap="round" />
        </g>
      )}

      {/* ── 7. USB PORT NOT WORKING ── */}
      {variant === "usb" && (
        <g>
          {/* Laptop Side Edge Chassis */}
          <rect x="14" y="32" width="72" height="36" rx="6" fill="#F8FAFC" stroke="#1E293B" strokeWidth="2.5" />
          {/* USB-A Port Rect */}
          <rect x="24" y="44" width="22" height="12" rx="2" fill="#0F172A" stroke="#334155" strokeWidth="1.5" />
          <rect x="27" y="46" width="16" height="4" fill="#38BDF8" /> {/* USB 3.0 blue tab */}
          {/* USB-C Port Oval */}
          <rect x="54" y="46" width="20" height="8" rx="4" fill="#0F172A" stroke="#334155" strokeWidth="1.5" />
          {/* Alert sign over ports */}
          <circle cx="48" cy="40" r="14" fill="#FEF2F2" stroke="#EF4444" strokeWidth="2" />
          <path d="M43 35L53 45M53 35L43 45" stroke="#DC2626" strokeWidth="2.2" strokeLinecap="round" />
        </g>
      )}

      {/* ── 8. WEBCAM NOT WORKING ── */}
      {variant === "webcam" && (
        <g>
          {/* Laptop Top Screen Bezel */}
          <rect x="14" y="16" width="72" height="48" rx="8" fill="#0F172A" stroke="#1E293B" strokeWidth="2.5" />
          <rect x="18" y="28" width="64" height="32" fill="#1E293B" />
          {/* Webcam lens on top bezel */}
          <circle cx="50" cy="22" r="3.5" fill="#475569" stroke="#38BDF8" strokeWidth="1" />
          <circle cx="50" cy="22" r="1.2" fill="#38BDF8" />
          {/* Mic holes flanking camera */}
          <circle cx="44" cy="22" r="0.8" fill="#94A3B8" />
          <circle cx="56" cy="22" r="0.8" fill="#94A3B8" />
          {/* Large diagnostic cross over camera */}
          <circle cx="50" cy="50" r="18" fill="#FEF2F2" stroke="#EF4444" strokeWidth="2" />
          <path d="M42 42L58 58M58 42L42 58" stroke="#DC2626" strokeWidth="2.5" strokeLinecap="round" />
        </g>
      )}

      {/* ── 9. CHARGING PORT NOT WORKING ── */}
      {variant === "charging_port" && (
        <g>
          {/* Laptop Left Side Profile */}
          <rect x="16" y="26" width="68" height="48" rx="6" fill="#F8FAFC" stroke="#1E293B" strokeWidth="2.5" />
          {/* MagSafe / Barrel DC Jack */}
          <circle cx="32" cy="50" r="7" fill="#0F172A" stroke="#EF4444" strokeWidth="1.8" />
          <circle cx="32" cy="50" r="2.5" fill="#F59E0B" />
          {/* Power Cable Plug approaching */}
          <rect x="52" y="44" width="22" height="12" rx="3" fill="#E2E8F0" stroke="#1E293B" strokeWidth="1.8" />
          <rect x="46" y="47" width="6" height="6" fill="#94A3B8" />
          {/* Broken Lightning defect between them */}
          <path d="M44 34L38 44H44L40 54L48 42H42L44 34Z" fill="#EF4444" stroke="#DC2626" strokeWidth="1" strokeLinejoin="round" />
        </g>
      )}

      {/* ── 10. HARD DRIVE MISSING / DEFECTIVE ── */}
      {variant === "hard_drive" && (
        <g>
          {/* M.2 NVMe SSD / 2.5" Storage Drive */}
          <rect x="22" y="22" width="56" height="56" rx="6" fill="#F8FAFC" stroke="#1E293B" strokeWidth="2.5" />
          {/* Platter / Circuit outline */}
          <rect x="28" y="28" width="44" height="24" rx="3" fill="#E2E8F0" stroke="#64748B" strokeWidth="1.2" />
          {/* Gold Connector pins */}
          <rect x="34" y="74" width="6" height="4" fill="#FFD400" />
          <rect x="44" y="74" width="6" height="4" fill="#FFD400" />
          <rect x="54" y="74" width="6" height="4" fill="#FFD400" />
          {/* Error Cross / Bad Sector */}
          <circle cx="50" cy="50" r="14" fill="#FEF2F2" stroke="#EF4444" strokeWidth="2" />
          <path d="M44 44L56 56M56 44L44 56" stroke="#DC2626" strokeWidth="2.4" strokeLinecap="round" />
        </g>
      )}

      {/* ── 11. MOTHERBOARD ISSUE ── */}
      {variant === "motherboard" && (
        <g>
          {/* Motherboard PCB board */}
          <rect x="18" y="18" width="64" height="64" rx="6" fill="#0F172A" stroke="#1E293B" strokeWidth="2.5" />
          {/* CPU Socket in center */}
          <rect x="36" y="36" width="28" height="28" rx="4" fill="#1E293B" stroke="#38BDF8" strokeWidth="1.5" />
          <circle cx="50" cy="50" r="6" fill="#38BDF8" fillOpacity="0.4" />
          {/* Circuit trace copper lines */}
          <path d="M26 28H36V36M74 28H64V36M26 72H36V64M74 72H64V64" stroke="#F59E0B" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          {/* Overheat / Reboot Crash Warning Sign */}
          <circle cx="66" cy="34" r="12" fill="#FEF2F2" stroke="#EF4444" strokeWidth="1.8" />
          <path d="M66 28V34M66 37V38" stroke="#DC2626" strokeWidth="2" strokeLinecap="round" />
        </g>
      )}
    </svg>
  );
}

// ============================================================================
// CASHALL LAPTOP SCREEN ILLUSTRATIONS (Step 4: Screen Condition)
// ============================================================================

export type LaptopScreenVariant =
  | "no_scratches"
  | "1_2_scratches"
  | "more_than_2"
  | "cracked_broken"
  | "no_discoloration"
  | "minor_discoloration"
  | "major_discoloration"
  | "no_spots"
  | "minor_spots"
  | "heavy_spots"
  | "no_lines"
  | "visible_lines"
  | "flickering"
  | "black_dots";

export function LaptopScreenIllustration({ variant }: { variant: LaptopScreenVariant }) {
  return (
    <svg viewBox="0 0 100 80" className="w-full h-full max-w-[88px] max-h-[72px]" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Laptop Lid/Bezel */}
      <rect x="10" y="8" width="80" height="54" rx="5" fill="#111827" stroke="#1F2937" strokeWidth="2" />
      {/* Laptop Base Stand / Keyboard bottom lip */}
      <path d="M4 64L10 62H90L96 64H4Z" fill="#E5E7EB" stroke="#1F2937" strokeWidth="1.8" strokeLinejoin="round" />
      <line x1="42" y1="62" x2="58" y2="62" stroke="#9CA3AF" strokeWidth="1.5" strokeLinecap="round" />

      {/* Screen Area */}
      <rect x="14" y="12" width="72" height="46" rx="2" fill="#FFFFFF" />

      {/* ── 1. NO SCRATCHES (PRISTINE) ── */}
      {variant === "no_scratches" && (
        <g>
          {/* Glass reflection beam */}
          <path d="M16 14L44 14L24 56L16 56Z" fill="#F1F5F9" opacity="0.8" />
          {/* Emerald Sparkles */}
          <path d="M50 28L52 22L54 28L60 30L54 32L52 38L50 32L44 30Z" fill="#10B981" />
          <path d="M68 40L69 36L70 40L74 41L70 42L69 46L68 42L64 41Z" fill="#10B981" />
          <path d="M30 42L31 39L32 42L35 43L32 44L31 47L30 44L27 43Z" fill="#34D399" />
        </g>
      )}

      {/* ── 2. 1-2 SCRATCHES ── */}
      {variant === "1_2_scratches" && (
        <g stroke="#EF4444" strokeWidth="1.5" strokeLinecap="round">
          <line x1="30" y1="24" x2="48" y2="42" />
          <line x1="56" y1="32" x2="70" y2="46" />
        </g>
      )}

      {/* ── 3. MORE THAN 2 SCRATCHES ── */}
      {variant === "more_than_2" && (
        <g stroke="#DC2626" strokeWidth="1.6" strokeLinecap="round">
          <line x1="22" y1="18" x2="42" y2="38" />
          <line x1="34" y1="44" x2="56" y2="24" />
          <line x1="48" y1="22" x2="74" y2="48" />
          <line x1="28" y1="50" x2="62" y2="50" />
        </g>
      )}

      {/* ── 4. CRACKED OR BROKEN ── */}
      {variant === "cracked_broken" && (
        <g stroke="#991B1B" strokeWidth="1.8" strokeLinecap="round">
          {/* Spider fracture */}
          <line x1="16" y1="14" x2="44" y2="36" />
          <line x1="44" y1="36" x2="80" y2="26" />
          <line x1="44" y1="36" x2="60" y2="56" />
          <line x1="44" y1="36" x2="30" y2="54" />
          <line x1="32" y1="26" x2="52" y2="20" />
          <line x1="34" y1="44" x2="48" y2="50" />
          <circle cx="44" cy="36" r="3" fill="#EF4444" stroke="none" />
        </g>
      )}

      {/* ── 5. NO DISCOLORATION ── */}
      {variant === "no_discoloration" && (
        <g>
          <rect x="14" y="12" width="72" height="46" rx="2" fill="#FAFAFA" />
          <path d="M50 28L52 22L54 28L60 30L54 32L52 38L50 32L44 30Z" fill="#10B981" />
        </g>
      )}

      {/* ── 6. MINOR DISCOLORATION ── */}
      {variant === "minor_discoloration" && (
        <g>
          <rect x="14" y="12" width="72" height="46" rx="2" fill="#FEF3C7" opacity="0.75" />
          <ellipse cx="50" cy="35" rx="22" ry="14" fill="#FDE68A" opacity="0.9" />
        </g>
      )}

      {/* ── 7. MAJOR DISCOLORATION ── */}
      {variant === "major_discoloration" && (
        <g>
          <rect x="14" y="12" width="72" height="46" rx="2" fill="#FEE2E2" />
          <circle cx="38" cy="32" r="14" fill="#F87171" opacity="0.75" />
          <circle cx="62" cy="40" r="12" fill="#EF4444" opacity="0.85" />
        </g>
      )}

      {/* ── 8. NO SPOTS ── */}
      {variant === "no_spots" && (
        <g>
          <circle cx="50" cy="35" r="11" stroke="#10B981" strokeWidth="2" strokeDasharray="3 3" />
          <path d="M46 35L49 38L55 32" stroke="#10B981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </g>
      )}

      {/* ── 9. 1-2 MINOR SPOTS ── */}
      {variant === "minor_spots" && (
        <g>
          <circle cx="36" cy="28" r="3.5" fill="#EF4444" />
          <circle cx="64" cy="42" r="3" fill="#EF4444" />
        </g>
      )}

      {/* ── 10. HEAVY SPOTS ── */}
      {variant === "heavy_spots" && (
        <g>
          <circle cx="30" cy="24" r="5" fill="#DC2626" />
          <circle cx="50" cy="36" r="7" fill="#991B1B" />
          <circle cx="70" cy="30" r="6" fill="#DC2626" />
          <circle cx="42" cy="48" r="4.5" fill="#B91C1C" />
          <circle cx="65" cy="46" r="4" fill="#EF4444" />
        </g>
      )}

      {/* ── 11. NO LINES ── */}
      {variant === "no_lines" && (
        <g>
          <path d="M50 28L52 22L54 28L60 30L54 32L52 38L50 32L44 30Z" fill="#10B981" />
          <line x1="24" y1="35" x2="76" y2="35" stroke="#E2E8F0" strokeWidth="1" strokeDasharray="4 4" />
        </g>
      )}

      {/* ── 12. VISIBLE LINES ON SCREEN ── */}
      {variant === "visible_lines" && (
        <g strokeWidth="2" strokeLinecap="round">
          <line x1="32" y1="12" x2="32" y2="58" stroke="#3B82F6" />
          <line x1="48" y1="12" x2="48" y2="58" stroke="#10B981" />
          <line x1="64" y1="12" x2="64" y2="58" stroke="#EF4444" />
        </g>
      )}

      {/* ── 13. DISPLAY FLICKERING ── */}
      {variant === "flickering" && (
        <g>
          <rect x="14" y="16" width="72" height="6" fill="#3B82F6" opacity="0.6" />
          <rect x="14" y="28" width="72" height="10" fill="#EF4444" opacity="0.5" />
          <rect x="14" y="44" width="72" height="8" fill="#F59E0B" opacity="0.6" />
          <line x1="14" y1="24" x2="86" y2="24" stroke="#1E293B" strokeWidth="1" strokeDasharray="2 2" />
          <line x1="14" y1="40" x2="86" y2="40" stroke="#1E293B" strokeWidth="1" strokeDasharray="2 2" />
        </g>
      )}

      {/* ── 14. BLACK DOTS (DEAD PIXELS) ── */}
      {variant === "black_dots" && (
        <g fill="#000000">
          <circle cx="34" cy="24" r="2.5" />
          <circle cx="38" cy="27" r="2" />
          <circle cx="56" cy="38" r="3" />
          <circle cx="60" cy="35" r="2.5" />
          <circle cx="62" cy="40" r="2" />
        </g>
      )}
    </svg>
  );
}

// ============================================================================
// CASHALL LAPTOP ACCESSORY ILLUSTRATIONS (Step 5: Accessories)
// ============================================================================

export type LaptopAccessoryVariant = "box" | "charger" | "stylus";

export function LaptopAccessoryIllustration({ variant }: { variant: LaptopAccessoryVariant }) {
  return (
    <svg viewBox="0 0 100 100" className="w-full h-full max-w-[88px] max-h-[88px]" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* ── 1. ORIGINAL BOX WITH SAME SERIAL ── */}
      {variant === "box" && (
        <g>
          {/* Laptop wide retail box isometric */}
          <path d="M50 18L86 34L50 50L14 34L50 18Z" fill="#F8FAFC" stroke="#1E293B" strokeWidth="2.2" strokeLinejoin="round" />
          <path d="M14 34V64L50 80V50L14 34Z" fill="#E2E8F0" stroke="#1E293B" strokeWidth="2.2" strokeLinejoin="round" />
          <path d="M86 34V64L50 80V50L86 34Z" fill="#CBD5E1" stroke="#1E293B" strokeWidth="2.2" strokeLinejoin="round" />
          {/* Barcode / Serial Tag */}
          <g transform="translate(56, 54)">
            <rect x="0" y="0" width="24" height="12" rx="2" fill="#FFFFFF" stroke="#64748B" strokeWidth="1" />
            <line x1="3" y1="2" x2="3" y2="10" stroke="#1E293B" strokeWidth="1.2" />
            <line x1="6" y1="2" x2="6" y2="10" stroke="#1E293B" strokeWidth="0.8" />
            <line x1="10" y1="2" x2="10" y2="10" stroke="#1E293B" strokeWidth="1.5" />
            <line x1="14" y1="2" x2="14" y2="10" stroke="#1E293B" strokeWidth="0.8" />
            <line x1="18" y1="2" x2="18" y2="10" stroke="#1E293B" strokeWidth="1.2" />
          </g>
          {/* CashALL Verified Gold Ribbon Badge */}
          <circle cx="50" cy="34" r="7" fill="#FFD400" stroke="#D97706" strokeWidth="1.5" />
          <path d="M47 34L49 36L53 32" stroke="#1E293B" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </g>
      )}

      {/* ── 2. ORIGINAL CHARGER AVAILABLE ── */}
      {variant === "charger" && (
        <g>
          {/* Laptop Heavy AC Adapter Brick */}
          <rect x="20" y="24" width="44" height="28" rx="6" fill="#F8FAFC" stroke="#1E293B" strokeWidth="2.5" />
          {/* Status LED */}
          <circle cx="30" cy="32" r="2" fill="#10B981" />
          {/* Wattage mark */}
          <text x="44" y="42" fill="#64748B" fontSize="8" fontWeight="bold" fontFamily="sans-serif">
            65W+
          </text>
          {/* Thick power cables on both ends */}
          <path d="M20 38H12C8 38 6 44 8 50L10 56" stroke="#1E293B" strokeWidth="2.5" strokeLinecap="round" />
          <rect x="6" y="56" width="8" height="12" rx="2" fill="#CBD5E1" stroke="#1E293B" strokeWidth="1.5" />
          {/* DC Cable leading to laptop tip */}
          <path d="M64 38H72C78 38 82 44 80 52C78 60 70 66 60 66C48 66 42 74 46 82C50 88 64 88 74 84" stroke="#64748B" strokeWidth="2.5" strokeLinecap="round" />
          {/* MagSafe / Barrel connector head */}
          <rect x="74" y="78" width="14" height="8" rx="2" fill="#E2E8F0" stroke="#1E293B" strokeWidth="1.5" />
          <rect x="88" y="80" width="5" height="4" fill="#FFD400" stroke="#D97706" strokeWidth="1" />
        </g>
      )}

      {/* ── 3. ORIGINAL STYLUS / PEN ── */}
      {variant === "stylus" && (
        <g transform="rotate(-35 50 50)">
          <rect x="46" y="10" width="8" height="70" rx="3" fill="#1E293B" stroke="#0F172A" strokeWidth="1.5" />
          <path d="M46 80L50 92L54 80H46Z" fill="#CBD5E1" stroke="#1E293B" strokeWidth="1.2" strokeLinejoin="round" />
          <circle cx="50" cy="92" r="1" fill="#0F172A" />
          <rect x="47" y="6" width="6" height="5" rx="1" fill="#FFD400" stroke="#D97706" strokeWidth="1" />
          <rect x="48" y="55" width="4" height="12" rx="1" fill="#64748B" />
          <line x1="46" y1="18" x2="54" y2="18" stroke="#FFD400" strokeWidth="2" />
        </g>
      )}
    </svg>
  );
}

// ============================================================================
// CASHALL LAPTOP BODY CONDITION ILLUSTRATIONS (Step 7: Physical Body Condition)
// ============================================================================

export type LaptopBodyVariant =
  | "bodyscr_no"
  | "bodyscr_minor"
  | "bodyscr_major"
  | "topdent_no"
  | "topdent_upto2"
  | "topdent_more2"
  | "topdent_major"
  | "basedent_no"
  | "basedent_upto2"
  | "basedent_more2"
  | "basedent_major"
  | "hinges_no"
  | "hinges_yes"
  | "panel_no"
  | "panel_loose"
  | "panel_crack";

export function LaptopBodyIllustration({ variant }: { variant: LaptopBodyVariant }) {
  return (
    <svg viewBox="0 0 100 80" className="w-full h-full max-w-[88px] max-h-[72px]" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* ── 1. BODY SCRATCHES ── */}
      {variant === "bodyscr_no" && (
        <g>
          {/* Laptop closed lid top view */}
          <rect x="15" y="14" width="70" height="52" rx="8" fill="#F8FAFC" stroke="#1E293B" strokeWidth="2.5" />
          {/* Center Apple/Laptop Logo badge */}
          <circle cx="50" cy="40" r="8" fill="#E2E8F0" stroke="#94A3B8" strokeWidth="1.2" />
          {/* Sparkles */}
          <path d="M68 26L70 20L72 26L78 28L72 30L70 36L68 30L62 28Z" fill="#10B981" />
          <path d="M30 48L31 44L32 48L36 49L32 50L31 54L30 50L26 49Z" fill="#34D399" />
        </g>
      )}

      {variant === "bodyscr_minor" && (
        <g>
          <rect x="15" y="14" width="70" height="52" rx="8" fill="#F8FAFC" stroke="#1E293B" strokeWidth="2.5" />
          <circle cx="50" cy="40" r="8" fill="#E2E8F0" stroke="#94A3B8" strokeWidth="1.2" />
          <line x1="26" y1="26" x2="40" y2="34" stroke="#EF4444" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="62" y1="48" x2="74" y2="54" stroke="#EF4444" strokeWidth="1.5" strokeLinecap="round" />
        </g>
      )}

      {variant === "bodyscr_major" && (
        <g>
          <rect x="15" y="14" width="70" height="52" rx="8" fill="#F8FAFC" stroke="#1E293B" strokeWidth="2.5" />
          <circle cx="50" cy="40" r="8" fill="#E2E8F0" stroke="#94A3B8" strokeWidth="1.2" />
          <line x1="22" y1="22" x2="44" y2="36" stroke="#DC2626" strokeWidth="2" strokeLinecap="round" />
          <line x1="28" y1="38" x2="46" y2="48" stroke="#DC2626" strokeWidth="1.8" strokeLinecap="round" />
          <line x1="56" y1="24" x2="76" y2="40" stroke="#DC2626" strokeWidth="2" strokeLinecap="round" />
          <line x1="54" y1="50" x2="78" y2="58" stroke="#DC2626" strokeWidth="1.8" strokeLinecap="round" />
        </g>
      )}

      {/* ── 2. TOP PANEL DENTS ── */}
      {variant === "topdent_no" && (
        <g>
          <rect x="15" y="14" width="70" height="52" rx="8" fill="#F8FAFC" stroke="#1E293B" strokeWidth="2.5" />
          <circle cx="50" cy="40" r="8" fill="#E2E8F0" stroke="#94A3B8" strokeWidth="1.2" />
          <path d="M68 26L70 20L72 26L78 28L72 30L70 36L68 30L62 28Z" fill="#10B981" />
        </g>
      )}

      {variant === "topdent_upto2" && (
        <g>
          <rect x="15" y="14" width="70" height="52" rx="8" fill="#F8FAFC" stroke="#1E293B" strokeWidth="2.5" />
          <circle cx="50" cy="40" r="8" fill="#E2E8F0" stroke="#94A3B8" strokeWidth="1.2" />
          {/* 1 Minor Dent */}
          <ellipse cx="28" cy="26" rx="5" ry="3.5" fill="#FEE2E2" stroke="#EF4444" strokeWidth="1.5" />
        </g>
      )}

      {variant === "topdent_more2" && (
        <g>
          <rect x="15" y="14" width="70" height="52" rx="8" fill="#F8FAFC" stroke="#1E293B" strokeWidth="2.5" />
          <circle cx="50" cy="40" r="8" fill="#E2E8F0" stroke="#94A3B8" strokeWidth="1.2" />
          <ellipse cx="28" cy="26" rx="5" ry="3.5" fill="#FEE2E2" stroke="#EF4444" strokeWidth="1.5" />
          <ellipse cx="72" cy="30" rx="4.5" ry="3" fill="#FEE2E2" stroke="#EF4444" strokeWidth="1.5" />
          <ellipse cx="34" cy="52" rx="5" ry="3.5" fill="#FEE2E2" stroke="#EF4444" strokeWidth="1.5" />
        </g>
      )}

      {variant === "topdent_major" && (
        <g>
          <rect x="15" y="14" width="70" height="52" rx="8" fill="#F8FAFC" stroke="#1E293B" strokeWidth="2.5" />
          <circle cx="50" cy="40" r="8" fill="#E2E8F0" stroke="#94A3B8" strokeWidth="1.2" />
          {/* Deep Impact Dent */}
          <ellipse cx="32" cy="30" rx="10" ry="7" fill="#FCA5A5" stroke="#DC2626" strokeWidth="2" />
          <path d="M26 26L38 34M38 26L26 34" stroke="#991B1B" strokeWidth="1.5" strokeLinecap="round" />
        </g>
      )}

      {/* ── 3. BASE PANEL DENTS ── */}
      {variant === "basedent_no" && (
        <g>
          {/* Laptop Base underside with 4 rubber feet */}
          <rect x="15" y="14" width="70" height="52" rx="8" fill="#F1F5F9" stroke="#1E293B" strokeWidth="2.5" />
          <circle cx="24" cy="22" r="3" fill="#334155" />
          <circle cx="76" cy="22" r="3" fill="#334155" />
          <circle cx="24" cy="58" r="3" fill="#334155" />
          <circle cx="76" cy="58" r="3" fill="#334155" />
          <path d="M50 36L52 30L54 36L60 38L54 40L52 46L50 40L44 38Z" fill="#10B981" />
        </g>
      )}

      {variant === "basedent_upto2" && (
        <g>
          <rect x="15" y="14" width="70" height="52" rx="8" fill="#F1F5F9" stroke="#1E293B" strokeWidth="2.5" />
          <circle cx="24" cy="22" r="3" fill="#334155" />
          <circle cx="76" cy="22" r="3" fill="#334155" />
          <circle cx="24" cy="58" r="3" fill="#334155" />
          <circle cx="76" cy="58" r="3" fill="#334155" />
          <ellipse cx="45" cy="40" rx="6" ry="4" fill="#FEE2E2" stroke="#EF4444" strokeWidth="1.5" />
        </g>
      )}

      {variant === "basedent_more2" && (
        <g>
          <rect x="15" y="14" width="70" height="52" rx="8" fill="#F1F5F9" stroke="#1E293B" strokeWidth="2.5" />
          <circle cx="24" cy="22" r="3" fill="#334155" />
          <circle cx="76" cy="22" r="3" fill="#334155" />
          <circle cx="24" cy="58" r="3" fill="#334155" />
          <circle cx="76" cy="58" r="3" fill="#334155" />
          <ellipse cx="38" cy="34" rx="5" ry="3.5" fill="#FEE2E2" stroke="#EF4444" strokeWidth="1.5" />
          <ellipse cx="62" cy="38" rx="5" ry="3.5" fill="#FEE2E2" stroke="#EF4444" strokeWidth="1.5" />
          <ellipse cx="48" cy="50" rx="5" ry="3.5" fill="#FEE2E2" stroke="#EF4444" strokeWidth="1.5" />
        </g>
      )}

      {variant === "basedent_major" && (
        <g>
          <rect x="15" y="14" width="70" height="52" rx="8" fill="#F1F5F9" stroke="#1E293B" strokeWidth="2.5" />
          <circle cx="24" cy="22" r="3" fill="#334155" />
          <circle cx="76" cy="22" r="3" fill="#334155" />
          <circle cx="24" cy="58" r="3" fill="#334155" />
          <circle cx="76" cy="58" r="3" fill="#334155" />
          <ellipse cx="50" cy="40" rx="12" ry="8" fill="#FCA5A5" stroke="#DC2626" strokeWidth="2" />
        </g>
      )}

      {/* ── 4. LOOSE HINGES ── */}
      {variant === "hinges_no" && (
        <g>
          {/* Laptop open side view */}
          <line x1="28" y1="20" x2="48" y2="58" stroke="#1E293B" strokeWidth="3" strokeLinecap="round" /> {/* Screen */}
          <line x1="48" y1="58" x2="84" y2="58" stroke="#1E293B" strokeWidth="3" strokeLinecap="round" /> {/* Base */}
          {/* Solid Hinge circle */}
          <circle cx="48" cy="58" r="4.5" fill="#10B981" stroke="#047857" strokeWidth="1.5" />
          <path d="M60 36L62 30L64 36L70 38L64 40L62 46L60 40L54 38Z" fill="#10B981" />
        </g>
      )}

      {variant === "hinges_yes" && (
        <g>
          <line x1="28" y1="20" x2="48" y2="58" stroke="#EF4444" strokeWidth="3" strokeLinecap="round" strokeDasharray="6 3" />
          <line x1="48" y1="58" x2="84" y2="58" stroke="#1E293B" strokeWidth="3" strokeLinecap="round" />
          {/* Wobbly hinge with vibration marks */}
          <circle cx="48" cy="58" r="5" fill="#FEF2F2" stroke="#DC2626" strokeWidth="2" />
          <path d="M42 50L46 54M54 50L50 54" stroke="#DC2626" strokeWidth="2" strokeLinecap="round" />
          <path d="M34 32C38 34 38 40 34 42" stroke="#EF4444" strokeWidth="2" strokeLinecap="round" />
          <path d="M26 28C32 32 32 44 26 48" stroke="#EF4444" strokeWidth="1.8" strokeLinecap="round" />
        </g>
      )}

      {/* ── 5. CRACKED OR LOOSE PANEL ── */}
      {variant === "panel_no" && (
        <g>
          <rect x="15" y="14" width="70" height="52" rx="8" fill="#F8FAFC" stroke="#1E293B" strokeWidth="2.5" />
          <rect x="18" y="17" width="64" height="46" rx="5" stroke="#CBD5E1" strokeWidth="1.5" />
          <path d="M50 36L52 30L54 36L60 38L54 40L52 46L50 40L44 38Z" fill="#10B981" />
        </g>
      )}

      {variant === "panel_loose" && (
        <g>
          <rect x="15" y="14" width="70" height="52" rx="8" fill="#F8FAFC" stroke="#1E293B" strokeWidth="2.5" />
          {/* Loose unclipped panel popping out on right side */}
          <path d="M85 24L92 34V46L85 56" stroke="#EF4444" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M74 40H84M84 40L80 37M84 40L80 43" stroke="#EF4444" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </g>
      )}

      {variant === "panel_crack" && (
        <g>
          <rect x="15" y="14" width="70" height="52" rx="8" fill="#F8FAFC" stroke="#1E293B" strokeWidth="2.5" />
          {/* Cracked broken chassis corner */}
          <path d="M15 32L30 22M22 28L36 40L24 50" stroke="#DC2626" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="22" cy="28" r="2.5" fill="#DC2626" />
        </g>
      )}
    </svg>
  );
}
