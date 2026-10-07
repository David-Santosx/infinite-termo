import { isPlayMode } from "@/features/game/engine/modes";
import { errorResponse, gameResponse, readState, withErrorHandling, writeState } from "@/features/game/server/http";
import { getGame } from "@/features/game/server/service";

export function GET(request: Request) {
  return withErrorHandling(async () => {
    const mode = new URL(request.url).searchParams.get("mode");
    if (!isPlayMode(mode)) return errorResponse("BAD_REQUEST");

    const current = await readState();
    const { state, game } = getGame(current, mode);
    if (state !== current) await writeState(state);
    return gameResponse(game);
  });
}
