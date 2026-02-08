/**
 * Client-side session id for anonymous voting.
 * Generate once, store in localStorage, send with poll requests.
 */
const KEY = "dailyfictions-session";

export function getOrCreateSessionId(): string {
  if (typeof window === "undefined") return "";
  let s = localStorage.getItem(KEY);
  if (!s) {
    s = "s_" + Math.random().toString(36).slice(2) + Date.now().toString(36);
    localStorage.setItem(KEY, s);
  }
  return s;
}
