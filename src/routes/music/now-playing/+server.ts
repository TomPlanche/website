/**
 * @file src/routes/music/now-playing/+server.ts
 * @description +server
 * @author Tom Planche
 */


import {getRecentTracksSchema, type TGetRecentTracks} from "$lib/types/";
import axios, {type AxiosResponse} from "axios";
import {LASTFM_API_KEY} from "$env/static/private";
import {error, json, type RequestHandler} from "@sveltejs/kit";

const baseOptions = {
  page: 1,
  limit: 1000,
}

export const GET: RequestHandler = async () => {
  const response: AxiosResponse<TGetRecentTracks> = await axios.get("http://ws.audioscrobbler.com/2.0/", {
    params: {
      ...baseOptions,
      api_key: LASTFM_API_KEY,
      format: "json",
      user: "Tom_planche",
      method: "user.getRecentTracks",
      limit: 1,
    },
  });

  if (response.status !== 200) {
    throw error(response.status, response.statusText);
  }

  const {
    recenttracks: {track},
  } = getRecentTracksSchema.parse(response.data);

  return json(track[0]);
}

/**
 * End of file src/routes/music/now-playing/+server.ts
 */