/**
 * @file src/lib/stores/songStore.ts
 * @description songStore
 * @author Tom Planche
 */
import type {TCurrentlyPlayedSong} from "$lib/types/song";
import {writable} from "svelte/store";

const songStore = () => {
  // Initialize with default theme '1'
  const {subscribe, set} = writable<TCurrentlyPlayedSong[]>([]);

  return {
    subscribe,
    set: (value: TCurrentlyPlayedSong[]) => {
      // Filter out songs without an image URL
      const filteredSongs = value.filter(song => song.image_url);

      set(filteredSongs);
    },
  };
}

export const songsStore = songStore();

/**
 * End of file src/lib/stores/songStore.ts
 */