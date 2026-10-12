"use client";

import { useState } from "react";
import Link from "next/link";

import { AppHeader } from "@/components/app-header";
import { Icon } from "@/components/icon";
import {
  MIN_ENTRIES_FOR_PATTERN,
  type Pattern,
  type PatternCurvePoint,
  type PatternTone,
} from "@/lib/patterns";
import { usePatterns } from "@/lib/use-patterns";
import { cn } from "@/lib/utils";

const TONE_STYLES: Record<PatternTone, { tag: string; text: string }> = {
  primary: { tag: "border-primary/25 bg-primary/15 text-primary", text: "text-primary" },
  secondary: {
    tag: "border-secondary/25 bg-secondary/15 text-secondary",
    text: "text-secondary",
  },
  tertiary: {
    tag: "border-tertiary/25 bg-tertiary/15 text-tertiary",
    text: "text-tertiary",
  },
};

const BAR_FILLS = ["bg-primary-container", "bg-secondary opacity-80", "bg-tertiary opacity-80"];
const BAR_TEXTS = ["text-primary", "text-secondary", "text-tertiary"];

function Curve({ points }: { points: PatternCurvePoint[] }) {
  const step = 280 / (points.length - 1);
  // Auf den tatsächlichen Wertebereich strecken, sonst wirkt die Kurve flach.
  const values = points.map((point) => point.value);
  const min = Math.min(...values);
  const span = Math.max(Math.max(...values) - min, 1);
  const coords = points.map((point, index) => ({
    x: 20 + index * step,
    y: 52 - ((point.value - min) / span) * 40,
    isLow: point.isLow,
  }));
  const path = coords
    .map((point, index) => {
      if (index === 0) return `M ${point.x} ${point.y}`;
      const previous = coords[index - 1];
      const middle = (previous.x + point.x) / 2;
      return `C ${middle} ${previous.y}, ${middle} ${point.y}, ${point.x} ${point.y}`;
    })
    .join(" ");
  const low = coords.find((point) => point.isLow)!;

  return (
    <svg
      viewBox="0 0 320 64"
      preserveAspectRatio="none"
      className="h-full w-full overflow-visible"
      aria-hidden="true"
    >
      <rect x={low.x - 36} y="4" width="72" height="56" rx="6" className="fill-tertiary/10" />
      <path
        d={path}
        fill="none"
        strokeWidth="3"
        strokeLinecap="round"
        strokeOpacity="0.8"
        className="stroke-primary"
      />
      <circle cx={low.x} cy={low.y} r="5" className="fill-secondary" />
    </svg>
  );
}

function PatternCard({ pattern }: { pattern: Pattern }) {
  const tone = TONE_STYLES[pattern.tone];

  return (
    <article className="flex flex-col gap-space-md rounded-xl border border-outline-variant/40 bg-surface-container p-space-md shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-space-sm">
        <span
          className={cn(
            "inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-label-sm",
            tone.tag,
          )}
        >
          <Icon name={pattern.tagIcon} className="text-[14px]" />
          {pattern.tag}
        </span>
        <span className="inline-flex items-center gap-1 rounded-full border border-outline-variant/30 bg-surface-container-high px-2.5 py-1 text-label-sm text-on-surface-variant">
          <Icon name={pattern.evidenceIcon} className="text-[14px]" />
          {pattern.evidence}
        </span>
      </div>

      <h2 className="text-headline-sm leading-snug text-on-surface">{pattern.headline}</h2>

      {pattern.bars && (
        <div className="flex flex-col gap-space-sm rounded-lg border border-outline-variant/30 bg-surface-container-low p-space-md">
          <span className="text-label-sm text-on-surface-variant">{pattern.barsTitle}</span>
          <div className="flex flex-col gap-2.5">
            {pattern.bars.map((bar, index) => (
              <div key={bar.label} className="flex items-center gap-space-sm">
                <span className="w-24 truncate text-label-sm text-on-surface-variant">
                  {bar.label}
                </span>
                <div className="h-3 flex-1 overflow-hidden rounded-full bg-surface-container-highest">
                  <div
                    className={cn("h-full rounded-full", BAR_FILLS[index % 3])}
                    style={{ width: `${bar.percent}%` }}
                  />
                </div>
                <span
                  className={cn(
                    "w-12 text-right text-label-md font-bold",
                    BAR_TEXTS[index % 3],
                  )}
                >
                  {bar.display}
                </span>
              </div>
            ))}
          </div>
          {pattern.barsNote && (
            <p className="pt-1 text-body-sm text-on-surface-variant">{pattern.barsNote}</p>
          )}
        </div>
      )}

      {pattern.curve && (
        <div className="flex flex-col gap-space-sm rounded-lg border border-outline-variant/30 bg-surface-container-low p-space-md">
          <div className="flex items-center justify-between gap-2 text-label-sm text-on-surface-variant">
            <span>Typischer Tagesverlauf</span>
            <span className="text-right font-semibold text-tertiary">
              {pattern.curveLowLabel}
            </span>
          </div>
          <div className="relative h-16 w-full">
            <Curve points={pattern.curve} />
          </div>
          <div className="flex justify-between text-label-sm text-outline">
            {pattern.curve.map((point) => (
              <span
                key={point.label}
                className={cn(point.isLow && "font-semibold text-tertiary")}
              >
                {point.label}
              </span>
            ))}
          </div>
        </div>
      )}

      {pattern.hint && (
        <div className="flex items-start gap-space-sm rounded-lg border border-outline-variant/30 bg-surface-container-high p-space-sm">
          <Icon name="spa" className="mt-0.5 text-[20px] text-primary" />
          <p className="text-body-sm text-on-surface">{pattern.hint}</p>
        </div>
      )}

      <Link
        href="/verlauf"
        className="flex h-[52px] w-full items-center justify-center gap-space-xs rounded-lg border border-outline-variant/50 bg-surface-container-high text-label-lg text-primary transition-all hover:bg-surface-container-highest active:scale-[0.99]"
      >
        <span>Vergleichbare Tage ansehen</span>
        <Icon name="arrow_forward" className="text-[20px]" />
      </Link>
    </article>
  );
}

