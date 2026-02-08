"use client";

import { useState } from "react";
import Link from "next/link";
import { ROOMS } from "@/lib/constants";
import { TAGLINE } from "@/lib/quotes";

export function ChooseRealityButton() {
  const [open, setOpen] = useState(false);
  return (
    <div className="mt-2 flex flex-col items-center">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="neon-text rounded px-2 py-1 text-lg font-medium tracking-wide transition hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-neutral-400 focus:ring-offset-2 focus:ring-offset-neutral-50 dark:focus:ring-offset-neutral-950"
        aria-expanded={open}
        aria-haspopup="true"
      >
        {TAGLINE}
      </button>
      {open && (
        <nav
          className="mt-4 flex flex-wrap justify-center gap-2"
          aria-label="Genres"
        >
          {ROOMS.map((room) => (
            <Link
              key={room.slug}
              href={`/rooms/${room.slug}`}
              className="rounded-md border border-neutral-300 bg-white px-3 py-1.5 text-sm text-neutral-700 shadow-sm transition hover:bg-neutral-50 dark:border-neutral-600 dark:bg-neutral-800 dark:text-neutral-200 dark:hover:bg-neutral-700"
              onClick={() => setOpen(false)}
            >
              {room.name}
            </Link>
          ))}
        </nav>
      )}
    </div>
  );
}
