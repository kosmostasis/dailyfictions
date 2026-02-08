# Curated lists

Lists are defined in **`data/lists.json`**. Movie IDs (TMDB) live in **`data/lists/{slug}.json`** as an array of numbers.

## Adding more lists (including all official iCheckMovies lists)

Nothing in the code limits how many lists you have. To add lists from [iCheckMovies official lists](https://www.icheckmovies.com/lists/?tags=user:icheckmovies):

1. **Add a list definition** in `data/lists.json`:
   ```json
   {
     "id": "unique-id",
     "name": "Display Name",
     "slug": "url-slug",
     "source": "icheckmovies",
     "description": "Optional short description."
   }
   ```
   Use a URL-safe `slug` (e.g. `reddit-top-250`, `1001-movies`).

2. **Create the movie file** `data/lists/{slug}.json` with TMDB movie IDs. Options:
   - **Manual / script:** On iCheckMovies, open the list → **Export** (CSV). You get IMDb IDs. Use a script to call TMDB `find/{imdb_id}?external_source=imdb_id` for each and save the TMDB ids into `data/lists/{slug}.json`.
   - **Empty list:** Create `data/lists/{slug}.json` with `[]` and fill later.

3. **Bulk import script (optional):** A Node script can read a CSV of IMDb IDs, call `lib/tmdb.ts` `findMovieByImdbId()` for each, and write the resulting TMDB ids to `data/lists/{slug}.json`. iCheckMovies does not expose a public API, so export is CSV/download only.

Once a list exists in `data/lists.json` and has a corresponding `data/lists/{slug}.json`, it appears under **Lists** in the app.
