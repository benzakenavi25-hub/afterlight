# AFTERLIGHT — Claude Code master brief

מסמך עבודה ל־Benzaken Studio | 16.11.2026

## איך אברהם משתמש במסמך

צור תיקיית פרויקט חדשה ופתח אותה ב־Claude Code. הנח את הקובץ הזה בשורש הפרויקט ואת התמונות והסרטונים בתיקיית incoming-media. שלח לקלוד את הודעת הפתיחה שבסוף המסמך. לא צריך להדביק את כל המסמך לצ׳אט או לשלוח את כל השלבים בנפרד.

המסמך באנגלית כדי לתת הוראות פיתוח מדויקות; הממשק, התוכן והתקשורת עם אברהם יהיו בעברית. הכותרות באנגלית הן חלק מהעיצוב בלבד.

---

## 1. Your role and delivery contract

You are the creative frontend developer for Benzaken Studio. Build a NEW premium cinematic single-property concept website. Read this entire brief once before implementation. Treat it as the source of truth, not as a request to complete every stage immediately.

Execute ONLY the current approved stage. The initial message authorizes Stage 0 only. At the end of each stage, provide a concise Hebrew report and explicitly wait for Abraham's approval before starting the next stage. An unanswered question is not approval. Routine implementation choices within the approved stage are yours to resolve. Do not repeatedly ask about settled creative choices.

Never spend money or credits, generate paid media, install paid products, publish, buy a domain, or connect external accounts without specific authorization. Video generation is OUTSIDE this website implementation scope. Do not activate Higgsfield just because its tools exist.

Maintain docs/PROGRESS.md with current stage, approved decisions, completed work, actual checks, known limitations and the next step. After a context reset read that file and the relevant sections of this brief; do not restart the project or reread every asset. Never claim a browser check or a performance measurement that you did not perform.

Inspect available project instructions and relevant installed skills. Use frontend-design, impeccable and ui-ux-pro-max for their relevant capabilities when available; animate and animation-performance for motion; mobile-native for mobile review; break-ui for final stress testing. Use improve-animations only for an identified issue. Do not invoke every skill for every change, invent unavailable skills, install skills or change global configuration. User instructions override skill guidance.

## 2. Product, audience and scope

One polished Hebrew RTL page for a fictional coastal urban penthouse, not a real listing. It must demonstrate to luxury brokers and developers the kind of property website Benzaken Studio can deliver. The visitor should understand the home, explore its atmosphere and find a clear action without being forced to finish an animation.

Primary brand: AFTERLIGHT. Hebrew descriptor: פנטהאוז מול האופק. Use an original typographic wordmark, restrained uppercase tracking, and one fine horizontal horizon line. Produce it in accessible HTML/CSS or a simple original SVG. No image-generated logo, house icon, crown, gold seal or unrelated stock monogram. Benzaken Studio is the creator, credited in the footer and in one separate B2B CTA.

This is a new project. If an existing scaffold is present, inspect and reuse it. Never overwrite unrelated files. If truly empty, use React + TypeScript + Vite with a minimal dependency set. CSS variables and plain CSS/CSS modules are sufficient; retain an existing styling system if one is present. No backend, CMS, user accounts, store, multi-language switch, payment system or fabricated marketing integrations.

Primary page sections: navigation; hero and continuous tour; home overview; editorial spaces; conceptual plan; materials; terrace; demo contact; studio footer. One main page, plus functional modal states if needed. Do not add generic services, testimonials, news, awards or a portfolio grid.

## 3. Art direction

Quiet architectural editorial design with a cinematic opening. The photography carries the atmosphere; typography, alignment and whitespace create the luxury. Avoid a generic black-and-gold agency template, glass cards, excessive borders, gradients, floating decorative objects, massive rounded corners and constant full-screen sections.

Palette:
- Ink / night: #111820.
- Warm paper: #F0ECE5.
- Dark text: #20262C.
- Secondary light text: #C6C1B9, subject to contrast checks.
- Muted bronze: #A58C72 for thin rules and limited decoration. Do not assume it is suitable for small text.

Use warm paper for readable information and night surfaces for opening, materials and closing. Let adjacent sections have deliberate transitions. Do not place each section inside the same repeated card layout.

