"use client";

import { useState } from "react";
import { useLiveQuery } from "dexie-react-hooks";

import { Icon } from "@/components/icon";
import { db, newId, type Activity } from "@/lib/db";
import { addDays, formatTime, startOfDay } from "@/lib/dates";
import { playSuccess, playTick } from "@/lib/sound";
import { cn } from "@/lib/utils";

const EFFORT_STYLES: Record<Activity["effort"], { tile: string; badge: string }> = {
  leicht: {
    tile: "text-primary",
    badge: "border-primary/30 bg-primary/15 text-primary",
  },
  mittel: {
    tile: "text-secondary",
    badge: "border-secondary/30 bg-secondary-container/20 text-secondary",
  },
  anstrengend: {
    tile: "text-tertiary",
    badge: "border-tertiary/30 bg-tertiary/15 text-tertiary",
  },
};

const EFFORTS: Activity["effort"][] = ["leicht", "mittel", "anstrengend"];

const ICON_KEYWORDS: [RegExp, string][] = [
  [/einkauf|markt/i, "shopping_basket"],
  [/kaffee|besuch|treffen/i, "coffee"],
  [/essen|koch/i, "restaurant"],
  [/spazier|gehen|lauf/i, "directions_walk"],
  [/arzt|praxis|therapie|physio/i, "medical_services"],
  [/arbeit|büro|meeting/i, "work"],
  [/sport|yoga|training/i, "fitness_center"],
  [/putz|haushalt|wäsche/i, "cleaning_services"],
  [/pause|ruhe|schlaf/i, "bedtime"],
];

export function activityIcon(title: string): string {
  return ICON_KEYWORDS.find(([pattern]) => pattern.test(title))?.[1] ?? "event";
}

function defaultTime(now: Date): string {
  const hour = Math.min(now.getHours() + 1, 23);
  return `${String(hour).padStart(2, "0")}:00`;
}

