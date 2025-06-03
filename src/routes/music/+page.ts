import { songsStore } from "$lib/stores/songStore";
import { BackendSongSchema, type TBackendSong } from "$lib/types/lastfm";
import type { PageLoad } from "./$types";

export const load: PageLoad = async ({ fetch }) => {
  try {
    const songs = await fetch("/api-front/music", {
      method: "GET",
    }).then(async (res) => (await res.json()) as TBackendSong[]);

    console.log(`Fetched ${songs.length} songs from the backend.`);

    songsStore.set(songs.map((song) => BackendSongSchema.parse(song)));
  } catch (e) {
    console.error(e);

    songsStore.set([]);
  }
};
