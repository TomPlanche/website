/**
 * @file src/routes/music/+server.ts
 * @description +server
 * @author Tom Planche
 */
import {error, json, type RequestHandler} from "@sveltejs/kit";
import {getRecentTracks} from "$lib/utils/lastfm";

export const GET: RequestHandler = async () => {

  try {
    const songs = await getRecentTracks();

    return json(songs);
  } catch (e: unknown) {
    return error(500, <App.Error>e)
  }

}

/**
 * End of file src/routes/music/+server.ts
 */