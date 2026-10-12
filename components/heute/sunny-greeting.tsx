import { Icon } from "@/components/icon";
import { formatLongDate } from "@/lib/dates";

function greeting(date: Date): { hello: string; line: string } {
  const hour = date.getHours();
  if (hour < 5 || hour >= 22) {
    return { hello: "Schön, dass du da bist", line: "Gönn dir Ruhe. Morgen ist auch ein Tag." };
  }
  if (hour < 11) {
    return { hello: "Guten Morgen", line: "Ein neuer Tag in deinem Tempo." };
  }
  if (hour < 18) {
    return { hello: "Schön, dass du da bist", line: "Ein Schritt nach dem anderen." };
  }
  return { hello: "Guten Abend", line: "Du darfst den Tag ausklingen lassen." };
}

/**
 * Einladende Begrüßung mit einer weichen Sonne. Die Sonne ist ein ruhender
 * Farbverlauf ohne Bewegung und ohne harte Helligkeit, damit sie freundlich
 * wirkt, ohne zu blenden.
 */
export function SunnyGreeting({ now }: { now: Date }) {
  const { hello, line } = greeting(now);

  return (
    <section
      aria-labelledby="greeting-heading"
      className="relative overflow-hidden rounded-2xl border border-outline-variant/30 bg-surface-container-low p-5 shadow-sm"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-10 -top-12 h-44 w-44 rounded-full bg-[radial-gradient(circle,rgb(var(--sun)/var(--sun-core))_0%,rgb(var(--sun)/var(--sun-halo))_38%,transparent_70%)]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(120deg,transparent_45%,rgb(var(--sun)/var(--sun-wash))_100%)]"
      />
      <div className="relative flex flex-col gap-1 pr-16">
        <span className="text-label-sm font-semibold uppercase tracking-wider text-primary">
          {hello}
        </span>
        <h2
          id="greeting-heading"
          className="text-[26px] font-bold leading-[34px] tracking-[-0.015em] text-on-surface"
        >
          {formatLongDate(now)}
        </h2>
        <p className="text-body-md text-on-surface-variant">{line}</p>
      </div>
      <span className="relative mt-3 inline-flex items-center gap-1 rounded-full border border-outline-variant/30 bg-surface-container-high px-2 py-1 text-label-sm text-on-surface-variant">
        <Icon name="verified_user" className="text-[16px] text-primary" />
        Lokal geschützt
      </span>
    </section>
  );
}
