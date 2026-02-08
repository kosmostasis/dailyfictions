import { NextResponse } from "next/server";
import { addVote, removeVote, getProposal } from "@/lib/polls";
import { isRoomSlug } from "@/lib/constants";

function getSessionId(request: Request): string | null {
  return request.headers.get("x-session-id");
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ slug: string; id: string }> }
) {
  const { slug, id: proposalId } = await params;
  if (!isRoomSlug(slug)) return NextResponse.json({ error: "Unknown room" }, { status: 404 });
  const sessionId = getSessionId(request) ?? new URL(request.url).searchParams.get("session_id");
  if (!sessionId) {
    return NextResponse.json({ error: "Session required (x-session-id or session_id)" }, { status: 400 });
  }
  const proposal = await getProposal(proposalId);
  if (!proposal || proposal.room_slug !== slug) {
    return NextResponse.json({ error: "Proposal not found" }, { status: 404 });
  }
  const added = await addVote(proposalId, sessionId);
  return NextResponse.json({ voted: added });
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ slug: string; id: string }> }
) {
  const { slug, id: proposalId } = await params;
  if (!isRoomSlug(slug)) return NextResponse.json({ error: "Unknown room" }, { status: 404 });
  const sessionId = getSessionId(request) ?? new URL(request.url).searchParams.get("session_id");
  if (!sessionId) return NextResponse.json({ error: "Session required" }, { status: 400 });
  const removed = await removeVote(proposalId, sessionId);
  return NextResponse.json({ removed });
}
