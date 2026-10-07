import { describe, expect, it } from "vitest";
import { errorResponse, errorStatus } from "./http";

describe("http", () => {
  it("maps error codes to statuses", () => {
    expect(errorStatus("BAD_REQUEST")).toBe(400);
    expect(errorStatus("NOT_IN_DICTIONARY")).toBe(422);
    expect(errorStatus("ALREADY_GUESSED")).toBe(422);
    expect(errorStatus("INVALID_LENGTH")).toBe(422);
    expect(errorStatus("GAME_IN_PROGRESS")).toBe(409);
    expect(errorStatus("GAME_OVER")).toBe(409);
    expect(errorStatus("INTERNAL")).toBe(500);
  });

  it("builds an ApiError body in Portuguese", async () => {
    const res = errorResponse("NOT_IN_DICTIONARY");
    expect(res.status).toBe(422);
    expect(await res.json()).toEqual({
      error: { code: "NOT_IN_DICTIONARY", message: "Essa palavra não é aceita" },
    });
  });
});
