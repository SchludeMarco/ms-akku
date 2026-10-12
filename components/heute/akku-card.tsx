"use client";

import { useEffect, useRef, useState } from "react";
import { useLiveQuery } from "dexie-react-hooks";

import { Icon } from "@/components/icon";
import { db, newId } from "@/lib/db";
import { formatTime, partOfDay } from "@/lib/dates";
import {
  ZONE_MESSAGE,
  ZONE_PILL,
  ZONE_STATUS,
  ZONE_STYLES,
  zoneOf,
} from "@/lib/energy";
import { playSuccess, playTick } from "@/lib/sound";
import { cn } from "@/lib/utils";

const STEP_CHIPS = [20, 40, 60, 80, 100];

const QUICK_STATES = [
  { label: "Ausgeruht", hint: "Leicht & klar", status: "Ausgeruht", level: 85 },
  { label: "Erschöpft", hint: "Pausen nötig", status: "Leicht erschöpft", level: 55 },
  { label: "Fatigue", hint: "Schonmodus", status: "Fatigue spürbar", level: 25 },
] as const;

// Nach der letzten Änderung kurz warten, damit mehrfaches Tippen auf +/- nur
// einen Eintrag erzeugt.
const SAVE_DELAY_MS = 1200;

const PILL_STYLES = {
  high: "border-primary/30 bg-primary/15 text-primary",
  mid: "border-pacing/30 bg-pacing/15 text-pacing-soft",
  low: "border-tertiary/30 bg-tertiary/15 text-tertiary",
} as const;

