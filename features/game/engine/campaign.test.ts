import { describe, expect, it } from "vitest";
import { nextStage, stageMode, startCampaign, updateCampaignGame } from "./campaign";
import { createGame } from "./game";

describe("campaign", () => {
  const first = createGame("g1", "termo", ["termo"]);

  it("starts at stage 0, round 1, score 0, keeping the best", () => {
    expect(startCampaign("r1", 7, first)).toMatchObject({ stage: 0, round: 1, score: 0, best: 7 });
  });

  it("scores once when a game is won and updates best", () => {
    const c = startCampaign("r1", 0, first);
    const won = updateCampaignGame(c, { ...first, guesses: ["termo"], status: "won" });
    expect(won).toMatchObject({ score: 1, best: 1 });
    expect(updateCampaignGame(won, won.game).score).toBe(1);
  });

  it("does not score a loss", () => {
    const c = startCampaign("r1", 3, first);
    expect(updateCampaignGame(c, { ...first, status: "lost" })).toMatchObject({ score: 0, best: 3 });
  });

  it("advances termo → dueto → quarteto → termo with a new round", () => {
    const c = startCampaign("r1", 0, first);
    expect(nextStage(c)).toEqual({ stage: 1, round: 1 });
    expect(nextStage({ ...c, stage: 2 })).toEqual({ stage: 0, round: 2 });
    expect([0, 1, 2].map(stageMode)).toEqual(["termo", "dueto", "quarteto"]);
  });
});
