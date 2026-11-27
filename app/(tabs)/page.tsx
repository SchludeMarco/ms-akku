"use client";

import { useState } from "react";
import { useLiveQuery } from "dexie-react-hooks";

import { AppHeader } from "@/components/app-header";
import { TodayHistory } from "@/components/heute/today-history";
import { Icon } from "@/components/icon";
import { db, newId } from "@/lib/db";
import { formatLongDate, formatTime } from "@/lib/dates";
import { ZONE_PILL, ZONE_STYLES, zoneOf } from "@/lib/energy";
import { playSuccess, playTick } from "@/lib/sound";
import { cn } from "@/lib/utils";

// "Heute" ist der Kern der App: den Akku in ein paar Sekunden festhalten.
// Zahl, Regler, Speichern – mehr braucht es nicht. Notiz und Stichworte sind
// freiwillig und bleiben zugeklappt.

const QUICK = [
  { level: 20, label: "Ruhig" },
  { level: 50, label: "Ausgeglichen" },
  { level: 80, label: "Kraftvoll" },
] as const;

/** Was nach eigenem Empfinden beigetragen hat – als Stichwort am Eintrag. */
const FACTORS = ["Schlaf", "Bewegung", "Termin", "Wetter / Hitze", "Ruhepause"] as const;

const MAX_NOTE = 280;

