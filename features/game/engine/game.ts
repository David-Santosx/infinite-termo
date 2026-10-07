import type { GameErrorCode } from "./errors";
import { MODES, WORD_LENGTH } from "./modes";
import { normalize } from "./normalize";
import type { Dictionary, Game, GameMode } from "./types";

export type GuessResult = { ok: true; game: Game } | { ok: false; error: GameErrorCode };

export function createGame(id: string, mode: GameMode, answers: string[]): Game {
  return { id, mode, answers, guesses: [], status: "playing" };
}

export function boardGuesses(game: Game, boardIndex: number): string[] {
  const solvedAt = game.guesses.indexOf(game.answers[boardIndex]);
  return solvedAt === -1 ? game.guesses : game.guesses.slice(0, solvedAt + 1);
}

export function isBoardSolved(game: Game, boardIndex: number): boolean {
  return game.guesses.includes(game.answers[boardIndex]);
}

export function applyGuess(game: Game, rawGuess: string, dictionary: Dictionary): GuessResult {
  if (game.status !== "playing") return { ok: false, error: "GAME_OVER" };

  const guess = normalize(rawGuess.trim());
  if (guess.length !== WORD_LENGTH) return { ok: false, error: "INVALID_LENGTH" };
  if (!dictionary.has(guess)) return { ok: false, error: "NOT_IN_DICTIONARY" };
  if (game.guesses.includes(guess)) return { ok: false, error: "ALREADY_GUESSED" };

  const guesses = [...game.guesses, guess];
  const won = game.answers.every((answer) => guesses.includes(answer));
  const status = won ? "won" : guesses.length >= MODES[game.mode].maxAttempts ? "lost" : "playing";

  return { ok: true, game: { ...game, guesses, status } };
}
