"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useLiveQuery } from "dexie-react-hooks";

import { AppHeader } from "@/components/app-header";
import { Icon } from "@/components/icon";
import { db, newId } from "@/lib/db";
import { ZONE_PILL, ZONE_STYLES, zoneOf } from "@/lib/energy";
import { playSuccess, playTick } from "@/lib/sound";
import { cn } from "@/lib/utils";

// Screen "Akku einschätzen" nach dem Stitch-Redesign. Die Einschätzung wird
// erst mit "Einschätzung speichern" gesichert und führt dann zur Übersicht.

const TICKS = [0, 25, 50, 75, 100];

const QUICK = [
  { level: 20, label: "Ruhig" },
  { level: 50, label: "Ausgeglichen" },
  { level: 80, label: "Kraftvoll" },
] as const;

/** Was nach eigenem Empfinden beigetragen hat – als Stichwort am Eintrag. */
const FACTORS = [
  { label: "Schlaf", icon: "bedtime" },
  { label: "Spaziergang", icon: "directions_walk" },
  { label: "Termin", icon: "event" },
  { label: "Wetter / Hitze", icon: "sunny" },
  { label: "Ruhepause", icon: "self_improvement" },
] as const;

const MAX_NOTE = 280;

export default function AkkuEinschaetzenPage() {
  const router = useRouter();
  const latest = useLiveQuery(
    () =>
      db.batteryEntries
        .orderBy("timestamp")
        .last()
        .then((entry) => entry?.energyLevel ?? 50),
    [],
  );

  const [draft, setDraft] = useState<number | null>(null);
  const [tags, setTags] = useState<string[]>([]);
  const [note, setNote] = useState("");
  const [saving, setSaving] = useState(false);

  const level = draft ?? latest ?? 50;
  const zone = zoneOf(level);
  const styles = ZONE_STYLES[zone];

  function toggleTag(label: string) {
    playTick();
    setTags((current) =>
      current.includes(label) ? current.filter((tag) => tag !== label) : [...current, label],
    );
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
    router.replace("/");
  }

  return (
    <>
      <AppHeader title="Akku einschätzen" back />
      <main className="mx-auto flex w-full max-w-xl flex-1 flex-col pb-40 pt-16">
        <div className="flex w-full flex-col gap-space-md px-margin pt-space-md">
          <div className="flex flex-col gap-1">
            <h2 className="text-headline-md text-on-surface">Wie fühlst du dich gerade?</h2>
            <p className="text-body-md text-on-surface-variant">
              Wähle deine aktuelle Energie nach deinem Gefühl.
            </p>
          </div>

          <section className="flex flex-col items-center gap-space-sm rounded-2xl border border-outline-variant/30 bg-surface-container-low p-5">
            {/* Akku-Bild: Der Füllstand folgt dem Regler. */}
            <div aria-hidden="true" className="flex flex-col items-center">
              <div className="h-1.5 w-8 rounded-t bg-outline-variant" />
              <div className="flex h-36 w-28 items-end rounded-2xl border border-outline-variant/40 bg-surface-container-lowest p-2">
                <div
                  className={cn(
                    "flex w-full items-center justify-center rounded-xl transition-all duration-300",
                    styles.fill,
                  )}
                  style={{ height: `${Math.max(level, 6)}%` }}
                >
                  {level >= 30 && <Icon name="bolt" className="text-[22px] text-on-energy" />}
                </div>
              </div>
            </div>

            <span className={cn("text-display-lg tabular-nums", styles.text)} aria-live="polite">
              {level} %
            </span>
            <span
              className={cn(
                "inline-flex items-center rounded-full border px-4 py-1.5 text-label-lg",
                styles.badge,
              )}
            >
              {ZONE_PILL[zone].label}
            </span>

            <div className="w-full pt-space-sm">
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
              <div className="mt-1 flex justify-between">
                {TICKS.map((tick) => (
                  <button
                    key={tick}
                    type="button"
                    onClick={() => {
                      playTick();
                      setDraft(tick);
                    }}
                    className={cn(
                      "flex min-h-[48px] min-w-[48px] items-center justify-center rounded-lg text-label-md tabular-nums",
                      tick === level ? "font-bold text-on-surface" : "text-on-surface-variant",
                    )}
                  >
                    {tick}%
                  </button>
                ))}
              </div>
            </div>
          </section>

          <section className="flex flex-col gap-2">
            <h3 className="text-label-lg font-medium text-on-surface-variant">
              Schnellwahl nach Gefühl
            </h3>
            {QUICK.map((option) => {
              const optionZone = zoneOf(option.level);
              const on = level === option.level;
              return (
                <button
                  key={option.level}
                  type="button"
                  aria-pressed={on}
                  onClick={() => {
                    playTick();
                    setDraft(option.level);
                  }}
                  className={cn(
                    "flex min-h-[52px] w-full items-center justify-center gap-2 rounded-full border px-4 text-label-lg transition-colors",
                    on
                      ? ZONE_STYLES[optionZone].badge
                      : "border-outline-variant/30 bg-surface-container-low",
                    ZONE_STYLES[optionZone].text,
                  )}
                >
                  <span className={cn("h-2.5 w-2.5 rounded-full", ZONE_STYLES[optionZone].fill)} />
                  {option.level} % {option.label}
                </button>
              );
            })}
          </section>

          <section className="flex flex-col gap-2">
            <div className="flex items-center justify-between gap-2">
              <h3 className="text-label-lg text-on-surface">Was hat beigetragen?</h3>
              <span className="text-body-sm text-on-surface-variant">Mehrfachauswahl</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {FACTORS.map((factor) => {
                const on = tags.includes(factor.label);
                return (
                  <button
                    key={factor.label}
                    type="button"
                    aria-pressed={on}
                    onClick={() => toggleTag(factor.label)}
                    className={cn(
                      "flex min-h-[48px] items-center gap-2 rounded-full border px-4 text-label-md transition-colors",
                      on
                        ? "border-primary/50 bg-primary-container font-semibold text-on-primary-fixed"
                        : "border-outline-variant/30 bg-surface-container-low text-on-surface",
                    )}
                  >
                    <Icon name={on ? "check" : factor.icon} className="text-[20px]" />
                    {factor.label}
                  </button>
                );
              })}
            </div>
          </section>

          <label className="flex flex-col gap-2">
            <span className="text-label-lg text-on-surface">Notiz (optional)</span>
            <textarea
              value={note}
              onChange={(event) => setNote(event.target.value)}
              maxLength={MAX_NOTE}
              rows={2}
              placeholder="z. B. Nachmittagstief überwunden …"
              className="w-full rounded-xl border border-outline-variant/40 bg-surface-container-low px-4 py-3 text-body-md text-on-surface placeholder:text-outline focus:border-primary focus:outline-none"
            />
          </label>

          <div className="flex items-start gap-3 rounded-2xl border border-outline-variant/20 bg-surface-container-low p-4">
            <Icon name="favorite" className="mt-0.5 text-[22px] text-secondary" />
            <p className="text-body-sm leading-relaxed text-on-surface-variant">
              Jede Energie ist in Ordnung. Dein Akku ist deine persönliche Einschätzung, kein
              medizinischer Messwert.
            </p>
          </div>
        </div>
      </main>

      <div className="pb-safe fixed inset-x-0 bottom-0 z-50 border-t border-outline-variant/30 bg-surface-container-high/95 backdrop-blur-xl">
        <div className="mx-auto flex w-full max-w-xl flex-col gap-2 px-margin py-3">
          <button
            type="button"
            onClick={save}
            disabled={saving}
            className="flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-cta text-label-lg font-semibold text-on-cta shadow-lg transition-transform active:scale-[0.99] disabled:opacity-50"
          >
            <Icon name="check_circle" className="text-[22px]" />
            Einschätzung speichern
          </button>
          <p className="flex items-center justify-center gap-1.5 text-body-sm text-on-surface-variant">
            <Icon name="lock" className="text-[16px]" />
            Bleibt geschützt auf deinem Gerät.
          </p>
        </div>
      </div>
    </>
  );
}
