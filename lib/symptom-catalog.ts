// Symptomkatalog mit Kurzbeschreibungen und Hilfestellungen.
//
// Inhaltliche Regeln (bitte bei jeder Ergänzung einhalten):
// - Jede Maßnahme braucht eine Quelle. Nichts aus dem Gedächtnis ergänzen.
// - Formulierungen bleiben beschreibend ("laut Leitlinie …"), nie als
//   persönliche Behandlungsempfehlung und nie als Kausalaussage.
// - Keine Dosierungen. Medikamente nur als Hinweis "ärztlich besprechen".
// - Bei neuer Leitlinienversion: Texte prüfen und CATALOG_REVIEWED anpassen.

export const CATALOG_REVIEWED = "2026-10-12";

export type SourceId = "dgn" | "dmsg-symptome" | "dmsg-therapie";

export const SOURCES: Record<SourceId, { title: string; detail: string; url: string }> = {
  dgn: {
    title: "S2k-Leitlinie Diagnose und Therapie der Multiplen Sklerose",
    detail:
      "Deutsche Gesellschaft für Neurologie (DGN), AWMF-Register 030/050, Living Guideline Version 7.1, November 2023, Kapitel „Symptombezogene Therapie“",
    url: "https://register.awmf.org/de/leitlinien/detail/030-050",
  },
  "dmsg-symptome": {
    title: "Symptome der MS",
    detail: "Deutsche Multiple Sklerose Gesellschaft (DMSG), Bundesverband",
    url: "https://www.dmsg.de/multiple-sklerose/symptome",
  },
  "dmsg-therapie": {
    title: "Symptomatische Therapie der MS",
    detail: "Deutsche Multiple Sklerose Gesellschaft (DMSG), Bundesverband",
    url: "https://www.dmsg.de/multiple-sklerose/ms-behandeln/therapiesaeulen/symptomatische-therapie",
  },
};

/**
 * Empfehlungsstärke in der Sprache der Leitlinie. Die Leitlinie ist
 * konsensbasiert (S2k): Die Stärke sagt, wie nachdrücklich die Fachleute etwas
 * empfehlen, nicht wie groß der Effekt im Einzelfall ist.
 */
export type Strength = "soll" | "sollte" | "kann" | "info";

export const STRENGTH_LABELS: Record<Strength, { label: string; hint: string }> = {
  soll: { label: "Starke Empfehlung", hint: "Leitlinie: „soll“" },
  sollte: { label: "Empfehlung", hint: "Leitlinie: „sollte“" },
  kann: { label: "Kann erwogen werden", hint: "Leitlinie: „kann“" },
  info: { label: "Hinweis", hint: "Ohne eigene Empfehlungsstärke" },
};

/** selbst = im Alltag möglich · therapie = mit Fachleuten · arzt = ärztliche Entscheidung */
export type MeasureKind = "selbst" | "therapie" | "arzt";

export const KIND_LABELS: Record<MeasureKind, string> = {
  selbst: "Im Alltag",
  therapie: "Mit Therapeutinnen und Therapeuten",
  arzt: "Ärztlich besprechen",
};

export interface Measure {
  text: string;
  kind: MeasureKind;
  strength: Strength;
  source: SourceId;
  /** Fundstelle, z. B. "Empfehlung D19". */
  ref?: string;
}

export type CategoryId =
  | "energie"
  | "bewegung"
  | "empfinden"
  | "sehen"
  | "denken"
  | "blase"
  | "sprechen";

export const CATEGORIES: { id: CategoryId; name: string; icon: string }[] = [
  { id: "energie", name: "Energie & Schlaf", icon: "bolt" },
  { id: "bewegung", name: "Bewegung & Gleichgewicht", icon: "directions_walk" },
  { id: "empfinden", name: "Empfinden & Schmerz", icon: "grain" },
  { id: "sehen", name: "Sehen", icon: "visibility" },
  { id: "denken", name: "Denken & Stimmung", icon: "psychology" },
  { id: "blase", name: "Blase, Darm & Sexualität", icon: "water_drop" },
  { id: "sprechen", name: "Sprechen & Schlucken", icon: "record_voice_over" },
];

export interface CatalogSymptom {
  id: string;
  name: string;
  icon: string;
  category: CategoryId;
  /** Ein Satz zum Wiedererkennen. */
  short: string;
  /** So beschreiben Betroffene es im Alltag. */
  examples: string[];
  /** Was das Symptom verstärken kann – als Beobachtung, nicht als Ursache. */
  amplifiers?: string[];
  measures: Measure[];
  /** Wann eine ärztliche Abklärung sinnvoll ist (zusätzlich zum allgemeinen Hinweis). */
  doctor?: string;
  sources: SourceId[];
  /** Zusätzliche Suchbegriffe. */
  keywords?: string[];
}