export function DayPlan({ now }: { now: Date }) {
  const activities = useLiveQuery(() => {
    const from = startOfDay(now);
    return db.activities
      .where("timestamp")
      .between(from.toISOString(), addDays(from, 1).toISOString(), true, false)
      .sortBy("timestamp");
  }, [now]);

  const [formOpen, setFormOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [time, setTime] = useState(() => defaultTime(now));
  const [effort, setEffort] = useState<Activity["effort"]>("leicht");

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!title.trim()) return;

    const [hours, minutes] = time.split(":").map(Number);
    const timestamp = startOfDay(now);
    timestamp.setHours(hours, minutes);

    await db.activities.add({
      id: newId(),
      title: title.trim(),
      timestamp: timestamp.toISOString(),
      effort,
      completed: false,
    });
    playSuccess();
    setTitle("");
    setFormOpen(false);
  }

  async function toggleCompleted(activity: Activity) {
    await db.activities.update(activity.id, { completed: !activity.completed });
    playTick();
  }

  const count = activities?.length ?? 0;

  return (
    <section aria-labelledby="day-plan-heading" className="space-y-2">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h3 id="day-plan-heading" className="text-headline-sm text-on-surface">
            Dein Tag
          </h3>
          <p className="text-body-sm text-on-surface-variant">
            Geplante Aktivitäten &amp; persönlicher Aufwand
          </p>
        </div>
        {count > 0 && (
          <span className="inline-flex shrink-0 items-center rounded-md border border-outline-variant/30 bg-surface-container-high px-2.5 py-1 text-label-sm text-on-surface-variant">
            {count} {count === 1 ? "Termin" : "Termine"}
          </span>
        )}
      </div>

      <div className="space-y-2">
        {activities?.length === 0 && (
          <div className="flex items-center gap-3 rounded-xl border border-dashed border-outline-variant/40 bg-surface-container-low p-4">
            <Icon name="event_available" className="text-[24px] text-primary" />
            <p className="text-body-sm text-on-surface-variant">
              Noch nichts geplant. Ein freier Tag ist auch ein guter Plan.
            </p>
          </div>
        )}

        {activities?.map((activity) => {
          const styles = EFFORT_STYLES[activity.effort];
          return (
            <button
              key={activity.id}
              type="button"
              aria-pressed={activity.completed}
              onClick={() => toggleCompleted(activity)}
              className={cn(
                "flex w-full items-center justify-between gap-3 rounded-xl border border-outline-variant/30 bg-surface-container p-4 text-left shadow-sm transition-all active:bg-surface-container-high",
                activity.completed && "opacity-60",
              )}
            >
              <div className="flex min-w-0 items-center gap-4">
                <div
                  className={cn(
                    "flex min-h-[48px] w-12 shrink-0 flex-col items-center justify-center rounded-lg border border-outline-variant/20 bg-surface-container-low",
                    styles.tile,
                  )}
                >
                  <span className="text-label-sm font-semibold">
                    {formatTime(activity.timestamp)}
                  </span>
                  <Icon
                    name={activity.completed ? "check_circle" : activityIcon(activity.title)}
                    className="text-[18px]"
                  />
                </div>
                <div className="flex min-w-0 flex-col">
                  <h4
                    className={cn(
                      "truncate text-label-lg text-on-surface",
                      activity.completed && "line-through",
                    )}
                  >
                    {activity.title}
                  </h4>
                  <span className="truncate text-body-sm text-on-surface-variant">
                    {activity.completed
                      ? "Erledigt"
                      : (activity.note ?? "Antippen, wenn erledigt")}
                  </span>
                </div>
              </div>
              <span
                className={cn(
                  "inline-flex shrink-0 items-center rounded-full border px-3 py-1.5 text-label-sm font-medium",
                  styles.badge,
                )}
              >
                {activity.effort}
              </span>
            </button>
          );
        })}
      </div>

      {formOpen ? (
        <form
          onSubmit={handleSubmit}
          className="space-y-4 rounded-xl border border-primary/40 bg-surface-container-low p-4 shadow-lg"
        >
          <div className="flex gap-2">
            <label className="flex min-w-0 flex-1 flex-col gap-1.5">
              <span className="text-label-sm text-on-surface-variant">Was hast du vor?</span>
              <input
                autoFocus
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                placeholder="z. B. Einkaufen"
                className="min-h-[48px] w-full rounded-lg border border-outline-variant/40 bg-surface-container px-3 text-body-md text-on-surface placeholder:text-outline focus:border-primary focus:outline-none"
              />
            </label>
            <label className="flex flex-col gap-1.5">
              <span className="text-label-sm text-on-surface-variant">Uhrzeit</span>
              <input
                type="time"
                value={time}
                onChange={(event) => setTime(event.target.value)}
                className="min-h-[48px] rounded-lg border border-outline-variant/40 bg-surface-container px-3 text-body-md text-on-surface focus:border-primary focus:outline-none"
              />
            </label>
          </div>

          <div className="flex flex-col gap-1.5">
            <span className="text-label-sm text-on-surface-variant">
              Persönlicher Aufwand
            </span>
            <div role="radiogroup" aria-label="Aufwand" className="grid grid-cols-3 gap-2">
              {EFFORTS.map((option) => (
                <button
                  key={option}
                  type="button"
                  role="radio"
                  aria-checked={effort === option}
                  onClick={() => setEffort(option)}
                  className={cn(
                    "min-h-[48px] rounded-lg text-label-md transition-all",
                    effort === option
                      ? "border border-primary/50 bg-primary-container font-semibold text-on-primary-fixed shadow-sm"
                      : "border border-outline-variant/40 bg-surface-container text-on-surface",
                  )}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setFormOpen(false)}
              className="min-h-[52px] flex-1 rounded-xl border border-outline-variant/30 bg-surface-container-high text-label-lg text-on-surface"
            >
              Abbrechen
            </button>
            <button
              type="submit"
              disabled={!title.trim()}
              className="flex min-h-[52px] flex-1 items-center justify-center gap-2 rounded-xl bg-primary-container text-label-lg font-bold text-on-primary-container shadow-lg shadow-primary-container/20 transition-all active:scale-[0.99] disabled:opacity-50"
            >
              <Icon name="check" className="text-[20px]" />
              Planen
            </button>
          </div>
        </form>
      ) : (
        <button
          type="button"
          onClick={() => setFormOpen(true)}
          className="flex min-h-[54px] w-full items-center justify-center gap-2 rounded-xl border border-outline-variant/30 bg-surface-container-high text-label-lg text-primary transition-colors hover:bg-surface-bright active:bg-surface-bright"
        >
          <Icon name="calendar_add_on" className="text-[22px]" />
          <span>+ Aktivität planen</span>
        </button>
      )}
    </section>
  );
}
