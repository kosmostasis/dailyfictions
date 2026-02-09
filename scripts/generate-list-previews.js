/**
 * DEPRECATED: This script creates SYNTHETIC list data (TMDB discover by decade/genre/sort).
 * Those previews do NOT reflect the actual list contents. Use scripts/build-list-from-ids.js
 * with real IMDb IDs or titles (e.g. from iCheckMovies export) instead.
 *
 * Generate data/lists/{slug}.json for lists that don't have one yet.
 * Run: node --env-file=.env scripts/generate-list-previews.js
 */

const fs = require("fs");
const path = require("path");

const BASE = "https://api.themoviedb.org/3";
const CSV_PATH = path.join(process.cwd(), "data", "officialtoplists.csv");
const LISTS_DIR = path.join(process.cwd(), "data", "lists");

// Slug from iCheckMovies URL (must match lib/csv-toplists slugFromListUrl)
function slugFromUrl(url) {
  try {
    const u = new URL(url);
    const segment = u.pathname.replace(/^\/lists\/|\/$/g, "").trim();
    return segment ? segment.replace(/\+/g, "-") : "";
  } catch {
    return "";
  }
}

// Which CSV slugs already have a JSON file (including legacy mapping)
const LEGACY_SLUG_MAP = {
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

function fileSlug(slug) {
  return LEGACY_SLUG_MAP[slug] ?? slug;
}

function hasListFile(slug) {
  const file = path.join(LISTS_DIR, fileSlug(slug) + ".json");
  return fs.existsSync(file);
}

// Parse CSV with quoted fields (may contain newlines)
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

async function discoverTmdb(key, params, maxIds = 100) {
  const ids = [];
  let page = 1;
  const perPage = 20;
  while (ids.length < maxIds) {
    const search = new URLSearchParams({
      api_key: key,
      page: String(page),
      ...params,
    });
    const res = await fetch(`${BASE}/discover/movie?${search}`);
    if (!res.ok) {
      throw new Error(`TMDB ${res.status}: ${await res.text()}`);
    }
    const data = await res.json();
    const results = data.results || [];
    for (const m of results) {
      if (m.id && !ids.includes(m.id)) ids.push(m.id);
    }
    if (results.length < perPage || data.total_pages <= page) break;
    page++;
    await new Promise((r) => setTimeout(r, 60)); // rate limit
  }
  return ids.slice(0, maxIds);
}

// Rules: order = priority (first match wins). Each returns { params, maxIds } or null.
function getGenerator(name) {
  const n = name.toLowerCase();
  // Decade lists (easiest) — iCheckMovies decade Top 100
  const decadeMatch = n.match(/(\d{4})s\s+top\s+100|pre-1910s\s+top\s+100/);
  if (n.includes("icheckmoviess") && (decadeMatch || n.includes("pre-1910s"))) {
    if (n.includes("pre-1910s")) {
      return { params: { "primary_release_date.lte": "1909-12-31", sort_by: "vote_count.desc" }, maxIds: 100 };
    }
    if (n.includes("2020s")) return { params: { "primary_release_date.gte": "2020-01-01", "primary_release_date.lte": "2029-12-31", sort_by: "vote_count.desc" }, maxIds: 100 };
    if (n.includes("2010s")) return { params: { "primary_release_date.gte": "2010-01-01", "primary_release_date.lte": "2019-12-31", sort_by: "vote_count.desc" }, maxIds: 100 };
    if (n.includes("2000s")) return { params: { "primary_release_date.gte": "2000-01-01", "primary_release_date.lte": "2009-12-31", sort_by: "vote_count.desc" }, maxIds: 100 };
    if (n.includes("1990s")) return { params: { "primary_release_date.gte": "1990-01-01", "primary_release_date.lte": "1999-12-31", sort_by: "vote_count.desc" }, maxIds: 100 };
    if (n.includes("1980s")) return { params: { "primary_release_date.gte": "1980-01-01", "primary_release_date.lte": "1989-12-31", sort_by: "vote_count.desc" }, maxIds: 100 };
    if (n.includes("1970s")) return { params: { "primary_release_date.gte": "1970-01-01", "primary_release_date.lte": "1979-12-31", sort_by: "vote_count.desc" }, maxIds: 100 };
    if (n.includes("1960s")) return { params: { "primary_release_date.gte": "1960-01-01", "primary_release_date.lte": "1969-12-31", sort_by: "vote_count.desc" }, maxIds: 100 };
    if (n.includes("1950s")) return { params: { "primary_release_date.gte": "1950-01-01", "primary_release_date.lte": "1959-12-31", sort_by: "vote_count.desc" }, maxIds: 100 };
    if (n.includes("1940s")) return { params: { "primary_release_date.gte": "1940-01-01", "primary_release_date.lte": "1949-12-31", sort_by: "vote_count.desc" }, maxIds: 100 };
    if (n.includes("1930s")) return { params: { "primary_release_date.gte": "1930-01-01", "primary_release_date.lte": "1939-12-31", sort_by: "vote_count.desc" }, maxIds: 100 };
    if (n.includes("1920s")) return { params: { "primary_release_date.gte": "1920-01-01", "primary_release_date.lte": "1929-12-31", sort_by: "vote_count.desc" }, maxIds: 100 };
    if (n.includes("1910s")) return { params: { "primary_release_date.gte": "1910-01-01", "primary_release_date.lte": "1919-12-31", sort_by: "vote_count.desc" }, maxIds: 100 };
  }
  // IMDb decade Top 50
  if (n.includes("imdb") && n.includes("top 50")) {
    if (n.includes("2010s")) return { params: { "primary_release_date.gte": "2010-01-01", "primary_release_date.lte": "2019-12-31", sort_by: "vote_count.desc" }, maxIds: 50 };
    if (n.includes("2000s")) return { params: { "primary_release_date.gte": "2000-01-01", "primary_release_date.lte": "2009-12-31", sort_by: "vote_count.desc" }, maxIds: 50 };
    if (n.includes("1990s")) return { params: { "primary_release_date.gte": "1990-01-01", "primary_release_date.lte": "1999-12-31", sort_by: "vote_count.desc" }, maxIds: 50 };
  }
  // Genre lists — TMDB genre IDs: 16=Animation, 878=Sci-Fi, 80=Crime, 27=Horror, 99=Documentary, 53=Thriller, 18=Drama, 35=Comedy, 28=Action, 10749=Romance, 14=Fantasy
  if (n.includes("animation") && (n.includes("top 50") || n.includes("100 animated"))) return { params: { with_genres: "16", sort_by: "vote_count.desc" }, maxIds: 100 };
  if (n.includes("sci-fi") || n.includes("sci fi")) return { params: { with_genres: "878", sort_by: "vote_count.desc" }, maxIds: n.includes("100") ? 100 : 50 };
  if (n.includes("film-noir") || n.includes("film noir")) return { params: { with_genres: "53", "primary_release_date.gte": "1940-01-01", "primary_release_date.lte": "1960-12-31", sort_by: "vote_count.desc" }, maxIds: 50 };
  if (n.includes("crime") && n.includes("top 50")) return { params: { with_genres: "80", sort_by: "vote_count.desc" }, maxIds: 50 };
  if (n.includes("horror") && (n.includes("1000") || n.includes("100"))) return { params: { with_genres: "27", sort_by: "vote_count.desc" }, maxIds: 200 };
  if (n.includes("documentary")) return { params: { with_genres: "99", sort_by: "vote_count.desc" }, maxIds: 100 };
  if (n.includes("weird movies") || n.includes("366 weird")) return { params: { with_genres: "27", sort_by: "popularity.desc" }, maxIds: 366 };
  // Sort-based lists
  if (n.includes("box office") && (n.includes("worldwide") || n.includes("revenue"))) return { params: { sort_by: "revenue.desc" }, maxIds: 500 };
  if (n.includes("box office") && n.includes("adjusted")) return { params: { sort_by: "revenue.desc" }, maxIds: 500 };
  if (n.includes("empire") && n.includes("500")) return { params: { sort_by: "popularity.desc" }, maxIds: 500 };
  if (n.includes("empire") && n.includes("100") && n.includes("world")) return { params: { sort_by: "popularity.desc", with_origin_country: "GB" }, maxIds: 100 };
  if (n.includes("rotten tomatoes") || n.includes("300 best")) return { params: { sort_by: "vote_average.desc", "vote_count.gte": "500" }, maxIds: 300 };
  if (n.includes("icheckmoviess most checked")) return { params: { sort_by: "popularity.desc" }, maxIds: 250 };
  if (n.includes("icheckmoviess most favorited")) return { params: { sort_by: "vote_average.desc", "vote_count.gte": "200" }, maxIds: 250 };
  if (n.includes("sight & sound") || n.includes("greatest films of all time")) return { params: { sort_by: "vote_count.desc", "vote_count.gte": "500" }, maxIds: 250 };
  if (n.includes("21st century") && n.includes("acclaimed")) return { params: { "primary_release_date.gte": "2000-01-01", sort_by: "vote_count.desc" }, maxIds: 500 };
  if (n.includes("a.v. club") && n.includes("2010s")) return { params: { "primary_release_date.gte": "2010-01-01", "primary_release_date.lte": "2019-12-31", sort_by: "vote_count.desc" }, maxIds: 100 };
  if (n.includes("a.v. club") && n.includes("2000s")) return { params: { "primary_release_date.gte": "2000-01-01", "primary_release_date.lte": "2009-12-31", sort_by: "vote_count.desc" }, maxIds: 100 };
  if (n.includes("time out") && n.includes("british")) return { params: { with_origin_country: "GB", sort_by: "vote_count.desc" }, maxIds: 100 };
  if (n.includes("guardian") && n.includes("1000")) return { params: { sort_by: "vote_count.desc" }, maxIds: 500 };
  if (n.includes("cahiers") && n.includes("100 films")) return { params: { sort_by: "vote_count.desc" }, maxIds: 100 };
  if (n.includes("cahiers") && n.includes("top 10")) return { params: { "primary_release_date.gte": "1950-01-01", sort_by: "vote_count.desc" }, maxIds: 100 };
  if (n.includes("bfi") && n.includes("animated")) return { params: { with_genres: "16", sort_by: "vote_count.desc" }, maxIds: 100 };
  if (n.includes("new cult canon")) return { params: { "primary_release_date.gte": "1987-01-01", sort_by: "vote_count.desc" }, maxIds: 150 };
  if (n.includes("doubling the canon")) return { params: { sort_by: "vote_count.desc" }, maxIds: 1000 };
  if (n.includes("icm forum") && n.includes("500")) return { params: { "vote_count.gte": "50", "vote_count.lte": "400", sort_by: "vote_average.desc" }, maxIds: 500 };
  if (n.includes("arts & faith")) return { params: { sort_by: "vote_count.desc" }, maxIds: 100 };
  if (n.includes("eureka") && n.includes("masters of cinema")) return { params: { sort_by: "vote_count.desc" }, maxIds: 200 };
  if (n.includes("new york times") && n.includes("movies")) return { params: { sort_by: "vote_count.desc" }, maxIds: 1000 };
  if (n.includes("harvard") && n.includes("narrative")) return { params: { sort_by: "vote_count.desc" }, maxIds: 500 };
  if (n.includes("harvard") && n.includes("non-fiction")) return { params: { with_genres: "99", sort_by: "vote_count.desc" }, maxIds: 200 };
  if (n.includes("harvard") && n.includes("animated")) return { params: { with_genres: "16", sort_by: "vote_count.desc" }, maxIds: 200 };
  if (n.includes("harvard") && n.includes("experimental")) return { params: { sort_by: "vote_count.desc" }, maxIds: 200 };
  if (n.includes("harvard") && n.includes("video")) return { params: { sort_by: "vote_count.desc" }, maxIds: 200 };
  if (n.includes("noir") && n.includes("1000")) return { params: { with_genres: "80", "primary_release_date.gte": "1940-01-01", "primary_release_date.lte": "1960-12-31", sort_by: "vote_count.desc" }, maxIds: 300 };
  if (n.includes("noir") && n.includes("100 essential")) return { params: { with_genres: "53", "primary_release_date.gte": "1940-01-01", sort_by: "vote_count.desc" }, maxIds: 100 };
  if (n.includes("palme") || n.includes("cannes")) return { params: { with_keywords: "1747", sort_by: "vote_count.desc" }, maxIds: 100 }; // keyword Palme d'Or
  if (n.includes("academy") && n.includes("international") && n.includes("nominees")) return { params: { sort_by: "vote_count.desc" }, maxIds: 300 };
  if (n.includes("academy") && n.includes("international")) return { params: { sort_by: "vote_count.desc" }, maxIds: 100 };
  if (n.includes("silent era")) return { params: { "primary_release_date.lte": "1929-12-31", sort_by: "vote_count.desc" }, maxIds: 300 };
  if (n.includes("cult movies") && n.includes("jennifer")) return { params: { with_genres: "27", sort_by: "popularity.desc" }, maxIds: 500 };
  if (n.includes("tarantino")) return { params: { sort_by: "vote_count.desc" }, maxIds: 100 };
  if (n.includes("scott tobias")) return { params: { "primary_release_date.gte": "1987-01-01", sort_by: "vote_count.desc" }, maxIds: 150 };
  if (n.includes("mark cousins") || n.includes("story of film")) return { params: { sort_by: "vote_count.desc" }, maxIds: 500 };
  if (n.includes("1001 movies")) return null; // we have this
  if (n.includes("imdb's top 250")) return null;
  if (n.includes("reddit top 250")) return null;
  if (n.includes("tspdt") && n.includes("1000 greatest")) return null;
  if (n.includes("academy award") && n.includes("best picture") && !n.includes("nominees")) return null;
  if (n.includes("criterion collection")) return null;
  if (n.includes("roger ebert")) return null;
  if (n.includes("afi's 100")) return null;
  if (n.includes("cannes") && n.includes("palme")) return null;
  // Fallback: generic "greatest" or "best" by vote count
  if (n.includes("greatest") || n.includes("best ") || n.includes("top ")) {
    return { params: { sort_by: "vote_count.desc", "vote_count.gte": "100" }, maxIds: 250 };
  }
  return null;
}

async function main() {
  const key = process.env.TMDB_API_KEY;
  if (!key) {
    console.error("Set TMDB_API_KEY (e.g. node --env-file=.env.local scripts/generate-list-previews.js)");
    process.exit(1);
  }

  const raw = fs.readFileSync(CSV_PATH, "utf-8");
  const rows = parseCsvRows(raw);
  const header = rows[0]?.map((h) => h.toLowerCase()) || [];
  const nameIdx = header.indexOf("name");
  const urlIdx = header.indexOf("url");
  if (nameIdx < 0 || urlIdx < 0) {
    console.error("CSV missing name or url column");
    process.exit(1);
  }

  const lists = [];
  for (let r = 1; r < rows.length; r++) {
    const name = (rows[r][nameIdx] ?? "").trim();
    const url = (rows[r][urlIdx] ?? "").trim();
    if (!name || !url) continue;
    const slug = slugFromUrl(url);
    if (!slug) continue;
    lists.push({ name, slug });
  }

  const toGenerate = lists.filter(({ slug }) => !hasListFile(slug));
  console.log(`Lists without JSON: ${toGenerate.length}. Generating up to 50+ with previews...`);

  let generated = 0;
  const target = 50;
  for (const { name, slug } of toGenerate) {
    if (generated >= target) break;
    const gen = getGenerator(name);
    if (!gen) continue;
    try {
      const ids = await discoverTmdb(key, gen.params, gen.maxIds);
      if (ids.length === 0) continue;
      const outPath = path.join(LISTS_DIR, slug + ".json");
      fs.writeFileSync(outPath, JSON.stringify(ids, null, 0), "utf-8");
      console.log(`  ${slug}: ${ids.length} ids`);
      generated++;
    } catch (err) {
      console.warn(`  Skip ${slug}: ${err.message}`);
    }
    await new Promise((r) => setTimeout(r, 80));
  }

  const totalWithPreviews = fs.readdirSync(LISTS_DIR).filter((f) => f.endsWith(".json")).length;
  console.log(`Done. Lists with previews: ${totalWithPreviews}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
