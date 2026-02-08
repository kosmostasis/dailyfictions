import { NextResponse } from "next/server";
import { getConfig, getGenreIdForRoom, discoverMoviesByGenre, posterUrl } from "@/lib/tmdb";
import { isRoomSlug } from "@/lib/constants";

export interface RoomMoviesResponse {
  baseUrl: string;
  movies: {
    id: number;
    title: string;
    posterPath: string | null;
    posterUrl: string;
    releaseDate: string;
    overview: string;
  }[];
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  if (!isRoomSlug(slug)) {
    return NextResponse.json({ error: "Unknown room" }, { status: 404 });
  }

  const genreId = getGenreIdForRoom(slug);
  if (genreId == null) {
    return NextResponse.json({ error: "No genre for room" }, { status: 400 });
  }

  try {
    const [config, discover] = await Promise.all([
      getConfig(),
      discoverMoviesByGenre(genreId, 1),
    ]);

    const baseUrl = config.images.secure_base_url;
    const movies: RoomMoviesResponse["movies"] = discover.results.slice(0, 20).map((m) => ({
      id: m.id,
      title: m.title,
      posterPath: m.poster_path,
      posterUrl: posterUrl(baseUrl, m.poster_path),
      releaseDate: m.release_date ?? "",
      overview: m.overview?.slice(0, 200) ?? "",
    }));

    return NextResponse.json({ baseUrl, movies } satisfies RoomMoviesResponse);
  } catch (err) {
    console.error("Room movies error:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to load movies" },
      { status: 500 }
    );
  }
}
