import { useState } from 'react';
import { galleryItems, spaces } from '../data/content';
import { stills, type StillId } from '../data/media';
import { Lightbox } from './Lightbox';
import { ResponsiveImage } from './ResponsiveImage';
import './SpacesGallery.css';

const items = galleryItems.map((g) => ({ still: stills[g.still], caption: g.caption }));
const indexOf = (id: StillId) => galleryItems.findIndex((g) => g.still === id);

interface PhotoProps {
  id: StillId;
  sizes: string;
  portrait?: boolean;
  onOpen: (index: number) => void;
}

function Photo({ id, sizes, portrait = false, onOpen }: PhotoProps) {
  const i = indexOf(id);
  return (
    <button
      type="button"
      className={`space__open${portrait ? ' space__open--portrait' : ''}`}
      onClick={() => onOpen(i)}
      aria-label={`הגדלת התמונה: ${galleryItems[i].caption}`}
    >
      <ResponsiveImage still={stills[id]} sizes={sizes} className="space__img" />
    </button>
  );
}

/** Editorial gallery stills (not part of the camera route). Each image opens the lightbox. */
export function SpacesGallery() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section id="spaces" className="spaces" aria-labelledby="spaces-title">
      <div className="container">
        <h2 id="spaces-title" className="spaces__title">
          {spaces.heading}
        </h2>

        <article className="space space--living" aria-labelledby="space-living-title">
          <figure className="space__figure">
            <Photo id="gallery-living" sizes="(min-width: 62.5rem) 62vw, 100vw" onOpen={setOpen} />
            <figcaption className="space__caption">{spaces.living.caption}</figcaption>
          </figure>
          <div className="space__text">
            <h3 id="space-living-title">{spaces.living.heading}</h3>
            <p>{spaces.living.text}</p>
          </div>
        </article>

        <article className="space space--kitchen" aria-labelledby="space-kitchen-title">
          <figure className="space__figure">
            <Photo id="gallery-kitchen" sizes="(min-width: 62.5rem) 55vw, 100vw" onOpen={setOpen} />
            <figcaption className="space__caption">{spaces.kitchen.caption}</figcaption>
          </figure>
          <div className="space__text">
            <h3 id="space-kitchen-title">{spaces.kitchen.heading}</h3>
            <p>{spaces.kitchen.text}</p>
          </div>
        </article>

        <article className="space space--suite" aria-labelledby="space-suite-title">
          <div className="space__text">
            <h3 id="space-suite-title">{spaces.suite.heading}</h3>
            <p>{spaces.suite.text}</p>
          </div>
          <figure className="space__figure space__figure--pair">
            <Photo id="gallery-bedroom" sizes="(min-width: 62.5rem) 50vw, 100vw" onOpen={setOpen} />
            <Photo id="gallery-bathroom" sizes="(min-width: 62.5rem) 22vw, 60vw" portrait onOpen={setOpen} />
            <figcaption className="space__caption">{spaces.suite.caption}</figcaption>
          </figure>
        </article>
      </div>

      <Lightbox items={items} index={open} onClose={() => setOpen(null)} onNavigate={setOpen} />
    </section>
  );
}
