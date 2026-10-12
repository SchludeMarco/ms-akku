import { create } from "zustand";
import { createJSONStorage, persist, type StateStorage } from "zustand/middleware";

import {
  DEFAULT_LIGHT_HOURS,
  nextSwitch,
  resolveTheme,
  type LightHours,
  type Theme,
  type ThemeMode,
  type ThemeOverride,
} from "@/lib/theme";

export type UsageMode = "self" | "doctor";

export type { Theme, ThemeMode } from "@/lib/theme";

/** Schlüssel der Einstellungen in localStorage (auch vom Start-Skript gelesen). */
export const SETTINGS_KEY = "ms-akku-settings";

interface SettingsState {
  soundEnabled: boolean;
  toggleSound: () => void;
  /** Vibration und sichtbares Nachfedern beim Antippen. */
  hapticsEnabled: boolean;
  toggleHaptics: () => void;
  onboardingCompleted: boolean;
  completeOnboarding: () => void;
  /** Gewählte Einstellung: Automatik nach Uhrzeit, immer hell oder immer dunkel. */
  themeMode: ThemeMode;
  setThemeMode: (mode: ThemeMode) => void;
  /** Helle Zeit der Automatik, als Uhrzeiten "HH:MM". */
  lightHours: LightHours;
  setLightHours: (hours: Partial<LightHours>) => void;
  /** Händisches Umschalten in der Automatik, gilt bis zum nächsten Wechsel. */
  themeOverride: ThemeOverride | null;
  /** Das gerade geltende Erscheinungsbild (berechnet, nicht gespeichert). */
  theme: Theme;
  /** Berechnet `theme` neu, z. B. wenn die Uhr 9 oder 17 Uhr erreicht. */
  syncTheme: () => void;
  /** Wechselt zwischen Hell und Dunkel (Knopf auf „Heute“). */
  toggleTheme: () => void;
  /** Hintergrund und Lichtstimmung folgen Befinden und Akku des Tages. */
  moodColors: boolean;
  toggleMoodColors: () => void;
  usageMode: UsageMode;
  setUsageMode: (mode: UsageMode) => void;
  /** Ausdrückliche Einwilligung in die Sicherung bei Google Drive (widerrufbar). */
  googleConsent: boolean;
  setGoogleConsent: (consent: boolean) => void;
}

// Während des serverseitigen Renderns (auch für Client-Components) existiert
// kein `window` – ein No-op-Storage verhindert einen Absturz beim Zugriff auf
// localStorage und wird auf dem Client transparent durch den echten ersetzt.
const noopStorage: StateStorage = {
  getItem: () => null,
  setItem: () => {},
  removeItem: () => {},
};

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      soundEnabled: true,
      toggleSound: () =>
        set((state) => ({ soundEnabled: !state.soundEnabled })),
      hapticsEnabled: true,
      toggleHaptics: () =>
        set((state) => ({ hapticsEnabled: !state.hapticsEnabled })),
      onboardingCompleted: false,
      completeOnboarding: () => set({ onboardingCompleted: true }),
      themeMode: "auto",
      setThemeMode: (themeMode) =>
        set((state) => ({
          themeMode,
          themeOverride: null,
          theme: resolveTheme(themeMode, null, new Date(), state.lightHours),
        })),
      lightHours: DEFAULT_LIGHT_HOURS,
      setLightHours: (hours) =>
        set((state) => {
          const lightHours = { ...state.lightHours, ...hours };
          // Neue Zeiten gelten sofort; eine alte Übersteuerung verfällt.
          return {
            lightHours,
            themeOverride: null,
            theme: resolveTheme(state.themeMode, null, new Date(), lightHours),
          };
        }),
      themeOverride: null,
      theme: resolveTheme("auto", null, new Date(), DEFAULT_LIGHT_HOURS),
      syncTheme: () =>
        set((state) => {
          const now = new Date();
          const theme = resolveTheme(
            state.themeMode,
            state.themeOverride,
            now,
            state.lightHours,
          );
          const expired =
            state.themeOverride !== null &&
            now.getTime() >= new Date(state.themeOverride.until).getTime();
          if (theme === state.theme && !expired) return state;
          return { theme, themeOverride: expired ? null : state.themeOverride };
        }),
      toggleTheme: () =>
        set((state) => {
          const now = new Date();
          const current = resolveTheme(
            state.themeMode,
            state.themeOverride,
            now,
            state.lightHours,
          );
          const theme: Theme = current === "dark" ? "pastel" : "dark";
          // In der Automatik gilt der Tipp nur bis zum nächsten Wechsel.
          return state.themeMode === "auto"
            ? {
                theme,
                themeOverride: {
                  theme,
                  until: nextSwitch(now, state.lightHours).toISOString(),
                },
              }
            : { theme, themeMode: theme, themeOverride: null };
        }),
      moodColors: true,
      toggleMoodColors: () =>
        set((state) => ({ moodColors: !state.moodColors })),
      usageMode: "self",
      setUsageMode: (usageMode) => set({ usageMode }),
      googleConsent: false,
      setGoogleConsent: (googleConsent) => set({ googleConsent }),
    }),
    {
      name: SETTINGS_KEY,
      // `theme` wird nicht gespeichert, sondern bei jedem Start aus Einstellung
      // und Uhrzeit berechnet – gleich nach dem Laden, vor dem ersten Zeichnen.
      partialize: (state) => {
        const persisted: Partial<SettingsState> = { ...state };
        delete persisted.theme;
        return persisted;
      },
      onRehydrateStorage: () => (state) => state?.syncTheme(),
      storage: createJSONStorage(() =>
        typeof window !== "undefined" ? window.localStorage : noopStorage,
      ),
    },
  ),
);