Typography: Noto Serif Hebrew for Hebrew display headings, Heebo for Hebrew UI/body, and Cormorant Garamond for selective large English display words and the wordmark. Use licensed official font files, prefer self-hosted WOFF2, limit actual weights and use font-display: swap. Confirm Hebrew glyph support. Use fallback fonts if files are unavailable rather than blocking implementation.

Hebrew is the meaningful content. English appears selectively as AFTERLIGHT, THE RESIDENCE, PRIVATE SPACES, MATERIALITY or THE HORIZON. Use at most three prominent English chapter treatments across the entire page plus the brand. English must not replace Hebrew instructions, field labels or navigation. Give English elements dir=ltr; use bidi isolation for numbers. Avoid awkwardly spaced Hebrew letters. Decorative duplicated English can be aria-hidden.

Starting type scale: desktop H1 76–104px, Hebrew section headings 44–60px, body 18px; mobile H1 40–48px, headings 30–36px, body 17–18px. Use clamp() and tune against actual line breaks. Large English display may reach 100–150px on desktop but must not create overflow or obscure photography. Use a restrained 3-column composition for the hero: Hebrew text at right, clear central camera axis, secondary tour control at left or bottom.

Layout: max content width about 1320px, desktop side padding 48–80px, mobile 20–24px. Desktop section spacing 104–144px, mobile 64–88px. Near-square corners, thin rules, button height at least 48px. Large photographic fields, asymmetrical editorial compositions and purposeful empty space. No decorative UI that resembles an unimplemented control.

## 4. Media inventory and truth

All existing images are concept imagery of ONE home at blue hour. Preserve their walnut cabinetry, grey-brown stone, taupe textiles, cognac chair and coastal skyline. Do not substitute random villas, daylight interiors or unrelated stock photos. Do not claim a real address, view, architect, stone species, furniture brand or developer.

The approved rail is STRAIGHT: entrance → dining LEFT and kitchen RIGHT → living → open terrace threshold → terrace. There is no camera turn into the bedroom, no teleportation, and no return toward the entrance. Bedroom and bathroom are gallery stills only.

Assign readable filenames AFTER visually checking the supplied files. Preserve incoming originals; put optimized derivatives in public/media. Build a typed media manifest with roles and availability. Never guess which image is which from UUID filenames alone.

| Suggested filename | Intended image |
|---|---|
| tour-01-entry.webp | Wide entrance, dining left, kitchen right, living ahead |
| tour-02-kitchen-dining.webp | Forward step, same straight axis, table and island closer at sides |
| tour-03-living-entry.webp | Living fully visible, small table/island corners may remain |
| tour-04-living.webp | Further into living, coffee tables left and cognac chair right enlarged |
| tour-05-threshold.webp | Near open glazing, interior furniture almost outside frame |
| tour-06-terrace.webp | Outside, no overhead interior header, terrace furniture left |
| gallery-living.webp | Alternate living-room angle |
| gallery-kitchen.webp | Camera angled toward island and walnut cabinets; NOT a rail frame |
| gallery-bedroom.webp | Bed, walnut wall and blue-hour glazing |
| gallery-bathroom.webp | Portrait bathroom with stone, walnut and privacy glazing |
| gallery-terrace.webp | Alternate terrace seating angle |
| detail-walnut.webp | Walnut join and illuminated niche |
| detail-stone.webp | Mitered island stone corner |
| detail-textile.webp | Sofa upholstery and wool throw |

At handoff, all 14 stills exist. The FIRST video transition (01→02) has been generated in Kling 3.0 Pro, 5 seconds, silent, and Abraham approved its appearance. The other FOUR transitions were NOT generated: production was paused to prepare this brief. Do not assume five video files are available. Check local incoming-media and report missing assets once as a checklist. Do not request credentials. A remote result link is not a guaranteed durable production asset; obtain a local copy when supplied/accessible.

Expected video filenames: tour-01-02.mp4, tour-02-03.mp4, tour-03-04.mp4, tour-04-05.mp4, tour-05-06.mp4. The eventual website video is one locally assembled master, tour-master-desktop.mp4. Editing/encoding existing files is allowed within the approved video stage; generating new AI clips or spending credits requires separate permission.

Do not synchronize five separate video elements to simulate a single film. Once all clips exist, inspect codec, dimensions, frame rate, first/last frames and color. Assemble one consistent master; remove only demonstrably duplicated endpoint frames, preserve movement speed and avoid crossfades that ghost furniture. Record edits. No automatic loop from terrace back to entry. Keep originals. If clips have inconsistent geometry or light, report the specific issue and propose a local remedy before re-generation.

