# MS Akku vereinfachen – Bestandsaufnahme und Vorschlag

Stand: 12.10.2026. Noch nichts davon ist umgesetzt. Es geht keine gespeicherte
Angabe verloren, egal welche Variante gewählt wird.

## Was die App heute alles hat

**15 Screens**

| Bereich | Screens |
| --- | --- |
| Einführung | Willkommen, Nutzungspräferenz, Symptomauswahl |
| Alltag | Heute, Akku einschätzen, Veränderung erfassen |
| Rückblick | Verlauf, Muster |
| Symptome | Symptombibliothek, Symptom-Detail |
| Verwaltung | Mehr, Sicherung & Export, Feedback, Datenschutz, Impressum |

**Allein auf „Heute“ stehen acht Dinge untereinander:** Begrüßung, Akku-Karte,
heutiger Verlauf, „Wie fühlst du dich gerade?“, Knopf „Veränderung erfassen“,
Karte „Symptombibliothek“, Tagesplan, „Auffällig“.

**Drei Wege, etwas einzutragen:** Akku einschätzen (Regler, Schnellwahl,
Stichworte, Notiz), Befinden auf „Heute“ (vier Optionen), Veränderung erfassen
(sechs Optionen, bis zu drei Schritte).

**13 Einstellungen und Aktionen unter „Mehr“:** Erscheinungsbild (Automatisch, Dunkel,
Hell), zwei Uhrzeiten dazu, Farben nach Stimmung, Nutzungspräferenz, Töne,
Tipp-Rückmeldung, Einführung erneut, Beispieldaten, Einträge löschen, Export,
Wiederherstellen, Google-Drive-Sicherung.

## Woher die Komplexität kommt

Die App beantwortet heute vier verschiedene Fragen gleichzeitig:

1. Wie viel Energie habe ich gerade? (Akku)
2. Was hat sich an meinen Symptomen verändert? (Erfassen, Verlauf)
3. Gibt es Zusammenhänge? (Muster, Tagesplan)
4. Was ist das für ein Symptom und was hilft? (Symptombibliothek)

Jede davon ist für sich sinnvoll. Zusammen ergeben sie eine App, die man
erklären muss.

## Vorschlag: eine Sache gut machen

**Kern:** den Akku in wenigen Sekunden festhalten und später sehen, wie er
verlaufen ist. Alles andere tritt zurück.

### Was bleibt und sichtbar ist

- **Heute:** Datum, die Akku-Zahl groß, ein Regler oder die drei Schnellwahlen
  direkt auf dem Screen, ein Knopf „Speichern“. Darunter die Einträge von
  heute. Sonst nichts.
- **Verlauf:** die letzten Tage als einfache Balken, darunter die Einträge.
- **Mehr:** Hell/Dunkel, Rückmeldung beim Tippen, Export, Löschen, dazu
  Datenschutz und Impressum.

Navigation: zwei Ziele unten (Heute, Verlauf) und „Mehr“ oben rechts. Kein
Knopf in der Mitte.

### Was ausgeblendet wird (bleibt im Code, einschaltbar unter „Mehr → Erweitert“)

- Symptombibliothek mit Suche, Belastung und Detailansicht
- Veränderung erfassen (Symptome)
- Muster
- Notiz und Stichworte beim Akku (hinter „Mehr dazu“ aufklappbar)

### Was ganz entfällt

- Tagesplan und „Auffällig“ auf „Heute“
- „Wie fühlst du dich gerade?“ (überschneidet sich mit dem Akku)
- Farben nach Stimmung, sonnige Begrüßungskarte
- Nutzungspräferenz, Beispieldaten
- Uhrzeiten für Hell/Dunkel: Automatik bleibt mit festen Zeiten, dazu der
  Umschalter
- Töne und Tipp-Rückmeldung als zwei Schalter: werden einer
- Google-Drive-Sicherung (war nie eingerichtet; der Datei-Export bleibt)
- Feedback-Formular (war nie eingerichtet)
- Einführung: ein Screen statt drei

### Ergebnis

| | heute | vereinfacht |
| --- | --- | --- |
| Screens | 15 | 6 (mit „Erweitert“ mehr) |
| Dinge auf „Heute“ | 8 | 3 |
| Wege, etwas einzutragen | 3 | 1 |
| Einstellungen und Aktionen | 13 | 4 |

## Die Frage, von der alles abhängt

Wofür hast du die App ursprünglich gemacht?

- **A · Nur den Akku festhalten.** Dann gilt der Vorschlag oben unverändert.
- **B · Akku und Symptome festhalten.** Dann bleibt zusätzlich „Veränderung
  erfassen“ sichtbar, in einfacherer Form (Symptom antippen, fertig).
- **C · Akku festhalten und Symptome nachschlagen.** Dann bleibt zusätzlich
  die Symptombibliothek sichtbar, Erfassen und Muster treten zurück.

Der offene Pull Request zur Satz-Suche bleibt liegen, bis das entschieden ist.
