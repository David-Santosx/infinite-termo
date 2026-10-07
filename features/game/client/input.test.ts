import { describe, expect, it } from "vitest";
import { emptyInput, inputReducer, inputWord, type InputAction } from "./input";

const run = (...actions: InputAction[]) => actions.reduce(inputReducer, emptyInput());
const type = (word: string) => [...word].map((letter) => ({ type: "letter", letter }) as InputAction);

describe("inputReducer", () => {
  it("types letters and advances the cursor, stopping at the end", () => {
    const s = run(...type("TERMOS"));
    expect(inputWord(s)).toBe("TERMS");
    expect(s.cursor).toBe(4);
  });

  it("backspace clears the current cell when filled, else the previous one", () => {
    let s = run(...type("TER"));
    expect(s.cursor).toBe(3);
    s = inputReducer(s, { type: "backspace" });
    expect(inputWord(s)).toBe("TE");
    expect(s.cursor).toBe(2);
    s = inputReducer({ ...s, cursor: 1 }, { type: "backspace" });
    expect(s.letters).toEqual(["T", "", "", "", ""]);
  });

  it("moves with arrows/home/end and select within bounds", () => {
    expect(run({ type: "left" }).cursor).toBe(0);
    expect(run({ type: "end" }).cursor).toBe(4);
    expect(run({ type: "end" }, { type: "right" }).cursor).toBe(4);
    expect(run({ type: "select", cursor: 2 }).cursor).toBe(2);
    expect(run({ type: "select", cursor: 9 }).cursor).toBe(0);
  });

  it("typing into a selected cell overwrites it", () => {
    const s = run(...type("TERMO"), { type: "select", cursor: 0 }, { type: "letter", letter: "F" });
    expect(inputWord(s)).toBe("FERMO");
  });

  it("delete clears the current cell without moving", () => {
    const s = run(...type("TERMO"), { type: "select", cursor: 1 }, { type: "delete" });
    expect(s.letters[1]).toBe("");
    expect(s.cursor).toBe(1);
  });
});
