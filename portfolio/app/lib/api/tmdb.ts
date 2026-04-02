const TMDB_BASE_URL = "https://api.themoviedb.org/3";

export interface TmdbMovie {
  id: number;
  title?: string;
  original_title?: string;
  overview?: string;
  poster_path?: string | null;
  backdrop_path?: string | null;
  release_date?: string;
  vote_average?: number;
  vote_count?: number;
  genre_ids?: number[];
}

interface TmdbDiscoverResponse {
  page?: number;
  results?: TmdbMovie[];
  total_pages?: number;
  total_results?: number;
}

export interface FetchTmdbMoviesParams {
  genreId: string;
  page?: number;
  language?: string;
  sortBy?: string;
  minVoteCount?: number;
}

function getTmdbToken() {
  const token = process.env.TMDB_READ_ACCESS_TOKEN;

  if (!token) {
    throw new Error(
      "TMDB_READ_ACCESS_TOKEN manquant dans les variables d'environnement."
    );
  }

  return token;
}

export function getTmdbPosterUrl(path?: string | null, size: "w342" | "w500" | "original" = "w500") {
  if (!path) return "";
  return `https://image.tmdb.org/t/p/${size}${path}`;
}

export async function fetchTmdbMovies({
  genreId,
  page = 1,
  language = "fr-FR",
  sortBy = "vote_average.desc",
  minVoteCount = 500,
}: FetchTmdbMoviesParams): Promise<TmdbMovie[]> {
  const token = getTmdbToken();

  const searchParams = new URLSearchParams({
    language,
    sort_by: sortBy,
    with_genres: genreId,
    page: String(page),
    "vote_count.gte": String(minVoteCount),
  });

  const res = await fetch(`${TMDB_BASE_URL}/discover/movie?${searchParams.toString()}`, {
    method: "GET",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error(`Erreur TMDB (${res.status})`);
  }

  const data = (await res.json()) as TmdbDiscoverResponse;

  return (data.results ?? []).filter((movie) => Boolean(movie.title));
}