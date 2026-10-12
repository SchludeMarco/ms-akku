"use client";

import Link from "next/link";
import { useLiveQuery } from "dexie-react-hooks";

import { Icon } from "@/components/icon";
import { db } from "@/lib/db";
import { formatTime } from "@/lib/dates";
import { ZONE_PILL, ZONE_STATUS, ZONE_STYLES, zoneOf } from "@/lib/energy";
import { cn } from "@/lib/utils";

/** "Vor 2 Stunden", "Vor 12 Minuten", "Gerade eben". */
function ago(iso: string, now: Date): string {
  const minutes = Math.max(0, Math.round((now.getTime() - new Date(iso).getTime()) / 60000));
  if (minutes < 2) return "Gerade eben";
  if (minutes < 60) return `Vor ${minutes} Minuten`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return hours === 1 ? "Vor 1 Stunde" : `Vor ${hours} Stunden`;
  const days = Math.round(hours / 24);
  return days === 1 ? "Vor 1 Tag" : `Vor ${days} Tagen`;
}

/**
 * Kernkarte "Mein aktueller Akku" nach dem Stitch-Redesign: Zahl, Zustand und
 * ein ruhiger Balken. Eingeschätzt wird auf dem eigenen Screen /akku.
 */
export function AkkuCard({ now }: { now: Date }) {
  const latest = useLiveQuery(
    () =>
      db.batteryEntries
        .orderBy("timestamp")
        .last()
        .then((entry) => entry ?? null),
    [],
  );

  const level = latest?.energyLevel;
  const zone = level === undefined ? null : zoneOf(level);
  const styles = zone ? ZONE_STYLES[zone] : null;

  return (
    <section
      aria-labelledby="akku-card-title"
      className="flex w-full flex-col rounded-2xl border border-outline-variant/30 bg-surface-container-low p-5 shadow-md"
    >
      <div className="mb-2 flex items-start justify-between gap-2">
        <h2 id="akku-card-title" className="text-headline-md text-on-surface">
          Mein aktueller Akku
        </h2>
        {zone && styles && (
          <span
            className={cn(
              "inline-flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-1 text-label-md",
              styles.badge,
            )}
          >
            <span className={cn("h-2 w-2 rounded-full", styles.fill)} />
            {ZONE_PILL[zone].label}
          </span>
        )}
      </div>

      <div className="my-2 flex items-center gap-4">
        <span
          className={cn(
            "shrink-0 text-display-lg tabular-nums tracking-tight",
            styles?.text ?? "text-on-surface-variant",
          )}
        >
          {level === undefined ? "– %" : `${level} %`}
        </span>
        <span className="text-label-lg font-medium text-on-surface-variant">
          {zone
            ? ZONE_STATUS[zone]
            : "Noch nicht eingeschätzt. Es gibt kein Richtig oder Falsch."}
        </span>
      </div>

      <div
        role="img"
        aria-label={
          level === undefined ? "Akku noch nicht eingeschätzt" : `Akku bei ${level} Prozent`
        }
        className="my-2 h-5 w-full overflow-hidden rounded-full bg-surface-container-highest p-0.5"
      >
        <div
          className={cn("h-full rounded-full transition-all duration-500", styles?.fill)}
          style={{ width: `${level ?? 0}%` }}
        />
      </div>

      {latest && (
        <div className="mt-1 flex items-center gap-2">
          <Icon name="schedule" className="text-[18px] text-outline" />
          <span className="text-body-sm text-on-surface-variant">
            {ago(latest.timestamp, now)} aktualisiert ({formatTime(latest.timestamp)} Uhr)
          </span>
        </div>
      )}

      <Link
        href="/akku"
        className="mt-space-md flex min-h-[52px] w-full items-center justify-center gap-3 rounded-xl bg-action px-4 py-3 text-label-lg text-on-action shadow-sm transition-colors"
      >
        <Icon name="tune" className="text-[24px]" />
        {latest ? "Jetzt Akku anpassen" : "Akku einschätzen"}
      </Link>
    </section>
  );
}
