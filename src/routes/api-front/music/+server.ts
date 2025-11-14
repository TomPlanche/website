import { error, json, type RequestHandler } from "@sveltejs/kit";
import { getRecentTracks } from "$lib/utils/lastfm";

export const GET: RequestHandler = async () => {
  try {
    const songs = await getRecentTracks();

    return json(songs);
  } catch (e: unknown) {
    console.error("Error fetching recent tracks:", e);

    return error(500, <App.Error>e);
  }
};
