import { useCallback, useEffect, useRef, useState, type CSSProperties, type MouseEvent } from 'react';
import { PLAN_HREF, spacesStack, type ZoneId } from '../data/content';
import { stack as cfg, stills } from '../data/media';
import { PlanDialog } from './PlanDialog';
import { ResponsiveImage } from './ResponsiveImage';
import './SpacesStack.css';

const WIDE_QUERY = '(min-width: 62.5rem)';
const REDUCED_QUERY = '(prefers-reduced-motion: reduce)';
/** Landscape phones, very short windows and large default text: pinning would clip content. em scales with text size. */
const SHORT_QUERY = '(max-height: 32em)';

const { stages } = spacesStack;
type Stage = (typeof stages)[number];

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
 * The dark surface is the shared PlasterBackground layer. A stage on it is therefore see-through
 * (the same colour at alpha 0), so the plaster texture shows as the section darkens.
 */
const SHARED_BG = '--ink';

/** `--token` → var(--token) for CSS; literal colours pass through; the shared surface → transparent. */
const cssColor = (bg: string) => (bg === SHARED_BG ? 'transparent' : bg.startsWith('--') ? `var(${bg})` : bg);
/** `--token` → its computed value, so GSAP can interpolate it. */
const resolvedColor = (bg: string) =>
  bg.startsWith('--') ? getComputedStyle(document.documentElement).getPropertyValue(bg).trim() : bg;

/** Settled stage for a timeline progress: the text swaps at the midpoint of each card transition. */
const stageAt = (progress: number) => cfg.transitions.filter(([a, b]) => progress >= (a + b) / 2).length;

function StageText({
  stage,
  theme = stage.theme,
  onPlan,
}: {
  stage: Stage;
  theme?: Stage['theme'];
  onPlan: (e: MouseEvent<HTMLButtonElement>) => void;
}) {
  return (
    <div className="ss__text" data-theme={theme}>
      <p className="ss__meta">
        <span className="ss__num latin" aria-hidden="true">
          {stage.num}
        </span>
        <span className="ss__sep" aria-hidden="true">
          /
        </span>
        <span className="ss__label">{stage.label}</span>
      </p>
      <h3 className="ss__title">{stage.title}</h3>
      <span className="ss__rule" aria-hidden="true" />
      <button type="button" className="ss__btn" onClick={onPlan}>
        {spacesStack.planButton}
        <span aria-hidden="true">&nbsp;↗</span>
      </button>
    </div>
  );
}

const cropStyle = (stage: Stage) =>
  ({ '--crop-wide': stage.crop.wide, '--crop-narrow': stage.crop.narrow }) as CSSProperties;

/**
 * Three spaces, one composition. The whole composition (text + image frame) is one CSS-sticky stage,
 * like the tour and the exterior reveal, so pins never fight. One scrubbed GSAP timeline maps scroll
 * to: incoming photo cards crossfading over the previous ones (opacity + a slight settle in scale),
 * and the stage text swapping. Before that, while the section scrolls up into place, a scrubbed intro turns
 * the section from warm ivory through warm sand to the site's plaster surface, then fades the text in.
 * Reduced motion, short viewports or text that would not fit fall back to a plain document flow.
 */
