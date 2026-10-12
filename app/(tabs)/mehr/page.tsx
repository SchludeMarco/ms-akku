"use client";

import { useState } from "react";
import Link from "next/link";

import { AppHeader } from "@/components/app-header";
import { Icon } from "@/components/icon";
import { clearAllEntries, loadDemoData } from "@/lib/demo";
import { playSuccess, playToggleFeedback } from "@/lib/sound";
import { useSettingsStore } from "@/lib/stores/settings-store";
import { cn } from "@/lib/utils";

function LinkRow({
  href,
  icon,
  title,
  hint,
}: {
  href: string;
  icon: string;
  title: string;
  hint: string;
}) {
  return (
    <Link
      href={href}
      className="flex min-h-[64px] w-full items-center justify-between rounded-xl border border-outline-variant/30 bg-surface-container p-4 shadow-sm transition-colors active:bg-surface-container-high"
    >
      <div className="flex min-w-0 items-center gap-3.5">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-surface-container-high text-primary">
          <Icon name={icon} className="text-[22px]" />
        </div>
        <div className="min-w-0">
          <div className="truncate text-label-lg text-on-surface">{title}</div>
          <div className="truncate text-body-sm text-on-surface-variant">{hint}</div>
        </div>
      </div>
      <Icon name="chevron_right" className="ml-2 text-[22px] text-outline-variant" />
    </Link>
  );
}

