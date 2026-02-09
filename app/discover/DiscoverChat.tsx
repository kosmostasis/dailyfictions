"use client";

import { useChat, type UIMessage } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { useMemo, useRef, useState } from "react";
import Link from "next/link";
import { CHAT_PERSONAS, getDefaultPersona } from "@/lib/chat-personas";

function MessageParts({ message }: { message: UIMessage }) {
  return (
    <div className="space-y-2">
      {message.parts?.map((part, i) => {
        if (part.type === "text") {
          return (
            <p key={`${message.id}-${i}`} className="whitespace-pre-wrap text-sm">
              {part.text}
            </p>
          );
        }
        if (part.type === "tool-search_movies" && "result" in part && part.result) {
          const result = part.result as {
            query?: string;
            movies?: { id: number; title: string; year: string }[];
          };
          const movies = result.movies ?? [];
          if (movies.length === 0) return null;
          return (
            <div key={`${message.id}-${i}`} className="mt-2 flex flex-wrap gap-2">
              {movies.map((m) => (
                <Link
                  key={m.id}
                  href={`/movie/${m.id}`}
                  className="rounded border border-neutral-200 bg-white px-2 py-1 text-xs font-medium text-neutral-700 transition hover:bg-neutral-50 dark:border-neutral-600 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-700"
                >
                  {m.title}
                  {m.year ? ` (${m.year})` : ""}
                </Link>
              ))}
            </div>
          );
        }
        if (part.type === "tool-add_film_to_room" && "result" in part && part.result) {
          const result = part.result as { success?: boolean; room_slug?: string; error?: string; message?: string };
          if (result.success && result.room_slug) {
            return (
              <p key={`${message.id}-${i}`} className="mt-2 text-sm text-emerald-600 dark:text-emerald-400">
                {result.message ?? "Added."}{" "}
                <Link href={`/rooms/${result.room_slug}`} className="underline">
                  View room →
                </Link>
              </p>
            );
          }
          return (
            <p key={`${message.id}-${i}`} className="mt-2 text-sm text-amber-600 dark:text-amber-400">
              {result.error ?? "Could not add."}
            </p>
          );
        }
        return null;
      })}
    </div>
  );
}

export function DiscoverChat() {
  const [personaId, setPersonaId] = useState(getDefaultPersona().id);
  const personaIdRef = useRef(personaId);
  personaIdRef.current = personaId;

  const transport = useMemo(
    () =>
      new DefaultChatTransport({
        api: "/api/chat",
        prepareSendMessagesRequest: (opts) => ({
          ...opts,
          body: {
            ...opts.body,
            id: opts.id,
            messages: opts.messages,
            trigger: opts.trigger,
            messageId: opts.messageId,
            personaId: personaIdRef.current,
          },
        }),
      }),
    []
  );

  const { messages, sendMessage, status, error, clearError } = useChat({ transport });
  const [input, setInput] = useState("");

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <h1 className="text-2xl font-medium tracking-tight">Discover Films with</h1>
        <select
          value={personaId}
          onChange={(e) => setPersonaId(e.target.value)}
          className="rounded-lg border border-neutral-300 bg-white px-3 py-1.5 text-sm dark:border-neutral-600 dark:bg-neutral-800 dark:text-neutral-100"
        >
          {CHAT_PERSONAS.map((p) => (
            <option key={p.id} value={p.id}>
              {p.shortLabel}
            </option>
          ))}
        </select>
      </div>
      <p className="mb-4 text-sm text-neutral-500 dark:text-neutral-400">
        Chat to find films. The assistant will suggest a room, pitch, and trailer—then ask if you want to add it to that room.
      </p>

      {error && (
        <div className="mb-4 flex items-center justify-between rounded-lg border border-amber-200 bg-amber-50 px-4 py-2 text-sm text-amber-800 dark:border-amber-800 dark:bg-amber-950/40 dark:text-amber-200">
          <span>{error.message}</span>
          <button type="button" onClick={clearError} className="underline">
            Dismiss
          </button>
        </div>
      )}

      <div className="min-h-[360px] space-y-4 rounded-xl border border-neutral-200 bg-white/80 p-4 dark:border-neutral-700 dark:bg-neutral-900/50">
        <div className="max-h-[420px] space-y-4 overflow-y-auto">
          {messages.length === 0 && (
            <p className="text-sm text-neutral-500 dark:text-neutral-400">
              Try: &ldquo;Something melancholic and beautiful&rdquo; or &ldquo;A movie about time travel.&rdquo;
            </p>
          )}
          {messages.map((message) => (
            <div
              key={message.id}
              className={
                message.role === "user"
                  ? "ml-0 mr-8 rounded-lg bg-neutral-200/80 px-3 py-2 dark:bg-neutral-700/60"
                  : "mr-0 ml-8 rounded-lg bg-white px-3 py-2 shadow-sm dark:bg-neutral-800/80"
              }
            >
              <span className="mb-1 block text-xs font-medium opacity-70">
                {message.role === "user" ? "You" : "Assistant"}
              </span>
              <MessageParts message={message} />
            </div>
          ))}
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (input.trim() && status === "ready") {
              sendMessage({ text: input.trim() });
              setInput("");
            }
          }}
          className="flex gap-2"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask for a film…"
            disabled={status !== "ready"}
            className="flex-1 rounded-lg border border-neutral-300 bg-white px-4 py-2.5 text-sm placeholder:text-neutral-400 focus:border-neutral-500 focus:outline-none focus:ring-1 focus:ring-neutral-500 disabled:opacity-50 dark:border-neutral-600 dark:bg-neutral-900 dark:text-neutral-100"
          />
          <button
            type="submit"
            disabled={status !== "ready" || !input.trim()}
            className="rounded-lg bg-neutral-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-neutral-800 disabled:opacity-50 dark:bg-neutral-100 dark:text-neutral-900 dark:hover:bg-neutral-200"
          >
            {status === "streaming" || status === "submitted" ? "…" : "Send"}
          </button>
        </form>
      </div>
    </div>
  );
}
