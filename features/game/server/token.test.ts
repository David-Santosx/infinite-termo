import { describe, expect, it } from "vitest";
import { createGame } from "@/features/game/engine/game";
import { emptyState } from "./state";
import { openState, sealState } from "./token";

describe("token", () => {
  const state = { ...emptyState(), games: { termo: createGame("g1", "termo", ["termo"]) } };

  it("round-trips state", async () => {
    const token = await sealState(state, "secret");
    expect(token).not.toContain("termo");
    expect(await openState(token, "secret")).toEqual(state);
  });

  it("returns empty state for missing, tampered or foreign tokens", async () => {
    const token = await sealState(state, "secret");
    expect(await openState(undefined, "secret")).toEqual(emptyState());
    expect(await openState(token.slice(0, -4) + "AAAA", "secret")).toEqual(emptyState());
    expect(await openState(token, "other-secret")).toEqual(emptyState());
    expect(await openState("garbage", "secret")).toEqual(emptyState());
  });

  it("returns empty state for payloads with an unknown shape", async () => {
    const token = await sealState({ v: 2 } as never, "secret");
    expect(await openState(token, "secret")).toEqual(emptyState());
  });
});
