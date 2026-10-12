"use client";

import Link from "next/link";

import { AppHeader } from "@/components/app-header";
import { Icon } from "@/components/icon";
import { playTick } from "@/lib/sound";
import { useSettingsStore, type UsageMode } from "@/lib/stores/settings-store";
import { cn } from "@/lib/utils";

const OPTIONS: {
  mode: UsageMode;
  icon: string;
  title: string;
  subtitle: string;
  text: string;
  pillClass: string;
  pills: { icon: string; label: string }[];
}[] = [
  {
    mode: "self",
    icon: "favorite",
    title: "Für mich selbst",
    subtitle: "Persönliche Orientierung",
    text: "Zur persönlichen Orientierung, um die eigene Energie besser einzuteilen und Muster im Alltag stressfrei zu erkennen.",
    pillClass: "text-primary",
    pills: [
      { icon: "eco", label: "Kein Fachjargon" },
      { icon: "self_improvement", label: "Rein für dein Wohlbefinden" },
    ],
  },
  {
    mode: "doctor",
    icon: "assignment",
    title: "Zusätzlich für Arzttermine",
    subtitle: "Erweiterte Berichte",
    text: "Enthält strukturierte Zusammenfassungen und unkomplizierte Übersichten, um Gespräche mit deinem Behandlungsteam vorzubereiten.",
    pillClass: "text-tertiary",
    pills: [
      { icon: "calendar_month", label: "Termin-Vorbereitung" },
      { icon: "picture_as_pdf", label: "PDF-Übersicht auf Wunsch" },
    ],
  },
];

export default function NutzungPage() {
  const usageMode = useSettingsStore((state) => state.usageMode);
  const setUsageMode = useSettingsStore((state) => state.setUsageMode);

  return (
    <>
      <AppHeader title="Nutzungspräferenz" back />
      <main className="pb-safe mx-auto flex w-full max-w-xl flex-1 flex-col pt-16">
        <div className="flex w-full flex-col px-margin pb-space-xl">
          <div className="mb-space-md mt-space-sm flex flex-col gap-space-xs">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-label-sm tracking-wide text-primary">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-primary" />
                Schritt 1 von 2 • Orientierung
              </span>
              <span className="text-label-sm text-on-surface-variant">50%</span>
            </div>
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-surface-container-high">
              <div className="h-full w-1/2 rounded-full bg-primary-container shadow-sm" />
            </div>
          </div>

          <div className="mb-space-lg flex flex-col gap-space-xs">
            <h2 className="text-headline-lg-mobile text-on-surface">
              Wie möchtest du MS Akku verwenden?
            </h2>
            <p className="text-body-md leading-relaxed text-on-surface-variant">
              Wähle den Modus, der sich heute für dich richtig anfühlt. Beide Wege sind
              vollwertig, achtsam gestaltet und jederzeit anpassbar.
            </p>
          </div>

          <div
            role="radiogroup"
            aria-label="Nutzungspräferenz auswählen"
            className="mb-space-lg flex flex-col gap-space-md"
          >
            {OPTIONS.map((option) => {
              const checked = usageMode === option.mode;
              return (
                <button
                  key={option.mode}
                  type="button"
                  role="radio"
                  aria-checked={checked}
                  onClick={() => {
                    playTick();
                    setUsageMode(option.mode);
                  }}
                  className={cn(
                    "relative overflow-hidden rounded-2xl p-space-md text-left transition-all duration-300",
                    checked
                      ? "bg-surface-container-high shadow-[0_10px_30px_-10px_rgba(45,212,191,0.2)]"
                      : "bg-surface-container-low",
                  )}
                >
                  {checked && (
                    <div className="pointer-events-none absolute -right-12 -top-12 h-36 w-36 rounded-full bg-primary/10 blur-2xl" />
                  )}
                  <div className="mb-space-xs flex items-start justify-between gap-space-sm">
                    <div className="flex items-center gap-space-sm">
                      <div
                        className={cn(
                          "flex h-12 w-12 shrink-0 items-center justify-center rounded-xl",
                          checked
                            ? "bg-primary-container/20 text-primary"
                            : "bg-surface-container text-on-surface-variant",
                        )}
                      >
                        <Icon name={option.icon} filled={checked} className="text-[26px]" />
                      </div>
                      <div>
                        <h3 className="text-headline-sm text-on-surface">{option.title}</h3>
                        {checked ? (
                          <span className="flex items-center gap-1 text-label-sm text-primary">
                            <Icon name="check_circle" className="text-[14px]" />
                            Aktiv gewählt
                          </span>
                        ) : (
                          <span className="text-label-sm text-outline">{option.subtitle}</span>
                        )}
                      </div>
                    </div>
                    <div
                      className={cn(
                        "flex h-7 w-7 shrink-0 items-center justify-center rounded-full",
                        checked
                          ? "bg-primary text-on-primary shadow-sm"
                          : "bg-surface-container-highest",
                      )}
                    >
                      {checked && <Icon name="done" className="text-[18px]" />}
                    </div>
                  </div>
                  <p className="mb-space-md pl-1 text-body-md text-on-surface-variant">
                    {option.text}
                  </p>
                  <div className="flex flex-wrap gap-space-xs pl-1">
                    {option.pills.map((pill) => (
                      <span
                        key={pill.label}
                        className="flex items-center gap-1.5 rounded-full bg-surface-container px-3 py-1 text-label-sm text-on-surface-variant"
                      >
                        <Icon name={pill.icon} className={cn("text-[15px]", option.pillClass)} />
                        {pill.label}
                      </span>
                    ))}
                  </div>
                </button>
              );
            })}
          </div>

          <div className="mb-space-lg flex items-start gap-space-sm rounded-2xl bg-surface-container p-space-md shadow-sm">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-surface-container-high text-primary">
              <Icon name="verified_user" className="text-[22px]" />
            </div>
            <div className="flex flex-col gap-0.5">
              <h4 className="text-label-lg text-on-surface">Keine Festlegung nötig</h4>
              <p className="text-body-sm leading-relaxed text-on-surface-variant">
                Du kannst diese Einstellung jederzeit unter „Mehr“ ändern. Die Option für dich
                selbst ist uneingeschränkt vollständig und wahrt deine Ruhe.
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-space-sm">
            <Link
              href="/willkommen/symptome"
              className="flex h-14 w-full items-center justify-center gap-space-xs rounded-2xl bg-primary-container text-label-lg font-semibold text-on-primary-container shadow-lg shadow-primary-container/10 transition-transform active:scale-[0.99]"
            >
              <span>Weiter</span>
              <Icon name="arrow_forward" className="text-[20px]" />
            </Link>
            <div className="flex items-center justify-center gap-1.5 py-1 text-center text-on-surface-variant">
              <Icon name="lock" className="text-[16px] text-primary" />
              <span className="text-label-sm">Deine Daten verbleiben auf diesem Gerät.</span>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
