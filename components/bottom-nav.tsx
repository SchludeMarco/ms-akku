"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { Icon } from "@/components/icon";
import { cn } from "@/lib/utils";

const LEFT = [
  { href: "/", label: "Heute", icon: "battery_charging_full" },
  { href: "/verlauf", label: "Verlauf", icon: "calendar_today" },
] as const;

const RIGHT = [
  { href: "/muster", label: "Muster", icon: "insights" },
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
        "flex min-h-[48px] flex-1 flex-col items-center justify-center py-1 transition-colors",
        active
          ? "font-bold text-primary"
          : "text-on-surface-variant hover:text-primary",
      )}
    >
      <Icon name={icon} className="text-[24px]" filled={active} />
      <span className="mt-1 text-label-sm">{label}</span>
    </Link>
  );
}

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="pb-safe fixed inset-x-0 bottom-0 z-50 border-t border-outline-variant/30 bg-surface/95 shadow-[0_-4px_20px_rgb(var(--nav-shadow))] backdrop-blur-xl">
      <div className="relative mx-auto flex h-20 w-full max-w-xl items-center justify-between px-1">
        {LEFT.map((item) => (
          <NavItem key={item.href} {...item} active={pathname === item.href} />
        ))}
        <div className="-mt-6 flex flex-col items-center justify-center px-1">
          <Link
            href="/erfassen"
            aria-label="Veränderung erfassen"
            className="flex h-14 w-14 items-center justify-center rounded-full bg-primary-container text-on-primary-fixed shadow-[0_6px_24px_rgba(45,212,191,0.3)] transition-all active:scale-95 active:bg-primary"
          >
            <Icon name="add" className="text-[28px] font-bold" />
          </Link>
          <span className="mt-1 text-label-sm font-semibold text-primary">
            Erfassen
          </span>
        </div>
        {RIGHT.map((item) => (
          <NavItem key={item.href} {...item} active={pathname === item.href} />
        ))}
      </div>
    </nav>
  );
}
