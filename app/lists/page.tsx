import Link from "next/link";
import { getListDefinitions } from "@/lib/lists";

export const metadata = {
  title: "Movie Lists | Daily Fictions",
  description: "Curated film lists to gather ideas and discover films.",
};

export default async function ListsPage() {
  const lists = await getListDefinitions();
  return (
    <main className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="text-2xl font-medium tracking-tight">Movie Lists</h1>

      <section className="mt-2">
        <h2 className="text-lg font-medium text-neutral-800 dark:text-neutral-200">Curated lists</h2>
        <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-400">
          This space is for you to gather ideas, discover films, and explore official top lists from critics and audiences. Pick a list to browse and find something to propose in a room.
        </p>
      </section>

      <ul className="mt-8 space-y-4">
        {lists.map((list) => (
          <li key={list.slug} className="rounded-lg border border-neutral-200 bg-white dark:border-neutral-700 dark:bg-neutral-900/50">
            <Link href={`/lists/${list.slug}`} className="block px-4 pt-4 transition hover:shadow">
              <h3 className="font-medium">{list.name}</h3>
              {list.description && (
                <p className="mt-1.5 line-clamp-4 text-sm text-neutral-500 dark:text-neutral-400">
                  {list.description}
                </p>
              )}
            </Link>
            {list.sourceUrl && (
              <p className="border-t border-neutral-100 px-4 py-2 dark:border-neutral-800">
                <a
                  href={list.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-sky-600 underline dark:text-sky-400"
                >
                  View list source on iCheckMovies →
                </a>
              </p>
            )}
          </li>
        ))}
      </ul>
    </main>
  );
}
