import { error } from "@sveltejs/kit";
import { BackendSongSchema, type TBackendSong } from "$lib/types/lastfm";
import { apiGet } from "$lib/utils/api";

export const getRecentTracks = async (): Promise<TBackendSong[]> => {
  try {
    const response = await apiGet<TBackendSong[]>(
      "/static/recent_play_counts.json",
    );

    if (response.status !== 200) {
      throw error(response.status, response.statusText);
    }

    return response.data.map((song) => BackendSongSchema.parse(song));
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "Unknown error";
    throw error(500, message);
  }
};

export const getCurrentTrack = async (): Promise<TBackendSong> => {
  try {
    const response = await apiGet<TBackendSong[]>(
      "/static/currently_listening.json",
    );

    if (response.status !== 200) {
      throw error(response.status, response.statusText);
    }

    return BackendSongSchema.parse(response.data[0]);
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "Unknown error";
    throw error(500, message);
  }
};
