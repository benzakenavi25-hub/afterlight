import { materials } from '../data/content';
import { stills } from '../data/media';
import { ResponsiveImage } from './ResponsiveImage';
import './MaterialDetails.css';

export function MaterialDetails() {
  return (
    <section className="materials" aria-labelledby="materials-title">
      <div className="container">
        <p className="materials__word latin" lang="en" aria-hidden="true">
          {materials.label}
        </p>
        <h2 id="materials-title" className="materials__title">
          {materials.heading}
        </h2>
        <ul className="materials__list">
          {materials.items.map((m) => (
            <li key={m.still} className="materials__item">
              <ResponsiveImage
                still={stills[m.still]}
                sizes="(min-width: 62.5rem) 28vw, (min-width: 40rem) 60vw, 100vw"
                className="materials__img"
              />
              <p>
                <strong>{m.name}</strong> — {m.text}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
