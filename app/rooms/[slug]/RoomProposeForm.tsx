"use client";

import { useState } from "react";

interface RoomProposeFormProps {
  slug: string;
}

interface SearchResult {
  id: number;
  title: string;
  posterUrl: string;
  releaseDate: string;
}

export function RoomProposeForm({ slug }: RoomProposeFormProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [selected, setSelected] = useState<SearchResult | null>(null);
  const [pitch, setPitch] = useState("");
  const [trailerUrl, setTrailerUrl] = useState("");
  const [discord, setDiscord] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  async function search() {
    if (!query.trim()) return;
    setLoading(true);
    setResults([]);
    setSelected(null);
    try {
      const res = await fetch(`/api/search/movies?q=${encodeURIComponent(query.trim())}`);
      const data = await res.json();
      setResults(data.movies ?? []);
    } finally {
      setLoading(false);
    }
  }

  async function submit() {
    if (!selected) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/rooms/${slug}/proposals`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tmdb_movie_id: selected.id,
          pitch: pitch.trim() || undefined,
          trailer_url: trailerUrl.trim() || undefined,
          discord_username: discord.trim() || undefined,
        }),
      });
      if (res.ok) {
        setSubmitted(true);
        setSelected(null);
        setPitch("");
        setTrailerUrl("");
        setQuery("");
        setResults([]);
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="mt-8 rounded-lg border border-neutral-200/80 bg-white/30 p-4 dark:border-neutral-700/80 dark:bg-black/20">
      <h2 className="mb-3 text-sm font-medium uppercase tracking-wider opacity-70">
        Propose a film
      </h2>
      {submitted && (
        <p className="mb-2 text-sm text-green-700 dark:text-green-400">Proposal added. It will appear in the poll above.</p>
      )}
      <div className="flex gap-2">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && search()}
          placeholder="Search by title or theme…"
          className="flex-1 rounded border border-neutral-300 bg-white px-3 py-2 text-sm dark:border-neutral-600 dark:bg-neutral-900 dark:text-white"
        />
        <button
          type="button"
          onClick={search}
          disabled={loading}
          className="rounded bg-neutral-800 px-3 py-2 text-sm text-white dark:bg-neutral-200 dark:text-neutral-900 disabled:opacity-50"
        >
          Search
        </button>
      </div>
      {results.length > 0 && (
        <div className="mt-2 max-h-40 overflow-y-auto">
          <p className="mb-1 text-xs opacity-70">Pick one:</p>
          <ul className="space-y-1">
            {results.slice(0, 8).map((m) => (
              <li key={m.id}>
                <button
                  type="button"
                  onClick={() => setSelected(m)}
                  className={`w-full rounded px-2 py-1 text-left text-sm ${selected?.id === m.id ? "bg-black/20 dark:bg-white/20" : "hover:bg-black/10 dark:hover:bg-white/10"}`}
                >
                  {m.title} {m.releaseDate ? `(${String(m.releaseDate).slice(0, 4)})` : ""}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
      {selected && (
        <div className="mt-3 space-y-2 border-t border-neutral-200 pt-3 dark:border-neutral-700">
          <p className="text-sm font-medium">Selected: {selected.title}</p>
          <input
            type="text"
            value={pitch}
            onChange={(e) => setPitch(e.target.value)}
            placeholder="Short pitch (optional)"
            className="w-full rounded border border-neutral-300 bg-white px-3 py-1.5 text-sm dark:border-neutral-600 dark:bg-neutral-900"
          />
          <input
            type="url"
            value={trailerUrl}
            onChange={(e) => setTrailerUrl(e.target.value)}
            placeholder="Trailer link (optional)"
            className="w-full rounded border border-neutral-300 bg-white px-3 py-1.5 text-sm dark:border-neutral-600 dark:bg-neutral-900"
          />
          <input
            type="text"
            value={discord}
            onChange={(e) => setDiscord(e.target.value)}
            placeholder="Discord username (optional)"
            className="w-full rounded border border-neutral-300 bg-white px-3 py-1.5 text-sm dark:border-neutral-600 dark:bg-neutral-900"
          />
          <button
            type="button"
            onClick={submit}
            disabled={loading}
            className="rounded bg-neutral-800 px-3 py-1.5 text-sm text-white dark:bg-neutral-200 dark:text-neutral-900 disabled:opacity-50"
          >
            {loading ? "…" : "Propose"}
          </button>
        </div>
      )}
    </section>
  );
}
