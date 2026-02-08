/**
 * Logo: simple film clapper (two boards + hinge).
 * Accepts optional roomSlug to change color by genre/room.
 */
import type { RoomSlug } from "@/lib/constants";

const ROOM_LOGO_CLASS: Record<RoomSlug, string> = {
  comedy: "text-amber-600 dark:text-amber-400",
  action: "text-slate-600 dark:text-slate-400",
  horror: "text-rose-600 dark:text-rose-400",
  drama: "text-violet-600 dark:text-violet-400",
  "sci-fi": "text-sky-600 dark:text-sky-400",
  fantasy: "text-fuchsia-600 dark:text-fuchsia-400",
  romance: "text-red-600 dark:text-red-400",
  thriller: "text-stone-600 dark:text-stone-400",
  documentary: "text-emerald-600 dark:text-emerald-400",
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
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`${colorClass} ${className}`.trim()}
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
