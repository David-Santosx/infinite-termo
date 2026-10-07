import { afterEach, describe, expect, it, vi } from "vitest";
import type { PublicGame } from "@/features/game/contract";
import { buildShareText, shareResult } from "./share";

const row = (statuses: ("correct" | "present" | "absent")[]) => ({
  letters: ["A", "B", "C", "D", "E"],
  statuses,
});

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
    const dueto: PublicGame = {
      ...termo,
      boardMode: "dueto",
      mode: "dueto",
      maxAttempts: 7,
      boards: [termo.boards[0], termo.boards[0]],
    };
    const lines = buildShareText(dueto, { highContrast: false, url: "u" }).split("\n");
    expect(lines[2]).toBe("⬛🟨⬛⬛🟩 ⬛🟨⬛⬛🟩");
  });

  it("mentions the campaign score", () => {
    const text = buildShareText(
      { ...termo, mode: "campaign", campaign: { stage: 0, round: 1, score: 3, best: 5 } },
      { highContrast: false, url: "u" },
    );
    expect(text.split("\n")[0]).toBe("Infinite Termo · Campanha (Termo) 2/6 · 3 etapas");
  });

  it("uses the singular for a single stage", () => {
    const text = buildShareText(
      { ...termo, mode: "campaign", campaign: { stage: 0, round: 1, score: 1, best: 5 } },
      { highContrast: false, url: "u" },
    );
    expect(text.split("\n")[0]).toBe("Infinite Termo · Campanha (Termo) 2/6 · 1 etapa");
  });
});

describe("shareResult", () => {
  const stubEnv = (opts: {
    share?: () => Promise<void>;
    writeText?: () => Promise<void>;
    coarse?: boolean;
  }) => {
    vi.stubGlobal("navigator", {
      share: opts.share,
      clipboard: { writeText: opts.writeText ?? (async () => {}) },
    });
    vi.stubGlobal("matchMedia", () => ({ matches: opts.coarse ?? true }));
  };

  afterEach(() => vi.unstubAllGlobals());

  it("shares natively on touch devices", async () => {
    stubEnv({ share: async () => {} });
    expect(await shareResult("t")).toBe("shared");
  });

  it("reports a cancelled share without falling back", async () => {
    const writeText = vi.fn(async () => {});
    stubEnv({
      share: async () => {
        throw new DOMException("cancelled", "AbortError");
      },
      writeText,
    });
    expect(await shareResult("t")).toBe("cancelled");
    expect(writeText).not.toHaveBeenCalled();
  });

  it("falls back to the clipboard when sharing fails", async () => {
    stubEnv({
      share: async () => {
        throw new Error("boom");
      },
    });
    expect(await shareResult("t")).toBe("copied");
  });

  it("copies when native share is unavailable", async () => {
    stubEnv({});
    expect(await shareResult("t")).toBe("copied");
  });

  it("copies on non-touch devices even if share exists", async () => {
    const share = vi.fn(async () => {});
    stubEnv({ share, coarse: false });
    expect(await shareResult("t")).toBe("copied");
    expect(share).not.toHaveBeenCalled();
  });

  it("fails when the clipboard is unavailable", async () => {
    stubEnv({
      writeText: async () => {
        throw new Error("denied");
      },
    });
    expect(await shareResult("t")).toBe("failed");
  });
});
