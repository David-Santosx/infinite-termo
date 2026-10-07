import { describe, expect, it } from "vitest";
import type { PublicGame } from "@/features/game/contract";
import { buildShareText } from "./share";

const row = (statuses: ("correct" | "present" | "absent")[]) => ({ letters: ["A", "B", "C", "D", "E"], statuses });

const termo: PublicGame = {
  id: "g",
  mode: "termo",
  boardMode: "termo",
  maxAttempts: 6,
  attemptsUsed: 2,
  status: "won",
  boards: [
    {
      solved: true,
      answer: "TERMO",
      rows: [row(["absent", "present", "absent", "absent", "correct"]), row(Array(5).fill("correct"))],
    },
  ],
};

describe("buildShareText", () => {
  it("renders header, grid and url", () => {
    expect(buildShareText(termo, { highContrast: false, url: "https://x.dev" })).toBe(
      ["Infinite Termo · Termo 2/6", "", "⬛🟨⬛⬛🟩", "🟩🟩🟩🟩🟩", "", "https://x.dev"].join("\n"),
    );
  });

  it("uses high contrast colors and X for losses", () => {
    const text = buildShareText({ ...termo, status: "lost" }, { highContrast: true, url: "u" });
    expect(text.split("\n")[0]).toBe("Infinite Termo · Termo X/6");
    expect(text).toContain("🟧🟧🟧🟧🟧");
    expect(text).toContain("🟦");
  });

  it("places boards side by side in pairs", () => {
    const dueto: PublicGame = { ...termo, boardMode: "dueto", mode: "dueto", maxAttempts: 7, boards: [termo.boards[0], termo.boards[0]] };
    const lines = buildShareText(dueto, { highContrast: false, url: "u" }).split("\n");
    expect(lines[2]).toBe("⬛🟨⬛⬛🟩 ⬛🟨⬛⬛🟩");
  });

  it("mentions the campaign score", () => {
    const text = buildShareText({ ...termo, mode: "campaign", campaign: { stage: 0, round: 1, score: 3, best: 5 } }, { highContrast: false, url: "u" });
    expect(text.split("\n")[0]).toBe("Infinite Termo · Campanha (Termo) 2/6 · 3 etapas");
  });
});
