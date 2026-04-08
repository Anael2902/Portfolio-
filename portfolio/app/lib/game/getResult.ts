import { fetchJikanMangaList, getBestJikanImage } from "../api/jikan";
import {
  fetchTmdbMovies,
  getTmdbPosterUrl,
  type TmdbMovie,
} from "../api/tmdb";
import { getArtistTopTracks } from "../api/lastfm";
import {
  searchDeezerArtist,
  getBestDeezerArtistImage,
} from "../api/deezer";
import { fetchFootballSquad } from "../api/sportsF";

export type Category = "music" | "cinema" | "manga" | "football";

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
  football: [
    "Ton énergie sur le terrain ressemble à",
    "Si tu étais un joueur ou une joueuse, tu serais",
    "Ton aura footballistique correspond à",
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

interface FootballSquadPlayer {
  id: number;
  name?: string;
  age?: number;
  number?: number | null;
  position?: string;
  photo?: string;
}

interface FootballSquadTeam {
  id: number;
  name?: string;
  logo?: string;
}

interface FootballSquadResponseItem {
  team?: FootballSquadTeam;
  players?: FootballSquadPlayer[];
}

const FEATURED_FOOTBALL_TEAMS = [
  33,  // Manchester United
  40,  // Liverpool
  50,  // Manchester City
  42,  // Arsenal
  49,  // Chelsea

  529, // Barcelona
  541, // Real Madrid
  530, // Atletico Madrid
  536, // Sevilla
  548, // Real Sociedad

  489, // AC Milan
  496, // Juventus
  505, // Inter
  497, // Roma
  492, // Napoli

  157, // Bayern
  165, // Dortmund
  173, // RB Leipzig
  168, // Leverkusen
  182, // Wolfsburg

  85,  // PSG
  81,  // Marseille
  91,  // Monaco
  80,  // Lyon
  84,  // Nice
];

const ASTRO_FOOTBALL_TEAMS: Record<string, number[]> = {
  Bélier: [50, 541, 157, 85],
  Taureau: [40, 529, 489, 91],
  Gémeaux: [42, 505, 173, 81],
  Cancer: [49, 496, 85, 84],
  Lion: [33, 530, 157, 80],
  Vierge: [165, 492, 548, 91],
  Balance: [173, 497, 529, 84],
  Scorpion: [168, 536, 496, 81],
  Sagittaire: [541, 50, 492, 85],
  Capricorne: [489, 40, 157, 80],
  Verseau: [505, 42, 530, 91],
  Poissons: [496, 49, 81, 84],
};

function pickFootballPlayerWithPhoto(
  players: FootballSquadPlayer[],
  seed: number
): FootballSquadPlayer | null {
  const validPlayers = players.filter(
    (player) => Boolean(player?.name) && Boolean(player?.photo)
  );

  if (validPlayers.length > 0) {
    return seededPick(validPlayers, seed);
  }

  return players.length > 0 ? seededPick(players, seed) : null;
}

async function getFootballResult(
  astroSign: string,
  seed: number
): Promise<ResultData> {
  const preferredTeams =
    ASTRO_FOOTBALL_TEAMS[astroSign] ?? FEATURED_FOOTBALL_TEAMS;

  const fallback = {
    name: "Joueur mystère",
    image: "",
    subtitle: "Club inconnu",
  };

  try {
    for (let i = 0; i < preferredTeams.length; i++) {
      const teamId = preferredTeams[(Math.abs(seed) + i) % preferredTeams.length];
      const squad = (await fetchFootballSquad(teamId)) as FootballSquadResponseItem | null;

      if (!squad) continue;

      const players = squad.players ?? [];
      const pickedPlayer = pickFootballPlayerWithPhoto(players, seed + i);

      if (!pickedPlayer) continue;

      const clubName = squad.team?.name ?? "Club inconnu";
      const position = pickedPlayer.position?.trim() ?? "";

      return {
        name: pickedPlayer.name ?? fallback.name,
        image: pickedPlayer.photo ?? fallback.image,
        category: "football",
        subtitle: position ? `${clubName} · ${position}` : clubName,
        phrase: getPhrase("football", seed),
      };
    }

    return {
      name: fallback.name,
      image: fallback.image,
      category: "football",
      subtitle: fallback.subtitle,
      phrase: getPhrase("football", seed),
    };
  } catch {
    return {
      name: fallback.name,
      image: fallback.image,
      category: "football",
      subtitle: fallback.subtitle,
      phrase: getPhrase("football", seed),
    };
  }
}

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
      searchDeezerArtist(pickedArtist),
      getArtistTopTracks(pickedArtist),
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
    case "football":
      return getFootballResult(astroSign, seed);
    case "music":
    default:
      return getMusicResult(astroSign, seed);
  }
}