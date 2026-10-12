"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

import { Icon } from "@/components/icon";
import { Logo } from "@/components/logo";

interface AppHeaderProps {
  title: string;
  /** Zeigt einen Zurück-Pfeil statt der "MS Akku"-Dachzeile (Erfassen, Onboarding). */
  back?: boolean;
}

export function AppHeader({ title, back = false }: AppHeaderProps) {
  const router = useRouter();

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
          <Logo className="h-8 w-8 shrink-0" />
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
        <Link
          href="/mehr"
          aria-label="Profil und Einstellungen"
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-outline-variant/40 bg-surface-container-high text-primary transition-colors hover:bg-surface-bright"
        >
          <Icon name="person" className="text-[20px]" />
        </Link>
      </div>
    </header>
  );
}