While video assets are incomplete, the hero MUST work with a static poster and clear readiness state. Build and review the rest of the site normally. Do not simulate a finished tour with dissolves or misleading play buttons. Missing media may use named development placeholders that are clearly reported; no broken URLs, empty layouts or invented replacement photography.

## 5. Detailed page specification and Hebrew copy

### A. Navigation

Wordmark AFTERLIGHT, descriptor optional. Links: הבית, החללים, תכנית הבית, יצירת קשר. Primary button: לתיאום ביקור. This anchors to the explicitly labeled demo form. Add a keyboard skip link to main content. Header overlays hero with sufficient contrast, then gains a solid night background. Mobile: compact wordmark, clear menu button and accessible menu with focus management. Closing restores focus. Anchor targets account for header height. No full-screen loader.

### B. Opening / tour

Visible concept label: פרויקט קונספט · Benzaken Studio.
H1: העיר נשארת למטה.
Subtitle: פנטהאוז מול האופק. חלל פתוח, אור רך וקו אחד שמחבר בין הבית לעיר.
Secondary anchor: לגלות את הבית.
Desktop hint, only when an actual scroll tour is ready: גללו כדי להיכנס.
When only a poster exists: use a neutral discovery hint, not a false tour promise.

Poster loads immediately and the headline remains legible over a deliberate local shading layer. Do not cover the central walking axis or kitchen with giant typography. Fade the hero copy out early as the camera starts moving.

Desktop target behavior: a sticky viewport inside about 4–5 viewport heights of ordinary document scroll. Scroll progress maps to master-video time; reverse scroll reverses time. Small chapter label: כניסה / מטבח ופינת אוכל / סלון / מרפסת. Visible skip action: לפרטי הבית. End at terrace; release into normal content. No wheel interception, custom scroll engine, forced snapping or minimum viewing time. A keyboard user can bypass it. No second intro before this intro.

Start with a small prototype using one video element and native scroll progress, coalesced with requestAnimationFrame. Use one animation lifecycle and clean up listeners. GSAP + ScrollTrigger is acceptable only if it materially simplifies robust pinning/seeking; do not add several animation frameworks. Prevent seek backlogs, guard duration/readyState, wait for metadata, handle seeked and loading states, and pause decoding when not needed. Never bind an expensive render or React state update to every raw scroll event.

If scrub is unreliable on target hardware, present evidence and use reliable playback as the fallback. Do not force a brittle effect to satisfy a screenshot. Do not preload hundreds of full-resolution frame images. A frame sequence is an optional separately justified optimization with an explicit memory/network budget, not the default.

Mobile default: beautiful poster, visible play button only when the master is ready, native controllable inline 16:9 video after user action, ordinary page scroll. Use playsInline, preload=none/metadata as appropriate; no forced autoplay or sound. Do not crop the landscape film to 9:16 and lose the kitchen/dining. On a narrow portrait screen, deliberately compose the poster crop and show the playable film at its natural ratio. No forced device rotation. Reduced-motion mode uses static imagery and optional manual playback, without pinned scrub or parallax.

### C. Home overview — warm paper

Small label: THE RESIDENCE.
Heading: מרחב לנשום. מקום להישאר.
Paragraph: חלל האירוח נפתח לאורך ציר אחד: מפינת האוכל והמטבח, דרך הסלון ועד המרפסת. אגוז כהה, אבן בגוונים שקטים וטקסטיל רך יוצרים בית חם מול נוף עירוני פתוח.

Use four truthful conceptual features instead of fabricated numerical metrics: חלל אירוח פתוח / מטבח עם אי מרכזי / סוויטה פרטית / מרפסת מול האופק. Present as an open row with fine separators, not statistic cards. No invented square metres, price, number of bedrooms, parking count, sales volume or scarcity. Do not infer total bedroom count from one bedroom image.

### D. Spaces — editorial gallery

Heading: בית שמתגלה, חלל אחר חלל.
Build three distinct compositions, with consistent alignment:
1. Living: large alternate-angle photograph, heading מקום לשיחות שנמשכות., text הסלון נפתח אל המרפסת, עם פינת ישיבה רחבה וקשר רציף בין הפנים לחוץ.
2. Kitchen/dining: image on the opposite side on desktop, heading במרכז הבית., text אי האבן, נגרות האגוז ופינת האוכל חולקים מרחב פתוח שמיועד לאירוח וליום־יום.
3. Private suite: calm bedroom image and smaller portrait bathroom, heading רגע של שקט., text חומריות חמה, אור ערב רך וחלל רחצה אינטימי ממשיכים את השפה של הבית גם באזור הפרטי.

