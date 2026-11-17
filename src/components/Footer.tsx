import { footer, nav, studio } from '../data/content';
import { Wordmark } from './Wordmark';
import './Footer.css';

export function Footer() {
  return (
    <footer className="footer">
      <div className="container footer__grid">
        <a className="footer__brand" href="#top" aria-label="AFTERLIGHT, לראש העמוד">
          <Wordmark />
        </a>
        <nav aria-label="תחתון">
          <ul className="footer__nav">
            {nav.map((item) => (
              <li key={item.href}>
                <a href={item.href}>{item.label}</a>
              </li>
            ))}
          </ul>
        </nav>
        <p className="footer__meta">
          {footer.concept} · {footer.credit} <a className="footer__studio" href={studio.contactHref} target="_blank" rel="noopener" dir="ltr">
            {studio.name}
          </a>
        </p>
        <p className="footer__privacy">{footer.privacy}</p>
      </div>
    </footer>
  );
}
