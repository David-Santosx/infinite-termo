import { describe, expect, it } from "vitest";
import type { PublicGame } from "@/features/game/contract";
import { emptyStats, recordGame, winRate } from "./stats";

const game = (over: Partial<PublicGame>): PublicGame => ({
  id: "g1",
  mode: "termo",
  boardMode: "termo",
  maxAttempts: 6,
  attemptsUsed: 3,
  status: "won",
  boards: [],
  ...over,
});

describe("recordGame", () => {
  it("records a win with distribution and streak", () => {
    const s = recordGame(emptyStats(), game({}));
    expect(s.modes.termo).toMatchObject({ played: 1, wins: 1, currentStreak: 1, maxStreak: 1 });
    expect(s.modes.termo.distribution[2]).toBe(1);
  });

  it("is idempotent per game id", () => {
    const once = recordGame(emptyStats(), game({}));
    expect(recordGame(once, game({}))).toEqual(once);
  });

  it("resets the streak on a loss and keeps max", () => {
    let s = recordGame(emptyStats(), game({ id: "a" }));
    s = recordGame(s, game({ id: "b" }));
    s = recordGame(s, game({ id: "c", status: "lost", attemptsUsed: 6 }));
    expect(s.modes.termo).toMatchObject({ played: 3, wins: 2, currentStreak: 0, maxStreak: 2 });
    expect(winRate(s.modes.termo)).toBe(67);
  });

  it("ignores games still in progress", () => {
    expect(recordGame(emptyStats(), game({ status: "playing" }))).toEqual(emptyStats());
  });

  it("records campaign runs only when they end", () => {
    const camp = { stage: 1, round: 1, score: 4, best: 4 };
    let s = recordGame(emptyStats(), game({ id: "w", mode: "campaign", campaign: camp }));
    expect(s.campaign.runs).toBe(0);
    s = recordGame(s, game({ id: "l", mode: "campaign", status: "lost", campaign: camp }));
    expect(s.campaign).toEqual({ runs: 1, best: 4, lastScore: 4 });
    expect(s.modes.termo.played).toBe(0);
  });
});
