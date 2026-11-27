# DSGVO-Prüfung MS Akku

Stand: 12.10.2026 · geprüft am Code des Branches `feature/symptomkatalog-feedback`

**Wichtig:** Das ist eine technische Prüfung durch eine KI in drei getrennten
Durchgängen. Sie ist keine Rechtsberatung und keine rechtsverbindliche
Freigabe. MS Akku verarbeitet Gesundheitsdaten (Art. 9 DSGVO). Die Punkte unter
„Offen – braucht eine Entscheidung oder fachkundige Prüfung“ sollten vor einer
breiten Veröffentlichung mit einer Datenschutzfachperson geklärt werden.

Regel für die Zukunft: Wer einen Datenfluss ändert oder hinzufügt, aktualisiert
im selben Schritt `app/datenschutz/page.tsx` und diese Datei.

---

## Nachtrag 12.10.2026 – Vereinfachung der App (Branch `simplify`)

Mit der Vereinfachung sind zwei Datenflüsse ganz entfallen. Alles, was weiter
unten zu ihnen steht, beschreibt den früheren Stand und gilt nicht mehr:

- **Google-Drive-Sicherung entfernt** (`lib/google-drive.ts` gelöscht, keine
  Einwilligung und kein Google-Skript mehr im Code).
- **Feedback entfernt** (Formular, `/api/feedback`, Resend und GitHub als
  Empfänger). Die App hat damit keinen eigenen Server-Endpunkt mehr.
- **Was bleibt:** Hosting bei Vercel (Server-Logs beim Laden der Seiten),
  Speicherung im Browser, Export und Wiederherstellen als Datei.
- **Einstellungen in `ms-akku-settings`:** Nutzungsart, Google-Einwilligung und
  Stimmungsfarben entfallen; neu sind drei Schalter für ausgeblendete
  Funktionen (Symptombibliothek, Symptome erfassen, Muster). Der Schlüssel
  `ms-akku-mood` wird nicht mehr geschrieben.
- **Datenschutzerklärung** entsprechend gekürzt (Abschnitte zu Google Drive und
  Feedback gestrichen, neu nummeriert).
- Die offenen Punkte zu Resend, GitHub, Google und zur Löschfrist für Feedback
  sind damit erledigt. Offen bleiben: Anschrift im Impressum bestätigen,
  Vercel-Auftragsverarbeitung, fachkundige Prüfung der Texte.

---

## Durchgang 1 – Architektur und Datenspeicherung

Frage: Welche Daten gibt es, wo liegen sie, was verlässt das Gerät?

### Welche Daten

| Daten | Gesundheitsbezug | Ort |
| --- | --- | --- |
| Akku-Werte, Notizen, Tags | ja | IndexedDB im Browser (`lib/db.ts`) |
| Symptomauswahl, Belastung 1–10, eigene Symptomnamen | ja | IndexedDB |
| Symptom-, Aktivitäts-, Schlafeinträge, Momente | ja | IndexedDB |
| Berechnete Beobachtungen | ja | IndexedDB |
| Einstellungen (Ton, Tipp-Rückmeldung, Erscheinungsbild, Onboarding, Nutzungsart, Google-Einwilligung) | nein | localStorage (`ms-akku-settings`) |
| Zuletzt gezeigte Lichtstimmung („sunny“ oder „rest“), abgeleitet aus Befinden und Akku des Tages | mittelbar | localStorage (`ms-akku-mood`), nur für den flackerfreien Start |
| Kopie der App-Dateien für den Offline-Betrieb (keine Einträge) | nein | Cache des Browsers, verwaltet von `public/sw.js` |

Es gibt keine Datenbank auf einem Server, kein Konto, keine Cookies.

### Was das Gerät verlassen kann

| Fluss | Auslöser | Empfänger | Inhalt |
| --- | --- | --- | --- |
| Seitenabruf | jeder Aufruf | Vercel (Hosting) | IP-Adresse, aufgerufene Adresse, Browser – keine Einträge |
| Export als Datei | Tippen auf „Exportieren“ | niemand (Datei bleibt lokal) | alle Einträge |
| Google-Drive-Sicherung | Einwilligung + Tippen auf „Jetzt sichern“ | Google (Drive der Person) | alle Einträge |
| Feedback | Einwilligung + „Feedback senden“ | Server der App → Resend (Mail), GitHub (Datei) | Kategorie, Text, Bereich, optional E-Mail |
| Quellen-Link | Tippen auf einen Link | DMSG, AWMF | übliche Abrufdaten, ohne Herkunftsangabe |

### Ergebnis

- **In Ordnung:** Local-First ist eingehalten. Ohne eigenes Zutun verlässt kein
  Eintrag das Gerät.
- **In Ordnung:** Schriften (Plus Jakarta Sans, Inter) werden beim Build
  eingebettet, die Symbolschrift kommt aus dem eigenen Paket. Im Build und im
  Netzwerkprotokoll der Vorschau gab es keine Anfrage an Google Fonts oder
  andere Dritte.
- **In Ordnung:** Kein Tracking-, Analyse- oder Fehlerberichts-Paket in
  `package.json`.
