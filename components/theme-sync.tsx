"use client";

import { useEffect } from "react";

import { SETTINGS_KEY, useSettingsStore, type Theme } from "@/lib/stores/settings-store";
import { nextSwitch } from "@/lib/theme";

/** Farbe der Browser-Leiste je Erscheinungsbild (= jeweiliger Hintergrund). */
const THEME_COLOR: Record<Theme, string> = { dark: "#0D1518", pastel: "#E9F0EC" };

/**
 * Setzt das Erscheinungsbild schon vor dem ersten Zeichnen, damit die
 * App beim Start nicht kurz im falschen Farbschema aufblitzt. Läuft als
 * Inline-Skript im <head>; die Einstellung liegt in localStorage.
 */
export const THEME_INIT_SCRIPT = `try{var d=document.documentElement,s=(JSON.parse(localStorage.getItem(${JSON.stringify(SETTINGS_KEY)}))||{}).state||{},o=s.themeOverride,l=s.lightHours||{},p=function(v,f){var x=/^(\\d{1,2}):(\\d{2})$/.exec(v||"");return x&&+x[1]<24&&+x[2]<60?+x[1]*60+ +x[2]:f},a=p(l.from,540),b=p(l.until,1020),n=new Date(),c=n.getHours()*60+n.getMinutes(),g=a===b?false:a<b?c>=a&&c<b:c>=a||c<b,t=s.themeMode==="dark"||s.themeMode==="pastel"?s.themeMode:o&&Date.now()<Date.parse(o.until)?o.theme:g?"pastel":"dark";if(t==="pastel")d.dataset.theme="pastel"}catch(e){}`;

/**
 * Hält <html data-theme> und die Farbe der Browser-Leiste aktuell und lässt
 * die Automatik zu den eingestellten Zeiten umschalten.
 */
export function ThemeSync() {
  const theme = useSettingsStore((state) => state.theme);
  const themeMode = useSettingsStore((state) => state.themeMode);
  const themeOverride = useSettingsStore((state) => state.themeOverride);
  const lightHours = useSettingsStore((state) => state.lightHours);
  const syncTheme = useSettingsStore((state) => state.syncTheme);

  useEffect(() => {
    const root = document.documentElement;
    if (theme === "pastel") root.dataset.theme = "pastel";
    else delete root.dataset.theme;
    document
      .querySelector('meta[name="theme-color"]')
      ?.setAttribute("content", THEME_COLOR[theme]);
  }, [theme]);

  useEffect(() => {
    syncTheme();
    if (themeMode !== "auto") return;

    // Zum nächsten Wechselzeitpunkt neu berechnen – und immer dann, wenn die
    // App wieder in den Vordergrund kommt (Timer ruhen im Hintergrund).
    const wait = nextSwitch(new Date(), lightHours).getTime() - Date.now() + 1000;
    const timer = window.setTimeout(syncTheme, wait);
    const onVisible = () => {
      if (document.visibilityState === "visible") syncTheme();
    };
    document.addEventListener("visibilitychange", onVisible);
    return () => {
      window.clearTimeout(timer);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, [themeMode, themeOverride, lightHours, theme, syncTheme]);

  return null;
}
