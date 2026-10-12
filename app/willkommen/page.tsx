import Link from "next/link";

import { AppHeader } from "@/components/app-header";
import { Icon } from "@/components/icon";

const BENEFITS = [
  {
    icon: "battery_saver",
    iconClass: "text-primary",
    title: "Sanfter Akku-Check",
    text: "Eigene Tagesform in wenigen Sekunden achtsam erfassen.",
  },
  {
    icon: "favorite",
    iconClass: "text-secondary",
    filled: true,
    title: "Kein Leistungsdruck",
    text: "Schwankungen sind völlig normal. Null Bewertungen, nur Klarheit.",
  },
  {
    icon: "insights",
    iconClass: "text-tertiary-fixed-dim",
    title: "Echte Muster entdecken",
    text: "Verstehe Zusammenhänge wie Schlafqualität, Pausen & Tageszeit.",
  },
];

export default function WillkommenPage() {
  return (
    <>
      <AppHeader title="Willkommen" back />
      <main className="pb-safe mx-auto flex w-full max-w-xl flex-1 flex-col pt-16">
        <div className="flex w-full flex-col space-y-space-md px-margin pb-space-lg pt-space-md">
          <div className="flex flex-col items-center pt-space-xs text-center">
            <div className="relative mb-space-sm flex h-24 w-24 items-center justify-center rounded-full bg-surface-container shadow-lg shadow-primary-container/5">
              <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-primary/10 via-secondary-container/15 to-transparent" />
              <div className="relative flex h-16 w-12 flex-col items-center justify-end rounded-xl bg-surface-container-high p-1 shadow-inner">
                <div className="absolute -top-1.5 left-1/2 h-1.5 w-4 -translate-x-1/2 rounded-t-sm bg-outline" />
                <div
                  className="w-full rounded-lg bg-primary-container shadow-sm shadow-primary/30"
                  style={{ height: "68%" }}
                >
                  <div className="h-full w-full rounded-lg bg-gradient-to-t from-secondary-container to-primary opacity-90" />
                </div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <Icon
                    name="bolt"
                    filled
                    className="text-[22px] text-surface-container-lowest drop-shadow-sm"
                  />
                </div>
              </div>
            </div>

            <div className="inline-flex items-center gap-space-xs rounded-full bg-surface-container-high px-space-md py-space-xs text-label-sm text-primary shadow-sm">
              <Icon name="eco" className="text-[16px]" />
              <span>PACING &amp; SELBSTFÜRSORGE</span>
            </div>

            <h2 className="mb-space-xs mt-space-sm text-headline-xl-mobile tracking-tight text-on-surface">
              MS Akku
            </h2>
            <p className="mx-auto max-w-xs text-headline-sm text-secondary">
              Verstehe deine Energie. Erkenne deine Muster.
            </p>
            <p className="mx-auto mt-space-sm max-w-md text-body-md leading-relaxed text-on-surface-variant">
              Plane deinen Tag nach dir – nicht nach deiner MS. Ein geschützter Raum für dein
              individuelles Tempo.
            </p>
          </div>

          <div className="w-full rounded-xl bg-surface-container-low p-space-md shadow-sm">
            <div className="mb-space-xs flex items-center justify-between">
              <div className="flex items-center gap-space-xs text-label-md text-on-surface">
                <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-primary" />
                <span>Sanfte Balance</span>
              </div>
              <span className="text-label-sm text-secondary-fixed-dim">
                Tageskapazität achten
              </span>
            </div>
            <div className="h-2.5 w-full overflow-hidden rounded-full bg-surface-container-high">
              <div
                className="h-full rounded-full bg-gradient-to-r from-primary-container via-secondary to-tertiary-container"
                style={{ width: "74%" }}
              />
            </div>
            <div className="mt-2 flex items-center justify-between text-label-sm text-on-surface-variant">
              <span>Ruhephase</span>
              <span>Fokuszone</span>
              <span>Erholung</span>
            </div>
          </div>

          <div className="w-full rounded-xl bg-surface-container p-space-md shadow-md">
            <div className="mb-space-xs flex items-start justify-between gap-space-sm">
              <div className="flex items-center gap-space-sm">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-surface-container-high text-primary">
                  <Icon name="lock" className="text-[22px]" />
                </div>
                <h3 className="text-headline-sm text-on-surface">Lokal auf deinem Gerät</h3>
              </div>
              <span className="shrink-0 rounded-full bg-secondary-container/20 px-space-sm py-0.5 text-label-sm text-secondary">
                100% Privat
              </span>
            </div>
            <p className="text-body-sm leading-relaxed text-on-surface-variant">
              Du kannst MS Akku vollständig ohne Konto und ohne Cloud verwenden. Deine
              persönlichen Gesundheitsdaten verlassen dein Gerät nur, wenn du es selbst auslöst.
            </p>
          </div>

          <div className="flex w-full flex-col space-y-space-sm">
            {BENEFITS.map((benefit) => (
              <div
                key={benefit.title}
                className="flex w-full items-center gap-space-md rounded-xl bg-surface-container p-space-md shadow-sm"
              >
                <div
                  className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-surface-container-high ${benefit.iconClass}`}
                >
                  <Icon name={benefit.icon} filled={benefit.filled} className="text-[26px]" />
                </div>
                <div className="flex min-w-0 flex-col">
                  <span className="truncate text-label-lg text-on-surface">{benefit.title}</span>
                  <span className="text-body-sm text-on-surface-variant">{benefit.text}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="flex w-full items-center gap-space-md rounded-xl bg-surface-container-low p-space-md">
            <div className="relative flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-gradient-to-br from-primary/25 via-secondary-container/20 to-tertiary/15">
              <Icon name="spa" filled className="text-[32px] text-primary" />
            </div>
            <div className="flex min-w-0 flex-col">
              <span className="text-label-md text-on-surface">Deine Erholung zählt zuerst</span>
              <p className="text-body-sm text-on-surface-variant">
                Einfach durchatmen und deinen eigenen Rhythmus finden.
              </p>
            </div>
          </div>

          <div className="flex w-full flex-col items-center space-y-space-sm pt-space-xs">
            <Link
              href="/willkommen/nutzung"
              className="flex h-14 min-h-[56px] w-full items-center justify-center gap-space-xs rounded-xl bg-primary-container text-label-lg text-on-primary-container shadow-md shadow-primary-container/20 transition-all active:opacity-95"
            >
              <span>Los geht’s</span>
              <Icon name="arrow_forward" className="text-[20px]" />
            </Link>
            <div className="flex flex-col items-center space-y-1 text-center">
              <span className="inline-flex items-center gap-1.5 text-label-sm text-on-surface-variant">
                <Icon name="verified_user" className="text-[15px]" />
                <span>Alle Einträge bleiben auf diesem Gerät</span>
              </span>
              <span className="text-label-sm text-outline">
                Keine Registrierung erforderlich • 100% offline nutzbar
              </span>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
