import { db } from "@/lib/db";

/** Löscht alle Einträge. Symptomauswahl und Einstellungen bleiben erhalten. */
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
