"use client";

import React from "react";

// ============================================================================
// CASHALL MOBILE DEFECT ILLUSTRATIONS (Step 2: Screen & Body Defects)
// ============================================================================

export type MobileDefectVariant =
  | "broken_screen"
  | "dead_spot_lines"
  | "body_dent_scratch"
  | "panel_missing";

export function MobileDefectIllustration({ variant }: { variant: MobileDefectVariant }) {
  return (
    <svg viewBox="0 0 100 100" className="w-full h-full max-w-[88px] max-h-[88px]" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* ── 1. BROKEN / SCRATCHED SCREEN ── */}
      {variant === "broken_screen" && (
        <g>
          {/* Phone chassis */}
          <rect x="26" y="10" width="48" height="80" rx="10" fill="#F8FAFC" stroke="#1E293B" strokeWidth="2.5" />
          {/* Inner Display Area */}
          <rect x="30" y="14" width="40" height="72" rx="7" fill="#0F172A" />
          {/* Punch hole camera */}
          <circle cx="50" cy="18" r="1.5" fill="#475569" />
          
          {/* Glass Shatter Lines (spiderweb fracture across OLED) */}
          <path d="M42 38L50 50L62 44" stroke="#EF4444" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M50 50L46 64L34 72" stroke="#EF4444" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M50 50L58 60L66 70" stroke="#F87171" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M50 50L32 46" stroke="#EF4444" strokeWidth="1.5" strokeLinecap="round" />
          <path d="M50 50L60 30L68 24" stroke="#F87171" strokeWidth="1.3" strokeLinecap="round" />
          <path d="M44 44L36 34" stroke="#FCA5A5" strokeWidth="1.2" strokeLinecap="round" />
          
          {/* Impact epicentre */}
          <circle cx="50" cy="50" r="3.5" fill="#EF4444" />
          <circle cx="50" cy="50" r="1.5" fill="#FFFFFF" />

          {/* CashALL Diagnostic Alert Badge */}
          <g transform="translate(62, 66)">
            <rect x="0" y="0" width="22" height="22" rx="6" fill="#FEF2F2" stroke="#EF4444" strokeWidth="1.8" />
            <path d="M11 6V12M11 15V16" stroke="#DC2626" strokeWidth="2" strokeLinecap="round" />
          </g>
        </g>
      )}

      {/* ── 2. DEAD SPOT / LINES & DISCOLORATION ── */}
      {variant === "dead_spot_lines" && (
        <g>
          {/* Phone chassis */}
          <rect x="26" y="10" width="48" height="80" rx="10" fill="#F8FAFC" stroke="#1E293B" strokeWidth="2.5" />
          {/* Display */}
          <rect x="30" y="14" width="40" height="72" rx="7" fill="#0F172A" />
          <circle cx="50" cy="18" r="1.5" fill="#475569" />

          {/* Vertical Defect Lines (Green & Magenta laser lines) */}
          <line x1="39" y1="14" x2="39" y2="86" stroke="#10B981" strokeWidth="1.8" strokeOpacity="0.95" />
          <line x1="43" y1="14" x2="43" y2="86" stroke="#EC4899" strokeWidth="1.5" strokeOpacity="0.9" />

          {/* Organic OLED Ink Bleed / Dead Spot */}
          <path d="M54 44C57 41 62 42 64 46C66 50 64 56 61 58C57 60 52 58 52 53C52 48 51 46 54 44Z" fill="#000000" stroke="#475569" strokeWidth="1.2" />
          {/* Minor secondary blotch */}
          <circle cx="58" cy="64" r="3" fill="#000000" stroke="#475569" strokeWidth="1" />

          {/* Yellow/Amber Discoloration glow */}
          <ellipse cx="48" cy="32" rx="10" ry="7" fill="#F59E0B" fillOpacity="0.35" />

          {/* Diagnostic Badge */}
          <g transform="translate(62, 66)">
            <rect x="0" y="0" width="22" height="22" rx="6" fill="#FFFBEB" stroke="#F59E0B" strokeWidth="1.8" />
            <path d="M11 6V12M11 15V16" stroke="#D97706" strokeWidth="2" strokeLinecap="round" />
          </g>
        </g>
      )}

      {/* ── 3. SCRATCH / DENT ON BODY ── */}
      {variant === "body_dent_scratch" && (
        <g>
          {/* Phone tilted back view showing chassis scuffs & corner dent */}
          <rect x="27" y="10" width="46" height="80" rx="10" fill="#E2E8F0" stroke="#1E293B" strokeWidth="2.5" />
          {/* Camera bump on back */}
          <rect x="32" y="15" width="16" height="22" rx="4" fill="#CBD5E1" stroke="#334155" strokeWidth="1.5" />
          <circle cx="40" cy="22" r="3.5" fill="#1E293B" />
          <circle cx="40" cy="30" r="3.5" fill="#1E293B" />

          {/* Corner Dent Highlight (top-right chassis crushed) */}
          <path d="M67 11C70 14 71 18 71 18" stroke="#EF4444" strokeWidth="3" strokeLinecap="round" />
          <circle cx="70" cy="14" r="2.5" fill="#EF4444" />

          {/* Surface Scratches on back glass */}
          <path d="M42 48L56 58" stroke="#64748B" strokeWidth="1.8" strokeLinecap="round" />
          <path d="M48 46L62 56" stroke="#64748B" strokeWidth="1.4" strokeLinecap="round" />
          <path d="M36 66L54 74" stroke="#EF4444" strokeWidth="1.6" strokeLinecap="round" />
          <path d="M40 70L50 78" stroke="#EF4444" strokeWidth="1.2" strokeLinecap="round" />

          {/* Impact ripples */}
          <path d="M60 70L63 68L66 71" stroke="#F59E0B" strokeWidth="1.5" strokeLinecap="round" />

          {/* Diagnostic Badge */}
          <g transform="translate(62, 66)">
            <rect x="0" y="0" width="22" height="22" rx="6" fill="#FEF2F2" stroke="#EF4444" strokeWidth="1.8" />
            <path d="M7 11L15 11M11 7L11 15" stroke="#EF4444" strokeWidth="1.8" strokeLinecap="round" />
          </g>
        </g>
      )}

      {/* ── 4. DEVICE PANEL MISSING / BROKEN ── */}
      {variant === "panel_missing" && (
        <g>
          {/* Main frame */}
          <rect x="26" y="10" width="38" height="80" rx="8" fill="#F1F5F9" stroke="#1E293B" strokeWidth="2.5" />
          {/* Detached/peeling backplate separated */}
          <path d="M64 12L74 24V76L64 88" stroke="#EF4444" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          {/* Internal chassis exposure (battery & motherboard clips visible) */}
          <rect x="32" y="24" width="24" height="34" rx="3" fill="#CBD5E1" stroke="#64748B" strokeWidth="1.2" />
          <line x1="36" y1="30" x2="52" y2="30" stroke="#94A3B8" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="36" y1="36" x2="48" y2="36" stroke="#94A3B8" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="36" y1="42" x2="50" y2="42" stroke="#94A3B8" strokeWidth="1.5" strokeLinecap="round" />

          {/* Gap arrow / Warning arrows pointing to separation */}
          <path d="M60 38L68 38M68 38L65 35M68 38L65 41" stroke="#EF4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M60 56L68 56M68 56L65 53M68 56L65 59" stroke="#EF4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />

          {/* Diagnostic Badge */}
          <g transform="translate(62, 66)">
            <rect x="0" y="0" width="22" height="22" rx="6" fill="#FEF2F2" stroke="#EF4444" strokeWidth="1.8" />
            <path d="M11 6V12M11 15V16" stroke="#DC2626" strokeWidth="2" strokeLinecap="round" />
          </g>
        </g>
      )}
    </svg>
  );
}

