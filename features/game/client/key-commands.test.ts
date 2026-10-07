import { describe, expect, it } from "vitest";
import { mapKeyEvent } from "./key-commands";

const key = (k: string, mods: Partial<{ ctrlKey: boolean; metaKey: boolean; altKey: boolean }> = {}) =>
  mapKeyEvent({ key: k, ctrlKey: false, metaKey: false, altKey: false, ...mods });

describe("mapKeyEvent", () => {
  it("maps letters to uppercase, including accented ones", () => {
    expect(key("a")).toEqual({ type: "letter", letter: "A" });
    expect(key("Ç")).toEqual({ type: "letter", letter: "C" });
    expect(key("é")).toEqual({ type: "letter", letter: "E" });
  });

  it("maps control keys", () => {
    expect(key("Enter")).toEqual({ type: "enter" });
    expect(key("Backspace")).toEqual({ type: "backspace" });
    expect(key("Delete")).toEqual({ type: "delete" });
    expect(key("ArrowLeft")).toEqual({ type: "left" });
    expect(key("ArrowRight")).toEqual({ type: "right" });
    expect(key("Home")).toEqual({ type: "home" });
    expect(key("End")).toEqual({ type: "end" });
  });

  it("ignores browser shortcuts and unrelated keys", () => {
    expect(key("r", { ctrlKey: true })).toBeNull();
    expect(key("c", { metaKey: true })).toBeNull();
    expect(key("a", { altKey: true })).toBeNull();
    expect(key("Tab")).toBeNull();
    expect(key("F5")).toBeNull();
    expect(key("1")).toBeNull();
  });
});
