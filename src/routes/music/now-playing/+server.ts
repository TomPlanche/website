/**
 * @file src/routes/music/now-playing/+server.ts
 * @description +server
 * @author Tom Planche
 */
import {error, json, type RequestHandler} from "@sveltejs/kit";
import {getCurrentTrack} from "$lib/utils/lastfm";

export const GET: RequestHandler = async () => {
  try {
    const song = await getCurrentTrack();

    return json(song);
  } catch (e: unknown) {
    return error(500, <App.Error>e)
  }


}

/**
 * End of file src/routes/music/now-playing/+server.ts
 */