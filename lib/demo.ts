import {
  db,
  type Activity,
  type BatteryEntry,
  type Moment,
  type SleepEntry,
  type SymptomEntry,
} from "@/lib/db";
import { addDays, dayKey, startOfDay } from "@/lib/dates";
import { ensureSymptomsSeeded } from "@/lib/symptoms";

// Beispieldaten zum Ausprobieren. Alle IDs beginnen mit "demo-" und sind
// deterministisch, sodass erneutes Laden nichts verdoppelt.

const DEMO_DAYS = 28;

function at(day: Date, hour: number, minute = 0): string {
  const date = new Date(day);
  date.setHours(hour, minute, 0, 0);
  return date.toISOString();
}

const clamp = (value: number) => Math.max(5, Math.min(100, Math.round(value / 5) * 5));

export async function loadDemoData(): Promise<void> {
  await ensureSymptomsSeeded();

  const now = new Date();
  const today = startOfDay(now);

  const battery: BatteryEntry[] = [];
  const sleep: SleepEntry[] = [];
  const symptomEntries: SymptomEntry[] = [];
  const activities: Activity[] = [];
  const moments: Moment[] = [];

  // Einfacher Pseudozufall, damit die Daten bei jedem Laden gleich aussehen.
  let seed = 7;
  const random = () => {
    seed = (seed * 1103515245 + 12345) % 2147483648;
    return seed / 2147483648;
  };

  for (let offset = DEMO_DAYS - 1; offset >= 0; offset--) {
    const day = addDays(today, -offset);
    const key = dayKey(day);
    const roll = random();
    const quality: SleepEntry["quality"] =
      roll < 0.55 ? "erholsam" : roll < 0.85 ? "unruhig" : "schlecht";
    const restedBonus = quality === "erholsam" ? 14 : quality === "unruhig" ? -6 : -16;

    sleep.push({
      id: `demo-sleep-${key}`,
      date: key,
      quality,
      durationHours: quality === "erholsam" ? 7.5 : quality === "unruhig" ? 6 : 4,
    });

    const morning = clamp(62 + restedBonus + random() * 12);
    const afternoon = clamp(morning - 14 - (quality === "erholsam" ? 0 : 10) + random() * 10);
    const evening = clamp(afternoon + 4 + random() * 10);
    const slots = [
      { slot: "m", hour: 9, level: morning },
      { slot: "a", hour: 15, level: afternoon },
      { slot: "e", hour: 20, level: evening },
    ];
    for (const { slot, hour, level } of slots) {
      const timestamp = at(day, hour, Math.floor(random() * 50));
      if (new Date(timestamp) > now) continue;
      battery.push({
        id: `demo-battery-${key}-${slot}`,
        timestamp,
        energyLevel: level,
        createdAt: timestamp,
      });
    }

    if (quality !== "erholsam" && random() < 0.7 && at(day, 14, 15) < now.toISOString()) {
      symptomEntries.push({
        id: `demo-symptom-${key}-fatigue`,
        symptomId: "fatigue",
        timestamp: at(day, 14, 15),
        intensity: quality === "schlecht" ? "deutlich" : "leicht",
        changeType: "stronger",
        startedAt: "heute",
        note: "nach Mittagessen",
      });
    }
    if (offset % 4 === 1) {
      symptomEntries.push({
        id: `demo-symptom-${key}-kribbeln`,
        symptomId: "kribbeln",
        timestamp: at(day, 16),
        intensity: "deutlich",
        changeType: "stronger",
        bodyLocation: "Rechter Arm",
      });
    }
    if (offset % 9 === 5) {
      symptomEntries.push({
        id: `demo-symptom-${key}-kribbeln-weg`,
        symptomId: "kribbeln",
        timestamp: at(day, 11),
        intensity: "leicht",
        changeType: "weaker",
      });
    }
    if (offset > 0 && offset % 3 === 0) {
      activities.push({
        id: `demo-activity-${key}`,
        title: "Spaziergang 20 Min",
        timestamp: at(day, 10, 30),
        effort: "leicht",
        durationMinutes: 20,
        completed: true,
      });
    }
    if (quality === "erholsam" && offset > 0 && offset % 6 === 2) {
      moments.push({
        id: `demo-moment-${key}`,
        timestamp: at(day, 18),
        kind: "good_day",
      });
    }
  }

  const todayKey = dayKey(today);
  activities.push(
    {
      id: `demo-activity-${todayKey}-1`,
      title: "Einkaufen im Supermarkt",
      note: "Kleiner Wocheneinkauf",
      timestamp: at(today, 10),
      effort: "leicht",
      completed: false,
    },
    {
      id: `demo-activity-${todayKey}-2`,
      title: "Familienbesuch / Kaffee",
      note: "Gespräche & Sitzen",
      timestamp: at(today, 14),
      effort: "mittel",
      completed: false,
    },
    {
      id: `demo-activity-${todayKey}-3`,
      title: "Abendessen zubereiten",
      note: "Längeres Stehen",
      timestamp: at(today, 18),
      effort: "anstrengend",
      completed: false,
    },
  );

  await db.transaction(
    "rw",
    [db.batteryEntries, db.sleepEntries, db.symptomEntries, db.activities, db.moments],
    async () => {
      // sleepEntries.date ist eindeutig – vorhandene Nächte nicht überschreiben.
      const existingNights = new Set(
        (await db.sleepEntries.toArray())
          .filter((night) => !night.id.startsWith("demo-"))
          .map((night) => night.date),
      );
      await db.batteryEntries.bulkPut(battery);
      await db.sleepEntries.bulkPut(sleep.filter((night) => !existingNights.has(night.date)));
      await db.symptomEntries.bulkPut(symptomEntries);
      await db.activities.bulkPut(activities);
      await db.moments.bulkPut(moments);
    },
  );
}

/** Löscht alle Einträge. Die Symptomauswahl und Einstellungen bleiben erhalten. */
export async function clearAllEntries(): Promise<void> {
  await db.transaction(
    "rw",
    [
      db.batteryEntries,
      db.sleepEntries,
      db.symptomEntries,
      db.activities,
      db.moments,
      db.observations,
    ],
    async () => {
      await Promise.all([
        db.batteryEntries.clear(),
        db.sleepEntries.clear(),
        db.symptomEntries.clear(),
        db.activities.clear(),
        db.moments.clear(),
        db.observations.clear(),
      ]);
    },
  );
}
