"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { Icon } from "@/components/icon";
import { cn } from "@/lib/utils";

const LEFT = [
  { href: "/", label: "Heute", icon: "calendar_today" },
  { href: "/verlauf", label: "Verlauf", icon: "history" },
] as const;

const RIGHT = [
  { href: "/muster", label: "Muster", icon: "auto_graph" },
  { href: "/mehr", label: "Mehr", icon: "more_horiz" },
] as const;

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
        "flex min-h-[48px] min-w-[48px] flex-1 flex-col items-center justify-center rounded-xl transition-colors",
        active ? "font-semibold text-nav-active" : "text-on-surface-variant",
      )}
    >
      <Icon name={icon} className="text-[24px]" filled={active} />
      <span className="mt-1 text-label-sm leading-none">{label}</span>
    </Link>
  );
}

/** Untere Navigation nach dem Stitch-Redesign, mit angehobenem Erfassen-Knopf. */
export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Hauptnavigation"
      className="pb-safe fixed inset-x-0 bottom-0 z-50 border-t border-outline-variant/30 bg-surface-container-high/95 shadow-[0_-4px_24px_rgb(var(--nav-shadow))] backdrop-blur-xl"
    >
      <div className="relative mx-auto flex h-[72px] w-full max-w-md items-center justify-between px-2">
        <div className="flex flex-1 items-center justify-around gap-2">
          {LEFT.map((item) => (
            <NavItem key={item.href} {...item} active={pathname === item.href} />
          ))}
        </div>
        <div className="flex items-center justify-center px-2">
          <Link
            href="/erfassen"
            aria-label="Veränderung erfassen"
            className="relative -top-4 flex h-14 w-14 items-center justify-center rounded-full border-2 border-surface-container-high bg-fab text-on-fab shadow-[0_4px_14px_rgb(var(--fab)/0.35)] transition-transform active:scale-95"
          >
            <Icon name="bolt" filled className="text-[28px]" />
          </Link>
        </div>
        <div className="flex flex-1 items-center justify-around gap-2">
          {RIGHT.map((item) => (
            <NavItem key={item.href} {...item} active={pathname === item.href} />
          ))}
        </div>
      </div>
    </nav>
  );
}
