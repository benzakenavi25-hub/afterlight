# AFTERLIGHT — Implementation plan (short)

Source of truth: `AFTERLIGHT-Claude-Code-Master-Brief.md` (project root). This file only records how it will be built.

## Identity
- Wordmark: `AFTERLIGHT` in Cormorant Garamond, uppercase, restrained tracking, one fine horizontal horizon rule (HTML/CSS, `dir="ltr"`). Hebrew descriptor: פנטהאוז מול האופק.
- Palette tokens: ink #111820, paper #F0ECE5, text #20262C, light-secondary #C6C1B9 (contrast-checked), bronze #A58C72 (rules/decoration only).
- Type: Noto Serif Hebrew (display), Heebo (UI/body), Cormorant Garamond (brand + max 3 English chapter words: THE RESIDENCE, MATERIALITY, THE HORIZON).

## Section order
1. Header (skip link, wordmark, הבית / החללים / תכנית הבית / יצירת קשר, CTA לתיאום ביקור)
2. TourHero (night): poster now, scroll-scrub tour in Stage 4
3. HomeOverview (paper): THE RESIDENCE + 4 features
4. SpacesGallery (paper): living / kitchen-dining / private suite + lightbox
5. ConceptPlan (paper): schematic SVG + 5 zones
6. MaterialDetails (night): MATERIALITY + 3 portraits
7. Terrace: THE HORIZON
8. DemoContact (night): demo form + separate B2B block
9. Footer

## Stack
- React + TypeScript + Vite, npm (package-lock), plain CSS + CSS variables + logical properties.
- Fonts self-hosted WOFF2 via @fontsource packages (OFL), limited weights, `font-display: swap`.
- Image derivatives (AVIF + WebP, responsive widths) produced locally with the installed ffmpeg 9.0.2. No image npm dependency.
- No GSAP unless Stage 4 testing shows native scroll + rAF is insufficient.
- Verification: `tsc`/`vite build`, Playwright MCP for browser checks at 360/390/768/1024/1440.

## Skills per stage
- Stage 1–2: frontend-design (direction), impeccable (polish/critique), ui-ux-pro-max (only for targeted checks). benzaken-cinematic-real-estate matches the global rule; it is used as background only, and the brief overrides it where they differ.
- Stage 3: mobile-native (menu/touch).
- Stage 4: animate + animation-performance (scrub).
- Stage 5: break-ui (stress), improve-animations only for a specific identified issue.

## Stages
0 ✔ inspection · 1 foundation + visual sample · 2 full static page · 3 interactions · 4 tour/video · 5 motion + QA + HANDOFF.md
