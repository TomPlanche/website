import { type AxiosResponse } from "axios";
import { PUBLIC_API_ENDPOINT } from "$env/static/public";
import { error } from "@sveltejs/kit";
import type { GetStickersResponse, Sticker } from "$lib/types";
import { API_KEY } from "$env/static/private";
import { createAuthenticatedAxios } from "$lib/utils/http";

const authenticatedAxios = createAuthenticatedAxios(API_KEY);

export const getAllStickers = async (): Promise<Sticker[]> => {
  const response: AxiosResponse<GetStickersResponse> =
    await authenticatedAxios.get<GetStickersResponse>(
      `${PUBLIC_API_ENDPOINT}/stickers`,
    );

  if (response.status !== 200) {
    throw error(response.status, response.statusText);
  }

  return response.data.data.stickers;
};
