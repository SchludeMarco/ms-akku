import { db, type Symptom } from "@/lib/db";

/** Symptomkatalog aus dem Stitch-Screen "Symptomauswahl". */
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
