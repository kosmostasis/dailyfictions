import { NextResponse } from "next/server";
import { listProposals, createProposal, listVotes, hasVoted } from "@/lib/polls";
import { getConfig, getMovieDetails, posterUrl } from "@/lib/tmdb";
import { isRoomSlug } from "@/lib/constants";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  if (!isRoomSlug(slug)) return NextResponse.json({ error: "Unknown room" }, { status: 404 });
  const sessionId = request.headers.get("x-session-id") ?? new URL(request.url).searchParams.get("session_id");
  const proposals = await listProposals(slug);
  const votes = await listVotes();
  const voteCount = (id: string) => votes.filter((v) => v.proposal_id === id).length;
  const [config, ...details] = await Promise.all([
    getConfig(),
    ...proposals.map((p) => getMovieDetails(p.tmdb_movie_id)),
  ]);
  const baseUrl = config.images.secure_base_url;
  const withVotes = await Promise.all(
    proposals.map(async (p, i) => ({
      ...p,
      vote_count: voteCount(p.id),
      has_voted: sessionId ? await hasVoted(p.id, sessionId) : false,
      title: details[i]?.title,
      poster_url: details[i] ? posterUrl(baseUrl, details[i].poster_path) : "",
    }))
  );
  withVotes.sort((a, b) => b.vote_count - a.vote_count);
  return NextResponse.json(withVotes);
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  if (!isRoomSlug(slug)) return NextResponse.json({ error: "Unknown room" }, { status: 404 });
  let body: { tmdb_movie_id: number; pitch?: string; trailer_url?: string; discord_username?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
  const { tmdb_movie_id, pitch, trailer_url, discord_username } = body;
  if (typeof tmdb_movie_id !== "number") {
    return NextResponse.json({ error: "tmdb_movie_id required" }, { status: 400 });
  }
  const proposal = await createProposal(slug, tmdb_movie_id, { pitch, trailer_url, discord_username });
  return NextResponse.json(proposal);
}
