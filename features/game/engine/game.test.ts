import { describe, expect, it } from "vitest";
import { applyGuess, boardGuesses, createGame, isBoardSolved } from "./game";
import type { Dictionary, Game } from "./types";

const dictionary: Dictionary = {
  has: (w) => ["termo", "metro", "aviao", "forca", "nobre", "sutil", "fosco", "lugar", "pente"].includes(w),
};

function play(game: Game, ...words: string[]) {
  return words.reduce((g, w) => {
    const r = applyGuess(g, w, dictionary);
    if (!r.ok) throw new Error(r.error);
    return r.game;
  }, game);
}

describe("applyGuess", () => {
  const termo = createGame("g1", "termo", ["termo"]);

  it("rejects wrong length", () => {
    expect(applyGuess(termo, "ter", dictionary)).toEqual({ ok: false, error: "INVALID_LENGTH" });
  });

  it("rejects words outside the dictionary", () => {
    expect(applyGuess(termo, "xxxxx", dictionary)).toEqual({ ok: false, error: "NOT_IN_DICTIONARY" });
  });

  it("normalizes accents and case before validating", () => {
    const r = applyGuess(termo, "AVIÃO", dictionary);
    expect(r.ok && r.game.guesses).toEqual(["aviao"]);
  });

  it("rejects repeated guesses", () => {
    const g = play(termo, "metro");
    expect(applyGuess(g, "METRO", dictionary)).toEqual({ ok: false, error: "ALREADY_GUESSED" });
  });

  it("wins when every board is solved", () => {
    expect(play(termo, "metro", "termo").status).toBe("won");
  });

  it("loses when attempts run out", () => {
    const g = play(termo, "metro", "aviao", "forca", "nobre", "sutil", "fosco");
    expect(g.status).toBe("lost");
    expect(applyGuess(g, "termo", dictionary)).toEqual({ ok: false, error: "GAME_OVER" });
  });

  it("stops adding rows to a solved board", () => {
    const dueto = createGame("g2", "dueto", ["termo", "metro"]);
    const g = play(dueto, "termo", "forca");
    expect(isBoardSolved(g, 0)).toBe(true);
    expect(boardGuesses(g, 0)).toEqual(["termo"]);
    expect(boardGuesses(g, 1)).toEqual(["termo", "forca"]);
    expect(g.status).toBe("playing");
  });

  it("does not mutate the previous game", () => {
    play(termo, "metro");
    expect(termo.guesses).toEqual([]);
  });
});
