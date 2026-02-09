/**
 * Curated lists: definitions from officialtoplists.csv; list membership (TMDB ids) in data/lists/{slug}.json.
 */

import { readFile } from "fs/promises";
import path from "path";
import {
  getOfficialListsFromCsv,
  slugFromListUrl,
} from "./csv-toplists";
import { getConfig, getMovieDetails, posterUrl } from "./tmdb";

export interface ListMovie {
  id: number;
  title: string;
  posterUrl: string;
  releaseDate: string;
}

export interface ListDefinition {
  id: string;
  name: string;
  slug: string;
  source: string;
  description?: string;
  /** Link to list source: direct source when available, else iCheckMovies. */
  sourceUrl?: string;
  /** True when no direct source was found in CSV (link is iCheckMovies only). */
  icheckMoviesOnly?: boolean;
}

/** Known direct source URLs for lists that don't have [url=...] in the CSV (e.g. IMDb Top 250). */
const KNOWN_DIRECT_SOURCES: Record<string, string> = {
  "IMDb's Top 250": "https://www.imdb.com/chart/top/",
};

/** Fallback descriptions for lists whose CSV description is empty or only BBCode links. */
const FALLBACK_DESCRIPTIONS: Record<string, string> = {
  "101 Gangster Movies You Must See Before You Die":
    "A selection of 101 essential gangster and crime films, from classic mob pictures to modern thrillers.",
  "A.V. Club's The Best Movies of the 2010s":
    "The A.V. Club’s staff pick of the best films of the 2010s, from mainstream hits to indie and international highlights.",
  "iCheckMovies's 2020s Top 100":
    "The most-checked films of the 2020s on iCheckMovies, reflecting community viewing and favorites so far this decade.",
  "iCheckMovies's  Pre-1910s Top 100":
    "The most-checked films from the pre-1910s era on iCheckMovies: early shorts, actualities, and foundational cinema.",
  "iCheckMovies's 2010s Top 100":
    "The most-checked films of the 2010s on iCheckMovies, as voted and tracked by the community.",
  "iCheckMovies's 2000s Top 100":
    "The most-checked films of the 2000s on iCheckMovies, reflecting community engagement with that decade’s titles.",
  "iCheckMovies's 1920s Top 100":
    "The most-checked films of the 1920s on iCheckMovies, from silent classics to early sound and international landmarks.",
  "iCheckMovies's 1980s Top 100":
    "The most-checked films of the 1980s on iCheckMovies: blockbusters, cult favorites, and arthouse standouts.",
  "iCheckMovies's 1990s Top 100":
    "The most-checked films of the 1990s on iCheckMovies, from indie breakthroughs to mainstream and international hits.",
  "iCheckMovies's 1930s Top 100":
    "The most-checked films of the 1930s on iCheckMovies, including Hollywood golden age and pre-war classics.",
  "iCheckMovies's 1940s Top 100":
    "The most-checked films of the 1940s on iCheckMovies: wartime and post-war Hollywood and world cinema.",
  "iCheckMovies's 1950s Top 100":
    "The most-checked films of the 1950s on iCheckMovies, from studio-era classics to the rise of international art cinema.",
  "iCheckMovies's 1910s Top 100":
    "The most-checked films of the 1910s on iCheckMovies: feature-length emergence and silent-era milestones.",
  "iCheckMovies's 1970s Top 100":
    "The most-checked films of the 1970s on iCheckMovies: New Hollywood, world cinema, and enduring cult titles.",
  "iCheckMovies's 1960s Top 100":
    "The most-checked films of the 1960s on iCheckMovies: New Wave, counterculture cinema, and international classics.",
};

/** Strip [url=...]...[/url] (and variants) from description so the link only appears under "View full list". */
function stripUrlBbcode(description: string): string {
  return description
    .replace(/\[\s*url\s*=\s*[^\]]+\][\s\S]*?\[\s*\/\s*url\s*\]/gi, "")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

/** Slugs that are always sorted to the bottom of the list index. */
const PIN_TO_BOTTOM_SLUGS = new Set(["reddit-top-250"]);

