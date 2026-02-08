import { NextResponse } from "next/server";
import {
  getConfig,
  searchMovies,
  searchKeywords,
  discoverMoviesByKeywords,
  posterUrl,
} from "@/lib/tmdb";
import { getKeywordSearchTerms } from "@/lib/search-query";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q") ?? "";
  const page = Math.max(1, parseInt(searchParams.get("page") ?? "1", 10) || 1);

  if (!query.trim()) {
    return NextResponse.json({ baseUrl: "", movies: [] });
  }

  try {
    const config = await getConfig();
    const baseUrl = config.images.secure_base_url;

    const seen = new Set<number>();
    const movies: { id: number; title: string; posterUrl: string; releaseDate: string; overview: string }[] = [];

    const push = (m: { id: number; title: string; poster_path: string | null; release_date?: string; overview?: string }) => {
      if (seen.has(m.id)) return;
      seen.add(m.id);
      movies.push({
        id: m.id,
        title: m.title,
        posterUrl: posterUrl(baseUrl, m.poster_path),
        releaseDate: m.release_date ?? "",
        overview: m.overview?.slice(0, 200) ?? "",
      });
    };

    const titleSearch = await searchMovies(query, page);
    titleSearch.results.forEach(push);

    const keywordTerms = getKeywordSearchTerms(query);
    const allKeywordIds = new Set<number>();
    for (const term of keywordTerms) {
      const keywordResults = await searchKeywords(term);
      keywordResults.forEach((k) => allKeywordIds.add(k.id));
    }
    if (allKeywordIds.size > 0) {
      const byKeyword = await discoverMoviesByKeywords(Array.from(allKeywordIds), 1);
      byKeyword.results.forEach(push);
    }

    const deduped = movies.slice(0, 24);

    return NextResponse.json({
      baseUrl,
      movies: deduped,
      page: titleSearch.page,
      totalPages: titleSearch.total_pages,
    });
  } catch (err) {
    console.error("Search error:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Search failed" },
      { status: 500 }
    );
  }
}