export default function MehrPage() {
  const soundEnabled = useSettingsStore((state) => state.soundEnabled);
  const toggleSound = useSettingsStore((state) => state.toggleSound);
  const usageMode = useSettingsStore((state) => state.usageMode);

  const [demoState, setDemoState] = useState<"idle" | "loading" | "done">("idle");
  const [confirmClear, setConfirmClear] = useState(false);

  async function handleLoadDemo() {
    setDemoState("loading");
    await loadDemoData();
    playSuccess();
    setDemoState("done");
  }

  async function handleClear() {
    await clearAllEntries();
    setConfirmClear(false);
    setDemoState("idle");
  }

  return (
    <>
      <AppHeader title="Mehr" />
      <main className="mx-auto flex w-full max-w-xl flex-1 flex-col pb-28 pt-16">
        <div className="flex w-full flex-col space-y-space-md px-margin pb-space-lg pt-space-md">
          <div className="flex items-center gap-space-sm rounded-xl border border-outline-variant/30 bg-surface-container-low p-space-md shadow-sm">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-primary/30 bg-primary/15 text-primary">
              <Icon name="lock" className="text-[20px]" />
            </div>
            <div className="flex min-w-0 flex-col">
              <span className="text-headline-sm text-on-surface">Lokal auf deinem Gerät</span>
              <p className="text-body-sm text-on-surface-variant">
                Ohne Konto. Deine Einträge verlassen dieses Gerät nur, wenn du sie selbst
                exportierst oder sicherst.
              </p>
            </div>
          </div>

          <section className="space-y-2">
            <h2 className="text-label-sm font-semibold uppercase tracking-wider text-primary">
              Persönliche Einstellungen
            </h2>
            <LinkRow
              href="/symptome"
              icon="checklist"
              title="Symptomkatalog"
              hint="Auswählen, Belastung bewerten, Hilfen lesen"
            />
            <LinkRow
              href="/willkommen/nutzung"
              icon="favorite"
              title="Nutzungspräferenz"
              hint={usageMode === "self" ? "Für mich selbst" : "Zusätzlich für Arzttermine"}
            />
            <button
              type="button"
              role="switch"
              aria-checked={soundEnabled}
              onClick={() => {
                toggleSound();
                playToggleFeedback();
              }}
              className="flex min-h-[64px] w-full items-center justify-between rounded-xl border border-outline-variant/30 bg-surface-container p-4 text-left shadow-sm transition-colors active:bg-surface-container-high"
            >
              <div className="flex min-w-0 items-center gap-3.5">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-surface-container-high text-primary">
                  <Icon name={soundEnabled ? "volume_up" : "volume_off"} className="text-[22px]" />
                </div>
                <div className="min-w-0">
                  <div className="truncate text-label-lg text-on-surface">Audiosignale</div>
                  <div className="truncate text-body-sm text-on-surface-variant">
                    Dezente Töne beim Erfassen
                  </div>
                </div>
              </div>
              <span
                className={cn(
                  "ml-2 flex h-7 w-12 shrink-0 items-center rounded-full p-1 transition-colors",
                  soundEnabled ? "bg-primary-container" : "bg-surface-container-highest",
                )}
              >
                <span
                  className={cn(
                    "h-5 w-5 rounded-full transition-transform",
                    soundEnabled ? "translate-x-5 bg-on-primary" : "bg-outline",
                  )}
                />
              </span>
            </button>
            <LinkRow
              href="/willkommen"
              icon="waving_hand"
              title="Einführung ansehen"
              hint="Willkommens-Screens erneut zeigen"
            />
          </section>

          <section className="space-y-2">
            <h2 className="text-label-sm font-semibold uppercase tracking-wider text-primary">
              Daten
            </h2>
            <LinkRow
              href="/daten"
              icon="save"
              title="Sicherung & Export"
              hint="Daten als Datei mitnehmen oder sichern"
            />
            <div className="space-y-space-sm rounded-xl border border-outline-variant/30 bg-surface-container p-space-md shadow-sm">
              <div className="flex items-start gap-space-sm">
                <Icon name="science" className="mt-0.5 text-[22px] text-secondary" />
                <p className="text-body-sm leading-relaxed text-on-surface-variant">
                  <strong className="block text-label-md text-on-surface">Beispieldaten</strong>
                  Füllt die App mit vier Wochen erfundener Einträge, damit du Verlauf und
                  Muster ausprobieren kannst.
                </p>
              </div>
              <button
                type="button"
                disabled={demoState === "loading"}
                onClick={handleLoadDemo}
                className="flex min-h-[52px] w-full items-center justify-center gap-2 rounded-xl border border-outline-variant/30 bg-surface-container-high text-label-lg text-primary transition-colors hover:bg-surface-bright disabled:opacity-50"
              >
                <Icon name={demoState === "done" ? "check" : "download"} className="text-[20px]" />
                {demoState === "done" ? "Beispieldaten geladen" : "Beispieldaten laden"}
              </button>
            </div>

            <div className="space-y-space-sm rounded-xl border border-outline-variant/30 bg-surface-container p-space-md shadow-sm">
              <div className="flex items-start gap-space-sm">
                <Icon name="delete_sweep" className="mt-0.5 text-[22px] text-error" />
                <p className="text-body-sm leading-relaxed text-on-surface-variant">
                  <strong className="block text-label-md text-on-surface">
                    Alle Einträge löschen
                  </strong>
                  Entfernt Akku-, Symptom-, Aktivitäts- und Schlafeinträge. Das lässt sich
                  nicht rückgängig machen.
                </p>
              </div>
              {confirmClear ? (
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setConfirmClear(false)}
                    className="min-h-[52px] flex-1 rounded-xl border border-outline-variant/30 bg-surface-container-high text-label-lg text-on-surface"
                  >
                    Abbrechen
                  </button>
                  <button
                    type="button"
                    onClick={handleClear}
                    className="min-h-[52px] flex-1 rounded-xl bg-error-container text-label-lg font-bold text-on-error-container"
                  >
                    Wirklich löschen
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setConfirmClear(true)}
                  className="flex min-h-[52px] w-full items-center justify-center gap-2 rounded-xl border border-error/30 bg-surface-container-high text-label-lg text-error transition-colors hover:bg-surface-bright"
                >
                  Einträge löschen …
                </button>
              )}
            </div>
          </section>

          <section className="space-y-2">
            <h2 className="text-label-sm font-semibold uppercase tracking-wider text-primary">
              Über MS Akku
            </h2>
            <LinkRow
              href="/feedback"
              icon="rate_review"
              title="Feedback geben"
              hint="Lob, Tadel, Vorschläge und Wünsche"
            />
            <LinkRow
              href="/datenschutz"
              icon="shield"
              title="Datenschutz"
              hint="Was gespeichert wird und was nicht"
            />
            <LinkRow
              href="/impressum"
              icon="badge"
              title="Impressum"
              hint="Wer hinter MS Akku steht"
            />
          </section>

          <div className="flex items-center justify-center gap-1.5 pt-space-xs text-on-surface-variant">
            <Icon name="verified_user" className="text-[16px] text-primary" />
            <span className="text-label-sm">
              Keine Registrierung erforderlich • offline nutzbar
            </span>
          </div>
        </div>
      </main>
    </>
  );
}
