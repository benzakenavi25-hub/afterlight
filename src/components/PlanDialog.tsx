import { useEffect, useRef, useState } from 'react';
import { plan, type ZoneId } from '../data/content';
import { stills } from '../data/media';
import { ResponsiveImage } from './ResponsiveImage';
import './PlanDialog.css';

interface DiagramProps {
  active: ZoneId;
  onSelect: (id: ZoneId) => void;
}

/**
 * Schematic relationship diagram — deliberately not a measured plan.
 * Zones are clickable as a pointer shortcut; the parallel buttons in the dialog are the accessible control.
 */
function PlanDiagram({ active, onSelect }: DiagramProps) {
  const zoneProps = (id: ZoneId) => ({
    className: 'zone',
    'data-active': active === id,
    onClick: () => onSelect(id),
  });

  return (
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
  );
}

interface Props {
  /** Zone to highlight when the dialog opens; null = closed. */
  zone: ZoneId | null;
  /** Fires on every close path (button, Escape, backdrop). The opener restores scroll and focus. */
  onClose: () => void;
}

/**
 * The conceptual plan on demand, in a native modal <dialog>: showModal() makes the page inert
 * (focus containment) and Escape fires `cancel`. Selecting a room only changes local state, so the
 * page underneath never moves.
 */
export function PlanDialog({ zone, onClose }: Props) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [active, setActive] = useState<ZoneId>(zone ?? 'living');
  const open = zone !== null;

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (zone !== null && !dialog.open) {
      setActive(zone);
      dialog.showModal();
    } else if (!open && dialog.open) {
      dialog.close();
    }
  }, [open, zone]);

  const current = plan.zones.find((z) => z.id === active)!;
  const close = () => dialogRef.current?.close();

  return (
    <dialog
      ref={dialogRef}
      className="plan-dialog"
      aria-labelledby="plan-dialog-title"
      onClose={onClose}
      onClick={(e) => {
        if (e.target === e.currentTarget) close(); // backdrop
      }}
    >
      {open && (
        <div className="plan-dialog__inner">
          <header className="plan-dialog__head">
            <h2 id="plan-dialog-title">{plan.heading}</h2>
            <button type="button" className="plan-dialog__close" onClick={close} autoFocus>
              סגירה
            </button>
          </header>

          <figure className="plan-dialog__figure">
            <PlanDiagram active={active} onSelect={setActive} />
            <figcaption className="plan-dialog__note">{plan.caption}</figcaption>
          </figure>

          <div className="plan-dialog__detail">
            <div className="plan__zones" role="group" aria-label="בחירת חלל בתכנית">
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
            <ResponsiveImage
              key={current.still}
              still={stills[current.still]}
              sizes="(min-width: 62.5rem) 30vw, 100vw"
              eagerLow
              className="plan-dialog__photo"
            />
            <h3 className="plan-dialog__label" aria-live="polite">
              {current.label}
            </h3>
          </div>
        </div>
      )}
    </dialog>
  );
}