const dgn = (
  text: string,
  kind: MeasureKind,
  strength: Strength,
  ref?: string,
): Measure => ({ text, kind, strength, source: "dgn", ref });

const dmsg = (text: string, kind: MeasureKind): Measure => ({
  text,
  kind,
  strength: "info",
  source: "dmsg-therapie",
});

const TRAINING: Measure = dgn(
  "Kraft- und Ausdauertraining: Die Leitlinie empfiehlt, alle Menschen mit MS ab der Diagnose über den Nutzen zu informieren.",
  "selbst",
  "soll",
  "Empfehlung B17",
);

export const SYMPTOM_CATALOG: CatalogSymptom[] = [
  // --- Energie & Schlaf ---------------------------------------------------
  {
    id: "fatigue",
    name: "Fatigue",
    icon: "bedtime",
    category: "energie",
    short:
      "Ungewöhnlich schnelle, starke Erschöpfung – körperlich oder geistig – die sich von normaler Müdigkeit unterscheidet.",
    examples: [
      "Nach kurzer Anstrengung ist plötzlich „der Stecker gezogen“.",
      "Konzentration und Kraft lassen im Tagesverlauf deutlich nach.",
      "Ausruhen hilft weniger, als man erwarten würde.",
    ],
    amplifiers: [
      "Schlechter Schlaf, z. B. durch nächtlichen Harndrang oder unruhige Beine",
      "Wärme",
      "Nebenwirkungen mancher Medikamente",
      "Begleiterkrankungen wie Schilddrüsenunterfunktion, Blutarmut oder Vitamin-B12-Mangel",
      "Depressive Verstimmung",
    ],
    measures: [
      dgn(
        "Energiemanagement: Kräfte einteilen, Pausen planen, Prioritäten setzen. Dafür gibt es angeleitete Programme.",
        "selbst",
        "soll",
        "Empfehlung D19",
      ),
      dgn(
        "Körperliches Training: Ausdauertraining in Kombination mit Krafttraining.",
        "selbst",
        "soll",
        "Empfehlung D19",
      ),
      dgn(
        "Kühlende Maßnahmen, z. B. kühle Getränke, kühle Bäder oder Kühlkleidung.",
        "selbst",
        "soll",
        "Empfehlung D19",
      ),
      dgn(
        "Kognitive Verhaltenstherapie, Achtsamkeitstraining und gegebenenfalls ein Aufmerksamkeitstraining.",
        "therapie",
        "soll",
        "Empfehlung D19",
      ),
      dgn(
        "Medikamente kommen laut Leitlinie nur in Einzelfällen als Therapieversuch infrage.",
        "arzt",
        "kann",
        "Empfehlung D20",
      ),
    ],
    doctor:
      "Erschöpfung kann auch andere, behandelbare Gründe haben (Schlaf, Medikamente, Blutwerte, Depression). Das lässt sich ärztlich abklären.",
    sources: ["dgn", "dmsg-symptome", "dmsg-therapie"],
    keywords: ["erschöpfung", "müdigkeit", "müde", "kraftlos", "matt"],
  },
  {
    id: "energie",
    name: "Energie",
    icon: "bolt",
    category: "energie",
    short:
      "Dein allgemeines Energiegefühl über den Tag – unabhängig davon, ob es mit der MS zu tun hat.",
    examples: [
      "Heute fühlt sich alles leichter oder schwerer an als sonst.",
      "Die Energie reicht für weniger oder mehr als geplant.",
    ],
    measures: [
      dgn(
        "Energiemanagement hilft, Kräfte über den Tag zu verteilen (siehe auch Fatigue).",
        "selbst",
        "soll",
        "Empfehlung D19",
      ),
    ],
    sources: ["dgn"],
    keywords: ["akku", "kraft", "leistung"],
  },
  {
    id: "schlaf",
    name: "Schlaf",
    icon: "nights_stay",
    category: "energie",
    short: "Schwierigkeiten beim Ein- oder Durchschlafen oder Schlaf, der nicht erholt.",
    examples: [
      "Nachts mehrmals wach, z. B. wegen Harndrang, Schmerzen oder Muskelkrämpfen.",
      "Morgens wie gerädert trotz genug Stunden im Bett.",
    ],
    amplifiers: [
      "Nächtlicher Harndrang",
      "Unruhige Beine oder nächtliche Spasmen",
      "Depressive Verstimmung",
      "Nebenwirkungen mancher Medikamente",
    ],
    measures: [
      dgn(
        "Die Leitlinie nennt Schlafstörungen als häufigen, behandelbaren Grund für Tagesmüdigkeit. Sinnvoll ist, den Auslöser zu finden (Blase, Beine, Stimmung, Medikamente) und diesen anzugehen.",
        "arzt",
        "info",
        "Kapitel Fatigue",
      ),
      dmsg("Auf regelmäßigen Schlaf achten.", "selbst"),
    ],
    doctor:
      "Bei lautem Schnarchen mit Atemaussetzern oder ausgeprägter Tagesmüdigkeit kann eine Untersuchung im Schlaflabor sinnvoll sein.",
    sources: ["dgn", "dmsg-therapie"],
    keywords: ["einschlafen", "durchschlafen", "wach", "schlaflos", "insomnie"],
  },
  {
    id: "hitze",
    name: "Wärmeempfindlichkeit",
    icon: "device_thermostat",
    category: "energie",
    short:
      "Bei Wärme, Fieber oder Anstrengung werden vorhandene Beschwerden vorübergehend stärker (Uhthoff-Phänomen).",
    examples: [
      "Nach heißem Duschen oder in der Sommerhitze sehe ich schlechter oder die Beine werden schwer.",
      "Sobald ich abkühle, geht es wieder zurück.",
    ],
    amplifiers: ["Hohe Außentemperaturen", "Heißes Baden oder Duschen", "Fieber", "Körperliche Anstrengung"],
    measures: [
      dgn(
        "Kühlende Maßnahmen wie kalte Getränke, kühle Bäder oder Kühlkleidung sind laut Leitlinie häufig wirksam.",
        "selbst",
        "info",
        "Kapitel Paroxysmale Symptome",
      ),
    ],
    doctor:
      "Eine Verschlechterung durch Wärme gilt laut Leitlinie nicht als Schub. Halten Beschwerden nach dem Abkühlen an, ist eine Abklärung sinnvoll.",
    sources: ["dgn", "dmsg-therapie"],
    keywords: ["uhthoff", "hitze", "sommer", "sauna", "fieber", "temperatur"],
  },

  // --- Bewegung & Gleichgewicht -------------------------------------------
  {
    id: "gehfaehigkeit",
    name: "Gehfähigkeit",
    icon: "directions_walk",
    category: "bewegung",
    short: "Gehen strengt mehr an, wird langsamer oder die Strecke wird kürzer.",
    examples: [
      "Nach einer gewissen Strecke muss ich stehen bleiben.",
      "Ein Fuß bleibt hängen oder schleift.",
      "Treppen kosten deutlich mehr Kraft.",
    ],
    measures: [
      dgn(
        "Physiotherapie mit Gang- und Gleichgewichtstraining nach den Empfehlungen der Fachgesellschaft für Neurologische Rehabilitation.",
        "therapie",
        "soll",
        "Empfehlung D12",
      ),
      TRAINING,
      dgn(
        "Wenn der Fuß hängen bleibt: funktionelle Elektrostimulation erproben, bevor eine klassische Schiene angepasst wird.",
        "therapie",
        "sollte",
        "Empfehlung D14",
      ),
      dgn(
        "Bei eingeschränkter, aber erhaltener Gehfähigkeit gibt es ein Medikament, das als Behandlungsversuch angeboten werden soll.",
        "arzt",
        "soll",
        "Empfehlung D13",
      ),
    ],
    sources: ["dgn", "dmsg-therapie"],
    keywords: ["gehen", "laufen", "gang", "gehstrecke", "fußheber", "stolpern", "mobilität", "schwere beine", "treppe"],
  },
  {
    id: "schwaeche",
    name: "Muskelschwäche",
    icon: "fitness_center",
    category: "bewegung",
    short: "Arme oder Beine fühlen sich kraftlos an oder lassen sich schlechter bewegen.",
    examples: [
      "Ein Bein gibt nach oder fühlt sich an wie Blei.",
      "Dinge fallen mir aus der Hand.",
    ],
    measures: [
      dgn(
        "Regelmäßige Physiotherapie, ergänzt durch eigenständiges Üben.",
        "therapie",
        "soll",
        "Empfehlungen D6 und D12",
      ),
      TRAINING,
    ],
    doctor:
      "Eine neue oder deutlich zunehmende Schwäche, die länger als einen Tag anhält, sollte zeitnah neurologisch abgeklärt werden.",
    sources: ["dgn", "dmsg-symptome"],
    keywords: ["lähmung", "kraftlos", "parese", "schwach", "motorik", "schwere beine", "bleiern"],
  },
  {
    id: "spastik",
    name: "Spastik",
    icon: "accessibility_new",
    category: "bewegung",
    short:
      "Muskeln sind steif oder verkrampfen, oft in den Beinen. Bewegungen fühlen sich zäh an.",
    examples: [
      "Die Beine fühlen sich steif an, besonders morgens oder nach langem Sitzen.",
      "Nachts schießen schmerzhafte Krämpfe ein.",
    ],
    amplifiers: [
      "Infekte, z. B. Blasenentzündung",
      "Schmerzen",
      "Wunde Hautstellen",
      "Ungünstige Haltung oder Lagerung",
    ],
    measures: [
      dgn(
        "Auslöser meiden oder behandeln lassen (Infekte, Schmerzen, wunde Stellen, ungünstige Haltung).",
        "selbst",
        "soll",
        "Empfehlung D6",
      ),
      dgn(
        "Regelmäßige Physiotherapie, je nach Situation zwei- bis dreimal pro Woche, unterstützt durch tägliches eigenes Üben.",
        "therapie",
        "soll",
        "Empfehlung D6",
      ),
      dgn(
        "Wenn die Spastik im Alltag einschränkt, sollen unterstützend Medikamente angeboten werden – vorsichtig eindosiert, weil Spastik manchmal auch Halt gibt.",
        "arzt",
        "soll",
        "Empfehlung D7",
      ),
      dgn(
        "Bei unzureichender Wirkung kommen gezielte Verfahren wie Botulinumtoxin infrage.",
        "arzt",
        "sollte",
        "Empfehlung D10",
      ),
    ],
    sources: ["dgn", "dmsg-symptome", "dmsg-therapie"],
    keywords: ["steif", "krampf", "krämpfe", "verkrampfen", "spasmen", "muskelspannung"],
  },
  {
    id: "gleichgewicht",
    name: "Gleichgewicht",
    icon: "balance",
    category: "bewegung",
    short: "Unsicheres Stehen oder Gehen, Schwanken, unpräzise Bewegungen (Ataxie).",
    examples: [
      "Ich gehe breitbeiniger oder halte mich häufiger fest.",
      "Greifen und Zielen klappt nicht mehr genau.",
    ],
    amplifiers: ["Erschöpfung", "Anspannung", "Tagesform"],
    measures: [
      dgn(
        "Regelmäßige und dauerhafte Physio- und Ergotherapie, die Koordination und Gleichgewicht trainiert.",
        "therapie",
        "soll",
        "Empfehlung D15",
      ),
      dgn(
        "Kühlen vor feinmotorischen Tätigkeiten und Gewichte am Handgelenk nur nach Erprobung in der Therapie.",
        "therapie",
        "soll",
        "Empfehlung D15",
      ),
    ],
    sources: ["dgn", "dmsg-therapie"],
    keywords: ["ataxie", "koordination", "schwanken", "unsicher", "sturz", "stürzen", "balance"],
  },
  {
    id: "tremor",
    name: "Zittern",
    icon: "vibration",
    category: "bewegung",
    short: "Hände, Arme oder Kopf zittern, oft stärker, je näher man einem Ziel kommt.",
    examples: [
      "Beim Trinken oder Schreiben zittert die Hand.",
      "Je genauer ich etwas greifen will, desto stärker wird es.",
    ],
    amplifiers: ["Erschöpfung", "Anspannung"],
    measures: [
      dgn(
        "Koordinationsfördernde Physio- und Ergotherapie, Hilfsmittel für den Alltag.",
        "therapie",
        "soll",
        "Empfehlung D15",
      ),
      dgn(
        "Bei beeinträchtigendem Zittern kann ein Therapieversuch mit Medikamenten erwogen werden.",
        "arzt",
        "kann",
        "Empfehlung D16",
      ),
    ],
    sources: ["dgn", "dmsg-therapie"],
    keywords: ["tremor", "zittern", "wackeln", "feinmotorik"],
  },
  {
    id: "schwindel",
    name: "Schwindel",
    icon: "cyclone",
    category: "bewegung",
    short: "Dreh- oder Schwankgefühl, als würde der Boden nachgeben.",
    examples: [
      "Alles dreht sich oder ich fühle mich wie auf einem Schiff.",
      "Beim schnellen Aufstehen oder Kopfdrehen wird mir schwindelig.",
    ],
    measures: [
      dgn(
        "Für Schwindel gibt es in der MS-Leitlinie keine eigene Empfehlung. Bei Gangunsicherheit gelten die Empfehlungen zu Gleichgewicht und Koordination.",
        "therapie",
        "info",
      ),
    ],
    doctor:
      "Schwindel hat viele mögliche Gründe, auch außerhalb der MS. Neu auftretender oder anhaltender Schwindel sollte ärztlich abgeklärt werden.",
    sources: ["dmsg-symptome", "dgn"],
    keywords: ["drehschwindel", "schwanken", "benommen"],
  },

  // --- Empfinden & Schmerz ------------------------------------------------
  {
    id: "kribbeln",
    name: "Kribbeln",
    icon: "grain",
    category: "empfinden",
    short: "Kribbeln, Ameisenlaufen oder Brennen auf der Haut ohne äußeren Anlass.",
    examples: [
      "Es fühlt sich an wie eingeschlafene Hände oder Füße.",
      "Beim Beugen des Nackens läuft ein Stromgefühl den Rücken hinunter.",
    ],
    measures: [
      dgn(
        "Belasten die Missempfindungen oder schmerzen sie, richtet sich die Behandlung nach den Leitlinien für Nervenschmerzen.",
        "arzt",
        "soll",
        "Empfehlung D38",
      ),
    ],
    doctor:
      "Neue Missempfindungen, die länger als einen Tag anhalten, sollten neurologisch abgeklärt werden.",
    sources: ["dgn", "dmsg-symptome"],
    keywords: ["missempfindung", "ameisenlaufen", "brennen", "parästhesie", "lhermitte", "pelzig"],
  },
  {
    id: "taubheit",
    name: "Taubheitsgefühl",
    icon: "back_hand",
    category: "empfinden",
    short: "Stellen am Körper fühlen sich pelzig, taub oder wie in Watte gepackt an.",
    examples: [
      "Ich spüre Berührung, Wärme oder Kälte an einer Stelle schlechter.",
      "Die Fingerspitzen fühlen sich fremd an.",
    ],
    measures: [
      dgn(
        "In Physio- und Ergotherapie kann die Wahrnehmung gezielt geschult werden (Sensibilitätsschulung).",
        "therapie",
        "info",
        "Kapitel Ataxie und Tremor",
      ),
    ],
    doctor:
      "Ein neues Taubheitsgefühl, das länger als einen Tag anhält, sollte neurologisch abgeklärt werden.",
    sources: ["dgn", "dmsg-symptome"],
    keywords: ["taub", "pelzig", "gefühllos", "sensibilität", "gefühlsstörung"],
  },
  {
    id: "schmerzen",
    name: "Schmerzen",
    icon: "healing",
    category: "empfinden",
    short:
      "Nervenschmerzen, Muskel- und Gelenkschmerzen oder Kopfschmerzen – dauerhaft oder in Phasen.",
    examples: [
      "Brennende oder stechende Schmerzen in Armen oder Beinen.",
      "Rücken- oder Gelenkschmerzen durch veränderte Haltung.",
      "Schmerzhafte Muskelkrämpfe.",
    ],
    measures: [
      dgn(
        "Die Behandlung richtet sich nach der Art des Schmerzes und folgt den jeweiligen Schmerz-Leitlinien. Deshalb lohnt es sich, den Schmerz genau zu beschreiben.",
        "arzt",
        "soll",
        "Empfehlung D38",
      ),
      dgn(
        "Schmerzen durch Spastik werden wie die Spastik selbst behandelt.",
        "arzt",
        "soll",
        "Empfehlung D39",
      ),
      dmsg("Physiotherapie bei Muskel- und Gelenkschmerzen.", "therapie"),
    ],
    doctor:
      "Die Leitlinie hält fest, dass Schmerzen bei MS ärztlich oft zu wenig beachtet werden. Sprich sie aktiv an.",
    sources: ["dgn", "dmsg-symptome", "dmsg-therapie"],
    keywords: ["schmerz", "weh", "brennen", "stechen", "kopfschmerzen", "rückenschmerzen", "neuropathisch"],
  },
  {
    id: "anfallsartig",
    name: "Anfallsartige Beschwerden",
    icon: "flash_on",
    category: "empfinden",
    short:
      "Sekunden bis Minuten kurze, immer gleich ablaufende Beschwerden, oft schmerzhaft – etwa einschießende Gesichtsschmerzen.",
    examples: [
      "Ein blitzartiger Schmerz im Gesicht beim Kauen, Sprechen oder Berühren.",
      "Kurze Muskelverkrampfungen, die von selbst wieder aufhören.",
    ],
    amplifiers: ["Berührung oder andere Sinnesreize", "Bewegung oder Lagewechsel", "Schnelles, tiefes Atmen", "Wärme"],
    measures: [
      dmsg("Ein Tagebuch führen und bekannte Auslöser meiden.", "selbst"),
      dgn(
        "Die Behandlung erfolgt vor allem mit Medikamenten. Bei einschießenden Gesichtsschmerzen ist sie fast immer nötig, bei leichteren Beschwerden oft nicht.",
        "arzt",
        "soll",
        "Empfehlungen D51 und D54",
      ),
    ],
    doctor:
      "Einzelne kurze Episoden gelten laut Leitlinie nicht als Schub. Wiederholen sie sich über mehr als 24 Stunden, sollte das abgeklärt werden.",
    sources: ["dgn", "dmsg-therapie"],
    keywords: ["trigeminus", "neuralgie", "gesichtsschmerz", "paroxysmal", "blitzartig", "einschießend"],
  },

  // --- Sehen ---------------------------------------------------------------
  {
    id: "sehen",
    name: "Sehen",
    icon: "visibility",
    category: "sehen",
    short: "Verschwommenes Sehen oder Nebelsehen, oft auf einem Auge, manchmal blassere Farben.",
    examples: [
      "Ich sehe wie durch Milchglas.",
      "Farben wirken auf einem Auge blasser.",
      "Das Auge schmerzt beim Bewegen.",
    ],
    amplifiers: ["Wärme", "Anstrengung"],
    measures: [
      dmsg("Wenn Wärme das Sehen verschlechtert: für Abkühlung sorgen.", "selbst"),
    ],
    doctor:
      "Eine neue Sehverschlechterung, besonders mit Schmerzen bei Augenbewegungen, sollte zeitnah augenärztlich oder neurologisch abgeklärt werden.",
    sources: ["dmsg-symptome", "dmsg-therapie"],
    keywords: ["sehstörung", "verschwommen", "nebelsehen", "sehnerv", "optikusneuritis", "auge"],
  },
  {
    id: "doppelbilder",
    name: "Doppelbilder",
    icon: "filter_2",
    category: "sehen",
    short: "Dinge erscheinen doppelt oder das Bild wackelt, weil die Augen nicht genau zusammenarbeiten.",
    examples: [
      "Beim Blick zur Seite sehe ich zwei Bilder.",
      "Schrift scheint zu springen oder zu zittern.",
    ],
    measures: [
      dgn(
        "Bei störenden Doppelbildern: ein Auge abdecken, täglich im Wechsel, oder eine Prismenbrille erproben.",
        "arzt",
        "soll",
        "Empfehlung D37",
      ),
      dgn(
        "Bei Augenzittern kann ein Therapieversuch mit Medikamenten erfolgen, der nach sechs bis acht Wochen überprüft werden sollte.",
        "arzt",
        "kann",
        "Empfehlung D36",
      ),
    ],
    doctor: "Neu auftretende Doppelbilder sollten zeitnah abgeklärt werden.",
    sources: ["dgn"],
    keywords: ["doppelt sehen", "nystagmus", "augenzittern", "wackeln", "augenbewegung"],
  },

  // --- Denken & Stimmung ---------------------------------------------------
  {
    id: "konzentration",
    name: "Konzentration",
    icon: "psychology",
    category: "denken",
    short: "Aufmerksamkeit lässt schneller nach, mehrere Dinge gleichzeitig fallen schwerer.",
    examples: [
      "Ich verliere beim Lesen oder in Gesprächen den Faden.",
      "Nebengeräusche lenken mich stärker ab als früher.",
    ],
    amplifiers: ["Erschöpfung", "Depressive Verstimmung"],
    measures: [
      dgn(
        "Neuropsychologische Behandlung, gegebenenfalls mit Kompensationstraining und gezieltem Training am Computer.",
        "therapie",
        "soll",
        "Empfehlung D23",
      ),
      dgn("Eigenständige körperliche Aktivität.", "selbst", "sollte", "Empfehlung D23"),
      dgn(
        "Medikamente sollen laut Leitlinie bei kognitiven Einschränkungen nicht eingesetzt werden.",
        "arzt",
        "soll",
        "Empfehlung D24",
      ),
    ],
    doctor:
      "Ein kurzer standardisierter Test in der neurologischen Praxis kann zeigen, ob eine ausführliche Untersuchung sinnvoll ist.",
    sources: ["dgn", "dmsg-symptome", "dmsg-therapie"],
    keywords: ["aufmerksamkeit", "kognition", "kognitiv", "denken", "nebel", "brain fog", "ablenkbar"],
  },
  {
    id: "gedaechtnis",
    name: "Gedächtnis",
    icon: "lightbulb",
    category: "denken",
    short: "Neues bleibt schlechter hängen, Namen oder Termine entfallen häufiger.",
    examples: [
      "Ich vergesse, was ich gerade tun wollte.",
      "Ich brauche mehr Notizen und Erinnerungen als früher.",
    ],
    amplifiers: ["Erschöpfung", "Depressive Verstimmung"],
    measures: [
      dgn(
        "Neuropsychologische Behandlung mit Kompensationstraining, z. B. Merktechniken.",
        "therapie",
        "soll",
        "Empfehlung D23",
      ),
      dgn("Eigenständige körperliche Aktivität.", "selbst", "sollte", "Empfehlung D23"),
    ],
    sources: ["dgn", "dmsg-symptome", "dmsg-therapie"],
    keywords: ["merkfähigkeit", "vergesslich", "vergessen", "erinnern", "kognition"],
  },
  {
    id: "stimmung",
    name: "Stimmung",
    icon: "sentiment_satisfied",
    category: "denken",
    short: "Anhaltend gedrückte Stimmung, Antriebslosigkeit oder weniger Freude an Dingen.",
    examples: [
      "Ich habe an Dingen, die mir sonst guttun, kaum noch Freude.",
      "Alles fühlt sich schwer und sinnlos an.",
    ],
    measures: [
      dgn(
        "Depressive Störungen sollen wie bei Menschen ohne MS nach der Nationalen Versorgungsleitlinie behandelt werden, z. B. mit Psychotherapie.",
        "arzt",
        "soll",
        "Empfehlung D49",
      ),
      dgn(
        "Zusätzlich regelmäßige Bewegungstherapie.",
        "selbst",
        "sollte",
        "Empfehlung D50",
      ),
    ],
    doctor:
      "Erschöpfung und Depression können sich ähnlich anfühlen und werden unterschiedlich behandelt. Hält gedrückte Stimmung an, sprich mit einer Ärztin oder einem Arzt. Bei Gedanken, dir etwas anzutun: sofort Hilfe holen – Telefonseelsorge 0800 111 0 111 (kostenlos, rund um die Uhr) oder Notruf 112.",
    sources: ["dgn", "dmsg-symptome", "dmsg-therapie"],
    keywords: ["depression", "depressiv", "traurig", "niedergeschlagen", "antrieb", "psyche", "angst"],
  },

  // --- Blase, Darm & Sexualität --------------------------------------------
  {
    id: "blase-darm",
    name: "Blase / Darm",
    icon: "water_drop",
    category: "blase",
    short: "Häufiger oder plötzlicher Harndrang, Probleme beim Entleeren, Verstopfung oder ungewollter Verlust.",
    examples: [
      "Ich muss sehr oft oder ganz plötzlich zur Toilette.",
      "Die Blase fühlt sich nicht richtig leer an.",
      "Der Stuhlgang ist seltener und härter als früher.",
    ],
    measures: [
      dgn(
        "Blase: ausreichend und gleichmäßig über den Tag trinken, geplante Toilettengänge, Harndrang nicht hinauszögern, Blasen- und Beckenbodentraining.",
        "selbst",
        "info",
        "Kapitel Harntrakt",
      ),
      dgn(
        "Ein Tagebuch über drei Tage (wann, wie viel) hilft bei der Abklärung.",
        "selbst",
        "info",
        "Kapitel Harntrakt",
      ),
      dgn("Darm: 1,5 bis 2 Liter täglich trinken.", "selbst", "soll", "Empfehlung D35"),
      dgn("Darm: Bewegung und Physiotherapie.", "selbst", "soll", "Empfehlung D35"),
      dgn("Darm: ballaststoffreiche Mischkost.", "selbst", "sollte", "Empfehlung D35"),
      dgn(
        "Medikamente für die Blase sollen mit einer Urologin oder einem Urologen abgestimmt werden.",
        "arzt",
        "soll",
        "Empfehlung D31",
      ),
    ],
    doctor:
      "Diese Beschwerden werden laut Leitlinie besonders oft verschwiegen, lassen sich aber gut behandeln. Brennen beim Wasserlassen, Fieber oder trüber Urin können auf einen Infekt hinweisen und sollten zeitnah abgeklärt werden.",
    sources: ["dgn", "dmsg-symptome", "dmsg-therapie"],
    keywords: ["harndrang", "inkontinenz", "toilette", "wasserlassen", "verstopfung", "stuhlgang", "urin"],
  },
  {
    id: "sexualitaet",
    name: "Sexualität",
    icon: "favorite",
    category: "blase",
    short: "Weniger Lust, verändertes Empfinden oder Schwierigkeiten bei Erregung und Orgasmus.",
    examples: [
      "Berührungen fühlen sich anders an als früher.",
      "Die Lust hat nachgelassen oder Erregung bleibt aus.",
    ],
    measures: [
      dgn(
        "Frühzeitige sexualmedizinische Beratung, möglichst gemeinsam mit der Partnerin oder dem Partner.",
        "therapie",
        "sollte",
        "Empfehlung D26",
      ),
      dgn("Beckenbodentraining.", "selbst", "kann", "Empfehlung D27"),
      dgn(
        "Erektionsstörungen sollen begleitend zur Beratung medikamentös behandelt werden.",
        "arzt",
        "soll",
        "Empfehlung D28",
      ),
    ],
    doctor:
      "Laut Leitlinie betrifft das einen großen Teil der Menschen mit MS. Es ist ein medizinisches Thema wie jedes andere.",
    sources: ["dgn", "dmsg-symptome", "dmsg-therapie"],
    keywords: ["libido", "lust", "erektion", "orgasmus", "sex", "partnerschaft"],
  },

  // --- Sprechen & Schlucken -------------------------------------------------
  {
    id: "sprechen",
    name: "Sprechen",
    icon: "record_voice_over",
    category: "sprechen",
    short: "Die Aussprache wird undeutlicher, langsamer oder leiser.",
    examples: [
      "Andere fragen häufiger nach.",
      "Langes Sprechen strengt an, die Stimme wird leise.",
    ],
    amplifiers: ["Erschöpfung"],
    measures: [
      dgn(
        "Logopädische Untersuchung und individuelle Therapie.",
        "therapie",
        "soll",
        "Empfehlung D41",
      ),
      dgn(
        "Reicht das nicht aus, sollen Kommunikationshilfen bis hin zu elektronischen Hilfen bereitgestellt werden.",
        "therapie",
        "soll",
        "Empfehlung D44",
      ),
    ],
    sources: ["dgn", "dmsg-therapie"],
    keywords: ["dysarthrie", "aussprache", "undeutlich", "lallen", "stimme", "logopädie"],
  },
  {
    id: "schlucken",
    name: "Schlucken",
    icon: "restaurant",
    category: "sprechen",
    short: "Häufiges Verschlucken, Husten beim Essen oder Trinken, Gefühl, dass etwas im Hals stecken bleibt.",
    examples: [
      "Ich verschlucke mich öfter, besonders an Flüssigem.",
      "Nach dem Schlucken klingt die Stimme „feucht“.",
      "Ich muss mehrmals nachschlucken.",
    ],
    measures: [
      dgn(
        "Logopädische Untersuchung des Schluckens und Schlucktherapie.",
        "therapie",
        "soll",
        "Empfehlungen D45 und D46",
      ),
    ],
    doctor:
      "Leichte Schluckstörungen werden laut Leitlinie oft nicht bemerkt. Häufiges Verschlucken, Husten beim Essen oder wiederkehrende Lungenentzündungen sollten abgeklärt werden.",
    sources: ["dgn", "dmsg-therapie"],
    keywords: ["verschlucken", "dysphagie", "husten", "essen", "trinken"],
  },
];

export const catalogById = new Map(SYMPTOM_CATALOG.map((symptom) => [symptom.id, symptom]));

/** Leitlinien-Definition des Schubs, sinngemäß für alle Detailseiten. */
export const GENERAL_DOCTOR_HINT =
  "Neue oder wieder auftretende Beschwerden, die mindestens 24 Stunden anhalten und nicht durch Wärme oder einen Infekt erklärbar sind, können laut Leitlinie auf einen Schub hinweisen. Dann ist es sinnvoll, zeitnah die neurologische Praxis zu kontaktieren.";
