// Service Worker von MS Akku: hält die App-Dateien auf dem Gerät vor, damit
// sie ohne Netz startet. Er speichert nur Dateien der App selbst (Seiten,
// Skripte, Schriften, Symbole) – keine Einträge und keine Nutzungsdaten. Die
// Einträge liegen unabhängig davon in IndexedDB.
//
// Ablauf:
// - Bei der Installation und bei jedem Start mit Netz werden alle Seiten der
//   App samt ihrer Skripte, Stile und Schriften geladen und gespeichert.
// - Seitenaufrufe: zuerst Netz (damit Updates ankommen), ohne Netz die
//   gespeicherte Fassung.
// - Dateien unter /_next/static/ tragen einen Hash im Namen und ändern sich
//   nie: zuerst Speicher, sonst Netz.
// - Alles andere geht unverändert ans Netz.

const CACHE = "ms-akku-app-v1";

// Alle Seiten der App. Neue Seiten hier ergänzen.
const PAGES = [
  "/",
  "/verlauf",
  "/muster",
  "/mehr",
  "/erfassen",
  "/symptome",
  "/symptome/detail",
  "/daten",
  "/datenschutz",
  "/impressum",
  "/willkommen",
];

const EXTRAS = ["/manifest.webmanifest", "/icon-192.png", "/icon-512.png", "/apple-touch-icon.png"];

const STATIC_URL = /\/_next\/static\/[^"'\\\s<>]+/g;

/** Alle App-Dateien, die ein HTML- oder CSS-Text nennt. */
function staticUrls(text) {
  return (text.match(STATIC_URL) ?? []).map((url) =>
    // Pfade dürfen Klammern enthalten ("app/(tabs)/…"). Eine schließende
    // Klammer ohne öffnende gehört dagegen zu einem umgebenden url(…).
    url.includes("(") ? url : url.split(")")[0],
  );
}

async function fetchFresh(url) {
  const response = await fetch(url, { cache: "no-cache", credentials: "same-origin" });
  if (!response.ok) throw new Error(`${url}: ${response.status}`);
  return response;
}

/** Lädt alle Seiten und die darin genannten Dateien; räumt Veraltetes ab. */
async function precache() {
  const cache = await caches.open(CACHE);
  const assets = new Set();

  await Promise.all(
    PAGES.map(async (page) => {
      const response = await fetchFresh(page);
      const html = await response.clone().text();
      for (const url of staticUrls(html)) assets.add(url);
      await cache.put(page, response);
    }),
  );

  // Schriften stehen nicht im HTML, sondern in den Stylesheets.
  const stylesheets = [...assets].filter((url) => url.endsWith(".css"));
  await Promise.all(
    stylesheets.map(async (url) => {
      const css = await (await fetchFresh(url)).text();
      for (const url of staticUrls(css)) assets.add(url);
    }),
  );

  await Promise.all(
    [...assets, ...EXTRAS].map(async (url) => {
      if (await cache.match(url, { ignoreSearch: true })) return;
      try {
        await cache.put(url, await fetchFresh(url));
      } catch {
        // Eine einzelne fehlende Datei soll das Vorhalten nicht abbrechen.
      }
    }),
  );

  // Dateien früherer Versionen entfernen.
  const keep = new Set([...PAGES, ...EXTRAS, ...[...assets].map((url) => url.split("?")[0])]);
  for (const request of await cache.keys()) {
    const { pathname } = new URL(request.url);
    if (!keep.has(pathname)) await cache.delete(request);
  }
}

self.addEventListener("install", (event) => {
  event.waitUntil(precache().then(() => self.skipWaiting()));
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      for (const name of await caches.keys()) {
        if (name !== CACHE) await caches.delete(name);
      }
      await self.clients.claim();
    })(),
  );
});

// Die Seite meldet sich bei jedem Start: Dann wird der Vorrat aufgefrischt.
self.addEventListener("message", (event) => {
  if (event.data === "precache") event.waitUntil(precache().catch(() => {}));
});

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  if (url.pathname.startsWith("/_next/static/") || EXTRAS.includes(url.pathname)) {
    event.respondWith(
      (async () => {
        const cache = await caches.open(CACHE);
        const cached = await cache.match(url.pathname, { ignoreSearch: true });
        if (cached) return cached;
        const response = await fetch(request);
        if (response.ok) await cache.put(request, response.clone());
        return response;
      })(),
    );
    return;
  }

  // Ganze Seitenaufrufe. Die Hintergrund-Anfragen des Routers (?_rsc=…) gehen
  // bewusst ans Netz: Schlagen sie fehl, lädt Next.js die Seite normal, und
  // dann greift dieser Zweig.
  if (request.mode === "navigate") {
    event.respondWith(
      (async () => {
        try {
          return await fetch(request);
        } catch {
          const cache = await caches.open(CACHE);
          const path = url.pathname.replace(/\/$/, "") || "/";
          return (await cache.match(path)) ?? (await cache.match("/")) ?? Response.error();
        }
      })(),
    );
  }
});
