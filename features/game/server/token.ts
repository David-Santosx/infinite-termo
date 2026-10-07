import { EncryptJWT, jwtDecrypt } from "jose";
import { emptyState, gameStateSchema, type GameState } from "./state";

async function deriveKey(secret: string): Promise<Uint8Array> {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(secret));
  return new Uint8Array(digest);
}

export async function sealState(state: GameState, secret: string): Promise<string> {
  return new EncryptJWT({ state })
    .setProtectedHeader({ alg: "dir", enc: "A256GCM" })
    .setIssuedAt()
    .encrypt(await deriveKey(secret));
}

export async function openState(token: string | undefined, secret: string): Promise<GameState> {
  if (!token) return emptyState();
  try {
    const { payload } = await jwtDecrypt(token, await deriveKey(secret), {
      keyManagementAlgorithms: ["dir"],
      contentEncryptionAlgorithms: ["A256GCM"],
    });
    const parsed = gameStateSchema.safeParse(payload.state);
    return parsed.success ? (parsed.data as GameState) : emptyState();
  } catch {
    return emptyState();
  }
}
