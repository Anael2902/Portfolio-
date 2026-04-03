const LASTFM_BASE_URL = "https://ws.audioscrobbler.com/2.0";

function getLastFmKey() {
  const key = process.env.LASTFM_API_KEY;
  if (!key) throw new Error("LASTFM_API_KEY manquant");
  return key;
}

export interface LastFmTrack {
  name: string;
  artist: { name: string };
  image?: { "#text": string; size: string }[];
}

export interface LastFmArtist {
  name: string;
  image?: { "#text": string; size: string }[];
  tags?: { tag: { name: string }[] };
}

function getBestImage(images?: { "#text": string; size: string }[]): string {
  if (!images) return "";
  const order = ["extralarge", "large", "medium", "small"];
  for (const size of order) {
    const img = images.find((i) => i.size === size);
    if (img?.["#text"]) return img["#text"];
  }
  return "";
}

async function fetchLastFm<T>(params: Record<string, string>): Promise<T> {
  const searchParams = new URLSearchParams({
    ...params,
    api_key: getLastFmKey(),
    format: "json",
  });
  const res = await fetch(`${LASTFM_BASE_URL}/?${searchParams.toString()}`, {
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`Erreur Last.fm (${res.status})`);
  return res.json() as Promise<T>;
}

export async function getArtistInfo(artistName: string): Promise<LastFmArtist | null> {
  try {
    const data = await fetchLastFm<{ artist: LastFmArtist }>({
      method: "artist.getInfo",
      artist: artistName,
      lang: "fr",
    });
    return data.artist ?? null;
  } catch {
    return null;
  }
}

export async function getArtistTopTracks(artistName: string): Promise<LastFmTrack[]> {
  try {
    const data = await fetchLastFm<{ toptracks: { track: LastFmTrack[] } }>({
      method: "artist.getTopTracks",
      artist: artistName,
      limit: "10",
    });
    return data.toptracks?.track ?? [];
  } catch {
    return [];
  }
}

export function getBestLastFmArtistImage(artist: LastFmArtist): string {
  return getBestImage(artist.image);
}

export function getBestLastFmTrackImage(track: LastFmTrack): string {
  return getBestImage(track.image);
}