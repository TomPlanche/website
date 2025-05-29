import { PUBLIC_API_ENDPOINT } from "$env/static/public";
import { BackendSongSchema, type TBackendSong } from "$lib/types/lastfm";
import { error } from "@sveltejs/kit";
/**
 * @file src/lib/utils/lastfm.ts
 * @description lastfm
 * @author Tom Planche
 */
import axios, { type AxiosResponse } from "axios";

export const getRecentTracks = async (): Promise<TBackendSong[]> => {
  const response: AxiosResponse<TBackendSong[]> = await axios.get<
    TBackendSong[]
  >(`${PUBLIC_API_ENDPOINT}/api/static/recent_play_counts.json`);

  if (response.status !== 200) {
    throw error(response.status, response.statusText);
  }

  return response.data.map((song) => BackendSongSchema.parse(song));
};

export const getCurrentTrack = async (): Promise<TBackendSong> => {
  const response: AxiosResponse<TBackendSong[]> = await axios.get<
    TBackendSong[]
  >(`${PUBLIC_API_ENDPOINT}/api/static/currently_listening.json`);

  if (response.status !== 200) {
    throw error(response.status, response.statusText);
  }

  return BackendSongSchema.parse(response.data[0]);
};

/**
 * End of file src/lib/utils/lastfm.ts
 */
