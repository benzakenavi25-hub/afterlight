import { useEffect, useState } from 'react';
import './ElevatorDoors.css';

const OPEN_MS = 900; // keep in sync with the transition in ElevatorDoors.css
const POSTER_WAIT_MS = 1500; // never wait longer than this for the poster

/**
 * Elevator-doors intro: two code-drawn panels meet at the centre and slide apart over the hero.
 * Whether it plays is decided before first paint by the inline script in index.html
 * (sets html[data-doors="pending"]): on every load/refresh, never with reduced motion. Overlay is inert, never blocks scroll or
 * clicks, takes no layout space, and is removed when the motion ends.
 */
export function ElevatorDoors() {
  const [phase, setPhase] = useState<'closed' | 'open' | 'done'>(() =>
    document.documentElement.dataset.doors === 'pending' ? 'closed' : 'done',
  );

  // Open as soon as the hero poster is decoded (no blank reveal), at most POSTER_WAIT_MS later.
  useEffect(() => {
    if (phase !== 'closed') return;
    let opened = false;
    let raf = 0;
    const open = () => {
      if (opened) return;
      opened = true;
      // two frames: make sure the closed state was painted so the transition actually runs
      raf = requestAnimationFrame(() => {
        raf = requestAnimationFrame(() => setPhase('open'));
      });
    };

    const poster = document.querySelector<HTMLImageElement>('.hero__poster');
    (poster?.decode?.() ?? Promise.resolve()).then(open, open);
    const waitTimer = window.setTimeout(open, POSTER_WAIT_MS);

    return () => {
      window.clearTimeout(waitTimer);
      cancelAnimationFrame(raf);
    };
  }, [phase]);

  // Safety net in case transitionend never fires (tab hidden, no transform support).
  useEffect(() => {
    if (phase !== 'open') return;
    const t = window.setTimeout(() => setPhase('done'), OPEN_MS + 400);
    return () => window.clearTimeout(t);
  }, [phase]);

  useEffect(() => {
    if (phase === 'done') delete document.documentElement.dataset.doors;
  }, [phase]);

  if (phase === 'done') return null;

  return (
    <div className="doors" data-open={phase === 'open'} aria-hidden="true" inert>
      <div className="doors__panel doors__panel--left" />
      <div
        className="doors__panel doors__panel--right"
        onTransitionEnd={(e) => {
          if (e.propertyName === 'transform') setPhase('done');
        }}
      />
    </div>
  );
}
