# MS Akku – Ideen

Sammlung von Ideen zur Weiterentwicklung. Jeder Eintrag trägt das Datum, an dem
die Idee entstanden ist. Neue Einträge kommen oben dazu.

Status-Legende: **Idee** (noch nicht geplant) · **Geplant** · **In Arbeit** · **Umgesetzt**

Für alle Einträge gelten die festen Produktregeln von MS Akku: keine Diagnose,
keine Kausalitätsbehauptungen, keine automatischen Kosten, Daten bleiben
standardmäßig auf dem Gerät.

---

## 12.10.2026 – Intelligente Symptomsuche und tiefere Detailansicht

**Status:** Umgesetzt am 12.10.2026 · **Quelle:** Marco

Bereits erfasste und erforschte Symptome sollen sich leicht finden und
entdecken lassen. Von einem Symptom aus soll man weiter in die Tiefe gehen
können.

**Umgesetzt**

- Suche im Symptomkatalog versteht Alltagsworte („müde“, „Beine schwer“),
  mehrere Wörter, Umlaut-Schreibweisen („muede“), gebeugte Formen und kleine
  Tippfehler („vergeslich“). Beste Treffer stehen oben, und unter jedem
  Treffer steht, warum er passt (`lib/symptom-search.ts`).
- Durchsucht werden Name, Beschreibung, Alltagsbeispiele, Verstärker und
  Hilfen.
- Vorschläge zum Stöbern unter dem Suchfeld.
- Detailansicht zeigt verwandte Symptome aus demselben Bereich, sodass man
  von einem Symptom zum nächsten weitergehen kann.
- Die Suche läuft vollständig auf dem Gerät: keine KI, kein Server, keine
  Kosten, Suchbegriffe verlassen das Gerät nicht.

**Offen**

- Eine Suche, die frei formulierte Sätze wirklich „versteht“, bräuchte ein
  KI-Modell. Das hieße: Kosten und Gesundheitsangaben an einen Dienst senden.
  Bewusst nicht gebaut; nur nach ausdrücklicher Entscheidung.
- Der Katalog deckt 23 Symptome ab. Seltene Symptome fehlen noch und lassen
  sich bisher nur als eigenes Symptom anlegen.

---

## 10.10.2026 – DSGVO-Prüfung in drei Durchgängen

**Status:** Umgesetzt am 12.10.2026 (Ergebnis: `docs/dsgvo-pruefung.md`), rechtliche Punkte offen · **Quelle:** Marco (ausgearbeitet im ChatGPT-Chat)

Gesundheitsdaten sind heikel (besondere Kategorie nach Art. 9 DSGVO). Der
Datenschutz soll deshalb nicht einmal abgehakt, sondern mehrfach und getrennt
geprüft werden – am tatsächlichen Code, nicht nur auf dem Papier.

1. **Architektur und Datenspeicherung:** Welche Gesundheitsdaten werden erhoben?
   Was bleibt lokal? Was geht an Dritte (Hosting, Google, weitere Dienste)?
   Werden unnötige Daten vermieden?
2. **Rechtlich und organisatorisch:** Rechtsgrundlagen einschließlich Art. 9,
   Einwilligungen, Datenschutzerklärung, Auftragsverarbeitung, Löschkonzept,
   Betroffenenrechte, ggf. Datenschutz-Folgenabschätzung.
3. **Unabhängiger Gegencheck:** Alles noch einmal kritisch gegenlesen –
   Datenflüsse, Berechtigungen, Drittanbieter, Lücken und Widersprüche zwischen
   Code und Datenschutzerklärung.

Zusätzlich: Privacy by Design und Privacy by Default. Cloud-Synchronisierung
erst nach bewusster Entscheidung des Nutzers.

**Umgesetzt**

- Drei Durchgänge am Code, vier Funde behoben (u. a. stand das geöffnete
  Symptom in der Adresse und wäre im Server-Log gelandet).
- Neu: Datenschutzerklärung (`/datenschutz`) und Impressum (`/impressum`).

