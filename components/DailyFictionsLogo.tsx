/**
 * Logo: simple film clapper (two boards + hinge).
 * Accepts optional roomSlug to change color by genre/room.
 */
import type { RoomSlug } from "@/lib/constants";

/** Clapper color per room: distinct and mood-matched (soft palettes key off these). */
const ROOM_LOGO_CLASS: Record<RoomSlug, string> = {
  comedy: "text-yellow-500 dark:text-yellow-400",       // warm, cheerful gold
  action: "text-orange-500 dark:text-orange-400",        // punchy, high-energy
  horror: "text-red-900 dark:text-red-400",              // dread / cold glow
  drama: "text-violet-600 dark:text-violet-300",        // gravitas, rich
  "sci-fi": "text-cyan-400 dark:text-cyan-300",          // cold, tech, space
  fantasy: "text-fuchsia-500 dark:text-fuchsia-300",    // magical, surreal
  romance: "text-rose-500 dark:text-rose-300",           // tender, warm
  thriller: "text-zinc-500 dark:text-zinc-400",          // noir, tension
  documentary: "text-emerald-600 dark:text-emerald-400", // natural, grounded
  animation: "text-teal-500 dark:text-teal-300",         // playful, clear
  bollywood: "text-amber-500 dark:text-amber-400",       // warm, festive
};

export function DailyFictionsLogo({
  roomSlug,
  className = "",
}: {
  roomSlug?: RoomSlug | null;
  className?: string;
}) {
  const colorClass =
    roomSlug ? ROOM_LOGO_CLASS[roomSlug] : "text-orange-600 dark:text-orange-400";
  return (
    <svg
      viewBox="0 0 32 28"
      width="32"
      height="28"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`size-10 shrink-0 ${colorClass} ${className}`.trim()}
      aria-hidden
    >
      {/* Top stick (striker) */}
      <rect
        x="2"
        y="4"
        width="28"
        height="5"
        rx="0.5"
        fill="currentColor"
        fillOpacity="0.9"
      />
      {/* Bottom board (clapper board) */}
      <rect
        x="2"
        y="12"
        width="28"
        height="14"
        rx="1"
        fill="currentColor"
        fillOpacity="0.95"
      />
      {/* Slate area (lighter rectangle in center of bottom board) */}
      <rect
        x="6"
        y="14"
        width="20"
        height="10"
        rx="0.5"
        fill="currentColor"
        fillOpacity="0.25"
      />
      {/* Hinge */}
      <circle cx="6" cy="10" r="1.5" fill="currentColor" />
    </svg>
  );
}
