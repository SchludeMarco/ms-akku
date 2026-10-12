"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { Icon } from "@/components/icon";
import { useSettingsStore } from "@/lib/stores/settings-store";
import { cn } from "@/lib/utils";

function NavItem({
  href,
  label,
  icon,
  active,
}: {
  href: string;
  label: string;
  icon: string;
  active: boolean;
}) {
  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      className={cn(
        "flex min-h-[56px] flex-1 flex-col items-center justify-center rounded-xl transition-colors",
        active ? "font-semibold text-nav-active" : "text-on-surface-variant",
      )}
    >
      <Icon name={icon} className="text-[26px]" filled={active} />
      <span className="mt-1 text-label-md leading-none">{label}</span>
    </Link>
  );
}

/**
 * Untere Navigation: "Heute" und "Verlauf". "Muster" und der Knopf zum
 * Erfassen von Symptomen erscheinen nur, wenn sie unter "Mehr → Erweitert"
 * eingeschaltet sind.
 */
export function BottomNav() {
  const pathname = usePathname();
  const extras = useSettingsStore((state) => state.extras);

  return (
    <nav
      aria-label="Hauptnavigation"
      className="pb-safe fixed inset-x-0 bottom-0 z-50 border-t border-outline-variant/30 bg-surface-container-high/95 shadow-[0_-4px_24px_rgb(var(--nav-shadow))] backdrop-blur-xl"
    >
      <div className="mx-auto flex h-[72px] w-full max-w-md items-center gap-2 px-4">
        <NavItem href="/" label="Heute" icon="battery_charging_full" active={pathname === "/"} />
        {extras.capture && (
          <Link
            href="/erfassen"
            aria-label="Veränderung erfassen"
            className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-fab text-on-fab shadow-[0_4px_14px_rgb(var(--fab)/0.35)] transition-transform active:scale-95"
          >
            <Icon name="bolt" filled className="text-[28px]" />
          </Link>
        )}
        <NavItem
          href="/verlauf"
          label="Verlauf"
          icon="history"
          active={pathname === "/verlauf"}
        />
        {extras.patterns && (
          <NavItem
            href="/muster"
            label="Muster"
            icon="auto_graph"
            active={pathname === "/muster"}
          />
        )}
      </div>
    </nav>
  );
}
