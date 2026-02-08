# Film Club Platform: Step-by-Step Engineering Prompts

Use these prompts **one milestone at a time**. After each milestone, **review together** using the checkpoint before moving on. Reference the main plan (`.cursor/plans/` or the research doc) for aesthetics, 9 rooms, director pairings, and APIs.

---

## Milestone 0: Project setup and scope

**Goal:** Repo, stack, env, and alignment with the plan.

### Prompts to run (in order)

1. **"Set up a new project in this repo for the film club web app. Use a simple modern stack: Next.js (App Router) with TypeScript, and add Tailwind CSS. Create a minimal layout (root layout + a home page that says 'Film Club'). Add a README section that links to our plan and lists the 9 rooms (Comedy, Action, Horror, Drama, Sci-Fi, Fantasy, Romance, Thriller, Documentary)."**

2. **"Add environment variable support for a TMDB API key. Create a `.env.example` with `TMDB_API_KEY=` and document in the README that the key is from https://www.themoviedb.org/settings/api. Do not commit any real API key."**

3. **"Create a single source of constants for the app: the 9 room slugs and display names, and the director–room pairing (Comedy → Wes Anderson, Romance → Wong Kar-Wai, Thriller → PTA, Fantasy → Jodorowsky, Documentary → Werner Herzog, Drama → Fellini, Action/Horror/Sci-Fi → aesthetic-only). Export a typed structure we can use across the app."**

### Review checkpoint (Milestone 0)

- [ ] App runs locally (e.g. `npm run dev`) and shows a Film Club home page.
- [ ] TMDB key is only in `.env` and documented.
- [ ] Constants file exists and matches the 9 rooms and director pairings from the plan.
- [ ] We’re aligned on stack (Next.js + TS + Tailwind); any change? **→ If good, proceed to Milestone 1.**

---

## Milestone 1: TMDB integration and data layer

**Goal:** Talk to TMDB (vidchuck-style): config, discover by genre, movie details, find by IMDb ID, watch providers. No UI beyond a minimal test.

### Prompts to run (in order)

1. **"Add a server-side TMDB client (e.g. in `lib/tmdb.ts` or `services/tmdb.ts`): (1) fetch config (base URL for images) and cache it, (2) discover movies by genre using TMDB genre IDs mapped from our 9 rooms, (3) get movie details by TMDB id, (4) find movie by IMDb id via GET /find/{imdb_id}?external_source=imdb_id, (5) get watch providers for a movie by id and optional region. Use the API key from env. Keep functions pure and easy to test."**

2. **"Map our 9 rooms (Comedy, Action, Horror, Drama, Sci-Fi, Fantasy, Romance, Thriller, Documentary) to TMDB genre IDs. Add a small module or table that returns the correct TMDB genre id(s) for each room slug so the discover API can be called per room."**

3. **"Add one minimal API route or server action that: given a room slug, returns a list of movies for that room using TMDB discover (by genre). Return only the fields we need: id, title, poster path, release date, overview snippet. This is for development and to confirm the data layer works."**

### Review checkpoint (Milestone 1)

- [ ] TMDB config (image base URL) is fetched and usable.
- [ ] Discover by room/genre returns movies; mapping room → TMDB genre is correct.
- [ ] Find by IMDb ID works (test with one known IMDb id).
- [ ] Watch providers can be fetched for a movie (with region if we use it).
- [ ] No API key in client code; all TMDB calls server-side. **→ If good, proceed to Milestone 2.**

---

## Milestone 2: App shell and 9 rooms (director-themed UI)

**Goal:** Navigation and one page per room with a distinct director-themed aesthetic (color, typography, layout hints). Dark/light mode and per-room themes. No real data yet if you prefer; can use mock or the Milestone 1 route.

### Prompts to run (in order)

1. **"Create an app shell: a global nav or layout that lists all 9 rooms as links. Each room has its own route (e.g. /rooms/comedy, /rooms/action, …). Use the room constants so we have a single source of truth. The shell should feel minimal and cinematic (reference the plan: symmetry, typography, spacing)."**

2. **"Add dark/light mode: a theme toggle (e.g. in the layout or header) that switches between light and dark. Use CSS variables or Tailwind dark: so the whole app (and later per-room themes) respect the choice. Persist the preference (e.g. localStorage or cookie) so it survives reload. Default to system preference (prefers-color-scheme) if no saved choice."**

3. **"For each of the 9 rooms, define a small theme (CSS variables or Tailwind theme): primary color, background, and font mood that match the director–room pairing (e.g. Comedy = Wes Anderson: pastels, symmetrical; Romance = Wong Kar-Wai: saturated, neon-in-darkness; Fantasy = Jodorowsky: surreal, bold). Apply the theme only to that room’s page so we can see the difference when switching rooms. Ensure room themes work in both light and dark mode."**

