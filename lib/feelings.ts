/** Optionen aus "Wie fühlst du dich gerade?" (Stitch-Screen "Heute"). */
export const FEELINGS = [
  { key: "calm", label: "Ruhig & stabil", icon: "wb_sunny" },
  { key: "focused", label: "Konzentriert", icon: "self_improvement" },
  { key: "tired", label: "Wackelig / müde", icon: "cloud" },
  { key: "tense", label: "Körperlich verspannt", icon: "accessibility_new" },
] as const;

export type FeelingKey = (typeof FEELINGS)[number]["key"];
