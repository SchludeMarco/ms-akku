"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

import { Icon } from "@/components/icon";
import { Logo } from "@/components/logo";
import { cn } from "@/lib/utils";

interface AppHeaderProps {
  title: string;
  /** Zeigt einen Zurück-Pfeil statt der "MS Akku"-Dachzeile (Erfassen, Onboarding). */
  back?: boolean;
}

export function AppHeader({ title, back = false }: AppHeaderProps) {
  const router = useRouter();
  // Von jedem Screen aus führt das Haus zurück zur Übersicht (Heute).
  const pathname = usePathname();
  // Nicht auf der Übersicht selbst und nicht in der Einführung.
  const showHome = pathname !== "/" && !pathname.startsWith("/willkommen");

  return (
    <header className="pt-safe fixed inset-x-0 top-0 z-50 border-b border-outline-variant/30 bg-surface/90 backdrop-blur-xl">
      <div className="mx-auto flex h-16 w-full max-w-xl items-center justify-between px-margin">
        <div className="flex min-w-0 items-center gap-2">
          {back && (
            <button
              type="button"
              aria-label="Zurück"
              onClick={() => router.back()}
              className="-ml-2 flex h-10 w-10 items-center justify-center rounded-full text-on-surface transition-colors hover:bg-surface-container-high active:bg-surface-container-highest"
            >
              <Icon name="arrow_back" className="text-[24px]" />
            </button>
          )}
          {/* Neben Zurück-Pfeil und Haus bleibt auf schmalen Handys kein Platz
              für Logo und ganzen Titel – der Titel geht vor. */}
          <Logo
            className={cn(
              "h-8 w-8 shrink-0",
              back && showHome && "hidden min-[400px]:block",
            )}
          />
          {back ? (
            <h1 className="truncate text-headline-sm leading-tight text-on-surface">
              {title}
            </h1>
          ) : (
            <div className="flex flex-col">
              <span className="text-label-md font-semibold leading-tight tracking-tight text-primary">
                MS Akku
              </span>
              <h1 className="text-headline-sm leading-tight text-on-surface">
                {title}
              </h1>
            </div>
          )}
        </div>
        <div className="flex shrink-0 items-center gap-2">
          {showHome && (
            <Link
              href="/"
              aria-label="Zur Übersicht"
              className="flex h-9 shrink-0 items-center justify-center gap-1 rounded-full border border-primary/40 bg-surface-container-high px-2 text-label-md min-[400px]:px-3 text-primary transition-colors hover:bg-surface-bright"
            >
              <Icon name="home" className="text-[20px]" />
              <span className="hidden min-[400px]:inline">Übersicht</span>
            </Link>
          )}
          <Link
            href="/mehr"
            aria-label="Profil und Einstellungen"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-outline-variant/40 bg-surface-container-high text-primary transition-colors hover:bg-surface-bright"
          >
            <Icon name="person" className="text-[20px]" />
          </Link>
        </div>
      </div>
    </header>
  );
}
