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
  | 'detail-textile';

export interface Still {
  id: StillId;
  role: 'tour' | 'gallery' | 'detail';
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
 * mobile = 720p, ordinary GOP, loaded only after the visitor taps play.
 */
export const tour = {
  status: 'ready' as TourStatus,
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
