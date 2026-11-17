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
  "AFTERLIGHT-exterior.webp exterior-facade 640,960,1280,1672"
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

# Round 5 sources (new-media/ in the project root, or the Hebrew folder name it was delivered in).
# `--new-only` builds just these. Material textures are squares; facade-vertical is the phone facade.
ROOT="$(dirname "$0")/.."
NEW=""
for c in "$ROOT/new-media" "$ROOT/תמונות חדשות"; do [[ -d "$c" ]] && { NEW="$c"; break; }; done
NEW_MAP=(
  "Dark Walnut Vertical Grain.png|material-walnut|480,800,1254"
  "material-stone|material-stone|480,800,1254"
  "Warm taupe woven blanket fold.png|material-textile|480,800,1254"
  "Coastal Penthouse at Blue Hour.png|facade-vertical|640,941"
)
build_one() { # in name widths
  local in="$1" name="$2" w
  IFS=',' read -ra ws <<<"$3"
  for w in "${ws[@]}"; do
    ffmpeg -v error -y -i "$in" -vf "scale=${w}:-2:flags=lanczos" \
      -c:v libwebp -quality 78 -compression_level 6 "$OUT/${name}-${w}.webp"
    ffmpeg -v error -y -i "$in" -vf "scale=${w}:-2:flags=lanczos,format=yuv420p" \
      -c:v libaom-av1 -still-picture 1 -crf 30 -b:v 0 -cpu-used 4 "$OUT/${name}-${w}.avif"
  done
  echo "done: $name"
}
if [[ -n "$NEW" ]]; then
  for row in "${NEW_MAP[@]}"; do
    IFS='|' read -r file name widths <<<"$row"
    in="$NEW/$file"
    # Accept the plain output name too (e.g. new-media/material-walnut.png).
    [[ -f "$in" ]] || in="$(ls "$NEW/$name".* 2>/dev/null | head -n1 || true)"
    if [[ -z "$in" || ! -f "$in" ]]; then echo "missing: $name" >&2; continue; fi
    build_one "$in" "$name" "$widths"
  done
else
  echo "missing: new-media/" >&2
fi
[[ "${1:-}" == "--new-only" ]] && exit 0

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

# Terrace panorama (≈3:1) for the horizontal pan (Terrace.tsx, media.ts terrace.pan). Prefers the full
# 4344×1448 JPEG (project root or source dir); falls back to the 2172×724 PNG. Widths above the source
# width are not produced (the source width itself is used instead) — keep stills['terrace-panorama'].widths in sync.
PANO=""
for c in "$(dirname "$0")/../terrace-panorama-4344x1448.jpg" "$SRC/terrace-panorama-4344x1448.jpg" \
  "$HOME/Pictures/Blue hour Mediterranean terrace panorama.png"; do
  if [[ -f "$c" ]]; then PANO="$c"; break; fi
done
if [[ -n "$PANO" ]]; then
  pw=$(ffprobe -v error -select_streams v:0 -show_entries stream=width -of csv=p=0 "$PANO")
  done_ws=" "
  for w in 1600 2600 4344; do
    (( w > pw )) && w=$pw
    [[ "$done_ws" == *" $w "* ]] && continue
    done_ws+="$w "
    ffmpeg -v error -y -i "$PANO" -vf "scale=${w}:-2:flags=lanczos" \
      -c:v libwebp -quality 80 -compression_level 6 "$OUT/terrace-panorama-${w}.webp"
    ffmpeg -v error -y -i "$PANO" -vf "scale=${w}:-2:flags=lanczos,format=yuv420p" \
      -c:v libaom-av1 -still-picture 1 -crf 30 -b:v 0 -cpu-used 4 "$OUT/terrace-panorama-${w}.avif"
  done
  echo "done: terrace-panorama ($PANO, widths:$done_ws)"
else
  echo "missing: terrace panorama" >&2
fi

# Tour film (Stage 4). Frame 121 is a near-duplicate at the first clip joint (YDIF 0.71 vs ~3.2
# around it) and is removed; timing is re-based at 24fps so movement speed is unchanged.
if [[ -f "$MASTER" ]]; then
  SEL="select='not(eq(n\,121))',setpts=N/24/TB"
  TAGS=(-colorspace bt709 -color_primaries bt709 -color_trc bt709 -movflags +faststart)
  # Desktop scrub: 1080p, keyframe every 12 frames, no B-frames (cheap, accurate seeks).
  ffmpeg -v error -y -i "$MASTER" -an -vf "$SEL" -c:v libx264 -profile:v high -preset slow -crf 25 \
    -pix_fmt yuv420p -g 12 -keyint_min 12 -sc_threshold 0 -bf 0 "${TAGS[@]}" "$OUT/tour-master-desktop.mp4"
  # Mobile scrub + reduced-motion player: 960x540, keyframe every 8 frames, no B-frames.
  ffmpeg -v error -y -i "$MASTER" -an -vf "$SEL,scale=960:-2:flags=lanczos" -c:v libx264 -profile:v high \
    -preset slow -crf 27 -pix_fmt yuv420p -g 8 -keyint_min 8 -sc_threshold 0 -bf 0 "${TAGS[@]}" "$OUT/tour-master-mobile.mp4"
  echo "done: tour masters"
fi
