/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#0B1220",
        surface: "#111827",
        "surface-2": "#1a2235",
        "surface-3": "#1f2b40",
        border: "#1e2d45",
        "border-2": "#243450",
        primary: "#06b6d4",
        "primary-dark": "#0891b2",
        "primary-glow": "rgba(6,182,212,0.15)",
        success: "#10b981",
        "success-glow": "rgba(16,185,129,0.15)",
        warning: "#f59e0b",
        "warning-glow": "rgba(245,158,11,0.15)",
        danger: "#ef4444",
        "danger-glow": "rgba(239,68,68,0.15)",
        muted: "#64748b",
        "text-primary": "#e2e8f0",
        "text-secondary": "#94a3b8",
        "text-muted": "#475569",
      },
      fontFamily: {
        sans: ["var(--font-geist-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-geist-mono)", "monospace"],
      },
      backgroundImage: {
        "grid-pattern": "linear-gradient(rgba(6,182,212,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(6,182,212,0.03) 1px, transparent 1px)",
        "glow-conic": "conic-gradient(from 180deg at 50% 50%, #06b6d420 0deg, #0B122000 360deg)",
      },
      backgroundSize: {
        "grid-size": "40px 40px",
      },
      animation: {
        "pulse-slow": "pulse 3s ease-in-out infinite",
        "shimmer": "shimmer 2s linear infinite",
        "fade-in": "fadeIn 0.3s ease-in-out",
        "slide-in": "slideIn 0.3s ease-out",
        "ping-slow": "ping 2s cubic-bezier(0, 0, 0.2, 1) infinite",
      },
      keyframes: {
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        fadeIn: {
          "0%": { opacity: "0", transform: "translateY(4px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        slideIn: {
          "0%": { opacity: "0", transform: "translateX(-8px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
      },
      boxShadow: {
        "glow-cyan": "0 0 20px rgba(6,182,212,0.15), 0 0 40px rgba(6,182,212,0.05)",
        "glow-green": "0 0 20px rgba(16,185,129,0.15)",
        "glow-red": "0 0 20px rgba(239,68,68,0.15)",
        "card": "0 1px 3px rgba(0,0,0,0.4), 0 1px 2px rgba(0,0,0,0.3)",
        "card-hover": "0 4px 20px rgba(0,0,0,0.4), 0 0 0 1px rgba(6,182,212,0.1)",
      },
    },
  },
  plugins: [],
};
