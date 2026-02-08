"use client";

import { useState } from "react";
import Link from "next/link";

interface Room {
  slug: string;
  name: string;
}

interface ProposeFilmBlockProps {
  movieId: number;
  rooms: Room[];
}

export function ProposeFilmBlock({ movieId, rooms }: ProposeFilmBlockProps) {
  const [slug, setSlug] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function propose() {
    if (!slug) return;
    setError(null);
    setSuccess(null);
    setLoading(true);
    try {
      const res = await fetch(`/api/rooms/${slug}/proposals`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tmdb_movie_id: movieId }),
      });
      if (res.ok) {
        const room = rooms.find((r) => r.slug === slug);
        setSuccess(room?.name ?? slug);
      } else {
        const data = await res.json().catch(() => ({}));
        setError(data?.error ?? `Request failed (${res.status})`);
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="mt-10 rounded-lg border border-neutral-200 bg-white p-4 dark:border-neutral-700 dark:bg-neutral-900/50">
      <h2 className="text-lg font-medium">Propose this film</h2>
      <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
        Add this film to a room poll so others can upvote it.
      </p>
      <div className="mt-3 flex flex-wrap items-center gap-2">
        <select
          value={slug}
          onChange={(e) => setSlug(e.target.value)}
          className="rounded border border-neutral-300 bg-white px-3 py-2 text-sm dark:border-neutral-600 dark:bg-neutral-800 dark:text-white"
          aria-label="Choose room"
        >
          <option value="">Choose a room…</option>
          {rooms.map((r) => (
            <option key={r.slug} value={r.slug}>
              {r.name}
            </option>
          ))}
        </select>
        <button
          type="button"
          onClick={propose}
          disabled={loading || !slug}
          className="rounded bg-neutral-800 px-3 py-2 text-sm font-medium text-white hover:bg-neutral-700 dark:bg-neutral-200 dark:text-neutral-900 dark:hover:bg-neutral-300 disabled:opacity-50"
        >
          {loading ? "…" : "Propose"}
        </button>
      </div>
      {success && (
        <p className="mt-2 text-sm text-green-700 dark:text-green-400">
          Proposed in <Link href={`/rooms/${slug}`} className="underline font-medium">{success}</Link>. It will appear in the room poll.
        </p>
      )}
      {error && (
        <p className="mt-2 text-sm text-red-700 dark:text-red-400">{error}</p>
      )}
    </section>
  );
}
