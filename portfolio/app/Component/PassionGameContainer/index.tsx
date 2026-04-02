"use client";

import React, { useState } from "react";
import styles from "./styles.module.scss";

// ─── Types ────────────────────────────────────────────────────────────────────

type Category = "foot" | "music" | "cinema" | "manga";

interface ResultData {
  name: string;
  image: string;
  category: Category;
  subtitle: string;
  phrase: string;
}

interface AstroResult {
  sign: string;
  emoji: string;
  element: string;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const CATEGORIES: { id: Category; label: string; emoji: string; color: string }[] = [
  { id: "foot",   label: "Foot",    emoji: "⚽", color: "#2d6a4f" },
  { id: "music",  label: "Musique", emoji: "🎵", color: "#6d3a9c" },
  { id: "cinema", label: "Cinéma",  emoji: "🎬", color: "#c0392b" },
  { id: "manga",  label: "Manga",   emoji: "✦",  color: "#d4681e" },
];

const ASTRO_SIGNS: { sign: string; emoji: string; element: string; start: [number,number]; end: [number,number] }[] = [
  { sign: "Bélier",     emoji: "♈", element: "Feu",   start: [3,21],  end: [4,19]  },
  { sign: "Taureau",    emoji: "♉", element: "Terre", start: [4,20],  end: [5,20]  },
  { sign: "Gémeaux",    emoji: "♊", element: "Air",   start: [5,21],  end: [6,20]  },
  { sign: "Cancer",     emoji: "♋", element: "Eau",   start: [6,21],  end: [7,22]  },
  { sign: "Lion",       emoji: "♌", element: "Feu",   start: [7,23],  end: [8,22]  },
  { sign: "Vierge",     emoji: "♍", element: "Terre", start: [8,23],  end: [9,22]  },
  { sign: "Balance",    emoji: "♎", element: "Air",   start: [9,23],  end: [10,22] },
  { sign: "Scorpion",   emoji: "♏", element: "Eau",   start: [10,23], end: [11,21] },
  { sign: "Sagittaire", emoji: "♐", element: "Feu",   start: [11,22], end: [12,21] },
  { sign: "Capricorne", emoji: "♑", element: "Terre", start: [12,22], end: [1,19]  },
  { sign: "Verseau",    emoji: "♒", element: "Air",   start: [1,20],  end: [2,18]  },
  { sign: "Poissons",   emoji: "♓", element: "Eau",   start: [2,19],  end: [3,20]  },
];

// Mapping astro → genre/style pour filtrer les APIs
const ASTRO_GENRE_MAP: Record<string, { manga: string; cinema: string; music: string }> = {
  "Bélier":     { manga: "action",     cinema: "28",    music: "Electronic" },
  "Taureau":    { manga: "romance",    cinema: "10749", music: "Pop" },
  "Gémeaux":    { manga: "comedy",     cinema: "35",    music: "Hip-Hop" },
  "Cancer":     { manga: "drama",      cinema: "18",    music: "R&B" },
  "Lion":       { manga: "adventure",  cinema: "12",    music: "Pop" },
  "Vierge":     { manga: "mystery",    cinema: "9648",  music: "Classical" },
  "Balance":    { manga: "romance",    cinema: "10749", music: "Jazz" },
  "Scorpion":   { manga: "horror",     cinema: "27",    music: "Metal" },
  "Sagittaire": { manga: "fantasy",    cinema: "14",    music: "Rock" },
  "Capricorne": { manga: "historical", cinema: "36",    music: "Classical" },
  "Verseau":    { manga: "sci-fi",     cinema: "878",   music: "Electronic" },
  "Poissons":   { manga: "drama",      cinema: "18",    music: "Soul" },
};

// Joueurs de foot par signe (fallback offline si API-Football non configurée)
const FOOT_BY_SIGN: Record<string, { name: string; image: string; subtitle: string }[]> = {
  "Bélier":     [{ name: "Kylian Mbappé",    image: "https://img.a.transfermarkt.technology/portrait/big/342229-1682683695.jpg", subtitle: "Attaquant / Real Madrid" }],
  "Taureau":    [{ name: "Erling Haaland",   image: "https://img.a.transfermarkt.technology/portrait/big/418560-1682683695.jpg", subtitle: "Attaquant / Man. City" }],
  "Gémeaux":    [{ name: "Lamine Yamal",     image: "https://img.a.transfermarkt.technology/portrait/big/987003-1682683695.jpg", subtitle: "Ailier / FC Barcelone" }],
  "Cancer":     [{ name: "Lionel Messi",     image: "https://img.a.transfermarkt.technology/portrait/big/28003-1682683695.jpg",  subtitle: "Attaquant / Inter Miami" }],
  "Lion":       [{ name: "Cristiano Ronaldo",image: "https://img.a.transfermarkt.technology/portrait/big/8198-1682683695.jpg",   subtitle: "Attaquant / Al-Nassr" }],
  "Vierge":     [{ name: "Pedri",            image: "https://img.a.transfermarkt.technology/portrait/big/722829-1682683695.jpg", subtitle: "Milieu / FC Barcelone" }],
  "Balance":    [{ name: "Jude Bellingham",  image: "https://img.a.transfermarkt.technology/portrait/big/581678-1682683695.jpg", subtitle: "Milieu / Real Madrid" }],
  "Scorpion":   [{ name: "Vinícius Jr.",     image: "https://img.a.transfermarkt.technology/portrait/big/371998-1682683695.jpg", subtitle: "Ailier / Real Madrid" }],
  "Sagittaire": [{ name: "Bukayo Saka",      image: "https://img.a.transfermarkt.technology/portrait/big/793822-1682683695.jpg", subtitle: "Ailier / Arsenal" }],
  "Capricorne": [{ name: "Mohamed Salah",    image: "https://img.a.transfermarkt.technology/portrait/big/148455-1682683695.jpg", subtitle: "Ailier / Liverpool" }],
  "Verseau":    [{ name: "Rodri",            image: "https://img.a.transfermarkt.technology/portrait/big/357565-1682683695.jpg", subtitle: "Milieu / Man. City" }],
  "Poissons":   [{ name: "Phil Foden",       image: "https://img.a.transfermarkt.technology/portrait/big/406635-1682683695.jpg", subtitle: "Milieu / Man. City" }],
};

const PHRASES: Record<Category, string[]> = {
  foot:   ["Ton énergie sur le terrain correspond à", "Ta façon de jouer ressemble à", "Ton alter-ego ballon rond, c'est"],
  music:  ["Ton âme musicale vibre comme", "Ta playlist secrète ressemble à", "Si tu étais une chanson, tu serais"],
  cinema: ["Ton univers cinématographique, c'est", "Si tu étais un film, tu serais", "Ton énergie à l'écran correspond à"],
  manga:  ["Ton destin manga te mène vers", "L'univers qui te représente, c'est", "Si tu étais un personnage, tu serais dans"],
};

// ─── Utils ────────────────────────────────────────────────────────────────────

function getAstroSign(date: Date): AstroResult {
  const m = date.getMonth() + 1;
  const d = date.getDate();

  for (const s of ASTRO_SIGNS) {
    const [sm, sd] = s.start;
    const [em, ed] = s.end;
    if (sm <= em) {
      if ((m === sm && d >= sd) || (m === em && d <= ed) || (m > sm && m < em)) {
        return { sign: s.sign, emoji: s.emoji, element: s.element };
      }
    } else {
      if ((m === sm && d >= sd) || (m === em && d <= ed) || m > sm || m < em) {
        return { sign: s.sign, emoji: s.emoji, element: s.element };
      }
    }
  }
  return { sign: "Capricorne", emoji: "♑", element: "Terre" };
}

function computeSeed(firstName: string, birthDate: Date): number {
  const letter = firstName.trim().toUpperCase().charCodeAt(0) || 65;
  const day   = birthDate.getDate();
  const month = birthDate.getMonth() + 1;
  const year  = birthDate.getFullYear();
  return (letter * 7 + day * 13 + month * 31 + year) % 1000;
}

function seededPick<T>(arr: T[], seed: number): T {
  return arr[seed % arr.length];
}

function getPhrase(category: Category, seed: number): string {
  return seededPick(PHRASES[category], seed);
}

// ─── API Response Types ───────────────────────────────────────────────────────

interface JikanManga {
  title: string;
  images?: { jpg?: { large_image_url?: string } };
  genres?: { name: string }[];
}

interface TmdbMovie {
  title?: string;
  poster_path?: string;
  release_date?: string;
}

interface AudioDbArtist {
  strArtist?: string;
  strArtistThumb?: string;
  strGenre?: string;
}

// ─── API Fetchers ─────────────────────────────────────────────────────────────

async function fetchManga(astroSign: string, seed: number): Promise<ResultData> {
  const genre = ASTRO_GENRE_MAP[astroSign]?.manga ?? "action";
  const page  = (seed % 5) + 1;

  const res  = await fetch(
    `https://api.jikan.moe/v4/manga?genres_exclude=9,49&order_by=score&sort=desc&limit=10&page=${page}&genres=${encodeURIComponent(genre)}`
  );
  const data = await res.json() as { data?: JikanManga[] };
  const list: JikanManga[] = data.data ?? [];
  const fallback: JikanManga[] = [{ title: "Berserk", images: { jpg: { large_image_url: "https://cdn.myanimelist.net/images/manga/1/157897l.jpg" } }, genres: [] }];
  const item = seededPick(list.length ? list : fallback, seed);

  return {
    name:     item.title,
    image:    item.images?.jpg?.large_image_url ?? "",
    category: "manga",
    subtitle: item.genres?.map((g) => g.name).join(", ") ?? genre,
    phrase:   getPhrase("manga", seed),
  };
}

async function fetchCinema(astroSign: string, seed: number, tmdbKey: string): Promise<ResultData> {
  const genreId = ASTRO_GENRE_MAP[astroSign]?.cinema ?? "28";
  const page    = (seed % 3) + 1;

  const res  = await fetch(
    `https://api.themoviedb.org/3/discover/movie?api_key=${tmdbKey}&language=fr-FR&sort_by=vote_average.desc&vote_count.gte=500&with_genres=${genreId}&page=${page}`
  );
  const data = await res.json() as { results?: TmdbMovie[] };
  const list: TmdbMovie[] = data.results ?? [];
  const item = seededPick(list.length ? list : [{ title: "Inception", poster_path: undefined, release_date: "2010" }], seed);

  return {
    name:     item.title ?? "Inception",
    image:    item.poster_path ? `https://image.tmdb.org/t/p/w500${item.poster_path}` : "",
    category: "cinema",
    subtitle: item.release_date?.split("-")[0] ?? "",
    phrase:   getPhrase("cinema", seed),
  };
}

async function fetchMusic(astroSign: string, seed: number): Promise<ResultData> {
  const style = ASTRO_GENRE_MAP[astroSign]?.music ?? "Pop";
  const res   = await fetch(
    `https://www.theaudiodb.com/api/v1/json/2/search.php?s=${encodeURIComponent(style)}`
  );
  const data  = await res.json() as { artists?: AudioDbArtist[] };
  const list: AudioDbArtist[]  = data.artists ?? [];
  const fallback: AudioDbArtist[] = [{ strArtist: "Daft Punk", strArtistThumb: "", strGenre: style }];
  const item  = seededPick(list.length ? list : fallback, seed);

  return {
    name:     item.strArtist ?? "Artiste",
    image:    item.strArtistThumb ?? "",
    category: "music",
    subtitle: item.strGenre ?? style,
    phrase:   getPhrase("music", seed),
  };
}

async function fetchFoot(astroSign: string, seed: number): Promise<ResultData> {
  const players = FOOT_BY_SIGN[astroSign] ?? FOOT_BY_SIGN["Lion"];
  const player  = seededPick(players, seed);

  return {
    name:     player.name,
    image:    player.image,
    category: "foot",
    subtitle: player.subtitle,
    phrase:   getPhrase("foot", seed),
  };
}

// ─── Component ────────────────────────────────────────────────────────────────

interface PersonalityGameProps {
  id?: string;
  tmdbApiKey?: string; // Passe ta clé TMDB via props ou env
}

const PersonalityGameContainer: React.FC<PersonalityGameProps> = ({
  id,
  tmdbApiKey = process.env.NEXT_PUBLIC_TMDB_API_KEY ?? "",
}) => {
  const [firstName, setFirstName] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [selectedCat, setSelectedCat] = useState<Category | null>(null);
  const [isSpinning, setIsSpinning] = useState(false);
  const [result, setResult] = useState<ResultData | null>(null);
  const [astro, setAstro] = useState<AstroResult | null>(null);
  const [seed, setSeed] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [step, setStep] = useState<"form" | "choose" | "result">("form");

  const handleFormSubmit = () => {
    if (!firstName.trim() || !birthDate) return;
    const date     = new Date(birthDate);
    const computed = computeSeed(firstName, date);
    setSeed(computed);
    setAstro(getAstroSign(date));
    setStep("choose");
    setResult(null);
  };

  const handlePlay = async (cat: Category) => {
    setSelectedCat(cat);
    setIsSpinning(true);
    setError(null);
    setResult(null);

    // Roulette delay
    await new Promise((r) => setTimeout(r, 1800));

    try {
      let res: ResultData;
      const sign = astro?.sign ?? "Lion";

      if (cat === "manga")  res = await fetchManga(sign, seed);
      else if (cat === "cinema") {
        if (!tmdbApiKey) throw new Error("Clé TMDB manquante — ajoute NEXT_PUBLIC_TMDB_API_KEY dans .env");
        res = await fetchCinema(sign, seed, tmdbApiKey);
      }
      else if (cat === "music") res = await fetchMusic(sign, seed);
      else res = await fetchFoot(sign, seed);

      setResult(res);
      setStep("result");
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Une erreur est survenue.");
    } finally {
      setIsSpinning(false);
    }
  };

  const handleRoulette = async () => {
    setIsSpinning(true);
    setError(null);
    setResult(null);

    // Animation roulette — défile les catégories
    const order: Category[] = ["foot", "music", "cinema", "manga", "foot", "music", "cinema", "manga"];
    for (let i = 0; i < order.length; i++) {
      setSelectedCat(order[i]);
      await new Promise((r) => setTimeout(r, 180 + i * 60));
    }

    const cats: Category[] = ["foot", "music", "cinema", "manga"];
    const finalCat = seededPick(cats, seed);
    setSelectedCat(finalCat);
    await new Promise((r) => setTimeout(r, 400));

    await handlePlay(finalCat);
  };

  const reset = () => {
    setStep("form");
    setResult(null);
    setAstro(null);
    setSelectedCat(null);
    setError(null);
    setFirstName("");
    setBirthDate("");
  };

  const catInfo = CATEGORIES.find((c) => c.id === result?.category);

  return (
    <section id={id} className={styles["game_section"]}>
      {/* ── Section header ── */}
      <div className={styles["game_section_header"]}>
        <span className={styles["game_section_eyebrow"]}>Mini-jeu</span>
        <h2 className={styles["game_section_title"]}>Découvre ce qui te représente</h2>
        <p className={styles["game_section_subtitle"]}>
          Prénom + date de naissance → un résultat unique tiré de mes 4 univers
        </p>
      </div>

      <div className={styles["game_section_body"]}>
        {/* ── STEP 1 : Formulaire ── */}
        {step === "form" && (
          <div className={styles.form_card}>
            <div className={styles["form_card_fields"]}>
              <div className={styles["form_card_field"]}>
                <label>Ton prénom</label>
                <input
                  type="text"
                  placeholder="ex: Lucas"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleFormSubmit()}
                />
              </div>
              <div className={styles["form_card_field"]}>
                <label>Ta date de naissance</label>
                <input
                  type="date"
                  value={birthDate}
                  onChange={(e) => setBirthDate(e.target.value)}
                />
              </div>
            </div>
            <button
              className={styles["form_card_submit"]}
              onClick={handleFormSubmit}
              disabled={!firstName.trim() || !birthDate}
            >
              Continuer →
            </button>
          </div>
        )}

        {/* ── STEP 2 : Choix catégorie ── */}
        {step === "choose" && astro && (
          <div className={styles.choose_wrapper}>
            {/* Infos calculées */}
            <div className={styles.choose_badge}>
              <span>{astro.emoji}</span>
              <div className={styles.choose_info}>
                <span>{astro.sign} · {astro.element}</span>
                <span>
                  Lettre dominante : <strong>{firstName.trim()[0].toUpperCase()}</strong>
                </span>
              </div>
            </div>

            <p className={styles.choose_label}>Choisis ton univers</p>

            <div className={styles.choose_grid}>
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  className={`${styles.choose_btn} ${selectedCat === cat.id && isSpinning ? styles["choose_btn--active"] : ""}`}
                  onClick={() => !isSpinning && handlePlay(cat.id)}
                  disabled={isSpinning}
                  style={{ "--cat-color": cat.color } as React.CSSProperties}
                >
                  <span>{cat.emoji}</span>
                  <span>{cat.label}</span>
                </button>
              ))}
            </div>

