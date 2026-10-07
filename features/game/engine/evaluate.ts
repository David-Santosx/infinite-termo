import type { TileStatus } from "./types";

export function evaluate(guess: string, answer: string): TileStatus[] {
  const result: TileStatus[] = Array(guess.length).fill("absent");
  const unmatched = new Map<string, number>();

  for (let i = 0; i < answer.length; i++) {
    if (guess[i] === answer[i]) result[i] = "correct";
    else unmatched.set(answer[i], (unmatched.get(answer[i]) ?? 0) + 1);
  }

  for (let i = 0; i < guess.length; i++) {
    if (result[i] === "correct") continue;
    const left = unmatched.get(guess[i]) ?? 0;
    if (left > 0) {
      result[i] = "present";
      unmatched.set(guess[i], left - 1);
    }
  }

  return result;
}
