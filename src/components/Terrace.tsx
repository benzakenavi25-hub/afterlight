import { useRef } from 'react';
import { terrace } from '../data/content';
import { stills } from '../data/media';
import { ResponsiveImage } from './ResponsiveImage';
import { useScrollTone } from '../useScrollTone';
import './Terrace.css';

/** Text sits alongside the photograph so furniture and view stay visible. */
export function Terrace() {
  const ref = useRef<HTMLElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  // Plaster → ivory while the area below the photograph rises from the bottom edge to 55% of the
  // screen; the text fades in with it (CSS), so it is never dark-on-dark.
  useScrollTone(ref, 1, 0.55, textRef);
  return (
    <section ref={ref} className="terrace" aria-labelledby="terrace-title">
      <figure className="terrace__figure">
        <ResponsiveImage still={stills['gallery-terrace']} sizes="100vw" className="terrace__img" />
        <figcaption className="visually-hidden">{terrace.caption}</figcaption>
      </figure>
      <div ref={textRef} className="container terrace__text">
        <p className="terrace__label latin" lang="en">
          {terrace.label}
        </p>
        <h2 id="terrace-title">{terrace.heading}</h2>
        <p className="terrace__copy">{terrace.text}</p>
      </div>
    </section>
  );
}
