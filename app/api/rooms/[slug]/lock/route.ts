import { NextResponse } from "next/server";
import { getLocked, setLocked, getProposal } from "@/lib/polls";
import { isRoomSlug } from "@/lib/constants";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  if (!isRoomSlug(slug)) return NextResponse.json({ error: "Unknown room" }, { status: 404 });
  const locked = await getLocked(slug);
  return NextResponse.json(locked ?? {});
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  if (!isRoomSlug(slug)) return NextResponse.json({ error: "Unknown room" }, { status: 404 });
  let body: { proposal_id: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
  const { proposal_id } = body;
  if (!proposal_id) return NextResponse.json({ error: "proposal_id required" }, { status: 400 });
  const proposal = await getProposal(proposal_id);
  if (!proposal || proposal.room_slug !== slug) {
    return NextResponse.json({ error: "Proposal not found" }, { status: 404 });
  }
  await setLocked(slug, proposal_id, proposal.tmdb_movie_id);
  return NextResponse.json({ locked: true });
}
