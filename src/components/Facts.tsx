import { useEffect, useRef, useState } from 'react';
import { facts } from '../data/content';
import './Facts.css';

const DURATION = 1200;
const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);

/**
 * Four key figures on the plaster surface. The numbers count up from 0 once, when the section
 * enters; tabular figures keep their width. Final values are rendered first (no JS / reduced
 * motion / already on screen) and are always what assistive tech reads.
 */
export function Facts() {
  const ref = useRef<HTMLElement>(null);
  const [p, setP] = useState(1); // 0–1 count progress; 1 = final values

  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (!('IntersectionObserver' in window) || el.getBoundingClientRect().top < window.innerHeight) return;
    setP(0);
    let raf = 0;
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        io.disconnect();
        const t0 = performance.now();
        const tick = (now: number) => {
          const t = Math.min(1, (now - t0) / DURATION);
          setP(easeOut(t));
          if (t < 1) raf = requestAnimationFrame(tick);
        };
        raf = requestAnimationFrame(tick);
      },
      { threshold: 0.4 },
    );
    io.observe(el);
    return () => {
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
        <dl className="facts__list">
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
