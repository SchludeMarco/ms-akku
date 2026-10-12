/** Lokaler Kalendertag als YYYY-MM-DD (nicht UTC, damit "heute" stimmt). */
export function dayKey(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function startOfDay(date: Date): Date {
  const copy = new Date(date);
  copy.setHours(0, 0, 0, 0);
  return copy;
}

export function addDays(date: Date, days: number): Date {
  const copy = new Date(date);
  copy.setDate(copy.getDate() + days);
  return copy;
}

/** Montag der Woche, in der das Datum liegt. */
export function startOfWeek(date: Date): Date {
  const start = startOfDay(date);
  const weekday = (start.getDay() + 6) % 7; // Mo = 0
  return addDays(start, -weekday);
}

export function formatTime(iso: string): string {
  return new Date(iso).toLocaleTimeString("de-DE", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function formatLongDate(date: Date): string {
  return date.toLocaleDateString("de-DE", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });
}

/** "Heute, 24. Oktober" / "Gestern, 23. Oktober" / "13. September". */
export function dayHeading(key: string, now: Date): string {
  const [y, m, d] = key.split("-").map(Number);
  const date = new Date(y, m - 1, d);
  const label = date.toLocaleDateString("de-DE", {
    day: "numeric",
    month: "long",
    ...(y !== now.getFullYear() ? { year: "numeric" } : {}),
  });
  if (key === dayKey(now)) return `Heute, ${label}`;
  if (key === dayKey(addDays(now, -1))) return `Gestern, ${label}`;
  return label;
}

export function partOfDay(date: Date): string {
  const hour = date.getHours();
  if (hour < 12) return "Vormittag";
  if (hour < 18) return "Nachmittag";
  return "Abend";
}
