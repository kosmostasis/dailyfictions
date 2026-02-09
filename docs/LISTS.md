# Curated lists

List **definitions** (name, description, source URL) come from **`data/officialtoplists.csv`**. Movie IDs (TMDB) live in **`data/lists/{slug}.json`** as an array of numbers. The slug is derived from the list’s iCheckMovies URL (path with `+` → `-`).

## Adding list content (so a list gets a preview)

Only lists that have a **`data/lists/{slug}.json`** file show the 12-film preview. Use **real** list data so previews match the list.

### Option 1: iCheckMovies CSV import (easiest for iCheckMovies exports)

If you have CSV exports from iCheckMovies (with an **imdburl** column):

1. Copy the CSV files into **`data/list-sources/`** (or keep them anywhere and pass that folder).
2. Run:
   ```bash
   npm run import-list-csvs
   # or with a specific folder:
   node --env-file=.env scripts/import-icheckmovies-csv.js "/path/to/folder/with/csvs"
   ```
3. The script parses each CSV, extracts IMDb IDs from **imdburl**, resolves them to TMDB IDs, and writes **`data/lists/{slug}.json`**. Filename → slug: `1001+movies+...csv` → `1001-movies-you-must-see-before-you-die`; output uses legacy mapping (e.g. → `1001-movies.json`). See `scripts/import-icheckmovies-csv.js` for the full mapping.

### Option 2: Build from IMDb IDs or titles (one list at a time)

Use the list-builder script with a file of IMDb IDs (e.g. from iCheckMovies export) or movie titles (one per line):

```bash
# From a file of IMDb IDs (tt0111161, tt0068646, ...)
node --env-file=.env scripts/build-list-from-ids.js <slug> ids.txt

# From stdin (paste or pipe)
cat my-list.txt | node --env-file=.env scripts/build-list-from-ids.js <slug>
```

- **Slug** must match the list’s slug from the CSV (e.g. `empires-the-500-greatest-movies-of-all-time`). Check the list’s iCheckMovies URL: path segment with `+` replaced by `-`.
- Lines starting with `#` are skipped. Blank lines are skipped.
- Each line is either an IMDb ID (`tt1234567`) or a movie title (TMDB search, first result).

### Option 3: Manual

Create `data/lists/{slug}.json` with a JSON array of TMDB movie IDs: `[123,456,...]`.

### Where to get the IDs

- **iCheckMovies:** Open the list → Export (CSV or copy). You get IMDb IDs; use the script above with `find/{imdb_id}` (the script does this).
- **Wikipedia / other:** Copy titles or IMDb links into a text file, one per line; use the script with title lines or extract `tt...` IDs.

Previews only use list data from these files; we do not generate synthetic “discover” lists so that previews always reflect the real list.