export function SpacesStack() {
  const wide = useMedia(WIDE_QUERY);
  const reduced = useMedia(REDUCED_QUERY);
  const short = useMedia(SHORT_QUERY);
  const [engineFailed, setEngineFailed] = useState(false);
  const [overflow, setOverflow] = useState(false);
  const mode = reduced || short || engineFailed || overflow ? 'flow' : 'scrub';

  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  /** Settled stage index, kept in a ref (no per-frame React state). */
  const currentRef = useRef(0);

  // A new layout gets a fresh fit check.
  useEffect(() => setOverflow(false), [wide]);

  useEffect(() => {
    if (mode !== 'scrub') return;
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
      const frame = frameRef.current!;
      const fits = () => frame.scrollHeight <= frame.clientHeight + 2;
      if (!fits()) {
        setOverflow(true);
        return;
      }

      const { gsap } = gsapMod;
      const { ScrollTrigger } = stMod;
      gsap.registerPlugin(ScrollTrigger);
      ScrollTrigger.config({ ignoreMobileResize: true }); // mobile address-bar changes must not re-measure

      // The shared surface becomes its colour at alpha 0: over the plaster layer it reads as one
      // smooth ivory → espresso change, and the texture appears as the section turns see-through.
      const [r, g, b] = gsap.utils.splitColor(resolvedColor(SHARED_BG)) as number[];
      const startColor = resolvedColor(stages[0].bg);
      const endColor = `rgba(${r}, ${g}, ${b}, 0)`;
      const ctx = gsap.context(() => {
        const cards = gsap.utils.toArray<HTMLElement>('.ss__card', section);
        const texts = gsap.utils.toArray<HTMLElement>('.ss__text', section);
        const textBox = section.querySelector<HTMLElement>('.ss__texts')!;
        const off = cfg.textOffset;

        gsap.set(section, { backgroundColor: startColor });
        gsap.set(textBox, { autoAlpha: 0, y: off });
        // Cards change by crossfade, never by sliding: no moment where one room's ceiling cuts across another.
        gsap.set(cards, { autoAlpha: (i: number) => (i === 0 ? 1 : 0), scale: (i: number) => (i === 0 ? 1 : cfg.cardScale) });
        gsap.set(texts, { y: (i: number) => (i === 0 ? 0 : off), autoAlpha: (i: number) => (i === 0 ? 1 : 0) });

        // Intro, scrubbed by scroll while the section rises into place: ivory → warm sand → plaster
        // (the sand stop keeps the midpoint warm instead of grey), then the first text fades in.
        const [bgShare, textShare] = cfg.intro.split;
        gsap
          .timeline({
            defaults: { ease: 'none' },
            scrollTrigger: { trigger: section, start: cfg.intro.start, end: cfg.intro.end, scrub: true },
          })
          .to(section, { backgroundColor: resolvedColor(cfg.intro.mid), duration: bgShare / 2 })
          .to(section, { backgroundColor: endColor, duration: bgShare / 2 })
          .to(textBox, { autoAlpha: 1, y: 0, duration: textShare }, 1 - textShare);

        const tl = gsap.timeline({
          defaults: { ease: 'none' },
          scrollTrigger: {
            trigger: section,
            start: 'top top',
            // distance = section minus stage, in px: independent of the (mobile) visual viewport height
            end: () => '+=' + Math.max(1, section.offsetHeight - stage.offsetHeight),
            scrub: true,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              currentRef.current = stageAt(self.progress);
            },
          },
        });

        cfg.transitions.forEach(([a, b], i) => {
          const d = b - a;
          // the incoming card fades in over the previous one, which stays put underneath
          tl.to(cards[i + 1], { autoAlpha: 1, scale: 1, duration: d, ease: 'power1.inOut' }, a);
          // previous text out in the first part, next text in during the last part
          tl.to(texts[i], { autoAlpha: 0, y: -off, duration: d * 0.4 }, a);
          tl.to(texts[i + 1], { autoAlpha: 1, y: 0, duration: d * 0.4 }, a + d * 0.6);
        });
        // pad the timeline to exactly 1 so the shares in cfg.transitions are timeline fractions
        tl.to({}, { duration: Math.max(0, 1 - tl.duration()) }, tl.duration());
      }, section);

      // Layout changes (rotation, window resize, text zoom): re-check the fit, then re-measure.
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
      ro.observe(frame);

      // Images above may finish loading later; one refresh once everything is in.
      if (document.readyState !== 'complete') window.addEventListener('load', () => ScrollTrigger.refresh(), { once: true });
      ScrollTrigger.refresh();
      section.dataset.ready = 'true';

      revert = () => {
        ctx.revert(); // kills only this component's tweens and ScrollTrigger, restores inline styles
        delete section.dataset.ready;
      };
    };

    void init();

    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
      ro?.disconnect();
      revert?.();
      currentRef.current = 0;
    };
  }, [mode, wide]);

  // ---------- Plan dialog ----------
  const [planZone, setPlanZone] = useState<ZoneId | null>(null);
  const openerRef = useRef<HTMLElement | null>(null);
  const scrollYRef = useRef(0);

  const openPlan = useCallback((stageIndex: number, opener: HTMLElement | null) => {
    openerRef.current = opener;
    scrollYRef.current = window.scrollY;
    document.documentElement.classList.add('is-scroll-locked');
    setPlanZone(stages[stageIndex].zone);
  }, []);

  const closePlan = useCallback(() => {
    document.documentElement.classList.remove('is-scroll-locked');
    // Restore the exact position without a smooth-scroll animation (html has scroll-behavior: smooth).
    if (Math.abs(window.scrollY - scrollYRef.current) > 1) {
      window.scrollTo({ top: scrollYRef.current, behavior: 'instant' });
    }
    // Back to the opener; if it is gone (e.g. the closed mobile menu), to the visible stage button.
    const opener = openerRef.current;
    const target =
      opener && opener.isConnected && opener.getClientRects().length > 0
        ? opener
        : [...(sectionRef.current?.querySelectorAll<HTMLElement>('.ss__btn') ?? [])].find(
            (b) => getComputedStyle(b).visibility !== 'hidden' && b.getClientRects().length > 0,
          );
    target?.focus({ preventScroll: true });
    setPlanZone(null);
  }, []);

  // Never leave the page locked if the section unmounts while the dialog is open.
  useEffect(() => () => document.documentElement.classList.remove('is-scroll-locked'), []);

  /** Stage nearest the reading position, for openers outside the section (nav links). */
  const currentStage = useCallback(() => {
    if (mode === 'scrub') return currentRef.current;
    const items = [...(sectionRef.current?.querySelectorAll<HTMLElement>('.ss-flow__item') ?? [])];
    const idx = items.filter((el) => el.getBoundingClientRect().top < window.innerHeight / 2).length - 1;
    return Math.max(0, idx);
  }, [mode]);

  // Any link to PLAN_HREF (header nav) opens the dialog instead of jumping. Also on a direct #plan URL.
  useEffect(() => {
    const onClick = (e: globalThis.MouseEvent) => {
      const link = (e.target as Element | null)?.closest?.(`a[href="${PLAN_HREF}"]`) as HTMLElement | null;
      if (!link || e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey) return;
      e.preventDefault();
      openPlan(currentStage(), link);
    };
    document.addEventListener('click', onClick);
    return () => document.removeEventListener('click', onClick);
  }, [openPlan, currentStage]);

  useEffect(() => {
    if (window.location.hash !== PLAN_HREF) return;
    history.replaceState(null, '', window.location.pathname + window.location.search);
    openPlan(0, null);
  }, [openPlan]);

  const style = {
    '--ss-travel': wide ? cfg.scroll.wide : cfg.scroll.narrow,
    '--ss-bg-start': cssColor(stages[0].bg),
  } as CSSProperties;

  return (
    <section ref={sectionRef} id="spaces" className={'ss ss--' + mode} style={style} aria-labelledby="ss-title">
      <h2 id="ss-title" className="visually-hidden">
        {spacesStack.heading}
      </h2>

      {mode === 'scrub' ? (
        <div ref={stageRef} className="ss__stage">
          <div ref={frameRef} className="ss__frame container">
            <div className="ss__texts">
              {stages.map((s, i) => (
                <StageText key={s.id} stage={s} theme="light" onPlan={(e) => openPlan(i, e.currentTarget)} />
              ))}
            </div>
            <div className="ss__media">
              {stages.map((s) => (
                <div key={s.id} className="ss__card" style={cropStyle(s)}>
                  <ResponsiveImage
                    still={stills[s.still]}
                    sizes="(min-width: 62.5rem) 60vw, 100vw"
                    eagerLow
                    className="ss__img"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        stages.map((s, i) => (
          <article
            key={s.id}
            className="ss-flow__item"
            data-theme={s.theme}
            style={{ ...cropStyle(s), background: cssColor(s.bg) }}
          >
            <div className="container ss-flow__grid">
              <StageText stage={s} onPlan={(e) => openPlan(i, e.currentTarget)} />
              <ResponsiveImage
                still={stills[s.still]}
                sizes="(min-width: 62.5rem) 60vw, 100vw"
                className="ss__img ss-flow__img"
              />
            </div>
          </article>
        ))
      )}

      <PlanDialog zone={planZone} onClose={closePlan} />
    </section>
  );
}
