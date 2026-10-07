import { WORD_LENGTH } from "@/features/game/engine/modes";

export interface InputState {
  letters: string[];
  cursor: number;
}

export type InputAction =
  | { type: "letter"; letter: string }
  | { type: "backspace" }
  | { type: "delete" }
  | { type: "left" }
  | { type: "right" }
  | { type: "home" }
  | { type: "end" }
  | { type: "select"; cursor: number }
  | { type: "clear" };

const LAST = WORD_LENGTH - 1;
const clamp = (n: number) => Math.min(Math.max(n, 0), LAST);
const withLetter = (letters: string[], index: number, value: string) =>
  letters.map((l, i) => (i === index ? value : l));

export const emptyInput = (): InputState => ({ letters: Array(WORD_LENGTH).fill(""), cursor: 0 });

export const inputWord = (state: InputState) => state.letters.join("");

export function inputReducer(state: InputState, action: InputAction): InputState {
  const { letters, cursor } = state;
  switch (action.type) {
    case "letter":
      return { letters: withLetter(letters, cursor, action.letter), cursor: clamp(cursor + 1) };
    case "backspace":
      if (letters[cursor]) return { letters: withLetter(letters, cursor, ""), cursor };
      if (cursor === 0) return state;
      return { letters: withLetter(letters, cursor - 1, ""), cursor: cursor - 1 };
    case "delete":
      return { letters: withLetter(letters, cursor, ""), cursor };
    case "left":
      return { ...state, cursor: clamp(cursor - 1) };
    case "right":
      return { ...state, cursor: clamp(cursor + 1) };
    case "home":
      return { ...state, cursor: 0 };
    case "end":
      return { ...state, cursor: LAST };
    case "select":
      return action.cursor >= 0 && action.cursor <= LAST ? { ...state, cursor: action.cursor } : state;
    case "clear":
      return emptyInput();
  }
}
