import type { Config } from "tailwindcss";
import animate from "tailwindcss-animate";

/**
 * Stitch Design Tokens – Source of Truth.
 * Die Token-Namen entsprechen 1:1 denen in
 * shared/stitch_ms_akku_app_prototype/*_dark_mode/code.html, damit sich
 * Klassen aus den Stitch-Screens unverändert übernehmen lassen.
 * Die Rohwerte liegen als RGB-Kanäle in app/globals.css, damit
 * Tailwind-Opazitäten (z. B. bg-primary/15) funktionieren.
 */
const token = (name: string) => `rgb(var(--${name}) / <alpha-value>)`;

const stitchColors = [
  "surface",
  "surface-dim",
  "surface-bright",
  "surface-container-lowest",
  "surface-container-low",
  "surface-container",
  "surface-container-high",
  "surface-container-highest",
  "surface-variant",
  "surface-tint",
  "on-surface",
  "on-surface-variant",
  "inverse-surface",
  "inverse-on-surface",
  "outline",
  "outline-variant",
  "on-primary",
  "primary-container",
  "on-primary-container",
  "inverse-primary",
  "primary-fixed",
  "primary-fixed-dim",
  "on-primary-fixed",
  "on-primary-fixed-variant",
  "on-secondary",
  "secondary-container",
  "on-secondary-container",
  "secondary-fixed",
  "secondary-fixed-dim",
  "on-secondary-fixed",
  "on-secondary-fixed-variant",
  "tertiary",
  "on-tertiary",
  "tertiary-container",
  "on-tertiary-container",
  "tertiary-fixed",
  "tertiary-fixed-dim",
  "on-tertiary-fixed",
  "on-tertiary-fixed-variant",
  "error",
  "on-error",
  "error-container",
  "on-error-container",
  "pacing",
  "pacing-soft",
  "energy-high",
  "energy-mid",
  "energy-low",
  "energy-high-text",
  "energy-mid-text",
  "energy-low-text",
  "on-energy",
  "cta",
  "on-cta",
  "action",
  "on-action",
  "fab",
  "on-fab",
  "nav-active",
] as const;

const config: Config = {
  darkMode: ["class"],
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "1.25rem",
    },
    extend: {
      colors: {
        ...Object.fromEntries(stitchColors.map((name) => [name, token(name)])),

        // shadcn/ui-Aliasse, auf die Stitch-Tokens abgebildet
        background: token("surface"),
        foreground: token("on-surface"),
        primary: {
          DEFAULT: token("primary"),
          foreground: token("on-primary"),
        },
        secondary: {
          DEFAULT: token("secondary"),
          foreground: token("on-secondary"),
        },
        card: {
          DEFAULT: token("surface-container"),
          foreground: token("on-surface"),
        },
        popover: {
          DEFAULT: token("surface-container-high"),
          foreground: token("on-surface"),
        },
        muted: {
          DEFAULT: token("surface-container-high"),
          foreground: token("on-surface-variant"),
        },
        accent: {
          DEFAULT: token("surface-container-high"),
          foreground: token("on-surface"),
        },
        destructive: {
          DEFAULT: token("error"),
          foreground: token("on-error"),
        },
        border: token("outline-variant"),
        input: token("outline-variant"),
        ring: token("primary"),
      },
      fontFamily: {
        sans: [
          "var(--font-plus-jakarta)",
          "var(--font-inter)",
          "system-ui",
          "sans-serif",
        ],
      },
      fontSize: {
        "display-lg": [
          "32px",
          { lineHeight: "40px", letterSpacing: "-0.02em", fontWeight: "700" },
        ],
        "headline-xl": [
          "40px",
          { lineHeight: "52px", letterSpacing: "-0.02em", fontWeight: "700" },
        ],
        "headline-xl-mobile": [
          "30px",
          { lineHeight: "38px", letterSpacing: "-0.01em", fontWeight: "700" },
        ],
        "headline-lg": [
          "32px",
          { lineHeight: "42px", letterSpacing: "-0.015em", fontWeight: "600" },
        ],
        "headline-lg-mobile": [
          "24px",
          { lineHeight: "32px", letterSpacing: "-0.01em", fontWeight: "600" },
        ],
        "headline-md": ["22px", { lineHeight: "30px", fontWeight: "600" }],
        "headline-sm": ["18px", { lineHeight: "26px", fontWeight: "600" }],
        "body-lg": ["18px", { lineHeight: "28px", fontWeight: "400" }],
        "body-md": ["16px", { lineHeight: "26px", fontWeight: "400" }],
        "body-sm": ["14px", { lineHeight: "22px", fontWeight: "400" }],
        "label-lg": [
          "16px",
          { lineHeight: "24px", letterSpacing: "0.01em", fontWeight: "600" },
        ],
        "label-md": [
          "14px",
          { lineHeight: "20px", letterSpacing: "0.01em", fontWeight: "500" },
        ],
        "label-sm": [
          "12px",
          { lineHeight: "18px", letterSpacing: "0.02em", fontWeight: "500" },
        ],
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      spacing: {
        margin: "1.25rem",
        gutter: "1rem",
        "space-xs": "0.375rem",
        "space-sm": "0.75rem",
        "space-md": "1.25rem",
        "space-lg": "2rem",
        "space-xl": "3rem",
        // Touch Targets: mindestens 48–56 px
        touch: "3rem",
        "touch-lg": "3.5rem",
      },
      minHeight: {
        touch: "3rem",
        "touch-lg": "3.5rem",
      },
      minWidth: {
        touch: "3rem",
        "touch-lg": "3.5rem",
      },
      boxShadow: {
        // Sanftes Teal-Leuchten statt harter Schlagschatten
        glow: "0 8px 32px -4px rgb(45 212 191 / 0.12)",
      },
    },
  },
  plugins: [animate],
};

export default config;
