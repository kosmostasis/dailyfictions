/**
 * Import iCheckMovies list CSVs into data/lists/{slug}.json.
 * CSV must have an "imdburl" column (e.g. http://www.imdb.com/title/tt0111161/).
 *
 * Usage:
 *   node --env-file=.env scripts/import-icheckmovies-csv.js [directory]
 *
 * If directory is omitted, uses data/list-sources/. Place your CSV files there
 * (or pass a path like "/Users/you/Desktop/Daily Fictions"). Filenames become
 * list slugs: "1001+movies+..." -> 1001-movies-you-must-see-before-you-die,
 * then we map to output filename via CSV_SLUG_TO_OUTPUT (matches app's legacy slugs).
 */

const fs = require("fs");
const path = require("path");

const BASE = "https://api.themoviedb.org/3";
const LISTS_DIR = path.join(process.cwd(), "data", "lists");
const DEFAULT_SOURCES = path.join(process.cwd(), "data", "list-sources");

// CSV filename (with + -> -) to output list filename (no .json). Matches lib/lists LEGACY_SLUG_MAP.
const CSV_SLUG_TO_OUTPUT = {
  "1001-movies-you-must-see-before-you-die": "1001-movies",
  "cannes-film-festival--palme-dor": "cannes-palme",
  "the-criterion-collection": "criterion",
  "tspdts-21st-centurys-most-acclaimed-films": "tspdts-21st-centurys-most-acclaimed-films",
  "quentin-tarantinos-coolest-movies-of-all-time": "quentin-tarantinos-coolest-movies-of-all-time",
  "366-weird-movies": "366-weird-movies",
};

function slugFromFilename(name) {
  return name.replace(/\.csv$/i, "").replace(/\+/g, "-").trim();
}

function parseCsvRows(raw) {
  const rows = [];
  let row = [];
  let field = "";
  let inQuotes = false;
  for (let i = 0; i < raw.length; i++) {
    const c = raw[i];
    if (inQuotes) {
      if (c === '"') {
        if (raw[i + 1] === '"') {
          field += '"';
          i++;
        } else {
          inQuotes = false;
        }
      } else {
        field += c;
      }
      continue;
    }
    if (c === '"') {
      inQuotes = true;
      continue;
    }
    if (c === ",") {
      row.push(field.trim());
      field = "";
      continue;
    }
    if (c === "\n" || c === "\r") {
      if (c === "\r" && raw[i + 1] === "\n") i++;
      row.push(field.trim());
      field = "";
      if (row.some((cell) => cell !== "")) rows.push(row);
      row = [];
      continue;
    }
    field += c;
  }
  if (field !== "" || row.length > 0) {
    row.push(field.trim());
    if (row.some((cell) => cell !== "")) rows.push(row);
  }
  return rows;
}

function extractImdbIds(rows, imdbUrlIdx) {
  const ids = [];
  const seen = new Set();
  const ttRe = /tt\d+/i;
  for (let r = 1; r < rows.length; r++) {
    const url = rows[r][imdbUrlIdx] ?? "";
    const m = url.match(ttRe);
    if (m && !seen.has(m[0].toLowerCase())) {
      seen.add(m[0].toLowerCase());
      ids.push(m[0]);
    }
  }
  return ids;
}

async function findByImdbId(key, imdbId) {
  const search = new URLSearchParams({ api_key: key, external_source: "imdb_id" });
  const res = await fetch(`${BASE}/find/${imdbId}?${search}`);
  if (!res.ok) return null;
  const data = await res.json();
  const first = data.movie_results?.[0];
  return first?.id ?? null;
}

async function main() {
  const key = process.env.TMDB_API_KEY;
  if (!key) {
    console.error("Set TMDB_API_KEY (e.g. node --env-file=.env scripts/import-icheckmovies-csv.js [dir])");
    process.exit(1);
  }

  const dir = path.resolve(process.argv[2] || DEFAULT_SOURCES);
  if (!fs.existsSync(dir) || !fs.statSync(dir).isDirectory()) {
    console.error("Directory not found:", dir);
    console.error("Usage: node scripts/import-icheckmovies-csv.js [directory]");
    console.error("  Copy your iCheckMovies CSV exports into data/list-sources/ or pass their path.");
    process.exit(1);
  }

  const files = fs.readdirSync(dir).filter((f) => f.toLowerCase().endsWith(".csv"));
  if (files.length === 0) {
    console.error("No CSV files in", dir);
    process.exit(1);
  }

  console.log(`Found ${files.length} CSV(s) in ${dir}\n`);

  for (const file of files) {
    const slugFromFile = slugFromFilename(file);
    const outputSlug = CSV_SLUG_TO_OUTPUT[slugFromFile] ?? slugFromFile;
    const csvPath = path.join(dir, file);

    let raw;
    try {
      raw = fs.readFileSync(csvPath, "utf-8");
    } catch (e) {
      console.warn("  Skip", file, ":", e.message);
      continue;
    }

    const rows = parseCsvRows(raw);
    if (rows.length < 2) {
      console.warn("  Skip", file, ": no data rows");
      continue;
    }

    const header = rows[0].map((h) => (h || "").toLowerCase());
    const imdbUrlIdx = header.indexOf("imdburl");
    if (imdbUrlIdx < 0) {
      console.warn("  Skip", file, ": no 'imdburl' column");
      continue;
    }

    const imdbIds = extractImdbIds(rows, imdbUrlIdx);
    console.log(`  ${file} -> ${outputSlug}.json (${imdbIds.length} IMDb IDs)`);

    const tmdbIds = [];
    for (let i = 0; i < imdbIds.length; i++) {
      const tmdbId = await findByImdbId(key, imdbIds[i]);
      if (tmdbId != null) tmdbIds.push(tmdbId);
      if ((i + 1) % 50 === 0) process.stdout.write(`    ${i + 1}/${imdbIds.length}\n`);
      await new Promise((r) => setTimeout(r, 50));
    }

    const outPath = path.join(LISTS_DIR, `${outputSlug}.json`);
    fs.writeFileSync(outPath, JSON.stringify(tmdbIds, null, 0), "utf-8");
    console.log(`    -> ${tmdbIds.length} TMDB IDs written to ${outPath}\n`);
  }

  console.log("Done.");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
