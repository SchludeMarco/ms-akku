import type { Metadata } from "next";
import Link from "next/link";

import { LegalPage, LegalSection } from "@/components/legal-page";
import { OPERATOR } from "@/lib/operator";

export const metadata: Metadata = { title: "Impressum – MS Akku" };

export default function ImpressumPage() {
  return (
    <LegalPage title="Impressum">
      <LegalSection title="Angaben gemäß § 5 Digitale-Dienste-Gesetz (DDG)">
        <p>
          <strong>{OPERATOR.name}</strong>
          {OPERATOR.addressLines.map((line) => (
            <span key={line} className="block">
              {line}
            </span>
          ))}
        </p>
      </LegalSection>

      <LegalSection title="Kontakt">
        <p>
          E-Mail: <a href={`mailto:${OPERATOR.email}`}>{OPERATOR.email}</a>
        </p>
      </LegalSection>

      <LegalSection title="Verantwortlich für den Inhalt nach § 18 Abs. 2 MStV">
        <p>{OPERATOR.name} (Kontakt wie oben)</p>
      </LegalSection>

      <LegalSection title="Über MS Akku">
        <p>
          MS Akku ist ein privates, nicht-kommerzielles Projekt ohne Werbung und ohne
          Bezahlfunktionen.
        </p>
      </LegalSection>

      <LegalSection title="Kein Medizinprodukt, keine ärztliche Beratung">
        <p>
          MS Akku ist ein persönliches Tagebuch. Die App stellt keine Diagnosen, bewertet
          keine Symptome medizinisch und entscheidet nicht, ob ein Schub vorliegt. Die
          Hinweise im Symptomkatalog geben Inhalte aus öffentlich zugänglichen Leitlinien
          und von Fachgesellschaften wieder und ersetzen keine ärztliche Untersuchung oder
          Beratung. Bei gesundheitlichen Fragen wende dich an deine Ärztin oder deinen
          Arzt, im Notfall an den Notruf 112.
        </p>
      </LegalSection>

      <LegalSection title="Haftung für Links">
        <p>
          Die App verlinkt auf fremde Webseiten, z. B. auf die Quellen im Symptomkatalog.
          Für deren Inhalte sind ausschließlich die jeweiligen Anbieter verantwortlich.
        </p>
      </LegalSection>

      <p className="text-body-sm text-on-surface-variant">
        Siehe auch die{" "}
        <Link href="/datenschutz" className="text-primary underline underline-offset-4">
          Datenschutzerklärung
        </Link>
        .
      </p>
    </LegalPage>
  );
}
