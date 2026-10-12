"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useLiveQuery } from "dexie-react-hooks";

import { AppHeader } from "@/components/app-header";
import { activityIcon } from "@/components/heute/day-plan";
import { Icon } from "@/components/icon";
import { db, type SleepEntry, type SymptomEntry } from "@/lib/db";
import {
  addDays,
  dayHeading,
  dayKey,
  formatTime,
  startOfWeek,
} from "@/lib/dates";
import { ZONE_STYLES, average, batteryIcon, zoneOf } from "@/lib/energy";
import { cn } from "@/lib/utils";

type Range = "week" | "month" | "quarter" | "year";

const RANGES: { key: Range; label: string; title: string }[] = [
  { key: "week", label: "Woche", title: "Akku-Verlauf dieser Woche" },
  { key: "month", label: "Monat", title: "Akku-Verlauf der letzten 5 Wochen" },
  { key: "quarter", label: "3 Monate", title: "Akku-Verlauf der letzten 3 Monate" },
  { key: "year", label: "Jahr", title: "Akku-Verlauf der letzten 12 Monate" },
];

interface Bucket {
  label: string;
  from: Date;
  to: Date; // exklusiv
}

const WEEKDAYS = ["Mo", "Di", "Mi", "Do", "Fr", "Sa", "So"];

function isoWeek(date: Date): number {
  const target = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  target.setUTCDate(target.getUTCDate() + 4 - (target.getUTCDay() || 7));
  const yearStart = Date.UTC(target.getUTCFullYear(), 0, 1);
  return Math.ceil(((target.getTime() - yearStart) / 86400000 + 1) / 7);
}

function bucketsFor(range: Range, now: Date): Bucket[] {
  if (range === "week") {
    const monday = startOfWeek(now);
    return WEEKDAYS.map((label, index) => ({
      label,
      from: addDays(monday, index),
      to: addDays(monday, index + 1),
    }));
  }
  if (range === "month") {
    const monday = startOfWeek(now);
    return [4, 3, 2, 1, 0].map((weeksAgo) => {
      const from = addDays(monday, -7 * weeksAgo);
      return { label: `KW ${isoWeek(from)}`, from, to: addDays(from, 7) };
    });
  }
  const months = range === "quarter" ? 3 : 12;
  return Array.from({ length: months }, (_, index) => {
    const from = new Date(now.getFullYear(), now.getMonth() - (months - 1 - index), 1);
    const to = new Date(from.getFullYear(), from.getMonth() + 1, 1);
    return {
      label: from.toLocaleDateString("de-DE", { month: "short" }).replace(".", ""),
      from,
      to,
    };
  });
}

interface DayEvent {
  time?: string;
  sort: string;
  icon: string;
  iconClass: string;
  text: string;
  /** Nur bei Akku-Einschätzungen: Wert, Stichworte und Notiz. */
  level?: number;
  tags?: string[];
  note?: string;
}

function symptomEvent(entry: SymptomEntry, name: string): DayEvent {
  const base = { time: formatTime(entry.timestamp), sort: entry.timestamp };
  const where = entry.bodyLocation ? ` (${entry.bodyLocation})` : "";
  const note = entry.note ? ` (${entry.note})` : "";

  switch (entry.changeType) {
    case "stronger": {
      const strength =
        entry.intensity === "leicht"
          ? "etwas stärker"
          : entry.intensity === "deutlich"
            ? "deutlich stärker"
            : "sehr stark";
      return {
        ...base,
        icon: "offline_bolt",
        iconClass: "text-pacing-soft",
        text: `${name} ${strength}${where}${note}`,
      };
    }
    case "weaker":
      return {
        ...base,
        icon: "trending_down",
        iconClass: "text-primary",
        text: `${name} schwächer${where}${note}`,
      };
    case "disappeared":
      return {
        ...base,
        icon: "check_circle",
        iconClass: "text-primary",
        text: `${name} verschwunden${note}`,
      };
    case "new":
      return {
        ...base,
        icon: "add_circle",
        iconClass: "text-tertiary",
        text: `${name} neu aufgetreten${where}${note}`,
      };
  }
}

function sleepEvent(night: SleepEntry): DayEvent {
  const hours = night.durationHours
    ? ` (${night.quality === "schlecht" ? "nur " : ""}${String(night.durationHours).replace(".", ",")} Stunden)`
    : "";
  const byQuality = {
    erholsam: { icon: "bedtime", iconClass: "text-primary", text: "Erholsamer Schlaf" },
    unruhig: { icon: "nightlight", iconClass: "text-pacing-soft", text: "Unruhiger Schlaf" },
    schlecht: { icon: "nightlight", iconClass: "text-error", text: "Schlechter Schlaf" },
  }[night.quality];
  return { ...byQuality, text: byQuality.text + hours, sort: "" };
}

