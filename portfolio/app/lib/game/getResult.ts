import { fetchJikanMangaList, getBestJikanImage } from "../api/jikan";
import {fetchTmdbMovies,getTmdbPosterUrl,type TmdbMovie} from "../api/tmdb";
import {getArtistTopTracks} from "../api/lastfm";

import { searchDeezerArtist, getBestDeezerArtistImage } from "../api/deezer";

export type Category = "music" | "cinema" | "manga";

export interface ResultData {
  name: string;
  image: string;
  category: Category;
  subtitle: string;
  phrase: string;
}

const PHRASES: Record<Category, string[]> = {
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

const ASTRO_GENRE_MAP: Record<
  string,
  { manga: string; cinema: string; music: string }
> = {
  Bélier: { manga: "action", cinema: "28", music: "Electronic" },
  Taureau: { manga: "romance", cinema: "10749", music: "Pop" },
  Gémeaux: { manga: "comedy", cinema: "35", music: "Hip-Hop" },
  Cancer: { manga: "drama", cinema: "18", music: "R&B" },
  Lion: { manga: "adventure", cinema: "12", music: "Pop" },
  Vierge: { manga: "mystery", cinema: "9648", music: "Classical" },
  Balance: { manga: "romance", cinema: "10749", music: "Jazz" },
  Scorpion: { manga: "horror", cinema: "27", music: "Metal" },
  Sagittaire: { manga: "fantasy", cinema: "14", music: "Rock" },
  Capricorne: { manga: "historical", cinema: "36", music: "Classical" },
  Verseau: { manga: "sci-fi", cinema: "878", music: "Electronic" },
  Poissons: { manga: "drama", cinema: "18", music: "Soul" },
};

const JIKAN_MANGA_GENRE_IDS: Record<string, string> = {
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

const MUSIC_ARTISTS_BY_STYLE: Record<string, string[]> = {
  Pop: [
    "Dua Lipa", "Ariana Grande", "Taylor Swift", "Billie Eilish",
    "Harry Styles", "Olivia Rodrigo", "Ed Sheeran", "Doja Cat",
    "Justin Bieber", "Selena Gomez",
  ],
  "Hip-Hop": [
    "Kendrick Lamar", "Drake", "Travis Scott", "Post Malone",
    "J. Cole", "Cardi B", "Nicki Minaj", "21 Savage",
    "Lil Baby", "Tyler the Creator",
  ],
  "R&B": [
    "SZA", "H.E.R.", "Frank Ocean", "Beyoncé", "The Weeknd",
    "Jhené Aiko", "Daniel Caesar", "Giveon", "Summer Walker", "Brent Faiyaz",
  ],
};

function seededPick<T>(arr: T[], seed: number): T {
  return arr[seed % arr.length];
}

function getPhrase(category: Category, seed: number): string {
  return seededPick(PHRASES[category], seed);
}

function pickMovieWithPoster(movies: TmdbMovie[], seed: number): TmdbMovie | null {
  const withPoster = movies.filter((movie) => Boolean(movie.poster_path));
  if (withPoster.length > 0) {
    return seededPick(withPoster, seed);
  }
  return movies.length > 0 ? seededPick(movies, seed) : null;
}


async function getMangaResult(astroSign: string, seed: number): Promise<ResultData> {
  const genreKey = ASTRO_GENRE_MAP[astroSign]?.manga ?? "action";
  const genreId = JIKAN_MANGA_GENRE_IDS[genreKey] ?? "1";
  const page = (seed % 3) + 1;

  const fallback = {
    title: "Berserk",
    image: "https://cdn.myanimelist.net/images/manga/1/157897l.jpg",
    subtitle: "Action, Adventure",
  };

  try {
    const mangas = await fetchJikanMangaList({
      genres: genreId,
      orderBy: "score",
      sort: "desc",
      limit: 10,
      page,
    });

    const item = mangas.length ? seededPick(mangas, seed) : null;

    if (!item) {
      return {
        name: fallback.title,
        image: fallback.image,
        category: "manga",
        subtitle: fallback.subtitle,
        phrase: getPhrase("manga", seed),
      };
    }

    return {
      name: item.title,
      image: getBestJikanImage(item),
      category: "manga",
      subtitle: item.genres?.length
        ? item.genres.slice(0, 3).map((g) => g.name).join(", ")
        : genreKey,
      phrase: getPhrase("manga", seed),
    };
  } catch {
    return {
      name: fallback.title,
      image: fallback.image,
      category: "manga",
      subtitle: fallback.subtitle,
      phrase: getPhrase("manga", seed),
    };
  }
}

async function getCinemaResult(astroSign: string, seed: number): Promise<ResultData> {
  const genreId = ASTRO_GENRE_MAP[astroSign]?.cinema ?? "28";
  const page = (seed % 3) + 1;

  const fallback = {
    title: "Inception",
    image: "",
    subtitle: "2010",
  };

  try {
     console.log("[TMDB] genreId:", genreId, "page:", page);
    const movies = await fetchTmdbMovies({
      genreId,
      page,
      language: "fr-FR",
      sortBy: "vote_average.desc",
      minVoteCount: 500,
    });

    const item = pickMovieWithPoster(movies, seed);

    if (!item) {
      return {
        name: fallback.title,
        image: fallback.image,
        category: "cinema",
        subtitle: fallback.subtitle,
        phrase: getPhrase("cinema", seed),
      };
    }

    return {
      name: item.title ?? "Film mystère",
      image: getTmdbPosterUrl(item.poster_path, "w500"),
      category: "cinema",
      subtitle: item.release_date?.split("-")[0] ?? "Année inconnue",
      phrase: getPhrase("cinema", seed),
    };
  } catch {
    return {
      name: fallback.title,
      image: fallback.image,
      category: "cinema",
      subtitle: fallback.subtitle,
      phrase: getPhrase("cinema", seed),
    };
  }
}

async function getMusicResult(astroSign: string, seed: number): Promise<ResultData> {
  const style = ASTRO_GENRE_MAP[astroSign]?.music ?? "Pop";
  const artists = MUSIC_ARTISTS_BY_STYLE[style] ?? MUSIC_ARTISTS_BY_STYLE.Pop;
  const pickedArtist = seededPick(artists, seed);

  try {
    const [deezerArtist, topTracks] = await Promise.all([
      searchDeezerArtist(pickedArtist),  // ← Deezer pour l'image
      getArtistTopTracks(pickedArtist),  // ← Last.fm pour les tracks
    ]);

    const track = topTracks.length ? seededPick(topTracks, seed) : null;
    const image = deezerArtist ? getBestDeezerArtistImage(deezerArtist) : "";

    return {
      name: track ? `${track.name} — ${pickedArtist}` : pickedArtist,
      image,
      category: "music",
      subtitle: style,
      phrase: getPhrase("music", seed),
    };
  } catch {
    return {
      name: pickedArtist,
      image: "",
      category: "music",
      subtitle: style,
      phrase: getPhrase("music", seed),
    };
  }
}

export async function getCategoryResult(params: {
  category: Category;
  astroSign: string;
  seed: number;
}): Promise<ResultData> {
  const { category, astroSign, seed } = params;

  switch (category) {
    case "manga":
      return getMangaResult(astroSign, seed);
    case "cinema":
      return getCinemaResult(astroSign, seed);
    case "music":
    default:
      return getMusicResult(astroSign, seed);
  }
}