"use client";

import { useRouter } from "next/navigation";
import { ROOMS } from "@/lib/constants";
import type { RoomSlug } from "@/lib/constants";

export function RoomGenreDropdown({ currentSlug }: { currentSlug: RoomSlug }) {
  const router = useRouter();

  function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const slug = e.target.value as RoomSlug;
    if (slug !== currentSlug) router.push(`/rooms/${slug}`);
  }

  return (
    <select
      value={currentSlug}
      onChange={handleChange}
      aria-label="Jump to genre"
      className="rounded-md border border-neutral-300 bg-white/90 px-3 py-1.5 text-sm font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-neutral-400 dark:border-neutral-600 dark:bg-neutral-800/90 dark:text-neutral-100"
    >
      {ROOMS.map((room) => (
        <option key={room.slug} value={room.slug}>
          {room.name}
        </option>
      ))}
    </select>
  );
}
