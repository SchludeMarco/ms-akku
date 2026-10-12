"use client";

import { useMemo } from "react";
import { useLiveQuery } from "dexie-react-hooks";

import { db } from "@/lib/db";
import { computePatterns, type Pattern } from "@/lib/patterns";

/** Berechnete Muster; `undefined`, solange die Daten noch laden. */
export function usePatterns(now: Date): {
  patterns: Pattern[] | undefined;
  batteryCount: number;
} {
  const data = useLiveQuery(
    async () => ({
      battery: await db.batteryEntries.toArray(),
      sleep: await db.sleepEntries.toArray(),
      symptomEntries: await db.symptomEntries.toArray(),
      symptoms: await db.symptoms.toArray(),
    }),
    [],
  );

  const patterns = useMemo(
    () => (data ? computePatterns({ ...data, now }) : undefined),
    [data, now],
  );

  return { patterns, batteryCount: data?.battery.length ?? 0 };
}