// ============================================================================
// CASHALL MOBILE HARDWARE ILLUSTRATIONS (Step 3: Functional Problems)
// ============================================================================

export type MobileHardwareVariant =
  | "battery_service"
  | "esim_issue"
  | "front_cam"
  | "back_cam"
  | "volume_btn"
  | "finger_touch"
  | "wifi"
  | "speaker"
  | "silent_button"
  | "face_sensor"
  | "power_button"
  | "charging_port"
  | "audio_receiver"
  | "camera_glass"
  | "microphone"
  | "bluetooth"
  | "vibrator"
  | "proximity_sensor";

export function MobileHardwareIllustration({ variant }: { variant: MobileHardwareVariant }) {
  return (
    <svg viewBox="0 0 100 100" className="w-full h-full max-w-[88px] max-h-[88px]" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* ── 1. BATTERY IN SERVICE ── */}
      {variant === "battery_service" && (
        <g>
          {/* Battery Chassis */}
          <rect x="22" y="30" width="52" height="40" rx="8" fill="#F8FAFC" stroke="#1E293B" strokeWidth="2.5" />
          <rect x="74" y="42" width="6" height="16" rx="3" fill="#1E293B" />
          {/* Degraded battery bar (<80%) */}
          <rect x="26" y="34" width="16" height="32" rx="4" fill="#EF4444" />
          {/* Warning Icon Inside */}
          <circle cx="55" cy="50" r="10" fill="#FEF2F2" stroke="#DC2626" strokeWidth="1.8" />
          <path d="M55 45V50M55 53.5V54.5" stroke="#DC2626" strokeWidth="2" strokeLinecap="round" />
          {/* Service percentage tag */}
          <g transform="translate(44, 76)">
            <rect x="0" y="0" width="40" height="16" rx="4" fill="#1E293B" />
            <text x="20" y="11.5" fill="#FBBF24" fontSize="8.5" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">
              &lt; 80%
            </text>
          </g>
        </g>
      )}

      {/* ── 2. e-SIM / CELLULAR ISSUE ── */}
      {variant === "esim_issue" && (
        <g>
          {/* Cellular Tower Antenna */}
          <path d="M50 20V68M40 76L50 68L60 76" stroke="#1E293B" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          {/* Radio Signal Arcs */}
          <path d="M34 32C42 26 58 26 66 32" stroke="#94A3B8" strokeWidth="2" strokeLinecap="round" />
          <path d="M26 24C40 14 60 14 74 24" stroke="#CBD5E1" strokeWidth="2" strokeLinecap="round" />
          {/* SIM Card chip outline */}
          <path d="M20 54H36V78H20V54Z" fill="#FEF3C7" stroke="#F59E0B" strokeWidth="1.8" />
          <path d="M24 60H32M24 66H32M24 72H32" stroke="#D97706" strokeWidth="1.2" />
          {/* Strike-through slash */}
          <circle cx="68" cy="46" r="14" fill="#FEF2F2" stroke="#EF4444" strokeWidth="2" />
          <line x1="58" y1="36" x2="78" y2="56" stroke="#DC2626" strokeWidth="2.5" strokeLinecap="round" />
        </g>
      )}

      {/* ── 3. FRONT CAMERA NOT WORKING ── */}
      {variant === "front_cam" && (
        <g>
          {/* Phone Upper Bezel */}
          <rect x="22" y="14" width="56" height="72" rx="12" fill="#F8FAFC" stroke="#1E293B" strokeWidth="2.5" />
          <rect x="26" y="18" width="48" height="64" rx="8" fill="#0F172A" />
          {/* Dynamic Island / Punch Hole */}
          <rect x="40" y="24" width="20" height="7" rx="3.5" fill="#1E293B" />
          <circle cx="45" cy="27.5" r="2" fill="#38BDF8" />
          {/* Diagnostic Reticle over Front Lens */}
          <circle cx="45" cy="27.5" r="8" stroke="#EF4444" strokeWidth="1.8" strokeDasharray="3 2" />
          <circle cx="50" cy="54" r="16" stroke="#EF4444" strokeWidth="2" />
          <circle cx="50" cy="54" r="7" fill="#FEF2F2" stroke="#EF4444" strokeWidth="1.8" />
          {/* Red warning cross over lens */}
          <path d="M43 47L57 61M57 47L43 61" stroke="#DC2626" strokeWidth="2.2" strokeLinecap="round" />
        </g>
      )}

      {/* ── 4. BACK CAMERA NOT WORKING ── */}
      {variant === "back_cam" && (
        <g>
          {/* Phone Back Housing */}
          <rect x="22" y="12" width="56" height="76" rx="12" fill="#F1F5F9" stroke="#1E293B" strokeWidth="2.5" />
          {/* Camera Island Matrix */}
          <rect x="26" y="16" width="28" height="34" rx="8" fill="#1E293B" />
          {/* Lenses with optics */}
          <circle cx="34" cy="25" r="4.5" fill="#334155" stroke="#38BDF8" strokeWidth="1.2" />
          <circle cx="46" cy="25" r="4.5" fill="#334155" stroke="#38BDF8" strokeWidth="1.2" />
          <circle cx="40" cy="38" r="4.5" fill="#334155" stroke="#38BDF8" strokeWidth="1.2" />
          <circle cx="46" cy="40" r="1.5" fill="#F59E0B" /> {/* Flash */}
          {/* Failure Alert Ring */}
          <circle cx="64" cy="58" r="16" fill="#FEF2F2" stroke="#EF4444" strokeWidth="2" />
          <path d="M56 50L72 66M72 50L56 66" stroke="#DC2626" strokeWidth="2.4" strokeLinecap="round" />
        </g>
      )}

      {/* ── 5. VOLUME BUTTON NOT WORKING ── */}
      {variant === "volume_btn" && (
        <g>
          {/* Side view of Smartphone */}
          <rect x="42" y="14" width="20" height="72" rx="6" fill="#F8FAFC" stroke="#1E293B" strokeWidth="2.5" />
          {/* Volume Up & Down Buttons on left spine */}
          <rect x="38" y="28" width="5" height="14" rx="2" fill="#EF4444" stroke="#DC2626" strokeWidth="1.5" />
          <rect x="38" y="46" width="5" height="14" rx="2" fill="#EF4444" stroke="#DC2626" strokeWidth="1.5" />
          {/* Plus and Minus indicators */}
          <path d="M26 35H34M30 31V39" stroke="#EF4444" strokeWidth="2" strokeLinecap="round" />
          <path d="M26 53H34" stroke="#EF4444" strokeWidth="2" strokeLinecap="round" />
          {/* Acoustic Wave with strike */}
          <circle cx="68" cy="45" r="14" fill="#FEF2F2" stroke="#EF4444" strokeWidth="1.8" />
          <path d="M63 40L73 50M73 40L63 50" stroke="#DC2626" strokeWidth="2" strokeLinecap="round" />
        </g>
      )}

      {/* ── 6. FINGER TOUCH NOT WORKING ── */}
      {variant === "finger_touch" && (
        <g>
          {/* Phone screen */}
          <rect x="24" y="12" width="52" height="76" rx="10" fill="#0F172A" stroke="#1E293B" strokeWidth="2.5" />
          {/* Fingerprint Biometric Arcs */}
          <path d="M42 56C42 50 45 46 50 46C55 46 58 50 58 56" stroke="#38BDF8" strokeWidth="2" strokeLinecap="round" />
          <path d="M38 58C38 48 43 42 50 42C57 42 62 48 62 58" stroke="#38BDF8" strokeWidth="1.8" strokeLinecap="round" />
          <path d="M34 60C34 46 41 38 50 38C59 38 66 46 66 60" stroke="#38BDF8" strokeWidth="1.5" strokeLinecap="round" />
          <path d="M46 60C46 54 48 52 50 52C52 52 54 54 54 60" stroke="#38BDF8" strokeWidth="1.8" strokeLinecap="round" />
          {/* Error Cross */}
          <circle cx="66" cy="66" r="14" fill="#FEF2F2" stroke="#EF4444" strokeWidth="2" />
          <path d="M59 59L73 73M73 59L59 73" stroke="#DC2626" strokeWidth="2.2" strokeLinecap="round" />
        </g>
      )}

      {/* ── 7. WI-FI NOT WORKING ── */}
      {variant === "wifi" && (
        <g>
          {/* Wi-Fi concentric arcs */}
          <circle cx="50" cy="72" r="3.5" fill="#EF4444" />
          <path d="M40 62C46 57 54 57 60 62" stroke="#EF4444" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M30 52C42 42 58 42 70 52" stroke="#F87171" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M20 42C38 28 62 28 80 42" stroke="#FCA5A5" strokeWidth="2.5" strokeLinecap="round" />
          {/* Diagonal Strikethrough Line */}
          <line x1="22" y1="24" x2="78" y2="80" stroke="#DC2626" strokeWidth="3.5" strokeLinecap="round" />
        </g>
      )}

      {/* ── 8. SPEAKER FAULTY ── */}
      {variant === "speaker" && (
        <g>
          {/* Speaker cone chassis */}
          <path d="M24 40H36L48 28V72L36 60H24V40Z" fill="#F8FAFC" stroke="#1E293B" strokeWidth="2.5" strokeLinejoin="round" />
          {/* Sound waves crackling / distorted */}
          <path d="M56 38C62 44 62 56 56 62" stroke="#EF4444" strokeWidth="2.2" strokeLinecap="round" strokeDasharray="3 2" />
          <path d="M64 30C74 40 74 60 64 70" stroke="#EF4444" strokeWidth="2.2" strokeLinecap="round" strokeDasharray="4 2" />
          {/* Electric spark / crackle defect */}
          <path d="M72 44L78 40L75 48L82 46L76 58" stroke="#DC2626" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
        </g>
      )}

      {/* ── 9. SILENT BUTTON NOT WORKING ── */}
      {variant === "silent_button" && (
        <g>
          {/* Phone Spine with Alert Slider Switch */}
          <rect x="42" y="14" width="16" height="72" rx="5" fill="#F8FAFC" stroke="#1E293B" strokeWidth="2.5" />
          {/* Slider switch with orange/red toggle line */}
          <rect x="38" y="26" width="5" height="12" rx="2" fill="#EF4444" stroke="#DC2626" strokeWidth="1.2" />
          {/* Bell Icon with Slash */}
          <path d="M62 40C62 34 66 30 70 30C74 30 78 34 78 40V48L82 52H58L62 48V40Z" fill="#FFFBEB" stroke="#F59E0B" strokeWidth="2" strokeLinejoin="round" />
          <circle cx="70" cy="55" r="2.5" fill="#F59E0B" />
          {/* Strikethrough */}
          <line x1="56" y1="32" x2="84" y2="58" stroke="#DC2626" strokeWidth="2.5" strokeLinecap="round" />
        </g>
      )}

      {/* ── 10. FACE SENSOR NOT WORKING ── */}
      {variant === "face_sensor" && (
        <g>
          {/* Biometric Face Target Brackets */}
          <path d="M26 30V24H32" stroke="#EF4444" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M74 30V24H68" stroke="#EF4444" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M26 70V76H32" stroke="#EF4444" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M74 70V76H68" stroke="#EF4444" strokeWidth="2.5" strokeLinecap="round" />
          {/* Face Silhouette */}
          <ellipse cx="50" cy="46" rx="14" ry="17" fill="#FEF2F2" stroke="#DC2626" strokeWidth="2" />
          {/* Eyes & Smile */}
          <circle cx="44" cy="44" r="2" fill="#DC2626" />
          <circle cx="56" cy="44" r="2" fill="#DC2626" />
          <path d="M44 54C47 57 53 57 56 54" stroke="#DC2626" strokeWidth="2" strokeLinecap="round" />
          {/* Laser scanning line broken */}
          <line x1="24" y1="50" x2="76" y2="50" stroke="#DC2626" strokeWidth="1.8" strokeDasharray="3 2" />
        </g>
      )}

      {/* ── 11. POWER BUTTON NOT WORKING ── */}
      {variant === "power_button" && (
        <g>
          {/* Phone Spine with highlighted power lock key */}
          <rect x="42" y="14" width="18" height="72" rx="6" fill="#F8FAFC" stroke="#1E293B" strokeWidth="2.5" />
          <rect x="59" y="32" width="5" height="18" rx="2" fill="#EF4444" stroke="#DC2626" strokeWidth="1.5" />
          {/* Power Symbol with alert cross */}
          <circle cx="28" cy="48" r="16" fill="#FEF2F2" stroke="#EF4444" strokeWidth="2" />
          <path d="M24 43A8 8 0 1 0 32 43" stroke="#DC2626" strokeWidth="2.2" strokeLinecap="round" />
          <line x1="28" y1="36" x2="28" y2="46" stroke="#DC2626" strokeWidth="2.2" strokeLinecap="round" />
          {/* Red indicator arrow pointing to key */}
          <path d="M46 48H55M55 48L51 45M55 48L51 51" stroke="#EF4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </g>
      )}

      {/* ── 12. CHARGING PORT NOT WORKING ── */}
      {variant === "charging_port" && (
        <g>
          {/* Smartphone Bottom Profile */}
          <rect x="18" y="24" width="64" height="20" rx="8" fill="#F8FAFC" stroke="#1E293B" strokeWidth="2.5" />
          {/* USB-C Port Oval */}
          <rect x="40" y="30" width="20" height="8" rx="4" fill="#0F172A" stroke="#EF4444" strokeWidth="1.8" />
          <rect x="45" y="33" width="10" height="2" rx="1" fill="#F59E0B" />
          {/* Cable plug approaching */}
          <rect x="42" y="56" width="16" height="20" rx="3" fill="#E2E8F0" stroke="#1E293B" strokeWidth="2" />
          <path d="M46 56V48H54V56" fill="#94A3B8" stroke="#1E293B" strokeWidth="1.5" />
          <line x1="50" y1="76" x2="50" y2="88" stroke="#1E293B" strokeWidth="2.5" strokeLinecap="round" />
          {/* Broken Lightning symbol between plug & port */}
          <path d="M53 38L47 46H52L49 54L57 44H51L53 38Z" fill="#EF4444" stroke="#DC2626" strokeWidth="1" strokeLinejoin="round" />
        </g>
      )}

      {/* ── 13. AUDIO RECEIVER (EARPIECE) NOT WORKING ── */}
      {variant === "audio_receiver" && (
        <g>
          {/* Top Phone Bezel */}
          <rect x="20" y="20" width="60" height="34" rx="10" fill="#F8FAFC" stroke="#1E293B" strokeWidth="2.5" />
          {/* Ear Speaker Micro-slit */}
          <rect x="36" y="28" width="28" height="4" rx="2" fill="#0F172A" stroke="#EF4444" strokeWidth="1.5" />
          {/* Call / Ear Glyph with muted waves */}
          <g transform="translate(32, 48)">
            <circle cx="18" cy="18" r="16" fill="#FEF2F2" stroke="#EF4444" strokeWidth="2" />
            <path d="M12 12C12 21 15 24 24 24" stroke="#DC2626" strokeWidth="2" strokeLinecap="round" />
            <line x1="8" y1="8" x2="28" y2="28" stroke="#DC2626" strokeWidth="2.5" strokeLinecap="round" />
          </g>
        </g>
      )}

      {/* ── 14. CAMERA GLASS BROKEN ── */}
      {variant === "camera_glass" && (
        <g>
          {/* Camera Lens Housing Circle */}
          <circle cx="50" cy="50" r="30" fill="#0F172A" stroke="#1E293B" strokeWidth="3" />
          <circle cx="50" cy="50" r="22" fill="#1E293B" stroke="#334155" strokeWidth="1.5" />
          <circle cx="50" cy="50" r="14" fill="#0F172A" />
          <circle cx="46" cy="46" r="4" fill="#38BDF8" fillOpacity="0.8" />
          {/* Broken Glass Spider Fracture running through the optic */}
          <path d="M26 36L44 48L72 32" stroke="#EF4444" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M44 48L52 64L38 74" stroke="#EF4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M44 48L64 56L74 68" stroke="#F87171" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M52 64L62 76" stroke="#FCA5A5" strokeWidth="1.4" strokeLinecap="round" />
        </g>
      )}

      {/* ── 15. MICROPHONE NOT WORKING ── */}
      {variant === "microphone" && (
        <g>
          {/* Microphone Body */}
          <rect x="42" y="24" width="16" height="28" rx="8" fill="#F8FAFC" stroke="#1E293B" strokeWidth="2.5" />
          {/* Diaphragm Stand */}
          <path d="M34 44C34 53 41 60 50 60C59 60 66 53 66 44" stroke="#1E293B" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="50" y1="60" x2="50" y2="74" stroke="#1E293B" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="38" y1="74" x2="62" y2="74" stroke="#1E293B" strokeWidth="2.5" strokeLinecap="round" />
          {/* Microphone Grille Lines */}
          <line x1="46" y1="32" x2="54" y2="32" stroke="#64748B" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="46" y1="38" x2="54" y2="38" stroke="#64748B" strokeWidth="1.5" strokeLinecap="round" />
          {/* Strikethrough slash */}
          <circle cx="68" cy="40" r="14" fill="#FEF2F2" stroke="#EF4444" strokeWidth="2" />
          <line x1="58" y1="30" x2="78" y2="50" stroke="#DC2626" strokeWidth="2.5" strokeLinecap="round" />
        </g>
      )}

      {/* ── 16. BLUETOOTH NOT WORKING ── */}
      {variant === "bluetooth" && (
        <g>
          {/* Bluetooth Geometric Glyphs */}
          <path d="M42 32L58 46L50 54V22L58 30L42 44" stroke="#1E293B" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
          {/* Wave transmission lines */}
          <path d="M66 32C70 38 70 46 66 52" stroke="#94A3B8" strokeWidth="2" strokeLinecap="round" />
          <path d="M74 26C80 36 80 50 74 60" stroke="#CBD5E1" strokeWidth="2" strokeLinecap="round" />
          {/* Defect Strikethrough */}
          <circle cx="50" cy="42" r="26" stroke="#EF4444" strokeWidth="2.5" />
          <line x1="32" y1="24" x2="68" y2="60" stroke="#DC2626" strokeWidth="3" strokeLinecap="round" />
        </g>
      )}

      {/* ── 17. VIBRATOR IS NOT WORKING ── */}
      {variant === "vibrator" && (
        <g>
          {/* Phone Body */}
          <rect x="36" y="16" width="28" height="68" rx="7" fill="#F8FAFC" stroke="#1E293B" strokeWidth="2.5" />
          <circle cx="50" cy="24" r="1.5" fill="#475569" />
          {/* Haptic vibration zig-zag ripples on both sides */}
          <path d="M22 28L28 36L22 44L28 52L22 60L28 68" stroke="#EF4444" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M78 28L72 36L78 44L72 52L78 60L72 68" stroke="#EF4444" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          {/* Internal haptic motor icon */}
          <circle cx="50" cy="50" r="7" fill="#FEF2F2" stroke="#DC2626" strokeWidth="1.8" />
          <line x1="44" y1="44" x2="56" y2="56" stroke="#DC2626" strokeWidth="2" strokeLinecap="round" />
        </g>
      )}

      {/* ── 18. PROXIMITY SENSOR NOT WORKING ── */}
      {variant === "proximity_sensor" && (
        <g>
          {/* Phone silhouette */}
          <rect x="22" y="16" width="46" height="72" rx="10" fill="#F8FAFC" stroke="#1E293B" strokeWidth="2.5" />
          {/* Top Sensor Cluster */}
          <circle cx="45" cy="24" r="2.5" fill="#EF4444" />
          {/* Hand/Ear silhouette hovering near screen */}
          <path d="M64 36C68 34 76 38 78 46C80 54 74 62 66 66" stroke="#1E293B" strokeWidth="2.2" strokeLinecap="round" />
          {/* Infrared Proximity Beam waves crossed out */}
          <path d="M52 24C58 24 64 28 66 34" stroke="#EF4444" strokeWidth="2" strokeLinecap="round" strokeDasharray="3 2" />
          <line x1="40" y1="18" x2="72" y2="50" stroke="#DC2626" strokeWidth="2.8" strokeLinecap="round" />
        </g>
      )}
    </svg>
  );
}

