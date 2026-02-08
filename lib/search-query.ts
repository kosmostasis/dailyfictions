/**
 * Extract significant terms from a long search query for TMDB keyword search.
 * TMDB search/movie matches only titles; search/keyword matches keyword names (short tags).
 * Long natural-language phrases like "a film with a cat as driving force" don't match
 * any single keyword, so we extract terms (e.g. "cat", "film") and run keyword search
 * for each to get theme/description-informed results.
 */

const STOPWORDS = new Set([
  "a", "an", "the", "with", "but", "as", "in", "on", "at", "to", "for", "of", "and", "or", "is", "it", "be", "by", "that", "this", "are", "was", "were", "have", "has", "had", "do", "does", "did", "will", "would", "could", "should", "can", "may", "from",
]);

/** Returns the full query plus up to 3 significant single words (for keyword search). */
export function getKeywordSearchTerms(query: string): string[] {
  const trimmed = query.trim();
  if (!trimmed) return [];
  const terms = new Set<string>();
  terms.add(trimmed);
  const words = trimmed
    .toLowerCase()
    .replace(/[^\w\s'-]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length >= 3 && !STOPWORDS.has(w));
  for (const w of words) {
    if (terms.size >= 4) break;
    terms.add(w);
  }
  return Array.from(terms);
}
