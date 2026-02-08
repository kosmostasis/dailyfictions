import { notFound } from "next/navigation";
import Link from "next/link";
import { cookies } from "next/headers";
import {
  getConfig,
  getMovieDetails,
  getMovieCredits,
  getWatchProviders,
  posterUrl,
} from "@/lib/tmdb";
import { WATCH_REGION_COOKIE, DEFAULT_WATCH_REGION } from "@/lib/regions";
import { ROOMS } from "@/lib/constants";
import { ProposeFilmBlock } from "./ProposeFilmBlock";

function providerLogoUrl(baseUrl: string, logoPath: string | null): string {
  if (!logoPath) return "";
  return `${baseUrl}w92${logoPath}`;
}

export default async function MoviePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const movieId = parseInt(id, 10);
  if (Number.isNaN(movieId)) notFound();

  const cookieStore = await cookies();
  const region = cookieStore.get(WATCH_REGION_COOKIE)?.value ?? DEFAULT_WATCH_REGION;

  let config, movie, credits, providersByRegion;
  try {
    [config, movie, credits, providersByRegion] = await Promise.all([
      getConfig(),
      getMovieDetails(movieId),
      getMovieCredits(movieId),
      getWatchProviders(movieId, region),
    ]);
  } catch {
    notFound();
  }

  const baseUrl = config.images.secure_base_url;
  const providers = providersByRegion[region];
  const directors = credits.crew.filter((c) => c.job === "Director");
  const mainCast = credits.cast.slice(0, 10);
  const year = movie.release_date ? new Date(movie.release_date).getFullYear() : null;

  return (
    <main className="min-h-screen bg-neutral-50 dark:bg-neutral-950">
      <div className="mx-auto max-w-4xl px-4 py-8">
        <Link
          href="/"
          className="mb-6 inline-block text-sm text-neutral-500 underline hover:text-neutral-700 dark:hover:text-neutral-400"
        >
          ← Home
        </Link>

        <div className="flex flex-col gap-8 sm:flex-row">
          <div className="shrink-0">
            <div className="aspect-[2/3] w-48 overflow-hidden rounded-lg bg-neutral-200 dark:bg-neutral-800 sm:w-56">
              {movie.poster_path ? (
                <img
                  src={posterUrl(baseUrl, movie.poster_path)}
                  alt=""
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full items-center justify-center text-neutral-500">—</div>
              )}
            </div>
          </div>

          <div className="min-w-0 flex-1">
            <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
              {movie.title}
            </h1>
            {year != null && (
              <p className="mt-1 text-neutral-500 dark:text-neutral-400">{year}</p>
            )}
            {directors.length > 0 && (
              <p className="mt-2 text-sm">
                Director{directors.length > 1 ? "s" : ""}:{" "}
                {directors.map((d) => d.name).join(", ")}
              </p>
            )}
            {movie.overview && (
              <p className="mt-4 leading-relaxed text-neutral-700 dark:text-neutral-300">
                {movie.overview}
              </p>
            )}
            {mainCast.length > 0 && (
              <div className="mt-6">
                <h2 className="text-sm font-medium text-neutral-500 dark:text-neutral-400">
                  Cast
                </h2>
                <p className="mt-1 text-sm">
                  {mainCast
                    .map((c) => (c.character ? `${c.name} (${c.character})` : c.name))
                    .join(" · ")}
                </p>
              </div>
            )}
          </div>
        </div>

        <ProposeFilmBlock movieId={movieId} rooms={ROOMS.map((r) => ({ slug: r.slug, name: r.name }))} />

        <section className="mt-10">
          <h2 className="text-lg font-medium">Where to watch</h2>
          <div className="mt-3 flex flex-wrap items-center gap-4">
            {providers?.flatrate && providers.flatrate.length > 0 && (
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-sm text-neutral-500 dark:text-neutral-400">Stream</span>
                {providers.flatrate.map((p) => (
                  <span
                    key={p.provider_id}
                    className="inline-flex items-center gap-1.5 rounded border border-neutral-200 bg-white px-2 py-1 text-sm dark:border-neutral-700 dark:bg-neutral-900"
                    title={p.provider_name}
                  >
                    {p.logo_path ? (
                      <img
                        src={providerLogoUrl(baseUrl, p.logo_path)}
                        alt=""
                        className="h-5 w-5 object-contain"
                      />
                    ) : null}
                    <span>{p.provider_name}</span>
                  </span>
                ))}
              </div>
            )}
            {providers?.rent && providers.rent.length > 0 && (
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-sm text-neutral-500 dark:text-neutral-400">Rent</span>
                {providers.rent.map((p) => (
                  <span
                    key={p.provider_id}
                    className="inline-flex items-center gap-1.5 rounded border border-neutral-200 bg-white px-2 py-1 text-sm dark:border-neutral-700 dark:bg-neutral-900"
                    title={p.provider_name}
                  >
                    {p.logo_path ? (
                      <img
                        src={providerLogoUrl(baseUrl, p.logo_path)}
                        alt=""
                        className="h-5 w-5 object-contain"
                      />
                    ) : null}
                    <span>{p.provider_name}</span>
                  </span>
                ))}
              </div>
            )}
            {providers?.buy && providers.buy.length > 0 && (
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-sm text-neutral-500 dark:text-neutral-400">Buy</span>
                {providers.buy.map((p) => (
                  <span
                    key={p.provider_id}
                    className="inline-flex items-center gap-1.5 rounded border border-neutral-200 bg-white px-2 py-1 text-sm dark:border-neutral-700 dark:bg-neutral-900"
                    title={p.provider_name}
                  >
                    {p.logo_path ? (
                      <img
                        src={providerLogoUrl(baseUrl, p.logo_path)}
                        alt=""
                        className="h-5 w-5 object-contain"
                      />
                    ) : null}
                    <span>{p.provider_name}</span>
                  </span>
                ))}
              </div>
            )}
            {(!providers || (!providers.flatrate?.length && !providers.rent?.length && !providers.buy?.length)) && (
              <p className="text-sm text-neutral-500 dark:text-neutral-400">
                No providers listed for this region.
              </p>
            )}
          </div>
          <a
            href={`https://www.themoviedb.org/movie/${movieId}/watch`}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 inline-block text-sm text-sky-600 underline dark:text-sky-400"
          >
            See where to watch on TMDB →
          </a>
        </section>

        <section className="mt-10">
          <h2 className="text-lg font-medium">Discuss</h2>
          <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
            Talk about this film with the club or elsewhere.
          </p>
          <div className="mt-3 flex flex-wrap gap-3">
            <a
              href={`https://www.themoviedb.org/movie/${movieId}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block text-sm text-sky-600 underline dark:text-sky-400"
            >
              TMDB
            </a>
            {movie.imdb_id && (
              <a
                href={`https://www.imdb.com/title/${movie.imdb_id}/`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block text-sm text-sky-600 underline dark:text-sky-400"
              >
                IMDb
              </a>
            )}
            <a
              href={`https://www.rottentomatoes.com/search?search=${encodeURIComponent(movie.title)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block text-sm text-sky-600 underline dark:text-sky-400"
            >
              Rotten Tomatoes
            </a>
            <a
              href={`https://letterboxd.com/search/${encodeURIComponent(movie.title)}/`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block text-sm text-sky-600 underline dark:text-sky-400"
            >
              Letterboxd
            </a>
          </div>
        </section>
      </div>
    </main>
  );
}
