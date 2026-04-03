"use server";

import { getCategoryResult, type Category } from "../lib/game/getResult";

export async function fetchCategoryResult(params: {
  category: Category;
  astroSign: string;
  seed: number;
}) {
  return getCategoryResult(params);
}