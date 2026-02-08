"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { getOrCreateSessionId } from "@/lib/session";

const SESSION_HEADER = "x-session-id";

interface Proposal {
  id: string;
  room_slug: string;
  tmdb_movie_id: number;
  pitch?: string;
  trailer_url?: string;
  discord_username?: string;
  created_at: string;
  vote_count: number;
  has_voted?: boolean;
  title?: string;
  poster_url?: string;
}

interface RoomPollsProps {
  slug: string;
}

export function RoomPolls({ slug }: RoomPollsProps) {
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [loading, setLoading] = useState(true);
  const [lockLoading, setLockLoading] = useState(false);
  const [shareCopied, setShareCopied] = useState(false);
  const sessionId = typeof window !== "undefined" ? getOrCreateSessionId() : "";

  function fetchProposals() {
    fetch(`/api/rooms/${slug}/proposals`, {
      headers: sessionId ? { [SESSION_HEADER]: sessionId } : {},
    })
      .then((r) => r.json())
      .then(setProposals)
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    fetchProposals();
  }, [slug]);

  async function toggleVote(proposalId: string, currentlyVoted: boolean) {
    const res = await fetch(`/api/rooms/${slug}/proposals/${proposalId}/vote`, {
      method: currentlyVoted ? "DELETE" : "POST",
      headers: { [SESSION_HEADER]: sessionId },
    });
    if (res.ok) fetchProposals();
  }

  async function lockTop() {
    if (proposals.length === 0) return;
    setLockLoading(true);
    const top = proposals[0];
    const res = await fetch(`/api/rooms/${slug}/lock`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ proposal_id: top.id }),
    });
    setLockLoading(false);
    if (res.ok) {
      fetchProposals();
      window.location.reload();
    }
  }

  if (loading) return <p className="text-sm opacity-70">Loading proposals…</p>;

  return (
    <section className="mt-10">
      <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-sm font-medium uppercase tracking-wider opacity-70">
          Room poll — propose & upvote
        </h2>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => {
              const url = typeof window !== "undefined" ? window.location.href : "";
              navigator.clipboard?.writeText(url).then(() => setShareCopied(true));
              setTimeout(() => setShareCopied(false), 2000);
            }}
            className="rounded px-2 py-1 text-xs opacity-80 hover:opacity-100"
          >
            {shareCopied ? "Link copied" : "Share poll (copy link)"}
          </button>
          <button
            type="button"
            onClick={lockTop}
            disabled={lockLoading || proposals.length === 0}
            className="rounded bg-black/20 px-2 py-1 text-xs font-medium dark:bg-white/20 disabled:opacity-50"
          >
            {lockLoading ? "…" : "Lock top as pick"}
          </button>
        </div>
      </div>
      {proposals.length === 0 ? (
        <p className="text-sm opacity-70">No proposals yet. Add one below.</p>
      ) : (
        <ul className="space-y-3">
          {proposals.map((p) => (
            <li
              key={p.id}
              className="flex items-center gap-3 rounded-lg border border-neutral-200/80 bg-white/50 p-2 dark:border-neutral-700/80 dark:bg-black/20"
            >
              <Link href={`/movie/${p.tmdb_movie_id}`} className="shrink-0">
                <div className="h-14 w-10 overflow-hidden rounded bg-neutral-200 dark:bg-neutral-700">
                  {p.poster_url ? (
                    <img src={p.poster_url} alt="" className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex h-full items-center justify-center text-xs opacity-50">—</div>
                  )}
                </div>
              </Link>
              <div className="min-w-0 flex-1">
                <p className="truncate font-medium">{p.title ?? `Movie #${p.tmdb_movie_id}`}</p>
                {p.discord_username && (
                  <p className="text-xs opacity-70">@{p.discord_username}</p>
                )}
                {p.pitch && <p className="truncate text-xs opacity-80">{p.pitch}</p>}
                {p.trailer_url && (
                  <a
                    href={p.trailer_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-0.5 inline-block text-xs text-sky-600 underline dark:text-sky-400"
                  >
                    Trailer
                  </a>
                )}
              </div>
              <button
                type="button"
                onClick={() => toggleVote(p.id, p.has_voted ?? false)}
                title={p.has_voted ? "Take back your upvote" : "Upvote"}
                className={`rounded px-2 py-1 text-sm ${
                  p.has_voted
                    ? "bg-sky-200 text-sky-800 dark:bg-sky-900/50 dark:text-sky-200 hover:bg-sky-300 dark:hover:bg-sky-800/50"
                    : "bg-neutral-200 dark:bg-neutral-700 hover:bg-neutral-300 dark:hover:bg-neutral-600"
                }`}
              >
                ↑ {p.vote_count}
                {p.has_voted ? " ✓" : ""}
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
