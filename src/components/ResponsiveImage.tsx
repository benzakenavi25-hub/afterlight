import type { Still } from '../data/media';

interface Props {
  still: Still;
  sizes: string;
  className?: string;
  priority?: boolean;
  /** Fetched right away but at low priority (below-the-fold media needed soon). */
  eagerLow?: boolean;
  /** Override the manifest alt (e.g. '' for a decorative duplicate). */
  alt?: string;
  /** Art direction: a different still (and sizes) when `media` matches, e.g. a vertical crop for phones. */
  art?: { still: Still; media: string; sizes: string };
}

const srcset = (still: Still, ext: 'avif' | 'webp') =>
  still.widths.map((w) => `${import.meta.env.BASE_URL}media/${still.id}-${w}.${ext} ${w}w`).join(', ');

export function ResponsiveImage({ still, sizes, className, priority = false, eagerLow = false, alt, art }: Props) {
  const fallbackWidth = still.widths[Math.min(1, still.widths.length - 1)];
  return (
    <picture>
      {art && <source media={art.media} type="image/avif" srcSet={srcset(art.still, 'avif')} sizes={art.sizes} />}
      {art && <source media={art.media} type="image/webp" srcSet={srcset(art.still, 'webp')} sizes={art.sizes} />}
      <source type="image/avif" srcSet={srcset(still, 'avif')} sizes={sizes} />
      <source type="image/webp" srcSet={srcset(still, 'webp')} sizes={sizes} />
      <img
        className={className}
        src={`${import.meta.env.BASE_URL}media/${still.id}-${fallbackWidth}.webp`}
        width={still.width}
        height={still.height}
        alt={alt ?? still.alt}
        loading={priority || eagerLow ? 'eager' : 'lazy'}
        decoding={priority ? 'sync' : 'async'}
        fetchPriority={priority ? 'high' : eagerLow ? 'low' : 'auto'}
      />
    </picture>
  );
}
