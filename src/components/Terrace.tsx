import { terrace } from '../data/content';
import { stills } from '../data/media';
import { ResponsiveImage } from './ResponsiveImage';
import './Terrace.css';

/** Text sits alongside the photograph so furniture and view stay visible. */
export function Terrace() {
  return (
    <section className="terrace" aria-labelledby="terrace-title">
      <figure className="terrace__figure">
        <ResponsiveImage still={stills['gallery-terrace']} sizes="100vw" className="terrace__img" />
        <figcaption className="visually-hidden">{terrace.caption}</figcaption>
      </figure>
      <div className="container terrace__text">
        <p className="terrace__label latin" lang="en">
          {terrace.label}
        </p>
        <h2 id="terrace-title">{terrace.heading}</h2>
        <p className="terrace__copy">{terrace.text}</p>
      </div>
    </section>
  );
}
