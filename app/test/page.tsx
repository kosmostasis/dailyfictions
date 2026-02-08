import Link from "next/link";
import { LOGO_STYLES } from "@/lib/logo-styles";

export const metadata = {
  title: "Logo options | Daily Fictions",
  description: "Typographic logo options for Daily Fictions Film Club.",
};

const LOGO_OPTION_LABELS: { name: string; reference: string }[] = [
  { name: "Wes Anderson", reference: "Moonrise Kingdom, Grand Budapest Hotel — vintage title cards, centered serif, warm on cream" },
  { name: "Wong Kar-Wai", reference: "In the Mood for Love, Chungking Express — neon signs, Hong Kong night, glowing condensed type" },
  { name: "Alejandro Jodorowsky", reference: "El Topo, The Holy Mountain — surreal, bold, mystical, slightly unhinged" },
  { name: "Federico Fellini", reference: "8½, La Dolce Vita — baroque, dreamlike, Italian cinema lettering" },
  { name: "Paul Thomas Anderson", reference: "There Will Be Blood, Phantom Thread — minimal, elegant, high contrast" },
  { name: "Werner Herzog", reference: "Documentary title cards — raw, simple text over landscape, no flourish" },
  { name: "Classic cinema marquee", reference: "Old Hollywood title cards — all caps, serif, timeless" },
];

function LogoBlock({
  style,
  label,
  showReference,
}: {
  style: (typeof LOGO_STYLES)[number];
  label: { name: string; reference: string };
  showReference?: boolean;
}) {
  return (
    <div
      className={`flex min-h-[180px] flex-col items-center justify-center rounded-xl border border-neutral-200 p-8 dark:border-neutral-700 ${style.bgClass}`}
    >
      <div className={`text-center ${style.className}`}>
        <span className="block">Daily Fictions</span>
        <span className="block text-[0.6em] opacity-90 tracking-[0.35em]">
          FILM CLUB
        </span>
      </div>
      {showReference && (
        <p className="mt-4 text-center text-xs text-neutral-500 dark:text-neutral-400">
          {label.reference}
        </p>
      )}
    </div>
  );
}

export default function TestPage() {
  const index = Math.floor(Math.random() * LOGO_STYLES.length);
  const style = LOGO_STYLES[index];
  const label = LOGO_OPTION_LABELS[index];
  return (
    <main className="mx-auto max-w-4xl px-4 py-12">
      <Link
        href="/"
        className="mb-8 inline-block text-sm text-neutral-500 underline dark:text-neutral-400"
      >
        ← Home
      </Link>
      <h1 className="text-2xl font-medium tracking-tight">
        Typographic logo options
      </h1>
      <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">
        “Daily Fictions Film Club” in styles inspired by title sequences and
        aesthetics of our room directors. Refresh the page to cycle through all 7.
      </p>
      <div className="mt-10">
        <p className="mb-2 text-sm font-medium text-neutral-700 dark:text-neutral-300">
          {label.name} <span className="font-normal text-neutral-500">({index + 1} of 7)</span>
        </p>
        <LogoBlock style={style} label={label} showReference />
      </div>
      <p className="mt-6 text-center text-sm text-neutral-500 dark:text-neutral-400">
        Refresh to see another option.
      </p>
    </main>
  );
}
