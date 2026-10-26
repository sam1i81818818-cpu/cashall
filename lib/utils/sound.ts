// Universal Soothing & Melodious Sound Engine for CashALL Admin & Agent Panels
// Uses Web Audio API with soft harmonic sine waves, acoustic marimba/bell resonance,
// smooth envelope decay, and zero harsh or jarring frequencies.

let globalAudioCtx: AudioContext | null = null;
const SOUND_STORAGE_KEY = "cashall_panel_sound_enabled";

/**
 * Returns the singleton AudioContext, safely handling browser autoplay policies.
 */
export function getAudioContext(): AudioContext | null {
  if (typeof window === "undefined") return null;
  try {
    const AudioCtxClass =
      window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioCtxClass) return null;

    if (!globalAudioCtx || globalAudioCtx.state === "closed") {
      globalAudioCtx = new AudioCtxClass();
    }

    if (globalAudioCtx.state === "suspended") {
      globalAudioCtx.resume().catch(() => {});
    }

    return globalAudioCtx;
  } catch (err) {
    console.warn("[CashALL Sound] Web Audio initialization warning:", err);
    return null;
  }
}

// Global user interaction listener to unlock AudioContext automatically
if (typeof window !== "undefined") {
  const unlockAudio = () => {
    try {
      const ctx = getAudioContext();
      if (ctx && ctx.state === "suspended") {
        ctx.resume().catch(() => {});
      }
    } catch {}
  };

  window.addEventListener("click", unlockAudio, { passive: true });
  window.addEventListener("touchstart", unlockAudio, { passive: true });
  window.addEventListener("keydown", unlockAudio, { passive: true });
}

/**
 * Checks if sound alert is enabled in user preferences (defaults to true).
 */
export function isSoundAlertEnabled(): boolean {
  if (typeof window === "undefined") return true;
  try {
    const val = localStorage.getItem(SOUND_STORAGE_KEY);
    return val === null ? true : val === "true";
  } catch {
    return true;
  }
}

/**
 * Sets sound alert enabled/disabled in localStorage.
 */
export function setSoundAlertEnabled(enabled: boolean): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(SOUND_STORAGE_KEY, enabled ? "true" : "false");
  } catch {}
}

interface NoteConfig {
  freq: number;
  delayMs: number;
  durationMs: number;
  gain: number;
}

/**
 * Plays an individual smooth harmonic bell note with pure sine tones,
 * warm acoustic overtones, and soft exponential decay.
 */
function playHarmonicBellNote(
  ctx: AudioContext,
  freq: number,
  startSec: number,
  durationSec: number,
  peakGain: number = 0.25
) {
  try {
    const now = startSec;

    // Gentle low-pass filter to keep timbre warm, velvety, and soothing
    const filter = ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.setValueAtTime(3200, now);
    filter.Q.setValueAtTime(0.7, now);
    filter.connect(ctx.destination);

    // Master Gain for this note
    const gainNode = ctx.createGain();
    gainNode.gain.setValueAtTime(0.0001, now);
    // 20ms gentle attack (eliminates clicks/pops)
    gainNode.gain.linearRampToValueAtTime(peakGain, now + 0.02);
    // Smooth natural exponential decay
    gainNode.gain.exponentialRampToValueAtTime(0.0001, now + durationSec);
    gainNode.connect(filter);

    // Fundamental Tone (Sine wave)
    const osc1 = ctx.createOscillator();
    osc1.type = "sine";
    osc1.frequency.setValueAtTime(freq, now);
    osc1.connect(gainNode);

    // Subtle 2nd harmonic (one octave higher) at soft volume for airy crystal brilliance
    const osc2 = ctx.createOscillator();
    const overtoneGain = ctx.createGain();
    overtoneGain.gain.setValueAtTime(peakGain * 0.22, now);
    overtoneGain.gain.exponentialRampToValueAtTime(0.0001, now + durationSec * 0.7);

    osc2.type = "sine";
    osc2.frequency.setValueAtTime(freq * 2, now);
    osc2.connect(overtoneGain);
    overtoneGain.connect(filter);

    osc1.start(now);
    osc2.start(now);

    osc1.stop(now + durationSec + 0.05);
    osc2.stop(now + durationSec + 0.05);
  } catch (e) {
    console.warn("[CashALL Sound] Note playback note error:", e);
  }
}

/**
 * Plays a soothing, pleasant, melodious chime alert.
 * 
 * Available presets:
 * - "new_order": Warm 3-note ascending marimba/bell triad (E5 -> G#5 -> B5 + sparkle). Highly pleasant, cheerful, and noticeable without being intrusive.
 * - "update": Soft 2-note reassuring confirmation chime (D5 -> A5). Smooth and gentle.
 * - "gentle_bell": Single soft crystal ding (C6).
 */
export function playMelodiousChime(
  preset: "new_order" | "update" | "gentle_bell" = "new_order",
  ignoreMute: boolean = false
): boolean {
  if (!ignoreMute && !isSoundAlertEnabled()) {
    return false;
  }

  const ctx = getAudioContext();
  if (!ctx) return false;

  try {
    if (ctx.state === "suspended") {
      ctx.resume().catch(() => {});
    }

    const baseTime = ctx.currentTime + 0.02;

    if (preset === "new_order") {
      // 3-note soothing harmonic progression: E5 (659Hz) -> G#5 (830Hz) -> B5 (987Hz)
      // Feels like a luxury hotel concierge chime or Apple high-end notification
      const notes: NoteConfig[] = [
        { freq: 659.25, delayMs: 0, durationMs: 750, gain: 0.26 },
        { freq: 830.61, delayMs: 140, durationMs: 800, gain: 0.28 },
        { freq: 987.77, delayMs: 290, durationMs: 1200, gain: 0.32 },
        // High soft harmonic shimmer (E6)
        { freq: 1318.51, delayMs: 310, durationMs: 900, gain: 0.12 },
      ];

      for (const note of notes) {
        const start = baseTime + note.delayMs / 1000;
        playHarmonicBellNote(ctx, note.freq, start, note.durationMs / 1000, note.gain);
      }
      return true;
    }

    if (preset === "update") {
      // 2-note subtle confirmation: D5 (587Hz) -> A5 (880Hz)
      const notes: NoteConfig[] = [
        { freq: 587.33, delayMs: 0, durationMs: 500, gain: 0.22 },
        { freq: 880.0, delayMs: 130, durationMs: 750, gain: 0.26 },
      ];

      for (const note of notes) {
        const start = baseTime + note.delayMs / 1000;
        playHarmonicBellNote(ctx, note.freq, start, note.durationMs / 1000, note.gain);
      }
      return true;
    }

    if (preset === "gentle_bell") {
      // Single soft crystal chime: C6 (1046Hz)
      playHarmonicBellNote(ctx, 1046.5, baseTime, 0.8, 0.24);
      return true;
    }

    return false;
  } catch (err) {
    console.warn("[CashALL Sound] Chime error:", err);
    return false;
  }
}

/**
 * Triggers a test chime (ignoring mute so user can preview and unlock browser audio).
 */
export function testMelodiousChime(preset: "new_order" | "update" = "new_order"): boolean {
  return playMelodiousChime(preset, true);
}
