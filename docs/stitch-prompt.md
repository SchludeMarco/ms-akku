# Stitch-Prompt: Überarbeitung von MS Akku

Stand: 12.10.2026. Grundlage ist die Durchsicht aller Screens im Handy-Format
(375 × 812). Die Befunde stehen unten.

So benutzen: Den **Hauptprompt** zuerst in Stitch einfügen. Danach die
**Folgeprompts** einzeln nacheinander, jeweils einen pro Screen. Stitch liefert
bessere Ergebnisse, wenn es nicht alle Screens auf einmal bauen muss.

---

## Hauptprompt

```text
Überarbeite die mobile Web-App „MS Akku“ vollständig. Behalte Charakter, Farben und Schrift des bestehenden Designsystems „Serene Battery Dark“ bei und behebe die unten genannten Schwächen. Alle Texte der Oberfläche sind auf Deutsch, in Du-Form.

WAS DIE APP IST
MS Akku ist ein persönliches Energie-Tagebuch für Menschen mit Multipler Sklerose. Kern ist „Mein Akku“: eine subjektive Selbsteinschätzung von 0 bis 100 %, kein medizinischer Messwert. Die App diagnostiziert nicht. Alle Daten bleiben auf dem Gerät.

FÜR WEN GESTALTET WIRD
Menschen mit Fatigue, Sehstörungen, Zittern, Taubheit in den Fingern und Konzentrationsproblemen. Daraus folgt:
- Blendfreier Dark Mode als Standard, keine reinweißen Flächen, keine harten Kontraste, keine Animationen, die blinken oder schnell laufen.
- Jede antippbare Fläche ist mindestens 48 × 48 px groß, mit mindestens 8 px Abstand zur nächsten. Das gilt auch für Symbole in der Kopfzeile.
- Fließtext mindestens 16 px, Nebentext mindestens 14 px, nichts unter 12 px.
- Kein Text wird mit „…“ abgeschnitten. Text bricht um; Karten wachsen in der Höhe mit.
- Wenig Entscheidungen pro Screen, eine klare Hauptaktion, ruhiger Ton ohne Leistungsdruck.
- Niedrige Energie wird nie rot oder alarmierend dargestellt.

DESIGNSYSTEM (BEIBEHALTEN)
- Farben: Hintergrund #0D1518; Karten #151D20, #192124, #232B2E, #2E3639 (von tief nach hoch); Text #DBE4E8; Nebentext #BACAC5; Linien #3C4A46; Primär #57F1DB; Primär-Fläche #2DD4BF mit Text #003731; hohe Energie Teal #2DD4BF; mittlere Energie Amber #FEA047; niedrige Energie kühles Blau #AFE0FF; Fehler #FFB4AB.
- Schrift: Plus Jakarta Sans. Überschriften 600–700, Fließtext 400.
- Symbole: Material Symbols Outlined.
- Form: weiche Rundungen (Karten 12–16 px, Hauptknöpfe 16 px, Chips voll rund), dünne Linien statt harter Schatten, dezentes Teal-Leuchten nur an der Hauptaktion.
- Raster: 20 px Seitenrand, 16 px Kartenabstand, 16 px Karten-Innenabstand auf dem Handy.

FESTE BAUSTEINE AUF JEDEM SCREEN
- Zielgröße 375 × 812 px. Alles muss auch bei 360 px Breite ohne Abschneiden und ohne waagerechtes Scrollen funktionieren.
- Kopfzeile, 64 px hoch: links Logo und Seitentitel, bei Unterseiten davor ein Zurück-Pfeil. Rechts genau ein Knopf „Übersicht“ (Haus-Symbol), der zur Startseite „Heute“ führt. Der Titel darf nie abgeschnitten werden; bei langen Titeln entfällt das Logo.
- Untere Navigation mit vier Zielen: Heute, Verlauf, Muster, Mehr. In der Mitte ein hervorgehobener runder Knopf „Erfassen“. Die Navigation darf keinen Inhalt verdecken: Jeder Screen endet mit genug Freiraum darunter.
- Formulare und Abläufe enden mit einer fest sichtbaren Hauptaktion am unteren Rand.

BEKANNTE SCHWÄCHEN, DIE BEHOBEN WERDEN MÜSSEN
1. Knöpfe in der Kopfzeile sind nur 36 px groß.
2. Untertitel in Listenzeilen und Titel von Aktivitäten werden abgeschnitten.
3. In der Akku-Karte liefen Prozent-Chips und Skalenbeschriftung auf schmalen Handys ineinander.
4. Überschriften und Zusatz-Chips teilen sich Zeilen und brechen unschön um (Datum neben „Lokal geschützt“, „Wie fühlst du dich gerade?“ neben „Tippen zum Wählen“).
5. Die Startseite ist über zwei Bildschirme lang; das Wichtigste steht nicht zusammen im ersten Bildschirm.
6. Der schwebende Erfassen-Knopf verdeckt Inhalt.
7. Auf dem Erfassen-Screen gibt es drei Wege zurück (Pfeil, „Abbrechen“, Haus). Einer genügt, plus Haus.
8. Karten haben zu viel Innenabstand für schmale Bildschirme.

SCREENS
Gestalte diese Screens, jeweils im Dark Mode:
1. Heute (Startseite und Übersicht)
2. Akku einschätzen (Eingabe, als Blatt von unten)
3. Veränderung erfassen (Schnellerfassung in höchstens drei Schritten)
4. Verlauf
5. Muster
6. Symptomkatalog mit Suche
7. Symptom-Detail
8. Mehr (Einstellungen)
9. Sicherung & Export
10. Feedback
11. Einführung: Willkommen, Nutzungspräferenz, Symptomauswahl
12. Textseite (Vorlage für Datenschutz und Impressum)

Beginne mit Screen 1 und 2. Zeige außerdem ein Blatt mit den Bausteinen: Knöpfe (Haupt, Neben, Text, gefährlich), Chips, Schalter, Listenzeile, Karte, Eingabefeld, Suchfeld, Hinweisbox, Kopfzeile, untere Navigation – jeweils in den Zuständen normal, gedrückt, ausgewählt, deaktiviert.
```

