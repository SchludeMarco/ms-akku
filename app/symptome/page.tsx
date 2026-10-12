"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useLiveQuery } from "dexie-react-hooks";

import { AppHeader } from "@/components/app-header";
import { Icon } from "@/components/icon";
import { db, newId } from "@/lib/db";
import { playTick } from "@/lib/sound";
import { CATEGORIES, SYMPTOM_CATALOG, type CatalogSymptom } from "@/lib/symptom-catalog";
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

  function renderRow(symptom: CatalogSymptom, reason?: SearchHit["reason"]) {
    const entry = storedById.get(symptom.id);
    const active = entry?.active ?? false;
    return (
      <li key={symptom.id} className="flex items-stretch gap-2">
        <button
          type="button"
          role="checkbox"
          aria-checked={active}
          aria-label={`${symptom.name} beobachten`}
          onClick={() => {
            playTick();
            void setSymptomActive(symptom.id, !active);
          }}
          className="flex w-14 shrink-0 items-center justify-center rounded-xl bg-surface-container-low transition-colors active:bg-surface-container-high"
        >
          <span
            className={cn(
              "flex h-7 w-7 items-center justify-center rounded-lg",
              active
                ? "bg-primary-container text-on-primary-container"
                : "border border-outline-variant bg-surface-container-highest text-transparent",
            )}
          >
            <Icon name="check" className="text-[18px]" />
          </span>
        </button>
        <Link
          href={`/symptome/detail#${symptom.id}`}
          className={cn(
            "flex min-h-[72px] min-w-0 flex-1 items-center gap-3 rounded-xl p-space-sm shadow-sm transition-colors active:bg-surface-container-highest",
            active ? "bg-surface-container-high" : "bg-surface-container-low",
          )}
        >
          <div
            className={cn(
              "flex h-10 w-10 shrink-0 items-center justify-center rounded-lg",
              active ? "bg-primary-container/20 text-primary" : "bg-surface-variant text-on-surface-variant",
            )}
          >
            <Icon name={symptom.icon} className="text-[22px]" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
              <span className="min-w-0 hyphens-auto break-words text-label-lg leading-tight text-on-surface">
                {symptom.name}
              </span>
              {entry?.burden !== undefined && (
                <span className="shrink-0 rounded-full border border-primary/40 bg-primary/15 px-2 py-0.5 text-label-sm text-primary">
                  Belastung {entry.burden}/10
                </span>
              )}
            </div>
            <p className="line-clamp-2 text-body-sm text-on-surface-variant">{symptom.short}</p>
            {reason && (
              <p className="mt-1 line-clamp-2 text-label-sm text-primary">
                {reason.label}: {reason.text}
              </p>
            )}
          </div>
          <Icon name="chevron_right" className="text-[22px] text-outline-variant" />
        </Link>
      </li>
    );
  }

  return (
    <>
      <AppHeader title="Symptomkatalog" back />
      <main className="pb-safe mx-auto flex w-full max-w-xl flex-1 flex-col pt-16">
        <div className="flex w-full flex-col gap-space-md px-margin pb-space-xl pt-space-md">
          <p className="text-body-md text-on-surface-variant">
            Hake ab, was du beobachten möchtest. Tippe auf ein Symptom für Beschreibung,
            Belastung und Hilfen. Die Suche versteht auch Alltagsworte und Tippfehler.
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
              <ul className="space-y-2">
                {hits.map((hit) => renderRow(hit.symptom, hit.reason))}
              </ul>
            </section>
          )}

          {CATEGORIES.map((category) => {
            if (searching) return null;
            const items = SYMPTOM_CATALOG.filter((symptom) => symptom.category === category.id);
            if (items.length === 0) return null;
            return (
              <section key={category.id} className="space-y-2">
                <h2 className="flex items-center gap-1.5 text-label-sm font-semibold uppercase tracking-wider text-primary">
                  <Icon name={category.icon} className="text-[16px]" />
                  {category.name}
                </h2>
                <ul className="space-y-2">
                  {items.map((symptom) => renderRow(symptom))}
                </ul>
              </section>
            );
          })}

          {customMatches.length > 0 && (
            <section className="space-y-2">
              <h2 className="flex items-center gap-1.5 text-label-sm font-semibold uppercase tracking-wider text-primary">
                <Icon name={CUSTOM_SYMPTOM_ICON} className="text-[16px]" />
                Eigene Symptome
              </h2>
              <ul className="space-y-2">
                {customMatches.map((symptom) => (
                  <li key={symptom.id}>
                    <button
                      type="button"
                      role="checkbox"
                      aria-checked={symptom.active}
                      onClick={() => {
                        playTick();
                        void setSymptomActive(symptom.id, !symptom.active);
                      }}
                      className={cn(
                        "flex min-h-[64px] w-full items-center gap-3 rounded-xl p-space-sm text-left shadow-sm",
                        symptom.active ? "bg-surface-container-high" : "bg-surface-container-low",
                      )}
                    >
                      <span
                        className={cn(
                          "flex h-7 w-7 shrink-0 items-center justify-center rounded-lg",
                          symptom.active
                            ? "bg-primary-container text-on-primary-container"
                            : "border border-outline-variant bg-surface-container-highest text-transparent",
                        )}
                      >
                        <Icon name="check" className="text-[18px]" />
                      </span>
                      <span className="min-w-0 flex-1 truncate text-label-lg text-on-surface">
                        {symptom.name}
                      </span>
                    </button>
                  </li>
                ))}
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
