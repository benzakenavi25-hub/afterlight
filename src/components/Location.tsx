import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { location } from '../data/content';
import { location as cfg } from '../data/media';
import './Location.css';

/** Positions in the 400×320 drawing (not a real map). Label anchor: 'end' = text to the left in RTL. */
const POINTS: Record<string, { x: number; y: number; lx: number; ly: number; anchor: 'start' | 'end' }> = {
  sea: { x: 70, y: 120, lx: 70, ly: 98, anchor: 'start' },
  promenade: { x: 143, y: 232, lx: 158, ly: 262, anchor: 'end' },
  center: { x: 318, y: 92, lx: 318, ly: 70, anchor: 'start' },
};
const HOME = { x: 176, y: 160 };
const COAST = 'M 150 0 C 118 52, 176 96, 146 150 S 112 250, 160 320';
/** Thin wave lines on the sea side (left of the coast). */
const WAVES = [
  'M 18 58 q 10 -5 20 0 t 20 0 t 20 0',
  'M 36 178 q 10 -5 20 0 t 20 0 t 20 0',
  'M 12 268 q 10 -5 20 0 t 20 0 t 20 0',
  'M 56 300 q 8 -4 16 0 t 16 0',
];

const REDUCED_QUERY = '(prefers-reduced-motion: reduce)';
const SHORT_QUERY = '(max-height: 32em)';
const WIDE_QUERY = '(min-width: 62.5rem)';

