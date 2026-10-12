import { useLiveQuery } from "dexie-react-hooks";

import { db } from "@/lib/db";
import { startOfDay } from "@/lib/dates";
import { zoneOf } from "@/lib/energy";
import type { FeelingKey } from "@/lib/feelings";

// Stimmung des Tages für die Farbgebung der App.
//
// Die Farben folgen dem, was die Person selbst angegeben hat – der letzten
// Angabe von heute, egal ob Befinden ("Wie fühlst du dich gerade?") oder
// Akku-Einschätzung. Es wird nichts gedeutet oder bewertet:
//
//   sunny   – warm und hell: ruhig, konzentriert oder Akku im oberen Bereich
//   neutral – das gewählte Erscheinungsbild unverändert
//   rest    – kühl und gedämpft: müde, verspannt oder Akku im unteren Bereich
//
// "rest" ist bewusst beruhigend, nie alarmierend.

export type Mood = "sunny" | "neutral" | "rest";

const FEELING_MOOD: Record<FeelingKey, Mood> = {
  calm: "sunny",
  focused: "sunny",
  tired: "rest",
  tense: "rest",
};

const ZONE_MOOD = { high: "sunny", mid: "neutral", low: "rest" } as const;

/** Stimmung aus den heutigen Angaben; `undefined`, solange die Daten laden. */
export function useMood(): Mood | undefined {
  return useLiveQuery(async () => {
    const since = startOfDay(new Date()).toISOString();
    const [feelings, battery] = await Promise.all([
      db.moments
        .where("timestamp")
        .aboveOrEqual(since)
        .filter((moment) => moment.kind === "feeling")
        .sortBy("timestamp"),
      db.batteryEntries.where("timestamp").aboveOrEqual(since).sortBy("timestamp"),
    ]);
    const feeling = feelings.at(-1);
    const level = battery.at(-1);

    const fromFeeling =
      feeling?.value && feeling.value in FEELING_MOOD
        ? FEELING_MOOD[feeling.value as FeelingKey]
        : undefined;
    const fromLevel = level ? ZONE_MOOD[zoneOf(level.energyLevel)] : undefined;

    if (fromFeeling && fromLevel) {
      return feeling!.timestamp >= level!.timestamp ? fromFeeling : fromLevel;
    }
    return fromFeeling ?? fromLevel ?? "neutral";
  }, []);
}
