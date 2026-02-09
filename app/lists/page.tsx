import Link from "next/link";
import { getListDefinitions, getListMovies } from "@/lib/lists";

export const metadata = {
  title: "Movie Lists | Daily Fictions",
  description: "Curated film lists to gather ideas and discover films.",
};

const PREVIEW_COUNT = 12;
const PREVIEW_POOL = 24; // fetch extra so we can skip films already shown in other lists

export default async function ListsPage() {
  const lists = await getListDefinitions();
  const pools = await Promise.all(
    lists.map((list) => getListMovies(list.slug, PREVIEW_POOL))
  );
  // Prefer films not already shown in a previous list (reduce repetition across previews)
  const seenIds = new Set<number>();
  const previews = pools.map((movies) => {
    const pick = movies.filter((m) => !seenIds.has(m.id)).slice(0, PREVIEW_COUNT);
    pick.forEach((m) => seenIds.add(m.id));
    return pick.length > 0 ? pick : movies.slice(0, PREVIEW_COUNT); // fallback if all seen
  });
  return (
    <main className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="text-2xl font-medium tracking-tight">Curated Movie Lists</h1>

      <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">
        This space is for you to gather ideas, discover films, and explore official top lists from critics and audiences. Pick a list to browse and find something to propose in a room.
      </p>

      <ul className="mt-8 space-y-4">
        {lists.map((list, i) => {
          const movies = previews[i] ?? [];
          return (
            <li key={list.slug} className="rounded-lg border border-neutral-200 bg-white dark:border-neutral-700 dark:bg-neutral-900/50">
              <Link href={`/lists/${list.slug}`} className="block px-4 pt-4 transition hover:shadow">
                <h3 className="font-medium">{list.name}</h3>
                {list.description && (
                  <p className="mt-1.5 line-clamp-4 text-sm text-neutral-500 dark:text-neutral-400">
                    {list.description}
                  </p>
                )}
              </Link>
              {movies.length > 0 && (
                <div className="border-t border-neutral-100 px-4 py-3 dark:border-neutral-800">
                  <p className="mb-2 text-xs font-medium text-neutral-500 dark:text-neutral-400">
                    Preview — first {movies.length} films
                  </p>
                  <ul className="flex gap-2 overflow-x-auto pb-1">
                    {movies.map((m) => (
                      <li key={m.id} className="shrink-0">
                        <Link
                          href={`/movie/${m.id}`}
                          className="block w-14 overflow-hidden rounded border border-neutral-200 bg-neutral-100 dark:border-neutral-700 dark:bg-neutral-800"
                          title={m.title}
                        >
                          <div className="aspect-[2/3] w-14">
                            {m.posterUrl ? (
                              <img src={m.posterUrl} alt="" className="h-full w-full object-cover" />
                            ) : (
                              <div className="flex h-full items-center justify-center text-[10px] text-neutral-400">—</div>
                            )}
                          </div>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {list.sourceUrl && (
                <p className="border-t border-neutral-100 px-4 py-2 dark:border-neutral-800">
                  <a
                    href={list.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-sky-600 underline dark:text-sky-400"
                  >
                    {list.icheckMoviesOnly ? "View full list on iCheckMovies →" : "View full list →"}
                  </a>
                </p>
              )}
            </li>
          );
        })}
      </ul>
    </main>
  );
}
