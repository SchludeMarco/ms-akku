"use client";

import { useRouter } from "next/navigation";

import { Icon } from "@/components/icon";
import { useSettingsStore } from "@/lib/stores/settings-store";

/** Schließt die Einführung ab und führt zu "Heute". */
export function StartButton() {
  const router = useRouter();
  const completeOnboarding = useSettingsStore((state) => state.completeOnboarding);

  return (
    <button
      type="button"
      onClick={() => {
        completeOnboarding();
        router.replace("/");
      }}
      className="flex h-14 min-h-[56px] w-full items-center justify-center gap-space-xs rounded-2xl bg-cta text-label-lg font-semibold text-on-cta shadow-lg transition-transform active:scale-[0.99]"
    >
      <span>Los geht’s</span>
      <Icon name="arrow_forward" className="text-[20px]" />
    </button>
  );
}
