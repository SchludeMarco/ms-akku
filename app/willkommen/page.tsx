import { AppHeader } from "@/components/app-header";
import { Icon } from "@/components/icon";
import { StartButton } from "@/components/start-button";

// Die Einführung ist ein einziger Screen: wofür die App da ist, was sie nicht
// ist und wo die Daten liegen. Danach geht es direkt zu "Heute".

const POINTS = [
  {
    icon: "battery_charging_full",
    title: "Akku einschätzen",
    text: "Halte in ein paar Sekunden fest, wie viel Energie du gerade hast.",
  },
  {
    icon: "history",
    title: "Verlauf ansehen",
    text: "Sieh später, wie dein Akku über die Tage verlaufen ist.",
  },
  {
    icon: "lock",
    title: "Bleibt bei dir",
    text: "Ohne Konto. Deine Einträge liegen nur auf diesem Gerät.",
  },
];

export default function WillkommenPage() {
  return (
    <>
      <AppHeader title="Willkommen" />
      <main className="pb-safe mx-auto flex w-full max-w-xl flex-1 flex-col pt-16">
        <div className="flex w-full flex-1 flex-col gap-space-md px-margin pb-space-lg pt-space-lg">
          <div className="flex flex-col items-center text-center">
            <div className="relative mb-space-sm flex h-24 w-24 items-center justify-center rounded-full bg-surface-container shadow-lg shadow-primary-container/5">
              <div className="relative flex h-16 w-12 flex-col items-center justify-end rounded-xl bg-surface-container-high p-1 shadow-inner">
                <div className="absolute -top-1.5 left-1/2 h-1.5 w-4 -translate-x-1/2 rounded-t-sm bg-outline" />
                <div
                  className="w-full rounded-lg bg-gradient-to-t from-secondary-container to-primary"
                  style={{ height: "68%" }}
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <Icon
                    name="bolt"
                    filled
                    className="text-[22px] text-surface-container-lowest drop-shadow-sm"
                  />
                </div>
              </div>
            </div>
            <h2 className="text-headline-xl-mobile tracking-tight text-on-surface">MS Akku</h2>
            <p className="mx-auto mt-space-xs max-w-xs text-body-lg text-on-surface-variant">
              Dein Energie-Tagebuch. Eine Zahl, ein Regler, fertig.
            </p>
          </div>

          <ul className="flex w-full flex-col gap-space-sm">
            {POINTS.map((point) => (
              <li
                key={point.title}
                className="flex w-full items-center gap-space-md rounded-xl border border-outline-variant/30 bg-surface-container p-space-md shadow-sm"
              >
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-surface-container-high text-primary">
                  <Icon name={point.icon} className="text-[26px]" />
                </span>
                <span className="flex min-w-0 flex-col">
                  <span className="text-label-lg text-on-surface">{point.title}</span>
                  <span className="text-body-sm text-on-surface-variant">{point.text}</span>
                </span>
              </li>
            ))}
          </ul>

          <p className="text-center text-body-sm text-on-surface-variant">
            Dein Akku ist deine persönliche Einschätzung, kein medizinischer Messwert. Die App
            ersetzt keinen ärztlichen Rat.
          </p>

          <div className="mt-auto pt-space-sm">
            <StartButton />
          </div>
        </div>
      </main>
    </>
  );
}