- **Datensparsamkeit Google:** Es wird nur der Bereich `drive.appdata`
  angefragt, kein Profil, keine E-Mail-Adresse. Das Zugriffstoken liegt nur im
  Arbeitsspeicher. Keine automatische Synchronisierung.
- **Datensparsamkeit Feedback:** Der Server speichert weder IP-Adresse noch
  Browserangaben zum Feedback. Die Kontaktadresse steht nur in der Mail, nie in
  `feedback.md`. Das Formular bietet nur App-Bereiche als Bezug an, bewusst
  keine Symptome.
- **Behoben in diesem Durchgang:** Es gab bisher keinen Export. Jetzt gibt es
  Export und Wiederherstellung als Datei (Datenübertragbarkeit).

---

## Durchgang 2 – Rechtlich und organisatorisch

Frage: Gibt es für jede Verarbeitung eine Grundlage, Information und einen Weg,
Rechte auszuüben?

| Thema | Stand |
| --- | --- |
| Datenschutzerklärung | **Neu:** `/datenschutz`, erreichbar über „Mehr“. Beschreibt alle Flüsse aus Durchgang 1. |
| Impressum (§ 5 DDG) | **Neu:** `/impressum`. Angaben aus dem RetroMind-Impressum übernommen. |
| Speichern im Browser (§ 25 TDDDG) | Unbedingt erforderlich für die gewünschte Funktion, daher ohne Einwilligungsbanner. In der Erklärung genannt. |
| Gesundheitsdaten lokal | Verarbeitung nur auf dem Gerät der Person; der Betreiber hat keinen Zugriff. |
| Google Drive | Ausdrückliche Einwilligung per Haken vor dem ersten Kontakt zu Google (Art. 6 Abs. 1 lit. a, Art. 9 Abs. 2 lit. a). Widerruf durch Entfernen des Hakens; Löschen der Sicherung in der App möglich. |
| Feedback | Einwilligung per Haken vor dem Senden, mit Angabe, was gesendet wird und was nicht. Hinweis, keine Gesundheitsangaben zu machen. |
| Hosting | Berechtigtes Interesse (Art. 6 Abs. 1 lit. f). |
| Betroffenenrechte | In der Erklärung genannt, inklusive Aufsichtsbehörde. Auskunft, Export und Löschung der Einträge kann die Person selbst in der App ausführen. |
| Medizinische Abgrenzung | Hinweis „keine Diagnose, kein Ersatz für ärztliche Beratung“ im Katalog, auf jeder Detailseite und im Impressum. |

### Offen – braucht eine Entscheidung oder fachkundige Prüfung

1. **Texte prüfen lassen.** Datenschutzerklärung und Impressum hat eine KI
   entworfen. Sie beschreiben den Code korrekt, sind aber nicht juristisch
   geprüft.
2. **Betreiberangaben bestätigen.** Name, c/o-Adresse und E-Mail stammen aus
   dem RetroMind-Impressum (`lib/operator.ts`). Stimmen sie für MS Akku?
3. **Auftragsverarbeitung.** Mit Vercel besteht ein Data Processing Addendum
   über die Nutzungsbedingungen – bitte im Konto bestätigen. Für Resend und
   GitHub gilt das erst, sobald Feedback eingerichtet wird: dann deren
   Vereinbarungen zur Auftragsverarbeitung prüfen und abschließen.
4. **Übermittlung in die USA.** Vercel, Google, Resend und GitHub sitzen in den
   USA. Für Vercel und Google übernimmt die Erklärung die Aussage aus der
   RetroMind-Erklärung (EU-US Data Privacy Framework). Für Resend und GitHub
   nennt sie nur die Übermittlung; der Zertifizierungsstatus ist nicht geprüft.
5. **Löschfrist für Feedback.** Die Erklärung nennt „spätestens nach zwei
   Jahren“. Das ist ein Vorschlag. Die Frist muss gewollt sein und dann auch
   eingehalten werden (Einträge in `feedback.md` und Mails löschen).
6. **Verzeichnis von Verarbeitungstätigkeiten und Folgenabschätzung.** Ob für
   ein privates, nicht-kommerzielles Projekt ein Verzeichnis (Art. 30) oder
   eine Datenschutz-Folgenabschätzung (Art. 35) nötig ist, hängt von Umfang und
   Einordnung ab und ist eine Rechtsfrage. Für die lokale Speicherung spricht
   wenig dafür, für die Google-Sicherung von Gesundheitsdaten sollte es
   geprüft werden.
7. **Medizinprodukterecht.** Der Symptomkatalog gibt Leitlinieninhalte wieder
   und gibt keine individuellen Empfehlungen. Ob die App damit sicher außerhalb
   der Medizinprodukte-Verordnung (MDR) liegt, ist keine Datenschutzfrage, aber
   bei einer Gesundheits-App vor breiter Veröffentlichung zu klären.
8. **Alter.** Die App fragt kein Alter ab. Falls sie sich auch an unter
   16-Jährige richtet, gelten für Einwilligungen besondere Regeln (Art. 8).

---

