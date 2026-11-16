import { overview } from '../data/content';
import './HomeOverview.css';

export function HomeOverview() {
  return (
    <section id="home" className="overview" aria-labelledby="overview-title">
      <div className="container overview__grid">
        <p className="overview__label latin" lang="en">
          {overview.label}
        </p>
        <h2 id="overview-title" className="overview__title">
          {overview.heading}
        </h2>
        <p className="overview__text">{overview.text}</p>
        <ul className="overview__features">
          {overview.features.map((f) => (
            <li key={f}>{f}</li>
          ))}
        </ul>
      </div>
    </section>
  );
}
