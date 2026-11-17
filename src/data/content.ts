/** Page copy (Hebrew). Wording follows the brief verbatim where it is specified. */
import type { StillId } from './media';

/** Links with this href open the floor-plan dialog (SpacesStack intercepts them; there is no #plan section). */
export const PLAN_HREF = '#plan';

export const studio = {
  name: 'Benzaken Studio',
  /** Real, verified studio contact link. Leave null until supplied — never invent one. */
  contactHref: null as string | null,
};

export const nav = [
  { href: '#reveal', label: 'הבית' },
  { href: '#spaces', label: 'החללים' },
  { href: PLAN_HREF, label: 'תכנית הבית' },
  { href: '#location', label: 'מיקום' },
  { href: '#contact', label: 'יצירת קשר' },
] as const;

export const navCta = { href: '#visit', label: 'לתיאום ביקור' };

export const hero = {
  conceptLabel: 'פרויקט קונספט',
  title: 'העיר נשארת למטה.',
  subtitle: 'פנטהאוז מול האופק. חלל פתוח, אור רך וקו אחד שמחבר בין הבית לעיר.',
  discover: { href: '#spaces', label: 'לגלות את הבית' },
  tourPending: 'סיור הווידאו בבית נמצא בהכנה',
  scrollHint: 'גללו כדי להיכנס',
  skip: { href: '#spaces', label: 'לדלג לפרטי הבית' },
  tourUnavailable: 'הסיור אינו זמין כרגע',
  play: 'צפייה בסיור הבית',
  playMeta: 'וידאו, 25 שניות, ללא קול',
  closePlayer: 'סגירת הסיור',
};

export type ZoneId = 'entry' | 'kitchen' | 'living' | 'suite' | 'terrace';

/**
 * Three spaces, one composition (SpacesStack). Stage copy, photos, crops and colours live here.
 * `bg` is a literal colour or a CSS custom property (`--ink` = the shared dark plaster surface), resolved at runtime.
 * `theme` picks the text palette: 'dark' text on light backgrounds, 'light' text on the dark surface.
 * `crop` is the CSS object-position per layout (narrow = phone/tablet, where the frame is near-square).
 */
/** Key figures right after the opening. Concept data, illustrative only. */
export const facts = {
  heading: 'הבית במספרים',
  items: [
    { value: 320, label: 'מ״ר בנוי' },
    { value: 5, label: 'חדרים' },
    { value: 24, label: 'קומה' },
    { value: 110, label: 'מ״ר מרפסת' },
  ],
  line: 'הקומה העליונה. דירה אחת בלבד.',
  note: 'נתוני קונספט להמחשה',
};

/** Fixed action bar on phones (< 62.5rem). */
export const mobileBar = {
  label: 'פעולות מהירות',
  visit: { href: '#visit', label: 'לתיאום ביקור' },
  plan: { href: PLAN_HREF, label: 'תכנית הבית' },
};

export const spacesStack = {
  /** Visually hidden section heading (the stage titles are the visible headings). */
  heading: 'שלושה חללים בבית',
  planButton: 'לגלות את חלוקת הבית',
  stages: [
    {
      id: 'living',
      num: '01',
      label: 'סלון',
      title: 'מקום להישאר.',
      still: 'gallery-living',
      zone: 'living',
      bg: '#f6f1e8',
      theme: 'dark',
      crop: { wide: '50% 55%', narrow: '38% 62%' },
    },
    {
      id: 'kitchen',
      num: '02',
      label: 'מטבח',
      title: 'במרכז הבית.',
      still: 'gallery-kitchen',
      zone: 'kitchen',
      bg: '#dcd2c4',
      theme: 'dark',
      crop: { wide: '50% 60%', narrow: '46% 70%' },
    },
    {
      id: 'suite',
      num: '03',
      label: 'סוויטת השינה',
      title: 'השקט שלכם.',
      still: 'gallery-bedroom',
      zone: 'suite',
      bg: '--ink',
      theme: 'light',
      crop: { wide: '50% 55%', narrow: '44% 62%' },
    },
  ] satisfies {
    id: string;
    num: string;
    label: string;
    title: string;
    still: StillId;
    zone: ZoneId;
    bg: string;
    theme: 'dark' | 'light';
    crop: { wide: string; narrow: string };
  }[],
};

