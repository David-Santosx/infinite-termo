import type { ApiError, PublicGame } from "@/features/game/contract";
import type { PlayMode } from "@/features/game/engine/types";

export type ApiResult = { ok: true; game: PublicGame } | { ok: false; code: string; message: string };

async function request(input: string, init?: RequestInit): Promise<ApiResult> {
  try {
    const res = await fetch(input, { cache: "no-store", ...init });
    const body = await res.json();
    if (!res.ok) {
      const { error } = body as ApiError;
      return { ok: false, code: error.code, message: error.message };
    }
    return { ok: true, game: body as PublicGame };
  } catch {
    return { ok: false, code: "NETWORK", message: "Sem conexão com o servidor" };
  }
}

const post = (path: string, body: unknown) =>
  request(path, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });

export const fetchGame = (mode: PlayMode) => request(`/api/game?mode=${mode}`);
export const postGuess = (mode: PlayMode, guess: string) => post("/api/game/guess", { mode, guess });
export const postNewGame = (mode: PlayMode) => post("/api/game/new", { mode });
