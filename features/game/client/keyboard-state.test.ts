import { describe, expect, it } from "vitest";
import { keyboardStatuses } from "./keyboard-state";
import type { PublicBoard } from "@/features/game/contract";

const board = (rows: [string, ("correct" | "present" | "absent")[]][]): PublicBoard => ({
  solved: false,
  rows: rows.map(([w, statuses]) => ({ letters: Array.from(w), statuses })),
});

describe("keyboardStatuses", () => {
  it("keeps the best status per letter per board", () => {
    const b = board([
      ["TERMO", ["absent", "present", "absent", "absent", "absent"]],
      ["METRO", ["absent", "correct", "absent", "absent", "absent"]],
    ]);
    const k = keyboardStatuses([b, board([])]);
    expect(k.E).toEqual(["correct", undefined]);
    expect(k.T).toEqual(["absent", undefined]);
  });

  it("maps accented letters to their base key", () => {
    const k = keyboardStatuses([board([["FORÇA", ["absent", "absent", "absent", "present", "absent"]]])]);
    expect(k.C).toEqual(["present"]);
  });

  it("can hide a row still being revealed", () => {
    const b = board([["TERMO", ["correct", "correct", "correct", "correct", "correct"]]]);
    expect(keyboardStatuses([b], 0).T).toEqual([undefined]);
  });
});
