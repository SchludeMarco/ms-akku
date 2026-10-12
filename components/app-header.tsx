"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

import { Icon } from "@/components/icon";
import { Logo } from "@/components/logo";

interface AppHeaderProps {
  /** Name des Screens; steht klein unter "MS Akku". */
  title: string;
  /** Zeigt einen Zurück-Pfeil (Unterseiten, Erfassen, Einführung). */
  back?: boolean;
}

/**
 * Kopfzeile: Logo, "MS Akku" und darunter der Name des Screens; rechts das
 * Haus zurück zu "Heute" (auf Unterseiten) und das Zahnrad zu "Mehr". Alle
 * Knöpfe sind 48 px groß.
 */
export function AppHeader({ title, back = false }: AppHeaderProps) {
  const router = useRouter();
  const pathname = usePathname();
  const onboarding = pathname.startsWith("/willkommen");
  // Das Haus führt von Unterseiten zurück zu "Heute". Auf den Hauptscreens
  // übernimmt das die untere Navigation.
  const showHome = back && !onboarding;

  return (
    <header className="pt-safe fixed inset-x-0 top-0 z-50 bg-surface-container-low/90 shadow-[0_1px_8px_rgb(var(--nav-shadow))] backdrop-blur-xl">
      <div className="mx-auto flex h-16 w-full max-w-xl items-center justify-between gap-2 px-margin">
        <div className="flex min-w-0 items-center gap-2">
          {back && (
            <button
              type="button"
              aria-label="Zurück"
              onClick={() => router.back()}
              className="-ml-2 flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-on-surface transition-colors hover:bg-surface-container-high active:bg-surface-container-highest"
            >
              <Icon name="arrow_back" className="text-[24px]" />
            </button>
          )}
          <Logo className="h-8 w-8 shrink-0" />
          <div className="flex min-w-0 flex-col">
            <span className="text-headline-sm leading-tight text-on-surface">MS Akku</span>
            <h1 className="text-label-sm font-semibold uppercase leading-tight tracking-wider text-on-surface-variant">
              {title}
            </h1>
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-1">
          {showHome && (
            <Link
              href="/"
              aria-label="Zur Übersicht"
              className="flex h-12 w-12 items-center justify-center rounded-xl bg-surface-container text-on-surface-variant transition-colors hover:bg-surface-container-high hover:text-primary"
            >
              <Icon name="home" className="text-[24px]" />
            </Link>
          )}
          {pathname !== "/mehr" && !onboarding && (
            <Link
              href="/mehr"
              aria-label="Mehr: Einstellungen und Daten"
              className="flex h-12 w-12 items-center justify-center rounded-xl bg-surface-container text-on-surface-variant transition-colors hover:bg-surface-container-high hover:text-primary"
            >
              <Icon name="settings" className="text-[24px]" />
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
