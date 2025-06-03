import { getCurrentTrack } from "$lib/utils/lastfm";
import { type RequestHandler, error, json } from "@sveltejs/kit";

export const GET: RequestHandler = async () => {
  try {
    const song = await getCurrentTrack();

    return json(song);
  } catch (e: unknown) {
    return error(500, <App.Error>e);
  }
};
