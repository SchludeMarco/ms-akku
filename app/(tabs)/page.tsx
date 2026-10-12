"use client";

import { useState } from "react";
import Link from "next/link";
import { useLiveQuery } from "dexie-react-hooks";

import { AppHeader } from "@/components/app-header";
import { AkkuCard } from "@/components/heute/akku-card";
import { DayPlan } from "@/components/heute/day-plan";
import { SunnyGreeting } from "@/components/heute/sunny-greeting";
import { Icon } from "@/components/icon";
import { db, newId } from "@/lib/db";
import { startOfDay } from "@/lib/dates";
import { FEELINGS, type FeelingKey } from "@/lib/feelings";
import { MIN_ENTRIES_FOR_PATTERN } from "@/lib/patterns";
import { playTick } from "@/lib/sound";
import { usePatterns } from "@/lib/use-patterns";
import { cn } from "@/lib/utils";

export default function HeutePage() {
  const [now] = useState(() => new Date());

  const feeling = useLiveQuery(async () => {
    const todays = await db.moments
      .where("timestamp")
      .aboveOrEqual(startOfDay(now).toISOString())
      .filter((moment) => moment.kind === "feeling")
      .sortBy("timestamp");
    return todays.at(-1)?.value ?? null;
  }, [now]);

  const { patterns, batteryCount } = usePatterns(now);
  const insight = patterns?.[0];

  async function selectFeeling(key: FeelingKey) {
    if (key === feeling) return;
    await db.moments.add({
      id: newId(),
      timestamp: new Date().toISOString(),
      kind: "feeling",
      value: key,
    });
    playTick();
  }

  return (
    <>
      <AppHeader title="Heute" />
      <main className="mx-auto flex w-full max-w-xl flex-1 flex-col pb-28 pt-16">
        <div className="flex w-full flex-col space-y-6 px-margin pb-10">
          <div className="pt-4">
            <SunnyGreeting now={now} />
          </div>

          <AkkuCard now={now} />

          <section aria-labelledby="current-state-heading" className="space-y-2">
            <div className="flex items-center justify-between">
              <h3 id="current-state-heading" className="text-headline-sm text-on-surface">
                Wie fühlst du dich gerade?
              </h3>
              <span className="text-label-sm text-on-surface-variant">
                Tippen zum Wählen
              </span>
            </div>
            <div
              role="radiogroup"
              aria-label="Körperliches und mentales Befinden"
              className="grid grid-cols-2 gap-2"
            >
              {FEELINGS.map((option) => {
                const checked = feeling === option.key;
                return (
                  <button
                    key={option.key}
                    type="button"
                    role="radio"
                    aria-checked={checked}
                    onClick={() => selectFeeling(option.key)}
                    className={cn(
                      "flex min-h-[56px] items-center justify-between gap-2 rounded-xl border px-4 py-3 text-left shadow-sm transition-colors",
                      checked
                        ? "border-primary/50 bg-surface-container-high"
                        : "border-outline-variant/30 bg-surface-container active:bg-surface-container-high",
                    )}
                  >
                    <div className="flex items-center gap-2">
                      <Icon
                        name={option.icon}
                        className={cn(
                          "text-[22px]",
                          checked ? "text-primary" : "text-on-surface-variant",
                        )}
                      />
                      <span className="text-label-md font-medium text-on-surface">
                        {option.label}
                      </span>
                    </div>
                    <Icon
                      name={checked ? "check_circle" : "radio_button_unchecked"}
                      className={cn(
                        "text-[20px]",
                        checked ? "text-primary" : "text-outline-variant",
                      )}
                    />
                  </button>
                );
              })}
            </div>
          </section>

          <section>
            <Link
              href="/erfassen"
              className="group flex min-h-[64px] w-full items-center justify-between rounded-xl border border-primary/40 bg-surface-container-high p-4 shadow-lg transition-all active:bg-surface-variant"
            >
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary-container text-on-primary-fixed shadow-md">
                  <Icon name="add_circle" className="text-[28px] font-semibold" />
                </div>
                <div className="flex flex-col text-left">
                  <span className="text-headline-sm font-semibold leading-snug text-primary transition-colors group-hover:text-primary-fixed">
                    + Veränderung erfassen
                  </span>
                  <span className="text-body-sm leading-tight text-on-surface-variant">
                    Symptom, Akku-Wechsel oder gutes Gefühl (ca. 10 Sek.)
                  </span>
                </div>
              </div>
              <Icon name="chevron_right" className="text-[24px] text-primary" />
            </Link>
          </section>

          <DayPlan now={now} />

          <section aria-labelledby="insight-heading" className="space-y-1.5">
            <div className="flex items-center gap-1.5">
              <Icon name="lightbulb" className="text-[20px] text-secondary" />
              <h3 id="insight-heading" className="text-headline-sm text-on-surface">
                Auffällig
              </h3>
            </div>
            <div className="space-y-4 rounded-xl border border-outline-variant/30 bg-surface-container p-4 shadow-sm">
              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-secondary/30 bg-secondary-container/20 text-secondary">
                  <Icon
                    name={insight?.summaryIcon ?? "hourglass_top"}
                    className="text-[22px]"
                  />
                </div>
                <div className="space-y-1">
                  <p className="text-body-md leading-relaxed text-on-surface">
                    {insight
                      ? insight.summary
                      : "MS Akku sammelt noch Einträge. Erste Muster zeigen sich nach etwa fünf Akku-Einschätzungen."}
                  </p>
                  <span className="inline-block text-label-sm text-on-surface-variant">
                    {insight
                      ? `Basierend auf deinen Einträgen · ${insight.evidence}`
                      : `${Math.min(batteryCount, MIN_ENTRIES_FOR_PATTERN)} von ${MIN_ENTRIES_FOR_PATTERN} Einträgen vorhanden`}
                  </span>
                </div>
              </div>
              <div className="flex items-center justify-end pt-1">
                <Link
                  href="/muster"
                  className="flex min-h-[48px] items-center gap-1.5 rounded-lg border border-outline-variant/30 bg-surface-container-high px-4 text-label-md font-semibold text-primary transition-colors active:bg-surface-bright"
                >
                  <span>Muster ansehen</span>
                  <Icon name="arrow_forward" className="text-[18px]" />
                </Link>
              </div>
            </div>
          </section>
        </div>
      </main>
    </>
  );
}
