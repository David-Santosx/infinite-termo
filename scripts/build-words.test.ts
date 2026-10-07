import { describe, expect, it } from "vitest";
import { buildWordLists } from "./build-words";

describe("buildWordLists", () => {
  const lexicon = ["termo", "Paulo", "força", "forca", "sabiá", "abc", "pé-de", "avião", "aviao", "anal"];

  it("keeps only lowercase five-letter words in guesses", () => {
    const { guesses } = buildWordLists({ answers: ["termo"], lexicon, banned: [] });
    expect(guesses).not.toContain("Paulo");
    expect(guesses).not.toContain("abc");
    expect(guesses).not.toContain("pé-de");
    expect(guesses).toContain("sabiá");
  });

  it("dedupes by normalized form preferring the answer spelling", () => {
    const { guesses } = buildWordLists({ answers: ["força"], lexicon, banned: [] });
    expect(guesses.filter((w) => w.startsWith("for"))).toEqual(["força"]);
  });

  it("drops invalid, duplicated and banned answers and reports them", () => {
    const result = buildWordLists({
      answers: ["termo", "mérito", "termo", "anal", "avião"],
      lexicon,
      banned: ["anal"],
    });
    expect(result.answers).toEqual(["termo", "avião"]);
    expect(result.rejected.sort()).toEqual(["anal", "mérito", "termo"].sort());
  });

  it("guarantees every answer is a valid guess", () => {
    const { answers, guesses } = buildWordLists({ answers: ["zebra"], lexicon, banned: [] });
    expect(guesses).toEqual(expect.arrayContaining(answers));
  });
});
