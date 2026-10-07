import answersData from "./data/answers.json";
import guessesData from "./data/guesses.json";
import { normalize } from "@/features/game/engine/normalize";
import type { Dictionary } from "@/features/game/engine/types";

const accented = new Map<string, string>();
for (const word of guessesData) accented.set(normalize(word), word);
for (const word of answersData) accented.set(normalize(word), word);

export const ANSWERS: readonly string[] = answersData.map(normalize);

export const dictionary: Dictionary = { has: (word) => accented.has(word) };

export const displayWord = (normalized: string) => accented.get(normalized) ?? normalized;

export function pickAnswers(count: number, random: () => number = Math.random): string[] {
  const picked = new Set<string>();
  let offset = 0;
  while (picked.size < count) {
    const index = (Math.floor(random() * ANSWERS.length) + offset++) % ANSWERS.length;
    picked.add(ANSWERS[index]);
  }
  return [...picked];
}
