#!/usr/bin/env bash
# Builds responsive AVIF + WebP derivatives from the untouched originals.
# Usage: bash scripts/build-media.sh [path-to-incoming-media]
# Mapping is based on visual inspection — see docs/MEDIA-MAP.md.
set -euo pipefail

SRC="${1:-$HOME/Documents/אתר אחרון/incoming-media}"
OUT="$(dirname "$0")/../public/media"
mkdir -p "$OUT"

# original-file  output-name  widths
MAP=(
  "8c1ceb2e-7c94-4287-8ab1-9a2ecd118cc1.png gallery-living 640,960,1280,1672"
  "66597f7f-9969-40b1-bc0f-c1a75efb99b0.png gallery-kitchen 640,960,1280,1672"
  "bf94352b-88cd-4ec1-b30a-8e9e98f151b4.png gallery-bedroom 640,960,1280,1672"
  "b27e1a8c-2c30-4966-8d92-2256423686b0.png gallery-terrace 640,960,1280,1672"
  "b53d78a0-4dbe-44e5-a8a3-cccc25ee7c4b.png gallery-bathroom 480,800,1122"
  "a003b1a9-02f5-4697-8c2a-754ad897f3ed.png detail-walnut 480,800,1122"
  "681cfaba-757b-4072-9039-034c83b4a0be.png detail-stone 480,800,1122"
  "95ca42b3-7a3c-4dea-9020-0c02ffcd19cf.png detail-textile 480,800,1122"
)

# Hero poster = exact first frame of the supplied tour master (so poster and film start match).
MASTER="$SRC/AFTERLIGHT-tour-master.mp4"
if [[ -f "$MASTER" ]]; then
  TMP="$(mktemp -d)"
  ffmpeg -v error -y -i "$MASTER" -frames:v 1 "$TMP/tour-01-entry.png"
  MAP+=("tour-01-entry.png tour-01-entry 640,960,1280,1920")
  SRC_POSTER="$TMP"
fi

for row in "${MAP[@]}"; do
  read -r file name widths <<<"$row"
  in="$SRC/$file"
  [[ "$file" == tour-01-entry.png ]] && in="$SRC_POSTER/$file"
  if [[ ! -f "$in" ]]; then echo "missing: $in" >&2; continue; fi
  IFS=',' read -ra ws <<<"$widths"
  for w in "${ws[@]}"; do
    ffmpeg -v error -y -i "$in" -vf "scale=${w}:-2:flags=lanczos" \
      -c:v libwebp -quality 78 -compression_level 6 "$OUT/${name}-${w}.webp"
    ffmpeg -v error -y -i "$in" -vf "scale=${w}:-2:flags=lanczos,format=yuv420p" \
      -c:v libaom-av1 -still-picture 1 -crf 30 -b:v 0 -cpu-used 4 "$OUT/${name}-${w}.avif"
  done
  echo "done: $name"
done

# Tour film (Stage 4). Frame 121 is a near-duplicate at the first clip joint (YDIF 0.71 vs ~3.2
# around it) and is removed; timing is re-based at 24fps so movement speed is unchanged.
if [[ -f "$MASTER" ]]; then
  SEL="select='not(eq(n\,121))',setpts=N/24/TB"
  TAGS=(-colorspace bt709 -color_primaries bt709 -color_trc bt709 -movflags +faststart)
  # Desktop scrub: 1080p, keyframe every 12 frames, no B-frames (cheap, accurate seeks).
  ffmpeg -v error -y -i "$MASTER" -an -vf "$SEL" -c:v libx264 -profile:v high -preset slow -crf 25 \
    -pix_fmt yuv420p -g 12 -keyint_min 12 -sc_threshold 0 -bf 0 "${TAGS[@]}" "$OUT/tour-master-desktop.mp4"
  # Mobile manual player: 720p, ordinary GOP.
  ffmpeg -v error -y -i "$MASTER" -an -vf "$SEL,scale=1280:-2:flags=lanczos" -c:v libx264 -profile:v high \
    -preset slow -crf 25 -pix_fmt yuv420p -g 48 "${TAGS[@]}" "$OUT/tour-master-mobile.mp4"
  echo "done: tour masters"
fi
