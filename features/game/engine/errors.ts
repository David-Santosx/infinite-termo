export type GameErrorCode =
  "INVALID_LENGTH" | "NOT_IN_DICTIONARY" | "ALREADY_GUESSED" | "GAME_OVER" | "GAME_IN_PROGRESS";

export const GAME_ERROR_MESSAGES: Record<GameErrorCode, string> = {
  INVALID_LENGTH: "Só palavras com 5 letras",
  NOT_IN_DICTIONARY: "Essa palavra não é aceita",
  ALREADY_GUESSED: "Você já tentou essa palavra",
  GAME_OVER: "Essa partida já terminou",
  GAME_IN_PROGRESS: "Termine a partida atual primeiro",
};
