import type { RoomSlug } from "@/lib/constants";

const SIZE = 40;
const VIEW = 24;

export function GenreIcon({ slug, className = "" }: { slug: RoomSlug; className?: string }) {
  return (
    <span
      className={`inline-flex items-center justify-center ${className}`}
      aria-hidden
      title={slug}
    >
      <svg
        viewBox={`0 0 ${VIEW} ${VIEW}`}
        width={SIZE}
        height={SIZE}
        fill="currentColor"
        className="shrink-0"
      >
        {ICONS[slug]}
      </svg>
    </span>
  );
}

/** Per-genre movie-character style icons (simple SVG paths) */
const ICONS: Record<RoomSlug, React.ReactNode> = {
  comedy: (
    <>
      {/* Comedy mask (smiling) */}
      <ellipse cx="12" cy="14" rx="8" ry="7" fill="none" stroke="currentColor" strokeWidth="1.2" />
      <path d="M6 12 Q12 16 18 12" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
      <circle cx="9" cy="11" r="1.2" />
      <circle cx="15" cy="11" r="1.2" />
    </>
  ),
  action: (
    <>
      {/* Running figure / burst */}
      <circle cx="12" cy="8" r="3" fill="none" stroke="currentColor" strokeWidth="1.2" />
      <path d="M12 11 v6 l3 -2.5" stroke="currentColor" strokeWidth="1.2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M12 17 l-2.5 -1.5" stroke="currentColor" strokeWidth="1.2" fill="none" strokeLinecap="round" />
      <path d="M14 14 l4 2" stroke="currentColor" strokeWidth="1" fill="none" strokeLinecap="round" opacity="0.8" />
    </>
  ),
  horror: (
    <>
      {/* Ghost outline */}
      <path d="M12 4 a6 6 0 0 1 6 6 v4 l-2 3 h-2 l-2 -2 -2 2 h-2 l-2 -3 v-4 a6 6 0 0 1 6 -6 z" fill="none" stroke="currentColor" strokeWidth="1.2" />
      <circle cx="9" cy="11" r="1" fill="currentColor" />
      <circle cx="15" cy="11" r="1" fill="currentColor" />
    </>
  ),
  drama: (
    <>
      {/* Tragedy mask / spotlight */}
      <ellipse cx="12" cy="13" rx="7" ry="6" fill="none" stroke="currentColor" strokeWidth="1.2" />
      <path d="M7 10 Q12 7 17 10" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
      <circle cx="9" cy="12" r="1" />
      <circle cx="15" cy="12" r="1" />
      <path d="M12 4 v3 M12 4 l-2 2 M12 4 l2 2" stroke="currentColor" strokeWidth="1" fill="none" strokeLinecap="round" />
    </>
  ),
  "sci-fi": (
    <>
      {/* Astronaut helmet / orb */}
      <circle cx="12" cy="12" r="7" fill="none" stroke="currentColor" strokeWidth="1.2" />
      <ellipse cx="12" cy="12" rx="4" ry="3" fill="none" stroke="currentColor" strokeWidth="0.8" opacity="0.7" />
      <path d="M8 8 L6 6 M16 8 L18 6 M8 16 L6 18 M16 16 L18 18" stroke="currentColor" strokeWidth="0.8" strokeLinecap="round" opacity="0.6" />
    </>
  ),
  fantasy: (
    <>
      {/* Wizard hat / star */}
      <path d="M12 3 L14 9 L20 9 L15 13 L17 19 L12 15 L7 19 L9 13 L4 9 L10 9 Z" fill="currentColor" />
    </>
  ),
  romance: (
    <>
      {/* Heart */}
      <path d="M12 19 C12 19 4 13 4 8 C4 5 6 4 8 4 C10 4 12 6 12 6 C12 6 14 4 16 4 C18 4 20 5 20 8 C20 13 12 19 12 19 Z" fill="currentColor" />
    </>
  ),
  thriller: (
    <>
      {/* Detective silhouette / shadow figure */}
      <circle cx="12" cy="7" r="3.5" fill="none" stroke="currentColor" strokeWidth="1.2" />
      <path d="M8 11 L8 18 M16 11 L16 18 M8 14 L16 14" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
      <path d="M12 11 L12 13" stroke="currentColor" strokeWidth="1.2" />
      <ellipse cx="12" cy="20" rx="5" ry="1.5" fill="currentColor" opacity="0.6" />
    </>
  ),
  documentary: (
    <>
      {/* Film camera */}
      <rect x="4" y="6" width="14" height="10" rx="1.5" fill="none" stroke="currentColor" strokeWidth="1.2" />
      <circle cx="12" cy="11" r="3" fill="none" stroke="currentColor" strokeWidth="1" />
      <rect x="6" y="8" width="2" height="2" rx="0.3" fill="currentColor" opacity="0.5" />
      <rect x="14" y="8" width="2" height="2" rx="0.3" fill="currentColor" opacity="0.5" />
      <path d="M8 16 L10 18 L16 18 L18 16" stroke="currentColor" strokeWidth="1" fill="none" strokeLinecap="round" />
    </>
  ),
  animation: (
    <>
      {/* Pencil / drawn star */}
      <path d="M5 19 L6 14 L10 18 Z" fill="currentColor" opacity="0.85" />
      <path d="M6 14 L14 6 L18 10 L10 18 Z" fill="currentColor" />
      <circle cx="16" cy="5" r="1" fill="currentColor" opacity="0.9" />
    </>
  ),
};
