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
 * (photo + alt, name, line). In `zoom` mode a CSS-sticky stage shows the living room with three
 * numbered bronze spots; one scrubbed GSAP timeline, per material: spotlight on the spot, a gentle camera
 * zoom (≤ 2x, the room never disappears), at the peak a square sample card pops in beside the spot with a
 * thin bronze line to it, then it leaves, a short pull-back and on to the next spot. A minimap shows
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
    let placeRef: (() => void) | null = null;

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
        const dots = gsap.utils.toArray<HTMLElement>('.mat__dot', section);
        const lights = gsap.utils.toArray<HTMLElement>('.mat__light', section);
        const samples = gsap.utils.toArray<HTMLElement>('.mat__sample', section);
        const cards = gsap.utils.toArray<HTMLElement>('.mat__card', section);
        const lines = gsap.utils.toArray<HTMLElement>('.mat__line', section);
        const caps = gsap.utils.toArray<HTMLElement>('.mat__cap', section);
        const bars = gsap.utils.toArray<HTMLElement>('.mat__bar', section);
        const off = cfg.textOffset;
        const n = cards.length;
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

        /**
         * Sample card placement (static per layout, never animated): where spot i lands at the zoom
         * peak, in frame px, then the card on the free side of it (more room first; horizontal before
         * vertical), clamped inside the frame. The leader line runs from the dot's ring to the card edge.
         */
        const place = () => {
          const { W, H, cw, ch, ox, oy } = geo();
          const frameBox = frame.getBoundingClientRect();
          const c = W * (window.matchMedia(WIDE_QUERY).matches ? cfg.card.wide : cfg.card.narrow);
          const { gap: g, margin: m } = cfg.card;
          for (let i = 0; i < n; i++) {
            const t = camAt(i, cfg.zoom);
            const px = ox + t.x + (cfg.zoom * cfg.spots[i].x * cw) / 100;
            const py = oy + t.y + (cfg.zoom * cfg.spots[i].y * ch) / 100;
            const card = cards[i];
            card.style.inlineSize = c + 'px';
            const capH = card.offsetHeight - c; // label under the swatch
            const hy = clamp(py - c / 2, m, Math.max(m, H - c - capH - m));
            const vx = clamp(px - c / 2, m, Math.max(m, W - c - m));
            const opts = [
              { x: px + g, y: hy, slack: W - m - (px + g + c) },
              { x: px - g - c, y: hy, slack: px - g - c - m },
              { x: vx, y: py + g, slack: H - m - (py + g + c + capH) },
              { x: vx, y: py - g - c - capH, slack: py - g - c - capH - m },
            ];
            const horiz = opts[0].slack >= opts[1].slack ? [opts[0], opts[1]] : [opts[1], opts[0]];
            const vert = opts[2].slack >= opts[3].slack ? [opts[2], opts[3]] : [opts[3], opts[2]];
            const pick = [...horiz, ...vert].find((o) => o.slack >= 0) ?? [...opts].sort((a, b) => b.slack - a.slack)[0];
            // wrapper (grid cell) may sit offset from the frame on desktop: convert to wrapper px
            const wrap = samples[i].getBoundingClientRect();
            const dx = frameBox.left - wrap.left;
            const dy = frameBox.top - wrap.top;
            card.style.left = dx + pick.x + 'px';
            card.style.top = dy + pick.y + 'px';
            // line: from the dot ring to the nearest point of the swatch
            const qx = clamp(px, pick.x, pick.x + c);
            const qy = clamp(py, pick.y, pick.y + c);
            const len = Math.hypot(qx - px, qy - py);
            const r = 20; // dot radius + ring
            const ang = Math.atan2(qy - py, qx - px);
            const line = lines[i];
            line.style.left = dx + px + Math.cos(ang) * r + 'px';
            line.style.top = dy + py + Math.sin(ang) * r + 'px';
            line.style.inlineSize = Math.max(0, len - r) + 'px';
            gsap.set(line, { rotation: (ang * 180) / Math.PI });
          }
        };
        place();
        placeRef = place;

        gsap.set(cam, { transformOrigin: '0 0' });
        gsap.set(box, { transformOrigin: '0 0' });
        gsap.set([...lights, ...cards, map], { autoAlpha: 0 });
        gsap.set(cards, { scale: 0.92, transformOrigin: '50% 50%' });
        gsap.set(lines, { scaleX: 0, transformOrigin: '0 50%' });
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
          const [c0, c1] = P.cardIn;
          const [k0, k1] = P.cardOut;
          const [o0, o1] = P.out;
          const zq = (z1 - z0) * 0.3;
          const last = i === n - 1;
          const others = dots.filter((_, j) => j !== i);

          // (a) spotlight (the rest of the room darkens)
          tl.to(lights[i], { autoAlpha: 1, duration: dur(s0, s1) }, at(s0));
          if (i > 0) tl.to(caps[i], { autoAlpha: 1, y: 0, duration: dur(s0, s1) }, at(s0));
          tl.to(bars[i], { scaleX: 1, duration: seg }, at(0));

          // (b) gentle camera zoom into the spot; the other dots leave, this one is counter-scaled so it
          // keeps its size; the minimap comes in
          tl.to(cam, { x: () => camAt(i, cfg.zoom).x, y: () => camAt(i, cfg.zoom).y, scale: cfg.zoom, ease: 'power1.inOut', duration: dur(z0, z1) }, at(z0));
          tl.to(dots[i], { scale: 1 / cfg.zoom, ease: 'power1.inOut', duration: dur(z0, z1) }, at(z0));
          tl.fromTo(
            box,
            { xPercent: () => boxAt(null, 1).xPercent, yPercent: () => boxAt(null, 1).yPercent, scaleX: () => boxAt(null, 1).scaleX, scaleY: () => boxAt(null, 1).scaleY },
            { xPercent: () => boxAt(i, cfg.zoom).xPercent, yPercent: () => boxAt(i, cfg.zoom).yPercent, scaleX: () => boxAt(i, cfg.zoom).scaleX, scaleY: () => boxAt(i, cfg.zoom).scaleY, ease: 'power1.inOut', duration: dur(z0, z1), immediateRender: false },
            at(z0),
          );
          tl.to(others, { autoAlpha: 0, duration: dur(0, zq) }, at(z0));
          tl.to(map, { autoAlpha: 1, duration: dur(0, zq) }, at(z0));

          // (c) at the peak: the sample card pops in beside the spot, the line draws to it
          tl.to(cards[i], { autoAlpha: 1, scale: 1, ease: 'power2.out', duration: dur(c0, c1) }, at(c0));
          tl.to(lines[i], { scaleX: 1, ease: 'power1.out', duration: dur(c0, c1) }, at(c0));

          if (last) continue;
          // (d) card out (reverse), then a short pull-back and on to the next spot
          tl.to(cards[i], { autoAlpha: 0, scale: 0.92, ease: 'power2.in', duration: dur(k0, k1) }, at(k0));
          tl.to(lines[i], { scaleX: 0, ease: 'power1.in', duration: dur(k0, k1) }, at(k0));
          const od = o1 - o0;
          tl.to(cam, { x: 0, y: 0, scale: 1, ease: 'power1.inOut', duration: dur(o0, o1) }, at(o0));
          tl.to(dots[i], { scale: 1, ease: 'power1.inOut', duration: dur(o0, o1) }, at(o0));
          tl.to(box, { xPercent: () => boxAt(null, 1).xPercent, yPercent: () => boxAt(null, 1).yPercent, scaleX: () => boxAt(null, 1).scaleX, scaleY: () => boxAt(null, 1).scaleY, ease: 'power1.inOut', duration: dur(o0, o1) }, at(o0));
          tl.to(map, { autoAlpha: 0, duration: dur(0, od * 0.3) }, at(o1 - od * 0.3));
          tl.to(lights[i], { autoAlpha: 0, duration: dur(o0, o1) }, at(o0));
          tl.to(others, { autoAlpha: 1, duration: dur(0, od * 0.4) }, at(o1 - od * 0.4));
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
          else {
            placeRef?.();
            ScrollTrigger.refresh();
          }
        });
      });
      ro.observe(grid);
      if (document.readyState !== 'complete')
        window.addEventListener('load', () => (placeRef?.(), ScrollTrigger.refresh()), { once: true });
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
    '--narrow-h': cfg.narrowHeight + 'svh',
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
                {zoom ? (
                  // Sample card beside the spot at the zoom peak; placed by the engine (px), hidden until then
                  <div className="mat__sample">
                    <span className="mat__line" aria-hidden="true" />
                    <div className="mat__card">
                      <div className="mat__swatch">
                        <ResponsiveImage still={stills[m.sample]} sizes="(min-width: 62.5rem) 18vw, 42vw" className="materials__img" />
                      </div>
                      <p className="mat__label" aria-hidden="true">
                        <bdi className="latin">{num(i)}</bdi> · {m.name}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="mat__layer">
                    <div className="mat__inner">
                      <ResponsiveImage
                        still={stills[m.still]}
                        sizes="(min-width: 62.5rem) 28vw, (min-width: 40rem) 45vw, 85vw"
                        className="materials__img"
                      />
                    </div>
                  </div>
                )}
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
