import type { PublicGame } from "@/features/game/contract";
import { GAME_MODES, MODES } from "@/features/game/engine/modes";
import type { GameMode } from "@/features/game/engine/types";
import { readJson, writeJson } from "./storage";

export interface ModeStats {
  played: number;
  wins: number;
  currentStreak: number;
  maxStreak: number;
  distribution: number[];
}

export interface CampaignStats {
  runs: number;
  best: number;
  lastScore: number;
}

export interface Stats {
  v: 1;
  modes: Record<GameMode, ModeStats>;
  campaign: CampaignStats;
  recorded: string[];
}

const STORAGE_KEY = "it_stats";
const RECORDED_LIMIT = 200;

const emptyMode = (mode: GameMode): ModeStats => ({
  played: 0,
  wins: 0,
  currentStreak: 0,
  maxStreak: 0,
  distribution: Array(MODES[mode].maxAttempts).fill(0),
});

export const emptyStats = (): Stats => ({
  v: 1,
  modes: Object.fromEntries(GAME_MODES.map((m) => [m, emptyMode(m)])) as Record<GameMode, ModeStats>,
  campaign: { runs: 0, best: 0, lastScore: 0 },
  recorded: [],
});

export const winRate = (s: ModeStats) => (s.played ? Math.round((s.wins / s.played) * 100) : 0);

export function recordGame(stats: Stats, game: PublicGame): Stats {
  if (game.status === "playing" || stats.recorded.includes(game.id)) return stats;
  const recorded = [...stats.recorded, game.id].slice(-RECORDED_LIMIT);

  if (game.mode === "campaign") {
    if (game.status !== "lost" || !game.campaign) return { ...stats, recorded };
    const score = game.campaign.score;
    return {
      ...stats,
      recorded,
      campaign: { runs: stats.campaign.runs + 1, lastScore: score, best: Math.max(stats.campaign.best, score, game.campaign.best) },
    };
  }

  const prev = stats.modes[game.mode];
  const won = game.status === "won";
  const currentStreak = won ? prev.currentStreak + 1 : 0;
  const distribution = [...prev.distribution];
  if (won) distribution[game.attemptsUsed - 1] += 1;

  return {
    ...stats,
    recorded,
    modes: {
      ...stats.modes,
      [game.mode]: {
        played: prev.played + 1,
        wins: prev.wins + (won ? 1 : 0),
        currentStreak,
        maxStreak: Math.max(prev.maxStreak, currentStreak),
        distribution,
      },
    },
  };
}

export function loadStats(): Stats {
  const stored = readJson<Stats | null>(STORAGE_KEY, null);
  return stored?.v === 1 ? { ...emptyStats(), ...stored } : emptyStats();
}

export const saveStats = (stats: Stats) => writeJson(STORAGE_KEY, stats);
