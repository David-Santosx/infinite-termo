import { describe, expect, it } from "vitest";
import { normalize } from "./normalize";

describe("normalize", () => {
  it("strips accents, cedilla and case", () => {
    expect(normalize("AVIÃO")).toBe("aviao");
    expect(normalize("Força")).toBe("forca");
    expect(normalize("pôr")).toBe("por");
  });
});
