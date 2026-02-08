# Room styles: palette and energy

Each room has a distinct look so the genre feels recognizable. Here are **alternative ways** to make palettes match the energy of the genre:

## 1. **Refined solid palettes (current approach, tuned)**

Keep one background + text color per room but choose hues that match the genre’s energy:

- **Comedy:** Warm, soft (amber/yellow) — already in place.
- **Action:** Cool, sharp (slate/blue-grey) — high contrast.
- **Horror:** Deep red/black, low saturation.
- **Drama:** Rich purple/violet for weight.
- **Sci‑Fi:** Cold, spacious (sky/cyan).
- **Fantasy:** Bold, surreal (fuchsia/magenta).
- **Romance:** Warm red/pink, not too dark.
- **Thriller:** Neutral, tense (stone/zinc).
- **Documentary:** Natural, grounded (emerald/green).
- **Animation:** Playful, clear (teal/cyan).

You can tweak these in `lib/room-themes.ts` (e.g. stronger contrast, different shades).

## 2. **Gradient overlays**

Add a subtle gradient per room (e.g. `bg-gradient-to-br from-{color}-500/10 to-transparent`) so the background has a bit of direction and mood without changing the base palette. Implement in the room page wrapper or in `ROOM_THEMES` by adding a gradient class.

## 3. **Accent borders and CTAs**

Keep the same background but give each room a **strong accent** for borders, buttons, and links (e.g. Comedy = amber border, Horror = rose border). The “Tonight’s pick” and “We’re watching this” buttons already use amber; you could drive that from `ROOM_THEMES` so each room has its own CTA color.

## 4. **Background texture or pattern**

Use a very subtle CSS pattern or texture (e.g. film grain, dots, or stripes) via `background-image` and a per-room tint. Light and dark variants can use the same pattern with different opacities.

## 5. **Typography per room**

Use a different font or weight per room (e.g. Fantasy = slightly more decorative, Documentary = cleaner sans). Requires a small set of font classes or CSS variables in `globals.css` and mapping each room to a class.

---

**Current implementation:** Option 1 (refined solid palettes) in `lib/room-themes.ts`. You can mix in 2–3 (gradient + accent) for more energy without much complexity.
