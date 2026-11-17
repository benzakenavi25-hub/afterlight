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
        <h2 id="materials-title" className="materials__title ruled">
          {materials.heading}
        </h2>
        {/* Phones/tablets: one horizontal snap row (focusable for keyboard scrolling); desktop: three in a row */}
        <ul className="materials__list" tabIndex={0} aria-label={materials.listLabel}>
          {materials.items.map((m) => (
            <li key={m.still} className="materials__item">
              <ResponsiveImage
                still={stills[m.still]}
                sizes="(min-width: 62.5rem) 28vw, (min-width: 40rem) 45vw, 85vw"
                className="materials__img"
              />
              <h3 className="materials__name">{m.name}</h3>
              <p className="materials__text">{m.text}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
