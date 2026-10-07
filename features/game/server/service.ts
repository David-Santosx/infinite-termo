import {
  nextStage,
  stageMode,
  startCampaign,
  updateCampaignGame,
  type Campaign,
} from "@/features/game/engine/campaign";
import type { GameErrorCode } from "@/features/game/engine/errors";
import { applyGuess, boardGuesses, createGame } from "@/features/game/engine/game";
import { evaluate } from "@/features/game/engine/evaluate";
import { MODES } from "@/features/game/engine/modes";
import type { Game, GameMode, PlayMode } from "@/features/game/engine/types";
import type { PublicGame } from "@/features/game/contract";
import type { GameState } from "./state";
import { dictionary, displayWord, pickAnswers } from "./words";

export interface ServiceDeps {
  random?: () => number;
  newId?: () => string;
}

export type ServiceResult =
  | { ok: true; state: GameState; game: PublicGame }
  | { ok: false; error: GameErrorCode };

const toLetters = (word: string) => Array.from(displayWord(word).toUpperCase());

export function toPublicGame(game: Game, campaign?: Campaign): PublicGame {
  const finished = game.status !== "playing";
  return {
    id: game.id,
    mode: campaign ? "campaign" : game.mode,
    boardMode: game.mode,
    maxAttempts: MODES[game.mode].maxAttempts,
    attemptsUsed: game.guesses.length,
    status: game.status,
    boards: game.answers.map((answer, i) => {
      const guesses = boardGuesses(game, i);
      const solved = guesses.at(-1) === answer;
      return {
        rows: guesses.map((guess) => ({ letters: toLetters(guess), statuses: evaluate(guess, answer) })),
        solved,
        answer: solved || finished ? displayWord(answer).toUpperCase() : undefined,
      };
    }),
    campaign: campaign && {
      stage: campaign.stage,
      round: campaign.round,
      score: campaign.score,
      best: campaign.best,
    },
  };
}

function newGame(mode: GameMode, deps: ServiceDeps): Game {
  const id = deps.newId?.() ?? crypto.randomUUID();
  return createGame(id, mode, pickAnswers(MODES[mode].boards, deps.random));
}

function freshCampaign(best: number, deps: ServiceDeps): Campaign {
  const runId = deps.newId?.() ?? crypto.randomUUID();
  return startCampaign(runId, best, newGame(stageMode(0), deps));
}

function present(state: GameState, mode: PlayMode): PublicGame {
  if (mode === "campaign") return toPublicGame(state.campaign!.game, state.campaign);
  return toPublicGame(state.games[mode]!);
}

function ensure(state: GameState, mode: PlayMode, deps: ServiceDeps): GameState {
  if (mode === "campaign") {
    return state.campaign ? state : { ...state, campaign: freshCampaign(0, deps) };
  }
  return state.games[mode] ? state : { ...state, games: { ...state.games, [mode]: newGame(mode, deps) } };
}

export function getGame(state: GameState, mode: PlayMode, deps: ServiceDeps = {}) {
  const next = ensure(state, mode, deps);
  return { state: next, game: present(next, mode) };
}

export function submitGuess(
  state: GameState,
  mode: PlayMode,
  guess: string,
  deps: ServiceDeps = {},
): ServiceResult {
  const current = ensure(state, mode, deps);
  const game = mode === "campaign" ? current.campaign!.game : current.games[mode]!;
  const result = applyGuess(game, guess, dictionary);
  if (!result.ok) return result;

  const next: GameState =
    mode === "campaign"
      ? { ...current, campaign: updateCampaignGame(current.campaign!, result.game) }
      : { ...current, games: { ...current.games, [mode]: result.game } };

  return { ok: true, state: next, game: present(next, mode) };
}

export function startNewGame(state: GameState, mode: PlayMode, deps: ServiceDeps = {}): ServiceResult {
  if (mode === "campaign") {
    const campaign = state.campaign;
    if (campaign?.game.status === "playing") return { ok: false, error: "GAME_IN_PROGRESS" };

    let next: Campaign;
    if (!campaign || campaign.game.status === "lost") {
      next = freshCampaign(campaign?.best ?? 0, deps);
    } else {
      const { stage, round } = nextStage(campaign);
      next = { ...campaign, stage, round, game: newGame(stageMode(stage), deps) };
    }
    const nextState = { ...state, campaign: next };
    return { ok: true, state: nextState, game: present(nextState, mode) };
  }

  if (state.games[mode]?.status === "playing") return { ok: false, error: "GAME_IN_PROGRESS" };
  const nextState = { ...state, games: { ...state.games, [mode]: newGame(mode, deps) } };
  return { ok: true, state: nextState, game: present(nextState, mode) };
}
