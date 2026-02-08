# dailyfictions — Daily Fictions

A minimal film club app: browse by genre (rooms), propose and upvote films, lock “tonight’s pick,” and see where to watch. Data from TMDB; optional links to iCheckMovies and curated lists.

## What it does

- **Rooms (by genre)** — 10 rooms: Comedy, Action, Horror, Drama, Sci-Fi, Fantasy, Romance, Thriller, Documentary, Animation. Each room has a distinct palette and optional director-inspired tagline. From a room you can:
  - See **tonight’s pick** (one locked film per room)
  - **Propose** a film (search by title) and **upvote** others’ proposals
  - Browse **“In this room we could watch…”** — highly-rated TMDB titles in that genre, cycled by day
  - See **previously played** films in that room
- **Discover** — “I want to see a movie that…” — search by phrase or keywords (e.g. “cat”, “time travel”); results are matched from TMDB.
- **Movie Lists** — Curated lists (e.g. TSPDT, Sight & Sound) with descriptions and links to sources or iCheckMovies. Open a list to browse titles and get ideas for proposals.
- **Polls** — Overview of all proposals and votes across rooms; films with 5+ upvotes are highlighted.
- **Movie page** — For any film: poster, title, year, directors, cast, overview, and **where to watch** (stream/rent/buy) for your chosen region.
- **Watch region** — Footer control to set your country; “Where to watch” uses this for TMDB provider results.
- **Dark/light theme** — Toggle in the header.

## Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Code changes hot-reload.

## Environment

Copy `.env.example` to `.env` and add your TMDB API key:

- Get a key: **[https://www.themoviedb.org/settings/api](https://www.themoviedb.org/settings/api)**
- Do **not** commit `.env` or put a real key in the repo.

## Stack

- **Next.js** (App Router) + **TypeScript** + **Tailwind CSS**

Room and director config: `lib/constants.ts`. List definitions: `lib/lists.ts`.

## Deploy

- **Vercel:** Link the repo, set `TMDB_API_KEY` in Environment Variables, then deploy. Build: `npm run build`; output: default.
- **Docker:** From project root: `docker build -t dailyfictions .` (use a Dockerfile that runs `npm ci && npm run build && npm start` with Node 20+). Run with `TMDB_API_KEY` in the environment.
- Ensure `npm run build` passes before deploying.

## Reference

- **Engineering prompts:** [ENGINEERING_PROMPTS.md](./ENGINEERING_PROMPTS.md) — milestones and checkpoints.
- **Design/plans:** `.cursor/plans/` — aesthetics, rooms, director pairings, APIs.