            <div className={styles.choose_divider}>
              <span>ou</span>
            </div>

            <button
              className={styles.choose_roulette}
              onClick={handleRoulette}
              disabled={isSpinning}
            >
              {isSpinning ? (
                <span className={styles["choose_roulette--spinning"]}>
                  {selectedCat ? `${CATEGORIES.find(c => c.id === selectedCat)?.emoji} ...` : "⟳"}
                </span>
              ) : (
                "✦ Roulette multi-univers"
              )}
            </button>

            {error && <p className={styles.choose_error}>{error}</p>}
          </div>
        )}

        {/* ── STEP 3 : Résultat ── */}
        {step === "result" && result && catInfo && (
          <div className={styles.result_wrapper}>
            <div className={styles.result_card}>
              {/* Image */}
              <div className={styles.result_image_wrap}>
                {result.image ? (
                  <img
                    src={result.image}
                    alt={result.name}
                    className={styles.result_image}
                  />
                ) : (
                  <div className={styles.result_image_placeholder}>
                    <span>{catInfo.emoji}</span>
                  </div>
                )}
                <div
                  className={styles.result_cat_badge}
                  style={{ "--cat-color": catInfo.color } as React.CSSProperties}
                >
                  {catInfo.emoji} {catInfo.label}
                </div>
              </div>

              {/* Contenu */}
              <div className={styles.result_content}>
                {astro && (
                  <div className={styles.result_meta}>
                    <span>{astro.emoji} {astro.sign}</span>
                    <span>·</span>
                    <span>{firstName.trim()[0].toUpperCase()} comme lettre</span>
                    <span>·</span>
                    <span>seed #{seed}</span>
                  </div>
                )}

                <p className={styles.result_phrase}>{result.phrase}</p>
                <h3 className={styles.result_name}>{result.name}</h3>
                <p className={styles.result_subtitle}>{result.subtitle}</p>

                <p className={styles.result_footer}>
                  Basé sur ton prénom, ta date et une pincée de hasard ✦
                </p>
              </div>
            </div>

            <div className={styles.result_actions}>
              <button className={styles.result_retry} onClick={() => setStep("choose")}>
                ← Changer d'univers
              </button>
              <button className={styles.result_reset} onClick={reset}>
                Recommencer
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default PersonalityGameContainer;