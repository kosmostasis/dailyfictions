import { notFound } from "next/navigation";
import Link from "next/link";
import { getListBySlug, getListMovieIds } from "@/lib/lists";
import { getConfig, getMovieDetails, posterUrl } from "@/lib/tmdb";

async function getListMovies(slug: string) {
  const ids = await getListMovieIds(slug);
  const limit = 24;
  const slice = ids.slice(0, limit);
  if (slice.length === 0) return [];
  const [config, ...details] = await Promise.all([
    getConfig(),
    ...slice.map((id) => getMovieDetails(id)),
  ]);
  const baseUrl = config.images.secure_base_url;
  return details.map((m) => ({
    id: m.id,
    title: m.title,
    posterUrl: posterUrl(baseUrl, m.poster_path),
    releaseDate: m.release_date ?? "",
  }));
}

export default async function ListDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [list, movies] = await Promise.all([
    getListBySlug(slug),
    getListMovies(slug),
  ]);
  if (!list) notFound();

  return (
    <main className="mx-auto max-w-6xl px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-medium tracking-tight">{list.name}</h1>
        {list.description && (
          <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
            {list.description}
          </p>
        )}
      </div>
      {movies.length > 0 ? (
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
        <p className="text-sm text-neutral-500 dark:text-neutral-400">
          No movies in this list yet.
        </p>
      )}
    </main>
  );
}
