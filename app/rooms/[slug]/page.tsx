import { notFound } from "next/navigation";
import Link from "next/link";
import { getRoomBySlug, isRoomSlug } from "@/lib/constants";
import { ROOM_THEMES } from "@/lib/room-themes";
import { getLocked, getPlayed } from "@/lib/polls";
import {
  getConfig,
  getGenreIdForRoom,
  discoverMoviesByGenreHighlyRated,
  getMovieDetails,
  posterUrl,
} from "@/lib/tmdb";
import { RoomPolls } from "./RoomPolls";
import { RoomProposeForm } from "./RoomProposeForm";
import { RoomGenreDropdown } from "./RoomGenreDropdown";
import { GenreIcon } from "@/components/GenreIcon";

/** Day-based seed so "In this room we could watch" cycles over time (new page each day). */
function getCyclePage(): number {
  const dayIndex = Math.floor(Date.now() / 86400000);
  return (dayIndex % 15) + 1; // pages 1–15
}

async function getMovies(slug: string) {
  // #region agent log
  fetch("http://127.0.0.1:7242/ingest/78e219bc-79e7-4277-b148-e1833a36a616", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      location: "app/rooms/[slug]/page.tsx:getMovies:entry",
      message: "getMovies entry",
      data: { slug },
      timestamp: Date.now(),
      hypothesisId: "H2",
    }),
  }).catch(() => {});
  // #endregion
  const genreId = getGenreIdForRoom(slug);
  if (genreId == null) {
    // #region agent log
    fetch("http://127.0.0.1:7242/ingest/78e219bc-79e7-4277-b148-e1833a36a616", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        location: "app/rooms/[slug]/page.tsx:getMovies:genreNull",
        message: "genreId is null, returning null",
        data: { slug },
        timestamp: Date.now(),
        hypothesisId: "H2",
      }),
    }).catch(() => {});
    // #endregion
    return null;
  }
  try {
    const cyclePage = getCyclePage();
    // #region agent log
    fetch("http://127.0.0.1:7242/ingest/78e219bc-79e7-4277-b148-e1833a36a616", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        location: "app/rooms/[slug]/page.tsx:getMovies:beforeDiscover",
        message: "before discover",
        data: { slug, genreId, page: cyclePage },
        timestamp: Date.now(),
        hypothesisId: "H4",
      }),
    }).catch(() => {});
    // #endregion
    let [config, discover] = await Promise.all([
      getConfig(),
      discoverMoviesByGenreHighlyRated(genreId, cyclePage),
    ]);
    // When cycle page exceeds total_pages, TMDB returns empty results. Wrap to a valid page.
    if (discover.results.length === 0 && discover.total_pages >= 1) {
      const safePage = ((cyclePage - 1) % discover.total_pages) + 1;
      discover = await discoverMoviesByGenreHighlyRated(genreId, safePage);
    }
    const count = discover.results.length;
    const slice = discover.results.slice(0, 20);
    // #region agent log
    fetch("http://127.0.0.1:7242/ingest/78e219bc-79e7-4277-b148-e1833a36a616", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        location: "app/rooms/[slug]/page.tsx:getMovies:afterDiscover",
        message: "after discover",
        data: { slug, genreId, page: cyclePage, resultsCount: count, totalPages: discover.total_pages, returnedCount: slice.length },
        timestamp: Date.now(),
        hypothesisId: "H4",
        runId: "post-fix",
      }),
    }).catch(() => {});
    // #endregion
    const baseUrl = config.images.secure_base_url;
    return slice.map((m) => ({
      id: m.id,
      title: m.title,
      posterUrl: posterUrl(baseUrl, m.poster_path),
      releaseDate: m.release_date ?? "",
    }));
  } catch (err) {
    // #region agent log
    fetch("http://127.0.0.1:7242/ingest/78e219bc-79e7-4277-b148-e1833a36a616", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        location: "app/rooms/[slug]/page.tsx:getMovies:catch",
        message: "getMovies threw",
        data: {
          slug,
          genreId,
          errorMessage: err instanceof Error ? err.message : String(err),
        },
        timestamp: Date.now(),
        hypothesisId: "H1",
        runId: "H3",
      }),
    }).catch(() => {});
    // #endregion
    return null;
  }
}

async function getPlayedWithDetails(slug: string) {
  const played = await getPlayed(slug);
  const slice = played.slice(0, 10);
  if (slice.length === 0) return [];
  const [config, ...details] = await Promise.all([
    getConfig(),
    ...slice.map((e) => getMovieDetails(e.tmdb_movie_id)),
  ]);
  const baseUrl = config.images.secure_base_url;
  return slice.map((e, i) => ({
    tmdb_movie_id: e.tmdb_movie_id,
    locked_at: e.locked_at,
    title: details[i]?.title,
    poster_url: details[i] ? posterUrl(baseUrl, details[i].poster_path) : "",
  }));
}

