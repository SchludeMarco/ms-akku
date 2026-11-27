"use client";

import { useRef, useState } from "react";

import { AppHeader } from "@/components/app-header";
import { Icon } from "@/components/icon";
import {
  countEntries,
  downloadBackup,
  parseBackup,
  restoreBackup,
  type Backup,
} from "@/lib/backup";
import { playSuccess } from "@/lib/sound";

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
    } catch {
      setMessage({
        kind: "error",
        text: "Das hat nicht geklappt. Es wurde nichts verändert.",
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
      <AppHeader title="Sichern und mitnehmen" back />
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

        </div>
      </main>
    </>
  );
}
