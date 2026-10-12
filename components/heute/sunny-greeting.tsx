import { Icon } from "@/components/icon";
import { formatLongDate } from "@/lib/dates";

function greeting(date: Date): string {
  const hour = date.getHours();
  if (hour < 5 || hour >= 22) return "Schön, dass du da bist";
  if (hour < 11) return "Guten Morgen";
  if (hour < 18) return "Guten Tag";
  return "Guten Abend";
}

/**
 * Begrüßung nach dem Stitch-Redesign (Gruß, Datum, Datenschutz-Chip), dazu
 * eine weiche Sonne. Die Sonne ist ein ruhender Farbverlauf ohne Bewegung und
 * ohne harte Helligkeit, damit sie freundlich wirkt, ohne zu blenden.
 */
export function SunnyGreeting({ now }: { now: Date }) {
  return (
    <section
      aria-labelledby="greeting-heading"
      className="relative overflow-hidden rounded-2xl p-1"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-12 -top-14 h-44 w-44 rounded-full bg-[radial-gradient(circle,rgb(var(--sun)/var(--sun-core))_0%,rgb(var(--sun)/var(--sun-halo))_38%,transparent_70%)]"
      />
      <div className="relative flex flex-col">
        <div className="mb-1 flex items-center justify-between gap-space-sm">
          <h2 id="greeting-heading" className="text-headline-md text-on-surface">
            {greeting(now)}
          </h2>
          <span className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-surface-container-high/80 text-primary">
            <Icon name="spa" filled className="text-[24px]" />
          </span>
        </div>
        <p className="mb-2 text-body-md text-on-surface-variant">{formatLongDate(now)}</p>
        <div className="inline-flex items-center gap-2 self-start rounded-full border border-outline-variant/30 bg-surface-container-low px-3 py-1.5 text-on-surface-variant shadow-sm">
          <Icon name="verified_user" className="text-[16px] text-secondary" />
          <span className="text-body-sm">Lokal auf diesem Gerät gespeichert</span>
        </div>
      </div>
    </section>
  );
}
