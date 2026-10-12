import { db, type Symptom } from "@/lib/db";
import { catalogById } from "@/lib/symptom-catalog";

/**
 * Vorauswahl aus dem Stitch-Screen "Symptomauswahl" (Onboarding). Der
 * vollständige Katalog mit Beschreibungen liegt in lib/symptom-catalog.ts.
 */
export const DEFAULT_SYMPTOMS: (Symptom & { icon: string })[] = [
  { id: "fatigue", name: "Fatigue", icon: "bedtime", isCustom: false, active: true },
  { id: "energie", name: "Energie", icon: "bolt", isCustom: false, active: true },
  { id: "kribbeln", name: "Kribbeln", icon: "grain", isCustom: false, active: true },
  { id: "schmerzen", name: "Schmerzen", icon: "healing", isCustom: false, active: false },
  { id: "spastik", name: "Spastik", icon: "accessibility_new", isCustom: false, active: false },
  { id: "gleichgewicht", name: "Gleichgewicht", icon: "balance", isCustom: false, active: false },
  { id: "gehfaehigkeit", name: "Gehfähigkeit", icon: "directions_walk", isCustom: false, active: false },
  { id: "sehen", name: "Sehen", icon: "visibility", isCustom: false, active: false },
  { id: "konzentration", name: "Konzentration", icon: "psychology", isCustom: false, active: false },
  { id: "schlaf", name: "Schlaf", icon: "nights_stay", isCustom: false, active: true },
  { id: "blase-darm", name: "Blase / Darm", icon: "water_drop", isCustom: false, active: false },
  { id: "stimmung", name: "Stimmung", icon: "sentiment_satisfied", isCustom: false, active: false },
];

export const CUSTOM_SYMPTOM_ICON = "edit_note";

/** Legt den Standardkatalog an, falls noch keine Symptome gespeichert sind. */
export async function ensureSymptomsSeeded(): Promise<void> {
  if ((await db.symptoms.count()) === 0) {
    await db.symptoms.bulkPut(DEFAULT_SYMPTOMS);
  }
}

/**
 * Ändert ein gespeichertes Symptom. Katalog-Symptome, die noch nie gewählt
 * wurden, liegen nicht in der Datenbank und werden dabei angelegt.
 */
async function updateSymptom(id: string, changes: Partial<Symptom>): Promise<void> {
  await db.transaction("rw", db.symptoms, async () => {
    const stored = await db.symptoms.get(id);
    if (stored) {
      await db.symptoms.put({ ...stored, ...changes });
      return;
    }
    const entry = catalogById.get(id);
    if (!entry) return;
    await db.symptoms.put({
      id,
      name: entry.name,
      icon: entry.icon,
      isCustom: false,
      active: false,
      ...changes,
    });
  });
}

export const setSymptomActive = (id: string, active: boolean) =>
  updateSymptom(id, { active });

/** Belastung 1–10; `undefined` entfernt die Angabe wieder. */
export const setSymptomBurden = (id: string, burden: number | undefined) =>
  updateSymptom(id, { burden });
