import { ASTRO_SIGNS, PHRASES } from "./constants";
import type { AstroResult, Category } from "./types";

export function getAstroSign(date: Date): AstroResult {
  const month = date.getMonth() + 1;
  const day = date.getDate();

  for (const sign of ASTRO_SIGNS) {
    const [startMonth, startDay] = sign.start;
    const [endMonth, endDay] = sign.end;

    if (startMonth <= endMonth) {
      const isInRange =
        (month === startMonth && day >= startDay) ||
        (month === endMonth && day <= endDay) ||
        (month > startMonth && month < endMonth);

      if (isInRange) {
        return {
          sign: sign.sign,
          emoji: sign.emoji,
          element: sign.element,
        };
      }
    } else {
      const isInRange =
        (month === startMonth && day >= startDay) ||
        (month === endMonth && day <= endDay) ||
        month > startMonth ||
        month < endMonth;

      if (isInRange) {
        return {
          sign: sign.sign,
          emoji: sign.emoji,
          element: sign.element,
        };
      }
    }
  }

  return {
    sign: "Capricorne",
    emoji: "♑",
    element: "Terre",
  };
}

export function computeSeed(firstName: string, birthDate: Date): number {
  const normalized = firstName.trim().toUpperCase();
  const firstLetterCode = normalized.charCodeAt(0) || 65;
  const day = birthDate.getDate();
  const month = birthDate.getMonth() + 1;
  const year = birthDate.getFullYear();

  return (firstLetterCode * 7 + day * 13 + month * 31 + year) % 1000;
}

export function seededPick<T>(arr: T[], seed: number): T {
  return arr[seed % arr.length];
}

export function getPhrase(category: Category, seed: number): string {
  return seededPick([...PHRASES[category]], seed);
}