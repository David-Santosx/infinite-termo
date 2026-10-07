import { z } from "zod";
import { PLAY_MODES } from "@/features/game/engine/modes";
import {
  errorResponse,
  gameResponse,
  isTrustedJsonRequest,
  readState, withErrorHandling,
  writeState,
} from "@/features/game/server/http";
import { startNewGame } from "@/features/game/server/service";

const bodySchema = z.object({ mode: z.enum(PLAY_MODES) });

export function POST(request: Request) {
  return withErrorHandling(async () => {
    if (!isTrustedJsonRequest(request)) return errorResponse("BAD_REQUEST");

    const body = bodySchema.safeParse(await request.json().catch(() => null));
    if (!body.success) return errorResponse("BAD_REQUEST");

    const result = startNewGame(await readState(), body.data.mode);
    if (!result.ok) return errorResponse(result.error);

    await writeState(result.state);
    return gameResponse(result.game);
  });
}
