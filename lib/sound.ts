import { useSettingsStore } from "@/lib/stores/settings-store";

// Kurze UI-Töne werden per Web Audio API synthetisiert statt als Audiodateien
// ausgeliefert – passend zum Local-First-Ansatz der App (keine Assets, kein
// Netzwerk nötig). Der AudioContext wird erst bei der ersten Nutzerinteraktion
// erzeugt, um die Autoplay-Policies der Browser einzuhalten.

let audioContext: AudioContext | null = null;

function getContext(): AudioContext | null {
  if (typeof window === "undefined") return null;

  const AudioContextCtor =
    window.AudioContext ??
    (window as unknown as { webkitAudioContext?: typeof AudioContext })
      .webkitAudioContext;
  if (!AudioContextCtor) return null;

  if (!audioContext) {
    audioContext = new AudioContextCtor();
  }
  if (audioContext.state === "suspended") {
    void audioContext.resume();
  }
  return audioContext;
}

function isSoundEnabled(): boolean {
  return useSettingsStore.getState().soundEnabled;
}

function playTone(
  ctx: AudioContext,
  frequency: number,
  startOffset: number,
  duration: number,
  peakGain: number,
) {
  const oscillator = ctx.createOscillator();
  const gain = ctx.createGain();

  oscillator.type = "sine";
  oscillator.frequency.value = frequency;

  const startTime = ctx.currentTime + startOffset;
  gain.gain.setValueAtTime(0, startTime);
  gain.gain.linearRampToValueAtTime(peakGain, startTime + 0.01);
  gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

  oscillator.connect(gain);
  gain.connect(ctx.destination);
  oscillator.start(startTime);
  oscillator.stop(startTime + duration + 0.02);
}

/** Dezenter Klick, z. B. beim Verstellen des Akkustand-Reglers. */
export function playTick(): void {
  if (!isSoundEnabled()) return;
  const ctx = getContext();
  if (!ctx) return;
  playTone(ctx, 720, 0, 0.05, 0.05);
}

/** Aufsteigender Zweiklang zur Bestätigung einer gespeicherten Aktion. */
export function playSuccess(): void {
  if (!isSoundEnabled()) return;
  const ctx = getContext();
  if (!ctx) return;
  playTone(ctx, 523.25, 0, 0.12, 0.08);
  playTone(ctx, 783.99, 0.08, 0.18, 0.08);
}

/** Kurzer Bestätigungston – wird nach dem Umschalten der Audiosignale gespielt. */
export function playToggleFeedback(): void {
  if (!isSoundEnabled()) return;
  const ctx = getContext();
  if (!ctx) return;
  playTone(ctx, 659.25, 0, 0.1, 0.07);
}