---

## Folgeprompts (einzeln nacheinander)

### 1 · Heute

```text
Screen „Heute“ – die Startseite und Übersicht. Im ersten Bildschirm ohne Scrollen müssen stehen: Datum, eine kompakte Akku-Karte (Prozentzahl groß, Zustand in einem Wort, Balken mit fünf Segmenten, darunter die Skala „Rückzug nötig – Achtsam – Volle Kraft“ über die volle Breite, ein Knopf „Akku neu einschätzen“) und die Hauptaktion „+ Veränderung erfassen“. Darunter: „Wie fühlst du dich gerade?“ mit vier Optionen in einem 2×2-Raster (Überschrift in eigener Zeile, Hinweis darunter), „Dein Tag“ mit geplanten Aktivitäten (Uhrzeit, Titel über zwei Zeilen erlaubt, Aufwand als Chip leicht/mittel/anstrengend), und eine Karte „Auffällig“ mit einer Beobachtung und dem Knopf „Muster ansehen“. Datum und der Hinweis „Lokal geschützt“ stehen untereinander, nicht nebeneinander.
```

### 2 · Akku einschätzen

```text
Blatt von unten „Akku einschätzen“. Oben die große Prozentzahl mit Zustand, darunter der Balken mit Skala über die volle Breite. Dann zwei breite Knöpfe „− 5“ und „+ 5“ nebeneinander, darunter eine Zeile mit den Chips 20 %, 40 %, 60 %, 80 %, 100 % in voller Breite (jeder mindestens 48 px hoch, nichts abgeschnitten). Darunter drei Schnellwahlen „Ausgeruht“, „Erschöpft“, „Fatigue“ mit je einer Zeile Erklärung. Unten fest sichtbar der Hauptknopf „OK“, der speichert und zur Übersicht zurückführt. Kleiner Hinweis: „Deine persönliche Einschätzung, kein medizinischer Messwert.“
```

### 3 · Veränderung erfassen

