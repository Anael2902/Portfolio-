const JIKAN_BASE_URL = "https://api.jikan.moe/v4";

interface JikanImageSet {
  image_url?: string;
  small_image_url?: string;
  large_image_url?: string;
}

export interface JikanGenre {
  mal_id: number;
  name: string;
}

export interface JikanManga {
  mal_id: number;
  title: string;
  title_english?: string | null;
  synopsis?: string | null;
  score?: number | null;
  chapters?: number | null;
  status?: string | null;
  genres?: JikanGenre[];
  images?: {
    jpg?: JikanImageSet;
    webp?: JikanImageSet;
  };
}

interface JikanPagination {
  current_page?: number;
  has_next_page?: boolean;
  items?: {
    count?: number;
    total?: number;
    per_page?: number;
  };
}

interface JikanErrorResponse {
  status?: number;
  type?: string;
  message?: string;
  error?: string;
}

interface JikanMangaListResponse extends JikanErrorResponse {
  data?: JikanManga[];
  pagination?: JikanPagination;
}

export interface FetchJikanMangaParams {
  genres?: string;
  genresExclude?: string;
  orderBy?: string;
  sort?: "asc" | "desc";
  limit?: number;
  page?: number;
  q?: string;
}

export function getBestJikanImage(manga: JikanManga): string {
  return (
    manga.images?.webp?.large_image_url ||
    manga.images?.jpg?.large_image_url ||
    manga.images?.webp?.image_url ||
    manga.images?.jpg?.image_url ||
    ""
  );
}

export async function fetchJikanMangaList({
  genres,
  genresExclude = "9,49",
  orderBy = "score",
  sort = "desc",
  limit = 10,
  page = 1,
  q,
}: FetchJikanMangaParams): Promise<JikanManga[]> {
  const params = new URLSearchParams();

  if (q) params.set("q", q);
  if (genres) params.set("genres", genres);
  if (genresExclude) params.set("genres_exclude", genresExclude);
  if (orderBy) params.set("order_by", orderBy);
  if (sort) params.set("sort", sort);
  params.set("limit", String(limit));
  params.set("page", String(page));

  const res = await fetch(`${JIKAN_BASE_URL}/manga?${params.toString()}`, {
    method: "GET",
    headers: {
      Accept: "application/json",
    },
    cache: "no-store",
  });

  if (res.status === 429) {
    throw new Error("Jikan est temporairement limité. Réessaie dans quelques secondes.");
  }

  if (!res.ok) {
    let message = `Erreur Jikan (${res.status})`;

    try {
      const errorJson = (await res.json()) as JikanErrorResponse;
      if (errorJson.message) {
        message = errorJson.message;
      }
    } catch {
      // ignore JSON parse error
    }

    throw new Error(message);
  }

  const data = (await res.json()) as JikanMangaListResponse;
  return data.data ?? [];
}