export default async function RoomPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  if (!isRoomSlug(slug)) notFound();

  const room = getRoomBySlug(slug);
  if (!room) notFound();

  const [movies, lockedRaw, played] = await Promise.all([
    getMovies(slug),
    getLocked(slug),
    getPlayedWithDetails(slug),
  ]);
  const locked = lockedRaw
    ? { ...lockedRaw, title: (await getMovieDetails(lockedRaw.tmdb_movie_id).catch(() => null))?.title }
    : null;
  const theme = ROOM_THEMES[slug];
  const themeClass = `${theme.light} ${theme.dark}`;

  return (
    <div className={`min-h-screen ${themeClass}`}>
      <div className="mx-auto max-w-6xl px-4 py-8">
        <div className="mb-8 flex flex-wrap items-center gap-4">
          <h1 className="flex items-center gap-2">
            <GenreIcon slug={slug} />
            <span className="sr-only">{room.name}</span>
          </h1>
          <RoomGenreDropdown currentSlug={slug} />
        </div>

        {locked && (
          <section className={`mb-8 rounded-lg border-2 p-5 ${theme.accent.pickSection}`}>
            <h2 className={`mb-2 text-sm font-medium uppercase tracking-wider ${theme.accent.pickHeading}`}>
              Tonight&apos;s pick
            </h2>
            <p className={`mb-3 font-medium ${theme.accent.pickTitle}`}>
              {locked.title ?? `Movie #${locked.tmdb_movie_id}`}
            </p>
            <Link
              href={`/movie/${locked.tmdb_movie_id}`}
              className={`inline-flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium ${theme.accent.ctaButton}`}
            >
              We&apos;re watching this →
            </Link>
          </section>
        )}

        <RoomPolls slug={slug} />

        <RoomProposeForm slug={slug} />

        <section className="mt-10">
          <h2 className="mb-4 text-sm font-medium uppercase tracking-wider opacity-70">
            In this room we could watch…
          </h2>
          {movies && movies.length > 0 ? (
            <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
              {movies.map((m) => (
                <li key={m.id}>
                  <Link
                    href={`/movie/${m.id}`}
                    className="block overflow-hidden rounded-lg border border-neutral-200/80 bg-white/50 shadow-sm transition hover:shadow dark:border-neutral-700/80 dark:bg-black/20"
                  >
                    <div className="aspect-[2/3] w-full overflow-hidden bg-neutral-200 dark:bg-neutral-800">
                      {m.posterUrl ? (
                        <img
                          src={m.posterUrl}
                          alt=""
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center text-xs opacity-50">
                          No poster
                        </div>
                      )}
                    </div>
                    <div className="p-2">
                      <p className="truncate text-sm font-medium">{m.title}</p>
                      {m.releaseDate && (
                        <p className="text-xs opacity-70">
                          {String(m.releaseDate).slice(0, 4)}
                        </p>
                      )}
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p className="rounded-lg border border-dashed border-neutral-300 bg-neutral-50/50 px-4 py-8 text-center text-sm text-neutral-500 dark:border-neutral-700 dark:bg-neutral-900/30 dark:text-neutral-400">
              No movies loaded. Check TMDB_API_KEY and try again.
            </p>
          )}
        </section>

        {played.length > 0 && (
          <section className="mt-10">
            <h2 className="mb-4 text-sm font-medium uppercase tracking-wider opacity-70">
              Previously in this room
            </h2>
            <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
              {played.map((p) => (
                <li key={`${p.tmdb_movie_id}-${p.locked_at}`}>
                  <Link
                    href={`/movie/${p.tmdb_movie_id}`}
                    className="block overflow-hidden rounded-lg border border-neutral-200/80 bg-white/50 shadow-sm dark:border-neutral-700/80 dark:bg-black/20"
                  >
                    <div className="aspect-[2/3] w-full overflow-hidden bg-neutral-200 dark:bg-neutral-800">
                      {p.poster_url ? (
                        <img src={p.poster_url} alt="" className="h-full w-full object-cover" />
                      ) : (
                        <div className="flex h-full items-center justify-center text-xs opacity-50">—</div>
                      )}
                    </div>
                    <div className="p-2">
                      <p className="truncate text-sm font-medium">{p.title ?? `#${p.tmdb_movie_id}`}</p>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>
    </div>
  );
}