export default function VerlaufPage() {
  const [now] = useState(() => new Date());
  const [range, setRange] = useState<Range>("week");

  const buckets = useMemo(() => bucketsFor(range, now), [range, now]);
  const rangeFrom = buckets[0].from;
  const rangeTo = buckets[buckets.length - 1].to;

  const data = useLiveQuery(async () => {
    const from = rangeFrom.toISOString();
    const to = rangeTo.toISOString();
    const [battery, symptomEntries, activities, moments, sleep, symptoms] =
      await Promise.all([
        db.batteryEntries.where("timestamp").between(from, to, true, false).toArray(),
        db.symptomEntries.where("timestamp").between(from, to, true, false).toArray(),
        db.activities.where("timestamp").between(from, to, true, false).toArray(),
        db.moments.where("timestamp").between(from, to, true, false).toArray(),
        db.sleepEntries
          .where("date")
          .between(dayKey(rangeFrom), dayKey(rangeTo), true, false)
          .toArray(),
        db.symptoms.toArray(),
      ]);
    return { battery, symptomEntries, activities, moments, sleep, symptoms };
  }, [rangeFrom, rangeTo]);

  const bars = useMemo(
    () =>
      buckets.map((bucket) => {
        const levels = (data?.battery ?? [])
          .filter((entry) => {
            const time = new Date(entry.timestamp);
            return time >= bucket.from && time < bucket.to;
          })
          .map((entry) => entry.energyLevel);
        return {
          ...bucket,
          value: average(levels),
          isCurrent: now >= bucket.from && now < bucket.to,
          isFuture: bucket.from > now,
        };
      }),
    [buckets, data, now],
  );

  const overall = average((data?.battery ?? []).map((entry) => entry.energyLevel));

  const days = useMemo(() => {
    if (!data) return [];
    const nameById = new Map(data.symptoms.map((symptom) => [symptom.id, symptom.name]));
    const byDay = new Map<string, { levels: number[]; events: DayEvent[] }>();
    const day = (key: string) => {
      if (!byDay.has(key)) byDay.set(key, { levels: [], events: [] });
      return byDay.get(key)!;
    };
    const keyOf = (iso: string) => dayKey(new Date(iso));

    for (const entry of data.battery) {
      day(keyOf(entry.timestamp)).levels.push(entry.energyLevel);
      day(keyOf(entry.timestamp)).events.push({
        time: formatTime(entry.timestamp),
        sort: entry.timestamp,
        icon: batteryIcon(entry.energyLevel),
        iconClass: ZONE_STYLES[zoneOf(entry.energyLevel)].text,
        text: `Akku bei ${entry.energyLevel} %`,
        level: entry.energyLevel,
        tags: entry.tags,
        note: entry.note,
      });
    }
    for (const entry of data.symptomEntries) {
      day(keyOf(entry.timestamp)).events.push(
        symptomEvent(entry, nameById.get(entry.symptomId) ?? "Symptom"),
      );
    }
    for (const activity of data.activities) {
      day(keyOf(activity.timestamp)).events.push({
        time: formatTime(activity.timestamp),
        sort: activity.timestamp,
        icon: activity.completed ? "task_alt" : activityIcon(activity.title),
        iconClass: "text-primary",
        text: activity.completed ? `${activity.title} – erledigt` : activity.title,
      });
    }
    for (const moment of data.moments) {
      if (moment.kind !== "good_day") continue;
      day(keyOf(moment.timestamp)).events.push({
        time: formatTime(moment.timestamp),
        sort: moment.timestamp,
        icon: "wb_sunny",
        iconClass: "text-primary",
        text: "Besonders guter Tag",
      });
    }
    for (const night of data.sleep) {
      day(night.date).events.push(sleepEvent(night));
    }

    const todayKey = dayKey(now);
    return [...byDay.entries()]
      .filter(([key]) => key <= todayKey)
      .sort(([a], [b]) => b.localeCompare(a))
      .slice(0, 30)
      .map(([key, value]) => ({
        key,
        level: average(value.levels),
        events: value.events.sort((a, b) => b.sort.localeCompare(a.sort)),
      }));
  }, [data, now]);

  const compact = bars.length > 7;

  return (
    <>
      <AppHeader title="Verlauf" />
      <main className="mx-auto flex w-full max-w-xl flex-1 flex-col pb-28 pt-16">
        <div className="flex w-full flex-col space-y-space-md px-margin pb-space-lg pt-space-md">
          <div className="flex w-full items-center gap-space-sm rounded-2xl border border-outline-variant/30 bg-surface-container-low p-4 shadow-sm">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-primary/20 bg-surface-container-high">
              <Icon name="spa" filled className="text-[20px] text-primary" />
            </div>
            <div className="flex min-w-0 flex-col">
              <span className="text-headline-sm text-on-surface">Sanfte Chronik</span>
              <p className="text-body-sm text-on-surface-variant">
                Jeder Tag ist wertvoll – ohne Leistungsdruck.
              </p>
            </div>
          </div>

          <section aria-label="Zeitraum auswählen" className="w-full">
            <div className="flex items-center gap-space-xs rounded-xl border border-outline-variant/30 bg-surface-container-low p-1.5 shadow-sm">
              {RANGES.map((option) => (
                <button
                  key={option.key}
                  type="button"
                  aria-pressed={range === option.key}
                  onClick={() => setRange(option.key)}
                  className={cn(
                    "flex min-h-[48px] flex-1 items-center justify-center rounded-lg px-space-xs py-2 text-center text-label-md transition-all",
                    range === option.key
                      ? "bg-primary-container font-semibold text-on-primary-fixed shadow-sm"
                      : "bg-transparent text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface",
                  )}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </section>

          <section className="w-full space-y-space-md rounded-2xl border border-outline-variant/30 bg-surface-container-low p-4 shadow-md">
            <div className="flex items-start justify-between gap-space-sm">
              <div className="flex flex-col">
                <span className="text-label-sm font-bold uppercase tracking-wide text-primary">
                  Rhythmus &amp; Reserven
                </span>
                <h2 className="text-headline-md text-on-surface">
                  {RANGES.find((option) => option.key === range)!.title}
                </h2>
              </div>
              {overall !== null && (
                <div className="flex shrink-0 items-center gap-1 rounded-full border border-primary/20 bg-surface-container-high px-3 py-1">
                  <Icon name="show_chart" className="text-[16px] text-primary" />
                  <span className="text-label-sm font-bold text-primary">Ø {overall} %</span>
                </div>
              )}
            </div>

            <div className="pt-space-sm">
              <div
                className={cn(
                  "flex h-44 w-full items-end justify-between px-1",
                  compact ? "gap-1" : "gap-2",
                )}
              >
                {bars.map((bar) => {
                  const empty = bar.value === null;
                  const zone = zoneOf(bar.value ?? 0);
                  return (
                    <div
                      key={bar.from.toISOString()}
                      className={cn(
                        "relative flex h-full flex-1 flex-col items-center justify-end",
                        empty && "opacity-40",
                      )}
                    >
                      {bar.isCurrent && !compact && (
                        <div className="absolute -top-3.5 whitespace-nowrap rounded-full bg-primary px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-on-primary shadow-sm">
                          {range === "week" ? "Heute" : "Aktuell"}
                        </div>
                      )}
                      <span
                        className={cn(
                          "mb-1",
                          bar.isCurrent ? "text-label-md font-bold" : "text-label-sm font-medium",
                          compact && "text-[11px]",
                          empty ? "text-on-surface-variant" : ZONE_STYLES[zone].text,
                        )}
                      >
                        {empty ? "--" : compact ? bar.value : `${bar.value}%`}
                      </span>
                      <div
                        className={cn(
                          "relative flex h-full w-full max-w-[34px] flex-col justify-end overflow-hidden rounded-t-lg border-x border-t bg-surface-container-low",
                          bar.isCurrent
                            ? "border-primary/40 ring-1 ring-primary/30"
                            : "border-outline-variant/20",
                        )}
                      >
                        {empty ? (
                          <div className="h-2 w-full rounded-t-lg bg-surface-container-highest" />
                        ) : (
                          <div
                            className={cn(
                              "w-full rounded-t-lg transition-all duration-500",
                              bar.isCurrent && zone === "high"
                                ? "bg-primary shadow-sm"
                                : ZONE_STYLES[zone].bar,
                            )}
                            style={{ height: `${bar.value}%` }}
                          />
                        )}
                      </div>
                      <span
                        className={cn(
                          "mt-2",
                          compact ? "text-[11px] font-medium" : "text-label-md",
                          bar.isCurrent
                            ? "font-bold text-primary"
                            : "font-medium text-on-surface-variant",
                        )}
                      >
                        {compact ? bar.label.slice(0, 1) : bar.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="flex items-start gap-space-sm rounded-lg border border-outline-variant/20 bg-surface-container-low p-space-sm text-on-surface-variant">
              <Icon name="info" className="mt-0.5 text-[20px] text-primary" />
              <p className="text-body-sm leading-relaxed">
                <strong className="font-semibold text-on-surface">Nur zur Orientierung:</strong>{" "}
                Dein Akku zeigt Schwankungen, keine Schulnoten. Phasen mit weniger Energie
                sind Raum für Erholung.
              </p>
            </div>
          </section>

          <div className="flex items-center justify-between pt-space-xs">
            <h3 className="text-headline-md text-on-surface">Tagesverlauf</h3>
            <span className="text-label-sm text-on-surface-variant">
              Neueste zuerst
            </span>
          </div>

          <div className="space-y-space-md">
            {data && days.length === 0 && (
              <div className="flex items-center gap-space-sm rounded-xl border border-dashed border-outline-variant/40 bg-surface-container-low p-space-md">
                <Icon name="edit_calendar" className="text-[24px] text-primary" />
                <p className="text-body-sm text-on-surface-variant">
                  In diesem Zeitraum gibt es noch keine Einträge. Schätze auf „Heute“
                  deinen Akku ein, dann beginnt deine Chronik.
                </p>
              </div>
            )}

            {days.map((day) => {
              const zone = day.level === null ? null : zoneOf(day.level);
              return (
                <article
                  key={day.key}
                  className="space-y-space-sm rounded-2xl border border-outline-variant/30 bg-surface-container-low p-4 shadow-md"
                >
                  <div className="flex items-center justify-between gap-space-sm">
                    <div className="flex items-center gap-space-xs">
                      <span
                        className={cn(
                          "h-2.5 w-2.5 shrink-0 rounded-full",
                          zone ? ZONE_STYLES[zone].dot : "bg-outline-variant",
                        )}
                      />
                      <h4 className="text-headline-sm text-on-surface">
                        {dayHeading(day.key, now)}
                      </h4>
                    </div>
                    {zone && (
                      <div
                        className={cn(
                          "flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-1.5 shadow-sm",
                          ZONE_STYLES[zone].badge,
                        )}
                      >
                        <Icon name={batteryIcon(day.level!)} className="text-[18px]" />
                        <span className="whitespace-nowrap text-label-md font-bold">
                          {day.level} % Akku
                        </span>
                      </div>
                    )}
                  </div>

                  {day.events.length === 0 ? (
                    <div className="flex items-center gap-space-sm rounded-lg border border-outline-variant/20 bg-surface-container-low p-space-sm">
                      <Icon name="check_circle" className="text-[18px] text-primary" />
                      <p className="text-body-md italic text-on-surface-variant">
                        Keine besondere Veränderung dokumentiert
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-space-xs pt-1">
                      {day.events.map((event, index) => (
                        <div
                          key={index}
                          className="flex flex-col gap-2 rounded-xl bg-surface-container-high/60 p-space-sm"
                        >
                          <div className="flex items-start gap-space-sm">
                            {event.level !== undefined ? (
                              <div
                                className={cn(
                                  "flex h-12 w-12 shrink-0 flex-col items-center justify-center rounded-xl border",
                                  ZONE_STYLES[zoneOf(event.level)].badge,
                                )}
                              >
                                <Icon name={event.icon} className="text-[18px]" />
                                <span className="text-label-sm font-bold tabular-nums">
                                  {event.level} %
                                </span>
                              </div>
                            ) : (
                              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-surface-container-highest">
                                <Icon
                                  name={event.icon}
                                  className={cn("text-[22px]", event.iconClass)}
                                />
                              </div>
                            )}
                            <div className="min-w-0 flex-1">
                              {event.time && (
                                <span className="block text-label-lg text-on-surface">
                                  {event.time} Uhr
                                </span>
                              )}
                              <p
                                className={cn(
                                  "text-body-md",
                                  event.level !== undefined ? event.iconClass : "text-on-surface",
                                )}
                              >
                                {event.text}
                              </p>
                            </div>
                          </div>
                          {event.tags && event.tags.length > 0 && (
                            <div className="flex flex-wrap gap-2">
                              {event.tags.map((tag) => (
                                <span
                                  key={tag}
                                  className="rounded-lg border border-outline-variant/30 bg-surface-container-low px-2.5 py-1 text-label-md text-on-surface-variant"
                                >
                                  {tag}
                                </span>
                              ))}
                            </div>
                          )}
                          {event.note && (
                            <div className="flex items-start gap-2 rounded-lg bg-surface-container-low p-3">
                              <Icon name="sticky_note_2" className="mt-0.5 text-[18px] text-secondary" />
                              <div>
                                <span className="block text-label-md text-on-surface">
                                  Persönliche Notiz
                                </span>
                                <p className="text-body-md text-on-surface-variant">{event.note}</p>
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </article>
              );
            })}
          </div>

          <div className="pt-space-sm">
            <Link
              href="/erfassen"
              className="flex min-h-[56px] w-full items-center justify-center gap-space-sm rounded-2xl bg-cta text-label-lg font-semibold text-on-cta shadow-lg transition-transform active:scale-[0.99]"
            >
              <Icon name="edit_calendar" className="text-[22px]" />
              <span>Veränderung erfassen</span>
            </Link>
            <div className="mt-space-sm flex items-center justify-center gap-1.5 text-on-surface-variant">
              <Icon name="lock" className="text-[16px]" />
              <span className="text-label-sm">Gespeichert auf diesem Gerät</span>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
