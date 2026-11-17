import { b2b, studio } from '../data/content';
import './StudioCTA.css';

/** Closing section: what this site is for, and how to commission one. Sits after the form, before the footer. */
export function StudioCTA() {
  return (
    <section id="studio" className="studio" aria-labelledby="studio-title">
      <div className="container studio__inner">
        <p className="studio__label latin" lang="en">
          {b2b.label}
        </p>
        <h2 id="studio-title" className="studio__title">
          {b2b.heading}
        </h2>
        <p className="studio__sub">{b2b.sub}</p>
        <ul className="studio__rows">
          {b2b.rows.map((row, i) => (
            <li key={row} className="studio__row" style={{ '--n': i } as React.CSSProperties}>
              {row}
            </li>
          ))}
        </ul>
        <div className="studio__actions">
          <a className="btn btn--primary studio__btn" href={studio.whatsapp} target="_blank" rel="noopener">
            <svg className="studio__wa" viewBox="0 0 24 24" width="22" height="22" aria-hidden="true" focusable="false">
              <path
                fill="currentColor"
                d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm0 18.2c-1.5 0-3-.4-4.3-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2Zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.3-.4.3-.4.8-1.4.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5c-.2 0-.4.1-.7.3-.2.3-.9.9-.9 2.2s.9 2.5 1 2.7c.1.2 1.8 2.8 4.4 3.9 1.6.7 2.3.8 3.1.6.5-.1 1.5-.6 1.7-1.2.2-.6.2-1.1.2-1.2-.1-.1-.3-.2-.5-.3Z"
              />
            </svg>
            {b2b.whatsapp}
            <span className="visually-hidden"> {b2b.newTab}</span>
          </a>
          <a className="btn btn--light studio__btn" href={studio.contactHref} target="_blank" rel="noopener">
            {b2b.site}
            <span className="visually-hidden"> {b2b.newTab}</span>
          </a>
        </div>
      </div>
    </section>
  );
}
