"use client";

import { SunMoonIcon } from "./SunMoonIcon";

const STORAGE_KEY = "dailyfictions-theme";

function getStored(): "light" | "dark" | null {
  if (typeof window === "undefined") return null;
  const t = localStorage.getItem(STORAGE_KEY);
  if (t === "light" || t === "dark") return t;
  return null;
}

function applyTheme(theme: "light" | "dark") {
  const root = document.documentElement;
  root.classList.remove("light", "dark");
  root.classList.add(theme);
  root.setAttribute("data-theme", theme);
}

function getSystemTheme(): "light" | "dark" {
  if (typeof window === "undefined") return "light";
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

export function ThemeToggle() {
  function handleToggle() {
    const stored = getStored();
    const system = getSystemTheme();
    const next: "light" | "dark" = stored
      ? stored === "light"
        ? "dark"
        : "light"
      : system === "light"
        ? "dark"
        : "light";
    localStorage.setItem(STORAGE_KEY, next);
    applyTheme(next);
  }

  return (
    <button
      type="button"
      onClick={handleToggle}
      className="rounded-md p-2 text-neutral-600 hover:bg-neutral-200 hover:text-neutral-900 dark:text-neutral-400 dark:hover:bg-neutral-700 dark:hover:text-neutral-100"
      aria-label="Toggle light/dark mode"
    >
      <SunMoonIcon className="size-5" />
    </button>
  );
}

/** Call from layout to set initial theme (no flash). Run once on client. */
export function ThemeInitScript() {
  const script = `
(function() {
  var key = '${STORAGE_KEY}';
  var stored = localStorage.getItem(key);
  var theme = stored === 'dark' || stored === 'light' ? stored : (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  document.documentElement.classList.add(theme);
  document.documentElement.setAttribute('data-theme', theme);
})();
`;
  return <script dangerouslySetInnerHTML={{ __html: script }} />;
}
