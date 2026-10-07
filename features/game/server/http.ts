import { cookies } from "next/headers";
import { GAME_ERROR_MESSAGES } from "@/features/game/engine/errors";
import type { ApiError, ApiErrorCode, PublicGame } from "@/features/game/contract";
import type { GameState } from "./state";
import { openState, sealState } from "./token";

const COOKIE_NAME = "it_state";
const ONE_YEAR = 60 * 60 * 24 * 365;
const NO_STORE = { "Cache-Control": "no-store" };

const MESSAGES: Record<ApiErrorCode, string> = {
  ...GAME_ERROR_MESSAGES,
  BAD_REQUEST: "Requisição inválida",
  INTERNAL: "Algo deu errado, tente novamente",
};

export function getSecret(): string {
  const secret = process.env.GAME_SECRET;
  if (secret) return secret;
  if (process.env.NODE_ENV === "production") throw new Error("GAME_SECRET is not set");
  return "insecure-development-secret";
}

export function errorStatus(code: ApiErrorCode): number {
  switch (code) {
    case "BAD_REQUEST":
      return 400;
    case "GAME_IN_PROGRESS":
    case "GAME_OVER":
      return 409;
    case "INTERNAL":
      return 500;
    default:
      return 422;
  }
}

export function isTrustedJsonRequest(request: Request): boolean {
  const site = request.headers.get("sec-fetch-site");
  if (site && site !== "same-origin" && site !== "none") return false;
  return (request.headers.get("content-type") ?? "").toLowerCase().startsWith("application/json");
}

export function errorResponse(code: ApiErrorCode): Response {
  const body: ApiError = { error: { code, message: MESSAGES[code] } };
  return Response.json(body, { status: errorStatus(code), headers: NO_STORE });
}

export const gameResponse = (game: PublicGame) => Response.json(game, { headers: NO_STORE });

export async function readState(): Promise<GameState> {
  const store = await cookies();
  return openState(store.get(COOKIE_NAME)?.value, getSecret());
}

export async function writeState(state: GameState): Promise<void> {
  const store = await cookies();
  store.set(COOKIE_NAME, await sealState(state, getSecret()), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: ONE_YEAR,
  });
}

export async function withErrorHandling(handler: () => Promise<Response>): Promise<Response> {
  try {
    return await handler();
  } catch (error) {
    console.error(error);
    return errorResponse("INTERNAL");
  }
}
