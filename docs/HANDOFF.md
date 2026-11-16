# AFTERLIGHT — Handoff

Concept single-page site (Hebrew RTL) for a fictional coastal penthouse, by Benzaken Studio.
**Status: not published. Not ready for publication** until the launch blockers below are resolved.

## Setup and commands

Requirements: Node 24+, npm. ffmpeg (full build with libaom-av1, libwebp, libx264) only for regenerating media.

```bash
npm install          # uses package-lock.json
npm run dev          # Vite dev server
npm run typecheck    # tsc --noEmit
npm run build        # typecheck + production build → dist/
npm run preview      # serve dist/ locally (port 4173 via .claude/launch.json)
```

`dist/` is a static site (HTML, JS, CSS, fonts, `media/`). Any static host works; no server code, no env vars.

## Structure

- `src/data/content.ts` — all Hebrew copy, nav, plan zones, form text, footer. **Studio contact config lives here** (`studio.contactHref`).
- `src/data/media.ts` — typed media manifest (stills with role/status/alt, hero poster, tour status, chapter boundaries).
- `src/components/` — Header, TourHero, HomeOverview, SpacesGallery (+ Lightbox), ConceptPlan, MaterialDetails, Terrace, DemoContact, Footer, Wordmark, ResponsiveImage.
- `src/useReveal.ts` — secondary reveals (progressive enhancement, off under reduced motion).
- `src/styles/tokens.css`, `base.css` — palette, type scale, layout tokens.
- `docs/PROGRESS.md` — stage log and checks. `docs/MEDIA-MAP.md` — media identification, audit and encode details.

## Studio contact (launch blocker)

The B2B block ("לדבר על האתר שלכם") currently shows a development note instead of a link. To enable it, set a **real, verified** URL in `src/data/content.ts`:

```ts
contactHref: 'https://…' // or 'mailto:…' / 'tel:…'
```

The button then renders automatically. Never point it to the demo property form.

## Replacing media

Originals stay outside the repo (`Documents\אתר אחרון\incoming-media`). Derivatives are generated into `public/media/`:

```bash
bash scripts/build-media.sh "/path/to/incoming-media"
```

- Stills: mapping in the `MAP` array (original filename → output name → widths). Assignments were made by viewing each image; keep that rule for new files. Outputs AVIF + WebP per width.
- Hero poster: first frame of `AFTERLIGHT-tour-master.mp4` → `tour-01-entry-*`. If the film changes, regenerate so poster and film start match; update `index.html` preload if widths change.
- Tour film: script encodes `tour-master-desktop.mp4` (1080p, GOP 12, no B-frames, for scrubbing) and `tour-master-mobile.mp4` (720p). It removes frame 121 (a measured duplicate in the current master) — **remove or adjust that filter for a different master** after re-auditing (see MEDIA-MAP.md).
- Chapter label timing: `tour.chapters` in `src/data/media.ts` (fractions of the film).
- To disable the tour (e.g. film missing), set `tour.status` to `'missing'`: the hero shows the poster and a neutral readiness line, no tour controls.

## Behaviour summary

- Desktop (≥1000px, mouse/trackpad, no reduced motion): pinned scroll tour over 4.5 screen heights, scroll ↔ film time, chapter label, skip link "לפרטי הבית". Film fetched after page load/idle or first scroll.
- Mobile / touch / reduced motion / film error: poster + "צפייה בסיור הבית" → inline player with native controls at 16:9. No film is requested before the tap.
- Demo form: validated locally, nothing sent, stored or logged; success text states it is a demo.

## Measured checks (Stage 5, 2026-11-16)

Environment: Windows 11, Playwright MCP (Chromium with H.264), `vite preview` on localhost. Lab numbers only, no field data.

| Check | Result |
|---|---|
| Build / typecheck | pass |
| Horizontal overflow at 360×740, 390×844, 768×1024, 1024×768, 1440×900, 720×450 (≈200% zoom of 1440), 844×390 landscape | 0 px everywhere |
| Broken images | 0 |
| Interactive targets < 44px | none (production build) |
| Text contrast (WCAG) | lowest pair 5.28:1 (muted text on paper-2); all text pairs ≥ AA; bronze used for rules only |
| Worst-case copy at 360 (long unbroken Hebrew/English words, long button label, 300-char name) | no overflow after `overflow-wrap: anywhere` |
| LCP / CLS — 390, slow-4G-like (1.6 Mb/s, 150 ms) + 4× CPU | LCP 1.16 s (hero subtitle text), CLS 0 |
| LCP / CLS — 1440 unthrottled / throttled | 0.15 s / 1.15 s (H1), CLS 0 / 0.002 |
| First-view transfer | ≈ 265–280 KB, no video |
| Tour seeking (1440, synthetic scroll) | median 27 ms, p95 51 ms per seek; warm passes ≤ 9/181 frames over 34 ms (worst 39 ms); cold first pass one 413 ms spike |
| Keyboard | skip link first; menu, lightbox (focus trap, Escape, focus restore), plan buttons, form errors, tour skip — all verified |
| Reduced motion | no scrub, no reveals, no film request |

## Not verified / known limitations

- Real devices (iPhone/Android), Safari and Firefox, real trackpad/mouse-wheel feel of the scrub, low-end hardware.
- Screen reader walkthrough (semantic structure and ARIA were reviewed in code, not with NVDA/VoiceOver).
- INP not measured (no field data; lab interaction latency only observed informally).
- Browser text-size setting tested by forcing `html { font-size: 200% }`, which does not move rem-based media queries; a real browser setting would also switch to the mobile menu earlier.
- Stills are ≤1672 px wide and the hero poster is a video frame: slightly soft on large/retina desktops.
- Lighthouse was not run (would require downloading it); the numbers above come from the browser's own Performance APIs.

## Launch blockers

1. Real Benzaken Studio contact URL (`studio.contactHref`).
2. Real-device QA (at least one iPhone Safari and one Android Chrome) of the hero player and scrub fallback.
3. Hosting decision, domain and deploy — not done, not authorised.

## Dev artefacts

`.playwright-mcp/` (check screenshots) and `.claude/launch.json` are local tooling, not part of the site; exclude them from any deploy.
