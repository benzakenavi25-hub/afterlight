/** Page copy (Hebrew). Wording follows the brief verbatim where it is specified. */
import type { StillId } from './media';

export const studio = {
  name: 'Benzaken Studio',
  /** Real, verified studio contact link. Leave null until supplied — never invent one. */
  contactHref: null as string | null,
};

export const nav = [
  { href: '#home', label: 'הבית' },
  { href: '#spaces', label: 'החללים' },
  { href: '#plan', label: 'תכנית הבית' },
  { href: '#contact', label: 'יצירת קשר' },
] as const;

export const navCta = { href: '#visit', label: 'לתיאום ביקור' };

export const hero = {
  conceptLabel: 'פרויקט קונספט',
  title: 'העיר נשארת למטה.',
  subtitle: 'פנטהאוז מול האופק. חלל פתוח, אור רך וקו אחד שמחבר בין הבית לעיר.',
  discover: { href: '#home', label: 'לגלות את הבית' },
  tourPending: 'סיור הווידאו בבית נמצא בהכנה',
  scrollHint: 'גללו כדי להיכנס',
  skip: { href: '#home', label: 'לפרטי הבית' },
  play: 'צפייה בסיור הבית',
  playMeta: 'וידאו, 25 שניות, ללא קול',
  closePlayer: 'סגירת הסיור',
};

export const overview = {
  label: 'THE RESIDENCE',
  heading: 'מרחב לנשום. מקום להישאר.',
  text: 'חלל האירוח נפתח לאורך ציר אחד: מפינת האוכל והמטבח, דרך הסלון ועד המרפסת. אגוז כהה, אבן בגוונים שקטים וטקסטיל רך יוצרים בית חם מול נוף עירוני פתוח.',
  features: ['חלל אירוח פתוח', 'מטבח עם אי מרכזי', 'סוויטה פרטית', 'מרפסת מול האופק'],
};

export const spaces = {
  heading: 'בית שמתגלה, חלל אחר חלל.',
  living: {
    heading: 'מקום לשיחות שנמשכות.',
    text: 'הסלון נפתח אל המרפסת, עם פינת ישיבה רחבה וקשר רציף בין הפנים לחוץ.',
    caption: 'הסלון. הדמיית קונספט.',
  },
  kitchen: {
    heading: 'במרכז הבית.',
    text: 'אי האבן, נגרות האגוז ופינת האוכל חולקים מרחב פתוח שמיועד לאירוח וליום־יום.',
    caption: 'המטבח ואי האבן. הדמיית קונספט.',
  },
  suite: {
    heading: 'רגע של שקט.',
    text: 'חומריות חמה, אור ערב רך וחלל רחצה אינטימי ממשיכים את השפה של הבית גם באזור הפרטי.',
    caption: 'חדר השינה וחדר הרחצה. הדמיית קונספט.',
  },
};

export type ZoneId = 'entry' | 'kitchen' | 'living' | 'suite' | 'terrace';

export const plan = {
  heading: 'לראות איך הכול מתחבר.',
  subcopy: 'מבט על הקשר בין החללים ועל הציר שמוביל מהכניסה למרפסת.',
  caption: 'תכנית קונספט להמחשה בלבד · ללא קנה מידה.',
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

export const contact = {
  heading: 'כך ייראה תיאום הביקור.',
  notice: 'זהו אתר קונספט. הנכס אינו מוצע למכירה, והטופס מדגים את חוויית הפנייה בלבד. הפרטים אינם נשלחים או נשמרים.',
  fields: { name: 'שם מלא', reach: 'טלפון או אימייל', message: 'הודעה', optional: 'לא חובה' },
  submit: 'הדגמת שליחה',
  success: 'זו הדגמה בלבד — לא נשלחה פנייה.',
  errors: {
    name: 'נא למלא שם מלא.',
    reachEmpty: 'נא למלא טלפון או אימייל.',
    reachInvalid: 'נא להזין מספר טלפון (לפחות 9 ספרות) או כתובת אימייל תקינה.',
  },
};

export const b2b = {
  heading: 'רוצים להציג נכס בצורה כזאת?',
  text: 'אתרי נדל״ן קולנועיים בהתאמה אישית — Benzaken Studio.',
  cta: 'לדבר על האתר שלכם',
  pendingNote: 'קישור יצירת הקשר של הסטודיו יתווסף לפני העלייה לאוויר.',
};

export const footer = {
  concept: 'פרויקט קונספט',
  credit: 'עיצוב ופיתוח:',
  privacy: 'הטופס באתר הוא הדגמה בלבד: הפרטים נבדקים בדפדפן שלך, אינם נשלחים לשום מקום ואינם נשמרים.',
};

/** Lightbox order and captions for the editorial gallery (gallery stills only, not the camera route). */
export const galleryItems = [
  { still: 'gallery-living', caption: 'הסלון, פתוח אל המרפסת. הדמיית קונספט.' },
  { still: 'gallery-kitchen', caption: 'המטבח, אי האבן ונגרות האגוז. הדמיית קונספט.' },
  { still: 'gallery-bedroom', caption: 'חדר השינה. הדמיית קונספט.' },
  { still: 'gallery-bathroom', caption: 'חדר הרחצה. הדמיית קונספט.' },
] satisfies { still: StillId; caption: string }[];
