// Erscheinungsbild der App.
//
// "auto" richtet sich nach der Uhrzeit des Geräts: in der hellen Zeit (ab
// Werk 9 bis 17 Uhr, in den Einstellungen änderbar) hell, sonst dunkel. Wer in
// der Automatik von Hand umschaltet, übersteuert sie nur bis zum nächsten
// Wechselzeitpunkt – danach gilt wieder die Uhr.

/** dark = blendfrei dunkel · pastel = helle, entspannte Pastelltöne */
export type Theme = "dark" | "pastel";

export type ThemeMode = "auto" | Theme;

export interface ThemeOverride {
  theme: Theme;
  /** ISO-Zeitpunkt, bis zu dem die Übersteuerung gilt. */
  until: string;
}

/** Helle Zeit als Uhrzeiten "HH:MM"; das Ende gehört nicht mehr dazu. */
export interface LightHours {
  from: string;
  until: string;
}

export const DEFAULT_LIGHT_HOURS: LightHours = { from: "09:00", until: "17:00" };

/** "09:30" → 570 Minuten seit Mitternacht; ungültige Angaben → `fallback`. */
export function toMinutes(time: string, fallback: number): number {
  const match = /^(\d{1,2}):(\d{2})$/.exec(time);
  if (!match) return fallback;
  const hours = Number(match[1]);
  const minutes = Number(match[2]);
  return hours < 24 && minutes < 60 ? hours * 60 + minutes : fallback;
}

function bounds(hours: LightHours): { from: number; until: number } {
  return {
    from: toMinutes(hours.from, 9 * 60),
    until: toMinutes(hours.until, 17 * 60),
  };
}

/**
 * Ob eine Uhrzeit (Minuten seit Mitternacht) in der hellen Zeit liegt. Liegt
 * der Beginn nach dem Ende (z. B. 20:00 bis 06:00), reicht die helle Zeit
 * über Mitternacht. Sind beide gleich, gibt es keine helle Zeit.
 */
export function isLightAt(minutes: number, from: number, until: number): boolean {
  if (from === until) return false;
  return from < until
    ? minutes >= from && minutes < until
    : minutes >= from || minutes < until;
}

const minutesOf = (date: Date) => date.getHours() * 60 + date.getMinutes();

/** Was die Automatik zu diesem Zeitpunkt vorsieht. */
export function scheduledTheme(date: Date, hours: LightHours): Theme {
  const { from, until } = bounds(hours);
  return isLightAt(minutesOf(date), from, until) ? "pastel" : "dark";
}

/** Der nächste Zeitpunkt, an dem die Automatik wechselt. */
export function nextSwitch(date: Date, hours: LightHours): Date {
  const { from, until } = bounds(hours);
  const now = minutesOf(date);
  // Der nächste der beiden Zeitpunkte, der heute noch kommt – sonst der
  // frühere von beiden am Folgetag.
  const today = [from, until].filter((minute) => minute > now).sort((a, b) => a - b)[0];
  const next = new Date(date);
  next.setSeconds(0, 0);
  if (today !== undefined) {
    next.setHours(Math.floor(today / 60), today % 60);
  } else {
    const first = Math.min(from, until);
    next.setDate(next.getDate() + 1);
    next.setHours(Math.floor(first / 60), first % 60);
  }
  return next;
}

/** Ob eine Übersteuerung zu diesem Zeitpunkt noch gilt. */
export function overrideActive(override: ThemeOverride | null, date: Date): boolean {
  return override !== null && date.getTime() < new Date(override.until).getTime();
}

/** Das Erscheinungsbild, das jetzt tatsächlich gilt. */
export function resolveTheme(
  mode: ThemeMode,
  override: ThemeOverride | null,
  date: Date,
  hours: LightHours,
): Theme {
  if (mode !== "auto") return mode;
  return overrideActive(override, date) ? override!.theme : scheduledTheme(date, hours);
}
