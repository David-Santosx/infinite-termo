import type { CSSProperties } from "react";
import type { TileStatus } from "@/features/game/engine/types";
import { cn } from "@/lib/utils";

export interface TileProps {
  letter: string;
  status?: TileStatus;
  index: number;
  variant: "empty" | "input" | "revealed" | "static";
  selected?: boolean;
  bounce?: boolean;
  onSelect?: () => void;
  label: string;
}

const VARIANT_CLASS = {
  empty: "border-tile-border bg-tile-empty",
  input: "border-tile-border-filled bg-tile-empty",
  revealed: "animate-tile-flip text-tile-text",
  static: "border-transparent bg-[var(--tile-bg)] text-tile-text",
} as const;

export function Tile({ letter, status, index, variant, selected, bounce, onSelect, label }: TileProps) {
  const colored = variant === "revealed" || variant === "static";
  const style = {
    fontSize: "var(--tile-font, 1.75rem)",
    ...(colored && status ? { "--tile-bg": `var(--tile-${status})` } : {}),
    "--tile-index": index,
  } as CSSProperties;

  return (
    <div
      role={onSelect ? "button" : "img"}
      tabIndex={onSelect ? 0 : undefined}
      aria-label={label}
      aria-pressed={onSelect ? selected : undefined}
      onClick={onSelect}
      onKeyDown={
        onSelect
          ? (e) => {
              if (e.key === " " || (e.key === "Enter" && !e.defaultPrevented)) {
                e.preventDefault();
                e.stopPropagation();
                onSelect();
              }
            }
          : undefined
      }
      style={style}
      className={cn(
        "grid aspect-square w-full select-none place-items-center rounded-md border-2 font-display font-semibold uppercase leading-none",
        VARIANT_CLASS[variant],
        selected && "border-b-[6px] border-b-foreground/80",
        bounce && "animate-tile-bounce",
        onSelect && "cursor-pointer",
      )}
    >
      <span key={letter} className={cn(variant === "input" && letter && "animate-tile-pop")} aria-hidden>
        {letter}
      </span>
    </div>
  );
}
