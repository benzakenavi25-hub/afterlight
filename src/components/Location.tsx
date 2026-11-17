import { useRef, type CSSProperties } from 'react';
import { location } from '../data/content';
import { useScrollTone } from '../useScrollTone';
import './Location.css';

/** Positions in the 400×320 drawing (not a real map). Label anchor: 'end' = text to the left in RTL. */
const POINTS: Record<string, { x: number; y: number; lx: number; ly: number; anchor: 'start' | 'end' }> = {
  sea: { x: 70, y: 120, lx: 70, ly: 98, anchor: 'start' },
  promenade: { x: 143, y: 232, lx: 158, ly: 262, anchor: 'end' },
  center: { x: 318, y: 92, lx: 318, ly: 70, anchor: 'start' },
};
const HOME = { x: 176, y: 160 };
const COAST = 'M 150 0 C 118 52, 176 96, 146 150 S 112 250, 160 320';

/**
 * Coastal-city location. A code-drawn illustration: the bronze coastline draws with scroll
 * (useScrollTone → --tone → stroke-dashoffset), then the home and the three places appear in turn.
 * The drawing is decorative; the same information is in the visually hidden description and list.
 * Reduced motion / no JS: fully drawn.
 */
export function Location() {
  const ref = useRef<HTMLElement>(null);
  const mapRef = useRef<HTMLDivElement>(null);
  useScrollTone(ref, 0.95, 0.3, mapRef);

  return (
    <section ref={ref} id="location" className="location" aria-labelledby="location-title">
      <div className="container location__grid">
        <div className="location__text">
          <p className="location__label latin" lang="en">
            {location.label}
          </p>
          <h2 id="location-title" className="ruled">
            {location.heading}
          </h2>
          <p className="location__copy">{location.text}</p>
          <div className="visually-hidden">
            <p>{location.mapDescription}</p>
            <ul>
              {location.places.map((p) => (
                <li key={p.id}>
                  {p.name}: {p.time}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div ref={mapRef} className="location__map" aria-hidden="true">
          <svg viewBox="0 0 400 320" className="location__svg">
            <text x="40" y="240" className="location__sea">
              {location.sea}
            </text>
            <path d={COAST} pathLength={1} className="location__coast" />
            <g className="location__pt" style={{ '--at': 0.55 } as CSSProperties}>
              <circle cx={HOME.x} cy={HOME.y} r="13" className="location__ring" />
              <circle cx={HOME.x} cy={HOME.y} r="5.5" className="location__home" />
              <text x={HOME.x + 22} y={HOME.y + 6} textAnchor="end" className="location__name">
                {location.home}
              </text>
            </g>
            {location.places.map((p, i) => {
              const pt = POINTS[p.id];
              return (
                <g key={p.id} className="location__pt" style={{ '--at': 0.68 + i * 0.1 } as CSSProperties}>
                  <line x1={HOME.x} y1={HOME.y} x2={pt.x} y2={pt.y} className="location__link" />
                  <circle cx={pt.x} cy={pt.y} r="4" className="location__dot" />
                  <text x={pt.lx} y={pt.ly} textAnchor={pt.anchor === 'start' ? 'middle' : 'end'} className="location__name">
                    {p.name} · <tspan className="location__time">{p.time}</tspan>
                  </text>
                </g>
              );
            })}
          </svg>
        </div>
      </div>
    </section>
  );
}
