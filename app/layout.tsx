import type { Metadata, Viewport } from "next";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
// Icon-Schrift lokal ausliefern (Local-First, kein Netzwerk nötig). Muss vor
// globals.css stehen, damit Tailwind-Größen wie text-[18px] Vorrang haben.
import "material-symbols/outlined.css";
import "./globals.css";

import { MoodSync } from "@/components/mood-sync";
import { ServiceWorker } from "@/components/service-worker";
import { TapFeedback } from "@/components/tap-feedback";
import { THEME_INIT_SCRIPT, ThemeSync } from "@/components/theme-sync";

const plusJakarta = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta",
  subsets: ["latin"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "MS Akku",
  description:
    "Dein persönliches Energie-Tagebuch. Alle Daten bleiben auf deinem Gerät.",
  applicationName: "MS Akku",
  appleWebApp: { capable: true, title: "MS Akku", statusBarStyle: "black-translucent" },
  icons: {
    icon: [
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
  },
};

export const viewport: Viewport = {
  themeColor: "#0D1518",
  colorScheme: "dark",
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    // suppressHydrationWarning: Das Start-Skript setzt data-theme, bevor React
    // übernimmt – dieser eine Unterschied zum Server-HTML ist gewollt.
    <html
      lang="de"
      className={`dark ${plusJakarta.variable} ${inter.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
      </head>
      <body>
        {children}
        <ThemeSync />
        <MoodSync />
        <ServiceWorker />
        <TapFeedback />
      </body>
    </html>
  );
}
