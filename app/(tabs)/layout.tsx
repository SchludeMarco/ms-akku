"use client";

import { useEffect, useSyncExternalStore } from "react";
import { useRouter } from "next/navigation";

import { BottomNav } from "@/components/bottom-nav";
import { useSettingsStore } from "@/lib/stores/settings-store";

const subscribe = () => () => {};

export default function TabsLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const router = useRouter();
  // Die Einstellungen liegen in localStorage und sind erst im Browser bekannt.
  const isClient = useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );
  const onboardingCompleted = useSettingsStore(
    (state) => state.onboardingCompleted,
  );

  useEffect(() => {
    if (isClient && !onboardingCompleted) router.replace("/willkommen");
  }, [isClient, onboardingCompleted, router]);

  if (!isClient || !onboardingCompleted) return null;

  return (
    <>
      {children}
      <BottomNav />
    </>
  );
}
