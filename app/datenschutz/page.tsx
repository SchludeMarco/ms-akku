import type { Metadata } from "next";
import Link from "next/link";

import { LegalPage, LegalSection } from "@/components/legal-page";
import { OPERATOR, PRIVACY_UPDATED } from "@/lib/operator";

export const metadata: Metadata = { title: "Datenschutz – MS Akku" };

// Diese Erklärung beschreibt, was der Code tatsächlich tut. Wer einen
// Datenfluss ändert oder hinzufügt, passt sie im selben Schritt an
// (siehe docs/dsgvo-pruefung.md).

export default function DatenschutzPage() {
  return (
    <LegalPage title="Datenschutz">
      <p className="text-body-sm text-on-surface-variant">Stand: {PRIVACY_UPDATED}</p>

      <LegalSection title="Kurz gesagt">
        <ul>
          <li>Kein Konto, kein Tracking, keine Werbung, keine Analyse-Tools, keine Cookies.</li>
          <li>
            Deine Einträge, Symptome und Einstellungen liegen nur im Browser auf deinem
            Gerät. Der Betreiber kann sie nicht sehen.
          </li>
          <li>
            Die App überträgt deine Einträge nirgendwohin. Du kannst sie selbst als
            Datei auf deinem Gerät speichern.
          </li>
        </ul>
      </LegalSection>

      <LegalSection title="1. Verantwortlicher">
        <p>
          <strong>{OPERATOR.name}</strong>
          {OPERATOR.addressLines.map((line) => (
            <span key={line} className="block">
              {line}
            </span>
          ))}
          <span className="block">
            E-Mail: <a href={`mailto:${OPERATOR.email}`}>{OPERATOR.email}</a>
          </span>
        </p>
      </LegalSection>

      <LegalSection title="2. Hosting und Server-Logfiles">
        <p>
          MS Akku wird bei Vercel Inc., 440 N Barranca Ave #4133, Covina, CA 91723, USA
          gehostet. Beim Aufruf der Seite verarbeitet Vercel technisch notwendige Daten:
          IP-Adresse, Datum und Uhrzeit, aufgerufene Adresse, Browser und Betriebssystem
          sowie die übertragene Datenmenge. Das ist nötig, um die Seite auszuliefern und
          sicher zu betreiben (Art. 6 Abs. 1 lit. f DSGVO). Deine Einträge in der App sind
          nicht Teil dieser Daten. Vercel ist unter dem EU-US Data Privacy Framework
          zertifiziert; außerdem gelten die EU-Standardvertragsklauseln aus dem Data
          Processing Addendum von Vercel.
        </p>
      </LegalSection>

      <LegalSection title="3. Speicherung auf deinem Gerät">
        <p>
          MS Akku speichert alles, was du einträgst, im Speicher deines Browsers
          (IndexedDB und localStorage): Akku-Werte, Symptome mit Belastungsbewertung,
          Symptom-, Aktivitäts- und Schlafeinträge, Notizen sowie Einstellungen wie Ton
          und deine Datenschutz-Entscheidungen. Das sind zum Teil Gesundheitsdaten. Sie
          werden nicht an einen Server übertragen.
        </p>
        <p>
          Damit MS Akku auch ohne Internet startet, legt dein Browser außerdem eine Kopie
          der App selbst (Seiten, Skripte, Schriften, Symbole) auf deinem Gerät ab. Diese
          Kopie enthält keine deiner Einträge.
        </p>
        <p>
          Diese Speicherung ist für die von dir gewünschte Funktion unbedingt
          erforderlich (§ 25 Abs. 2 Nr. 2 TDDDG). Du kannst die Einträge jederzeit unter
          „Mehr“ löschen oder alles entfernen, indem du die Websitedaten in deinem
          Browser löschst. Wer Zugriff auf dein entsperrtes Gerät hat, kann die Daten
          lesen – schütze dein Gerät deshalb mit einer Sperre.
        </p>
      </LegalSection>

      <LegalSection title="4. Schriften und Symbole">
        <p>
          Schriften und Symbole werden vom selben Server wie die App geladen. Dein Browser
          verbindet sich dafür nicht mit Google oder anderen Dritten.
        </p>
      </LegalSection>

      <LegalSection title="5. Export als Datei">
        <p>
          Unter „Sichern und mitnehmen“ kannst du alle Daten als Datei auf deinem Gerät
          speichern und wieder einlesen. Die Datei wird in deinem Browser erzeugt und
          nicht übertragen. Sie enthält Gesundheitsangaben; was du mit ihr machst,
          entscheidest du.
        </p>
      </LegalSection>

      <LegalSection title="6. Links zu anderen Seiten">
        <p>
          Die Symptombibliothek (einschaltbar unter „Mehr“) verlinkt auf Quellen bei
          Fachgesellschaften. Erst wenn du
          einen solchen Link antippst, verbindet sich dein Browser mit der jeweiligen
          Seite. Dann gilt deren Datenschutzerklärung.
        </p>
      </LegalSection>

      <LegalSection title="7. Deine Rechte">
        <p>
          Du hast das Recht auf Auskunft, Berichtigung, Löschung, Einschränkung der
          Verarbeitung, Datenübertragbarkeit und Widerspruch (Art. 15 bis 21 DSGVO) sowie
          das Recht, eine Einwilligung jederzeit zu widerrufen. Da deine Einträge nur auf
          deinem Gerät liegen, kann der Betreiber dazu keine Auskunft geben; du kannst sie
          selbst einsehen, exportieren und löschen.
        </p>
        <p>
          Außerdem kannst du dich bei einer Datenschutz-Aufsichtsbehörde beschweren, zum
          Beispiel beim Landesbeauftragten für den Datenschutz und die
          Informationsfreiheit Baden-Württemberg.
        </p>
      </LegalSection>

      <p className="text-body-sm text-on-surface-variant">
        Siehe auch das{" "}
        <Link href="/impressum" className="text-primary underline underline-offset-4">
          Impressum
        </Link>
        .
      </p>
    </LegalPage>
  );
}
