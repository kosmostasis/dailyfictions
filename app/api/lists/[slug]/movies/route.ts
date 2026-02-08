import { NextResponse } from "next/server";
import { getListMovieIds } from "@/lib/lists";
import { getConfig, getMovieDetails, posterUrl } from "@/lib/tmdb";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const ids = await getListMovieIds(slug);
  if (ids.length === 0) {
    return NextResponse.json({ baseUrl: "", movies: [] });
  }

  const limit = 24;
  const slice = ids.slice(0, limit);

  try {
    const [config, ...details] = await Promise.all([
      getConfig(),
      ...slice.map((id) => getMovieDetails(id)),
    ]);
    const baseUrl = config.images.secure_base_url;
    const movies = details.map((m) => ({
      id: m.id,
      title: m.title,
      posterUrl: posterUrl(baseUrl, m.poster_path),
      releaseDate: m.release_date ?? "",
      overview: m.overview?.slice(0, 200) ?? "",
    }));
    return NextResponse.json({ baseUrl, movies });
  } catch (err) {
    console.error("List movies error:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to load list movies" },
      { status: 500 }
    );
  }
}