```text
Screen „Veränderung erfassen“, Schnellerfassung in etwa zehn Sekunden. Schritt 1: Liste mit sechs großen Optionen (Neues Symptom, Etwas ist stärker, Etwas ist schwächer, Etwas ist verschwunden, Mein Akku hat sich verändert, Heute ist ein guter Tag); Titel und Untertitel dürfen umbrechen. Schritt 2: Symptom wählen als große Chips. Schritt 3: Stärke (leicht, deutlich, sehr stark), optional Körperstelle und „seit wann“. Unten fest: Hauptknopf „Speichern“ und daneben als Textknopf „Überspringen & speichern“. Oben nur Zurück-Pfeil, Titel und Haus – kein zusätzliches „Abbrechen“. Fortschritt als drei Punkte.
```

### 4 · Verlauf

```text
Screen „Verlauf“. Oben Umschalter Woche / Monat / 3 Monate / Jahr als Segmentknopf über die volle Breite. Darunter ein Balkendiagramm des Akku-Verlaufs: Balken in Teal, Amber oder kühlem Blau je nach Höhe, heutiger Tag hervorgehoben, Achsenbeschriftung mindestens 12 px, Durchschnitt als Chip. Darunter die Tageschronik: pro Tag eine Karte mit Datum, Tages-Akku und den Einträgen als Zeilen (Uhrzeit, Symbol, Text; Text darf umbrechen). Hinweisbox: „Nur zur Orientierung: Dein Akku zeigt Schwankungen, keine Schulnoten.“
```

### 5 · Muster

```text
Screen „Muster“. Oben eine kurze Erklärung und deutlich die Box „Beobachtung – keine medizinische Diagnose oder festgestellte Ursache.“ Darunter Beobachtungskarten: Chip „Möglicher Zusammenhang“, Chip mit Anzahl vergleichbarer Tage, eine Aussage in einem Satz, darunter ein einfacher Vergleich mit zwei Balken und Prozentwerten. Jede Karte trennt sichtbar „Was beobachtet wurde“ von „Was das nicht bedeutet“. Leerer Zustand: freundlicher Hinweis, dass Muster nach etwa fünf Einschätzungen erscheinen, mit Fortschrittsanzeige.
```

### 6 · Symptomkatalog

```text
Screen „Symptomkatalog“. Oben ein großes Suchfeld „Beschreib es in deinen Worten“, darunter Vorschlags-Chips (müde, Beine schwer, Krämpfe, vergesslich, Toilette). Dann die Symptome in sieben Gruppen mit Gruppenüberschrift. Jede Zeile: links ein großes Kästchen zum Abhaken (48 px), dann Symbol, Name, zweizeilige Kurzbeschreibung, optional Chip „Belastung 6/10“, rechts ein Pfeil zur Detailansicht. Zustand „Suchergebnisse“: flache Liste, beste zuerst, unter jedem Treffer in Teal „Passt zu: …“. Unten ein Feld „Eigenes Symptom hinzufügen“.
```

### 7 · Symptom-Detail

```text
Screen „Symptom-Detail“ am Beispiel Fatigue. Reihenfolge: Symbol und Beschreibung in zwei Sätzen; Schalter „Betrifft mich“; Karte „Wie sehr belastet es dich?“ mit Skala 1 bis 10 als zwei Reihen à fünf Knöpfe (48 px), gewählter Wert groß mit Wort („stark belastend“); „So kann es sich anfühlen“ als drei kurze Aussagen; „Was es verstärken kann“ als Chips; „Was helfen kann“ in drei Gruppen (Im Alltag, Mit Therapeutinnen und Therapeuten, Ärztlich besprechen), jede Hilfe als Karte mit Text, Chip für die Empfehlungsstärke und Quellenangabe; Box „Wann ärztlich abklären“; „Verwandte Symptome“ als Liste; „Quellen“ als Links. Ganz unten der Hinweis „MS Akku stellt keine Diagnosen“. Die Abschnitte sind einklappbar, „Was helfen kann“ ist offen.
```

### 8 · Mehr, Sicherung, Feedback

```text
Drei Screens im selben Stil. „Mehr“: Hinweiskarte „Lokal auf deinem Gerät“, dann Gruppen mit Listenzeilen (Symbol, Titel, Untertitel über zwei Zeilen erlaubt, Pfeil oder Schalter): Persönliche Einstellungen, Daten, Über MS Akku. Gefährliche Aktion „Alle Einträge löschen“ abgesetzt in Fehlerfarbe mit Rückfrage. „Sicherung & Export“: zwei Karten „Als Datei“ (Exportieren, Wiederherstellen) und „In deinem Google Drive (freiwillig)“ mit Erklärtext, Einwilligungs-Kästchen und den Knöpfen Jetzt sichern, Wiederherstellen, Sicherung löschen. „Feedback“: vier große Auswahlkarten Lob, Tadel, Vorschlag, Wunsch im 2×2-Raster, Textfeld mit Zeichenzähler, optionale Felder, Box „Das wird gesendet / Das wird nicht gesendet“, Einwilligungs-Kästchen, Hauptknopf „Feedback senden“, dazu der Erfolgszustand „Danke, ist angekommen“.
```

