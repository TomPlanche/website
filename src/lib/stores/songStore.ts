/**
 * @file src/lib/stores/songStore.ts
 * @description songStore
 * @author Tom Planche
 */
import {writable} from "svelte/store";
import type {TBackendSong} from "$lib/types/lastfm";

const songStore = () => {
  // Initialize with default theme '1'
  const {subscribe, set} = writable<TBackendSong[]>([]);

  return {
    subscribe,
    set: (values: TBackendSong[]) => {
      // Filter out songs without an image URL or with default image
      // const filteredSongs = value.filter(song => {
      //   return song.image[song.image.length - 1]["#text"]
      //     && song.image[song.image.length - 1]["#text"] !== "https://lastfm.freetls.fastly.net/i/u/300x300/2a96cbd8b46e442fc41c2b86b821562f.png"
      // });

      set(values);
    },
  };
}

export const songsStore = songStore();

/**
 * End of file src/lib/stores/songStore.ts
 */