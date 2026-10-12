import { z } from "zod";

import { db } from "@/lib/db";

// Vollständige Sicherung aller lokalen Daten als JSON – für den Export in eine
// Datei (Datenübertragbarkeit) und für die optionale Sicherung im eigenen
// Google Drive. Beim Einlesen wird alles mit Zod geprüft.

const iso = z.string().min(1);
const level = z.number().min(0).max(100);

const backupSchema = z.object({
  app: z.literal("ms-akku"),
  version: z.literal(1),
  exportedAt: iso,
  batteryEntries: z.array(
    z.object({
      id: z.string(),
      timestamp: iso,
      energyLevel: level,
      note: z.string().optional(),
      tags: z.array(z.string()).optional(),
      createdAt: iso,
    }),
  ),
  symptoms: z.array(
    z.object({
      id: z.string(),
      name: z.string(),
      icon: z.string().optional(),
      isCustom: z.boolean(),
      active: z.boolean(),
      burden: z.number().int().min(1).max(10).optional(),
    }),
  ),
  symptomEntries: z.array(
    z.object({
      id: z.string(),
      symptomId: z.string(),
      timestamp: iso,
      intensity: z.enum(["leicht", "deutlich", "sehr_stark"]),
      changeType: z.enum(["stronger", "weaker", "disappeared", "new"]),
      bodyLocation: z.string().optional(),
      startedAt: z.enum(["gerade_eben", "heute", "seit_tagen", "unbekannt"]).optional(),
      note: z.string().optional(),
    }),
  ),
  activities: z.array(
    z.object({
      id: z.string(),
      title: z.string(),
      timestamp: iso,
      effort: z.enum(["leicht", "mittel", "anstrengend"]),
      durationMinutes: z.number().optional(),
      batteryBefore: level.optional(),
      batteryAfter: level.optional(),
      completed: z.boolean(),
      note: z.string().optional(),
    }),
  ),
  sleepEntries: z.array(
    z.object({
      id: z.string(),
      date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
      durationHours: z.number().optional(),
      quality: z.enum(["erholsam", "unruhig", "schlecht"]),
      note: z.string().optional(),
    }),
  ),
  moments: z.array(
    z.object({
      id: z.string(),
      timestamp: iso,
      kind: z.enum(["feeling", "good_day"]),
      value: z.string().optional(),
    }),
  ),
});

export type Backup = z.infer<typeof backupSchema>;

/** Beobachtungen werden nicht gesichert: Sie lassen sich aus den Einträgen neu berechnen. */
export async function createBackup(): Promise<Backup> {
  const [batteryEntries, symptoms, symptomEntries, activities, sleepEntries, moments] =
    await Promise.all([
      db.batteryEntries.toArray(),
      db.symptoms.toArray(),
      db.symptomEntries.toArray(),
      db.activities.toArray(),
      db.sleepEntries.toArray(),
      db.moments.toArray(),
    ]);
  return {
    app: "ms-akku",
    version: 1,
    exportedAt: new Date().toISOString(),
    batteryEntries,
    symptoms,
    symptomEntries,
    activities,
    sleepEntries,
    moments,
  };
}

/** Prüft fremde Daten; wirft bei ungültigem Inhalt. */
export function parseBackup(data: unknown): Backup {
  return backupSchema.parse(data);
}

/** Ersetzt alle lokalen Daten durch die Sicherung. */
export async function restoreBackup(backup: Backup): Promise<void> {
  await db.transaction(
    "rw",
    [
      db.batteryEntries,
      db.symptoms,
      db.symptomEntries,
      db.activities,
      db.sleepEntries,
      db.moments,
      db.observations,
    ],
    async () => {
      await Promise.all([
        db.batteryEntries.clear(),
        db.symptoms.clear(),
        db.symptomEntries.clear(),
        db.activities.clear(),
        db.sleepEntries.clear(),
        db.moments.clear(),
        db.observations.clear(),
      ]);
      await Promise.all([
        db.batteryEntries.bulkPut(backup.batteryEntries),
        db.symptoms.bulkPut(backup.symptoms),
        db.symptomEntries.bulkPut(backup.symptomEntries),
        db.activities.bulkPut(backup.activities),
        db.sleepEntries.bulkPut(backup.sleepEntries),
        db.moments.bulkPut(backup.moments),
      ]);
    },
  );
}

export function countEntries(backup: Backup): number {
  return (
    backup.batteryEntries.length +
    backup.symptomEntries.length +
    backup.activities.length +
    backup.sleepEntries.length +
    backup.moments.length
  );
}

/** Lädt die Sicherung als Datei herunter. */
export async function downloadBackup(): Promise<void> {
  const backup = await createBackup();
  const blob = new Blob([JSON.stringify(backup, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `ms-akku-sicherung-${backup.exportedAt.slice(0, 10)}.json`;
  link.click();
  URL.revokeObjectURL(url);
}
