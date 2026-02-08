/**
 * Typographic logo styles for "Daily Fictions Film Club" (director-inspired).
 * Used on homepage (cycle on refresh) and /test.
 */

export const LOGO_STYLES = [
  { className: "logo-anderson", bgClass: "bg-amber-50 dark:bg-amber-950/40" },
  { className: "logo-wong", bgClass: "bg-neutral-900" },
  { className: "logo-jodorowsky", bgClass: "bg-fuchsia-950" },
  { className: "logo-fellini", bgClass: "bg-violet-100 dark:bg-violet-950/50" },
  { className: "logo-pta", bgClass: "bg-neutral-950" },
  { className: "logo-herzog", bgClass: "bg-stone-800" },
  { className: "logo-marquee", bgClass: "bg-neutral-100 dark:bg-neutral-900" },
] as const;

export function getRandomLogoStyle() {
  const index = Math.floor(Math.random() * LOGO_STYLES.length);
  return LOGO_STYLES[index];
}