4. **"On each room page, show the room name and its director/aesthetic tagline. Fetch the list of movies for this room using the discover API we built in Milestone 1 and display them as a simple grid of posters (use TMDB image base URL + poster path). Add loading and error states."**

### Review checkpoint (Milestone 2)

- [ ] All 9 room routes work and are linked from the shell.
- [ ] Dark/light mode toggle works; preference is persisted and respects system default.
- [ ] Each room has a distinct look (color/type) that matches the plan’s director pairings in both themes.
- [ ] Movie grid shows real TMDB data per room; posters load.
- [ ] Navigation and layout feel minimal and on-brand. **→ If good, proceed to Milestone 3.**

---

## Milestone 3: Discovery, lists, and “I want to see…” (thematic)

**Goal:** Thematic discovery and list-backed content. Optional: iCheckMovies list import script.

### Prompts to run (in order)

1. **"Add a simple search or thematic discovery: an input like ‘I want to see a movie that…’ that maps to TMDB keyword search or search endpoint. Show results as the same kind of poster grid we use in rooms. Keep the UI minimal; we can refine copy and preset tags later."**

2. **"Design a small data model for ‘curated lists’ (e.g. name, slug, source: icheckmovies or letterboxd, list url or id). Add a way to store which lists we follow (e.g. config or DB table). For now, support at least one fixed list: e.g. IMDb Top 250 or a single iCheckMovies list. Document how we’ll resolve list entries: IMDb id → TMDB find → store TMDB id."**

3. **"Implement list import for one iCheckMovies list: either (a) a script that scrapes or uses export, gets IMDb ids, calls TMDB find for each, and saves TMDB ids + list membership to our store/DB, or (b) a manual CSV/JSON import that does the same. Document the flow and where list data lives (e.g. JSON file, SQLite, or Postgres)."**

4. **"Add a ‘Lists’ or ‘Curated lists’ area in the app: show the lists we follow and, for one list, show the movies (by TMDB id) in a grid. Movies should link to the film detail we’ll build in Milestone 5."**

### Review checkpoint (Milestone 3)

- [ ] Thematic search returns TMDB results and shows in a grid.
- [ ] At least one list is defined and list membership is stored.
- [ ] List import (script or manual) works: IMDb → TMDB find → stored.
- [ ] Lists area shows list name and movies; links to film detail (can be placeholder for now). **→ If good, proceed to Milestone 4.**

---

## Milestone 4: Proposals and upvoting

**Goal:** Users can propose a film for a room and upvote; by movie night the top-voted proposal becomes the “pick” for that room.

### Prompts to run (in order)

1. **"Design the data model for proposals: (room_slug, tmdb_movie_id, proposed_by, optional pitch text, created_at) and for votes (proposal_id, user/session, upvote). Decide whether we need auth or anonymous session id for now. Add the tables or schema (e.g. SQL or Prisma) and a simple API or server actions to create a proposal and to upvote/downvote."**

2. **"On each room page, add a ‘Propose a film’ flow: user can search or pick a movie (from TMDB search or our discover), then submit it as a proposal for this room with optional short pitch. After submit, show a success state and the proposal in the room’s proposal list."**

3. **"Show existing proposals for the room in a clear list (movie poster + title + pitch + vote count). Add upvote (and optionally downvote) controls; update count optimistically or after refetch. Sort by vote count descending."**

4. **"Add a concept of ‘movie night’ or ‘lock time’: e.g. a cutoff (e.g. 24h before) after which the top-voted proposal per room becomes the official ‘pick’. Implement a way to mark/lock the pick per room (e.g. a ‘Current pick’ or ‘Tonight’s film’ that shows the locked film). Document how we’ll set the lock (manual for MVP: button or cron)."**

5. **"Per-room history: when a pick is locked (or after movie night), record it as ‘played’ for that room. On each room page, add a section ‘Previously in this room’ (or similar) that lists films that had played there in the past (poster, title, date played). Store past picks in the same place as proposals/locks so we can query by room."**

6. **"Room polls for Discord: provide an easy way to share room polls (e.g. a shareable link like /rooms/comedy or /rooms/comedy/poll that can be pasted in Discord). Anyone with the link can add a film to the poll without logging in; when they propose a film, let them optionally enter their Discord username. Show the proposer’s Discord username on each proposal in the list."**

### Review checkpoint (Milestone 4)

- [ ] Proposals can be created per room and stored.
- [ ] Upvoting works and proposal list is sorted by votes.
- [ ] We can lock the pick per room (top proposal or manual) and show it as “Tonight’s film” or “Current pick”.
- [ ] Each room shows "Previously in this room" (past played films).
- [ ] Room poll is shareable (Discord-friendly link); proposers can add films with optional Discord username (no login).
- [ ] Flow fits with the rest of the app (browsing, lists, thematic). **→ If good, proceed to Milestone 5.**

---

## Milestone 5: Film detail page and “where to watch”

