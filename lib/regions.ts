/**
 * Watch provider regions (TMDB uses ISO 3166-1 alpha-2).
 * Default: Malaysia (MY).
 */

export const DEFAULT_WATCH_REGION = "MY";

export const WATCH_REGIONS: { code: string; name: string }[] = [
  { code: "MY", name: "Malaysia" },
  { code: "US", name: "United States" },
  { code: "GB", name: "United Kingdom" },
  { code: "SG", name: "Singapore" },
  { code: "AU", name: "Australia" },
  { code: "DE", name: "Germany" },
  { code: "FR", name: "France" },
  { code: "JP", name: "Japan" },
  { code: "IN", name: "India" },
  { code: "CA", name: "Canada" },
  { code: "BR", name: "Brazil" },
  { code: "KR", name: "South Korea" },
  { code: "ES", name: "Spain" },
  { code: "IT", name: "Italy" },
  { code: "NL", name: "Netherlands" },
  { code: "MX", name: "Mexico" },
  { code: "ID", name: "Indonesia" },
  { code: "TH", name: "Thailand" },
  { code: "PH", name: "Philippines" },
];

export const WATCH_REGION_COOKIE = "watch_region";
