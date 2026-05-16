import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Dark developer-focused theme
        background: "#0a0b0d",      // Near-black background
        surface: "#111318",         // Card/panel background
        border: "#1e2330",          // Subtle borders
        accent: "#1aad7e",          // Teal accent (primary CTA)
        "accent-hover": "#15926a",  // Darker teal for hover
        secondary: "#7b72f0",       // Purple secondary accent
        text: {
          primary: "#e5e5e5",       // High-contrast text
          secondary: "#a3a3a3",     // Muted text
          tertiary: "#737373",      // Disabled/placeholder text
        },
        severity: {
          high: "#ef4444",          // Red for high-severity gotchas
          medium: "#f59e0b",        // Amber for medium-severity
          low: "#6b7280",           // Gray for low-severity
        },
        confidence: {
          high: "#10b981",          // Green for ≥0.8
          medium: "#f59e0b",        // Yellow for 0.6-0.79
          low: "#ef4444",           // Red for <0.6
        },
      },
      fontFamily: {
        mono: ["JetBrains Mono", "monospace"],
        sans: ["Syne", "system-ui", "sans-serif"],
      },
      fontSize: {
        "code-sm": ["0.875rem", { lineHeight: "1.5" }],
        "code-base": ["1rem", { lineHeight: "1.5" }],
      },
      borderRadius: {
        card: "0.75rem",
        button: "0.5rem",
      },
      boxShadow: {
        card: "0 4px 6px -1px rgba(0, 0, 0, 0.3), 0 2px 4px -1px rgba(0, 0, 0, 0.2)",
        "card-hover": "0 10px 15px -3px rgba(0, 0, 0, 0.4), 0 4px 6px -2px rgba(0, 0, 0, 0.3)",
      },
      animation: {
        "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      },
    },
  },
  plugins: [],
};

export default config;

// Made with Bob
