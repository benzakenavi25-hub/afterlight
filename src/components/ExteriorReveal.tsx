import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { revealCopy } from '../data/content';
import { reveal as cfg, stills } from '../data/media';
import { ResponsiveImage } from './ResponsiveImage';
import './ExteriorReveal.css';

const WIDE_QUERY = '(min-width: 62.5rem)';
const REDUCED_QUERY = '(prefers-reduced-motion: reduce)';
const FONT_STACK = '"Barlow Semi Condensed", "Arial Narrow", Arial, sans-serif';
const LINES = ['AFTER', 'LIGHT'] as const;
const LINE_GAP = 0.09; // between the two lines, in em
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

/** Geometry of the letter "T" in the loaded font, as ratios of the font size. */
interface StemMetrics {
  cap: number; // cap height
  stemW: number; // stem width
  stemTop: number; // stem top, above baseline
  stemBottom: number; // stem bottom, above baseline (about 0)
  stemCx: number; // stem centre, measured from the glyph origin
}

/**
 * The zoom must land inside solid ink. The T's vertical stem is one filled rectangle, so its size
 * is measured from real pixels of the font in use (canvas), not assumed.
 */
function measureStem(): StemMetrics | null {
  const size = 400;
  const ox = 100;
  const base = 500;
  const canvas = document.createElement('canvas');
  canvas.width = 700;
  canvas.height = 700;
  const ctx = canvas.getContext('2d');
  if (!ctx) return null;
  ctx.font = '800 ' + size + 'px ' + FONT_STACK;
  ctx.textBaseline = 'alphabetic';
  ctx.fillStyle = '#000';
  ctx.fillText('T', ox, base);
  const { data, width, height } = ctx.getImageData(0, 0, canvas.width, canvas.height);

  const rows: { y: number; min: number; max: number }[] = [];
  for (let y = 0; y < height; y++) {
    let min = -1;
    let max = -1;
    for (let x = 0; x < width; x++) {
      if (data[(y * width + x) * 4 + 3] > 127) {
        if (min < 0) min = x;
        max = x;
      }
    }
    if (min >= 0) rows.push({ y, min, max });
  }
  if (rows.length < 10) return null;

  const widths = rows.map((r) => r.max - r.min + 1);
  const minW = Math.min(...widths);
  const stemRows = rows.filter((_, i) => widths[i] <= minW * 1.15);
  const first = stemRows[0].y;
  const last = stemRows[stemRows.length - 1].y + 1;
  const cx = stemRows.reduce((s, r) => s + (r.min + r.max + 1) / 2, 0) / stemRows.length - ox;

  return {
    cap: (rows[rows.length - 1].y + 1 - rows[0].y) / size,
    stemW: minW / size,
    stemTop: (base - first) / size,
    stemBottom: (base - last) / size,
    stemCx: cx / size,
  };
}

interface Layout {
  S: number; // final mask scale
  fx: number; // zoom focus (inside the T stem)
  fy: number;
  dx: number; // translation that brings the focus to the screen centre
  dy: number;
}

/**
 * Letters to facade. A dark veil with the two-line name cut out (SVG mask) sits over one full-screen
 * photograph. Scrolling grows only the cut-out (transform on the mask group) around a point inside
 * the T's stem until the opening exceeds the screen; the photo itself never scales.
 *
 * The stage is pinned with CSS sticky (same as the tour, so there are never two pins fighting);
 * GSAP ScrollTrigger only maps scroll position to timeline progress (scrub: true = no smoothing,
 * nothing keeps moving after the visitor stops).
 */
