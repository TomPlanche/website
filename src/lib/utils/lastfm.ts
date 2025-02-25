/**
 * @file src/lib/utils/lastfm.ts
 * @description lastfm
 * @author Tom Planche
 */
import axios, {type AxiosResponse} from "axios";
import {getRecentTracksSchema, type TGetRecentTracks} from "$lib/types";
import {error, json} from "@sveltejs/kit";
import type {TRecentTrack} from "$lib/types/lastfm";

type TMethod = "user.getRecentTracks";

const baseOptions = {
  page: 1,
  limit: 1000,
}

const fetchLastFM = async (
  method: TMethod,
  api_key: string,
  params: Record<string, string | number> = {}
) => {
  return await axios.get("http://ws.audioscrobbler.com/2.0/", {
    params: {
      ...baseOptions,
      ...params,
      api_key,
      format: "json",
      user: "Tom_planche",
      method,
      limit: Math.min(+params.limit || 1, 1000),
    }
  });
}

export const getRecentTracks = async (limit: number, api_key: string): Promise<TRecentTrack[]> => {
  if (limit < 1) {
    throw error(400, "Limit must be greater than 0");
  }

  const response: AxiosResponse<TGetRecentTracks> = await fetchLastFM("user.getRecentTracks", api_key, {limit});

  if (response.status !== 200) {
    throw error(response.status, response.statusText);
  }

  const {
    recenttracks: {track},
  } = getRecentTracksSchema.parse(response.data);

  return track;
}

/**
 * End of file src/lib/utils/lastfm.ts
 */