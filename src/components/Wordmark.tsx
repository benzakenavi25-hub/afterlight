import './Wordmark.css';

interface Props {
  descriptor?: boolean;
  className?: string;
}

/**
 * AFTERLIGHT wordmark: tracked Cormorant capitals cut by one fine horizon line.
 * The letters below the line are dimmed, as if the word were setting behind the horizon.
 */
export function Wordmark({ descriptor = false, className = '' }: Props) {
  return (
    <span className={`wordmark ${className}`}>
      <span className="wordmark__mark" dir="ltr" lang="en">
        <span className="wordmark__word">AFTERLIGHT</span>
        <span className="wordmark__below" aria-hidden="true">
          AFTERLIGHT
        </span>
      </span>
      {descriptor && <span className="wordmark__descriptor">פנטהאוז מול האופק</span>}
    </span>
  );
}
