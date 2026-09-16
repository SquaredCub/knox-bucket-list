import { useCallback, useEffect, useState } from 'react';
import { FREE } from '../lib/bingo';

/**
 * A streamer's card progress, saved only in their own browser.
 * The timer counts play time: it only runs between Start and Pause.
 */
type Saved = {
  marked: number[];
  elapsedMs: number; // time banked from earlier sessions
  startedAt: number | null; // set while the timer is running
  everStarted: boolean;
};

const EMPTY: Saved = { marked: [], elapsedMs: 0, startedAt: null, everStarted: false };

function read(key: string): Saved {
  try {
    const raw = localStorage.getItem(key);
    return raw ? { ...EMPTY, ...(JSON.parse(raw) as Partial<Saved>) } : EMPTY;
  } catch {
    return EMPTY;
  }
}

function write(key: string, value: Saved) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Storage can be unavailable (private mode, OBS settings). The card still works for this session.
  }
}

export function useBingoState(playerId: string, limitMs: number) {
  const key = `knox-bingo:${playerId}`;
  const [saved, setSaved] = useState<Saved>(() => read(key));
  const [now, setNow] = useState(() => Date.now());

  const update = useCallback(
    (fn: (s: Saved) => Saved) =>
      setSaved((prev) => {
        const next = fn(prev);
        write(key, next);
        return next;
      }),
    [key],
  );

  const running = saved.startedAt !== null;
  const elapsed = Math.min(limitMs, saved.elapsedMs + (running ? now - saved.startedAt! : 0));
  const timeUp = elapsed >= limitMs;

  // Tick once a second while running
  useEffect(() => {
    if (!running) return;
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, [running]);

  // Stop the clock when time runs out
  useEffect(() => {
    if (running && timeUp) update((s) => ({ ...s, elapsedMs: limitMs, startedAt: null }));
  }, [running, timeUp, limitMs, update]);

  const start = () => {
    setNow(Date.now());
    update((s) => ({ ...s, startedAt: Date.now(), everStarted: true }));
  };
  const pause = () =>
    update((s) => ({
      ...s,
      elapsedMs: Math.min(limitMs, s.elapsedMs + (s.startedAt ? Date.now() - s.startedAt : 0)),
      startedAt: null,
    }));
  const toggle = (index: number) =>
    update((s) => ({
      ...s,
      marked: s.marked.includes(index) ? s.marked.filter((i) => i !== index) : [...s.marked, index],
    }));
  const reset = () => update(() => EMPTY);

  return {
    marked: new Set([FREE, ...saved.marked]),
    remainingMs: limitMs - elapsed,
    running,
    started: saved.everStarted,
    timeUp,
    start,
    pause,
    toggle,
    reset,
  };
}
