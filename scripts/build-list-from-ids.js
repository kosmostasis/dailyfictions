/**
 * Build data/lists/{slug}.json from a list of IMDb IDs (tt...) or movie titles.
 * Each line = one film. Resolves to TMDB IDs and writes the list file.
 *
 * Usage:
 *   node --env-file=.env scripts/build-list-from-ids.js <slug> [input.txt]
 *   cat imdb-ids.txt | node --env-file=.env scripts/build-list-from-ids.js my-list
 *
 * Input examples (one per line):
 *   tt0111161
 *   tt0068646
 *   The Shawshank Redemption
 */

const fs = require("fs");
const path = require("path");
const readline = require("readline");

const BASE = "https://api.themoviedb.org/3";
const LISTS_DIR = path.join(process.cwd(), "data", "lists");

async function findByImdbId(key, imdbId) {
  const search = new URLSearchParams({ api_key: key, external_source: "imdb_id" });
  const res = await fetch(`${BASE}/find/${imdbId}?${search}`);
  if (!res.ok) return null;
  const data = await res.json();
  const first = data.movie_results?.[0];
  return first?.id ?? null;
}

async function findByTitle(key, title) {
  const search = new URLSearchParams({ api_key: key, query: title, page: "1" });
  const res = await fetch(`${BASE}/search/movie?${search}`);
  if (!res.ok) return null;
  const data = await res.json();
  const first = data.results?.[0];
  return first?.id ?? null;
}

async function main() {
  const key = process.env.TMDB_API_KEY;
  if (!key) {
    console.error("Set TMDB_API_KEY (e.g. node --env-file=.env scripts/build-list-from-ids.js <slug> [file])");
    process.exit(1);
  }

  const slug = process.argv[2];
  if (!slug || /[^a-z0-9.-]/.test(slug) || slug.includes("..")) {
    console.error("Usage: node scripts/build-list-from-ids.js <slug> [input.txt]");
    console.error("  slug: list filename without .json (e.g. empires-the-500-greatest-movies-of-all-time)");
    process.exit(1);
  }

  const inputPath = process.argv[3];
  const stream = inputPath
    ? fs.createReadStream(inputPath, "utf-8")
    : process.stdin;
  const rl = readline.createInterface({ input: stream, crlfDelay: Infinity });

  const lines = [];
  for await (const line of rl) {
    const t = line.trim();
    if (t && !t.startsWith("#")) lines.push(t);
  }

  console.log(`Resolving ${lines.length} entries to TMDB IDs...`);
  const ids = [];
  const seen = new Set();

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const isImdb = /^tt\d+$/i.test(line);
    const tmdbId = isImdb
      ? await findByImdbId(key, line)
      : await findByTitle(key, line);
    if (tmdbId != null && !seen.has(tmdbId)) {
      seen.add(tmdbId);
      ids.push(tmdbId);
    }
    if ((i + 1) % 20 === 0) console.log(`  ${i + 1}/${lines.length}...`);
    await new Promise((r) => setTimeout(r, 50));
  }

  const outPath = path.join(LISTS_DIR, `${slug}.json`);
  fs.writeFileSync(outPath, JSON.stringify(ids, null, 0), "utf-8");
  console.log(`Wrote ${ids.length} TMDB IDs to ${outPath}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
