import { DiscoverForm } from "./DiscoverForm";

export const metadata = {
  title: "Discover | Daily Fictions",
  description: "I want to see a movie that…",
};

export default function DiscoverPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="text-2xl font-medium tracking-tight">
        I want to see a movie that…
      </h1>
      <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
        We match movie titles and theme keywords (e.g. cat, time travel). Long phrases are broken into key terms.
      </p>
      <DiscoverForm />
    </main>
  );
}