export function AkkuCard({ now }: { now: Date }) {
  const latest = useLiveQuery(
    () =>
      db.batteryEntries
        .orderBy("timestamp")
        .last()
        .then((entry) => entry ?? null),
    [],
  );

  const [draft, setDraft] = useState<number | null>(null);
  const [customStatus, setCustomStatus] = useState<string | null>(null);
  // Die Einstellknöpfe sind nur offen, solange man einschätzt. Mit „OK“ klappt
  // die Karte zu und gibt den Blick auf die Tagesübersicht frei.
  const [editing, setEditing] = useState(false);
  const pending = useRef<{ level: number; timer: number } | null>(null);

  async function save(level: number) {
    const timestamp = new Date().toISOString();
    await db.batteryEntries.add({
      id: newId(),
      timestamp,
      energyLevel: level,
      createdAt: timestamp,
    });
    playSuccess();
  }

  // Beim Verlassen der Seite eine noch ausstehende Änderung nicht verlieren.
  useEffect(() => {
    return () => {
      if (!pending.current) return;
      window.clearTimeout(pending.current.timer);
      void save(pending.current.level);
      pending.current = null;
    };
  }, []);

  function change(next: number, status: string | null = null) {
    const level = Math.max(0, Math.min(100, next));
    setDraft(level);
    setCustomStatus(status);
    playTick();

    if (pending.current) window.clearTimeout(pending.current.timer);
    const timer = window.setTimeout(() => {
      pending.current = null;
      void save(level);
    }, SAVE_DELAY_MS);
    pending.current = { level, timer };
  }

  /** Speichert eine noch ausstehende Änderung sofort und schließt die Eingabe. */
  function confirm() {
    if (pending.current) {
      window.clearTimeout(pending.current.timer);
      void save(pending.current.level);
      pending.current = null;
    }
    setEditing(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  const level = draft ?? latest?.energyLevel ?? 50;
  // Ohne bisherige Einschätzung ist die Eingabe von Anfang an offen.
  const open = editing || latest === null;
  const hasEstimate = draft !== null || Boolean(latest);
  const zone = zoneOf(level);
  const styles = ZONE_STYLES[zone];
  const pill = ZONE_PILL[zone];
  const activeSegments = Math.ceil(level / 20);
  const chips = STEP_CHIPS.includes(level)
    ? STEP_CHIPS
    : [...STEP_CHIPS, level].sort((a, b) => a - b);

  return (
    <section
      aria-labelledby="akku-card-title"
      className="space-y-4 rounded-xl border border-outline-variant/30 bg-surface-container p-6 shadow-md"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <span
            id="akku-card-title"
            className="text-label-md font-semibold uppercase tracking-wider text-on-surface-variant"
          >
            Mein Akku
          </span>
          <p className="text-body-sm text-on-surface-variant">
            Eigene Einschätzung für den {partOfDay(now)}
          </p>
        </div>
        <span
          className={cn(
            "inline-flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-1 text-label-sm",
            PILL_STYLES[zone],
          )}
        >
          <Icon name={pill.icon} className="text-[16px]" />
          {pill.label}
        </span>
      </div>

      {/* Auf schmalen Handys steht die Skala unter der Zahl, damit ihre
          Beschriftung Platz hat. */}
      <div className="flex flex-col gap-3 pt-1 min-[420px]:flex-row min-[420px]:items-center min-[420px]:gap-6">
        <div className="flex flex-col">
          <div className="flex items-baseline gap-1">
            <span
              className={cn(
                "text-display-lg tabular-nums transition-colors",
                styles.text,
              )}
            >
              {level}
            </span>
            <span className={cn("text-headline-md font-medium", styles.text)}>
              %
            </span>
          </div>
          <span className="whitespace-nowrap text-label-sm text-on-surface-variant">
            {hasEstimate
              ? (customStatus ?? ZONE_STATUS[zone])
              : "Noch nicht eingeschätzt"}
          </span>
        </div>

        <div className="flex w-full flex-1 flex-col space-y-2">
          <div className="flex h-6 w-full items-center gap-1.5 rounded-full border border-outline-variant/30 bg-surface-container-lowest p-1">
            {[1, 2, 3, 4, 5].map((segment) => (
              <div
                key={segment}
                className={cn(
                  "h-full flex-1 rounded-full transition-all duration-300",
                  segment <= activeSegments
                    ? cn(styles.fill, "shadow-sm")
                    : "bg-surface-container-highest",
                  segment === activeSegments && level % 20 !== 0 && "opacity-80",
                )}
              />
            ))}
          </div>
          <div className="grid grid-cols-3 gap-2 px-1 text-label-sm leading-tight text-on-surface-variant">
            <span>Rückzug nötig</span>
            <span className="text-center">Achtsam</span>
            <span className="text-right">Volle Kraft</span>
          </div>
        </div>
      </div>

      {!open && (
        <button
          type="button"
          onClick={() => setEditing(true)}
          className="flex min-h-[52px] w-full items-center justify-center gap-2 rounded-xl border border-outline-variant/30 bg-surface-container-high text-label-lg text-primary transition-colors active:bg-surface-bright"
        >
          <Icon name="tune" className="text-[20px]" />
          Akku neu einschätzen
        </button>
      )}

      {open && (
        <div className="space-y-2 pt-1">
          {/* Schmale Handys: − und + nebeneinander, die Prozent-Chips in voller
              Breite darunter. Sonst passen sechs Chips nicht in die Zeile. */}
          <div className="flex flex-wrap items-center justify-between gap-2">
            <button
              type="button"
              aria-label="Akku um 5 Prozent senken"
              onClick={() => change(level - 5)}
              className="flex h-14 flex-1 items-center justify-center rounded-xl border border-outline-variant/30 bg-surface-container-high text-primary transition-colors hover:bg-surface-bright active:bg-surface-bright min-[480px]:w-14 min-[480px]:flex-none"
            >
              <Icon name="remove" className="text-[26px]" />
            </button>
            <div className="order-last flex w-full min-w-0 items-center justify-between gap-1 py-1 min-[480px]:order-none min-[480px]:w-auto min-[480px]:flex-1">
              {chips.map((chip) => (
                <button
                  key={chip}
                  type="button"
                  aria-pressed={chip === level}
                  onClick={() => change(chip)}
                  className={cn(
                    "min-h-[48px] min-w-0 flex-1 rounded-lg px-0.5 py-2 text-center text-label-md tabular-nums transition-colors",
                    chip === level
                      ? "bg-primary-container font-bold text-on-primary-fixed shadow-md"
                      : "border border-outline-variant/30 bg-surface-container-low text-on-surface active:bg-surface-bright",
                  )}
                >
                  {chip}%
                </button>
              ))}
            </div>
            <button
              type="button"
              aria-label="Akku um 5 Prozent erhöhen"
              onClick={() => change(level + 5)}
              className="flex h-14 flex-1 items-center justify-center rounded-xl border border-outline-variant/30 bg-surface-container-high text-primary transition-colors hover:bg-surface-bright active:bg-surface-bright min-[480px]:w-14 min-[480px]:flex-none"
            >
              <Icon name="add" className="text-[26px]" />
            </button>
          </div>

          <div className="grid grid-cols-3 gap-1 pt-1">
            {QUICK_STATES.map((state) => (
              <button
                key={state.label}
                type="button"
                onClick={() => change(state.level, state.status)}
                className="flex min-h-[50px] flex-col justify-center rounded-lg border border-outline-variant/30 bg-surface-container-low p-2 text-left transition-colors active:bg-surface-container-high"
              >
                <span className="text-label-md font-semibold text-on-surface">
                  {state.label}
                </span>
                <span className="text-label-sm text-on-surface-variant">
                  {state.hint}
                </span>
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={confirm}
            disabled={!hasEstimate}
            className="flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-primary text-label-lg font-semibold text-on-primary shadow-lg shadow-primary/10 transition-transform active:scale-[0.99] disabled:opacity-40"
          >
            <Icon name="check" className="text-[22px]" />
            OK
          </button>
        </div>
      )}

      <div className="flex items-center gap-2 rounded-lg border border-outline-variant/20 bg-surface-container-low p-4">
        <Icon name="favorite" className="text-[24px] text-primary" />
        <p className="text-body-sm leading-snug text-on-surface">
          {hasEstimate
            ? ZONE_MESSAGE[zone]
            : "Schätze deinen Akku ein – ein Tippen genügt. Es gibt kein Richtig oder Falsch."}
        </p>
      </div>

      {latest && (
        <p className="flex items-center justify-center gap-1.5 text-label-sm text-on-surface-variant">
          <Icon name="lock" className="text-[14px]" />
          Zuletzt gespeichert um {formatTime(latest.timestamp)} Uhr
        </p>
      )}
    </section>
  );
}
