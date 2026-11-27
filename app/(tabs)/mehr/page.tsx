"use client";

import { useState } from "react";
import Link from "next/link";

import { AppHeader } from "@/components/app-header";
import { Icon } from "@/components/icon";
import { clearAllEntries } from "@/lib/entries";
import { playToggleFeedback } from "@/lib/sound";
import {
  useSettingsStore,
  type ExtraKey,
  type ThemeMode,
} from "@/lib/stores/settings-store";
import { cn } from "@/lib/utils";

const THEMES: { key: ThemeMode; label: string; icon: string }[] = [
  { key: "auto", label: "Automatisch", icon: "brightness_auto" },
  { key: "dark", label: "Dunkel", icon: "dark_mode" },
  { key: "pastel", label: "Hell", icon: "light_mode" },
];

/** Funktionen, die ab Werk ausgeblendet sind und sich hier einschalten lassen. */
const EXTRAS: { key: ExtraKey; title: string; hint: string }[] = [
  {
    key: "library",
    title: "Symptombibliothek",
    hint: "Symptome nachschlagen, auswählen und bewerten",
  },
  {
    key: "capture",
    title: "Symptome erfassen",
    hint: "Knopf zum Festhalten von Veränderungen",
  },
  { key: "patterns", title: "Muster", hint: "Zusammenhänge in deinen Einträgen" },
];

const ROW =
  "flex min-h-[64px] w-full items-center justify-between gap-3 rounded-xl border border-outline-variant/30 bg-surface-container p-4 text-left shadow-sm";

const HEADING = "text-label-sm font-semibold uppercase tracking-wider text-primary";

function Toggle({ on }: { on: boolean }) {
  return (
    <span
      className={cn(
        "flex h-7 w-12 shrink-0 items-center rounded-full p-1 transition-colors",
        on ? "bg-primary-container" : "bg-surface-container-highest",
      )}
    >
      <span
        className={cn(
          "h-5 w-5 rounded-full transition-transform",
          on ? "translate-x-5 bg-on-primary" : "bg-outline",
        )}
      />
    </span>
  );
}

function LinkRow({ href, icon, title }: { href: string; icon: string; title: string }) {
  return (
    <Link href={href} className={cn(ROW, "transition-colors active:bg-surface-container-high")}>
      <span className="flex min-w-0 items-center gap-3">
        <Icon name={icon} className="text-[24px] text-primary" />
        <span className="text-label-lg text-on-surface">{title}</span>
      </span>
      <Icon name="chevron_right" className="text-[22px] text-on-surface-variant" />
    </Link>
  );
}

