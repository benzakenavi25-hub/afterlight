import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { materials } from '../data/content';
import { materials as cfg, stills } from '../data/media';
import { ResponsiveImage } from './ResponsiveImage';
import './MaterialDetails.css';

const WIDE_QUERY = '(min-width: 62.5rem)';
const REDUCED_QUERY = '(prefers-reduced-motion: reduce)';
/** Landscape phones / very short windows / large text: pinning would clip content (em follows text size). */
const SHORT_QUERY = '(max-height: 32em)';

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

const num = (i: number) => String(i + 1).padStart(2, '0');
const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));

/**
 * Materials — "from the room to the detail". The three materials are always a plain list in the DOM
 * (detail photo + alt, name, line). In `zoom` mode a CSS-sticky stage shows the living room with three
 * numbered bronze spots; one scrubbed GSAP timeline, per material: spotlight on the spot, a thin leader
 * line with its label, the camera zooms into the spot (transform on the room), at the peak the list's
 * detail photo crossfades in (sharp), then a short pull-back and on to the next spot. A minimap shows
 * where the camera is. Fully reversible.
 * `flow` (reduced motion, short viewports, content that would not fit, GSAP failure): three cards.
 */
export function MaterialDetails() {
  const wide = useMedia(WIDE_QUERY);
  const reduced = useMedia(REDUCED_QUERY);
  const short = useMedia(SHORT_QUERY);
  const [engineFailed, setEngineFailed] = useState(false);
  const [overflow, setOverflow] = useState(false);
  const mode = reduced || short || engineFailed || overflow ? 'flow' : 'zoom';

  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => setOverflow(false), [wide]);

  useEffect(() => {
    if (mode !== 'zoom') return;
    let cancelled = false;
    let raf = 0;
    let ro: ResizeObserver | null = null;
    let revert: (() => void) | null = null;

    const init = async () => {
      let gsapMod: typeof import('gsap');
      let stMod: typeof import('gsap/ScrollTrigger');
      try {
        [gsapMod, stMod] = await Promise.all([import('gsap'), import('gsap/ScrollTrigger')]);
        await document.fonts.ready;
      } catch {
        if (!cancelled) setEngineFailed(true);
        return;
      }
      if (cancelled) return;

      const section = sectionRef.current!;
      const stage = stageRef.current!;
      const grid = gridRef.current!;
      const fits = () => grid.scrollHeight <= grid.clientHeight + 2;
      if (!fits()) {
        setOverflow(true);
        return;
      }

      const { gsap } = gsapMod;
      const { ScrollTrigger } = stMod;
      gsap.registerPlugin(ScrollTrigger);
      ScrollTrigger.config({ ignoreMobileResize: true });

      const ctx = gsap.context(() => {
        const frame = section.querySelector<HTMLElement>('.mat__view')!;
        const cam = section.querySelector<HTMLElement>('.mat__cam')!;
        const box = section.querySelector<HTMLElement>('.mat__mapbox')!;
        const map = section.querySelector<HTMLElement>('.mat__map')!;
        const dots = section.querySelector<HTMLElement>('.mat__dots')!;
        const lights = gsap.utils.toArray<HTMLElement>('.mat__light', section);
        const calls = gsap.utils.toArray<HTMLElement>('.mat__call', section);
        const layers = gsap.utils.toArray<HTMLElement>('.mat__layer', section);
        const inners = gsap.utils.toArray<HTMLElement>('.mat__inner', section);
        const caps = gsap.utils.toArray<HTMLElement>('.mat__cap', section);
        const bars = gsap.utils.toArray<HTMLElement>('.mat__bar', section);
        const off = cfg.textOffset;
        const n = layers.length;
        const seg = 1 / n;
        const P = cfg.phases;

        // Camera: cam is the whole photo (CSS cover inside the frame, origin top-left). Zoom `s` on a
        // spot = translate so the spot sits mid-frame, clamped so the photo always covers the frame.
        const geo = () => ({
          W: frame.clientWidth,
          H: frame.clientHeight,
          cw: cam.offsetWidth,
          ch: cam.offsetHeight,
          ox: cam.offsetLeft,
          oy: cam.offsetTop,
        });
        const camAt = (i: number, s: number) => {
          const { W, H, cw, ch, ox, oy } = geo();
          const { x, y } = cfg.spots[i];
          return {
            x: clamp(W / 2 - ox - (s * x * cw) / 100, W - ox - s * cw, -ox),
            y: clamp(H / 2 - oy - (s * y * ch) / 100, H - oy - s * ch, -oy),
          };
        };
        // Minimap frame = the visible part of the photo, in photo fractions.
        const boxAt = (i: number | null, s: number) => {
          const { W, H, cw, ch, ox, oy } = geo();
          const t = i === null ? { x: 0, y: 0 } : camAt(i, s);
          return {
            xPercent: ((-ox - t.x) / (s * cw)) * 100,
            yPercent: ((-oy - t.y) / (s * ch)) * 100,
            scaleX: W / (s * cw),
            scaleY: H / (s * ch),
          };
        };

        gsap.set(cam, { transformOrigin: '0 0' });
        gsap.set(box, { transformOrigin: '0 0' });
        gsap.set([...lights, ...calls, ...layers, map], { autoAlpha: 0 });
        gsap.set(inners, { scale: 1.06 });
        gsap.set(caps, { y: (i: number) => (i === 0 ? 0 : off), autoAlpha: (i: number) => (i === 0 ? 1 : 0) });
        gsap.set(bars, { scaleX: 0 });

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

        for (let i = 0; i < n; i++) {
          const at = (p: number) => (i + p) * seg;
          const dur = (a: number, b: number) => (b - a) * seg;
          const [s0, s1] = P.spot;
          const [z0, z1] = P.zoom;
          const [d0, d1] = P.detail;
          const [o0, o1] = P.out;
          const zq = (z1 - z0) * 0.3;
          const last = i === n - 1;

          // (a) spotlight, (b) leader line + label
          tl.to(lights[i], { autoAlpha: 1, duration: dur(s0, s1) }, at(s0));
          tl.to(calls[i], { autoAlpha: 1, duration: dur(s0 + (s1 - s0) * 0.4, s1) }, at(s0 + (s1 - s0) * 0.4));
          if (i > 0) tl.to(caps[i], { autoAlpha: 1, y: 0, duration: dur(s0, s1) }, at(s0));
          tl.to(bars[i], { scaleX: 1, duration: seg }, at(0));

          // (c) camera zoom into the spot; dots, label and line leave early, the minimap comes in
          tl.to(cam, { x: () => camAt(i, cfg.zoom).x, y: () => camAt(i, cfg.zoom).y, scale: cfg.zoom, ease: 'power1.inOut', duration: dur(z0, z1) }, at(z0));
          tl.fromTo(
            box,
            { xPercent: () => boxAt(null, 1).xPercent, yPercent: () => boxAt(null, 1).yPercent, scaleX: () => boxAt(null, 1).scaleX, scaleY: () => boxAt(null, 1).scaleY },
            { xPercent: () => boxAt(i, cfg.zoom).xPercent, yPercent: () => boxAt(i, cfg.zoom).yPercent, scaleX: () => boxAt(i, cfg.zoom).scaleX, scaleY: () => boxAt(i, cfg.zoom).scaleY, ease: 'power1.inOut', duration: dur(z0, z1), immediateRender: false },
            at(z0),
          );
          tl.to([calls[i], dots], { autoAlpha: 0, duration: dur(0, zq) }, at(z0));
          tl.to(map, { autoAlpha: 1, duration: dur(0, zq) }, at(z0));

          // (d) at the peak: crossfade to the sharp detail photo
          tl.to(layers[i], { autoAlpha: 1, duration: dur(d0, d1) }, at(d0));
          tl.to(inners[i], { scale: 1, duration: dur(d0, last ? 1 : o0) }, at(d0));

          if (last) continue;
          // (e) short pull-back, on to the next spot
          const od = o1 - o0;
          tl.to(layers[i], { autoAlpha: 0, duration: dur(0, od * 0.3) }, at(o0));
          tl.to(cam, { x: 0, y: 0, scale: 1, ease: 'power1.inOut', duration: dur(o0, o1) }, at(o0));
          tl.to(box, { xPercent: () => boxAt(null, 1).xPercent, yPercent: () => boxAt(null, 1).yPercent, scaleX: () => boxAt(null, 1).scaleX, scaleY: () => boxAt(null, 1).scaleY, ease: 'power1.inOut', duration: dur(o0, o1) }, at(o0));
          tl.to(map, { autoAlpha: 0, duration: dur(0, od * 0.3) }, at(o1 - od * 0.3));
          tl.to(lights[i], { autoAlpha: 0, duration: dur(o0, o1) }, at(o0));
          tl.to(dots, { autoAlpha: 1, duration: dur(0, od * 0.4) }, at(o1 - od * 0.4));
          tl.to(caps[i], { autoAlpha: 0, y: -off, duration: dur(0, od * 0.5) }, at(o0));
        }
        tl.to({}, { duration: Math.max(0, 1 - tl.duration()) }, tl.duration());
      }, section);

      let first = true;
      ro = new ResizeObserver(() => {
        if (first) {
          first = false;
          return;
        }
        cancelAnimationFrame(raf);
        raf = requestAnimationFrame(() => {
          if (!fits()) setOverflow(true);
          else ScrollTrigger.refresh();
        });
      });
      ro.observe(grid);
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
      cancelAnimationFrame(raf);
      ro?.disconnect();
      revert?.();
    };
  }, [mode, wide]);

  const zoom = mode === 'zoom';
  const room = stills['gallery-living'];
  const ratio = room.width / room.height;
  const style = {
    '--travel': wide ? cfg.scroll.wide : cfg.scroll.narrow,
    '--room-ratio': ratio,
    '--narrow-ratio': cfg.narrowRatio,
    '--fx': cfg.focus.x / 100,
    '--fy': cfg.focus.y / 100,
  } as CSSProperties;

  return (
    <section ref={sectionRef} className={'materials materials--' + mode} style={style} aria-labelledby="materials-title">
      <div ref={stageRef} className="mat__stage">
        <div ref={gridRef} className="container mat__grid">
          <div className="mat__head">
            <p className="materials__word latin" lang="en" aria-hidden="true">
              {materials.label}
            </p>
            <h2 id="materials-title" className="materials__title ruled">
              {materials.heading}
            </h2>
          </div>

          {zoom && (
            <div className="mat__room">
              <div className="mat__view">
              <div className="mat__cam">
                <ResponsiveImage still={room} sizes="(min-width: 62.5rem) 60vw, 140vw" alt="" className="mat__roomimg" />
                {cfg.spots.map((s, i) => (
                  <span
                    key={'l' + i}
                    className="mat__light"
                    aria-hidden="true"
                    style={{
                      background: `radial-gradient(ellipse ${cfg.spotRadius * 100}% ${cfg.spotRadius * 100 * ratio}% at ${s.x}% ${s.y}%, rgb(0 0 0 / 0) 55%, rgb(12 10 8 / ${cfg.dim}) 100%)`,
                    }}
                  />
                ))}
                <div className="mat__dots" aria-hidden="true">
                  {cfg.spots.map((s, i) => (
                    <span key={'d' + i} className="mat__dot latin" style={{ left: s.x + '%', top: s.y + '%' }}>
                      {num(i)}
                    </span>
                  ))}
                </div>
                {cfg.spots.map((s, i) => (
                  <span
                    key={'c' + i}
                    className={'mat__call' + (s.x < 50 ? ' mat__call--r' : ' mat__call--l')}
                    aria-hidden="true"
                    style={{ left: s.x + '%', top: s.y + '%' }}
                  >
                    <span className="mat__lead" />
                    <span className="mat__tag">
                      <bdi className="latin">{num(i)}</bdi> · {materials.items[i]?.name}
                    </span>
                  </span>
                ))}
              </div>
              </div>
              <div className="mat__map" aria-hidden="true">
                <ResponsiveImage still={room} sizes="160px" alt="" className="mat__mapimg" />
                <span className="mat__mapbox" />
              </div>
            </div>
          )}

          {/* flow on phones/tablets: one horizontal snap row (focusable for keyboard scrolling) */}
          <ul className="materials__list" tabIndex={zoom ? undefined : 0} aria-label={zoom ? undefined : materials.listLabel}>
            {materials.items.map((m, i) => (
              <li key={m.still} className="materials__item">
                <div className="mat__layer">
                  <div className="mat__inner">
                    <ResponsiveImage
                      still={stills[m.still]}
                      sizes={zoom ? '(min-width: 62.5rem) 60vw, 100vw' : '(min-width: 62.5rem) 28vw, (min-width: 40rem) 45vw, 85vw'}
                      className="materials__img"
                    />
                  </div>
                </div>
                <div className="mat__cap">
                  <h3 className="materials__name">
                    <span className="mat__num latin">{num(i)}</span>
                    <span aria-hidden="true"> · </span>
                    {m.name}
                  </h3>
                  <p className="materials__text">{m.text}</p>
                </div>
              </li>
            ))}
          </ul>

          {zoom && (
            <div className="mat__progress" aria-hidden="true">
              {materials.items.map((m) => (
                <span key={m.still} className="mat__seg">
                  <span className="mat__bar" />
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
