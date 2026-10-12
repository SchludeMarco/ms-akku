import type {
  BatteryEntry,
  SleepEntry,
  Symptom,
  SymptomEntry,
} from "@/lib/db";
import { dayKey } from "@/lib/dates";
import { average } from "@/lib/energy";

// Muster werden ausschließlich aus den eigenen Einträgen berechnet und bewusst
// als Beobachtung formuliert – nie als Diagnose oder Ursache.

export const MIN_ENTRIES_FOR_PATTERN = 5;

export type PatternTone = "primary" | "secondary" | "tertiary";

export interface PatternBar {
  label: string;
  percent: number; // 0 - 100, Balkenlänge
  display: string;
}

export interface PatternCurvePoint {
  label: string;
  value: number; // 0 - 100
  isLow: boolean;
}

export interface Pattern {
  id: "sleep_energy" | "time_of_day" | "symptom_frequency";
  tone: PatternTone;
  tag: string;
  tagIcon: string;
  evidence: string;
  evidenceIcon: string;
  headline: string;
  /** Kurzfassung für die Vorschau auf "Heute". */
  summary: string;
  summaryIcon: string;
  barsTitle?: string;
  bars?: PatternBar[];
  barsNote?: string;
  curve?: PatternCurvePoint[];
  curveLowLabel?: string;
  hint?: string;
}

interface PatternInput {
  battery: BatteryEntry[];
  sleep: SleepEntry[];
  symptomEntries: SymptomEntry[];
  symptoms: Symptom[];
  now: Date;
}

const TIME_WINDOWS = [
  { from: 5, to: 10, name: "Morgen" },
  { from: 10, to: 14, name: "Mittag" },
  { from: 14, to: 17, name: "Nachmittag" },
  { from: 17, to: 24, name: "Abend" },
] as const;

const hourLabel = (hour: number) => `${String(hour % 24).padStart(2, "0")}:00`;

function sleepPattern({ battery, sleep }: PatternInput): Pattern | null {
  const levelsByDay = new Map<string, number[]>();
  for (const entry of battery) {
    const key = dayKey(new Date(entry.timestamp));
    levelsByDay.set(key, [...(levelsByDay.get(key) ?? []), entry.energyLevel]);
  }

  const rested: number[] = [];
  const restless: number[] = [];
  for (const night of sleep) {
    const dayAverage = average(levelsByDay.get(night.date) ?? []);
    if (dayAverage === null) continue;
    (night.quality === "erholsam" ? rested : restless).push(dayAverage);
  }

  const days = rested.length + restless.length;
  if (days < MIN_ENTRIES_FOR_PATTERN || rested.length < 2 || restless.length < 2) {
    return null;
  }

  const restedAvg = average(rested)!;
  const restlessAvg = average(restless)!;
  const clearDifference = restedAvg - restlessAvg >= 5;

  return {
    id: "sleep_energy",
    tone: "primary",
    tag: clearDifference ? "Möglicher Zusammenhang" : "Beobachtung",
    tagIcon: "bedtime",
    evidence: `${days} vergleichbare Tage`,
    evidenceIcon: "history",
    headline: clearDifference
      ? "Nach unruhigem Schlaf war deine selbst eingeschätzte Energie häufiger niedriger."
      : "Bisher zeigt sich kein deutlicher Unterschied zwischen erholsamen und unruhigen Nächten.",
    summary: clearDifference
      ? "An ähnlichen Tagen war deine Energie häufiger niedriger, wenn dein Schlaf schlechter war."
      : "Dein Akku war nach erholsamen und unruhigen Nächten bisher ähnlich.",
    summaryIcon: "bedtime",
    barsTitle: "Tages-Akku im Schnitt:",
    bars: [
      { label: "Erholsam", percent: restedAvg, display: `${restedAvg} %` },
      { label: "Unruhig", percent: restlessAvg, display: `${restlessAvg} %` },
    ],
    barsNote: `An Tagen nach erholsamem Schlaf lag dein Akku im Schnitt bei ${restedAvg} %, nach unruhigem Schlaf bei ${restlessAvg} %.`,
  };
}

function timeOfDayPattern({ battery }: PatternInput): Pattern | null {
  if (battery.length < MIN_ENTRIES_FOR_PATTERN) return null;

  const windows = TIME_WINDOWS.map((window) => {
    const levels = battery
      .filter((entry) => {
        const hour = new Date(entry.timestamp).getHours();
        return hour >= window.from && hour < window.to;
      })
      .map((entry) => entry.energyLevel);
    return { ...window, avg: average(levels) };
  }).filter((window): window is typeof window & { avg: number } => window.avg !== null);

  if (windows.length < 2) return null;

  const lowest = windows.reduce((min, window) => (window.avg < min.avg ? window : min));
  const range = `${hourLabel(lowest.from)} – ${hourLabel(lowest.to)}`;

  return {
    id: "time_of_day",
    tone: "tertiary",
    tag: "Möglicher Zusammenhang",
    tagIcon: "schedule",
    evidence: `${battery.length} Einträge`,
    evidenceIcon: "data_usage",
    headline: `Deine niedrigsten Energiewerte liegen im Schnitt zwischen ${hourLabel(lowest.from)} und ${hourLabel(lowest.to)} Uhr.`,
    summary: `Dein Akku ist am ${lowest.name} im Schnitt am niedrigsten (${lowest.avg} %).`,
    summaryIcon: "schedule",
    curve: windows.map((window) => ({
      label: window.name,
      value: window.avg,
      isLow: window === lowest,
    })),
    curveLowLabel: `Tiefpunkt: ${range} Uhr`,
    hint: "Dieses Zeitfenster eignet sich erfahrungsgemäß gut für geplante Ruhephasen.",
  };
}

function symptomPattern({ symptomEntries, symptoms, now }: PatternInput): Pattern | null {
  const since = new Date(now);
  since.setDate(since.getDate() - 30);

  const counts = new Map<string, number>();
  for (const entry of symptomEntries) {
    if (entry.changeType !== "stronger" && entry.changeType !== "new") continue;
    if (new Date(entry.timestamp) < since) continue;
    counts.set(entry.symptomId, (counts.get(entry.symptomId) ?? 0) + 1);
  }

  const total = [...counts.values()].reduce((sum, n) => sum + n, 0);
  if (total < MIN_ENTRIES_FOR_PATTERN) return null;

  const nameById = new Map(symptoms.map((symptom) => [symptom.id, symptom.name]));
  const ranked = [...counts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([id, count]) => ({ name: nameById.get(id) ?? "Symptom", count }));
  const top = ranked[0];

  return {
    id: "symptom_frequency",
    tone: "secondary",
    tag: "Beobachtung",
    tagIcon: "monitoring",
    evidence: "Letzte 30 Tage",
    evidenceIcon: "calendar_today",
    headline: `${top.name} hast du in den letzten 30 Tagen ${top.count}-mal als stärker oder neu dokumentiert.`,
    summary: `${top.name} hast du zuletzt am häufigsten als stärker dokumentiert.`,
    summaryIcon: "monitoring",
    barsTitle: "Stärker oder neu dokumentiert:",
    bars: ranked.map((item) => ({
      label: item.name,
      percent: Math.round((item.count / top.count) * 100),
      display: `${item.count}×`,
    })),
  };
}

export function computePatterns(input: PatternInput): Pattern[] {
  return [sleepPattern(input), timeOfDayPattern(input), symptomPattern(input)].filter(
    (pattern): pattern is Pattern => pattern !== null,
  );
}
