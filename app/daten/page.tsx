"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

import { AppHeader } from "@/components/app-header";
import { Icon } from "@/components/icon";
import {
  countEntries,
  downloadBackup,
  parseBackup,
  restoreBackup,
  type Backup,
} from "@/lib/backup";
import {
  deleteFromDrive,
  disconnectGoogle,
  googleClientId,
  loadFromDrive,
  preloadGoogle,
  saveToDrive,
} from "@/lib/google-drive";
import { playSuccess } from "@/lib/sound";
import { useSettingsStore } from "@/lib/stores/settings-store";

const BUTTON =
  "flex min-h-[52px] w-full items-center justify-center gap-2 rounded-xl border border-outline-variant/30 bg-surface-container-high px-3 text-label-lg text-primary transition-colors hover:bg-surface-bright disabled:opacity-50";

const CARD =
  "space-y-space-sm rounded-xl border border-outline-variant/30 bg-surface-container p-space-md shadow-sm";

function formatDateTime(iso: string) {
  return new Date(iso).toLocaleString("de-DE", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

const describe = (backup: Backup) =>
  `${countEntries(backup)} Einträge, Stand ${formatDateTime(backup.exportedAt)}`;

export default function DatenPage() {
  const googleConsent = useSettingsStore((state) => state.googleConsent);
  const setGoogleConsent = useSettingsStore((state) => state.setGoogleConsent);
  const driveAvailable = Boolean(googleClientId());

  useEffect(() => {
    if (googleConsent) preloadGoogle();
  }, [googleConsent]);

  const fileInput = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<{ kind: "ok" | "error"; text: string } | null>(null);
  // Eine eingelesene Sicherung wird erst nach ausdrücklicher Bestätigung übernommen.
  const [pending, setPending] = useState<Backup | null>(null);

  async function run(action: () => Promise<string>) {
    setBusy(true);
    setMessage(null);
    try {
      setMessage({ kind: "ok", text: await action() });
      playSuccess();
    } catch (cause) {
      const code = cause instanceof Error ? cause.message : "";
      setMessage({
        kind: "error",
        text:
          code === "popup_closed" || code === "access_denied"
            ? "Die Anmeldung bei Google wurde abgebrochen."
            : code === "popup_failed_to_open"
              ? "Das Anmeldefenster wurde blockiert. Bitte erlaube Pop-ups für diese Seite."
              : "Das hat nicht geklappt. Es wurde nichts verändert.",
      });
    } finally {
      setBusy(false);
    }
  }

  async function handleFile(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    try {
      setPending(parseBackup(JSON.parse(await file.text())));
      setMessage(null);
    } catch {
      setMessage({ kind: "error", text: "Diese Datei ist keine gültige MS-Akku-Sicherung." });
    }
  }

  return (
    <>
      <AppHeader title="Sicherung & Export" back />
      <main className="pb-safe mx-auto flex w-full max-w-xl flex-1 flex-col pt-16">
        <div className="flex w-full flex-col gap-space-lg px-margin pb-space-xl pt-space-md">
          <p className="text-body-md text-on-surface-variant">
            Deine Daten liegen nur auf diesem Gerät. Hier kannst du sie mitnehmen oder
            sichern.
          </p>

          {message && (
            <p
              role="status"
              className={
                message.kind === "ok"
                  ? "rounded-xl border border-primary/30 bg-primary/10 p-space-sm text-body-sm text-on-surface"
                  : "rounded-xl bg-error-container p-space-sm text-body-sm text-on-error-container"
              }
            >
              {message.text}
            </p>
          )}

          {pending && (
            <div className="space-y-space-sm rounded-xl border border-pacing/40 bg-pacing/10 p-space-md">
              <p className="text-body-md text-on-surface">
                <strong className="block text-label-lg">Sicherung übernehmen?</strong>
                {describe(pending)}. Alle Daten auf diesem Gerät werden dadurch ersetzt.
              </p>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setPending(null)}
                  className="min-h-[52px] flex-1 rounded-xl border border-outline-variant/30 bg-surface-container-high text-label-lg text-on-surface"
                >
                  Abbrechen
                </button>
                <button
                  type="button"
                  disabled={busy}
                  onClick={() =>
                    run(async () => {
                      await restoreBackup(pending);
                      setPending(null);
                      return "Sicherung übernommen.";
                    })
                  }
                  className="min-h-[52px] flex-1 rounded-xl bg-primary-container text-label-lg font-bold text-on-primary-container"
                >
                  Ersetzen
                </button>
              </div>
            </div>
          )}

          <section className="space-y-2">
            <h2 className="text-label-sm font-semibold uppercase tracking-wider text-primary">
              Als Datei
            </h2>
            <div className={CARD}>
              <p className="text-body-sm leading-relaxed text-on-surface-variant">
                <strong className="block text-label-md text-on-surface">
                  Alle Daten exportieren
                </strong>
                Speichert Einträge und Symptomauswahl als JSON-Datei auf diesem Gerät. Die
                Datei enthält Gesundheitsangaben – bewahre sie entsprechend auf.
              </p>
              <button
                type="button"
                disabled={busy}
                onClick={() =>
                  run(async () => {
                    await downloadBackup();
                    return "Datei wurde erstellt.";
                  })
                }
                className={BUTTON}
              >
                <Icon name="download" className="text-[20px]" />
                Exportieren
              </button>
              <button
                type="button"
                disabled={busy}
                onClick={() => fileInput.current?.click()}
                className={BUTTON}
              >
                <Icon name="upload" className="text-[20px]" />
                Aus Datei wiederherstellen
              </button>
              <input
                ref={fileInput}
                type="file"
                accept="application/json,.json"
                onChange={handleFile}
                className="hidden"
              />
            </div>
          </section>

          {driveAvailable && (
            <section className="space-y-2">
              <h2 className="text-label-sm font-semibold uppercase tracking-wider text-primary">
                In deinem Google Drive (freiwillig)
              </h2>
              <div className={CARD}>
                <div className="space-y-2 text-body-sm leading-relaxed text-on-surface-variant">
                  <p>
                    Du kannst eine Sicherung in deinem eigenen Google Drive ablegen, in
                    einem verborgenen Ordner, den nur MS Akku lesen kann. Der Betreiber
                    von MS Akku erhält die Daten nicht.
                  </p>
                  <p>
                    Dabei werden deine Einträge, also Gesundheitsangaben, an Google
                    übertragen und dort gespeichert, auch auf Servern in den USA. Dein
                    Browser verbindet sich erst mit Google, wenn du unten zustimmst. Es
                    wird nur gesichert, wenn du auf „Jetzt sichern“ tippst.
                  </p>
                </div>
                <label className="flex min-h-touch cursor-pointer items-start gap-3">
                  <input
                    type="checkbox"
                    checked={googleConsent}
                    onChange={(event) => {
                      setGoogleConsent(event.target.checked);
                      if (event.target.checked) preloadGoogle();
                      else disconnectGoogle();
                    }}
                    className="mt-1 h-6 w-6 shrink-0 accent-[rgb(var(--primary-container))]"
                  />
                  <span className="text-body-sm text-on-surface">
                    Ich willige ausdrücklich ein, dass meine Gesundheitsangaben aus MS Akku
                    in meinem Google Drive gespeichert werden. Ich kann das jederzeit
                    widerrufen, indem ich den Haken entferne. Details in der{" "}
                    <Link
                      href="/datenschutz"
                      className="text-primary underline underline-offset-4"
                    >
                      Datenschutzerklärung
                    </Link>
                    .
                  </span>
                </label>
                {googleConsent && (
                  <>
                    <button
                      type="button"
                      disabled={busy}
                      onClick={() =>
                        run(async () => `Gesichert: ${describe(await saveToDrive())}.`)
                      }
                      className={BUTTON}
                    >
                      <Icon name="cloud_upload" className="text-[20px]" />
                      Jetzt sichern
                    </button>
                    <button
                      type="button"
                      disabled={busy}
                      onClick={() =>
                        run(async () => {
                          const backup = await loadFromDrive();
                          if (!backup) return "In deinem Drive liegt noch keine Sicherung.";
                          setPending(backup);
                          return "Sicherung gefunden. Bitte oben bestätigen.";
                        })
                      }
                      className={BUTTON}
                    >
                      <Icon name="cloud_download" className="text-[20px]" />
                      Aus Drive wiederherstellen
                    </button>
                    <button
                      type="button"
                      disabled={busy}
                      onClick={() =>
                        run(async () =>
                          (await deleteFromDrive())
                            ? "Die Sicherung im Drive wurde gelöscht."
                            : "In deinem Drive liegt keine Sicherung.",
                        )
                      }
                      className="flex min-h-[52px] w-full items-center justify-center gap-2 rounded-xl border border-error/30 bg-surface-container-high text-label-lg text-error disabled:opacity-50"
                    >
                      <Icon name="delete" className="text-[20px]" />
                      Sicherung im Drive löschen
                    </button>
                  </>
                )}
              </div>
            </section>
          )}
        </div>
      </main>
    </>
  );
}
