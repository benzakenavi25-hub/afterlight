import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { hero, studio } from '../data/content';
import { heroPoster, heroPosterVertical, tour, tourCard } from '../data/media';
import { ResponsiveImage } from './ResponsiveImage';
import { ElevatorDoors } from './ElevatorDoors';
import './TourHero.css';

/** The poster fills the film's 16:9 cover box, so on tall viewports it is wider than 100vw. Mirrored in index.html preload. */
const HERO_SIZES = '(max-aspect-ratio: 16/9) 178vh, 100vw';

const WIDE_QUERY = '(min-width: 62.5rem)';
const REDUCED_QUERY = '(prefers-reduced-motion: reduce)';
/** Phone portrait: vertical (9:16) film and poster, vertical card. Mirrored in index.html preload and TourHero.css. */
const VERTICAL_QUERY = '(max-width: 62.49rem) and (orientation: portrait)';
/** The vertical poster fills the film's 9:16 cover box: wider than 100vw only on very tall screens. */
const HERO_SIZES_VERTICAL = '(max-aspect-ratio: 9/16) 56.25vh, 100vw';

/** Font size (px) at which the longest chapter word spans `width` edge to edge (0.12em tracking + indent). */
let measureCtx: CanvasRenderingContext2D | null = null;
function fitWordSize(width: number, sample: HTMLElement): number {
  measureCtx ??= document.createElement('canvas').getContext('2d');
  if (!measureCtx) return width / 6;
  const cs = getComputedStyle(sample);
  measureCtx.font = `${cs.fontWeight} 100px ${cs.fontFamily}`;
  const widest = Math.max(
    ...hero.chapterWords.map((w) => measureCtx!.measureText(w).width + (w.length + 1) * 12),
  );
  return ((width - 2) / widest) * 100;
}

type Mode = 'static' | 'scrub' | 'manual';

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

