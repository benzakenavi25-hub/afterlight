/**
 * Typed media manifest. Assignments come from visual inspection (docs/MEDIA-MAP.md).
 * Derivatives live in public/media as `${id}-${width}.{avif,webp}`.
 */

export type MediaStatus = 'ready' | 'interim' | 'missing';

export type StillId =
  | 'tour-01-entry'
  | 'tour-02-kitchen-dining'
  | 'tour-03-living-entry'
  | 'tour-04-living'
  | 'tour-05-threshold'
  | 'tour-06-terrace'
  | 'gallery-living'
  | 'gallery-kitchen'
  | 'gallery-bedroom'
  | 'gallery-bathroom'
  | 'gallery-terrace'
  | 'detail-walnut'
  | 'detail-stone'
  | 'detail-textile'
  | 'exterior-facade';

export interface Still {
  id: StillId;
  role: 'tour' | 'gallery' | 'detail' | 'exterior';
  status: MediaStatus;
  /** Intrinsic size of the largest derivative (used for aspect ratio / CLS). */
  width: number;
  height: number;
  widths: number[];
  alt: string;
}

const LANDSCAPE = { width: 1672, height: 941, widths: [640, 960, 1280, 1672] };
const PORTRAIT = { width: 1122, height: 1402, widths: [480, 800, 1122] };

const missingTour = (id: StillId, alt: string): Still => ({
  id,
  role: 'tour',
  status: 'missing',
  ...LANDSCAPE,
  alt,
});

export const stills: Record<StillId, Still> = {
  // First frame of the supplied tour master (AFTERLIGHT-tour-master.mp4), extracted locally.
  'tour-01-entry': {
    id: 'tour-01-entry',
    role: 'tour',
    status: 'ready',
    width: 1920,
    height: 1080,
    widths: [640, 960, 1280, 1920],
    alt: 'מבט מהכניסה: פינת האוכל משמאל, המטבח עם אי האבן מימין, והסלון והעיר לפנים',
  },
  'tour-02-kitchen-dining': missingTour('tour-02-kitchen-dining', 'בין פינת האוכל למטבח, לאורך הציר המרכזי'),
  'tour-03-living-entry': missingTour('tour-03-living-entry', 'הכניסה לסלון'),
  'tour-04-living': missingTour('tour-04-living', 'הסלון, עם שולחנות האבן והכורסה בגוון קוניאק'),
  'tour-05-threshold': missingTour('tour-05-threshold', 'סף הזכוכית הפתוחה אל המרפסת'),
  'tour-06-terrace': missingTour('tour-06-terrace', 'המרפסת מול העיר והים'),
  'gallery-living': {
    id: 'gallery-living',
    role: 'gallery',
    status: 'ready',
    ...LANDSCAPE,
    alt: 'סלון עם ספה אפורה רחבה, שולחנות אבן נמוכים וספריית אגוז מוארת, נפתח דרך קיר זכוכית אל המרפסת והעיר בשעת דמדומים',
  },
  'gallery-kitchen': {
    id: 'gallery-kitchen',
    role: 'gallery',
    status: 'ready',
    ...LANDSCAPE,
    alt: 'אי מטבח מאבן אפורה־חומה עם שלושה כיסאות בר מעור קוניאק, מול קיר נגרות אגוז ונישה מוארת',
  },
  'gallery-bedroom': {
    id: 'gallery-bedroom',
    role: 'gallery',
    status: 'ready',
    ...LANDSCAPE,
    alt: 'חדר שינה עם קיר אגוז מואר, מיטה בגווני טאופ וחלון רחב אל העיר בשעת ערב',
  },
  'gallery-bathroom': {
    id: 'gallery-bathroom',
    role: 'gallery',
    status: 'ready',
    ...PORTRAIT,
    alt: 'חדר רחצה מאבן עם ארון אגוז תלוי, אמבטיה עומדת וזכוכית מחורצת לפרטיות',
  },
  'gallery-terrace': {
    id: 'gallery-terrace',
    role: 'gallery',
    status: 'ready',
    ...LANDSCAPE,
    alt: 'מרפסת פתוחה עם ספה, פוף קלוע ופנס מואר, מול קו רקיע עירוני והים בשעת דמדומים',
  },
  'detail-walnut': {
    id: 'detail-walnut',
    role: 'detail',
    status: 'ready',
    ...PORTRAIT,
    alt: 'מפגש לוחות אגוז כהה ונישת אבן עם תאורה רכה',
  },
  'detail-stone': {
    id: 'detail-stone',
    role: 'detail',
    status: 'ready',
    ...PORTRAIT,
    alt: 'פינת אי האבן בחיבור מיטר, עם עורקים עדינים',
  },
  'exterior-facade': {
    id: 'exterior-facade',
    role: 'exterior',
    status: 'ready',
    ...LANDSCAPE,
    alt: 'חזית בניין מגורים מאבן בהירה בשעת דמדומים, עם מרפסות מוארות ופנטהאוז זכוכית בקומה העליונה, מול מפרץ ועיר. הדמיית קונספט.',
  },
  'detail-textile': {
    id: 'detail-textile',
    role: 'detail',
    status: 'ready',
    ...PORTRAIT,
    alt: 'ריפוד הספה ושמיכת צמר עם פרנזים',
  },
};

/**
 * Hero poster: tour-01-entry when available, otherwise a named interim still
 * of the same home. The interim choice is reported in docs/MEDIA-MAP.md.
 */
