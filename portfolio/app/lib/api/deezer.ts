const DEEZER_BASE_URL = "https://api.deezer.com";

export interface DeezerArtist {
  id: number;
  name: string;
  picture?: string;
  picture_small?: string;
  picture_medium?: string;
  picture_big?: string;
  picture_xl?: string;
}

interface DeezerSearchResponse {
  data?: DeezerArtist[];
}

export async function searchDeezerArtist(artistName: string): Promise<DeezerArtist | null> {
  try {
    const res = await fetch(
      `${DEEZER_BASE_URL}/search/artist?q=${encodeURIComponent(artistName)}&limit=1`,
      { cache: "no-store" }
    );
    if (!res.ok) return null;
    const data = (await res.json()) as DeezerSearchResponse;
    return data.data?.[0] ?? null;
  } catch {
    return null;
  }
}

export function getBestDeezerArtistImage(artist: DeezerArtist): string {
  return (
    artist.picture_xl ||
    artist.picture_big ||
    artist.picture_medium ||
    artist.picture_small ||
    ""
  );
}