Do not call these spaces part of the camera route. Mobile uses logical stacked reading order, not CSS visual reordering that disagrees with the DOM. Images open an accessible lightbox with Hebrew caption, previous/next, close, Escape, focus trap and focus restoration. No autoplay carousel. Lock page scroll only while a modal is actually open and restore it reliably.

### E. Conceptual floor plan

Heading: לראות איך הכול מתחבר.
Subcopy: מבט על הקשר בין החללים ועל הציר שמוביל מהכניסה למרפסת.
Permanent caption: תכנית קונספט להמחשה בלבד · ללא קנה מידה.

Use a simple original SVG spatial diagram. The documented relationship is entry at bottom centre; dining left and kitchen right; living above; terrace across the far end. A private bedroom/bathroom wing can branch LEFT from the entry/living side, but that relationship is conceptual and must not be presented as a measured survey. Do not reuse an old turning-camera plan. Do not invent dimensions, precise facade openings or extra bedrooms.

Selectable zones: כניסה, מטבח ופינת אוכל, סלון, סוויטה, מרפסת. Select zone or its parallel button to highlight it and update one photo/caption. Desktop plan about 2/3 width and detail panel 1/3; mobile SVG with legible zones and ordinary buttons below. Keep a text description available to assistive technology. Do not make hover the only interaction. Use a single selected state with clear focus and aria-pressed where appropriate. If diagram precision is not credible, prefer a visibly schematic relationship diagram over false architectural detail.

### F. Materials — night surface

Large selective English word: MATERIALITY.
Hebrew heading: היוקרה נמצאת בפרטים.
Three portrait detail photographs, varied vertical placement only on spacious desktop; aligned single-column on mobile.
Labels/copy: אגוז כהה — עומק טבעי וקווים נקיים.; אבן — משטח שקט עם עורקים עדינים.; טקסטיל — מרקם רך שמאזן את החומריות.
Do not name stone species, manufacturers or construction specifications. No animated material configurator.

### G. Terrace

Wide alternate-angle terrace image, not a repeat of the hero's final frame.
Heading: עוד רגע, מול האופק.
Copy: המרפסת ממשיכה את הבית החוצה: פינת ישיבה, אור ערב והמרחב שבין העיר לים.
Small optional label: THE HORIZON. No map or location claim; the skyline is fictional concept imagery. Overlay text only if it stays readable and leaves furniture/view visible; otherwise place it alongside.

### H. Contact demo and real studio conversion

Night background, restrained two-column composition.
Heading: כך ייראה תיאום הביקור.
Visible explanation BEFORE fields: זהו אתר קונספט. הנכס אינו מוצע למכירה, והטופס מדגים את חוויית הפנייה בלבד. הפרטים אינם נשלחים או נשמרים.
Fields: שם מלא; טלפון או אימייל; הודעה (optional). Explicit labels, autocomplete tokens where suitable, readable errors and keyboard-friendly controls. Button: הדגמת שליחה.
Handle locally only: no backend, analytics payload, localStorage, mail service or console logging of personal input. On valid submission: זו הדגמה בלבד — לא נשלחה פנייה. Expose status accessibly. Do not say a representative will call.

Separate B2B block: רוצים להציג נכס בצורה כזאת? / אתרי נדל״ן קולנועיים בהתאמה אישית — Benzaken Studio. CTA: לדבר על האתר שלכם. Use a real verified studio contact only when supplied. Keep a single contact configuration value. Do not invent phone, email, WhatsApp number or Instagram handle. If unavailable, show a discreet development note and report this as a launch blocker; do not ship an enabled dead link or route inquiries into the fake property form.

Footer: AFTERLIGHT / פרויקט קונספט / עיצוב ופיתוח: Benzaken Studio. Use working internal anchors. No fake legal compliance badge, fake accessibility certification, invented privacy policy or tracking disclosure. Explain the actual local-only form behavior in a short accurate privacy note. Keep footer minimal.

## 6. Motion, responsiveness and accessibility

