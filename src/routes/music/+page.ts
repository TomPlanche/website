/**
 * @file src/routes/music/+page.ts
 * @description +page
 * @author Tom Planche
 */

import type {PageLoad} from "./$types";
import {songsStore} from "$lib/stores/songStore";
import {RecentTrackSchema, type TRecentTrack, type TRecentTrackWithCount} from "$lib/types/lastfm";

export const load: PageLoad = async ({fetch}) => {
  try {
    const songs = await fetch("/api/music", {
      method: "GET",
    }).then(async (res) => await res.json() as TRecentTrack[]);

    songsStore.set(songs.map((song) => RecentTrackSchema.parse(song)));
  } catch (e) {
    console.error(e);

    songsStore.set([]);
  }
}


/**
 * End of file src/routes/music/+page.ts
 */