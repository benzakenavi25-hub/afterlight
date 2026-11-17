/**
 * Typed media manifest. Assignments come from visual inspection (docs/MEDIA-MAP.md).
 * Derivatives live in public/media as `${id}-${width}.{avif,webp}`.
 */

export type MediaStatus = 'ready' | 'interim' | 'missing';

export type StillId =
  | 'tour-01-entry'
  | 'tour-01-entry-vertical'
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
  | 'terrace-panorama'
  | 'detail-walnut'
  | 'detail-stone'
  | 'detail-textile'
  | 'exterior-facade'
  | 'facade-vertical'
  | 'material-walnut'
  | 'material-stone'
  | 'material-textile';

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
const SQUARE = { width: 1254, height: 1254, widths: [480, 800, 1254] };

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
  // First frame of the vertical (9:16) tour film: the phone-portrait hero poster.
  'tour-01-entry-vertical': {
    id: 'tour-01-entry-vertical',
    role: 'tour',
    status: 'ready',
    width: 1080,
    height: 1920,
    widths: [480, 720, 1080],
    alt: 'מבט מהכניסה: פינת האוכל והמטבח עם אי האבן, והסלון והעיר לפנים',
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
  // Terrace panorama (≈3:1) for the horizontal pan. Widths must match what build-media.sh produced:
  // from the 2172×724 PNG → [1600, 2172]; from the 4344×1448 JPEG → [1600, 2600, 4344] (width 4344, height 1448).
  'terrace-panorama': {
    id: 'terrace-panorama',
    role: 'gallery',
    status: 'ready',
    width: 2172,
    height: 724,
    widths: [1600, 2172],
    alt: 'מרפסת גג רחבה בשעה הכחולה: ספה, פוף קלוע ופנס מואר בין עצי זית, ומעבר למעקה הזכוכית העיר, שני מגדלים והים עד האופק',
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
  // Portrait-phone facade for the exterior reveal (941×1672 source, new-media/).
  'facade-vertical': {
    id: 'facade-vertical',
    role: 'exterior',
    status: 'ready',
    width: 941,
    height: 1672,
    widths: [640, 941],
    alt: 'חזית בניין מגורים מאבן בהירה בשעה הכחולה, עם מרפסות מוארות ופנטהאוז זכוכית בקומה העליונה, ומאחור מפרץ ועיר. הדמיית קונספט.',
  },
  // Square texture samples for the materials sample card (1254×1254 sources, new-media/).
  'material-walnut': {
    id: 'material-walnut',
    role: 'detail',
    status: 'ready',
    ...SQUARE,
    alt: 'דוגמת עץ אגוז כהה בסיבים אנכיים',
  },
  'material-stone': {
    id: 'material-stone',
    role: 'detail',
    status: 'ready',
    ...SQUARE,
    alt: 'דוגמת אבן טבעית בגוון חם',
  },
  'material-textile': {
    id: 'material-textile',
    role: 'detail',
    status: 'ready',
    ...SQUARE,
    alt: 'דוגמת אריג קלוע בגוון טאופ חם, מקופל',
  },
};

/**
 * Hero poster: tour-01-entry when available, otherwise a named interim still
 * of the same home. The interim choice is reported in docs/MEDIA-MAP.md.
 */
const INTERIM_HERO: StillId = 'gallery-terrace';

export const heroPoster: Still =
  stills['tour-01-entry'].status === 'ready' ? stills['tour-01-entry'] : stills[INTERIM_HERO];

/** Phone portrait (< 62.5rem, portrait): first frame of the vertical film. Mirrored in index.html preload. */
export const heroPosterVertical: Still = stills['tour-01-entry-vertical'];

export type TourStatus = 'missing' | 'partial' | 'ready';

/**
 * Tour film. Only 'ready' may expose a scroll tour or play control.
 * Both files are re-encodes of AFTERLIGHT-tour-master.mp4 (see docs/MEDIA-MAP.md):
 * desktop = 1080p, keyframe every 12 frames, no B-frames (seek-friendly scrub);
 * mobile  = 960x540, keyframe every 8 frames, no B-frames (scrub on landscape phones / small tablets).
 * vertical = re-encode of the separate vertical (9:16) film, used on phone portrait.
 */
export const tour = {
  status: 'ready' as TourStatus,
  /**
   * TOUR PACE — the one place to tune it. Scroll distance of the tour, in viewport heights,
   * BEYOND the pinned stage itself (the stage is 1 viewport tall). Lower = faster / shorter tour.
   * `wide` applies at ≥ 62.5rem, `narrow` below, `vertical` on phone portrait (the vertical film is
   * also 25 s, so the same distance keeps the same pace). Starting values, to be tuned by feel.
   */
  scroll: { wide: 2.5, narrow: 2, vertical: 2 },
  desktopSrc: `${import.meta.env.BASE_URL}media/tour-master-desktop.mp4`,
  mobileSrc: `${import.meta.env.BASE_URL}media/tour-master-mobile.mp4`,
  /** Phone portrait: the vertical (9:16) film, 1080x1920, keyframe every 8 frames, no B-frames. */
  verticalSrc: `${import.meta.env.BASE_URL}media/tour-master-vertical.mp4`,
  duration: 25,
  /** Chapter label by fraction of the film (straight rail, entrance → terrace). */
  chapters: [
    { from: 0, label: 'כניסה' },
    { from: 0.1, label: 'מטבח ופינת אוכל' },
    { from: 0.32, label: 'סלון' },
    { from: 0.74, label: 'מרפסת' },
  ],
  /**
   * The same chapters on the vertical film (phone portrait), read from its contact sheet: kitchen and
   * stools from ~2.5 s, living (sofa, armchair) from ~9 s, terrace once the glass doors are passed (~22.5 s).
   */
  chaptersVertical: [
    { from: 0, label: 'כניסה' },
    { from: 0.1, label: 'מטבח ופינת אוכל' },
    { from: 0.36, label: 'סלון' },
    { from: 0.9, label: 'מרפסת' },
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
   * vertical: portrait phones/tablets (< 62.5rem, portrait; vertical 9:16 film): full width minus the
   * page gutter on both sides, `h` = share of the stage height. Shorter on short screens, so the label
   * and chapter word above and the headline block below always fit.
   */
  start: { wide: { w: 0.86, h: 0.76 }, vertical: { h: 0.66 } },
  /** Progress (0–1) where the main growth starts; the card grows mostly after it (last 35%). */
  growFrom: 0.65,
  /** Share of the growth that happens before growFrom (a slow drift). 0 = card still until then. */
  early: 0.15,
  /** Corner radius in px at the start; reaches 0 when the card fills the stage. */
  radius: 6,
  /** Opacity of the large chapter word behind the card (it also fades as the card grows). */
  wordOpacity: 0.25,
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
  objectPosition: { landscape: '50% 50%', portrait: '54% 50%', vertical: '48% 48%' },
  /**
   * Portrait phones/tablets (< 62.5rem, portrait) use facade-vertical in the reveal and the exit.
   * `vertical` above = its crop; 48% 48% keeps the penthouse floor centred behind the letters.
   */
  verticalMedia: '(max-width: 62.4375rem) and (orientation: portrait)',
  /**
   * Exit after the reveal has ended (name + descriptor shown): the facade shrinks into a card on the
   * plaster while the facts strip rises over it. Added after the reveal; the reveal itself keeps its
   * own scroll distance (`scroll`) unchanged.
   */
  exit: {
    /** Extra scroll distance of the exit, in viewport heights (wide ≥ 62.5rem / narrow). */
    scroll: { wide: 0.8, narrow: 0.8 },
    /** Share of the exit (0–1) after which the facts strip starts rising from the bottom edge. */
    factsFrom: 0.35,
    /**
     * The whole layer (photo + name) scales down uniformly into a card — never cropped, so the whole
     * building stays in it. Final scale = the largest that fits both `maxScale` and the free band
     * between `top` (share of the stage) and the risen facts strip minus `gap` px; centred in that band.
     */
    maxScale: 0.86,
    top: 0.08,
    gap: 16,
    /** Final corner radius in px (on screen, compensated for the scale). */
    radius: 6,
    /** Final darkening of the facade (opacity of a dark layer, 0 = none). */
    dim: 0.22,
  },
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
   * Parallax of the photo inside its frame: yPercent from +parallax to −parallax over the pinned
   * sequence. The photo is over-scaled in CSS (SpacesStack.css --ss-over, 1.14) so no edge shows.
   */
  parallax: 6,
  /**
   * Scroll-scrubbed intro while the section rises into place (ScrollTrigger start/end; end = when the
   * pin starts). Background ivory → `mid` → plaster in the first `split[0]` of it, text fades in over
   * the last `split[1]`. `mid` is a warm stop so the change never passes through grey.
   */
  intro: { start: 'top 95%', end: 'top 25%', mid: '#a88a6d', split: [0.7, 0.3] as [number, number] },
};

/**
 * Materials — "from the room to the detail" (MaterialDetails). Pinned section on gallery-living; per
 * material: spotlight → gentle camera zoom (the room never disappears) → a square sample card pops in
 * beside the spot (thin bronze leader line, caption under it) → card out → pull-back.
 * Copy and sample stills are in content.ts (materials).
 */
export const materials = {
  /** Extra scroll distance in viewport heights beyond the pinned stage. Lower = shorter/faster. */
  scroll: { wide: 3.5, narrow: 3 },
  /**
   * Hot spots on gallery-living, in % of the photo (x from the left, y from the top). Same order as
   * content.ts materials.items: walnut shelving wall, stone table, throw on the sofa.
   */
  spots: [
    { x: 24, y: 36 },
    { x: 55, y: 79 },
    { x: 23, y: 76 },
  ],
  /** Spotlight radius as a share of the photo width (soft edge), and how dark the rest gets (0–1). */
  spotRadius: 0.11,
  dim: 0.55,
  /** Camera zoom at the peak (scale of the room photo). Kept ≤ 2 so the room stays sharp. */
  zoom: 2,
  /**
   * Sample card (square) as a share of the frame width, phones (< 62.5rem) / desktop; `gap` = px between
   * the spot and the card, `margin` = px kept free from the frame edges.
   */
  card: { narrow: 0.42, wide: 0.28, gap: 30, margin: 12 },
  /**
   * Phases inside each material's share of the scroll (0–1): spotlight, zoom in, sample card in
   * (scale 0.92 → 1 + fade, line draws), card out (reverse), pull-back (none after the last one).
   */
  phases: {
    spot: [0, 0.14] as [number, number],
    zoom: [0.14, 0.44] as [number, number],
    cardIn: [0.44, 0.54] as [number, number],
    cardOut: [0.7, 0.8] as [number, number],
    out: [0.8, 1] as [number, number],
  },
  /** Phones: MINIMUM frame height in svh (the frame takes whatever the screen leaves), and which point of the photo stays in view (%). */
  narrowHeight: 38,
  focus: { x: 40, y: 55 },
  /** Vertical offset of the incoming / outgoing caption, in px. */
  textOffset: 10,
};

/**
 * Terrace (Terrace.tsx): the panorama sits in a frame wider than the screen and pans sideways while the
 * section passes through the viewport (scrubbed, no pin). To use another panorama: replace the file
 * (build-media.sh) and update `still` widths + `pan.ratio`.
 */
export const terrace = {
  still: 'terrace-panorama' as StillId,
  pan: {
    /** Width / height of the panorama file. */
    ratio: 2172 / 724,
    /** 'ltr' = starts on the left edge of the photo (sofa, lantern) and ends on the right (sea). */
    direction: 'ltr' as 'ltr' | 'rtl',
    /** Share of the available sideways overflow that is travelled (0–1). wide ≥ 62.5rem / narrow. */
    distance: { wide: 1, narrow: 1 },
    /** Frame height in svh. Taller = wider photo = more travel. */
    height: { wide: 72, narrow: 65 },
    /** Desktop: extra photo height cut off at the bottom (floor), as a share, so the horizon sits mid-frame. */
    cropBottom: { wide: 0.16, narrow: 0 },
    /** ScrollTrigger range on the frame: pan starts / ends (ends on the horizon while still in view). */
    start: 'top bottom',
    end: 'bottom 30%',
    /** Reduced motion / no GSAP: static crop of the panorama (CSS object-position). */
    staticPosition: '70% 45%',
  },
  /** Sea horizon in the panorama file, as a share of its height (the bronze line starts on it). */
  horizon: 0.435,
  /**
   * Shares of the pan (0–1): the text on the sky fades in, the bronze horizon line draws (right → left).
   * Then the line continues across the ivory band below (`run`, ScrollTrigger start/end on the band)
   * and bends into the coastline of the location map (location.phases.line).
   */
  textAt: [0.6, 0.9] as [number, number],
  lineAt: [0.72, 1] as [number, number],
  run: { start: 'top bottom', end: 'top 64%' }, // ~40% shorter than top 40%
};

/**
 * Location map (Location.tsx): pinned, scrubbed. The terrace's horizon line arrives straight across the
 * top of the drawing and bends into the coastline (same 7 points), the map pulls back from the home, then
 * a bronze dot walks to each place (order = content.ts location.places) with a minutes counter.
 */
export const location = {
  /** Extra scroll distance in viewport heights beyond the pinned stage. Lower = shorter/faster. */
  scroll: { wide: 2.2, narrow: 2 },
  /** Starting zoom on the home (1 = the whole map). */
  zoom: 2.6,
  /** Timeline shares (0–1): horizon line → coastline morph, pull-back, and one [start, arrival] per walk. */
  phases: {
    line: [0, 0.16] as [number, number],
    zoom: [0.16, 0.38] as [number, number],
    walks: [
      [0.42, 0.6],
      [0.63, 0.77],
      [0.8, 0.96],
    ] as [number, number][],
  },
  /** Sideways drift of the wave lines over the whole sequence, in drawing units. */
  waveDrift: 6,
};
