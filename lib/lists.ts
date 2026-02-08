/**
 * Curated lists: definitions and list membership (TMDB ids).
 * List entries are resolved via IMDb id → TMDB find; for MVP we store TMDB ids directly.
 */

import { readFile } from "fs/promises";
import path from "path";

export interface ListDefinition {
  id: string;
  name: string;
  slug: string;
  source: string;
  description?: string;
}

const LISTS_PATH = path.join(process.cwd(), "data", "lists.json");

export async function getListDefinitions(): Promise<ListDefinition[]> {
  const json = await readFile(LISTS_PATH, "utf-8");
  return JSON.parse(json) as ListDefinition[];
}

export async function getListBySlug(slug: string): Promise<ListDefinition | undefined> {
  const lists = await getListDefinitions();
  return lists.find((l) => l.slug === slug);
}

export async function getListMovieIds(slug: string): Promise<number[]> {
  const filePath = path.join(process.cwd(), "data", "lists", `${slug}.json`);
  try {
    const json = await readFile(filePath, "utf-8");
    return JSON.parse(json) as number[];
  } catch {
    return [];
  }
}
