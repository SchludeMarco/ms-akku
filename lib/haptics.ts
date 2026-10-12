import { useSettingsStore } from "@/lib/stores/settings-store";

// Spürbare und sichtbare Bestätigung von Eingaben.
//
// - Vibration über die Vibration API. Android-Browser unterstützen sie, Safari
//   auf dem iPhone nicht – dort bleibt es bei der sichtbaren Rückmeldung.
// - Sichtbar: Die angetippte Fläche federt kurz nach. Bewusst klein und ohne
//   Blinken, und gar nicht, wenn das Gerät "Bewegung reduzieren" verlangt.

const isEnabled = () => useSettingsStore.getState().hapticsEnabled;

/** Ob dieses Gerät vibrieren kann (für den Hinweis in den Einstellungen). */
export const canVibrate = () =>
  typeof navigator !== "undefined" && typeof navigator.vibrate === "function";

function vibrate(pattern: number | number[]) {
  if (!isEnabled() || !canVibrate()) return;
  try {
    navigator.vibrate(pattern);
  } catch {
    // Manche Browser verweigern Vibration ohne vorherige Nutzeraktion.
  }
}

/** Kaum spürbarer Impuls für jedes Antippen. */
export const hapticTap = () => vibrate(8);

/** Deutlicher Doppelimpuls, wenn etwas gespeichert wurde. */
export const hapticSuccess = () => vibrate([14, 50, 22]);

/** Lässt die angetippte Fläche kurz nachfedern. */
export function settle(element: Element) {
  if (!isEnabled() || typeof element.animate !== "function") return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  // `scale` statt `transform`, damit vorhandene Verschiebungen (z. B. der
  // angehobene Erfassen-Knopf) erhalten bleiben.
  element.animate([{ scale: "0.97" }, { scale: "1.03" }, { scale: "1" }], {
    duration: 180,
    easing: "ease-out",
  });
}
