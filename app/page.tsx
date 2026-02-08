import { getRandomQuote } from "@/lib/quotes";
import { getRandomLogoStyle } from "@/lib/logo-styles";
import { ChooseRealityButton } from "@/components/ChooseRealityButton";

export default function HomePage() {
  const { quote, attribution, source } = getRandomQuote();
  const logo = getRandomLogoStyle();
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8">
      <div className={`rounded-xl px-8 py-6 ${logo.bgClass}`}>
        <h1 className={`text-center ${logo.className}`}>
          <span className="block">Daily Fictions</span>
          <span className="block text-[0.6em] opacity-90 tracking-[0.35em]">
            FILM CLUB
          </span>
        </h1>
      </div>
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
