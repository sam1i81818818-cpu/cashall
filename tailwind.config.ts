import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          yellow: "#FFD400",
          yellowHover: "#E6BE00",
          black: "#050505",
          dark: "#111111",
          cardDark: "#181818",
          bg: "#F8FAFC",
          border: "#E2E8F0",
          muted: "#64748B",
          success: "#059669",
          error: "#DC2626",
        },
        stitch: {
          canvas: "#F8FAFC",
          surface: "#FFFFFF",
          subtle: "#F1F5F9",
          border: "#E2E8F0",
          borderGhost: "rgba(226, 232, 240, 0.7)",
          ink: "#09090B",
          inkSecondary: "#334155",
          inkMuted: "#64748B",
          emerald: "#059669",
          emeraldBg: "#ECFDF5",
          amber: "#D97706",
          amberBg: "#FFFBEB",
          accentGold: "#FFD400",
        },
      },
      fontFamily: {
        sans: ["Inter", "-apple-system", "BlinkMacSystemFont", "sans-serif"],
        heading: ["Manrope", "Inter", "-apple-system", "BlinkMacSystemFont", "sans-serif"],
      },
      boxShadow: {
        premium: "0 10px 30px -10px rgba(0, 0, 0, 0.08)",
        yellowGlow: "0 10px 25px -5px rgba(255, 212, 0, 0.35)",
        subtleCard: "0 4px 20px 0 rgba(0, 0, 0, 0.05)",
        stitch: "0 1px 3px 0 rgba(15, 23, 42, 0.04), 0 1px 2px -1px rgba(15, 23, 42, 0.04)",
        stitchElevated: "0 12px 32px -8px rgba(15, 23, 42, 0.08), 0 4px 12px -2px rgba(15, 23, 42, 0.04)",
        stitchCard: "0 4px 20px -2px rgba(15, 23, 42, 0.04)",
      },
    },
  },
  plugins: [],
};

export default config;
