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
  { quote: "The screen is a magic medium. It has such power that it can retain interest as it conveys emotions and moods that no other art form can hope to tackle.", attribution: "Stanley Kubrick" },
  { quote: "Cinema is a mirror by which we often see ourselves.", attribution: "Alejandro González Iñárritu" },
  { quote: "I don't think you can make a good movie without believing in the possibility of magic.", attribution: "Guillermo del Toro" },
  { quote: "Movies can and do have tremendous influence in shaping young lives in the realm of entertainment towards the ideals and objectives of normal adulthood.", attribution: "Walt Disney" },
  { quote: "The best films are the ones that make you feel something you didn't expect.", attribution: "David Lynch" },
  { quote: "A good film is when the price of the dinner, the theatre admission and the babysitter were worth it.", attribution: "Alfred Hitchcock" },
  { quote: "I like the idea of people having a good time at the movies.", attribution: "Steven Spielberg" },
  { quote: "Film is a battleground. Love, hate, violence, death. In a word, emotion.", attribution: "Samuel Fuller" },
  { quote: "The cinema substitutes for our gaze a world more in harmony with our desires.", attribution: "André Bazin" },
  { quote: "I'm not a politician. I'm a filmmaker. I'm interested in telling stories.", attribution: "Spike Lee" },
  { quote: "The whole point of making a film is to try to get an audience to feel something.", attribution: "Denis Villeneuve" },
  { quote: "Movies touch our hearts and awaken our vision, and change the way we see things.", attribution: "Martin Scorsese" },
  { quote: "I think the best films are the ones that leave room for the audience to bring something of themselves.", attribution: "Céline Sciamma" },
  { quote: "We have a responsibility to make the world a better place through the stories we tell.", attribution: "Ava DuVernay" },
  { quote: "The cinema is nothing but a reflection of the society we live in.", attribution: "Satyajit Ray" },
  { quote: "I make films to understand what I don't understand.", attribution: "Lynne Ramsay" },
  { quote: "A film is never really good unless the camera is an eye in the head of a poet.", attribution: "Orson Welles" },
  { quote: "The most honest form of filmmaking is to make a film for yourself.", attribution: "Peter Jackson" },
  { quote: "Movies are the best way to escape. You sit in the dark and you get to be someone else for a while.", attribution: "Hayao Miyazaki" },
  { quote: "I don't want to make films that are just entertainment. I want to make films that make people think.", attribution: "Bong Joon-ho" },
  { quote: "Here's looking at you, kid.", attribution: "Rick (Humphrey Bogart)", source: "Casablanca" },
  { quote: "All we have to decide is what to do with the time that is given us.", attribution: "Gandalf (Ian McKellen)", source: "The Lord of the Rings" },
  { quote: "I'm going to make him an offer he can't refuse.", attribution: "Vito Corleone (Marlon Brando)", source: "The Godfather" },
  { quote: "You're gonna need a bigger boat.", attribution: "Brody (Roy Scheider)", source: "Jaws" },
  { quote: "There's no place like home.", attribution: "Dorothy (Judy Garland)", source: "The Wizard of Oz" },
  { quote: "To infinity and beyond!", attribution: "Buzz Lightyear", source: "Toy Story" },
];

export function getRandomQuote(): AttributedQuote {
  const i = Math.floor(Math.random() * CINEMA_QUOTES.length);
  return CINEMA_QUOTES[i] ?? CINEMA_QUOTES[0];
}
