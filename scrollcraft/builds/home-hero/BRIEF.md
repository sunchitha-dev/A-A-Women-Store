# BRIEF: A & A Women Store — Home Hero

Self-authored under explicit creative delegation. The user supplied the full
direction inline (palette, fonts, assets, headline, badge, CTAs, 4-stage scroll
plan, verification gate) and said: build it, do not interview.

## The eight topics

1. **Vibe (3–5 words):** Neobrutalist fashion zine, Chennai. References given
   implicitly by the palette and sticker set: neobrutalism, sticker-pack
   editorial, e-commerce with attitude.
2. **Scroll journey (user's words):** "Scroll is the timeline. Model rotates
   through the 64 frames as user scrolls. Stickers and props drift at different
   speeds around her. Text is real HTML." Four stages: open, turn, peak (prop
   burst), resolve.
3. **Energy curve:** Calm open → building turn → loud peak (props burst,
   rotation completes) → confident hold. Hero only, so the curve is a single
   arc, not a page-long curve.
4. **Feel + ONE moment:** Playful confidence — "this shop has taste." The one
   moment: her 360 rotation completing while props snap into place around her
   (stage 3, 45–80% — the largest scroll span).
5. **One thing no site does:** A hand-drawn sticker-pack world orbiting a real
   rotating 360° model of the actual store's styling, scrubbed by the wheel.
6. **Premium-minimal distance:** Far. Brutalist/maximalist: hard borders, hard
   shadows, no gradients, no rounded corners (platform ellipse excepted, user
   specified).
7. **One world or distinct scenes:** One continuous pinned hero stage (hero
   only; no page structure to segment yet).
8. **Assets on hand:** 64-frame 360° model rotation (transparent WebP),
   browser-window frame (superseded by CSS per user change), sticker pack
   (starburst, circle-pink, bubble-lilac, arrow, ribbon, sparkle, heart, bolt),
   props (handbag, heels, sunglasses, hanger, scarf, hoodie). Palette + fonts
   specified. No KIE key needed, no generation spend.

## Feeling curve (hero)

| Stage | Emotion | On screen |
|---|---|---|
| 1 Open (0–15%) | At ease | Front-facing model, full headline, stickers at rest |
| 2 Turn (15–45%) | Curiosity | She turns away, headline exits, stickers drift at different speeds |
| 3 Peak (45–80%) | Delight | Rotation completes, props burst and snap in, badge grows |
| 4 Resolve (80–100%) | Confidence | Everything locked, CTA holds, m_064 held forever |

## The peak

Stage 3: "the page where the girl spins around and all the shopping stuff
flies in around her." Largest span (35% of a 350vh pin).

## Tell-someone sentence

"It's the site where scrolling spins the model around and the whole wardrobe
explodes around her."

## Authored silence

Stage 4 (80–100%) is an intentional hold: frame, props and CTA stop changing.
Verification must not read it as dead scroll. This is the only authored silence
in the hero.

## Constraints from the user (verbatim intent)

- CSS browser window, not frame.webp. Lilac interior. CSS platform ellipse.
- No extra shadows on stickers/props; model canvas only gets
  `drop-shadow(6px 6px 0 #0A0A0A)`.
- Preload all 64 frames, LOADING box, never lazy-load mid-scrub.
- Plays once, never loops. Holds on m_064.
- Reduced motion: static m_001, stickers final, no pin.
- Do not touch other files (mount point excepted).
