import type { PublicGame } from "@/features/game/contract";

export function nextActionLabel(game: PublicGame) {
  if (game.mode !== "campaign") return "Novo jogo";
  return game.status === "won" ? "Próxima etapa" : "Nova campanha";
}
