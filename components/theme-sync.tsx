"use client";

import { useEffect } from "react";

import { SETTINGS_KEY, useSettingsStore, type Theme } from "@/lib/stores/settings-store";

/** Farbe der Browser-Leiste je Erscheinungsbild (= jeweiliger Hintergrund). */
const THEME_COLOR: Record<Theme, string> = { dark: "#0D1518", pastel: "#E9F0EC" };

/**
 * Setzt das gewählte Erscheinungsbild schon vor dem ersten Zeichnen, damit die
 * App beim Start nicht kurz im falschen Farbschema aufblitzt. Läuft als
 * Inline-Skript im <head>; die Einstellung liegt in localStorage.
 */
export const THEME_INIT_SCRIPT = `try{var s=JSON.parse(localStorage.getItem(${JSON.stringify(SETTINGS_KEY)}));if(s&&s.state&&s.state.theme==="pastel")document.documentElement.dataset.theme="pastel"}catch(e){}`;

/** Hält <html data-theme> und die Farbe der Browser-Leiste aktuell. */
export function ThemeSync() {
  const theme = useSettingsStore((state) => state.theme);

  useEffect(() => {
    const root = document.documentElement;
    if (theme === "pastel") root.dataset.theme = "pastel";
    else delete root.dataset.theme;
    document
      .querySelector('meta[name="theme-color"]')
      ?.setAttribute("content", THEME_COLOR[theme]);
  }, [theme]);

  return null;
}
