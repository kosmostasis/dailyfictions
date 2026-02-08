/**
 * Tagline and rotating cinema quotes (reality / choosing a version of it).
 * One quote is chosen at random per page load for the home page.
 * All quotes attributed.
 */

export const TAGLINE = "choose your reality";

export interface AttributedQuote {
  quote: string;
  attribution: string;
  source?: string;
}

export const CINEMA_QUOTES: AttributedQuote[] = [
  { quote: "Film as dream, film as music. No art passes our conscience in the way film does.", attribution: "Ingmar Bergman" },
  { quote: "I want what happened in the movie to happen to me.", attribution: "Cecilia (Mia Farrow)", source: "The Purple Rose of Cairo" },
  { quote: "Cinema is a matter of what's in the frame and what's out.", attribution: "Martin Scorsese" },
  { quote: "We need the possibility of escape, as much as we need hope.", attribution: "Roger Ebert" },
  { quote: "A film is — or should be — more like music than like fiction. It should be a progression of moods and feelings.", attribution: "Stanley Kubrick" },
  { quote: "You walk out of the theatre and the world is not the same.", attribution: "Roger Ebert" },
  { quote: "Cinema is the most beautiful fraud in the world.", attribution: "Jean-Luc Godard" },
  { quote: "Movies are like an expensive form of therapy.", attribution: "Tim Burton" },
  { quote: "Reality is too small for the imagination.", attribution: "Werner Herzog" },
  { quote: "Life isn't like in the movies. Life is much harder.", attribution: "Alfredo (Philippe Noiret)", source: "Cinema Paradiso" },
  { quote: "I think cinema, movies, and magic have always been closely associated.", attribution: "Francis Ford Coppola" },
  { quote: "The cinema is truth 24 times per second.", attribution: "Jean-Luc Godard" },
  { quote: "Movies are the machine that generates empathy.", attribution: "Roger Ebert" },
  { quote: "We don't make movies to make money; we make money to make more movies.", attribution: "Walt Disney" },
  { quote: "Film as dream, film as music.", attribution: "Ingmar Bergman" },
  { quote: "Every film should have a beginning, a middle, and an end — but not necessarily in that order.", attribution: "Jean-Luc Godard" },
];

export function getRandomQuote(): AttributedQuote {
  const i = Math.floor(Math.random() * CINEMA_QUOTES.length);
  return CINEMA_QUOTES[i] ?? CINEMA_QUOTES[0];
}
