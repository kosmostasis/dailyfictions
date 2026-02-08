# dailyfictions — Daily Fictions

A minimal film club platform: pick films by room (genre), propose and upvote, then watch and discuss together.

## Plan and scope

- **Engineering prompts (step-by-step):** [ENGINEERING_PROMPTS.md](./ENGINEERING_PROMPTS.md) — milestones and review checkpoints.
- **Research and design:** See the plan in `.cursor/plans/` for aesthetics, 9 rooms, director pairings, and APIs (TMDB, iCheckMovies, etc.).

### The 9 rooms (theater = genre)

| Room        | Director / aesthetic        |
| ----------- | --------------------------- |
| Comedy      | Wes Anderson                |
| Action      | Aesthetic-only (kinetic)    |
| Horror      | Aesthetic-only (arthouse)   |
| Drama       | Federico Fellini            |
| Sci-Fi      | Aesthetic-only (contemplative) |
| Fantasy     | Jodorowsky                  |
| Romance     | Wong Kar-Wai                |
| Thriller    | Paul Thomas Anderson        |
| Documentary | Werner Herzog               |

## Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app (Daily Fictions). Changes to the code will hot-reload so you can steer the process as we go.

## Environment

Copy `.env.example` to `.env` and add your TMDB API key:

- Get a key: **[https://www.themoviedb.org/settings/api](https://www.themoviedb.org/settings/api)**
- Do **not** commit `.env` or put a real key in the repo.

## Stack

- **Next.js** (App Router) + **TypeScript** + **Tailwind CSS**

Room and director constants live in `lib/constants.ts` and are used across the app.

## Deploy

- **Vercel:** Link the repo, set `TMDB_API_KEY` in Environment Variables, then deploy. Build command: `npm run build`; output: default.
- **Docker:** From the project root, `docker build -t dailyfictions .` (add a `Dockerfile` that runs `npm ci && npm run build && npm start` with Node 20+). Run with `TMDB_API_KEY` in the environment.
- Ensure `npm run build` passes before deploying.
