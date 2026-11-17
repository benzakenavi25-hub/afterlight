# AFTERLIGHT — Progress

## Current stage
Round 3 stages 1–3 done (tour card, materials layers, exterior-reveal exit) — on the branch, waiting for approval. Round 2 (6 stages) merged and deployed.

Stage 5 complete. All stages done. **Deployed (2026-11-16) to https://benzakenavi25-hub.github.io/afterlight/ (repo benzakenavi25-hub/afterlight, GitHub Pages via Actions). Still not ready for final launch** (blockers below). Details: docs/HANDOFF.md.

## Round 7 (2026-11-17) — elevator doors inside the tour card. Only check: `npm run build` (passes). Not checked in a browser/phone.
- ElevatorDoors is now rendered inside TourHero's `.hero__card` (absolute, inset 0, clipped by the card, under the corner caps via `.hero__corner` z-index 2) instead of a fixed full-screen overlay; same metal panels/seam, 900ms transform, waits for the poster (≤1.5s), removed at the end. Plaster, header and the chapter word are visible from the start. While `html[data-doors]` is pending/open: card + shadow `scale` 0.98 → 1 (900ms, same easing); headline + subtitle hidden, then rise 14px + fade 700ms after a 900ms delay; the attribute is removed 1.8s after the doors are done. Scrolling (or a restored scroll position) before it opened opens it at once. Script now also skips the doors when the URL has a #hash (it was documented but not in the script). Every load, not with reduced motion; pointer-events none.

