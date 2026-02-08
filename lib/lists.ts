/**
 * Curated lists: definitions from officialtoplists.csv; list membership (TMDB ids) in data/lists/{slug}.json.
 */

import { readFile } from "fs/promises";
import path from "path";
import {
  getOfficialListsFromCsv,
  slugFromListUrl,
} from "./csv-toplists";

export interface ListDefinition {
  id: string;
  name: string;
  slug: string;
  source: string;
  description?: string;
  /** Link to list source (e.g. iCheckMovies list page). */
  sourceUrl?: string;
}

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
  return rows.map((row, i) => {
    const slug = slugFromListUrl(row.url) || `list-${i + 1}`;
    return {
      id: slug,
      name: row.name,
      slug,
      source: "icheckmovies",
      description: row.description || undefined,
      sourceUrl: row.url || undefined,
    };
  });
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
