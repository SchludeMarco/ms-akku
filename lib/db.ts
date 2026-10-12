import Dexie, { type EntityTable } from "dexie";

// ---------------------------------------------------------------------------
// Entitäten
// ---------------------------------------------------------------------------

export interface BatteryEntry {
  id: string; // uuid
  timestamp: string; // ISO-8601
  energyLevel: number; // 0 - 100
  note?: string;
  tags?: string[];
  createdAt: string;
}

export interface Symptom {
  id: string;
  name: string; // z.B. "Fatigue", "Kribbeln", "Schlaf"
  icon?: string;
  isCustom: boolean; // Nutzer-eigenes Wording
  active: boolean;
}

export interface SymptomEntry {
  id: string;
  symptomId: string;
  timestamp: string;
  intensity: "leicht" | "deutlich" | "sehr_stark";
  changeType: "stronger" | "weaker" | "disappeared" | "new";
  bodyLocation?: string; // z.B. "Beine / Füße", "Rechter Arm"
  startedAt?: "gerade_eben" | "heute" | "seit_tagen" | "unbekannt";
  note?: string;
}

export interface Activity {
  id: string;
  title: string;
  timestamp: string;
  effort: "leicht" | "mittel" | "anstrengend";
  durationMinutes?: number;
  batteryBefore?: number;
  batteryAfter?: number;
  completed: boolean;
  note?: string;
}

export interface SleepEntry {
  id: string;
  date: string; // YYYY-MM-DD
  durationHours?: number;
  quality: "erholsam" | "unruhig" | "schlecht";
  note?: string;
}

export interface Observation {
  id: string;
  generatedAt: string;
  type: "sleep_energy" | "weather_heat" | "time_of_day" | "activity_effort";
  title: string;
  description: string;
  comparableDaysCount: number;
  confidence: number;
  relatedDataIds: string[];
}

/** Kurze Momentaufnahmen ohne Symptombezug (Befinden, besonders guter Tag). */
export interface Moment {
  id: string;
  timestamp: string;
  kind: "feeling" | "good_day";
  value?: string; // bei "feeling": Schlüssel aus lib/feelings.ts
}

// ---------------------------------------------------------------------------
// Datenbank
// ---------------------------------------------------------------------------

export type MsAkkuDatabase = Dexie & {
  moments: EntityTable<Moment, "id">;
  batteryEntries: EntityTable<BatteryEntry, "id">;
  symptoms: EntityTable<Symptom, "id">;
  symptomEntries: EntityTable<SymptomEntry, "id">;
  activities: EntityTable<Activity, "id">;
  sleepEntries: EntityTable<SleepEntry, "id">;
  observations: EntityTable<Observation, "id">;
};

export const DB_NAME = "ms-akku";

export const db = new Dexie(DB_NAME) as MsAkkuDatabase;

// Nur indizierte Felder stehen im Schema; alle übrigen Felder werden trotzdem
// gespeichert. Booleans (isCustom, active, completed) sind in IndexedDB nicht
// indizierbar und werden im Speicher gefiltert.
// Schemaänderungen: neue db.version(n + 1) ergänzen, Version 1 nicht anfassen.
db.version(1).stores({
  batteryEntries: "id, timestamp, createdAt, *tags",
  symptoms: "id, name",
  symptomEntries: "id, symptomId, timestamp, [symptomId+timestamp]",
  activities: "id, timestamp, effort",
  sleepEntries: "id, &date, quality",
  observations: "id, generatedAt, type",
});

db.version(2).stores({
  moments: "id, timestamp, kind",
});

/** Erzeugt eine UUID für neue Datensätze. */
export const newId = (): string => crypto.randomUUID();
