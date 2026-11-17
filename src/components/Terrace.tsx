import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { terrace } from '../data/content';
import { stills, terrace as cfg } from '../data/media';
import { ResponsiveImage } from './ResponsiveImage';
import { useScrollTone } from '../useScrollTone';
import './Terrace.css';

const WIDE_QUERY = '(min-width: 62.5rem)';

/**
 * The terrace panorama in a frame wider than the screen: while the section passes through the viewport
 * the photo pans sideways (scrubbed, no pin) from the sofa and lantern to the towers and the sea, ending
 * on the horizon. Text below fades in towards the end. Reduced motion / GSAP failure: a static crop.
 */
export function Terrace() {
  const ref = useRef<HTMLElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const [pan, setPan] = useState(() => !window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  // Plaster → ivory while the area below the photograph rises from the bottom edge to 55% of the
  // screen; the text fades in with it (CSS), so it is never dark-on-dark.
  useScrollTone(ref, 1, 0.55, textRef);

  useEffect(() => {
    if (!pan) return;
    let cancelled = false;
    let revert: (() => void) | null = null;
    const init = async () => {
      let gsapMod: typeof import('gsap');
      let stMod: typeof import('gsap/ScrollTrigger');
      try {
        [gsapMod, stMod] = await Promise.all([import('gsap'), import('gsap/ScrollTrigger')]);
      } catch {
        if (!cancelled) setPan(false);
        return;
      }
      if (cancelled) return;
      const { gsap } = gsapMod;
      const { ScrollTrigger } = stMod;
      gsap.registerPlugin(ScrollTrigger);
      ScrollTrigger.config({ ignoreMobileResize: true });
      const frame = frameRef.current!;
      const img = frame.querySelector('img')!;
      const mm = gsap.matchMedia();
      mm.add({ wide: WIDE_QUERY, narrow: `not all and ${WIDE_QUERY}` }, (c) => {
        const d = c.conditions!.wide ? cfg.pan.distance.wide : cfg.pan.distance.narrow;
        // Available sideways overflow (px), negative = photo moves left
        const travel = () => -Math.max(0, img.offsetWidth - frame.clientWidth) * d;
        const ltr = cfg.pan.direction === 'ltr';
        gsap.fromTo(
          img,
          { x: () => (ltr ? 0 : travel()) },
          {
            x: () => (ltr ? travel() : 0),
            ease: 'none',
            scrollTrigger: {
              trigger: frame,
              start: cfg.pan.start,
              end: cfg.pan.end,
              scrub: true,
              invalidateOnRefresh: true,
            },
          },
        );
      });
      if (!img.complete) img.addEventListener('load', () => ScrollTrigger.refresh(), { once: true });
      revert = () => mm.revert();
    };
    void init();
    return () => {
      cancelled = true;
      revert?.();
    };
  }, [pan]);

  const { pan: p } = cfg;
  const style = {
    '--pano-ratio': p.ratio,
    '--h-wide': p.height.wide,
    '--h-narrow': p.height.narrow,
    '--crop-wide': p.cropBottom.wide,
    '--crop-narrow': p.cropBottom.narrow,
    '--static-pos': p.staticPosition,
  } as CSSProperties;
  const sizes = `(min-width: 62.5rem) calc(${p.height.wide}vh * ${(p.ratio * (1 + p.cropBottom.wide)).toFixed(2)}), calc(${p.height.narrow}vh * ${(p.ratio * (1 + p.cropBottom.narrow)).toFixed(2)})`;

  return (
    <section ref={ref} className={'terrace' + (pan ? ' terrace--pan' : '')} style={style} aria-labelledby="terrace-title">
      <figure className="terrace__figure">
        <div ref={frameRef} className="terrace__frame">
          <ResponsiveImage still={stills[cfg.still]} sizes={pan ? sizes : '100vw'} className="terrace__img" />
        </div>
        <figcaption className="visually-hidden">{terrace.caption}</figcaption>
      </figure>
      <div ref={textRef} className="container terrace__text">
        <p className="terrace__label latin" lang="en">
          {terrace.label}
        </p>
        <h2 id="terrace-title" className="ruled">{terrace.heading}</h2>
        <p className="terrace__copy">{terrace.text}</p>
      </div>
    </section>
  );
}
