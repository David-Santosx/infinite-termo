import type { Game, GameMode } from "./types";

export const CAMPAIGN_STAGES: readonly GameMode[] = ["termo", "dueto", "quarteto"];

export interface Campaign {
  runId: string;
  stage: number;
  round: number;
  score: number;
  best: number;
  game: Game;
}

export const stageMode = (stage: number): GameMode => CAMPAIGN_STAGES[stage];

export function startCampaign(runId: string, best: number, game: Game): Campaign {
  return { runId, stage: 0, round: 1, score: 0, best, game };
}

export function updateCampaignGame(campaign: Campaign, game: Game): Campaign {
  const justWon = game.status === "won" && campaign.game.status === "playing";
  const score = justWon ? campaign.score + 1 : campaign.score;
  return { ...campaign, game, score, best: Math.max(campaign.best, score) };
}

export function nextStage(campaign: Campaign): { stage: number; round: number } {
  const stage = (campaign.stage + 1) % CAMPAIGN_STAGES.length;
  return { stage, round: stage === 0 ? campaign.round + 1 : campaign.round };
}
