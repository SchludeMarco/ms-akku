import type { Metadata, Viewport } from "next";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
// Icon-Schrift lokal ausliefern (Local-First, kein Netzwerk nötig). Muss vor
// globals.css stehen, damit Tailwind-Größen wie text-[18px] Vorrang haben.
import "material-symbols/outlined.css";
import "./globals.css";

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
    <html
      lang="de"
      className={`dark ${plusJakarta.variable} ${inter.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}