Motion hierarchy: tour is the main event; section reveals are secondary; controls are immediate. Default reveals 400–650ms, opacity plus at most 12–20px translation, once; hover 150–220ms. No scroll-linked text spinning, cursor replacement, magnetic buttons, autoplay galleries, giant marquee, bouncing arrows or heavy image parallax. Contents should be visible before enhancement and if JS/motion fails. Reduced-motion removes nonessential movement.

Use html lang=he dir=rtl; CSS logical properties; semantic landmarks; one H1; ordered headings; meaningful Hebrew alt text; empty alt for truly decorative duplicates. Ensure contrast, visible focus, keyboard operability, touch targets at least 44px, no reliance on color alone and no inaccessible modal background. Do not claim full legal compliance based on a checklist.

Review at 360, 390, 768, 1024 and 1440px widths, 200% zoom and a landscape phone viewport. Avoid 100vw overflow and mobile 100vh traps; consider svh/dvh appropriately. Long Hebrew labels and English display words must wrap safely. No content hidden beneath fixed bars. Preserve focus on menu close, gallery close and form feedback.

## 7. Performance and implementation quality

Prioritize the hero poster as the likely LCP element; include explicit image dimensions/aspect ratios and responsive srcset. Lazy-load below-fold images; serve AVIF/WebP with practical fallback where necessary. Target a hero poster roughly 150–300KB if acceptable visually and responsive image derivatives rather than sending every original. These are budgets to verify, not guaranteed asset sizes.

Do not load the full film on the first mobile page request. For desktop, defer loading until the tour is approaching/needed; start with poster and text. Encode a practical 1080p master for scrubbing if the source supports it, with web fast-start and appropriate keyframe intervals tested on actual playback. Aim for a practical file budget, initially about 8–15MB for a 25-second desktop master; adjust from measured seeking and quality. A 4K original is not the default site payload. Keep videos outside JS bundles.

Target Web Vitals LCP ≤2.5s, INP ≤200ms, CLS ≤0.1 where measurable. Report lab results as lab results; do not invent field data or promise a 100 score. Record tool version, viewport, environment and obvious limitations. Runtime must handle missing film, slow network, failed decode and font fallback. No endless loading indicators.

Separate data/copy, media manifest and interactive components sensibly. Suggested boundaries: Header, TourHero, HomeOverview, SpacesGallery, ConceptPlan, MaterialDetails, Terrace, DemoContact, Footer. Do not turn every paragraph into a component or install a UI kit for simple buttons. Use a package lock, one package manager, readable types, no TypeScript suppression to hide actual problems and no speculative abstractions.

Use meaningful verification: build/type checks, keyboard/manual walkthrough, real browser responsive review and targeted interaction checks for gallery, menu, form and tour skip. Add automated tests only when they validate a meaningful risk, not to mirror trivial implementation. No broad refactors after acceptance unless a defect requires them.

## 8. Stage-by-stage execution and approval gates

### Stage 0 — inspection and media map ONLY
Read project instructions, inspect scaffold and incoming media, identify relevant skills. Create docs/PROGRESS.md, docs/MEDIA-MAP.md and a short implementation plan. Record missing files and the real contact link as pending. Do not install dependencies, create full UI or start the paid video pipeline. Present the chosen identity, section order, media map and proposed stack in Hebrew. Stop and ask: מאשר להתחיל את שלב 1 — בסיס האתר והכיוון העיצובי?
Success: no ambiguity about rail order, missing media, brand, technical scope or next task. Do not ask Abraham to repeat decisions contained here.

### Stage 1 — foundation and visual sample
Initialize/reuse the minimal scaffold; implement tokens, fonts, wordmark, page shell, responsive header, static hero poster and ONE representative editorial living section. Include concept labeling. No tour scrub yet. Run build and inspect desktop/mobile in the browser if available. Present screenshots/previews when possible. Stop: מאשר את הכיוון ולהמשיך לשלב 2 — העמוד המלא?
Success: visual direction reads as bespoke luxury, Hebrew typography is polished, English is selective, 390/1440px have no overflow, no broken imports. Existing files preserved.

### Stage 2 — complete static content and layout
Build all sections, copy, responsive imagery and footer following this specification. Add clearly labeled conceptual SVG plan layout. The entire site must communicate the property without video or decorative motion. No fabricated data. Stop: מאשר להמשיך לשלב 3 — גלריה, תכנית וטופס?
Success: full page rhythm, correct asset selection, no redundant generic cards, clear demo vs real studio CTA, readable mobile order.

