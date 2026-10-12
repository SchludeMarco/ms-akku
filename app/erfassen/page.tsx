"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useLiveQuery } from "dexie-react-hooks";

import { AppHeader } from "@/components/app-header";
import { Icon } from "@/components/icon";
import { db, newId, type SymptomEntry } from "@/lib/db";
import { ZONE_STATUS, ZONE_STYLES, zoneOf } from "@/lib/energy";
import { playSuccess, playTick } from "@/lib/sound";
import {
  CUSTOM_SYMPTOM_ICON,
  DEFAULT_SYMPTOMS,
  ensureSymptomsSeeded,
} from "@/lib/symptoms";
import { cn } from "@/lib/utils";

type OptionKey = SymptomEntry["changeType"] | "battery" | "good_day";
type Intensity = SymptomEntry["intensity"];
type StartedAt = NonNullable<SymptomEntry["startedAt"]>;

const OPTIONS: {
  key: OptionKey;
  title: string;
  hint: string;
  icon: string;
  iconClass: string;
  filled?: boolean;
}[] = [
  { key: "new", title: "Neues Symptom", hint: "z. B. Taubheitsgefühl, Sehstörung", icon: "add_circle", iconClass: "text-primary" },
  { key: "stronger", title: "Etwas ist stärker", hint: "z. B. Fatigue, Schmerzen, Kribbeln", icon: "trending_up", iconClass: "text-primary" },
  { key: "weaker", title: "Etwas ist schwächer", hint: "Besserung spürbar", icon: "trending_down", iconClass: "text-primary" },
  { key: "disappeared", title: "Etwas ist verschwunden", hint: "Symptom abgeklungen", icon: "check_circle", iconClass: "text-secondary" },
  { key: "battery", title: "Mein Akku hat sich verändert", hint: "Spontane Erschöpfung oder neuer Schwung", icon: "battery_charging_full", iconClass: "text-secondary" },
  { key: "good_day", title: "Besonders guter Tag", hint: "Erfreulicher Zustand & Energie", icon: "wb_sunny", iconClass: "text-tertiary", filled: true },
];

const INTENSITY_LABELS: Partial<
  Record<OptionKey, { question: string; options: Record<Intensity, [string, string]> }>
> = {
  new: {
    question: "Wie stark ist es?",
    options: { leicht: ["Leicht", "spürbar"], deutlich: ["Deutlich", "spürbar"], sehr_stark: ["Sehr", "stark"] },
  },
  stronger: {
    question: "Wie hat es sich verändert?",
    options: { leicht: ["Etwas", "stärker"], deutlich: ["Deutlich", "stärker"], sehr_stark: ["Sehr", "stark"] },
  },
  weaker: {
    question: "Wie hat es sich verändert?",
    options: { leicht: ["Etwas", "schwächer"], deutlich: ["Deutlich", "schwächer"], sehr_stark: ["Fast", "weg"] },
  },
};

const INTENSITIES: Intensity[] = ["leicht", "deutlich", "sehr_stark"];

const BODY_LOCATIONS = ["Rechter Arm", "Linker Arm", "Beine / Füße", "Hände", "Gesicht", "Anderer Bereich"];

const STARTED_AT: { key: StartedAt; label: string }[] = [
  { key: "gerade_eben", label: "Gerade eben" },
  { key: "heute", label: "Heute" },
  { key: "seit_tagen", label: "Seit einigen Tagen" },
  { key: "unbekannt", label: "Weiß ich nicht" },
];

const BATTERY_CHIPS = [20, 40, 60, 80, 100];

const CHIP_BASE =
  "flex min-h-[46px] items-center gap-1.5 text-label-md transition-all";
const CHIP_ON =
  "border border-primary/50 bg-primary-container font-medium text-on-primary-fixed shadow-sm";
const CHIP_OFF =
  "border border-outline-variant/40 bg-surface-container-low text-on-surface hover:bg-surface-container";

