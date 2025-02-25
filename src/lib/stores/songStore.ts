/**
 * @file src/lib/stores/songStore.ts
 * @description songStore
 * @author Tom Planche
 */
import {writable} from "svelte/store";
import type {TRecentTrack, TRecentTrackWithCount} from "$lib/types/lastfm";

const songStore = () => {
  // Initialize with default theme '1'
  const {subscribe, set} = writable<TRecentTrackWithCount[]>([]);

  return {
    subscribe,
    set: (value: TRecentTrack[]) => {
      // Filter out songs without an image URL or with default image
      const filteredSongs = value.filter(song => {
        return song.image[song.image.length - 1]["#text"]
          && song.image[song.image.length - 1]["#text"] !== "https://lastfm.freetls.fastly.net/i/u/300x300/2a96cbd8b46e442fc41c2b86b821562f.png"
      });

      // Create a map to count occurrences of each song
      const songMap = new Map<string, TRecentTrackWithCount>();

      for (const song of filteredSongs) {
        const key = `${song.name}-${song.artist["#text"]}`;

        if (songMap.has(key)) {
          const existing = songMap.get(key);

          if (!existing) {
            continue;
          }

          existing.count += 1;
        } else {
          songMap.set(key, {
            ...song,
            count: 1
          });
        }
      }

      // Convert map values to array
      const uniqueSongsWithCount = Array.from(songMap.values());

      set(uniqueSongsWithCount);
    },
  };
}

export const songsStore = songStore();

/**
 * End of file src/lib/stores/songStore.ts
 */