/** Legacy slugs for lists that have existing .json files under a different name */
const LEGACY_SLUG_MAP: Record<string, string> = {
  "imdbs-top-250": "imdb-top-250",
  "reddit-top-250": "reddit-top-250",
  "1001-movies-you-must-see-before-you-die": "1001-movies",
  "tspdts-1000-greatest-films": "tspdt-1000",
  "academy-award--best-picture": "oscar-best-picture",
  "the-criterion-collection": "criterion",
  "roger-eberts-great-movies": "roger-ebert",
  "afis-100-years100-movies": "afi-100",
  "imdbs-sci-fi-top-50": "imdb-sci-fi-50",
  "cannes-film-festival--palme-dor": "cannes-palme",
};

export async function getListDefinitions(): Promise<ListDefinition[]> {
  const rows = await getOfficialListsFromCsv();
  const withMeta = rows.map((row, i) => {
    const slug = slugFromListUrl(row.url) || `list-${i + 1}`;
    const directUrl = row.directSourceUrl.length > 0
      ? row.directSourceUrl
      : (KNOWN_DIRECT_SOURCES[row.name] ?? "");
    const hasDirect = directUrl.length > 0;
    const strippedDesc = row.description ? stripUrlBbcode(row.description) : "";
    const description = strippedDesc.trim().length > 0
      ? strippedDesc
      : (FALLBACK_DESCRIPTIONS[row.name] ?? undefined);
    const hasDescription = (description ?? "").trim().length > 0;
    return {
      id: slug,
      name: row.name,
      slug,
      source: "icheckmovies",
      description: description || undefined,
      sourceUrl: hasDirect ? directUrl : (row.url || undefined),
      icheckMoviesOnly: !hasDirect,
      _sortFirst: hasDirect && hasDescription,
    };
  });
  // Which lists have JSON data (browseable films)
  const withMovies = await Promise.all(
    withMeta.map(async (item) => ({
      ...item,
      _hasMovies: (await getListMovieIds(item.slug)).length > 0,
    }))
  );
  // Lists with JSON (12-film preview) first; then by direct source + description; pin-to-bottom last
  withMovies.sort((a, b) => {
    const aBottom = PIN_TO_BOTTOM_SLUGS.has(a.slug);
    const bBottom = PIN_TO_BOTTOM_SLUGS.has(b.slug);
    if (aBottom !== bBottom) return aBottom ? 1 : -1;
    if (a._hasMovies !== b._hasMovies) return a._hasMovies ? -1 : 1;
    return a._sortFirst === b._sortFirst ? 0 : a._sortFirst ? -1 : 1;
  });
  return withMovies.map(({ _sortFirst, _hasMovies, ...list }) => list);
}

export async function getListBySlug(slug: string): Promise<ListDefinition | undefined> {
  const lists = await getListDefinitions();
  return lists.find((l) => l.slug === slug);
}

export async function getListMovieIds(slug: string): Promise<number[]> {
  const trySlug = LEGACY_SLUG_MAP[slug] ?? slug;
  const filePath = path.join(process.cwd(), "data", "lists", `${trySlug}.json`);
  try {
    const json = await readFile(filePath, "utf-8");
    return JSON.parse(json) as number[];
  } catch {
    return [];
  }
}

/** Fetch first `limit` movies for a list with poster and title (for index preview or detail page). */
export async function getListMovies(slug: string, limit = 24): Promise<ListMovie[]> {
  const ids = await getListMovieIds(slug);
  const slice = ids.slice(0, limit);
  if (slice.length === 0) return [];
  const [config, ...details] = await Promise.all([
    getConfig(),
    ...slice.map((id) => getMovieDetails(id)),
  ]);
  const baseUrl = config.images.secure_base_url;
  return details.map((m) => ({
    id: m.id,
    title: m.title,
    posterUrl: posterUrl(baseUrl, m.poster_path),
    releaseDate: m.release_date ?? "",
  }));
}
