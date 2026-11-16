import { useEffect } from 'react';

/** Secondary content blocks that fade in once. The hero and controls are never hidden. */
const TARGETS = [
  '.materials__title',
  '.materials__item',
  '.terrace__text',
  '.contact__intro',
  '.studio',
].join(',');

/**
 * Progressive enhancement: content is visible by default. Only when JS runs and the
 * visitor has no reduced-motion preference do below-the-fold blocks start hidden and
 * reveal once on entering the viewport (CSS in base.css, 550ms, 16px).
 */
export function useReveal() {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (!('IntersectionObserver' in window)) return;

    const els = [...document.querySelectorAll<HTMLElement>(TARGETS)].filter(
      (el) => el.getBoundingClientRect().top > window.innerHeight, // never hide what is already on screen
    );
    els.forEach((el) => el.setAttribute('data-reveal', ''));

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (!e.isIntersecting) return;
          e.target.setAttribute('data-reveal', 'in');
          io.unobserve(e.target);
        });
      },
      // Top margin of one viewport: blocks skipped by an anchor jump still reveal.
      { rootMargin: '100% 0px -10% 0px' },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
}
