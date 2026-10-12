"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useLiveQuery } from "dexie-react-hooks";

import { AppHeader } from "@/components/app-header";
import { Icon } from "@/components/icon";
import { db, type Symptom } from "@/lib/db";
import { playTick } from "@/lib/sound";
import {
  CATALOG_REVIEWED,
  CATEGORIES,
  GENERAL_DOCTOR_HINT,
  KIND_LABELS,
  SOURCES,
  STRENGTH_LABELS,
  SYMPTOM_CATALOG,
  catalogById,
  type Measure,
  type MeasureKind,
  type Strength,
} from "@/lib/symptom-catalog";
import {
  CUSTOM_SYMPTOM_ICON,
  deleteCustomSymptom,
  renameCustomSymptom,
  setSymptomActive,
  setSymptomBurden,
} from "@/lib/symptoms";
import { cn } from "@/lib/utils";

const KIND_ORDER: MeasureKind[] = ["selbst", "therapie", "arzt"];

const KIND_ICONS: Record<MeasureKind, string> = {
  selbst: "self_improvement",
  therapie: "groups",
  arzt: "stethoscope",
};

const STRENGTH_STYLES: Record<Strength, string> = {
  soll: "border-primary/40 bg-primary/15 text-primary",
  sollte: "border-secondary/40 bg-secondary/10 text-secondary",
  kann: "border-outline-variant bg-surface-container-highest text-on-surface-variant",
  info: "border-outline-variant bg-surface-container-highest text-on-surface-variant",
};

const BURDEN_WORDS: [number, string][] = [
  [2, "kaum belastend"],
  [4, "etwas belastend"],
  [6, "spürbar belastend"],
  [8, "stark belastend"],
  [10, "extrem belastend"],
];

const burdenWord = (value: number) =>
  BURDEN_WORDS.find(([max]) => value <= max)?.[1] ?? "";

function formatDate(iso: string) {
  const [year, month, day] = iso.split("-");
  return `${day}.${month}.${year}`;
}

function SectionTitle({ icon, children }: { icon: string; children: React.ReactNode }) {
  return (
    <h2 className="flex items-center gap-1.5 text-label-sm font-semibold uppercase tracking-wider text-primary">
      <Icon name={icon} className="text-[16px]" />
      {children}
    </h2>
  );
}

function MeasureItem({ measure }: { measure: Measure }) {
  const strength = STRENGTH_LABELS[measure.strength];
  return (
    <li className="space-y-2 rounded-xl bg-surface-container p-space-sm shadow-sm">
      <p className="text-body-md text-on-surface">{measure.text}</p>
      <div className="flex flex-wrap items-center gap-2">
        <span
          title={strength.hint}
          className={cn(
            "rounded-full border px-2 py-0.5 text-label-sm",
            STRENGTH_STYLES[measure.strength],
          )}
        >
          {strength.label}
        </span>
        <span className="text-label-sm text-on-surface-variant">
          {measure.source === "dgn" ? "DGN-Leitlinie" : "DMSG"}
          {measure.ref ? `, ${measure.ref}` : ""}
        </span>
      </div>
    </li>
  );
}

function ActiveToggle({ id, active }: { id: string; active: boolean }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={active}
      onClick={() => {
        playTick();
        void setSymptomActive(id, !active);
      }}
      className="flex min-h-[64px] w-full items-center justify-between rounded-xl border border-outline-variant/30 bg-surface-container p-4 text-left shadow-sm"
    >
      <div className="min-w-0">
        <div className="text-label-lg text-on-surface">Betrifft mich</div>
        <div className="text-body-sm text-on-surface-variant">
          {active ? "Wird beim Erfassen angeboten" : "Nicht in deiner Auswahl"}
        </div>
      </div>
      <span
        className={cn(
          "ml-2 flex h-7 w-12 shrink-0 items-center rounded-full p-1 transition-colors",
          active ? "bg-primary-container" : "bg-surface-container-highest",
        )}
      >
        <span
          className={cn(
            "h-5 w-5 rounded-full transition-transform",
            active ? "translate-x-5 bg-on-primary" : "bg-outline",
          )}
        />
      </span>
    </button>
  );
}