const INTERIM_HERO: StillId = 'gallery-terrace';

export const heroPoster: Still =
  stills['tour-01-entry'].status === 'ready' ? stills['tour-01-entry'] : stills[INTERIM_HERO];

export type TourStatus = 'missing' | 'partial' | 'ready';

/**
 * Tour film. Only 'ready' may expose a scroll tour or play control.
 * Both files are re-encodes of AFTERLIGHT-tour-master.mp4 (see docs/MEDIA-MAP.md):
 * desktop = 1080p, keyframe every 12 frames, no B-frames (seek-friendly scrub);
 * mobile  = 960x540, keyframe every 8 frames, no B-frames (scrub on phones).
 */
export const tour = {
  status: 'ready' as TourStatus,
  /**
   * TOUR PACE — the one place to tune it. Scroll distance of the tour, in viewport heights,
   * BEYOND the pinned stage itself (the stage is 1 viewport tall). Lower = faster / shorter tour.
   * `wide` applies at ≥ 62.5rem, `narrow` below. Starting values, to be tuned by feel.
   */
  scroll: { wide: 2.5, narrow: 2 },
  desktopSrc: `${import.meta.env.BASE_URL}media/tour-master-desktop.mp4`,
  mobileSrc: `${import.meta.env.BASE_URL}media/tour-master-mobile.mp4`,
  duration: 25,
  /** Chapter label by fraction of the film (straight rail, entrance → terrace). */
  chapters: [
    { from: 0, label: 'כניסה' },
    { from: 0.1, label: 'מטבח ופינת אוכל' },
    { from: 0.32, label: 'סלון' },
    { from: 0.74, label: 'מרפסת' },
  ],
};

/**
 * Tour card framing (TourHero). The film sits in a card on the plaster and grows with the same scroll
 * progress as the film until it fills the stage at the terrace (seamless hand-off to the exterior reveal).
 */
export const tourCard = {
  /**
   * Card at the start of the tour (and the static card for reduced motion / no film).
   * wide: share of the stage (width, height), centred — desktop and landscape screens.
   * narrow: portrait phones/tablets (< 62.5rem): full width minus the page gutter on both sides,
   * `ratio` = width / height of the film window, `top` = px between the header and the card
   * (the chapter word sits there).
   */
  start: { wide: { w: 0.86, h: 0.76 }, narrow: { ratio: 3 / 2, top: 44 } },
  /** Progress (0–1) where the main growth starts; the card grows mostly after it (last 35%). */
  growFrom: 0.65,
  /** Share of the growth that happens before growFrom (a slow drift). 0 = card still until then. */
  early: 0.15,
  /** Corner radius in px at the start; reaches 0 when the card fills the stage. */
  radius: 6,
  /** Opacity of the large chapter word behind the card (it also fades as the card grows). */
  wordOpacity: 0.14,
};

/**
 * Exterior reveal (letters → facade). Everything tunable about the transition lives here.
 * See ExteriorReveal.tsx for how each value is used.
 */
export const reveal = {
  /** Extra scroll distance in viewport heights beyond the pinned stage. Lower = shorter/faster. */
  scroll: { wide: 1.5, narrow: 1.2 },
  /** Share of the timeline: [zoom starts, mask fully open]. Before = name readable, after = image + text. */
  zoom: [0.12, 0.8] as [number, number],
  /** Fraction of the stage the two-line name may occupy (width, height). */
  block: { wide: { w: 0.7, h: 0.6 }, narrow: { w: 0.86, h: 0.5 } },
  /**
   * Which letter and where inside its stem the zoom aims. 'AFTER' line, character index 2 = the T:
   * its vertical stem is one solid rectangle, so the opening can never land in a gap.
   */
  focus: { line: 0, char: 2 },
  /** Safety margin on the final scale so the opened mask always overshoots the screen. */
  overshoot: 1.2,
  /** Photo crop (CSS object-position). Portrait keeps the penthouse glazing column in frame. */
  objectPosition: { landscape: '50% 50%', portrait: '54% 50%' },
};

/**
 * Spaces image stack (SpacesStack). Everything tunable about the pinned sequence lives here;
 * stage copy, photos, crops and colours are in content.ts (spacesStack).
 */
export const stack = {
  /** Extra scroll distance in viewport heights beyond the pinned stage. Lower = shorter/faster. */
  scroll: { wide: 1.8, narrow: 1.5 },
  /**
   * Share of the timeline (0–1) for each card transition: [starts, ends]. The gaps before, between
   * and after are the settled, readable intervals (living / kitchen / bedroom).
   */
  transitions: [
    [0.18, 0.42],
    [0.58, 0.82],
  ] as [number, number][],
  /** Vertical offset of the incoming / outgoing text, in px. */
  textOffset: 8,
  /** Starting scale of an incoming card (it settles to 1 while fading in). 1 = no movement. */
  cardScale: 1.04,
  /**
   * Scroll-scrubbed intro while the section rises into place (ScrollTrigger start/end; end = when the
   * pin starts). Background ivory → `mid` → plaster in the first `split[0]` of it, text fades in over
   * the last `split[1]`. `mid` is a warm stop so the change never passes through grey.
   */
  intro: { start: 'top 90%', end: 'top top', mid: '#a88a6d', split: [0.7, 0.3] as [number, number] },
};
