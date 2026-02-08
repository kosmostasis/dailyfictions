"use client";

import { useRouter } from "next/navigation";
import { WATCH_REGIONS, WATCH_REGION_COOKIE, DEFAULT_WATCH_REGION } from "@/lib/regions";

const COOKIE_MAX_AGE = 60 * 60 * 24 * 365; // 1 year
const VALID_CODES = new Set(WATCH_REGIONS.map((r) => r.code));

function getStoredRegion(): string {
  if (typeof document === "undefined") return DEFAULT_WATCH_REGION;
  const match = document.cookie.match(new RegExp(`(?:^|; )${WATCH_REGION_COOKIE}=([^;]*)`));
  const value = match ? decodeURIComponent(match[1]) : DEFAULT_WATCH_REGION;
  return VALID_CODES.has(value) ? value : DEFAULT_WATCH_REGION;
}

function normalizeRegion(initial: string): string {
  return VALID_CODES.has(initial) ? initial : DEFAULT_WATCH_REGION;
}

export function RegionSelector({ initialRegion }: { initialRegion: string }) {
  const router = useRouter();
  const region = typeof window !== "undefined" ? getStoredRegion() : normalizeRegion(initialRegion);

  function setRegion(code: string) {
    document.cookie = `${WATCH_REGION_COOKIE}=${encodeURIComponent(code)}; path=/; max-age=${COOKIE_MAX_AGE}; SameSite=Lax`;
    router.refresh();
  }

  return (
    <select
      value={region}
      onChange={(e) => setRegion(e.target.value)}
      className="rounded-md border border-neutral-300 bg-white px-2 py-1 text-sm text-neutral-700 dark:border-neutral-600 dark:bg-neutral-800 dark:text-neutral-200"
      aria-label="Watch region"
    >
      {WATCH_REGIONS.map((r) => (
        <option key={r.code} value={r.code}>
          {r.name}
        </option>
      ))}
    </select>
  );
}
