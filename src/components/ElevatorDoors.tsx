import { useEffect, useState } from 'react';
import './ElevatorDoors.css';

const OPEN_MS = 900; // keep in sync with the transition in ElevatorDoors.css
const POSTER_WAIT_MS = 1500; // never wait longer than this for the poster
const SETTLE_MS = 1800; // html[data-doors] stays until the headline has finished entering (900 delay + 700)

/**
 * Elevator-doors intro: two code-drawn panels meet at the centre of the tour card and slide apart (the card clips them).
 * Whether it plays is decided before first paint by the inline script in index.html
 * (sets html[data-doors="pending"]): on every load/refresh, never with reduced motion or a #hash. Inert, never
 * blocks scroll or clicks, takes no layout space, removed when the motion ends. Scrolling before it opened
 * opens it at once. While open, the card scales 0.98 → 1 and the headline enters (ElevatorDoors.css).
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

    // Scrolling starts the tour: never hold it back
    window.addEventListener('scroll', open, { once: true, passive: true });
    if (window.scrollY > 2) open();

    const poster = document.querySelector<HTMLImageElement>('.hero__poster');
    (poster?.decode?.() ?? Promise.resolve()).then(open, open);
    const waitTimer = window.setTimeout(open, POSTER_WAIT_MS);

    return () => {
      window.clearTimeout(waitTimer);
      window.removeEventListener('scroll', open);
      cancelAnimationFrame(raf);
    };
  }, [phase]);

  // Safety net in case transitionend never fires (tab hidden, no transform support).
  useEffect(() => {
    if (phase !== 'open') return;
    const t = window.setTimeout(() => setPhase('done'), OPEN_MS + 400);
    return () => window.clearTimeout(t);
  }, [phase]);

  // html[data-doors]: 'open' while the doors move and the headline settles, then removed (no cleanup on
  // purpose: the timer must outlive this component, which unmounts when the doors are done).
  useEffect(() => {
    const root = document.documentElement;
    if (phase === 'open') root.dataset.doors = 'open';
    if (phase === 'done') window.setTimeout(() => delete root.dataset.doors, SETTLE_MS);
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
