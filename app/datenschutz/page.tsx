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
            Daten verlassen dein Gerät nur, wenn du es selbst auslöst: beim Export, bei
            der freiwilligen Sicherung in deinem Google Drive oder wenn du Feedback
            sendest.
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
          Unter „Sicherung &amp; Export“ kannst du alle Daten als Datei auf deinem Gerät
          speichern und wieder einlesen. Die Datei wird in deinem Browser erzeugt und
          nicht übertragen. Sie enthält Gesundheitsangaben; was du mit ihr machst,
          entscheidest du.
        </p>
      </LegalSection>

      <LegalSection title="6. Sicherung in deinem Google Drive (freiwillig)">
        <p>
          Wenn der Betreiber diese Funktion aktiviert hat, kannst du eine Sicherung in
          deinem eigenen Google Drive ablegen. Erst nachdem du in der App ausdrücklich
          eingewilligt hast, lädt dein Browser ein Skript von Google (Google Ireland
          Limited, Gordon House, Barrow Street, Dublin 4, Irland) und öffnet auf dein
          Tippen hin das Anmeldefenster von Google. Dabei erfährt Google unter anderem
          deine IP-Adresse und dass du MS Akku nutzt.
        </p>
        <p>
          MS Akku fordert nur Zugriff auf einen verborgenen, app-eigenen Ordner in deinem
          Drive an – nicht auf deinen Namen, deine E-Mail-Adresse oder andere Dateien. In
          diesem Ordner wird eine Datei mit deinen Einträgen gespeichert, also mit
          Gesundheitsdaten. Die Übertragung läuft direkt zwischen deinem Browser und
          Google; der Betreiber von MS Akku erhält die Daten nicht. Google kann Daten
          auch in den USA verarbeiten (Google LLC ist unter dem EU-US Data Privacy
          Framework zertifiziert). Für die Speicherung in deinem Drive gelten die
          Bedingungen deines Google-Kontos.
        </p>
        <p>
          Rechtsgrundlage ist deine ausdrückliche Einwilligung (Art. 6 Abs. 1 lit. a und
          Art. 9 Abs. 2 lit. a DSGVO). Du kannst sie jederzeit widerrufen, indem du den
          Haken unter „Sicherung &amp; Export“ entfernst. Die Sicherung kannst du dort
          auch aus deinem Drive löschen. Gesichert wird nur, wenn du es auslöst; eine
          automatische Synchronisierung gibt es nicht.
        </p>
      </LegalSection>

      <LegalSection title="7. Feedback (freiwillig)">
        <p>
          Wenn du Feedback sendest, werden die gewählte Kategorie, dein Text, der
          gewählte Bereich der App und – falls du sie angibst – deine E-Mail-Adresse an
          den Server von MS Akku übertragen. Einträge aus der App werden nicht
          mitgesendet. Der Server speichert weder deine IP-Adresse noch Angaben zu deinem
          Browser zusammen mit dem Feedback.
        </p>
        <p>
          Das Feedback wird dem Betreiber per E-Mail zugestellt (Versand über den Dienst
          Resend, USA) und ohne E-Mail-Adresse in einem nicht öffentlichen Bereich bei
          GitHub (GitHub, Inc., USA) abgelegt. Dein Feedback wird dabei also in die USA
          übertragen.
        </p>
        <p>
          Rechtsgrundlage ist deine Einwilligung (Art. 6 Abs. 1 lit. a DSGVO; soweit du
          im Text Angaben zu deiner Gesundheit machst, Art. 9 Abs. 2 lit. a DSGVO). Du
          kannst sie jederzeit mit Wirkung für die Zukunft widerrufen und die Löschung
          deines Feedbacks verlangen – eine E-Mail an die oben genannte Adresse genügt.
          Feedback wird gelöscht, sobald es bearbeitet ist und nicht mehr gebraucht
          wird, spätestens nach zwei Jahren.
        </p>
      </LegalSection>

      <LegalSection title="8. Links zu anderen Seiten">
        <p>
          Der Symptomkatalog verlinkt auf Quellen bei Fachgesellschaften. Erst wenn du
          einen solchen Link antippst, verbindet sich dein Browser mit der jeweiligen
          Seite. Dann gilt deren Datenschutzerklärung.
        </p>
      </LegalSection>

      <LegalSection title="9. Deine Rechte">
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