// ============================================================================
// CASHALL MOBILE ACCESSORIES (Step 4: Accessories)
// ============================================================================

export type MobileAccessoryVariant = "box" | "charger" | "spen";

export function MobileAccessoryIllustration({ variant }: { variant: MobileAccessoryVariant }) {
  return (
    <svg viewBox="0 0 100 100" className="w-full h-full max-w-[88px] max-h-[88px]" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* ── 1. ORIGINAL BOX WITH SAME IMEI ── */}
      {variant === "box" && (
        <g>
          {/* 3D Isometric Retail Box */}
          <path d="M50 16L82 32L50 48L18 32L50 16Z" fill="#F8FAFC" stroke="#1E293B" strokeWidth="2.2" strokeLinejoin="round" />
          <path d="M18 32V66L50 82V48L18 32Z" fill="#E2E8F0" stroke="#1E293B" strokeWidth="2.2" strokeLinejoin="round" />
          <path d="M82 32V66L50 82V48L82 32Z" fill="#CBD5E1" stroke="#1E293B" strokeWidth="2.2" strokeLinejoin="round" />
          
          {/* Box Seam & Lid line */}
          <line x1="18" y1="40" x2="50" y2="56" stroke="#94A3B8" strokeWidth="1.5" />
          <line x1="82" y1="40" x2="50" y2="56" stroke="#94A3B8" strokeWidth="1.5" />

          {/* Barcode Label on Side Panel */}
          <g transform="translate(54, 55)">
            <rect x="0" y="0" width="22" height="12" rx="2" fill="#FFFFFF" stroke="#64748B" strokeWidth="1" />
            <line x1="3" y1="2" x2="3" y2="10" stroke="#1E293B" strokeWidth="1.2" />
            <line x1="6" y1="2" x2="6" y2="10" stroke="#1E293B" strokeWidth="0.8" />
            <line x1="9" y1="2" x2="9" y2="10" stroke="#1E293B" strokeWidth="1.5" />
            <line x1="13" y1="2" x2="13" y2="10" stroke="#1E293B" strokeWidth="0.8" />
            <line x1="16" y1="2" x2="16" y2="10" stroke="#1E293B" strokeWidth="1.2" />
            <line x1="19" y1="2" x2="19" y2="10" stroke="#1E293B" strokeWidth="1" />
          </g>

          {/* CashALL Verified Gold Ribbon Badge */}
          <circle cx="50" cy="32" r="7" fill="#FFD400" stroke="#D97706" strokeWidth="1.5" />
          <path d="M47 32L49 34L53 30" stroke="#1E293B" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </g>
      )}

      {/* ── 2. ORIGINAL CHARGER OF DEVICE ── */}
      {variant === "charger" && (
        <g>
          {/* Fast Charger Power Adapter Brick */}
          <rect x="22" y="24" width="36" height="36" rx="8" fill="#F8FAFC" stroke="#1E293B" strokeWidth="2.5" />
          {/* Wall power pins */}
          <rect x="14" y="32" width="8" height="4" rx="1.5" fill="#CBD5E1" stroke="#1E293B" strokeWidth="1.5" />
          <rect x="14" y="44" width="8" height="4" rx="1.5" fill="#CBD5E1" stroke="#1E293B" strokeWidth="1.5" />
          {/* USB-C Output Port */}
          <rect x="52" y="38" width="6" height="8" rx="3" fill="#0F172A" />
          {/* Charging Lightning Bolt Icon on Adapter */}
          <path d="M40 34L35 43H41L38 52L46 41H40L40 34Z" fill="#FFD400" stroke="#D97706" strokeWidth="1" strokeLinejoin="round" />

          {/* Braided Coiled Charging Cable */}
          <path d="M58 42C68 42 74 48 74 58C74 68 64 74 54 74C42 74 36 80 40 86C44 90 56 90 68 86" stroke="#64748B" strokeWidth="2.5" strokeLinecap="round" />
          {/* USB-C Cable Head */}
          <rect x="68" y="76" width="14" height="8" rx="2" fill="#E2E8F0" stroke="#1E293B" strokeWidth="1.5" />
          <rect x="82" y="78" width="5" height="4" rx="1" fill="#94A3B8" stroke="#1E293B" strokeWidth="1" />
        </g>
      )}

      {/* ── 3. ORIGINAL S PEN / STYLUS ── */}
      {variant === "spen" && (
        <g transform="rotate(-35 50 50)">
          {/* Stylus Shaft */}
          <rect x="46" y="10" width="8" height="70" rx="3" fill="#1E293B" stroke="#0F172A" strokeWidth="1.5" />
          {/* Precision Tip */}
          <path d="M46 80L50 92L54 80H46Z" fill="#CBD5E1" stroke="#1E293B" strokeWidth="1.2" strokeLinejoin="round" />
          <circle cx="50" cy="92" r="1" fill="#0F172A" />
          {/* Clicker top cap */}
          <rect x="47" y="6" width="6" height="5" rx="1" fill="#FFD400" stroke="#D97706" strokeWidth="1" />
          {/* Side action button */}
          <rect x="48" y="55" width="4" height="12" rx="1" fill="#64748B" />
          {/* Gold accent ring */}
          <line x1="46" y1="18" x2="54" y2="18" stroke="#FFD400" strokeWidth="2" />
        </g>
      )}
    </svg>
  );
}
