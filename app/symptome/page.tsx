"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useLiveQuery } from "dexie-react-hooks";

import { AppHeader } from "@/components/app-header";
import { Icon } from "@/components/icon";
import { db, newId } from "@/lib/db";
import { playTick } from "@/lib/sound";
import {
  CATEGORIES,
  SYMPTOM_CATALOG,
  catalogById,
  type CatalogSymptom,
  type CategoryId,
} from "@/lib/symptom-catalog";
import { SEARCH_SUGGESTIONS, searchSymptoms, type SearchHit } from "@/lib/symptom-search";
import { CUSTOM_SYMPTOM_ICON, ensureSymptomsSeeded, setSymptomActive } from "@/lib/symptoms";
import { cn } from "@/lib/utils";

export default function SymptomkatalogPage() {
  useEffect(() => {
    void ensureSymptomsSeeded();
  }, []);

  const stored = useLiveQuery(() => db.symptoms.toArray(), []);
  const [query, setQuery] = useState("");
  const [customName, setCustomName] = useState("");
  const [area, setArea] = useState<CategoryId | "all">("all");
  // Immer nur eine Karte ist aufgeklappt, damit die Liste überschaubar bleibt.
  const [expanded, setExpanded] = useState<string | null>(null);

  async function addCustom(event: React.FormEvent) {
    event.preventDefault();
    const name = customName.trim();
    if (!name) return;
    await db.symptoms.add({
      id: newId(),
      name,
      icon: CUSTOM_SYMPTOM_ICON,
      isCustom: true,
      active: true,
    });
    setCustomName("");
    playTick();
  }

  const storedById = new Map((stored ?? []).map((symptom) => [symptom.id, symptom]));
  const custom = (stored ?? []).filter((symptom) => symptom.isCustom);
  const searching = query.trim().length > 0;
  const hits = searching ? searchSymptoms(query) : [];
  const customMatches = custom.filter((symptom) =>
    symptom.name.toLowerCase().includes(query.trim().toLowerCase()),
  );
  const activeCount = (stored ?? []).filter((symptom) => symptom.active).length;

  function renderRow(
    symptom: Pick<CatalogSymptom, "id" | "name" | "icon" | "short"> & {
      category?: CatalogSymptom["category"];
    },
    reason?: SearchHit["reason"],
  ) {
    const entry = storedById.get(symptom.id);
    const active = entry?.active ?? false;
    const categoryName = CATEGORIES.find((item) => item.id === symptom.category)?.name;
    const open = expanded === symptom.id;
    const details = catalogById.get(symptom.id);
    return (
      <li
        key={symptom.id}
        className={cn(
          "flex flex-col gap-space-sm rounded-2xl border p-4 shadow-sm",
          active
            ? "border-primary/40 bg-surface-container"
            : "border-outline-variant/30 bg-surface-container-low",
        )}
      >
        <button
          type="button"
          aria-expanded={open}
          aria-controls={`symptom-${symptom.id}`}
          onClick={() => setExpanded(open ? null : symptom.id)}
          className="-m-2 flex items-start gap-3 rounded-xl p-2 text-left"
        >
          <div
            className={cn(
              "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl",
              active
                ? "bg-primary-container/20 text-primary"
                : "bg-surface-variant text-on-surface-variant",
            )}
          >
            <Icon name={symptom.icon} className="text-[22px]" />
          </div>
          <div className="min-w-0 flex-1 space-y-1.5">
            <h3 className="hyphens-auto break-words text-headline-sm text-on-surface">
              {symptom.name}
            </h3>
            <div className="flex flex-wrap gap-2">
              <span className="rounded-full border border-outline-variant/40 bg-surface-container-high px-2.5 py-0.5 text-label-sm text-on-surface-variant">
                {categoryName ?? "Eigenes Symptom"}
              </span>
              {entry?.burden !== undefined && (
                <span className="rounded-full border border-primary/40 bg-primary/15 px-2.5 py-0.5 text-label-sm text-primary">
                  Belastung {entry.burden}/10
                </span>
              )}
            </div>
          </div>
          <Icon
            name={open ? "expand_less" : "expand_more"}
            className="mt-1 text-[26px] text-on-surface-variant"
          />
        </button>
        <p className="text-body-md text-on-surface-variant">{symptom.short}</p>
        {open && (
          <div
            id={`symptom-${symptom.id}`}
            className="flex flex-col gap-space-sm border-t border-outline-variant/30 pt-space-sm"
          >
            {details ? (
              <>
                <div className="space-y-2">
                  <h4 className="text-label-md uppercase tracking-wider text-primary">
                    So kann es sich anfühlen
                  </h4>
                  <ul className="space-y-1.5">
                    {details.examples.map((example) => (
                      <li
                        key={example}
                        className="rounded-xl bg-surface-container-high/60 px-3 py-2 text-body-md text-on-surface"
                      >
                        {example}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="space-y-2">
                  <h4 className="text-label-md uppercase tracking-wider text-primary">
                    Was helfen kann
                  </h4>
                  <ul className="space-y-1.5">
                    {details.measures.slice(0, 3).map((measure) => (
                      <li
                        key={measure.text}
                        className="flex items-start gap-2 text-body-md text-on-surface"
                      >
                        <Icon name="check_circle" className="mt-0.5 text-[20px] text-secondary" />
                        <span>{measure.text}</span>
                      </li>
                    ))}
                  </ul>
                  <p className="text-body-sm text-on-surface-variant">
                    Aus Leitlinie und Fachgesellschaft, keine persönliche Empfehlung. Quellen
                    und alle Hilfen stehen in der vollständigen Ansicht.
                  </p>
                </div>
              </>
            ) : (
              <p className="text-body-md text-on-surface-variant">
                Zu einem eigenen Symptom gibt es keine Beschreibung aus dem Katalog. In der
                vollständigen Ansicht kannst du es bewerten, umbenennen oder löschen.
              </p>
            )}
          </div>
        )}
        {reason && (
          <p className="text-label-md text-primary">
            Passt zu: {reason.text}
          </p>
        )}
        <div className="flex flex-col gap-2 min-[400px]:flex-row">
          <button
            type="button"
            role="checkbox"
            aria-checked={active}
            aria-label={`${symptom.name} beobachten`}
            onClick={() => {
              playTick();
              void setSymptomActive(symptom.id, !active);
            }}
            className={cn(
              "flex min-h-[52px] flex-1 items-center justify-center gap-2 rounded-xl border px-3 text-label-lg transition-colors",
              active
                ? "border-primary/50 bg-primary-container font-semibold text-on-primary-fixed"
                : "border-outline-variant/40 bg-surface-container-high text-on-surface",
            )}
          >
            <Icon
              name={active ? "check_box" : "check_box_outline_blank"}
              className="text-[22px]"
            />
            {active ? "Wird beobachtet" : "Beobachten"}
          </button>
          <Link
            href={`/symptome/detail#${symptom.id}`}
            className="flex min-h-[52px] flex-1 items-center justify-between gap-2 rounded-xl bg-surface-container-high px-4 text-label-lg text-on-surface transition-colors active:bg-surface-container-highest"
          >
            {open ? "Vollständige Ansicht" : "Details & Hilfen"}
            <Icon name="arrow_forward" className="text-[20px] text-secondary" />
          </Link>
        </div>
      </li>
    );
  }

  return (
    <>
      <AppHeader title="Symptombibliothek" back />
      <main className="pb-safe mx-auto flex w-full max-w-xl flex-1 flex-col pt-16">
        <div className="flex w-full flex-col gap-space-md px-margin pb-space-xl pt-space-md">
          <p className="text-body-md text-on-surface-variant">
Tippe auf ein Symptom, um es aufzuklappen. Hake ab, was du beobachten möchtest.
            Die Suche versteht auch Alltagsworte und Tippfehler.
          </p>

          <label className="relative block">
            <span className="sr-only">Symptome durchsuchen</span>
            <Icon
              name="search"
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[22px] text-outline"
            />
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Beschreib es in deinen Worten"
              className="min-h-[52px] w-full rounded-xl border border-outline-variant/40 bg-surface-container pl-11 pr-3 text-body-md text-on-surface placeholder:text-outline focus:border-primary focus:outline-none"
            />
          </label>

          <div className="flex items-center gap-1.5 text-on-surface-variant" aria-live="polite">
            <Icon name="checklist" className="text-[18px] text-primary" />
            <span className="text-label-md">
              {activeCount === 1 ? "1 Symptom wird beobachtet" : `${activeCount} Symptome werden beobachtet`}
            </span>
          </div>

          {!searching && (
            <div className="space-y-2">
              <span className="text-label-sm text-on-surface-variant">Zum Stöbern:</span>
              <div className="flex flex-wrap gap-2">
                {SEARCH_SUGGESTIONS.map((suggestion) => (
                  <button
                    key={suggestion}
                    type="button"
                    onClick={() => setQuery(suggestion)}
                    className="min-h-[44px] rounded-full border border-outline-variant/40 bg-surface-container-low px-4 text-label-md text-on-surface transition-colors active:bg-surface-container-high"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          )}

          {searching && hits.length > 0 && (
            <section className="space-y-2" aria-live="polite">
              <h2 className="flex items-center gap-1.5 text-label-sm font-semibold uppercase tracking-wider text-primary">
                <Icon name="search" className="text-[16px]" />
                {hits.length === 1 ? "1 Treffer" : `${hits.length} Treffer`}, beste zuerst
              </h2>
              <ul className="space-y-space-sm">
                {hits.map((hit) => renderRow(hit.symptom, hit.reason))}
              </ul>
            </section>
          )}

          {!searching && (
            <>
              <div className="space-y-2">
                <span className="text-label-md text-on-surface-variant">Bereich auswählen:</span>
                <div role="radiogroup" aria-label="Bereich" className="flex flex-wrap gap-2">
                  {[{ id: "all" as const, name: `Alle (${SYMPTOM_CATALOG.length})` }, ...CATEGORIES].map(
                    (category) => {
                      const on = area === category.id;
                      return (
                        <button
                          key={category.id}
                          type="button"
                          role="radio"
                          aria-checked={on}
                          onClick={() => setArea(category.id)}
                          className={cn(
                            "min-h-[48px] rounded-full border px-4 text-label-md transition-colors",
                            on
                              ? "border-primary/50 bg-primary-container font-semibold text-on-primary-fixed"
                              : "border-outline-variant/40 bg-surface-container-low text-on-surface",
                          )}
                        >
                          {category.name}
                        </button>
                      );
                    },
                  )}
                </div>
              </div>
              <ul className="space-y-space-sm">
                {SYMPTOM_CATALOG.filter(
                  (symptom) => area === "all" || symptom.category === area,
                ).map((symptom) => renderRow(symptom))}
              </ul>
            </>
          )}

          {customMatches.length > 0 && (
            <section className="space-y-2">
              <h2 className="flex items-center gap-1.5 text-label-sm font-semibold uppercase tracking-wider text-primary">
                <Icon name={CUSTOM_SYMPTOM_ICON} className="text-[16px]" />
                Eigene Symptome
              </h2>
              <ul className="space-y-2">
                {customMatches.map((symptom) =>
                  renderRow({
                    id: symptom.id,
                    name: symptom.name,
                    icon: symptom.icon ?? CUSTOM_SYMPTOM_ICON,
                    short: "Eigenes Symptom – tippen zum Bewerten, Umbenennen oder Löschen",
                  }),
                )}
              </ul>
            </section>
          )}

          {searching && hits.length === 0 && customMatches.length === 0 && (
            <div className="rounded-xl bg-surface-container-low p-space-md text-body-sm text-on-surface-variant">
              Dazu steht nichts im Katalog. Versuch ein anderes Wort oder leg unten ein
              eigenes Symptom in deinen Worten an.
            </div>
          )}

          <form
            onSubmit={addCustom}
            className="flex items-center gap-2 rounded-2xl bg-surface-container-low p-space-sm shadow-sm"
          >
            <label className="min-w-0 flex-1">
              <span className="sr-only">Eigenes Symptom in deinen Worten</span>
              <input
                value={customName}
                onChange={(event) => setCustomName(event.target.value)}
                placeholder="Eigenes Symptom, z. B. Beine wie Beton"
                maxLength={60}
                className="min-h-[48px] w-full rounded-lg border border-outline-variant/40 bg-surface-container px-3 text-body-md text-on-surface placeholder:text-outline focus:border-primary focus:outline-none"
              />
            </label>
            <button
              type="submit"
              disabled={!customName.trim()}
              aria-label="Eigenes Symptom hinzufügen"
              className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary-container text-on-primary-container disabled:opacity-40"
            >
              <Icon name="add" className="text-[22px]" />
            </button>
          </form>

          <div className="flex items-start gap-space-sm rounded-2xl bg-surface-container-low p-space-md shadow-sm">
            <Icon name="info" className="mt-0.5 text-[20px] text-secondary" />
            <p className="text-body-sm leading-relaxed text-on-surface-variant">
              Der Katalog hilft beim Einordnen und ersetzt keine ärztliche Untersuchung. MS
              Akku stellt keine Diagnosen.
            </p>
          </div>
        </div>
      </main>
    </>
  );
}