export default function MehrPage() {
  const themeMode = useSettingsStore((state) => state.themeMode);
  const setThemeMode = useSettingsStore((state) => state.setThemeMode);
  const lightHours = useSettingsStore((state) => state.lightHours);
  const setLightHours = useSettingsStore((state) => state.setLightHours);
  const feedbackOn = useSettingsStore((state) => state.soundEnabled || state.hapticsEnabled);
  const setTapFeedback = useSettingsStore((state) => state.setTapFeedback);
  const extras = useSettingsStore((state) => state.extras);
  const setExtra = useSettingsStore((state) => state.setExtra);

  const [confirmClear, setConfirmClear] = useState(false);
  const [cleared, setCleared] = useState(false);

  async function handleClear() {
    await clearAllEntries();
    setConfirmClear(false);
    setCleared(true);
  }

  return (
    <>
      <AppHeader title="Mehr" />
      <main className="mx-auto flex w-full max-w-xl flex-1 flex-col pb-28 pt-16">
        <div className="flex w-full flex-col gap-space-lg px-margin pb-space-lg pt-space-md">
          <section className="space-y-2">
            <h2 className={HEADING}>Darstellung</h2>
            <div className="space-y-space-sm rounded-xl border border-outline-variant/30 bg-surface-container p-4 shadow-sm">
              <div role="radiogroup" aria-label="Erscheinungsbild" className="grid grid-cols-3 gap-2">
                {THEMES.map((option) => {
                  const on = themeMode === option.key;
                  return (
                    <button
                      key={option.key}
                      type="button"
                      role="radio"
                      aria-checked={on}
                      onClick={() => setThemeMode(option.key)}
                      className={cn(
                        "flex min-h-[64px] flex-col items-center justify-center gap-1 rounded-xl px-1 text-label-md transition-colors",
                        on
                          ? "border border-primary/50 bg-primary-container font-bold text-on-primary-fixed"
                          : "border border-outline-variant/40 bg-surface-container-low text-on-surface",
                      )}
                    >
                      <Icon name={option.icon} className="text-[20px]" />
                      {option.label}
                    </button>
                  );
                })}
              </div>
              {themeMode === "auto" && (
                <p className="text-body-sm text-on-surface-variant">
                  Von {lightHours.from} bis {lightHours.until} Uhr hell, sonst dunkel.
                </p>
              )}
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={feedbackOn}
              onClick={() => {
                setTapFeedback(!feedbackOn);
                playToggleFeedback();
              }}
              className={ROW}
            >
              <span className="flex min-w-0 items-center gap-3">
                <Icon name="vibration" className="text-[24px] text-primary" />
                <span className="min-w-0">
                  <span className="block text-label-lg text-on-surface">
                    Rückmeldung beim Tippen
                  </span>
                  <span className="block text-body-sm text-on-surface-variant">
                    Leiser Ton, kurzes Vibrieren, Nachfedern
                  </span>
                </span>
              </span>
              <Toggle on={feedbackOn} />
            </button>
          </section>

          <section className="space-y-2">
            <h2 className={HEADING}>Deine Daten</h2>
            <p className="text-body-sm text-on-surface-variant">
              Alles liegt nur auf diesem Gerät, ohne Konto.
            </p>
            <LinkRow href="/daten" icon="save" title="Sichern und mitnehmen" />
            {confirmClear ? (
              <div className="space-y-space-sm rounded-xl border border-error/30 bg-surface-container p-4">
                <p className="text-body-md text-on-surface">
                  Alle Einträge löschen? Das lässt sich nicht rückgängig machen.
                </p>
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
              </div>
            ) : (
              <button type="button" onClick={() => setConfirmClear(true)} className={ROW}>
                <span className="flex min-w-0 items-center gap-3">
                  <Icon name="delete" className="text-[24px] text-error" />
                  <span className="text-label-lg text-on-surface">
                    {cleared ? "Einträge gelöscht" : "Alle Einträge löschen"}
                  </span>
                </span>
              </button>
            )}
          </section>

          {(extras.library || extras.capture) && (
            <section className="space-y-2">
              <h2 className={HEADING}>Eingeschaltet</h2>
              {extras.library && (
                <LinkRow href="/symptome" icon="menu_book" title="Symptombibliothek" />
              )}
              {extras.capture && (
                <LinkRow href="/erfassen" icon="bolt" title="Veränderung erfassen" />
              )}
            </section>
          )}

          <details className="group rounded-xl border border-outline-variant/30 bg-surface-container-low">
            <summary className="flex min-h-[56px] cursor-pointer list-none items-center justify-between gap-2 px-4 text-label-lg text-on-surface [&::-webkit-details-marker]:hidden">
              Erweitert
              <Icon
                name="expand_more"
                className="text-[24px] text-on-surface-variant transition-transform group-open:rotate-180"
              />
            </summary>
            <div className="flex flex-col gap-2 px-3 pb-3">
              <p className="px-1 text-body-sm text-on-surface-variant">
                Zusätzliche Funktionen. Ab Werk aus, damit die App einfach bleibt.
              </p>
              {EXTRAS.map((extra) => (
                <button
                  key={extra.key}
                  type="button"
                  role="switch"
                  aria-checked={extras[extra.key]}
                  onClick={() => setExtra(extra.key, !extras[extra.key])}
                  className={ROW}
                >
                  <span className="min-w-0">
                    <span className="block text-label-lg text-on-surface">{extra.title}</span>
                    <span className="block text-body-sm text-on-surface-variant">
                      {extra.hint}
                    </span>
                  </span>
                  <Toggle on={extras[extra.key]} />
                </button>
              ))}
              {themeMode === "auto" && (
                <div className="grid grid-cols-2 gap-2 rounded-xl border border-outline-variant/30 bg-surface-container p-3">
                  <label className="flex flex-col gap-1">
                    <span className="text-label-md text-on-surface">Hell ab</span>
                    <input
                      type="time"
                      value={lightHours.from}
                      onChange={(event) =>
                        event.target.value && setLightHours({ from: event.target.value })
                      }
                      className="min-h-[48px] w-full rounded-lg border border-outline-variant/40 bg-surface-container-low px-3 text-body-md tabular-nums text-on-surface focus:border-primary focus:outline-none"
                    />
                  </label>
                  <label className="flex flex-col gap-1">
                    <span className="text-label-md text-on-surface">Dunkel ab</span>
                    <input
                      type="time"
                      value={lightHours.until}
                      onChange={(event) =>
                        event.target.value && setLightHours({ until: event.target.value })
                      }
                      className="min-h-[48px] w-full rounded-lg border border-outline-variant/40 bg-surface-container-low px-3 text-body-md tabular-nums text-on-surface focus:border-primary focus:outline-none"
                    />
                  </label>
                </div>
              )}
            </div>
          </details>

          <section className="space-y-2">
            <h2 className={HEADING}>Über MS Akku</h2>
            <LinkRow href="/datenschutz" icon="shield" title="Datenschutz" />
            <LinkRow href="/impressum" icon="badge" title="Impressum" />
          </section>
        </div>
      </main>
    </>
  );
}
