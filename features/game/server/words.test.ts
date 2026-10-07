import { describe, expect, it } from "vitest";
import { ANSWERS, dictionary, displayWord, pickAnswers } from "./words";

describe("words", () => {
  it("has normalized five-letter answers that are all valid guesses", () => {
    expect(ANSWERS.length).toBeGreaterThan(1000);
    for (const a of ANSWERS) {
      expect(a).toMatch(/^[a-z]{5}$/);
      expect(dictionary.has(a)).toBe(true);
    }
  });

  it("accepts words outside the answer list", () => {
    expect(ANSWERS.includes("zumbi")).toBe(false);
    expect(dictionary.has("zumbi")).toBe(true);
  });

  it("restores accents for display", () => {
    expect(displayWord("forca")).toBe("força");
    expect(displayWord("qqqqq")).toBe("qqqqq");
  });

  it("picks distinct answers", () => {
    let i = 0;
    const repeating = () => [0.1, 0.1, 0.1, 0.5, 0.9][i++ % 5];
    const picked = pickAnswers(4, repeating);
    expect(new Set(picked).size).toBe(4);
  });
});
