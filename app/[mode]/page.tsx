import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { GameView } from "@/features/game/components/game-view";
import { GAME_MODES, MODE_LABELS, isGameMode } from "@/features/game/engine/modes";

export const dynamicParams = false;

export function generateStaticParams() {
  return GAME_MODES.map((mode) => ({ mode }));
}

type Props = { params: Promise<{ mode: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { mode } = await params;
  return isGameMode(mode) ? { title: MODE_LABELS[mode] } : {};
}

export default async function ModePage({ params }: Props) {
  const { mode } = await params;
  if (!isGameMode(mode)) notFound();
  return <GameView key={mode} mode={mode} />;
}