**Offen**

- Mehrere KI-Prüfungen sind keine rechtsverbindliche Freigabe. Die acht
  offenen Punkte stehen in `docs/dsgvo-pruefung.md` unter „Offen“.
- Bei jedem neuen Datenfluss Erklärung und Prüfdokument mitpflegen.

---

## 10.10.2026 – Feedback-Funktion wie in RetroMind

**Status:** Umgesetzt am 12.10.2026, Versand noch nicht eingerichtet · **Quelle:** Marco (ausgearbeitet im ChatGPT-Chat)

Nutzer sollen direkt in der App mitteilen können, was sie denken. Vier
Kategorien:

- **Lob** – Was gefällt besonders gut?
- **Tadel** – Was funktioniert nicht oder stört?
- **Vorschläge** – Wie könnte etwas besser werden?
- **Wünsche** – Welche Funktionen fehlen?

Weitere Anforderungen

- Freitextfeld für die eigentliche Rückmeldung.
- Optionaler Bezug zu einer Funktion oder einem Symptom.
- Freiwillige Kontaktmöglichkeit für Rückfragen.
- Bestätigung nach erfolgreicher Übermittlung.
- Ohne Registrierung nutzbar.
- Später: Rückmeldungen zentral sammeln, auswerten, nach Themen sortieren.

**Umgesetzt**

- Formular unter „Mehr → Feedback geben“ mit den vier Kategorien, Freitext,
  optionalem App-Bereich und optionaler E-Mail, ohne Registrierung.
- Empfang wie in RetroMind: Mail über Resend und Eintrag in `feedback.md` im
  Repository (`app/api/feedback/route.ts`). Beide Wege nutzen kostenlose
  Kontingente.
- Vor dem Senden steht, was übertragen wird und was nicht; gesendet wird erst
  nach Einwilligung. Einträge aus der App werden nie mitgeschickt.

**Offen**

- Versand einrichten: Variablen aus `.env.example` in Vercel setzen. Bis dahin
  zeigt die App „noch nicht eingerichtet“.
- Der Bezug zu einem Symptom wurde bewusst weggelassen (nur App-Bereiche),
  damit Feedback keine Gesundheitsangabe erzwingt.
- Auswertung nach Themen: noch nicht gebaut, `feedback.md` ist die Sammlung.

---

## 10.10.2026 – Persönlicher Symptomkatalog mit Hilfestellungen

**Status:** Umgesetzt am 12.10.2026, Google-Sicherung noch nicht eingerichtet · **Quelle:** Marco (ausgearbeitet im ChatGPT-Chat)

Aus der heutigen kurzen Symptomauswahl wird ein umfassender, durchsuchbarer
Katalog mit Erklärungen und Hilfen. Vier Bausteine:

### 1. Symptomkatalog zum Abhaken

- Möglichst vollständige Liste aller bekannten MS-Symptome, gruppiert und
  durchsuchbar, Auswahl per Abhaken.
- Pro Symptom eine kurze, leicht verständliche Beschreibung, damit man schnell
  erkennt, ob es einen selbst betrifft.
- Genannte Bereiche: Fatigue, Schmerzen, Sehstörungen, Gefühlsstörungen, Gang
  und Gleichgewicht, Spastik, Blase und Darm, Schlaf, Stimmung, Gedächtnis,
  Konzentration, Zittern, Sprache und Schlucken, sexuelle Funktionsstörungen.
- Recherche: Foren und Betroffenenberichte für Alltagssprache und typische
  Beschreibungen; Leitlinien, systematische Übersichtsarbeiten und Studien für
  alles Medizinische.

### 2. Belastungsscore 1 bis 10

- Für jedes ausgewählte Symptom: Wie sehr schadet es mir? 1 = kaum belastend,
  10 = extrem belastend.
- Später Verlauf und Veränderungen sichtbar machen.
- Der Score ist eine persönliche Einschätzung, kein validierter Test – analog
  zum subjektiven Akku.