**Goal:** A film detail page (vidchuck-style): poster, synopsis, cast, and watch providers with link to TMDB (or JustWatch).

### Prompts to run (in order)

1. **"Add a film detail page route (e.g. /movie/[id] or /film/[id]) that takes TMDB id (and optional slug for SEO). Fetch movie details and watch providers from our TMDB layer. Show poster, title, year, overview, director, and main cast. Use the same aesthetic principles as the rest of the app (minimal, typography-led)."**

2. **"On the film detail page, add a ‘Where to watch’ section: show streaming/rent/buy providers from TMDB watch providers (with region from user preference or default). Display provider logos (TMDB image base URL for provider logos if available, or names). Add a single link: ‘See where to watch’ → https://www.themoviedb.org/movie/{id}/watch (or JustWatch if we add it later)."**

3. **"From every place we show a movie (room grid, list grid, search results, proposal list), link the poster or title to the film detail page. Use URL pattern /movie/{tmdb_id}-{slug} for readability and SEO, and parse tmdb_id on the server."**

### Review checkpoint (Milestone 5)

- [ ] Film detail page loads and shows correct movie data.
- [ ] Watch providers appear; link to TMDB watch page works.
- [ ] All entry points (rooms, lists, proposals, search) link to the detail page with a clean URL. **→ If good, proceed to Milestone 6.**

---

## Milestone 6: Lifecycle — lock pick, watch, discuss

**Goal:** Complete the lifecycle: lock pick for movie night, “We’re watching this,” and a simple discuss step.

### Prompts to run (in order)

1. **"On the room page, when a pick is locked, show it prominently as ‘Tonight’s film’ or ‘This week’s pick’ with a clear CTA: ‘We’re watching this’ and a link to the film detail (and optionally to a streaming service or ‘Meet at the theater’ if we have that). Reuse the same lock logic we built in Milestone 4."**

2. **"Add a simple ‘Discuss’ step: either (a) a comments or thread section on the film detail page (or on the room page for the current pick), or (b) a link out to an external discussion (e.g. Letterboxd, Discord). For (a), add a minimal schema (e.g. film_id, author, body, created_at) and UI to post and list comments. For (b), add a configurable URL or ‘Discuss on Letterboxd’ link. Document the choice."**

3. **"Optional: Add one or two static ‘Discussion prompts’ for the current pick (e.g. ‘What was your first cinema memory?’ or ‘How did this film use color?’). These can be from the plan’s films-about-cinema tone; store as copy or config per room/film type."**

### Review checkpoint (Milestone 6)

- [ ] Locked pick is visible and has a clear “We’re watching this” CTA.
- [ ] Discuss is in place (in-app comments or link-out).
- [ ] Full flow works: propose → upvote → lock → watch (link) → discuss. **→ If good, proceed to Milestone 7.**

---

## Milestone 7: Polish, copy, and deploy

**Goal:** Aesthetic pass, copy aligned with the plan, and a deployable build.

### Prompts to run (in order)

1. **"Review the plan’s aesthetic notes (Wes Anderson symmetry and pastels, Wong Kar-Wai color-as-mood, etc.) and apply a pass to the app: typography (vintage/marquee where appropriate), spacing, and one small Jodorowsky-style twist (e.g. a surreal transition or one ‘trip’ moment in the Fantasy room). Do not overdo it; keep the app minimal and elegant."**

2. **"Replace any placeholder copy with short, cinema-loving microcopy from the plan’s tone (Cinema Paradiso, Day for Night, films about cinema). Add a tagline or footer that reflects the film-club spirit. Ensure room names and director pairings are visible where it helps (e.g. room subtitle or about)."**

3. **"Add a simple region/country selector for watch providers (e.g. dropdown or settings) and persist the choice (cookie or local storage). Ensure TMDB watch-provider calls use this region."**

4. **"Prepare for deploy: ensure build passes, env vars are documented, and add a short ‘Deploy’ section to the README (e.g. Vercel, or Docker). Do not deploy yet unless we explicitly ask; just make the project deploy-ready."**

### Review checkpoint (Milestone 7)

- [ ] Visual and typography pass matches the plan’s director themes.
- [ ] Copy feels on-brand (film club, love of cinema).
- [ ] Region selector works for watch providers.
- [ ] Build is green and deploy steps are documented. **→ Final review: we’re ready to ship or iterate.**

---

## How to use this doc

- **One milestone at a time:** Run the prompts in order within each milestone.
- **Review before continuing:** Use the checkbox under each “Review checkpoint” and only then move to the next milestone.
- **Adjust as we go:** If we change the plan (e.g. add auth, skip iCheckMovies, or add Letterboxd), update this doc and the constants so the prompts stay accurate.
- **Reference:** Keep the main research/plan open for 9 rooms, director pairings, TMDB/iCheckMovies flow, and lifecycle (propose → upvote → lock → watch → discuss).
