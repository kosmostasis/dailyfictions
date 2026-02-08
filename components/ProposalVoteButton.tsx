"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getOrCreateSessionId } from "@/lib/session";

const SESSION_HEADER = "x-session-id";

interface ProposalVoteButtonProps {
  proposalId: string;
  roomSlug: string;
  voteCount: number;
  className?: string;
}

export function ProposalVoteButton({
  proposalId,
  roomSlug,
  voteCount,
  className = "",
}: ProposalVoteButtonProps) {
  const router = useRouter();
  const [count, setCount] = useState(voteCount);
  const [voted, setVoted] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const sessionId = getOrCreateSessionId();
    if (!sessionId) return;
    fetch(`/api/rooms/${roomSlug}/proposals/${proposalId}/vote`, {
      headers: { [SESSION_HEADER]: sessionId },
    })
      .then((r) => r.json())
      .then((data) => setVoted(data.voted === true))
      .catch(() => setVoted(false));
  }, [roomSlug, proposalId]);

  async function handleClick() {
    setLoading(true);
    const sessionId = getOrCreateSessionId();
    const method = voted ? "DELETE" : "POST";
    const res = await fetch(`/api/rooms/${roomSlug}/proposals/${proposalId}/vote`, {
      method,
      headers: { [SESSION_HEADER]: sessionId },
    });
    if (res.ok) {
      const data = await res.json();
      if (method === "POST" && data.voted) {
        setCount((c) => c + 1);
        setVoted(true);
      } else if (method === "DELETE" && data.removed) {
        setCount((c) => Math.max(0, c - 1));
        setVoted(false);
      }
      router.refresh();
    }
    setLoading(false);
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={loading}
      className={`rounded px-2 py-1 text-sm disabled:opacity-50 ${
        voted
          ? "bg-sky-200 text-sky-800 dark:bg-sky-900/50 dark:text-sky-200 hover:bg-sky-300 dark:hover:bg-sky-800/50"
          : "bg-neutral-200 dark:bg-neutral-700 hover:bg-neutral-300 dark:hover:bg-neutral-600"
      } ${className}`.trim()}
      title={voted ? "Take back your upvote" : "Upvote"}
    >
      ↑ {count}
      {voted ? " ✓" : ""}
    </button>
  );
}
