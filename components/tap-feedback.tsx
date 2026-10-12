"use client";

import { useEffect } from "react";

import { hapticTap, settle } from "@/lib/haptics";

const INTERACTIVE =
  'button, a[href], [role="button"], [role="radio"], [role="checkbox"], [role="switch"], select, input[type="checkbox"], input[type="radio"]';

/**
 * Bestätigt jedes Antippen einer bedienbaren Fläche: kurzer Vibrationsimpuls
 * und sichtbares Nachfedern. Ein einziger Listener für die ganze App, damit
 * keine Stelle vergessen wird.
 */
export function TapFeedback() {
  useEffect(() => {
    function onClick(event: MouseEvent) {
      if (!(event.target instanceof Element)) return;
      const element = event.target.closest(INTERACTIVE);
      if (!element || element.matches(":disabled, [aria-disabled='true']")) return;
      hapticTap();
      settle(element);
    }
    document.addEventListener("click", onClick, { capture: true, passive: true });
    return () => document.removeEventListener("click", onClick, { capture: true });
  }, []);

  return null;
}
