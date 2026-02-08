import { convertToModelMessages, streamText, stepCountIs, type UIMessage } from "ai";
import { z } from "zod";
import { runDiscoverSearch } from "@/lib/discover-search";
import { getChatPersona, getDefaultPersona } from "@/lib/chat-personas";
import { createProposal } from "@/lib/polls";
import { isRoomSlug, ROOM_SLUGS } from "@/lib/constants";

// Mistral via Vercel AI Gateway. Options: mistral/devstral-2 | mistral/devstral-small-2
const DISCOVER_CHAT_MODEL = "mistral/devstral-2";
const VALID_ROOMS = ROOM_SLUGS.join(", ");

export const maxDuration = 30;

export async function POST(req: Request) {
  if (!process.env.AI_GATEWAY_API_KEY) {
    return new Response(
      JSON.stringify({ error: "Chat unavailable. Set AI_GATEWAY_API_KEY." }),
      { status: 503, headers: { "Content-Type": "application/json" } }
    );
  }

  let body: { messages: UIMessage[]; personaId?: string };
  try {
    body = await req.json();
  } catch {
    return new Response(JSON.stringify({ error: "Invalid JSON body" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const { messages, personaId } = body;
  if (!Array.isArray(messages)) {
    return new Response(JSON.stringify({ error: "messages required" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const persona = personaId ? getChatPersona(personaId) : getDefaultPersona();
  const systemPrompt = `${persona?.systemPrompt ?? "You help users find films."}

You have two tools:
1. search_movies: use when the user wants film suggestions. Call it with a short query (e.g. "time travel", "noir Tokyo", "feel-good 90s"). Then recommend one or two titles from the results in your character's voice.
2. add_film_to_room: use when the user says they want to add a film to a room (e.g. "yes add it", "add to comedy"). You must have already suggested a film, a room, a pitch, and optionally a trailer link. Call this tool with that film and room to add it.

After suggesting a film from search_movies:
- Suggest the best room (genre) for it. Valid room slugs: ${VALID_ROOMS}. Use exactly one of these.
- Suggest a one-line pitch (why it fits the room).
- If you know a trailer URL (e.g. YouTube), suggest it; otherwise say they can search "[Film title] trailer".
- Ask: "Want to add this to [Room name]? I can add it for you."
When the user agrees, call add_film_to_room with room_slug (one of the valid slugs), tmdb_movie_id (the film's ID from your search results), pitch, and trailer_url if you suggested one.`;

  const result = streamText({
    model: DISCOVER_CHAT_MODEL,
    system: systemPrompt,
    messages: await convertToModelMessages(messages),
    tools: {
      search_movies: {
        description: "Search for movies by theme, mood, or keywords. Returns matching films with id, title, year.",
        inputSchema: z.object({
          query: z.string().describe("Search query: theme, mood, or keywords"),
        }),
        execute: async ({ query }) => {
          const movies = await runDiscoverSearch(query, { limit: 12 });
          return {
            query,
            count: movies.length,
            movies: movies.map((m) => ({
              id: m.id,
              title: m.title,
              year: m.releaseDate ? m.releaseDate.slice(0, 4) : "",
            })),
          };
        },
      },
      add_film_to_room: {
        description: "Add a film as a proposal to a room. Call when the user agrees to add a film you suggested.",
        inputSchema: z.object({
          room_slug: z.string().describe(`One of: ${VALID_ROOMS}`),
          tmdb_movie_id: z.number().describe("TMDB movie ID from search_movies results"),
          pitch: z.string().optional().describe("Short pitch for the room"),
          trailer_url: z.string().url().optional().describe("Trailer URL if available"),
        }),
        execute: async ({ room_slug, tmdb_movie_id, pitch, trailer_url }) => {
          if (!isRoomSlug(room_slug)) {
            return { success: false, error: `Invalid room. Use one of: ${VALID_ROOMS}` };
          }
          try {
            const proposal = await createProposal(room_slug, tmdb_movie_id, { pitch, trailer_url });
            return { success: true, room_slug, proposal_id: proposal.id, message: `Added to ${room_slug}.` };
          } catch (err) {
            const message = err instanceof Error ? err.message : "Failed to add proposal";
            return { success: false, error: message };
          }
        },
      },
    },
    stopWhen: stepCountIs(5),
  });

  return result.toUIMessageStreamResponse();
}