function useMedia(query: string): boolean {
  const [matches, setMatches] = useState(() => window.matchMedia(query).matches);
  useEffect(() => {
    const mq = window.matchMedia(query);
    const onChange = () => setMatches(mq.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, [query]);
  return matches;
}

/**
 * Coastal-city location — "the camera pulls back, then a walk". Pinned (CSS sticky) and scrubbed:
 * (a) close on the home, the map pulls back and the bronze coastline draws; (b) a small bronze dot walks
 * from the home along the dashed line to each place with a minutes counter beside it, and the place's
 * label lights up on arrival; (c) thin wave lines on the sea side drift with the scroll.
 * The drawing is decorative; the same information is in the visually hidden description and list.
 * Reduced motion / short screens / no GSAP / content that does not fit: the final map with every label.
 */
export function Location() {
  const reduced = useMedia(REDUCED_QUERY);
  const short = useMedia(SHORT_QUERY);
  const wide = useMedia(WIDE_QUERY);
  const [failed, setFailed] = useState(false);
  const anim = !reduced && !short && !failed;

  const ref = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!anim) return;
    let cancelled = false;
    let revert: (() => void) | null = null;
    const init = async () => {
      let gsapMod: typeof import('gsap');
      let stMod: typeof import('gsap/ScrollTrigger');
      try {
        [gsapMod, stMod] = await Promise.all([import('gsap'), import('gsap/ScrollTrigger')]);
        await document.fonts.ready;
      } catch {
        if (!cancelled) setFailed(true);
        return;
      }
      if (cancelled) return;
      const section = ref.current!;
      const stage = stageRef.current!;
      const grid = gridRef.current!;
      if (grid.scrollHeight > grid.clientHeight + 2) {
        setFailed(true);
        return;
      }
      const { gsap } = gsapMod;
      const { ScrollTrigger } = stMod;
      gsap.registerPlugin(ScrollTrigger);
      ScrollTrigger.config({ ignoreMobileResize: true });

      const ctx = gsap.context(() => {
        const svg = svgRef.current!;
        const cam = svg.querySelector('.location__cam')!;
        const coast = svg.querySelector('.location__coast')!;
        const homePt = svg.querySelector('.location__pt--home')!;
        const pts = gsap.utils.toArray<SVGGElement>('.location__pt--place', svg);
        const walker = svg.querySelector('.location__walker')!;
        const count = svg.querySelector<SVGTextElement>('.location__count')!;
        const waves = gsap.utils.toArray<SVGPathElement>('.location__wave', svg);
        const unit = location.minutesUnit;
        const setCount = (v: number) => (count.textContent = `${Math.round(v)} ${unit}`);

        gsap.set(cam, { svgOrigin: `${HOME.x} ${HOME.y}`, scale: cfg.zoom });
        gsap.set(coast, { strokeDashoffset: 1 });
        gsap.set(pts, { autoAlpha: 0.22 });
        gsap.set(walker, { x: HOME.x, y: HOME.y, autoAlpha: 0 });
        gsap.set(homePt, { autoAlpha: 1 });

        const tl = gsap.timeline({
          defaults: { ease: 'none' },
          scrollTrigger: {
            trigger: section,
            start: 'top top',
            end: () => '+=' + Math.max(1, section.offsetHeight - stage.offsetHeight),
            scrub: true,
            invalidateOnRefresh: true,
          },
        });

        // (a) pull back + coastline
        const [z0, z1] = cfg.phases.zoom;
        tl.to(cam, { scale: 1, ease: 'power1.inOut', duration: z1 - z0 }, z0);
        const [c0, c1] = cfg.phases.coast;
        tl.to(coast, { strokeDashoffset: 0, duration: c1 - c0 }, c0);

        // (b) walks: home → place, minutes counter, label lights up on arrival
        location.places.forEach((p, i) => {
          const [a, b] = cfg.phases.walks[i];
          const pt = POINTS[p.id];
          const d = b - a;
          const proxy = { v: 0 };
          tl.fromTo(walker, { x: HOME.x, y: HOME.y }, { x: pt.x, y: pt.y, ease: 'power1.inOut', duration: d, immediateRender: false }, a);
          tl.to(walker, { autoAlpha: 1, duration: d * 0.12 }, a);
          tl.fromTo(proxy, { v: 0 }, { v: p.minutes, duration: d, immediateRender: false, onUpdate: () => setCount(proxy.v) }, a);
          tl.to(pts[i], { autoAlpha: 1, duration: d * 0.18 }, b - d * 0.08);
          tl.to(walker, { autoAlpha: 0, duration: d * 0.12 }, b);
        });

        // (c) waves drift gently over the whole sequence, alternating directions
        waves.forEach((w, i) => tl.fromTo(w, { x: -cfg.waveDrift }, { x: cfg.waveDrift * (i % 2 ? -1 : 1), duration: 1 }, 0));
        tl.to({}, { duration: Math.max(0, 1 - tl.duration()) }, tl.duration());
      }, section);

      if (document.readyState !== 'complete') window.addEventListener('load', () => ScrollTrigger.refresh(), { once: true });
      ScrollTrigger.refresh();
      section.dataset.ready = 'true';
      revert = () => {
        ctx.revert();
        delete section.dataset.ready;
      };
    };
    void init();
    return () => {
      cancelled = true;
      revert?.();
    };
  }, [anim, wide]);

  const style = { '--travel': wide ? cfg.scroll.wide : cfg.scroll.narrow } as CSSProperties;

  return (
    <section
      ref={ref}
      id="location"
      className={'location' + (anim ? ' location--anim' : '')}
      style={style}
      aria-labelledby="location-title"
    >
      <div ref={stageRef} className="location__stage">
        <div ref={gridRef} className="container location__grid">
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

          <div className="location__map" aria-hidden="true">
            <svg ref={svgRef} viewBox="0 0 400 320" className="location__svg">
              <g className="location__cam">
                {WAVES.map((d) => (
                  <path key={d} d={d} className="location__wave" />
                ))}
                {/* direction + unicode-bidi on the element itself; no letter-spacing (it split the
                    Hebrew word into reversed letters in SVG) */}
                <text x="40" y="240" className="location__sea" direction="rtl" unicodeBidi="plaintext">
                  {location.sea}
                </text>
                <path d={COAST} pathLength={1} className="location__coast" />
                {location.places.map((p, i) => {
                  const pt = POINTS[p.id];
                  return (
                    <g key={p.id} className="location__pt location__pt--place" data-i={i}>
                      <line x1={HOME.x} y1={HOME.y} x2={pt.x} y2={pt.y} className="location__link" />
                      <circle cx={pt.x} cy={pt.y} r="4" className="location__dot" />
                      <text x={pt.lx} y={pt.ly} textAnchor={pt.anchor === 'start' ? 'middle' : 'end'} className="location__name">
                        {p.name} · <tspan className="location__time">{p.time}</tspan>
                      </text>
                    </g>
                  );
                })}
                <g className="location__pt location__pt--home">
                  <circle cx={HOME.x} cy={HOME.y} r="13" className="location__ring" />
                  <circle cx={HOME.x} cy={HOME.y} r="5.5" className="location__home" />
                  <text x={HOME.x + 22} y={HOME.y + 6} textAnchor="end" className="location__name">
                    {location.home}
                  </text>
                </g>
                {anim && (
                  <g className="location__walker">
                    <circle r="4.5" className="location__step" />
                    <text x="-10" y="-10" textAnchor="start" className="location__count" direction="rtl">
                      0 {location.minutesUnit}
                    </text>
                  </g>
                )}
              </g>
            </svg>
          </div>
        </div>
      </div>
    </section>
  );
}
