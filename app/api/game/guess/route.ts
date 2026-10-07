import { z } from "zod";
import { PLAY_MODES } from "@/features/game/engine/modes";
import { errorResponse, gameResponse, readState, withErrorHandling, writeState } from "@/features/game/server/http";
import { submitGuess } from "@/features/game/server/service";

const bodySchema = z.object({ mode: z.enum(PLAY_MODES), guess: z.string().min(1).max(16) });

export function POST(request: Request) {
  return withErrorHandling(async () => {
    const body = bodySchema.safeParse(await request.json().catch(() => null));
    if (!body.success) return errorResponse("BAD_REQUEST");

    const result = submitGuess(await readState(), body.data.mode, body.data.guess);
    if (!result.ok) return errorResponse(result.error);

    await writeState(result.state);
    return gameResponse(result.game);
  });
}
