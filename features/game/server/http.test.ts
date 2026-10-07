import { describe, expect, it } from "vitest";
import { errorResponse, errorStatus, isTrustedJsonRequest } from "./http";

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

  describe("isTrustedJsonRequest", () => {
    const req = (headers: Record<string, string>) => new Request("http://localhost/api", { method: "POST", headers });

    it("accepts JSON requests", () => {
      expect(isTrustedJsonRequest(req({ "content-type": "application/json" }))).toBe(true);
      expect(isTrustedJsonRequest(req({ "content-type": "application/json; charset=utf-8" }))).toBe(true);
    });

    it("rejects other content types", () => {
      expect(isTrustedJsonRequest(req({ "content-type": "text/plain" }))).toBe(false);
      expect(isTrustedJsonRequest(req({}))).toBe(false);
    });

    it("rejects cross-site fetches", () => {
      const json = { "content-type": "application/json" };
      expect(isTrustedJsonRequest(req({ ...json, "sec-fetch-site": "cross-site" }))).toBe(false);
      expect(isTrustedJsonRequest(req({ ...json, "sec-fetch-site": "same-site" }))).toBe(false);
      expect(isTrustedJsonRequest(req({ ...json, "sec-fetch-site": "same-origin" }))).toBe(true);
      expect(isTrustedJsonRequest(req({ ...json, "sec-fetch-site": "none" }))).toBe(true);
    });
  });
});
