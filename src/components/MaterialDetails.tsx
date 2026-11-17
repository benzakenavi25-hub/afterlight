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

/**
 * Materials as layered samples. The three materials are always a plain list in the DOM (image + alt,
 * name, line). In `stack` mode the same list is laid out on one CSS-sticky stage (subgrid: every item
 * shares the frame and caption cells) and one scrubbed GSAP timeline lays each photo over the previous
 * one from the bottom up (clip-path inset), with a slow zoom inside it, a thin shadow on the incoming
 * edge, the caption swapping and a three-part bronze progress line. Fully reversible.
 * `flow` (reduced motion, short viewports, content that would not fit, GSAP failure): the previous
 * cards — horizontal snap row on phones, three in a row on desktop.
 */
export function MaterialDetails() {
  const wide = useMedia(WIDE_QUERY);
  const reduced = useMedia(REDUCED_QUERY);
  const short = useMedia(SHORT_QUERY);
  const [engineFailed, setEngineFailed] = useState(false);
  const [overflow, setOverflow] = useState(false);
  const mode = reduced || short || engineFailed || overflow ? 'flow' : 'stack';

  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => setOverflow(false), [wide]);

  useEffect(() => {
    if (mode !== 'stack') return;
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
        const layers = gsap.utils.toArray<HTMLElement>('.mat__layer', section);
        const inners = gsap.utils.toArray<HTMLElement>('.mat__inner', section);
        const edges = gsap.utils.toArray<HTMLElement>('.mat__edge', section);
        const caps = gsap.utils.toArray<HTMLElement>('.mat__cap', section);
        const bars = gsap.utils.toArray<HTMLElement>('.mat__bar', section);
        const off = cfg.textOffset;
        const T = cfg.transitions;

        gsap.set(layers, { clipPath: (i: number) => (i === 0 ? 'inset(0% 0% 0% 0%)' : 'inset(100% 0% 0% 0%)') });
        gsap.set(inners, { scale: cfg.zoom });
        gsap.set(edges, { yPercent: 100, autoAlpha: 1 });
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

        // Each photo zooms from its reveal start until the next one starts covering it (or the end).
        const starts = [0, ...T.map(([a]) => a)];
        const ends = [...T.map(([a]) => a), 1];
        inners.forEach((el, i) => {
          const from = i === 0 ? 0 : starts[i];
          const to = i < T.length ? T[i][1] : 1;
          tl.to(el, { scale: 1, duration: to - from }, from);
        });
        // Progress: one bronze segment per material, filling while it is the current one.
        bars.forEach((el, i) => tl.to(el, { scaleX: 1, duration: ends[i] - starts[i] }, starts[i]));

        T.forEach(([a, b], i) => {
          const d = b - a;
          // the next sample is laid over from the bottom up; its top edge carries a thin shadow
          tl.to(layers[i + 1], { clipPath: 'inset(0% 0% 0% 0%)', duration: d }, a);
          tl.to(edges[i + 1], { yPercent: 0, duration: d }, a);
          tl.to(edges[i + 1], { autoAlpha: 0, duration: d * 0.25 }, b - d * 0.25);
          // caption: previous out in the first part, next in during the last part
          tl.to(caps[i], { autoAlpha: 0, y: -off, duration: d * 0.4 }, a);
          tl.to(caps[i + 1], { autoAlpha: 1, y: 0, duration: d * 0.4 }, a + d * 0.6);
        });
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

  const stack = mode === 'stack';
  const style = {
    '--travel': wide ? cfg.scroll.wide : cfg.scroll.narrow,
    '--frame-narrow': cfg.frameNarrow,
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
          {/* flow on phones/tablets: one horizontal snap row (focusable for keyboard scrolling) */}
          <ul
            className="materials__list"
            tabIndex={stack ? undefined : 0}
            aria-label={stack ? undefined : materials.listLabel}
          >
            {materials.items.map((m, i) => (
              <li key={m.still} className="materials__item">
                <div className="mat__layer">
                  <div className="mat__inner">
                    <ResponsiveImage
                      still={stills[m.still]}
                      sizes={
                        stack
                          ? '(min-width: 62.5rem) 55vw, 100vw'
                          : '(min-width: 62.5rem) 28vw, (min-width: 40rem) 45vw, 85vw'
                      }
                      className="materials__img"
                    />
                  </div>
                  <span className="mat__edge" aria-hidden="true" />
                </div>
                <div className="mat__cap">
                  <h3 className="materials__name">
                    <span className="mat__num latin">{num(i)}</span>
                    <span aria-hidden="true"> — </span>
                    {m.name}
                  </h3>
                  <p className="materials__text">{m.text}</p>
                </div>
              </li>
            ))}
          </ul>
          {stack && (
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