export default function HeutePage() {
  const [now] = useState(() => new Date());

  const latest = useLiveQuery(
    () =>
      db.batteryEntries
        .orderBy("timestamp")
        .last()
        .then((entry) => entry ?? null),
    [],
  );

  const [draft, setDraft] = useState<number | null>(null);
  const [tags, setTags] = useState<string[]>([]);
  const [note, setNote] = useState("");
  const [saving, setSaving] = useState(false);

  const level = draft ?? latest?.energyLevel ?? 50;
  const zone = zoneOf(level);
  const styles = ZONE_STYLES[zone];
  // Gespeichert ist der Stand, solange nichts verändert wurde.
  const changed = draft !== null || tags.length > 0 || note.trim().length > 0;

  function choose(value: number) {
    playTick();
    setDraft(value);
  }

  async function save() {
    if (saving) return;
    setSaving(true);
    const timestamp = new Date().toISOString();
    const trimmed = note.trim();
    await db.batteryEntries.add({
      id: newId(),
      timestamp,
      energyLevel: level,
      createdAt: timestamp,
      ...(trimmed ? { note: trimmed } : {}),
      ...(tags.length > 0 ? { tags } : {}),
    });
    playSuccess();
    setDraft(null);
    setTags([]);
    setNote("");
    setSaving(false);
  }

  return (
    <>
      <AppHeader title="Heute" />
      <main className="mx-auto flex w-full max-w-xl flex-1 flex-col pb-28 pt-16">
        <div className="flex w-full flex-col gap-space-md px-margin pb-10 pt-space-md">
          <p className="text-body-md text-on-surface-variant">{formatLongDate(now)}</p>

          <section
            aria-labelledby="akku-heading"
            className="flex flex-col gap-space-md rounded-2xl border border-outline-variant/30 bg-surface-container-low p-5 shadow-md"
          >
            <div className="flex items-start justify-between gap-2">
              <h2 id="akku-heading" className="text-headline-md text-on-surface">
                Wie voll ist dein Akku?
              </h2>
              <span
                className={cn(
                  "inline-flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-1 text-label-md",
                  styles.badge,
                )}
              >
                <span className={cn("h-2 w-2 rounded-full", styles.fill)} />
                {ZONE_PILL[zone].label}
              </span>
            </div>

            <div className="flex flex-col items-center gap-2">
              <span
                className={cn("text-[56px] font-bold leading-none tabular-nums", styles.text)}
                aria-live="polite"
              >
                {level} %
              </span>
              <div className="h-5 w-full overflow-hidden rounded-full bg-surface-container-highest p-0.5">
                <div
                  className={cn("h-full rounded-full transition-all duration-300", styles.fill)}
                  style={{ width: `${level}%` }}
                />
              </div>
            </div>

            <div>
              <label className="sr-only" htmlFor="akku-regler">
                Akku in Prozent
              </label>
              <input
                id="akku-regler"
                type="range"
                min={0}
                max={100}
                step={5}
                value={level}
                onChange={(event) => setDraft(Number(event.target.value))}
                className="akku-range w-full"
                style={{ "--range-color": `rgb(var(--energy-${zone}))` } as React.CSSProperties}
              />
              <div className="flex justify-between text-label-sm text-on-surface-variant">
                <span>leer</span>
                <span>voll</span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2">
              {QUICK.map((option) => {
                const optionStyles = ZONE_STYLES[zoneOf(option.level)];
                const on = level === option.level;
                return (
                  <button
                    key={option.level}
                    type="button"
                    aria-pressed={on}
                    onClick={() => choose(option.level)}
                    className={cn(
                      "flex min-h-[56px] flex-col items-center justify-center rounded-xl border px-1 text-center transition-colors",
                      on ? optionStyles.badge : "border-outline-variant/30 bg-surface-container",
                    )}
                  >
                    <span className={cn("text-label-lg tabular-nums", optionStyles.text)}>
                      {option.level} %
                    </span>
                    <span className="text-label-sm text-on-surface-variant">{option.label}</span>
                  </button>
                );
              })}
            </div>

            <details className="group rounded-xl border border-outline-variant/30 bg-surface-container">
              <summary className="flex min-h-[48px] cursor-pointer list-none items-center justify-between gap-2 px-3 text-label-md text-on-surface [&::-webkit-details-marker]:hidden">
                Mehr dazu (freiwillig)
                <Icon
                  name="expand_more"
                  className="text-[24px] text-on-surface-variant transition-transform group-open:rotate-180"
                />
              </summary>
              <div className="flex flex-col gap-space-sm px-3 pb-3">
                <div className="flex flex-wrap gap-2">
                  {FACTORS.map((factor) => {
                    const on = tags.includes(factor);
                    return (
                      <button
                        key={factor}
                        type="button"
                        aria-pressed={on}
                        onClick={() => {
                          playTick();
                          setTags((current) =>
                            on ? current.filter((tag) => tag !== factor) : [...current, factor],
                          );
                        }}
                        className={cn(
                          "min-h-[48px] rounded-full border px-4 text-label-md transition-colors",
                          on
                            ? "border-primary/50 bg-primary-container font-semibold text-on-primary-fixed"
                            : "border-outline-variant/30 bg-surface-container-low text-on-surface",
                        )}
                      >
                        {factor}
                      </button>
                    );
                  })}
                </div>
                <label className="flex flex-col gap-1">
                  <span className="text-label-md text-on-surface">Notiz</span>
                  <textarea
                    value={note}
                    onChange={(event) => setNote(event.target.value)}
                    maxLength={MAX_NOTE}
                    rows={2}
                    className="w-full rounded-xl border border-outline-variant/40 bg-surface-container-low px-3 py-2 text-body-md text-on-surface focus:border-primary focus:outline-none"
                  />
                </label>
              </div>
            </details>

            <button
              type="button"
              onClick={save}
              disabled={saving}
              className="flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-cta text-label-lg font-semibold text-on-cta shadow-lg transition-transform active:scale-[0.99] disabled:opacity-50"
            >
              <Icon name="check_circle" className="text-[22px]" />
              Speichern
            </button>

            <p
              className="flex items-center justify-center gap-1.5 text-body-sm text-on-surface-variant"
              aria-live="polite"
            >
              <Icon name={changed ? "edit" : "lock"} className="text-[16px]" />
              {changed
                ? "Noch nicht gespeichert"
                : latest
                  ? `Zuletzt gespeichert um ${formatTime(latest.timestamp)} Uhr`
                  : "Deine Einschätzung bleibt auf diesem Gerät"}
            </p>
          </section>

          <TodayHistory now={now} />

          <p className="text-center text-body-sm text-on-surface-variant">
            Dein Akku ist deine persönliche Einschätzung, kein medizinischer Messwert.
          </p>
        </div>
      </main>
    </>
  );
}
