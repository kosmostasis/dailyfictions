/**
 * Proposals and votes (file-based MVP).
 * Proposals: room_slug, tmdb_movie_id, pitch?, discord_username?, created_at.
 * Votes: proposal_id + session_id (one vote per session per proposal).
 * Locked: current pick per room. Played: history of picks per room.
 */

import { readFile, writeFile } from "fs/promises";
import path from "path";
import { randomUUID } from "crypto";

const DATA = path.join(process.cwd(), "data");

export interface Proposal {
  id: string;
  room_slug: string;
  tmdb_movie_id: number;
  pitch?: string;
  trailer_url?: string;
  discord_username?: string;
  created_at: string;
}

export interface Vote {
  proposal_id: string;
  session_id: string;
}

export interface LockedPick {
  proposal_id: string;
  tmdb_movie_id: number;
  locked_at: string;
}

export interface PlayedEntry {
  tmdb_movie_id: number;
  locked_at: string;
}

async function readJson<T>(file: string): Promise<T> {
  const p = path.join(DATA, file);
  try {
    const s = await readFile(p, "utf-8");
    return JSON.parse(s) as T;
  } catch {
    return {} as T;
  }
}

async function writeJson(file: string, data: unknown): Promise<void> {
  const p = path.join(DATA, file);
  await writeFile(p, JSON.stringify(data, null, 2), "utf-8");
}

export async function listProposals(roomSlug: string): Promise<Proposal[]> {
  const list = (await readJson<Proposal[]>("proposals.json")) ?? [];
  return list.filter((p) => p.room_slug === roomSlug);
}

export async function createProposal(
  roomSlug: string,
  tmdbMovieId: number,
  opts: { pitch?: string; trailer_url?: string; discord_username?: string } = {}
): Promise<Proposal> {
  const list = (await readJson<Proposal[]>("proposals.json")) ?? [];
  const proposal: Proposal = {
    id: randomUUID(),
    room_slug: roomSlug,
    tmdb_movie_id: tmdbMovieId,
    pitch: opts.pitch,
    trailer_url: opts.trailer_url,
    discord_username: opts.discord_username,
    created_at: new Date().toISOString(),
  };
  list.push(proposal);
  await writeJson("proposals.json", list);
  return proposal;
}

export async function getProposal(id: string): Promise<Proposal | null> {
  const list = (await readJson<Proposal[]>("proposals.json")) ?? [];
  return list.find((p) => p.id === id) ?? null;
}

export async function listVotes(): Promise<Vote[]> {
  return (await readJson<Vote[]>("votes.json")) ?? [];
}

export async function getVoteCount(proposalId: string): Promise<number> {
  const votes = await listVotes();
  return votes.filter((v) => v.proposal_id === proposalId).length;
}

export async function hasVoted(proposalId: string, sessionId: string): Promise<boolean> {
  const votes = (await readJson<Vote[]>("votes.json")) ?? [];
  return votes.some((v) => v.proposal_id === proposalId && v.session_id === sessionId);
}

export async function addVote(proposalId: string, sessionId: string): Promise<boolean> {
  const votes = (await readJson<Vote[]>("votes.json")) ?? [];
  if (votes.some((v) => v.proposal_id === proposalId && v.session_id === sessionId))
    return false;
  votes.push({ proposal_id: proposalId, session_id: sessionId });
  await writeJson("votes.json", votes);
  return true;
}

export async function removeVote(proposalId: string, sessionId: string): Promise<boolean> {
  const votes = (await readJson<Vote[]>("votes.json")) ?? [];
  const prev = votes.length;
  const next = votes.filter(
    (v) => !(v.proposal_id === proposalId && v.session_id === sessionId)
  );
  if (next.length === prev) return false;
  await writeJson("votes.json", next);
  return true;
}

export async function getLocked(roomSlug: string): Promise<LockedPick | null> {
  const locked = (await readJson<Record<string, LockedPick>>("locked.json")) ?? {};
  return locked[roomSlug] ?? null;
}

export async function setLocked(
  roomSlug: string,
  proposalId: string,
  tmdbMovieId: number
): Promise<void> {
  const locked = (await readJson<Record<string, LockedPick>>("locked.json")) ?? {};
  locked[roomSlug] = {
    proposal_id: proposalId,
    tmdb_movie_id: tmdbMovieId,
    locked_at: new Date().toISOString(),
  };
  await writeJson("locked.json", locked);
  const played = (await readJson<Record<string, PlayedEntry[]>>("played.json")) ?? {};
  if (!played[roomSlug]) played[roomSlug] = [];
  played[roomSlug].unshift({
    tmdb_movie_id: tmdbMovieId,
    locked_at: locked[roomSlug].locked_at,
  });
  await writeJson("played.json", played);
}

export async function getPlayed(roomSlug: string): Promise<PlayedEntry[]> {
  const played = (await readJson<Record<string, PlayedEntry[]>>("played.json")) ?? {};
  return played[roomSlug] ?? [];
}