/** Visitors who asked the browser to save data keep the poster and skip the film download. */
const saveData = () =>
  (navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData === true;

/**
 * scrub  – film follows the scroll position (desktop and mobile)
 * manual – reduced motion: still poster + optional play
 * static – no film available / failed / data saver: still poster, page continues normally
 */
function pickMode(failed: boolean, reduced: boolean): Mode {
  if (tour.status !== 'ready') return 'static';
  if (reduced) return 'manual';
  if (failed || saveData()) return 'static';
  return 'scrub';
}

const clamp01 = (n: number) => Math.min(1, Math.max(0, n));
const chapterAt = (p: number, chapters: typeof tour.chapters) => {
  let i = 0;
  chapters.forEach((c, idx) => {
    if (p >= c.from) i = idx;
  });
  return i;
};

/**
 * Sticky stage inside a section whose scroll length comes from `tour.scroll` (media.ts).
 * Scroll progress maps directly to film time: down advances, stop stops, up reverses; there is
 * no smoothing, so the camera never drifts after the visitor stops. One rAF-coalesced update per
 * frame, seeks never queue (latest target wins on `seeked`), no React state per frame.
 * Progress uses the stage's own (svh) height, not innerHeight, so mobile address-bar changes
 * do not move it. Reduced motion: still poster + optional manual player.
 */
export function TourHero() {
  const [scrubFailed, setScrubFailed] = useState(false);
  const wide = useMedia(WIDE_QUERY);
  const reduced = useMedia(REDUCED_QUERY);
  const vertical = useMedia(VERTICAL_QUERY);
  const chapters = vertical ? tour.chaptersVertical : tour.chapters;
  const mode = pickMode(scrubFailed, reduced);
  const [ready, setReady] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [playError, setPlayError] = useState(false);

  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const chapterRef = useRef<HTMLSpanElement>(null);
  const filmRef = useRef<HTMLVideoElement>(null);
  const playBtnRef = useRef<HTMLButtonElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);

  // ---- Scrub engine -------------------------------------------------------
  useEffect(() => {
    if (mode !== 'scrub') return;
    const section = sectionRef.current!;
    const stage = stageRef.current!;
    const video = videoRef.current!;

    let raf = 0;
    let pending: number | null = null;
    let lastChapter = -1;
    let canSeek = false;
    let listening = false;

    const applySeek = () => {
      if (pending === null || !canSeek || video.seeking) return;
      const t = pending;
      pending = null;
      if (Math.abs(video.currentTime - t) > 1 / 48) video.currentTime = t;
    };

    const update = () => {
      raf = 0;
      const rect = section.getBoundingClientRect();
      const travel = rect.height - stage.offsetHeight;
      const p = travel > 0 ? clamp01(-rect.top / travel) : 0;
      stage.style.setProperty('--p', p.toFixed(4));
      const ch = chapterAt(p, chapters);
      if (ch !== lastChapter && chapterRef.current) {
        chapterRef.current.textContent = chapters[ch].label;
        stage.dataset.chapter = String(ch); // framing only: drives the chapter word (CSS)
        lastChapter = ch;
      }
      if (canSeek) {
        pending = p * Math.max(0, video.duration - 0.05);
        applySeek();
      }
    };
    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };

    // Listen to scroll only while the tour is on screen.
    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !listening) {
        window.addEventListener('scroll', schedule, { passive: true });
        window.addEventListener('resize', schedule);
        listening = true;
        schedule();
      } else if (!entry.isIntersecting && listening) {
        window.removeEventListener('scroll', schedule);
        window.removeEventListener('resize', schedule);
        listening = false;
      }
    });
    io.observe(section);

    const onLoaded = () => {
      if (!Number.isFinite(video.duration) || video.duration <= 0) return;
      video.pause();
      canSeek = true;
      setReady(true);
      schedule();
    };
    const onError = () => setScrubFailed(true);
    video.addEventListener('loadeddata', onLoaded);
    video.addEventListener('seeked', applySeek);
    video.addEventListener('error', onError);

    // Poster and text first; fetch the film once the page has loaded and is idle.
    let idle = 0;
    let timer = 0;
    const startLoading = () => {
      if (video.getAttribute('src')) return;
      video.preload = 'auto';
      video.src = wide ? tour.desktopSrc : vertical ? tour.verticalSrc : tour.mobileSrc;
      video.load();
      // iOS may hold back decoding until playback starts; a muted inline play→pause primes it.
      video.play()?.then(() => video.pause()).catch(() => {});
    };
    const queueLoad = () => {
      if ("requestIdleCallback" in window) idle = window.requestIdleCallback(startLoading, { timeout: 300 });
      else timer = setTimeout(startLoading, 300) as unknown as number;
    };
    if (document.readyState === 'complete') queueLoad();
    else window.addEventListener('load', queueLoad, { once: true });
    // A visitor who starts scrolling right away should not wait for idle time.
    window.addEventListener('scroll', startLoading, { once: true, passive: true });

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
      window.removeEventListener('load', queueLoad);
      window.removeEventListener('scroll', startLoading);
      if ('cancelIdleCallback' in window) window.cancelIdleCallback(idle);
      clearTimeout(timer);
      video.removeEventListener('loadeddata', onLoaded);
      video.removeEventListener('seeked', applySeek);
      video.removeEventListener('error', onError);
      video.removeAttribute('src');
      video.load(); // release the decoder
      setReady(false);
    };
  }, [mode, wide, vertical, chapters]);

  // ---- Card geometry (framing only; independent of the scrub engine) ------
  // Measures the start card and the film's 16:9 cover box, and hands them to CSS as px vars. CSS
  // then derives every frame from --p alone: clip-path inset on the card, scale/translate on the view.
  useEffect(() => {
    const stage = stageRef.current!;
    const inner = innerRef.current!;
    const measure = () => {
      const W = stage.clientWidth;
      const H = stage.clientHeight;
      if (!W || !H) return;
      const portrait = window.matchMedia(VERTICAL_QUERY).matches;
      const header = document.querySelector<HTMLElement>('.site-header')?.offsetHeight ?? 72;
      let w0: number, h0: number, top0: number;
      if (portrait) {
        // Phone portrait, top to bottom: the chapter word in full (fit to width), the vertical card, the
        // headline + one-line subtitle + scroll cue below the card, and whatever the foot still holds.
        // Everything fits one screen: the card takes what is left (at most 70svh).
        const gutter = parseFloat(getComputedStyle(inner).paddingInlineStart) || 20;
        const copy = inner.querySelector<HTMLElement>('.hero__copy')!;
        const foot = inner.querySelector<HTMLElement>('.hero__foot')!;
        const word = stage.querySelector<HTMLElement>('.hero__word');
        const ws = word ? fitWordSize(W, word) : W / 6;
        // Capitals span ≈ 0.19em–0.78em of the word box: cap top sits 8px under the header, 8px gap above the card
        const wordTop = header + 8 - 0.19 * ws;
        top0 = wordTop + 0.78 * ws + 8;
        const gap = 12;
        const below = gap + copy.offsetHeight + (foot.offsetHeight ? foot.offsetHeight + 12 : 0) + 16;
        w0 = W - 2 * gutter;
        h0 = Math.max(H * 0.36, Math.min(H * 0.7, H - top0 - below));
        stage.style.setProperty('--word-size', `${ws}px`);
        stage.style.setProperty('--word-top', `${wordTop}px`);
        stage.style.setProperty('--copy-top', `${top0 + h0 + gap}px`);
      } else {
        w0 = W * tourCard.start.wide.w;
        h0 = H * tourCard.start.wide.h;
        top0 = (H - h0) / 2;
      }
      // The film's cover box at full size: 16:9, or 9:16 for the vertical film (centred crop)
      const ar = portrait ? 9 / 16 : 16 / 9;
      const Wc = Math.max(W, H * ar);
      const Hc = Math.max(H, W / ar);
      const v: Record<string, string> = {
        '--ix': `${(W - w0) / 2}px`,
        '--it': `${top0}px`,
        '--ib': `${H - top0 - h0}px`,
        '--dy': `${top0 + h0 / 2 - H / 2}px`,
        '--s0': String(Math.max(w0 / Wc, h0 / Hc)),
        '--sx0': String(w0 / W),
        '--sy0': String(h0 / H),
        '--vw': `${Wc}px`,
        '--vh': `${Hc}px`,
      };
      for (const k in v) stage.style.setProperty(k, v[k]);
      stage.dataset.layout = portrait ? 'portrait' : 'wide';
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(stage);
    // Phone portrait also depends on the text blocks around the card (web fonts, foot content per mode)
    inner.querySelectorAll('.hero__copy, .hero__foot').forEach((el) => ro.observe(el));
    let alive = true;
    document.fonts?.ready.then(() => alive && measure());
    return () => {
      alive = false;
      ro.disconnect();
    };
  }, []);

  // Outside scrub (reduced motion, no film, failure mid-tour): back to the static start card + ENTRY.
  useEffect(() => {
    if (mode === 'scrub') return;
    const stage = stageRef.current!;
    stage.style.removeProperty('--p');
    delete stage.dataset.chapter;
  }, [mode]);

  // ---- Manual player ------------------------------------------------------
  useEffect(() => {
    if (!playing) return;
    const film = filmRef.current;
    if (!film) return;
    film.focus();
    film.play().catch(() => {
      /* Autoplay refused: native controls remain available. */
    });
  }, [playing]);

  const closePlayer = () => {
    filmRef.current?.pause();
    setPlaying(false);
    requestAnimationFrame(() => playBtnRef.current?.focus());
  };

  const isScrub = mode === 'scrub';
  const filmSrc = wide ? tour.desktopSrc : vertical ? tour.verticalSrc : tour.mobileSrc;

  return (
    <section
      ref={sectionRef}
      className={`hero hero--${mode}${playing ? ' hero--playing' : ''}`}
      data-ready={isScrub && ready}
      style={
        {
          '--travel': wide ? tour.scroll.wide : vertical ? tour.scroll.vertical : tour.scroll.narrow,
          '--grow-from': tourCard.growFrom,
          '--early': tourCard.early,
          '--radius': `${tourCard.radius}px`,
          '--word-opacity': tourCard.wordOpacity,
        } as CSSProperties
      }
      aria-labelledby="hero-title"
    >
      <div id="hero-sentinel" className="hero__sentinel" aria-hidden="true" />
      <div ref={stageRef} className="hero__stage">
        <div className="hero__media">
          {/* Chapter word behind the card (decorative; the Hebrew chapter label below carries it) */}
          <div className="hero__words" aria-hidden="true">
            {hero.chapterWords.map((w, i) => (
              <span key={w} className="hero__word latin" data-i={i}>
                {w}
              </span>
            ))}
          </div>
          <div className="hero__cardshadow" aria-hidden="true" />
          <div className="hero__card">
            <div className="hero__view">
              <ResponsiveImage
                still={heroPoster}
                sizes={HERO_SIZES}
                art={{ still: heroPosterVertical, media: VERTICAL_QUERY, sizes: HERO_SIZES_VERTICAL }}
                priority
                className="hero__poster"
              />
              {isScrub && (
                <video
                  ref={videoRef}
                  className="hero__video"
                  muted
                  playsInline
                  preload="none"
                  disablePictureInPicture
                  aria-hidden="true"
                  tabIndex={-1}
                />
              )}
            </div>
            <div className="hero__shade" aria-hidden="true" />
            {/* Elevator-doors intro: inside the card, clipped by it (under the corner caps) */}
            <ElevatorDoors />
            {(['tl', 'tr', 'bl', 'br'] as const).map((c) => (
              <span key={c} className="hero__corner" data-c={c} aria-hidden="true" />
            ))}
          </div>
          {/* Phone portrait: tour progress along the card's bottom edge (hidden on wide screens) */}
          {isScrub && (
            <div className="hero__progress" aria-hidden="true">
              <span />
            </div>
          )}
          {playing && (
            <video
              ref={filmRef}
              className="hero__film"
              src={filmSrc}
              controls
              muted
              playsInline
              preload="metadata"
              aria-label="סיור וידאו בבית, מהכניסה ועד המרפסת"
              onError={() => {
                setPlayError(true);
                setPlaying(false);
              }}
            />
          )}
        </div>

        <div ref={innerRef} className="hero__inner container">
          <div className="hero__copy">
            <p className="hero__label">
              {hero.conceptLabel} · <span dir="ltr">{studio.name}</span>
            </p>
            <h1 id="hero-title">{hero.title}</h1>
            <p className="hero__subtitle">
              <span className="hero__sub-full">{hero.subtitle}</span>
              <span className="hero__sub-short">{hero.subtitleShort}</span>
            </p>
            <a className="hero__discover" href={hero.discover.href}>
              {hero.discover.label}
            </a>
            {/* Phone portrait: a short bronze line in place of the scroll hint (text kept for screen readers) */}
            {isScrub && (
              <span className="hero__cue">
                <span className="visually-hidden">{hero.scrollHint}</span>
              </span>
            )}
          </div>

          <div className="hero__foot">
            {mode === 'static' && (
              <p className="hero__status">{tour.status === 'ready' ? hero.tourUnavailable : hero.tourPending}</p>
            )}

            {isScrub && (
              <p className="hero__status hero__chapter" aria-hidden="true">
                <span ref={chapterRef}>{tour.chapters[0].label}</span>
                {ready && <span className="hero__hint">{hero.scrollHint}</span>}
              </p>
            )}

            {mode === 'manual' &&
              (playing ? (
                <button type="button" className="btn btn--light" onClick={closePlayer}>
                  {hero.closePlayer}
                </button>
              ) : (
                <div className="hero__play">
                  <button ref={playBtnRef} type="button" className="btn btn--light" onClick={() => setPlaying(true)}>
                    <span className="hero__play-icon" aria-hidden="true" />
                    {hero.play}
                  </button>
                  <span className="hero__status">
                    {playError ? 'לא ניתן להפעיל את הסיור כרגע.' : hero.playMeta}
                  </span>
                </div>
              ))}

            {isScrub && (
              <a className="hero__skip" href={hero.skip.href}>
                {hero.skip.label}
              </a>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
