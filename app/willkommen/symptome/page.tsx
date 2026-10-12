"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useLiveQuery } from "dexie-react-hooks";

import { AppHeader } from "@/components/app-header";
import { Icon } from "@/components/icon";
import { db, newId, type Symptom } from "@/lib/db";
import { playSuccess, playTick } from "@/lib/sound";
import { useSettingsStore } from "@/lib/stores/settings-store";
import {
  CUSTOM_SYMPTOM_ICON,
  DEFAULT_SYMPTOMS,
  ensureSymptomsSeeded,
} from "@/lib/symptoms";
import { cn } from "@/lib/utils";

export default function SymptomePage() {
  const router = useRouter();
  const completeOnboarding = useSettingsStore((state) => state.completeOnboarding);

  const stored = useLiveQuery(() => db.symptoms.toArray(), []);

  // Nur die Abweichungen vom gespeicherten Stand; gesichert wird erst mit "Weiter".
  const [overrides, setOverrides] = useState<Record<string, boolean>>({});
  const [added, setAdded] = useState<Symptom[]>([]);
  const [customOpen, setCustomOpen] = useState(false);
  const [customName, setCustomName] = useState("");

  const storedById = new Map((stored ?? []).map((symptom) => [symptom.id, symptom]));
  const catalog: Symptom[] = [
    ...DEFAULT_SYMPTOMS.map((symptom) => storedById.get(symptom.id) ?? symptom),
    ...(stored ?? []).filter((symptom) => symptom.isCustom),
    ...added,
  ];
  const isActive = (symptom: Symptom) => overrides[symptom.id] ?? symptom.active;

  function addCustom(event: React.FormEvent) {
    event.preventDefault();
    const name = customName.trim();
    if (!name) return;
    setAdded((current) => [
      ...current,
      { id: newId(), name, icon: CUSTOM_SYMPTOM_ICON, isCustom: true, active: true },
    ]);
    setCustomName("");
    setCustomOpen(false);
    playTick();
  }

  async function finish(saveSelection: boolean) {
    if (saveSelection) {
      await db.symptoms.bulkPut(
        catalog.map((symptom) => ({ ...symptom, active: isActive(symptom) })),
      );
      playSuccess();
    } else {
      await ensureSymptomsSeeded();
    }
    completeOnboarding();
    router.replace("/");
  }

  return (
    <>
      <AppHeader title="Symptomauswahl" back />
      <main className="pb-safe mx-auto flex w-full max-w-xl flex-1 flex-col pt-16">
        <div className="flex w-full flex-col px-margin pb-space-xl">
          <div className="mb-space-md flex flex-col gap-space-sm pt-space-sm">
            <div className="flex items-center justify-between">
              <div className="inline-flex items-center gap-1.5 rounded-full bg-surface-container-high px-3 py-1 text-primary">
                <Icon name="eco" className="text-[16px]" />
                <span className="text-label-sm font-semibold uppercase tracking-wider">
                  Sanfte Begleitung
                </span>
              </div>
              <span className="text-label-md font-medium text-on-surface-variant">
                Schritt 2 von 2
              </span>
            </div>
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-surface-container-high">
              <div className="h-full w-full rounded-full bg-primary-container shadow-sm shadow-primary/20" />
            </div>
          </div>

          <div className="relative mb-space-md w-full overflow-hidden rounded-2xl bg-surface-container-low shadow-md">
            <div className="relative h-32 w-full bg-gradient-to-br from-primary/25 via-secondary-container/15 to-tertiary/20">
              <Icon
                name="eco"
                filled
                className="absolute -right-2 -top-4 text-[120px] text-primary/15"
              />
              <div className="flex h-full w-full flex-col justify-end bg-gradient-to-t from-surface-container-low via-surface-container-low/40 to-transparent p-space-md">
                <span className="text-label-sm font-semibold uppercase tracking-wider text-primary">
                  Dein persönlicher Akku
                </span>
                <span className="text-headline-sm text-on-surface">
                  Individuelle Beobachtung
                </span>
              </div>
            </div>
          </div>

          <div className="mb-space-lg flex flex-col gap-space-xs">
            <h2 className="text-headline-lg-mobile font-semibold tracking-tight text-on-surface">
              Was möchtest du beobachten?
            </h2>
            <p className="text-body-md text-on-surface-variant">
              Wähle aus, was für deinen Alltag relevant ist. Du kannst jederzeit Symptome
              hinzufügen oder ausblenden.
            </p>
          </div>

          <div
            role="group"
            aria-label="Symptomauswahl"
            className="mb-space-md grid grid-cols-2 gap-space-sm"
          >
            {catalog.map((symptom) => {
              const active = isActive(symptom);
              return (
                <button
                  key={symptom.id}
                  type="button"
                  aria-pressed={active}
                  onClick={() => {
                    playTick();
                    setOverrides((current) => ({ ...current, [symptom.id]: !active }));
                  }}
                  className={cn(
                    "flex min-h-[64px] items-center justify-between rounded-xl p-space-sm text-left text-on-surface shadow-sm transition-all active:scale-[0.98]",
                    active ? "bg-surface-container-high" : "bg-surface-container-low",
                  )}
                >
                  <div className="flex min-w-0 items-center gap-2 pr-1">
                    <div
                      className={cn(
                        "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg",
                        active ? "bg-primary-container/20" : "bg-surface-variant",
                      )}
                    >
                      <Icon
                        name={symptom.icon ?? CUSTOM_SYMPTOM_ICON}
                        className={cn(
                          "text-[20px]",
                          active ? "text-primary" : "text-on-surface-variant",
                        )}
                      />
                    </div>
                    <span className="min-w-0 hyphens-auto break-words text-label-md font-semibold leading-tight text-on-surface">
                      {symptom.name}
                    </span>
                  </div>
                  <div
                    className={cn(
                      "flex h-7 w-7 shrink-0 items-center justify-center rounded-lg",
                      active
                        ? "bg-primary-container text-on-primary-container"
                        : "bg-surface-container-highest text-transparent",
                    )}
                  >
                    <Icon name="check" className="text-[18px]" />
                  </div>
                </button>
              );
            })}
          </div>

          {customOpen ? (
            <form
              onSubmit={addCustom}
              className="mb-space-md flex items-center gap-2 rounded-2xl border border-primary/40 bg-surface-container-low p-space-sm shadow-sm"
            >
              <input
                autoFocus
                value={customName}
                onChange={(event) => setCustomName(event.target.value)}
                placeholder="z. B. Beine wie Beton"
                className="min-h-[48px] min-w-0 flex-1 rounded-lg border border-outline-variant/40 bg-surface-container px-3 text-body-md text-on-surface placeholder:text-outline focus:border-primary focus:outline-none"
              />
              <button
                type="submit"
                disabled={!customName.trim()}
                aria-label="Eigenes Symptom hinzufügen"
                className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary-container text-on-primary-container disabled:opacity-40"
              >
                <Icon name="check" className="text-[22px]" />
              </button>
            </form>
          ) : (
            <button
              type="button"
              onClick={() => setCustomOpen(true)}
              className="mb-space-md flex min-h-[64px] w-full items-center gap-space-md rounded-2xl bg-surface-container-low p-space-md text-left shadow-sm transition-colors hover:bg-surface-container active:scale-[0.99]"
            >
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-surface-container-highest text-primary">
                <Icon name="add" className="text-[24px]" />
              </div>
              <div className="flex min-w-0 flex-col">
                <span className="truncate text-label-lg font-semibold text-primary">
                  + Eigenes Symptom hinzufügen
                </span>
                <span className="truncate text-body-sm text-on-surface-variant">
                  Verwende deine eigenen Worte – z. B. Beine wie Beton
                </span>
              </div>
            </button>
          )}

          <div className="mb-space-lg flex w-full items-start gap-space-sm rounded-2xl bg-surface-container-low p-space-md shadow-sm">
            <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-secondary-container/20 text-secondary">
              <Icon name="favorite" filled className="text-[18px]" />
            </div>
            <p className="text-body-sm leading-relaxed text-on-surface-variant">
              <strong className="mb-0.5 block text-label-md text-on-surface">Keine Sorge</strong>
              Du musst nichts beobachten, was dich stresst. Weniger ist oft mehr.
            </p>
          </div>

          <div className="flex flex-col items-center gap-space-sm">
            <button
              type="button"
              onClick={() => finish(true)}
              className="flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-primary text-label-lg font-semibold text-on-primary shadow-lg shadow-primary/10 transition-transform active:scale-[0.99] active:opacity-90"
            >
              <span>Weiter zur Tagesübersicht</span>
              <Icon name="arrow_forward" className="text-[20px]" />
            </button>
            <button
              type="button"
              onClick={() => finish(false)}
              className="min-h-[44px] px-space-md py-space-xs text-label-md text-on-surface-variant transition-colors hover:text-on-surface"
            >
              Später auswählen
            </button>
          </div>
        </div>
      </main>
    </>
  );
}
