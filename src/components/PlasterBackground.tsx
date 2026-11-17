import './PlasterBackground.css';

/**
 * The site's dark surface: warm charcoal with a faint mineral-plaster texture and broad, soft light.
 * Rendered once, fixed to the viewport behind all content and fully static (no animation, no
 * pointer or scroll effects), so pinned and sticky sections sit still on it. Dark sections are
 * transparent and reveal it; light sections and photography are opaque and cover it.
 * Tuning: --plaster-* tokens in styles/tokens.css.
 */
export function PlasterBackground() {
  return <div className="plaster" aria-hidden="true" />;
}
