# List source files

Drop iCheckMovies CSV exports here, then run:

```bash
node --env-file=.env scripts/import-icheckmovies-csv.js
```

Or pass another directory:

```bash
node --env-file=.env scripts/import-icheckmovies-csv.js "/Users/you/Desktop/Daily Fictions"
```

CSV must have an **imdburl** column (e.g. `http://www.imdb.com/title/tt0111161/`).  
Filenames become list slugs: `1001+movies+you+must+see+before+you+die.csv` → list slug `1001-movies-you-must-see-before-you-die` → output `1001-movies.json` (via legacy mapping).  
Supported mappings are in `scripts/import-icheckmovies-csv.js` (CSV_SLUG_TO_OUTPUT).
