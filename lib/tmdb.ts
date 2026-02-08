/**
 * Server-side TMDB client. All calls use TMDB_API_KEY from env.
 * Do not use this from client components (expose via API routes or server actions).
 */

const BASE = "https://api.themoviedb.org/3";

function getApiKey(): string {
  const key = process.env.TMDB_API_KEY;
  if (!key) throw new Error("TMDB_API_KEY is not set");
  return key;
}

async function fetchTmdb<T>(path: string, params: Record<string, string> = {}): Promise<T> {
  const key = getApiKey();
  const search = new URLSearchParams({ api_key: key, ...params });
  const url = `${BASE}${path}?${search}`;
  const res = await fetch(url, { next: { revalidate: 3600 } });
  if (!res.ok) throw new Error(`TMDB ${res.status}: ${res.statusText}`);
  return res.json() as Promise<T>;
}

// --- Config (image base URL) ---

export interface TmdbConfig {
  images: { secure_base_url: string; poster_sizes: string[] };
}

let configCache: TmdbConfig | null = null;

export async function getConfig(): Promise<TmdbConfig> {
  if (configCache) return configCache;
  const data = await fetchTmdb<{ images: TmdbConfig["images"] }>("/configuration");
  configCache = { images: data.images };
  return configCache;
}

export function posterUrl(baseUrl: string, posterPath: string | null, size = "w500"): string {
  if (!posterPath) return "";
  return `${baseUrl}${size}${posterPath}`;
}

// --- Room slug → TMDB genre ID (single primary genre per room) ---

export const ROOM_TO_TMDB_GENRE_ID: Record<string, number> = {
  comedy: 35,
  action: 28,
  horror: 27,
  drama: 18,
  "sci-fi": 878,
  fantasy: 14,
  romance: 10749,
  thriller: 53,
  documentary: 99,
  animation: 16,
};

export function getGenreIdForRoom(roomSlug: string): number | undefined {
  return ROOM_TO_TMDB_GENRE_ID[roomSlug];
}

// --- Discover movies by genre ---

export interface TmdbMovieSummary {
  id: number;
  title: string;
  poster_path: string | null;
  release_date: string;
  overview: string;
}

export interface TmdbDiscoverResponse {
  results: TmdbMovieSummary[];
  page: number;
  total_pages: number;
}

export async function discoverMoviesByGenre(
  genreId: number,
  page = 1
): Promise<TmdbDiscoverResponse> {
  return fetchTmdb<TmdbDiscoverResponse>("/discover/movie", {
    with_genres: String(genreId),
    page: String(page),
    sort_by: "popularity.desc",
  });
}

/** Discover by genre with vote_average >= 8 (highly rated). Use for "In this room we could watch" cycling. */
export async function discoverMoviesByGenreHighlyRated(
  genreId: number,
  page = 1
): Promise<TmdbDiscoverResponse> {
  return fetchTmdb<TmdbDiscoverResponse>("/discover/movie", {
    with_genres: String(genreId),
    "vote_average.gte": "8",
    "vote_count.gte": "500",
    page: String(page),
    sort_by: "vote_count.desc",
  });
}

// --- Search (thematic discovery: "I want to see a movie that...") ---

export interface TmdbSearchResponse {
  results: TmdbMovieSummary[];
  page: number;
  total_pages: number;
}

export async function searchMovies(query: string, page = 1): Promise<TmdbSearchResponse> {
  if (!query.trim()) return { results: [], page: 1, total_pages: 0 };
  return fetchTmdb<TmdbSearchResponse>("/search/movie", {
    query: query.trim(),
    page: String(page),
  });
}

// --- Keywords (theme/description-informed discover) ---

export interface TmdbKeywordResult {
  id: number;
  name: string;
}

export interface TmdbKeywordSearchResponse {
  results: TmdbKeywordResult[];
}

export async function searchKeywords(query: string): Promise<TmdbKeywordResult[]> {
  if (!query.trim()) return [];
  const data = await fetchTmdb<TmdbKeywordSearchResponse>("/search/keyword", {
    query: query.trim(),
  });
  return data.results?.slice(0, 5) ?? [];
}

/** Discover movies by keyword ids (themes/topics from descriptions and tags). */
export async function discoverMoviesByKeywords(
  keywordIds: number[],
  page = 1
): Promise<TmdbDiscoverResponse> {
  if (keywordIds.length === 0) return { results: [], page: 1, total_pages: 0 };
  const with_keywords = keywordIds.join("|");
  return fetchTmdb<TmdbDiscoverResponse>("/discover/movie", {
    with_keywords,
    page: String(page),
    sort_by: "popularity.desc",
  });
}

// --- Movie details ---

export interface TmdbMovieDetails {
  id: number;
  title: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date: string;
  overview: string;
  genres: { id: number; name: string }[];
  runtime: number | null;
  imdb_id: string | null;
}

export async function getMovieDetails(movieId: number): Promise<TmdbMovieDetails> {
  return fetchTmdb<TmdbMovieDetails>(`/movie/${movieId}`);
}

export interface TmdbCredits {
  cast: { id: number; name: string; character?: string; order: number }[];
  crew: { id: number; name: string; job: string }[];
}

export async function getMovieCredits(movieId: number): Promise<TmdbCredits> {
  return fetchTmdb<TmdbCredits>(`/movie/${movieId}/credits`);
}

// --- Find by IMDb ID ---

export interface TmdbFindMovieResult {
  id: number;
  title: string;
  poster_path: string | null;
  release_date: string;
}

export interface TmdbFindResponse {
  movie_results: TmdbFindMovieResult[];
}

export async function findMovieByImdbId(imdbId: string): Promise<TmdbFindMovieResult | null> {
  const data = await fetchTmdb<TmdbFindResponse>(`/find/${imdbId}`, {
    external_source: "imdb_id",
  });
  const first = data.movie_results?.[0];
  return first ?? null;
}

// --- Watch providers ---

export interface TmdbWatchProviders {
  id: number;
  results: {
    [region: string]: {
      link?: string;
      flatrate?: { provider_id: number; provider_name: string; logo_path: string }[];
      rent?: { provider_id: number; provider_name: string; logo_path: string }[];
      buy?: { provider_id: number; provider_name: string; logo_path: string }[];
    };
  };
}

export async function getWatchProviders(
  movieId: number,
  region?: string
): Promise<TmdbWatchProviders["results"]> {
  const data = await fetchTmdb<TmdbWatchProviders>(`/movie/${movieId}/watch/providers`);
  return data.results ?? {};
}
