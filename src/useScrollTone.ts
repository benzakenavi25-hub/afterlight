import { useEffect, type RefObject } from 'react';

/**
 * Sets `--tone` (0–1) on an element from its scroll position: 0 while its top edge is at or below
 * `start` (fraction of the viewport height from the top), 1 once it reaches `end`. The edge measured can
 * be another element's (`measureRef`). CSS mixes the
 * section surface with it, so a colour change follows the scroll instead of switching at an edge.
 * Listens only while the element is near the viewport; one rAF update per scroll frame.
 */
export function useScrollTone(
  ref: RefObject<HTMLElement | null>,
  start: number,
  end: number,
  /** Element whose top edge is measured (default: the element itself). */
  measureRef: RefObject<HTMLElement | null> = ref,
) {
  useEffect(() => {
    const el = ref.current;
    const probe = measureRef.current;
    if (!el || !probe) return;
    // Reduced motion: no scroll-linked change; the surface keeps its final state (CSS default).
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    let raf = 0;
    const update = () => {
      raf = 0;
      const vh = window.innerHeight;
      const t = (start * vh - probe.getBoundingClientRect().top) / ((start - end) * vh);
      el.style.setProperty('--tone', String(Math.min(1, Math.max(0, t))));
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          window.addEventListener('scroll', onScroll, { passive: true });
          window.addEventListener('resize', onScroll);
        } else {
          window.removeEventListener('scroll', onScroll);
          window.removeEventListener('resize', onScroll);
        }
        update();
      },
      { rootMargin: '50% 0px' },
    );
    io.observe(el);
    update();
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, [ref, measureRef, start, end]);
}
