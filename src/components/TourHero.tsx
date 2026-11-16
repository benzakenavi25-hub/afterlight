import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { hero, studio } from '../data/content';
import { heroPoster, tour } from '../data/media';
import { ResponsiveImage } from './ResponsiveImage';
import './TourHero.css';

/** The poster is object-fit: cover, so on tall viewports it renders wider than 100vw. Mirrored in index.html preload. */
const HERO_SIZES = '(max-aspect-ratio: 16/9) 178vh, 100vw';

const WIDE_QUERY = '(min-width: 62.5rem)';
const REDUCED_QUERY = '(prefers-reduced-motion: reduce)';

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
const chapterAt = (p: number) => {
  let i = 0;
  tour.chapters.forEach((c, idx) => {
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
      const ch = chapterAt(p);
      if (ch !== lastChapter && chapterRef.current) {
        chapterRef.current.textContent = tour.chapters[ch].label;
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
      video.src = wide ? tour.desktopSrc : tour.mobileSrc;
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
  }, [mode, wide]);

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
  const filmSrc = wide ? tour.desktopSrc : tour.mobileSrc;

  return (
    <section
      ref={sectionRef}
      className={`hero hero--${mode}${playing ? ' hero--playing' : ''}`}
      data-ready={isScrub && ready}
      style={{ '--travel': wide ? tour.scroll.wide : tour.scroll.narrow } as CSSProperties}
      aria-labelledby="hero-title"
    >
      <div id="hero-sentinel" className="hero__sentinel" aria-hidden="true" />
      <div ref={stageRef} className="hero__stage">
        <div className="hero__media">
          <ResponsiveImage still={heroPoster} sizes={HERO_SIZES} priority className="hero__poster" />
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
        <div className="hero__shade" aria-hidden="true" />

        <div className="hero__inner container">
          <p className="hero__label">
            {hero.conceptLabel} · <span dir="ltr">{studio.name}</span>
          </p>

          <div className="hero__copy">
            <h1 id="hero-title">{hero.title}</h1>
            <p className="hero__subtitle">{hero.subtitle}</p>
            <a className="hero__discover" href={hero.discover.href}>
              {hero.discover.label}
            </a>
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
