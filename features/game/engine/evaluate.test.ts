import { describe, expect, it } from "vitest";
import { evaluate } from "./evaluate";

describe("evaluate", () => {
  it("marks exact matches as correct", () => {
    expect(evaluate("termo", "termo")).toEqual(Array(5).fill("correct"));
  });

  it("marks misplaced letters as present", () => {
    expect(evaluate("metro", "termo")).toEqual(["present", "correct", "present", "present", "correct"]);
  });

  it("does not over-count repeated letters in the guess", () => {
    expect(evaluate("aaaab", "abcde")).toEqual(["correct", "absent", "absent", "absent", "present"]);
  });

  it("prefers the correct position over an earlier present", () => {
    expect(evaluate("sossa", "massa")).toEqual(["absent", "absent", "correct", "correct", "correct"]);
  });

  it("marks a second occurrence present when the answer has two", () => {
    expect(evaluate("assar", "massa")).toEqual(["present", "present", "correct", "present", "absent"]);
  });
});
