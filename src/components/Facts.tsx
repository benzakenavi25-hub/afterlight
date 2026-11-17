import { useEffect, useRef, useState } from 'react';
import { facts } from '../data/content';
import './Facts.css';

const DURATION = 1200;
const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);

/**
 * Four key figures on the plaster surface. The numbers count up from 0 once, only when they are really
 * visible: the list is ≥ 60% inside the viewport AND not covered (the strip rises over the exterior
 * reveal card, so it can intersect while still hidden). Tabular figures keep their width. Final values
 * are rendered first (no JS / reduced motion / already scrolled past) and are always what assistive
 * tech reads.
 */
export function Facts() {
  const ref = useRef<HTMLElement>(null);
  const listRef = useRef<HTMLDListElement>(null);
  const [p, setP] = useState(1); // 0–1 count progress; 1 = final values

  useEffect(() => {
    const list = listRef.current;
    if (!list || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (!('IntersectionObserver' in window) || list.getBoundingClientRect().bottom < 0) return;
    setP(0);
    let raf = 0;
    let watching = false;

    // Visible = the element at the centre of the list belongs to the list (nothing on top of it).
    const uncovered = () => {
      const r = list.getBoundingClientRect();
      const x = r.left + r.width / 2;
      const y = r.top + r.height / 2;
      if (y < 0 || y > window.innerHeight) return false;
      const hit = document.elementFromPoint(x, y);
      return !!hit && list.contains(hit);
    };
    const count = () => {
      const t0 = performance.now();
      const tick = (now: number) => {
        const t = Math.min(1, (now - t0) / DURATION);
        setP(easeOut(t));
        if (t < 1) raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
    };
    // While ≥ 60% intersects, check each frame until it is uncovered, then count once.
    const watch = () => {
      if (!watching) return;
      if (uncovered()) {
        watching = false;
        io.disconnect();
        count();
        return;
      }
      raf = requestAnimationFrame(watch);
    };
    const io = new IntersectionObserver(
      ([e]) => {
        const on = e.isIntersecting && e.intersectionRatio >= 0.6;
        if (on && !watching) {
          watching = true;
          raf = requestAnimationFrame(watch);
        } else if (!on && watching) {
          watching = false;
          cancelAnimationFrame(raf);
        }
      },
      { threshold: [0, 0.6, 1] },
    );
    io.observe(list);
    return () => {
      watching = false;
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <section ref={ref} id="facts" className="facts" aria-labelledby="facts-title">
      <div className="container">
        <h2 id="facts-title" className="visually-hidden">
          {facts.heading}
        </h2>
        <dl ref={listRef} className="facts__list">
          {facts.items.map((f) => (
            <div key={f.label} className="facts__item">
              <dt className="facts__label">{f.label}</dt>
              <dd className="facts__value">
                <span aria-hidden="true">{Math.round(f.value * p)}</span>
                <span className="visually-hidden">{f.value}</span>
              </dd>
            </div>
          ))}
        </dl>
        <p className="facts__line">{facts.line}</p>
        <p className="facts__note">{facts.note}</p>
      </div>
    </section>
  );
}