## Round 6 (2026-11-17) — dead zones, share image + favicon, studio closing section. Off-limits: ElevatorDoors, TourHero, ExteriorReveal, the materials effect. Only check: `npm run build` (passes). Not checked in a browser/phone.
- Dead zones: Facts bottom padding cut to clamp(1.5rem, 4svh, 3rem); SpacesStack intro now `top 95%` → `top 25%` (was → top top: ~90vh of bare ivory before the first space; media.ts `stack.intro`). Terrace→location: line band 40% shorter (`--run-h` clamp(3rem, 8.4svh, 5.4rem)), line scrub `terrace.run.end` `top 64%` (was 40%, ~40% less scroll), location section pulled up under the band by `--run-h` (animated mode) so THE LOCATION + heading are on screen while the line draws. Materials desktop: frame 68svh tall (photo covers it, `--fx/--fy` crop), columns 1fr/2fr, symmetric block padding so it is centred in the stage; phones unchanged.
- Share image: `public/og-image.jpg` 1200×630 (131 KB) from exterior-facade-1672, cropped from the top (penthouse in frame), built by a new last step in build-media.sh. index.html: og:title/description/image(+width/height)/type/locale/url + twitter:card summary_large_image (full https://benzakenavi25-hub.github.io/afterlight/ URLs). Favicon: `favicon.svg` (Cormorant A, light on ink, bronze line; the font is embedded as a data URI so it renders as a favicon) + `apple-touch-icon.png` 180×180 (ffmpeg drawtext, same design).
- Studio closing: new StudioCTA.tsx/.css (#studio) after the form, before the footer: min 90svh, --ink-2 + plaster texture, centred; label BENZAKEN STUDIO, H1-size heading + bronze second line, three rows with bronze rule, larger centred WhatsApp (primary) + studio site buttons; heading word reveal, sub line + rows reveal one after another; phone bar hidden while it is on screen. Old aside removed from DemoContact; copy in content.ts `b2b`.

## Round 5 (2026-11-17) — 4 changes in one pass. Off-limits: ElevatorDoors, TourHero, the letter reveal itself. Only check: `npm run build` (passes). Not checked in a browser/phone.
- Media: new sources delivered in `תמונות חדשות/` (not committed; build-media.sh also looks for `new-media/`, `--new-only` builds just these) → material-walnut/stone/textile 480/800/1254, facade-vertical 640/941 (AVIF+WebP).
- Exterior exit: the whole layer scales uniformly into a card (transform + clip-path radius 6px compensated for the scale, no cropping), centred in the band above the risen facts strip (`reveal.exit` maxScale/top/gap); portrait < 62.5rem uses facade-vertical in reveal + exit via `<picture>` art direction (`reveal.verticalMedia`, crop `objectPosition.vertical` 48% 48%).
- Materials: zoom ≤ 2x, room never replaced (detail crossfade removed in zoom mode; flow cards unchanged); at the peak a square sample card (42% / 28% of the frame, thin bronze frame, soft shadow, scale 0.92→1 + fade, reverse before the next spot) placed on the free side of the spot, bronze leader line, "01 · אגוז כהה" caption; dots 32px with a 2px bronze ring (active one counter-scaled), dim 0.55; phone frame 55svh. Tunables `materials.card`, `phases.cardIn/cardOut`.
- Spaces: LIVING / KITCHEN / SUITE behind each photo (Cormorant, fit to the frame width, opacity 0.2 dark / 0.12 light, upper part above the frame, aria-hidden), passe-partout (10px gap + 1px bronze outline), large serif number + small name, museum label (content.ts `plaque`), parallax ±6% (`stack.parallax`, photo over-scaled 1.14); flow mode gets the same static piece. ↗ replaced by a thin bronze SVG arrow (no other emoji-prone characters found in src/index.html).
- Terrace → location "one line": text moved onto the sky (top gradient, light text, fades in at 60–90% of the pan; static in reduced motion), block below removed; bronze line draws along the horizon (`terrace.horizon` 0.435), runs on across an ivory band, and the location map now starts with that line straight across the top, which morphs (same 7 points, camera coords) into the coastline before the existing pull-back / walker / minutes (`location.phases.line`). Reduced motion: final map, no line. Not literally one continuous DOM path across the two sections (two sections, two pins): line on the band → line at the map top → morph.

## Round 4 (2026-11-17) — 5 changes in one pass. Off-limits: ElevatorDoors, TourHero, ExteriorReveal. Only check: `npm run build` (passes). Not checked in a browser/phone.
- Materials: "from the room to the detail" — sticky stage on gallery-living, 3 bronze spots (`materials.spots` %), per material spotlight → leader line + label → camera zoom → crossfade to the detail photo → pull-back; minimap with camera frame, 3-part progress; flow cards for reduced motion / GSAP failure / short screens.
- Facts: count-up starts only when the list is ≥60% in the viewport AND not covered (elementFromPoint check each frame while intersecting), works when the strip rises over the reveal card on phones.
- Terrace: panorama pan (scrubbed, no pin) left → right ending on the sea; tunables `terrace.pan` (ratio, direction, distance, height 65/72svh, desktop bottom crop). Source: terrace-panorama-4344x1448.jpg was NOT found — built from Pictures/"Blue hour Mediterranean terrace panorama.png" (2172×724) → widths 1600/2172; build-media.sh prefers the JPEG when it is added (then update widths in media.ts).
- Location: pinned, scrubbed — pull-back from the home + coastline draw, bronze walker with minutes counter to sea / promenade / centre (labels light on arrival), thin drifting waves; "ים" fixed (no letter-spacing, rtl/plaintext). Tunables `location` (media.ts).
- Studio block: WhatsApp (primary, icon, prefilled message) + studio site (secondary), new tab, ≥44px, stacked full width on phones; footer "Benzaken Studio" links to the studio site. There was no pendingNote in the code to remove.

## Round 3 (2026-11-17) — tour card + materials layers. Off-limits: ElevatorDoors, ExteriorReveal, the tour scrub logic (progress → currentTime, film loading, fallbacks).

### Stage 1 — tour in a card — completed
- TourHero framing only. The film (poster + video) sits in a card on the plaster: `.hero__card` (full stage, transform scale(sx, sy) to the card size) → `.hero__view` (the film's 16:9 cover box, counter-scaled so the film's own scale is uniform). Start: desktop/landscape 86% × 76% of the stage, centred (76%, not 80%: at 80% the foot rule crossed the card); portrait < 62.5rem: full width minus gutter, 3:2, 44px under the header. Grows with the tour's own `--p` to the full stage at the terrace: slow drift (15%) until p 0.65, then smoothstep. All derived in CSS from `--p`; a ResizeObserver hands the start geometry to CSS as px vars. Tunables: `tourCard` (media.ts).
- Rounded corners: 4 tiny plaster caps (counter-scaled, fade out), NOT an overflow+radius clip — measured at 1440: rounded clip 30–36 slow frames per 2 sweeps vs 2–5 without (it masks the playing film every frame). First attempt with clip-path inset: 15–29 slow frames; transform version + caps: 1–4 (current main measured in the same run: 0–2).
- Shadow: separate box with the card's transform, opacity fades with growth. Corner shade under the headline (wide) = opacity-only layer.
- Chapter word (ENTRY / KITCHEN / LIVING / TERRACE, `hero.chapterWords` in content.ts) behind the card: Cormorant, clamp(5rem, 13vw, 20rem) (18vw would not fit KITCHEN at 1440), opacity 0.14 × remaining card margin (swallowed as the card grows). Desktop: upper half above the card's top edge (overlaps the header zone); phones: above the card, sized to the screen width. Swap 500ms transform+opacity by chapter index, so it reverses with scroll direction. The only line added inside the scrub update: `stage.dataset.chapter` on chapter change (framing).
- Headline block (label moved into it) on the plaster: desktop lower right overlapping the card corner; phones below the card as before. Fades as before.
- Reduced motion / no film / Save-Data / failure mid-tour: static start card with the poster and ENTRY (`--p` and chapter cleared).
- Checks (Playwright Chromium, vite preview, emulation): 360/390/768/1024/1440/1920/844×390: 0 overflow, at the end of the tour the card transform is identity and the film box covers the stage; hero → #reveal gap 0. LCP vs current main in the same run (slow-4G-like): 390 4×CPU 1.54–1.59 s vs 1.48–1.61 s; 1440 1.37–1.44 s vs 1.35–1.38 s (now the chapter word is the LCP element at 1440, poster preload unchanged). Sweeps: 390 4×CPU 0–2 slow frames (same as main). Reduced motion: no mp4 request, ENTRY shown, start card.
- Not verified: real phones/GPU compositing, Safari/Firefox.

### Stage 2 — materials as layered samples — completed
- MaterialDetails: `stack` mode = CSS-sticky stage (section height reserved in CSS: 100lvh × (1 + travel), no pin-spacer). One scrubbed GSAP timeline (lazy, `scrub: true`, `ignoreMobileResize`, gsap.context revert): stone then textile laid over the previous sample from the bottom up (clip-path inset 100% → 0), thin shadow on the incoming top edge (transform, fades at the end), each photo zooms 1.12 → 1 over its reveal and hold, caption "01 — אגוז כהה" / "02 — אבן" / "03 — טקסטיל" swaps (transform + opacity), three-part bronze progress line fills right → left. Desktop: frame on the left (6fr of the container, ≤72svh), MATERIALITY + heading + caption + progress on the right; phones: frame 55svh on top, text below.
- The materials stay a real list: ul/li with subgrid (every item shares the frame and caption cells); the animation only styles it. Number added to the h3 (visible in both modes).
- `flow` (reduced motion, max-height 32em incl. landscape phones, content that does not fit, GSAP failure): the previous cards. useReveal skips the stacked list.
- Tunables: `materials` in media.ts (scroll 2.5 / 2, transitions [0.12–0.42], [0.58–0.88], zoom 1.12, frameNarrow 0.55, textOffset 10).
- Checks (Playwright Chromium, vite preview, emulation): 360/390/768/1024/1440/1920: stack, 0 overflow; 844×390 → flow. Reversible: state at mid-progress identical after scrolling past and back. Sweeps: 390 4×CPU and 1440: 0 slow frames (p95 18 / 17 ms). Nav "מיקום" lands 88px from the top (same as main); skip link → #main; no focusable elements inside the stage. Reduced motion / GSAP blocked: flow with 3 images with alt.

### Stage 3 — exit from the exterior reveal — completed
- Added after the reveal's end only; letters, mask, name and descriptor untouched. The section gets `reveal.exit.scroll` extra viewport heights; the reveal timeline's end is now section − stage − exit px, i.e. exactly its previous distance (390: 1012.8px = 1.2 × 844; 1440: 1350px = 1.5 × 900).
- Stage content wrapped in `.rw__card` > `.rw__cardin` (no styles until the exit; `display: contents` in static/plain). Second scrubbed ScrollTrigger (same engine, CSS sticky, no pin-spacer): card clip-path inset → x 7% (86% wide) / y 10%, radius 0 → 6px (power1.inOut), facade scale 1 → 0.96, dark layer 0 → 0.22. At t = 0 all inline styles are cleared (exact full screen).
- Facts strip rises over the card: ExteriorReveal sets `--facts-pull` on :root while scrubbing ((1 − factsFrom) × exit = 0.52 viewport heights); `.facts` is pulled up by it (relative, z-index 1). The card's bottom inset follows the strip's top edge, so the strip reads as sliding over the card with the fixed plaster behind it (no extra background, no seam). Facts start rising at 35% of the exit.
- Tunables: `reveal.exit` (scroll, factsFrom, inset, radius, scale, dim).
- Reduced motion / GSAP failure: static reveal as before, no pull (facts margin 0, gap 0).
- Checks (Playwright Chromium, vite preview): 360/390/768/1440/1920/844×390: 0 overflow, stage pinned at 0 through the exit, scrolling back to the reveal end restores the full screen (no inline clip/transform, name opacity 1). Sweeps through the exit: 390 4×CPU and 1440: 0 slow frames. Nav #reveal / #spaces / #location land 88px from the top; skip link → #main.

## Round 2 (2026-11-17) — 6 stages, approval after each. Off-limits: ElevatorDoors, TourHero, ExteriorReveal. Phone (390×844) first.

### Stage 1 — phone fixes — completed
- Small labels ≥15px: `--fs-micro` 13→15px (token only; reaches the hero hint/chapter without touching TourHero), footer, wordmark descriptor. Measured at 360/390/768/1440: hint, chapter, stage meta, footer all 15px; material captions / B2B 17–18px.
- MATERIALITY: opacity 0.16 (1.6:1) → solid mix of light 45% / ink ≈3.7:1 (large-text AA). THE HORIZON: weight 500 + `--text-muted` (6.3:1 on paper).
- SpacesStack: time-based intro → scrubbed by scroll (`top 90%` → `top top`): ivory → warm sand `#a88a6d` → plaster (no grey midpoint), text fades in over the last 30%. Cards crossfade (opacity + scale 1.04→1) instead of sliding: no ceiling/window cut. Tunables: `stack.intro`, `stack.cardScale` (media.ts). Flow mode (reduced motion) unchanged.
- Materials → terrace: new `useScrollTone` (rAF, active only near view, off under reduced motion) sets `--tone` from the text block's position (100% → 55% of the viewport); terrace surface = color-mix(paper, transparent) over the plaster; terrace text opacity follows the tone, so it is never dark on dark. No JS / reduced motion → ivory as before.
- B2B: pending note removed from the UI and from content.ts; empty `studio.contactHref` → heading + text only.
- New `.btn--primary` (bronze fill, ink text 4.8:1, 52px). "הדגמת שליחה" uses it; full width under 40rem.
- Checks (Playwright Chromium, dev server, emulation): 360/390/768/1440 × normal/reduced motion: 0 horizontal overflow over a full-page scroll, header no overflow at 360, console clean, scrub/flow modes as expected; build passes. Phone screenshots reviewed (spaces intro, crossfade, materials, terrace midway/settled, form, B2B/footer).
- Note: the terrace → contact edge (ivory → dark) is still a hard edge (not in scope).

### Stage 2 — text reveals — completed
- `useReveal` rewritten as one system (IntersectionObserver + CSS in base.css, no library). Kinds: heading (bronze `::before` rule scaleX 0→1 from the right, 600ms; then words rise from translateY(100%) inside `overflow: clip` windows, 700ms, 40ms stagger, start 200ms), latin (letter-spacing `--ls-from` (default 0.1em) → own value + fade, 900ms), text (12px + fade, 550ms, delay 350ms = 150ms after the words), block (images, 16px).
- Headings get `.ruled` (materials, terrace, contact, studio). Word split keeps the real text in a visually-hidden span; the word spans are aria-hidden. Word classes `.tw`/`.tw__i` (`.rw` is taken by ExteriorReveal).
- Once only, only below the first screen, off under reduced motion / without JS. Opening (#reveal, hero, #spaces) is never targeted.
- Fix: dev StrictMode double effect left headings hidden (second run skipped marked elements) → marked elements are re-observed.

### Stage 3 — facts strip + phone action bar — completed
- `Facts.tsx/.css` after ExteriorReveal, on the plaster: 320 מ״ר בנוי · 5 חדרים · 24 קומה · 110 מ״ר מרפסת + line + "נתוני קונספט להמחשה" (content.ts `facts`). `<dl>`; count-up 0→value 1.2s ease-out once at 40% visible, tabular-nums; final value always in a visually-hidden span; no count with reduced motion / when already on screen. Phone 2×2, desktop one row with thin dividers.
- `MobileBar.tsx/.css` (< 62.5rem only): "לתיאום ביקור" (bronze primary → #visit) + "תכנית הבית" (link to #plan → existing plan dialog). Shown after #reveal has scrolled away (scroll check — an observer misses anchor jumps), hidden while #visit or the footer intersects; `inert` when hidden; safe-area padding; 44px targets; translucent ink + 10px blur; body gets bottom padding while it exists. Copy in `mobileBar`.

### Stage 4 — materials in one screen — completed
- Phones: horizontal scroll-snap row (RTL, card 85% so the next peeks ~15%, edge-to-edge bleed, hidden scrollbar, list focusable with aria-label for keyboard scrolling); tablets 45% cards; desktop three in a row (stagger removed). Card = 4:5 image (max 52svh) + h3 name + one line.
- Checks (light, per instruction): build; 360/390/768/1440 × normal/reduced: 0 overflow, counters end at final values, bar shown at materials and hidden at the form, headings reach "in", console clean. One phone screenshot set.

### Stage 5 — location — completed
- `Location.tsx/.css` after the terrace, same ivory surface: THE LOCATION / "הקו הראשון לים." / fictional coastal city copy (content.ts `location`). Nav gets "מיקום" (#location).
- Code-drawn SVG (400×320, not a map): bronze coastline drawn with scroll (`useScrollTone` on the map, pathLength 1 + stroke-dashoffset), then home ring, then sea / promenade / city centre with dashed links, one after another (`--at` thresholds). Labels 18 units (≥15px at 360). SVG aria-hidden; same information in a visually-hidden description + list. Reduced motion / no JS: fully drawn.

### Stage 6 — visit slot picker (demo) — completed
- `SlotPicker.tsx` inside #visit before the fields: next 7 days from today (Intl he-IL; phone: horizontal row bleeding to the edges; ≥40rem: 7 columns), then 4 times (10:00, 13:00, 16:30, 18:30 "שעת השקיעה"). Real buttons, aria-pressed, fieldset/legend, arrow keys (RTL ← = next) + Home/End within each group. Selected = bronze fill.
- Validation adds "נא לבחור יום ושעה לביקור." (focus to the first day). Valid submit → confirmation card replaces the form ("הביקור שלכם · יום …, … · 18:30" + demo line + "לבחור מועד אחר" → back to an empty form, focus on the first day). `#visit` moved to a wrapper so links and the phone bar work in both states. Nothing sent or stored.
- Checks (light): build; 360/390/768/1024/1440 × normal/reduced: 0 overflow, header nav fits with the new item, slot error → card → back flow and keyboard arrows verified, console clean. One phone screenshot set.
- Still open: terrace/location (ivory) → contact (dark) is a hard edge; flow-mode kitchen background `#dcd2c4`.

## Working rules (Abraham, 2026-11-16)
Token-frugal: read only stage-relevant brief sections/files, concise PROGRESS, no full rescans, checks proportional to change, short report, stop for approval.

## Change request 2 (2026-11-17): exterior reveal (letters → facade)
- New `ExteriorReveal.tsx/.css` between the tour and #home. Dark veil with AFTER / LIGHT cut out (SVG mask) over one full-screen facade photo; scroll grows only the cut-out around the middle of the T's stem (measured from the font via canvas) until the opening exceeds the screen; veil then hidden (reversible); final AFTERLIGHT + פנטהאוז מול האופק. Kicker "מקום משלו. מעל העיר." fades first.
- Engine: GSAP + ScrollTrigger (new dependency, lazy chunks ~45 KB gzip, loaded after page load), `scrub: true` (no smoothing). Pin = CSS sticky (like the tour; deliberate deviation from ScrollTrigger `pin`: no pin-spacer, no layout shift, no fixed-position jitter on mobile; section height reserved in CSS). `ignoreMobileResize`, stage in lvh, scroll distance computed from section−stage px.
- All tunables in `reveal` (src/data/media.ts): scroll 1.5 / 1.2 vh, zoom window [0.12, 0.8], block size, focus line/char, overshoot 1.2, photo crop (object-position landscape 50% / portrait 54% = penthouse glazing column).
- Font: Barlow Semi Condensed 800 (OFL, one weight, ~15 KB). Photo: AFTERLIGHT-exterior.webp (original kept in incoming-media) → exterior-facade-*.{avif,webp}.
- Finding: Chromium draws glyphs wrongly once effective font size passes ~8000 px (hole narrower than geometry, left a dark strip at 1440). Fixed by adding a plain rectangle inside the T stem to the mask for the final coverage.
- Checks (Playwright Chromium, vite preview, emulation only): order hero → reveal → #home, junction gap 0; no pin-spacers; stage top 0 through the pin and released exactly at the end; transform identical when returning to the same progress (reversible); no drift 1.2 s after stopping; veil-on vs veil-off frames at p 0.785/0.79/0.799 for 360/390/768/1440/1920: edge strips equal in brightness, differences only image noise (YMAX ≤ 36); sweeps at 390 (4× CPU) and 1440: 0 slow frames; resize and breakpoint changes recompute and return to the same values; reduced motion → static facade + name (0.84 vh), no GSAP requested; photo blocked → plain dark block with name; GSAP blocked → static; skip link still lands on #home.
- Not verified: real phones (address-bar behaviour of lvh/sticky on iOS/Android), Safari/Firefox rendering of the SVG mask, touch-momentum feel.

## Change request 1 (2026-11-16): elevator-doors intro + scroll tour on mobile
- Doors: `ElevatorDoors.tsx/.css` (+ inline decision script in `index.html`). Opens when the hero poster is decoded (≤1.5 s wait), 900 ms transform, removed afterwards. Plays on every load/refresh (changed on request; was once per tab session); skipped only for reduced motion.
- Tour: scrub on all screens (reduced motion → still + optional player; failure/Save-Data → still). Pace in one place: `tour.scroll` (media.ts): wide 2.5, narrow 2 viewport heights. Mobile film re-encoded (960×540, GOP 8, 4.0MB). Progress via stage svh height. Portrait phones: 3:2 framed film. Skip label "לדלג לפרטי הבית". Short-phone/landscape CSS fixes.
- Checks (Playwright Chromium, vite preview, emulation only — no real phone): doors closed→open geometry exact (panels meet at centre, exit fully), ~0.9s, removed ~1.0s after mount, not replayed on reload, none with reduced motion, none with #hash, `pointer-events: none` + scroll works while closed. Scrub 390 (4× CPU) / 768 / 1440: currentTime tracks progress exactly (0, 6.24, 12.47, 18.7, 24.95), no drift after stopping, reverse correct, hero = 3 / 3 / 3.5 viewport heights, after the end #home follows and stage is released, no horizontal overflow. Seek latency: mobile file median 10ms p95 26–29ms, 0 slow frames; desktop 1080p median ~20–38ms, ~25–30% of frames >34ms (worst ~50ms) in a synthetic constant-speed sweep (headless Chromium; GOP 6 trial improved seek latency but not frame pacing, 15.5MB, not adopted). Reduced motion: no doors, no scrub, no mp4 request; media blocked: static still, page scrolls on.
- Not verified: real phones (iOS Safari especially: muted inline seek behaviour), Safari/Firefox, real touch-momentum feel, rubber-banding. Frame-sequence fallback not implemented (only if real-device testing shows judder).

## Stage 5 — completed
- Reveals: 9 secondary blocks, 550ms / 16px, once, only below the fold, off under reduced motion and without JS.
- Fixes: short-landscape hero (play button inside first screen), long-word wrapping (overflow-wrap: anywhere), contrast comments corrected.
- QA on production build (vite preview): 7 viewports incl. 720×450 (≈200% zoom) and 844×390 → 0 overflow, 0 broken images, no targets <44px; contrast lowest 5.28:1; worst-case copy at 360 OK; LCP 1.16s (390, slow-4G-like + 4× CPU), 0.15s (1440); CLS ≤ 0.002; first view ≈270KB, no video.
- Note: dev server served stale CSS after a shell edit (plan buttons looked 21px); production build was correct — QA moved to preview.
- break-ui skill not invoked (token budget); its worst-case method applied manually. Lighthouse not run.
- docs/HANDOFF.md written.

## Stage 4 — completed
- Tour audit + encodes: see MEDIA-MAP.md (one duplicate frame removed; desktop 12.9MB, mobile 4.2MB).
- TourHero modes: scrub (≥62.5rem, hover+fine pointer, no reduced motion) / manual (mobile, touch, reduced motion, or scrub failure) / static (no film).
- Scrub: 450svh section + sticky stage, passive scroll → one rAF update, progress → currentTime, latest-target-wins seeking on `seeked`, listeners only while hero intersects, film fetched after load+idle (or first scroll), shown only after loadeddata, src released on unmount. Chapter label (כניסה / מטבח ופינת אוכל / סלון / מרפסת), copy + hint fade via CSS var, skip link לפרטי הבית → #home. Ends at terrace, no loop, no wheel interception or snapping.
- Manual: play button only when film ready; 720p (or 1080p on wide) inline video with native controls at natural 16:9, focus moved to video, close restores focus to play button; error text if it fails.
- Checks (Playwright Chromium, this PC, H.264 supported): synthetic scroll through the whole tour in ~3s: 182 seeks, median 27ms / p95 51ms; reverse scroll lands exactly on target (9.98s); warm passes 9/181 and 6/181 frames >34ms (worst 39ms) vs 0 on a control scroll; cold first pass had a 413ms spike. Reduced motion @1440 → manual, no .mp4 requested. 390 → manual, no .mp4 until tap; plays 720p, film 120–331px, copy from 521px, no overflow. Failure (bad src) → falls back to manual. Header turns solid before #home (sentinel fix). Console clean.
- Not verified: real trackpad/mouse-wheel feel, other browsers (Safari/Firefox), real phones, low-end hardware, slow-network throttling.

## Stage 3 — completed
- Lightbox (native <dialog> + showModal): 4 gallery stills, Hebrew captions + "n מתוך 4", prev/next buttons, ←/→ (RTL), Escape, backdrop click, html scroll lock only while open, focus returns to the opener.
- Plan: zones selectable from the SVG (pointer) and parallel buttons (aria-pressed, single selection); photo + text update in an aria-live region.
- Form: noValidate + Hebrew errors (name ≥2, phone ≥9 digits or valid email), aria-invalid/aria-describedby, focus first invalid; valid → reset + role=status "זו הדגמה בלבד — לא נשלחה פנייה." Values never stored/logged.
- Checks (Playwright, real keys/clicks): first Tab = skip link; lightbox focus stays inside over 4 Tabs, Escape closes, lock removed, focus restored; image/caption/nav no overlap (1440); plan button + SVG selection; form empty/invalid/valid paths; no non-static network requests; console has no app messages; mobile menu Enter→first link, Escape→toggle; #plan anchor lands 16px below header.
- Not checked: touch device, screen reader, 200% zoom (Stage 5).

## Stage 2 — completed
- New media: `AFTERLIGHT-tour-master.mp4` (H.264 1920×1080, 24fps, 601 frames, 25.04s, no audio, 24.2MB). Contact sheet shows straight rail entrance → dining L / kitchen R → living → threshold → terrace; ffmpeg scene detection (>0.25) found no hard cuts. Full audit/encode deferred to Stage 4.
- Hero poster now `tour-01-entry` = exact first frame of the master (1920w AVIF 44KB). Interim terrace poster retired; terrace section uses gallery-terrace.
- Sections built: HomeOverview (THE RESIDENCE + 4-feature ruled row), Spaces (living / kitchen mirrored / suite with portrait bathroom), ConceptPlan (schematic SVG, entry shown, zone list static, caption + text description), MaterialDetails (MATERIALITY, 3 staggered portraits), Terrace (THE HORIZON, text below image), DemoContact (notice before fields, local-only submit with demo status, separate B2B block with pending-contact note, no link), Footer (anchors, credit, accurate privacy note).
- Nav CTA → `#visit` (form); "יצירת קשר" → `#contact`.
- Checks: build passes; 1440 full page + 390 sections: no horizontal overflow, 1 H1, ordered headings, no broken images, console clean. Visual review of 1440 sections and 390 suite/plan; fixed MATERIALITY overlapping the H2, English labels aligned to the Hebrew edge, plan labels enlarged on mobile.
- Not yet: 768/1024 visual pass of new sections, 200% zoom, keyboard walkthrough (Stage 3/5).

## Project locations
- Project root: `C:\Users\אברהם אתרים\אתר חדש ואחרון` (not a git repo).
- Brief: copied here from `Documents\אתר אחרון\`.
- Media originals: `C:\Users\אברהם אתרים\Documents\אתר אחרון\incoming-media\` (untouched).
- Derivatives: `public/media/` built by `bash scripts/build-media.sh [source-dir]` (ffmpeg, AVIF + WebP).

## Approved decisions
- Everything in the brief (brand, rail order, stack, scope, demo-only form, no paid media, no publishing).
- Stage 0 plan approved 2026-11-16.

## Stage 1 — completed
- Vite 8 + React 19 + TypeScript 7, npm with package-lock. Plain CSS + tokens (`src/styles/tokens.css`).
- Fonts self-hosted via @fontsource: Noto Serif Hebrew 300/400, Heebo 300/400/500, Cormorant Garamond 400/500 (latin), font-display swap.
- Wordmark (`Wordmark.tsx`): tracked Cormorant capitals cut by one bronze horizon line; the letters below the line are dimmed ("setting" below the horizon). Pure HTML/CSS, real text, LTR-isolated.
- Header: skip link, transparent over hero → solid night via IntersectionObserver (no scroll listener), desktop nav + CTA, mobile menu button with aria-expanded, focus to first link, Escape/outside click close, focus restored to toggle.
- TourHero: static interim poster (gallery-terrace, AVIF/WebP srcset, preloaded, fetchpriority high), local shading, concept label, H1/subtitle, "לגלות את הבית" anchor, neutral readiness line "סיור הווידאו בבית נמצא בהכנה". No tour hint or play button (tour.status = 'missing').
- SpacesGallery: section heading + living composition (8-col photograph bleeding to the left edge, text column right with bronze rule; edge-to-edge photo on mobile).
- Other sections are labeled development placeholders so nav anchors resolve.
- Media manifest `src/data/media.ts` with roles/status; copy in `src/data/content.ts`; studio contact = null.

## Checks actually performed (Stage 1)
- `npm run build` (tsc --noEmit + vite build): passes, no type errors. JS 71.7KB gzip, CSS 4.7KB gzip.
- Playwright (Chromium via Playwright MCP) against the Vite dev server:
  - 1440×900, 1024×768, 768×1024, 390×844, 360×740: `scrollWidth - clientWidth = 0` (no horizontal overflow).
  - Fonts loaded: Noto Serif Hebrew 300, Heebo 300/400/500, Cormorant Garamond 500.
  - H1 97px @1440, 40px @390; H2 30px @390; body 17px @390.
  - Mobile menu: opens, focus on first link, Escape closes, focus returns to toggle. Toggle height 44px.
  - Hero poster picks 1672w AVIF on tall mobile (sizes accounts for cover crop).
  - Console: no errors after adding the inline favicon (only a favicon 404 before).
- Fixed during review: H1 breaking into 3 lines at 1024/1440, subtitle over the lantern, mobile crop losing skyline, blurry mobile poster (sizes), mid-width poster offset.
- NOT yet done: 200% zoom, landscape phone, real device, contrast measurement tool, Lighthouse/LCP (planned for Stage 5).

## Pending / launch blockers
- [x] Tour film integrated (Stage 4).
- [x] Real Benzaken Studio contact link for the B2B CTA (`studio.contactHref`) + WhatsApp.
- [ ] Real-device QA: iPhone Safari + Android Chrome (player, scrub fallback).
- [x] GitHub Pages demo deployed (no custom domain). Studio site (benzaken-studio repo) untouched.

## Known limitations
- Stills max 1672px wide → hero is not fully crisp on very large/retina desktop screens.
- Hero poster is a video frame (1920×1080), softer than the stills.
- `.playwright-mcp/` holds local check screenshots (dev artefacts, not part of the site).
- Materials on phones: frame now fills the screen height left by header, title and bottom bar (min 38svh), MATERIALITY half behind the frame, flow fallback only on truly short screens (build only, not checked on a device).
- Hero on phone portrait: separate vertical film (tour-master-vertical.mp4 from AFTERLIGHT-tour-updated-1080p.mp4, 1080x1920, 8.4MB, g8/bf0) + first-frame poster tour-01-entry-vertical (portrait-only preload), chaptersVertical 0/0.1/0.36/0.9, scroll.vertical 2; tall card ~66svh (shorter on short screens), edge-to-edge chapter word cut by the card top (opacity 0.25, desktop too), label under the header, headline straddling the card bottom, bronze scroll cue, chapter label + progress line in the card, skip link alone at the side. Only `npm run build` checked (no browser, no device).
- Hero phone portrait cleanup: chapter word fully visible above the card (fit-to-width, opacity 0.22), concept label hidden, headline + short subtitle (`hero.subtitleShort`) + cue below the card, no bottom gradient, card up to 70svh sized so everything fits one screen. The dark left strip was baked into the vertical film/poster (~28px dark door frame at the left edge): cropped 32px left (+ centred vertical crop to keep 9:16) and re-encoded film + poster. Desktop unchanged. Only `npm run build` checked (no browser).

## Next step
None. Remaining work is the launch blockers (real studio contact, real-device QA, hosting decision).
