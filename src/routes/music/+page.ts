/**
 * @file src/routes/music/+page.ts
 * @description +page
 * @author Tom Planche
 */

import type {PageLoad} from "./$types";
import {env} from '$env/dynamic/public';
import axios from "axios";
import {CurrentlyPlayedSong} from "$lib/types/song";
import {songsStore} from "$lib/stores/songStore";

export const load: PageLoad = async ({fetch}) => {
  try {
    const songs = await axios.get(`${env.PUBLIC_API_ENDPOINT}/static/recent_play_counts.json`);

    if (songs.status === 200) {
      songsStore.set(songs.data.map((song) => CurrentlyPlayedSong.parse(song)));
    }
  } catch (e) {
    console.error(e);

    songsStore.set([]);
  }
}


/**
 * End of file src/routes/music/+page.ts
 */