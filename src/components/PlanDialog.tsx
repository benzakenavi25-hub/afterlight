import { useState } from 'react';
import { plan, type ZoneId } from '../data/content';
import { stills } from '../data/media';
import { ResponsiveImage } from './ResponsiveImage';
import './ConceptPlan.css';

/**
 * Schematic relationship diagram — deliberately not a measured plan.
 * Zones are selectable by clicking the diagram (pointer) or the parallel buttons
 * (keyboard / assistive tech). One selected state, exposed with aria-pressed.
 */
export function ConceptPlan() {
  const [active, setActive] = useState<ZoneId>('entry');
  const zone = plan.zones.find((z) => z.id === active)!;

  // Pointer shortcut on the diagram; the buttons below are the accessible control.
  const zoneProps = (id: ZoneId) => ({
    className: 'zone',
    'data-active': active === id,
    onClick: () => setActive(id),
  });

  return (
    <section id="plan" className="plan" aria-labelledby="plan-title">
      <div className="container plan__grid">
        <header className="plan__head">
          <h2 id="plan-title">{plan.heading}</h2>
          <p>{plan.subcopy}</p>
        </header>

        <figure className="plan__figure">
          <svg className="plan__svg" viewBox="0 0 640 560" role="img" aria-labelledby="plan-svg-title plan-svg-desc">
            <title id="plan-svg-title">תכנית קונספט סכמטית של הבית</title>
            <desc id="plan-svg-desc">{plan.description}</desc>

            {/* Terrace across the far end */}
            <g {...zoneProps('terrace')}>
              <rect x="40" y="24" width="560" height="96" />
              <text x="320" y="78">מרפסת</text>
            </g>
            <line className="plan__glazing" x1="230" y1="120" x2="600" y2="120" />

            {/* Living above dining/kitchen */}
            <g {...zoneProps('living')}>
              <rect x="230" y="128" width="370" height="170" />
              <text x="515" y="218">סלון</text>
            </g>

            {/* Dining left, kitchen right — one zone, divided by the axis */}
            <g {...zoneProps('kitchen')}>
              <rect x="230" y="306" width="370" height="140" />
              <text x="322" y="382">פינת אוכל</text>
              <text x="508" y="382">מטבח</text>
            </g>

            {/* Entry at bottom centre */}
            <g {...zoneProps('entry')}>
              <rect x="365" y="454" width="100" height="70" />
              <text x="415" y="494">כניסה</text>
            </g>

            {/* Private wing branching left (conceptual relationship only) */}
            <g {...zoneProps('suite')}>
              <rect x="40" y="128" width="182" height="318" />
              <text x="131" y="280">סוויטה</text>
              <text className="plan__sub" x="131" y="306">
                חדר שינה ורחצה
              </text>
            </g>
            <line className="plan__link" x1="222" y1="400" x2="230" y2="400" />

            {/* The straight camera axis: entry → terrace */}
            <line className="plan__axis" x1="415" y1="454" x2="415" y2="40" />
            <path className="plan__axis-head" d="M407 52 L415 38 L423 52" />
          </svg>
          <figcaption className="plan__caption">{plan.caption}</figcaption>
        </figure>

        <div className="plan__detail">
          <div className="plan__zones" role="group" aria-label="בחירת אזור בתכנית">
            {plan.zones.map((z) => (
              <button
                key={z.id}
                type="button"
                className="plan__zone-btn"
                aria-pressed={z.id === active}
                onClick={() => setActive(z.id)}
              >
                {z.label}
              </button>
            ))}
          </div>
          <ResponsiveImage still={stills[zone.still]} sizes="(min-width: 62.5rem) 30vw, 100vw" className="plan__photo" />
          <div aria-live="polite">
            <h3>{zone.label}</h3>
            <p>{zone.text}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
