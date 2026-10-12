"use client";

import { useEffect } from "react";

/**
 * Meldet den Service Worker an (public/sw.js), der die App offline verfügbar
 * macht, und lässt ihn bei jedem Start mit Netz die App-Dateien auffrischen.
 * In der Entwicklung bleibt er aus, damit er keine alten Stände ausliefert.
 */
export function ServiceWorker() {
  useEffect(() => {
    if (process.env.NODE_ENV !== "production" || !("serviceWorker" in navigator)) return;
    navigator.serviceWorker
      .register("/sw.js")
      .then(() => navigator.serviceWorker.ready)
      .then((registration) => {
        if (navigator.onLine) registration.active?.postMessage("precache");
      })
      .catch(() => {
        // Ohne Service Worker läuft die App normal weiter, nur nicht offline.
      });
  }, []);

  return null;
}
