import { z } from "zod";

// Gemeinsame Definitionen für das Feedback-Formular und /api/feedback.

export const FEEDBACK_CATEGORIES = [
  { key: "lob", label: "Lob", icon: "thumb_up", prompt: "Was gefällt dir besonders gut?" },
  { key: "tadel", label: "Tadel", icon: "thumb_down", prompt: "Was funktioniert nicht oder stört?" },
  { key: "vorschlag", label: "Vorschlag", icon: "lightbulb", prompt: "Wie könnte etwas besser werden?" },
  { key: "wunsch", label: "Wunsch", icon: "auto_awesome", prompt: "Welche Funktion fehlt dir?" },
] as const;

export type FeedbackCategory = (typeof FEEDBACK_CATEGORIES)[number]["key"];

/** Worauf sich das Feedback bezieht. Bewusst nur App-Bereiche, keine Symptome. */
export const FEEDBACK_AREAS = [
  "Heute",
  "Verlauf",
  "Muster",
  "Erfassen",
  "Symptomkatalog",
  "Einstellungen",
  "Sonstiges",
] as const;

export const MAX_FEEDBACK_LENGTH = 2000;

export const feedbackSchema = z.object({
  category: z.enum(["lob", "tadel", "vorschlag", "wunsch"]),
  message: z.string().trim().min(1).max(MAX_FEEDBACK_LENGTH),
  area: z.enum(FEEDBACK_AREAS).optional(),
  contactEmail: z.union([z.email().max(200), z.literal("")]).optional(),
  /** Ausdrückliche Einwilligung in die Übermittlung. */
  consent: z.literal(true),
  /** Honeypot: echte Nutzer lassen das Feld leer. */
  website: z.string().max(0).optional(),
});

export type FeedbackPayload = z.infer<typeof feedbackSchema>;

export type FeedbackErrorCode = "not_configured" | "invalid" | "upstream";

export async function submitFeedback(payload: FeedbackPayload): Promise<void> {
  const response = await fetch("/api/feedback", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!response.ok) {
    const data = (await response.json().catch(() => ({}))) as { error?: FeedbackErrorCode };
    throw new Error(data.error ?? "upstream");
  }
}
