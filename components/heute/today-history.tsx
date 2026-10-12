"use client";

import Link from "next/link";
import { useLiveQuery } from "dexie-react-hooks";

import { Icon } from "@/components/icon";
import { db } from "@/lib/db";
import { formatTime, startOfDay } from "@/lib/dates";
import { ZONE_PILL, ZONE_STATUS, ZONE_STYLES, zoneOf } from "@/lib/energy";
import { cn } from "@/lib/utils";

/** "Heutiger Verlauf" nach dem Stitch-Redesign: die Akku-Einschätzungen von heute. */
export function TodayHistory({ now }: { now: Date }) {
  const entries = useLiveQuery(
    () =>
      db.batteryEntries
        .where("timestamp")
        .aboveOrEqual(startOfDay(now).toISOString())
        .sortBy("timestamp"),
    [now],
  );

  return (
    <section
      aria-labelledby="today-history-heading"
      className="flex w-full flex-col rounded-2xl border border-outline-variant/30 bg-surface-container p-4 shadow-md"
    >
      <div className="mb-space-sm flex items-center justify-between gap-2">
        <h2 id="today-history-heading" className="text-headline-md text-on-surface">
          Heutiger Verlauf
        </h2>
        <Link
          href="/verlauf"
          className="flex min-h-[48px] shrink-0 items-center rounded-lg px-2 text-label-md text-secondary"
        >
          Alle ansehen
        </Link>
      </div>

      {entries && entries.length === 0 && (
        <p className="rounded-xl bg-surface-container-low p-3 text-body-md text-on-surface-variant">
          Heute gibt es noch keine Einschätzung. Ein Tippen auf „Akku einschätzen“ genügt.
        </p>
      )}

      <ul className="flex flex-col gap-2">
        {entries?.map((entry) => {
          const zone = zoneOf(entry.energyLevel);
          const styles = ZONE_STYLES[zone];
          return (
            <li
              key={entry.id}
              className="flex min-h-[56px] items-center justify-between gap-space-sm rounded-xl bg-surface-container-low p-3"
            >
              <div className="flex min-w-0 flex-col pr-2">
                <span className="text-label-lg text-on-surface">
                  {formatTime(entry.timestamp)} Uhr
                </span>
                <span className="break-words text-body-sm text-on-surface-variant">
                  {entry.note || entry.tags?.join(", ") || ZONE_STATUS[zone]}
                </span>
              </div>
              <div
                className={cn(
                  "flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-1.5",
                  styles.badge,
                )}
              >
                <Icon name={ZONE_PILL[zone].icon} className="text-[18px]" />
                <span className="text-label-md font-semibold tabular-nums">
                  {entry.energyLevel} %
                </span>
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
