# AFTERLIGHT — Progress

## Current stage
Stage 5 complete. All stages done. **Deployed (2026-11-16) to https://benzakenavi25-hub.github.io/afterlight/ (repo benzakenavi25-hub/afterlight, GitHub Pages via Actions). Still not ready for final launch** (blockers below). Details: docs/HANDOFF.md.

## Working rules (Abraham, 2026-11-16)
Token-frugal: read only stage-relevant brief sections/files, concise PROGRESS, no full rescans, checks proportional to change, short report, stop for approval.

## Change request 1 (2026-11-16): elevator-doors intro + scroll tour on mobile
- Doors: `ElevatorDoors.tsx/.css` (+ inline decision script in `index.html`). Opens when the hero poster is decoded (≤1.5 s wait), 900 ms transform, removed afterwards. Once per tab session; skipped for reduced motion, #hash, scrolled page.
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
- [ ] Real Benzaken Studio contact link for the B2B CTA (`studio.contactHref`).
- [ ] Real-device QA: iPhone Safari + Android Chrome (player, scrub fallback).
- [x] GitHub Pages demo deployed (no custom domain). Studio site (benzaken-studio repo) untouched.

## Known limitations
- Stills max 1672px wide → hero is not fully crisp on very large/retina desktop screens.
- Hero poster is a video frame (1920×1080), softer than the stills.
- `.playwright-mcp/` holds local check screenshots (dev artefacts, not part of the site).

## Next step
None. Remaining work is the launch blockers (real studio contact, real-device QA, hosting decision).