function BurdenSection({ id, burden }: { id: string; burden: number | undefined }) {
  return (
    <section className="space-y-space-sm">
      <SectionTitle icon="speed">Wie sehr belastet es dich?</SectionTitle>
      <div className="space-y-space-sm rounded-xl bg-surface-container p-space-md shadow-sm">
        <div className="flex items-baseline justify-between gap-2">
          <span className="text-headline-md text-on-surface">
            {burden === undefined ? "Noch nicht bewertet" : `${burden} von 10`}
          </span>
          {burden !== undefined && (
            <span className="text-label-md text-on-surface-variant">
              {burdenWord(burden)}
            </span>
          )}
        </div>
        <div
          role="radiogroup"
          aria-label="Belastung von 1 bis 10"
          className="grid grid-cols-5 gap-2"
        >
          {Array.from({ length: 10 }, (_, index) => index + 1).map((value) => (
            <button
              key={value}
              type="button"
              role="radio"
              aria-checked={burden === value}
              aria-label={`${value} – ${burdenWord(value)}`}
              onClick={() => {
                playTick();
                void setSymptomBurden(id, value);
              }}
              className={cn(
                "flex min-h-touch items-center justify-center rounded-xl text-label-lg transition-colors",
                burden === value
                  ? "border border-primary/50 bg-primary-container text-on-primary-fixed"
                  : "border border-outline-variant/40 bg-surface-container-low text-on-surface",
              )}
            >
              {value}
            </button>
          ))}
        </div>
        <div className="flex items-center justify-between text-label-sm text-on-surface-variant">
          <span>1 = kaum</span>
          <span>10 = extrem</span>
        </div>
        {burden !== undefined && (
          <button
            type="button"
            onClick={() => void setSymptomBurden(id, undefined)}
            className="min-h-[44px] text-label-md text-on-surface-variant underline-offset-4 hover:underline"
          >
            Bewertung entfernen
          </button>
        )}
        <p className="text-body-sm text-on-surface-variant">
          Deine persönliche Einschätzung, kein medizinischer Messwert.
        </p>
      </div>
    </section>
  );
}

/** Ansicht für ein eigenes Symptom: bewerten, umbenennen, löschen. */
function CustomSymptomDetail({ symptom }: { symptom: Symptom }) {
  const router = useRouter();
  const [name, setName] = useState(symptom.name);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const entryCount = useLiveQuery(
    () => db.symptomEntries.where("symptomId").equals(symptom.id).count(),
    [symptom.id],
  );

  const trimmed = name.trim();
  const canRename = trimmed.length > 0 && trimmed !== symptom.name;

  async function handleDelete() {
    await deleteCustomSymptom(symptom.id);
    router.replace("/symptome");
  }

  return (
    <>
      <AppHeader title={symptom.name} back />
      <main className="pb-safe mx-auto flex w-full max-w-xl flex-1 flex-col pt-16">
        <div className="flex w-full flex-col gap-space-lg px-margin pb-space-xl pt-space-md">
          <div className="flex items-start gap-space-sm">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary-container/20 text-primary">
              <Icon name={symptom.icon ?? CUSTOM_SYMPTOM_ICON} className="text-[26px]" />
            </div>
            <p className="text-body-lg text-on-surface">
              Ein eigenes Symptom in deinen Worten. Dazu gibt es keine Beschreibung aus dem
              Katalog.
            </p>
          </div>

          <ActiveToggle id={symptom.id} active={symptom.active} />

          <BurdenSection id={symptom.id} burden={symptom.burden} />

          <section className="space-y-space-sm">
            <SectionTitle icon="edit">Name</SectionTitle>
            <form
              onSubmit={(event) => {
                event.preventDefault();
                if (canRename) void renameCustomSymptom(symptom.id, trimmed);
              }}
              className="flex items-center gap-2"
            >
              <label className="min-w-0 flex-1">
                <span className="sr-only">Name des Symptoms</span>
                <input
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  maxLength={60}
                  className="min-h-[52px] w-full rounded-xl border border-outline-variant/40 bg-surface-container px-3 text-body-md text-on-surface focus:border-primary focus:outline-none"
                />
              </label>
              <button
                type="submit"
                disabled={!canRename}
                className="min-h-[52px] shrink-0 rounded-xl bg-primary-container px-4 text-label-lg text-on-primary-container disabled:opacity-40"
              >
                Speichern
              </button>
            </form>
          </section>

          <section className="space-y-space-sm">
            <SectionTitle icon="delete">Löschen</SectionTitle>
            <div className="space-y-space-sm rounded-xl border border-outline-variant/30 bg-surface-container p-space-md shadow-sm">
              <p className="text-body-sm leading-relaxed text-on-surface-variant">
                {entryCount
                  ? entryCount === 1
                    ? "Zu diesem Symptom gibt es 1 Eintrag im Verlauf. Er wird mitgelöscht."
                    : `Zu diesem Symptom gibt es ${entryCount} Einträge im Verlauf. Sie werden mitgelöscht.`
                  : "Zu diesem Symptom gibt es noch keine Einträge."}{" "}
                Das lässt sich nicht rückgängig machen. Wenn du es nur nicht mehr beobachten
                möchtest, schalte oben „Betrifft mich“ aus.
              </p>
              {confirmDelete ? (
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setConfirmDelete(false)}
                    className="min-h-[52px] flex-1 rounded-xl border border-outline-variant/30 bg-surface-container-high text-label-lg text-on-surface"
                  >
                    Abbrechen
                  </button>
                  <button
                    type="button"
                    onClick={handleDelete}
                    className="min-h-[52px] flex-1 rounded-xl bg-error-container text-label-lg font-bold text-on-error-container"
                  >
                    Wirklich löschen
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setConfirmDelete(true)}
                  className="flex min-h-[52px] w-full items-center justify-center gap-2 rounded-xl border border-error/30 bg-surface-container-high text-label-lg text-error"
                >
                  Symptom löschen …
                </button>
              )}
            </div>
          </section>
        </div>
      </main>
    </>
  );
}