export default function ErfassenPage() {
  const router = useRouter();

  useEffect(() => {
    void ensureSymptomsSeeded();
  }, []);

  const symptoms = useLiveQuery(() => db.symptoms.toArray(), []);
  const latestLevel = useLiveQuery(
    () =>
      db.batteryEntries
        .orderBy("timestamp")
        .last()
        .then((entry) => entry?.energyLevel ?? 50),
    [],
  );

  const [selected, setSelected] = useState<OptionKey | null>(null);
  const [symptomId, setSymptomId] = useState<string | null>(null);
  const [customName, setCustomName] = useState("");
  const [intensity, setIntensity] = useState<Intensity>("deutlich");
  const [locations, setLocations] = useState<string[]>([]);
  const [startedAt, setStartedAt] = useState<StartedAt | null>(null);
  const [batteryDraft, setBatteryDraft] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);

  const isSymptomOption =
    selected !== null && selected !== "battery" && selected !== "good_day";
  const batteryLevel = batteryDraft ?? latestLevel ?? 50;
  const iconFor = (id: string) =>
    symptoms?.find((symptom) => symptom.id === id)?.icon ??
    DEFAULT_SYMPTOMS.find((symptom) => symptom.id === id)?.icon ??
    CUSTOM_SYMPTOM_ICON;

  // Bei "Neues Symptom" den ganzen Katalog anbieten, sonst nur die beobachteten.
  const active = symptoms?.filter((symptom) => symptom.active) ?? [];
  const pickable = selected === "new" || active.length === 0 ? (symptoms ?? []) : active;
  const chosen = symptoms?.find((symptom) => symptom.id === symptomId);

  const canSave =
    !saving &&
    selected !== null &&
    (!isSymptomOption || chosen !== undefined || (selected === "new" && customName.trim() !== ""));

  function toggleOption(key: OptionKey) {
    playTick();
    setSelected((current) => (current === key ? null : key));
    setSymptomId(null);
    setCustomName("");
  }

  function leave() {
    if (window.history.length > 1) router.back();
    else router.replace("/");
  }

  async function save(withDetails: boolean) {
    if (!canSave || selected === null) return;
    setSaving(true);
    const timestamp = new Date().toISOString();

    if (selected === "battery") {
      await db.batteryEntries.add({
        id: newId(),
        timestamp,
        energyLevel: batteryLevel,
        createdAt: timestamp,
      });
    } else if (selected === "good_day") {
      await db.moments.add({ id: newId(), timestamp, kind: "good_day" });
    } else {
      let id = chosen?.id;
      if (!id) {
        id = newId();
        await db.symptoms.add({
          id,
          name: customName.trim(),
          icon: CUSTOM_SYMPTOM_ICON,
          isCustom: true,
          active: true,
        });
      }
      await db.symptomEntries.add({
        id: newId(),
        symptomId: id,
        timestamp,
        changeType: selected,
        intensity: selected === "disappeared" ? "leicht" : intensity,
        ...(withDetails && locations.length > 0
          ? { bodyLocation: locations.join(", ") }
          : {}),
        ...(withDetails && startedAt ? { startedAt } : {}),
      });
    }

    playSuccess();
    leave();
  }

  const intensityConfig = selected ? INTENSITY_LABELS[selected] : undefined;

  return (
    <>
      <AppHeader title="Veränderung erfassen" back />
      <main className="pb-safe mx-auto flex w-full max-w-xl flex-1 flex-col pt-16">
        <div className="flex w-full flex-1 flex-col">
          <div className="flex items-center justify-between px-margin pb-2 pt-4">
            <div className="flex items-center gap-1.5">
              <Icon name="speed" filled className="text-[20px] text-primary" />
              <span className="text-label-sm font-semibold uppercase tracking-wider text-primary">
                Schnell-Protokoll
              </span>
            </div>
            <button
              type="button"
              onClick={leave}
              className="flex min-h-[44px] items-center gap-1.5 rounded-full border border-outline-variant/40 bg-surface-container-high px-3.5 py-1 text-label-md text-on-surface transition-colors hover:bg-surface-container-highest"
            >
              <Icon name="close" className="text-[18px] text-on-surface-variant" />
              <span>Abbrechen</span>
            </button>
          </div>

          <div className="mb-5 px-margin">
            <h2 className="mb-1 text-headline-lg-mobile leading-tight text-on-surface">
              Was hat sich verändert?
            </h2>
            <p className="text-body-md text-on-surface-variant">
              In wenigen Sekunden erfasst – ohne langes Ausfüllen.
            </p>
          </div>

          <div className="mb-6 flex flex-col gap-3 px-margin">
            {OPTIONS.map((option) => {
              const open = selected === option.key;

              if (!open) {
                return (
                  <button
                    key={option.key}
                    type="button"
                    aria-expanded={false}
                    onClick={() => toggleOption(option.key)}
                    className="flex min-h-[64px] w-full items-center justify-between rounded-xl border border-surface-container-high/80 bg-surface-container-low p-4 text-left transition-all hover:border-outline-variant/60 hover:bg-surface-container active:bg-surface-container-high"
                  >
                    <div className="flex min-w-0 items-center gap-3.5">
                      <div
                        className={cn(
                          "flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-surface-container-high",
                          option.iconClass,
                        )}
                      >
                        <Icon name={option.icon} filled={option.filled} className="text-[22px]" />
                      </div>
                      <div className="min-w-0">
                        <div className="truncate text-headline-sm text-on-surface">
                          {option.title}
                        </div>
                        <div className="truncate text-body-sm text-on-surface-variant">
                          {option.hint}
                        </div>
                      </div>
                    </div>
                    <Icon name="chevron_right" className="ml-2 text-[22px] text-outline-variant" />
                  </button>
                );
              }

              return (
                <div
                  key={option.key}
                  className="w-full overflow-hidden rounded-xl border border-primary/40 bg-surface-container-low shadow-lg transition-all"
                >
                  <button
                    type="button"
                    aria-expanded
                    onClick={() => toggleOption(option.key)}
                    className="flex min-h-[64px] w-full items-center justify-between bg-surface-container-high/90 p-4 text-left text-on-surface"
                  >
                    <div className="flex min-w-0 items-center gap-3.5">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary-container text-on-primary-fixed">
                        <Icon name={option.icon} filled className="text-[22px]" />
                      </div>
                      <div className="min-w-0">
                        <div className="truncate text-headline-sm text-primary">{option.title}</div>
                        <div className="truncate text-body-sm text-on-surface-variant">
                          {option.hint}
                        </div>
                      </div>
                    </div>
                    <div className="ml-2 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-surface-container-highest text-primary">
                      <Icon name="expand_less" className="text-[20px]" />
                    </div>
                  </button>

                  <div className="flex flex-col gap-5 border-t border-surface-container-high bg-surface-container-lowest/80 p-4">
                    {option.key === "good_day" && (
                      <div className="flex items-center gap-3 rounded-lg border border-surface-container-high bg-surface-container-low p-3">
                        <Icon name="favorite" filled className="text-[24px] text-primary" />
                        <p className="text-body-sm text-on-surface">
                          Schön! Mit „Speichern“ hältst du diesen guten Tag in deinem Verlauf
                          fest.
                        </p>
                      </div>
                    )}

                    {option.key === "battery" && (
                      <div className="flex flex-col gap-3">
                        <div className="flex items-center justify-between gap-2">
                          <button
                            type="button"
                            aria-label="Akku um 5 Prozent senken"
                            onClick={() => {
                              playTick();
                              setBatteryDraft(Math.max(0, batteryLevel - 5));
                            }}
                            className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl border border-outline-variant/30 bg-surface-container-high text-primary active:bg-surface-bright"
                          >
                            <Icon name="remove" className="text-[26px]" />
                          </button>
                          <div className="flex flex-col items-center">
                            <span
                              className={cn(
                                "text-display-lg tabular-nums",
                                ZONE_STYLES[zoneOf(batteryLevel)].text,
                              )}
                            >
                              {batteryLevel} %
                            </span>
                            <span className="text-label-sm text-on-surface-variant">
                              {ZONE_STATUS[zoneOf(batteryLevel)]}
                            </span>
                          </div>
                          <button
                            type="button"
                            aria-label="Akku um 5 Prozent erhöhen"
                            onClick={() => {
                              playTick();
                              setBatteryDraft(Math.min(100, batteryLevel + 5));
                            }}
                            className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl border border-outline-variant/30 bg-surface-container-high text-primary active:bg-surface-bright"
                          >
                            <Icon name="add" className="text-[26px]" />
                          </button>
                        </div>
                        <div className="grid grid-cols-5 gap-2">
                          {BATTERY_CHIPS.map((chip) => (
                            <button
                              key={chip}
                              type="button"
                              aria-pressed={chip === batteryLevel}
                              onClick={() => {
                                playTick();
                                setBatteryDraft(chip);
                              }}
                              className={cn(
                                CHIP_BASE,
                                "justify-center rounded-lg",
                                chip === batteryLevel ? CHIP_ON : CHIP_OFF,
                              )}
                            >
                              {chip}%
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {isSymptomOption && !chosen && (
                      <div className="flex flex-col gap-2">
                        <span className="text-label-lg text-on-surface">Welches Symptom?</span>
                        <div className="flex flex-wrap gap-2 pt-1">
                          {pickable.map((symptom) => (
                            <button
                              key={symptom.id}
                              type="button"
                              onClick={() => {
                                playTick();
                                setSymptomId(symptom.id);
                              }}
                              className={cn(CHIP_BASE, CHIP_OFF, "rounded-full px-3.5 py-1.5")}
                            >
                              <Icon name={iconFor(symptom.id)} className="text-[18px] text-primary" />
                              <span>{symptom.name}</span>
                            </button>
                          ))}
                        </div>
                        {option.key === "new" && (
                          <input
                            value={customName}
                            onChange={(event) => setCustomName(event.target.value)}
                            placeholder="Oder in eigenen Worten – z. B. Beine wie Beton"
                            className="mt-1 min-h-[48px] w-full rounded-lg border border-outline-variant/40 bg-surface-container-low px-3 text-body-md text-on-surface placeholder:text-outline focus:border-primary focus:outline-none"
                          />
                        )}
                      </div>
                    )}

                    {isSymptomOption && chosen && (
                      <div className="flex items-center justify-between rounded-lg border border-surface-container-high bg-surface-container-low p-3">
                        <div className="flex items-center gap-3">
                          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-secondary-fixed/20 text-secondary-fixed">
                            <Icon name={iconFor(chosen.id)} className="text-[20px]" />
                          </div>
                          <div>
                            <span className="block text-label-sm uppercase tracking-wider text-on-surface-variant">
                              Ausgewählt
                            </span>
                            <span className="text-headline-sm text-on-surface">{chosen.name}</span>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => setSymptomId(null)}
                          className="flex min-h-[44px] items-center rounded-full px-3 py-1 text-label-md text-primary transition-colors hover:bg-surface-container-high"
                        >
                          Ändern
                        </button>
                      </div>
                    )}

                    {isSymptomOption && intensityConfig && (
                      <div className="flex flex-col gap-2">
                        <span className="text-label-lg text-on-surface">
                          {intensityConfig.question}
                        </span>
                        <div
                          role="radiogroup"
                          aria-label="Intensität"
                          className="grid grid-cols-3 gap-2 pt-1"
                        >
                          {INTENSITIES.map((value) => {
                            const [top, bottom] = intensityConfig.options[value];
                            const checked = intensity === value;
                            return (
                              <button
                                key={value}
                                type="button"
                                role="radio"
                                aria-checked={checked}
                                onClick={() => {
                                  playTick();
                                  setIntensity(value);
                                }}
                                className={cn(
                                  "flex min-h-[56px] flex-col items-center justify-center gap-0.5 rounded-xl px-2 text-center transition-all",
                                  checked
                                    ? "border border-primary bg-primary-container shadow-md"
                                    : "border border-outline-variant/40 bg-surface-container-low hover:bg-surface-container-high",
                                )}
                              >
                                <span
                                  className={cn(
                                    "text-label-md",
                                    checked ? "font-bold text-on-primary-fixed" : "text-on-surface",
                                  )}
                                >
                                  {top}
                                </span>
                                <span
                                  className={cn(
                                    "text-label-sm",
                                    checked ? "text-on-primary-fixed/80" : "text-on-surface-variant",
                                  )}
                                >
                                  {bottom}
                                </span>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {isSymptomOption && option.key !== "disappeared" && (
                      <>
                        <div className="flex flex-col gap-2">
                          <div className="flex items-center justify-between">
                            <span className="text-label-lg text-on-surface">Wo?</span>
                            <span className="text-label-sm text-on-surface-variant">Optional</span>
                          </div>
                          <div className="flex flex-wrap gap-2 pt-1">
                            {BODY_LOCATIONS.map((location) => {
                              const on = locations.includes(location);
                              return (
                                <button
                                  key={location}
                                  type="button"
                                  aria-pressed={on}
                                  onClick={() => {
                                    playTick();
                                    setLocations((current) =>
                                      on
                                        ? current.filter((item) => item !== location)
                                        : [...current, location],
                                    );
                                  }}
                                  className={cn(
                                    CHIP_BASE,
                                    "rounded-full px-3.5 py-1.5",
                                    on ? CHIP_ON : CHIP_OFF,
                                  )}
                                >
                                  {on && <Icon name="check" className="text-[18px]" />}
                                  <span>{location}</span>
                                </button>
                              );
                            })}
                          </div>
                        </div>

                        <div className="flex flex-col gap-2">
                          <div className="flex items-center justify-between">
                            <span className="text-label-lg text-on-surface">Seit wann?</span>
                            <span className="text-label-sm text-on-surface-variant">Optional</span>
                          </div>
                          <div className="grid grid-cols-2 gap-2 pt-1">
                            {STARTED_AT.map((item) => {
                              const on = startedAt === item.key;
                              return (
                                <button
                                  key={item.key}
                                  type="button"
                                  aria-pressed={on}
                                  onClick={() => {
                                    playTick();
                                    setStartedAt(on ? null : item.key);
                                  }}
                                  className={cn(
                                    CHIP_BASE,
                                    "justify-center rounded-lg px-3",
                                    on ? CHIP_ON : CHIP_OFF,
                                  )}
                                >
                                  {on && <Icon name="check" className="text-[18px]" />}
                                  <span>{item.label}</span>
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mb-6 px-margin">
            <div className="flex items-center gap-3 rounded-xl border border-surface-container-high bg-surface-container-low p-4">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/15 text-primary">
                <Icon name="verified_user" className="text-[18px]" />
              </div>
              <p className="text-body-sm text-on-surface-variant">
                Keine Pflichtfelder. Dein Eindruck reicht vollkommen aus.
              </p>
            </div>
          </div>

          <div className="sticky inset-x-0 bottom-0 mt-auto flex flex-col gap-2.5 border-t border-surface-container-high/60 bg-surface/95 px-margin pb-4 pt-3 shadow-2xl backdrop-blur-md">
            <button
              type="button"
              disabled={!canSave}
              onClick={() => save(true)}
              className="flex min-h-[56px] w-full items-center justify-center gap-2 rounded-xl bg-primary-container px-6 text-label-lg text-on-primary-container shadow-lg shadow-primary-container/20 transition-all hover:brightness-105 active:scale-[0.99] disabled:opacity-40 disabled:shadow-none"
            >
              <Icon name="check" className="text-[20px] font-bold" />
              <span className="font-bold">Speichern</span>
            </button>
            {isSymptomOption && selected !== "disappeared" && (
              <button
                type="button"
                disabled={!canSave}
                onClick={() => save(false)}
                className="flex min-h-[52px] w-full items-center justify-center rounded-xl border border-outline-variant/30 bg-surface-container-high px-6 text-label-lg text-on-surface transition-colors hover:bg-surface-container-highest active:bg-surface-variant disabled:opacity-40"
              >
                Überspringen &amp; speichern
              </button>
            )}
          </div>
        </div>
      </main>
    </>
  );
}
