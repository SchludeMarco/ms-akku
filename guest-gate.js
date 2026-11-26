// Gästetür wie bei RetroMind (Marco, 2026-11-26: "alle Apps so wie RetroMind
// mit Freunden und Bekannten"). Diese App ist ein privates Angebot für die
// Gäste, die Marco im RetroMind-Adminbereich eingeladen hat – eine Liste für
// alle seine Apps. Ohne gültiges Gäste-Cookie gehen Seiten zur RetroMind-Tür
// (Google-Anmeldung), API-Aufrufe bekommen 401. RetroMind schickt den Gast
// mit einem Einmal-Code zurück nach /_gate/pass; der wird hier serverseitig
// mit APPS_GUEST_SECRET eingelöst. Die Liste wird höchstens einmal am Tag
// neu geprüft, Entfernen greift also innerhalb eines Tages.
// Ohne APPS_GUEST_SECRET und in Vorschau-Deployments bleibt die App offen
// (Vorschauen schützt Vercel selbst). Nur Web-APIs, keine Abhängigkeiten.

const RETROMIND = "https://retromind.vercel.app";
const COOKIE = "app_guest";
const MAX_AGE = 30 * 24 * 3600;
const RECHECK_AFTER = 24 * 3600;
const PASS_PATH = "/_gate/pass";
const LOGOUT_PATH = "/_gate/logout";

const secret = () => process.env.APPS_GUEST_SECRET || "";
const enc = new TextEncoder();

async function hmac(text) {
  const key = await crypto.subtle.importKey("raw", enc.encode(secret()), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  const sig = new Uint8Array(await crypto.subtle.sign("HMAC", key, enc.encode(text)));
  return Array.from(sig, (b) => b.toString(16).padStart(2, "0")).join("");
}
const b64url = (s) => btoa(String.fromCharCode(...enc.encode(s))).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
const unb64url = (s) => new TextDecoder().decode(Uint8Array.from(atob(s.replace(/-/g, "+").replace(/_/g, "/")), (c) => c.charCodeAt(0)));

async function makeCookie(email) {
  const iat = Math.floor(Date.now() / 1000);
  return `${COOKIE}=${b64url(email)}.${iat}.${await hmac(`${email}.${iat}`)}; Path=/; Max-Age=${MAX_AGE}; HttpOnly; SameSite=Lax; Secure`;
}
const clearCookie = () => `${COOKIE}=; Path=/; Max-Age=0; HttpOnly; SameSite=Lax; Secure`;

async function readCookie(header) {
  const m = new RegExp(`(?:^|;\\s*)${COOKIE}=([^;]+)`).exec(String(header || ""));
  if (!m) return null;
  const [e64, iatStr, sig] = m[1].split(".");
  if (!e64 || !iatStr || !sig) return null;
  let email;
  try {
    email = unb64url(e64);
  } catch {
    return null;
  }
  const iat = Number(iatStr);
  const age = Math.floor(Date.now() / 1000) - iat;
  if (!Number.isFinite(iat) || age < 0 || age > MAX_AGE) return null;
  if ((await hmac(`${email}.${iat}`)) !== sig) return null;
  return { email, age };
}

async function askRetroMind(body) {
  const res = await fetch(`${RETROMIND}/api/admin`, {
    method: "POST",
    headers: { "Content-Type": "application/json", "x-apps-secret": secret() },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`retromind ${res.status}`);
  return res.json();
}

const isPage = (request) =>
  request.headers.get("sec-fetch-mode") === "navigate" || (request.headers.get("accept") || "").includes("text/html");

const redirect = (location, cookie) => {
  const headers = new Headers({ Location: location, "Cache-Control": "no-store" });
  if (cookie) headers.append("Set-Cookie", cookie);
  return new Response(null, { status: 302, headers });
};

function deny(request, url) {
  if (url.pathname.startsWith("/api/") || !isPage(request)) {
    return new Response(JSON.stringify({ error: "guests_only" }), {
      status: 401,
      headers: { "Content-Type": "application/json", "Cache-Control": "no-store" },
    });
  }
  const door = new URL("/api/admin", RETROMIND);
  door.searchParams.set("view", "pass");
  door.searchParams.set("to", url.toString());
  return redirect(door.toString(), clearCookie());
}

const safeNext = (s) => (/^\/(?!\/)/.test(String(s || "")) ? String(s) : "/");

/**
 * The gate. Returns
 *   { response }        → send this response
 *   { cookie }          → let the request through and set this cookie
 *   {}                  → let the request through
 * `open` lists path patterns that stay reachable without a cookie.
 */
export async function guestGate(request, open = []) {
  if (process.env.VERCEL_ENV && process.env.VERCEL_ENV !== "production") return {};
  if (!secret()) return {};
  const url = new URL(request.url);

  if (url.pathname === PASS_PATH) {
    const back = new URL(safeNext(url.searchParams.get("next")), url);
    try {
      const out = await askRetroMind({ action: "appRedeem", code: url.searchParams.get("code") || "" });
      if (out.guest && out.email) return { response: redirect(back.toString(), await makeCookie(out.email)) };
    } catch (err) {
      console.error("guest pass failed", err);
    }
    return { response: new Response("Kein gültiger Gästepass. Bitte noch einmal öffnen.", { status: 403 }) };
  }
  if (url.pathname === LOGOUT_PATH) return { response: redirect("/", clearCookie()) };
  if (open.some((re) => re.test(url.pathname))) return {};

  const guest = await readCookie(request.headers.get("cookie"));
  if (!guest) return { response: deny(request, url) };
  if (guest.age > RECHECK_AFTER && isPage(request)) {
    try {
      const out = await askRetroMind({ action: "appGuest", email: guest.email });
      if (!out.guest) return { response: deny(request, url) };
      return { cookie: await makeCookie(guest.email) };
    } catch {
      return {}; // RetroMind nicht erreichbar: durchlassen, die nächste Seite prüft erneut
    }
  }
  return {};
}
