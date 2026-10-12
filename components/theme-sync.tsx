"use client";

import { useEffect } from "react";

import { SETTINGS_KEY, useSettingsStore, type Theme } from "@/lib/stores/settings-store";

/**
 * Zuletzt gezeigte Stimmung. Nur damit die App beim Start gleich in der
 * richtigen Lichtstimmung erscheint; maßgeblich bleiben die Einträge.
 */
export const MOOD_KEY = "ms-akku-mood";

/** Farbe der Browser-Leiste je Erscheinungsbild (= jeweiliger Hintergrund). */
const THEME_COLOR: Record<Theme, string> = { dark: "#0D1518", pastel: "#E9F0EC" };

/**
 * Setzt Erscheinungsbild und letzte Stimmung schon vor dem ersten Zeichnen, damit die
 * App beim Start nicht kurz im falschen Farbschema aufblitzt. Läuft als
 * Inline-Skript im <head>; die Einstellung liegt in localStorage.
 */
export const THEME_INIT_SCRIPT = `try{var d=document.documentElement,s=(JSON.parse(localStorage.getItem(${JSON.stringify(SETTINGS_KEY)}))||{}).state||{},m=localStorage.getItem(${JSON.stringify(MOOD_KEY)});if(s.theme==="pastel")d.dataset.theme="pastel";if(s.moodColors!==false&&(m==="sunny"||m==="rest"))d.dataset.mood=m}catch(e){}`;

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
