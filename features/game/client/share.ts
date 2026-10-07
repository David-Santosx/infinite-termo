import type { PublicBoard, PublicGame } from "@/features/game/contract";
import { CAMPAIGN_STAGES } from "@/features/game/engine/campaign";
import { MODE_LABELS } from "@/features/game/engine/modes";
import type { TileStatus } from "@/features/game/engine/types";

const PALETTE: Record<"normal" | "contrast", Record<TileStatus, string>> = {
  normal: { correct: "🟩", present: "🟨", absent: "⬛" },
  contrast: { correct: "🟧", present: "🟦", absent: "⬛" },
};
const EMPTY_ROW = "　".repeat(5);

function header(game: PublicGame) {
  const score = game.status === "won" ? game.attemptsUsed : "X";
  const base = `${score}/${game.maxAttempts}`;
  if (game.mode === "campaign" && game.campaign) {
    const stage = MODE_LABELS[CAMPAIGN_STAGES[game.campaign.stage]];
    return `Infinite Termo · Campanha (${stage}) ${base} · ${game.campaign.score} ${game.campaign.score === 1 ? "etapa" : "etapas"}`;
  }
  return `Infinite Termo · ${MODE_LABELS[game.mode]} ${base}`;
}

function grid(boards: PublicBoard[], colors: Record<TileStatus, string>) {
  const rendered = boards.map((b) => b.rows.map((r) => r.statuses.map((s) => colors[s]).join("")));
  const lines: string[] = [];
  for (let i = 0; i < rendered.length; i += 2) {
    const pair = rendered.slice(i, i + 2);
    const height = Math.max(...pair.map((rows) => rows.length));
    if (i > 0) lines.push("");
    for (let r = 0; r < height; r++) lines.push(pair.map((rows) => rows[r] ?? EMPTY_ROW).join(" "));
  }
  return lines;
}

export function buildShareText(game: PublicGame, opts: { highContrast: boolean; url: string }): string {
  const colors = PALETTE[opts.highContrast ? "contrast" : "normal"];
  return [header(game), "", ...grid(game.boards, colors), "", opts.url].join("\n");
}

export async function shareResult(text: string): Promise<"shared" | "copied" | "cancelled" | "failed"> {
  if (typeof navigator.share === "function" && matchMedia("(pointer: coarse)").matches) {
    try {
      await navigator.share({ text });
      return "shared";
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") return "cancelled";
    }
  }
  try {
    await navigator.clipboard.writeText(text);
    return "copied";
  } catch {
    return "failed";
  }
}
