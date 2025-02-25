/**
 * @file src/routes/music/now-playing/+server.ts
 * @description +server
 * @author Tom Planche
 */
import {LASTFM_API_KEY} from "$env/static/private";
import {error, json, type RequestHandler} from "@sveltejs/kit";
import {getRecentTracks} from "$lib/utils/lastfm";

export const GET: RequestHandler = async () => {
  try {
    const songs = await getRecentTracks(1, LASTFM_API_KEY);

    return json(songs[0]);
  } catch (e: unknown) {
    return error(500, <App.Error>e)
  }


}

/**
 * End of file src/routes/music/now-playing/+server.ts
 */