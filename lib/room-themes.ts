import type { RoomSlug } from "./constants";

/** Accent classes for "Tonight's pick" section and CTA, aligned to clapper hue. */
export type RoomAccent = {
  pickSection: string;
  pickHeading: string;
  pickTitle: string;
  ctaButton: string;
};

/**
 * Per-room soft palette: background + text (light/dark) and accent for pick/CTA.
 * Tuned to match clapper mood; Comedy-style soft look applied to all rooms.
 */
export const ROOM_THEMES: Record<
  RoomSlug,
  { light: string; dark: string; accent: RoomAccent }
> = {
  comedy: {
    light: "bg-amber-50 text-amber-950",
    dark: "dark:bg-amber-950/40 dark:text-amber-100",
    accent: {
      pickSection: "border-amber-500/50 bg-amber-50/50 dark:border-amber-400/30 dark:bg-amber-950/30",
      pickHeading: "text-amber-800 dark:text-amber-200",
      pickTitle: "text-amber-900 dark:text-amber-100",
      ctaButton: "bg-amber-600 text-white shadow-sm transition hover:bg-amber-500 dark:bg-amber-500 dark:hover:bg-amber-400",
    },
  },
  action: {
    light: "bg-orange-50 text-orange-950",
    dark: "dark:bg-orange-950/40 dark:text-orange-100",
    accent: {
      pickSection: "border-orange-500/50 bg-orange-50/50 dark:border-orange-400/30 dark:bg-orange-950/30",
      pickHeading: "text-orange-800 dark:text-orange-200",
      pickTitle: "text-orange-900 dark:text-orange-100",
      ctaButton: "bg-orange-600 text-white shadow-sm transition hover:bg-orange-500 dark:bg-orange-500 dark:hover:bg-orange-400",
    },
  },
  horror: {
    light: "bg-red-50/80 text-red-950",
    dark: "dark:bg-red-950/50 dark:text-red-100",
    accent: {
      pickSection: "border-red-700/50 bg-red-50/50 dark:border-red-500/30 dark:bg-red-950/30",
      pickHeading: "text-red-800 dark:text-red-200",
      pickTitle: "text-red-900 dark:text-red-100",
      ctaButton: "bg-red-700 text-white shadow-sm transition hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-500",
    },
  },
  drama: {
    light: "bg-violet-50 text-violet-950",
    dark: "dark:bg-violet-950/40 dark:text-violet-100",
    accent: {
      pickSection: "border-violet-500/50 bg-violet-50/50 dark:border-violet-400/30 dark:bg-violet-950/30",
      pickHeading: "text-violet-800 dark:text-violet-200",
      pickTitle: "text-violet-900 dark:text-violet-100",
      ctaButton: "bg-violet-600 text-white shadow-sm transition hover:bg-violet-500 dark:bg-violet-500 dark:hover:bg-violet-400",
    },
  },
  "sci-fi": {
    light: "bg-sky-50 text-sky-950",
    dark: "dark:bg-sky-950/50 dark:text-sky-100",
    accent: {
      pickSection: "border-cyan-500/50 bg-cyan-50/50 dark:border-cyan-400/30 dark:bg-cyan-950/30",
      pickHeading: "text-cyan-800 dark:text-cyan-200",
      pickTitle: "text-cyan-900 dark:text-cyan-100",
      ctaButton: "bg-cyan-600 text-white shadow-sm transition hover:bg-cyan-500 dark:bg-cyan-500 dark:hover:bg-cyan-400",
    },
  },
  fantasy: {
    light: "bg-fuchsia-50 text-fuchsia-950",
    dark: "dark:bg-fuchsia-950/50 dark:text-fuchsia-100",
    accent: {
      pickSection: "border-fuchsia-500/50 bg-fuchsia-50/50 dark:border-fuchsia-400/30 dark:bg-fuchsia-950/30",
      pickHeading: "text-fuchsia-800 dark:text-fuchsia-200",
      pickTitle: "text-fuchsia-900 dark:text-fuchsia-100",
      ctaButton: "bg-fuchsia-600 text-white shadow-sm transition hover:bg-fuchsia-500 dark:bg-fuchsia-500 dark:hover:bg-fuchsia-400",
    },
  },
  romance: {
    light: "bg-rose-50 text-rose-950",
    dark: "dark:bg-rose-950/40 dark:text-rose-100",
    accent: {
      pickSection: "border-rose-500/50 bg-rose-50/50 dark:border-rose-400/30 dark:bg-rose-950/30",
      pickHeading: "text-rose-800 dark:text-rose-200",
      pickTitle: "text-rose-900 dark:text-rose-100",
      ctaButton: "bg-rose-600 text-white shadow-sm transition hover:bg-rose-500 dark:bg-rose-500 dark:hover:bg-rose-400",
    },
  },
  thriller: {
    light: "bg-zinc-100 text-zinc-900",
    dark: "dark:bg-zinc-950/60 dark:text-zinc-100",
    accent: {
      pickSection: "border-zinc-500/50 bg-zinc-100/80 dark:border-zinc-400/30 dark:bg-zinc-900/30",
      pickHeading: "text-zinc-700 dark:text-zinc-200",
      pickTitle: "text-zinc-900 dark:text-zinc-100",
      ctaButton: "bg-zinc-600 text-white shadow-sm transition hover:bg-zinc-500 dark:bg-zinc-500 dark:hover:bg-zinc-400",
    },
  },
  documentary: {
    light: "bg-emerald-50 text-emerald-950",
    dark: "dark:bg-emerald-950/40 dark:text-emerald-100",
    accent: {
      pickSection: "border-emerald-500/50 bg-emerald-50/50 dark:border-emerald-400/30 dark:bg-emerald-950/30",
      pickHeading: "text-emerald-800 dark:text-emerald-200",
      pickTitle: "text-emerald-900 dark:text-emerald-100",
      ctaButton: "bg-emerald-600 text-white shadow-sm transition hover:bg-emerald-500 dark:bg-emerald-500 dark:hover:bg-emerald-400",
    },
  },
  animation: {
    light: "bg-teal-50 text-teal-950",
    dark: "dark:bg-teal-950/40 dark:text-teal-100",
    accent: {
      pickSection: "border-teal-500/50 bg-teal-50/50 dark:border-teal-400/30 dark:bg-teal-950/30",
      pickHeading: "text-teal-800 dark:text-teal-200",
      pickTitle: "text-teal-900 dark:text-teal-100",
      ctaButton: "bg-teal-600 text-white shadow-sm transition hover:bg-teal-500 dark:bg-teal-500 dark:hover:bg-teal-400",
    },
  },
  bollywood: {
    light: "bg-yellow-50 text-yellow-950",
    dark: "dark:bg-yellow-950/40 dark:text-yellow-100",
    accent: {
      pickSection: "border-yellow-500/50 bg-yellow-50/50 dark:border-yellow-400/30 dark:bg-yellow-950/30",
      pickHeading: "text-yellow-800 dark:text-yellow-200",
      pickTitle: "text-yellow-900 dark:text-yellow-100",
      ctaButton: "bg-yellow-600 text-white shadow-sm transition hover:bg-yellow-500 dark:bg-yellow-500 dark:hover:bg-yellow-400",
    },
  },
};
