/**
 * @file src/routes/music/+page.ts
 * @description +page
 * @author Tom Planche
 */

import type {PageLoad} from "./$types";
import {PUBLIC_API_ENDPOINT} from '$env/static/public';
import axios, {type AxiosResponse} from "axios";
import {CurrentlyPlayedSong, type TCurrentlyPlayedSong} from "$lib/types/song";
import {songsStore} from "$lib/stores/songStore";

export const load: PageLoad = async () => {
  try {
    const songs: AxiosResponse<TCurrentlyPlayedSong[]> = await axios.get(`${PUBLIC_API_ENDPOINT}/static/recent_play_counts.json`);

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