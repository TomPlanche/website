import { getRecentTracks } from "$lib/utils/lastfm";
/**
 * @file src/routes/api/music/+server.ts
 * @description +server
 * @author Tom Planche
 */
import { type RequestHandler, error, json } from "@sveltejs/kit";

export const GET: RequestHandler = async () => {
  try {
    const songs = await getRecentTracks();

    return json(songs);
  } catch (e: unknown) {
    return error(500, <App.Error>e);
  }
};

/**
 * End of file src/routes/api/music/+server.ts
 */
