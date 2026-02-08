"use client";

import { useState } from "react";
import Link from "next/link";

interface MovieResult {
  id: number;
  title: string;
  posterUrl: string;
  releaseDate: string;
}

export function DiscoverForm() {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [movies, setMovies] = useState<MovieResult[]>([]);
  const [searched, setSearched] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!query.trim()) return;
    setLoading(true);
    setSearched(true);
    setMovies([]);
    try {
      const res = await fetch(
        `/api/search/movies?q=${encodeURIComponent(query.trim())}`
      );
      const data = await res.json();
      if (data.movies) setMovies(data.movies);
    } catch {
      setMovies([]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <form onSubmit={handleSubmit} className="mt-6">
        <div className="flex gap-2">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="…makes me happy yet sad, …is about time travel, …set in Asia"
            className="flex-1 rounded-lg border border-neutral-300 bg-white px-4 py-2.5 text-neutral-900 placeholder:text-neutral-400 focus:border-neutral-500 focus:outline-none focus:ring-1 focus:ring-neutral-500 dark:border-neutral-600 dark:bg-neutral-900 dark:text-neutral-100 dark:placeholder:text-neutral-500"
            disabled={loading}
          />
          <button
            type="submit"
            disabled={loading}
            className="rounded-lg bg-neutral-900 px-4 py-2.5 font-medium text-white hover:bg-neutral-800 disabled:opacity-50 dark:bg-neutral-100 dark:text-neutral-900 dark:hover:bg-neutral-200"
          >
            {loading ? "…" : "Search"}
          </button>
        </div>
      </form>

      {searched && (
        <section className="mt-10">
          {loading ? (
            <p className="text-sm text-neutral-500">Searching…</p>
          ) : movies.length > 0 ? (
            <>
              <h2 className="mb-4 text-sm font-medium uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                Results
              </h2>
              <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
                {movies.map((m) => (
                  <li key={m.id}>
                    <Link
                      href={`/movie/${m.id}`}
                      className="block overflow-hidden rounded-lg border border-neutral-200/80 bg-white/50 shadow-sm transition hover:shadow dark:border-neutral-700/80 dark:bg-black/20"
                    >
                      <div className="aspect-[2/3] w-full overflow-hidden bg-neutral-200 dark:bg-neutral-800">
                        {m.posterUrl ? (
                          <img
                            src={m.posterUrl}
                            alt=""
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="flex h-full items-center justify-center text-xs opacity-50">
                            No poster
                          </div>
                        )}
                      </div>
                      <div className="p-2">
                        <p className="truncate text-sm font-medium">{m.title}</p>
                        {m.releaseDate && (
                          <p className="text-xs opacity-70">
                            {String(m.releaseDate).slice(0, 4)}
                          </p>
                        )}
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            </>
          ) : (
            <p className="text-sm text-neutral-500 dark:text-neutral-400">
              No results. Try another phrase.
            </p>
          )}
        </section>
      )}
    </>
  );
}
