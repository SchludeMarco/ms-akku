import { createBackup, parseBackup, type Backup } from "@/lib/backup";

// Optionale Sicherung im eigenen Google Drive der Nutzerin bzw. des Nutzers.
//
// - Nur aktiv, wenn NEXT_PUBLIC_GOOGLE_CLIENT_ID gesetzt ist.
// - Googles Skript wird erst geladen, wenn die Person der Nutzung zugestimmt
//   hat (requestAccessToken). Vorher gibt es keine Verbindung zu Google.
// - Einziger Zugriffsbereich ist "drive.appdata": ein verborgener, nur für
//   diese App sichtbarer Ordner. Kein Zugriff auf Name, E-Mail oder andere
//   Dateien.
// - Die Daten gehen direkt vom Browser ins Drive der Person. Der Betreiber
//   von MS Akku sieht sie nie; es gibt keinen eigenen Server dazwischen.
// - Das Zugriffstoken lebt nur im Arbeitsspeicher dieser Seite.

const GIS_SRC = "https://accounts.google.com/gsi/client";
const SCOPE = "https://www.googleapis.com/auth/drive.appdata";
const FILE_NAME = "ms-akku-sicherung.json";
const FILES_API = "https://www.googleapis.com/drive/v3/files";
const UPLOAD_API = "https://www.googleapis.com/upload/drive/v3/files";

interface TokenResponse {
  access_token?: string;
  expires_in?: number | string;
  error?: string;
}

interface TokenClient {
  callback: (response: TokenResponse) => void;
  error_callback?: (error: { type?: string }) => void;
  requestAccessToken: (options: { prompt: "" | "consent" }) => void;
}

interface GoogleIdentity {
  accounts: {
    oauth2: {
      initTokenClient: (config: {
        client_id: string;
        scope: string;
        callback: (response: TokenResponse) => void;
      }) => TokenClient;
      revoke: (token: string, done: () => void) => void;
    };
  };
}

const identity = () => (window as unknown as { google?: GoogleIdentity }).google;

export const googleClientId = (): string | undefined =>
  process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || undefined;

let gisPromise: Promise<void> | null = null;

function loadGis(): Promise<void> {
  if (gisPromise) return gisPromise;
  gisPromise = new Promise((resolve, reject) => {
    if (identity()?.accounts?.oauth2) return resolve();
    const script = document.createElement("script");
    script.src = GIS_SRC;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => {
      gisPromise = null;
      reject(new Error("gis_load_failed"));
    };
    document.head.appendChild(script);
  });
  return gisPromise;
}

/**
 * Lädt Googles Skript vorab, sobald die Person zugestimmt hat. So öffnet sich
 * das Anmeldefenster beim Tippen sofort und wird auf dem Handy nicht blockiert.
 */
export function preloadGoogle(): void {
  if (googleClientId()) loadGis().catch(() => {});
}

let tokenClient: TokenClient | null = null;
let token: { value: string; expiresAt: number } | null = null;

/** Öffnet bei Bedarf Googles Zustimmungsfenster und liefert ein kurzlebiges Token. */
async function accessToken(): Promise<string> {
  if (token && token.expiresAt > Date.now() + 60_000) return token.value;
  const clientId = googleClientId();
  if (!clientId) throw new Error("not_configured");
  await loadGis();
  const google = identity();
  if (!google) throw new Error("gis_load_failed");
  return new Promise((resolve, reject) => {
    tokenClient ??= google.accounts.oauth2.initTokenClient({
      client_id: clientId,
      scope: SCOPE,
      callback: () => {},
    });
    tokenClient.callback = (response) => {
      if (!response.access_token || response.error) {
        reject(new Error(response.error || "token_failed"));
        return;
      }
      token = {
        value: response.access_token,
        expiresAt: Date.now() + (Number(response.expires_in) || 3600) * 1000,
      };
      resolve(token.value);
    };
    tokenClient.error_callback = (error) => reject(new Error(error.type || "token_failed"));
    tokenClient.requestAccessToken({ prompt: "" });
  });
}

async function findFileId(bearer: string): Promise<string | null> {
  const q = encodeURIComponent(`name='${FILE_NAME}' and trashed=false`);
  const response = await fetch(`${FILES_API}?spaces=appDataFolder&q=${q}&fields=files(id)`, {
    headers: { Authorization: `Bearer ${bearer}` },
  });
  if (!response.ok) throw new Error("drive_list_failed");
  const data = (await response.json()) as { files?: { id: string }[] };
  return data.files?.[0]?.id ?? null;
}

/** Schreibt die aktuelle Sicherung ins Drive und gibt sie zurück. */
export async function saveToDrive(): Promise<Backup> {
  const bearer = await accessToken();
  const backup = await createBackup();
  const body = JSON.stringify(backup);
  const fileId = await findFileId(bearer);

  if (fileId) {
    const response = await fetch(`${UPLOAD_API}/${fileId}?uploadType=media`, {
      method: "PATCH",
      headers: { Authorization: `Bearer ${bearer}`, "Content-Type": "application/json" },
      body,
    });
    if (!response.ok) throw new Error("drive_update_failed");
    return backup;
  }

  const boundary = "ms-akku-drive-boundary";
  const metadata = JSON.stringify({ name: FILE_NAME, parents: ["appDataFolder"] });
  const response = await fetch(`${UPLOAD_API}?uploadType=multipart`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${bearer}`,
      "Content-Type": `multipart/related; boundary=${boundary}`,
    },
    body:
      `--${boundary}\r\nContent-Type: application/json; charset=UTF-8\r\n\r\n${metadata}\r\n` +
      `--${boundary}\r\nContent-Type: application/json\r\n\r\n${body}\r\n--${boundary}--`,
  });
  if (!response.ok) throw new Error("drive_create_failed");
  return backup;
}

/** Liest die Sicherung aus dem Drive; `null`, wenn es noch keine gibt. */
export async function loadFromDrive(): Promise<Backup | null> {
  const bearer = await accessToken();
  const fileId = await findFileId(bearer);
  if (!fileId) return null;
  const response = await fetch(`${FILES_API}/${fileId}?alt=media`, {
    headers: { Authorization: `Bearer ${bearer}` },
  });
  if (!response.ok) throw new Error("drive_download_failed");
  return parseBackup(await response.json());
}

/** Löscht die Sicherung im Drive. Gibt zurück, ob es eine gab. */
export async function deleteFromDrive(): Promise<boolean> {
  const bearer = await accessToken();
  const fileId = await findFileId(bearer);
  if (!fileId) return false;
  const response = await fetch(`${FILES_API}/${fileId}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${bearer}` },
  });
  if (!response.ok) throw new Error("drive_delete_failed");
  return true;
}

/** Entzieht der App den Zugriff wieder. */
export function disconnectGoogle(): void {
  if (!token) return;
  identity()?.accounts.oauth2.revoke(token.value, () => {});
  token = null;
}