### 3. Detailansicht pro Symptom

Öffnet sich beim Antippen eines Symptoms:

- verständliche Beschreibung und typische Alltagsbeispiele
- mögliche Auslöser
- wissenschaftlich gestützte Methoden, das Symptom zu verbessern, damit
  zurechtzukommen und die Lebensqualität zu steigern
- Evidenzstärke und Quellen
- Hinweis, wann ärztliche Abklärung sinnvoll ist

### 4. Speicherung

- Standard: lokal auf dem Gerät (wie bisher).
- Optional später: Anmeldung mit Google und Ablage in der Cloud – nur nach
  ausdrücklicher Zustimmung.

**Umgesetzt**

- Katalog mit 23 Symptomen in 7 Gruppen unter „Mehr → Symptomkatalog“
  (`lib/symptom-catalog.ts`), durchsuchbar auch über Alltagsbegriffe wie
  „müde“ oder „Krämpfe“, Abhaken direkt in der Liste.
- Belastung 1 bis 10 pro Symptom (`Symptom.burden`), in der Liste sichtbar.
- Detailansicht mit Beschreibung, Alltagsbeispielen, möglichen Verstärkern,
  Hilfen mit Empfehlungsstärke und Fundstelle, Hinweis zur ärztlichen
  Abklärung und Quellen.
- Quellen: deutsche S2k-Leitlinie der DGN (Version 7.1, November 2023, im
  Volltext gelesen) und die DMSG. Jede Hilfe nennt ihre Fundstelle.
- Export und Wiederherstellung als Datei; Sicherung im eigenen Google Drive
  als Opt-in mit ausdrücklicher Einwilligung („Mehr → Sicherung & Export“).

**Abweichungen von der Idee**

- Die Hilfen sind „von Fachleuten empfohlen“, nicht „wissenschaftlich
  bewiesen“: Die Leitlinie ist konsensbasiert. Die App zeigt deshalb die
  Empfehlungsstärke und sagt dazu, was sie bedeutet.
- Foren wurden nicht ausgewertet. Die Alltagsbeispiele sind aus den
  Symptombeschreibungen der Quellen abgeleitet.
- NICE-Leitlinie und MS Society waren nicht abrufbar und sind nicht
  eingeflossen.
- Medikamente werden nur als „ärztlich besprechen“ erwähnt, ohne Namen und
  Dosierung.
- Kein Verlauf der Belastung über die Zeit, nur der aktuelle Wert.

**Offen**

- Inhalte fachlich gegenlesen lassen (Neurologin, Neurologe oder DMSG), bevor
  die App breit beworben wird.
- Die Leitlinie ist inzwischen neuer als Version 7.1. Texte gegen die aktuelle
  Fassung prüfen und `CATALOG_REVIEWED` anpassen.
- Google-Sicherung einrichten: `NEXT_PUBLIC_GOOGLE_CLIENT_ID` setzen. Bis
  dahin ist der Abschnitt unsichtbar.

## 12.10.2026 – Vereinfachung auf den Kern

Fazit nach mehreren Durchgängen: Die App war für ihren Zweck zu komplex.
Entscheidung: Variante A, nur den Akku festhalten (siehe
`docs/vereinfachung-vorschlag.md`).

- „Heute“ zeigt nur noch Akku-Zahl, Regler, Speichern und die Einträge von
  heute. Unten zwei Ziele (Heute, Verlauf), „Mehr“ oben rechts.
- Symptombibliothek, Symptome erfassen und Muster sind ausgeblendet und unter
  „Mehr → Erweitert“ einschaltbar.
- Entfallen: Tagesplan, Befinden, Stimmungsfarben, sonnige Begrüßung,
  Nutzungspräferenz, Beispieldaten, Google-Drive-Sicherung, Feedback.
- Die Idee „Google-Cloud-Speicher“ und die Feedback-Funktion weiter oben sind
  damit zurückgestellt, nicht mehr eingebaut.
