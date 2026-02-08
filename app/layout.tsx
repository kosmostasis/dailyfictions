import type { Metadata } from "next";
import Link from "next/link";
import { cookies } from "next/headers";
import "./globals.css";
import { WATCH_REGION_COOKIE, DEFAULT_WATCH_REGION } from "@/lib/regions";
import { ThemeToggle, ThemeInitScript } from "@/components/ThemeToggle";
import { HeaderLogo } from "@/components/HeaderLogo";
import { RegionSelector } from "@/components/RegionSelector";

export const metadata: Metadata = {
  title: "Daily Fictions",
  description: "Choose your reality. Pick, watch, and discuss films together.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const watchRegion = cookieStore.get(WATCH_REGION_COOKIE)?.value ?? DEFAULT_WATCH_REGION;
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased min-h-screen bg-neutral-50 text-neutral-900 dark:bg-neutral-950 dark:text-neutral-100">
        <ThemeInitScript />
        <header className="border-b border-neutral-200 dark:border-neutral-800">
          <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
            <HeaderLogo />
            <nav className="flex flex-wrap items-center gap-1">
              <Link
                href="/discover"
                className="rounded-md px-2 py-1.5 text-sm text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900 dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-neutral-100"
              >
                Discover
              </Link>
              <Link
                href="/lists"
                className="rounded-md px-2 py-1.5 text-sm text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900 dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-neutral-100"
              >
                Movie Lists
              </Link>
              <Link
                href="/polls"
                className="rounded-md px-2 py-1.5 text-sm text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900 dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-neutral-100"
              >
                Polls
              </Link>
              <ThemeToggle />
            </nav>
          </div>
        </header>
        <main>{children}</main>
        <footer className="mt-auto border-t border-neutral-200 py-3 dark:border-neutral-800">
          <div className="mx-auto flex max-w-6xl flex-col items-end gap-2 px-4 sm:flex-row sm:justify-between sm:items-center">
            <p className="text-sm text-neutral-500 dark:text-neutral-400">
              <a
                href="https://github.com/kosmostasis/dailyfictions"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline"
              >
                Coded with &lt;3
              </a>
              {" by "}
              <a
                href="https://x.com/kosmostasis"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline"
              >
                kosmostasis#1984
              </a>
            </p>
            <RegionSelector initialRegion={watchRegion} />
          </div>
        </footer>
      </body>
    </html>
  );
}
