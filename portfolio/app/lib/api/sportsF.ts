const FOOTBALL_BASE_URL = "https://v3.football.api-sports.io";

export interface FootballSquadPlayer {
  id: number;
  name?: string;
  age?: number;
  number?: number | null;
  position?: string;
  photo?: string;
}

export interface FootballSquadTeam {
  id: number;
  name?: string;
  logo?: string;
}

export interface FootballSquadResponseItem {
  team?: FootballSquadTeam;
  players?: FootballSquadPlayer[];
}

interface FootballSquadsResponse {
  response?: FootballSquadResponseItem[];
}

function getFootballApiKey() {
  const key = process.env.API_FOOTBALL_KEY;

  if (!key) {
    throw new Error("API_FOOTBALL_KEY manquant dans les variables d'environnement.");
  }

  return key;
}

export async function fetchFootballSquad(
  team: number
): Promise<FootballSquadResponseItem | null> {
  const apiKey = getFootballApiKey();

  const res = await fetch(
    `${FOOTBALL_BASE_URL}/players/squads?team=${team}`,
    {
      method: "GET",
      headers: {
        "x-apisports-key": apiKey,
        Accept: "application/json",
      },
      cache: "no-store",
    }
  );

  if (!res.ok) {
    throw new Error(`Erreur API Football squad (${res.status})`);
  }

  const data = (await res.json()) as FootballSquadsResponse;

  return data.response?.[0] ?? null;
}