export default function MusterPage() {
  const [now] = useState(() => new Date());
  const { patterns, batteryCount } = usePatterns(now);
  const collected = Math.min(batteryCount, MIN_ENTRIES_FOR_PATTERN);

  return (
    <>
      <AppHeader title="Muster" />
      <main className="mx-auto flex w-full max-w-xl flex-1 flex-col pb-28 pt-16">
        <div className="flex w-full flex-col">
          <section className="flex flex-col gap-space-md px-margin pt-space-md">
            <div className="relative overflow-hidden rounded-xl border border-outline-variant/40 bg-surface-container-low p-space-md shadow-sm">
              <div className="flex items-start gap-space-sm">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-primary/30 bg-primary/15 text-primary">
                  <Icon name="psychology" className="text-[22px]" />
                </div>
                <div className="flex flex-col gap-space-xs">
                  <p className="text-headline-sm text-on-surface">
                    Wiederkehrende Zusammenhänge
                  </p>
                  <p className="text-body-sm leading-relaxed text-on-surface-variant">
                    MS Akku sucht nach wiederkehrenden Zusammenhängen in deinen eigenen
                    Einträgen.
                  </p>
                </div>
              </div>
              <div className="mt-space-md flex items-start gap-space-xs rounded-lg border-t border-outline-variant/30 bg-surface-container/60 p-space-sm">
                <Icon name="verified_user" className="mt-0.5 text-[18px] text-outline" />
                <p className="text-label-sm text-on-surface-variant">
                  <span className="font-semibold text-on-surface">Beobachtung</span> – keine
                  medizinische Diagnose oder festgestellte Ursache. Du kennst deinen Körper
                  am besten.
                </p>
              </div>
            </div>
          </section>

          <section className="flex flex-col gap-space-md px-margin pt-space-md">
            {patterns?.map((pattern) => (
              <PatternCard key={pattern.id} pattern={pattern} />
            ))}

            {patterns?.length === 0 && (
              <article className="flex flex-col gap-space-md rounded-xl border border-outline-variant/40 bg-surface-container p-space-md shadow-sm">
                <span className="inline-flex items-center gap-1.5 self-start rounded-full border border-primary/25 bg-primary/15 px-3 py-1.5 text-label-sm text-primary">
                  <Icon name="hourglass_top" className="text-[14px]" />
                  Noch in Arbeit
                </span>
                <h2 className="text-headline-sm leading-snug text-on-surface">
                  MS Akku sammelt noch Einträge, bevor es Muster zeigt.
                </h2>
                <div className="flex flex-col gap-space-sm rounded-lg border border-outline-variant/30 bg-surface-container-low p-space-md">
                  <div className="flex items-center justify-between text-label-sm text-on-surface-variant">
                    <span>Akku-Einschätzungen</span>
                    <span className="font-bold text-primary">
                      {collected} von {MIN_ENTRIES_FOR_PATTERN}
                    </span>
                  </div>
                  <div className="h-3 overflow-hidden rounded-full bg-surface-container-highest">
                    <div
                      className="h-full rounded-full bg-primary-container transition-all duration-500"
                      style={{ width: `${(collected / MIN_ENTRIES_FOR_PATTERN) * 100}%` }}
                    />
                  </div>
                  <p className="pt-1 text-body-sm text-on-surface-variant">
                    Kein Druck: Trag ein, wann es für dich passt. Zum Ausprobieren kannst du
                    unter „Mehr“ Beispieldaten laden.
                  </p>
                </div>
                <Link
                  href="/"
                  className="flex h-[52px] w-full items-center justify-center gap-space-xs rounded-lg border border-outline-variant/50 bg-surface-container-high text-label-lg text-primary transition-all hover:bg-surface-container-highest active:scale-[0.99]"
                >
                  <span>Akku einschätzen</span>
                  <Icon name="arrow_forward" className="text-[20px]" />
                </Link>
              </article>
            )}
          </section>

          <footer className="flex flex-col items-center px-margin pb-space-lg pt-space-lg text-center">
            <div className="flex items-center gap-space-xs rounded-2xl border border-outline-variant/40 bg-surface-container-low px-4 py-2.5 text-label-sm text-on-surface-variant shadow-sm">
              <Icon name="sync" className="text-[16px] text-primary" />
              <span>
                Muster aktualisieren sich automatisch ab {MIN_ENTRIES_FOR_PATTERN} Einträgen
                zu einem Bereich.
              </span>
            </div>
            <p className="mt-space-md max-w-xs text-body-sm leading-relaxed text-outline">
              MS Akku lernt im Hintergrund mit, ohne Druck und jederzeit an deine
              individuellen Gewohnheiten anpassbar.
            </p>
          </footer>
        </div>
      </main>
    </>
  );
}
