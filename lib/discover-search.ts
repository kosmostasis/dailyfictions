/**
 * Server-only: run Discover-style movie search (title + keywords).
 * Used by the chat search_movies tool.
 */

import {
  getConfig,
  searchMovies,
  searchKeywords,
  discoverMoviesByKeywords,
  posterUrl,
} from "@/lib/tmdb";
import { getKeywordSearchTerms } from "@/lib/search-query";

export interface DiscoverMovieHit {
  id: number;
  title: string;
  posterUrl: string;
  releaseDate: string;
  overview?: string;
}

export async function runDiscoverSearch(
  query: string,
  options: { limit?: number } = {}
): Promise<DiscoverMovieHit[]> {
  const limit = options.limit ?? 24;
  if (!query.trim()) return [];

  const config = await getConfig();
  const baseUrl = config.images.secure_base_url;
  const seen = new Set<number>();
  const movies: DiscoverMovieHit[] = [];

  const push = (m: {
    id: number;
    title: string;
    poster_path: string | null;
    release_date?: string;
    overview?: string;
  }) => {
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

  const titleSearch = await searchMovies(query, 1);
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

  return movies.slice(0, limit);
}
