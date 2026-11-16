# AFTERLIGHT — Media map

Last updated: 2026-11-16 (Stage 0)

Source folder (originals, never modified):
`C:\Users\אברהם אתרים\Documents\אתר אחרון\incoming-media\`

Every assignment below was made by visually inspecting the file, not from its UUID filename.
Optimized derivatives will go to `public/media/` (Stage 1+). Originals stay untouched.

## Received stills (8 of 14)

| Original file | Size (px) | Orientation | Visual check | Assigned name | Used in |
|---|---|---|---|---|---|
| 8c1ceb2e-7c94-4287-8ab1-9a2ecd118cc1.png | 1672×941 | landscape | Living room: grey sofa + wool throw, two stone coffee tables, walnut shelving, arc lamp, cognac chair (right), open glazing to terrace and skyline | gallery-living.webp | Spaces §D.1 (living) |
| 66597f7f-9969-40b1-bc0f-c1a75efb99b0.png | 1672×941 | landscape | Angled view: stone waterfall island, 3 cognac stools, full walnut wall, lit stone niche; cognac chair + skyline at far left. Not a rail frame | gallery-kitchen.webp | Spaces §D.2 (kitchen/dining) |
| bf94352b-88cd-4ec1-b30a-8e9e98f151b4.png | 1672×941 | landscape | Bedroom: bed, walnut wall with lit ledge + sconces, cognac bench, blue-hour glazing | gallery-bedroom.webp | Spaces §D.3 (suite) |
| b53d78a0-4dbe-44e5-a8a3-cccc25ee7c4b.png | 1122×1402 | portrait | Bathroom: stone walls, walnut vanity, freestanding tub, ribbed privacy glazing | gallery-bathroom.webp | Spaces §D.3 (suite, smaller) |
| b27e1a8c-2c30-4966-8d92-2256423686b0.png | 1672×941 | landscape | Terrace: sofa + knitted pouf + lantern, planter left, skyline and sea | gallery-terrace.webp | Terrace §G |
| a003b1a9-02f5-4697-8c2a-754ad897f3ed.png | 1122×1402 | portrait | Walnut panel join with illuminated stone niche | detail-walnut.webp | Materials §F |
| 681cfaba-757b-4072-9039-034c83b4a0be.png | 1122×1402 | portrait | Mitered stone island corner, cognac stool, bowl | detail-stone.webp | Materials §F |
| 95ca42b3-7a3c-4dea-9020-0c02ffcd19cf.png | 1122×1402 | portrait | Sofa upholstery with fringed wool throw | detail-textile.webp | Materials §F |

All 8 are consistent with the same home (walnut, grey-brown stone, taupe textiles, cognac leather, blue-hour coastal skyline).

Note: originals are ~1672px wide (landscape) / 1122px (portrait). That is enough for the layouts, but not for a sharp full-bleed 2560px hero; derivatives will top out at the native width (no upscaling).

## Missing — pending from Abraham

Rail stills (straight axis: entrance → dining left / kitchen right → living → threshold → terrace):

- [ ] tour-01-entry — wide entrance, dining left, kitchen right, living ahead (**hero poster / LCP**)
- [ ] tour-02-kitchen-dining
- [ ] tour-03-living-entry
- [ ] tour-04-living
- [ ] tour-05-threshold
- [ ] tour-06-terrace

Video:

- [ ] tour-01-02.mp4 — generated and approved (Kling 3.0 Pro, 5s, silent); **no local copy in incoming-media**
- [ ] tour-02-03.mp4 — not generated
- [ ] tour-03-04.mp4 — not generated
- [ ] tour-04-05.mp4 — not generated
- [ ] tour-05-06.mp4 — not generated
- [ ] tour-master-desktop.mp4 — to be assembled locally only after all five exist

## Interim handling until the rail stills arrive

- Hero: static poster only, with no tour hint and no play button. Until `tour-01-entry` exists the poster slot uses `gallery-terrace` as a **named interim poster** (Stage 1 decision: its open sky on the right keeps the Hebrew headline readable without covering furniture; the kitchen still put text over the kitchen). It is real concept imagery of the same home and switches automatically in `src/data/media.ts` once `tour-01-entry` is marked ready. While interim, the Terrace section must not reuse the same still — revisit in Stage 2.
- Floor-plan zone photos: entry/threshold zones show their nearest available still or a named text placeholder. Nothing invented.
- No dissolves or simulated tour from stills.

## Update — Stage 2 (2026-11-16)

- Received `AFTERLIGHT-tour-master.mp4`: H.264, 1920×1080, 24fps, 601 frames, 25.04s, no audio, 24.2MB. Visually confirmed straight rail entrance → terrace (contact sheet every 50 frames); no hard cuts detected (ffmpeg scene > 0.25).
- `tour-01-entry` derived from its first frame → hero poster (status ready). The interim terrace poster is retired.
- Separate rail stills tour-02…06 and per-clip files are no longer needed for the site; the master is the source for Stage 4 (re-encode to the web budget, keep original).

## Update — Stage 4 (2026-11-16): tour audit + web encodes

Source audit (`AFTERLIGHT-tour-master.mp4`): H.264 High, yuv420p, untagged colour (treated as BT.709), 7.7 Mb/s, 601 frames @24fps, keyframe every 0.5s, no audio.
- Per-frame luma difference (YDIF, signalstats): mean 3.25. One anomaly: frame 121 = 0.71 → near-duplicate at the first clip joint (5.04s). Removed.
- Joints at frames 120/240/360/480 show small single-frame spikes (4.2–5.2 vs ~3.2): soft seams, no hard cut, no colour shift seen on a 7-frame strip around the first joint. No other edits, no crossfades, no loop.

Web files (`public/media/`, originals untouched):
| File | Size | Spec | Use |
|---|---|---|---|
| tour-master-desktop.mp4 | 12.9 MB | 1920×1080, 600 fr, 25.0s, CRF 25, GOP 12, no B-frames, faststart; SSIM 0.981 vs source | desktop scroll scrub |
| tour-master-mobile.mp4 | 4.2 MB | 1280×720, 600 fr, 25.0s, CRF 25, GOP 48, faststart | manual player after tap |

Reproducible via `scripts/build-media.sh`.
