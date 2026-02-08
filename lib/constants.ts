/**
 * Single source of truth for the 10 rooms and director–room pairings.
 * Used across the app for routes, nav, and theming.
 */

export type RoomSlug =
  | "comedy"
  | "action"
  | "horror"
  | "drama"
  | "sci-fi"
  | "fantasy"
  | "romance"
  | "thriller"
  | "documentary"
  | "animation";

export type DirectorKind = "named" | "aesthetic-only";

export interface RoomConfig {
  slug: RoomSlug;
  name: string;
  director: string;
  directorKind: DirectorKind;
  /** Short tagline for UI (director or mood). */
  tagline: string;
}

export const ROOM_SLUGS: RoomSlug[] = [
  "comedy",
  "action",
  "horror",
  "drama",
  "sci-fi",
  "fantasy",
  "romance",
  "thriller",
  "documentary",
  "animation",
];

export const ROOMS: RoomConfig[] = [
  { slug: "comedy", name: "Comedy", director: "Wes Anderson", directorKind: "named", tagline: "Symmetry, pastels, vintage" },
  { slug: "action", name: "Action", director: "—", directorKind: "aesthetic-only", tagline: "Kinetic, bold" },
  { slug: "horror", name: "Horror", director: "—", directorKind: "aesthetic-only", tagline: "Arthouse, shadow" },
  { slug: "drama", name: "Drama", director: "Federico Fellini", directorKind: "named", tagline: "Baroque, dreamlike" },
  { slug: "sci-fi", name: "Sci-Fi", director: "—", directorKind: "aesthetic-only", tagline: "Contemplative, vast" },
  { slug: "fantasy", name: "Fantasy", director: "Alejandro Jodorowsky", directorKind: "named", tagline: "Psychedelic, surreal" },
  { slug: "romance", name: "Romance", director: "Wong Kar-Wai", directorKind: "named", tagline: "Saturated color, neon" },
  { slug: "thriller", name: "Thriller", director: "Paul Thomas Anderson", directorKind: "named", tagline: "Imperfect realism" },
  { slug: "documentary", name: "Documentary", director: "Werner Herzog", directorKind: "named", tagline: "Ecstatic truth" },
  { slug: "animation", name: "Animation", director: "—", directorKind: "aesthetic-only", tagline: "Drawn worlds" },
];

const bySlug = new Map<RoomSlug, RoomConfig>(ROOMS.map((r) => [r.slug, r]));

export function getRoomBySlug(slug: string): RoomConfig | undefined {
  return bySlug.get(slug as RoomSlug);
}

export function isRoomSlug(slug: string): slug is RoomSlug {
  return ROOM_SLUGS.includes(slug as RoomSlug);
}
