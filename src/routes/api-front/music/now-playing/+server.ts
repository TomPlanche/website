import { error, json, type RequestHandler } from "@sveltejs/kit";
import { getCurrentTrack } from "$lib/utils/lastfm";

export const GET: RequestHandler = async () => {
  try {
    const song = await getCurrentTrack();

    return json(song);
  } catch (e: unknown) {
    if (e && typeof e === "object" && "status" in e && "body" in e) {
      throw e;
    }

    const message =
      e instanceof Error ? e.message : "Failed to fetch current track";
    return error(500, message);
  }
};
