import { SYMPTOM_CATALOG, type CatalogSymptom } from "@/lib/symptom-catalog";

// Suche im Symptomkatalog. Läuft vollständig im Browser: Suchbegriffe verlassen
// das Gerät nicht, und es entstehen keine Kosten.
//
// - Mehrere Wörter: Treffer, die zu allen Wörtern passen, stehen oben; passt
//   nur ein Teil, erscheinen sie darunter.
// - Umlaute und ß werden angeglichen ("muede" findet "müde").
// - Wortanfänge, Wortteile und kleine Tippfehler werden gefunden.
// - Treffer im Namen zählen mehr als Treffer in Beispielen oder Hilfen.

export interface SearchHit {
  symptom: CatalogSymptom;
  score: number;
  /** Warum der Treffer passt, wenn es nicht am Namen liegt. */
  reason?: { label: string; text: string };
}

const normalize = (text: string) =>
  text
    .toLowerCase()
    .replace(/ä/g, "ae")
    .replace(/ö/g, "oe")
    .replace(/ü/g, "ue")
    .replace(/ß/g, "ss");

const tokenize = (text: string) => normalize(text).match(/[a-z0-9]+/g) ?? [];

// Füllwörter, die sonst jede Suche ausbremsen ("ich bin immer müde").
const STOP_WORDS = new Set(
  "ich bin habe hab mir mich mein meine ist sind und oder der die das ein eine im in am an auf mit bei von zu so oft immer sehr ganz nicht kann wie wenn es".split(
    " ",
  ),
);

function editDistance(a: string, b: string, max: number): number {
  if (Math.abs(a.length - b.length) > max) return max + 1;
  let previous = Array.from({ length: b.length + 1 }, (_, index) => index);
  for (let i = 1; i <= a.length; i++) {
    const current = [i];
    let rowMin = i;
    for (let j = 1; j <= b.length; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      current[j] = Math.min(previous[j] + 1, current[j - 1] + 1, previous[j - 1] + cost);
      rowMin = Math.min(rowMin, current[j]);
    }
    if (rowMin > max) return max + 1;
    previous = current;
  }
  return previous[b.length];
}

/** Wie gut ein Suchwort zu einem Wort aus dem Katalog passt (0 = gar nicht). */
function wordMatch(query: string, word: string): number {
  if (word === query) return 1;
  if (word.startsWith(query)) return 0.85;
  // Wortteil mitten im Wort zählt wenig: "schwer" steckt auch in "Beschwerden".
  if (query.length >= 4 && word.includes(query)) return 0.35;
  // Gebeugte Formen: "krämpfen" passt zu "krämpfe", "vergesslich" zu "vergessen".
  if (query.length >= 5 && word.length >= 5) {
    const stem = Math.min(query.length, word.length) - 2;
    if (stem >= 4 && query.slice(0, stem) === word.slice(0, stem)) return 0.6;
  }
  // Tippfehler: ein Fehler ab 4 Buchstaben, zwei ab 8.
  const allowed = query.length >= 8 ? 2 : query.length >= 4 ? 1 : 0;
  if (allowed > 0 && editDistance(query, word, allowed) <= allowed) return 0.45;
  return 0;
}

interface Field {
  label: string;
  weight: number;
  text: string;
  words: string[];
}

const field = (label: string, weight: number, text: string): Field => ({
  label,
  weight,
  text,
  words: tokenize(text),
});

const INDEX: { symptom: CatalogSymptom; fields: Field[] }[] = SYMPTOM_CATALOG.map(
  (symptom) => ({
    symptom,
    fields: [
      field("Name", 10, symptom.name),
      ...(symptom.keywords ?? []).map((keyword) => field("Suchbegriff", 8, keyword)),
      field("Beschreibung", 5, symptom.short),
      ...symptom.examples.map((example) => field("Beispiel", 4, example)),
      ...(symptom.amplifiers ?? []).map((item) => field("Kann es verstärken", 2.5, item)),
      ...symptom.measures.map((measure) => field("Hilfe", 2, measure.text)),
    ],
  }),
);

/** Sucht im Katalog und liefert die Treffer, beste zuerst. */
export function searchSymptoms(query: string): SearchHit[] {
  const all = tokenize(query);
  const meaningful = all.filter((word) => !STOP_WORDS.has(word));
  const words = meaningful.length > 0 ? meaningful : all;
  if (words.length === 0) return SYMPTOM_CATALOG.map((symptom) => ({ symptom, score: 0 }));

  const hits: SearchHit[] = [];
  for (const { symptom, fields } of INDEX) {
    let score = 0;
    let best: { field: Field; value: number } | null = null;
    let matched = 0;

    for (const word of words) {
      let wordBest: { field: Field; value: number } | null = null;
      for (const candidate of fields) {
        let match = 0;
        for (const fieldWord of candidate.words) {
          match = Math.max(match, wordMatch(word, fieldWord));
          if (match === 1) break;
        }
        const value = match * candidate.weight;
        if (value > 0 && (!wordBest || value > wordBest.value)) {
          wordBest = { field: candidate, value };
        }
      }
      if (!wordBest) continue;
      matched++;
      score += wordBest.value;
      if (!best || wordBest.value > best.value) best = wordBest;
    }

    // Mindestens die Hälfte der Wörter muss passen. Jedes weitere passende
    // Wort wiegt schwerer als jede Gewichtung einzelner Felder.
    if (!best || matched * 2 < words.length) continue;
    hits.push({
      symptom,
      score: matched * 100 + score,
      reason:
        best.field.label === "Name"
          ? undefined
          : { label: best.field.label, text: best.field.text },
    });
  }

  return hits.sort((a, b) => b.score - a.score);
}

/** Einstiege zum Stöbern, in Alltagssprache. */
export const SEARCH_SUGGESTIONS = [
  "müde",
  "Beine schwer",
  "Krämpfe",
  "vergesslich",
  "Toilette",
  "verschwommen",
  "Hitze",
];
