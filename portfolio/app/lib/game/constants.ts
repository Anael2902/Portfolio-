import type { AstroSignDefinition, CategoryOption, Category } from "./types";

export const CATEGORIES: readonly CategoryOption[] = [
  { id: "music", label: "Musique", emoji: "🎵", color: "#7c3aed" },
  { id: "cinema", label: "Cinéma", emoji: "🎬", color: "#dc2626" },
  { id: "manga", label: "Manga", emoji: "✦", color: "#ea580c" },
] as const;

export const PHRASES: Record<Category, readonly string[]> = {
  music: [
    "Ton âme musicale vibre comme",
    "Ta playlist secrète ressemble à",
    "Si tu étais une chanson, tu serais",
  ],
  cinema: [
    "Ton univers cinématographique, c'est",
    "Si tu étais un film, tu serais",
    "Ton énergie à l'écran correspond à",
  ],
  manga: [
    "Ton destin manga te mène vers",
    "L'univers qui te représente, c'est",
    "Si tu étais un personnage, tu serais dans",
  ],
};

export const ASTRO_SIGNS: readonly AstroSignDefinition[] = [
  { sign: "Bélier", emoji: "♈", element: "Feu", start: [3, 21], end: [4, 19] },
  { sign: "Taureau", emoji: "♉", element: "Terre", start: [4, 20], end: [5, 20] },
  { sign: "Gémeaux", emoji: "♊", element: "Air", start: [5, 21], end: [6, 20] },
  { sign: "Cancer", emoji: "♋", element: "Eau", start: [6, 21], end: [7, 22] },
  { sign: "Lion", emoji: "♌", element: "Feu", start: [7, 23], end: [8, 22] },
  { sign: "Vierge", emoji: "♍", element: "Terre", start: [8, 23], end: [9, 22] },
  { sign: "Balance", emoji: "♎", element: "Air", start: [9, 23], end: [10, 22] },
  { sign: "Scorpion", emoji: "♏", element: "Eau", start: [10, 23], end: [11, 21] },
  { sign: "Sagittaire", emoji: "♐", element: "Feu", start: [11, 22], end: [12, 21] },
  { sign: "Capricorne", emoji: "♑", element: "Terre", start: [12, 22], end: [1, 19] },
  { sign: "Verseau", emoji: "♒", element: "Air", start: [1, 20], end: [2, 18] },
  { sign: "Poissons", emoji: "♓", element: "Eau", start: [2, 19], end: [3, 20] },
] as const;

export const ASTRO_GENRE_MAP: Record<
  string,
  { manga: string; cinema: string; music: string }
> =  {
  Bélier:      { manga: "action",    cinema: "28",    music: "Hip-Hop" },
  Taureau:     { manga: "romance",   cinema: "10749", music: "R&B" },
  Gémeaux:     { manga: "comedy",    cinema: "35",    music: "Pop" },
  Cancer:      { manga: "drama",     cinema: "18",    music: "R&B" },
  Lion:        { manga: "adventure", cinema: "12",    music: "Pop" },
  Vierge:      { manga: "mystery",   cinema: "9648",  music: "R&B" },
  Balance:     { manga: "romance",   cinema: "10749", music: "Pop" },
  Scorpion:    { manga: "horror",    cinema: "27",    music: "Hip-Hop" },
  Sagittaire:  { manga: "fantasy",   cinema: "14",    music: "Hip-Hop" },
  Capricorne:  { manga: "historical",cinema: "36",    music: "R&B" },
  Verseau:     { manga: "sci-fi",    cinema: "878",   music: "Pop" },
  Poissons:    { manga: "drama",     cinema: "18",    music: "R&B" },
};

export const JIKAN_MANGA_GENRE_IDS: Record<string, string> = {
  action: "1",
  adventure: "2",
  comedy: "4",
  mystery: "7",
  drama: "8",
  fantasy: "10",
  horror: "14",
  romance: "22",
  "sci-fi": "24",
};