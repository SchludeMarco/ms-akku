// Energie-Zonen nach dem Stitch-Redesign: Teal (kraftvoll), Amber
// (ausgeglichen) und kühles Blau (ruhig). Niedrige Energie wird bewusst nie
// rot dargestellt – Ruhe statt Alarm. Die Farben stehen als Tokens
// energy-high/mid/low in app/globals.css.

export type Zone = "high" | "mid" | "low";

export function zoneOf(level: number): Zone {
  if (level >= 80) return "high";
  if (level >= 40) return "mid";
  return "low";
}

export const ZONE_STYLES: Record<
  Zone,
  { text: string; fill: string; bar: string; badge: string; dot: string }
> = {
  high: {
    text: "text-energy-high-text",
    fill: "bg-energy-high",
    bar: "bg-energy-high/80",
    badge: "border-energy-high/40 bg-energy-high/15 text-energy-high-text",
    dot: "bg-energy-high",
  },
  mid: {
    text: "text-energy-mid-text",
    fill: "bg-energy-mid",
    bar: "bg-energy-mid/80",
    badge: "border-energy-mid/40 bg-energy-mid/15 text-energy-mid-text",
    dot: "bg-energy-mid",
  },
  low: {
    text: "text-energy-low-text",
    fill: "bg-energy-low",
    bar: "bg-energy-low/80",
    badge: "border-energy-low/40 bg-energy-low/15 text-energy-low-text",
    dot: "bg-energy-low",
  },
};

export const ZONE_PILL: Record<Zone, { label: string; icon: string }> = {
  high: { label: "Kraftvoll", icon: "bolt" },
  mid: { label: "Ausgeglichen", icon: "battery_horiz_075" },
  low: { label: "Ruhig", icon: "bedtime" },
};

export const ZONE_STATUS: Record<Zone, string> = {
  high: "Stabile Kapazität",
  mid: "Achtsamer Bereich",
  low: "Erholungsbedarf",
};

export function batteryIcon(level: number): string {
  if (level >= 70) return "battery_full";
  if (level >= 60) return "battery_5_bar";
  if (level >= 50) return "battery_4_bar";
  if (level >= 40) return "battery_3_bar";
  if (level >= 25) return "battery_2_bar";
  if (level >= 10) return "battery_1_bar";
  return "battery_0_bar";
}

export function average(values: number[]): number | null {
  if (values.length === 0) return null;
  return Math.round(values.reduce((sum, v) => sum + v, 0) / values.length);
}
