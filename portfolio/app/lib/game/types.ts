export type Category = "music" | "cinema" | "manga";

export interface ResultData {
  name: string;
  image: string;
  category: Category;
  subtitle: string;
  phrase: string;
}

export interface AstroResult {
  sign: string;
  emoji: string;
  element: string;
}

export interface CategoryOption {
  id: Category;
  label: string;
  emoji: string;
  color: string;
}

export interface AstroSignDefinition {
  sign: string;
  emoji: string;
  element: string;
  start: [number, number];
  end: [number, number];
}

export interface PersonalityGameProps {
  id?: string;
}