### 9 · Einführung

```text
Drei Screens der Einführung ohne untere Navigation und ohne Haus-Knopf. „Willkommen“: Logo, ein Satz Nutzen, drei kurze Punkte (Lokal auf deinem Gerät, Sanfter Akku-Check, Muster erkennen), Hauptknopf „Los geht’s“. „Nutzungspräferenz“: zwei große Auswahlkarten („Für mich selbst“, „Zusätzlich für Arzttermine“), Fortschritt „Schritt 1 von 2“. „Symptomauswahl“: Raster mit Symptom-Kacheln zum Antippen, Feld für ein eigenes Symptom, Hauptknopf „Weiter zur Tagesübersicht“, Textknopf „Später auswählen“. Jeder Screen passt möglichst auf einen Bildschirm.
```

---

## Befunde der Durchsicht (12.10.2026)

Gemessen im Browser bei 375 × 812 px mit Beispieldaten.

**In Ordnung**

- Kein Screen scrollt waagerecht.
- Kontraste sind durchweg hoch: Text auf Karte 12,7 : 1, Nebentext 9,6 : 1,
  Platzhalter 5,2 : 1, Text auf dem Hauptknopf 9,4 : 1.
- Schrift ist nirgends kleiner als 12 px, außer dem Etikett „Heute“ im
  Wochendiagramm (10 px).
- Auf den sechs vermessenen Screens (Heute, Verlauf, Muster, Erfassen, Mehr,
  Willkommen) sind alle Knöpfe im Inhalt mindestens 44 px hoch. Die übrigen
  Screens wurden angesehen, aber nicht vermessen.

**Schwächen**

| Nr. | Befund | Wo |
| --- | --- | --- |
| 1 | Knöpfe der Kopfzeile messen 36 × 36 px (Zurück 40 px), Vorgabe sind 48 px | alle Screens |
| 2 | Untertitel werden mit „…“ abgeschnitten | Mehr (5 Zeilen), Erfassen (4), Aktivitäten auf Heute (3), Verlauf (1) |
| 3 | Überschrift und Zusatz teilen sich eine Zeile und brechen unschön um | Heute: Datum, „Wie fühlst du dich gerade?“, Kopf der Akku-Karte |
| 4 | Startseite ist 2,3 Bildschirme lang, Muster 2,8 | Heute, Muster |
| 5 | Schwebender Erfassen-Knopf verdeckt Inhalt beim Scrollen | alle Tab-Screens |
| 6 | Drei Wege zurück auf einem Screen | Erfassen |
| 7 | Pfeil-Symbole in Listenzeilen haben nur 1,8 : 1 Kontrast | Mehr, Erfassen, Katalog |
| 8 | Kopfzeile zeigt Zurück-Pfeil und Profil-Symbol schon in der Einführung | Willkommen |
| 9 | „Deine Gesundheitsdaten verlassen niemals dein Gerät“ stimmte mit Export und freiwilliger Sicherung nicht mehr wörtlich – Text am 12.10.2026 korrigiert | Willkommen |
| 10 | Der Titel „Veränderung erfassen“ wurde neben Zurück-Pfeil, Logo und Haus abgeschnitten – behoben, das Logo weicht dort auf schmalen Handys | Erfassen |

**Zur Haptik**

- Rückmeldung beim Tippen gibt es als leisen Ton und als leichtes
  Zusammenziehen der Fläche. Vibration gibt es nicht.
- Vibration lässt sich im Web auf Android einbauen, auf dem iPhone nicht.

**Nicht geprüft**

- Echte Geräte. Alles wurde im Browser am Laptop im Handy-Format gemessen.
- Bedienung mit Screenreader und mit vergrößerter Systemschrift.
