"use client";

import { useState } from "react";
import Link from "next/link";

import { AppHeader } from "@/components/app-header";
import { Icon } from "@/components/icon";
import {
  FEEDBACK_AREAS,
  FEEDBACK_CATEGORIES,
  MAX_FEEDBACK_LENGTH,
  submitFeedback,
  type FeedbackCategory,
} from "@/lib/feedback";
import { playSuccess, playTick } from "@/lib/sound";
import { cn } from "@/lib/utils";

const ERROR_TEXT: Record<string, string> = {
  not_configured:
    "Der Feedback-Versand ist auf dieser Installation noch nicht eingerichtet. Dein Text wurde nicht gesendet.",
  invalid: "Bitte prüfe deine Eingaben, z. B. die E-Mail-Adresse.",
  upstream: "Das Senden hat nicht geklappt. Dein Text wurde nicht gesendet. Versuch es später noch einmal.",
};

const FIELD =
  "w-full rounded-xl border border-outline-variant/40 bg-surface-container px-3 text-body-md text-on-surface placeholder:text-outline focus:border-primary focus:outline-none";

export default function FeedbackPage() {
  const [category, setCategory] = useState<FeedbackCategory | null>(null);
  const [message, setMessage] = useState("");
  const [area, setArea] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [consent, setConsent] = useState(false);
  const [website, setWebsite] = useState("");
  const [state, setState] = useState<"idle" | "sending" | "sent">("idle");
  const [error, setError] = useState<string | null>(null);

  const selected = FEEDBACK_CATEGORIES.find((item) => item.key === category);
  const canSend = category !== null && message.trim().length > 0 && consent && state === "idle";

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!canSend || category === null) return;
    setState("sending");
    setError(null);
    try {
      await submitFeedback({
        category,
        message: message.trim(),
        area: (area || undefined) as (typeof FEEDBACK_AREAS)[number] | undefined,
        contactEmail: contactEmail.trim(),
        consent: true,
        website,
      });
      playSuccess();
      setState("sent");
    } catch (cause) {
      const code = cause instanceof Error ? cause.message : "upstream";
      setError(ERROR_TEXT[code] ?? ERROR_TEXT.upstream);
      setState("idle");
    }
  }

  if (state === "sent") {
    return (
      <>
        <AppHeader title="Feedback" back />
        <main className="mx-auto flex w-full max-w-xl flex-1 flex-col items-center justify-center gap-space-md px-margin pt-16 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/15 text-primary">
            <Icon name="check" className="text-[36px]" />
          </div>
          <h2 className="text-headline-md text-on-surface">Danke, ist angekommen</h2>
          <p className="text-body-md text-on-surface-variant">
            Dein Feedback wurde gesendet. Jede Rückmeldung hilft, MS Akku besser zu machen.
          </p>
          <Link
            href="/mehr"
            className="flex min-h-touch-lg w-full items-center justify-center rounded-2xl bg-primary text-label-lg font-semibold text-on-primary"
          >
            Zurück
          </Link>
        </main>
      </>
    );
  }

  return (
    <>
      <AppHeader title="Feedback" back />
      <main className="pb-safe mx-auto flex w-full max-w-xl flex-1 flex-col pt-16">
        <form
          onSubmit={handleSubmit}
          className="flex w-full flex-col gap-space-lg px-margin pb-space-xl pt-space-md"
        >
          <p className="text-body-md text-on-surface-variant">
            Sag, was du denkst. Ohne Konto, in einer Minute.
          </p>

          <fieldset className="space-y-space-sm">
            <legend className="mb-space-sm text-label-sm font-semibold uppercase tracking-wider text-primary">
              Worum geht es?
            </legend>
            <div role="radiogroup" className="grid grid-cols-2 gap-space-sm">
              {FEEDBACK_CATEGORIES.map((item) => {
                const on = category === item.key;
                return (
                  <button
                    key={item.key}
                    type="button"
                    role="radio"
                    aria-checked={on}
                    onClick={() => {
                      playTick();
                      setCategory(item.key);
                    }}
                    className={cn(
                      "flex min-h-[64px] items-center gap-3 rounded-xl p-space-sm text-left transition-colors",
                      on
                        ? "border border-primary/50 bg-primary-container text-on-primary-fixed"
                        : "border border-outline-variant/40 bg-surface-container-low text-on-surface",
                    )}
                  >
                    <Icon name={item.icon} className="text-[24px]" />
                    <span className="text-label-lg">{item.label}</span>
                  </button>
                );
              })}
            </div>
          </fieldset>

          <label className="space-y-space-sm">
            <span className="block text-label-sm font-semibold uppercase tracking-wider text-primary">
              {selected?.prompt ?? "Deine Rückmeldung"}
            </span>
            <textarea
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              maxLength={MAX_FEEDBACK_LENGTH}
              rows={6}
              required
              placeholder="Schreib einfach los …"
              className={cn(FIELD, "py-3")}
            />
            <span className="block text-right text-label-sm text-on-surface-variant">
              {message.length} / {MAX_FEEDBACK_LENGTH}
            </span>
          </label>

          <label className="space-y-space-sm">
            <span className="block text-label-sm font-semibold uppercase tracking-wider text-primary">
              Bereich der App (freiwillig)
            </span>
            <select
              value={area}
              onChange={(event) => setArea(event.target.value)}
              className={cn(FIELD, "min-h-[52px]")}
            >
              <option value="">Keine Angabe</option>
              {FEEDBACK_AREAS.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </label>

          <label className="space-y-space-sm">
            <span className="block text-label-sm font-semibold uppercase tracking-wider text-primary">
              E-Mail für Rückfragen (freiwillig)
            </span>
            <input
              type="email"
              value={contactEmail}
              onChange={(event) => setContactEmail(event.target.value)}
              autoComplete="email"
              placeholder="name@beispiel.de"
              className={cn(FIELD, "min-h-[52px]")}
            />
          </label>

          {/* Honeypot gegen automatische Einsendungen, für Menschen unsichtbar. */}
          <input
            type="text"
            name="website"
            value={website}
            onChange={(event) => setWebsite(event.target.value)}
            tabIndex={-1}
            autoComplete="off"
            aria-hidden="true"
            className="hidden"
          />

          <div className="space-y-space-sm rounded-2xl border border-outline-variant/30 bg-surface-container-low p-space-md">
            <div className="flex items-start gap-space-sm">
              <Icon name="lock" className="mt-0.5 text-[20px] text-primary" />
              <div className="space-y-2 text-body-sm leading-relaxed text-on-surface-variant">
                <p>
                  <strong className="text-on-surface">Das wird gesendet:</strong> Kategorie,
                  dein Text, der Bereich und – falls angegeben – deine E-Mail-Adresse.
                </p>
                <p>
                  <strong className="text-on-surface">Das wird nicht gesendet:</strong> deine
                  Einträge, Symptome, Akku-Werte oder andere Daten aus der App.
                </p>
                <p>
                  Schreib bitte nur in den Text, was du teilen möchtest. Angaben zu deiner
                  Gesundheit sind nicht nötig.
                </p>
              </div>
            </div>
            <label className="flex min-h-touch cursor-pointer items-start gap-3">
              <input
                type="checkbox"
                checked={consent}
                onChange={(event) => setConsent(event.target.checked)}
                className="mt-1 h-6 w-6 shrink-0 accent-[rgb(var(--primary-container))]"
              />
              <span className="text-body-sm text-on-surface">
                Ich bin einverstanden, dass diese Angaben an den Betreiber von MS Akku
                übermittelt und zur Bearbeitung meines Feedbacks gespeichert werden.
                Details in der{" "}
                <Link href="/datenschutz" className="text-primary underline underline-offset-4">
                  Datenschutzerklärung
                </Link>
                .
              </span>
            </label>
          </div>

          {error && (
            <p role="alert" className="rounded-xl bg-error-container p-space-sm text-body-sm text-on-error-container">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={!canSend}
            className="flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-primary text-label-lg font-semibold text-on-primary shadow-lg shadow-primary/10 transition-transform active:scale-[0.99] disabled:opacity-40"
          >
            <Icon name="send" className="text-[20px]" />
            {state === "sending" ? "Wird gesendet …" : "Feedback senden"}
          </button>
        </form>
      </main>
    </>
  );
}
