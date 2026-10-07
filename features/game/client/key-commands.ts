import { normalize } from "@/features/game/engine/normalize";
import type { InputAction } from "./input";

export type KeyCommand = Exclude<InputAction, { type: "select" } | { type: "clear" }> | { type: "enter" };

const NAMED: Record<string, KeyCommand> = {
  Enter: { type: "enter" },
  Backspace: { type: "backspace" },
  Delete: { type: "delete" },
  ArrowLeft: { type: "left" },
  ArrowRight: { type: "right" },
  Home: { type: "home" },
  End: { type: "end" },
};

export function mapKeyEvent(e: { key: string; ctrlKey: boolean; metaKey: boolean; altKey: boolean }): KeyCommand | null {
  if (e.ctrlKey || e.metaKey || e.altKey) return null;
  if (e.key in NAMED) return NAMED[e.key];
  if (e.key.length !== 1) return null;
  const base = normalize(e.key);
  return /^[a-z]$/.test(base) ? { type: "letter", letter: base.toUpperCase() } : null;
}
