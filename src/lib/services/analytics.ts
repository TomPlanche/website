import { PUBLIC_API_ENDPOINT } from "$env/static/public";
import type { TGetSourcesResponse, TLogSourceResponse } from "$lib/types/";
import type { TBackendResponse } from "$lib/types/back";
import axios, { type AxiosResponse } from "axios";

/**
 * Logs the source to the API.
 *
 * @param source {string} - The source to log.
 * @param apiKey {string} - The API key for authentication.
 *
 * @return {Promise<TLogSourceResponse>} - A promise that resolves to an object containing the logged source and its count.
 */
export const logSource = async (
  source: string,
  apiKey: string,
): Promise<TLogSourceResponse> => {
  const response: AxiosResponse<TBackendResponse<TLogSourceResponse>> =
    await axios.post(
      `${PUBLIC_API_ENDPOINT}/api/source`,
      { source },
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
      },
    );

  if (response.status !== 200 || !response.data.success) {
    console.error("Failed to log source:", response.data);

    throw new Error("Failed to log source");
  }

  return response.data.data;
};

/**
 * Fetches the sources from the API.
 *
 * @param apiKey {string} - The API key for authentication.
 *
 * @return {Promise<Record<string, number>>} - A promise that resolves to an object containing sources and their counts.
 */
export const getSources = async (
  apiKey: string,
): Promise<Record<string, number>> => {
  const response: AxiosResponse<TBackendResponse<TGetSourcesResponse>> =
    await axios.get(`${PUBLIC_API_ENDPOINT}/api/source`, {
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
    });

  if (response.status !== 200 || !response.data.success) {
    console.error("Failed to fetch sources:", response.data);
    return {};
  }

  return response.data.data.sources;
};
