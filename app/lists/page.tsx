import Link from "next/link";
import { getListDefinitions } from "@/lib/lists";

export const metadata = {
  title: "Lists | Daily Fictions",
  description: "Curated film lists.",
};

export default async function ListsPage() {
  const lists = await getListDefinitions();
  return (
    <main className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="text-2xl font-medium tracking-tight">Curated lists</h1>
      <ul className="mt-8 space-y-3">
        {lists.map((list) => (
          <li key={list.slug}>
            <Link
              href={`/lists/${list.slug}`}
              className="block rounded-lg border border-neutral-200 bg-white px-4 py-3 transition hover:border-neutral-300 hover:shadow dark:border-neutral-700 dark:bg-neutral-900/50 dark:hover:border-neutral-600"
            >
              <span className="font-medium">{list.name}</span>
              {list.description && (
                <p className="mt-0.5 text-sm text-neutral-500 dark:text-neutral-400">
                  {list.description}
                </p>
              )}
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
