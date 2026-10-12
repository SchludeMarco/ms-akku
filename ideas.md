# MS Akku – Ideen

Sammlung von Ideen zur Weiterentwicklung. Jeder Eintrag trägt das Datum, an dem
die Idee entstanden ist. Neue Einträge kommen oben dazu.

Status-Legende: **Idee** (noch nicht geplant) · **Geplant** · **In Arbeit** · **Umgesetzt**

Für alle Einträge gelten die festen Produktregeln von MS Akku: keine Diagnose,
keine Kausalitätsbehauptungen, keine automatischen Kosten, Daten bleiben
standardmäßig auf dem Gerät.

---

## 10.10.2026 – DSGVO-Prüfung in drei Durchgängen

**Status:** Idee · **Quelle:** Marco (ausgearbeitet im ChatGPT-Chat)

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

**Offen**

- Mehrere KI-Prüfungen sind keine rechtsverbindliche Freigabe. Offene
  Rechtsfragen dokumentieren und klären, ob eine fachkundige
  Datenschutzberatung nötig ist.
- Die Prüfung wird fällig, sobald Daten das Gerät verlassen können
  (Cloud-Sync, Feedback-Funktion).

---

## 10.10.2026 – Feedback-Funktion wie in RetroMind

**Status:** Idee · **Quelle:** Marco (ausgearbeitet im ChatGPT-Chat)

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

**Offen**

- Feedback muss das Gerät verlassen. Das ist der erste Datenfluss nach außen
  und braucht einen Empfänger (bisher gibt es kein Backend). Lösung aus
  RetroMind prüfen und übernehmen.
- Kein Feedback darf unbemerkt Gesundheitsdaten mitschicken. Was übertragen
  wird, muss vor dem Absenden sichtbar sein.
- Der Empfangsweg darf keine laufenden Kosten auslösen.

---

## 10.10.2026 – Persönlicher Symptomkatalog mit Hilfestellungen

**Status:** Idee · **Quelle:** Marco (ausgearbeitet im ChatGPT-Chat)

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

**Stand im Code heute**

- `lib/symptoms.ts` enthält 12 feste Symptome plus eigene Einträge, ohne
  Beschreibung.
- Die Tabelle `symptoms` kennt `name`, `icon`, `isCustom`, `active`. Für
  Beschreibung, Kategorie und Belastungsscore braucht es neue Felder und eine
  neue Datenbankversion.
- `SymptomEntry.intensity` (leicht / deutlich / sehr stark) beschreibt einen
  einzelnen Moment. Der Belastungsscore ist etwas anderes: die generelle
  Belastung durch ein Symptom.

**Offen**

- Es gibt keine einzelne Methode, die für alle Symptome bewiesen ist. Jede
  Maßnahme muss pro Symptom einzeln belegt werden. Die im Chat genannten
  Quellen (NICE-Leitlinie zu MS, MS Society) sind noch nicht geprüft.
- Formulierung der Hilfen: als Information mit Quelle, nicht als persönliche
  Behandlungsempfehlung. Passt das zur Regel „MS Akku diagnostiziert nicht“?
  Vor der Umsetzung entscheiden, wie weit die Texte gehen dürfen.
- Wer pflegt die Inhalte, und wie werden sie aktuell gehalten (Datum der
  letzten Prüfung pro Symptom)?
- Google-Cloud-Sync steht im Spannungsfeld zu „kein Login, kein Cloud-Sync als
  Standard“. Nur als Opt-in und erst nach der DSGVO-Prüfung.