### Stage 3 — functional interactions
Implement accessible menu, lightbox, selectable floor-plan zones, form validation/local demo confirmation, working anchors and verified studio link when supplied. Record unresolved launch blockers. Run functional and keyboard checks. Stop: מאשר להמשיך לשלב 4 — הסיור הקולנועי?
Success: interactions work with touch and keyboard, focus restores, nothing sends or stores personal data, no fake success or dead enabled actions.

### Stage 4 — tour prototype and final media integration
First audit available clips. If only the first clip exists, test the video mechanism on that clip and keep incomplete tour clearly documented; do not represent it as finished. If all five exist, assemble and inspect the master, then implement desktop scrub, chapter labels, skip, reverse progress and poster fallback. Mobile manual player and reduced-motion alternative are required. Verify seeking on actual browser hardware before choosing the implementation. If testing cannot be performed, state it and retain a reliable fallback. Do not block the entire site on missing clips. Stop: מאשר להמשיך לשלב 5 — ליטוש ובדיקות?
Success: no cuts introduced by player changes, no forced scroll controls, clear entrance-to-terrace direction, no oversized mobile payload, safe video failure state. A prototype is explicitly distinguished from a completed tour.

### Stage 5 — restrained motion and final QA
Add secondary reveals and fine hover states only after primary functionality is stable. Review spacing, typography, image crops, RTL, contrast, keyboard, reduced motion, slow network and target viewports. Run build/type checks and an honest performance audit if tooling permits. Fix concrete defects within scope. Deliver docs/HANDOFF.md with setup/build commands, media replacement instructions, contact config, measured checks, unresolved issues and deployment prerequisites. Do not publish. Stop and summarize ready vs pending.
Success: no critical console errors, no broken image/video URLs, no horizontal scroll, no hidden mobile action, no inaccessible modal trap, no misleading listing claims, clean build. Do not call the project ready for publication if real contact, final video or relevant checks remain unresolved.

## 9. Review references — inspiration, never copy

The art direction draws from the following already researched examples: Quadplex 80 / Above the Clouds by Outpost; 111 West 57th Street; 53 West 53; One High Line by King & Partners; ERA, Sobha Privy Collection and Silver Pinewood by Vide Infra. Adopt their discipline in large imagery, editorial pace, useful plans and accessible information. Do not copy code, branding, assets, layouts pixel-for-pixel or unverified conversion claims. Browsing these again is optional and must not delay implementation or expand scope.

- https://outpost.design/work/above-the-clouds/
- https://quadplex80.com/
- https://111w57.com/
- https://53w53.com/
- https://www.onehighlineresidences.com/
- https://www.kingandpartners.com/work/one-high-line/
- https://videinfra.com/work/era
- https://videinfra.com/work/sobha-privy-collection
- https://videinfra.com/work/silver-pinewood-residences

## 10. Short stage report format

Use Hebrew and no lengthy narration:
1. מה הושלם: up to four concrete points.
2. מה נבדק בפועל: checks and outcomes; disclose unavailable tools.
3. מה חסר או דורש החלטה: only actual blockers.
4. השלב הבא + one explicit approval question.

Do not launch the next stage in the same response that asks approval. Save a checkpoint to docs/PROGRESS.md before pausing. If Git is initialized, a small stage commit is appropriate; never push or publish without authorization. No repeated full-repository scans or constant restatement of this brief.

---

## הודעת פתיחה להעתקה ל־Claude Code

קרא את AFTERLIGHT-Claude-Code-Master-Brief.md שבשורש הפרויקט. זהו האפיון המחייב לאתר דמו חדש של Benzaken Studio. התמונות והסרטונים שאספק נמצאים ב־incoming-media.

בצע כעת את שלב 0 בלבד: בדיקת הפרויקט, מיפוי המדיה ותכנית ביצוע קצרה. שמור התקדמות בקבצים שמוגדרים במסמך. אל תתחיל פיתוח לפני אישורי לשלב 1. בהמשך בצע בכל פעם רק את השלב שאאשר, בדוק אותו ועצור לפני השלב הבא. תקשר איתי בעברית; אל תבקש ממני מחדש החלטות שכבר מופיעות באפיון. אם חסרים סרטונים, אפשר להתקדם באתר עם התמונות — בלי לייצר מדיה בתשלום ובלי להציג סיור חלקי כגמור.
