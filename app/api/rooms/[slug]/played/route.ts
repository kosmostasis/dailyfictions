import { NextResponse } from "next/server";
import { getPlayed } from "@/lib/polls";
import { getConfig, getMovieDetails, posterUrl } from "@/lib/tmdb";
import { isRoomSlug } from "@/lib/constants";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  if (!isRoomSlug(slug)) return NextResponse.json({ error: "Unknown room" }, { status: 404 });
  const played = await getPlayed(slug);
  const limit = 10;
  const slice = played.slice(0, limit);
  if (slice.length === 0) return NextResponse.json([]);
  const [config, ...details] = await Promise.all([
    getConfig(),
    ...slice.map((e) => getMovieDetails(e.tmdb_movie_id)),
  ]);
  const baseUrl = config.images.secure_base_url;
  const list = slice.map((e, i) => ({
    tmdb_movie_id: e.tmdb_movie_id,
    locked_at: e.locked_at,
    title: details[i]?.title,
    poster_url: posterUrl(baseUrl, details[i]?.poster_path ?? null),
  }));
  return NextResponse.json(list);
}
