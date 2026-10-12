"use client";

import { useEffect } from "react";

import { MOOD_KEY } from "@/components/theme-sync";
import { useMood } from "@/lib/mood";
import { useSettingsStore } from "@/lib/stores/settings-store";

/**
 * Lässt Hintergrund und Lichtstimmung der App der heutigen Stimmung folgen
 * (<html data-mood>). Die Farbwerte stehen in app/globals.css. Abschaltbar
 * unter "Mehr → Erscheinungsbild".
 */
export function MoodSync() {
  const enabled = useSettingsStore((state) => state.moodColors);
  const mood = useMood();

  useEffect(() => {
    const root = document.documentElement;
    // Solange die Einträge laden, bleibt die Stimmung vom letzten Start stehen.
    if (enabled && mood === undefined) return;
    const active = enabled && mood && mood !== "neutral" ? mood : null;
    if (active) root.dataset.mood = active;
    else delete root.dataset.mood;
    try {
      if (active) localStorage.setItem(MOOD_KEY, active);
      else localStorage.removeItem(MOOD_KEY);
    } catch {
      // Ohne Speicherzugriff erscheint die Stimmung beim Start nur etwas später.
    }
  }, [enabled, mood]);

  return null;
}
