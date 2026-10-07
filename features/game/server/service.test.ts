import { describe, expect, it } from "vitest";
import { getGame, startNewGame, submitGuess } from "./service";
import { emptyState, type GameState } from "./state";
import { ANSWERS } from "./words";

let n = 0;
const deps = { random: () => 0, newId: () => `id${++n}` };

function solve(state: GameState, mode: "termo" | "campaign") {
  const answers = mode === "campaign" ? state.campaign!.game.answers : state.games.termo!.answers;
  let s = state;
  for (const a of answers) {
    const r = submitGuess(s, mode, a, deps);
    if (!r.ok) throw new Error(r.error);
    s = r.state;
  }
  return s;
}

describe("service", () => {
  it("creates a game on first access and hides answers", () => {
    const { state, game } = getGame(emptyState(), "dueto", deps);
    expect(state.games.dueto?.answers).toHaveLength(2);
    expect(game.boards).toHaveLength(2);
    expect(game.boards.every((b) => b.answer === undefined)).toBe(true);
    expect(JSON.stringify(game)).not.toContain(state.games.dueto!.answers[0]);
  });

  it("keeps games per mode independent", () => {
    const a = getGame(emptyState(), "termo", deps).state;
    const b = getGame(a, "dueto", deps).state;
    expect(b.games.termo).toBe(a.games.termo);
  });

  it("returns the same game while it is in progress", () => {
    const { state } = getGame(emptyState(), "termo", deps);
    expect(getGame(state, "termo", deps).state).toBe(state);
  });

  it("applies a guess and shows accented letters", () => {
    const { state } = getGame(emptyState(), "termo", deps);
    const r = submitGuess(state, "termo", "força", deps);
    expect(r.ok).toBe(true);
    if (r.ok) {
      expect(r.game.boards[0].rows[0].letters).toEqual(["F", "O", "R", "Ç", "A"]);
      expect(r.game.attemptsUsed).toBe(1);
    }
  });

  it("reveals answers when the game ends", () => {
    const state = solve(getGame(emptyState(), "termo", deps).state, "termo");
    const { game } = getGame(state, "termo", deps);
    expect(game.status).toBe("won");
    expect(game.boards[0].answer).toBeDefined();
  });

  it("exposes only the answer of a solved board while the game is in progress", () => {
    const { state } = getGame(emptyState(), "dueto", deps);
    const [first, second] = state.games.dueto!.answers;
    expect(first).not.toBe(second);
    const r = submitGuess(state, "dueto", first, deps);
    if (!r.ok) throw new Error(r.error);
    expect(r.game.status).toBe("playing");
    expect(r.game.boards[0].answer).toBeDefined();
    expect(r.game.boards[1].answer).toBeUndefined();
    expect(JSON.stringify(r.game)).not.toContain(second);
  });

  it("refuses a new game while one is in progress", () => {
    const { state } = getGame(emptyState(), "termo", deps);
    expect(startNewGame(state, "termo", deps)).toEqual({ ok: false, error: "GAME_IN_PROGRESS" });
  });

  it("starts a new game after the previous one ended", () => {
    const state = solve(getGame(emptyState(), "termo", deps).state, "termo");
    const r = startNewGame(state, "termo", deps);
    expect(r.ok && r.game.status).toBe("playing");
    expect(r.ok && r.game.id).not.toBe(state.games.termo!.id);
  });

  it("advances the campaign after a win and resets after a loss", () => {
    let state = getGame(emptyState(), "campaign", deps).state;
    expect(state.campaign).toMatchObject({ stage: 0, score: 0 });

    state = solve(state, "campaign");
    const next = startNewGame(state, "campaign", deps);
    if (!next.ok) throw new Error(next.error);
    expect(next.game.campaign).toMatchObject({ stage: 1, score: 1, best: 1 });
    expect(next.game.boards).toHaveLength(2);

    let lost = next.state;
    const losing = ANSWERS.filter((w) => !lost.campaign!.game.answers.includes(w)).slice(0, 7);
    for (const w of losing) {
      const r = submitGuess(lost, "campaign", w, deps);
      if (r.ok) lost = r.state;
    }
    expect(lost.campaign!.game.status).toBe("lost");

    const fresh = startNewGame(lost, "campaign", deps);
    expect(fresh.ok && fresh.game.campaign).toMatchObject({ stage: 0, round: 1, score: 0, best: 1 });
  });
});
