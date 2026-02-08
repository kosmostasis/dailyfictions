/**
 * Parse officialtoplists.csv (name, description, url only; ignore favouritecount, dislikedcount, favorite, disliked, watchlist).
 * Handles quoted fields with embedded newlines and commas.
 */

import { readFile } from "fs/promises";
import path from "path";

export interface OfficialListRow {
  name: string;
  description: string;
  url: string;
}

/** Extract slug from iCheckMovies list URL: /lists/NAME/ -> name with + replaced by - */
function slugFromUrl(url: string): string {
  try {
    const u = new URL(url);
    const segment = u.pathname.replace(/^\/lists\/|\/$/g, "").trim();
    return segment ? segment.replace(/\+/g, "-") : "";
  } catch {
    return "";
  }
}

/** Parse CSV with quoted fields that may contain newlines and commas */
function parseCsvRows(raw: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let field = "";
  let inQuotes = false;
  for (let i = 0; i < raw.length; i++) {
    const c = raw[i];
    if (inQuotes) {
      if (c === '"') {
        if (raw[i + 1] === '"') {
          field += '"';
          i++;
        } else {
          inQuotes = false;
        }
      } else {
        field += c;
      }
      continue;
    }
    if (c === '"') {
      inQuotes = true;
      continue;
    }
    if (c === ",") {
      row.push(field.trim());
      field = "";
      continue;
    }
    if (c === "\n" || c === "\r") {
      if (c === "\r" && raw[i + 1] === "\n") i++;
      row.push(field.trim());
      field = "";
      if (row.some((cell) => cell !== "")) rows.push(row);
      row = [];
      continue;
    }
    field += c;
  }
  if (field !== "" || row.length > 0) {
    row.push(field.trim());
    if (row.some((cell) => cell !== "")) rows.push(row);
  }
  return rows;
}

const CSV_PATH = path.join(process.cwd(), "data", "officialtoplists.csv");

export async function getOfficialListsFromCsv(): Promise<OfficialListRow[]> {
  const raw = await readFile(CSV_PATH, "utf-8");
  const rows = parseCsvRows(raw);
  if (rows.length < 2) return [];
  const header = rows[0].map((h) => h.toLowerCase());
  const nameIdx = header.indexOf("name");
  const descIdx = header.indexOf("description");
  const urlIdx = header.indexOf("url");
  if (nameIdx < 0 || descIdx < 0 || urlIdx < 0) return [];
  const out: OfficialListRow[] = [];
  for (let r = 1; r < rows.length; r++) {
    const row = rows[r];
    const name = row[nameIdx] ?? "";
    const description = row[descIdx] ?? "";
    const url = (row[urlIdx] ?? "").trim();
    if (name) out.push({ name, description, url });
  }
  return out;
}

export function slugFromListUrl(url: string): string {
  return slugFromUrl(url);
}
