import { useEffect } from 'react';

/**
 * One text-reveal system for the whole site (not the opening: TourHero / ExteriorReveal / SpacesStack
 * stages are never targeted). Progressive enhancement: everything is visible by default; only with JS,
 * no reduced-motion preference and IntersectionObserver do below-the-fold elements start hidden and
 * play once when they enter. CSS in base.css. Kinds:
 *   heading — section H2: bronze rule draws (600ms), then words rise out of a clipping window
 *             (700ms, 40ms stagger). Screen readers get the intact text, not the word spans.
 *   latin   — tracked English label: letter-spacing opens + fade (900ms).
 *   text    — paragraph: 12px rise + fade (550ms, 150ms after the heading).
 *   block   — image blocks: 16px rise + fade (550ms).
 */
const KINDS: [selector: string, kind: string][] = [
  ['main h2:not(.visually-hidden)', 'heading'],
  ['main .latin[lang="en"]', 'latin'],
  [
    '.terrace__copy, .contact__notice, .studio__text, .facts__note, .location__copy',
    'text',
  ],
  ['.materials__item, .facts__item', 'block'],
];
const SKIP = '.hero, #reveal, #spaces'; // opening + pinned stages

/** Replaces a heading's text with word windows; keeps the real text for assistive tech. */
function splitWords(h: HTMLElement) {
  if (h.dataset.split || h.children.length) return; // plain-text headings only
  const text = h.textContent ?? '';
  const words = text.trim().split(/\s+/);
  const sr = document.createElement('span');
  sr.className = 'visually-hidden';
  sr.textContent = text;
  const vis = document.createElement('span');
  vis.setAttribute('aria-hidden', 'true');
  words.forEach((w, i) => {
    const win = document.createElement('span');
    win.className = 'tw';
    const inner = document.createElement('span');
    inner.className = 'tw__i';
    inner.style.setProperty('--i', String(i));
    inner.textContent = w;
    win.append(inner);
    vis.append(win, i < words.length - 1 ? ' ' : '');
  });
  h.replaceChildren(sr, vis);
  h.dataset.split = 'true';
}

export function useReveal() {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (!('IntersectionObserver' in window)) return;

    const els: HTMLElement[] = [];
    for (const [sel, kind] of KINDS) {
      document.querySelectorAll<HTMLElement>(sel).forEach((el) => {
        if (el.closest(SKIP) || el.getAttribute('data-reveal') === 'in') return;
        // never hide what is on screen (an element already set up by an earlier run is just re-observed)
        if (!el.hasAttribute('data-reveal') && el.getBoundingClientRect().top <= window.innerHeight) return;
        if (kind === 'heading') splitWords(el);
        el.dataset.revealKind = kind;
        el.setAttribute('data-reveal', '');
        els.push(el);
      });
    }

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
