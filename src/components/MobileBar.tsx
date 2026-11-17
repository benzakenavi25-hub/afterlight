import { useEffect, useState } from 'react';
import { mobileBar } from '../data/content';
import './MobileBar.css';

const NARROW = '(max-width: 62.49rem)';

/**
 * Phones only: fixed bottom bar with the two main actions. Shown once the opening (#reveal) has
 * scrolled away; hidden while the visit form or the footer is on screen. Inert while hidden.
 * The plan link opens the plan dialog (SpacesStack handles every link to PLAN_HREF).
 */
export function MobileBar() {
  const [narrow, setNarrow] = useState(() => window.matchMedia(NARROW).matches);
  const [past, setPast] = useState(false);
  const [blocked, setBlocked] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia(NARROW);
    const on = () => setNarrow(mq.matches);
    mq.addEventListener('change', on);
    return () => mq.removeEventListener('change', on);
  }, []);

  useEffect(() => {
    if (!narrow) return;
    document.documentElement.classList.add('has-mobilebar');
    const reveal = document.getElementById('reveal');
    const ends = [document.getElementById('visit'), document.querySelector('.footer')].filter(Boolean) as Element[];
    // A scroll check, not an observer: a jump past the opening (anchor link) never makes it intersect.
    let raf = 0;
    const check = () => {
      raf = 0;
      setPast(!reveal || reveal.getBoundingClientRect().bottom < 0);
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(check);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    check();
    const seen = new Set<Element>();
    const io2 = new IntersectionObserver((entries) => {
      entries.forEach((e) => (e.isIntersecting ? seen.add(e.target) : seen.delete(e.target)));
      setBlocked(seen.size > 0);
    });
    ends.forEach((el) => io2.observe(el));
    return () => {
      window.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(raf);
      io2.disconnect();
      document.documentElement.classList.remove('has-mobilebar');
    };
  }, [narrow]);

  if (!narrow) return null;
  const shown = past && !blocked;
  return (
    <nav className="mbar" aria-label={mobileBar.label} data-shown={shown} inert={!shown}>
      <a className="btn btn--primary mbar__btn" href={mobileBar.visit.href}>
        {mobileBar.visit.label}
      </a>
      <a className="btn btn--light mbar__btn" href={mobileBar.plan.href}>
        {mobileBar.plan.label}
      </a>
    </nav>
  );
}
