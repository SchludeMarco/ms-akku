import { CATEGORIES, SYMPTOM_CATALOG, type CatalogSymptom } from "@/lib/symptom-catalog";

// Suche im Symptomkatalog. Läuft vollständig im Browser: Suchbegriffe verlassen
// das Gerät nicht, und es entstehen keine Kosten.
//
// - Stichworte: Treffer, die zu allen Wörtern passen, stehen oben; passt nur
//   ein Teil, erscheinen sie darunter.
// - Ganze Sätze und längere Beschreibungen: Füllwörter werden übergangen,
//   jedes Symptom sammelt Punkte für die Wörter, die zu ihm passen.
// - Umlaute und ß werden angeglichen ("muede" findet "müde").
// - Wortanfänge, Wortteile und kleine Tippfehler werden gefunden.
// - Treffer im Namen zählen mehr als Treffer in Beispielen oder Hilfen.

export interface SearchHit {
  symptom: CatalogSymptom;
  score: number;
  /** Mindestens ein Wort trifft Name oder Suchbegriff genau. */
  strong?: boolean;
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

// Füllwörter, die sonst jede Suche ausbremsen ("ich bin immer müde"). Bei
// ganzen Sätzen kommen viele davon vor; sie sagen nichts über das Symptom.
const STOP_WORDS = new Set(
  (
    "ich du er sie es wir ihr man mir mich dir dich mein meine meinem meinen meiner dein deine " +
    "bin bist ist sind war waren habe hab hast hat hatte haben werde wird wurde werden " +
    "kann konnte muss musste will soll mag moechte " +
    "der die das den dem des ein eine einen einem einer eines kein keine " +
    "und oder aber auch doch noch nur schon dann denn weil dass wenn als wie so " +
    "im in am an auf mit bei von vom zu zum zur aus fuer ueber unter nach vor seit durch gegen ohne um bis " +
    "oft immer sehr ganz nicht mehr viel etwas mal manchmal irgendwie eher total richtig " +
    "heute gestern morgens abends tagen wochen zeit gerade wieder ploetzlich " +
    "fuehle fuehlt fuehlen gefuehl spuere merke bemerke bekomme sich " +
    "aufs ins kaum alles schlecht gut dauernd staendig bisschen ziemlich wirklich einfach " +
    "meinen meinem rechten linken rechts links beim paar ein wenig"
  ).split(" "),
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
  // Gemeinsamer Wortstamm: mindestens fünf Buchstaben und gut die Hälfte des
  // kürzeren Wortes ("konzentrieren" – "Konzentration", "Beinen" – "Beine").
  const shorter = Math.min(query.length, word.length);
  let stem = 0;
  while (stem < shorter && query[stem] === word[stem]) stem++;
  if (stem >= 5 && stem >= shorter * 0.6) return 0.6;
  // Tippfehler: ein Fehler ab 6 Buchstaben, zwei ab 10 – und nur bei gleichem
  // Anfangsbuchstaben. Sonst wird aus "Beine" ein "keine" und aus "gegessen"
  // ein "vergessen".
  const allowed = query.length >= 10 ? 2 : query.length >= 6 ? 1 : 0;
  if (allowed > 0 && query[0] === word[0] && editDistance(query, word, allowed) <= allowed) {
    return 0.45;
  }
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
      field("Bereich", 3, CATEGORIES.find((item) => item.id === symptom.category)?.name ?? ""),
      ...(symptom.keywords ?? []).map((keyword) => field("Suchbegriff", 8, keyword)),
      field("Beschreibung", 5, symptom.short),
      ...symptom.examples.map((example) => field("Beispiel", 4, example)),
      ...(symptom.amplifiers ?? []).map((item) => field("Kann es verstärken", 2.5, item)),
      ...symptom.measures.map((measure) => field("Hilfe", 2, measure.text)),
      ...(symptom.doctor ? [field("Ärztlich abklären", 1.5, symptom.doctor)] : []),
    ],
  }),
);

