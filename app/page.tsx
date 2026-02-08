import { getRandomQuote } from "@/lib/quotes";
import { ChooseRealityButton } from "@/components/ChooseRealityButton";

export default function HomePage() {
  const { quote, attribution, source } = getRandomQuote();
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8">
      <h1 className="text-4xl font-medium tracking-tight">Daily Fictions</h1>
      <ChooseRealityButton />
      <blockquote className="mt-8 max-w-md text-center text-sm italic text-neutral-500 dark:text-neutral-400">
        &ldquo;{quote}&rdquo;
      </blockquote>
      <footer className="mt-2 text-xs text-neutral-400 dark:text-neutral-500">
        — {attribution}
        {source ? <cite className="not-italic">, {source}</cite> : null}
      </footer>
    </main>
  );
}
