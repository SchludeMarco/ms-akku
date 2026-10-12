import { create } from "zustand";
import { createJSONStorage, persist, type StateStorage } from "zustand/middleware";

export type UsageMode = "self" | "doctor";

interface SettingsState {
  soundEnabled: boolean;
  toggleSound: () => void;
  onboardingCompleted: boolean;
  completeOnboarding: () => void;
  usageMode: UsageMode;
  setUsageMode: (mode: UsageMode) => void;
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
      onboardingCompleted: false,
      completeOnboarding: () => set({ onboardingCompleted: true }),
      usageMode: "self",
      setUsageMode: (usageMode) => set({ usageMode }),
    }),
    {
      name: "ms-akku-settings",
      storage: createJSONStorage(() =>
        typeof window !== "undefined" ? window.localStorage : noopStorage,
      ),
    },
  ),
);
