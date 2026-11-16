import type { Still } from '../data/media';

interface Props {
  still: Still;
  sizes: string;
  className?: string;
  priority?: boolean;
  /** Override the manifest alt (e.g. '' for a decorative duplicate). */
  alt?: string;
}

const srcset = (still: Still, ext: 'avif' | 'webp') =>
  still.widths.map((w) => `${import.meta.env.BASE_URL}media/${still.id}-${w}.${ext} ${w}w`).join(', ');

export function ResponsiveImage({ still, sizes, className, priority = false, alt }: Props) {
  const fallbackWidth = still.widths[Math.min(1, still.widths.length - 1)];
  return (
    <picture>
      <source type="image/avif" srcSet={srcset(still, 'avif')} sizes={sizes} />
      <source type="image/webp" srcSet={srcset(still, 'webp')} sizes={sizes} />
      <img
        className={className}
        src={`${import.meta.env.BASE_URL}media/${still.id}-${fallbackWidth}.webp`}
        width={still.width}
        height={still.height}
        alt={alt ?? still.alt}
        loading={priority ? 'eager' : 'lazy'}
        decoding={priority ? 'sync' : 'async'}
        fetchPriority={priority ? 'high' : 'auto'}
      />
    </picture>
  );
}
