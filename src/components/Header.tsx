import { useEffect, useId, useRef, useState } from 'react';
import { nav, navCta } from '../data/content';
import { Wordmark } from './Wordmark';
import './Header.css';

/** Element whose visibility keeps the header transparent over the hero. */
const HERO_SENTINEL_ID = 'hero-sentinel';

export function Header() {
  const [solid, setSolid] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuId = useId();
  const toggleRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  // Transparent over the hero, solid night afterwards. No scroll listener.
  useEffect(() => {
    const sentinel = document.getElementById(HERO_SENTINEL_ID);
    if (!sentinel || !('IntersectionObserver' in window)) {
      setSolid(true);
      return;
    }
    const io = new IntersectionObserver(([entry]) => setSolid(!entry.isIntersecting));
    io.observe(sentinel);
    return () => io.disconnect();
  }, []);

  // Mobile menu: focus first link on open, Escape / outside click close and restore focus.
  useEffect(() => {
    if (!menuOpen) return;
    panelRef.current?.querySelector<HTMLElement>('a')?.focus();

    const close = () => {
      setMenuOpen(false);
      toggleRef.current?.focus();
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
    };
    const onPointer = (e: PointerEvent) => {
      const t = e.target as Node;
      if (!panelRef.current?.contains(t) && !toggleRef.current?.contains(t)) close();
    };
    document.addEventListener('keydown', onKey);
    document.addEventListener('pointerdown', onPointer);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('pointerdown', onPointer);
    };
  }, [menuOpen]);

  // Close the menu if the viewport grows into the desktop layout.
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 62.5rem)');
    const onChange = () => mq.matches && setMenuOpen(false);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  const links = nav.map((item) => (
    <li key={item.href}>
      <a href={item.href} onClick={() => setMenuOpen(false)}>
        {item.label}
      </a>
    </li>
  ));

  return (
    <header className="site-header" data-solid={solid || menuOpen}>
      <div className="site-header__bar container">
        <a className="site-header__brand" href="#top" aria-label="AFTERLIGHT, לראש העמוד">
          <Wordmark />
        </a>

        <nav className="site-header__nav" aria-label="ראשי">
          <ul>{links}</ul>
        </nav>

        <a className="btn btn--light site-header__cta" href={navCta.href}>
          {navCta.label}
        </a>

        <button
          ref={toggleRef}
          type="button"
          className="site-header__toggle"
          aria-expanded={menuOpen}
          aria-controls={menuId}
          onClick={() => setMenuOpen((open) => !open)}
        >
          <span className="site-header__toggle-lines" aria-hidden="true" />
          {menuOpen ? 'סגירה' : 'תפריט'}
        </button>
      </div>

      <div ref={panelRef} id={menuId} className="site-header__panel" hidden={!menuOpen}>
        <nav className="container" aria-label="ראשי, נייד">
          <ul>{links}</ul>
          <a className="btn btn--light" href={navCta.href} onClick={() => setMenuOpen(false)}>
            {navCta.label}
          </a>
        </nav>
      </div>
    </header>
  );
}