## Durchgang 3 – Unabhängiger Gegencheck am Code

Vorgehen: Nicht den Ergebnissen aus 1 und 2 vertraut, sondern den Code neu
durchsucht (alle externen Adressen, alle `fetch`-Aufrufe, alle Zugriffe auf
Browser-Speicher, alle Log-Ausgaben) und das Netzwerkprotokoll der laufenden
App angesehen.

### Gefunden und behoben

| Nr. | Fund | Behebung |
| --- | --- | --- |
| G1 | Die Detailseite eines Symptoms hatte die Adresse `/symptome/fatigue`. Beim Öffnen wäre im Server-Log des Hosters sichtbar gewesen, welches Symptom sich eine IP-Adresse ansieht – ein Gesundheitsbezug, der das Gerät verlässt und in Durchgang 1 übersehen wurde. | Das Symptom steht jetzt im Hash (`/symptome/detail#fatigue`). Der Hash wird nie an den Server gesendet. Der Server sieht nur noch, dass irgendeine Detailseite geöffnet wurde. |
| G2 | Links zu den Quellen hätten der Zielseite die Herkunft (Referrer) mitteilen können. | `Referrer-Policy: no-referrer` für alle Seiten (`next.config.ts`), zusätzlich `rel="noopener noreferrer"` an den Links. |
| G3 | Die Karte unter „Mehr“ behauptete „Ohne Cloud. Deine Einträge verlassen dieses Gerät nicht“ – mit Export und Google-Sicherung nicht mehr uneingeschränkt richtig. | Text angepasst: „… nur, wenn du sie selbst exportierst oder sicherst.“ |
| G4 | Keine Schutz-Header gegen Einbetten und Typ-Raten. | `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, restriktive `Permissions-Policy`. |

### Geprüft und in Ordnung

- **Externe Adressen im Code:** nur GitHub- und Resend-API (serverseitig, nur
  Feedback), Google-Adressen (nur `lib/google-drive.ts`, nur nach
  Einwilligung) und die drei Quellen-Links.
- **Google-Skript:** wird ausschließlich in `loadGis()` geladen, und das wird
  nur aufgerufen, wenn der Einwilligungs-Haken gesetzt ist. Ohne
  `NEXT_PUBLIC_GOOGLE_CLIENT_ID` ist der ganze Abschnitt unsichtbar.
- **Feedback-Endpunkt:** nimmt nur die im Schema erlaubten Felder an, lehnt
  alles ohne `consent: true` ab, schreibt in Fehlerfällen nur die technische
  Fehlermeldung ins Log, nie den Feedback-Text.
- **Browser-Speicher:** nur IndexedDB (Dexie), ein localStorage-Eintrag für
  Einstellungen und der Offline-Vorrat der App-Dateien. Keine Cookies, kein
  sessionStorage.
- **Service Worker (ergänzt am 12.10.2026):** speichert nur Dateien der App
  vom eigenen Server, beantwortet nur GET-Anfragen an die eigene Adresse und
  reicht alles andere (Feedback, Google) unverändert durch. Er überträgt
  nichts und speichert keine Einträge.
- **Import:** eingelesene Sicherungen werden mit Zod geprüft und erst nach
  ausdrücklicher Bestätigung übernommen.
- **Erklärung gegen Code:** Jeder in `/datenschutz` beschriebene Fluss
  existiert im Code, und es gibt keinen Fluss im Code, der dort fehlt.

### Bekannte Restpunkte (bewusst nicht in diesem Schritt gelöst)

- **Vorab-Laden von Seiten:** Next.js lädt verlinkte Seiten im Hintergrund vor.
  Seit G1 enthalten diese Anfragen keinen Symptombezug mehr; sie zeigen dem
  Hoster nur, welche App-Bereiche es gibt.
- **Keine Verschlüsselung der lokalen Daten.** IndexedDB ist unverschlüsselt.
  Wer das entsperrte Gerät oder Browserprofil nutzt, kann die Einträge lesen.
  In der Erklärung steht der Hinweis auf die Gerätesperre. Eine App-Sperre
  (PIN) wäre eine mögliche Erweiterung.
- **„Alle Einträge löschen“** unter „Mehr“ entfernt Einträge, aber nicht die
  Symptomauswahl mit Belastungswerten und nicht die Einstellungen. Vollständig
  löschen geht derzeit nur über die Websitedaten des Browsers; so steht es
  auch in der Erklärung. Ein Knopf „Wirklich alles löschen“ wäre sinnvoll.
- **Keine Content-Security-Policy.** Sie würde zusätzlich technisch
  erzwingen, dass nur die genannten Adressen erreichbar sind. Sie braucht bei
  Next.js etwas Abstimmung und ist als eigener Schritt sinnvoll.
- **Spam-Schutz Feedback:** nur ein Honeypot-Feld und eine Längenbegrenzung,
  kein Ratenlimit. Ein Ratenlimit bräuchte die Verarbeitung von IP-Adressen
  oder einen Zusatzdienst – bewusst abgewogen und weggelassen.
- **Exportdatei:** unverschlüsseltes JSON. Der Hinweis steht am Knopf.