export const plan = {
  heading: 'חלוקת הבית',
  caption: 'תכנית קונספט להמחשה בלבד · ללא קנה מידה',
  description:
    'תרשים סכמטי: הכניסה בתחתית במרכז. מעליה, פינת האוכל משמאל והמטבח מימין. מעליהם הסלון, ולאורך הקצה העליון המרפסת. ציר ישר מוביל מהכניסה אל המרפסת. אגף פרטי עם סוויטה וחדר רחצה מסתעף שמאלה מצד הכניסה והסלון.',
  zones: [
    { id: 'entry', label: 'כניסה', still: 'tour-01-entry', text: 'מהכניסה נפתח הציר כולו: פינת האוכל משמאל, המטבח מימין והסלון והעיר לפנים.' },
    { id: 'kitchen', label: 'מטבח ופינת אוכל', still: 'gallery-kitchen', text: 'אי אבן ונגרות אגוז לצד שולחן אוכל ארוך, משני צדי הציר.' },
    { id: 'living', label: 'סלון', still: 'gallery-living', text: 'פינת ישיבה רחבה שנפתחת דרך קיר הזכוכית אל המרפסת.' },
    { id: 'suite', label: 'סוויטה', still: 'gallery-bedroom', text: 'אגף פרטי עם חדר שינה וחדר רחצה, מחוץ לציר האירוח.' },
    { id: 'terrace', label: 'מרפסת', still: 'gallery-terrace', text: 'המרפסת לאורך הקצה, מול העיר והים.' },
  ] satisfies { id: ZoneId; label: string; still: StillId; text: string }[],
};

export const materials = {
  label: 'MATERIALITY',
  listLabel: 'חומרים — גלילה אופקית',
  heading: 'היוקרה נמצאת בפרטים.',
  items: [
    { still: 'detail-walnut', name: 'אגוז כהה', text: 'עומק טבעי וקווים נקיים.' },
    { still: 'detail-stone', name: 'אבן', text: 'משטח שקט עם עורקים עדינים.' },
    { still: 'detail-textile', name: 'טקסטיל', text: 'מרקם רך שמאזן את החומריות.' },
  ] satisfies { still: StillId; name: string; text: string }[],
};

export const terrace = {
  label: 'THE HORIZON',
  heading: 'עוד רגע, מול האופק.',
  text: 'המרפסת ממשיכה את הבית החוצה: פינת ישיבה, אור ערב והמרחב שבין העיר לים.',
  caption: 'המרפסת. הדמיית קונספט.',
};

/** Location: a fictional coastal city (no real city name). Concept data. */
export const location = {
  label: 'THE LOCATION',
  heading: 'הקו הראשון לים.',
  text: 'עיר חוף בדיונית, בין הטיילת לרחובות הישנים. הבית עומד בקו הראשון: הים מלפנים, העיר מאחור, והאופק פתוח לכל אורכו.',
  /** Text equivalent of the illustration. */
  mapDescription: 'איור סכמטי, לא מפה: קו החוף עובר לאורך האיור, הבית ממוקם ממש מעליו, הים מצידו האחד והעיר מצידו האחר.',
  places: [
    { id: 'sea', name: 'הים', time: '3 דק׳ הליכה' },
    { id: 'promenade', name: 'הטיילת', time: '2 דק׳' },
    { id: 'center', name: 'מרכז העיר', time: '8 דק׳ נסיעה' },
  ],
  home: 'הבית',
  sea: 'ים',
};

export const contact = {
  heading: 'כך ייראה תיאום הביקור.',
  notice: 'זהו אתר קונספט. הנכס אינו מוצע למכירה, והטופס מדגים את חוויית הפנייה בלבד. הפרטים אינם נשלחים או נשמרים.',
  fields: { name: 'שם מלא', reach: 'טלפון או אימייל', message: 'הודעה', optional: 'לא חובה' },
  submit: 'הדגמת שליחה',
  success: 'זו הדגמה בלבד — לא נשלחה פנייה.',
  /** Visit slot picker (demo): the next 7 days, then one of these times. */
  slots: {
    dayLegend: 'יום לביקור',
    timeLegend: 'שעה',
    pickDayFirst: 'בחרו יום כדי לראות שעות פנויות.',
    times: [
      { time: '10:00' },
      { time: '13:00' },
      { time: '16:30' },
      { time: '18:30', note: 'שעת השקיעה' },
    ],
  },
  confirm: {
    title: 'הביקור שלכם',
    again: 'לבחור מועד אחר',
  },
  errors: {
    slot: 'נא לבחור יום ושעה לביקור.',
    name: 'נא למלא שם מלא.',
    reachEmpty: 'נא למלא טלפון או אימייל.',
    reachInvalid: 'נא להזין מספר טלפון (לפחות 9 ספרות) או כתובת אימייל תקינה.',
  },
};

export const b2b = {
  heading: 'רוצים להציג נכס בצורה כזאת?',
  text: 'אתרי נדל״ן קולנועיים בהתאמה אישית — Benzaken Studio.',
  cta: 'לדבר על האתר שלכם',
};

export const footer = {
  concept: 'פרויקט קונספט',
  credit: 'עיצוב ופיתוח:',
  privacy: 'הטופס באתר הוא הדגמה בלבד: הפרטים נבדקים בדפדפן שלך, אינם נשלחים לשום מקום ואינם נשמרים.',
};

export const revealCopy = {
  kicker: 'מקום משלו. מעל העיר.',
  name: 'AFTERLIGHT',
  descriptor: 'פנטהאוז מול האופק.',
};
