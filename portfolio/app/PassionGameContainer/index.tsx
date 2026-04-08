"use client";

import React, { useState, useCallback } from "react";
import { getAstroSign, computeSeed } from "../lib/game/utils";
import { fetchCategoryResult } from "../actions/getResult";
import type { Category, ResultData, AstroResult } from "../lib/game/types";
import { CATEGORIES } from "../lib/game/constants";
import styles from "./styles.module.scss";

interface PersonalityGameProps {
  id?: string;
}

const MULTIVERSE_CATEGORIES: Category[] = ["music", "cinema", "manga", "football"];

const PersonalityGameContainer: React.FC<PersonalityGameProps> = ({ id }) => {
  const [firstName, setFirstName] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [selectedCat, setSelectedCat] = useState<Category | null>(null);
  const [isSpinning, setIsSpinning] = useState(false);
  const [result, setResult] = useState<ResultData | null>(null);
  const [results, setResults] = useState<ResultData[]>([]);
  const [astro, setAstro] = useState<AstroResult | null>(null);
  const [seed, setSeed] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [step, setStep] = useState<"form" | "choose" | "result">("form");

  const dominantLetter = firstName.trim()[0]?.toUpperCase() ?? "";
  const isMultiResult = results.length > 0;

  const handleFormSubmit = () => {
    if (!firstName.trim() || !birthDate) return;

    const date = new Date(birthDate);
    const computedSeed = computeSeed(firstName, date);
    const computedAstro = getAstroSign(date);

    setSeed(computedSeed);
    setAstro(computedAstro);
    setStep("choose");
    setResult(null);
    setResults([]);
    setError(null);
  };

  const handlePlay = useCallback(
    async (cat: Category) => {
      if (!astro) return;

      setSelectedCat(cat);
      setIsSpinning(true);
      setError(null);
      setResult(null);
      setResults([]);

      try {
        const res = await fetchCategoryResult({
          category: cat,
          astroSign: astro.sign,
          seed,
        });

        setResult(res);
        setStep("result");
      } catch (e) {
        setError(
          e instanceof Error
            ? e.message
            : "Une erreur est survenue. Réessaie !"
        );
      } finally {
        setIsSpinning(false);
      }
    },
    [astro, seed]
  );

  const handleRoulette = async () => {
    if (!astro) return;

    setIsSpinning(true);
    setError(null);
    setResult(null);
    setResults([]);

    const rouletteOrder: Category[] = [
      ...MULTIVERSE_CATEGORIES,
      ...MULTIVERSE_CATEGORIES,
      ...MULTIVERSE_CATEGORIES,
    ];

    for (let i = 0; i < rouletteOrder.length; i++) {
      setSelectedCat(rouletteOrder[i]);
      await new Promise((r) => setTimeout(r, 180 + i * 60));
    }

    await new Promise((r) => setTimeout(r, 400));

    try {
      const allResults = await Promise.all(
        MULTIVERSE_CATEGORIES.map((category) =>
          fetchCategoryResult({
            category,
            astroSign: astro.sign,
            seed,
          })
        )
      );

      setResults(allResults);
      setStep("result");
    } catch (e) {
      setError(
        e instanceof Error
          ? e.message
          : "Une erreur est survenue. Réessaie !"
      );
    } finally {
      setIsSpinning(false);
    }
  };

  const reset = () => {
    setStep("form");
    setResult(null);
    setResults([]);
    setAstro(null);
    setSelectedCat(null);
    setError(null);
    setFirstName("");
    setBirthDate("");
    setSeed(0);
  };

  const singleCatInfo = result
    ? CATEGORIES.find((c) => c.id === result.category)
    : null;

  return (
    <section id={id} className={styles.game_section}>
      <div className={styles.game_header}>
        <span className={styles.game_eyebrow}>Mini-jeu</span>
        <h2 className={styles.game_title}>Découvre ce qui te représente</h2>
        <p className={styles.game_subtitle}>
          ton prénom + ta date de naissance = un résultat unique propre à toi
        </p>
      </div>

      <div className={styles.game_body}>
        {step === "form" && (
          <div className={styles.form_card}>
            <div className={styles.form_fields}>
              <div className={styles.field}>
                <label className={styles.field_label}>Ton prénom</label>
                <input
                  type="text"
                  placeholder="ex: Lucas"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleFormSubmit()}
                  className={styles.field_input}
                />
              </div>

              <div className={styles.field}>
                <label className={styles.field_label}>Ta date de naissance</label>
                <input
                  type="date"
                  value={birthDate}
                  onChange={(e) => setBirthDate(e.target.value)}
                  className={styles.field_input}
                />
              </div>
            </div>

            <button
              className={styles.submit_btn}
              onClick={handleFormSubmit}
              disabled={!firstName.trim() || !birthDate}
            >
              Continuer
            </button>
          </div>
        )}

        {step === "choose" && astro && (
          <div className={styles.choose_wrapper}>
            <div className={styles.astro_badge}>
              <span className={styles.astro_emoji}>{astro.emoji}</span>
              <div className={styles.astro_info}>
                <span>
                  {astro.sign} · {astro.element}
                </span>
                <span>
                  Lettre dominante : <strong>{dominantLetter}</strong>
                </span>
              </div>
            </div>

            <p className={styles.choose_label}>Choisis ton univers</p>

            <div className={styles.cat_grid}>
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  className={`${styles.cat_btn} ${
                    selectedCat === cat.id && isSpinning ? styles.cat_active : ""
                  }`}
                  onClick={() => !isSpinning && handlePlay(cat.id)}
                  disabled={isSpinning}
                  style={{ "--cat-color": cat.color } as React.CSSProperties}
                >
                  <span className={styles.cat_emoji}>{cat.emoji}</span>
                  <span className={styles.cat_label}>{cat.label}</span>
                </button>
              ))}
            </div>

            <div className={styles.divider}>ou</div>

            <button
              className={styles.roulette_btn}
              onClick={handleRoulette}
              disabled={isSpinning}
            >
              {isSpinning ? (
                <span className={styles.spinning_text}>
                  {selectedCat &&
                    CATEGORIES.find((c) => c.id === selectedCat)?.emoji}{" "}
                  ...
                </span>
              ) : (
                "✦ Roulette multi-univers"
              )}
            </button>

            {error && <p className={styles.error_msg}>{error}</p>}
          </div>
        )}

        {step === "result" && isMultiResult && (
          <div className={styles.result_wrapper}>
            <div className={styles.multi_result_grid}>
              {results.map((item) => {
                const catInfo = CATEGORIES.find((c) => c.id === item.category);

                if (!catInfo) return null;

                return (
                  <div key={item.category} className={styles.result_card}>
                    <div className={styles.result_image_wrap}>
                      {item.image ? (
                        <img
                          src={item.image}
                          alt={item.name}
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

                    <div className={styles.result_content}>
                      <div className={styles.result_meta}>
                        <span>
                          {astro?.emoji} {astro?.sign}
                        </span>
                        <span>·</span>
                        <span>{dominantLetter} comme lettre</span>
                      </div>

                      <p className={styles.result_phrase}>{item.phrase}</p>
                      <h3 className={styles.result_name}>{item.name}</h3>
                      <p className={styles.result_subtitle}>{item.subtitle}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className={styles.result_actions}>
              <button
                className={styles.retry_btn}
                onClick={() => {
                  setStep("choose");
                  setResult(null);
                  setResults([]);
                }}
              >
                Changer d&apos;univers
              </button>
              <button className={styles.reset_btn} onClick={reset}>
                Recommencer
              </button>
            </div>
          </div>
        )}

        {step === "result" && result && singleCatInfo && !isMultiResult && (
          <div className={styles.result_wrapper}>
            <div className={styles.result_card}>
              <div className={styles.result_image_wrap}>
                {result.image ? (
                  <img
                    src={result.image}
                    alt={result.name}
                    className={styles.result_image}
                  />
                ) : (
                  <div className={styles.result_image_placeholder}>
                    <span>{singleCatInfo.emoji}</span>
                  </div>
                )}

                <div
                  className={styles.result_cat_badge}
                  style={{ "--cat-color": singleCatInfo.color } as React.CSSProperties}
                >
                  {singleCatInfo.emoji} {singleCatInfo.label}
                </div>
              </div>

              <div className={styles.result_content}>
                {astro && (
                  <div className={styles.result_meta}>
                    <span>
                      {astro.emoji} {astro.sign}
                    </span>
                    <span>·</span>
                    <span>{dominantLetter} comme lettre</span>
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
              <button
                className={styles.retry_btn}
                onClick={() => setStep("choose")}
              >
                Changer d&apos;univers
              </button>
              <button className={styles.reset_btn} onClick={reset}>
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