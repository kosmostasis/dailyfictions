import type { RoomSlug } from "./constants";

/**
 * Per-room palette: energy of the genre (light and dark).
 * Option 1: solid backgrounds. See docs/ROOM_STYLES.md for alternatives (gradients, accents, texture).
 */
export const ROOM_THEMES: Record<
  RoomSlug,
  { light: string; dark: string }
> = {
  comedy:
    { light: "bg-amber-50 text-amber-950", dark: "dark:bg-amber-950/40 dark:text-amber-100" },
  action:
    { light: "bg-slate-100 text-slate-900", dark: "dark:bg-slate-950/60 dark:text-slate-100" },
  horror:
    { light: "bg-rose-950/10 text-rose-950", dark: "dark:bg-rose-950/50 dark:text-rose-100" },
  drama:
    { light: "bg-violet-50 text-violet-950", dark: "dark:bg-violet-950/40 dark:text-violet-100" },
  "sci-fi":
    { light: "bg-sky-50 text-sky-950", dark: "dark:bg-sky-950/50 dark:text-sky-100" },
  fantasy:
    { light: "bg-fuchsia-100 text-fuchsia-950", dark: "dark:bg-fuchsia-950/50 dark:text-fuchsia-100" },
  romance:
    { light: "bg-pink-50 text-red-950", dark: "dark:bg-red-950/40 dark:text-red-100" },
  thriller:
    { light: "bg-zinc-100 text-zinc-900", dark: "dark:bg-zinc-950/60 dark:text-zinc-100" },
  documentary:
    { light: "bg-emerald-50 text-emerald-950", dark: "dark:bg-emerald-950/40 dark:text-emerald-100" },
  animation:
    { light: "bg-teal-50 text-teal-950", dark: "dark:bg-teal-950/40 dark:text-teal-100" },
};
