import { cn } from "@/lib/utils";

interface IconProps {
  /** Name des Material-Symbols, z. B. "battery_charging_full". */
  name: string;
  className?: string;
  filled?: boolean;
}

/** Material Symbols Outlined – die Icon-Schrift der Stitch-Vorlage. */
export function Icon({ name, className, filled = false }: IconProps) {
  return (
    <span
      aria-hidden="true"
      className={cn("material-symbols-outlined shrink-0 select-none", className)}
      style={filled ? { fontVariationSettings: "'FILL' 1" } : undefined}
    >
      {name}
    </span>
  );
}
