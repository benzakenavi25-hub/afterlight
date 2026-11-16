import { useEffect, useRef, type KeyboardEvent } from 'react';
import type { Still } from '../data/media';
import { ResponsiveImage } from './ResponsiveImage';
import './Lightbox.css';

export interface LightboxItem {
  still: Still;
  caption: string;
}

interface Props {
  items: LightboxItem[];
  index: number | null;
  onClose: () => void;
  onNavigate: (index: number) => void;
}

/**
 * Modal image viewer on the native <dialog>: showModal() makes the page inert (focus trap),
 * Escape fires `cancel`. Page scroll is locked only while open; focus returns to the opener.
 */
export function Lightbox({ items, index, onClose, onNavigate }: Props) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const openerRef = useRef<HTMLElement | null>(null);
  const open = index !== null;

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) {
      openerRef.current = document.activeElement as HTMLElement | null;
      document.documentElement.classList.add('is-scroll-locked');
      dialog.showModal();
    } else if (!open && dialog.open) {
      dialog.close();
    }
  }, [open]);

  // Runs for every close path (button, Escape, backdrop): unlock scroll and restore focus.
  const handleClose = () => {
    document.documentElement.classList.remove('is-scroll-locked');
    openerRef.current?.focus();
    onClose();
  };

  // Safety: never leave the page locked if the component unmounts while open.
  useEffect(() => () => document.documentElement.classList.remove('is-scroll-locked'), []);

  const count = items.length;
  const go = (step: number) => {
    if (index === null) return;
    onNavigate((index + step + count) % count);
  };

  const onKeyDown = (e: KeyboardEvent) => {
    // RTL: the left arrow moves forward
    if (e.key === 'ArrowLeft') go(1);
    else if (e.key === 'ArrowRight') go(-1);
  };

  const item = index !== null ? items[index] : null;

  return (
    <dialog
      ref={dialogRef}
      className="lightbox"
      aria-labelledby="lightbox-caption"
      onClose={handleClose}
      onKeyDown={onKeyDown}
      onClick={(e) => {
        if (e.target === e.currentTarget) dialogRef.current?.close();
      }}
    >
      {item && (
        <div className="lightbox__inner">
          <button type="button" className="lightbox__close" onClick={() => dialogRef.current?.close()} autoFocus>
            סגירה
          </button>
          <figure className="lightbox__figure">
            <ResponsiveImage still={item.still} sizes="92vw" priority className="lightbox__img" />
            <figcaption id="lightbox-caption" className="lightbox__caption">
              {item.caption}
              <span className="lightbox__count">
                <bdi>{index! + 1}</bdi> מתוך <bdi>{count}</bdi>
              </span>
            </figcaption>
          </figure>
          <div className="lightbox__nav">
            <button type="button" className="btn btn--light" onClick={() => go(-1)}>
              הקודמת
            </button>
            <button type="button" className="btn btn--light" onClick={() => go(1)}>
              הבאה
            </button>
          </div>
        </div>
      )}
    </dialog>
  );
}
