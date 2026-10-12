import { create } from "zustand";
import { createJSONStorage, persist, type StateStorage } from "zustand/middleware";

export type UsageMode = "self" | "doctor";

/** dark = blendfreier Standard · pastel = helle, entspannte Pastelltöne */
export type Theme = "dark" | "pastel";

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
  theme: Theme;
  setTheme: (theme: Theme) => void;
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
      theme: "dark",
      setTheme: (theme) => set({ theme }),
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
      storage: createJSONStorage(() =>
        typeof window !== "undefined" ? window.localStorage : noopStorage,
      ),
    },
  ),
);