/** Ab so vielen Wörtern gilt eine Eingabe als Beschreibung statt als Stichwort. */
const LONG_QUERY_WORDS = 4;
/** So viele Treffer zeigt eine Beschreibung höchstens. */
const LONG_QUERY_LIMIT = 8;
/** Ein einzelnes Wort zählt in einer Beschreibung erst ab diesem Wert. */
const MIN_WORD_VALUE = 2.5;
/** Unter diesem Wert gilt ein Symptom bei einer Beschreibung als Zufallstreffer. */
const MIN_LONG_SCORE = 5;
/** Ab diesem Wert ist ein Wort ein eindeutiger Treffer (Name oder Suchbegriff). */
const STRONG_VALUE = 7.5;

/**
 * Sucht im Katalog und liefert die Treffer, beste zuerst.
 *
 * Stichworte (bis drei Wörter): Mindestens die Hälfte muss passen.
 * Beschreibungen (ganze Sätze, auch mehrere): Jedes Symptom sammelt Punkte für
 * die Wörter, die zu ihm passen. Gezeigt werden die Symptome mit den meisten
 * Punkten, samt den Wörtern, die erkannt wurden.
 */
export function searchSymptoms(query: string): SearchHit[] {
  // Schreibweise der Person merken, um erkannte Wörter so zurückzugeben.
  const original = new Map<string, string>();
  for (const raw of query.match(/[\p{L}\p{N}]+/gu) ?? []) {
    const [key] = tokenize(raw);
    if (key && !original.has(key)) original.set(key, raw);
  }
  const all = [...new Set(tokenize(query))];
  const meaningful = all.filter((word) => !STOP_WORDS.has(word));
  const words = meaningful.length > 0 ? meaningful : all;
  if (words.length === 0) return SYMPTOM_CATALOG.map((symptom) => ({ symptom, score: 0 }));

  // Ein ganzer Satz zählt als Beschreibung, auch wenn nach dem Übergehen der
  // Füllwörter nur wenige Wörter bleiben.
  const long = words.length >= LONG_QUERY_WORDS || all.length >= LONG_QUERY_WORDS + 1;
  const hits: SearchHit[] = [];
  let fullMatch = false;
  for (const { symptom, fields } of INDEX) {
    let score = 0;
    let best: { field: Field; value: number } | null = null;
    const matchedWords: { word: string; value: number }[] = [];

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
      // In einer Beschreibung zählen nur deutliche Treffer; ein Wort, das bloß
      // irgendwo in einem Hilfetext vorkommt, sagt nichts über das Symptom.
      if (!wordBest || (long && wordBest.value < MIN_WORD_VALUE)) continue;
      matchedWords.push({ word, value: wordBest.value });
      score += wordBest.value;
      if (!best || wordBest.value > best.value) best = wordBest;
    }

    if (!best) continue;

    if (long) {
      hits.push({
        symptom,
        score,
        strong: best.value >= STRONG_VALUE,
        reason: {
          label: "Erkannt",
          text: matchedWords
            .sort((x, y) => y.value - x.value)
            .slice(0, 4)
            .map(({ word }) => original.get(word) ?? word)
            .join(", "),
        },
      });
      continue;
    }

    // Stichworte: Mindestens die Hälfte der Wörter muss passen. Jedes weitere
    // passende Wort wiegt schwerer als jede Gewichtung einzelner Felder.
    if (matchedWords.length * 2 < words.length) continue;
    fullMatch ||= matchedWords.length === words.length;
    hits.push({
      symptom,
      score: matchedWords.length * 100 + score,
      reason:
        best.field.label === "Name"
          ? undefined
          : { label: "Passt zu", text: best.field.text },
    });
  }

  hits.sort((x, y) => y.score - x.score);
  // Stichworte: Passt ein Symptom zu allen Wörtern, entfallen die Teiltreffer.
  if (!long) {
    return fullMatch && words.length > 1
      ? hits.filter((hit) => hit.score >= words.length * 100)
      : hits;
  }

  // Beschreibungen: nur was klar passt – mindestens ein deutlicher Treffer und
  // nicht weit hinter dem besten Symptom.
  const top = hits[0]?.score ?? 0;
  return hits
    .filter(
      (hit) =>
        hit.score >= MIN_LONG_SCORE && (hit.score >= top * 0.4 || hit.strong === true),
    )
    .slice(0, LONG_QUERY_LIMIT);
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