// Das Symptom steht im Hash (#fatigue), nicht im Pfad: Der Hash wird nie an
// den Server gesendet. So taucht in keinem Server-Log auf, welches Symptom
// sich jemand ansieht.
function subscribeToHash(onChange: () => void) {
  window.addEventListener("hashchange", onChange);
  return () => window.removeEventListener("hashchange", onChange);
}

function readHash(): string {
  const raw = window.location.hash.slice(1);
  try {
    return decodeURIComponent(raw);
  } catch {
    return raw;
  }
}

export default function SymptomDetailPage() {
  const id = useSyncExternalStore(subscribeToHash, readHash, () => null);
  const symptom = id ? catalogById.get(id) : undefined;
  // `null` heißt "geladen, aber nicht gespeichert" – im Unterschied zu
  // `undefined`, solange die Abfrage noch läuft.
  const result = useLiveQuery(
    async () => (id ? ((await db.symptoms.get(id)) ?? null) : null),
    [id],
  );
  const loaded = result !== undefined;
  const stored = result ?? undefined;

  // Beim Wechsel zu einem verwandten Symptom wieder oben beginnen.
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  // Auf dem Server und beim ersten Rendern ist der Hash noch unbekannt.
  if (id === null) return <AppHeader title="Symptom" back />;

  if (!symptom) {
    if (stored?.isCustom) return <CustomSymptomDetail key={stored.id} symptom={stored} />;
    // Solange die Datenbank noch lädt, nichts Falsches behaupten.
    if (!loaded) return <AppHeader title="Symptom" back />;
    return (
      <>
        <AppHeader title="Symptom" back />
        <main className="mx-auto flex w-full max-w-xl flex-1 flex-col px-margin pt-24">
          <p className="text-body-md text-on-surface-variant">
            Dieses Symptom gibt es nicht (mehr).
          </p>
          <Link href="/symptome" className="mt-space-md text-label-lg text-primary">
            Zum Symptomkatalog
          </Link>
        </main>
      </>
    );
  }

  const active = stored?.active ?? false;
  const category = CATEGORIES.find((item) => item.id === symptom.category);
  const related = SYMPTOM_CATALOG.filter(
    (item) => item.category === symptom.category && item.id !== symptom.id,
  );
  const burden = stored?.burden;

  return (
    <>
      <AppHeader title={symptom.name} back />
      <main className="pb-safe mx-auto flex w-full max-w-xl flex-1 flex-col pt-16">
        <div className="flex w-full flex-col gap-space-lg px-margin pb-space-xl pt-space-md">
          <div className="flex items-start gap-space-sm">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary-container/20 text-primary">
              <Icon name={symptom.icon} className="text-[26px]" />
            </div>
            <p className="text-body-lg text-on-surface">{symptom.short}</p>
          </div>

          <ActiveToggle id={symptom.id} active={active} />

          <BurdenSection id={symptom.id} burden={burden} />

          <section className="space-y-space-sm">
            <SectionTitle icon="forum">So kann es sich anfühlen</SectionTitle>
            <ul className="space-y-2">
              {symptom.examples.map((example) => (
                <li
                  key={example}
                  className="rounded-xl bg-surface-container-low p-space-sm text-body-md text-on-surface"
                >
                  {example}
                </li>
              ))}
            </ul>
          </section>

          {symptom.amplifiers && (
            <section className="space-y-space-sm">
              <SectionTitle icon="trending_up">Was es verstärken kann</SectionTitle>
              <ul className="flex flex-wrap gap-2">
                {symptom.amplifiers.map((item) => (
                  <li
                    key={item}
                    className="rounded-full border border-outline-variant/40 bg-surface-container-low px-3 py-1.5 text-label-md text-on-surface"
                  >
                    {item}
                  </li>
                ))}
              </ul>
              <p className="text-body-sm text-on-surface-variant">
                Mögliche Zusammenhänge aus der Leitlinie. Ob sie bei dir zutreffen, zeigt
                nur deine eigene Beobachtung.
              </p>
            </section>
          )}

          <section className="space-y-space-md">
            <SectionTitle icon="volunteer_activism">Was helfen kann</SectionTitle>
            {KIND_ORDER.map((kind) => {
              const items = symptom.measures.filter((measure) => measure.kind === kind);
              if (items.length === 0) return null;
              return (
                <div key={kind} className="space-y-2">
                  <h3 className="flex items-center gap-2 text-label-lg text-on-surface">
                    <Icon name={KIND_ICONS[kind]} className="text-[20px] text-secondary" />
                    {KIND_LABELS[kind]}
                  </h3>
                  <ul className="space-y-2">
                    {items.map((measure) => (
                      <MeasureItem key={measure.text} measure={measure} />
                    ))}
                  </ul>
                </div>
              );
            })}
            <p className="text-body-sm text-on-surface-variant">
              Die Angaben geben wieder, was Leitlinie und Fachgesellschaft empfehlen. Die
              Empfehlungsstärke sagt, wie nachdrücklich Fachleute etwas empfehlen – nicht,
              wie gut es bei dir wirkt. Was zu dir passt, klärst du am besten mit deinem
              Behandlungsteam.
            </p>
          </section>

          <section className="space-y-space-sm">
            <SectionTitle icon="stethoscope">Wann ärztlich abklären</SectionTitle>
            <div className="space-y-space-sm rounded-xl border border-outline-variant/30 bg-surface-container-low p-space-md">
              {symptom.doctor && (
                <p className="text-body-md text-on-surface">{symptom.doctor}</p>
              )}
              <p className="text-body-sm text-on-surface-variant">{GENERAL_DOCTOR_HINT}</p>
            </div>
          </section>

          {related.length > 0 && (
            <section className="space-y-space-sm">
              <SectionTitle icon="hub">Verwandte Symptome</SectionTitle>
              <p className="text-body-sm text-on-surface-variant">
                Aus dem Bereich „{category?.name}“. Vielleicht erkennst du dort etwas wieder.
              </p>
              <ul className="space-y-2">
                {related.map((item) => (
                  <li key={item.id}>
                    {/* Normaler Anker statt Link: Nur so meldet der Browser den Hash-Wechsel. */}
                    <a
                      href={`#${item.id}`}
                      className="flex min-h-touch-lg items-center gap-3 rounded-xl bg-surface-container-low p-space-sm transition-colors active:bg-surface-container-high"
                    >
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-surface-variant text-on-surface-variant">
                        <Icon name={item.icon} className="text-[22px]" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="text-label-lg text-on-surface">{item.name}</div>
                        <p className="line-clamp-1 text-body-sm text-on-surface-variant">
                          {item.short}
                        </p>
                      </div>
                      <Icon name="chevron_right" className="text-[22px] text-outline-variant" />
                    </a>
                  </li>
                ))}
              </ul>
            </section>
          )}

          <section className="space-y-space-sm">
            <SectionTitle icon="menu_book">Quellen</SectionTitle>
            <ul className="space-y-2">
              {symptom.sources.map((sourceId) => {
                const source = SOURCES[sourceId];
                return (
                  <li key={sourceId}>
                    <a
                      href={source.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex min-h-touch items-center gap-3 rounded-xl bg-surface-container-low p-space-sm"
                    >
                      <div className="min-w-0 flex-1">
                        <div className="text-label-md text-on-surface">{source.title}</div>
                        <div className="text-body-sm text-on-surface-variant">
                          {source.detail}
                        </div>
                      </div>
                      <Icon name="open_in_new" className="text-[20px] text-outline" />
                    </a>
                  </li>
                );
              })}
            </ul>
            <p className="text-body-sm text-on-surface-variant">
              Inhalte zuletzt geprüft am {formatDate(CATALOG_REVIEWED)}. Ein Link öffnet die
              Seite des jeweiligen Anbieters.
            </p>
          </section>

          <div className="flex items-start gap-space-sm rounded-2xl bg-surface-container-low p-space-md shadow-sm">
            <Icon name="info" className="mt-0.5 text-[20px] text-secondary" />
            <p className="text-body-sm leading-relaxed text-on-surface-variant">
              MS Akku stellt keine Diagnosen und ersetzt keine ärztliche Beratung. Ändere
              Medikamente nie ohne Rücksprache.
            </p>
          </div>
        </div>
      </main>
    </>
  );
}