export function ExteriorReveal() {
  const wide = useMedia(WIDE_QUERY);
  const reduced = useMedia(REDUCED_QUERY);
  const [engineFailed, setEngineFailed] = useState(false);
  const [imgFailed, setImgFailed] = useState(false);

  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const wordRef = useRef<SVGGElement>(null);
  const stemRef = useRef<SVGRectElement>(null);
  const veilRef = useRef<SVGGElement>(null);
  const wallRef = useRef<HTMLDivElement>(null);
  const kickerRef = useRef<HTMLParagraphElement>(null);
  const finalRef = useRef<HTMLDivElement>(null);
  const shadeRef = useRef<HTMLDivElement>(null);

  const mode = imgFailed ? 'plain' : reduced || engineFailed ? 'static' : 'scrub';

  // A failed photo must never block the page: fall back to a plain dark block with the name.
  useEffect(() => {
    const img = stageRef.current?.querySelector('img');
    if (!img) return;
    if (img.complete && img.naturalWidth === 0) setImgFailed(true);
    const onError = () => setImgFailed(true);
    img.addEventListener('error', onError);
    return () => img.removeEventListener('error', onError);
  }, []);

  useEffect(() => {
    if (mode !== 'scrub') return;
    let cancelled = false;
    let idle = 0;
    let timer = 0;
    let teardown: (() => void) | null = null;

    const init = async () => {
      let gsapMod: typeof import('gsap');
      let stMod: typeof import('gsap/ScrollTrigger');
      try {
        [gsapMod, stMod] = await Promise.all([import('gsap'), import('gsap/ScrollTrigger')]);
        await document.fonts.load('800 100px ' + FONT_STACK, 'AFTERLIGHT');
        await stageRef.current?.querySelector('img')?.decode?.().catch(() => undefined);
      } catch {
        if (!cancelled) setEngineFailed(true);
        return;
      }
      if (cancelled) return;

      const { gsap } = gsapMod;
      const { ScrollTrigger } = stMod;
      const section = sectionRef.current!;
      const stage = stageRef.current!;
      const svg = svgRef.current!;
      const word = wordRef.current!;
      const stem = stemRef.current!;
      const veil = veilRef.current!;
      const wall = wallRef.current!;
      const kicker = kickerRef.current!;
      const final = finalRef.current!;
      const shade = shadeRef.current!;
      const texts = [...svg.querySelectorAll<SVGTextElement>('.rw__text')];

      const metrics = measureStem();
      if (!metrics || texts.length !== LINES.length) {
        setEngineFailed(true);
        return;
      }

      gsap.registerPlugin(ScrollTrigger);
      ScrollTrigger.config({ ignoreMobileResize: true }); // mobile address-bar changes must not re-pin

      let L: Layout = { S: 1, fx: 0, fy: 0, dx: 0, dy: 0 };
      const state = { z: 0 };

      const apply = () => {
        const s = Math.pow(L.S, state.z);
        const e = L.S > 1 ? (s - 1) / (L.S - 1) : 0; // the focus travels to the centre as the scale grows
        word.setAttribute(
          'transform',
          'translate(' + L.dx * e + ' ' + L.dy * e + ') translate(' + L.fx + ' ' + L.fy + ') scale(' + s + ') translate(' + -L.fx + ' ' + -L.fy + ')',
        );
      };

      /** Size and position the name for this stage; derive the zoom target and the final scale. */
      const layout = () => {
        const W = stage.clientWidth;
        const H = stage.clientHeight;
        const blk = window.matchMedia(WIDE_QUERY).matches ? cfg.block.wide : cfg.block.narrow;

        texts.forEach((t) => {
          t.removeAttribute('textLength');
          t.style.fontSize = '100px';
        });
        const w100 = texts.map((t) => t.getComputedTextLength());
        const wMax = Math.max(...w100);

        const fs = Math.min((W * blk.w * 100) / wMax, (H * blk.h) / (2 * metrics.cap + LINE_GAP));
        const blockH = fs * (2 * metrics.cap + LINE_GAP);
        const top = (H - blockH) / 2 + H * 0.03;
        const base1 = top + metrics.cap * fs;
        const bases = [base1, base1 + (metrics.cap + LINE_GAP) * fs];

        texts.forEach((t, i) => {
          t.style.fontSize = fs + 'px';
          t.setAttribute('x', String(W / 2));
          t.setAttribute('y', String(bases[i]));
          // the shorter line gets looser tracking (glyphs are never stretched) so both lines form one block
          if (w100[i] < wMax - 0.5) {
            t.setAttribute('textLength', String((wMax * fs) / 100));
            t.setAttribute('lengthAdjust', 'spacing');
          }
        });

        const fl = cfg.focus.line;
        const start = texts[fl].getStartPositionOfChar(cfg.focus.char);
        const fx = start.x + metrics.stemCx * fs;
        const fy = bases[fl] - ((metrics.stemTop + metrics.stemBottom) / 2) * fs;
        const stemW = metrics.stemW * fs;
        const stemH = (metrics.stemTop - metrics.stemBottom) * fs;
        const S = cfg.overshoot * Math.max(W / stemW, H / stemH);

        // Browsers draw glyphs inconsistently once the effective font size reaches ~8000px (the
        // opening comes out narrower than its geometry). A plain rectangle filling the T's stem,
        // slightly inside the ink, carries the final coverage exactly; it is invisible at small scale.
        const rw = stemW * 0.96;
        stem.setAttribute('x', String(fx - rw / 2));
        stem.setAttribute('width', String(rw));
        stem.setAttribute('y', String(bases[fl] - metrics.stemTop * fs));
        stem.setAttribute('height', String(stemH));

        L = { S, fx, fy, dx: W / 2 - fx, dy: H / 2 - fy };
        kicker.style.top = top - 16 + 'px';
        kicker.dataset.ready = 'true';
        apply();
      };
      layout();

      const [z0, z1] = cfg.zoom;
      const tl = gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          // distance = section minus stage, in px: independent of the (mobile) visual viewport height
          end: () => '+=' + Math.max(1, section.offsetHeight - stage.offsetHeight),
          scrub: true,
          invalidateOnRefresh: true,
        },
      });
      tl.to(kicker, { autoAlpha: 0, duration: 0.08 }, 0.04)
        .to(state, { z: 1, duration: z1 - z0, onUpdate: apply }, z0)
        // fully open: the veil no longer changes a single pixel, so stop painting it (reversible)
        .set([veil, wall], { autoAlpha: 0 }, z1)
        .fromTo(shade, { opacity: 0 }, { opacity: 1, duration: 0.1 }, z1)
        .fromTo(final, { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.1 }, z1);
      tl.to({}, { duration: Math.max(0, 1 - tl.duration()) }, tl.duration());

      let first = true;
      let raf = 0;
      const ro = new ResizeObserver(() => {
        if (first) {
          first = false;
          return;
        }
        cancelAnimationFrame(raf);
        raf = requestAnimationFrame(() => {
          layout();
          ScrollTrigger.refresh();
        });
      });
      ro.observe(stage);

      ScrollTrigger.refresh();
      section.dataset.ready = 'true';

      teardown = () => {
        cancelAnimationFrame(raf);
        ro.disconnect();
        tl.scrollTrigger?.kill();
        tl.kill();
        gsap.set([kicker, veil, wall, final, shade], { clearProps: 'all' });
        word.removeAttribute('transform');
        delete section.dataset.ready;
        kicker.removeAttribute('style');
        kicker.removeAttribute('data-ready');
      };
    };

    // Load the animation engine after the page itself is up; it never delays opening the site.
    const kick = () => {
      if ('requestIdleCallback' in window) idle = window.requestIdleCallback(() => void init(), { timeout: 1500 });
      else timer = setTimeout(() => void init(), 400) as unknown as number;
    };
    if (document.readyState === 'complete') kick();
    else window.addEventListener('load', kick, { once: true });

    return () => {
      cancelled = true;
      window.removeEventListener('load', kick);
      if ('cancelIdleCallback' in window) window.cancelIdleCallback(idle);
      clearTimeout(timer);
      teardown?.();
    };
  }, [mode, wide]);

  const style = {
    '--rw-travel': wide ? cfg.scroll.wide : cfg.scroll.narrow,
    '--rw-pos-landscape': cfg.objectPosition.landscape,
    '--rw-pos-portrait': cfg.objectPosition.portrait,
  } as CSSProperties;

  return (
    <section ref={sectionRef} id="reveal" className={'rw rw--' + mode} style={style} aria-labelledby="rw-title">
      <div ref={stageRef} className="rw__stage">
        <ResponsiveImage still={stills['exterior-facade']} sizes="(max-aspect-ratio: 16/9) 178vh, 100vw" eagerLow className="rw__img" />

        {mode === 'scrub' && (
          <svg ref={svgRef} className="rw__mask" aria-hidden="true" focusable="false">
            <defs>
              <mask id="rw-mask" maskUnits="userSpaceOnUse" x="0" y="0" width="100%" height="100%">
                <rect x="0" y="0" width="100%" height="100%" fill="#fff" />
                <g ref={wordRef} id="rw-word" fill="#000">
                  <rect ref={stemRef} />
                  {LINES.map((line) => (
                    <text key={line} className="rw__text" textAnchor="middle">
                      {line}
                    </text>
                  ))}
                </g>
              </mask>
            </defs>
            <g ref={veilRef}>
              <rect className="rw__veil" x="0" y="0" width="100%" height="100%" mask="url(#rw-mask)" />
            </g>
          </svg>
        )}

        {/* The plaster wall around the letters: the shared surface with the name drawn in black (no
            mask, so it stays cheap to repaint while the name grows), added onto the photo layer (see CSS) */}
        {mode === 'scrub' && (
          <div ref={wallRef} className="rw__wall" aria-hidden="true">
            <div className="plaster plaster--fill" />
            <svg className="rw__holes" focusable="false">
              <use href="#rw-word" />
            </svg>
          </div>
        )}

        {mode === 'scrub' && (
          <p ref={kickerRef} className="rw__kicker">
            {revealCopy.kicker}
          </p>
        )}

        <div ref={shadeRef} className="rw__shade" aria-hidden="true" />
        <div ref={finalRef} className="rw__final">
          <h2 id="rw-title" className="latin" lang="en">
            {revealCopy.name}
          </h2>
          <p>{revealCopy.descriptor}</p>
        </div>
      </div>
    </section>
  );
}
