// Energie-Zonen der Stitch-Vorlage: Teal (stabil), Amber (Pacing-Zone) und
// kühles Blau (Erholungsbedarf). Niedrige Energie wird bewusst nie rot
// dargestellt – Ruhe statt Alarm.

export type Zone = "high" | "mid" | "low";

export function zoneOf(level: number): Zone {
  if (level >= 60) return "high";
  if (level >= 40) return "mid";
  return "low";
}

export const ZONE_STYLES: Record<
  Zone,
  { text: string; fill: string; bar: string; badge: string; dot: string }
> = {
  high: {
    text: "text-primary",
    fill: "bg-primary-container",
    bar: "bg-primary-container/80",
    badge: "border-primary/40 bg-primary/15 text-primary",
    dot: "bg-primary shadow-[0_0_8px_rgba(87,241,219,0.5)]",
  },
  mid: {
    text: "text-pacing-soft",
    fill: "bg-pacing",
    bar: "bg-pacing/80",
    badge: "border-pacing/40 bg-pacing/15 text-pacing-soft",
    dot: "bg-pacing-soft shadow-[0_0_8px_rgba(255,183,122,0.4)]",
  },
  low: {
    text: "text-tertiary",
    fill: "bg-tertiary-container",
    bar: "bg-tertiary-container/70",
    badge: "border-tertiary/40 bg-tertiary/15 text-tertiary",
    dot: "bg-tertiary shadow-[0_0_8px_rgba(175,224,255,0.4)]",
  },
};

export const ZONE_PILL: Record<Zone, { label: string; icon: string }> = {
  high: { label: "Im grünen Bereich", icon: "spa" },
  mid: { label: "Achtsam bleiben", icon: "self_improvement" },
  low: { label: "Schonmodus", icon: "bedtime" },
};

export const ZONE_STATUS: Record<Zone, string> = {
  high: "Stabile Kapazität",
  mid: "Achtsamer Bereich",
  low: "Erholungsbedarf",
};

export const ZONE_MESSAGE: Record<Zone, string> = {
  high: "Genügend Energie für die geplanten Vorhaben. Gönne dir Pausen nach eigenem Bedarf.",
  mid: "Deine Reserven sind moderat. Plane eine Zwischenpause am frühen Nachmittag ein.",
  low: "Dein Körper bittet um Entlastung. Zeit für eine bewusste, ungestörte Pause.",
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
